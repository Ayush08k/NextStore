import { db } from './lib/firebase.js';

export default async function handler(req, res) {
  // Add CORS headers so frontend can talk to backend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const { category, search } = req.query;
      let productsRef = db.collection('products');
      
      let snapshot;
      if (category && category !== 'All') {
        snapshot = await productsRef.where('category', '==', category).get();
      } else {
        snapshot = await productsRef.get();
      }

      let products = [];
      snapshot.forEach(doc => {
        products.push({ id: doc.id, ...doc.data() });
      });

      // Handle search in-memory since Firestore doesn't support LIKE natively easily without 3rd party
      if (search) {
        const lowerSearch = search.toLowerCase();
        products = products.filter(p => 
          (p.name && p.name.toLowerCase().includes(lowerSearch)) || 
          (p.description && p.description.toLowerCase().includes(lowerSearch)) ||
          (p.badge && p.badge.toLowerCase().includes(lowerSearch))
        );
      }

      // Sort descending by id simulating ORDER BY id DESC
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

      // Get next ID (pseudo auto-increment)
      const lastDoc = await db.collection('products').orderBy('id', 'desc').limit(1).get();
      let nextId = 1;
      if (!lastDoc.empty) {
         nextId = parseInt(lastDoc.docs[0].id) + 1;
      }

      const productData = {
        name,
        category,
        price: parseFloat(price),
        original_price: original_price ? parseFloat(original_price) : null,
        rating: rating ? parseFloat(rating) : 4.8,
        reviews_count: reviews_count ? parseInt(reviews_count) : 10,
        image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
        badge: badge || 'New',
        description: description || ''
      };

      await db.collection('products').doc(nextId.toString()).set(productData);
      
      return res.status(200).json({ success: true, id: nextId, message: 'Product added successfully!' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    // Vercel routes without dynamic params will receive id in query if passed as /api/products?id=123
    // but the old frontend used /api/products/:id.
    // We should read it from req.query.id.
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "Missing ID" });

      await db.collection('products').doc(id.toString()).delete();
      return res.status(200).json({ success: true, deleted: 1 });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
