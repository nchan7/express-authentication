const express = require('express');
const db = require('../models');
const passport = require('../config/passportConfig');
const router = express.Router();


router.get('/signup', function(req, res) {
  res.render('auth/signup');
});

router.post('/signup', function(req, res) {
  db.user.findOrCreate({
    where: {email: req.body.email},
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).spread(function(user, created) {
    if (created) {
      console.log("user was created, not found");
      passport.authenticate('local', {
        successRedirect: '/'
      })(req, res); //! IMMEDIATELY INVOKED FUNCTION EXPRESSION "IIFE"
    } else {
      console.log("email already exists");
      res.redirect('/auth/signup');
    }
  }).catch(function(error) {
    console.log("Error:", error.message);
    res.redirect('/auth/signup')
  });
});

router.get('/login', function(req, res) {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/', 
  failureRedirect: '/auth/login'
}));

router.get('/logout', function(req, res) { // When you logout, it deletes the session from memory
  req.logout();
  console.log('logged out');
  res.redirect('/');
});

module.exports = router;
