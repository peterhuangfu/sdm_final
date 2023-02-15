import React, { Component } from 'react'
import DiscussTable from '../../components/discussTable'
import { connect } from 'react-redux'
import { Pagination } from '@material-ui/lab'
import { withRouter } from 'react-router-dom'

import { getAllBoard } from '../../actions/board'

// this page and its derivatives should be handled by Huang Fu
class AllBoard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      board_type: props.match.params.type,
      page: props.match.params.page || 1,
      child_status: 'hot'
    }
  }

  childChangeStatus = (status) => {
    this.setState({ child_status: status })
  }

  goNewPage = (url) => {
    this.props.history.push(url)
  }

  handlePage = (e, page) => {
    this.setState({ page: page })
  }

  setDocTitle = (type) => {
    let title = type === 'rpg' ? '角色扮演' : type === 'action' ? '動作' : type === 'shoot' ? '射擊' :
                      type === 'sport' ? '運動' : type === 'race' ? '競速' : type === 'adventure' ? '冒險' :
                      type === 'strategy' ? '策略模擬' : type === 'puzzle' ? '益智' : type === 'others' ? '其他' : '新版申請'
    // document.title = title + '遊戲 討論區'
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let type = prevState.board_type
    if (nextProps.match.params.type !== type) {
      type = nextProps.match.params.type
      nextProps.getAllBoard(type)

      return {
        board_type: type
      }
    }

    return null
  }

  componentDidUpdate() {
    this.setDocTitle(this.state.board_type)
  }

  componentDidMount() {
    this.setDocTitle(this.state.board_type)
    this.props.getAllBoard(this.state.board_type)
  }

  render() {
    const boards = this.props.boards.slice((this.state.page - 1)*10, this.state.page*10)

    return (
      <>
        <div style={{ width: '100%', minHeight: '25px', zIndex: '99' }}></div>
        <DiscussTable goNewPage={this.goNewPage} board_type="all" data={boards} childChangeStatus={this.childChangeStatus} />
        <div className="paginator-container">
          <Pagination count={parseInt((boards.length - 1) / 10) + 1} color="primary" onChange={this.handlePage} />
        </div>
      </>
    )
  }
}

const mapStateToProps = state => ({ auth: state.auth, boards: state.board.all_boards, error: state.error })

export default connect(mapStateToProps, { getAllBoard })(withRouter(AllBoard))
