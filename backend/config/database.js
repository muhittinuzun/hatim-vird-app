const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.on('connect', () => {
  console.log('PostgreSQL veritabanına bağlandı');
});

pool.on('error', (err) => {
  console.error('PostgreSQL bağlantı hatası:', err);
});

module.exports = pool;
