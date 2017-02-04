import chai from 'chai';
import nock from 'nock';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import axios from 'axios';
import moxios from 'moxios';

import {RECEIVE_BOARD, RECEIVE_BOARDS, ADD_NEW_BOARD, RECEIVE_BOARD_NOTES} from '../../constants';
import {
  receiveBoard,
  receiveAllBoards,
  addNewBoard,
  getAllBoards,
  createBoard,
  getBoard
} from '../../actions/board';

const expect = chai.expect;

chai.use(sinonChai);

describe('Board Action Creators: ', () => {
  let param1, param2, output;

  beforeEach(() => {
    param1 = {};
    param2 = {};
    axios.defaults.adapter = require('axios/lib/adapters/http');
    moxios.install;
  });
  afterEach(() => {
    moxios.uninstall();
  });

  describe('Synchronous', () => {
    describe('receiveBoard', () => {

      it('should return an object', () => {
        const result = receiveBoard(param1);
        expect(result).to.be.an('object');
      });

      it('should return action with type RECEIVE_BOARD', () => {
        const result = receiveBoard(param1);
        expect(result.type).to.equal(RECEIVE_BOARD);
      });

      it('should return action with param1 stored on propperty board', () => {
        const result = receiveBoard(param1);
        expect(result.board).to.equal(param1);
      });

    });

    describe('receiveAllBoards', () => {

      beforeEach(() => {
        param1 = [];
        param2 = [];
      });

      it('should return an object', () => {
        const result = receiveAllBoards(param1);
        expect(result).to.be.an('object');
      });

      it('should return action with type RECEIVE_BOARDS', () => {
        const result = receiveAllBoards(param1);
        expect(result.type).to.equal(RECEIVE_BOARDS);
      });

      it('should return action with param1 stored on propperty boards', () => {
        const result = receiveAllBoards(param1, param2);
        expect(result.boards).to.equal(param1);
        expect(result.permissions).to.equal(param2);
      });

    });

    describe('addNewBoard', () => {

      it('should return an object', () => {
        const result = addNewBoard(param1);
        expect(result).to.be.an('object');
      });

      it('should return action with type ADD_NEW_BOARD', () => {
        const result = addNewBoard(param1);
        expect(result.type).to.equal(ADD_NEW_BOARD);
      });

      it('should return action with param1 stored on propperty board', () => {
        const result = addNewBoard(param1);
        expect(result.board).to.equal(param1);
      });

    });
  });

  describe('Asynchronous', () => {
    let request;
    let responses;
    let dispatch;

    beforeEach(() => {
      dispatch = sinon.spy();
      responses = {
        get: {
          '/api/boards/:id': {foo: 'bar'},
          '/api/boards'    : {boards: [], permissions: []}
        },
        post: {
          '/api/boards': {name: 'boardTest'}
        }
      };

      request = nock('http://localhost')
        .get(/\/api\/boards\/[^\/\?]+$/)
        .reply(200, responses.get['/api/boards/:id'])
        .get(/\/api\/boards(|\/)/)
        .query(() => true)
        .reply(200, responses.get['/api/boards'])
        .post(/\/api\/boards(|\/)/)
        .reply(200, responses.post['/api/boards'])
        .get('/')
        .reply(400);
    });
    afterEach(() => {
      nock.cleanAll();
    });


    describe('getAllBoards', () => {
      it('should dispatch an array of boards with the RECEIVE_BOARDS action', () => {
        return getAllBoards()(dispatch)
          .then(() => {
            expect(dispatch).to.have.been.calledOnce;
            const res = receiveAllBoards(responses.get['/api/boards'].boards, responses.get['/api/boards'].permissions);
            expect(dispatch.args[0][0]).to.deep.equal(res);
          });
      });
    });

    describe('createBoard', () => {
      it('dispatch should create a single board with the ADD_NEW_BOARD action', () => {
        return createBoard()(dispatch)
          .then(() => {
            expect(dispatch).to.have.been.calledOnce;
            expect(dispatch.args[0][0]).to.deep.equal(addNewBoard(responses.post['/api/boards']));
          });
      });
    });

    describe('getBoard', () => {
      it('should dispatch single note with the RECEIVE_BOARD action', () => {
        return getBoard(1)(dispatch)
          .then(() => {
            expect(dispatch).to.have.been.calledOnce;
            expect(dispatch.args[0][0]).to.deep.equal(receiveBoard(responses.get['/api/boards/:id']));
          });
      });
    });

  });
});
