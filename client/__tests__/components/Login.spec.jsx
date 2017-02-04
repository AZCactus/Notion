import React from 'react';
import chai, { expect } from 'chai';
import {shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import { spy } from 'sinon';

import Login from '../../components/Login';

chai.use(chaiEnzyme());

describe ('<Login />', () => {
  let loginWrapper, sendLoginSpy, handleInputSpy, loginFormSpy;

  beforeEach(('create spy to pass in component', () => {
    sendLoginSpy = spy();
    handleInputSpy = spy();
    loginFormSpy = spy();
  }));

  beforeEach(() => {
    loginWrapper = shallow(
      <Login
      changeForm={sendLoginSpy}
      handleInput={handleInputSpy}
      loginForm={loginFormSpy} />);
  });

  it('signup link in login page should work', () => {
    loginWrapper.find('.signup-link').simulate('click');
    expect(sendLoginSpy.called).to.be.true;
  });

  it('should handle email input changes in login component', () => {
    const email = 'alvin@alvin.com';
    const loginInput = loginWrapper.find('#login-email-input-field');
    loginInput.simulate('change', {target: {value: email}});
    expect(handleInputSpy.called).to.be.true;
    expect(handleInputSpy.args[0][0].target.value).to.equal('alvin@alvin.com');
  });

  it('should handle password input changes in login component', () => {
    const password = 12345;
    const passwordInput = loginWrapper.find('#login-password-input-field');
    passwordInput.simulate('change', {target: {value: password}});
    expect(handleInputSpy.called).to.be.true;
    expect(handleInputSpy.args[0][0].target.value).to.equal(12345);
  });

  it('should handle submit when user logins in as a user', () => {
    const loginSubmit = loginWrapper.find('.form');
    loginSubmit.simulate('submit');
    expect(loginFormSpy.called).to.be.true;
  });
});
