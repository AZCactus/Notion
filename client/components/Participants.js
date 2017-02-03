import React from 'react';

export default function(props) {
  return (
     <div className={props.display ? 'participants-container participants-container-show'
     : 'participants-container participants-container-hide'}
     onClick={() => { props.toggleParticipantsMenu(); }}>
          <div className="participant-number-container">
            <span className="participant-number">
              <i className="glyphicon glyphicon-globe"></i>
              {props.totalParticipants} Collaborators Online
            </span>
          </div>
          <div className="participant-list-container">
            <ul className="participant-list">
              {props.participants.map((participant, idx) => {
                return <li className="participant-item"
                            key={`${participant.id}_${idx}`}>
                            <div className="participant">
                              <i className="glyphicon glyphicon-user"></i>
                              {participant.name}
                            </div>
                        </li>;
              })}
            </ul>
          </div>
      </div>
  );
}
