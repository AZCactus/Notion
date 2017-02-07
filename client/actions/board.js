import axios from 'axios';

import {RECEIVE_BOARD, RECEIVE_BOARDS, ADD_NEW_BOARD, RECEIVE_BOARD_NOTES, RECEIVE_PERMISSION} from '../constants';

export const receiveBoard = (board) => {
  return {
    type: RECEIVE_BOARD,
    board
  };
};

export const receiveNewPermission = (permission) => {
  return {
    type: RECEIVE_PERMISSION,
    permission
  };
};

export const receiveAllBoards = (boards, permissions) => ({
  type: RECEIVE_BOARDS,
  boards,
  permissions
});

export const addNewBoard = (board, permission) => ({
  type: ADD_NEW_BOARD,
  board,
  permission
});


export const getAllBoards = () => {
  return dispatch => {
    return axios.get('/api/boards/')
      .then((res) => res.data)
      .then((boards) => {
        dispatch(receiveAllBoards(boards.boards, boards.permissions));
      });
  };
};

export const addUserPermission = (board) => {
  return dispatch => {
    return axios.post('/api/boards/permissions', {board})
      .then((res) => res.data)
      .then((permission) => {
        dispatch(receiveNewPermission(permission));
      });
  };
};


export const createBoard = (boardName) => {
  return dispatch => {
    return axios.post('/api/boards', {boardName})
      .then((res) => res.data)
      .then((board) => {
        dispatch(addNewBoard(board.board, board.permission));
      });
  };
};


export const getBoard = (boardHash) => (dispatch) => {
  return axios.get(`/api/boards/${boardHash}`)
    .then((res) => res.data)
    .then((board) => {
      dispatch(receiveBoard(board));
    });
};
