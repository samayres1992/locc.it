// Our requirements
const passport = require('passport');
const gitHubStrategy = require('passport-github2').Strategy;
const googleStrategy = require('passport-google-oauth20').Strategy;
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');
const system = require('../config/system');
const bcrypt = require("bcrypt");
const _ = require("lodash");

// Model for our users
const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user._id );
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Create a strategy for passport
passport.use(
  // Google
  new googleStrategy({
    clientID: keys.googleClientId,
    clientSecret: keys.googleClientSecret,
    callbackURL: system.BASE_URL + '/auth/google/callback'
  }, 
  async (accessToken, refreshToken, profile, done) => {
    // Check if user already exists through ID
    const existingUserID = await User.findOne({ googleId: profile.id });

    // Check if email exists (through other Auth method)
    const existingUserEmail = await User.findOne({ email: profile._json.email});

    if(existingUserID) {
      // User with that ID already exists
      return done(null, existingUserID);
    }
    else if (existingUserEmail) {
      // User with that Email already exists
      return done(null, existingUserEmail);
    }
    // New user, save them to the DB
    const user = await new User({
      googleId: profile.id,
      activated: true,
      email: profile._json.email
    }).save();
    done(null, user);
  })
);
  
passport.use(
  // Github
  new gitHubStrategy({
    clientID: keys.githubPubKey,
    clientSecret: keys.githubSecretKey,
    callbackURL: system.BASE_URL + '/auth/github/callback'
  }, 
  async (accessToken, refreshToken, profile, done) => {
    // Check if user already exists through ID
    const existingUserID = await User.findOne({ githubId: profile.id });

    // Check if email exists (through other Auth method)
    const existingUserEmail = await User.findOne({ email: profile._json.email});

    if(existingUserID) {
      // User with that ID already exists
      return done(null, existingUserID);
    }
    else if (existingUserEmail) {
      // User with that Email already exists
      return done(null, existingUserEmail);
    }
    // New user, save them to the DB
    const user = await new User({
      githubId: profile.id,
      activated: true,
      email: profile._json.email
    }).save();
    done(null, user);
  })
);

passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: true,
    passReqToCallback: true
  }, 
  (req, email, password, done) => {
    User.findOne(
      { email: email }
    ).then(user => {
      if (!user) {
        // No user found
        return done(null, null);
      }
      //Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch) {
          return done(null, null);
        }
        else {
          req.login(user, (err) => {
            if (err) { return next(err); }
            return done(null, user);
          });
        }
      });
    });
  }
));