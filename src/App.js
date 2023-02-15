import React, { Component } from "react";
import { store } from "./store";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./containers/login";
import Index from "./containers";
import NoMatch from "./components/noMatch";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    const url = window.location.origin;

    if (!url.includes("localhost") && !url.includes("https")) {
      window.location = `https:${url.split(":")[1]}`;
    }

    this.state = {};
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/" component={Index} />
            <Route component={NoMatch} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
