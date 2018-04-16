import {
  LOADTWEETS_FUL,
} from '../actions/tweetActions';

// TODO: createa  reducer function named tweetListReducer with initial state
// { ids: [] }.
// When the LOADTWEETS_FUL action occurs, set ids equal to justt he tweetId
// for all the tweets from the action
// STUB
const tweetListReducer = (state = {
  ids: [],
}, action) => {
  switch (action.type) {
  case LOADTWEETS_FUL:
    return {
      ids: action.tweets.map(t => t.tweetId),
    };
  default:
    return state;
  }
};
// ENDSTUB

export default tweetListReducer;
