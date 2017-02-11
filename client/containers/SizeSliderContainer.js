import React, {Component} from 'react';
import {connect} from 'react-redux';
import store from '../store';
import {bindActionCreators} from 'redux';
import {changeNoteSize} from '../actions/board';


class SizeSliderContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: props.notesSize
    };
    this.handleSliderChange = this.handleSliderChange.bind(this);

  }


  handleSliderChange(e) {
    const sliderVal = e.target.value;
    e.preventDefault;
    this.setState({
      size: sliderVal
    });

    store.dispatch(changeNoteSize(this.state.size, this.props.board));


  }

  render() {

    return (
    <div>
      <input id="slider" type="range" min="50" max="300" step="25" value={this.state.size}
        onChange={this.handleSliderChange}/>
    </div>
    );

  }
}

const mapStateToProps = (state, ownProps) => {

  return {
    notes: state.noteReducer.all.filter(note => {
      return state.board.selectedBoard.id === note.board_id;
    }),
    board    : state.board.selectedBoard,
    notesSize: state.board.notesSize

  };

};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({changeNoteSize}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SizeSliderContainer)
;
