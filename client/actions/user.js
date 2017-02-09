import axios from 'axios';
import {browserHistory} from 'react-router';

import { SET_LOGIN_USER, REMOVE_LOGIN_USER, RECEIVE_USER_QUERY } from '../constants' ;


export const setLoginUser = (user) => ({
  type: SET_LOGIN_USER,
  user
});

export const removeLoginUser = () => ({
  type: REMOVE_LOGIN_USER,
});

export const receiveUserQuery = (matchedUsers) => ({
  type   : RECEIVE_USER_QUERY,
  payload: matchedUsers
});

export const createUser = (firstName, lastName, email, username, password) => dispatch => {
  return axios.post('/api/user/', {first_name: firstName, last_name: lastName, username, email, password })
    .then(res => {
      dispatch(setLoginUser(res.data));
    }).catch(err => { console.error(err); return err; });
};

export const loginUser = (email, password) => dispatch => {
  return axios.post('/api/auth/', { email: email, password: password })
    .then(res => {
      dispatch(setLoginUser(res.data));
    }).catch(err => err);
};

export const logoutUser = () => dispatch => {
  return axios.delete('/api/auth/')
    .then(res => dispatch(removeLoginUser(res.data)))
    .catch(err => console.error(err));
};

export const searchUsername = (username) => dispatch => {
  return axios.get('/api/user/', {
    params: {
      searchUsername: username,
      limit         : 6
    }
  })
    .then(res => {
      dispatch(receiveUserQuery(res.data));
    })
    .catch(err => console.error(err));
};

/* check login state by calling server and checking user sessions */
export const checkLoginStatus = () => dispatch => {
  return axios.get('/api/auth/')
    .then(res => {
      return res;
    })
    .then(res => dispatch(setLoginUser(res.data)))
    .catch(err => console.error(err));
};
