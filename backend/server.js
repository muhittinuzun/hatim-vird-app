const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const pool = require('./config/database');
const { initDatabase } = require('./models/init');
const { startWeeklyReset } = require('./jobs/weeklyReset');

// Routes
const hatimRoutes = require('./routes/hatim');
const virdRoutes = require('./routes/vird');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // Her IP için 15 dakikada maksimum 100 istek
  message: 'Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin.'
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// IP adresini doğru şekilde al
app.set('trust proxy', 1);

// Routes
app.use('/api/hatim', hatimRoutes);
app.use('/api/vird', virdRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server çalışıyor',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server hatası:', err);
  res.status(500).json({
    success: false,
    message: 'Sunucu hatası oluştu'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint bulunamadı'
  });
});

// Server başlatma
const startServer = async () => {
  try {
    // Veritabanını başlat
    await initDatabase();
    
    // Haftalık reset cron job'ını başlat
    startWeeklyReset();
    
    // Server'ı başlat
    app.listen(PORT, () => {
      console.log(`Server ${PORT} portunda çalışıyor`);
      console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    });
  } catch (error) {
    console.error('Server başlatma hatası:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM sinyali alındı, server kapatılıyor...');
  pool.end(() => {
    console.log('Veritabanı bağlantısı kapatıldı');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT sinyali alındı, server kapatılıyor...');
  pool.end(() => {
    console.log('Veritabanı bağlantısı kapatıldı');
    process.exit(0);
  });
});

startServer();
