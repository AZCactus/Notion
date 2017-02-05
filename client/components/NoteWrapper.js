import React, { Component, PureComponent } from 'react';
import { DragSource } from 'react-dnd';
import {NOTE} from '../constants';
import Note from './Note';
import {shallowEqual} from './ShouldCompUpdate';

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

class NoteWrapper extends PureComponent {


  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.props, nextProps);

  }


  render() {
    const { color, red, content} = this.props;


    const styles = {
      cursor  : 'move',
      height  : this.props.height || 100,
      width   : this.props.width || 100,
      left    : this.props.left || 0,
      top     : this.props.top || 0,
      position: 'absolute'
    };

    const backgroundColor = red ? 'red' : 'white';

    return (

      <div className='enlarge' style={{ ...styles, backgroundColor }}>
        <Note color={color} content={content} value={this.props.content} />
      </div>

    );
  }
}

export default NoteWrapper;
