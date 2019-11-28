const proxy = require('http-proxy-middleware')
 
module.exports = function(app) {
  app.use(proxy(['/api', '/auth/google'], { target: 'http://localhost:5000' }));
  app.use(proxy(['/api', '/auth/facebook'], { target: 'http://localhost:5000' }));
  app.use(proxy(['/api', '/auth/github'], { target: 'http://localhost:5000' }));
  app.use(proxy(['/api', '/auth/local/login'], { target: 'http://localhost:5000' }));
  app.use(proxy(['/api', '/auth/local/register'], { target: 'http://localhost:5000' }));
}