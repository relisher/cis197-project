import { combineReducers } from 'redux';
// TODO: determine appropriate imports
// STUB
import authReducer from './authReducer';
import tweetListReducer from './tweetListReducer';
import tweetReducer from './tweetReducer';
import profileReducer from './profileReducer';
import messageReducer from './messageReducer';
import discoverReducer from './discoverReducer';
// ENDSTUB

// TODO: you should somehow * combine reducers * hint hint
// so that the reducer looks like
// {
//  authReducer: { isAuthenticated: ...  }
//  tweetList:  { ids: [...] } 
//  tweet: { id1: {...}, id2: {...} ... }
//  profileReducer: { profile: { name: '', species: '' ... }}
//  messageReducer: { messages: [ { messageType: ..., message: ...}, ...] }
//  discoverReducer: { discovers: [...] }
// }
// store this reducer in a variable 'tweetApp'
// STUB
const tweetApp = combineReducers({
  authReducer,
  tweetList: tweetListReducer,
  tweet: tweetReducer,
  profileReducer: profileReducer,
  messageReducer: messageReducer,
  discoverReducer: discoverReducer,
});
// ENDSTUB

export default tweetApp;
