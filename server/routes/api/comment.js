'use strict';

const express = require('express');
const router = express.Router();
const {Board, User, CommentPermission, Note, Comment} = require('../../models/');


router.get('/:id', (req, res, next) => {
  Comment.findAll({
    where: {
      note_id: req.params.id
    },
    include: [ { model: User} ]
  })
    .then(comments => {
      res.json(comments);
    })
    .catch(next);
});

router.post('/', (req, res, next) => {

  const text = req.body.text;
  const noteId = req.body.noteId;
  const userId = req.body.userId;
  Comment
    .create({
      text: text,
    })
    .then(comment => {
      return Promise.all(
        [ comment,
          comment.setUser(Number(userId)),
          comment.setNote(Number(noteId)) ]);
    })
    .then(([ comment ]) => {
      return comment.includeUser();
    })
    .then(commentWithUser => {
      res.json(commentWithUser);
    })
    .catch(next);
});


router.put('/:id', (req, res, next) => {
  console.log(req.body);
  console.log(req.params.id);
  const text = req.body.text;

  Comment.update({text}, {
    where: {
      id: Number(req.params.id)
    }
  })
    .then(comment => res.json(comment))
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  Comment.destroy({
    where: {
      id: Number(req.params.id)
    }
  })
    .then((result) => res.json(result))
    .catch(next);
});

router.use((err, req, res, next) => {
  console.log('Error in server/routes/api/comment.js', err);
  next(err);
});


module.exports = router;
