import React from 'react';

const Login = (props) => {
  return (
     <form className="form" onSubmit={(e) => { props.loginForm(e); }}>
        <div className="">
          <label className="login-label"> Login with your email address </label>
        </div>
        <div className="form-group">
          <input type="email" name="email" placeholder="E-mail"
          className="signup-input-field"
          id="login-email-input-field"
          onChange={(e) => { props.handleInput(e); }}
          required />
        </div>
        <div className="form-group">
          <input
          type="password"
          name="password"
          placeholder="password"
          className="signup-input-field"
          id="login-password-input-field"
          onChange={(e) => { props.handleInput(e); }}
          required />
        </div>
        <button className="login-submit-button" type="submit">
        Login
        </button>
        <button className="signup-link-container signup-link"
         onClick={() => { props.changeForm('signup'); }} >
          Don't have an account? Signup
        </button>
      </form>
      );
};

export default Login;
