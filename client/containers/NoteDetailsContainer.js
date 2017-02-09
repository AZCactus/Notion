import React, { Component } from 'react';
import {connect} from 'react-redux';
import { getComments, createComment } from '../actions/comment';

import ReactTransitionGroup from 'react-addons-css-transition-group';
import Color from 'color';


class NoteDetailsContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      comment: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCommentInput = this.handleCommentInput.bind(this);
    this.clearInput = this.clearInput.bind(this);
    this.getFontColor = this.getFontColor.bind(this);
  }

  getFontColor(color) {
    color = color.replace(/^#*/, '#');
    const hslArr = Color(color).hsl().array();
    hslArr[2] = hslArr[2] > 32 ? 25 : 85;
    return Color.hsl(hslArr).rotate(180).hex();
  }

  componentWillMount() {
    this.props.getComments(this.props.note.noteId);
  }

  componentWillReceiveProps(props, nextProps) {
    if (props.note.noteId !== this.props.note.noteId) {
      this.props.getComments(this.props.note.noteId);
    }
  }

  handleCommentInput(e) {
    this.setState({comment: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.props.loggedInUser.id) {
      this.props.createComment(this.state.comment, this.props.note.noteId, this.props.loggedInUser.id);
    }
    this.clearInput();
  }

  handleKeyPress(e) {
    if (this.props.loggedInUser.id) {
      if (e.key == 'Enter') {
        this.clearInput();
      }
    }
  }

  clearInput() {
    this.refs.input.value = '';
  }

  render() {
    const backgroundColor = this.props.note.color.replace(/^#*/, '#');

    const colorStyle = {
      backgroundColor: backgroundColor,
      color          : this.getFontColor(this.props.note.color)
    };

    return (
    <ReactTransitionGroup
      transitionName="noteDetailSlideIn"
      transitionAppear={true}
      transitionAppearTimeout={500}
      transitionEnterTimeout={500}
      transitionLeaveTimeout={500}>

      <div className="note-details-container">
        <button type="button"
        className="note-details-close-btn"
        onClick={this.props.hideNoteComments}> x </button>
        <div className="note-details-note"
        style={colorStyle}>
          {this.props.note.content}
        </div>

        <div className="note-details-comments">
          <div className="inner">
          {this.props.comments.map((comment, i) => {
            return (
            <div key={i} className="note-details-comment">
            {`${comment.user.first_name} : ${comment.text}`}
            </div>
            );
          })}
          </div>
        </div>

        <form className="comment-form" onSubmit={this.handleSubmit}>
          <div className="comment-input-container">
            <input ref="input" className="comment-text-area"
            placeholder="Leave a comment"
            onChange={this.handleCommentInput}
            onKeyPress={(e) => { this.handleKeyPress(e); }} />
          <button className="comment-submit-button" type="submit">
            Send
          </button>
          </div>
        </form>

      </div>
    </ReactTransitionGroup>
    );
  }

}

const mapStateToProps = (state) => {
  let { comments } = state.commentsReducer;
  comments = comments.sort(function(a, b) {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  return {
    loggedInUser: state.userReducer.loggedInUser,
    comments    : comments
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getComments  : (noteId) => { dispatch(getComments(noteId)); },
    createComment: (text, noteId, userId) => { dispatch(createComment(text, noteId, userId)); }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteDetailsContainer);
