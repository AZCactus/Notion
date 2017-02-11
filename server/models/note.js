'use strict';

const Sequelize = require('sequelize');
const db = require('./db');

const Note = db.define('note', {
  content: Sequelize.TEXT,
  color  : Sequelize.TEXT,
  top    : Sequelize.INTEGER,
  left   : Sequelize.INTEGER,
  size   : Sequelize.INTEGER,
  zIndex : Sequelize.INTEGER

});

module.exports = Note;
