const mongoose = require('mongoose');
const { Schema } = mongoose;

const encryptSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: [true, 'A title must be provided.'] },
  encrypted: { type: Object, required: [true, 'Sensitive data must be provided.'] },
  expiry: Date,
  used: { type: Boolean, default: false },
  active: { type: Boolean, default: true }
});

mongoose.model('locks', encryptSchema);