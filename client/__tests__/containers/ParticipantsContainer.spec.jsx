import React from 'react';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import { spy } from 'sinon';

import { ParticipantsContainer } from '../../containers/ParticipantsContainer';
import Participants from '../../components/Participants';

chai.use(chaiEnzyme());

const user = {id: 1, first_name: 'Alvin', last_name: 'Yuen'};
const params = {room: 'ABCD'};

describe ('<ParticipantsContainer /> ', () => {

  let participantsContainerWrapper;
  let socketEmit, socketConnect, addSocketListener, clearSocketListener;

  beforeEach(() => {
    socketEmit = spy();
    socketConnect = spy();
    addSocketListener = spy();
    clearSocketListener = spy();
    const props = {
      socketEmit,
      socketConnect,
      addSocketListener,
      clearSocketListener,
      params
    };

    participantsContainerWrapper = shallow(<ParticipantsContainer loggedInUser={user}
    {...props} />);

  });

  it('<ParticipantContainer /> socket listeners to have been called', () => {
    expect(addSocketListener.called).to.be.true;
    expect(socketEmit.calledOnce).to.be.true;
    expect(socketConnect.calledOnce).to.be.true;
  });

  it('<ParticipantsContainer /> should show participants according to state', () => {
    participantsContainerWrapper.setState({ participants: [ {id: 1, name: 'Alvin'}, {id: 2, name: 'Hal'} ]});
    participantsContainerWrapper.setState({ totalParticipants: 2 });
    expect(participantsContainerWrapper.find(Participants).prop('participants')).to.exist;
    expect(participantsContainerWrapper.find(Participants).prop('participants'))
      .to.deep.equal([
        {id: 1, name: 'Alvin'},
        {id: 2, name: 'Hal'}
      ]);
    expect(participantsContainerWrapper.find(Participants).prop('totalParticipants')).to.exist;
    expect(participantsContainerWrapper.find(Participants).prop('totalParticipants'))
      .to.equal(2);
  });
});
