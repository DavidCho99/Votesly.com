const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  short_name: { type: String },
  mascot: { type: String },
  stadium: { type: String },
  stadium_capacity: { type: Number },
  founded: { type: Number },
  rivalries: [{ type: String }],
  conference: { type: String, enum: ['SEC', 'BIG 10', 'BIG 12'], required: true },
  primary_color: { type: String, required: true },
  secondary_color: { type: String },
  total_likes: { type: Number, default: 0 },
  organic_likes: { type: Number, default: 0 },
  boosted_likes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Team', teamSchema);
