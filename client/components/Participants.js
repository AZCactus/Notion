import React from 'react';

export default function(props) {
  return (
    <div onClick={() => { props.toggleParticipantsMenu(); }}>
     <div className={props.display ? 'participants-tab participants-tab-show' : 'participants-tab participants-tab-hide'}>Collaborators</div>
     <div className={props.display ? 'participants-container participants-container-show'
     : 'participants-container participants-container-hide'}
     >

          <div className="participant-number-container">
            <div className="participant-number">
              <i className="glyphicon glyphicon-globe globe-icon"></i>
              {props.totalParticipants} Online
            </div>
          </div>
          <div className="participant-list-container">
            <ul className="participant-list">
              {props.participants.map((participant, idx) => {

                return <li className="participant-item"
                            key={`${participant.id}_${idx}`}>
                            <div className="participant-image">
                              <i className="glyphicon glyphicon-user participant-icon"></i>
                            </div>
                            <div className="participant">
                              {participant.name === 'undefined undefined' ?
                                'Guest' : participant.name
                              }
                            </div>
                        </li>;
              })}
            </ul>
          </div>
      </div>
      </div>
  );
}
