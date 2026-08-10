const { db } = require('./lib/firebase');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const { school_id, class_grade, board } = req.query;
      let booksRef = db.collection('books');

      if (school_id) booksRef = booksRef.where('school_id', '==', school_id.toString());
      if (class_grade) booksRef = booksRef.where('class_grade', '==', class_grade);
      if (board) booksRef = booksRef.where('board', '==', board);

      const snapshot = await booksRef.get();

      const schoolsSnapshot = await db.collection('schools').get();
      const schoolsMap = {};
      schoolsSnapshot.forEach(doc => { schoolsMap[doc.id] = doc.data(); });

      const books = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        const schoolData = schoolsMap[data.school_id] || {};
        books.push({ id: doc.id, ...data, school_name: schoolData.name || 'Unknown', city: schoolData.city || 'Unknown' });
      });

      return res.status(200).json(books);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { school_id, class_grade, subject, book_title, publisher, price } = req.body;
      if (!school_id || !class_grade || !book_title || !price) {
        return res.status(400).json({ error: 'School, Class, Title, and Price are required.' });
      }

      const lastDoc = await db.collection('books').orderBy('id', 'desc').limit(1).get();
      let nextId = 1;
      if (!lastDoc.empty) nextId = parseInt(lastDoc.docs[0].id) + 1;

      await db.collection('books').doc(nextId.toString()).set({
        school_id: school_id.toString(), class_grade,
        subject: subject || 'General', book_title,
        publisher: publisher || 'Standard', price: parseFloat(price)
      });
      return res.status(200).json({ success: true, id: nextId });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing ID' });
      await db.collection('books').doc(id.toString()).delete();
      return res.status(200).json({ success: true, deleted: 1 });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};
