var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../models');

//* Taken from Passport's Local Strategy Website...they tell us best practice for using their app

/*
 * Passport "serializes" objects to make them easy to store, converting the
 * user to an identifier (id)
 ...turning something into a packaged ID to be able to send over the web (typically, JSON)
 */
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

/*
 * Passport "deserializes" objects by taking the user's serialization (id)
 * and looking it up in the database
 */
passport.deserializeUser(function(id, cb) {
  db.user.findByPk(id).then(function(user) {
    cb(null, user);
  }).catch(cb);
});

/*
 * This is Passport's strategy to provide local authentication. We provide the
 * following information to the LocalStrategy:
 *
 * Configuration: An object of data to identify our authentication fields, the
 * username and password
 *
 * Callback function: A function that's called to log the user in. We can pass
 * the email and password to a database query, and return the appropriate
 * information in the callback. Think of "cb" as a function that'll later look
 * like this:
 *
 * login(error, user) {
 *   // do stuff
 * }
 *
 * We need to provide the error as the first argument, and the user as the
 * second argument. We can provide "null" if there's no error, or "false" if
 * there's no user.
 */
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(email, password, cb) {
  db.user.findOne({
    where: { email: email }
  }).then(function(user) { //* If it doesn't find the email then it returns nothing. If user = null, validPassword also won't work
    if (!user || !user.validPassword(password)) {
      cb(null, false);
    } else {
      cb(null, user);
    }
  }).catch(cb);
}));

// export the Passport configuration from this module
module.exports = passport;