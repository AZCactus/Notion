
import {ADD_NEW_COMMENT, RECEIVE_COMMENTS } from '../constants';


const initState = {
  comments: [],
};

export default function commentsReducer(state = initState, action) {
  const nextState = Object.assign({}, state);

  switch (action.type) {
  case RECEIVE_COMMENTS:
    nextState.comments = action.comments;
    break;

  case ADD_NEW_COMMENT:
    nextState.comments = [ ...nextState.comments, action.comment ];
    break;

  default:
    return state;
  }

  return nextState;
}
