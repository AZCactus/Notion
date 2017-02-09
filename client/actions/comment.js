import axios from 'axios';

import {RECEIVE_COMMENTS, ADD_NEW_COMMENT} from '../constants';

export const receiveComments = (comments) => {
  return {
    type: RECEIVE_COMMENTS,
    comments
  };
};

export const addNewComment = (comment, noteId) => ({
  type: ADD_NEW_COMMENT,
  comment
});

export const createComment = (text, noteId, userId) => {
  console.log('USER ID', userId);
  return dispatch => {
    return axios.post('/api/comment/', {text, noteId, userId})
      .then((res) => res.data)
      .then((comment) => {
        dispatch(addNewComment(comment));
      })
      .catch(err => console.error(err));
  };
};

export const getComments = (noteId) => {
  return dispatch => {
    return axios.get(`/api/comment/${noteId}`)
      .then((res) => {
        dispatch(receiveComments(res.data));
      })
      .catch(err => console.error(err));
  };
};
