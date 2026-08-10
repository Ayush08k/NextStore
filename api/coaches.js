import { db } from './lib/firebase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const { sport } = req.query;
      let snapshot;
      
      if (sport && sport !== 'All') {
        snapshot = await db.collection('coaches').where('sport', '==', sport).get();
      } else {
        snapshot = await db.collection('coaches').get();
      }

      const coaches = [];
      snapshot.forEach(doc => coaches.push({ id: doc.id, ...doc.data() }));

      return res.status(200).json(coaches);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, sport, specialization, experience_years, hourly_rate, image, available_slots } = req.body;
      if (!name || !sport || !hourly_rate) {
        return res.status(400).json({ error: 'Coach Name, Sport, and Hourly Rate are required.' });
      }

      const lastDoc = await db.collection('coaches').orderBy('id', 'desc').limit(1).get();
      let nextId = 1;
      if (!lastDoc.empty) nextId = parseInt(lastDoc.docs[0].id) + 1;

      await db.collection('coaches').doc(nextId.toString()).set({
        name,
        sport,
        specialization: specialization || 'Sports Specialist',
        experience_years: experience_years ? parseInt(experience_years) : 5,
        hourly_rate: parseFloat(hourly_rate),
        image: image || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=500&q=80',
        available_slots: available_slots || '10:00 AM, 02:00 PM, 05:00 PM'
      });
      return res.status(200).json({ success: true, id: nextId });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "Missing ID" });
      await db.collection('coaches').doc(id.toString()).delete();
      return res.status(200).json({ success: true, deleted: 1 });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
