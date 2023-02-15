import React, { Component } from 'react'
import moment from 'moment'
import { Paper, Chip, Tabs, Tab, IconButton, Button, TextField } from '@material-ui/core'
import { Edit as EditIcon, Check as CheckIcon } from '@material-ui/icons'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { getSelfUserInfo, getUserInfo, modifyUserInfo } from '../../actions/auth'

class PersonalBoard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      val: 0,
      modify: {
        introduction: false,
        interest_games: false
      },
      introduction: '',
      interest_games: '',
      user: props.match.params === 'self' ? props.auth.user : props.auth.another_user,
      type: props.match.params.type || 'self',
      user_id: props.match.params.user_id || '',
    }
  }

  handleEdit = (attr, value) => {
    if (attr === 'introduction') {
      this.setState({ introduction: value })
    }
    else {
      this.setState({ interest_games: value })
    }
  }

  handleModify = async (item, status) => {
    let mod = this.state.modify
    let user_id = this.props.auth.user.info.userId
    if (!status && item === 'introduction') {
      mod[item] = status
      const info = {
        userId: user_id,
        selfIntroduction: this.state.introduction.trim(),
        interestGames: this.props.auth.user.info.interestGames
      }
      
      await this.props.modifyUserInfo(info)

      setTimeout(async () => {
        await this.props.getSelfUserInfo(user_id)
        this.setState({ modify: mod, introduction: '', interest_games: '' })
      }, 300)
    }
    else if (!status && item === 'interest_games') {
      mod[item] = status
      const info = {
        userId: this.props.auth.user.info.userId,
        selfIntroduction: this.props.auth.user.info.selfIntroduction,
        interestGames: this.props.auth.user.info.interestGames.trim() !== '' ? this.props.auth.user.info.interestGames + '、' + this.state.interest_games : this.state.interest_games
      }
      
      if (this.state.interest_games.trim() === '')
        return
      
      await this.props.modifyUserInfo(info)

      setTimeout(async () => {
        await this.props.getSelfUserInfo(user_id)
        this.setState({ modify: mod, introduction: '', interest_games: '' })
      }, 300)
    }
    else if (status && item === 'introduction') {
      if (mod['interest_games'])
        return
      else {
        mod[item] = status
        this.setState({ modify: mod, introduction: this.state.user.info.selfIntroduction, interest_games: '' })
      }
    }
    else if (status && item === 'interest_games') {
      if (mod['introduction'])
        return
      else {
        mod[item] = status
        this.setState({ modify: mod, introduction: '', interest_games: '' })
      }
    }
  }

  handleChange = (e, newVal) => {
    this.setState({ val: newVal })
  }

  goNewPage = (url) => {
    this.props.history.push(url)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const user_type = nextProps.match.params.type
    
    if (user_type === 'other' && nextProps.match.params.user_id !== prevState.user_id) {
      nextProps.getUserInfo(nextProps.match.params.user_id)
      return {
        type: 'other',
        user_id: nextProps.match.params.user_id
      }
    }
    else if (user_type === 'other' && nextProps.match.params.user_id === prevState.user_id) {
      if (Object.keys(nextProps.auth.another_user.info).length === 0) {
        nextProps.getUserInfo(nextProps.match.params.user_id)
      }
      else {
        return {
          user: nextProps.auth.another_user,
          type: 'other',
          user_id: nextProps.match.params.user_id
        }
      }
    }
    else if (user_type === 'self') {
      return {
        user: nextProps.auth.user,
        type: 'self',
        user_id: nextProps.match.params.user_id
      }
    }
    
    return null
  }

  componentDidMount() {
    // document.title = '個人設定'

    if (this.props.match.params.type === 'other') {
      this.props.getUserInfo(this.props.match.params.user_id)
    }
  }

  render() {
    const user = this.state.user

    return (
      <div className="personal-wrapper">
        <div className="big-avatar-container">
          <img className="personal-avatar" src={user.info.imageUrl} alt="avatar" />
          <span>{user.info.name}</span>
        </div>
        <div className="personal-info-container">
          <div className="personal-menu">
            <Paper square>
              <Tabs className="personal-tabs" value={this.state.val} onChange={this.handleChange} aria-label="navbar" textColor="primary" indicatorColor="primary">
                <Tab label={<FormattedMessage id="information" />} id="tab-0" aria-controls="tabpanel-0" />
                <Tab label={<FormattedMessage id="publish_post" />} id="tab-1" aria-controls="tabpanel-1" />
                <Tab label={<FormattedMessage id="replied_post" />} id="tab-2" aria-controls="tabpanel-2" />
                <Tab label={<FormattedMessage id="apply_new_board" />} id="tab-3" aria-controls="tabpanel-3" />
              </Tabs>
            </Paper>
          </div>
          <div className="personal-content-container">
            {this.state.val === 0 ?
              <PersonalInfo info={user.info} intro={this.state.introduction} games={this.state.interest_games} editable={this.state.modify} edit={this.handleEdit} modify={this.handleModify} isEditable={user.info.userId === this.props.auth.user.info.userId} /> : this.state.val === 1 ?
              <LaunchedArticle articles={user.publish_post} goNewPage={this.goNewPage} /> : this.state.val === 2 ?
              <RepliedArticle articles={user.replied_post} goNewPage={this.goNewPage} /> :
              <LaunchedBoard boards={user.info.launchNewBoard === null ? [] : user.info.launchNewBoard} goNewPage={this.goNewPage} />
            }
          </div>
        </div>
      </div>
    )
  }
}

function PersonalInfo({ info, intro, games, editable, edit, modify, isEditable }) {
  const introduction = info.selfIntroduction !== undefined ? info.selfIntroduction.split('/n').map((e, i) => {
    if (i !== 0) {
      return (<br /> + e)
    }
    else {
      return (e)
    }
  }) : ''
  const interest_games = info.interestGames !== '' && info.interestGames !== undefined ? info.interestGames.split('、') : []
  
  return (
    <>
      <Paper className="launch" elevation={3}>
        <div className="user-introduction">
          <div className="box">
            <span className="prefix"><FormattedMessage id="introduction" /></span>
            {isEditable ? 
              !editable.introduction ?
                <IconButton className="btn" size="small" onClick={() => modify('introduction', true)}><EditIcon fontSize="inherit" /></IconButton> :
                <IconButton className="btn" size="small" onClick={() => modify('introduction', false)}><CheckIcon fontSize="inherit" /></IconButton>
            : <></>}
          </div>
          
          {!editable.introduction ?
            <span id="personal-introduction">{introduction}</span> :
            <TextField multiline id="personal-introduction-editable" label="Introduction" onChange={e => edit('introduction', e.target.value)} value={intro} variant="outlined" />}
          
        </div>
      </Paper>

      <Paper className="launch" elevation={3}>
        <div className="user-interest-games">
          <div className="box">
            <span className="prefix"><FormattedMessage id="interest_games" /></span>
            {isEditable ?
              !editable.interest_games ?
                <IconButton className="btn" size="small" onClick={() => modify('interest_games', true)}><EditIcon fontSize="inherit" /></IconButton> :
                <IconButton className="btn" size="small" onClick={() => modify('interest_games', false)}><CheckIcon fontSize="inherit" /></IconButton>
            : <></>}
          </div>

          <div className="interest-games">
            {interest_games.map((e, i) => (
              <Chip className="chip" label={e} color="primary" key={e} />
            ))}
          </div>
          {!editable.interest_games ? <></> :
            <TextField id="personal-interest-games-editable" label="Games" onChange={e => edit('interest_games', e.target.value)} variant="outlined" value={games} />}
        </div>
      </Paper>

      <Paper className="launch" elevation={3}>
        <div className="user-specialty">
          <span className="prefix"><FormattedMessage id="specialty_score" /></span>
          {info.cumulateGameSpecialty !== null && info.cumulateGameSpecialty ? info.cumulateGameSpecialty.map((e, i) => (
            <Chip className="chip" label={`${e.boardName} : ${e.score}`} color="primary" key={e} />
          )) : <></>}
        </div>
      </Paper>
    </>
  )
}

function LaunchedArticle({ articles, goNewPage }) {
  return (
    <>
      {articles.length ?
        <div className="launch-article-container">
          {articles.map((art, i) => (
            <div className="article-post" key={art.postId}>
              <div className="article-prefix">
                <span className="each-tag">【{art.postTag}】</span> &nbsp;
                <span className="each-id" onClick={() => goNewPage(`/board/discuss/${art.postId}`)}>{art.postTitle}</span>
              </div>
              <div className="article-postfix">
                {/* <span className="each-name">{art.author}</span> &nbsp;&nbsp; */}
                <span className="each-time">{moment(art.time).format('YYYY-MM-DD')}</span>
              </div>
            </div>
          ))}
        </div> : <div></div>
      }
    </>
  )
}

function RepliedArticle({ articles, goNewPage }) {
  return (
    <>
      {articles.length ?
        <div className="launch-article-container">
          {articles.map((art, i) => (
            <div className="article-post" key={art.postId}>
              <div className="article-prefix">
                <span className="each-tag">【{art.postTag}】</span> &nbsp;
                <span className="each-id" onClick={() => goNewPage(`/board/discuss/${art.postId}`)}>{`${art.postTitle} (${art.floor}樓)`}</span>
              </div>
              <div className="article-postfix">
                {/* <span className="each-name">{art.author}</span> &nbsp;&nbsp; */}
                <span className="each-time">{moment(art.time).format('YYYY-MM-DD')}</span>
              </div>
            </div>
          ))}
        </div> : <div></div>
      }
    </>
  )
}

function LaunchedBoard({ boards, goNewPage }) {
  return (
    <>
      {boards.length ?
        <div className="launch-article-container">
          {boards.map((boa, i) => (
            <div className="article" key={boa.voteId}>
              <div className="article-prefix">
                <img className="board-img" src={boa.img} alt="img" />
                <span className="each-tag">【申請】</span> &nbsp;
                <span className="each-board" onClick={() => goNewPage(`/board/new_detail/${boa.voteId}`)}>{boa.boardName}</span>
              </div>
              <div className="article-postfix">
                <span className="each-time">{moment(boa.time).format('YYYY-MM-DD')} <FormattedMessage id="end" /></span>
              </div>
            </div>
          ))}
        </div> : <div></div>
      }
    </>
  )
}

const mapStateToProps = state => ({ auth: state.auth, error: state.error })

export default connect(mapStateToProps, { getSelfUserInfo, getUserInfo, modifyUserInfo })(withRouter(PersonalBoard))
