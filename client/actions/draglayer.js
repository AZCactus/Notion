import {CHANGE_TO_HIDDEN} from '../constants';

export const changeToHidden = (bool) => {
  return {
    type  : CHANGE_TO_HIDDEN,
    hidden: bool
  };
};


export const switchViews = (bool) => {
  return dispatch => {

    dispatch(changeToHidden(bool));
  };

};
