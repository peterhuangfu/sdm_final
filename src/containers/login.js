import React, { Component } from 'react'
import Register from './register'
import agent from '../actions/agent'
import { OutlinedInput, InputAdornment, IconButton, Button, AppBar,Toolbar } from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { GoogleLogin } from 'react-google-login'
import Logo from "../images/main/logo.png";
import PersonPinIcon from '@material-ui/icons/PersonPin';

import '../styles/login.css'
import "../styles/index.css";

import { getSelfUserInfo } from '../actions/auth'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      action: 'login',
      username: '',
      password: '',
      error: '',
      user: {},
      allow: false
    }
  }

  change = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleKey = e => {
    if (e.key === 'Enter') {
      this.login()
    }
  }

  login = async () => {
    // const user = {
    //   username: this.state.username,
    //   password: this.state.password
    // }
    // this.props.user_login(user)
  }

  register = async (info) => {
    const user = {
      username: info.username,
      password: info.password,
      name: info.username,
      email: info.email,
      birthday: info.birthday,
      avatar: info.avatar
    }
    
    await this.props.user_register(user)
    // this.props.history.push('/')
  }

  goNewUrl = (url) => {
      this.props.history.push(url)
  }

  googleLogin = async (googleUser) => {
    const user = {
      name: googleUser.profileObj.name,
      accessToken: googleUser.accessToken,
      email: googleUser.profileObj.email,
      familyName: googleUser.profileObj.familyName,
      givenName: googleUser.profileObj.givenName,
      imageUrl: googleUser.profileObj.imageUrl,
      userId: googleUser.profileObj.googleId
    }
    
    const login_res = await agent.post('/GoogleSignIn', user)
    
    if (login_res.data.success) {
      await this.props.getSelfUserInfo(googleUser.profileObj.googleId)
    }
    else {
      return
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.auth.isAuthenticated) {
      localStorage.setItem('user_id', nextProps.auth.user.info.userId)
      nextProps.history.push('/')
    }

    return null
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/')
    }

    document.title = 'Login'
  }

  render() {
    return (
      <div className="login-page">
        <div className="wrapper">
          <AppBar position="sticky" color="inherit">
            <Toolbar className="toolbar">
              <div className="appbar-left">
                <img className="logo" src={Logo} alt="Logo" />
                <span className="app-name">
                  <a href="/" id='signin-title-link'>黑橘子 OLD GAMER</a>
                </span>
              </div>
            </Toolbar>
          </AppBar>

          <div className="login-landscape">
            
            <div className="login-subcontainer-2">
              <p id="signin-title">會員登入</p>
              <p id="signin-title-eng"> Sign In</p>
              <PersonPinIcon id="icon-sigin" />
              <p></p>
              {/* <span id="signin-span">Sign In</span> */}
              <GoogleLogin
                clientId="122388849548-qtdng04l7vo27i6up7429dr87korq64e.apps.googleusercontent.com"
                buttonText="Google SignIn"
                onSuccess={this.googleLogin}
                onFailure={this.googleLogin}
                className="google-signin-btn-2"
              />
            </div>
        </div>

          </div>

        
        {/* <div className="login-container"> */}

          
          {/* <div className="product-logo">
            <img src={Logo} alt="Login_Logo" />
          </div> */}

          {/* {this.state.action === 'login' ?
          <div className="login-subcontainer">
            <span id="signin-span">Sign In</span>
            <div className="login-input">
              <OutlinedInput
                id="login-account"
                name="sdm-username"
                placeholder="Your Username"
                type="text"
                variant="outlined"
                value={this.state.username}
                style={{ width: '400px', margin: '10px 0' }}
                onChange={this.change}
                onKeyDown={this.handleKey}
                autoComplete="new-password" />
            
              <OutlinedInput
                id="login-password"
                name="sdm-password"
                placeholder="Your Password"
                type={this.state.visible ? "text" : "password"}
                variant="outlined"
                value={this.state.password}
                style={{ width: '400px', margin: '10px 0' }}
                onChange={this.change}
                onKeyDown={this.handleKey}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      id="login-password-visible"
                      aria-label="password visibility"
                      onClick={() => this.setState(state => ({ visible: !state.visible }))}
                      onMouseDown={e => e.preventDefault()}
                      edge="end" >
                      {this.state.visible ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                autoComplete="new-password" />
              
              <div className="forget-and-register">
                <div className="forget-button" onClick={() => this.setState({ action: 'forgetPass' })}>Forget password ?</div>
                <div className="register-button" onClick={() => { this.setState({ action: 'register' }); document.title = 'Register' }}>Create an account</div>
              </div>
            </div>

            <div className="login-action">
              <Button className="login-button" variant="contained" onClick={this.login} autoFocus={false} color="primary">登入</Button>
              <GoogleLogin
                clientId="122388849548-qtdng04l7vo27i6up7429dr87korq64e.apps.googleusercontent.com"
                buttonText="Google SignIn"
                onSuccess={this.googleLogin}
                onFailure={this.googleLogin}
                className="google-signin-btn"
              />
            </div>
          </div> :
          <Register register={this.register} goBack={() => { this.setState({ action: 'login', user: {} }); document.title='Login' }} />
          } */}
        {/* </div> */}
      </div>
    )
  }
}

const mapStateToProps = state => ({ auth: state.auth, error: state.error })

export default connect(mapStateToProps, { getSelfUserInfo })(withRouter(Login))
