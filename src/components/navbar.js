import React, { Component } from "react";
import { AppBar, Tabs, Tab } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      val: 0
    };
  }

  handleChange = (newVal) => {
    this.setState({ val: newVal });
    this.props.selectBoard(newVal);
  };

  render() {
    return (
      <AppBar position="static" color="primary">
        <Tabs
          className="navbar-tabs"
          value={this.state.val}
          aria-label="navbar"
          indicatorColor="secondary"
        >
          <FormattedMessage id="rpg" defaultMessage="search">
            {(tabName) => (
              <Tab
                label={tabName}
                id="tab-0"
                aria-controls="tabpanel-0"
                onClick={() => this.handleChange(0)}
              />
            )}
          </FormattedMessage>
          <FormattedMessage id="act" defaultMessage="search">
            {(tabName) => (
              <Tab
                label={tabName}
                id="tab-1"
                aria-controls="tabpanel-1"
                onClick={() => this.handleChange(1)}
              />
            )}
          </FormattedMessage>
          <FormattedMessage id="fps" defaultMessage="search">
            {(tabName) => (
              <Tab
                label={tabName}
                id="tab-2"
                aria-controls="tabpanel-2"
                onClick={() => this.handleChange(2)}
              />
            )}
          </FormattedMessage>
          <FormattedMessage id="sports" defaultMessage="search">
            {(tabName) => (
              <Tab
                label={tabName}
                id="tab-3"
                aria-controls="tabpanel-3"
                onClick={() => this.handleChange(3)}
              />
            )}
          </FormattedMessage>
          <FormattedMessage id="race" defaultMessage="search">
            {(tabName) => (
              <Tab
                label={tabName}
                id="tab-4"
                aria-controls="tabpanel-4"
                onClick={() => this.handleChange(4)}
              />
            )}
          </FormattedMessage>
          <FormattedMessage id="adv" defaultMessage="search">
            {(tabName) => (
              <Tab
                label={tabName}
                id="tab-5"
                aria-controls="tabpanel-5"
                onClick={() => this.handleChange(5)}
              />
            )}
          </FormattedMessage>
          <FormattedMessage id="sim" defaultMessage="search">
            {(tabName) => (
              <Tab
                label={tabName}
                id="tab-6"
                aria-controls="tabpanel-6"
                onClick={() => this.handleChange(6)}
              />
            )}
          </FormattedMessage>
          <FormattedMessage id="tech" defaultMessage="search">
            {(tabName) => (
              <Tab
                label={tabName}
                id="tab-7"
                aria-controls="tabpanel-7"
                onClick={() => this.handleChange(7)}
              />
            )}
          </FormattedMessage>
          <FormattedMessage id="others" defaultMessage="search">
            {(tabName) => (
              <Tab
                label={tabName}
                id="tab-8"
                aria-controls="tabpanel-8"
                onClick={() => this.handleChange(8)}
              />
            )}
          </FormattedMessage>
          <FormattedMessage id="newBoard" defaultMessage="search">
            {(tabName) => (
              <Tab
                label={tabName}
                id="tab-9"
                aria-controls="tabpanel-9"
                onClick={() => this.handleChange(9)}
              />
            )}
          </FormattedMessage>
        </Tabs>
      </AppBar>
    );
  }
}

export default Navbar;
