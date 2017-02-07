import React, {Component} from 'react';
const ReactDOM = require('react-dom');

import store from '../store';
import {connect} from 'react-redux';
import io from 'socket.io-client';
import CustomDragLayerContainer from './CustomDragLayerContainer';
import ParticipantsContainer from './ParticipantsContainer';
import { socketConnect, socketDisconnect, clearSocketListeners } from '../actions/socketio';
import { bindActionCreators } from 'redux';
import bindHandlers from '../utils/bindHandlers';
import NoteDetailsContainer from './NoteDetailsContainer';

// import Clipboard from 'react-clipboard';

// localhost:3030/note?board=${this.props.board.hash}
function noop() {}

const Clipboard = React.createClass({

  propTypes: {
    value    : React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    style    : React.PropTypes.object,
    onCopy   : React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      className: 'clipboard',
      style    : {
        position: 'fixed',
        overflow: 'hidden',
        clip    : 'rect(0 0 0 0)',
        height  : 1,
        width   : 1,
        margin  : -1,
        padding : 0,
        border  : 0
      },
      onCopy: noop
    };
  },

  componentDidMount: function() {
    document.addEventListener('keydown', this.handleKeyDown, false);
    document.addEventListener('keyup', this.handleKeyUp, false);
  },

  componentWillUnmount: function() {
    document.removeEventListener('keydown', this.handleKeyDown, false);
    document.removeEventListener('keyup', this.handleKeyUp, false);
  },

  render: function() {
    return <textarea {...this.props} readOnly={true} onCopy={this.handleCopy} />;
  },

  handleCopy: function(e) {
    this.props.onCopy(e);
  },

  handleKeyDown: function(e) {
    const metaKeyIsDown = (e.ctrlKey || e.metaKey);
    const textIsSelected = window.getSelection().toString();

    if (!metaKeyIsDown || textIsSelected) {
      return;
    }

    const element = ReactDOM.findDOMNode(this);
    element.focus();
    element.select();
  },

  handleKeyUp: function(e) {
    const element = ReactDOM.findDOMNode(this);
    element.blur();
  }

});


class BoardContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showNoteDetails: false,
      noteColor      : '',
      content        : '',
    };
    bindHandlers(this,
      this.showNoteComments,
      this.hideNoteComments
    );

  }

  componentWillMount() {
    const { dispatch, board, notes} = this.props;
    const boardId = board.id;

  }


  showNoteComments(color, content) {
    this.setState({showNoteDetails: true});
    this.setState({noteColor: color});
    this.setState({content: content});
  }

  hideNoteComments() {
    this.setState({showNoteDetails: false});
  }




  handleCopy(e) {
    console.log('copied', e);
  }

  render() {
    const value = `localhost:3030/note?board=${this.props.board.hash}`;

    return (
      <div className="col-xs-12 board-page-container" key={ this.props.board.id }>
        {this.state.showNoteDetails ?
          <NoteDetailsContainer
            noteColor={this.state.noteColor}
            content={this.state.content}
            hideNoteComments={this.hideNoteComments}
          /> : null}
        <span className="text-center">
          <h2>{ this.props.board.name }</h2>
          <div>
            <p>Press Cmd + C to copy:</p>
            <pre className='ClipboardBlocking'>{value}</pre>
            <Clipboard value={value}
              onCopy={this.handleCopy} />
          </div>
        </span>
          <div>
            <div className="screen col-xs-12">
              <CustomDragLayerContainer {...this.props} showNoteComments={this.showNoteComments}/>
            </div>
          </div>
          <ParticipantsContainer />
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  board: state.board.selectedBoard,
  notes: state.noteReducer.all,
  hash : state.board.selectedBoard.hash
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({socketConnect, socketDisconnect, clearSocketListeners }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardContainer);
