import React, { Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {createUser, loginUser, checkLoginStatus} from '../actions/user';
import Signup from '../components/Signup';
import Login from '../components/Login';

import isEmpty from 'lodash/isEmpty';
import ReactTransitionGroup from 'react-addons-css-transition-group';


export class SignupContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type       : 'signup',
      firstName  : '',
      lastName   : '',
      email      : '',
      username   : '',
      password   : '',
      display    : false,
      dirty      : false,
      wobbleError: ''
    };

    this.submitForm = this.submitForm.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.changeForm = this.changeForm.bind(this);
    this.loginForm = this.loginForm.bind(this);
    this.wobbler = this.wobbler.bind(this);
  }

  componentDidMount() {
    this.props.checkLoginStatus();
    this.setState({display: true});
  }

  componentWillReceiveProps(props, nextProps) {
    if (!isEmpty(props.loggedInUser)) {
      this.props.router.push('/boards');
    }
  }

  submitForm(e) {
    e.preventDefault();
    this.props.createUser(this.state.firstName,
    this.state.lastName, this.state.email, this.state.username, this.state.password)
      .then(result => {
        if (result && result.message === 'Request failed with status code 409') {
          this.setState({dirty: true});
          this.wobbler();
        }
      });
  }

  loginForm(e) {
    e.preventDefault();
    this.props.loginUser(this.state.email, this.state.password, this);
  }

  changeForm(type) {
    this.setState({type: type});
    this.setState({dirty: false});
  }

  handleInput(e) {
    this.setState({[e.target.name]: e.target.value});
  }
  wobbler() {
    this.setState({wobbleError: 'hvr-wobble-horizontal'});

    setTimeout(() => {
      this.setState({wobbleError: ''});
    }, 1000);
  }

  render() {
    const dirty = this.state.dirty;
    let warning = '';

    if (dirty && this.state.type === 'login') {
      warning = 'Password or Email is Invalid';
    } else if (dirty && this.state.type === 'signup') {
      warning = 'Username or Email is Unavailable';
    }

    return (
      <ReactTransitionGroup
      transitionName="slideIn"
      transitionAppear={true}
      transitionAppearTimeout={500}
      transitionEnterTimeout={500}
      transitionLeaveTimeout={500}>
        <div className={`form-container ${this.state.type} ${this.state.wobbleError}`} >
          {this.state.type === 'signup' ?
            <Signup submitForm={this.submitForm}
                    changeForm={this.changeForm}
                    handleInput={this.handleInput}
                    warning={warning}
                    wobbler={this.wobbler}
                    wobbleError={this.state.wobbleError}/>
                    :
            <Login loginForm={this.loginForm}
                  handleInput={this.handleInput}
                  changeForm={this.changeForm}
                  warning={warning}
                  wobbler={this.wobbler}
                  wobbleError={this.state.wobbleError}/>
          }
        </div>
    </ReactTransitionGroup>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedInUser: state.userReducer.loggedInUser
});

const mapDispatchToProps = (dispatch) => ({
  createUser: (firstName, lastName, email, username, password) =>
  dispatch(createUser(firstName, lastName, email, username, password)),
  loginUser: (email, password, state) => {
    dispatch(loginUser(email, password))
    .then(res => {
      if (res) {
        state.setState({dirty: true});
        state.wobbler();
      }
    });
  },
  checkLoginStatus: () => dispatch(checkLoginStatus())
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupContainer);
