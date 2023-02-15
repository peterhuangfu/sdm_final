import React, { Component } from 'react'
import Pic from '../images/main/FFXIV.jpeg'
import { withRouter } from 'react-router-dom'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount() {
    // document.title = '首頁'
  }

  render() {
    return (
      <>
        <img className="home-pic" src={Pic} alt="home" />
      </>
    )
  }
}

export default withRouter(Home)
