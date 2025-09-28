const pool = require('../config/database');

// Kullanıcı oluştur veya mevcut kullanıcıyı getir
const getOrCreateUser = async (ipAddress, userAgent) => {
  try {
    // Önce mevcut kullanıcıyı kontrol et
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE ip_address = $1 ORDER BY created_at DESC LIMIT 1',
      [ipAddress]
    );

    if (existingUser.rows.length > 0) {
      return existingUser.rows[0];
    }

    // Yeni kullanıcı oluştur
    const newUser = await pool.query(
      'INSERT INTO users (ip_address, user_agent) VALUES ($1, $2) RETURNING *',
      [ipAddress, userAgent]
    );

    return newUser.rows[0];
  } catch (error) {
    console.error('Kullanıcı oluşturma hatası:', error);
    throw error;
  }
};

// Kur'an Hatmi seçimlerini getir
const getKuranSelections = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        hs.selection_id,
        hs.selection_name,
        hs.created_at,
        u.ip_address
      FROM hatim_selections hs
      JOIN users u ON hs.user_id = u.id
      WHERE hs.selection_type = 'kuran'
      ORDER BY hs.selection_id
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Kur\'an seçimleri getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Kur\'an seçimleri getirilemedi'
    });
  }
};

// Cevşen Hatmi seçimlerini getir
const getCevsenSelections = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        hs.selection_id,
        hs.selection_name,
        hs.created_at,
        u.ip_address
      FROM hatim_selections hs
      JOIN users u ON hs.user_id = u.id
      WHERE hs.selection_type = 'cevsen'
      ORDER BY hs.selection_id
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Cevşen seçimleri getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Cevşen seçimleri getirilemedi'
    });
  }
};

// Kur'an Hatmi seçimi yap
const selectKuranCuz = async (req, res) => {
  try {
    const { cuzNumber } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Kullanıcıyı oluştur veya getir
    const user = await getOrCreateUser(ipAddress, userAgent);

    // Aynı cüzü daha önce seçmiş mi kontrol et
    const existingSelection = await pool.query(
      'SELECT * FROM hatim_selections WHERE user_id = $1 AND selection_type = $2 AND selection_id = $3',
      [user.id, 'kuran', cuzNumber]
    );

    if (existingSelection.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Bu cüzü zaten seçmişsiniz'
      });
    }

    // Cüz seçimini kaydet
    const result = await pool.query(
      'INSERT INTO hatim_selections (user_id, selection_type, selection_id, selection_name) VALUES ($1, $2, $3, $4) RETURNING *',
      [user.id, 'kuran', cuzNumber, `${cuzNumber}. Cüz`]
    );

    res.json({
      success: true,
      message: `${cuzNumber}. Cüz başarıyla seçildi`,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Kur\'an cüz seçimi hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Cüz seçimi yapılamadı'
    });
  }
};

// Cevşen Hatmi seçimi yap
const selectCevsenItem = async (req, res) => {
  try {
    const { itemNumber, itemName } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Kullanıcıyı oluştur veya getir
    const user = await getOrCreateUser(ipAddress, userAgent);

    // Aynı öğeyi daha önce seçmiş mi kontrol et
    const existingSelection = await pool.query(
      'SELECT * FROM hatim_selections WHERE user_id = $1 AND selection_type = $2 AND selection_id = $3',
      [user.id, 'cevsen', itemNumber]
    );

    if (existingSelection.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Bu öğeyi zaten seçmişsiniz'
      });
    }

    // Cevşen seçimini kaydet
    const result = await pool.query(
      'INSERT INTO hatim_selections (user_id, selection_type, selection_id, selection_name) VALUES ($1, $2, $3, $4) RETURNING *',
      [user.id, 'cevsen', itemNumber, itemName]
    );

    res.json({
      success: true,
      message: `${itemName} başarıyla seçildi`,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Cevşen seçimi hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Cevşen seçimi yapılamadı'
    });
  }
};

// Tüm seçimleri sıfırla (haftalık reset için)
const resetAllSelections = async () => {
  try {
    await pool.query('DELETE FROM hatim_selections');
    await pool.query('DELETE FROM vird_selections');
    await pool.query('UPDATE vird_progress SET total_count = 0, is_completed = false');
    
    console.log('Tüm seçimler başarıyla sıfırlandı');
  } catch (error) {
    console.error('Seçimleri sıfırlama hatası:', error);
    throw error;
  }
};

module.exports = {
  getKuranSelections,
  getCevsenSelections,
  selectKuranCuz,
  selectCevsenItem,
  resetAllSelections
};
