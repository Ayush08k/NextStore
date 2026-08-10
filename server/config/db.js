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
    db.run(`DROP TABLE IF EXISTS products`);
    db.run(`
      CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        sub_category TEXT,
        price REAL NOT NULL,
        original_price REAL,
        price_range TEXT,
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
    db.run(`DROP TABLE IF EXISTS books`);
    db.run(`
      CREATE TABLE books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        school_id INTEGER NOT NULL,
        class_grade TEXT NOT NULL,
        board TEXT DEFAULT 'CBSE',
        subject TEXT NOT NULL,
        book_title TEXT NOT NULL,
        publisher TEXT,
        price REAL NOT NULL,
        price_range TEXT,
        FOREIGN KEY (school_id) REFERENCES schools (id) ON DELETE CASCADE
      )
    `);

    // Uniforms Table
    db.run(`DROP TABLE IF EXISTS uniforms`);
    db.run(`
      CREATE TABLE uniforms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        school_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        dress_type TEXT NOT NULL,
        gender TEXT NOT NULL,
        applicable_classes TEXT,
        price REAL NOT NULL,
        price_range TEXT,
        description TEXT,
        image TEXT,
        sort_order INTEGER DEFAULT 99,
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

    // Clear and Re-seed Data
    db.run('DELETE FROM schools');
    db.run('DELETE FROM coaches');

    console.log('Seeding Kota, Jaipur, and Gurugram Schools with CBSE, RBSE & ICSE Books (₹)...');

    const schoolsSeed = [
      // KOTA SCHOOLS
      ['Kota', 'Shiv Jyoti Convent School', 'Rathankhedi, Kota, Rajasthan'],
      ['Kota', 'Modern School Kota', 'Dadabari, Kota, Rajasthan'],
      ['Kota', 'Shiv Jyoti International School', 'Shrinath Puram, Kota, Rajasthan'],
      ['Kota', 'Vidhyanjali Academy', 'Mahaveer Nagar 3, Kota, Rajasthan'],
      ['Kota', 'Saint James School', 'Talwandi, Kota, Rajasthan'],
      ['Kota', 'STAIRS SCHOOL OF EXCELLENCE', 'Kunhari, Kota, Rajasthan'], // ICSE BOARD
      ['Kota', 'New Model Senior Secondary School', 'Vigyan Nagar, Kota, Rajasthan'], // RBSE

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
      ['Jaipur', 'The Palace School', 'City Palace Complex, Jaleb Chowk, Jaipur, Rajasthan'], // BOTH CBSE & RBSE
      ['Jaipur', 'ASIAN PUBLIC SCHOOL', 'Vaishali Nagar, Jaipur, Rajasthan'], // RBSE

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

    const rbseSchoolKeywords = ['new model', 'palace', 'asian'];
    const icseSchoolKeywords = ['stairs'];
    const cbseSchoolKeywords = [
      'salwan', 'xavier', 'ajanta', 'crispin', 'scr', 'open sky', 'ryan',
      'orchids', 'narayana', 'narayna', 'banyan', 'gyan vihar', 'subodh',
      'jayshree', 'palace', 'mahaveer', 'sanskar', 'shiv', 'modern', 'vidhyanjali'
    ];

    // Seed Prescribed Book Sets for all target schools
    db.all('SELECT id, name FROM schools', [], (err, schoolRows) => {
      if (err || !schoolRows) return;

      const bookStmt = db.prepare(`INSERT INTO books (school_id, class_grade, board, subject, book_title, publisher, price, price_range) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
      const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];

      // CBSE Class 10 Books
      const cbseClass10Ncert = [
        ['Mathematics', 'Mathematics – Textbook for Class X', 'NCERT', 170.00, '₹160 – ₹180'],
        ['Science', 'Science – Textbook for Class X', 'NCERT', 200.00, '₹190 – ₹210'],
        ['English', 'First Flight (Main Textbook)', 'NCERT', 100.00, '₹90 – ₹110'],
        ['English', 'Footprints Without Feet (Supplementary Reader)', 'NCERT', 55.00, '₹50 – ₹60'],
        ['English', 'Words and Expressions 2 (Workbook)', 'NCERT', 130.00, '₹120 – ₹140'],
        ['Social Science', 'India and the Contemporary World – II (History)', 'NCERT', 135.00, '₹125 – ₹140'],
        ['Social Science', 'Contemporary India – II (Geography)', 'NCERT', 85.00, '₹75 – ₹90'],
        ['Social Science', 'Democratic Politics – II (Political Science)', 'NCERT', 95.00, '₹90 – ₹100'],
        ['Social Science', 'Understanding Economic Development (Economics)', 'NCERT', 90.00, '₹85 – ₹95'],
        ['Hindi Course A', 'Kshitij Part 2', 'NCERT', 95.00, '₹90 – ₹100'],
        ['Hindi Course A', 'Kritika Part 2', 'NCERT', 55.00, '₹50 – ₹60'],
        ['Hindi Course B', 'Sparsh Part 2', 'NCERT', 95.00, '₹90 – ₹100'],
        ['Hindi Course B', 'Sanchayan Part 2', 'NCERT', 65.00, '₹60 – ₹70'],
        ['Sanskrit', 'Shemushi Part 2', 'NCERT', 95.00, '₹90 – ₹100']
      ];

      // RBSE Class 10 Books
      const rbseClass10Books = [
        ['Mathematics', 'Ganit (गणित) / Mathematics Class 10', 'RBSE / NCERT', 170.00, '₹160 – ₹180'],
        ['Science', 'Vigyan (विज्ञान) / Science Class 10', 'RBSE / NCERT', 200.00, '₹190 – ₹210'],
        ['Social Science', 'Bharat aur Samkalin Vishav – II (भारत और समकालीन विश्व - 2)', 'RBSE / NCERT', 125.00, '₹125'],
        ['Social Science', 'Samkalin Bharat – II (समकालीन भारत - 2)', 'RBSE / NCERT', 70.00, '₹65 – ₹75'],
        ['Social Science', 'Loktantrik Rajniti – II (लोकतांत्रिक राजनीति - 2)', 'RBSE / NCERT', 85.00, '₹80 – ₹90'],
        ['Social Science', 'Arthik Vikas Ki Samajh (आर्थिक विकास की समझ)', 'RBSE / NCERT', 70.00, '₹65 – ₹75'],
        ['Rajasthan History & Culture', 'Rajasthan Ka Itihas Evam Sanskriti (राजस्थान का इतिहास एवं संस्कृति)', 'RBSE Board', 80.00, '₹70 – ₹90'],
        ['Hindi Course A', 'Kshitij Part 2 (क्षितिज भाग-2)', 'RBSE / NCERT', 95.00, '₹90 – ₹100'],
        ['Hindi Course A', 'Kritika Part 2 (कृतिका भाग-2)', 'RBSE / NCERT', 55.00, '₹50 – ₹60'],
        ['English', 'First Flight (Class 10)', 'RBSE / NCERT', 100.00, '₹90 – ₹110'],
        ['English', 'Footprints Without Feet (Class 10)', 'RBSE / NCERT', 55.00, '₹50 – ₹60'],
        ['Sanskrit', 'Shemushi Part 2 (शेमुषी भाग-2)', 'RBSE / NCERT', 95.00, '₹90 – ₹100']
      ];

      // ICSE Class 10 Books (STAIRS SCHOOL OF EXCELLENCE)
      const icseClass10Books = [
        ['Mathematics', 'Concise Mathematics Class 10 (Selina Publishers / R.K. Bansal)', 'Selina Publishers', 600.00, '₹580 – ₹620'],
        ['Mathematics', 'Understanding ICSE Mathematics Class 10 (Avichal / M.L. Aggarwal)', 'Avichal Publishing', 575.00, '₹550 – ₹600'],
        ['Physics', 'Concise Physics Class 10 (Selina Publishers)', 'Selina Publishers', 505.00, '₹495 – ₹520'],
        ['Chemistry', 'Concise Chemistry Class 10 (Selina Publishers)', 'Selina Publishers', 455.00, '₹430 – ₹480'],
        ['Chemistry', 'Simplified ICSE Chemistry (Dr. Viraf J. Dalal / Allied)', 'Allied Publishers', 500.00, '₹480 – ₹520'],
        ['Biology', 'Concise Biology Class 10 (Selina Publishers)', 'Selina Publishers', 490.00, '₹480 – ₹500'],
        ['English Language', 'Total English Class 10 (Morning Star)', 'Morning Star', 400.00, '₹380 – ₹420'],
        ['English Literature', 'Treasure Chest: A Collection of ICSE Poems & Short Stories', 'Evergreen / Morning Star', 320.00, '₹290 – ₹350'],
        ['History & Civics', 'Total History & Civics Class 10 (Morning Star)', 'Morning Star', 440.00, '₹420 – ₹460'],
        ['Geography', 'Total Geography Class 10 (Morning Star)', 'Morning Star', 525.00, '₹500 – ₹550'],
        ['Geography', 'A Textbook of ICSE Geography (Goyal Brothers)', 'Goyal Brothers Prakashan', 475.00, '₹450 – ₹500'],
        ['Computer Applications', 'Understanding ICSE Computer Applications with BlueJ (APC)', 'APC Books', 550.00, '₹520 – ₹580'],
        ['Computer Applications', 'Logix Computer Applications (Kips Publications)', 'Kips Publications', 500.00, '₹480 – ₹520'],
        ['Commercial Applications', 'ICSE Commercial Applications Class 10 (Goyal Brothers)', 'Goyal Brothers Prakashan', 415.00, '₹380 – ₹450'],
        ['Physical Education', 'Candid ICSE Physical Education Class 10 (Evergreen)', 'Evergreen Publications', 450.00, '₹420 – ₹480'],
        ['Economic Applications', 'ICSE Economic Applications Class 10 (Goyal Brothers)', 'Goyal Brothers Prakashan', 415.00, '₹380 – ₹450']
      ];

      schoolRows.forEach((school) => {
        const schoolNameLower = school.name.toLowerCase();
        const hasCBSE = cbseSchoolKeywords.some(kw => schoolNameLower.includes(kw));
        const hasRBSE = rbseSchoolKeywords.some(kw => schoolNameLower.includes(kw));
        const hasICSE = icseSchoolKeywords.some(kw => schoolNameLower.includes(kw));

        classes.forEach((cls) => {
          // Seed CBSE Books
          if (hasCBSE) {
            if (cls === 'Class 10') {
              cbseClass10Ncert.forEach(([subj, title, pub, price, rng]) => {
                bookStmt.run([school.id, cls, 'CBSE', subj, title, pub, price, rng]);
              });
            } else {
              const classNum = parseInt(cls.replace('Class ', ''));
              bookStmt.run([school.id, cls, 'CBSE', 'Mathematics', `NCERT Mathematics ${cls}`, 'NCERT / CBSE', 180 + classNum * 15, `₹${160 + classNum * 15} – ₹${200 + classNum * 15}`]);
              bookStmt.run([school.id, cls, 'CBSE', 'Science', `Integrated Science & Environment ${cls}`, 'Oxford University Press', 240 + classNum * 20, `₹${220 + classNum * 20} – ₹${260 + classNum * 20}`]);
              bookStmt.run([school.id, cls, 'CBSE', 'English', `English Grammar & Reader ${cls}`, 'Cambridge Press', 190 + classNum * 15, `₹${170 + classNum * 15} – ₹${210 + classNum * 15}`]);
              bookStmt.run([school.id, cls, 'CBSE', 'Hindi', `Hindi Vyakaran & Sparsh ${cls}`, 'NCERT', 160 + classNum * 10, `₹${150 + classNum * 10} – ₹${170 + classNum * 10}`]);
            }
          }

          // Seed RBSE Books
          if (hasRBSE) {
            if (cls === 'Class 10') {
              rbseClass10Books.forEach(([subj, title, pub, price, rng]) => {
                bookStmt.run([school.id, cls, 'RBSE', subj, title, pub, price, rng]);
              });
            } else {
              const classNum = parseInt(cls.replace('Class ', ''));
              bookStmt.run([school.id, cls, 'RBSE', 'Mathematics', `Ganit (गणित) ${cls}`, 'RBSE Board', 170 + classNum * 10, `₹${160 + classNum * 10} – ₹180`]);
              bookStmt.run([school.id, cls, 'RBSE', 'Science', `Vigyan (विज्ञान) ${cls}`, 'RBSE Board', 200 + classNum * 10, `₹190 – ₹210`]);
              bookStmt.run([school.id, cls, 'RBSE', 'Rajasthan Culture', `Rajasthan Adhyayan ${cls}`, 'RBSE Board', 80.00, '₹70 – ₹90']);
            }
          }

          // Seed ICSE Books
          if (hasICSE) {
            if (cls === 'Class 10') {
              icseClass10Books.forEach(([subj, title, pub, price, rng]) => {
                bookStmt.run([school.id, cls, 'ICSE', subj, title, pub, price, rng]);
              });
            } else {
              const classNum = parseInt(cls.replace('Class ', ''));
              bookStmt.run([school.id, cls, 'ICSE', 'Mathematics', `Selina Concise Mathematics ${cls}`, 'Selina Publishers', 450 + classNum * 15, `₹400 – ₹500`]);
              bookStmt.run([school.id, cls, 'ICSE', 'Science', `Concise Science ${cls}`, 'Selina Publishers', 420 + classNum * 15, `₹390 – ₹480`]);
              bookStmt.run([school.id, cls, 'ICSE', 'English', `Total English ${cls}`, 'Morning Star', 350 + classNum * 10, `₹320 – ₹400`]);
            }
          }
        });
      });

      bookStmt.finalize();

      // Seed Uniforms for every school
      const uniformStmt = db.prepare(`
        INSERT INTO uniforms (school_id, name, dress_type, gender, applicable_classes, price, price_range, description, image, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const uniformCatalog = [
        // name, dress_type, gender, applicable_classes, price, price_range, description, image, sort_order
        ['Suit Salwar (Class 8–10)', 'Suit Salwar', 'Girls', 'Class 8, Class 9, Class 10', 650, '₹550 – ₹750', 'Full-sleeve suit salwar in school colors, soft cotton blend.', null, 1],
        ['Suit Salwar (Class 1–7)', 'Suit Salwar', 'Girls', 'Class 1, Class 2, Class 3, Class 4, Class 5, Class 6, Class 7', 580, '₹480 – ₹680', 'Comfortable cotton suit salwar for junior classes.', null, 2],
        ['Skirt (Girls)', 'Skirt', 'Girls', 'Class 1–10', 320, '₹270 – ₹380', 'Pleated school skirt in school uniform color.', null, 3],
        ['White Suit & Salwar', 'White Suit Salwar', 'Girls', 'All Classes', 620, '₹520 – ₹720', 'All-white cotton suit salwar for special occasions & PT days.', null, 4],
        ['White Skirt', 'White Skirt', 'Girls', 'All Classes', 290, '₹240 – ₹340', 'All-white pleated skirt for PT / assembly days.', null, 5],
        ['Shirt (Boys & Girls)', 'Shirt', 'Unisex', 'All Classes', 280, '₹230 – ₹330', 'Full-sleeve school shirt in school uniform color.', null, 6],
        ['White Shirt', 'White Shirt', 'Unisex', 'All Classes', 260, '₹210 – ₹310', 'Crisp white cotton school shirt for PT / formal days.', null, 7],
        ['White T-Shirt', 'White T-Shirt', 'Unisex', 'All Classes', 200, '₹160 – ₹240', 'Round-neck white cotton T-shirt for PE / sports days.', null, 8],
        ['Boys Pant', 'Boys Pant', 'Boys', 'All Classes', 380, '₹320 – ₹440', 'Regular fit school trousers in school uniform color.', null, 9],
        ['White Pant', 'White Pant', 'Boys', 'All Classes', 350, '₹290 – ₹410', 'All-white school trouser for PT / special occasion days.', null, 10],
        ['Half Pant (Boys)', 'Half Pant', 'Boys', 'Class 1–5', 260, '₹210 – ₹310', 'School half-pant in uniform color for primary classes.', null, 11],
        ['White Half Pant', 'White Half Pant', 'Boys', 'Class 1–5', 240, '₹190 – ₹290', 'All-white half-pant for PT / sports.', null, 12],
        ['PE / Sports Tracksuit (Jacket + Pant)', 'Tracksuit', 'Unisex', 'All Classes', 920, '₹800 – ₹1,050', 'Breathable polyester tracksuit jacket and pant set for PE/sports.', null, 13],
        ['Sports Shorts', 'Sports Shorts', 'Unisex', 'All Classes', 220, '₹180 – ₹260', 'Lightweight dry-fit sports shorts for PE and outdoor activity.', null, 14],
        ['Winter Blazer / Jacket', 'Blazer', 'Unisex', 'All Classes', 1100, '₹950 – ₹1,300', 'Wool-blend school blazer with official school crest for winter.', null, 15],
        ['School Tie', 'Tie', 'Unisex', 'Class 5–10', 150, '₹120 – ₹180', 'Striped school tie in official school colors.', null, 16],
        ['School Belt', 'Belt', 'Unisex', 'All Classes', 80, '₹60 – ₹100', 'Black leather school belt with school logo buckle.', null, 17],
        ['School Socks (Pack of 3 Pairs)', 'Socks', 'Unisex', 'All Classes', 120, '₹90 – ₹150', 'White cotton school socks, anti-skid reinforced toe.', null, 18],
        ['School Shoes', 'Shoes', 'Unisex', 'All Classes', 750, '₹600 – ₹900', 'Durable black school shoes with cushioned sole.', null, 19],
      ];

      schoolRows.forEach(school => {
        uniformCatalog.forEach(([name, dtype, gender, classes, price, range, desc, img, sortOrder]) => {
          uniformStmt.run([school.id, name, dtype, gender, classes, price, range, desc, img, sortOrder]);
        });
      });

      uniformStmt.finalize();
    });

    // Seed Products
    const productsSeed = [
      ['Smart Watch Series 5', 'Accessories', 'Electronics', 2499.00, 3499.00, '₹2499', 4.9, 128, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', 1, 'Best Seller', 'Fitness smartwatch with heart monitor and GPS.'],
      ['Wireless Headphones', 'Electronics', 'Electronics', 1899.00, 2499.00, '₹1899', 4.7, 94, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', 1, 'Popular', 'Over-ear active noise canceling wireless headphones.'],
      ['Travel & School Backpack', 'Custom Bags', 'Bags', 1299.00, 1899.00, '₹1299', 4.8, 156, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80', 1, 'Top Rated', 'Durable water-resistant backpack customizable with student name.'],
      ['Running & Athletic Shoes', 'Sports', 'Footwear', 1599.00, 2299.00, '₹1599', 4.6, 78, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', 1, 'Hot', 'Lightweight breathable sports running shoes.'],
      ['Official School Uniform Set', 'Dress', 'Uniforms', 1450.00, 1999.00, '₹1450', 4.9, 110, 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=500&q=80', 0, 'School Uniform', 'Standard cotton blazer and trouser/skirt uniform set.'],

      // STATIONERY ITEMS IN CENTRAL DATABASE
      ['Ballpoint Pens (Pack of 10)', 'Stationary', 'Writing & Marking Supplies', 75.00, 100.00, '₹50 – ₹100', 4.9, 210, 'https://images.unsplash.com/photo-1585336261026-6757f54e3ed7?w=500&q=80', 1, 'Best Seller', 'Smooth blue/black ballpoint pens pack.'],
      ['Smooth Gel Pens (Pack of 5)', 'Stationary', 'Writing & Marking Supplies', 85.00, 150.00, '₹10 – ₹150', 4.8, 180, 'https://images.unsplash.com/photo-1585336261026-6757f54e3ed7?w=500&q=80', 0, 'Popular', 'Quick dry Japanese gel pen pack.'],
      ['Rollerball & Fineliner Pen (Single)', 'Stationary', 'Writing & Marking Supplies', 60.00, 80.00, '₹40 – ₹80', 4.7, 95, 'https://images.unsplash.com/photo-1585336261026-6757f54e3ed7?w=500&q=80', 0, 'Essential', 'Precision fine tip rollerball pen.'],
      ['Wooden HB Pencils (Box of 10)', 'Stationary', 'Writing & Marking Supplies', 60.00, 70.00, '₹50 – ₹70', 4.9, 340, 'https://images.unsplash.com/photo-1585336261026-6757f54e3ed7?w=500&q=80', 0, 'School Standard', 'Break-resistant HB lead wooden pencils.'],
      ['Mechanical Pencil 0.5mm / 0.7mm', 'Stationary', 'Writing & Marking Supplies', 80.00, 120.00, '₹30 – ₹120', 4.8, 140, 'https://images.unsplash.com/photo-1585336261026-6757f54e3ed7?w=500&q=80', 0, 'Drafting', 'Ergonomic mechanical pencil with extra lead.'],
      ['Permanent & Whiteboard Markers (Pack of 4)', 'Stationary', 'Writing & Marking Supplies', 95.00, 120.00, '₹60 – ₹120', 4.8, 115, 'https://images.unsplash.com/photo-1585336261026-6757f54e3ed7?w=500&q=80', 0, 'Classroom', 'Dry-erase whiteboard and permanent markers.'],
      ['Pastel Highlighters (Assorted Pack of 4)', 'Stationary', 'Writing & Marking Supplies', 120.00, 150.00, '₹80 – ₹150', 4.9, 290, 'https://images.unsplash.com/photo-1585336261026-6757f54e3ed7?w=500&q=80', 1, 'Trending', 'Soft pastel colors aesthetic highlighters.'],

      ['A4 Copier Paper 75-80 GSM (500 Sheets Ream)', 'Stationary', 'Paper Products & Notebooks', 320.00, 380.00, '₹280 – ₹380', 4.9, 420, 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&q=80', 1, 'Top Seller', 'High brightness 80GSM A4 printing paper ream.'],
      ['Classmate Spiral Notebook (150-200 Pages)', 'Stationary', 'Paper Products & Notebooks', 120.00, 180.00, '₹60 – ₹180', 4.9, 510, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80', 1, 'Student Favorite', 'Durable spiral notebook with micro-perforated pages.'],
      ['Hardbound Journal / Executive Diary', 'Stationary', 'Paper Products & Notebooks', 380.00, 600.00, '₹200 – ₹600', 4.8, 160, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80', 0, 'Executive', 'Faux leather hardbound journal diary.'],
      ['Sticky Notes 3x3 Inch (100 Sheets)', 'Stationary', 'Paper Products & Notebooks', 45.00, 60.00, '₹35 – ₹60', 4.8, 380, 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&q=80', 0, 'Essential', 'High-tack self-adhesive sticky notes.'],
      ['Revision Index & Flash Cards (Pack of 100)', 'Stationary', 'Paper Products & Notebooks', 85.00, 120.00, '₹50 – ₹120', 4.7, 130, 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&q=80', 0, 'Study Tool', 'Ruled revision flash cards.'],
      ['Perforated Writing Pad / Legal Pad', 'Stationary', 'Paper Products & Notebooks', 65.00, 90.00, '₹40 – ₹90', 4.6, 90, 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&q=80', 0, 'Office', 'Yellow legal writing pad.'],

      ['L-Folder / Clear Sleeves (Pack of 10)', 'Stationary', 'Filing & Organization', 75.00, 100.00, '₹50 – ₹100', 4.8, 270, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80', 0, 'Organization', 'Clear L-shaped transparent document sleeves.'],
      ['Box / Lever Arch File Folder', 'Stationary', 'Filing & Organization', 160.00, 200.00, '₹120 – ₹200', 4.9, 195, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80', 0, 'Heavy Duty', 'Spine-indexed metal lever arch file.'],
      ['2-Ring / 4-Ring Executive Binder File', 'Stationary', 'Filing & Organization', 180.00, 220.00, '₹140 – ₹220', 4.8, 140, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80', 0, 'Binder', 'D-ring binder file for certificates.'],
      ['Expanding File Folder (12-13 Pockets)', 'Stationary', 'Filing & Organization', 260.00, 350.00, '₹180 – ₹350', 4.9, 230, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80', 1, 'Top Rated', '13-pocket tabbed accordion file folder.'],
      ['Sheet Protectors / Punched Pockets (Pack of 100)', 'Stationary', 'Filing & Organization', 210.00, 250.00, '₹180 – ₹250', 4.8, 180, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80', 0, 'Protectors', 'Acid-free clear plastic punched sheets.'],

      ['Medium Stapler + Pins (No. 10 Set)', 'Stationary', 'Desk Accessories & Fasteners', 120.00, 160.00, '₹80 – ₹160', 4.8, 310, 'https://images.unsplash.com/photo-1585336261026-6757f54e3ed7?w=500&q=80', 0, 'Desk Tool', 'All-metal desk stapler with 1000 pins.'],
      ['Metal Paper Clips (Box of 100)', 'Stationary', 'Desk Accessories & Fasteners', 45.00, 60.00, '₹30 – ₹60', 4.7, 190, 'https://images.unsplash.com/photo-1585336261026-6757f54e3ed7?w=500&q=80', 0, 'Fasteners', 'Vinyl-coated steel paper clips.'],
      ['Assorted Binder Clips (Box of 12)', 'Stationary', 'Desk Accessories & Fasteners', 65.00, 90.00, '₹40 – ₹90', 4.8, 220, 'https://images.unsplash.com/photo-1585336261026-6757f54e3ed7?w=500&q=80', 0, 'Clips', 'Heavy spring tension binder clips.'],
      ['Non-Toxic Glue Stick (15g - 25g)', 'Stationary', 'Desk Accessories & Fasteners', 40.00, 60.00, '₹25 – ₹60', 4.9, 440, 'https://images.unsplash.com/photo-1585336261026-6757f54e3ed7?w=500&q=80', 0, 'Adhesive', 'Clean non-wrinkle paper glue stick.'],
      ['Crystal Clear Stationery Tape (1 Inch Width)', 'Stationary', 'Desk Accessories & Fasteners', 30.00, 40.00, '₹20 – ₹40', 4.8, 360, 'https://images.unsplash.com/photo-1585336261026-6757f54e3ed7?w=500&q=80', 0, 'Tape', 'High clarity glossy tape roll.'],
      ['Stainless Steel Scissors (Standard 6-7 Inch)', 'Stationary', 'Desk Accessories & Fasteners', 85.00, 120.00, '₹50 – ₹120', 4.8, 175, 'https://images.unsplash.com/photo-1585336261026-6757f54e3ed7?w=500&q=80', 0, 'Cutting', 'Precision ground stainless steel blades.'],
      ['Utility Snap-Off Craft Knife', 'Stationary', 'Desk Accessories & Fasteners', 60.00, 90.00, '₹30 – ₹90', 4.7, 140, 'https://images.unsplash.com/photo-1585336261026-6757f54e3ed7?w=500&q=80', 0, 'Cutter', 'Auto-locking retractable craft cutter.'],
      ['Correction Tape Dispenser', 'Stationary', 'Desk Accessories & Fasteners', 60.00, 80.00, '₹40 – ₹80', 4.8, 250, 'https://images.unsplash.com/photo-1585336261026-6757f54e3ed7?w=500&q=80', 0, 'Correction', 'Instant dry white correction tape.'],
      ['Desk Organizer / Mesh Pen Stand', 'Stationary', 'Desk Accessories & Fasteners', 280.00, 450.00, '₹150 – ₹450', 4.9, 185, 'https://images.unsplash.com/photo-1585336261026-6757f54e3ed7?w=500&q=80', 1, 'Must Have', 'Multi-compartment metal wire mesh pen holder.']
    ];

    const prodStmt = db.prepare(`
      INSERT INTO products (name, category, sub_category, price, original_price, price_range, rating, reviews_count, image, is_best_seller, badge, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    productsSeed.forEach(p => prodStmt.run(p));
    prodStmt.finalize();

    // Seed Indian Rupee Coaches
    const coachesSeed = [
      ['David Beckham', 'Football', 'Tactical Forward & Free-Kicks', 12, 500.00, 4.95, 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=500&q=80', '09:00 AM, 11:00 AM, 04:00 PM'],
      ['Serena Williams', 'Tennis', 'Power Serve & Baseline Mastery', 15, 750.00, 5.0, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80', '08:00 AM, 10:00 AM, 05:00 PM'],
      ['Michael Phelps', 'Swimming', 'Freestyle Technique & Endurance', 10, 650.00, 4.9, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80', '07:00 AM, 09:00 AM, 03:00 PM'],
      ['Garry Kasparov', 'Chess', 'Grandmaster Openings & Endgames', 20, 450.00, 4.98, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80', '02:00 PM, 04:00 PM, 06:00 PM']
    ];

    const coachStmt = db.prepare(`INSERT INTO coaches (name, sport, specialization, experience_years, hourly_rate, rating, image, available_slots) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    coachesSeed.forEach(c => coachStmt.run(c));
    coachStmt.finalize();

    console.log('Successfully re-seeded NextStore database with CBSE, RBSE & ICSE prescribed books!');
  });
};

export default db;
