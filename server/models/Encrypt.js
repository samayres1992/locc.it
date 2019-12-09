const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');

const encryptSchema = new Schema({
  userId: { type: Object, ref: 'User' },
  title: String,
  encryptedData: { type: Object, required: [true, 'Sensitive data must be provided.'] },
  url: { type: String, required: [true, 'URL must be provided.'], unique: true },
  expiry: { type: Date, required: [true, 'Expiry date must be provided.'] },
  used: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  attempts: { type: Number , default: 0 },
  locked: { type: Date, default: null }
});

encryptSchema.plugin(uniqueValidator);

mongoose.model('locks', encryptSchema);