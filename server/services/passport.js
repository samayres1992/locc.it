// Our requirements
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const validateRegisterInput = require("./validator/registerValidation");
const validateLoginInput = require("./validator/loginValidation");
const mongoose = require('mongoose');
const keys = require('../config/keys');

// Model for our users
const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id)
});

passport.deserializeUser((id, done) => {
  User.findById(id)
  .then(user => {
    done(null, user);
  });
});

// Create a strategy for passport
passport.use(
  // Google
  new GoogleStrategy({
    clientID: keys.googleClientId,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
  }, 
  async (accessToken, refreshToken, profile, done) => {
    const existingUser = await User.findOne({ googleId: profile.id });

    if(existingUser) {
      // User already exists 
      return done(null, existingUser);
    }
    // New user, save them to the DB
    const user = await new User({ googleId: profile.id }).save();
    done(null, user);
  })
);
  
passport.use(
  // Github
  new GitHubStrategy({
    clientID: keys.githubPubKey,
    clientSecret: keys.githubSecretKey,
    callbackURL: "/auth/github/callback"
  }, 
  async (accessToken, refreshToken, profile, done) => {
    const existingUser = await User.findOne({ githubId: profile.id });

    if(existingUser) {
      // User already exists 
      return done(null, existingUser);
    }
    // New user, save them to the DB
    const user = await new User({ githubId: profile.id }).save();
    done(null, user);
  })
);

passport.use(
  // Facebook
  new FacebookStrategy({
    clientID: keys.facebookClientId,
    clientSecret: keys.facebookSecretKey,
    callbackURL: "/auth/facebook/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    const existingUser = await User.findOne({ facebookId: profile.id });

    if(existingUser) {
      // User already exists 
      return done(null, existingUser);
    }
    // New user, save them to the DB
    const user = await new User({ facebookId: profile.id }).save();
    done(null, user);
  })
);

passport.use(
  new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email',
    passwordField: 'password'
  },
  async (req, username, password, done) => {
    if (user) {
      errors.email = "email already exists";
      res.status(400).json(errors);
    } 
    else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //Size
        r: "pg", //Rating
        d: "mm" //Default
      });
      //Create a new user from the data provided in the body (Comes from front end form)
      const User = new User({
        avatar: avatar,
        email: req.body.email,
        password: req.body.password
      });
      //Use Bcrypt to encrypt the password using Salt.
      bcrypt.genSalt(10, (error, salt) => {
        bcrypt.hash(User.password, salt, (error, hash) => {
          if (error) {
            throw error;
          }
          User.password = hash;
          User
            .save()
            .then(user => res.json(user))
            .catch(error => console.log(error));
        });
      });
    }
  }
));