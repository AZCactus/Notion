'use strict';

const Router = require('express').Router;
const {Note, User, Board, Comment} = require('../../models');
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

  noteQuery.include.push({
    model  : Comment,
    include: [ {
      model: User
    } ]
  });

  if (limit) {
    noteQuery.limit = req.query.limit;
  }

  Note.findAll(noteQuery)
    .then(notes => res.send(notes))
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  Note.findOne({where  : { id: Number(req.params.id)},
  include: [ Comment ]})
    .then(note => res.send(note))
    .catch(next);
});

router.post('/', (req, res, next) => {
  const {content, color, top, left, boardId} = req.body;
  const mentions = req.body.mentions || [];

  Note.create({
    content: req.body.content,
    color  : req.body.color,
    top    : req.body.top || null,
    left   : req.body.left || 0
  })
    .then((note) => Promise.all([
      note,
      note.setBoard(boardId),
      note.setUser(req.user),
      ...mentions.map((userId) => note.addMentionedUser(userId))
    ]))
    .then(([ note, board ]) => {
      return new Promise((resolve, reject) => {
        const topTraverse = function(top) {
          Note.findOne({
            where: { top: top, left: 0, board_id: boardId}})
          .then(noteToCheck => {
            if (noteToCheck === null) {
              note.update({top: top})
              .then(result => {
                resolve(result);
              });
            }
            else {
              topTraverse(top + 20);
            }
          });
        };
        topTraverse(0);
      });
    })
    .then(note => {
      res.send(note);
    })
    .catch(next);
});

router.put('/:id', (req, res, next) => {
  const {content, color, top, left, mentions} = req.body;
  const changes = {};
  if (content) changes.content = content;
  if (color) changes.color = color;
  if (top) changes.top = top;
  if (left) changes.left = left;

  Note.update(changes, {where: {id: req.params.id}})
    .then(note => res.sendStatus(200))
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  Note.destroy({where: {id: req.params.id}})
    .then(() => res.sendStatus(200))
    .catch(next);
});

router.delete('/bulk', (req, res, next) => {
  let deleteArr;

  deleteArr.forEach((note) => {
    Note.destroy({where: {id: note.id}})
      .then(() => res.sendStatus(200))
      .catch(next);
  });
});


router.use((err, req, res, next) => {
  console.log('Error in server/routes/api/note.js');
  next(err);
});
