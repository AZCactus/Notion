'use strict';

const Sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs');
const db = require('./db');

const User = db.define('user', {
  first_name: {
    type     : Sequelize.STRING,
    allowNull: false
  },
  last_name: {
    type     : Sequelize.STRING,
    allowNull: false
  },
  email: {
    type     : Sequelize.STRING,
    allowNull: false,
    unique   : true,
    validate : {
      isEmail: true
    }
  },
  username: {
    type     : Sequelize.STRING,
    allowNull: false,
    unique   : true
  },
  password: Sequelize.TEXT,
}, {
  instanceMethods: {
    hashPassword: function() {
      return new Promise((resolve, reject) => {
        bcrypt.genSalt(4, (err, salt) => {
          if (err) {
            return reject(err);
          }
          bcrypt.hash(this.password, salt, null, (hashErr, hash) => {
            if (hashErr) {
              return reject(err);
            }
            this.setDataValue('password', hash);
            resolve();
          });
        });
      });
    },
    checkPassword: function(password) {
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, this.password, (err, matched) => {
          if (err) {
            return reject(err);
          }
          resolve(matched);
        });
      });
    }
  },
  hooks: {
    beforeCreate: function(user) {
      return user.hashPassword();
    },
    beforeUpdate: function(user) {
      if (!user.changed('password')) {
        return;
      }
      return user.hashPassword();
    }
  }
});

module.exports = User;
