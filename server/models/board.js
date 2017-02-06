'use strict';

const Sequelize = require('sequelize');
const db = require('./db');

const Board = db.define('board', {
  name: Sequelize.TEXT,
  hash: Sequelize.TEXT
});

module.exports = Board;
