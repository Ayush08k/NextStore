import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../nextstore.db');
const verboseSqlite = sqlite3.verbose();

const db = new verboseSqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to NextStore SQLite database at:', dbPath);
  }
});

export const initDb = () => {
  db.serialize(() => {
    // Products Table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        original_price REAL,
        rating REAL DEFAULT 4.8,
        reviews_count INTEGER DEFAULT 95,
        image TEXT,
        is_best_seller INTEGER DEFAULT 0,
        badge TEXT,
        description TEXT
      )
    `);

    // Schools Table
    db.run(`
      CREATE TABLE IF NOT EXISTS schools (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city TEXT NOT NULL,
        name TEXT NOT NULL,
        address TEXT
      )
    `);

    // Books Table
    db.run(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        school_id INTEGER NOT NULL,
        class_grade TEXT NOT NULL,
        subject TEXT NOT NULL,
        book_title TEXT NOT NULL,
        publisher TEXT,
        price REAL NOT NULL,
        FOREIGN KEY (school_id) REFERENCES schools (id) ON DELETE CASCADE
      )
    `);

    // Coaches Table
    db.run(`
      CREATE TABLE IF NOT EXISTS coaches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        sport TEXT NOT NULL,
        specialization TEXT,
        experience_years INTEGER,
        hourly_rate REAL NOT NULL,
        rating REAL DEFAULT 4.9,
        image TEXT,
        available_slots TEXT
      )
    `);

    // Orders Table
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipient_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        alt_phone TEXT,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        pincode TEXT NOT NULL,
        notes TEXT,
        total_amount REAL NOT NULL,
        items TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Contact Messages Table
    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Re-seed Kota, Jaipur & Gurugram Schools and Books
    db.run('DELETE FROM books');
    db.run('DELETE FROM schools');

    console.log('Seeding Kota, Jaipur, and Gurugram Schools & Books...');

    const schoolsSeed = [
      // KOTA SCHOOLS
      ['Kota', 'Shiv Jyoti Convent School', 'Rathankhedi, Kota, Rajasthan'],
      ['Kota', 'Modern School Kota', 'Dadabari, Kota, Rajasthan'],
      ['Kota', 'Shiv Jyoti International School', 'Shrinath Puram, Kota, Rajasthan'],
      ['Kota', 'Vidhyanjali Academy', 'Mahaveer Nagar 3, Kota, Rajasthan'],
      ['Kota', 'Saint James School', 'Talwandi, Kota, Rajasthan'],
      ['Kota', 'STAIRS SCHOOL OF EXCELLENCE', 'Kunhari, Kota, Rajasthan'],
      ['Kota', 'New Model Senior Secondary School', 'Vigyan Nagar, Kota, Rajasthan'],

      // JAIPUR SCHOOLS
      ['Jaipur', 'Narayana eTechno School', 'Pratap Nagar, Jaipur, Rajasthan'],
      ['Jaipur', 'ORCHIDS The International School', 'Sirsi Road, Jaipur, Rajasthan'],
      ['Jaipur', 'Banyan Tree School', 'Sector 10, Malviya Nagar, Jaipur, Rajasthan'],
      ['Jaipur', "St. Xavier's School", 'C-Scheme, Bhagwan Das Road, Jaipur, Rajasthan'],
      ['Jaipur', 'Gyan Vihar School Jaipur', 'Jagatpura, Jaipur, Rajasthan'],
      ['Jaipur', 'Subodh Public School', 'Rambagh Circle, Jaipur, Rajasthan'],
      ['Jaipur', 'Jayshree Periwal Global School', 'Jagatpura, Jaipur, Rajasthan'],
      ['Jaipur', 'Sanskar School', 'Vishwamitra Marg, Sirsi Road, Jaipur, Rajasthan'],
      ['Jaipur', 'Mahaveer Public School', 'Vardhman Path, Jaipur, Rajasthan'],
      ['Jaipur', 'The Palace School', 'City Palace Complex, Jaleb Chowk, Jaipur, Rajasthan'],
      ['Jaipur', 'ASIAN PUBLIC SCHOOL', 'Vaishali Nagar, Jaipur, Rajasthan'],

      // GURUGRAM SCHOOLS
      ['Gurugram', 'Salwan Public School', 'Sector 15 Part 2, Gurugram, Haryana'],
      ['Gurugram', 'St. Xavier High School', 'Sector 49, Golf Course Ext Rd, Gurugram, Haryana'],
      ['Gurugram', 'Open Sky School', 'Sector 5, Gurugram, Haryana'],
      ['Gurugram', 'Ajanta Public School', 'Sector 31, Gurugram, Haryana'],
      ['Gurugram', "St. Crispin's Senior Secondary School", 'New Railway Rd, Gurugram, Haryana'],
      ['Gurugram', 'SCR Public School', 'Sheetla Mata Rd, Gurugram, Haryana'],
      ['Gurugram', 'Ryan International School', 'Sector 40, Gurugram, Haryana']
    ];

    const schoolStmt = db.prepare(`INSERT INTO schools (city, name, address) VALUES (?, ?, ?)`);
    schoolsSeed.forEach(s => schoolStmt.run(s));
    schoolStmt.finalize();

    // Seed Prescribed Book Sets for all schools across Classes 1 to 10
    db.all('SELECT id, name FROM schools', [], (err, schoolRows) => {
      if (err || !schoolRows) return;

      const bookStmt = db.prepare(`INSERT INTO books (school_id, class_grade, subject, book_title, publisher, price) VALUES (?, ?, ?, ?, ?, ?)`);
      const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];

      schoolRows.forEach((school) => {
        classes.forEach((cls) => {
          const classNum = parseInt(cls.replace('Class ', ''));
          
          bookStmt.run([school.id, cls, 'Mathematics', `NCERT Mathematics ${cls}`, 'NCERT / CBSE', 15.00 + classNum * 1.5]);
          bookStmt.run([school.id, cls, 'Science', `Integrated Science & Environment ${cls}`, 'Oxford University Press', 18.00 + classNum * 1.2]);
          bookStmt.run([school.id, cls, 'English', `English Grammar & Reader ${cls}`, 'Cambridge Press', 14.00 + classNum * 1.0]);
          bookStmt.run([school.id, cls, 'Hindi', `Hindi Vyakaran & Sparsh ${cls}`, 'NCERT', 12.00 + classNum * 1.0]);
          bookStmt.run([school.id, cls, 'Social Science', `Our Past & Geography ${cls}`, 'Pearson', 16.50 + classNum * 1.3]);

          if (classNum >= 6) {
            bookStmt.run([school.id, cls, 'Computer Science', `Foundation of IT & AI ${cls}`, 'Kips Publishing', 22.00]);
          }
        });
      });

      bookStmt.finalize();
      console.log('Successfully seeded Kota, Jaipur, and Gurugram schools and book sets!');
    });

    // Seed Products if empty
    db.get('SELECT COUNT(*) AS count FROM products', (err, row) => {
      if (err) return;
      if (row.count === 0) {
        const productsSeed = [
          ['Smart Watch Series 5', 'Accessories', 89.99, 120.00, 4.9, 128, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', 1, 'Best Seller', 'Fitness smartwatch with heart monitor and GPS.'],
          ['Wireless Headphones', 'Electronics', 59.99, 85.00, 4.7, 94, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', 1, 'Popular', 'Over-ear active noise canceling wireless headphones.'],
          ['Travel & School Backpack', 'Custom Bags', 39.99, 60.00, 4.8, 156, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80', 1, 'Top Rated', 'Durable water-resistant backpack customizable with student name.'],
          ['Running & Athletic Shoes', 'Sports', 49.99, 75.00, 4.6, 78, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', 1, 'Hot', 'Lightweight breathable sports running shoes.'],
          ['Luxury Perfume Spray', 'Accessories', 29.99, 45.00, 4.8, 64, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&q=80', 1, 'New', 'Fresh aromatic fragrance spray for daily wear.'],
          ['Official School Uniform Set', 'Dress', 45.00, 65.00, 4.9, 110, 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=500&q=80', 0, 'School Uniform', 'Standard cotton blazer and trouser/skirt uniform set.'],
          ['Premium Gel Pen Set (Pack of 12)', 'Stationary', 12.99, 18.00, 4.9, 210, 'https://images.unsplash.com/photo-1585336261026-6757f54e3ed7?w=500&q=80', 0, 'Stationery', 'Smooth writing 0.5mm quick-dry gel pens.'],
          ['Professional Tennis Racket', 'Sports', 69.99, 99.00, 4.8, 45, 'https://images.unsplash.com/photo-1617083934555-ac7d4fed881c?w=500&q=80', 0, 'Sports Gear', 'Graphite lightweight adult tennis racket with cover.']
        ];

        const prodStmt = db.prepare(`
          INSERT INTO products (name, category, price, original_price, rating, reviews_count, image, is_best_seller, badge, description)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        productsSeed.forEach(p => prodStmt.run(p));
        prodStmt.finalize();
      }
    });

    // Seed Coaches if empty
    db.get('SELECT COUNT(*) AS count FROM coaches', (err, row) => {
      if (err) return;
      if (row.count === 0) {
        const coachesSeed = [
          ['David Beckham', 'Football', 'Tactical Forward & Free-Kicks', 12, 45.00, 4.95, 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=500&q=80', '09:00 AM, 11:00 AM, 04:00 PM'],
          ['Serena Williams', 'Tennis', 'Power Serve & Baseline Mastery', 15, 60.00, 5.0, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80', '08:00 AM, 10:00 AM, 05:00 PM'],
          ['Michael Phelps', 'Swimming', 'Freestyle Technique & Endurance', 10, 55.00, 4.9, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80', '07:00 AM, 09:00 AM, 03:00 PM'],
          ['Garry Kasparov', 'Chess', 'Grandmaster Openings & Endgames', 20, 40.00, 4.98, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80', '02:00 PM, 04:00 PM, 06:00 PM']
        ];

        const coachStmt = db.prepare(`INSERT INTO coaches (name, sport, specialization, experience_years, hourly_rate, rating, image, available_slots) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
        coachesSeed.forEach(c => coachStmt.run(c));
        coachStmt.finalize();
      }
    });
  });
};

export default db;
