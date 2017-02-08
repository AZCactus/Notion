'use strict';

const {db, User, Board, Note, BoardPermission} = require('../server/models');
const {randomString, randomNumber, randomColor} = require('../lib/utils/random');
const userCount = 10;
const boardsPerUser = [ 3, 8 ];
const notesPerBoard = [ 4, 12 ];
const presetUsers = [
  {
    first_name: 'Ada',
    last_name : 'Lovelace',
    email     : 'ada@lovelace.com',
    username  : 'ada_lovelace',
    password  : '12345'
  }
];

module.exports = db.didSync
  .then(() => db.sync({force: true}))
  .then(() => seedUsers(userCount))
  .then(users => seedBoards(users, boardsPerUser))
  .then(([ boards, users ]) => seedNotes(boards, users, notesPerBoard))
  .catch((err) => {
    console.error(err);
  })
  .finally(() => db.close());

/* User Functions */
function seedUsers(count) {
  const users = [ ...presetUsers ];

  for (let i = 0; i < count; i++) {
    users.push(generateUser());
  }

  return db.Promise.map(users, user => User.create(user));
}
function generateUser() {
  const firstName = randomString(3, 12);
  const lastName = randomString(3, 12);
  return {
    first_name: firstName,
    last_name : lastName,
    email     : `${randomString(3, 12)}@${randomString(2, 6)}.com`,
    username  : `${firstName}_${lastName}`,
    password  : randomString(8, 36)
  };
}

/* Board Functions */
function seedBoards(users, range) {
  const boards = [];

  users.forEach(user => {
    for (let i = 0; i < randomNumber(range[0], range[1]); i++) {
      let board;
      boards.push(
        Board.create(generateBoard())
          .then(data => {
            board = data;
            return board.addUser(user);
          })
          .then(() => board)
      );
    }
  });

  return db.Promise.all([
    db.Promise.all(boards),
    users
  ]);
}
function generateBoard() {
  return {
    name: randomString(3, 20),
    hash: `${randomString(6)}`
  };
}

/* Note Functions */
function seedNotes(boards, users, range) {
  const notes = [];

  boards.forEach(board => {
    for (let i = 0; i < randomNumber(range[0], range[1]); i++) {
      const user = users[randomNumber(users.length, false)];
      notes.push(
        Note.create(generateNote())
          .then(note => {
            return Promise.all([
              note.setBoard(board),
              note.setUser(user)
            ]);
          })
      );
    }
  });

  return db.Promise.all(notes);
}
function generateNote() {
  return {
    content: randomString(20, 120),
    color  : randomColor(),
    top    : randomNumber(0, 1000),
    left   : randomNumber(0, 1000)
  };
}
