const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  BASE_URL: process.env.BASE_URL || (isProduction ? 'https://locc.it' : 'http://localhost:3000'),
  BUILD: process.env.BUILD || path.join(__dirname, '../../client/build/index.html'),
  ENV: process.env.APP_ENV || (isProduction ? 'production' : 'development'),
  PORT: Number(process.env.PORT || 5000),
};
