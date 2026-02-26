const mongoose = require('mongoose');

const feedReactionSchema = new mongoose.Schema({
  feed_item_id: { type: String, required: true },
  user_email: { type: String, required: true },
  reaction_type: { type: String, enum: ['fire', 'heart', 'clap', 'rocket', 'muscle'], required: true },
  comment: { type: String }
});

module.exports = mongoose.model('FeedReaction', feedReactionSchema);
