// Our requirements
const keys = require('../config/keys');
const passport = require('passport');
const validateLogin = require("../services/validator/loginValidation");
const validateRegistration = require("../services/validator/registerValidation");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const User = mongoose.model('users');

module.exports = app => {
  // Facebook
  app.get('/auth/facebook', 
    passport.authenticate('facebook')
  );

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      // Use manual redirect due to facebook bug that appends "#_=_" to URL
      res.redirect('/dashboard');
    }
  );

  // Google
  app.get(
    '/auth/google', 
    passport.authenticate('google', {
      scope: ['profile', 'email']
    }
  ));

  app.get(
    '/auth/google/callback', 
    passport.authenticate('google', { 
      failureRedirect: '/login', 
      successRedirect: '/dashboard'
    })
  );

  // Github
  app.get('/auth/github',
    passport.authenticate('github', { scope: [ 'user:email' ] })
  );

  app.get('/auth/github/callback', 
    passport.authenticate('github', { 
      failureRedirect: '/login', 
      successRedirect: '/dashboard'
    })
  );

  // TODO: Add Local sign in and register 
  app.post('/auth/local/register', (req, res) => {
    const { errors, isValid } = validateRegistration(req.body);
    const { email, password } = req.body;

    //Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    //First find out if the user exists in the database already.
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.email = "email already exists";
        res.status(400).json(errors);
      } 
      else {
        //Create an avatar from gravatar TODO: Change This.
        const avatar = gravatar.url(email, {
          s: "200", //Size
          r: "pg", //Rating
          d: "mm" //Default
        });
        //Create a new user from the data provided in the body (Comes from front end form)
        const newUser = new User({
          email: email,
          avatar: avatar,
          password: password
        });
        //Use Bcrypt to encrypt the password using Salt.
        bcrypt.genSalt(10, (error, salt) => {
          bcrypt.hash(newUser.password, salt, (error, hash) => {
            if (error) {
              throw error;
            }
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(error => console.log(error));
          });
        });
      }
    });
  });

  app.post("/auth/local/login", (req, res) => {
    const { errors, isValid } = validateLogin(req.body);
    const { email, password } = req.body;
  
    //Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  
    //Find the user by email to see if they are in the database
    User.findOne({ email }).then(user => {
      if (!user) {
        errors.email = "Users email was not found";
        return res.status(404).json(errors);
      }
      //Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          //user password matched the one that was in the database
          const payload = {
            id: user.id,
            email: user.email
          };
          //Sign in token, expires in is in seconds
          jwt.sign(
            payload,
            keys.localSecret,
            { expiresIn: 3600 },
            (error, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          // No match
          errors.password = "Password is incorrect";
          return res.status(400).json(errors);
        }
      });
    });
  });

  app.get('/api/current_user', (req, res) => {
      res.send(req.user);
  });

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};