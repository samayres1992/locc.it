// Our requirements
const keys = require('../config/keys');
const passport = require('passport');
const nodemailer = require("nodemailer");
const _ = require("lodash");
const path = require('path');
const jwt = require("jsonwebtoken");
const hbs = require("nodemailer-express-handlebars");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const User = mongoose.model('users');
const requireLogin = require('../middlewares/requireLogin');
const EmailValidator = require('email-validator');
const passwordValidator = require('password-validator');
var passwordSchema = new passwordValidator(); 
passwordSchema
.is().min(8)          // Minimum length 8
.is().max(100)        // Maximum length 100
.has().uppercase()    // Must have uppercase char
.has().lowercase()    // Must have lowercase char
.has().digits()       // Must have digit
.has().symbols()      // Must have special char

let mailer = nodemailer.createTransport({
  host: "mail.gandi.net",
  port: 465,
  secure: true,
  auth: {
    user: keys.emailUser, 
    pass: keys.emailPass 
  }
});

module.exports = app => {
  // Facebook
  app.get('/auth/facebook', 
    passport.authenticate('facebook', { scope : ['email'] }
  ));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
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
  
  app.get("/auth/local/verify/:token", (req, res) => {
    const token = req.originalUrl.split('/')[4];

    jwt.verify(token, keys.localSecret, (err, decodedToken) => {
      if (err) {
        res.sendStatus(500);
      }
      else {
        User.updateOne(
          { 'email': decodedToken.data }, // Find token
          { 'activated': true } // Update value
      ).then((data) => {
          console.log("data", data);
          if (data) {
            res.redirect('/login?activated');
          } else {
            // Failed to find a result
            res.send(false);
          }
        });
      }
    });
  });

  app.post('/auth/local/register', (req, res) => {
    const { email, password } = req.body;
    let registerErrors = {};
    console.log('email and password', { email, password});

    if ( email && password) {
      if (!EmailValidator.validate(email)) {
        registerErrors.email = 'Please provide a valid email';
      }
  
      if (!passwordSchema.validate(password)) {
        registerErrors.password = 'Password does not forfil all requirements';
      }
    }
    else {
      registerErrors.email = 'Please provide an email';
      registerErrors.email = 'Please provide a password';
    }

    if (!_.isEmpty(registerErrors)) {
      return res.send({ errors: registerErrors });
    }

    // If no errors, we can create the user
    User.findOne({ email: email }).then((user) => {
      if (user) {
        registerErrors.email = 'Email already exists';
        return res.send({ errors: registerErrors });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            
            const newUser = new User({ email, hash });
            
            if (newUser) {
              const { _id, activated } = newUser;
              let options = {
                viewEngine: {
                  extname: '.html', // handlebars extension
                  layoutsDir: path.join(__dirname, './email/activation'), // location of handlebars templates
                  defaultLayout: 'index',
                  viewPath: path.join(__dirname, './email/activation'),
                  partialsDir: path.join(__dirname, './email/activation')
                },
                viewPath: path.join(__dirname, './email/activation'),
                extName: '.html'
              }
              
              mailer.use('compile', hbs(options));
          
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
                  verificationToken : "https://locc.it/auth/local/verify/" + verificationToken
                },
                attachments:[{
                  filename : 'loccit.png',
                  path: path.join(__dirname, 'email/images/loccit.png'),
                  cid : 'logo@locc.it'
                }],
              });
              res.send({ _id, activated });
            }
          });
        });
      }
    });
  });

  app.post('/auth/local/login', 
    passport.authenticate('local', 
      { 
        successRedirect: '/',
        failureRedirect: '/login',
        session: true
      }
  ));

  app.post('/auth/local/send_reset',  (req, res) => {
    const { email } = req.body.data;
    var resetErrors = {};

    if (!EmailValidator.validate(email)) {
      resetErrors.email = 'Please provide a valid email';
    }

    if (!_.isEmpty(resetErrors)) {
      return res.send({ errors: resetErrors });
    }

    User.findOne({ email: email }).then((user) => {
      if (user) {
        try {
          // Generate a user verfification token
          const verificationToken = jwt.sign({
            data: email
          }, keys.localSecret, { expiresIn: '1d' });
    
          let options = {
            viewEngine: {
              extname: '.html', // handlebars extension
              layoutsDir: path.join(__dirname, './email/reset'), // location of handlebars templates
              defaultLayout: 'index',
              viewPath: path.join(__dirname, './email/reset'),
              partialsDir: path.join(__dirname, './email/reset')
            },
            viewPath: path.join(__dirname, './email/reset'),
            extName: '.html'
          }
          
          mailer.use('compile', hbs(options));
    
          mailer.sendMail({
            from: keys.emailUser, // sender address
            to: email, // list of receivers
            subject: 'Locc.it: Reset password', // Subject line
            template: 'index',
            context: {
              verificationToken : "https://locc.it/reset/" + verificationToken
            },
            attachments:[{
              filename : 'loccit.png',
              path: path.join(__dirname, 'email/images/loccit.png'),
              cid : 'logo@locc.it'
            }],
          });
          return res.send("OK");
        }
        catch (errors) {
          resetErrors.email = "Unable to reset password, please contact us directly.";
          return res.send({ errors: resetErrors });
        }
      }
      else {
        resetErrors.email = "Unable to find an account with the email provided.";
        return res.send({ errors: resetErrors });
      }
    });
  });
  

  app.post('/auth/local/reset',  (req, res) => {
    const { token, password } = req.body;
    var resetErrors = {};
    jwt.verify(token, keys.localSecret, (err, decodedToken) => {
      if (err) {
        resetErrors.verification = "Invalid verification token";
      }
      else if (!passwordSchema.validate(password)) {
        resetErrors.password = 'Password does not forfil all requirements';
      }
      else {
        bcrypt.genSalt(10, (error, salt) => {
          bcrypt.hash(password, salt, (error, hash) => {
            if (error) {
              resetErrors.password = "Unable to set user password";
            }
            User.findOneAndUpdate(
              { 'email': decodedToken.data }, 
              { 'password': hash } 
            ).then(({ _id, activated }) => {
              if (user) {
                return res.send({ _id, activated });
              } 
              else {
                resetErrors.email = "User with supplied email address does not exist"
              }
            });
          });
        });
      }
    });
    if (!_.isEmpty(resetErrors)) {
      return res.send({ errors: resetErrors });  
    } 
  });

  app.post("/auth/delete_user", requireLogin, (req, res) => {
    const { authId } = req.body.data;

    User.deleteOne(
      { '_id': authId }
    ).then(user => {
      if (user) {
        res.sendStatus(200);
      }
      else {
        return res.sendStatus(500);
      }
    });
    // Delete successful, log them out
    req.logout();
  }); 

  app.post("/auth/update_email", requireLogin, (req, res) => {
    const { authId, email } = req.body.data;
    var emailErrors = {};

    if (!EmailValidator.validate(email)) {
      emailErrors.email = 'Please provide a valid email';
    }

    if (!_.isEmpty(emailErrors)) {
      return res.send({ errors: emailErrors });
    }

    // When the user updates their email, they must re-verify the address
    User.findOneAndUpdate(
      { '_id': authId }, 
      { 'email': email, activated: false } 
    ).then(user => {
      if (user) {
        // Set our mailer params
        let options = {
          viewEngine: {
            extname: '.html', // handlebars extension
            layoutsDir: path.join(__dirname, './email/update'), // location of handlebars templates
            defaultLayout: 'index',
            viewPath: path.join(__dirname, './email/update'),
            partialsDir: path.join(__dirname, './email/update')
          },
          viewPath: path.join(__dirname, './email/update'),
          extName: '.html'
        }
        
        mailer.use('compile', hbs(options));

        // Generate a user verfification token
        const verificationToken = jwt.sign({
          data: email
        }, keys.localSecret, { expiresIn: '7d' });

        mailer.sendMail({
          from: keys.emailUser, // sender address
          to: email, // list of receivers
          subject: 'Locc.it: Email update', // Subject line
          template: 'index',
          context: {
            verificationToken : "https://locc.it/auth/local/verify/" + verificationToken
          },
          attachments:[{
            filename : 'loccit.png',
            path: path.join(__dirname, 'email/images/loccit.png'),
            cid : 'logo@locc.it'
          }],
        });
        return res.send("OK");
      } 
      else {
        // Failed to find a result
        emailErrors.email = "Account not found.";
        return res.send({ errors: emailErrors });
      }
    });
  });

  app.post("/auth/update_password", requireLogin, (req, res) => {
    const { authId, password } = req.body.data;
    var updateErrors = {};

    if (!passwordSchema.validate(password)) {
      updateErrors.password = 'Password does not forfil all requirements';
    }

    if (!_.isEmpty(updateErrors)) {
      return res.send({ errors: updateErrors });
    }

    // Set our mailer params
    let options = {
      viewEngine: {
        extname: '.html', // handlebars extension
        layoutsDir: path.join(__dirname, './email/password-change'), // location of handlebars templates
        defaultLayout: 'index',
        viewPath: path.join(__dirname, './email/password-change'),
        partialsDir: path.join(__dirname, './email/password-change')
      },
      viewPath: path.join(__dirname, './email/password-change'),
      extName: '.html'
    }
    
    mailer.use('compile', hbs(options));

    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(password, salt, (error, hash) => {
        if (error) {
          console.log('err', error);
          throw error;
        }
        User.findOneAndUpdate(
          { '_id': authId }, 
          { 'password': hash } 
        ).then(user => {
          if (user) {
            mailer.sendMail({
              from: keys.emailUser, // sender address
              to: user.email, // list of receivers
              subject: 'Locc.it: Password change', // Subject line
              template: 'index',
              attachments:[{
                filename : 'loccit.png',
                path: path.join(__dirname, 'email/images/loccit.png'),
                cid : 'logo@locc.it'
              }],
            });
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

  app.get('/auth/logout', requireLogin, (req, res) => {
    req.logout();
    res.redirect('/');
  });
};
