import axios from 'axios';

import {RECEIVE_COMMENT, ADD_NEW_COMMENT} from '../constants';

export const receiveComment = (comment) => {
  return {
    type: RECEIVE_COMMENT,
    comment
  };
};

export const addNewComment = (comment, noteId) => ({
  type: ADD_NEW_COMMENT,
  comment,
  noteId
});

export const createComment = (text, noteId) => {
  return dispatch => {
    return axios.post('/api/comment/', {text, noteId})
      .then((res) => res.data)
      .then((comment) => {
        dispatch(addNewComment(comment, noteId));
      });
  };
};
