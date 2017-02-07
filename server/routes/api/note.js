'use strict';

const Router = require('express').Router;
const {Note, User, Board} = require('ROOT/server/models');
const router = module.exports = new Router();

router.get('/', (req, res, next) => {
  const {userId, boardId, mentionedUserId, limit} = req.query;
  const noteQuery = {include: []};

  if (userId) {
    noteQuery.include.push({
      model: User,
      where: {id: req.query.userId}
    });
  }
  if (mentionedUserId) {
    noteQuery.include.push({
      model: User,
      as   : 'MentionedUser',
      where: {id: req.query.mentionedUserId}
    });
  }
  if (boardId) {
    noteQuery.include.push({
      model: Board,
      where: {id: req.query.boardId}
    });
  }
  if (limit) {
    noteQuery.limit = req.query.limit;
  }

  Note.findAll(noteQuery)
    .then(notes => res.send(notes))
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  Note.findById(req.params.id)
    .then(note => res.send(note))
    .catch(next);
});

router.post('/', (req, res, next) => {
  Promise.all([
    Note.create({
      content: req.body.content,
      color  : req.body.color,
      top    : req.body.top || null,
      left   : req.body.top || null
    }),
    Board.findById(req.body.boardId)
  ])
    .then(([ note, board ]) => Promise.all([
      note,
      note.setBoard(board),
      note.setUser(req.user)
    ]))
    .then(([ note ]) => res.send(note))
    .catch(next);
});

router.put('/:id', (req, res, next) => {
  const changes = {};
  if (req.body.content) changes.content = req.body.content;
  if (req.body.color) changes.color = req.body.color;
  if (req.body.top) changes.top = req.body.top;
  if (req.body.left) changes.left = req.body.left;

  Note.update(changes, {where: {id: req.params.id}})
    .then(note => res.sendStatus(200))
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  Note.destroy({where: {id: req.params.id}})
    .then(() => res.sendStatus(200))
    .catch(next);
});

router.use((err, req, res, next) => {
  console.log('Error in server/routes/api/note.js');
  next(err);
});
