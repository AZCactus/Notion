import React, { Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {createUser, loginUser, checkLoginStatus} from '../actions/user';
import Signup from '../components/Signup';
import Login from '../components/Login';
import isEmpty from 'lodash/isEmpty';

export class SignupContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type     : 'signup',
      firstName: '',
      lastName : '',
      email    : '',
      password : '',
    };

    this.submitForm = this.submitForm.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.changeForm = this.changeForm.bind(this);
    this.loginForm = this.loginForm.bind(this);
  }

  componentDidMount() {
    this.props.checkLoginStatus();
  }

  componentWillReceiveProps(props, nextProps) {
    if (!isEmpty(props.loggedInUser)) {
      this.props.router.push('/');
    }
  }

  submitForm(e) {
    e.preventDefault();
    this.props.createUser(this.state.firstName,
    this.state.lastName, this.state.email, this.state.password);
  }

  loginForm(e) {
    e.preventDefault();
    this.props.loginUser(this.state.email, this.state.password);
  }

  changeForm(type) {
    this.setState({type: type});
  }

  handleInput(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  render() {
    return (
      <div className="signup-form-container">
        {this.state.type === 'signup' ?
          <Signup submitForm={this.submitForm}
                   changeForm={this.changeForm}
                   handleInput={this.handleInput} />
                   :
          <Login loginForm={this.loginForm}
                handleInput={this.handleInput}
                changeForm={this.changeForm} />
        }
    </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedInUser: state.userReducer.loggedInUser
});

const mapDispatchToProps = (dispatch) => ({
  createUser: (firstName, lastName, email, password) =>
  dispatch(createUser(firstName, lastName, email, password)),
  loginUser       : (email, password) => dispatch(loginUser(email, password)),
  checkLoginStatus: () => dispatch(checkLoginStatus())
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupContainer);
