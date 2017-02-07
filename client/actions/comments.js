
import { ADD_COMMENT } from '../constants';
import axios from 'axios';

export const addComment = (comment, noteId) => ({
  type: ADD_COMMENT,
  comment,
  noteId
});

export const commentOnNote = (comment, noteId) => dispatch => {
  return axios.post('/', { comment: comment, noteId: noteId })
    .then(res => {
      // dispatch(addComment());
    }).catch(err => console.error(err));
};

