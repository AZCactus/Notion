
import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import {NOTE} from '../constants';

function getStyle(backgroundColor) {
  return {
    // border    : '1px solid rgba(0,0,0,0.2)',
    minHeight : '5rem',
    maxHeight : '8rem',
    minWidth  : '5rem',
    maxWidth  : '8rem',
    color     : 'white',
    backgroundColor,
    padding   : '2rem',
    paddingTop: '1rem',
    margin    : '1rem',
    textAlign : 'center',
    float     : 'left',
    fontSize  : '1rem',
    top       : 900,
    left      : 900
  };
}

const noteTarget = {
  drop(props, monitor, component) {
    const hasDroppedOnChild = monitor.didDrop();
    if (hasDroppedOnChild && !props.greedy) {
      return;
    }

    component.setState({
      hasDropped: true,
      hasDroppedOnChild,
    });
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
      backgroundColor = 'yellow';
    }

    return connectDropTarget(
      <div style={getStyle(backgroundColor)}>
        trash

          <br />
        {hasDropped &&
          <span>dropped {hasDroppedOnChild && ' on child'}</span>
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
