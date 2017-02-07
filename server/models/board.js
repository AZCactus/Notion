'use strict';
const {genShortHash} = require('ROOT/client/utils/stringHash');


const Sequelize = require('sequelize');
const db = require('./db');

const Board = db.define('board', {
  name: Sequelize.TEXT,
  hash: Sequelize.TEXT
}, {
  hooks: {
    afterCreate: function(board) {
      const boardHash = genShortHash(board.id);
      board.update({hash: boardHash})
      .then(value => {
        return value;
      });
    }
  }
});

module.exports = Board;
