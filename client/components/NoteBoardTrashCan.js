
import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import {NOTE} from '../constants';

function getStyle(backgroundColor) {
  return {
    // border    : '1px solid rgba(0,0,0,0.2)',
    minHeight: '10rem',
    maxHeight: '15rem',
    minWidth : '10rem',
    maxWidth : '15rem',
    color    : 'white',
    backgroundColor,
    padding  : '1rem',

    margin   : '1rem',
    textAlign: 'center',
    float    : 'left',
    fontSize : '1rem',

  };
}

const noteTarget = {
  drop(props, monitor, component) {
    const hasDroppedOnChild = monitor.didDrop();
    const item = monitor.getItem();

    component.setState({
      hasDropped: true,
      hasDroppedOnChild,
    });


    props.notesDelete(item.id, props.notes);


  },
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver           : monitor.isOver(),
  isOverCurrent    : monitor.isOver({ shallow: true }),
});


class TrashCan extends Component {


  constructor(props) {
    super(props);
    this.state = {
      hasDropped       : false,
      hasDroppedOnChild: false,
    };
  }

  render() {
    const { isOver, isOverCurrent, connectDropTarget, children } = this.props;
    const { hasDropped, hasDroppedOnChild } = this.state;


    let backgroundColor = 'rgba(0, 0, 0, 0)';

    if (isOverCurrent || (isOver)) {
      backgroundColor = 'red';
    }


    return connectDropTarget(
      <div className='trashcan' style={getStyle()}>
        <br />
          {hasDropped &&
          <span> {hasDroppedOnChild && ' on child'}</span>
        }
        <div>
          {children}
        </div>
        <div>
          <img className='trashcan_img' src='/assets/red-trash-256.png' />
        </div>
      </div>
    );
  }
}

export default DropTarget(NOTE, noteTarget, collect)(TrashCan);
