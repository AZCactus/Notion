import axios from 'axios';
import {SET_NOTE_COORDS, ADD_NOTE_TO_BOARD, RECEIVE_NOTES, RECEIVE_NOTE, SELECT_NOTE, MOVE_NOTE} from '../constants';
import {socketEmit} from './socketio';

export function receiveNote(note) {
  return {
    type   : RECEIVE_NOTE,
    payload: note
  };
}

export function receiveNotes(notes) {
  return {
    type   : RECEIVE_NOTES,
    payload: notes
  };
}

export function selectNote(noteId) {
  return {
    type   : SELECT_NOTE,
    payload: {noteId}
  };
}

export const moveNote = (id, left, top) => {
  return {
    type : MOVE_NOTE,
    notes: {
      [id]: {left, top}
    }
  };
};

export const addNoteToBoard = (note) => {
  return {
    type   : ADD_NOTE_TO_BOARD,
    newNote: note
  };
};


export const setNoteCoords = (note) => {
  return {
    type: ADD_NOTE_TO_BOARD,
    note: note
  };
};


export function getNote(noteId) {
  return (dispatch) =>
  axios.get(`/api/notes/${noteId}`)
    .then(res => res.data)
    .then(note => dispatch(receiveNote(note)))
    .then(note => {
      return Promise.all([
        note,
        dispatch(selectNote(noteId))
      ]);
    })
    .then(([ note ]) => note)
    .catch(err => console.warn(err));
}

export const noteMover = (id, left, top) => {
  const data = {[id]: {left, top}};

  return dispatch => {

    dispatch(moveNote(id, left, top));


    dispatch(socketEmit('moveNote', data));

  };
};


export function getAllNotes({userId, boardId}) {
  return dispatch =>
    axios.get('/api/notes/', {params: {userId, boardId}})
      .then(res => {
        return res.data;
      })
      .then(notes => dispatch(receiveNotes(notes)))
      .catch(err => console.warn(err));
}

export function createNote(note, boardId) {
  return dispatch =>
    axios.post('/api/notes/', {
      content: note.content,
      color  : note.color,
      boardId: boardId || note.boardId
    })
      .then(({data}) => {
        console.log('DISPATCH SOCKET', data);
        dispatch(socketEmit('note', data));
      })
      .catch(err => console.warn(err));
}
