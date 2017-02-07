
  import React, { Component } from 'react';
  import {bindActionCreators, compose} from 'redux';
  import {DropTarget} from 'react-dnd';
  import {connect} from 'react-redux';
  import { browserHistory } from 'react-router';
  import axios from 'axios';
  import {NOTE} from '../constants';
  import NoteWrapper from '../components/NoteWrapper';
  import DraggableNote from '../components/DraggableNote';
  import snapToGrid from '../components/snapToGrid';
  import {moveNote, participantMoveNote, addNoteToBoard, noteMover, IndexToZIndex, notesDelete} from '../actions/note';
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
  import TrashCan from '../components/NoteBoardTrashCan';

  const styles = {
    height  : 1000,
    width   : 1000,
    position: 'relative'
  };

  const trashStyles = {
    top : 900,
    left: 900
  };


  const noteTarget = {
    drop(props, monitor, component) {

      const delta = monitor.getDifferenceFromInitialOffset();
      const item = monitor.getItem();
      if (delta === null) {
        return;
      } else {
        let left = Math.round(item.left + delta.x);
        let top = Math.round(item.top + delta.y);
        if (props.snapToGrid) {
          [ left, top ] = snapToGrid(left, top);
        }
        props.IndexToZIndex(props.notes, item.id);
        props.noteMover(item.id, left, top);
      // const newdata = {[item.id]: {left, top}};
      }
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
      this.deleteNotesFromDatabase = this.deleteNotesFromDatabase.bind(this);
    }

    componentWillMount() {
      this.props.socketConnect('board');
      this.props.addSocketListener('note', this.boardUpdate);
      this.props.addSocketListener('moveNote', this.participantMoveNote);

    }

    deleteNotesFromDatabase() {
      this.props.deletedNotes.forEach(note => {
        axios.delete(`/api/notes/${note.id}`)
          .then((deleted) => (console.log('DELETED NOTES', deleted)))
          .catch(err => console.log('deleteNotes from datatbase had an error'));

      });
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
      this.deleteNotesFromDatabase();
    }


    renderNote(item, key, index) {

      return (
        <DraggableNote key={key} id={key} {...item}>{item.content}</DraggableNote>
      );
    }

    render() {

      const {notesDelete, movedNote, notes, connectDropTarget} = this.props;
      return connectDropTarget(
      <div style={styles}>
        {
          notes.map((note) => {
            return this.renderNote(note, note.id);
          }
      )}
      <div className="trashcan">
          <TrashCan style={trashStyles} notesDelete={notesDelete} notes={notes}/>
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
      user        : state.userReducer.loggedInUser,
      zIndexNotes : state.noteReducer.zIndexNotes,
      deletedNotes: state.noteReducer.deletedNotes
    };

  };

  const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({noteMover, notesDelete, participantMoveNote, socketConnect, socketEmit, clearSocketListeners, socketDisconnect, addSocketListener, addNoteToBoard, IndexToZIndex}, dispatch);
  };

  export default flow(DropTarget(NOTE, noteTarget, collect
), connect(mapStateToProps, mapDispatchToProps))(NoteBoardContainer)
;
