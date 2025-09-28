const express = require('express');
const router = express.Router();
const {
  getKuranSelections,
  getCevsenSelections,
  selectKuranCuz,
  selectCevsenItem
} = require('../controllers/hatimController');

// Kur'an Hatmi seçimlerini getir
router.get('/kuran', getKuranSelections);

// Cevşen Hatmi seçimlerini getir
router.get('/cevsen', getCevsenSelections);

// Kur'an cüz seçimi yap
router.post('/kuran/select', selectKuranCuz);

// Cevşen öğe seçimi yap
router.post('/cevsen/select', selectCevsenItem);

module.exports = router;
