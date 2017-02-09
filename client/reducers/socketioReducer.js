import socketClient from 'socket.io-client';
const io =  socketClient;
import isEmpty from 'lodash/isEmpty';


import {CONNECT, EMIT, ADD_LISTENER, REMOVE_LISTENER } from '../constants';

const initialState = {
  events: [],
};

export default function(state = initialState, action) {
  const newState = Object.assign({}, state);
  switch (action.type) {

  case ADD_LISTENER:
    newState.events = [ ...newState.events, action.eventName ];
    break;

  case REMOVE_LISTENER:
    newState.events = [];
    break;

  default:
    return state;
  }

  return newState;
}
