const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

// GET /api/teams (with optional ?conference filter)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.conference && req.query.conference !== 'all') {
      filter.conference = req.query.conference;
    }
    const teams = await Team.find(filter).sort({ total_likes: -1 });
    res.json(teams);
  } catch (err) {
    console.error('Error fetching teams:', err);
    res.status(500).json({ error: 'Server error fetching teams' });
  }
});

// GET /api/teams/:id
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    res.json(team);
  } catch (err) {
    console.error('Error fetching team:', err);
    res.status(500).json({ error: 'Server error fetching team' });
  }
});

module.exports = router;
