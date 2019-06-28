require('dotenv').config();
const express = require('express'); // To import a node module allows us to just require it with the name
const ejsLayouts = require('express-ejs-layouts');
//* Module allows use of sessions
const session = require('express-session');
//* Imports passport local strategy
const passport = require('./config/passportConfig'); // Import handwritten code by going to the folder
//* Module for flash messages
const flash = require('connect-flash');
const isLoggedIn = require('./middleware/isLoggedIn');
const helmet = require('helmet');

//* This is only used by the session store in this model 
const db  = require('./models');

const app = express();

// This line makes the session use sequelize to write session data to a postgres table
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sessionStore = new SequelizeStore({
  db: db.sequelize, 
  //? This is in milliseconds?
  expiration: 1000 * 60 * 30 
});

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(ejsLayouts);
app.use(helmet());

// Configures express-session middleware
app.use(session({
  secret: process.env.SESSION_SECRET, //* Good to have one distinct session secret per app. Sessions can be forged
  resave: false,
  saveUninitialized: true,
  // after we initailized the variable and object
  store: sessionStore
}));

// Use this line once to set up the store table
sessionStore.sync();

//! RELIES ON THE SESSION SO MUST BE BELOW SESSION
// Starts the flash middleware
app.use(flash());

// Link passport ot the express session
//! MUST BE BELOW SESSION
app.use(passport.initialize()); //* Built in passport function...that's what they advise us to do first
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.alerts = req.flash(); 
  res.locals.currentUser = req.user; 
  next(); 
  /* 
  If there were additional middleware then next would tell the code to continue to the next piece of middleware...
  in our code we don't have any additional middleware 
  */
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});

app.use('/auth', require('./controllers/auth'));
// app.use('/auth', isLoggedIn, require('./controllers/auth')); Restricts all logins on all of these routes

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
