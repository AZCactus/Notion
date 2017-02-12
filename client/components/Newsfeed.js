import React, { Component } from 'react';
import moment from 'moment';

export default function(props) {
  return (
      <div className="newsfeed-wrapper">
        <div className="newsfeed-container">
        <div className="newsfeed-title">Notesfeed</div>
        <div className="newsfeed-border" />
        <ul className="newsfeed-list">
        {props.mentionedNotes.length === 0 ?
          <div>
            <li className="newsfeed-empty">
              You have no notes.
            </li>
          </div> :
            props.mentionedNotes.map(note => {
              return (
                <div key={note.id}>
                <div className="newsfeed-separator" />
                <li className="newsfeed-item" >
                  <div>
                    <span className="newsfeed-boardname">{note.board.name}</span>
                    <div className="newsfeed-date">{moment(note.created_at).fromNow()} </div>
                  </div>
                  <div className="newsfeed-content">{note.content}</div>
                </li>
                </div>
              );
            })}
          </ul>
        </div>
      </div>
  );
}
