// Our requirements
const passport = require('passport');

module.exports = app => {
  // Facebook
  app.get('/auth/facebook', 
    passport.authenticate('facebook')
  );

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
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
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/dashboard');
    }
  );

  // Github
  app.get('/auth/github',
    passport.authenticate('github', { scope: [ 'user:email' ] })
  );

  app.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/dashboard');
    }
  );

  // TODO: Add Local sign in and register 
  app.get("/auth/local/register", (req, res) => {
    passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/' })
  });
  
  //--------------------------------------------------------
  //@request  : POST
  //@route    : /api/users/login
  //@access   : Public
  //@isAdmin  : False
  //@desc     : This route is used to return a json webtoken and log in.
  //--------------------------------------------------------
  
  // router.post("/auth/local/login", (req, res) => {
  //   const { errors, isValid } = validateLoginInput(req.body);
  
  //   //Check validation
  //   if (!isValid) {
  //     return res.status(400).json(errors);
  //   }
  
  //   const email = req.body.email;
  //   const password = req.body.password;
  
  //   //Find the user by email to see if they are in the database
  //   User.findOne({ email }).then(user => {
  //     if (!user) {
  //       errors.email = "Users email was not found";
  //       return res.status(404).json(errors);
  //     }
  //     //Check password
  //     bcrypt.compare(password, user.password).then(isMatch => {
  //       if (isMatch) {
  //         //user password matched the one that was in the database
  //         //create jwt payload
  //         const payload = {
  //           id: user.id,
  //           name: user.name
  //         };
  //         //Sign in token, expires in is in seconds
  //         jwt.sign(
  //           payload,
  //           keys.localSecret,
  //           { expiresIn: 3600 },
  //           (error, token) => {
  //             res.json({
  //               success: true,
  //               token: "Bearer " + token
  //             });
  //           }
  //         );
  //       } else {
  //         //user password DID NOT match the one that was in the database
  //         errors.password = "Password is incorrect";
  //         return res.status(400).json(errors);
  //       }
  //     });
  //   });
  // });

  app.get('/api/current_user', (req, res) => {
      res.send(req.user);
  });

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};