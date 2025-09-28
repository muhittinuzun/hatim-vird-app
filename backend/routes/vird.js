const express = require('express');
const router = express.Router();
const {
  getVirdProgress,
  selectVird,
  addCustomVird,
  getVirdStats
} = require('../controllers/virdController');

// Vird progress'ini getir
router.get('/progress', getVirdProgress);

// Vird istatistiklerini getir
router.get('/stats', getVirdStats);

// Vird seçimi yap
router.post('/select', selectVird);

// Serbest vird girişi
router.post('/custom', addCustomVird);

module.exports = router;
