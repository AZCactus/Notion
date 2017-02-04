  import React, { Component } from 'react';
  import {bindActionCreators, compose} from 'redux';
  import {DropTarget} from 'react-dnd';
  import {connect} from 'react-redux';
  import { browserHistory } from 'react-router';
  import {NOTE} from '../constants';
  import NoteWrapper from '../components/NoteWrapper';
  import DraggableNote from '../components/DraggableNote';
  import snapToGrid from '../components/snapToGrid';
  import {moveNote, addNoteToBoard} from '../actions/note';
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

      props.moveNote(item.id, left, top);


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
    }

    componentWillMount() {
      this.props.socketConnect('board');
      this.props.addSocketListener('note', this.boardUpdate);

    }

    boardUpdate(note) {
      store.dispatch(addNoteToBoard(note));

    }


    componentWillReceiveProps({board, user, note, room}) {

      if (!this.props.board || isEmpty(this.props.board)) {
        return;
      } else {
        this.props.socketEmit('join', {

          room: genShortHash(board.id),
          name: user.first_name + user.last_name
        });
      }

      if (!note) {
        return;
      } else if (note.room === room) {
        this.props.socketEmit('updateBoard', {
          note: note
        });

      }

    }

    componentWillUnmount() {
      console.log('UNMOUNTED');
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

    return {notes: state.noteReducer.all.filter(note => {
      return ownProps.board.id === note.board_id;
    }), user: state.userReducer.loggedInUser};

  };

  const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({moveNote, socketConnect, socketEmit, clearSocketListeners, socketDisconnect, addSocketListener, addNoteToBoard}, dispatch);
  };

  export default flow(DropTarget(NOTE, noteTarget, collect
), connect(mapStateToProps, mapDispatchToProps))(NoteBoardContainer)
;
