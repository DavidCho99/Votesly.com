const admin = require('firebase-admin');

// Ensure you have a serviceAccountKey.json or set env variables properly in production.
// For local testing, we can initialize with default if no env vars are strictly provided
// but ideally we should require it.

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  } catch (err) {
    console.warn('Firebase admin initialization failed (might need service account credentials):', err.message);
  }
}

module.exports = admin;
