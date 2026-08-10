import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Initialize Firebase
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Connect to SQLite
const dbPath = path.join(__dirname, '../server/nextstore.db');
const sqlDb = new sqlite3.Database(dbPath);

const migrateTable = (tableName, transformFn) => {
  return new Promise((resolve, reject) => {
    sqlDb.all(`SELECT * FROM ${tableName}`, async (err, rows) => {
      if (err) return reject(err);
      
      console.log(`Migrating ${rows.length} records from ${tableName}...`);
      const batch = db.batch();
      
      rows.forEach(row => {
        const docRef = db.collection(tableName).doc(row.id.toString());
        const data = transformFn ? transformFn(row) : row;
        batch.set(docRef, data);
      });
      
      await batch.commit();
      console.log(`Finished migrating ${tableName}.`);
      resolve();
    });
  });
};

const runMigration = async () => {
  try {
    await migrateTable('products');
    await migrateTable('schools');
    await migrateTable('books', (row) => ({
      ...row,
      school_id: row.school_id.toString()
    }));
    await migrateTable('uniforms', (row) => ({
      ...row,
      school_id: row.school_id.toString()
    }));
    await migrateTable('coaches');
    // We don't necessarily need to migrate orders or messages if they are ephemeral,
    // but let's migrate them just in case.
    await migrateTable('orders');
    await migrateTable('messages');
    
    console.log("All migrations completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

runMigration();
