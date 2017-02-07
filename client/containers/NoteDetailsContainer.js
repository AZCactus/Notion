import React, { Component } from 'react';
import {connect} from 'react-redux';

import ReactTransitionGroup from 'react-addons-css-transition-group';

class NoteDetailsContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      comment     : '',
      showComments: false,
      comments    : [
        {id: 1, name: 'Alvin', content: 'This is the first comment'},
        {id     : 2, name   : 'Hal', content:
        'This is the second comment'},
        {id     : 3, name   : 'Spencer', content:
        'This is the third comment'},
        {id     : 4, name   : 'Joe', content:
        'This is the fourth comment...'}
      ]
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCommentInput = this.handleCommentInput.bind(this);
  }

  handleCommentInput(e) {
    console.log('handlecommentinput:', e.target.value);
    this.setState({comment: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('submit comment!');
    this.setState({comments: [ {id: 5, name: this.props.loggedInUser.first_name, content: this.state.comment}, ...this.state.comments ]});
    this.setState({comment: ''});
  }

  render() {
    return (
    <ReactTransitionGroup
      transitionName="noteDetailSlideIn"
      transitionAppear={true}
      transitionAppearTimeout={500}
      transitionEnterTimeout={500}
      transitionLeaveTimeout={500}>
    <div className="note-details-container">
      <button type="button" className="note-details-close-btn"
      onClick={this.props.hideNoteComments}> x </button>
      <div className="note-details-note" style={{backgroundColor: '#ffde00'}}>
        NOTE DETAILS AWOIJAWO GIJAWG OIAJWGO AIWJGO AWIGJA OWIGJAOWI GJAOW IGJAO WIGBA WOI GJAOWIG JAWOI GJAOWIGJ
      </div>

      <div className="note-details-comments">
        <div className="inner">
         {this.state.comments.map((comment, i) => {
           return <div key={i} className="note-details-comment">{`${comment.name} : ${comment.content}`}</div>;
         })}
        </div>
      </div>

      <form className="comment-form" onSubmit={this.handleSubmit}>
        <div className="comment-input-container">
          <textarea className="comment-text-area" placeholder="Comment..." onChange={this.handleCommentInput}
        required />
        <button className="comment-submit-button" type="submit"><i className="ion-chatbubble-working"/></button>
        </div>
      </form>

    </div>
    </ReactTransitionGroup>
    );
  }

}

const mapStateToProps = (state) => ({
  loggedInUser: state.userReducer.loggedInUser
  // selectedNote
});

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteDetailsContainer);
