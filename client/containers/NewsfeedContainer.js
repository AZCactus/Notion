import React, { Component } from 'react';
import {connect} from 'react-redux';
import { getMentionedNotes, deleteUnreadNotes } from '../actions/note';
import isEmpty from 'lodash/isEmpty';
import Newsfeed from '../components/Newsfeed';


class NewsfeedContainer extends Component {

  componentWillMount() {
    if (!isEmpty(this.props.user)) {
      this.props.getMentionedNotes(this.props.user.id);
      this.props.deleteUnreadNotes(this.props.user.id);
    }
  }

  render() {
    return (
      <Newsfeed mentionedNotes={this.props.mentionedNotes} />
    );
  }
}

const mapStateToProps = (state) => {
  const { mentionedNotes } = state.noteReducer;
  mentionedNotes.sort((noteA, noteB) =>
  new Date(noteB.created_at).getTime() - new Date(noteA.created_at).getTime());
  return {
    user          : state.userReducer.loggedInUser,
    mentionedNotes: mentionedNotes
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    getMentionedNotes: (userId) => dispatch(getMentionedNotes(userId)),
    deleteUnreadNotes: (userId) => dispatch(deleteUnreadNotes(userId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsfeedContainer);
