'use strict';
const {genShortHash} = require('../../client/utils/stringHash');


const Sequelize = require('sequelize');
const db = require('./db');

const Board = db.define('board', {
  name: Sequelize.TEXT,
  hash: Sequelize.TEXT
}, {
  hooks: {
    afterCreate: function(board) {
      const boardHash = genShortHash(board.id);

      board.hash = boardHash;
      return board.save();
      // board.update({hash: boardHash})
      //   .then(value => {
      //     console.log('value', value);
      //     return value;
      //   });

    }
  }
});

module.exports = Board;
