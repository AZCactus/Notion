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
<<<<<<< HEAD
      console.log('BOARDHASH SEED', boardHash);
      board.update({hash: boardHash})
        .then(value => {
          return value;
        });
=======
      board.hash = boardHash;
      return board.save();
      // board.update({hash: boardHash})
      //   .then(value => {
      //     console.log('value', value);
      //     return value;
      //   });
>>>>>>> master
    }
  }
});

module.exports = Board;
