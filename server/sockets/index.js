'use strict';

const socketio = require('socket.io');

const {green, blue, red} = require('../lib/utils/chalk');

/* active connections */
const connections = {};

/* active meetings */
const boardMeeting = {};

module.exports = function sockets(server) {
  const io = socketio(server);

  /* general socket connection */
  io.on('connection', (socket) => {
    console.log(green(`[General]: client ${socket.id} connected`));
  });




  /************************** main board meeting namespace ***************************/

  io.of('board').on('connection', (socket) => {
    console.log(green(`[Board Meeting]: client ${socket.id} connected`));
    connections[socket.id] = socket.id;
    console.log(green(`[Board Meeting]: ${Object.keys(connections).length} clients connected`));

    /* configure to to call wildcard event listener */
    const onevent = socket.onevent;
    socket.onevent = function(packet) {
      const args = packet.data || [];
      onevent.call (this, packet);
      packet.data = [ '*' ].concat(args);
      onevent.call(this, packet);
    };

    socket.once('disconnect', () => {
      /* delete from active connections */
      delete connections[socket.id];
      /* delete from active board meeting and broadcast to room */
      removeParticpants(socket.id);

      socket.disconnect();
      console.log(red(`[Board Meeting]: client ${socket.id} disconnected`));
      console.log(red(`[Board Meeting]: ${Object.keys(connections).length} sockets remaining`));
    });

    /* wild card socket listener other than join room and leave room */
    socket.on('*', (eventName, payload) => {
      if (eventName !== 'join' && eventName !== 'leave') {
        /* broadcast to all clients in board namespace */
        io.of('board').emit(eventName, payload);
      }
    });

    /**
     * Handles users when they join a particular meeting board room
     *
     * @param {String} room - room name (a randomly generated string sent from frontend)
     * @param {String} name - name of participant
     * @returns broadcast participant names and total participants remaining
     */
    socket.on('join', ({room, name}) => {
      /* client join room */
      socket.join(room);
      /* store in boardMeeting obj to keep track of participant names */
      addParticipant(socket.id, name, room);
      console.log(blue(`[Board Meeting] - Room<${room}> - No. of Partcipants: ${getTotalParticipantsInRoom(room)}`));
      /* broadcast to all room participants including sender */
      io.of('board').in(room).emit('joined', { participants: boardMeeting[room], totalParticipants: getTotalParticipantsInRoom(room)});
    });

     /**
     * Handles user who leaves the board meeting page -
     * manually disconnect socket & remove participant
     *
     * @param {String} room - room name (a randomly generated string sent from frontend)
     * @returns broadcast participant names and total participants remaining
     */
    socket.on('leave', ({room}) => {
      delete connections[socket.id];
      removeParticpants(socket.id);
      socket.disconnect();
      io.of('board').in(room).emit('joined', { participants: boardMeeting[room], totalParticipants: getTotalParticipantsInRoom(room)});
    });


  });

  /************************** main board meeting namespace END **************************/


  /********************************* util function **************************************/

  function addParticipant(id, name, room) {
    const participant = { id, name};
    boardMeeting[room] = boardMeeting[room] || [];
    let exist = false;
    for (let i = 0; i < boardMeeting[room]; i++) {
      if (boardMeeting[room].id === id) {
        exist = true;
      }
    }
    if (!exist) boardMeeting[room].push(participant);
  }

  function removeParticpants(id) {
    let room, idx;
    for (const roomName in boardMeeting) {
      for (let i = 0; i < boardMeeting[roomName].length; i++) {
        if (boardMeeting[roomName][i].id == id) {
          room = roomName;
          idx = i;
        }
      }
    }
    if (idx >= 0 && room) {
      boardMeeting[room].splice(idx, 1);
      const totalParticipants = getTotalParticipantsInRoom(room);
      io.of('board').in(room).emit('joined', { participants: boardMeeting[room], totalParticipants });
    }
  }

  function getTotalParticipantsInRoom(room) {
    return io.nsps['/board'].adapter.rooms[room] ?
      io.nsps['/board'].adapter.rooms[room].length : 0;
  }

  /********************************* util function END  ************************************/

  return io;
};
