import axios from 'axios';

import {SET_NOTES_SIZE, RECEIVE_BOARD, RECEIVE_BOARDS, ADD_NEW_BOARD, RECEIVE_BOARD_NOTES, RECEIVE_PERMISSION} from '../constants';

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

export const setNotesSize = (size) => ({
  type     : SET_NOTES_SIZE,
  notesSize: size
});

export const changeNoteSize = (size, board) => {
  const noteSize = size;
  return dispatch => {
    const changedBoard = Object.assign({}, board, {noteSize: size});
    return axios.put(`/api/boards/${board.id}`, {changedBoard})
      .then((updated) => {
        dispatch(setNotesSize(size));
        return updated;
      })
      .then((updated) => console.log('UPDATED Size', updated))
      .catch(err => console.log('ERROR IN Note SIZE UPDATE in Board Action'));
  };


};


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

export const deleteBoard = (boardId) => (dispatch) => {
  return axios.delete(`/api/boards/${boardId}`)
    .then((res) => res.data)
    .then((board) => {
      dispatch(getAllBoards());
    });
};
