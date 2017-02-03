  import React, { Component } from 'react';
  import {bindActionCreators, compose} from 'redux';
  import {DropTarget} from 'react-dnd';
  import {connect} from 'react-redux';
  import { browserHistory } from 'react-router';
  import {NOTE} from '../constants';
  import NoteWrapper from '../components/NoteWrapper';
  import DraggableNote from '../components/DraggableNote';
  import snapToGrid from '../components/snapToGrid';
  import {moveNote, addNoteToBoard, noteMover} from '../actions/note';
  import {setLoginUser} from '../actions/user';
  import {
    socketConnect,
    socketEmit,
    clearSocketListeners,
    socketDisconnect,
    addSocketListener
  } from '../actions/socketio';
  import store from '../store';
  import flow from 'lodash/flow';
  import isEmpty from 'lodash/isEmpty';
  import {genShortHash} from '../utils/stringHash';

  const styles = {
    height  : 1000,
    width   : 1000,
    position: 'relative'
  };

  const queStyles = {
    height  : 100,
    width   : 1000,
    color   : '#FD543D',
    position: 'relative',
  };

  const noteTarget = {
    drop(props, monitor, component) {
      const delta = monitor.getDifferenceFromInitialOffset();
      const item = monitor.getItem();

      let left = Math.round(item.left + delta.x);
      let top = Math.round(item.top + delta.y);
      if (props.snapToGrid) {
        [ left, top ] = snapToGrid(left, top);
      }

      props.noteMover(item.id, left, top);


    },
  };

  const collect = (connector, monitor) => {

    return {
      connectDropTarget: connector.dropTarget(),
      isOver           : monitor.isOver()
    };
  };


  class NoteBoardContainer extends Component {
    constructor(props) {
      super(props);
      this.boardUpdate = this.boardUpdate.bind(this);
      this.participantMoveNote = this.participantMoveNote.bind(this);
    }

    componentWillMount() {
      this.props.socketConnect('board');


      this.props.addSocketListener('note', this.boardUpdate);
      this.props.addSocketListener('moveNote', this.participantMoveNote);
    }

    boardUpdate(note) {
      console.log('RECEIVED NOTE', note);
      console.log('BOARD ID', this.props.board.id);
      if (note.board_id === this.props.board.id) {
        store.dispatch(addNoteToBoard(note));
      }
    }

    participantMoveNote(data) {
      const key = Object.keys(data);
      let left;
      let top;
      const coordObj = data[key];
      for (const coords in coordObj) {
        if (coords === 'left') {
          left = coordObj[coords];
        } else {
          top = coordObj[coords];
        }
      }
      store.dispatch(moveNote(Number(key[0]), left, top));
    }


    componentWillReceiveProps({board, user, note, room}) {
      /* join room is done in participants container instead */
      // if (!this.props.board || isEmpty(this.props.board)) {
      //   return;
      // } else {
      //   this.props.socketEmit('join', {

      //     room: genShortHash(board.id),
      //     name: user.first_name + user.last_name
      //   });
      // }


    }

    componentWillUnmount() {
      this.props.clearSocketListeners();
      this.props.socketDisconnect();
    }


    renderNote(item, key) {

      return (
        <DraggableNote key={key} id={key} {...item} />
      );
    }

    render() {
      const {movedNote, notes, connectDropTarget} = this.props;

      return connectDropTarget(

      <div style={styles}>
        <div style={queStyles}>
        {notes.map(note => {
          return this.renderNote(note, note.id);
        }
      )}
        </div>
      </div>
    );
    }
}

  const mapStateToProps = (state, ownProps) => {

    return {notes: state.noteReducer.all, user: state.userReducer.loggedInUser};

  };

  const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({noteMover, socketConnect, socketEmit, clearSocketListeners, socketDisconnect, addSocketListener, addNoteToBoard}, dispatch);
  };

  export default flow(DropTarget(NOTE, noteTarget, collect
), connect(mapStateToProps, mapDispatchToProps))(NoteBoardContainer)
;
