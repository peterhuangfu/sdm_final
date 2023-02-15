import React, { Component } from "react";
import moment from "moment";
import { AppBar, Tabs, Tab } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

class DiscussTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // board_type: (1) all (2) specific (3) new
      board_type: props.board_type,
      val: 0,
      data: props.data,
      hot_or_latest: props.child_status,
    };
  }

  handleChange = (e, newVal) => {
    this.props.childChangeStatus(newVal === 0 ? 'hot' : 'latest');
    this.setState({ val: newVal });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.data) {
      return {
        data: nextProps.data,
        hot_or_latest: nextProps.child_status,
      };
    }

    return {
      hot_or_latest: nextProps.child_status,
    };
  }

  componentDidMount() {}

  render() {
    const data =
      this.state.val === 0 ? this.state.data :
      this.state.val === 1 ?
        this.state.data.filter(e => e.authorInfo.cumulateGameSpecialty.map(g => {
          if (g.boardId === e.boardId && g.score >= 100)
            return true
          else
            return false
        }).some(e => e === true)) : []

    return (
      <div className="board-discuss-container">
        <div className="discuss-navbar">
          <AppBar
            position="static"
            color="default"
            style={{ borderRadius: "5px 5px 0 0" }}
          >
            <Tabs
              className="navbar-tabs"
              value={this.state.val}
              onChange={this.handleChange}
              aria-label="navbar"
              indicatorColor="primary"
            >
              {this.state.board_type === 'specific' ?
                ['hot', 'recommend'].map((e, i) => (
                  <Tab label={<FormattedMessage id={e} />} id={`tab-${i}`} aria-controls={`tabpanel-${i}`} key={e} />
                )) : <Tab label={<FormattedMessage id="hot" />} id="tab-0" aria-controls="tabpanel-0" />
              }
            </Tabs>
          </AppBar>
        </div>
        {data.length ?
          <div className="articles-container">
            {data.map((e, i) => (
              this.state.board_type === 'all' ?
                <div className="article" key={e.boardId}>
                  <div className="article-prefix">
                    <img className="board-img" src={e.img} alt="img" />
                    <span className="each-title" onClick={() => this.props.goNewPage(`/board/specific/${e.boardId}`)}>{e.boardName}</span>
                  </div>

                  <div className="article-postfix">
                    <span className="each-order">{i + 1}</span>
                  </div>
                </div> :
              this.state.board_type === 'specific' ?
                <div className="article-post" key={e.postId}>
                  <div className="article-prefix">
                    <span className="each-tag">【{e.postTag}】</span> &nbsp;
                    <span className="each-id" onClick={() => this.props.goNewPage(`/board/discuss/${e.postId}`)}>{e.postTitle}</span>
                  </div>
                  <div className="article-postfix">
                    <span className="each-name">{e.authorName}</span> &nbsp;&nbsp;
                    <span className="each-time">{moment(e.time).format('YYYY-MM-DD')}</span>
                  </div>
                </div> :
                <div className="article" key={e.voteId}>
                  <div className="article-prefix">
                    <img className="board-img" src={e.img} alt="img" />
                    <span className="each-tag">【申請】</span> &nbsp;
                    <span className="each-board" onClick={() => this.props.goNewPage(`/board/new_detail/${e.voteId}`)}>{e.boardName}</span>
                  </div>
                  <div className="article-postfix">
                    <span className="each-time">{moment(e.deadline).format('YYYY-MM-DD')} <FormattedMessage id="end" /></span>
                  </div>
                </div>
            ))}
          </div> : <div></div>
        }
      </div>
    );
  }
}

export default DiscussTable;
