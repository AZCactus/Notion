import React from 'react';
import chai, { expect } from 'chai';
import {shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import { spy } from 'sinon';

import Signup from '../../components/Signup';

chai.use(chaiEnzyme());

describe('<Signup />', () => {
  let signupWrapper, loginLinkSpy, handleInputSpy, submitFormSpy;

  beforeEach(('create spies to pass in component', () => {
    loginLinkSpy = spy();
    handleInputSpy = spy();
    submitFormSpy = spy();
  }));

  beforeEach(() => {
    signupWrapper = shallow(
      <Signup
    changeForm={loginLinkSpy}
    handleInput={handleInputSpy}
    submitForm={submitFormSpy}/>);
  });

  it('login link in signup page should work', () => {
    signupWrapper.find('.login-link').simulate('click');
    expect(loginLinkSpy.called).to.be.true;
  });

  it('should handle first name input field changes in signup component', () => {
    const firstNameInput = 'Alvin';
    const firstNameInputField = signupWrapper.find('#signup-firstname-input-field');
    firstNameInputField.simulate('change', {target: {value: firstNameInput}});
    expect(handleInputSpy.called).to.be.true;
    expect(handleInputSpy.args[0][0].target.value).to.equal('Alvin');
  });

  it('should handle last name input field changes in signup component', () => {
    const lastNameInput = 'Yuen';
    const lastNameInputField = signupWrapper.find('#signup-lastname-input-field');
    lastNameInputField.simulate('change', {target: {value: lastNameInput}});
    expect(handleInputSpy.called).to.be.true;
    expect(handleInputSpy.args[0][0].target.value).to.equal('Yuen');
  });

  it('should handle email input field changes in signup component', () => {
    const emailInput = 'alvin@yuen.com';
    const emailInputField = signupWrapper.find('#signup-email-input-field');
    emailInputField.simulate('change', {target: {value: emailInput}});
    expect(handleInputSpy.called).to.be.true;
    expect(handleInputSpy.args[0][0].target.value).to.equal('alvin@yuen.com');
  });

  it('should handle email input field changes in signup component', () => {
    const passwordInput = 12345;
    const passwordInputField = signupWrapper.find('#signup-password-input-field');
    passwordInputField.simulate('change', {target: {value: passwordInput}});
    expect(handleInputSpy.called).to.be.true;
    expect(handleInputSpy.args[0][0].target.value).to.equal(12345);
  });

  it('should handle submit when user signups as new user', () => {
    const signupSubmit = signupWrapper.find('.form');
    signupSubmit.simulate('submit');
    expect(submitFormSpy.called).to.be.true;
  });
});

