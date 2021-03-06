import React, { Component, PropTypes } from 'react';
import { DragLayer } from 'react-dnd';
import {NOTE} from '../constants';
import NoteDragPreview from './NoteDragPreview';
import snapToGrid from './snapToGrid';
import NoteWrapper from './NoteWrapper';


const layerStyles = {
  position     : 'fixed',
  pointerEvents: 'none',
  zIndex       : 100,
  left         : 0,
  top          : 0,
  width        : '100%',
  height       : '100%',

};

function getItemStyles(props) {
  const { initialOffset, currentOffset } = props;
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    };
  }

  let { x, y } = currentOffset;

  if (props.snapToGrid) {
    x -= initialOffset.x;
    y -= initialOffset.y;
    [ x, y ] = snapToGrid(x, y);
    x += initialOffset.x;
    y += initialOffset.y;
  }

  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}


const collect = (monitor) => {

  // console.log("IS DRAGGING", monitor.getClientOffset())

  return {
    item         : monitor.getItem(),
    itemType     : monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging   : monitor.isDragging(),
  };
};

class CustomDragLayer extends Component {


  static propTypes = {
    item: PropTypes.object,
    itemType: PropTypes.string,
    initialOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }),
    currentOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }),
    isDragging: PropTypes.bool.isRequired,
    snapToGrid: PropTypes.bool.isRequired,
  };



  renderItem(type, item, size) {


    switch (type) {
    case NOTE:
      return (<NoteDragPreview content={item.content} color={item.color} size={size}/>);
    default:
      return null;
    }
  }

  render() {
    const { item, itemType, isDragging, notesSize } = this.props;

    if (!isDragging) {
      return null;
    }


    return (
      <div style={layerStyles}>
        <div style={getItemStyles(this.props)}>
            {this.renderItem(itemType, item, notesSize)
          }
        </div>
      </div>
    );
  }
}


export default DragLayer(collect)(CustomDragLayer);
