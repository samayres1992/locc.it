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

  app.get('/api/current_user', (req, res) => {
      res.send(req.user);
  });

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};