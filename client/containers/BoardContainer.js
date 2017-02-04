import React, {Component} from 'react';
import store from '../store';
import {connect} from 'react-redux';
import io from 'socket.io-client';
import CustomDragLayerContainer from './CustomDragLayerContainer';
import {getAllNotes} from '../actions/note';


class BoardContainer extends Component {

  componentWillMount() {

    const { dispatch, board} = this.props;

    const boardId = board.id;
    // store.dispatch(getAllNotes({boardId}));
    // console.log('notes before render', this.props.notes);
    // console.log('board before render', boardId);


  }

  render() {
    // console.log('notes after render', this.props.notes);
    // console.log('board after render', this.props.board);
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
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  board: state.board.selectedBoard,
  notes: state.noteReducer.all});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(BoardContainer);
