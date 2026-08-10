const { db } = require('../lib/firebase');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const snapshot = await db.collection('schools').get();
      const cities = new Set();
      snapshot.forEach(doc => { if (doc.data().city) cities.add(doc.data().city); });
      return res.status(200).json(Array.from(cities).sort());
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};
