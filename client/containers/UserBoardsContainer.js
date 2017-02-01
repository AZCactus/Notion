import React, {Component} from 'react';
import store from '../store';
import {connect} from 'react-redux';
import NoteWrapper from '../components/NoteWrapper';
import {getBoardNotes, getBoard} from '../actions/board';


class UserBoardsContainer extends Component {

  render() {
    const boardId = this.props.board.id;
    let boardIdNotes = [];

    if (this.props.notes.length) {
      boardIdNotes = this.props.notes.filter(note => {
        return boardId === note.board_id;
      });

    }

    return (
      <div style={{
        width   : 200,
        height  : 200,
        position: 'relative'}}>
        { boardIdNotes.length ? (
            boardIdNotes.map((note) => {
              const { left, top } = note;
              return (
                <NoteWrapper
                  key={note.id}
                  id={note.id}
                  left={left / 10}
                  top={top / 10}
                  note={note}
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
    notes: state.noteReducer.all,
    board: ownProps.board
  };
};

const mapDispatchToProps = (dispatch, ownProps) => (
  {

  });

export default connect(mapStateToProps, mapDispatchToProps)(UserBoardsContainer);
