import React, { Component, PureComponent } from 'react';
import { DragSource } from 'react-dnd';
import {NOTE} from '../constants';
import Note from './Note';

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

class NoteWrapper extends Component {


  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  onClick(e) {
    let zPos = 'top';

    if (zPos === 'bottom') zPos = 'top';

  }

  render() {
    const { note, red, content} = this.props;

    let color;
    if (note) {
      color = this.props.note.color;
    }
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

      <div className='enlarge' style={{ ...styles, red }}>
        <Note color={color} content={content}/>
      </div>

    );
  }
}

export default NoteWrapper;
