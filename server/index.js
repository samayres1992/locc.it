// Our requirements
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
// Our secret keys
const keys = require('./config/keys');
require('./models/User');
require('./services/passport');

// Let's connect to our DB
mongoose.connect(keys.mongoURI);

// Init express
const app = express();

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

const PORT = process.env.PORT || 5000;
app.listen(PORT);