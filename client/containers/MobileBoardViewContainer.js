import React, { Component } from 'react';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import { browserHistory } from 'react-router';
import axios from 'axios';
import {NOTE} from '../constants';
import NoteWrapper from '../components/NoteWrapper';
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


const noteStyles = {
  height  : 100,
  width   : 100,
  position: 'relative'
};


class MobileBoardViewContainer extends Component {
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
      <div>
        <li>
      <NoteWrapper key={key} id={key} {...item}>{item.content}</NoteWrapper>
        </li>
      </div>

    );
  }

  render() {

    const {notes} = this.props;

    return (
      <div>
        <ul>
          {
          notes.map((note) => {
            return this.renderNote(note, note.id);
          })
        }
      </ul>
      <div className="trashcan">
          <TrashCan notesDelete={notesDelete} notes={notes}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(MobileBoardViewContainer)
;
