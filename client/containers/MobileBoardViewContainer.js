import React, { Component } from 'react';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import { browserHistory, Link } from 'react-router';
import axios from 'axios';
import MediaQuery from 'react-responsive';
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
  height  : '50px',
  width   : '50px',
  border  : '1px solid black',
  position: 'relative',


};


class MobileBoardViewContainer extends Component {
  constructor(props) {
    super(props);
    this.boardUpdate = this.boardUpdate.bind(this);
    // this.participantMoveNote = this.participantMoveNote.bind(this);
    // this.deleteNotesFromDatabase = this.deleteNotesFromDatabase.bind(this);
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

  // participantMoveNote(data) {
  //   const key = Object.keys(data);
  //   let left;
  //   let top;
  //   const coordObj = data[key];
  //   for (const coords in coordObj) {
  //     if (coords === 'left') {
  //       left = coordObj[coords];
  //     } else {
  //       top = coordObj[coords];
  //     }
  //   }
  //   store.dispatch(moveNote(Number(key[0]), left, top));
  // }


  componentWillUnmount() {
    this.props.clearSocketListeners();
    this.props.socketDisconnect();
    this.deleteNotesFromDatabase();
  }


  render() {

    const {notes, board} = this.props;
    console.log('PROPS NOTESasdfadsfads', this.props);
    let backgroundColor;

    return (
      <div>
         <MediaQuery query='(min-device-width: 800px)'>
        <h4 style={{textAlign: 'center'}}>{board.name}</h4>
        <ol>
          {
          notes.map((note, index) => {
            backgroundColor = '#' + note.color;
            return (

            <li key={note.id} className="mobileListItem col-xs-12">

              <div className='noteBlock col-xs-2' style={{...noteStyles, backgroundColor}}/>


              <span className='mobileNoteContent col-xs-10'>{note.content}</span>

            </li>

            );
          })
        }
      </ol>
      <div className="trashcan">
          <TrashCan notesDelete={notesDelete} notes={notes}/>
      </div>
    </MediaQuery>

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
    deletedNotes: state.noteReducer.deletedNotes,
    board       : state.board.selectedBoard
  };

};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({noteMover, notesDelete, participantMoveNote, socketConnect, socketEmit, clearSocketListeners, socketDisconnect, addSocketListener, addNoteToBoard, IndexToZIndex}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileBoardViewContainer)
;
