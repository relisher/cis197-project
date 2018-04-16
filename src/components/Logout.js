import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { logOut } from '../actions/auth';

class Logout extends React.Component {
  componentDidMount() {
    let { dispatch } = this.props;
    dispatch(logOut());
    this.props.history.push('/signx');
  }

  render() {
    return (
      <div>
        Logging Out
      </div>
    );
  }
}

export default connect()(Logout);
