const mongoose = require('mongoose');
const Encrypt = mongoose.model('locks');
const User = mongoose.model('users');
const { every } = require('bella-scheduler');
const Moment = require('moment');

every('1h', () => {
  // Find all locked credentials and remove lock if 
  // current time has passed locked data
  Encrypt.updateMany({ 
    'locked': { $lt: Moment().format('YYYY-MM-DD') },
    'locked': null, attempts: 0
  }).then(() => {
    console.log("Locked removed")
  });

  // Find all locked credentials and remove lock if 
  // current time has passed locked data
  Encrypt.deleteMany({ 
    'expiry': { $lt: Moment().format('YYYY-MM-DD') }
  }).then(() => {
    console.log("Expiry delete called");
  });

  // Find all locked credentials and remove lock if 
  // current time has passed locked data
  User.deleteMany({ 
    activated: false,
    activateBy: { $lt: Moment().format('YYYY-MM-DD') }
  }).then(() => {
    console.log("Removed non activated users delete called");
  });
});