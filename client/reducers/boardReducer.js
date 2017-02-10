
import {SET_NOTES_SIZE, RECEIVE_BOARD, RECEIVE_BOARDS, ADD_NEW_BOARD, RECEIVE_BOARD_NOTES, RECEIVE_PERMISSION} from '../constants';


const initialState = {selectedBoard: {}, allBoards: [], selectedBoardNotes: [], permissions: [], notesSize: 0};

export default function(state = initialState, action) {
  const newState = Object.assign({}, state);

  switch (action.type) {

  case RECEIVE_BOARD:
    newState.selectedBoard = action.board;
    break;
  case RECEIVE_BOARDS:
    newState.allBoards = action.boards;
    newState.permissions = action.permissions;
    break;
  case ADD_NEW_BOARD:
    newState.allBoards = [ ...newState.allBoards, action.board ];
    newState.permissions = [ ...newState.permissions, action.permission ];
    break;
  case RECEIVE_PERMISSION:
    newState.permissions = [ ...newState.permissions, action.permission ];
    break;
  case SET_NOTES_SIZE:

    newState.notesSize = action.notesSize;
    break;

  default:
    return state;

  }

  return newState;
}
