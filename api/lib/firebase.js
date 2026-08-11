const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

let db = null;

try {
  if (!getApps().length) {
    const rawKey = process.env.FIREBASE_PRIVATE_KEY;
    const privateKey = rawKey ? rawKey.replace(/\\n/g, '\n') : undefined;

    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      };
      initializeApp({ credential: cert(serviceAccount) });
      console.log('Firebase Admin Initialized successfully.');
    } else {
      console.error('Missing or incomplete Firebase environment variables on Vercel!');
    }
  }

  if (getApps().length > 0) {
    db = getFirestore();
  }
} catch (error) {
  console.error('Firebase initialization catch block:', error.message);
}

module.exports = { db };
