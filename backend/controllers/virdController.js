const pool = require('../config/database');

// Vird progress'ini getir
const getVirdProgress = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        vird_type,
        total_count,
        is_completed,
        last_updated
      FROM vird_progress
      ORDER BY vird_type
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Vird progress getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Vird progress getirilemedi'
    });
  }
};

// Vird seçimi yap
const selectVird = async (req, res) => {
  try {
    const { virdType, virdName, targetCount } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Kullanıcıyı oluştur veya getir
    const user = await pool.query(
      'SELECT * FROM users WHERE ip_address = $1 ORDER BY created_at DESC LIMIT 1',
      [ipAddress]
    );

    let userId;
    if (user.rows.length === 0) {
      const newUser = await pool.query(
        'INSERT INTO users (ip_address, user_agent) VALUES ($1, $2) RETURNING *',
        [ipAddress, userAgent]
      );
      userId = newUser.rows[0].id;
    } else {
      userId = user.rows[0].id;
    }

    // Vird seçimini kaydet
    const result = await pool.query(
      'INSERT INTO vird_selections (user_id, vird_type, vird_name, target_count) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, virdType, virdName, targetCount]
    );

    // Vird progress'ini güncelle
    await pool.query(`
      UPDATE vird_progress 
      SET total_count = total_count + $1, 
          last_updated = CURRENT_TIMESTAMP,
          is_completed = CASE 
            WHEN total_count + $1 >= (
              SELECT CASE 
                WHEN $2 = 'kelime_tevhid' THEN 70000
                WHEN $2 = 'hasbunallah' THEN 19000
                WHEN $2 = 'salaten_nariye' THEN 4444
                WHEN $2 = 'ayetel_kursi' THEN 313
                WHEN $2 = 'ihlas' THEN 1000
                ELSE 0
              END
            ) THEN true 
            ELSE false 
          END
      WHERE vird_type = $2
    `, [targetCount, virdType]);

    res.json({
      success: true,
      message: `${virdName} için ${targetCount} adet vird seçildi`,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Vird seçimi hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Vird seçimi yapılamadı'
    });
  }
};

// Serbest vird girişi
const addCustomVird = async (req, res) => {
  try {
    const { virdType, virdName, customCount } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Kullanıcıyı oluştur veya getir
    const user = await pool.query(
      'SELECT * FROM users WHERE ip_address = $1 ORDER BY created_at DESC LIMIT 1',
      [ipAddress]
    );

    let userId;
    if (user.rows.length === 0) {
      const newUser = await pool.query(
        'INSERT INTO users (ip_address, user_agent) VALUES ($1, $2) RETURNING *',
        [ipAddress, userAgent]
      );
      userId = newUser.rows[0].id;
    } else {
      userId = user.rows[0].id;
    }

    // Serbest vird seçimini kaydet
    const result = await pool.query(
      'INSERT INTO vird_selections (user_id, vird_type, vird_name, target_count) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, virdType, virdName, customCount]
    );

    // Vird progress'ini güncelle
    await pool.query(`
      UPDATE vird_progress 
      SET total_count = total_count + $1, 
          last_updated = CURRENT_TIMESTAMP,
          is_completed = CASE 
            WHEN total_count + $1 >= (
              SELECT CASE 
                WHEN $2 = 'kelime_tevhid' THEN 70000
                WHEN $2 = 'hasbunallah' THEN 19000
                WHEN $2 = 'salaten_nariye' THEN 4444
                WHEN $2 = 'ayetel_kursi' THEN 313
                WHEN $2 = 'ihlas' THEN 1000
                ELSE 0
              END
            ) THEN true 
            ELSE false 
          END
      WHERE vird_type = $2
    `, [customCount, virdType]);

    res.json({
      success: true,
      message: `${virdName} için ${customCount} adet vird eklendi`,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Serbest vird ekleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Serbest vird eklenemedi'
    });
  }
};

// Vird istatistiklerini getir
const getVirdStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        vp.vird_type,
        vp.total_count,
        vp.is_completed,
        CASE 
          WHEN vp.vird_type = 'kelime_tevhid' THEN 70000
          WHEN vp.vird_type = 'hasbunallah' THEN 19000
          WHEN vp.vird_type = 'salaten_nariye' THEN 4444
          WHEN vp.vird_type = 'ayetel_kursi' THEN 313
          WHEN vp.vird_type = 'ihlas' THEN 1000
          ELSE 0
        END as target_count,
        vp.last_updated
      FROM vird_progress vp
      ORDER BY vp.vird_type
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Vird istatistikleri getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Vird istatistikleri getirilemedi'
    });
  }
};

module.exports = {
  getVirdProgress,
  selectVird,
  addCustomVird,
  getVirdStats
};
