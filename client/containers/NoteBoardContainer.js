
  import React, { Component } from 'react';
  import {bindActionCreators, compose} from 'redux';
  import {DropTarget} from 'react-dnd';
  import {connect} from 'react-redux';
  import { browserHistory } from 'react-router';
  import MediaQuery from 'react-responsive';
  import axios from 'axios';
  import {NOTE} from '../constants';
  import NoteWrapper from '../components/NoteWrapper';
  import DraggableNote from '../components/DraggableNote';
  import snapToGrid from '../components/snapToGrid';
  import {deleteNotesFromDatabase, moveNote, participantMoveNote, addNoteToBoard, noteMover, IndexToZIndex, notesDelete} from '../actions/note';
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
    height  : '150vh',
    width   : '100%',
    border  : '1px black line',
    position: 'relative',

  };


  const noteStyles = {
    height  : '50px',
    width   : '50px',
    fontSize: '.5em',
    position: 'relative',
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
      console.log('safddfhdgfhdfghgdfjgdfhjdhgjghfj');
      this.props.clearSocketListeners();
      this.props.socketDisconnect();
      deleteNotesFromDatabase(this.props.deletedNotes);
    }


    renderNote(item, key) {
      return (
        <DraggableNote key={key} id={key} {...item} showNoteComments={this.props.showNoteComments}>{item.content}</DraggableNote>
      );
    }

    render() {
      const {notesDelete, movedNote, notes, connectDropTarget, board} = this.props;
      let backgroundColor;

      return connectDropTarget(
      <div>
        <MediaQuery query='(min-device-width: 800px)'> {/*view for web*/}
          <div style={styles}>
            { notes.map((note) => {
              return this.renderNote(note, note.id);
            }
          )}


        </div>
          </MediaQuery>

          <MediaQuery query='(max-device-width: 799px)'> {/*view for mobile*/}
            <div style={{marginTop: '70px'}}>

              <ol className='mobileOL'>
              {
              notes.map((note, index) => {
                backgroundColor = note.color.replace(/^#*/, '#');
                return (
                  <li key={`noteboard_${note.id}`} className="mobileListItem col-xs-12"
                    onClick={() => { this.props.showNoteComments(note.color, note.content, note.id); }}>
                    <div className='noteBlock col-xs-2' style={{...noteStyles, backgroundColor}} />
                    <span className='mobileNoteContent col-xs-10'>{note.content}</span>
                  </li>
                );
              })
            }
          </ol>
       </div>
        </MediaQuery>

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
      deletedNotes: state.noteReducer.deletedNotes,

      board: state.board.selectedBoard

    };

  };

  const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({noteMover, notesDelete, participantMoveNote, socketConnect, socketEmit, clearSocketListeners, socketDisconnect, addSocketListener, addNoteToBoard, IndexToZIndex}, dispatch);
  };

  export default flow(DropTarget(NOTE, noteTarget, collect
), connect(mapStateToProps, mapDispatchToProps))(NoteBoardContainer)
;
