const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');
const Moment = require('moment');

const userSchema = new Schema({
  'githubId': String,
  'googleId': String,
  'email': { type: String, unique: true },
  'password': String,
  'activated': { type: Boolean, default: false },
  'activateBy': { type: Date, default: Moment().add(7, 'days').format('YYYY-MM-DD') }
});

userSchema.plugin(uniqueValidator);

mongoose.model('users', userSchema);