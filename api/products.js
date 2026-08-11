const { db } = require('./lib/firebase');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!db) {
    return res.status(500).json({
      error: 'Firebase database initialization failed on server. Please ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in Vercel project environment variables.'
    });
  }

  if (req.method === 'GET') {
    try {
      const { category, search } = req.query;
      let snapshot;

      if (category && category !== 'All') {
        snapshot = await db.collection('products').where('category', '==', category).get();
      } else {
        snapshot = await db.collection('products').get();
      }

      let products = [];
      snapshot.forEach(doc => products.push({ id: doc.id, ...doc.data() }));

      if (search) {
        const q = search.toLowerCase();
        products = products.filter(p =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.badge && p.badge.toLowerCase().includes(q))
        );
      }

      products.sort((a, b) => parseInt(b.id) - parseInt(a.id));
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, category, price, original_price, rating, reviews_count, image, badge, description } = req.body;
      if (!name || !category || !price) {
        return res.status(400).json({ error: 'Name, Category, and Price are required.' });
      }

      const lastDoc = await db.collection('products').orderBy('id', 'desc').limit(1).get();
      let nextId = 1;
      if (!lastDoc.empty) nextId = parseInt(lastDoc.docs[0].id) + 1;

      await db.collection('products').doc(nextId.toString()).set({
        name, category,
        price: parseFloat(price),
        original_price: original_price ? parseFloat(original_price) : null,
        rating: rating ? parseFloat(rating) : 4.8,
        reviews_count: reviews_count ? parseInt(reviews_count) : 10,
        image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
        badge: badge || 'New',
        description: description || ''
      });

      return res.status(200).json({ success: true, id: nextId, message: 'Product added successfully!' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing ID' });
      await db.collection('products').doc(id.toString()).delete();
      return res.status(200).json({ success: true, deleted: 1 });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};
