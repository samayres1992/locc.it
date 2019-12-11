// Our requirements
const keys = require('../config/keys');
const passport = require('passport');
const nodemailer = require("nodemailer");
const path = require('path');
// const emailTemplates = require("email-templates").EmailTemplate;
// const send = transporter.templateSender(new EmailTemplate('email/'));
const hbs = require("nodemailer-express-handlebars");
const validateLogin = require("../services/validator/loginValidation");
const validateRegistration = require("../services/validator/registerValidation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const User = mongoose.model('users');

let mailer = nodemailer.createTransport({
  host: "mail.gandi.net",
  port: 465,
  secure: true,
  auth: {
    user: keys.emailUser, 
    pass: keys.emailPass 
  }
});

let options = {
  viewEngine: {
    extname: '.hbs', // handlebars extension
    layoutsDir: path.join(__dirname, './email'), // location of handlebars templates
    defaultLayout: 'index',
    viewPath: path.join(__dirname, './email'),
    partialsDir: path.join(__dirname, './email/partials'),
    extName: '.hbs'
  },
  viewPath: path.join(__dirname, './email/'),
  extName: '.hbs'
}

mailer.use('compile', hbs(options));

module.exports = app => {
  // Facebook
  app.get('/auth/facebook', 
    passport.authenticate('facebook', { scope : ['email'] }
  ));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      // Use manual redirect due to facebook bug that appends "#_=_" to URL
      res.redirect('/');
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
      successRedirect: '/'
    })
  );

  // Github
  app.get('/auth/github',
    passport.authenticate('github', { scope: [ 'user:email' ] })
  );

  app.get('/auth/github/callback', 
    passport.authenticate('github', { 
      failureRedirect: '/login', 
      successRedirect: '/'
    })
  );

  // Local Registration
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
        // Generate a user verfification token
        const verificationToken = jwt.sign({
          data: email
        }, keys.localSecret, { expiresIn: '7d' });

        mailer.sendMail({
          from: keys.emailUser, // sender address
          to: email, // list of receivers
          subject: 'Locc.it: Account verification', // Subject line
          template: 'index',
          context: {
            verificationToken : "https://locc.it/auth/local/verify" + verificationToken
          },
          attachments:[{
            filename : 'loccit.png',
            path: path.join(__dirname, 'email/images/loccit.png'),
            cid : 'logo@locc.it'
          }],
        });
        
        //Create a new user from the data provided in the body (Comes from front end form)
        const newUser = new User({
          email: email,
          password: password,
          token: verificationToken
        });
        //Use Bcrypt to encrypt the password using Salt.
        bcrypt.genSalt( 10, ( error, salt ) => {
          bcrypt.hash( newUser.password, salt, ( error, hash ) => {
            if ( error ) {
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

  app.get("/auth/local/verify/:token", (req, res) => {
    const token = req.originalUrl.split('/')[4];

    User.updateOne(
      { 'token': token }, // Find token
      { 'activated': true, 'token': '' } // Update value
    ).then(data => {
      if ( data ) {
        res.redirect('/login?activated');
      } else {
        // Failed to find a result
        res.send(false);
      }
    });
  });

  app.post("/auth/local/login", (req, res) => {
    // console.log('res', res);
    console.log('req', req.body);
    const { errors, isValid } = validateLogin(req.body);
    const { email, password } = req.body;
  
    //Check validation
    if ( !isValid ) {
      return res.status(400).json(errors);
    }
  
    //Find the user by email to see if they are in the database
    User.findOne({ email }).then(user => {
      if ( !user ) {
        errors.email = "Users email was not found";
        return res.status(404).json(errors);
      }
      //Check password
      bcrypt.compare( password, user.password ).then(isMatch => {
        if ( isMatch ) {
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
            ( error, token ) => {
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

  app.post("/auth/delete_user", (req, res) => {
    const { authId } = req.body.data;

    User.deleteOne(
      { '_id': authId }
    ).then(user => {
      if ( user ) {
        res.sendStatus(200);
      }
      else {
        return res.sendStatus(500);
      }
    });
    // Delete successful, log them out
    req.logout();
  }); 

  app.post("/auth/update_password", (req, res) => {
    const { authId, password } = req.body.data;

    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(password, salt, (error, hash) => {
        if ( error ) {
          console.log('err', error );
          throw error;
        }
        User.updateOne(
          { '_id': authId }, 
          { 'password': hash } 
        ).then(user => {
          if ( user ) {
            res.sendStatus(200);
          } 
          else {
            // Failed to find a result
            return res.sendStatus(500);
          }
        });
      });
    });
  });

  app.get('/auth/current_user', (req, res) => {
    res.send(req.user);
  });

  app.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};