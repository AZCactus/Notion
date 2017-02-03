import chai from 'chai';
import nock from 'nock';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import axios from 'axios';
import moxios from 'moxios';

import {RECEIVE_NOTES, SELECT_NOTE} from '../../constants';
import {
  receiveNote,
  receiveNotes,
  getAllNotes,
  getNote
} from '../../actions/note';

const expect = chai.expect;

chai.use(sinonChai);

describe('Note Action Creators: ', () => {
  let input, output;

  beforeEach(() => {
    input = {};
    axios.defaults.adapter = require('axios/lib/adapters/http');
    moxios.install;
  });
  afterEach(() => {
    moxios.uninstall();
  });

  describe('Synchronous', () => {
    describe('receiveNote', () => {

      it('should return an object', () => {
        const result = receiveNote(input);
        expect(result).to.be.an('object');
      });
  //
  //     it('should return action with type SELECT_NOTE', () => {
  //       const result = receiveNote(input);
  //       expect(result.type).to.equal(SELECT_NOTE);
  //     });
  //
  //     it('should return action with input stored on propperty payload', () => {
  //       const result = receiveNote(input);
  //       expect(result.payload).to.equal(input);
  //     });
  //
  //   });
  //
  //   describe('receiveNotes', () => {
  //
  //     beforeEach(() => {
  //       input = [];
  //     });
  //
  //     it('should return an object', () => {
  //       const result = receiveNotes(input);
  //       expect(result).to.be.an('object');
  //     });
  //
  //     it('should return action with type RECEIVE_NOTES', () => {
  //       const result = receiveNotes(input);
  //       expect(result.type).to.equal(RECEIVE_NOTES);
  //     });
  //
  //     it('should return action with input stored on propperty payload', () => {
  //       const result = receiveNotes(input);
  //       expect(result.payload).to.equal(input);
  //     });
  //
  //   });
  // });
  //
  // describe('Asynchronous', () => {
  //   let request;
  //   let responses;
  //   let dispatch;
  //   beforeEach(() => {
  //     dispatch = sinon.spy();
  //     responses = {
  //       '/api/notes/:id': {foo: 'bar'},
  //       '/api/notes'    : []
  //     };
  //
  //     request = nock('http://localhost')
  //       .get(/\/api\/notes\/[^\/\?]+$/)
  //       .reply(200, responses['/api/notes/:id'])
  //       .get(/\/api\/notes(|\/)/)
  //       .query(() => true)
  //       .reply(200, responses['/api/notes'])
  //       .get('/')
  //       .reply(400);
  //   });
  //   afterEach(() => {
  //     nock.cleanAll();
  //   });
  //
  //   describe('getNote', () => {
  //     it('should dispatch single note with the SELECT_NOTE action', () => {
  //       return getNote(12)(dispatch)
  //         .then(() => {
  //           expect(dispatch).to.have.been.calledOnce;
  //           expect(dispatch.args[0][0]).to.deep.equal(receiveNote(responses['/api/notes/:id']));
  //         });
  //     });
  //   });
  //
  //   describe('getAllNotes', () => {
  //     it('should dispatch single note with the RECEIVE_NOTES action', () => {
  //       return getAllNotes({userId: 1, boardId: 1})(dispatch)
  //         .then(() => {
  //           expect(dispatch).to.have.been.calledOnce;
  //           expect(dispatch.args[0][0]).to.deep.equal(receiveNotes(responses['/api/notes']));
  //         });
  //     });
    });
  });
});
