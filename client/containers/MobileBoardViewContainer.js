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
  height  : 50,
  width   : 50,
  border  : '1px solid black',
  position: 'relative',


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


  render() {

    const {notes} = this.props;
    console.log('PROPS NOTESasdfadsfads', notes);
    let backgroundColor;

    return (
      <div>
        <ol>
          {
          notes.map((note, index) => {
            backgroundColor = '#' + note.color;
            return (

            <li key={note.id} className="mobileListItem">

              <div style={{...noteStyles, backgroundColor}}>
                    <div style={{textAlign: 'center'}}>{index + 1}</div>
              </div>
              <span>{note.content}</span>

            </li>
            );
          })
        }
      </ol>
      <div className="trashcan">
          <TrashCan notesDelete={notesDelete} notes={notes}/>
      </div>

      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const hash = ownProps.params.boardHash;

  return {
    notes: state.noteReducer.all.filter(note => {

      return hash === genShortHash(note.board_id);
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
