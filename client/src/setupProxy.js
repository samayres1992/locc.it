const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const target = 'http://localhost:5000';

  app.use(
    '/api',
    createProxyMiddleware({ target, changeOrigin: true })
  );

  app.use(
    '/auth',
    createProxyMiddleware({ target, changeOrigin: true })
  );
};