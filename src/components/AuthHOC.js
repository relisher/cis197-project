import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// we give you this file, but understand how it works :)
// this file generates a component that is wrapped with other properties
// if the user is authenticated, we render out the component and  also load on
// some other properties such as checking to see if the user is logged in when
// the component mouts or changes
// if the user isn't authenticated, we then dispatch a  reject login function call
// (ref the mapDispatchToProps at the bottom of the file
// and we change the route to /signX which in turn renders the SignX  component
// "kicking out" our user

export default function requiresAuth(Component) {
  class AuthHOC extends React.Component {
    componentDidMount() {
      this.checkIfLoggedIn();
    }

    componentDidUpdate() {
      this.checkIfLoggedIn();
    }

    checkIfLoggedIn() {
      const { isAuthenticated } = this.props;
      if (!isAuthenticated) {
        this.props.rejectLogin();
        this.props.history.push('/signX');
      }
    }

    render() {
      return (
        <div>
          { this.props.isAuthenticated ? <Component {...this.props} /> : null }
        </div>
      );
    }
  }

  const mapStateToProps = (state) => {
    // only look at  the auth reducer
    const { authReducer } = state;
    const { isAuthenticated } = authReducer;
    return {
      isAuthenticated,
    };
  };

  const mapDispatchToProps = dispatch => ({
    rejectLogin: () => dispatch({
      type: 'LOGIN_REJ',
      error: 'Tweet tweet, you aren\'t authenticated',
    }),
  });

  // withRouter is new. That's just saying that we should give our component the abilities
  // to read from the React Router state via its props (thats how we can change the page, its bc
  // withRouter injects  the prop 'history' which in turn has a function .push('string') that
  // changes the page

  return withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthHOC));
}
