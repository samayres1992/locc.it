const mongoose = require('mongoose');
const { Schema } = mongoose;

const encryptSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  encryptedData: Object,
  expiry: Date,
  used: { type: Boolean, default: false },
  active: { type: Boolean, default: true }
});

mongoose.model('locks', encryptSchema);