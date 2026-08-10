const { db } = require('./lib/firebase');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const { city } = req.query;
      let snapshot;

      if (city) {
        snapshot = await db.collection('schools').where('city', '==', city).get();
      } else {
        snapshot = await db.collection('schools').get();
      }

      const schools = [];
      snapshot.forEach(doc => schools.push({ id: doc.id, ...doc.data() }));
      return res.status(200).json(schools);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { city, name, address } = req.body;
      if (!city || !name) return res.status(400).json({ error: 'City and School Name are required.' });

      const lastDoc = await db.collection('schools').orderBy('id', 'desc').limit(1).get();
      let nextId = 1;
      if (!lastDoc.empty) nextId = parseInt(lastDoc.docs[0].id) + 1;

      await db.collection('schools').doc(nextId.toString()).set({ city, name, address: address || '' });
      return res.status(200).json({ success: true, id: nextId });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing ID' });
      await db.collection('schools').doc(id.toString()).delete();
      return res.status(200).json({ success: true, deleted: 1 });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};
