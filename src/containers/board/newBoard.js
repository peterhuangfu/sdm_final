import React, { Component } from "react";
import DiscussTable from "../../components/discussTable";
import { Button } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { withRouter } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";

import { getVote } from "../../actions/vote";
import vote from "../../reducers/vote";
import moment from "moment";

// this page and its derivatives should be handled by ms0529552 & Jeter
class NewBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      child_status: "hot",
      page: 1
    };
  }

  childChangeStatus = (status) => {
    this.setState({ child_status: status });
  };

  goNewPage = (url) => {
    this.props.history.push(url);
  };
  
  applyNew = () => {
    if (!Object.keys(this.props.auth.user.info).length) {
      if (window.confirm('Login First !'))
        this.props.history.push('/login')
    }
    else {
      this.props.history.push("/board/apply")
    }
  };

  handlePage = (e, page) => {
    this.setState({ page: page })
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
  }

  componentDidMount() {
    // document.title = '新版事務區';
    this.props.getVote();
  }

  render() {
    const votes = this.props.votes
    const show_data = votes.length ? votes.slice(
      (this.state.page - 1) * 10,
      this.state.page * 10
    ) : [];

    return (
      <>
        <div className="board-navbar">
          <div style={{ fontWeight: "bold", fontSize: 28 }}>
            <FormattedMessage id="newBoard" />
          </div>
          <Button
            className="board-launch-btn"
            variant="contained"
            color="primary"
            onClick={this.applyNew}
          >
            <FormattedMessage id="apply" />
          </Button>
        </div>
        <DiscussTable
          goNewPage={this.goNewPage}
          board_type="new"
          data={votes}
          childChangeStatus={this.childChangeStatus}
        />
        <div className="paginator-container">
          <Pagination
            count={parseInt((votes.length - 1) / 10) + 1}
            color="primary"
            onChange={this.handlePage}
          />
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  votes: state.vote.all_votes,
  error: state.error,
});

export default connect(mapStateToProps, { getVote })(withRouter(NewBoard));
