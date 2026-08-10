const { db } = require('./lib/firebase');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    try {
      const { recipient_name, phone, alt_phone, address, city, state, pincode, notes, total_amount, items, email } = req.body;
      if (!recipient_name || !phone || !address || !city || !pincode) {
        return res.status(400).json({ error: 'Please provide full recipient name, contact number, address, city, and pincode.' });
      }

      const itemsJson = typeof items === 'string' ? items : JSON.stringify(items || []);

      const lastDoc = await db.collection('orders').orderBy('id', 'desc').limit(1).get();
      let nextId = 1;
      if (!lastDoc.empty) nextId = parseInt(lastDoc.docs[0].id) + 1;

      await db.collection('orders').doc(nextId.toString()).set({
        recipient_name, phone, alt_phone: alt_phone || '',
        address, city, state: state || '', pincode,
        notes: notes || '', total_amount: parseFloat(total_amount || 0),
        items: itemsJson, email: email || ''
      });

      return res.status(200).json({ success: true, orderId: nextId, message: 'Order placed successfully!' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};
