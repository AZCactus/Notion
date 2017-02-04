import { checkLoginStatus,
        setLoginUser,
        removeLoginUser,
        createUser,
        loginUser,
        logoutUser } from '../../actions/user';
import * as types from '../../constants/';
import chai, { expect, should } from 'chai';
import moxios from 'moxios';
import axios from 'axios';
import { spy } from 'sinon';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('user actions', () => {

  let input;

  beforeEach(() => {
    input = {};
    axios.defaults.adapter = require('axios/lib/adapters/http');
    moxios.install;
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('set login user', () => {
    const user = {id: 1, first_name: 'Alvin', last_name: 'Yuen', email: 'alvin@yuen.com'};
    const expectedAction = {
      type: types.SET_LOGIN_USER,
      user
    };
    expect(setLoginUser(user)).to.deep.equal(expectedAction);
  });

  it('remove login user', () => {
    expect(removeLoginUser()).to.deep.equal({ type: types.REMOVE_LOGIN_USER });
  });

  describe('async actions', () => {

    let dispatch;

    beforeEach(() => {
      input = {};
      axios.defaults.adapter = require('axios/lib/adapters/http');
      moxios.install;

      dispatch = spy();
    });

    afterEach(() => {
      moxios.uninstall();
      nock.cleanAll();
    });

    const response = {
      id        : 1,
      first_name: 'Alvin',
      last_name : 'Yuen',
      email     : 'alvin@alvin.com'
    };

    it('should dispatch SET_LOGIN_USER action when we check for login status of user', () => {

          const checkLoginRequest = nock('http://localhost')
              .get('/api/auth/')
              .reply(200, response);

      return checkLoginStatus()(dispatch)
        .then(() => {
          expect(dispatch).to.have.been.calledOnce;
          expect(dispatch.args[0][0].type).to.equal(types.SET_LOGIN_USER);
          expect(dispatch.args[0][0].user).to.deep.equal(response);
        });
    });

    it('should dispatch SET_LOGIN_USER action when we sign up a new user', () => {
        const createUserRequest = nock('http://localhost')
              .log(console.log)
              .post('/api/user/', {
                first_name: 'Alvin',
                last_name : 'Yuen',
                email     : 'alvin@yuen.com',
                password  : 12345})
              .reply(200, response);

      return createUser('Alvin', 'Yuen', 'alvin@yuen.com', 12345)(dispatch)
        .then(() => {
          expect(dispatch).to.have.been.calledOnce;
          expect(dispatch.args[0][0].type).to.equal(types.SET_LOGIN_USER);
          expect(dispatch.args[0][0].user).to.deep.equal(response);
        });
    });

    it('should dispatch correct SET_LOGIN_USER action when new user logs in', () => {
      const loginUserRequest = nock('http://localhost')
        .log(console.log)
        .post('/api/auth/', {
          email   : 'alvin@yuen.com',
          password: 12345
        })
        .reply(200, response);

        return loginUser('alvin@yuen.com', 12345)(dispatch)
          .then(() => {
            expect(dispatch).to.have.been.calledOnce;
            expect(dispatch.args[0][0].type).to.equal(types.SET_LOGIN_USER);
            expect(dispatch.args[0][0].user).to.deep.equal(response);
          });
    });

    it('should dispatch REMOVE_LOGIN_USER when a user logs out', () => {
      const logoutUserRequest = nock('http://localhost')
      .log(console.log)
      .delete('/api/auth/')
      .reply(200, response);
      return logoutUser()(dispatch)
        .then(() => {
          expect(dispatch).to.have.been.calledOnce;
          expect(dispatch.args[0][0].type).to.equal(types.REMOVE_LOGIN_USER)
        });
    });



  });



});
