const cron = require('node-cron');
const { resetAllSelections } = require('../controllers/hatimController');

// Her cumartesi saat 00:00'da çalışacak cron job
const startWeeklyReset = () => {
  cron.schedule('0 0 * * 6', async () => {
    try {
      console.log('Haftalık reset başlatılıyor...');
      await resetAllSelections();
      console.log('Haftalık reset tamamlandı - Tüm seçimler sıfırlandı');
    } catch (error) {
      console.error('Haftalık reset hatası:', error);
    }
  }, {
    scheduled: true,
    timezone: "Europe/Istanbul"
  });

  console.log('Haftalık reset cron job başlatıldı - Her cumartesi 00:00');
};

module.exports = { startWeeklyReset };
