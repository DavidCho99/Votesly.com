const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  user_email: { type: String, required: true },
  badge_type: { type: String, enum: ['top_fan', 'consistent_supporter', 'generous_donor', 'team_champion', 'legendary_fan'], required: true },
  team_id: { type: String },
  earned_date: { type: Date, default: Date.now },
  metadata: { type: Object }
});

module.exports = mongoose.model('Badge', badgeSchema);
