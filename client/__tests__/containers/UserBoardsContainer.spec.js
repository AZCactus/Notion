import React from 'react';
import chai, { expect } from 'chai';
import {shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import { spy } from 'sinon';

import NoteWrapper from '../../components/NoteWrapper';
import { UserBoardsContainer } from '../../containers/UserBoardsContainer';

chai.use(chaiEnzyme());

describe ('<UserBoardsContainer /> ', () => {
  let signupContainerWrapper;
  beforeEach(() => {
    const dummyArray = [ { id: 1, board_id: 1, left: 5, top: 10}, { id: 2, board_id: 1, left: 10, top: 5} ];
    signupContainerWrapper = shallow(<UserBoardsContainer board={{ board: { id: 1}}} notes={dummyArray}/>);
  });

  it('<UserBoardsContainer /> should contain <NoteWrapper /> component', () => {
    expect(signupContainerWrapper).to.have.descendants(NoteWrapper);
  });
});
