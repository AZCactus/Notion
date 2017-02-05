import React, {Component} from 'react';
import bindHandlers from '../utils/bindHandlers';
import Color from 'color';

const initState = {
  focused: false,
  color  : Color.rgb([ 257, 208, 13 ]).hex()
};

export default class Note extends Component {

  constructor(props) {
    super(props);

    this.state = Object.assign({},
      initState,
      {
        color: this.props.color ? this.props.color.replace(/^#*/, '#') : initState.color
      }
    );

    bindHandlers(this,
      this.clickHandler,
      this.focusHandler,
      this.blurHandler,
      this.changeHandler
    );
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.color && nextProps.color !== this.state.color) {
      this.setState({color: nextProps.color.replace(/^#*/, '#')});

    }
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
    const hslArr = Color(this.state.color).hsl().array();
    hslArr[2] = hslArr[2] > 32 ? 25 : 85;


    const noteStyle = {
      backgroundColor: this.state.color,
      color          : Color.hsl(hslArr).rotate(180).hex(),
    };

    return (
      <div
        className={`c-note ${this.state.focused ? 'c-note--focused' : ''}`}
        onClick={this.clickHandler}
        style={noteStyle}>
        <div className="c-note__inner">
          <div className="c-note__content">{this.props.content}</div>
          { this.props.editable &&
            <input type="text"
              value={this.props.content}
              className="c-note__input"
              ref={(input) => { this.input = input; }}
              onFocus={this.focusHandler}
              onBlur={this.blurHandler}
              onChange={this.changeHandler} />
          }
        </div>
      </div>
    );
  }
}
