'use strict';

const api = module.exports = require('express').Router();

api
  .get('/heartbeat', (req, res) => res.send({ok: true}))
  .use('/boards', require('./board'))
  .use('/notes', require('./note'))
  .use('/user', require('./user'))
  .use('/auth', require('./auth'))
  .use('/comment', require('./comment'));

// Send along any errors
api.use((err, req, res, next) => {
  console.error('error:', err.stack);
  res.status(500).send(err);
});

// No routes matched? 404.
api.use((req, res) => res.status(404).end());
