'use strict';

const express = require('express');
const Router = express.Router;
const router = new Router();

const passport = require('passport');
const {User} = require('../../models');

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, done) => {
  User.findOne({
    where: {
      email: email,
    }
  })
    .then((user) => {
      if (user) {
        return Promise.all([
          user.checkPassword(password),
          user
        ]);
      } else {
        done(null, false, {message: 'Incorrect authentication'});
      }
    })
    .then(result => {
      if (result) {
        const [ passwordMatched, user ] = result;
        passwordMatched ? done(null, user) : done(null, false, {message: 'password is incorrect'});
      }
    })
    .catch(done);
}));

/* login */
router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, message) => {
    if (err) { return next(err); }
    if (user) {
      req.login(user, (loginErr) => {
        if (loginErr) { return next(loginErr); }
        return res.send(user);
      });
    } else {
      return res.status(401).send(message);
    }
  })(req, res, next);
});

/* check log in status */
router.get('/', (req, res, next) => {
  req.isAuthenticated() ? res.send(req.user) :
  res.json({});
});

/* logout destroy session */
router.delete('/', (req, res, next) => {
  req.session.destroy();
  res.send();
});

module.exports = router;
