import { ADD_COMMENT, RECEIVE_COMMENTS } from '../constants';

const initialState = {
  comments: [],
};

export default function(state = initialState, action) {
  const newState = Object.assign({}, state);
  switch (action.type) {
  case ADD_COMMENT:
    newState.comments = [ ...newState, newState.comment ];
    break;
  case RECEIVE_COMMENTS:
    newState.comments = action.comments;
    break;
  default:
    return state;
  }
  return newState;
}
