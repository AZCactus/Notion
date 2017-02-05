import React, { Component, PropTypes } from 'react';
import NoteWrapper from './NoteWrapper';


const styles = {
  display        : 'inline-block',
  transform      : 'rotate(-7deg)',
  WebkitTransform: 'rotate(-7deg)',
};


export default class NoteDragPreview extends Component {
  constructor(props) {
    super(props);
    this.tick = this.tick.bind(this);
    this.state = {
      tickTock: false
    };
    console.log('NDP Props', props);
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    this.setState({
      tickTock: !this.state.tickTock,
    });
  }

  render() {

    const { tickTock } = this.state;
    console.log('NOTE PREVIEW', this.props);

    return (
      <div style={styles}>
        <NoteWrapper red={tickTock} />
      </div>
    );
  }


}
