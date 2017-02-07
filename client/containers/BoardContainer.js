import React, {Component} from 'react';
import store from '../store';
import {connect} from 'react-redux';
import io from 'socket.io-client';
import CustomDragLayerContainer from './CustomDragLayerContainer';
import ParticipantsContainer from './ParticipantsContainer';
import { socketConnect, socketDisconnect, clearSocketListeners } from '../actions/socketio';
import { bindActionCreators } from 'redux';
import bindHandlers from '../utils/bindHandlers';
import NoteDetailsContainer from './NoteDetailsContainer';

class BoardContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showNoteDetails: false,
      noteColor      : '',
      content        : '',
    };
    bindHandlers(this,
      this.showNoteComments,
      this.hideNoteComments
    );

  }

  componentWillMount() {
    const { dispatch, board, notes} = this.props;
    const boardId = board.id;

  }

  showNoteComments(color, content) {
    this.setState({showNoteDetails: true});
    this.setState({noteColor: color});
    this.setState({content: content});
  }

  hideNoteComments() {
    this.setState({showNoteDetails: false});
  }



  render() {

    return (
      <div className="col-xs-12 board-page-container" key={ this.props.board.id }>
        {this.state.showNoteDetails ?
          <NoteDetailsContainer
            noteColor={this.state.noteColor}
            content={this.state.content}
            hideNoteComments={this.hideNoteComments}
          /> : null}
        <span className="text-center">
          <h2>{ this.props.board.name }</h2>
          <div>http://localhost:3030/note?={this.props.board.hash}</div>
        </span>
          <div>
            <div className="screen col-xs-12">
              <CustomDragLayerContainer {...this.props} showNoteComments={this.showNoteComments}/>
            </div>
          </div>
          <ParticipantsContainer />
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  board: state.board.selectedBoard,
  notes: state.noteReducer.all});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({socketConnect, socketDisconnect, clearSocketListeners }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardContainer);
