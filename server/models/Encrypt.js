const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');

const encryptSchema = new Schema({
  userId: { type: Object, ref: 'User' },
  title: String,
  encryptedData: { type: Object, required: [true, 'Sensitive data must be provided.'] },
  url: { type: String, required: [true, 'URL must be provided.'], unique: true },
  expiry: { type: Date, required: [true, 'Expiry date must be provided.'] },
  // Legacy fields — kept for backward compat with the server-side decrypt route.
  // Not used by the new client-side decrypt flow.
  attempts: { type: Number, default: 0 },
  locked: { type: Date, default: null },
  // New fields for client-side decrypt flow.
  // viewed flips true the first time the ciphertext is fetched; viewedAt starts
  // the short grace window during which the same URL can be re-fetched (to
  // tolerate page refreshes). After the grace window the record is purged on
  // the next access or by the cleanup cron, whichever comes first.
  viewed: { type: Boolean, default: false },
  viewedAt: { type: Date, default: null }
});

encryptSchema.plugin(uniqueValidator);

mongoose.model('locks', encryptSchema);