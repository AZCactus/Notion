'use strict';

const express = require('express');
const router = express.Router();
const {Board, User, BoardPermission, Note} = require('ROOT/server/models/');


router.get('/', (req, res, next) => {
  let boardQuery = {};
  let boardPermissionQuery = {};

  if (req.user) {
    boardQuery = {
      include: [ {
        model: User,
        where: { id: req.user.id},
      } ]
    };
    boardPermissionQuery = {
      where: { user_id: req.user.id}
    };
  }


  Promise.all([
    Board.findAll(boardQuery),
    BoardPermission.findAll(boardPermissionQuery)
  ])
    .then(([ boards, permissions ]) => {
      res.json({boards, permissions});
    })
    .catch(next);
});


router.get('/:boardHash', (req, res, next) => {
  const boardHash = req.params.boardHash;
  return Board.findOne({where: { hash: boardHash}})
    .then((board) => {
      res.json(board);
    })
    .catch(next);
});

router.post('/', (req, res, next) => {
  const boardName = req.body.boardName;
  Board
    .create({
      name: boardName,
    })
    .then(board => {
      console.log(board);
      return Promise.all([ board, board.addUser(req.user.id) ]);
    })
    .then(([ board, permission ]) => {
      return Promise.all([
        board,
        BoardPermission.findOne({
          where: {
            board_id: board.id,
            user_id : req.user.id
          }
        })
          .then((p) => {
            return p.update({permission: 'admin'});
          })
      ]);
    })
    .then(([ board, permission ]) => {
      res.json({board, permission});
    })
    .catch(next);
});


router.put('/:id', (req, res, next) => {
  const changes = {};
  if (req.body.name) changes.name = req.body.name;
  if (req.body.hash) changes.hash = req.body.hash;

  Board.update(changes, {
    where: {
      id: Number(req.params.id)
    }
  })
    .then(board => res.json(board))
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  Board.destroy({
    where: {
      id: Number(req.params.id)
    }
  })
    .then((result) => res.json(result))
    .catch(next);
});

router.use((err, req, res, next) => {
  console.log('Error in server/routes/api/board.js', err);
  next(err);
});


module.exports = router;
