import { db } from './lib/firebase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const snapshot = await db.collection('schools').get();
      const cities = new Set();
      snapshot.forEach(doc => {
        if (doc.data().city) cities.add(doc.data().city);
      });
      // Convert Set to Array and sort alphabetically
      const sortedCities = Array.from(cities).sort();
      return res.status(200).json(sortedCities);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
