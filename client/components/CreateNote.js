import React, {Component} from 'react';
import isEmpty from 'lodash/isEmpty';
import bindHandlers from '../utils/bindHandlers';
import Note from './Note';
import ColorPicker from './ColorPicker';
import Color from 'color';
import {genShortHash} from '../utils/stringHash';
import presetColors from 'ROOT/client/presetColors.json';
const initState = {
  content           : '',
  color             : Color.rgb([ 237, 208, 13 ]).hex(),
  displayColorPicker: false,
  hasJoined         : false,
  flickState        : false,
  dragStart         : null,
  position          : 0
};


export default class CreateNote extends Component {

  constructor(props) {
    super(props);

    this.state = initState;
    bindHandlers(this,
      this.changeHandler,
      this.submitHandler,
      this.clickHandler,
      this.modalClickHandler,
      this.updateColor,
      this.toggleColorPicker,
      this.join,
      this.focusHandler,
      this.blurHandler,
      this.touchStartHandler,
      this.touchEndHandler,
      this.touchMoveHandler
    );
  }

  componentWillMount() {
    if ((!this.props.board || isEmpty(this.props.board)) && !this.props.location.query.board) {
      // If no board is selected and no board ID is provided
      // redirect to myBoards page
      this.props.router.push('/myboards');
    } else if (!this.props.board || isEmpty(this.props.board)) {
      // if no board is selected but a board ID is provided
      // select board by ID
      this.props.getBoard(this.props.location.query.board);
    }
  }

  componentWillUnmount() {
    this.props.clearSocketListeners();
    this.props.socketDisconnect();
    this.props.socketEmit('leave', {
      room  : genShortHash(this.props.board.id),
      userId: this.props.user.id
    });
  }

  componentWillReceiveProps({board, user}) {
    if (board && user && !isEmpty(board) && !isEmpty(user) && !this.state.hasJoined) {
      this.props.socketConnect('board');
      this.props.addSocketListener('connect', this.join);
      this.setState({hasJoined: true});
    }
  }

  join() {
    this.props.socketEmit('join', {
      room  : genShortHash(this.props.board.id),
      name  : this.props.user.first_name + ' ' + this.props.user.last_name,
      userId: this.props.user.id
    });
  }

  toggleColorPicker() {
    this.setState((prevState) => {
      return Object.assign(
        {},
        prevState,
        {displayColorPicker: !prevState.displayColorPicker});
    });
  }

  updateColor(color) {
    const newState = {};
    if (typeof color === 'string') newState.color = color;
    else if (Array.isArray(color)) newState.color = Color.rgb(color).hex();
    this.setState(newState);
  }

  changeHandler(e) {
    e.preventDefault();
    this.setState({content: e.target.value});
  }

  clickHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    this.input.focus();
  }

  modalClickHandler(e, cb) {
    e.stopPropagation();
    if (e.target === e.currentTarget) cb(e);
  }

  focusHandler() {

    this.setState({focused: true});
  }

  blurHandler() {
    this.setState({focused: false});
  }

  touchStartHandler(e) {
    this.setState({flickState: 'positioning', dragStart: e.touches[0].pageY});
  }

  touchMoveHandler(e) {
    const dragPosition = e.touches[0].pageY;
    if (this.state.dragStart && dragPosition < this.state.dragStart) {
      this.setState({ position: dragPosition - this.state.dragStart });
    }
  }

  touchEndHandler(e) {
    const viewportWidth = window.innerWidth ? window.innerWidth : window.screen.width;
    if (Math.abs(this.state.position) > viewportWidth / 2) {
      this.setState({flickState: 'sending', position: -viewportWidth});
      setTimeout(() => {
        this.submitHandler();
      }, 100);
    } else this.setState({flickState: 'resting', dragStart: null, position: 0});
  }

  submitHandler(e) {
    if (e) e.preventDefault();

    this.setState({flickState: 'positioning', position: window.innerHeight || window.screen.height});
    this.props.createNote({
      content: this.state.content,
      color  : this.state.color
    }, this.props.board.id)
      .then(() => {
        this.setState(Object.assign(initState, {flickState: 'returning'}));
      });
  }

  render() {
    const noteWrapperStyle = {zIndex: 1};
    noteWrapperStyle.transform = `rotate(${this.state.position * 0.02}deg)`;
    noteWrapperStyle.top = this.state.position;

    switch (this.state.flickState) {
    case 'positioning':
      break;
    case 'sending':
      noteWrapperStyle.transition = 'all 0.1s ease-in';
      break;
    case 'returning':
      noteWrapperStyle.top = 0;
      noteWrapperStyle.transition = 'all 0.25s ease-in-out';
      break;
    default:
      noteWrapperStyle.transition = 'all 0.25s ease-in-out';
    }

    return (
      <div className="container">
        <h1 className="center">{this.props.board ? this.props.board.name : ''}</h1>
        <div className="row">
          <div className="col-xs-10 col-xs-offset-1" style={{fontSize: '6vw'}}>
            <div
              style={noteWrapperStyle}
              onClick={!!this.input && this.clickHandler}
              onTouchStart={this.touchStartHandler}
              onTouchMove={this.touchMoveHandler}
              onTouchEnd={this.touchEndHandler}>
              <Note
                editable={true}
                content={this.state.content}
                color={this.state.color}
                onChange={this.changeHandler}/>
              <input type="text"
                value={this.state.content}
                className="c-note__input"
                ref={(input) => { this.input = input; }}
                onFocus={this.focusHandler}
                onBlur={this.blurHandler}
                onChange={this.changeHandler} />
            </div>
            <div style={{margin: '0.25em auto'}}>
              <button
                onClick={this.toggleColorPicker}
                className="btn btn-color"
                style={{background: this.state.color}}>
              </button>
            </div>
          </div>
          { this.state.displayColorPicker &&
            <div className="c-color-picker__wrapper c-color-picker__wrapper--modal"
              onClick={(e) => { this.modalClickHandler(e, this.toggleColorPicker); }}>
              <ColorPicker
                color={this.state.color}
                updateColor={this.updateColor}
                presets={presetColors} />
            </div>
          }
        </div>
        <div className="row">
          <button
            onClick={this.submitHandler}
            className="btn btn-primary block ml-auto mr-auto">
            Submit Note
          </button>
        </div>
      </div>
    );
  }
}
