# Hatim & Vird - Dijital Hatim Uygulaması

Bu uygulama, Kur'an Hatmi, Cevşen Hatmi ve Virdler için dijital bir platform sağlar. Kullanıcılar cüz seçebilir, cevşen öğeleri alabilir ve vird hedeflerine katkıda bulunabilir.

## 🚀 Özellikler

### Genel Özellikler
- **Web Tabanlı**: Herkese açık erişim
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- **Otomatik Reset**: Her cumartesi tüm seçimler sıfırlanır
- **Gerçek Zamanlı**: Anlık seçim takibi

### Sayfa Yapısı
1. **Kur'an Hatmi**: 30 cüz seçimi (6x5 grid)
2. **Cevşen Hatmi**: 30 öğe seçimi (10 farklı isim x 3 tekrar)
3. **Virdler**: 5 farklı vird türü için hedef takibi

### Vird Türleri
- **Kelime-i Tevhid**: Hedef 70.000
- **Hasbunallah**: Hedef 19.000
- **Salaten Nariye**: Hedef 4.444
- **Ayete'l Kürsî**: Hedef 313
- **İhlas**: Hedef 1.000

## 🛠️ Teknoloji Stack

### Backend
- **Node.js** + **Express.js**
- **PostgreSQL** veritabanı
- **node-cron** (haftalık reset için)
- **CORS** ve **Helmet** (güvenlik)

### Frontend
- **React 18**
- **React Router** (sayfa yönlendirme)
- **Styled Components** (CSS-in-JS)
- **Axios** (API istekleri)
- **React Toastify** (bildirimler)

## 📦 Kurulum

### Gereksinimler
- Node.js (>=18.0.0)
- npm (>=8.0.0)
- PostgreSQL veritabanı

### Yerel Geliştirme

1. **Repository'yi klonlayın:**
```bash
git clone <repository-url>
cd hatim-vird-app
```

2. **Tüm bağımlılıkları yükleyin:**
```bash
npm run install-all
```

3. **Veritabanı ayarlarını yapın:**
```bash
cd backend
cp env.example .env
```

`.env` dosyasını düzenleyin:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/hatim_vird_db
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. **PostgreSQL veritabanını oluşturun:**
```sql
CREATE DATABASE hatim_vird_db;
```

5. **Uygulamayı başlatın:**
```bash
# Geliştirme modu (hem backend hem frontend)
npm run dev

# Sadece backend
npm start

# Sadece frontend
cd frontend && npm start
```

## 🌐 Deploy

### Heroku Deploy

1. **Heroku CLI'yi yükleyin:**
```bash
npm install -g heroku
```

2. **Heroku'ya giriş yapın:**
```bash
heroku login
```

3. **Uygulamayı oluşturun:**
```bash
heroku create hatim-vird-app
```

4. **PostgreSQL addon ekleyin:**
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

5. **Environment variables ayarlayın:**
```bash
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://hatim-vird-app.herokuapp.com
```

6. **Deploy edin:**
```bash
git add .
git commit -m "Initial commit"
git push heroku main
```

### Render Deploy

1. **Render.com'da yeni Web Service oluşturun**
2. **Repository'yi bağlayın**
3. **Build Command:** `npm run heroku-postbuild`
4. **Start Command:** `npm start`
5. **Environment Variables:**
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: PostgreSQL connection string

### Railway Deploy

1. **Railway.app'e giriş yapın**
2. **New Project > Deploy from GitHub**
3. **Repository'yi seçin**
4. **PostgreSQL service ekleyin**
5. **Environment variables ayarlayın**

## 📊 Veritabanı Şeması

### Tablolar
- **users**: Kullanıcı bilgileri (IP tabanlı)
- **hatim_selections**: Hatim seçimleri
- **vird_selections**: Vird seçimleri
- **vird_progress**: Vird ilerleme takibi

### Otomatik İşlemler
- **Haftalık Reset**: Her cumartesi 00:00'da tüm seçimler sıfırlanır
- **Progress Tracking**: Vird hedeflerine ulaşıldığında otomatik tamamlanır

## 🔧 API Endpoints

### Hatim API
- `GET /api/hatim/kuran` - Kur'an seçimlerini getir
- `GET /api/hatim/cevsen` - Cevşen seçimlerini getir
- `POST /api/hatim/kuran/select` - Kur'an cüz seç
- `POST /api/hatim/cevsen/select` - Cevşen öğe seç

### Vird API
- `GET /api/vird/progress` - Vird progress'ini getir
- `GET /api/vird/stats` - Vird istatistiklerini getir
- `POST /api/vird/select` - Vird seçimi yap
- `POST /api/vird/custom` - Serbest vird girişi

## 🎨 Tasarım Özellikleri

- **Modern UI**: Temiz ve kullanıcı dostu arayüz
- **Responsive**: Tüm cihazlarda uyumlu
- **Accessibility**: Erişilebilir tasarım
- **Performance**: Hızlı yükleme ve smooth animasyonlar

## 📱 Kullanım

1. **Kur'an Hatmi**: 30 cüzden birini seçin
2. **Cevşen Hatmi**: 30 öğeden birini seçin
3. **Virdler**: Hedeflere katkıda bulunun
4. **Takip**: İlerlemenizi gerçek zamanlı takip edin

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Sorularınız için issue açabilir veya iletişime geçebilirsiniz.

---

**Not**: Bu uygulama her hafta cumartesi günü otomatik olarak sıfırlanır. Seçimleriniz kaybolacaktır.
