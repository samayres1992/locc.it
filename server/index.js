// Load .env BEFORE requiring config/keys.js — keys.js reads process.env at
// require time, so dotenv has to run first or the values will all be empty.
// Anchoring to __dirname so the file is found regardless of cwd (pm2 etc.).
require('dotenv').config({ path: __dirname + '/.env' });

// Our requirements
const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
// Our secret keys
const keys = require('./config/keys');
// Env vars
const system = require('./config/system');

// Initialise SQLite (creates the file + applies schema on first boot).
// Required before any route file so prepared statements compile against an
// existing schema.
require('./db');

// Passport strategies hit the users table — require it after ./db is ready.
require('./services/passport');

// Init express
const app = express();

// Return JSON body upon express requests
app.use(bodyParser.json());

// Set a cookie
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 1000, // 30 Days
    keys: [keys.cookieKey]
  })
);

// Init passport session
app.use(passport.initialize());
app.use(passport.session());

// Get our routes
require('./routes/authRoutes')(app);
require('./routes/encryptRoutes')(app);
require('./routes/decryptRoutes')(app);
require('./routes/dashboardRoutes')(app);

// Cron processes
require('./services/cron');

// Production
if(system.ENV === 'production') {
  // If the server route doesn't exist, assume react route
  app.use(express.static('../client/build'));
  app.get('*', (req, res) => {
    res.sendFile(system.BUILD);
  });
}

const PORT = system.PORT || 5000;
app.listen(PORT);
