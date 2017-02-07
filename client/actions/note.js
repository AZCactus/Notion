import axios from 'axios';
import { DELETE_NOTE, NOTE_ARRAY_INDEX_PUSH, SET_NOTE_COORDS, ADD_NOTE_TO_BOARD, RECEIVE_NOTES, RECEIVE_NOTE, SELECT_NOTE, MOVE_NOTE, NOTE_DETAIL} from '../constants';
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

export const selectedNoteDetail = (selectedNoteDetails) => {
  return {
    type: NOTE_DETAIL,
    selectedNoteDetails
  };
};


export const noteArrayIndexPush = (noteArr) => {
  return {
    type       : NOTE_ARRAY_INDEX_PUSH,
    zIndexNotes: noteArr
  };
};

export const addNoteToBoard = (note) => {
  console.log(note);
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

export const deleteNote = (note) => {
  return {
    type       : DELETE_NOTE,
    deletedNote: note
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
    dispatch(socketEmit('moveNote', data));
    dispatch(moveNote(id, left, top));


  };
};


export const IndexToZIndex = (notes, dragNoteId) => {
  return dispatch => {

    const newNoteArr = notes;
    const dragNoteIndex = notes.map((note) => { return note.id; }).indexOf(dragNoteId);
    const dragNote = notes[dragNoteIndex];

    newNoteArr.splice(dragNoteIndex, 1);
    newNoteArr.push(dragNote);

    dispatch(noteArrayIndexPush(newNoteArr));
  };
};

export const notesDelete = (noteId, notes) => {
  return dispatch => {
    const newArr = notes;
    const deleteNoteId = noteId;
    const deleteNoteIndex = notes.map((note) => { return note.id; }).indexOf(deleteNoteId);
    const deletedNote = notes[deleteNoteIndex];

    newArr.splice(deleteNoteIndex, 1);
    dispatch(deleteNote(deletedNote));
    dispatch(receiveNotes(newArr));

  };
};

export const deleteNotesFromDatabase = (deleteNotesArr) => {
  deleteNotesArr.forEach(note => {
    axios.delete(`/api/notes/${note.id}`)
      .then((deleted) => (console.log('DELETED NOTES', deleted)))
      .catch(err => console.log('deleteNotes from datatbase had an error'));

  });
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
        dispatch(socketEmit('note', data));
      })
      .catch(err => console.warn(err));
}
