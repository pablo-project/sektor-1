# 🚀 Render.com da Loyihani 100% Ishga Tushirish Bo‘yicha To‘liq Qo‘llanma

Ushbu qo‘llanma **1-Sektor Murojaatlar Portali & Telegram Bot** tizimini Render.com bulutli platformasida 100% xatosiz, barqaror ishga tushirish uchun tayyorlangan.

---

## 1. Tayyorgarlik (GitHub ga yuklash)

1. Loyihani GitHub-dagi shaxsiy profilingizga yuklang (yoki AI Studio yuqori o‘ng burchagidagi **Export / GitHub** tugmasidan foydalaning).
2. Repozitoriyingizda quyidagi fayllar mavjudligiga ishonch hosil qiling:
   - `package.json`
   - `server.ts`
   - `render.yaml`
   - `.node-version` (avtomatik Node 20 ni tanlaydi)
   - `firebase-applet-config.json` (agar Firestore bazasini ulashni istasangiz)

---

## 2. Render.com da Web Service yaratish

1. [render.com](https://render.com) ga kiring va hisobingizga kiring.
2. Dashboard-da **«New +»** tugmasini bosing va **«Web Service»** ni tanlang.
3. GitHub hisobingizni ulab, kerakli repozitoriyni tanlang.
4. Quyidagi parametrlarni to‘ldiring:

| Parametr nomi | Qiymati |
| :--- | :--- |
| **Name** | `paxtachi-1-sektor-portal` (yoki ixtiyoriy nom) |
| **Region** | `Frankfurt (EU Central)` *(O‘zbekistonga eng yaqini)* |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` (bepul) |

---

## 3. Environment Variables (Muhit o‘zgaruvchilarini kiritish)

«Environment Variables» bo‘limiga quyidagi o‘zgaruvchilarni qo‘shing:

| Key (Kalit) | Value (Qiymat) | Izoh |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Production rejimida ishlash uchun |
| `TELEGRAM_BOT_TOKEN` | `8828063101:AAE8U4h1ITOku7m0w6mid_X08B4Sn_DaOaA` | Murojaat qabul qiluvchi Telegram botingiz tokeni |
| `GEMINI_API_KEY` | *(Sizning Gemini API kalitingiz)* | Sun'iy intellekt tahlillari uchun |
| `FIREBASE_CONFIG` | *(Ixtiyoriy)* | Agar `firebase-applet-config.json` ni GitHub ga qo‘shmagan bo‘lsangiz, shu fayl ichidagi JSON matnini shu yerga joylang |

---

## 4. Health Check sozlamasi (Muhim)

«Advanced» tugmasini bosing va:
- **Health Check Path**: `/api/health` deb yozing.
- Bu Render-ga server muvaffaqiyatli ishga tushganini va Telegram bot faolligini avtomatik tekshirib turish imkonini beradi.

---

## 5. «Create Web Service» tugmasini bosing

Render ilovani yuklab oladi, `npm install && npm run build` ni bajaradi va `dist/server.cjs` orqali serverni ishga tushiradi.
Terminalda quyidagi loglarni ko‘rasiz:
```text
==> Build successful 🎉
==> Running 'npm start'
🚀 Server running on http://0.0.0.0:10000
🤖 Telegram Bot faollashtirildi: @...
```

---

## 6. ⚡️ Free Tier-da 24/7 Uyg‘oq Saqlash (Muhim tavsiya)

Render.com-ning bepul (Free) tarifida, agar saytga 15 daqiqa davomida so‘rov kelmasa, server uyqu (sleep) rejimiga o‘tadi. Bot uzluksiz 24/7 xabar qabul qilishi uchun:

1. Bepul [uptimerobot.com](https://uptimerobot.com) yoki [cron-job.org](https://cron-job.org) saytiga kiring.
2. Yangi monitor qo‘shing:
   - **URL**: `https://sizning-loyiha.onrender.com/api/health`
   - **Interval**: Har `5 daqiqa`da (every 5 minutes).
3. Bu tizim sizning serveringizga har 5 daqiqada yengil ping yuboradi, server hech qachon uxlamaydi va Telegram bot 24/7 to‘xtovsiz fuqarolardan murojaat qabul qilib turadi!
