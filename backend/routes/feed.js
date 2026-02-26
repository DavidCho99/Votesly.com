const express = require('express');
const router = express.Router();
const FeedItem = require('../models/FeedItem');

// GET /api/feed/:teamId
router.get('/:teamId', async (req, res) => {
  try {
    const feed = await FeedItem.find({ team_id: req.params.teamId })
      .sort({ created_at: -1 })
      .limit(30)
      .lean();
    
    res.json(feed);
  } catch (error) {
    console.error('Error fetching feed:', error);
    res.status(500).json({ error: 'Server error fetching feed' });
  }
});

module.exports = router;
