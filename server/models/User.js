const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
  'facebookId': String,
  'githubId': String,
  'googleId': String,
  'avatar': String,
  'email': { type: String, unique: true },
  'password': String,
  'membership': { type: String, default: 'Regular'},
  'membershipDuration': { type: Number, default: 0},
  'paymentDate': Date,
  'activated': { type: Boolean, default: false },
  'token': String
});

userSchema.plugin(uniqueValidator);

mongoose.model('users', userSchema);