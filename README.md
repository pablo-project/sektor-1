# 🏛 1-Sektor Murojaatlar va Tashkilotlar Integratsiyasi Tizimi

Ushbu tizim fuqarolar murojaatlarini qabul qilish, tuman tashkilotlariga taqsimlash, ijrosini monitoring qilish hamda **@sektor_murojaatlar1_bot** rasmiy Telegram boti orqali fuqarolar bilan to‘g‘ridan-to‘g‘ri aloqa o‘rnatish uchun mo‘ljallangan.

---

## 🚀 Render.com yoki boshqa VPS/PaaS'da ishga tushirish (Deploy qo‘llanmasi)

### 1. GitHub repozitoriyasiga yuklash:
```bash
git init
git add .
git commit -m "Initial commit - 1-sektor tizimi"
git branch -M main
git remote add origin https://github.com/SIZNING_PROFIL/REPO_NOMI.git
git push -u origin main
```

### 2. Render.com'da yangi Web Service yaratish:
1. **Render Dashboard**ga kiring va **"New +" -> "Web Service"** tugmasini bosing.
2. O‘zingizning GitHub repozitoriyangizni ulang (`Connect repository`).
3. Quyidagi sozlamalarni kiriting:
   - **Name:** `sektor1-murojaat-tizimi` (yoki ixtiyoriy nom)
   - **Region:** `Frankfurt (EU)` yoki `Singapore` (O‘zbekistonga eng yaqin)
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
   - **Instance Type:** `Free` (bepul tarif)

### 3. Render Environment Variables (`.env`) bo‘limiga qo‘shish:
Render'dagi **Environment** bo‘limiga quyidagi parametrlarni kiritasiz:

| Key (Kalit) | Value (Qiymat) | Tavsif |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Ishlab chiqarish rejimi |
| `TELEGRAM_BOT_TOKEN` | `8828063101:AAE8U4h1ITOku7m0w6mid_X08B4Sn_DaOaA` | @sektor_murojaatlar1_bot rasmiy tokeni |
| `PORT` | `10000` (Render o‘zi avtomatik beradi) | Server porti |

---

## ☁️ Ma'lumotlar bazasi (Firebase Firestore)
Loyiha ichida **`firebase-applet-config.json`** fayli allaqachon sozlangan.
- Tizim Google Cloud Firestore bulutli bazasiga ulanadi.
- Server qayta yuklanganda yoki Render'da yangi versiya chiqqanda ham barcha murojaatlar, statistikalar va tashkilotlar ma'lumotlari **doimiy saqlanib qoladi**.

---

## 🤖 Telegram Bot:
- **Bot nomi:** 1 - SEKTOR MUROJAATLAR
- **Username:** `@sektor_murojaatlar1_bot`
- Fuqarolar botga `/start` buyrug‘ini berib o‘z murojaatlarini qoldirishlari va holatini tekshirishlari mumkin.
