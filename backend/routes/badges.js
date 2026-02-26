const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const Badge = require('../models/Badge');

// GET /api/badges/me
router.get('/me', verifyToken, async (req, res) => {
  try {
    const badges = await Badge.find({ user_uid: req.user.uid }).populate('team_id', 'name short_name');
    res.json(badges);
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ error: 'Server error fetching badges' });
  }
});

module.exports = router;
