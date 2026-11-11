---
n: 54
slug: mass-assignment
title: "Mass assignment va property-level authorization"
summary: "Mijoz tanasini to'g'ridan-to'g'ri obyektga bog'lash (mass assignment) va javobda ortiqcha maydon qaytarish (excessive data exposure) bitta ildizdan: xossa darajasidagi authorization yo'qligi. Yozish va o'qish uchun maydon allowlist'lari, rolga bog'liq ruxsat va sxema bilan javobni cheklash."
duration: 45
sources:
  - id: api-top10
    note: "API3:2023 Broken Object Property Level Authorization: tahdid sxemasi (Exploitability Easy, Prevalence Common, Detectability Easy), 'Is the API Vulnerable' va 'How To Prevent' bo'limlari, uchta stsenariy. 2019 yilgi API3 Excessive Data Exposure va API6 Mass Assignment birlashgani 2023 release notes sahifasida yozilgan"
  - id: t10-a01
    note: "A01:2025 Broken Access Control: elevation of privilege va metadata manipulation bandlari; model darajasida yozuv egaligini majburlash tavsiyasi"
  - id: cs-mass-assignment
    note: "Mass Assignment Cheat Sheet: ta'rif va muqobil nomlar (Mass Assignment, Autobinding, Object injection), exploitability, 2012 yilgi GitHub hodisasi, DTO va allowlist yechimi, denylist yagona himoya bo'lmasligi, DTO/allowlist authorization o'rnini bosmasligi"
  - id: asvs
    note: "ASVS 5.0.0 V8: 8.2.3 (maydon darajasidagi kirish aniq ruxsati bor iste'molchilarga, BOPLA'ni yopish uchun, 2-daraja); 8.1.2 (maydon darajasidagi o'qish va yozish qoidalari hujjatlashtiriladi, obyekt holatiga bog'liq bo'lishi mumkin)"
  - id: nextjs-data-security
    note: "Next.js data security: Data Access Layer xavfsiz minimal DTO qaytaradi (telefon raqami misoli), Server Action to'g'ridan-to'g'ri POST bilan chaqirilishi mumkin, Server Action qaytarish qiymati faqat UI'ga kerakli narsa bo'lishi"
  - id: nestjs-validation
    note: "NestJS Validation: ValidationPipe whitelist (noma'lum xossalarni olib tashlaydi) va forbidNonWhitelisted (xato bilan rad etadi)"
  - id: fastify-validation
    note: "Fastify Validation and Serialization: chiqish sxemasi berilsa javob fast-json-stringify bilan yuboriladi va sezgir ma'lumotning tasodifan oshkor bo'lishining oldini olishga yordam beradi (sahifa sxemada yo'q xossalar taqdirini alohida aytmaydi)"
  - id: class-transformer
    note: "class-transformer README: strategy 'excludeAll' (instanceToPlain) @Expose bilan belgilanmagan xossalarni chiqarmaydi; plainToInstance sukut bo'yicha hamma xossani o'rnatadi, excludeExtraneousValues esa e'lon qilinmagan kalitlarni tashlaydi"
  - id: cs-input
    note: "Input Validation Cheat Sheet: objects uchun ruxsat etilgan va majburiy maydonlar qoidasi, JSON schema'da additional properties'ni aniq sozlash, 'bind only intended input', authorization alohida tekshirilishi"
quiz:
  - q: "Dispetcher `PATCH /vehicles/7` ga `{ \"name\": \"Isuzu\", \"tenantId\": \"beta\" }` yubordi. Server `Object.assign(vehicle, body)` qiladi va saqlaydi. Eng aniq nom va ildiz sababi qaysi?"
    options:
      - "SQL injection: body bazaga yuborilgan"
      - "BOLA: mashina ID'si almashtirilgan"
      - "Mass assignment (API3): mijoz kiritishi to'g'ridan-to'g'ri obyekt xossalariga bog'langan, xossa darajasida authorization yo'q"
      - "CSRF: so'rov boshqa saytdan yuborilgan"
    answer: 2
    explain: "Mashina ID'si to'g'ri, ya'ni obyektga kirish ruxsatli. Muammo ichki xossaga (`tenantId`) yozish huquqi tekshirilmagani. API3 sahifasi aynan shu holatni (2019 yilgi 'Mass Assignment') o'z ichiga oladi."
  - q: "API3:2023 nima uchun ikki eski kategoriyani birlashtirdi?"
    options:
      - "Ikkalasi ham faqat GraphQL'ga tegishli"
      - "Ikkalasi ham SQL injection turlari"
      - "Ikkalasi ham faqat parollarga oid"
      - "Ikkalasining ildizi bitta: obyekt xossasi darajasida authorization yo'q yoki noto'g'ri, bu ma'lumot sizishi yoki ruxsatsiz o'zgartirishga olib keladi"
    answer: 3
    explain: "API Security Top 10 2023 release notes kategoriya 2019 yilgi Excessive Data Exposure va Mass Assignment'ni birlashtirishini va asosiy sabab sifatida xossa darajasidagi authorization yo'qligini ko'rsatadi. Qolgan variantlar manbada yo'q."
  - q: "Quyidagi DTO yondashuvlaridan qaysi biri mass assignment'ni to'g'ri to'sadi?"
    options:
      - "Mijoz yuborgan hamma maydonni qabul qilib, so'ng `tenantId`ni qo'lda o'chirish (denylist)"
      - "Har rol uchun ruxsat etilgan yozish maydonlari ro'yxati (allowlist) va ro'yxatda yo'q maydon kelsa so'rovni rad etish"
      - "Frontend formada ichki maydonlarni ko'rsatmaslik"
      - "Maydon nomlarini murakkablashtirish"
    answer: 1
    explain: "Allowlist ro'yxatda bo'lmagan hamma narsani rad etadi, yangi ichki maydon qo'shilsa ham avtomatik himoyalangan bo'ladi. Denylist yangi maydonni unutadi, frontend yashirishi va nomni murakkablashtirish nazorat emas."
  - q: "Endpoint mashinani `return vehicle` bilan qaytaradi (butun ORM obyekti). Obyektda `deviceKey` va `internalCost` maydonlari bor. API3 sahifasining tavsiyasi nima?"
    options:
      - "Maydonlarni frontendda yashirish"
      - "`to_json()` kabi umumiy metodlardan qochib, qaytariladigan xossalarni aniq tanlash va javob sxemasini majburlash"
      - "Maydon nomlarini qisqartirish"
      - "Hech narsa qilmaslik, chunki foydalanuvchi obyektning egasi"
    answer: 1
    explain: "Sahifa umumiy serializatsiya metodlaridan qochib, faqat kerakli xossalarni tanlab qaytarishni va sxema asosida javobni tekshirishni tavsiya qiladi. Obyektga kirish huquqi uning har xossasini ko'rish huquqini bildirmaydi."
  - q: "JSON schema validatsiyasida `properties` ro'yxatida faqat `name` va `alertThreshold` bor, `additionalProperties` sozlanmagan. Mijoz qo'shimcha `tenantId` yuboradi. Cheat sheet nuqtai nazaridan nima bo'ladi?"
    options:
      - "Ro'yxatda bo'lmagani uchun avtomatik rad etiladi"
      - "Validatsiya ishlamaydi, xato tashlaydi"
      - "Faqat `name` bilan ishlaydi, boshqasi parser tomonidan o'chiriladi"
      - "Qo'shimcha maydon schema bo'yicha o'tib ketadi, chunki xossani ro'yxatga yozish uni majburiy qilmaydi ham, noma'lum maydonlarni rad ham etmaydi"
    answer: 3
    explain: "Cheat sheet buni aniq yozadi: faqat xossani ro'yxatlash uni talab qilmaydi va noma'lum maydonlarni rad etmaydi, additional properties'ni aniq sozlash kerak. Shuning uchun schema bor deb ishonib o'tirmang."
  - q: "Admin `plan` maydonini o'zgartira oladi, dispetcher esa yo'q. Bu qoida qaysi darajaga tegishli?"
    options:
      - "Xossa darajasi (BOPLA): bir xil obyektning ba'zi maydonlari rolga qarab yoziladi"
      - "Obyekt darajasi (BOLA): mashina kimniki"
      - "Funksiya darajasi (BFLA): endpoint kimga ochiq"
      - "Transport darajasi: TLS"
    answer: 0
    explain: "Ikkala rol ham bir obyektga va bir endpoint'ga kira oladi; farq obyektning ayrim xossalarini o'zgartirish huquqida. Bu aynan property-level authorization."
task:
  title: "Rolga bog'liq yozish allowlist'i va javob DTO'si"
  prompt: |
    `update(role, body)` mashina yozuvini yangilaydi, `publicView(x)` esa javobni tayyorlaydi. Hozir `update` mijoz tanasini `Object.assign` bilan to'g'ridan-to'g'ri yozadi, `publicView` esa butun obyektni (qurilma kaliti bilan) qaytaradi.

    Tuzating:

    1. `dispatcher` faqat `name` va `alertThreshold` ni, `admin` esa qo'shimcha `plan` ni yoza oladi. Boshqa rol uchun hech narsa yozilmaydi.
    2. Allowlist'da yo'q maydon bor so'rov butunlay rad etiladi (`ok: false`), qisman yozilmaydi.
    3. `alertThreshold` 0 dan 100 gacha butun son bo'lishi shart, aks holda rad.
    4. `publicView` faqat `id`, `name`, `alertThreshold`, `plan` ni qaytarsin; `deviceKey` va `tenant` chiqmasin.
    5. Imzolarni o'zgartirmang. Kutilgan chiqish: `false alfa`, `true 15`, `false basic`, `true premium`, `false`.
  lang: ts
  starter: |
    type Role = "dispatcher" | "admin";
    type Vehicle = { id: string; tenant: string; name: string; alertThreshold: number; plan: string; deviceKey: string };

    const v: Vehicle = { id: "v1", tenant: "alfa", name: "Isuzu", alertThreshold: 10, plan: "basic", deviceKey: "k-123" };

    function update(role: Role, body: Record<string, unknown>): { ok: boolean } {
      Object.assign(v, body);
      return { ok: true };
    }

    function publicView(x: Vehicle) {
      return x;
    }

    console.log("1", update("dispatcher", { name: "X", tenant: "beta" }).ok, v.tenant);
    console.log("2", update("dispatcher", { alertThreshold: 15 }).ok, v.alertThreshold);
    console.log("3", update("dispatcher", { plan: "premium" }).ok, v.plan);
    console.log("4", update("admin", { plan: "premium" }).ok, v.plan);
    console.log("5", "deviceKey" in publicView(v));
  solution: |
    type Role = "dispatcher" | "admin";
    type Vehicle = { id: string; tenant: string; name: string; alertThreshold: number; plan: string; deviceKey: string };

    const v: Vehicle = { id: "v1", tenant: "alfa", name: "Isuzu", alertThreshold: 10, plan: "basic", deviceKey: "k-123" };

    const WRITABLE: Record<Role, string[]> = {
      dispatcher: ["name", "alertThreshold"],
      admin: ["name", "alertThreshold", "plan"],
    };

    function update(role: Role, body: Record<string, unknown>): { ok: boolean } {
      const allowed = WRITABLE[role] ?? [];
      const keys = Object.keys(body);
      if (keys.some((k) => !allowed.includes(k))) return { ok: false };
      const t = body.alertThreshold;
      if (t !== undefined && !(Number.isInteger(t) && (t as number) >= 0 && (t as number) <= 100)) return { ok: false };
      for (const k of keys) (v as Record<string, unknown>)[k] = body[k];
      return { ok: true };
    }

    function publicView(x: Vehicle) {
      const { id, name, alertThreshold, plan } = x;
      return { id, name, alertThreshold, plan };
    }

    console.log("1", update("dispatcher", { name: "X", tenant: "beta" }).ok, v.tenant);
    console.log("2", update("dispatcher", { alertThreshold: 15 }).ok, v.alertThreshold);
    console.log("3", update("dispatcher", { plan: "premium" }).ok, v.plan);
    console.log("4", update("admin", { plan: "premium" }).ok, v.plan);
    console.log("5", "deviceKey" in publicView(v));
  solutionNotes: |
    - Yozish maydonlari rol bo'yicha ma'lumot sifatida (`WRITABLE`) turadi: yangi ichki maydon qo'shilsa, u avtomatik yopiq, chunki allowlist'da yo'q.
    - Noma'lum maydon kelsa, so'rov butunlay rad etiladi (1-chiqishda `name` ham yozilmadi). Qisman yozish "yarim o'zgargan" holat yaratadi va hujumchiga qaysi maydon qabul qilinganini ko'rsatadi.
    - `Object.keys` faqat o'z xossalarini sanaydi; JSON'dagi `"__proto__"` kalit ham allowlist'ga tushmagani uchun rad etiladi (29-dars).
    - `publicView` aniq maydonlarni tanlaydi (cherry-pick), `...x` yoki umumiy serializatsiya ishlatilmaydi. `deviceKey` va `tenant` hech qachon javobga tushmaydi.
    - Qoplanmagan: 52-darsdagi egalik tekshiruvi (bu mashina ushbu foydalanuvchinikimi) va 53-darsdagi funksiya darajasi alohida; `name` uzunligi va tarkibi ham alohida validatsiya talab qiladi.
  checklist:
    - "Begona maydon (`tenant`, `plan` dispetcher uchun) yozilmaydi va so'rov rad etiladi"
    - "Admin faqat o'ziga ruxsat etilgan `plan` ni o'zgartira oladi"
    - "`alertThreshold` diapazoni tekshiriladi"
    - "Javobda `deviceKey` va `tenant` yo'q"
---

## Muammo

Mashina tahrirlash formasi uchta maydondan iborat: nom, ogohlantirish chegarasi (yoqilg'i darajasi shundan pastga tushsa signal), eslatma. Frontend shu uchtasini yuboradi. Backend dasturchisi vaqtni tejash uchun yozadi:

```ts
Object.assign(vehicle, req.body);
await vehicle.save();
```

Hammasi ishlaydi. Lekin `vehicle` obyektida formada ko'rinmaydigan maydonlar ham bor: `tenantId`, `plan`, `deviceKey`, `blocked`. So'rov tanasini brauzer emas, hujumchi yozadi, va u forma yuborishi shart bo'lmagan maydonni qo'shadi. Natijada dispetcher o'z mashinasini boshqa tenant'ga ko'chiradi, tarif rejasini o'zgartiradi yoki administrator bloklagan mashinani blokdan chiqaradi.

Teskari tomoni: javob. `res.json(vehicle)` ham butun obyektni, jumladan qurilma kalitini, ichki tannarxni va audit maydonlarini mijozga yuboradi. Frontend ularni ko'rsatmaydi, lekin ular tarmoq javobida turibdi.

API Security Top 10 (2023) bu ikki muammoni bitta kategoriyaga birlashtirgan: API3:2023 Broken Object Property Level Authorization. API Security Top 10 2023 release notes sahifasi kategoriya 2019 yilgi API3 Excessive Data Exposure va API6 Mass Assignment'ni birlashtirishini va asosiy sababga qaratilganini aytadi: obyekt xossasi darajasida authorization tekshiruvi yo'q yoki noto'g'ri. Oqibat: ma'lumotning ruxsatsiz shaxsga oshkor bo'lishi yoki o'zgartirilishi. ASVS 5.0.0 da bu 8.2.3 talabi (2-daraja): maydon darajasidagi kirish faqat aniq ruxsati bor iste'molchilarga cheklanadi. 8.1.2 esa bu qoidalar hujjatlashtirilishini talab qiladi va ular obyektning boshqa atributlariga, masalan holat yoki status'ga bog'liq bo'lishi mumkinligini eslatadi: tasdiqlangan buyurtmada `price` o'zgarmaydi, draft'da o'zgaradi.

52-darsda "bu obyekt sizniki" degan savol edi, 53-darsda "bu funksiyani chaqira olasizmi". Bu darsda uchinchi savol: "bu obyektning aynan shu xossasini o'qish yoki o'zgartirish huquqingiz bormi". Uchalasi mustaqil va uchalasi ham kerak.

## Asosiy g'oya

API3 sahifasidagi "Is the API Vulnerable?" bo'limi ikkita holatni ajratadi:

- API endpoint obyektning sezgir hisoblangan va foydalanuvchi o'qimasligi kerak bo'lgan xossalarini oshkor qiladi (avvalgi nomi: Excessive Data Exposure).
- API endpoint foydalanuvchi o'zgartirish, qo'shish yoki o'chirish huquqiga ega bo'lmasligi kerak bo'lgan sezgir xossaning qiymatini o'zgartirishga imkon beradi (avvalgi nomi: Mass Assignment).

Sahifaning uchta stsenariysi mexanizmni ko'rsatadi. Birinchisida foydalanuvchini shikoyat qilish oqimida javob boshqa foydalanuvchining `fullName` va `recentLocation` xossalarini ham qaytaradi, ya'ni ortiqcha ma'lumot. Ikkinchisida mehmonxona egasi bron tasdiqlash so'roviga qonuniy `approved` va `comment` maydonlariga `total_stay_price` ni qo'shadi, server esa uni qabul qiladi va mehmon ko'proq to'laydi. Uchinchisida bloklangan video egasi tavsifni yangilash so'roviga `blocked: false` qo'shib, o'z videosini blokdan chiqaradi. Ikkinchi va uchinchi stsenariyda ikkala foydalanuvchi ham obyektga kirishga haqli (obyekt darajasi to'g'ri), lekin ba'zi xossalarni o'zgartirishga haqli emas.

Sahifaning "How To Prevent" bo'limi to'rt amaliy qoida beradi:

1. Obyektni API orqali qaytarishda foydalanuvchi qaytarilayotgan xossalarga kirishga haqli ekaniga ishonch hosil qiling.
2. `to_json()` va `to_string()` kabi umumiy metodlardan qoching; qaytariladigan xossalarni aniq tanlang.
3. Imkon bo'lsa, mijoz kiritishini avtomatik kod o'zgaruvchilari, ichki obyektlar yoki obyekt xossalariga bog'laydigan funksiyalardan qoching. Faqat mijoz o'zgartirishi kerak bo'lgan xossalarni o'zgartirishga ruxsat bering.
4. Qo'shimcha qatlam sifatida sxema asosida javobni tekshirish mexanizmini joriy qiling, qaytariladigan ma'lumotni minimal darajada, biznes talabiga muvofiq saqlang.

Input Validation Cheat Sheet ham shu yo'nalishda: obyektlar uchun ruxsat etilgan va majburiy maydonlar, shuningdek yo'q yoki `null` qiymatlar qoidalari belgilanadi, "faqat mo'ljallangan kirishni bog'lang" (bind only intended input) degan tamoyil beriladi. Cheat sheet authorization'ni validatsiyadan alohida ko'radi: yaroqli akkaunt identifikatori chaqiruvchining u akkauntga kirishga haqli ekanini bildirmaydi.

### API3 tahdid sxemasi va Mass Assignment Cheat Sheet

API3 sahifasi baholari: exploitability Easy, prevalence Common, detectability Easy, texnik oqibat Moderate. Sahifaga ko'ra API'lar odatda obyektning hamma xossasini qaytaradigan endpoint'larni ochadi, REST'da bu ayniqsa to'g'ri; GraphQL kabi protokollarda esa qaytariladigan xossalarni so'rovda ko'rsatish kerak, shuning uchun maxsus tayyorlangan so'rov talab qilinishi mumkin. Sezgir ma'lumotni topish uchun javoblarni ko'rib chiqish yetarli. Yashirin (hujjatlashtirilmagan) xossalarni topish uchun fuzzing ishlatiladi; xossa o'zgartirilishi mumkinmi, bu so'rov tuzib javobni tahlil qilish masalasi, javobda ko'rinmagan xossa uchun esa yon ta'sir (side-effect) tahlili kerak bo'lishi mumkin. Oqibat: ma'lumot oshkor bo'lishi, yo'qolishi yoki buzilishi, ba'zi hollarda privilege escalation yoki akkauntni to'liq egallash.

Mass Assignment Cheat Sheet bu zaiflikni umumiy tilda ta'riflaydi: freymvork HTTP so'rov parametrlarini dastur o'zgaruvchilari yoki obyektlariga avtomatik bog'lashi mumkin; hujumchi dasturchi mo'ljallamagan yangi parametr yaratib, kodda mo'ljallanmagan o'zgaruvchi yoki obyektni yaratadi yoki ustidan yozadi. Muqobil nomlar: Mass Assignment (Ruby on Rails, NodeJS), Autobinding (Spring MVC, ASP.NET MVC), Object injection (PHP). Cheat sheet'dagi klassik misol: ro'yxatdan o'tish formasi `userid`, `password`, `email` yuboradi, tanaga `isAdmin=true` qo'shilsa va model shu maydonni bog'lasa, hujumchi admin bo'ladi. Real hodisa ham keltirilgan: 2012 yilda GitHub mass assignment orqali buzilgan, foydalanuvchi o'zining public key'ini istalgan tashkilotga yuklay olgan va keyin shu tashkilot repozitoriylarini o'zgartirgan.

Cheat sheet'dagi muhim aniqlashlar: (1) hujumchiga manba kodiga kirish shart emas, maydon nomlari taxmin qilinishi yoki topilishi mumkin; (2) bo'sh konstruktor umumiy shart emas, shuning uchun "bizda setter yo'q" degan fikr ishonchli emas; ichki (nested) obyektlar ham ko'rib chiqilishi kerak; (3) DTO va allowlist yozilishi mumkin bo'lgan xossalarni cheklaydi, lekin so'ralayotgan obyekt va amal uchun authorization o'rnini bosmaydi. Uchinchi band 52-53-darslar bilan bog'laydi: allowlist ichidagi maydon ham begona obyektga yozilishi mumkin.

## Chuqurroq: allowlist, ko'p qatlam va nozik joylar

### Denylist ishlamaydi

Birinchi o'ylanadigan yechim: "tenantId, plan, blocked maydonlarni o'chiramiz". Bu denylist. Muammo: ro'yxat bugungi maydonlar uchun yoziladi. Ertaga jamoa `billingStatus` yoki `isVerified` qo'shadi, denylistni yangilashni unutadi va zaiflik tayyor. Allowlist teskari ishlaydi: yozish mumkin bo'lgan maydonlar sanab chiqiladi, qolgani rad etiladi. Input Validation Cheat Sheet umumiy qoidada buni aytadi: ilova qabul qiladigan narsani belgilang va qoidadan tashqarini rad eting, har xavfli qiymatni tanishga urinmang. Mass Assignment Cheat Sheet esa aniqroq: block-list yagona himoya bo'lmasin, chunki yangi yoki e'tibordan chetda qolgan sezgir maydon bog'lanadigan bo'lib qoladi. Cheat sheet'ning o'zida block-list misollari (`setDisallowedFields`, `protect: true`) bor, lekin ular mavjud ilovalarda uchraydigan mexanizmni ko'rsatish uchun, tavsiya etilgan dizayn sifatida emas. Allowlist misoli esa Node.js uchun: `_.pick(req.body, safeFields)`.

### Schema bor, lekin noma'lum maydonlar o'tib ketadi

JSON Schema yoki class-validator ishlatish yetarli emas. Cheat sheet ogohlantiradi: JSON uchun majburiy va qo'shimcha xossalarni aniq sozlash kerak, chunki xossani ro'yxatga yozishning o'zi uni majburiy ham qilmaydi, noma'lum maydonlarni rad ham etmaydi. NestJS'da `ValidationPipe` `whitelist: true` (noma'lum maydonlarni o'chiradi) va `forbidNonWhitelisted: true` (xato beradi) bilan sozlanadi. Sozlanmagan pipe esa DTO bor ko'rinishida hammasini o'tkazib yuboradi. NestJS hujjatiga ko'ra `whitelist: true` DTO'da dekorator bilan belgilanmagan xossalarni validatsiya qilingan obyektdan olib tashlaydi, `forbidNonWhitelisted: true` qo'shilsa esa so'rov xato javobi bilan rad etiladi. Input Validation Cheat Sheet ham noto'g'ri so'rovni aniq xato bilan rad etishni, qisman validatsiya qilingan ma'lumot bilan davom etmaslikni va faqat mo'ljallangan maydonlarni obyektga bog'lashni aytadi. Shu sababli bu darsdagi tavsiya: yozishda jimgina o'chirish emas, rad etishni afzal ko'ring, chunki jimgina o'chirish hujum urinishini yashiradi va mijoz dasturidagi xatoni ko'rsatmaydi.

### Rolga bog'liq maydonlar

Haqiqiy tizimda bitta maydonni turli rollar turlicha oladi. `plan` faqat adminga, `alertThreshold` dispetcherga ham, `lastSeen` hech kimga yoziladigan emas (qurilma yozadi). Bu qoidani DTO'larga bo'lib tarqatmaslik uchun rol bo'yicha yozish ruxsatlari ma'lumot sifatida bitta joyda turadi (51-dars: siyosat ma'lumot sifatida). Bunda qoida ham 53-darsdagi funksiya darajasidan farq qiladi: endpoint ikkala rol uchun ochiq, farq maydonlarda.

### O'qish tomoni: javob DTO'si

Yozish allowlist'ining o'qishdagi aksi javob DTO'si. Uchta usul:

- Qaytariladigan obyektni qo'lda yig'ish (`{ id, name, plan }`). Eng oddiy va eng ishonchli.
- Ma'lumotlar bazasi so'rovida faqat kerakli ustunlarni tanlash (`select`). Bu ortiqcha ma'lumot server xotirasiga ham tushmasligini ta'minlaydi.
- Javobni sxema bilan tekshirish (API3 sahifasining ikkinchi qatlami): sxemada yo'q maydon bo'lsa, javob chiqmaydi yoki log'ga tushadi.

Next.js'da shu fikr Data Access Layer va DTO bilan ifodalanadi: rasmiy hujjat DAL'ni faqat serverda ishlaydigan, authorization tekshirishni bajaradigan va xavfsiz, minimal DTO qaytaradigan qatlam sifatida tavsiflaydi (58-dars). Hujjatdagi misol maxfiy ma'lumot (telefon raqami) faqat tegishli foydalanuvchiga ko'rinishini DTO ichida hal qiladi.

### Ikkilamchi yo'llar

Bir xil maydonga bir nechta yo'l bilan yozish mumkin: `PATCH /vehicles/7`, `PUT /vehicles/7`, ommaviy import, GraphQL mutation (76-dars), WebSocket xabari (77-dars). Allowlist faqat bitta yo'lda bo'lsa, qolgani teshik. Shuning uchun allowlist servis qatlamida (yozishni bajaradigan funksiyada) turishi kerak, controller'da emas.

Va nihoyat, `__proto__`, `constructor` kabi maxsus kalitlar. `JSON.parse` `"__proto__"` ni oddiy o'z xossasi sifatida yaratadi; allowlist usuli (kalitlarni sanab, ro'yxatda yo'qlarini rad etish) bu holatni o'z-o'zidan yopadi, chuqur birlashtiruvchi (`merge`) funksiyalar esa prototype pollution muammosi manbai (29-dars).

## Misol: mashina profilini tahrirlash

### 1. Zaif kod

```ts run
type Role = "dispatcher" | "admin";
type Vehicle = { id: string; tenant: string; name: string; alertThreshold: number; plan: string; deviceKey: string };

const v: Vehicle = { id: "v1", tenant: "alfa", name: "Isuzu", alertThreshold: 10, plan: "basic", deviceKey: "k-123" };

// ZAIF: mijoz tanasi to'g'ridan-to'g'ri obyektga bog'lanadi, javob esa butun obyekt
function update(role: Role, body: Record<string, unknown>): { ok: boolean } {
  Object.assign(v, body);
  return { ok: true };
}
function publicView(x: Vehicle) {
  return x;
}

console.log("oddiy so'rov:", update("dispatcher", { alertThreshold: 15 }).ok, v.alertThreshold);
console.log("javob maydonlari:", Object.keys(publicView(v)).join(", "));
```

```text
oddiy so'rov: true 15
javob maydonlari: id, tenant, name, alertThreshold, plan, deviceKey
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu mass assignment usuli faqat shu darsning o'quv kodida ko'rsatiladi; uni o'z tizimingizda yoki yozma ruxsat va kelishilgan doira bilan sinang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-4-moddasi (Kompyuter axborotini modifikatsiyalashtirish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Dispetcher tahrirlash so'rovi tanasiga forma yubormaydigan maydonlarni qo'shadi:

```ts run
type Vehicle = { id: string; tenant: string; name: string; alertThreshold: number; plan: string; deviceKey: string };
const v: Vehicle = { id: "v1", tenant: "alfa", name: "Isuzu", alertThreshold: 10, plan: "basic", deviceKey: "k-123" };
const update = (_role: string, body: Record<string, unknown>) => { Object.assign(v, body); return { ok: true }; };

const body = JSON.parse('{"name":"Isuzu","tenant":"beta","plan":"premium"}');
console.log("so'rov natijasi:", update("dispatcher", body).ok);
console.log("tenant:", v.tenant, "| plan:", v.plan);
```

```text
so'rov natijasi: true
tenant: beta | plan: premium
```

Mashina boshqa tenant'ga o'tdi va tarif rejasi o'zgardi. Hujum faqat shu darsning o'quv obyektiga qarshi: oddiy formadan chiqmaydigan ikki kalit tanaga qo'shildi, xolos. Birinchi blokdagi chiqish esa javob orqali sizish ko'rsatkichi: `deviceKey` mijozga ketadi.

### 3. Tuzatilgan kod

```ts run
type Role = "dispatcher" | "admin";
type Vehicle = { id: string; tenant: string; name: string; alertThreshold: number; plan: string; deviceKey: string };

const v: Vehicle = { id: "v1", tenant: "alfa", name: "Isuzu", alertThreshold: 10, plan: "basic", deviceKey: "k-123" };

const WRITABLE: Record<Role, string[]> = {
  dispatcher: ["name", "alertThreshold"],
  admin: ["name", "alertThreshold", "plan"],
};

function update(role: Role, body: Record<string, unknown>): { ok: boolean; error?: string } {
  const allowed = WRITABLE[role] ?? [];
  const unknown = Object.keys(body).filter((k) => !allowed.includes(k));
  if (unknown.length > 0) return { ok: false, error: `ruxsatsiz maydon: ${unknown.join(", ")}` };
  const t = body.alertThreshold;
  if (t !== undefined && !(Number.isInteger(t) && (t as number) >= 0 && (t as number) <= 100)) {
    return { ok: false, error: "alertThreshold 0..100 butun son bo'lishi kerak" };
  }
  for (const k of Object.keys(body)) (v as Record<string, unknown>)[k] = body[k];
  return { ok: true };
}

function publicView(x: Vehicle) {
  const { id, name, alertThreshold, plan } = x; // aniq tanlash, ...x yo'q
  return { id, name, alertThreshold, plan };
}

const attack = JSON.parse('{"name":"Isuzu","tenant":"beta","plan":"premium"}');
console.log("hujum:", update("dispatcher", attack));
console.log("tenant:", v.tenant, "| plan:", v.plan);
console.log("oddiy:", update("dispatcher", { alertThreshold: 15 }), v.alertThreshold);
console.log("chegaradan tashqari:", update("dispatcher", { alertThreshold: 500 }).ok);
console.log("admin plan:", update("admin", { plan: "premium" }).ok, v.plan);
console.log("javob maydonlari:", Object.keys(publicView(v)).join(", "));
```

```text
hujum: { ok: false, error: 'ruxsatsiz maydon: tenant, plan' }
tenant: alfa | plan: basic
oddiy: { ok: true } 15
chegaradan tashqari: false
admin plan: true premium
javob maydonlari: id, name, alertThreshold, plan
```

### Tuzatish nima uchun yetarli

Endi yozish rolga bog'liq allowlist orqali o'tadi: ro'yxatdan tashqaridagi kalit butun so'rovni rad etadi, qisman yozish yo'q. `tenant` va `plan` dispetcher uchun yozib bo'lmaydi, `deviceKey` esa umuman hech kim tomonidan yozilmaydi. Javob qo'lda tanlangan to'rt maydondan iborat, shuning uchun obyektga yangi ichki maydon qo'shilsa ham mijozga chiqmaydi. Tuzatish faqat ko'rsatilgan hujumni yopadi. Qoldiq risk: bu funksiya mashina shu dispetcherniki ekanini tekshirmaydi (52-dars), `name` qiymati uzunlik va tarkib bo'yicha validatsiya qilinmagan (72-dars), ruxsat etilgan maydon ichidagi mantiqiy suiiste'mol (masalan, `alertThreshold` ni 0 qilib signalni o'chirish) biznes qoidasi masalasi (59-dars).

### Mashq: faqat mo'ljallangan maydonlarni tanlash

`pick(body, allowed)` funksiyasi yangilash uchun faqat ruxsat etilgan maydonlardan yangi obyekt qaytarishi kerak. Hozir u butun tanani qaytaradi. Testlar kirishni o'zgartirmaslik, meros bo'lib kelgan xossalarni olmaslik va `__proto__` kaliti o'tmasligini tekshiradi.

```ts run
function pick(body: Record<string, unknown>, allowed: string[]): Record<string, unknown> {
  return body;
}
```

```ts test
check("faqat ruxsat etilgan maydonlar qoladi", () => {
  const r = pick({ name: "A", tenant: "beta" }, ["name"]);
  return r.name === "A" && !("tenant" in r);
});
check("kirish obyekti o'zgarmaydi", () => {
  const input = { name: "A", plan: "x" };
  pick(input, ["name"]);
  return "plan" in input;
});
check("meros xossa olinmaydi", () => {
  const r = pick(Object.create({ name: "meros" }), ["name"]);
  return !("name" in r);
});
check("JSON'dagi __proto__ kaliti o'tmaydi", () => {
  const r = pick(JSON.parse('{"name":"A","__proto__":{"admin":true}}'), ["name"]);
  return (r as { admin?: boolean }).admin !== true && Object.keys(r).join() === "name";
});
```

## Qachon qo'llamaslik kerak

- Ichki, ishonchli import va migratsiya skriptlari uchun qattiq allowlist ortiqcha bo'lishi mumkin, lekin ular ham servis qatlamidan o'tsin: bir kuni skript endpoint bo'lib qoladi.
- Hammasiga bir xil allowlist (rolga qaramay) qulay, lekin rolga bog'liq maydonlar bo'lganda qo'pol: shunda admin funksiyasi uchun alohida endpoint yoki alohida allowlist kerak. Ikkalasi o'rtasida tanlovni maydonlar soni va o'zgarish tezligi belgilaydi.
- Javobni har endpoint uchun qo'lda yig'ish ko'p kod bo'ladi. Sxema asosidagi serializatsiya bu yukni kamaytiradi: Fastify hujjatiga ko'ra route'da chiqish sxemasi berilsa, javob `fast-json-stringify` bilan yuboriladi va bu "sezgir ma'lumotning tasodifan oshkor bo'lishining oldini olishga yordam beradi". `class-transformer` da `instanceToPlain` ga `strategy: 'excludeAll'` berilsa, `@Expose()` bilan belgilanmagan hamma xossa chiqarib tashlanadi; `plainToInstance` ning `excludeExtraneousValues` opsiyasi esa kirish tomonida klassda e'lon qilinmagan kalitlarni tashlaydi. Muhimi: sukut bo'yicha maydon chiqmaydi, ruxsat berilgani chiqadi. Bu muallif tavsiyasi; yuqoridagi hujjatlar faqat mexanizmni tasdiqlaydi, o'z javoblaringiz uchun test yozing.
- Silent drop (noma'lum maydonni jimgina o'chirish) kerak bo'lishi mumkin: eski mijoz ilovalari qo'shimcha maydon yuborsa, qat'iy rad etish ularni sindiradi. Bunda o'chirish bilan birga urinishni log'ga yozing (79-dars), aks holda hujum izsiz o'tadi.
- Allowlist authorization emas, faqat bir qatlam. Rol yoki tenant tekshiruvi bo'lmasa, allowlist ichidagi maydon ham begona obyektga yozilishi mumkin.

## Stack'da: NestJS, Prisma va Next.js

NestJS'da ikki qatlam: global `ValidationPipe` va servisdagi allowlist. Prisma'da `data: body` ni hech qachon to'g'ridan-to'g'ri bermang; `select` bilan javobni toraytiring. Bu kod ishga tushirilmaydi (tashqi modullar), faqat sintaksis tekshirilgan.

Eslatma: Prisma ORM 7 hujjatiga ko'ra `PrismaClient` driver adapter talab qiladi va adapter'siz `new PrismaClient()` xato beradi; quyidagi namunada qisqalik uchun adapter ko'rsatilmagan, haqiqiy loyihada `new PrismaClient({ adapter })` yozing (masalan, PostgreSQL uchun `@prisma/adapter-pg`).

```ts
import { Body, Controller, Param, Patch, Req } from "@nestjs/common";
import { IsInt, IsOptional, IsString, Max, Min, MaxLength } from "class-validator";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// main.ts'da: app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
export class UpdateVehicleDto {
  @IsOptional() @IsString() @MaxLength(80) name?: string;
  @IsOptional() @IsInt() @Min(0) @Max(100) alertThreshold?: number;
  // tenantId, plan, deviceKey bu DTO'da yo'q: forbidNonWhitelisted ularni rad etadi
}

@Controller("vehicles")
export class VehiclesController {
  @Patch(":id")
  async update(@Req() req: { user: { tenantId: string } }, @Param("id") id: string, @Body() dto: UpdateVehicleDto) {
    const res = await prisma.vehicle.updateMany({
      where: { id, tenantId: req.user.tenantId }, // 52-dars: egalik so'rovning ichida
      data: { name: dto.name, alertThreshold: dto.alertThreshold },
    });
    if (res.count === 0) return { ok: false };
    return prisma.vehicle.findFirst({
      where: { id, tenantId: req.user.tenantId },
      select: { id: true, name: true, alertThreshold: true, plan: true }, // deviceKey tanlanmaydi
    });
  }
}
```

`data` ga dto maydonlari aniq yozilgan, `...dto` ham emas: DTO kelajakda kengaytirilsa ham Prisma'ga yozish ro'yxati ongli o'zgartiriladi. Next.js server action'larida ham xuddi shu: `formData` dan maydonlarni qo'lda o'qing (`data.get('name')`), `Object.fromEntries(formData)` ni to'g'ridan-to'g'ri `update` ga bermang. Next.js hujjati yana ikki narsani aytadi: eksport qilingan Server Action to'g'ridan-to'g'ri POST so'rovi bilan ham chaqirilishi mumkin, shuning uchun har action ichida autentifikatsiya va authorization tekshiriladi; va action qaytarish qiymati serializatsiya qilinib mijozga ketadi, shuning uchun u xom ma'lumotlar bazasi yozuvini emas, faqat UI'ga kerakli narsani (`{ success: true }`) qaytarishi kerak. Bu o'qish tomonidagi excessive data exposure'ning aynan o'zi.

## Xulosa

- Mass assignment va excessive data exposure bitta ildizdan: obyekt xossasi darajasida authorization yo'q (API3:2023). Birinchisi yozishda, ikkinchisi o'qishda namoyon bo'ladi.
- Mijoz kiritishini obyektga bog'lamang: yozish uchun rolga bog'liq allowlist, noma'lum maydonda rad etish.
- Schema validatsiyasi o'z-o'zidan yetarli emas: noma'lum maydonlar va additional properties'ni aniq sozlash shart.
- Javobni umumiy serializatsiya bilan emas, aniq tanlangan maydonlar (DTO yoki `select`) bilan yig'ing, imkon bo'lsa sxema bilan tekshiring.
- Allowlist faqat bir qatlam: obyekt egaligi (52-dars) va funksiya huquqi (53-dars) alohida tekshiriladi.
