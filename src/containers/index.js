import React, { Component, useState } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { IntlProvider } from "react-intl";
import Appbar from "../components/appbar";
import Navbar from "../components/navbar";
import Home from "./home";
import AllBoard from "./board/allBoard";
import SpecificBoard from "./board/individualBoard";
import ArticleBoard from "./board/article";
import Apply from "./board/apply";
import NewBoard from "./board/newBoard";
import Post from "./board/post";
import NoMatch from "../components/noMatch";
import NewBoardDetail from "./board/newBoardDetail";
import PersonalBoard from './board/personal';
import en from "../i18n/en_us";
import zh from "../i18n/zh_tw";

import "../styles/index.css";
import "../styles/board.css";
import '../styles/personal.css'

import { getSelfUserInfo, userLogout } from '../actions/auth';
import { setNotify } from '../actions/notify';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locale: navigator.language,
      messages: zh,
    };
  }

  changeBoard = (boardInd) => {
    const board_name =
      boardInd === 0
        ? "all/rpg"
        : boardInd === 1
        ? "all/action"
        : boardInd === 2
        ? "all/shoot"
        : boardInd === 3
        ? "all/sport"
        : boardInd === 4
        ? "all/race"
        : boardInd === 5
        ? "all/adventure"
        : boardInd === 6
        ? "all/strategy"
        : boardInd === 7
        ? "all/puzzle"
        : boardInd === 8
        ? "all/others"
        : "new";
    this.props.history.push(`/board/${board_name}`);
  };

  goNewUrl = (url) => {
    this.props.history.push(url)
  }

  logout = () => {
    this.props.userLogout(this.props.history)
  }

  setLocale = (userLang) => {
    this.setState({
      locale: userLang,
      messages: userLang === "zh-TW" ? zh : en,
    });
  };

  componentDidMount() {
    const user_id = localStorage.getItem('user_id')
    const notifies = JSON.parse(localStorage.getItem('notify'))
    setTimeout(() => {
      if (user_id !== undefined && user_id !== null) {
        this.props.getSelfUserInfo(user_id)
        this.props.setNotify(notifies)
      }
    }, 100)
    document.title = '黑橘子 Old Gamer'
  }

  render() {
    return (
      <IntlProvider
        locale={this.state.locale}
        key={this.state.locale}
        defaultLocale="zh"
        messages={this.state.messages}
      >
        <div className="wrapper">
          <Appbar setLocale={this.setLocale} goNewUrl={this.goNewUrl} logout={this.logout} isAuthenticated={this.props.auth.isAuthenticated} user={this.props.auth.user} lang={this.state.locale} />
          <Navbar selectBoard={this.changeBoard} />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/board/all/:type" component={AllBoard} />
            <Route path="/board/specific/:bid" component={SpecificBoard} />
            <Route path="/board/discuss/:aid" component={ArticleBoard} />
            <Route path="/board/new" component={NewBoard} />
            <Route path="/board/new_detail/:nid" component={NewBoardDetail} />
            <Route path="/board/post/:post_type/:aid?/:floor?" component={Post} />
            <Route path="/board/personal/:type/:user_id?" component={ PersonalBoard } />
            <Route path="/board/apply" component={Apply} />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </IntlProvider>
    );
  }
}

const mapStateToProps = state => ({ auth: state.auth, error: state.error });

export default connect(mapStateToProps, { getSelfUserInfo, setNotify, userLogout })(withRouter(Index));
