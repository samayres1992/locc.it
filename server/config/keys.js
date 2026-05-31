const fs = require('fs');
const path = require('path');

const envName = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
const filePath = path.join(__dirname, `${envName}.js`);

let fileConfig = {};
if (fs.existsSync(filePath)) {
  fileConfig = require(filePath);
}

module.exports = {
  siteURL: process.env.SITE_URL || fileConfig.siteURL || '',
  cookieKey: process.env.COOKIE_KEY || fileConfig.cookieKey || 'loccit-dev-cookie-key',
  localSecret: process.env.LOCAL_SECRET || fileConfig.localSecret || 'loccit-dev-local-secret',
  emailUser: process.env.EMAIL_USER || fileConfig.emailUser || '',
  emailPass: process.env.EMAIL_PASS || fileConfig.emailPass || '',
  googleClientId: process.env.GOOGLE_CLIENT_ID || fileConfig.googleClientId || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || fileConfig.googleClientSecret || '',
  githubPubKey: process.env.GITHUB_PUB_KEY || fileConfig.githubPubKey || '',
  githubSecretKey: process.env.GITHUB_SECRET_KEY || fileConfig.githubSecretKey || '',
  stripePubKey: process.env.STRIPE_PUB_KEY || fileConfig.stripePubKey || '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || fileConfig.stripeSecretKey || '',
};