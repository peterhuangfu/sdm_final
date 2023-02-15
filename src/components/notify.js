import React, { Component } from 'react'
import { Popover, IconButton, Badge } from '@material-ui/core'
import { FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { Notifications as NotificationIcon } from '@material-ui/icons'
import { connect } from 'react-redux'

import { getNotify, userRead } from '../actions/notify'

class Notify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    }
  }

  openPop = e => {
    this.setState({ anchorEl: e.currentTarget })
    this.props.userRead()
  }

  handleLang = (e) => {
    const checked = e.target.checked
    this.props.setLocale(!checked ? "en-US" : "zh-TW")
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.notify.ifNewComing) {
      localStorage.setItem('notify', JSON.stringify(nextProps.notify.notifies))
    }

    return null
  }

  componentDidMount() {
    setInterval(() => this.props.getNotify(this.props.auth.user.info.userId), 2000)
  }

  render() {
    const notes = this.props.notify.notifies.map((not, ni) => {
      const type = not.notifyType === 'repost' ? 1 : not.notifyType === 'comment' ? 2: not.notifyType === 'vote success' ? 3 : not.notifyType === 'vote failed' ? 4 : not.notifyType === 'specialty' ? 5 : 6
      const info = {
        content:
          type === 1 ? `${not.authorName} 回覆了你的文章` :
          type === 2 ? `${not.authorName} 在你的文章留言` :
          type === 3 ? `你申請的 ${not.authorName} 通過投票了` :
          type === 4 ? `你申請的 ${not.authorName} 未能通過投票` :
          type === 5 ? `你在 ${not.authorName} 的專業度分數提升了` : `${not.authorName} 引用了你的文章`,
        link:
          type === 1 ? `/board/discuss/${not.postId}` :
          type === 2 ? `/board/discuss/${not.postId}` :
          type === 3 ? `/board/new_detail/${not.voteId}` :
          type === 4 ? `/board/new_detail/${not.voteId}` :
          type === 5 ? `/board/personal/self/${not.userId}` : `/board/discuss/${not.postId}`,
        type: type
      }

      return info
    })

    return (
      <>
        <IconButton
          className="appbar-notify"
          onClick={this.openPop}
        >
          <Badge variant="dot" color="secondary" invisible={!this.props.notify.ifNewComing}>
            <NotificationIcon />
          </Badge>
        </IconButton>
        <Popover
          className="notify-popover"
          open={!!this.state.anchorEl}
          anchorEl={this.state.anchorEl}
          onClose={() => this.setState({ anchorEl: null })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <div id="notify-container">
            <div id="notify-sub1">
              <FormattedMessage id="notification" />
            </div>
            <div id="notify-sub2">
              {notes.map((n, i) => (
                <div className="notify-div" onClick={() => { this.props.history.push(n.link); this.setState({ anchorEl: null }) }}>
                  {n.content}
                </div>
              ))}
            </div>
          </div>
        </Popover>
      </>
    )
  }
}

const mapStateToProps = state => ({ auth: state.auth, notify: state.notify, error: state.error })

export default connect(mapStateToProps, { getNotify, userRead })(withRouter(Notify))
