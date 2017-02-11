import React, { Component} from 'react';
import {connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import NoteBoardContainer from './NoteBoardContainer';
import CustomDragLayer from '../components/CustomDragLayer';
import TrashCan from '../components/NoteBoardTrashCan';
import {deleteNotesFromDatabase, notesDelete} from '../actions/note';


const trashStyles = {

  position: 'relative'
};

class CustomDragLayerContainer extends Component {
  constructor(props) {
    super(props);

    // this.handleSnapToGridAfterDropChange = this.handleSnapToGridAfterDropChange.bind(this);
    this.handleSnapToGridWhileDraggingChange = this.handleSnapToGridWhileDraggingChange.bind(this);

    this.state = {
      snapToGridAfterDrop    : true,
      snapToGridWhileDragging: false,
    };
  }

  componentWillUnmount() {

    deleteNotesFromDatabase(this.props.deletedNotes);
  }


  render() {
    const { snapToGridAfterDrop, snapToGridWhileDragging } = this.state;
    const {notesDelete, notes} = this.props;

    const {board, notesSize} = this.props;


    return (
      <div>
        <NoteBoardContainer snapToGrid={snapToGridAfterDrop} board={board} showNoteComments={this.props.showNoteComments} notesSize={notesSize}/>
        <CustomDragLayer snapToGrid={snapToGridWhileDragging} board={board} notesSize={notesSize}/>
        <div className="snapTo">
        <p>
          <label htmlFor="snapToGridWhileDragging" >
            <input
              id="snapToGridWhileDragging"
              type="checkbox"
              checked={snapToGridWhileDragging}
              onChange={this.handleSnapToGridWhileDraggingChange}
            />
          <small>&nbsp;&nbsp;snap to grid</small>
          </label>
          <br />

        </p>
      </div>
        <div className='trashcan'>
            <TrashCan style={trashStyles} notesDelete={notesDelete} notes={notes}/>
        </div>


      </div>
    );
  }

  // handleSnapToGridAfterDropChange() {
  //   this.setState({
  //     snapToGridAfterDrop: !this.state.snapToGridAfterDrop,
  //
  //   });
  // }

  handleSnapToGridWhileDraggingChange() {
    this.setState({
      snapToGridWhileDragging: !this.state.snapToGridWhileDragging,
    });
  }
}


const mapStateToProps = (state, ownProps) => {


  return {
    notes: state.noteReducer.all.filter(note => {

      return ownProps.board.id === note.board_id;
    }),
    deletedNotes: state.noteReducer.deletedNotes,

    board    : state.board.selectedBoard,
    notesSize: state.board.notesSize

  };

};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ notesDelete}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomDragLayerContainer);
