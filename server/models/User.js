const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  'facebookId': String,
  'githubId': String,
  'googleId': String,
  'avatar': String,
  'email': String,
  'password': String,
  'membership': { type: String, default: 'Regular'},
  'membershipDuration': { type: Number, default: 0},
  'paymentDate': Date,
  'activated': { type: Boolean, default: false },
  'token': String
});

mongoose.model('users', userSchema);