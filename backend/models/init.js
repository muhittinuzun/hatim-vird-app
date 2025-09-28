const pool = require('../config/database');

const initDatabase = async () => {
  try {
    // Users tablosu
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        ip_address VARCHAR(45) NOT NULL,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Hatim selections tablosu
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hatim_selections (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        selection_type VARCHAR(50) NOT NULL, -- 'kuran' or 'cevsen'
        selection_id INTEGER NOT NULL, -- cüz numarası veya cevşen numarası
        selection_name VARCHAR(100) NOT NULL, -- '1. Cüz' veya 'Kur\'an Bölümü'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, selection_type, selection_id)
      )
    `);

    // Vird selections tablosu
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vird_selections (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        vird_type VARCHAR(50) NOT NULL, -- 'kelime_tevhid', 'hasbunallah', etc.
        vird_name VARCHAR(100) NOT NULL,
        target_count INTEGER NOT NULL,
        current_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Vird progress tablosu
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vird_progress (
        id SERIAL PRIMARY KEY,
        vird_type VARCHAR(50) NOT NULL,
        total_count INTEGER DEFAULT 0,
        is_completed BOOLEAN DEFAULT FALSE,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Vird progress için başlangıç verileri
    const virdTypes = [
      { type: 'kelime_tevhid', name: 'Kelime-i Tevhid', target: 70000 },
      { type: 'hasbunallah', name: 'Hasbunallah', target: 19000 },
      { type: 'salaten_nariye', name: 'Salaten Nariye', target: 4444 },
      { type: 'ayetel_kursi', name: 'Ayete\'l Kürsî', target: 313 },
      { type: 'ihlas', name: 'İhlas', target: 1000 }
    ];

    for (const vird of virdTypes) {
      await pool.query(`
        INSERT INTO vird_progress (vird_type, total_count, is_completed)
        VALUES ($1, 0, false)
        ON CONFLICT (vird_type) DO NOTHING
      `, [vird.type]);
    }

    console.log('Veritabanı tabloları başarıyla oluşturuldu');
  } catch (error) {
    console.error('Veritabanı başlatma hatası:', error);
    throw error;
  }
};

module.exports = { initDatabase };
