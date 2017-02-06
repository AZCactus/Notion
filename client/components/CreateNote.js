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
  hasJoined         : false
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
      this.blurHandler
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
      this.props.addSocketListener('connect', this.join);
      this.props.socketConnect('board');
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

  submitHandler(e) {
    e.preventDefault();
    this.props.createNote({
      content: this.state.content,
      color  : this.state.color
    }, this.props.board.id)
      .then(() => this.setState(initState));
  }

  render() {
    return (
      <div className="container">
        <h1 className="center">{this.props.board ? this.props.board.name : ''}</h1>
        <div className="row">
          <div className="col-xs-10 col-xs-offset-1" style={{fontSize: '6vw'}}>
            <div onClick={!!this.input && this.clickHandler}>
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
