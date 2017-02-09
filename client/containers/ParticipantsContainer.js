import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { socketConnect,
        socketEmit,
        addSocketListener,
        clearSocketListeners,
        socketDisconnect } from '../actions/socketio';

import Participants from '../components/Participants';

import { genShortHash } from '../utils/stringHash';

import isEmpty from 'lodash/isEmpty';

import {addUserPermission} from '../actions/board';

export class ParticipantsContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      totalParticipants: 0,
      participants     : [],
      display          : true,
    };

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.joined = this.joined.bind(this);
    this.getRoomHash = this.joined.bind(this);
    this.toggleParticipantsMenu = this.toggleParticipantsMenu.bind(this);
  }

  componentWillMount() {
    this.props.socketConnect('board');
    this.props.addSocketListener('connect', this.connect);
    this.props.addSocketListener('disconnect', this.disconnect);
    this.props.addSocketListener('joined', this.joined);
  }

  componentWillUnmount() {
    this.props.socketEmit('leave', {
      room: genShortHash(this.props.selectedBoard.id)});
    this.props.clearSocketListeners();
    this.props.socketDisconnect();
  }

  connect() {
    this.setState({ status: 'connected'});
    // if (isEmpty(this.props.loggedInUser)) {
    //   browserHistory.push('/signup');
    // } else


    if (this.props.selectedBoard && !isEmpty(this.props.selectedBoard)) {
      if (Object.keys(this.props.loggedInUser).length) {

        if (this.props.permissions.findIndex(permission => {
          return permission.board_id === this.props.selectedBoard.id;
        }) === -1) {
          this.props.userPermission(this.props.selectedBoard);
        }
      }
      const participantName = Object.keys(this.props.loggedInUser).length ? this.props.loggedInUser.first_name : 'Guest';
      this.props.socketEmit('join',
        {
          room: genShortHash(this.props.selectedBoard.id),
          name: participantName,
        });
    }
  }

  disconnect() {
    this.setState({ status: 'disconnected'});
  }

  joined({parts, totalParticipants}) {
    const participants = [ {id: 1, name: 'Alvin'}, {id: 1, name: 'Alvin'}, {id: 1, name: 'Alvin'}, {id: 1, name: 'Alvin'}, {id: 1, name: 'Alvin'}, {id: 1, name: 'Alvin'}, {id: 1, name: 'Alvin'}, {id: 1, name: 'Alvin'}, {id: 1, name: 'Alvin'}, {id: 1, name: 'Alvin'}, {id: 1, name: 'Alvin'}, {id: 1, name: 'Alvin'}, {id: 1, name: 'Alvin'}, {id: 1, name: 'Alvin'}, {id: 1, name: 'Alvin'}, {id: 1, name: 'Alvin'}, {id: 1, name: 'Alvin'}, {id: 1, name: 'Alvin'}, {id: 1, name: 'Alvin'} ];
    this.setState({ participants });
    this.setState({ totalParticipants});
  }


  toggleParticipantsMenu() {
    this.setState({display: !this.state.display});
  }

  render() {
    return (
      <Participants
        className="participants-wrapper"
        totalParticipants={this.state.totalParticipants}
        participants={this.state.participants}
        display={this.state.display}
        toggleParticipantsMenu={this.toggleParticipantsMenu} />
    );
  }


}

const mapStateToProps = (state) => ({
  loggedInUser : state.userReducer.loggedInUser,
  socket       : state.socket,
  selectedBoard: state.board.selectedBoard,
  permissions  : state.board.permissions

});

const mapDispatchToProps = (dispatch) => ({
  addSocketListener   : (eventName, method) => { dispatch(addSocketListener(eventName, method)); },
  clearSocketListeners: (eventName, method) => { dispatch(clearSocketListeners(eventName, method)); },
  socketEmit          : (eventName, payload) => { dispatch(socketEmit(eventName, payload)); },
  socketConnect       : (namespace) => { dispatch(socketConnect(namespace)); },
  socketDisconnect    : () => { dispatch(socketDisconnect()); },
  userPermission      : (board) => { dispatch(addUserPermission(board)); }
});

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantsContainer);
