'use strict';

const Sequelize = require('sequelize');
const db = require('./db');

const Comment = db.define('comment', {
  text: {
    type: Sequelize.TEXT,
  }
},
  {
    instanceMethods: {
      includeUser: function() {
        return db.model('comment').findOne({
          where: {
            id: this.id
          },
          include: [ { model: db.model('user') } ]
        });
      },
    }
  }
);

module.exports = Comment;
