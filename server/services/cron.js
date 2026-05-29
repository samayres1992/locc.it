const mongoose = require('mongoose');
const Encrypt = mongoose.model('locks');
const User = mongoose.model('users');
const { every } = require('bella-scheduler');
const Moment = require('moment');

// Grace window after which a viewed record is purged even if the recipient
// hasn't called DELETE /api/secret/:url. The on-fetch self-clean in the route
// is the primary mechanism; this is the safety net for records that nobody
// ever re-visits.
const GRACE_PERIOD_MS = 60 * 1000;

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

  // Purge any record whose grace window has elapsed but was never
  // explicitly consumed. Belt-and-braces for the route-level self-clean.
  Encrypt.deleteMany({
    viewed: true,
    viewedAt: { $lt: new Date(Date.now() - GRACE_PERIOD_MS) }
  }).then(() => {
    console.log("Stale viewed records purged");
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