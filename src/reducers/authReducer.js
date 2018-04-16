import {
  LOGIN_FUL,
  LOGIN_REJ,
  LOGOUT_FUL,
  REGISTER_FUL,
  REGISTER_REJ,
} from '../actions/auth';

// TODO: create a reducer function called `auth` with initialState
// { isAuthenticated: localStorage.getItem('token')  ? true : false }
//  and if the actions dispatched are
//  LOGIN_FUL or REGISTER_FUL, set isAuthenticated to true
//  If the action dispatch is
//  REGISTER_REJ, LOGOUT_FUL, LOGIN_REJ
//  set isAuthenticated to false
//  when i say "set" i mean in the state
//  if none of these actions are matched, just return the state

// STUB
var auth = function (state = {
  isAuthenticated: localStorage.getItem('token') ? true : false,
}, action) {
  switch (action.type) {
  case LOGIN_FUL:
  case REGISTER_FUL:
    return Object.assign({}, state, {
      isAuthenticated: true,
    });
  case REGISTER_REJ:
  case LOGOUT_FUL:
  case LOGIN_REJ:
    return Object.assign({}, state, {
      isAuthenticated: false,
    });
  default:
    return state;
  }
};
// ENDSTUB
//
export default auth;
