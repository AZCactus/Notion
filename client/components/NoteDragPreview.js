import React, { Component, PropTypes } from 'react';
import NoteWrapper from './NoteWrapper';
import {shallowEqual} from './ShouldCompUpdate';


const styles = {
  display: 'inline-block'
};


export default class NoteDragPreview extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.props, nextProps);
  }

  constructor(props) {
    super(props);
    this.tick = this.tick.bind(this);
    this.state = {
      tickTock: false
    };
  }

  componentDidMount() {

    this.interval = setInterval(this.tick, 200);
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
    const {content, color} = this.props;

    return (
      <div style={styles}>
        <NoteWrapper noteRaised={true} red={tickTock} content={content} color={color}/>
      </div>
    );
  }
}
