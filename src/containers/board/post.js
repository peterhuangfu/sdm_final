import React, { Component } from 'react'
import Select from 'react-select'
import { Button, IconButton, TextField } from '@material-ui/core'
import { Image as ImageIcon, AddCircleOutline as AddCircleOutlineIcon, Movie as MovieIcon, Delete as DeleteIcon, Send as SendIcon } from '@material-ui/icons'
import { withRouter } from 'react-router-dom'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { connect } from 'react-redux'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { FormattedMessage } from 'react-intl'

import '../../styles/post.css'

import { getPostDetail, newPost, newCitation, editPost } from '../../actions/board'

// this page and its derivatives should be handled by Huang Fu
class Post extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: props.match.params.post_type === undefined ? 'new_article' : props.match.params.post_type,
      aid: props.match.params.aid === undefined ? '-1' : props.match.params.aid,
      floor: props.match.params.post_type === 'edit' ? props.match.params.floor : -1,
      q: (props.match.params.post_type === 'reply' || props.match.params.post_type === 'edit') && props.post.length ? { label: props.post[0].postTag, value: props.post[0].postTag } : { label: '', value: '' },
      cite: [''],
      cite_floor: [-1],
      q_options: [
        { label: '問題', value: '問題' },
        { label: '心得', value: '心得' },
        { label: '攻略', value: '攻略' },
        { label: '討論', value: '討論' }
      ],
      citation_opts: props.match.params.post_type === 'reply' ? props.post.map((po, pi) => {
        const paras = po.content !== null ? po.content.map((e, i) => {
          return {
            label: `第${i+1}段落`,
            value: i,
            disable: false
          }
        }) : []
        return paras
      }) : [],
      citation_floor_opts: props.match.params.post_type === 'reply' ? props.post.map((e, i) => {
        return {
          label: `第${i+1}樓文章`,
          value: i+1
        }
      }) : [],
      title: props.match.params.post_type === 'edit' ? props.post[props.match.params.floor].postTitle : '',
      paragraphs: props.match.params.post_type === 'edit' ? props.post[props.match.params.floor].content.map((e, i) => {
        return {
          subtitle: e.subtitle,
          content: e.content
        }
      }) : 
      [{ subtitle: '', content: '' }],
    }
  }

  text = (type, pos, e) => {
    if (type === 'title') {
      const title = e.target.value
      this.setState({ title: title })
    }
    else if (type === 'subtitle') {
      let paras = this.state.paragraphs
      paras[pos].subtitle = e.target.value
      this.setState({ paragraphs: paras })
    }
    else {
      let paras = this.state.paragraphs
      paras[pos].content = e
      this.setState({ paragraphs: paras })
    }
  }

  handleSubmit = async () => {
    let post_id = this.state.type === 'new_article' ? '' : this.props.post[0].postId
    let floor = this.state.type === 'new_article' ? 1 : this.state.type === 'reply' ? Math.max(...this.props.post.map(e => e.floor)) + 1 : parseInt(this.state.floor) + 1
    let title = this.state.type === 'new_article' ? this.state.title : this.props.post[0].postTitle
    let content = this.state.paragraphs
    content = content.map((each, i) => {
      let con = {
        postId: post_id,
        floor: floor,
        blockId: i,
        subtitle: each.subtitle === '' ? 'no_use' : each.subtitle,
        content: each.content
      }

      return con
    })

    const check_content = content.filter(e => e.subtitle === 'no_use' || e.content.trim() === '')
    if (content.length > 1 && check_content.length) {
      return
    }

    const new_post = {
      postId: post_id,
      boardId: this.props.post.length ? this.props.post[0].boardId : this.props.board.boardId,
      childBoardId: 'cbd0003',
      postTag: this.state.q.value,
      postTitle: title,
      author: this.props.auth.user.info.userId,
      authorName: this.props.auth.user.info.name,
      content: content,
      floor: floor,
    }

    if (!new_post.boardId || new_post.postTag === '' || new_post.postTitle.trim() === '') {
      return
    }

    if (this.state.type === 'new_article') {
      await this.props.newPost(new_post)
      setTimeout(() => {
        this.props.history.goBack()
      }, 300)
    }
    else if (this.state.type === 'reply') {
      let cnt = 0
      let all_cites = []
      for (let cc = 0; cc < this.state.cite_floor.length; cc++) {
        if (this.state.cite_floor[cc] !== -1 && this.state.cite[cc] !== '')
          all_cites.push([this.state.cite_floor[cc].value, this.state.cite[cc].value])
      }

      await this.props.newPost(new_post)

      while (cnt < all_cites.length) {
        const citation = {
          citationId: '',
          postId: post_id,
          floor: all_cites[cnt][0],
          citedFloor: floor,
          blockId: all_cites[cnt][1]
        }
        
        await this.props.newCitation(citation)
        cnt += 1
      }
      
      setTimeout(() => {
        this.props.history.goBack()
      }, 300)
    }
    else if (this.state.type === 'edit') {
      await this.props.editPost(new_post)
      setTimeout(() => {
        this.props.history.goBack()
      }, 300)
    }
  }

  handleParagraph = (type, pos) => {
    let paras = this.state.paragraphs
    let cites = this.state.cite
    let cites_floor = this.state.cite_floor
    if (type === 'add') {
      paras = [...paras, { subtitle: '', content: '' }]
      cites = [...cites, '']
      cites_floor = [...cites_floor, -1]
    }
    else {
      paras.splice(pos, 1)
      cites.splice(pos, 1)
      cites_floor.splice(pos, 1)
    }
    this.setState({ paragraphs: paras, cite: cites, cite_floor: cites_floor })
  }

  handleSelectChange = (status, opt) => {
    this.setState({ q: opt })
  }

  handleCiteFloor = (opt, pos) => {
    let cite_floor = this.state.cite_floor
    cite_floor[pos] = opt
    this.setState({ cite_floor: cite_floor })
  }

  handleCite = (opt, pos) => {
    let cite = this.state.cite
    cite[pos] = opt

    let cite_content = this.props.post[this.state.cite_floor[pos].value-1].content[opt.value].content
    let res = `<p><i>引述 ${this.state.cite_floor[pos].value} 樓第 ${opt.value + 1} 段落原文</i></p>`
    let recolors = cite_content.split('<p>')
    
    for (let col of recolors) {
      if (col.indexOf('</p>') === -1)
        res += col + '<p><i>'
      else {
        let itos = col.split('</p>')
        res += itos[0] + '</i></p>' + itos[1]
      }
    }

    let paras = this.state.paragraphs
    paras[pos].content = res + paras[pos].content
    this.setState({ cite: cite, paragraphs: paras })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const type = nextProps.match.params.post_type
    if (type ==='reply' && !nextProps.post.length) {
      nextProps.getPostDetail(nextProps.match.params.aid)
    }

    return {
      type: type,
      aid: nextProps.match.params.aid
    }
  }

  componentDidMount() {
    if (this.state.post_type === 'reply') {
      this.props.getPostDetail(this.state.aid)
    }
    // document.title = this.state.type === 'new_article' ? '發表新文章' : `RE:【${this.props.post[0].postTag}】${this.props.post[0].postTitle}`
  }

  render() {
    const paras = this.state.paragraphs
    const current_post = this.props.post.length ? this.props.post[0] : {}
    const editorConfiguration = {
      cloudServices: {
        tokenUrl: 'https://80770.cke-cs.com/token/dev/364874da067773983bab51546a96ce8fb0168ebc8b42d9afac268ed40c48',
        uploadUrl: 'https://80770.cke-cs.com/easyimage/upload/'
      },
      placeholder: '文章內容'
    }
    
    return (
      <div className="post-wrapper">
        <div className="post-text-container">
          <div style={{ fontWeight: 'Bold', fontSize: 18 }}>{this.state.type === 'new_article' ? <FormattedMessage id="new_article" /> : `RE: ${current_post.postTitle}`}</div>
          <div className="post-basic-container">
            <Select
              value={this.state.q}
              options={this.state.q_options}
              onChange={opt => this.setState({ q: opt })}
              className="post-select-tag"
              menuPlacement="auto"
              placeholder={<span><FormattedMessage id="label" /></span>}
              isDisabled={this.state.type !== 'new_article'}
            />
            <Button variant="outlined" color="primary" onClick={() => this.handleParagraph('add', 0)}><FormattedMessage id="add_block" /></Button>
          </div>

          {this.state.type === 'new_article' ?
            <div className="post-title">
              <TextField onChange={e => this.text('title', 0, e)} label={<FormattedMessage id="title" />} size="small" variant="outlined" className="post-title" />
            </div> :
            <></>
          }

          <div className="post-content-container">
            {paras.length === 1 ?
              <>
                {this.state.type === 'reply' ?
                  <>
                  <Select
                    value={this.state.cite_floor[0]}
                    options={this.state.citation_floor_opts}
                    onChange={opt => this.handleCiteFloor(opt, 0)}
                    className="citation-tag"
                    menuPlacement="auto"
                    placeholder={<span><FormattedMessage id="cite_floor" /></span>}
                  />
                  <Select
                    value={this.state.cite[0]}
                    options={this.state.citation_opts[this.state.cite_floor[0] !== -1 ? this.state.cite_floor[0].value - 1 : -1]}
                    onChange={opt => this.handleCite(opt, 0)}
                    className="citation-tag second"
                    menuPlacement="auto"
                    placeholder={<span><FormattedMessage id="cite_block" /></span>}
                  /></> : <div></div>
                }

                <CKEditor
                  editor={ClassicEditor}
                  config={editorConfiguration}
                  data={paras[0].content}
                  className="post-content-editor"
                  onChange={(event, editor) => {
                    const data = editor.getData()
                    this.text('content', 0, data)
                  }}
                />
              </> :
              paras.map((each, i) => (
              <React.Fragment key={i}>
                <hr />
                <TextField onChange={e => this.text('subtitle', i, e)} value={each.subtitle} label={<FormattedMessage id="block_title" />} size="small"  variant="outlined" className="post-subtitle" />
                <IconButton className="post-paragraph-delete" onClick={() => this.handleParagraph('del', i)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
                {this.state.type === 'reply' ?
                  <>
                  <Select
                    value={this.state.cite_floor[i]}
                    options={this.state.citation_floor_opts}
                    onChange={opt => this.handleCiteFloor(opt, i)}
                    className="citation-tag"
                    menuPlacement="auto"
                    placeholder={<span><FormattedMessage id="cite_floor" /></span>}
                  />
                  <Select
                    value={this.state.cite[i]}
                    options={this.state.citation_opts[this.state.cite_floor[i] !== -1 ? this.state.cite_floor[i].value - 1 : -1]}
                    onChange={opt => this.handleCite(opt, i)}
                    className="citation-tag second"
                    menuPlacement="auto"
                    placeholder={<span><FormattedMessage id="cite_block" /></span>}
                  /></> : <div></div>
                }
                <CKEditor
                  editor={ClassicEditor}
                  config={editorConfiguration}
                  data={each.content}
                  className="post-content-editor"
                  onChange={(event, editor) => {
                    const data = editor.getData()
                    this.text('content', i, data)
                  }}
                />
              </React.Fragment>
            ))}
          </div>

          <div className="post-btn-wrapper">
            <Button variant="contained" color="primary" className="post-btn" startIcon={<SendIcon />} onClick={this.handleSubmit}><FormattedMessage id="publish" /></Button>
            <Button variant="contained" color="secondary" className="post-cancel-btn" endIcon={<DeleteIcon />} onClick={() => this.props.history.goBack()}><FormattedMessage id="cancel" /></Button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({ auth: state.auth, board: state.board.current_board.info, post: state.board.current_post, error: state.error })

export default connect(mapStateToProps, { getPostDetail, newPost, newCitation, editPost })(withRouter(Post))
