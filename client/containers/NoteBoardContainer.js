
  import React, { Component } from 'react';
  import {bindActionCreators, compose} from 'redux';
  import {DropTarget} from 'react-dnd';
  import {connect} from 'react-redux';
  import { browserHistory } from 'react-router';
  import {NOTE} from '../constants';
  import NoteWrapper from '../components/NoteWrapper';
  import DraggableNote from '../components/DraggableNote';
  import snapToGrid from '../components/snapToGrid';
  import {moveNote, participantMoveNote, addNoteToBoard, noteMover, IndexToZIndex} from '../actions/note';
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


  const noteTarget = {
    drop(props, monitor, component) {

      const delta = monitor.getDifferenceFromInitialOffset();
      const item = monitor.getItem();

      let left = Math.round(item.left + delta.x);
      let top = Math.round(item.top + delta.y);
      if (props.snapToGrid) {
        [ left, top ] = snapToGrid(left, top);
      }

      console.log('OLD COORD', item.id, item.left, item.top, 'NEW COORDS', item.id, left, top);

      props.IndexToZIndex(props.notes, item.id);
      props.noteMover(item.id, left, top);
      // const newdata = {[item.id]: {left, top}};

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


    componentWillUnmount() {
      this.props.clearSocketListeners();
      this.props.socketDisconnect();
    }


    renderNote(item, key, index) {

      return (
        <DraggableNote key={key} id={key} {...item}>{item.content}</DraggableNote>
      );
    }

    render() {


      const {movedNote, notes, connectDropTarget} = this.props;

      return connectDropTarget(
      <div style={styles}>
        {
          notes.map((note) => {
            return this.renderNote(note, note.id);
          }
      )}
      <div className="nb button">
      </div>
      </div>
    );
    }
}

  const mapStateToProps = (state, ownProps) => {

    return {
      notes: state.noteReducer.all.filter(note => {
        return ownProps.board.id === note.board_id;
      }),
      user       : state.userReducer.loggedInUser,
      zIndexNotes: state.noteReducer.zIndexNotes,
      dragged    : state.noteReducer.selected
    };

  };

  const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({noteMover, participantMoveNote, socketConnect, socketEmit, clearSocketListeners, socketDisconnect, addSocketListener, addNoteToBoard, IndexToZIndex}, dispatch);
  };

  export default flow(DropTarget(NOTE, noteTarget, collect
), connect(mapStateToProps, mapDispatchToProps))(NoteBoardContainer)
;
