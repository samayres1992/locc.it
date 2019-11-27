const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  'facebookId': String,
  'githubId': String,
  'googleId': String,
  'email': String,
  'membership': { type: String, default: 'Regular'},
  'membershipDuration': { type: Number, default: 0},
  'paymentDate': Date
});

mongoose.model('users', userSchema);