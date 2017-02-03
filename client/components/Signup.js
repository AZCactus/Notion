import React from 'react';

const Signup = (props) => {
  return (
     <form className="form" onSubmit={(e) => { props.submitForm(e); }}>
        <div className="">
          <label className="signup-label"> Sign up with your email address </label>
        </div>
        <div className="form-group">
          <input type="text" name="firstName" placeholder="First name"
          className="input signup-input-field"
          id="signup-firstname-input-field"
          onChange={(e) => { props.handleInput(e); }}
          required />
        </div>
        <div className="form-group">
          <input type="text" name="lastName" placeholder="Last name"
          className="signup-input-field"
          id="signup-lastname-input-field"
          onChange={(e) => { props.handleInput(e); }}
          required />
        </div>
        <div className="form-group">
          <input type="email" name="email" placeholder="Email"
          className="signup-input-field"
          id="signup-email-input-field"
          onChange={(e) => { props.handleInput(e); }}
          required />
        </div>
        <div className="form-group">
          <input type="password" name="password" placeholder="Password"
          className="signup-input-field"
          id="signup-password-input-field"
          onChange={(e) => { props.handleInput(e); }}
          required />
        </div>
        <div className="">
          <label className="signup-disclaimer">
          By clicking on Sign up, you agree to notion's terms &
          conditions and privacy policy
          </label>
        </div>
        <button className="signup-submit-button" type="submit">
        SIGN UP
        </button>
         <button className="login-link-container login-link"
         onClick={() => { props.changeForm('login'); }} >
          Already have an account? Login
        </button>
      </form>
      );
};

export default Signup;
