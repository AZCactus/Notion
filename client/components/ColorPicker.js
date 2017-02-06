import React from 'react';
import {CustomPicker} from 'react-color';
import {Saturation, Hue} from 'react-color/lib/components/common';
import Color from 'color';

export function ColorPicker(props) {

  function updateSaturation(sat) {
    props.updateColor(Color.hsv([ sat.h, sat.s, sat.v ]).hex());

  }

  function updateHue(hue) {
    console.log(hue);
    props.updateColor(Color(props.color).hue(hue.h).hex());
  }

  return (
    <div className="c-color-picker">
      <div className="c-color-picker__inner">
        <div className="c-color-picker__sample" style={{background: props.color}}></div>
        <div className="c-color-picker__saturation">
          <Saturation {...props} onChange={updateSaturation} />
        </div>
        <div className="c-color-picker__hue">
          <Hue {...props} onChange={updateHue} />
        </div>
        <div className="c-color-picker__presets">
          {props.presets.map((preset) => (
            <div
              key={preset}
              className="c-color-picker__preset"
              style={{background: preset}}
              onClick={() => { props.updateColor(preset); }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomPicker(ColorPicker);
