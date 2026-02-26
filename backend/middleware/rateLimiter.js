// We can use a simple in-memory map or an express-rate-limit custom store for the likes cooldown.
// Using a Map for simplicity (if single instance), or a redis store (if distributed).

const lastLikeMap = new Map();

const enforceLikeCooldown = (req, res, next) => {
  // requires req.user from auth middleware
  if (!req.user || !req.user.uid) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userUid = req.user.uid;
  const now = Date.now();
  const lastLikeTime = lastLikeMap.get(userUid);

  if (lastLikeTime && (now - lastLikeTime < 5000)) {
    return res.status(429).json({ error: 'Too fast! Wait 5 seconds.' });
  }

  // Set new time and proceed
  lastLikeMap.set(userUid, now);
  
  // Cleanup old entries (optional, could do it periodically)
  if (lastLikeMap.size > 100000) lastLikeMap.clear();

  next();
};

module.exports = enforceLikeCooldown;
