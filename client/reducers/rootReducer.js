import {CLEAR_STORE} from '../constants';
import {combineReducers} from 'redux';
import board from './boardReducer';
import noteReducer from './noteReducer';
import userReducer from './userReducer';
import navbarReducer from './navbarReducer';
import commentsReducer from './commentsReducer';
import socket from './socketioReducer';


export const combinedReducer = combineReducers({
  board,
  noteReducer,
  userReducer,
  nav: navbarReducer,
  socket,
  commentsReducer

});

export default function rootReducer(store, action) {
  if (action.type === CLEAR_STORE) return combinedReducer();

  return combinedReducer(store, action);
}
