import React from 'react';
import chai, { expect } from 'chai';
import {shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import { spy } from 'sinon';

import CreateBoard from '../../components/CreateBoard';
import { CB } from '../../containers/CreateBoardContainer';

chai.use(chaiEnzyme());

describe ('<CreateBoardContainer /> ', () => {
  let signupContainerWrapper;
  beforeEach(() => {
    signupContainerWrapper = shallow(<CB />);
  });

  it('<CB /> should contain <CreateBoard /> component', () => {
    expect(signupContainerWrapper).to.have.descendants(CreateBoard);
  });
});
