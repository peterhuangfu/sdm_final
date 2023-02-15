import React, { Component } from 'react'
import Select from 'react-select'
import moment from 'moment'
import { OutlinedInput, Button } from '@material-ui/core'
import { withRouter } from 'react-router-dom'

import '../styles/login.css'

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      email: '',
      year: 0,
      month: 0,
      day: 0
    }
  }

  handleSelectChange = (status, opt) => {
    if (status === 'year')
      this.setState({ year: opt })
    else if (status === 'month')
      this.setState({ month: opt })
    else
      this.setState({ day: opt })
  }

  change = e => {
    const { target: { name, value } } = e
    this.setState(state => ({ ...state, [name]: value }))
  }

  register = () => {
    let info = {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email,
      birthday: moment(this.state.year.value.toString() + '.' + this.state.month.value.toString() + '.' + this.state.day.value.toString(), 'YYYY.MM.DD').toDate(),
      avatar: ''
    }
    this.props.register(info)
  }

  render() {
    const year_options = new Array(61).fill(0).map((e, i) => {
      return { label: i + 1960, value: i + 1960 }
    }).reverse()

    const month_options = new Array(12).fill(0).map((e, i) => {
      return { label: i + 1, value: i + 1 }
    })

    const day_upper_limit = this.state.month.value === 2 ? 28 :
      this.state.month.value === 1 || this.state.month.value === 3 || this.state.month.value === 5 ||
      this.state.month.value === 7 || this.state.month.value === 8 || this.state.month.value === 10 ||
      this.state.month.value === 12 ? 31 : 30
    
    const day_options = new Array(day_upper_limit).fill(0).map((e, i) => {
      return { label: i + 1, value: i + 1 }
    })

    return (
      <div className="login-subcontainer">
        <span id="signup-span">Sign Up</span>
        <div className="register-input">
          <OutlinedInput
            id="register-account"
            name="username"
            placeholder="Please enter your username"
            type="text"
            variant="outlined"
            value={this.state.username}
            style={{ width: '400px', margin: '15px 0' }}
            onChange={this.change}
            autoComplete="off" />
        
          <OutlinedInput
            id="register-password"
            name="password"
            placeholder="Please enter your password"
            type="text"
            variant="outlined"
            value={this.state.password}
            style={{ width: '400px', margin: '15px 0' }}
            onChange={this.change}
            autoComplete="off" />
          
          <OutlinedInput
            id="register-email"
            name="email"
            placeholder="Email (only commercial account is valid)"
            type="text"
            variant="outlined"
            value={this.state.email}
            style={{ width: '400px', margin: '15px 0' }}
            onChange={this.change} />
          
          <div className="register-select-container">
            <Select
              value={this.state.year}
              options={year_options}
              onChange={opt => this.handleSelectChange('year', opt)}
              className="register-select-year"
              menuPlacement="auto"
              placeholder={<span>Y</span>}
            />
            <span>年</span>
            <Select
              value={this.state.month}
              options={month_options}
              onChange={opt => this.handleSelectChange('month', opt)}
              className="register-select-month"
              menuPlacement="auto"
              placeholder={<span>M</span>}
            />
            <span>月</span>
            <Select
              value={this.state.day}
              options={day_options}
              onChange={opt => this.handleSelectChange('day', opt)}
              className="register-select-day"
              menuPlacement="auto"
              placeholder={<span>D</span>}
            />
            <span>日</span>
          </div>
        </div>

        <div className="register-action">
          <Button className="register" variant="contained" color="primary" onClick={this.register} autoFocus={false}>下一頁</Button>
          <Button className="go-back" variant="outlined" color="primary" onClick={() => this.props.goBack()} autoFocus={false}>返回</Button>
        </div>
      </div>
    )
  }
}

export default withRouter(Register)
