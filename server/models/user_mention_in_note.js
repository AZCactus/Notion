'use strict';

const Sequelize = require('sequelize');
const db = require('./db');

const UserMentionInNote = db.define('user_mention_in_note', {
  id: {
    type         : Sequelize.INTEGER,
    primaryKey   : true,
    autoIncrement: true,
    allowNull    : false
  }
});

module.exports = UserMentionInNote;



