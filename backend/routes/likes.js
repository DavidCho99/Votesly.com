const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const enforceLikeCooldown = require('../middleware/rateLimiter');
const Team = require('../models/Team');
const UserLike = require('../models/UserLike');
const FeedItem = require('../models/FeedItem');
const { BADGES } = require('../../shared/constants'); // If we need it

// POST /api/likes - Submit organic vote
router.post('/', verifyToken, enforceLikeCooldown, async (req, res) => {
  try {
    const { teamId } = req.body;
    
    if (!teamId) return res.status(400).json({ error: 'teamId is required' });

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ error: 'Team not found' });

    // Create like record
    const like = new UserLike({
      user_uid: req.user.uid,
      user_email: req.user.email,
      team_id: teamId,
      like_type: 'organic',
      amount: 1
    });
    await like.save();

    // Increment team total_likes
    team.total_likes += 1;
    await team.save();

    // Create anonymized FeedItem
    const feedItem = new FeedItem({
      type: 'vote',
      team_id: teamId,
      amount: 1,
      message: 'Someone just voted!'
    });
    await feedItem.save();

    // Here we could also calculate badges asynchronously
    // require('../utils/badgeCalculator').calculateBadges(req.user.uid, req.user.email);

    res.json({ success: true, teamLikes: team.total_likes });
  } catch (error) {
    console.error('Error submitting vote:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/likes/me - Get user's vote history/stats
router.get('/me', verifyToken, async (req, res) => {
  try {
    const history = await UserLike.find({ user_uid: req.user.uid })
      .sort({ created_at: -1 })
      .limit(50)
      .populate('team_id', 'name short_name');
      
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/likes/team/:id - Get team contributor breakdown
router.get('/team/:id', async (req, res) => {
  try {
    const breakdown = await UserLike.aggregate([
      { $match: { team_id: require('mongoose').Types.ObjectId(req.params.id) } },
      { $group: { _id: '$like_type', total: { $sum: '$amount' } } }
    ]);
    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
