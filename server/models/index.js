'use strict';

const db = require('./db');
const Board = require('./board');
const Note = require('./note');
const User = require('./user');
const BoardPermission = require('./board_permission');

Board.hasMany(Note);
Note.belongsTo(Board);

User.belongsToMany(Board, {through: BoardPermission });
Board.belongsToMany(User, {through: BoardPermission });

User.hasMany(Note);
Note.belongsTo(User);
User.belongsToMany(Note, {as: 'Mention', through: 'user_mention_in_note'});
Note.belongsToMany(User, {as: 'MentionedUser', through: 'user_mention_in_note'});

module.exports = {
  db, Board, Note, User, BoardPermission
};
