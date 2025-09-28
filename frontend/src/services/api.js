import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hatim API'leri
export const hatimAPI = {
  // Kur'an Hatmi seçimlerini getir
  getKuranSelections: () => api.get('/hatim/kuran'),
  
  // Cevşen Hatmi seçimlerini getir
  getCevsenSelections: () => api.get('/hatim/cevsen'),
  
  // Kur'an cüz seçimi yap
  selectKuranCuz: (cuzNumber) => api.post('/hatim/kuran/select', { cuzNumber }),
  
  // Cevşen öğe seçimi yap
  selectCevsenItem: (itemNumber, itemName) => api.post('/hatim/cevsen/select', { itemNumber, itemName }),
};

// Vird API'leri
export const virdAPI = {
  // Vird progress'ini getir
  getVirdProgress: () => api.get('/vird/progress'),
  
  // Vird istatistiklerini getir
  getVirdStats: () => api.get('/vird/stats'),
  
  // Vird seçimi yap
  selectVird: (virdType, virdName, targetCount) => api.post('/vird/select', { virdType, virdName, targetCount }),
  
  // Serbest vird girişi
  addCustomVird: (virdType, virdName, customCount) => api.post('/vird/custom', { virdType, virdName, customCount }),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
