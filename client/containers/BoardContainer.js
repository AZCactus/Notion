import React, {Component} from 'react';
import store from '../store';
import {connect} from 'react-redux';
import io from 'socket.io-client';
import CustomDragLayerContainer from './CustomDragLayerContainer';
import ParticipantsContainer from './ParticipantsContainer';
import { socketConnect, socketDisconnect, clearSocketListeners } from '../actions/socketio';
import { bindActionCreators } from 'redux';


class BoardContainer extends Component {

  componentDidMount() {
    const { dispatch, board} = this.props;

    const boardId = board.id;


  }

  render() {
    return (
      <div className="col-xs-12" key={ this.props.board.id }>
        <h2 className="text-center">
          <span>{ this.props.board.name }</span>
        </h2>
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


const mapStateToProps = (state) => ({board: state.board.selectedBoard});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({socketConnect, socketDisconnect, clearSocketListeners }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardContainer);
