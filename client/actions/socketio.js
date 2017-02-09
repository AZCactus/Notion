
import { CONNECT, ADD_LISTENER, REMOVE_LISTENER, EMIT } from '../constants';
import socketClient from 'socket.io-client';
const io =  socketClient;


import isEmpty from 'lodash/isEmpty';

let socket = {};

export const addListener = (eventName) => ({
  type: ADD_LISTENER,
  eventName
});

export const clearAllListeners = () => ({
  type: REMOVE_LISTENER
});


//need to change to ip address where board resides

export const socketConnect = (namespace) => dispatch => {
  socket = io(`/${namespace}`);
};

export const socketEmit = (eventName, payload) => dispatch => {
  if (!isEmpty(socket)) {
    socket.emit(eventName, payload);
  }
};

export const addSocketListener = (eventName, method) => dispatch => {
  if (!isEmpty(socket)) {
    socket.on(eventName, method);
    dispatch(addListener(eventName));
  }
};

export const clearSocketListeners = () => (dispatch, getState) => {
  if (!isEmpty(socket)) {
    const events =  getState().socket.events;
    events.forEach(e => {
      console.log(e);
      socket.removeListener(e);
    });
  }
  dispatch(clearAllListeners());
};

export const socketDisconnect = () => (dispatch) => {
  console.log('DISCONNECT');
  if (socket.disconnect) socket.disconnect();
};
