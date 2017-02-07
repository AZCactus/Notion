'use strict';

const Router = require('express').Router;
const {Note, User, Board, Comment} = require('ROOT/server/models');
const router = module.exports = new Router();

router.get('/', (req, res, next) => {
  const noteQuery = {include: []};

  if (req.query && req.query.userId) {
    noteQuery.include.push({
      model: User,
      where: {id: req.query.userId}
    });
  }
  if (req.query && req.query.boardId) {
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

  if (req.query && req.query.limit) {
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
  Promise.all([
    Note.create({
      content: req.body.content,
      color  : req.body.color,
      top    : req.body.top || null,
      left   : req.body.top || 0
    }),
    Board.findById(req.body.boardId)
  ])
    .then(([ note, board ]) => Promise.all([
      note,
      board,
      note.setBoard(board),
      note.setUser(req.user)
    ]))
    .then(([ note, board ]) => {
      return new Promise((resolve, reject) => {
        const topTraverse = function(top) {
          Note.findOne({
            where: { top: top, left: 0, board_id: board.id}})
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
