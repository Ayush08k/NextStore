import { db } from './lib/firebase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const { school_id } = req.query;
      if (!school_id) return res.status(200).json([]);
      
      const snapshot = await db.collection('uniforms').where('school_id', '==', school_id.toString()).get();
      const uniforms = [];
      snapshot.forEach(doc => uniforms.push({ id: doc.id, ...doc.data() }));

      // Sort by sort_order
      uniforms.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

      return res.status(200).json(uniforms);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
