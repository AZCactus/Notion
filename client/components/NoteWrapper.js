import React, { Component, PureComponent } from 'react';
import { DragSource } from 'react-dnd';
import {NOTE} from '../constants';
import Note from './Note';
import {shallowEqual} from './ShouldCompUpdate';
import NoteWrapperModalContainer from '../containers/NoteWrapperModalContainer';
import bindHandlers from '../utils/bindHandlers';

const noteSource = {
  beginDrag(props) {
    const { id, left, top } = props;
    return { id, left, top };
  },
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging       : monitor.isDragging()
});

const initState = {
  focused: false
};

class NoteWrapper extends PureComponent {
  constructor(props) {
    super(props);

    this.state = Object.assign({},
      initState);
    bindHandlers(this,
      this.clickHandler,
      this.focusHandler,
      this.blurHandler,
      this.changeHandler
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.props, nextProps);

  }

  clickHandler(e) {
    e.preventDefault();
    this.input.focus();
  }
  focusHandler() {

    this.setState({focused: true});
  }
  blurHandler() {
    this.setState({focused: false});
  }
  changeHandler(e) {
    e.preventDefault();
    this.props.onChange(e.target.value);
  }


  render() {
    const { color, red, content, id} = this.props;


    const styles = {
      cursor  : 'move',
      height  : this.props.height || '8em',
      width   : this.props.width || '8em',
      left    : this.props.left || 0,
      top     : this.props.top || 0,
      position: 'absolute'
    };

    const backgroundColor = red ? 'red' : 'transparent';
    return (
      <div
          className={`noteWrapper ${this.state.focused ? 'noteWrapper--focused' : ''}`}>
      <div className='enlarge'
        onDoubleClick={() => { this.props.showNoteComments(color, content, id); }}
        style={{ ...styles, backgroundColor }}
        ref={(input) => { this.input = input; }}
        onFocus={this.focusHandler}
        onBlur={this.blurHandler}
        onChange={this.changeHandler}>
        <Note color={color} content={content} raised={this.props.noteRaised} input={this.props.content} onFocus={this.focusHandler} />
      </div>
    </div>

    );
  }
}

export default NoteWrapper;
