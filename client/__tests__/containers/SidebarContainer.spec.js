import React from 'react';
import chai, { expect } from 'chai';
import {shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import { spy } from 'sinon';

import Sidebar from '../../components/Sidebar';
import SidebarContainer, { mapStateToProps, mapDispatchToProps } from '../../containers/SidebarContainer';

describe ('<SidebarContainer /> ', () => {

  it('checking mapStateToProps', () => {
    const state = { nav: { sidebarToggle: {}, boardTemplateToggle: {} } };
    expect(mapStateToProps(state)).to.be.an('object');
    expect(mapStateToProps(state).sidebarToggle).to.equal(state.nav.sidebarToggle);
    expect(mapStateToProps(state).boardTemplateToggle).to.equal(state.nav.boardTemplateToggle);
  });

});
