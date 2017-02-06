import React, {Component} from 'react';
import store from '../store';
import {connect} from 'react-redux';
import io from 'socket.io-client';
import CustomDragLayerContainer from './CustomDragLayerContainer';
import ParticipantsContainer from './ParticipantsContainer';
import { socketConnect, socketDisconnect, clearSocketListeners } from '../actions/socketio';
import { bindActionCreators } from 'redux';


class BoardContainer extends Component {

  componentWillMount() {
    const { dispatch, board, notes} = this.props;
    const boardId = board.id;

  }

  render() {

    return (
      <div className="col-xs-12" key={ this.props.board.id }>
        <span className="text-center">
          <h2>{ this.props.board.name }</h2>
          <div>http://localhost:3030/note?={this.props.board.hash}</div>
        </span>
          <div>
            <div className="screen col-xs-12">
              <CustomDragLayerContainer {...this.props}/>
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
