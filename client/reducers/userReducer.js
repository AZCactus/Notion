import {SET_LOGIN_USER, REMOVE_LOGIN_USER, RECEIVE_USER_QUERY} from '../constants';

const initialState = {
  loggedInUser: {},
  queriedUsers: []
};

export default function(state = initialState, action) {
  const newState = Object.assign({}, state);
  switch (action.type) {
  case SET_LOGIN_USER:
    newState.loggedInUser = action.user;
    break;
  case REMOVE_LOGIN_USER:
    newState.loggedInUser = {};
    break;
  case RECEIVE_USER_QUERY:
    newState.queriedUsers = action.payload;
    break;
  default:
    return state;
  }
  return newState;
}
