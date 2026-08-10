import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db, { initDb } from './config/db.js';
import { sendNotificationEmail } from './services/mailer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize SQLite DB
initDb();

// Serve static assets from public folder if present
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// ---------------- API ENDPOINTS ---------------- //

// 1. PRODUCTS API
app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let sql = 'SELECT * FROM products';
  const params = [];
  const conditions = [];

  if (category && category !== 'All') {
    conditions.push('category = ?');
    params.push(category);
  }
  if (search) {
    conditions.push('(name LIKE ? OR description LIKE ? OR badge LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  sql += ' ORDER BY id DESC';

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/products', (req, res) => {
  const { name, category, price, original_price, rating, reviews_count, image, badge, description } = req.body;
  if (!name || !category || !price) {
    return res.status(400).json({ error: 'Name, Category, and Price are required.' });
  }

  const sql = `
    INSERT INTO products (name, category, price, original_price, rating, reviews_count, image, badge, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    name,
    category,
    parseFloat(price),
    original_price ? parseFloat(original_price) : null,
    rating ? parseFloat(rating) : 4.8,
    reviews_count ? parseInt(reviews_count) : 10,
    image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    badge || 'New',
    description || ''
  ];

  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID, message: 'Product added successfully!' });
  });
});

app.delete('/api/products/:id', (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, deleted: this.changes });
  });
});

// 2. SCHOOLS & BOOKS API
app.get('/api/schools/cities', (req, res) => {
  db.all('SELECT DISTINCT city FROM schools ORDER BY city ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => r.city));
  });
});

app.get('/api/schools', (req, res) => {
  const { city } = req.query;
  let sql = 'SELECT * FROM schools';
  const params = [];
  if (city) {
    sql += ' WHERE city = ?';
    params.push(city);
  }
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/schools', (req, res) => {
  const { city, name, address } = req.body;
  if (!city || !name) return res.status(400).json({ error: 'City and School Name are required.' });

  db.run('INSERT INTO schools (city, name, address) VALUES (?, ?, ?)', [city, name, address || ''], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID });
  });
});

app.delete('/api/schools/:id', (req, res) => {
  db.run('DELETE FROM schools WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, deleted: this.changes });
  });
});

app.get('/api/books', (req, res) => {
  const { school_id, class_grade, board } = req.query;
  let sql = 'SELECT b.*, s.name as school_name, s.city FROM books b JOIN schools s ON b.school_id = s.id';
  const params = [];
  const conditions = [];

  if (school_id) {
    conditions.push('b.school_id = ?');
    params.push(school_id);
  }
  if (class_grade) {
    conditions.push('b.class_grade = ?');
    params.push(class_grade);
  }
  if (board) {
    conditions.push('b.board = ?');
    params.push(board);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/books', (req, res) => {
  const { school_id, class_grade, subject, book_title, publisher, price } = req.body;
  if (!school_id || !class_grade || !book_title || !price) {
    return res.status(400).json({ error: 'School, Class, Title, and Price are required.' });
  }

  db.run(
    'INSERT INTO books (school_id, class_grade, subject, book_title, publisher, price) VALUES (?, ?, ?, ?, ?, ?)',
    [school_id, class_grade, subject || 'General', book_title, publisher || 'Standard', parseFloat(price)],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.delete('/api/books/:id', (req, res) => {
  db.run('DELETE FROM books WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, deleted: this.changes });
  });
});

// 3. COACHES API
app.get('/api/coaches', (req, res) => {
  const { sport } = req.query;
  let sql = 'SELECT * FROM coaches';
  const params = [];
  if (sport && sport !== 'All') {
    sql += ' WHERE sport = ?';
    params.push(sport);
  }
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/coaches', (req, res) => {
  const { name, sport, specialization, experience_years, hourly_rate, image, available_slots } = req.body;
  if (!name || !sport || !hourly_rate) {
    return res.status(400).json({ error: 'Coach Name, Sport, and Hourly Rate are required.' });
  }

  db.run(
    'INSERT INTO coaches (name, sport, specialization, experience_years, hourly_rate, image, available_slots) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      name,
      sport,
      specialization || 'Sports Specialist',
      experience_years ? parseInt(experience_years) : 5,
      parseFloat(hourly_rate),
      image || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=500&q=80',
      available_slots || '10:00 AM, 02:00 PM, 05:00 PM'
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.delete('/api/coaches/:id', (req, res) => {
  db.run('DELETE FROM coaches WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, deleted: this.changes });
  });
});

// 4. ORDERS & CHECKOUT API
app.post('/api/orders', async (req, res) => {
  const { recipient_name, phone, alt_phone, address, city, state, pincode, notes, total_amount, items, email } = req.body;

  if (!recipient_name || !phone || !address || !city || !pincode) {
    return res.status(400).json({ error: 'Please provide full recipient name, contact number, address, city, and pincode.' });
  }

  const itemsJson = typeof items === 'string' ? items : JSON.stringify(items || []);

  db.run(
    `INSERT INTO orders (recipient_name, phone, alt_phone, address, city, state, pincode, notes, total_amount, items)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [recipient_name, phone, alt_phone || '', address, city, state || '', pincode, notes || '', parseFloat(total_amount || 0), itemsJson],
    async function (err) {
      if (err) return res.status(500).json({ error: err.message });
      const orderId = this.lastID;

      // Dispatch Order Confirmation Email
      const emailResult = await sendNotificationEmail({
        to: email || 'customer@example.com',
        subject: `NextStore Order Confirmation #${orderId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #6c804b;">Thank you for your order, ${recipient_name}!</h2>
            <p>Your order <strong>#${orderId}</strong> has been placed successfully and is being processed for home delivery.</p>
            <h3>Delivery Address:</h3>
            <p>${address}, ${city}, ${state} - ${pincode}<br>Contact: ${phone}</p>
            <h3>Total Paid: ₹${parseFloat(total_amount || 0).toFixed(2)}</h3>
            <hr style="border: none; border-top: 1px solid #eeeeee;">
            <p style="color: #777; font-size: 12px;">NextStore Educational Supplies & Coaching Platform</p>
          </div>
        `
      });

      res.json({
        success: true,
        orderId,
        message: 'Order placed successfully! Confirmation sent via email.',
        mailPreview: emailResult.previewUrl
      });
    }
  );
});

// 5. CONTACT MAIL SERVICE API
app.post('/api/mail/send', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, Email, and Message are required.' });
  }

  db.run(
    'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
    [name, email, subject || 'General Inquiry', message],
    async function (err) {
      if (err) console.error('Failed to log message to DB:', err);

      const emailResult = await sendNotificationEmail({
        to: email,
        subject: `NextStore Support: ${subject || 'Inquiry Received'}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h3 style="color: #6c804b;">Hello ${name},</h3>
            <p>We have received your message regarding <strong>${subject || 'General Inquiry'}</strong>.</p>
            <p>Our team will get back to you shortly.</p>
            <blockquote style="background: #f9f9f9; padding: 12px; border-left: 4px solid #6c804b;">
              ${message}
            </blockquote>
          </div>
        `
      });

      res.json({
        success: true,
        message: 'Your message has been sent successfully!',
        mailPreview: emailResult.previewUrl
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`NextStore Backend API server running on http://localhost:${PORT}`);
});
