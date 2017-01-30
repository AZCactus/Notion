import React, {Component} from 'react';
import bindHandlers from '../utils/bindHandlers';

const initState = {
  focused: false
};

export default class Note extends Component {

  constructor(props) {
    super(props);

    this.state = initState;

    bindHandlers(this,
      this.clickHandler,
      this.focusHandler,
      this.blurHandler,
      this.changeHandler
    );
  }

  clickHandler(e) {
    e.preventDefault();
    this.input.focus();
  }
  focusHandler() {
    this.setState({focused: true});
  }
  blurHandler() {
    this.setState({focused: false});
  }
  changeHandler(e) {
    e.preventDefault();
    this.props.onChange(e.target.value);
  }

  render() {
    return (
      <div
        className={`c-note ${this.state.focused ? 'c-note--focused' : ''}`}
        onClick={this.clickHandler}>
        <div className="c-note__inner">
          <div className="c-note__content">{this.props.content}</div>
          { this.props.editable &&
            <input type="text"
              className="c-note__input"
              ref={(input) => { this.input = input; }}
              onFocus={this.focusHandler}
              onBlur={this.blurHandler}
              onChange={this.changeHandler}></input>
          }
        </div>
      </div>
    );
  }
}
