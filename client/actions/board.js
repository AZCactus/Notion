import axios from 'axios';
import {RECEIVE_BOARD, RECEIVE_BOARDS, ADD_NEW_BOARD} from '../constants';


export const receiveBoard = (board) => {
  return {
    type: RECEIVE_BOARD,
    board
  };
};

export const receiveAllBoards = (boards) => ({
  type: RECEIVE_BOARDS,
  boards
});

export const addNewBoard = (board) => ({
  type: ADD_NEW_BOARD,
  board
});

export const getAllBoards = (userId) => {
  return dispatch => {
    axios.get('/api/boards/', {params: {userId}})
      .then((res) => res.data)
      .then((boards) => {
        dispatch(receiveAllBoards(boards));
      });
  };
};

export const createBoard = (boardName) => {
  return dispatch => {
    axios.post('/api/boards/', {boardName})
      .then((res) => res.data)
      .then((board) => {
        dispatch(addNewBoard(board));
      });
  };
};

export const getBoard = (boardId) => (dispatch) => {
  axios.get(`/api/boards/${boardId}`)
    .then((res) => res.data)
    .then((board) => {
      dispatch(receiveBoard(board));
    });
};
