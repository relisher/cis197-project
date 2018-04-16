import {
  LOADTWEETS_FUL,
  CREATETWEET_FUL,
  FAVORITE_FUL,
} from '../actions/tweetActions';

// TODO: createa  reducer called tweetReducer that has an initalState {}
// if the LOADTWEETS_FUL action occurs, make sure that your eventual
// state would look like
// {
//  whateverTheTweetId: { fullTweetObj },
//  whateverTheTweetId2: { fullTweetobj2 }
//  ...
// }
// basically i should be able to do state[someTweetId] and get the
// full tweet object containing that tweet
// on the CREATETWEET_FULa nd FAVORITE_FUL actions, just  set the
// tweet in the state equal to the data you get from the action
// STUB
const tweetReducer = (state = {}, action) => {
  switch (action.type) {
  case LOADTWEETS_FUL:
    let nextState = {
      ...state,
    };
    action.tweets.map((i) => {
      nextState[i.tweetId] = i;
    });
    return nextState;
  case CREATETWEET_FUL:
  case FAVORITE_FUL:
    return {
      ...state,
      [action.data.tweetId]: action.data,
    };
  default:
    return state;
  }
};
// STUB
export default tweetReducer;
