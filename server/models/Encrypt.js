const mongoose = require('mongoose');
const { Schema } = mongoose;

const encryptSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  encryptedData: { type: Object, required: [true, 'Sensitive data must be provided.'] },
  url: { type: String, required: [true, 'URL must be provided.'] },
  expiry: { type: Date, required: [true, 'Expiry date must be provided.'] },
  used: { type: Boolean, default: false },
  active: { type: Boolean, default: true }
});

mongoose.model('locks', encryptSchema);