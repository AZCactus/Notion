import React, {Component} from 'react';
import store from '../store';
import {connect} from 'react-redux';
import NoteWrapper from '../components/NoteWrapper';
import {getBoardNotes, getBoard} from '../actions/board';


export class UserBoardsContainer extends Component {

  render() {
    const boardId = this.props.board.id;
    const boardIdNotes = this.props.notes;

    return (
      <div style={{
        // width   : 400,
        height  : 200,
        position: 'relative'}}>
        { boardIdNotes.length ? (
            boardIdNotes.map((note) => {
              const { left, top } = note;
              return (
                <NoteWrapper
                  key={note.id}
                  id={note.id}
                  left={left / 5}
                  top={top / 5}
                  note={note}
                  height={40}
                  width={40}
                />
              );
            })
          ) : null
        }
      </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    notes: state.noteReducer.all.filter(note => {
      return ownProps.board.id === note.board_id;
    }),
    board: ownProps.board
  };
};

const mapDispatchToProps = (dispatch, ownProps) => (
  {

  });

export default connect(mapStateToProps, mapDispatchToProps)(UserBoardsContainer);
