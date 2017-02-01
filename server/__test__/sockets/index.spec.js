// 'use strict';

// const chai = require('chai');
// const expect = chai.expect;
// const should = chai.should();
// const io = require('socket.io-client');
// const app = require('ROOT/server');
// const sockets = require('../../sockets');

// describe('Sockets', () => {
//   let client, clientTwo;

//   beforeEach((done) => {
//     client = io.connect('http://localhost:3030/board');
//     client.on('connect', () => {
//       done();
//     });
//     client.on('disconnect', () => {
//     });
//   });

//   beforeEach((done) => {
//     clientTwo = io.connect('http://localhost:3030/board');
//     clientTwo.on('connect', () => {
//       done();
//     });
//     clientTwo.on('disconnect', () => {
//     });
//   });

//   afterEach((done) => {
//     if (client.connected) {
//       console.log('1 disconnected');
//       client.disconnect();
//     }
//     if (clientTwo.connected) {
//       console.log('2 disconnected');
//       clientTwo.disconnect();
//     }
//     done();
//   });



//   it('should be a function', () => {
//     expect(sockets).to.be.a('function');
//   });

//   it('Should broadcast correct number of clients in room when a new user joins room', (done) => {
//     client.on('joined', (payload) => {
//       expect(payload).should.be.an('object');
//       expect(payload.totalParticipants).to.equal(2);
//       done();
//     });
//     clientTwo.emit('join', {room: 'XF4325', name: 'Alvin'});
//     client.emit('join', {room: 'XF4325', name: 'Hal'});
//   });

// });
