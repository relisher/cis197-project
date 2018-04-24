// providing this for  you bc im nice  :)
import {
  UPDATEPROFILE_FUL,
  GETPROFILE_FUL,
  FAVUNFAV_FUL,
  GETMESSAGE_FUL,
} from '../actions/profileActions';

let initialState = {
  profile: {
    name: '',
    species: '',
    photo: '',
    followers: [],
    following: [],
    isFollowing: false,
    messageHistory: []
  },
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
  case UPDATEPROFILE_FUL:
    return {
      ...state,
      profile: Object.assign({}, state.profile, action.profile),
    };
  case GETPROFILE_FUL:
    return {
      ...state,
      profile: action.profile,
    };
  case FAVUNFAV_FUL:
    return {
      ...state,
      profile: Object.assign({}, state.profile, action.profile),
    };
  case GETMESSAGE_FUL:
      console.log(action)
      return state;
  default:
    return state;
  }
};

export default profileReducer;
