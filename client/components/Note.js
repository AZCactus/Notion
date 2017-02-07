import React, {Component} from 'react';
import bindHandlers from '../utils/bindHandlers';
import Color from 'color';

export default function Note(props) {
  const {content, focused} = props;
  const color = props.color ? props.color.replace(/^#*/, '#') : '#EDD00D';
  const hslArr = Color(color).hsl().array();
  hslArr[2] = hslArr[2] > 32 ? 25 : 85;
  const noteStyle = {
    backgroundColor: color,
    color          : Color.hsl(hslArr).rotate(180).hex(),
  };

  return (
    <div
      className={`c-note ${focused ? 'c-note--focused' : ''}`}
      style={noteStyle}>
      <div className="c-note__inner">
        <div className="c-note__content">{content}</div>
      </div>
    </div>
  );
}
