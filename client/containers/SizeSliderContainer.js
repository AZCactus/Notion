import React, {Component} from 'react';
import {connect} from 'react-redux';
import store from '../store';
import {bindActionCreators} from 'redux';
import {setNoteSize} from '../actions/note';


class SizeSliderContainer extends Component {
  constructor(props) {
    super();
    this.state = {
      size: 4
    };
    this.handleSliderChange = this.handleSliderChange.bind(this);
  }


  handleSliderChange(e) {
    const sliderVal = e.target.value;
    e.preventDefault;
    this.setState({
      size: sliderVal
    });

    store.dispatch(setNoteSize(this.state.size, this.props.notes));


  }

  render() {
    console.log('SIZE', this.props);
    return (
    <div>
      <input id="slider" type="range" min="4" max="15" step="1" value={this.state.size} onChange={this.handleSliderChange}/>
    </div>
    );

  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state, ownProps);
  return {
    notes: state.noteReducer.all.filter(note => {
      return state.board.selectedBoard.id === note.board_id;
    }),
    board: state.board.selectedBoard

  };

};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({setNoteSize}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SizeSliderContainer)
;
