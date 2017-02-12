'use strict';

const db = require('./db');
const Board = require('./board');
const Note = require('./note');
const User = require('./user');
const Comment = require('./comment');
const BoardPermission = require('./board_permission');
const UserMentionInNote = require('./user_mention_in_note');

Board.hasMany(Note, {onDelete: 'cascade'});
Note.belongsTo(Board);

Note.hasMany(Comment);
Comment.belongsTo(Note);

User.hasMany(Comment);
Comment.belongsTo(User);

User.belongsToMany(Board, {through: BoardPermission });
Board.belongsToMany(User, {through: BoardPermission });

User.hasMany(Note);
Note.belongsTo(User);
User.belongsToMany(Note, {as: 'Mention', through: UserMentionInNote});
Note.belongsToMany(User, {as: 'MentionedUser', through: UserMentionInNote});

User.belongsToMany(UserMentionInNote, {as: 'UnreadNote', through: 'unread_note'});
UserMentionInNote.belongsToMany(User, {as: 'UnreadNoteUser', through: 'unread_note' });



module.exports = {
  db, Board, Note, User, BoardPermission, Comment, UserMentionInNote
};
