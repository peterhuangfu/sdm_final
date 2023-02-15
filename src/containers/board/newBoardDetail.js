import React, { Component } from 'react'
import moment from 'moment'
import parse from 'html-react-parser'
import Select, { components } from 'react-select'
import { Popover, IconButton, Button, TextField, Typography, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core'
import { Pagination } from '@material-ui/lab'
import { ExpandMore as ExpandMoreIcon, MoreVert as MoreVertIcon } from '@material-ui/icons'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { getVoteDetail, Vote } from '../../actions/vote'

class NewBoardDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nid: props.match.params.nid,
      page: 1,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let nid = prevState.nid
    if (nextProps.match.params.nid !== nid) {
      nid = nextProps.match.params.nid
      nextProps.getVoteDetail(nid)
    }

    return {
      nid: nid
    }
  }

  userVote = async (decision) => {
    if (!Object.keys(this.props.auth.user.info).length) {
      if (window.confirm('Login First !'))
        this.props.history.push('/login')
    }
    else {
      const info = {
        voteId: this.props.vote.voteId,
        userId: this.props.auth.user.info.userId,
        decision: decision
      };
      
      await this.props.Vote(info);
      setTimeout(() => {
        this.props.getVoteDetail(this.state.nid)
      }, 300)
    }
  }
  
  componentDidMount() {
    this.props.getVoteDetail(this.state.nid)
  }

  render() {
    const data = this.props.vote
    const reason = data.reason === undefined || data.reason === null ? '' : data.reason
    const user_id = this.props.auth.user.info.userId

    let already_vote = false
    if (data.agreedUsers !== undefined) {
      already_vote = data.agreedUsers.indexOf(user_id) !== -1 || data.disagreedUsers.indexOf(user_id) !== -1
    }
    if (moment(new Date()).isAfter(moment(data.deadline))) {
      already_vote = true
    }

    let domain = data.domainName === 'rpg' ? '角色扮演' : data.domainName === 'action' ? '動作' : data.domainName === 'shoot' ? '射擊' :
                data.domainName === 'sport' ? '運動' : data.domainName === 'race' ? '競速' : data.domainName === 'adventure' ? '冒險' :
                data.domainName === 'strategy' ? '策略模擬' : data.domainName === 'puzzle' ? '益智' : data.domainName === 'others' ? '其他' : ''
    
    return (
      <div className="newboard-wrapper">
        <div id="goback-reply-btn">
          <Button variant="contained" color="primary" onClick={() => this.props.history.goBack()}><FormattedMessage id="back" /></Button>
        </div>

        <div className = "newboard-container">
          <div className="newboard-title">{`【${domain}】${data.boardName}`}</div>
          <div className="newboard-time-container">
            <div>
              <span className="newboard-applicant-prefix">{"申請人"}</span>
              <span className="newboard-applicant">{data.launcherInfo ? data.launcherInfo.name : data.launcher}</span>
            </div>
              <span>{data.time}</span>
          </div>
          <div className="newboard-content-container">
            <Typography className="article-subtitle"><FormattedMessage id="apply_reason" /></Typography>
            <Typography className="article-text" component={'span'}>{reason[0] !== '<' ? reason : parse(reason)}</Typography>
            <Typography className="article-subtitle"><FormattedMessage id="vote_portion" /></Typography>
            <Typography className="article-text" component={'div'}>
              <div className="num1"><FormattedMessage id="agree_num" />{data.agree}</div>
              <div className="num2"><FormattedMessage id="disagree_num" />{data.disagree}</div>
            </Typography>
            <div id="agree-deny-btn">
              <Button variant="contained" color="primary" className="agree-btn" disabled={already_vote} onClick={() => this.userVote(1)}><FormattedMessage id="agree" /></Button>
              <Button variant="contained" color="secondary" className="deny-btn" disabled={already_vote} onClick={() => this.userVote(0)}><FormattedMessage id="disagree" /></Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({ auth: state.auth, vote: state.vote.current_vote, error: state.error })

export default connect(mapStateToProps, { getVoteDetail, Vote })(withRouter(NewBoardDetail))
