// Our requirements
const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;
const gitHubStrategy = require('passport-github2').Strategy;
const googleStrategy = require('passport-google-oauth20').Strategy;
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');
const validator = require("validator");
const bcrypt = require("bcrypt");
const _ = require("lodash");

// Model for our users
const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id)
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  // facebook
  new facebookStrategy({
    clientID: keys.facebookClientId,
    clientSecret: keys.facebookSecretKey,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'emails']
  }, 
  async (accessToken, refreshToken, profile, done) => {
    // Check if user already exists through ID
    const existingUserID = await User.findOne({ facebookId: profile._json.id });

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
      facebookId: profile.id,
      activated: true,
      email: profile._json.email,
    }).save();
    done(null, user);
  })
);

// Create a strategy for passport
passport.use(
  // Google
  new googleStrategy({
    clientID: keys.googleClientId,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
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
    callbackURL: "/auth/github/callback"
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
    passwordField: 'password'
  }, 
  (email, password, done) => {
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
          return done(null, user);
        }
      });
    });
  }
));