// Our requirements
const passport = require('passport');
const gitHubStrategy = require('passport-github2').Strategy;
const googleStrategy = require('passport-google-oauth20').Strategy;
const localStrategy = require('passport-local').Strategy;
const Moment = require('moment');
const { db, uuid } = require('../db');
const keys = require('../config/keys');
const system = require('../config/system');
const bcrypt = require("bcryptjs");

// Prepared statements for the auth flow.
const findUserById       = db.prepare(`SELECT * FROM users WHERE id = ?`);
const findUserByGoogleId = db.prepare(`SELECT * FROM users WHERE google_id = ?`);
const findUserByGithubId = db.prepare(`SELECT * FROM users WHERE github_id = ?`);
const findUserByEmail    = db.prepare(`SELECT * FROM users WHERE email = ?`);
const insertOAuthUser    = db.prepare(`
  INSERT INTO users (id, google_id, github_id, email, activated, activate_by)
  VALUES (@id, @google_id, @github_id, @email, 1, @activate_by)
`);

// Sessions store just the user id (a UUID string); deserialize fetches the
// row each request. Cheap with SQLite — one prepared SELECT by primary key.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  try {
    const user = findUserById.get(String(id));
    done(null, user || null);
  } catch (err) {
    done(err, null);
  }
});

// Google
if (keys.googleClientId && keys.googleClientSecret) {
  passport.use(
    new googleStrategy({
      clientID: keys.googleClientId,
      clientSecret: keys.googleClientSecret,
      callbackURL: system.BASE_URL + '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingByGoogleId = findUserByGoogleId.get(profile.id);
        if (existingByGoogleId) return done(null, existingByGoogleId);

        const email = profile._json && profile._json.email;
        if (email) {
          const existingByEmail = findUserByEmail.get(email);
          if (existingByEmail) return done(null, existingByEmail);
        }

        // New user — OAuth identities are auto-activated.
        const newUser = {
          id: uuid(),
          google_id: profile.id,
          github_id: null,
          email: email || null,
          activate_by: Moment().add(7, 'days').toISOString(),
        };
        insertOAuthUser.run(newUser);
        return done(null, findUserById.get(newUser.id));
      } catch (err) {
        return done(err, null);
      }
    })
  );
}

// Github
if (keys.githubPubKey && keys.githubSecretKey) {
  passport.use(
    new gitHubStrategy({
      clientID: keys.githubPubKey,
      clientSecret: keys.githubSecretKey,
      callbackURL: system.BASE_URL + '/auth/github/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingByGithubId = findUserByGithubId.get(profile.id);
        if (existingByGithubId) return done(null, existingByGithubId);

        const email = profile._json && profile._json.email;
        if (email) {
          const existingByEmail = findUserByEmail.get(email);
          if (existingByEmail) return done(null, existingByEmail);
        }

        const newUser = {
          id: uuid(),
          google_id: null,
          github_id: profile.id,
          email: email || null,
          activate_by: Moment().add(7, 'days').toISOString(),
        };
        insertOAuthUser.run(newUser);
        return done(null, findUserById.get(newUser.id));
      } catch (err) {
        return done(err, null);
      }
    })
  );
}

passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: true,
    passReqToCallback: true
  },
  (req, email, password, done) => {
    try {
      const user = findUserByEmail.get(email);
      if (!user || !user.password) {
        // No user, or an OAuth-only account with no local password set.
        return done(null, null);
      }
      bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch) return done(null, null);
        return done(null, user);
      });
    } catch (err) {
      return done(err);
    }
  }
));
