// Our requirements
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const path = require('path');
// Our secret keys
const keys = require('./config/keys');
// Env vars
const system = require('./config/system');
require('./models/User');
require('./models/Encrypt');
require('./services/passport');

// Let's connect to our DB
mongoose.connect(keys.mongoURI, { 
  useNewUrlParser: true,
  useUnifiedTopology: true ,
  useFindAndModify: false
});

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
if(process.env.NODE_ENV === 'production') {
  // If the server route doesn't exist, assume react route
  app.use(express.static('../client/build'));
  const path = app.get('*', (req, res) => {
    res.sendFile(system.BUILD);
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
