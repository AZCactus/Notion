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
      type     : 'signup',
      firstName: '',
      lastName : '',
      email    : '',
      username : '',
      password : '',
      display  : false,
      dirty    : false,
    };

    this.submitForm = this.submitForm.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.changeForm = this.changeForm.bind(this);
    this.loginForm = this.loginForm.bind(this);
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
    this.state.lastName, this.state.email, this.state.username, this.state.password);
  }

  loginForm(e) {
    e.preventDefault();
    this.setState({dirty: true});
    this.props.loginUser(this.state.email, this.state.password);
  }

  changeForm(type) {
    this.setState({dirty: false});
    this.setState({type: type});
  }

  handleInput(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  render() {
    const dirty = this.state.dirty;
    let warning = '';

    if (dirty) warning = 'Password or Email is Invalid';

    return (
      <ReactTransitionGroup
      transitionName="slideIn"
      transitionAppear={true}
      transitionAppearTimeout={500}
      transitionEnterTimeout={500}
      transitionLeaveTimeout={500}>
        <div className={`form-container ${this.state.type}`} >
          {this.state.type === 'signup' ?
            <Signup submitForm={this.submitForm}
                    changeForm={this.changeForm}
                    handleInput={this.handleInput}
                    warning={warning} />
                    :
            <Login loginForm={this.loginForm}
                  handleInput={this.handleInput}
                  changeForm={this.changeForm}
                  warning={warning} />
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
  loginUser       : (email, password) => dispatch(loginUser(email, password)),
  checkLoginStatus: () => dispatch(checkLoginStatus())
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupContainer);
