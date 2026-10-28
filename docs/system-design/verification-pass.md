# Tekshiruv bosqichi: taxminlarni yo'qotish

Maqsad: kursda tekshirilmagan da'vo, "deylik" bilan berilgan real dunyo raqami va "xotiradan / tasdiqlanmagan" kabi izohlar qolmasin. Har bir fakt manba bilan, har bir hisob ochiq formulali bo'lsin.

## Hedge turlari va nima qilish kerak

**A. Real dunyo haqidagi fakt taxmin sifatida berilgan** (raqam, versiya, default qiymat, sana, narx, xatti-harakat, muallif, bob raqami, benchmark).
Masalan: "deylik, bitta WebSocket ulanishi 50 KB xotira oladi", "taxminan 2021 yilda", "xotiradan yozildi".
Qilish kerak:
1. Asl manbadan tekshiring (rasmiy hujjat, RFC, maqola, manba kodi, rasmiy benchmark, kompaniya bloggi).
2. Matnni aniq va ishonchli qilib qayta yozing va manbani `## Manbalar` ga qo'shing.
3. Agar raqam sharoitga bog'liq bo'lsa (benchmark, latency, xotira), manbadagi o'lchov sharoiti bilan bering: "Redis rasmiy benchmarkida, pipelining'siz, X ops/s".
4. Agar umuman tekshirib bo'lmasa: da'voni olib tashlang yoki tekshirsa bo'ladigan boshqa fakt bilan almashtiring. Tekshirilmagan narsani "taxminan" deb qoldirmang.

**B. Masala sharti / ssenariy parametri** (o'quv misoli - avtopark platformasi, amaliy topshiriqlar, hisob-kitob uchun boshlang'ich ma'lumot: "10 000 qurilma, har 10 soniyada nuqta").
Bular real fakt emas, masala sharti. "Deylik", "faraz qiling", "taxmin qilaylik" so'zlarini olib tashlang va shartni aniq bering:
- "Hisob uchun shartlar:" ro'yxati yoki jadval ko'rinishida, yoki
- "Masala sharti: avtoparkda 10 000 qurilma, har biri 10 soniyada bitta nuqta yuboradi."
Real kompaniya haqida fakt o'ylab topmang - shart sifatida bering ("misolda", "bu masalada").
Agar shart parametri real dunyo qiymatiga tayansa (masalan, Teltonika AVL record hajmi, GPS nuqtani siqish koeffitsiyenti, kamera bitrate), uni A turi kabi manbadan oling.

**C. Hisob-kitob natijasi** (oldindan berilgan shartlardan hisoblangan son). "Taxminan" faqat yaxlitlash uchun qolishi mumkin ("8.64 GB, ya'ni taxminan 8.6 GB"). Formula ko'rinib tursin.

**D. Meta-izohlar** ("xotiradan", "tasdiqlanmagan", "tekshirilmagan", "manba ochilmadi", "o'z versiyangiz hujjatini tekshiring" kabi). Matndan butunlay olib tashlang. Faktni tekshirib aniq yozing yoki A.4 bo'yicha olib tashlang. Versiyaga bog'liq default bo'lsa - qaysi versiya uchun ekanini aniq yozing.

## Ma'lumot uchun: kitob mundarijalari (tekshirilgan)

Kleppmann, Riccomini. Designing Data-Intensive Applications, 2-nashr (O'Reilly, 2026):
1 Trade-Offs in Data Systems Architecture; 2 Defining Nonfunctional Requirements; 3 Data Models and Query Languages; 4 Storage and Retrieval; 5 Encoding and Evolution; 6 Replication; 7 Sharding; 8 Transactions; 9 The Trouble with Distributed Systems; 10 Consistency and Consensus; 11 Batch Processing; 12 Stream Processing; 13 A Philosophy of Streaming Systems; 14 Doing the Right Thing.

Alex Xu. System Design Interview, 1-jild:
1 Scale From Zero To Millions Of Users; 2 Back-of-the-envelope Estimation; 3 A Framework For System Design Interviews; 4 Design A Rate Limiter; 5 Design Consistent Hashing; 6 Design A Key-value Store; 7 Design A Unique Id Generator In Distributed Systems; 8 Design A Url Shortener; 9 Design A Web Crawler; 10 Design A Notification System; 11 Design A News Feed System; 12 Design A Chat System; 13 Design A Search Autocomplete System; 14 Design Youtube; 15 Design Google Drive; 16 The Learning Continues.

Alex Xu, Sahn Lam. System Design Interview, 2-jild:
1 Proximity Service; 2 Nearby Friends; 3 Google Maps; 4 Distributed Message Queue; 5 Metrics Monitoring; 6 Ad Click Event Aggregation; 7 Hotel Reservation; 8 Distributed Email Service; 9 S3-like Object Storage; 10 Real-time Gaming Leaderboard; 11 Payment System; 12 Digital Wallet; 13 Stock Exchange.

Bob raqamlarini shu ro'yxat bo'yicha to'g'rilang.

## Qidiruv byudjeti

WebSearch umumiy limiti cheklangan (barcha agentlar uchun bitta). Har bir agent uchun **WebSearch 15 tadan oshmasin**. Avval WebFetch bilan to'g'ridan-to'g'ri rasmiy sahifalarni oching: rasmiy hujjat saytlari, GitHub raw fayllar (docs manbalari ko'pincha GitHub'da), datatracker.ietf.org (RFC), arxiv.org, Wikipedia (faqat yordamchi manba sifatida, asosiy emas).
Agar sahifa ochilmasa - boshqa rasmiy nusxasini qidiring (GitHub'dagi docs manbasi, arxiv nusxasi, Internet Archive emas).

## Qo'shimcha talablar

- Darsning hajmi, tuzilmasi va sifati kamaymasin. Faqat aniqroq bo'lsin.
- `docs/lesson-spec.md` dagi barcha qoidalar amal qiladi (em-dash yo'q, mermaid qoidalari, test formati).
- Agar matn o'zgarishi test savoliga ta'sir qilsa - `NNN.quiz.json` ni ham moslang.
- Yakunda o'z modulingiz uchun: `grep -n -i "deylik\|faraz qil\|xotiradan\|tasdiqlanmagan\|tekshirilmagan\|taxmin qil" content/system-design/NNN.md` - natija bo'sh bo'lishi kerak. "taxminan" qolgan har bir joyni ko'rib chiqing: u faqat C turi (yaxlitlash) yoki manbali diapazon bo'lishi kerak.
- Validator: `npm run validate -- system-design FROM TO` (repo ildizidan) - "hammasi joyida" chiqishi kerak.
