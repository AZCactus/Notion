'use strict';

const express = require('express');
const Router = express.Router;
const router = new Router();
const {User} = require('ROOT/server/models');
const chalk = require('chalk');


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

/* get users */
router.get('/', (req, res, next) => {
  User.findAll()
    .then(users => res.send(users))
    .catch(next);
});

/* delete user */
router.delete('/:id', (req, res, next) => {
  User.destroy({ where: { id: req.params.id }})
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = router;
