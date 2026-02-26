const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  email: { type: String, required: true, unique: true },
  full_name: { type: String, default: '' },
  school_domain: { type: String }, // e.g. "utexas.edu"
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
