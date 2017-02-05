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

  return {
    item         : monitor.getItem(),
    itemType     : monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging   : monitor.isDragging(),
  };
};

class CustomDragLayer extends Component {


  renderItem(type, item) {


    switch (type) {
    case NOTE:
      console.log('CDL ITEM', item);
      return (<NoteDragPreview content={item.content} />);
    default:
      return null;
    }
  }

  render() {
    const { item, itemType, isDragging } = this.props;
    console.log('CDL', this.props);

    if (!isDragging) {
      return null;
    }

    return (
      <div style={layerStyles}>
        <div style={getItemStyles(this.props)}>
          { console.log('RENDERED CONTENT', this.renderItem(itemType, item))}
            {this.renderItem(itemType, item)
          }
        </div>
      </div>
    );
  }
}


export default DragLayer(collect)(CustomDragLayer);
