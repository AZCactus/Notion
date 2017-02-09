'use strict';


const express = require('express');
const Router = express.Router;
const router = new Router();
const path = require('path');

router.use('/api', require('./api'));

router.use('/*', (req, res) => {

  res.sendFile(path.resolve(__dirname, '../../dist/index.html'));
});

module.exports = router;
