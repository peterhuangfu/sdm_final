import React, { Component } from "react";
import Select from "react-select";
import { Button, TextField } from "@material-ui/core";
import { Delete as DeleteIcon, Send as SendIcon } from "@material-ui/icons";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'

import "../../styles/post.css";
import "../../styles/board.css";

import { newVote } from '../../actions/vote'

// this page and its derivatives should be handled by Huang Fu
class Apply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      domain: '',
      origin_img: '',
      imageUrl: '',
      explanation: '',
      domainOpts: [
        { label: '角色扮演', value: 'rpg' }, { label: '動作', value: 'action' }, { label: '射擊', value: 'shoot' },
        { label: '運動', value: 'sport' }, { label: '競速', value: 'race' }, { label: '冒險', value: 'adventure' },
        { label: '策略模擬', value: 'strategy' }, { label: '益智', value: 'puzzle' }, { label: '其他', value: 'others' },
      ]
    };
  }

  text = (type, data) => {
    if (type === 'title') {
      const title = data.target.value
      this.setState({ title: title })
    }
    else if (type === 'imageUrl') {
      const origin = data
      const imgUrl1 = origin.split('<img src="')[1]
      const imgUrl2 = imgUrl1 !== undefined ? imgUrl1.split('" srcset')[0] : ''
      
      this.setState({ origin_img: origin, imageUrl: imgUrl2 })
    }
    else if (type === 'explanation') {
      this.setState({ explanation: data })
    }
  }

  handleSubmit = async () => {
    const info = {
      boardName: this.state.title,
      domainName: this.state.domain.value,
      imgUrl: this.state.imageUrl,
      userId: this.props.auth.user.info.userId,
      reason: this.state.explanation
    }

    if (info.imgUrl[0] !== 'h' || info.reason.trim() === '' || info.boardName.trim() === '')
      return

    await this.props.newVote(info)
    setTimeout(() => {
      this.props.history.goBack()
    }, 300)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return null
  }

  componentDidMount() {
    // document.title = '申請新版'
  }

  render() {
    const editorConfiguration = {
      cloudServices: {
        tokenUrl: 'https://80770.cke-cs.com/token/dev/364874da067773983bab51546a96ce8fb0168ebc8b42d9afac268ed40c48',
        uploadUrl: 'https://80770.cke-cs.com/easyimage/upload/'
      },
      placeholder: '申請緣由'
    }

    return (
      <div className="apply-wrapper">
        <div className="apply-text-container">
          <div className="apply-content-container">
            <div style={{ fontWeight: 'Bold', fontSize: 18, paddingLeft: 2, marginBottom: '20px' }}>申請新版</div>
            <Select
              value={this.state.domain}
              options={this.state.domainOpts}
              onChange={opt => this.setState({ domain: opt })}
              className="post-select-tag"
              menuPlacement="auto"
              placeholder={<span>領域</span>}
            />
            <TextField
              onChange={(e) => this.text('title', e)}
              label="新版名稱"
              placeholder="請輸入新版名稱"
              size="small"
              variant="outlined"
              style={{ marginTop: "30px", marginBottom: "30px" }}
              className="apply-title"
            />
            <CKEditor
                editor={ClassicEditor}
                config={{ ...editorConfiguration, placeholder: '專版圖片' }}
                data={this.state.origin_img}
                className="apply-image"
                onChange={(event, editor) => {
                  const data = editor.getData()
                  this.text('imageUrl', data)
                }}
            />
            <CKEditor
                editor={ClassicEditor}
                config={editorConfiguration}
                data={this.state.explanation}
                className="apply-content"
                onChange={( event, editor ) => {
                  const data = editor.getData()
                  this.text('explanation', data)
                }}
            />
          </div>
          <div className="apply-btn-wrapper">
            <Button
              variant="contained"
              color="primary"
              className="apply-btn"
              startIcon={<SendIcon />}
              onClick={this.handleSubmit}
            >
              送出申請
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className="apply-cancel-btn"
              onClick={() => this.props.history.push("/board/new")}
              endIcon={<DeleteIcon />}
            >
              取消
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ auth: state.auth, error: state.error })

export default connect(mapStateToProps, { newVote })(withRouter(Apply));
