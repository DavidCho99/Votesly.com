const express = require('express');
const router = express.Router();
const User = require('../models/User');
const admin = require('../config/firebase-admin');

// Shared allowed domains check could be imported, but we'll inline or require it.
// Assuming shared folder is one level up if we compile, but we'll just define basic logic here.
const ALLOWED_DOMAINS = [
  'utexas.edu', 'alabama.edu', 'lsu.edu', 'uga.edu',
  'ohio-state.edu', 'umich.edu', 'psu.edu', 'wisc.edu',
  'ou.edu', 'tcu.edu', 'baylor.edu', 'ku.edu',
  'unc.edu', 'duke.edu', 'clemson.edu', 'fsu.edu'
];

// POST /api/auth/verify
router.post('/verify', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const email = decodedToken.email;
    
    if (!email) {
      return res.status(400).json({ error: 'Token does not contain an email' });
    }

    const domain = email.split('@')[1];
    
    // Validate domain
    if (!ALLOWED_DOMAINS.includes(domain)) {
      return res.status(403).json({ error: 'Unauthorized email domain' });
    }

    let user = await User.findOne({ uid: decodedToken.uid });
    if (!user) {
      user = new User({
        uid: decodedToken.uid,
        email: email,
        full_name: decodedToken.name || '',
        school_domain: domain
      });
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
