'use strict';

const express = require('express');
const Router = express.Router;
const router = new Router();
const { User, Note, UserMentionInNote, Board } = require('../../models');

router.get('/:userId', (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => user.getMention({include: [ {model: Board} ]}))
    .then((mentions) => res.json(mentions));
});

module.exports = router;
