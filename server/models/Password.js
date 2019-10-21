const mongoose = require('mongoose');
const { Schema } = mongoose;

const passwordSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  data: Object,
  expiry: Date,
  used: { type: Boolean, default: false },
  active: Boolean
});

mongoose.model('passwords', passwordSchema);