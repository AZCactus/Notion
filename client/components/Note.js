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


    const noteStyle = {
      backgroundColor: this.state.color,
      color          : Color(this.state.color).rgb().rotate(180).hex(),
    };

    const {content} = this.props;

    return (
      <div
        className={`c-note ${this.state.focused ? 'c-note--focused' : ''}`}
        onClick={this.clickHandler}
        style={noteStyle}>
        <div className="c-note__inner">
          <div className="c-note__content">{content}</div>
          { this.props.editable &&
            <input type="text"
              value={content}
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
