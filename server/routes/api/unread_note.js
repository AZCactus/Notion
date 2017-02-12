'use strict';

const express = require('express');
const Router = express.Router;
const router = new Router();
const { db, User } = require('../../models');

router.get('/:userId', (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => user.getUnreadNote())
    .then((unreadNotes) => res.json(unreadNotes));
});

router.delete('/:userId', (req, res, next) => {
  db.model('unread_note').destroy({
    where: {user_id: req.params.userId}
  })
    .then(() => res.sendStatus(200));
});

module.exports = router;
