const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const target = 'http://localhost:5000';

  app.use(
    ['/api', '/api/decrypt_attempt'],
    createProxyMiddleware({ target, changeOrigin: true })
  );

  app.use(
    ['/auth', '/auth/google', '/auth/local/login', '/auth/local/register', '/auth/local/send_reset', '/auth/local/one-time'],
    createProxyMiddleware({ target, changeOrigin: true })
  );
};