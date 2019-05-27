
const session = require('express-session');
const cookieparser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const Users = require('../models/User.js');
var mongoose = require('mongoose');

var authUser = new Users();


module.exports = (app) => {

  app.use(cookieparser());
  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,

    rolling: true,
    name: 'sid', 
    cookie: {
      httpOnly: true,
      maxAge: 20 * 60 * 1000,
    }
  }));
  app.use(flash());

  passport.serializeUser((user, done) => {
    done(null, user[0]._id);
  });

  passport.deserializeUser(function (userId, done) {
    console.log(userId);
    Users.find({_id: userId})
      .then(function (user) {
        done(null, user);
      })
      .catch(function (err) {
        done(err);
      });
  });

  passport.use(new LocalStrategy({usernameField: 'username', passwordField: 'password'},(username, password, done) => {
    const errorMsg = 'Invalid username or password';
    console.log("FIRE")
    console.log(username);
    Users.find({username: username})
      .then(function(user) {
        if (user < 1) {
          return done(null, false, {message: errorMsg});
        }
        return authUser.validatePassword(user, password)
        .then(isMatch => done(null, isMatch ? user : false, isMatch ? null : { message: errorMsg }));
      })
      .catch(done);
  }));

  app.use(passport.initialize());
  app.use(passport.session());
}

