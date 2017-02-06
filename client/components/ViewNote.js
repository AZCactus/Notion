import React, {Component} from 'react';
import isEmpty from 'lodash/isEmpty';
import bindHandlers from '../utils/bindHandlers';
import Note from './Note';
import Color from 'color';

export default class ViewNote extends Component {

  componentWillMount() {
    if ((!this.props.note || isEmpty(this.props.note)) && !this.props.params.id) {
      // If no note is selected and no note ID is provided
      // redirect to myBoards page
      this.props.router.push('/mynotes');
    } else {
      this.props.getNote(this.props.params.id)
        .then(({payload}) => this.props.getBoard(payload.board_id));
    }
  }

  render() {
    if (!this.props.note) return <div></div>;
    return (
      <div className="container">
        <h1 className="center">{this.props.board ? this.props.board.name : ''}</h1>
        <hr />
        <div className="row">
          <div className="col-xs-10 col-xs-offset-1" style={{fontSize: '5vw'}}>
            <Note content={this.props.note.content} color={this.props.note.color}/>
          </div>
        </div>
      </div>
    );
  }
}
