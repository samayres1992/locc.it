// Our requirements
const { db, uuid } = require('../db');
const Moment = require('moment');
const keys = require('../config/keys');
const passport = require('passport');
const nodemailer = require("nodemailer");
const _ = require("lodash");
const path = require('path');
const jwt = require("jsonwebtoken");
const hbs = require("nodemailer-express-handlebars");
const bcrypt = require("bcryptjs");
const system = require('../config/system');
const requireLogin = require('../middlewares/requireLogin');
const EmailValidator = require('email-validator');
const passwordValidator = require('password-validator');
const throttle = require("express-throttle");

var passwordSchema = new passwordValidator();
passwordSchema
.is().min(8)          // Minimum length 8
.is().max(100)        // Maximum length 100
.has().uppercase()    // Must have uppercase char
.has().lowercase()    // Must have lowercase char
.has().digits()       // Must have digit
.has().symbols()      // Must have special char

// Prepared statements — compiled once at module load.
const findUserByEmail = db.prepare(`SELECT * FROM users WHERE email = ?`);
const insertLocalUser = db.prepare(`
  INSERT INTO users (id, email, password, activated, activate_by)
  VALUES (@id, @email, @password, @activated, @activate_by)
`);
const updateActivatedByEmail = db.prepare(
  `UPDATE users SET activated = 1 WHERE email = ?`
);
const updatePasswordByEmail = db.prepare(
  `UPDATE users SET password = ? WHERE email = ?`
);
const updatePasswordById = db.prepare(
  `UPDATE users SET password = ? WHERE id = ?`
);
const updateEmailById = db.prepare(
  `UPDATE users SET email = ?, activated = 0 WHERE id = ?`
);
const deleteUserById = db.prepare(`DELETE FROM users WHERE id = ?`);

module.exports = app => {
  // Google — only mount the routes if the strategy was registered in
  // services/passport.js. Without credentials passport.authenticate('google')
  // throws "Unknown authentication strategy".
  if (keys.googleClientId && keys.googleClientSecret) {
    app.get(
      '/auth/google',
      passport.authenticate('google', {
        scope: ['profile', 'email']
      })
    );

    app.get(
      '/auth/google/callback',
      passport.authenticate('google', {
        successRedirect: '/'
      })
    );
  }

  // Github — same gate as Google.
  if (keys.githubPubKey && keys.githubSecretKey) {
    app.get('/auth/github',
      passport.authenticate('github', { scope: [ 'user:email' ] })
    );

    app.get('/auth/github/callback',
      passport.authenticate('github', {
        successRedirect: '/'
      })
    );
  }

  app.get("/auth/local/verify/:token", (req, res) => {
    const token = req.originalUrl.split('/')[4];

    jwt.verify(token, keys.localSecret, (err, decodedToken) => {
      if (err) {
        return res.sendStatus(500);
      }
      try {
        const info = updateActivatedByEmail.run(decodedToken.data);
        if (info.changes) {
          return res.redirect('/login?activated');
        }
        return res.send(false);
      } catch (e) {
        return res.sendStatus(500);
      }
    });
  });

  app.post('/auth/local/register', throttle({ "rate": "5/m" }), (req, res) => {
    const { email, password } = req.body;
    let registerErrors = {};

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
    const existing = findUserByEmail.get(email);
    if (existing) {
      registerErrors.email = 'Email already exists';
      return res.send({ errors: registerErrors });
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
        const newUser = {
          id: uuid(),
          email: email,
          password: hash,
          activated: 0,
          activate_by: Moment().add(7, 'days').toISOString(),
        };
        try {
          insertLocalUser.run(newUser);
        } catch (e) {
          registerErrors.email = 'Email already exists';
          return res.send({ errors: registerErrors });
        }

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
            verificationToken : system.BASE_URL + '/auth/local/verify/' + verificationToken
          },
          attachments:[{
            filename : 'loccit.png',
            path: path.join(__dirname, 'email/images/loccit.png'),
            cid : 'logo@locc.it'
          }],
        });

        req.login(newUser, (loginErr) => {
          if (loginErr) {
            registerErrors.password = 'Failed to authenticate user.';
            return res.send({ errors: registerErrors });
          }
          res.send({ id: newUser.id, activated: newUser.activated });
        });
      });
    });
  });

  app.get('/auth/local/send-activation', throttle({ "rate": "2/m" }), (req, res) => {
    var activationErrors = {};
    try {
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
          extname: '.html',
          layoutsDir: path.join(__dirname, './email/activation'),
          defaultLayout: 'index',
          viewPath: path.join(__dirname, './email/activation'),
          partialsDir: path.join(__dirname, './email/activation')
        },
        viewPath: path.join(__dirname, './email/activation'),
        extName: '.html'
      }

      mailer.use('compile', hbs(options));

      const verificationToken = jwt.sign({
        data: req.user.email
      }, keys.localSecret, { expiresIn: '7d' });

      mailer.sendMail({
        from: keys.emailUser,
        to: req.user.email,
        subject: 'Locc.it: Account verification',
        template: 'index',
        context: {
          verificationToken : system.BASE_URL + '/auth/local/verify/' + verificationToken
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
      activationErrors.email = "Something went wrong, please try again. If this issue persists please contact us.";
      return res.send( { errors: activationErrors });
    }
  });

  app.post('/auth/local/login', throttle({ "rate": "5/m" }), (req, res, next) => {
    var loginErrors = {};
    passport.authenticate('local',
    (err, user, info) => {
      if (err) { return next(err) }
      if (!user) {
        loginErrors.email = 'Incorrect login or password.';
        return res.send( { errors: loginErrors });
      }
      req.login(user, (loginErr) => {
        if (loginErr) { return next(loginErr); }
        res.send({ id: user.id, activated: user.activated });
      });
    })(req, res, next);
  });

  app.post('/auth/local/send_reset',  (req, res) => {
    const { email } = req.body.data;
    var resetErrors = {};

    if (!EmailValidator.validate(email)) {
      resetErrors.email = 'Please provide a valid email';
    }

    if (!_.isEmpty(resetErrors)) {
      return res.send({ errors: resetErrors });
    }

    const user = findUserByEmail.get(email);
    if (!user) {
      resetErrors.email = "Unable to find an account with the email provided.";
      return res.send({ errors: resetErrors });
    }

    try {
      const verificationToken = jwt.sign({
        data: email
      }, keys.localSecret, { expiresIn: '1d' });

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
          extname: '.html',
          layoutsDir: path.join(__dirname, './email/reset'),
          defaultLayout: 'index',
          viewPath: path.join(__dirname, './email/reset'),
          partialsDir: path.join(__dirname, './email/reset')
        },
        viewPath: path.join(__dirname, './email/reset'),
        extName: '.html'
      }

      mailer.use('compile', hbs(options));

      mailer.sendMail({
        from: keys.emailUser,
        to: email,
        subject: 'Locc.it: Reset password',
        template: 'index',
        context: {
          verificationToken : system.BASE_URL + '/reset/' + verificationToken
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
  });


  app.post('/auth/local/reset', throttle({ "rate": "5/m" }),  (req, res) => {
    const { token, password } = req.body;
    var resetErrors = {};
    jwt.verify(token, keys.localSecret, (err, decodedToken) => {
      if (err) {
        resetErrors.verification = "Invalid verification token";
        return res.send({ errors: resetErrors });
      }
      if (!passwordSchema.validate(password)) {
        resetErrors.password = 'Password does not forfil all requirements';
        return res.send({ errors: resetErrors });
      }
      bcrypt.genSalt(10, (error, salt) => {
        bcrypt.hash(password, salt, (error, hash) => {
          if (error) {
            resetErrors.password = "Unable to set user password";
            return res.send({ errors: resetErrors });
          }
          const info = updatePasswordByEmail.run(hash, decodedToken.data);
          if (!info.changes) {
            resetErrors.email = "User with supplied email address does not exist";
            return res.send({ errors: resetErrors });
          }
          const user = findUserByEmail.get(decodedToken.data);
          req.login(user, (loginErr) => {
            if (loginErr) {
              resetErrors.password = 'Failed to authenticate user.';
              return res.send({ errors: resetErrors });
            }
            res.send({ id: user.id, activated: user.activated });
          });
        });
      });
    });
  });

  app.get("/auth/delete_user", requireLogin, (req, res) => {
    const { user } = req;
    try {
      const info = deleteUserById.run(String(user.id));
      if (info.changes) {
        req.logout();
        return res.sendStatus(200);
      }
      return res.sendStatus(500);
    } catch (e) {
      return res.sendStatus(500);
    }
  });

  app.post("/auth/update_email", requireLogin, throttle({ "rate": "5/m" }), (req, res) => {
    const { email } = req.body.data;
    const { user } = req;
    var emailErrors = {};

    if (!EmailValidator.validate(email)) {
      emailErrors.email = 'Please provide a valid email';
    }

    if (!_.isEmpty(emailErrors)) {
      return res.send({ errors: emailErrors });
    }

    // When the user updates their email, they must re-verify the address
    try {
      const info = updateEmailById.run(email, String(user.id));
      if (!info.changes) {
        emailErrors.email = "Account not found.";
        return res.send({ errors: emailErrors });
      }

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
          extname: '.html',
          layoutsDir: path.join(__dirname, './email/update-email'),
          defaultLayout: 'index',
          viewPath: path.join(__dirname, './email/update-email'),
          partialsDir: path.join(__dirname, './email/update-email')
        },
        viewPath: path.join(__dirname, './email/update-email'),
        extName: '.html'
      }

      mailer.use('compile', hbs(options));

      const verificationToken = jwt.sign({
        data: email
      }, keys.localSecret, { expiresIn: '7d' });

      mailer.sendMail({
        from: keys.emailUser,
        to: email,
        subject: 'Locc.it: Email update',
        template: 'index',
        context: {
          verificationToken : system.BASE_URL + '/auth/local/verify/' + verificationToken
        },
        attachments:[{
          filename : 'loccit.png',
          path: path.join(__dirname, 'email/images/loccit.png'),
          cid : 'logo@locc.it'
        }],
      });
      return res.send("OK");
    } catch (e) {
      emailErrors.email = "Account not found.";
      return res.send({ errors: emailErrors });
    }
  });

  app.post("/auth/update_password", requireLogin, throttle({ "rate": "5/m" }), (req, res) => {
    const { password } = req.body.data;
    const { user } = req;
    var updateErrors = {};

    if (!passwordSchema.validate(password)) {
      updateErrors.password = 'Password does not forfil all requirements';
    }

    if (!_.isEmpty(updateErrors)) {
      return res.send({ errors: updateErrors });
    }

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
        extname: '.html',
        layoutsDir: path.join(__dirname, './email/password-change'),
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
          throw error;
        }
        const info = updatePasswordById.run(hash, String(user.id));
        if (!info.changes) {
          return res.sendStatus(500);
        }
        mailer.sendMail({
          from: keys.emailUser,
          to: user.email,
          subject: 'Locc.it: Password change',
          template: 'index',
          attachments:[{
            filename : 'loccit.png',
            path: path.join(__dirname, 'email/images/loccit.png'),
            cid : 'logo@locc.it'
          }],
        });
        res.sendStatus(200);
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
