const mongoose = require('mongoose');

const feedItemSchema = new mongoose.Schema({
  user_email: { type: String, required: true },
  user_name: { type: String },
  team_id: { type: String, required: true },
  like_type: { type: String, enum: ['organic', 'purchased'], required: true },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FeedItem', feedItemSchema);
