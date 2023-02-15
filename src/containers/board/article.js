import React, { Component } from 'react'
import Select from 'react-select'
import moment from 'moment'
import parse from 'html-react-parser'
import { Switch, NavLink, Popover, IconButton, Button, TextField, Typography, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core'
import { Pagination } from '@material-ui/lab'
import { Edit as EditIcon, Delete as DeleteIcon, ExpandMore as ExpandMoreIcon, MoreVert as MoreVertIcon, ThumbUp as ThumbUpIcon } from '@material-ui/icons'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { getPostDetail, newComment, editComment, delPost, delComment, delCitation, likePost, likeComment } from '../../actions/board'

// this page and its derivatives should be handled by Huang Fu
class ArticleBoard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      aid: props.match.params.aid,
      page: props.match.params.page || 1,
      unlock: false
    }

    setTimeout(() => {
      this.setState({ unlock: true })
    }, 300)
  }

  saveComment = async (comment) => {
    if (!Object.keys(this.props.auth.user.info).length) {
      if (window.confirm('Login First !'))
        this.props.history.push('/login')
    }
    else {
      await this.props.newComment(comment)
      setTimeout(() => {
        this.props.getPostDetail(this.state.aid)
      }, 300)
    }
  }

  editComment = async (comment) => {
    await this.props.editComment(comment)
    setTimeout(() => {
      this.props.getPostDetail(this.state.aid)
    }, 300)
  }

  handlePage = (e, page) => {
    
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let aid = prevState.aid
    let next_posts = nextProps.post !== undefined && nextProps.post !== null ? nextProps.post : [] 
    
    if (next_posts.length) {
      // document.title = nextProps.post[0].postTitle
    }
    
    if (nextProps.match.params.aid !== aid) {
      aid = nextProps.match.params.aid
      nextProps.getPostDetail(aid)

      return {
        aid: aid,
        unlock: false
      }
    }

    return null
  }

  likePost = async (floor) => {
    if (!Object.keys(this.props.auth.user.info).length) {
      if (window.confirm('Login First !'))
        this.props.history.push('/login')
    }
    else {
      if (this.props.post[floor-1].likedUsers.indexOf(this.props.auth.user.info.userId) !== -1) {
        return
      }
      else {
        const info = {
          postId: this.props.post[0].postId,
          floor: floor,
          author: this.props.auth.user.info.userId
        }
        await this.props.likePost(info)
        setTimeout(() => {
          this.props.getPostDetail(this.state.aid)
        }, 300)
      }
    }
  }

  likeComment = async (comment_id, if_user_liked) => {
    if (!Object.keys(this.props.auth.user.info).length) {
      if (window.confirm('Login First !'))
        this.props.history.push('/login')
    }
    else {
      if (if_user_liked !== -1) {
        return
      }
      else {
        const info = {
          commentId: comment_id,
          author: this.props.auth.user.info.userId
        }
        await this.props.likeComment(info)
        setTimeout(() => {
          this.props.getPostDetail(this.state.aid)
        }, 300)
      }
    }
  }

  goVisitUser = (user_id) => {
    if (!Object.keys(this.props.auth.user.info).length) {
      if (window.confirm('Login First !'))
        this.props.history.push('/login')
    }
    else {
      this.props.history.push(`/board/personal/other/${user_id}`)
    }
  }

  goReply = () => {
    if (!Object.keys(this.props.auth.user.info).length) {
      if (window.confirm('Login First !'))
        this.props.history.push('/login')
    }
    else if (this.props.auth.user.info.cumulateGameSpecialty.map(g => {
      if (g.boardId === this.props.post[0].boardId && g.score >= 100)
        return true
      else
        return false
    }).some(e => e === true)) {
      this.props.history.push(`/board/post/reply/${this.state.aid}`)
    }
    else {
      alert('You have not enough specialty score !')
    }
  }

  goEditPost = (floor) => {
    this.props.history.push(`/board/post/edit/${this.state.aid}/${floor-1}`)
  }

  delPost = async (info, cite_info, delCite) => {
    await this.props.delPost(info)

    if (delCite) {
      for (let _id of cite_info) {
        const cite_id = {
          citationId: _id
        }
        await this.props.delCitation(cite_id)
      }
    }
      
    setTimeout(() => {
      this.props.getPostDetail(this.state.aid)
    }, 300)
  }

  delComment = async (info) => {
    await this.props.delComment(info)
    setTimeout(() => {
      this.props.getPostDetail(this.state.aid)
    }, 300)
  }

  componentDidMount() {
    // document.title = this.props.post.length ? this.props.post[0].postTitle : ''
    
    this.props.getPostDetail(this.state.aid)
  }

  render() {
    const data = this.props.post
    const page = this.state.page
    
    return (
      <div className="article-wrapper">
        <div id="goback-reply-btn">
          <Button variant="contained" color="primary" onClick={() => this.props.history.goBack()}><FormattedMessage id="back_to_posts" /></Button>
          <Button variant="contained" color="secondary" onClick={this.goReply}><FormattedMessage id="reply" /></Button>
        </div>

        {page === 1 && data.length && this.state.unlock ?
          <>
            <ArticleContent
              data={data[0]}
              type="樓主"
              ind={1}
              saveComment={this.saveComment}
              editComment={this.editComment}
              goEditPost={this.goEditPost}
              delPost={this.delPost}
              delComment={this.delComment}
              goVisitUser={this.goVisitUser}
              postInfo={this.props.post[0]}
              likePost={this.likePost}
              likeComment={this.likeComment}
              user_id={this.props.auth.user.info.userId}
              user_name={this.props.auth.user.info.name}
            />

            {data.slice(1, 10).map((reply, i) => (
              <ArticleContent
                data={reply}
                type="回覆"
                ind={i+2}
                key={reply.time}
                saveComment={this.saveComment}
                editComment={this.editComment}
                goEditPost={this.goEditPost}
                delPost={this.delPost}
                delComment={this.delComment}
                goVisitUser={this.goVisitUser}
                postInfo={this.props.post[0]}
                likePost={this.likePost}
                likeComment={this.likeComment}
                cites={data.map(each => each.citation !== null ? each.citation.filter(c => c.citedFloor === reply.floor).map(e => e.citationId) : [])}
                user_id={this.props.auth.user.info.userId}
                user_name={this.props.auth.user.info.name}
              />
            ))}
          </> : page > 1 && this.state.unlock ?
          <>
            {data.slice((page - 1)*10, page*10).map((reply, i) => (
              <ArticleContent
                data={reply}
                type="回覆"
                ind={(page-1)*10+i+1}
                key={reply.time}
                editComment={this.editComment}
                saveComment={this.saveComment}
                goEditPost={this.goEditPost}
                delPost={this.delPost}
                delComment={this.delComment}
                goVisitUser={this.goVisitUser}
                postInfo={this.props.post[0]}
                likePost={this.likePost}
                likeComment={this.likeComment}
                cites={data.map(each => each.citation !== null ? each.citation.filter(c => c.citedFloor === reply.floor).map(e => e.citationId) : [])}
                user_id={this.props.auth.user.info.userId}
                user_name={this.props.auth.user.info.name}
              />
            ))}
          </> :
          <div></div>
        }
        
        <div className="paginator-container">
          <Pagination count={parseInt(data.length / 11) + 1} color="primary" onChange={this.handlePage} />
        </div>
      </div>
    )
  }
}

class ArticleContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 'new',
      tag: { label: '', value: '' },
      filter_comment_tag: { label: '', value: '' },
      comment_tag_f: [
        { label: '全部', value: '' },
        { label: '閒聊', value: '閒聊' },
        { label: '校正', value: '校正' },
        { label: '問題', value: '問題' },
        { label: '樓主回答', value: '樓主回答' }
      ],
      comment_tag: [[
        { label: '閒聊', value: '閒聊' },
        { label: '校正', value: '校正' },
        { label: '問題', value: '問題' }
      ], [
        { label: '閒聊', value: '閒聊' },
        { label: '校正', value: '校正' },
        { label: '問題', value: '問題' },
        { label: '樓主回答', value: '樓主回答' }
      ]],
      comment_id: '',
      comment: '',
      prevKey: '',
      anchorEl: null,
      citations: [],
      expandIO: false,
      expand_all: []
    }
  }

  handleSubmit = async e => {
    if (e.keyCode === 13) {
      if (this.state.prevKey === 13) {
        if (this.state.comment === '' || this.state.tag.value === '') {
          return
        }
        const comment = {
          commentId: this.state.comment_id !== '' ? this.state.comment_id : '',
          postId: this.props.postInfo.postId,
          tag: this.state.tag.value,
          floor: this.props.ind,
          content: this.state.comment,
          author: this.props.user_id,
          authorName: this.props.user_name,
        }
        
        if (comment.tag === '' || comment.content.trim() === '')
          return

        if (this.state.status === 'new')
          this.props.saveComment(comment)
        else
          this.props.editComment(comment)
        
        this.setState({ status: 'new', tag: { label: '', value: '' }, comment: '', comment_id: '' })
      }
      else {
        this.setState({ prevKey: 13 })
      }
    }
    else {
      this.setState({ prevKey: -1 })
    }
  }

  handlePost = (type, data) => {
    if (type === 'edit') {
      this.props.goEditPost(data.floor)
    }
    else {
      const info = {
        postId: data.postId,
        floor: data.floor
      }

      if (data.floor === 1) {
        this.props.delPost(info, '', 0)
      }
      else {
        let recites = []
        for (let c = 0; c < this.props.cites.length; c++) {
          recites.push(...this.props.cites[c])
        }
        
        this.props.delPost(info, recites, 1)
      }
    }
  }

  handleComment = (type, data) => {
    if (type === 'edit') {
      this.setState({ status: 'edit', comment_id: data.commentId, comment: data.content, tag: { label: data.tag, value: data.tag } })
    }
    else {
      const info = {
        commentId: data.commentId
      }
      this.props.delComment(info)
    }
  }

  handleExpand = () => {
    const current_io = this.state.expandIO
    let expand = this.state.expand_all.map(e => {
      e = current_io ? false : true
      return e
    })
    this.setState({ expand_all: expand, expandIO: !current_io })
  }

  handleIndiviExpand = (e, exp, i) => {
    let expand = this.state.expand_all
    expand[i] = exp
    this.setState({ expand_all: expand })
  }

  componentDidMount() {
    if (this.props.data.content !== null && this.props.data.content !== undefined) {
      let expand = []
      for (let i = 0; i < this.props.data.content.length; i++) {
        expand.push(false)
      }
      this.setState({ expand_all: expand })
    }
  }

  render() {
    const data = this.props.data
    const comments = data.comments !== undefined && data.comments !== null ? data.comments : []
    const ind = this.props.ind
    const c_tag = this.state.filter_comment_tag.value
    const contents = data.content !== null ? data.content : []
    const citations = this.state.citations
    const show_comments = c_tag !== '' ? comments.filter(e => e.tag === this.state.filter_comment_tag.value) : comments

    let figs = document.getElementsByClassName('image')
    for (let fig of figs) {
      let imgs = fig.children
      for (let im of imgs) {
        im.setAttribute("sizes", "40vw")
        im.setAttribute("width", "110%")
      }
    }
    
    if (!contents.length)
      return (
        <div className="article-container">
          <div style={{ width: '100%', height: '50px', textAlign: 'center', lineHeight: '50px', fontSize: '20px' }}><b><FormattedMessage id="article_delete" /></b></div>
        </div>
      )

    if (contents[0].content === '此篇文章已被刪除。') {
      return (
        <div className="article-container">
          <div style={{ width: '100%', height: '50px', textAlign: 'center', lineHeight: '50px', fontSize: '20px' }}><b><FormattedMessage id="article_delete" /></b></div>
        </div>
      )
    }

    return (
      <div className="article-container">
        <div className="article-title">
          {ind === 1 ? data.postTitle : `RE : ${data.postTitle}`}

          <div className="switch-container">
            <span className="switch-prefix"><FormattedMessage id="open_blocks" /></span>
            <Switch
              checked={this.state.expandIO}
              onChange={this.handleExpand}
              color="primary"
              name="expand_all"
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </div>

          {data.authorInfo.userId === this.props.user_id ?
            <>
              <IconButton onClick={() => this.handlePost('edit', data)} className="post-edit" size="small">
                <EditIcon fontSize="inherit" />
              </IconButton>
              <IconButton onClick={() => this.handlePost('delete', data)} className="post-delete" size="small">
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </> : <></>
          }
        </div>
        <div className="article-author-time-container">
          <div>
            <span className="article-author-prefix">{ind === 1 ? '樓主' : `${ind}樓`}</span>
            <span className="article-author" onClick={() => this.props.goVisitUser(data.authorInfo.userId)}>{data.authorName}</span>
          </div>
          <span>{moment(data.time).format('YYYY-MM-DD HH:mm:ss')}</span>
        </div>

        <div className="article-content-container">
          {contents.map((e, i) => (
            <div className="accordion-container" key={e.subtitle + i}>
              <Accordion className="article-accordion" onChange={(event, exp) => this.handleIndiviExpand(event, exp, i)} expanded={this.state.expand_all.length === 0 ? false : this.state.expand_all[i]}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className="article-subtitle">{contents.length === 1 ? '文章內容' : e.subtitle}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography component={'span'}>
                    {e.content[0] !== '<' ? e.content.split('/n').map((line, li) => (<div key={li}>{line}</div>)) : parse(e.content)}
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <IconButton className="article-popover" onClick={e => this.setState({ anchorEl: e.currentTarget, citations: data.citation !== null ? [...new Set(data.citation.filter(e => e.blockId === i).map(e => e.citedFloor))] : [] })}>
                <MoreVertIcon />
              </IconButton>
            </div>
          ))}

          <Popover
            className="reference-popover"
            open={!!(this.state.anchorEl)}
            anchorEl={this.state.anchorEl}
            onClose={() => this.setState({ anchorEl: null })}
            anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
            transformOrigin={{ vertical: 'center', horizontal: 'left' }}>
            <div className="reference-container">
              <h4><b><FormattedMessage id="citation" /></b></h4>
              {citations.map((cit, citInd) => (
                <div key={citInd}>{cit} 樓</div>
              ))}
            </div>
          </Popover>

          <div className="article-actions">
            <div className="article-good-btn">
              <IconButton onClick={() => this.props.likePost(data.floor)}>
                <ThumbUpIcon />
              </IconButton>
              <span className="good-num">{data.likeNum}</span>
            </div>

            <div className="filter">
              <span className="filter-prefix"><FormattedMessage id="filter_comment" /></span>
              <Select
                value={this.state.filter_comment_tag}
                options={this.state.comment_tag_f}
                onChange={opt => this.setState({ filter_comment_tag: opt })}
                className="article-filter-comment-tag"
                menuPlacement="auto"
              />
            </div>
          </div>          
        </div>

        <div className="article-comment-container">
          {show_comments.map((e, i) => (
            <div className="article-comment" key={e.tag + i}>
              <div className="tag">【{e.tag}】</div>
              <div className="author">{e.authorName ? e.authorName : e.author}</div>
              <div className="content">{e.content}</div>
              
              <div className="time">{moment(e.time).format('YYYY-MM-DD HH:mm:ss')}</div>
              <IconButton className="thumbup" size="small" onClick={() => this.props.likeComment(e.commentId, e.likedUsers.indexOf(this.props.user_id))}>
                <ThumbUpIcon fontSize="inherit" />
              </IconButton>
              <div className="good-num">{e.likeNum}</div>
              {e.author === this.props.user_id ?
                <>
                  <IconButton onClick={() => this.handleComment('edit', e)} className="comment-edit" size="small">
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton onClick={() => this.handleComment('delete', e)} className="comment-delete" size="small">
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </> : <></>
              }
            </div>
          ))}
          <div className="article-comment save" key="input_comment">
            <Select
              value={this.state.tag}
              options={data.authorInfo.userId === this.props.user_id ? this.state.comment_tag[1] : this.state.comment_tag[0]}
              onChange={opt => this.setState({ tag: opt })}
              className="article-save-comment-tag"
              menuPlacement="auto"
            />
            <TextField onChange={e => this.setState({ comment: e.target.value })} onKeyUp={this.handleSubmit} value={this.state.comment} label={<FormattedMessage id="comment" />} size="small"  variant="outlined" className="article-save-comment" />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({ auth: state.auth, post: state.board.current_post, error: state.error })

export default connect(mapStateToProps, { getPostDetail, newComment, editComment, delPost, delComment, delCitation, likePost, likeComment })(withRouter(ArticleBoard))
