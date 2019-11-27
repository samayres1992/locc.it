const proxy = require('http-proxy-middleware')
 
module.exports = function(app) {
  app.use(proxy(['/api', '/auth/google'], { target: 'http://localhost:5000' }));
  app.use(proxy(['/api', '/auth/facebook'], { target: 'http://localhost:5000' }));
  app.use(proxy(['/api', '/auth/github'], { target: 'http://localhost:5000' }));
  app.use(proxy(['/api', '/auth/local'], { target: 'http://localhost:5000' }));
}