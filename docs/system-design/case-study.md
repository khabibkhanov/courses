# Kurs bo'ylab case study: avtopark monitoring platformasi

System Design darslaridagi `## Amaliyotda` bo'limi va ko'p amaliy topshiriqlar bitta takrorlanuvchi o'quv misoliga tayanadi. Bu - o'ylab topilgan o'quv misoli, hech qanday real kompaniya emas. Darslarda unga nom berilmaydi.

## Misol nima

Korporativ avtoparklar (yuk tashish, yetkazib berish, qurilish texnikasi, taksi parklari) uchun SaaS monitoring platformasi:

- **GPS telemetriya:** mashinadagi tracker har bir necha soniyada joylashuv, tezlik, yo'nalish, dvigatel holatini yuboradi.
- **Yoqilg'i nazorati:** bakdagi yoqilg'i sathi datchigi (ДУТ, fuel level sensor) - quyish va to'kib olishni aniqlash.
- **Video:** kabinadagi va tashqi kameralar, voqea bo'yicha klip yozish.
- **Ogohlantirishlar va hisobotlar:** geofence, tezlik oshishi, harakatsiz turish, kunlik va oylik hisobotlar.
- **Haydovchi skoringi:** keskin tormoz, tezlanish, burilish asosida baho.
- **Foydalanuvchilar:** mijoz kompaniyaning dispetcherlari va rahbarlari (multi-tenant), haydovchilar mobil ilovasi.

## Darslarda qanday nomlanadi

Kompaniya nomi ishlatilmaydi. Qulay shakllar:

- "avtopark monitoring platformasi", qisqa - "avtopark platformasi";
- "bu misoldagi platforma", "o'quv misolimiz";
- komponentlar o'z nomi bilan: "dispetcher paneli", "telemetriya qabul qiluvchi servis", "haydovchi ilovasi".

## Qoidalar

- Barcha yuklama parametrlari (qurilmalar soni, yuborish chastotasi, mijozlar soni) **masala sharti** sifatida beriladi: "Masala sharti: avtoparkda 10 000 qurilma...". Ular hech qanday real kompaniyaning ko'rsatkichi sifatida berilmaydi.
- Real dunyo faktlari (tracker protokoli, datchik xususiyati, kamera bitrate) manba bilan beriladi, `verification-pass.md` qoidalari bo'yicha.
- Real kompaniya, mijoz yoki shaxs nomlari ishlatilmaydi. Mahalliy kontekst (O'zbekiston qonunchiligi, Telegram, mahalliy to'lov tizimlari) mavzuga tegishli bo'lsa, umumiy fakt sifatida qoladi.
