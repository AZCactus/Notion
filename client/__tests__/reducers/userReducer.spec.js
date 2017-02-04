import userReducer from '../../reducers/userReducer'
import * as types from '../../constants/';
import chai, {expect} from 'chai';

describe('user reducer', () => {
  it('should return the initial state', () => {
    expect(userReducer(undefined, {}))
      .to
      .deep
      .equal({loggedInUser: {}});
  });

  it('should handle SET_LOGIN_USER and return logged in user obj', () => {
    expect(userReducer(undefined, {
      type: types.SET_LOGIN_USER,
      user: {
        id  : 1,
        name: 'Alvin'
      }
    }))
      .to
      .deep
      .equal({
        loggedInUser: {
          id  : 1,
          name: 'Alvin'
        }
      });
  });

  it('should handle REMOVE_LOGIN_USER and return empty user obj', () => {
    expect(userReducer({loggedInUser: {id: 1, name: 'Alvin'}}, {
      type: types.REMOVE_LOGIN_USER
    }))
      .to
      .deep
      .equal({
        loggedInUser: {}
      });
  });

});


