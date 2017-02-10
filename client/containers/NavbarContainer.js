import React, {Component} from 'react';
import {connect} from 'react-redux';
import { browserHistory } from 'react-router';
import Navbar from '../components/Navbar';

import { logoutUser } from '../actions/user';
import { toggleClick } from '../actions/navbar';

const mapStateToProps = (state, ownProps) => {
  return {
    user         : state.userReducer.loggedInUser,
    sidebarToggle: state.nav.sidebarToggle,
    board        : state.board.selectedBoard,
    location     : ownProps.location.pathname
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logoutUser: () => {
      dispatch(logoutUser())
        .then(() => browserHistory.push('/signup'));
    },
    toggleSidebar: (field) => dispatch(toggleClick(field))
  };
};

class NB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aria       : false,
      toggleClass: 'navClass navbar-collapse collapse',
      toggleTitle: 'navbar-brand navTitle',
    };
    this.expandNav = this.expandNav.bind(this);
  }

  expandNav() {
    let newToggleClassValue = '';
    let newToggleTitleValue = '';

    if (this.state.toggleClass === 'navClass navbar-collapse collapse') {
      newToggleClassValue = 'navClass navbar-collapse collapse in navToggle';
      newToggleTitleValue = 'navbar-brand navTitle hideTitle';

    } else {
      newToggleTitleValue = 'navbar-brand navTitle';
      newToggleClassValue = 'navClass navbar-collapse collapse';
    }
    this.setState({
      aria       : !this.state.aria,
      toggleClass: newToggleClassValue,
      toggleTitle: newToggleTitleValue
    });
  }

  render() {
    return (
      <Navbar
        aria={this.state.aria}
        expandNav={this.expandNav}
        navClass={this.state.toggleClass}
        titleClass={this.state.toggleTitle}
        user={this.props.user}
        logoutUser={this.props.logoutUser}
        toggleSidebar={this.props.toggleSidebar}
        board={this.props.board}
        location={this.props.location}
      />
    );
  }
}

const NavbarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NB);

export default NavbarContainer;
