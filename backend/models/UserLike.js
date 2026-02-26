const mongoose = require('mongoose');

const userLikeSchema = new mongoose.Schema({
  user_email: { type: String, required: true },
  team_id: { type: String, required: true },
  like_type: { type: String, enum: ['organic', 'purchased'], required: true },
  amount: { type: Number, default: 1, required: true }
});

module.exports = mongoose.model('UserLike', userLikeSchema);
