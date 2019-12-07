// Our requirements
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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
    const user = await new User({ 
      googleId: profile.id,
      email: profile._json.email,
      activated: true 
    }).save();
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
    const user = await new User({
      githubId: profile.id, 
      email: profile._json.email,
      activated: true 
    }).save();
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
    const user = await new User({
      facebookId: profile.id, 
      email: profile._json.email,
      activated: true 
    }).save();
    done(null, user);
  })
);