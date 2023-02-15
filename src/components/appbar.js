import React, { Component } from "react";
import Logo from "../images/main/logo.png";
import Notify from "./notify";
import {
  Popover,
  Badge,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Paper,
  InputBase,
} from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import { FormattedMessage } from "react-intl";

class Appbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      lang_zh: props.lang === 'zh-TW' ? true : false,
    };
  }

  handleLang = (e) => {
    const checked = e.target.checked
    this.props.setLocale(!checked ? "en-US" : "zh-TW");
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      lang_zh: nextProps.lang === 'zh-TW' ? true : false,
    }
  }

  render() {
    return (
      <AppBar position="sticky" color="inherit">
        <Toolbar className="toolbar">
          <div className="appbar-left">
            <img className="logo" src={Logo} alt="Logo" />
            <span className="app-name" onClick={() => this.props.goNewUrl("/")}>
              黑橘子 OLD GAMER
            </span>
          </div>

          {this.props.isAuthenticated ? (
            <div className="appbar-right">
              <div id="switch-lan">
                <div>En</div>
                <Switch
                  checked={this.state.lang_zh}
                  onChange={this.handleLang}
                  size="small"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
                <div>中</div>
              </div>

              <Notify />

              <img
                className="avatar"
                src={this.props.user.info.imageUrl}
                alt="avatar"
                onClick={() => this.props.goNewUrl(`/board/personal/self`)}
              />
              <span className="login-logout-prefix">{this.props.user.info.name}<FormattedMessage id="hello" /></span>

              <Button
                className="appbar-login-logout"
                color="primary"
                variant="outlined"
                onClick={() => this.props.logout()}
              >
                <FormattedMessage id="logout" />
              </Button>
            </div>
          ) : (
            <div className="appbar-right guest">
              <div id="switch-lan">
                <div>En</div>
                <Switch
                  checked={this.state.lang_zh}
                  onChange={this.handleLang}
                  size="small"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
                <div>中</div>
              </div>
              
              <Button
                className="appbar-login-logout"
                color="primary"
                variant="outlined"
                onClick={() => this.props.goNewUrl("/login")}
              >
                <FormattedMessage id="login" />
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

export default Appbar;
