const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const User = require('../models/User');
const UserLike = require('../models/UserLike');
const Badge = require('../models/Badge');

// GET /api/users/me
router.get('/me', verifyToken, async (req, res) => {
  try {
    if (!req.dbUser) {
      return res.status(404).json({ error: 'User not found in database' });
    }
    
    // We can also aggregate stats here if we want
    const totalLikes = await UserLike.aggregate([
      { $match: { user_uid: req.user.uid } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const count = totalLikes.length > 0 ? totalLikes[0].total : 0;
    
    res.json({
      user: req.dbUser,
      stats: {
        totalVotes: count
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/users/me
router.delete('/me', verifyToken, async (req, res) => {
  try {
    if (req.dbUser) {
      // Delete user data
      await UserLike.deleteMany({ user_uid: req.user.uid });
      await Badge.deleteMany({ user_uid: req.user.uid });
      await User.deleteOne({ uid: req.user.uid });
    }
    
    // We could ideally delete from Firebase as well, using admin SDK
    await require('../config/firebase-admin').auth().deleteUser(req.user.uid).catch(console.error);

    res.json({ message: 'User account and all associated data deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
