import axios from 'axios';

import {RECEIVE_COMMENT, ADD_NEW_COMMENT} from '../constants';

export const receiveComments = (comment) => {
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

export const createComment = (text, noteId, userId) => {
  console.log('action post create comment:', text, noteId, userId);
  return dispatch => {
    return axios.post('/api/comment/', {text, noteId, userId})
      .then((res) => res.data)
      .then((comment) => {
        dispatch(addNewComment(comment, noteId));
      });
  };
};

export const getComments = () => {
  return dispatch => {
    return axios.get('/api/comment/')
      .then((res) => {
        dispatch(receiveComments(res.data));
      });
  };
};
