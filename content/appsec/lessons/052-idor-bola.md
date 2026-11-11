---
n: 52
slug: idor-bola
title: "IDOR va object-level authorization"
summary: "Mijoz yuborgan identifikator orqali begona obyektga kirish (IDOR, API Top 10 da BOLA), nega ID'ni tasodifiy qilish yechim emasligi, ichma-ich obyektlar va ommaviy so'rovlardagi tuzoqlar hamda egalikni so'rovning o'ziga kiritish usuli."
duration: 45
sources:
  - id: t10-a01
    note: "A01:2025 Broken Access Control: umumiy zaifliklar ro'yxatida unikal identifikator berib begona akkauntni ko'rish yoki tahrirlash (IDOR) va 1-stsenariy (acct parametri)"
  - id: api-top10
    note: "API1:2023 Broken Object Level Authorization: tavsif, exploitability Easy, prevalence Widespread, server mijoz holatini kuzatmagani uchun ID'larga tayanishi"
  - id: cs-authz
    note: "Authorization Cheat Sheet: 'Ensure Lookup IDs are Not Accessible Even When Guessed' bo'limi, CWE-639, ID'ni yashirish yetarli emasligi va har so'rovda aniq obyekt uchun tekshiruv"
  - id: cs-idor
    note: "IDOR Prevention Cheat Sheet: IDOR'ning uch tarkibiy qismi (obyekt, havola, yetishmayotgan tekshiruv), murakkab identifikator defense in depth ekani, foydalanuvchiga tegishli to'plamdan qidirish, mavjudligi maxfiy bo'lsa ikki holatga bir xil javob, ikki akkaunt bilan tekshirish"
  - id: prisma-undefined
    note: "Prisma 'Null and undefined': undefined qiymat yaratilgan so'rovga kiritilmaydi ('do nothing'), strictUndefinedChecks preview xususiyati va Prisma.skip"
  - id: asvs
    note: "ASVS 5.0.0, V8.2.2: ma'lumotga xos kirish aniq ruxsati bor iste'molchilarga cheklanadi (IDOR va BOLA'ni yopish uchun, 1-daraja); V8.3.1: tekshiruv ishonchli servis qatlamida"
quiz:
  - q: "Endpoint `GET /trips/:id` sessiyadagi foydalanuvchi autentifikatsiyadan o'tganini tekshiradi, keyin `db.trips.get(id)` ni qaytaradi. Bu zaiflik qaysi nom bilan ataladi va nima yetishmaydi?"
    options:
      - "Broken Authentication; parol tekshiruvi yetishmaydi"
      - "BOLA/IDOR; aynan shu obyekt foydalanuvchiga tegishli ekanini tekshirish yetishmaydi"
      - "Mass assignment; maydonlar allowlist'i yetishmaydi"
      - "SSRF; ichki manzillar cheklovi yetishmaydi"
    answer: 1
    explain: "Foydalanuvchi kimligi tasdiqlangan, lekin so'ralgan obyekt unga tegishli emasligi tekshirilmaydi: bu object-level authorization buzilishi. Boshqa variantlar boshqa zaiflik turlari."
  - q: "Jamoa trip ID'larini ketma-ket sonlardan UUIDv4 ga almashtirdi va shu bilan IDOR hal bo'ldi deb hisobladi. Cheat sheet nuqtai nazaridan bu qanday baholanadi?"
    options:
      - "To'g'ri: UUID'ni topib bo'lmaydi, shuning uchun tekshiruv kerak emas"
      - "To'g'ri, lekin faqat UUIDv1 bilan"
      - "Yetarli emas: ID'ni maskalash/tasodifiylashtirish qo'shimcha qatlam, egalik tekshiruvi o'rnini bosmaydi"
      - "Noto'g'ri: UUID'lar ketma-ket sondan kamroq xavfsiz"
    answer: 2
    explain: "Cheat sheet ID'ni maskalash usullari odatda o'zi yetarli emasligini va e'tibor obyektga kirishni nazorat qilishga qaratilishi kerakligini yozadi. UUID oshkor bo'lgan zahoti (log, havola, boshqa API javobi) himoya yo'qoladi. UUID'ni 'kamroq xavfsiz' deyish ham noto'g'ri: u tekshiruvsiz yagona himoya bo'la olmaydi."
  - q: "Quyidagi kod IDOR'dan himoyalanganmi?\n\n```ts\nconst r = await db.reading.findUnique({ where: { id: readingId } });\nif (r.vehicleId !== vehicleId) throw new NotFoundException();\nreturn r;\n```\nBu yerda `vehicleId` URL'dan, `readingId` ham URL'dan olinadi va `vehicleId` egaligi avval tekshirilmagan."
    options:
      - "Ha, ota-ona bilan mos kelishi tekshirilgan"
      - "Ha, chunki `findUnique` xavfsiz metod"
      - "Yo'q, lekin faqat `readingId` sonli bo'lsa"
      - "Yo'q: faqat reading URL'dagi mashinaga tegishliligi tekshirilgan, mashinaning o'zi foydalanuvchi tenant'iga tegishliligi tekshirilmagan"
    answer: 3
    explain: "Hujumchi begona mashinaning haqiqiy ID'sini va uning reading ID'sini yuborsa, mos keladi va ma'lumot qaytadi. Zanjirning boshi (tenant -> mashina) tekshirilishi kerak. `findUnique` ORM metodi, u authorization qilmaydi."
  - q: "Ommaviy endpoint `POST /trips/batch` `{ids: [...]}` qabul qiladi va har ID uchun egalikni tekshiradi, lekin begona ID uchun butun so'rovni 403 bilan rad etadi. Yaxshiroq usul qaysi va nega?"
    options:
      - "Begona ID'larni javobdan jimgina tashlab, faqat o'zinikini qaytarish va tekshiruvni so'rovga (where tenant) kiritish"
      - "Har begona ID uchun alohida xato matni qaytarish"
      - "Hamma ID'ni qaytarib, begona qismlarini 'null' bilan belgilash"
      - "Ommaviy endpoint'larni butunlay taqiqlash"
    answer: 0
    explain: "Tenant sharti so'rovning o'zida bo'lsa, begona obyekt xotiraga ham tushmaydi va 'bu ID mavjud, lekin sizniki emas' kabi ma'lumot sizmaydi. Har xil xato matni yoki 'null' belgisi ID mavjudligini oshkor qiladi. Endpoint'ni taqiqlash ortiqcha."
  - q: "OWASP API1:2023 sahifasi nega BOLA keng tarqalganini qanday izohlaydi?"
    options:
      - "API'lar har doim sequential integer ishlatadi"
      - "Server komponenti odatda mijoz holatini to'liq kuzatmaydi va qaysi obyektga kirishni mijoz yuborgan ID'larga qarab hal qiladi"
      - "Ma'lumotlar bazalari authorization'ni qo'llab-quvvatlamaydi"
      - "REST faqat GET so'rovini ishlatadi"
    answer: 1
    explain: "Sahifa ID'lar turli ko'rinishda bo'lishini (butun son, UUID, matn) aytadi, shuning uchun birinchi variant noto'g'ri. Sabab: server mijoz holatini kuzatmasdan, ID parametrlariga tayanadi. Bazalarda row-level security mavjud (56-dars), REST esa PUT/DELETE ham ishlatadi."
  - q: "Ro'yxat endpoint'i `GET /trips?driverId=...` filtri bilan ishlaydi. Qaysi dizayn xavfsizroq?"
    options:
      - "Filtr qiymatini mijozdan olib, hammaga qaytarish"
      - "`driverId` ni majburiy qilish va uni bazaga to'g'ridan-to'g'ri berish"
      - "Tenant (va kerak bo'lsa foydalanuvchi) chegarasi sessiyadan olinib so'rovga qo'shiladi, mijoz filtri faqat shu chegara ichida ishlaydi"
      - "Faqat frontend filtr qo'yadi"
    answer: 2
    explain: "Chegara ishonchli manbadan (sessiya/token) keladi, mijoz yuborgan filtr uni faqat toraytiradi, kengaytira olmaydi. Mijoz filtriga tayanish yoki frontend filtri nazorat bo'lmaydi."
task:
  title: "Ommaviy trip so'rovi: egalikni so'rovga kiritish"
  prompt: |
    `getTrips(user, ids)` mijoz yuborgan ID'lar bo'yicha safarlarni qaytaradi. Hozir u begona tenant'ning safarlarini ham qaytaradi va har safarning `readings` (telemetriya yozuvlari) ro'yxatini tekshiruvsiz biriktiradi.

    Tuzating:

    1. Faqat `user.tenant` ga tegishli safarlar qaytsin; begona va mavjud bo'lmagan ID'lar javobda bir xil ko'rinsin (ikkalasi ham tashlab yuboriladi).
    2. Takroriy ID'lar bir marta qaytsin.
    3. `readings` faqat shu safarning o'z yozuvlaridan iborat bo'lsin (yozuvning `tripId` si safar bilan mos).
    4. Imzoni o'zgartirmang. Oxirgi `console.log`lar kutilgan natijani chiqarsin: 2, 0, 1, 2.
  lang: ts
  starter: |
    type Trip = { id: string; tenant: string; driver: string };
    type Reading = { id: string; tripId: string; fuel: number };

    const trips: Trip[] = [
      { id: "t1", tenant: "alfa", driver: "Aziz" },
      { id: "t2", tenant: "alfa", driver: "Bobur" },
      { id: "t3", tenant: "beta", driver: "Dilshod" },
    ];
    const readings: Reading[] = [
      { id: "r1", tripId: "t1", fuel: 60 },
      { id: "r2", tripId: "t1", fuel: 58 },
      { id: "r3", tripId: "t3", fuel: 40 },
    ];

    function getTrips(user: { tenant: string }, ids: string[]) {
      return ids
        .map((id) => trips.find((t) => t.id === id))
        .filter((t): t is Trip => Boolean(t))
        .map((t) => ({ ...t, readings: readings }));
    }

    const alfa = { tenant: "alfa" };
    console.log("o'z safarlari:", getTrips(alfa, ["t1", "t2"]).length);
    console.log("begona va yo'q ID:", getTrips(alfa, ["t3", "t999"]).length);
    console.log("takror ID:", getTrips(alfa, ["t1", "t1"]).length);
    console.log("t1 yozuvlari:", getTrips(alfa, ["t1"])[0]?.readings.length);
  solution: |
    type Trip = { id: string; tenant: string; driver: string };
    type Reading = { id: string; tripId: string; fuel: number };

    const trips: Trip[] = [
      { id: "t1", tenant: "alfa", driver: "Aziz" },
      { id: "t2", tenant: "alfa", driver: "Bobur" },
      { id: "t3", tenant: "beta", driver: "Dilshod" },
    ];
    const readings: Reading[] = [
      { id: "r1", tripId: "t1", fuel: 60 },
      { id: "r2", tripId: "t1", fuel: 58 },
      { id: "r3", tripId: "t3", fuel: 40 },
    ];

    function getTrips(user: { tenant: string }, ids: string[]) {
      const wanted = new Set(ids);
      return trips
        .filter((t) => t.tenant === user.tenant && wanted.has(t.id))
        .map((t) => ({ ...t, readings: readings.filter((r) => r.tripId === t.id) }));
    }

    const alfa = { tenant: "alfa" };
    console.log("o'z safarlari:", getTrips(alfa, ["t1", "t2"]).length);
    console.log("begona va yo'q ID:", getTrips(alfa, ["t3", "t999"]).length);
    console.log("takror ID:", getTrips(alfa, ["t1", "t1"]).length);
    console.log("t1 yozuvlari:", getTrips(alfa, ["t1"])[0]?.readings.length);
  solutionNotes: |
    - Tenant sharti `filter` ichida, ID shartiga `&&` bilan bog'langan: begona obyekt natijaga umuman tushmaydi. "Avval ol, keyin tekshir" ketma-ketligi yo'q.
    - Begona va mavjud bo'lmagan ID bir xil ko'rinadi (ikkalasi ham tashlanadi), shuning uchun ID mavjudligi haqida ma'lumot sizmaydi.
    - `Set` takroriy ID'larni birlashtiradi, shuning uchun bir obyekt ikki marta qaytmaydi.
    - Ichma-ich obyekt (`readings`) ham o'z ota-onasi bilan bog'lanadi: `tripId` mosligi tekshiriladi. Boshlang'ich kod hamma yozuvni biriktirib, begona tenant yozuvini ham sizdirgan edi.
    - Qoplanmagan: yozish amallari (PUT/DELETE) uchun xuddi shunday tekshiruv alohida kerak, funksiya darajasidagi huquq (53-dars) va xossa darajasi (54-dars) ham alohida.
  checklist:
    - "Begona tenant safari natijada yo'q"
    - "Begona va mavjud bo'lmagan ID bir xil muomala qilinadi"
    - "Takroriy ID natijani ko'paytirmaydi"
    - "`readings` faqat shu safarning o'z yozuvlari"
---

## Muammo

Avtopark platformasida eng ko'p chaqiriladigan endpoint'lar ID qabul qiladi: `GET /vehicles/:id`, `GET /trips/:id/readings`, `PATCH /drivers/:id`, `DELETE /geofences/:id`. Dasturchi uchun ID oddiy parametr, lekin hujumchi uchun u dastak. Foydalanuvchi o'z mashinasining havolasini ochadi, manzildagi `1042` ni `1043` ga o'zgartiradi va boshqa kompaniyaning mashinasini ko'radi. Bu hujum uchun brauzer manzil qatori yetarli.

A01:2025 sahifasi bu holatni umumiy zaifliklar ro'yxatiga kiritgan: unikal identifikatorni berib begona akkauntni ko'rish yoki tahrirlash (insecure direct object references). Sahifaning 1-stsenariyida ilova `acct` parametrini SQL so'rovga tekshiruvsiz beradi, hujumchi esa parametrni o'zgartirib istalgan akkaunt raqamini yuboradi. API Security Top 10 (2023) esa xuddi shu zaiflikni API1:2023 Broken Object Level Authorization (BOLA) nomi bilan birinchi o'ringa qo'ygan. Nomlar farq qiladi, mohiyat bitta: foydalanuvchi qaysi obyektni so'rayotgani uning o'z qo'lida, server esa shu obyekt unga tegishli ekanini tekshirmaydi.

ASVS 5.0.0 bu talabni to'g'ridan-to'g'ri yozgan: 8.2.2 (1-daraja) ilova ma'lumotga xos kirishni aniq data item'larga ruxsati bor iste'molchilarga cheklashini, IDOR va BOLA'ni yopish maqsadida, talab qiladi. 8.3.1 esa tekshiruv ishonchli servis qatlamida bo'lishini, mijoz boshqaradigan nazoratga tayanmasligini aytadi.

API1 sahifasi uchta baho beradi: exploitability Easy, prevalence Widespread, detectability Easy. Sabab sahifada yozilgan: server komponenti odatda mijozning holatini to'liq kuzatmaydi va qaysi obyektga murojaat qilishni hal qilish uchun mijoz yuboradigan ID kabi parametrlarga tayanadi. ID butun son, UUID yoki matn bo'lishi mumkin; u so'rov manzilida (path, query), header'da yoki tanada turadi va uni topish oson. Hujumchi javobdan bu endpoint ishlaganini ko'rib turadi.

## Asosiy g'oya

API1 sahifasining asosiy qoidasi: obyekt darajasidagi authorization tekshiruvi foydalanuvchidan kelgan ID bilan ma'lumot manbaiga murojaat qiladigan har funksiyada ko'rib chiqilishi kerak. Qoida "endpoint darajasida" emas, "funksiya darajasida" va aynan "ID bilan ma'lumot oladigan" funksiyada. Kontroller `@UseGuards(AuthGuard)` bilan himoyalangan bo'lishi bu qoidani bajarmaydi: guard foydalanuvchini tanishi mumkin, lekin so'ralayotgan obyekt kimniki ekanini u bilmaydi.

Authorization Cheat Sheet bu zaiflikka alohida bo'lim bag'ishlagan. U zaiflikni CWE-639 (Authorization Bypass Through User-Controlled Key) deb ataydi va IDOR shakli deb tushuntiradi. Oqibati: authorization'ni chetlab o'tish, gorizontal privilege escalation (boshqa foydalanuvchi resursiga kirish), kamroq hollarda vertikal. Cheat sheet tavsiya qilgan uch yechim:

1. Imkon bo'lsa ID'ni foydalanuvchiga oshkor qilmaslik. Masalan, akkaunt tafsilotlarini so'ralayotgan ID bo'yicha emas, joriy autentifikatsiyalangan foydalanuvchi identifikatori bo'yicha olish (xavfsiz JWT yoki server tomondagi sessiya orqali).
2. Foydalanuvchi yoki sessiyaga xos bilvosita havolalardan (indirect reference) foydalanish. Cheat sheet bunga misol qilib OWASP ESAPI'ni keltiradi.
3. Aniq obyekt yoki funksiyaga kirishda har so'rovda access control tekshiruvi. Cheat sheet muhim izoh qo'shadi: foydalanuvchi ma'lum turdagi bitta obyektga kira olishi uning shu turdagi hamma obyektga kira olishini bildirmaydi.

Cheat sheet yana bir fikrni ochiq aytadi: ID'ni maskalash yoki tasodifiy qilish usullari mavjud, lekin odatda bu o'zi yetarli emas. Obscurity yechim emas; e'tibor ostidagi obyektlarga va identifikatorlarga kirishni nazorat qilishga qaratilishi kerak.

### IDOR'ning uch tarkibiy qismi

Alohida IDOR Prevention Cheat Sheet zaiflikni uchta tarkibiy qismga ajratadi: obyekt (akkaunt, hujjat, tiket, tranzaksiya), shu obyektga havola (ID, UUID, akkaunt raqami, token yoki slug) va obyekt darajasidagi authorization tekshiruvining yo'qligi. Uchtadan bittasini olib tashlasangiz zaiflik yo'qoladi, lekin amalda faqat uchinchisini boshqara olasiz: obyektlar va havolalar mahsulotning mohiyati. Havola faqat raqam emas: cheat sheet fayl nomini ham (`/documents/annual-report.pdf`) obyekt havolasi deb ko'rsatadi, hidden form maydonini ham (`user_id`). Mijoz nazorat qiladigan har qiymat havola bo'lishi mumkin.

### Sessiya ID'sini solishtirish yetarli emas

API1 sahifasi muhim ogohlantirish beradi: joriy sessiyadagi foydalanuvchi ID'sini (masalan JWT'dan olib) zaif ID parametri bilan solishtirish BOLA'ni hal qilmaydi, bu yondashuv faqat kichik bir qism holatni qoplaydi. Sabab: obyektlar ko'pincha foydalanuvchiga emas, tenant, loyiha yoki boshqa obyektga tegishli (mashina kompaniyaga, o'qish safarga, safar mashinaga). `req.user.id === params.userId` kabi tekshiruv faqat "profilim" endpoint'ini yopadi, `GET /vehicles/:id` ni emas. Shuning uchun egalik tekshiruvi aniq obyektning o'zini siyosatga qarshi o'lchashi kerak.

### BOLA va BFLA farqi

API1 sahifasi ikki zaiflikni chegaralaydi. BOLA'da foydalanuvchi endpoint'ga dizayn bo'yicha kira oladi, buzilish obyekt darajasida, ID o'zgartirilganda sodir bo'ladi. Agar hujumchi umuman kirmasligi kerak bo'lgan endpoint yoki funksiyaga kirsa, bu Broken Function Level Authorization (BFLA), BOLA emas. Bu farq tekshiruvni qayerga qo'yishni belgilaydi: BFLA'ni endpoint/rol darajasida (53-dars), BOLA'ni esa har ID bilan ma'lumot olish nuqtasida yopasiz.

## Chuqurroq: IDOR qayerlarda yashiringan

### ID'lar qaerda uchraydi

Ko'p dasturchi IDOR'ni faqat path parametri deb tasavvur qiladi, lekin ID har joyda uchraydi. API1 sahifasi buni aniq aytadi: request target (path yoki query), header, hatto payload ichida. Misollar:

- Path: `/vehicles/42`. Query: `/readings?vehicleId=42`.
- Tana: `POST /alerts { "vehicleId": 42, "threshold": 10 }`. Hujumchi o'z mashinasi uchun signal yaratish o'rniga begona mashina ID'sini yuboradi.
- Munosabat maydoni: yangi geofence yaratishda `groupId`, `ownerId`.
- Header: `X-Tenant-Id` kabi qo'lda yozilgan header'lar, agar ilova ularga ishonsa.

Qoida bir xil: mijozdan kelgan har identifikator qidiruv kalitidir va natija chegaralanishi kerak.

### Yozish amallari

Eng ko'p e'tibor `GET` ga beriladi, lekin o'qish bilan yozish farqli oqibat beradi: begona ma'lumotni ko'rish maxfiylikni, o'zgartirish yaxlitlikni, o'chirish mavjudlikni buzadi (1-dars). A01 sahifasi alohida eslatadi: POST, PUT va DELETE uchun access control yo'q API ham zaif ro'yxatda. `PATCH /vehicles/:id` va `DELETE /geofences/:id` uchun tekshiruv `GET` bilan bir xil mantiqdan o'tishi kerak, aks holda ular unutilgan yo'l bo'ladi.

### Ichma-ich obyektlar

`GET /vehicles/:vid/readings/:rid` kabi endpoint'da zanjir uzun: tenant -> mashina -> yozuv. Eng keng tarqalgan xato zanjirning faqat bir bo'g'inini tekshirish: masalan, yozuvning URL'dagi mashinaga mosligini tekshirib, mashinaning o'zi foydalanuvchi tenant'iga tegishliligini tekshirmaslik. Hujumchi begona mashinaning haqiqiy ID'sini va uning yozuv ID'sini yuborsa, "ota-ona mos" tekshiruvi o'tadi. To'g'ri yo'l: chegarani eng yuqori bo'g'indan (tenant) beriladigan so'rovga qo'shish yoki har bo'g'inni tekshirish.

### Ro'yxat va ommaviy so'rovlar

Alohida obyekt endpoint'i himoyalangan, lekin `GET /trips?ids=1,2,3` yoki `POST /trips/batch` himoyasiz bo'lgan ilovalar ko'p. Ro'yxat endpoint'ida tenant chegarasi sessiyadan olinib so'rovga qo'shiladi, mijoz filtri esa faqat shu chegara ichida ishlaydi. Ommaviy so'rovda begona ID uchun alohida xato qaytarish ID mavjudligini oshkor qiladi. Bu yerda ham GraphQL'dagi alias va batch (76-dars) bir so'rovda ko'p obyektga murojaat qilishga imkon beradi.

### 403 yoki 404

Begona obyekt uchun qaysi javob? IDOR Prevention Cheat Sheet buni aniq yozadi: obyektni olgandan keyin egalikni tekshirish usuli "yo'q" va "ruxsat yo'q" holatlarini ajrata oladi; agar resursning mavjudligi o'zi maxfiy bo'lsa, foydalanuvchiga tegishli to'plamdan qidirish ishlatilsin va ikkala holat bir xil ommaviy javobga (404 Not Found) keltirilsin. Misol sifatida `GET /user/john@example.com` mavjudligi ruxsati bo'lmagan chaqiruvchiga oshkor bo'lmasligi kerakligi keltirilgan. Mashina kabi boshqa mijoz obyekti shu toifaga kiradi. Ruxsat berilgan tenant ichida amal taqiqlangan holda (o'z tenant'ingizdagi mashinani o'chirishga huquq yo'q) 403 qulayroq: bu yerda mavjudlik sir emas. Javob vaqti va xabar matni orasidagi farq ham mavjudlikni oshkor qilmasligi kerak (bu so'nggi fikr muallifning tavsiyasi, cheat sheet'da aniq yozilmagan).

### UUID va tasodifiy ID

API1 sahifasi o'zi ham yozuv ID'lari uchun tasodifiy, oldindan aytib bo'lmaydigan GUID'larni afzal ko'rishni tavsiya etadi, IDOR Prevention Cheat Sheet esa ketma-ket raqamli ID'larni tasodifiy qiymat bilan almashtirishni defense in depth chorasi deb ataydi (qo'shimcha ustun yoki UUID primary key). Bu haqiqiy foyda: ketma-ket `1, 2, 3` ni avtomatlashtirish juda oson. Lekin ID havola, log, brauzer tarixi, ekran rasmi yoki boshqa API javobi orqali oshkor bo'lishi mumkin. Cheat sheet buni to'g'ridan-to'g'ri aytadi: murakkab identifikator bilan ham egalik tekshiruvi shart, chunki hujumchi ruxsatsiz obyekt havolasini qo'lga kiritsa, ilova baribir uni to'sishi kerak. Yana bir amaliy ogohlantirish: identifikatorni "shifrlab" berish usulidan qoching, chunki buni xavfsiz bajarish qiyin (61-dars). Shuning uchun tasodifiy ID qo'shimcha qatlam, tekshiruv o'rnini bosmaydi.

### Tekshirishning ishonchli usuli: ikki akkaunt

IDOR kodni o'qib topilmasa ham, sinash orqali ishonchli topiladi. Cheat sheet usulni beradi: ikki foydalanuvchi (A va B) yarating, har biriga obyektlar (hujjat, tiket, hisob-faktura) oching, A sifatida kirib so'rovlardagi havolalarni B obyektlariga almashtiring va rad etilishini tekshiring. Bu tekshiruv ID taxmin qilinadigan yoki qilinmaydigan bo'lishidan qat'i nazar o'tishi kerak va hamma amalga qo'llanadi: o'qish, yaratish, yangilash, o'chirish, eksport va administrativ amallar. API1 sahifasi ham testlar yozish va ular o'tmasa o'zgarishni deploy qilmaslikni tavsiya etadi. NestJS loyihada bu e2e test: alfa tokeni bilan beta obyektining ID'sini so'rab, 404 kutiladi, va shu test har yangi endpoint uchun nusxalanadi.

## Misol: safar ma'lumotlari

Misol uchun, in-memory baza va ikkita tenant. Server HTTP o'rniga oddiy funksiya, chunki mexanizm transportga bog'liq emas.

### 1. Zaif kod

```ts run
type Trip = { id: number; tenant: string; driver: string; route: string };

const trips = new Map<number, Trip>([
  [1001, { id: 1001, tenant: "alfa", driver: "Aziz", route: "Toshkent - Samarqand" }],
  [1002, { id: 1002, tenant: "alfa", driver: "Bobur", route: "Toshkent - Buxoro" }],
  [1003, { id: 1003, tenant: "beta", driver: "Dilshod", route: "Andijon - Namangan" }],
  [1004, { id: 1004, tenant: "beta", driver: "Erkin", route: "Farg'ona - Qo'qon" }],
]);

// ZAIF: foydalanuvchi autentifikatsiyalangan, lekin trip uniki ekani tekshirilmaydi
function getTripWeak(user: { tenant: string }, id: number): Trip | undefined {
  return trips.get(id);
}

const alfa = { tenant: "alfa" };
console.log("o'z safari:", getTripWeak(alfa, 1001)?.route);
```

```text
o'z safari: Toshkent - Samarqand
```

### 2. Hujum

Alfa foydalanuvchisi o'z safarining `1001` ID'sini ko'radi va qo'shni sonlarni sinab ko'radi. ID ketma-ket bo'lgani uchun sanash oson:

```ts run
type Trip = { id: number; tenant: string; driver: string; route: string };
const trips = new Map<number, Trip>([
  [1001, { id: 1001, tenant: "alfa", driver: "Aziz", route: "Toshkent - Samarqand" }],
  [1002, { id: 1002, tenant: "alfa", driver: "Bobur", route: "Toshkent - Buxoro" }],
  [1003, { id: 1003, tenant: "beta", driver: "Dilshod", route: "Andijon - Namangan" }],
  [1004, { id: 1004, tenant: "beta", driver: "Erkin", route: "Farg'ona - Qo'qon" }],
]);
const getTripWeak = (_u: { tenant: string }, id: number) => trips.get(id);

const alfa = { tenant: "alfa" };
for (let id = 1001; id <= 1005; id++) {
  const t = getTripWeak(alfa, id);
  console.log(id, t ? `${t.tenant}: ${t.driver}, ${t.route}` : "yo'q");
}
```

```text
1001 alfa: Aziz, Toshkent - Samarqand
1002 alfa: Bobur, Toshkent - Buxoro
1003 beta: Dilshod, Andijon - Namangan
1004 beta: Erkin, Farg'ona - Qo'qon
1005 yo'q
```

Alfa foydalanuvchisi beta kompaniyasining haydovchilari ismlarini va marshrutlarini oldi (`1003`, `1004`). Hujum faqat shu darsning o'quv xaritasiga qarshi, lekin real API'da ham sxema xuddi shunday: bitta tsikl va javob kodiga qarab ajratish.

### 3. Tuzatilgan kod

Tekshiruv alohida qadam emas, qidiruv shartining bir qismi. Begona va mavjud bo'lmagan ID bir xil javob oladi:

```ts run
type Trip = { id: number; tenant: string; driver: string; route: string };

const trips = new Map<number, Trip>([
  [1001, { id: 1001, tenant: "alfa", driver: "Aziz", route: "Toshkent - Samarqand" }],
  [1002, { id: 1002, tenant: "alfa", driver: "Bobur", route: "Toshkent - Buxoro" }],
  [1003, { id: 1003, tenant: "beta", driver: "Dilshod", route: "Andijon - Namangan" }],
  [1004, { id: 1004, tenant: "beta", driver: "Erkin", route: "Farg'ona - Qo'qon" }],
]);

function getTrip(user: { tenant: string }, id: number): Trip | null {
  const t = trips.get(id);
  return t && t.tenant === user.tenant ? t : null;
}

const alfa = { tenant: "alfa" };
for (let id = 1001; id <= 1005; id++) {
  console.log(id, getTrip(alfa, id)?.route ?? "topilmadi");
}
```

```text
1001 Toshkent - Samarqand
1002 Toshkent - Buxoro
1003 topilmadi
1004 topilmadi
1005 topilmadi
```

### Tuzatish nima uchun yetarli

Endi funksiya tenant tengligini har chaqirishda tekshiradi, `1003`, `1004` (begona) va `1005` (mavjud emas) bir xil "topilmadi" beradi, shuning uchun hujumchi sanash orqali begona ID'larni ajrata olmaydi. Bu faqat ko'rsatilgan sanash hujumini yopadi. Qoldiq risk: (1) `user.tenant` ishonchli manbadan kelishi kerak (46-47-darslar), (2) boshqa funksiyalar (ro'yxat, ommaviy, yozish) ham shu usulni ishlatishi shart, aks holda bittasi zaif qoladi, (3) ichki xodim yoki bir tenant ichidagi rollar farqi (haydovchi faqat o'z safarini ko'rishi) bu tekshiruvga kirmaydi, ular 51-darsdagi qaror funksiyasi bilan hal qilinadi.

### Mashq: invoice egaligi

Quyidagi funksiya hisob-fakturani ID bo'yicha qaytaradi, lekin egalikni tekshirmaydi. Testlar uchta narsani talab qiladi: o'z hisob-fakturasi qaytadi, begona hisob-faktura `null` beradi, va mavjud bo'lmagan ID bilan begona ID ayirib bo'lmaydigan javob oladi.

```ts run
const invoices = new Map([
  ["i1", { id: "i1", tenant: "alfa", total: 120 }],
  ["i2", { id: "i2", tenant: "beta", total: 90 }],
]);

function getInvoice(tenant: string, id: string) {
  return invoices.get(id) ?? null;
}
```

```ts test
check("o'z hisob-fakturasi qaytadi", () => getInvoice("alfa", "i1")?.total === 120);
check("begona tenant uchun null", () => getInvoice("alfa", "i2") === null);
check("begona va yo'q ID bir xil javob beradi", () => getInvoice("alfa", "i2") === getInvoice("alfa", "i999"));
check("bo'sh ID null beradi", () => getInvoice("alfa", "") === null);
```

## Qachon qo'llamaslik kerak

Egalik tekshiruvi har joyda kerak emas.

- Ommaviy resurslar. Hammaga ochiq ma'lumot (ommaviy hisobot, e'lon qilingan yangilik) uchun egalik tekshiruvi ma'nosiz. Cheat sheet ham autentifikatsiyasiz ruxsatli ommaviy resurslar borligini aytadi. Shunga qaramay, nima ommaviy ekanini aniq ro'yxat bilan belgilang, standart rad bo'lsin.
- Tekshiruvni "bir marta, boshida" qilish yetarli deb o'ylash. Agar chaqiriladigan zanjirda bir nechta ID bo'lsa (tenant, mashina, yozuv), faqat birinchisini tekshirish kam. Aksincha, bir tekshiruvni takror-takror bajarish ham keraksiz: chegarani yuqori bo'g'inda belgilab, pastdagilarni shu chegara ichida qidiring.
- ID'ni yashirish yoki indirect reference'ga ko'chish har doim ham foydali emas. U qo'shimcha xaritalash qatlami, kechikish va xato manbai qo'shadi. Egalik tekshiruvi to'g'ri bo'lsa, ko'p tizimda ichki ID'ni oshkor qilish tahdid emas. Bu muallifning muhandislik baholashi: cheat sheet bilvosita havolalarni tavsiya etadi, lekin ularning narxini tahlil qilmaydi.
- 404 bilan yashirish hamma holatda to'g'ri emas. Agar foydalanuvchi obyekt mavjudligini qonuniy biladi (masalan, jamoa ichida ulashilgan havola), aniq "ruxsat yo'q" xabari foydalanuvchi uchun tushunarliroq.
- Faqat kod tekshiruviga tayanish. Chuqur himoya sifatida bazaning o'zida ham tenant chegarasini majburlash mumkin (row-level security, 55-56-darslar), chunki bitta unutilgan `where` hamma narsani ochib yuboradi.

## Stack'da: NestJS, Prisma va Kysely

IDOR Prevention Cheat Sheet'dagi asosiy naqsh "foydalanuvchiga tegishli to'plamdan qidirish": `Project.find(id)` o'rniga `current_user.projects.find(id)`. Bu Spring misolida `findByIdAndOwnerId(id, currentUser().getId())` ko'rinishida, Prisma'da `where: { id, tenantId }` ko'rinishida. Qidiruv va egalik bitta so'rov, shuning uchun "ol, keyin tekshir" oralig'ida unutish imkoni yo'q.

Prisma'da egalikni so'rovga kiritishning ishonchli usuli: faqat `id` bilan qidirish o'rniga `findFirst({ where: { id, tenantId } })` yozish. Yozish uchun `updateMany`/`deleteMany` ni tenant sharti bilan ishlatib, `count` ni tekshirish mumkin: nol bo'lsa, obyekt yo'q yoki sizniki emas. Bu kod ishga tushirilmaydi (tashqi modul tiplari yo'q, server/DB kerak).

```ts
import { Controller, Delete, Get, NotFoundException, Param, Req } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
type Req_ = { user: { tenantId: string } };

@Controller("trips")
export class TripsController {
  @Get(":id")
  async one(@Req() req: Req_, @Param("id") id: string) {
    // egalik shart ichida: begona va yo'q obyekt bir xil javob oladi
    const trip = await prisma.trip.findFirst({ where: { id, tenantId: req.user.tenantId } });
    if (!trip) throw new NotFoundException();
    return trip;
  }

  @Delete(":id")
  async remove(@Req() req: Req_, @Param("id") id: string) {
    const res = await prisma.trip.deleteMany({ where: { id, tenantId: req.user.tenantId } });
    if (res.count === 0) throw new NotFoundException(); // yozishda ham xuddi shu chegara
    return { deleted: true };
  }
}
```

Prisma'da bitta xavfli nozik joy bor. Prisma hujjatiga ko'ra `undefined` qiymat yaratilgan so'rovga kiritilmaydi ("do nothing"), `null` esa oddiy qiymat. Demak `where: { id, tenantId: req.user.tenantId }` da `req.user.tenantId` tasodifan `undefined` bo'lib qolsa (token to'ldirilmagan, maydon nomi xato yozilgan), tenant sharti so'rovdan jimgina tushib ketadi va qidiruv faqat `id` bo'yicha ishlaydi: IDOR qaytib keladi. Hujjatning o'zi bu xatti-harakat "kutilmagan natijalar va ma'lumot yo'qolishiga" olib kelishi mumkinligini aytadi va `strictUndefinedChecks` preview xususiyatini yoqishni tavsiya qiladi: shunda aniq `undefined` runtime xatosi beradi, maydonni ataylab o'tkazib yuborish uchun esa `Prisma.skip` ishlatiladi. Bundan tashqari, tenant identifikatorini so'rovga berishdan oldin o'zingiz tekshiring (`if (!tenantId) throw ...`).

Kysely'da ham shu fikr: `.where("tenant_id", "=", tenantId)` har qidiruvning ajralmas qismi bo'lishi kerak. Buni unutmaslik uchun repository qatlami `tenantId` ni konstruktorda oladi va undan tashqarida `where` yozilmaydi (55-dars).

## Xulosa

- IDOR (API Top 10'da BOLA) - mijoz yuborgan identifikator bo'yicha begona obyektga kirish. OWASP A01:2025 va API1:2023 uni eng keng tarqalgan authorization xatolaridan deb tasniflaydi.
- Tekshiruv foydalanuvchidan kelgan ID bilan ma'lumot oladigan har funksiyada kerak, faqat endpoint yoki guard darajasida emas.
- ID'ni tasodifiy qilish (UUID) qo'shimcha qatlam, egalik tekshiruvi o'rnini bosmaydi: ID oshkor bo'lishi mumkin.
- Eng ishonchli shakl: egalik sharti qidiruv so'rovining ichida (`where id AND tenant`), begona va mavjud bo'lmagan ID bir xil javob beradi.
- Ichma-ich obyektlar, ro'yxat, ommaviy va yozish amallari alohida tekshiriladi: zanjirning har bo'g'ini chegara ichida bo'lishi kerak.
