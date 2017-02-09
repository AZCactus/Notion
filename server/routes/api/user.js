'use strict';

const express = require('express');
const Router = express.Router;
const router = new Router();
const {User} = require('../../models');
const chalk = require('chalk');

/* get users */
router.get('/', (req, res, next) => {
  const {searchUsername} = req.query;
  User.findAll({
    where: {
      username: {
        $like: `${searchUsername}%`
      }
    }
  })
    .then(users => res.send(users))
    .catch(next);
});

/* create user */
router.post('/', (req, res, next) => {
  User.findOne({
    where: {email: req.body.email}})
    .then(user => {
      if (user) res.sendStatus(409);
      else {
        return User.create(req.body);
      }
    })
    .then((user) => {
      req.login(user, (err) => {
        if (err) { return next(err); }
        return res.send(user);
      });
    })
    .catch(next);
});

/* delete user */
router.delete('/:id', (req, res, next) => {
  User.destroy({ where: { id: req.params.id }})
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = router;
