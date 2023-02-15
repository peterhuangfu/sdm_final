import React, { Component } from 'react'
import DiscussTable from '../../components/discussTable'
import { Button } from '@material-ui/core'
import { Pagination } from '@material-ui/lab'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { getBoardInfo, getAllPosts } from '../../actions/board'

// this page and its derivatives should be handled by Huang Fu
class SpecificBoard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      board_name: '',
      board_id: props.match.params.bid,
      page: 1,
      child_status: 'hot'
    }
  }

  childChangeStatus = (status) => {
    this.setState({ child_status: status })
  }

  goNewPage = (url) => {
    this.props.history.push(url)
  }

  addPost = () => {
    if (!Object.keys(this.props.auth.user.info).length) {
      if (window.confirm('Login First !'))
        this.props.history.push('/login')
    }
    else {
      this.props.history.push('/board/post/new_article')
    }
  }

  handlePage = (e, page) => {
    this.setState({ page: page })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let board_name = nextProps.board.boardName
    // document.title = board_name + ' 討論版'

    let id = prevState.board_id
    if (nextProps.match.params.bid !== id) {
      id = nextProps.match.params.bid
      nextProps.getBoardInfo(id)
      nextProps.GetAllPosts(id)
      
    }

    return {
      board_id: id,
      board_name: board_name
    }
  }

  componentDidMount() {
    // document.title = this.state.board_name + ' 討論版'

    this.props.getBoardInfo(this.state.board_id)
    this.props.getAllPosts(this.state.board_id)
  }

  render() {
    const board = this.props.board
    const posts = this.props.posts.length ? this.props.posts.slice((this.state.page - 1)*10, this.state.page*10) : []
    
    return (
      <>
        <div className="board-navbar">
          <div style={{ fontWeight: 'bold', fontSize: 28 }}>{board.boardName} <FormattedMessage id="board" /></div>
          <Button className="board-launch-btn" variant="contained" color="primary" onClick={this.addPost}><FormattedMessage id="add_post" /></Button>
        </div>
        <DiscussTable goNewPage={this.goNewPage} board_type="specific" data={posts} childChangeStatus={this.childChangeStatus} />
        <div className="paginator-container">
          <Pagination count={parseInt((posts.length - 1) / 10) + 1} color="primary" onChange={this.handlePage} />
        </div>
      </>
    )
  }
}

const mapStateToProps = state => ({ auth: state.auth, board: state.board.current_board.info, posts: state.board.current_board.posts, error: state.error })

export default connect(mapStateToProps, { getBoardInfo, getAllPosts })(withRouter(SpecificBoard))
