---
n: 73
slug: rate-limiting
title: "Rate limiting va resurs iste'molini cheklash"
summary: "Rate limiting nima uchun faqat so'rovlar sonini sanash emas: algoritmlar (fixed window, sliding log, token bucket), kalit tanlash va X-Forwarded-For tuzog'i, Redis'da atomik hisoblagich, narx asosidagi limit, Redis uzilganda xatti-harakat va NestJS Throttler."
duration: 40
sources:
  - id: api-top10
    note: "API4:2023 Unrestricted Resource Consumption: resurslar (tarmoq, CPU, xotira, saqlash) va per-request to'lanadigan xizmatlar (email, SMS, qo'ng'iroq, biometrik tekshiruv); 'How To Prevent': resurs chegaralari, payload o'lchami, chastota limiti, bir operatsiyani takrorlash limiti (OTP, parol tiklash), spending limit yoki billing alert; API6:2023 biznes oqimlarni avtomatlashtirish"
  - id: rfc6585
    note: "RFC 6585 4 (429 Too Many Requests): foydalanuvchi berilgan vaqtda juda ko'p so'rov yuborgan; javob tanasi holatni tushuntirishi kerak (SHOULD), Retry-After ixtiyoriy (MAY); server foydalanuvchini va so'rovlarni qanday sanashini RFC belgilamaydi; 429 javobni cache saqlamasligi shart; 7.2: server 429 ishlatishga majbur emas, hujum paytida ulanishni uzish ma'qulroq bo'lishi mumkin"
  - id: rfc9110
    note: "RFC 9110 10.2.3 (Retry-After): qiymat HTTP-date yoki soniyalar soni (delay-seconds); 503 bilan xizmat qancha vaqt mavjud bo'lmasligini, 3xx bilan minimal kutish vaqtini bildiradi"
  - id: nestjs-rate-limit
    note: "NestJS Rate Limiting: @nestjs/throttler, ThrottlerModule.forRoot ichida ttl (millisekund) va limit, bir nechta nomli throttler (short, medium, long), blockDuration, @Throttle va @SkipThrottle, ThrottlerGuard'ni global bog'lash, proxy ortida trust proxy / trustProxy sozlash (Fastify'da son qiymati haqida ogohlantirish), standart xotira storage'i va custom storage, WebSocket uchun ThrottlerGuard'ni kengaytirish"
  - id: redis-security
    note: "Redis security: Redis ishonchli muhitdagi ishonchli mijozlar uchun mo'ljallangan, uni to'g'ridan-to'g'ri internetga ochish tavsiya etilmaydi; ishonchsiz mijoz bilan Redis o'rtasida ACL, kirishni tekshirish va amalni tanlash qatlami turishi kerak; Redis portiga faqat ishonchli mijozlar kira olsin. Dars shundan hisoblagich saqlanadigan Redis'ning o'zini ham himoyalash zarurligini xulosa qiladi"
  - id: t10-a10
    note: "A10:2025 Mishandling of Exceptional Conditions: tranzaksiya o'rtasidagi xatoda hammasini qaytarish (fail closed) va rate limiting, resurs kvotalari, throttling qo'yish; IT'da hech narsa cheksiz bo'lmasligi kerak"
quiz:
  - q: "Fixed window limiti: daqiqada 100 so'rov. Mijoz 59-soniyada 100 ta, 61-soniyada yana 100 ta yubordi. Nima bo'ldi?"
    options:
      - "Ikkinchi paket rad etildi, chunki limit 100"
      - "Ikkala paket ham o'tdi: 2-3 soniya ichida 200 so'rov, limitning ikki barobari (window chegarasidagi burst)"
      - "Faqat birinchi 50 so'rov o'tdi"
      - "Limit daqiqaga emas, soniyaga hisoblanadi"
    answer: 1
    explain: "Fixed window hisoblagichni har oyna boshida nolga tushiradi. Oyna oxiridagi va keyingi oyna boshidagi so'rovlar alohida hisoblanadi, shuning uchun qisqa oraliqda limitning ikki barobarigacha so'rov o'tishi mumkin. Sliding window yoki token bucket buni yumshatadi."
  - q: "Rate limiter kaliti `req.headers['x-forwarded-for']`. Hujumchi nima qiladi va qanday tuzatiladi?"
    options:
      - "Har so'rovda header qiymatini o'zgartiradi va har safar yangi kalit oladi; tuzatish: faqat ishonchli proxy qo'shgan qiymatni (yoki autentifikatsiyalangan foydalanuvchini) kalit qilish"
      - "Hech narsa: header server tomonidan qo'yiladi"
      - "Header'ni o'chiradi; tuzatish: header o'rniga cookie ishlatish"
      - "Parolni taxmin qiladi; tuzatish: murakkabroq parol"
    answer: 0
    explain: "Header'ni mijoz yozishi mumkin; unga ishonish limitni chetlab o'tishga yo'l ochadi. Proxy ortida ishlaganda ishonchli hop'ni aniq belgilash kerak (NestJS hujjati ham adapterda trust proxy sozlashni aytadi)."
  - q: "Login uchun limit faqat 'akkaunt nomi bo'yicha, 5 urinish / 15 daqiqa'. Qaysi yangi muammo paydo bo'ladi?"
    options:
      - "Parol ro'yxatlari ishlamay qoladi, boshqa muammo yo'q"
      - "Limit sekinlashadi"
      - "Foydalanuvchi parolni tiklay olmaydi, chunki IP o'zgaradi"
      - "Hujumchi ataylab xato parol yuborib, boshqa odam akkauntini bloklashi mumkin (DoS); limitni IP, qurilma belgisi yoki progressiv kechikish bilan birlashtirish kerak"
    answer: 3
    explain: "Faqat akkaunt kaliti qurbonning akkauntini bloklash vositasiga aylantiradi. Kalitlarni birlashtirish yoki bloklash o'rniga kechikishni oshirish (43-dars) ikkala xavfni kamaytiradi."
  - q: "Redis'da hisoblagich `INCR key` keyin alohida `EXPIRE key 60` bilan yuritiladi. Qaysi nuqson bor?"
    options:
      - "INCR sekin"
      - "EXPIRE faqat birinchi so'rovda chaqirilsa va INCR'dan keyin jarayon uzilsa, kalit TTL'siz qoladi va foydalanuvchi doimiy bloklanadi; ikkala amalni bitta atomik skript yoki bitta buyruqda bajarish kerak"
      - "Redis kalitlarni o'chirib tashlaydi"
      - "EXPIRE millisekundni qabul qilmaydi"
    answer: 1
    explain: "Ikki alohida buyruq orasida uzilish yoki race bo'lishi mumkin. Atomik bajarish (Lua skript yoki Redis'ning bitta amali) invariantni saqlaydi: hisoblagich har doim TTL bilan bog'liq."
  - q: "OWASP API4 bo'yicha quyidagilardan qaysi biri rate limiting'dan tashqari, alohida talab qilinadigan nazorat?"
    options:
      - "Kiruvchi payload o'lchami va satr/massiv uzunligi chegarasi, shuningdek per-request to'lanadigan xizmatlar uchun spending limit yoki billing alert"
      - "Barcha javoblarni siqish"
      - "Faqat HTTPS"
      - "CORS sozlamasi"
    answer: 0
    explain: "Chastota limiti bitta ingichka o'lchov. Katta tana, cheksiz sahifa yoki pullik SMS integratsiyasi kam so'rov bilan ham katta zarar yetkazadi, shuning uchun o'lcham chegaralari va xarajat limiti ham kerak."
  - q: "Rate limiter ishlatayotgan Redis uzilib qoldi. Login endpoint uchun mantiqiy qaror qaysi?"
    options:
      - "Hamma so'rovni cheklovsiz o'tkazish, chunki mavjudlik muhim"
      - "Login uchun fail closed (yoki qattiq mahalliy zaxira limiti), umumiy o'qish endpoint'lari uchun esa mahalliy zaxira limit bilan fail open; qaror endpoint xavfiga qarab ongli tanlanadi"
      - "Barcha endpoint'larni abadiy bloklash"
      - "Redis xatosini e'tiborsiz qoldirish"
    answer: 1
    explain: "OWASP A10:2025 tranzaksiya o'rtasidagi xatoda hammasini qaytarish (fail closed) ni talab qiladi, limiter uzilishiga uni to'g'ridan-to'g'ri qo'llash esa kursning talqini. Lekin limiter nosozligi sabab butun platformani o'chirib qo'yish ham mavjudlikka zarar. Xavfi yuqori endpoint (login, OTP) uchun yopiq, qolgani uchun mahalliy zaxira limit bilan ochiq qaror odatiy kelishuv (bu muallifning tavsiyasi)."
task:
  title: "Sliding window log limiter"
  prompt: |
    `makeLimiter(limit, windowMs)` hozir fixed window usulida ishlaydi va oyna chegarasida limitdan ko'p so'rovga yo'l qo'yadi. Uni sliding window log bilan almashtiring: har kalit uchun so'rov vaqtlari saqlanadi, `now - windowMs` dan eski yoki unga teng vaqtlar o'chiriladi, qolgani soni `limit` dan kam bo'lsa so'rov ruxsat etiladi.

    Qoidalar:
    1. Har kalit alohida hisoblanadi.
    2. Rad etilgan so'rov vaqtlar ro'yxatiga qo'shilmaydi.
    3. Imzoni o'zgartirmang: `allow(key, now)` boolean qaytaradi.

    Kutilgan natija: `limit=3`, `windowMs=10` va vaqtlar `0, 8, 9, 10, 11, 12` uchun satr `111100`; boshqa kalit `b` esa `t=11` da `1`.
  lang: ts
  starter: |
    function makeLimiter(limit: number, windowMs: number) {
      const state = new Map<string, { start: number; count: number }>();
      return function allow(key: string, now: number): boolean {
        const e = state.get(key);
        if (!e || now - e.start >= windowMs) {
          state.set(key, { start: now, count: 1 });
          return true;
        }
        e.count++;
        return e.count <= limit;
      };
    }

    const allow = makeLimiter(3, 10);
    const times = [0, 8, 9, 10, 11, 12];
    console.log(times.map((t) => (allow("a", t) ? "1" : "0")).join(""));
    console.log("boshqa kalit:", allow("b", 11) ? "1" : "0");
  solution: |
    function makeLimiter(limit: number, windowMs: number) {
      const log = new Map<string, number[]>();
      return function allow(key: string, now: number): boolean {
        const fresh = (log.get(key) ?? []).filter((t) => t > now - windowMs);
        if (fresh.length >= limit) {
          log.set(key, fresh);
          return false;
        }
        fresh.push(now);
        log.set(key, fresh);
        return true;
      };
    }

    const allow = makeLimiter(3, 10);
    const times = [0, 8, 9, 10, 11, 12];
    console.log(times.map((t) => (allow("a", t) ? "1" : "0")).join(""));
    console.log("boshqa kalit:", allow("b", 11) ? "1" : "0");
  solutionNotes: |
    - Sliding log har so'rovni aniq vaqti bilan saqlaydi, shuning uchun istalgan `windowMs` oralig'ida `limit` dan ko'p so'rov o'tmaydi. Fixed window esa oyna chegarasida ikki barobarigacha o'tkazadi.
    - Narxi: har kalit uchun `limit` tagacha vaqt saqlanadi. Limit katta (masalan, minutiga 10 000) bo'lsa, xotira va tozalash narxi katta; shunda token bucket yoki sliding window counter tanlanadi.
    - Rad etilgan so'rovlar jurnalga yozilmaydi: aks holda to'xtovsiz urinayotgan mijoz hech qachon oyna chegarasidan chiqolmaydi.
    - Bu bitta jarayon ichidagi xotira. Bir nechta instance bo'lsa, hisoblagich umumiy storage'da (Redis) atomik yuritiladi.
    - Limiter kalit tanlashni hal qilmaydi: kalit hujumchi boshqara oladigan qiymat bo'lsa, limit chetlab o'tiladi.
  checklist:
    - "Natija birinchi qatorda `111100`"
    - "Boshqa kalit alohida hisoblanadi (`1`)"
    - "Rad etilgan so'rov hisoblagichni oshirmaydi"
    - "Sliding log xotira narxini ayta olasiz"
    - "Kalit hujumchi tomonidan boshqarilsa limit ishlamasligini tushunasiz"
---

## Muammo

Dasturchi uchun "rate limiting" ko'pincha `login` endpoint'iga qo'yiladigan bitta qoida: "daqiqada 5 urinish". Lekin resurslarni cheklamaslik muammosi ancha keng. OWASP API Security Top 10 (2023) ning API4 kategoriyasi API so'rovini bajarish tarmoq o'tkazish qobiliyati, CPU, xotira va saqlash kabi resurslarni talab qilishini yozadi, shuningdek email, SMS, telefon qo'ng'iroqlari yoki biometrik tekshiruv kabi per-request to'lanadigan xizmatlar ham resurs ekanini qo'shadi. Ya'ni muvaffaqiyatli hujum nafaqat servisni to'xtatadi, balki xarajatni ham oshiradi.

Avtopark platformasidan uch real vaziyat. Birinchisi: hisobot eksporti endpoint'i bitta so'rovda million qator hisoblaydi; mijozning noto'g'ri skripti uni sekundiga o'nlab marta chaqirib, butun tenant uchun bazani band qiladi. Ikkinchisi: "parolni tiklash" oqimi har chaqiriqda SMS yuboradi; hujumchi bitta telefon raqamiga yuzlab SMS yuborib hisobni to'ldiradi (pul va foydalanuvchi shikoyati). Uchinchisi: yoqilg'i hisobotlari API'si uchun mijoz bitta tarif to'laydi, lekin integratsiya "ko'p tenant" uchun parallel skrap qiladi (API6 bilan chegaradosh). Uchalasida ham kod to'g'ri ishlaydi; muammo shundaki, hech narsa uni to'xtatmaydi.

OWASP A10:2025 bu fikrni umumiy tilda aytadi: IT'da hech narsa cheksiz bo'lmasligi kerak, aks holda ilovada chidamlilik yo'qoladi, DoS, muvaffaqiyatli brute force va cloud hisobidagi favqulodda xarajat paydo bo'ladi. Bu dars chastota limiti (rate limit) va resurs limiti (quota, o'lcham, narx) ni mexanizm darajasida ko'radi.

## Asosiy g'oya

### Limit nima uchun va nimaga qarshi

Limit uchta turli maqsadga xizmat qiladi, va ular turli kalit va qiymat talab qiladi:

| Maqsad | Misol | Limit turi |
|---|---|---|
| Brute force va taxmin qilish | login, OTP, parol tiklash | Akkaunt va IP bo'yicha, kam urinish, kechikish oshib boradi |
| Resurs himoyasi (mavjudlik) | og'ir eksport, qidiruv | Tenant yoki foydalanuvchi bo'yicha, narx (cost) asosida |
| Xarajat va biznes oqim | SMS, email, promo kod | Operatsiya bo'yicha kunlik quota, spending limit |

OWASP API4 "How To Prevent" ro'yxati shunga mos: konteyner yoki serverless kabi yechimlar bilan xotira, CPU, qayta ishga tushirishlar, fayl deskriptorlari va jarayonlar sonini cheklash; barcha kiruvchi parametr va payload'lar uchun maksimal o'lcham; mijoz API bilan ma'lum vaqt ichida qancha ishlashi mumkinligiga chastota limiti (biznes ehtiyojiga qarab moslanadi, ba'zi endpoint'lar qattiqroq siyosat talab qiladi); bitta operatsiyani (OTP tekshirish, parol tiklash) qancha marta bajarish mumkinligi; qaytariladigan yozuvlar sonini boshqaradigan parametrni server tomonda tekshirish; va barcha xizmat ko'rsatuvchilar uchun spending limit yoki, imkon bo'lmasa, billing alert. Rate limiting shu ro'yxatning bir bandi xolos.

### Algoritmlar

Quyidagi to'rt algoritm eng ko'p uchraydi. Ularning xususiyatlari mantiqiy tahlilga asoslangan; raqamlar yo'q, chunki tezlik ma'lumotni ilova yuklamasi belgilaydi.

- **Fixed window.** Vaqt oynalarga bo'linadi, har oynada hisoblagich. Oddiy va arzon, lekin oyna chegarasida limitning ikki barobarigacha burst o'tadi: oyna oxirida `limit` ta va keyingi oyna boshida yana `limit` ta.
- **Sliding window log.** Har so'rov vaqti saqlanadi; istalgan oraliqda aniq limit. Xotira narxi so'rovlar soniga proporsional.
- **Sliding window counter.** Ikki qo'shni fixed window hisoblagichini vaznlab taxminiy sliding hosil qiladi. Xotira kam, aniqlik yaqin.
- **Token bucket.** Chelakda `capacity` token, doimiy tezlikda to'ladi, har so'rov token sarflaydi. Qisqa burst'ga ruxsat beradi (chelak to'la bo'lsa), uzoq muddatli o'rtacha tezlikni cheklaydi. Narx asosidagi limit uchun qulay: og'ir so'rov 1 emas, 5 token sarflaydi.

### Kalit: kim uchun limit

Limit "kim" uchun ishlashini kalit belgilaydi. Variantlar: IP, foydalanuvchi, tenant, API kalit, ularning kombinatsiyasi. Har birining zaif tomoni bor. IP kalit sifatida: ko'p foydalanuvchi bitta NAT ortida (korxona ofisi) bo'lishi mumkin va legitim mijozlar bloklanadi; hujumchi esa ko'p IP'dan keladi. Foydalanuvchi kaliti faqat autentifikatsiyadan keyin ishlaydi, ya'ni autentifikatsiyadan oldingi endpoint'larga (login, ro'yxatdan o'tish) yaramaydi. Tenant kaliti "shovqinli qo'shni"dan boshqa tenant'larni himoya qiladi. Amalda qatlamlar ishlatiladi: gateway'da IP bo'yicha qo'pol limit, ilovada foydalanuvchi va tenant bo'yicha aniq limit, og'ir operatsiyalarda narx limiti.

Eng keng tarqalgan xato: kalit sifatida `X-Forwarded-For` header'ining birinchi qiymatini olish. Bu header'ni mijoz o'zi yozishi mumkin; har so'rovda boshqa qiymat yuborgan hujumchi har safar yangi kalit oladi va limit hech qachon ishlamaydi. NestJS Rate Limiting hujjati ham proxy ortidagi ilovada HTTP adapterni proxy'ga ishonadigan qilib sozlashni (Express, Fastify va Node adapteri uchun `trust proxy` variantlari) aytadi. Mohiyati: faqat sizning o'z proxy'ngiz qo'shgan qiymatga ishoning, mijoz yuborgan qismga emas.

## Chuqurroq: taqsimlangan va xavfsiz limiter

### Redis'da atomik hisoblagich

Instance'lar bir nechta bo'lsa, hisoblagich umumiy storage'da turishi kerak, odatda Redis. Eng ko'p uchraydigan xato: `INCR key`, so'ng natija 1 bo'lsa `EXPIRE key ttl`. Ikki buyruq orasida jarayon uzilsa yoki ulanish uzilsa, kalit TTL'siz qoladi va foydalanuvchi doimiy bloklanadi. Yechim: ikkala amalni bitta atomik skriptda bajarish.

```ts
// Redis Lua skripti: INCR va PEXPIRE bitta atomik amalda (Redis kerak)
export const FIXED_WINDOW_LUA = `
local c = redis.call('INCR', KEYS[1])
if c == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
return c
`;

export async function hit(
  redis: { eval(script: string, numKeys: number, ...args: (string | number)[]): Promise<unknown> },
  key: string,
  windowMs: number,
  limit: number,
): Promise<boolean> {
  const count = Number(await redis.eval(FIXED_WINDOW_LUA, 1, key, windowMs));
  return count <= limit;
}
```

Redis skriptni bitta atomik amal sifatida bajaradi, shuning uchun hisoblagich va muddat doim birga o'rnatiladi. Hisoblagich Redis'ning o'zi ham aktiv: Redis hujjatiga ko'ra u ishonchli muhitdagi ishonchli mijozlar uchun mo'ljallangan va uni to'g'ridan-to'g'ri internetga ochish tavsiya etilmaydi; ochiq Redis'da hujumchi hisoblagichlarni o'zi nolga tushirishi mumkin (89-dars).

### Xato holatida nima qilish

Limiter storage'i (Redis) uzilsa ikkita yo'l bor: hamma so'rovni o'tkazish (fail open) yoki rad etish (fail closed). OWASP A10 xatolarda "fail closed" ni, ya'ni xato bo'lsa tranzaksiyani qaytarib qaytadan boshlashni tavsiya qiladi. Lekin limiter nosozligi sabab butun platformani o'chirish ham mavjudlikka zarar. Kelishuv: xavfi yuqori endpoint'lar (login, OTP, parol tiklash) uchun yopiq yoki qattiq mahalliy (jarayon ichidagi) zaxira limit; qolgani uchun mahalliy zaxira limit bilan ochiq. Bu muallifning tavsiyasi, manbalarda aniq qoida yo'q. Har holda xato logga va alertga tushsin (79-dars): jimgina "ochiq" qolgan limiter hujumchi uchun eng yaxshi holat.

### Javob va mijoz bilan muloqot

Limit oshganda odatda 429 Too Many Requests status qaytariladi. RFC 6585 4-bo'limi uni foydalanuvchi berilgan vaqt ichida juda ko'p so'rov yuborganini bildiradi deb ta'riflaydi; javob tanasi holatni tushuntirishi kerak (SHOULD), `Retry-After` esa ixtiyoriy (MAY). `Retry-After` qiymati RFC 9110 10.2.3 bo'yicha yoki HTTP-date, yoki soniyalar soni (`Retry-After: 120`). RFC 6585 foydalanuvchini qanday aniqlash va so'rovni nimaga nisbatan sanash (resurs, butun server, serverlar guruhi) masalasini belgilamaydi va 429 javobni cache saqlamasligi shartligini yozadi. 7.2-bo'limga ko'ra server 429 ishlatishga majbur emas: hujum paytida har so'rovga 429 qaytarish ham resurs sarflaydi, shuning uchun ulanishni uzish kabi chora ma'qulroq bo'lishi mumkin. Javob matnida qaysi limit oshgani haqida ortiqcha ichki tafsilot (kalit tuzilishi, boshqa tenant limitlari) chiqarmang. Mijoz SDK'lari eksponensial kechikish bilan qayta urinishi kerak, aks holda ular o'zlarining limit buzishlari bilan to'lqinni kuchaytiradi.

### Narx asosidagi limit va parallellik

Hamma so'rov bir xil emas. `GET /vehicles?limit=10` va 90 kunlik eksport bir xil "1 so'rov" hisoblansa, limit bema'ni. Token bucket'da narx (`cost`) beriladi: oddiy so'rov 1, eksport 20. Bundan tashqari parallellik limiti (bir foydalanuvchining bir vaqtdagi og'ir so'rovlari soni, masalan 2) chastota limitidan yaxshiroq himoya beradi, chunki sekin so'rovlar chastota past bo'lsa ham resursni band qiladi. Hisobot kabi uzoq ishlar navbatga (queue) olinadi, navbat uzunligi va har tenant ulushi cheklanadi.

## Misol: X-Forwarded-For va oyna chegarasi

Misolda in-memory limiter va sun'iy soat (vaqt parametr sifatida beriladi), shuning uchun natija deterministik. Real tizim yo'q.

### 1. Zaif kod

```ts run
type Req = { ip: string; xff?: string; user: string };

function makeFixedWindow(limit: number, windowMs: number) {
  const m = new Map<string, { start: number; count: number }>();
  return (key: string, now: number): boolean => {
    const e = m.get(key);
    if (!e || now - e.start >= windowMs) {
      m.set(key, { start: now, count: 1 });
      return true;
    }
    e.count++;
    return e.count <= limit;
  };
}

// ZAIF 1: kalit mijoz yuboradigan header
const keyWeak = (r: Req) => r.xff ?? r.ip;
const allowA = makeFixedWindow(5, 60000);
let passed = 0;
for (let i = 0; i < 20; i++) {
  if (allowA(keyWeak({ ip: "198.51.100.7", xff: `203.0.113.${i}`, user: "u1" }), 1000)) passed++;
}
console.log("1) har so'rovda yangi header: " + passed + "/20 o'tdi");

// ZAIF 2: fixed window chegarasi
const allowB = makeFixedWindow(5, 60000);
allowB("u1", 0); // oyna 0 da boshlanadi
let burst = 0;
for (let i = 0; i < 5; i++) if (allowB("u1", 59000 + i)) burst++; // oyna oxiri
for (let i = 0; i < 5; i++) if (allowB("u1", 60000 + i)) burst++; // yangi oyna boshi
console.log("2) oyna chegarasida ~1 soniya ichida o'tgan: " + burst + " (limit minutiga 5)");
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu rate limit'ni aylanib o'tish usuli faqat shu darsning o'quv kodiga qarshi ko'rsatilgan; uni faqat o'z tizimingizda yoki yozma ruxsat bilan, kelishilgan doirada qo'llang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-5-moddasi (Kompyuter sabotaji) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Birinchi hujumda hujumchi bitta haqiqiy IP'dan, lekin har so'rovda boshqa `X-Forwarded-For` qiymati bilan keladi. Ikkinchisida oyna chegarasiga to'g'ri vaqtlab so'rov yuboradi (o'quv modelimizda `t` millisekundda):

```text
1) har so'rovda yangi header: 20/20 o'tdi
2) oyna chegarasida ~1 soniya ichida o'tgan: 9 (limit minutiga 5)
```

Birinchi natijada limit umuman ishlamadi: 20 so'rovning hammasi o'tdi, chunki 20 ta turli "mijoz" ko'rindi. Ikkinchisida minutiga 5 limit ostida bir soniya ichida 9 so'rov o'tdi (oyna oxirida 4, yangi oyna boshida 5, birinchi so'rov hisobga olinmagan). Aniq burst nisbati oyna chegarasiga bog'liq, eng yomon holda limitning ikki barobari.

### 3. Tuzatilgan kod

Kalit ishonchli manbadan olinadi (autentifikatsiyalangan foydalanuvchi yoki ishonchli proxy ko'rgan haqiqiy manzil), algoritm esa token bucket, narx bilan.

```ts run
type Req = { ip: string; xff?: string; user?: string };

const TRUSTED_PROXIES = new Set(["10.0.0.1"]);

// Ishonchli proxy header oxiriga haqiqiy peer manzilini qo'shadi; chapdagi qiymatlarga ishonib bo'lmaydi.
function clientIp(r: Req): string {
  if (!TRUSTED_PROXIES.has(r.ip) || !r.xff) return r.ip;
  const hops = r.xff.split(",").map((s) => s.trim());
  return hops[hops.length - 1];
}
const keyOf = (r: Req) => (r.user ? `u:${r.user}` : `ip:${clientIp(r)}`);

function makeTokenBucket(capacity: number, refillPerSec: number) {
  const m = new Map<string, { tokens: number; t: number }>();
  return (key: string, now: number, cost = 1): boolean => {
    const e = m.get(key) ?? { tokens: capacity, t: now };
    e.tokens = Math.min(capacity, e.tokens + ((now - e.t) / 1000) * refillPerSec);
    e.t = now;
    const ok = e.tokens >= cost;
    if (ok) e.tokens -= cost;
    m.set(key, e);
    return ok;
  };
}

const allow = makeTokenBucket(5, 1);

let direct = 0;
for (let i = 0; i < 20; i++) {
  if (allow(keyOf({ ip: "198.51.100.7", xff: `203.0.113.${i}` }), 1000)) direct++;
}
console.log("1) to'g'ridan-to'g'ri, soxta header: " + direct + "/20 o'tdi");

let viaProxy = 0;
for (let i = 0; i < 20; i++) {
  if (allow(keyOf({ ip: "10.0.0.1", xff: `203.0.113.${i}, 192.0.2.44` }), 1000)) viaProxy++;
}
console.log("2) proxy orqali, soxta chap qiymat: " + viaProxy + "/20 o'tdi");

const u = "u2";
const seq = [0, 0, 0, 0, 0, 0, 3000].map((t) => (allow(keyOf({ ip: "198.51.100.7", user: u }), t) ? "1" : "0"));
console.log("3) token bucket, 5 token + 1/soniya: " + seq.join(""));
console.log("4) eksport (narx 5), to'la chelak: " + allow("u:u3", 0, 5) + ", ketidan: " + allow("u:u3", 0, 1));
```

```text
1) to'g'ridan-to'g'ri, soxta header: 5/20 o'tdi
2) proxy orqali, soxta chap qiymat: 5/20 o'tdi
3) token bucket, 5 token + 1/soniya: 1111101
4) eksport (narx 5), to'la chelak: true, ketidan: false
```

### Tuzatish nima uchun yetarli

Invariant: limit kaliti hujumchi bir so'rovda o'zgartira oladigan qiymatga bog'liq emas. To'g'ridan-to'g'ri keladigan so'rovda `xff` e'tiborga olinmaydi (1-natija: faqat 5 ta). Ishonchli proxy ortida o'ng tomondagi, ya'ni proxy qo'shgan qiymat ishlatiladi, shuning uchun chapdagi soxta manzillar kalitni o'zgartirmaydi (2-natija). Token bucket burst'ni chelak sig'imi (5) darajasida ushlaydi va keyin tezlikni to'lish tezligi (soniyada 1 token) darajasida cheklaydi: 3-natijada birinchi 5 so'rov o'tadi, oltinchisi rad etiladi, 3 soniyadan keyin esa to'lgan tokenlar hisobiga yana bitta o'tadi. Og'ir operatsiya `cost` bilan chelakni tezroq bo'shatadi (4-natija).

Yopilmagan narsalar: bu tuzatish ko'p IP'dan keladigan taqsimlangan hujumni (botnet) to'xtatmaydi; u uchun gateway/WAF va xulq-atvor tahlili kerak. Bir nechta instance uchun hisoblagich umumiy storage'da turishi shart; bu misolda xotira lokal. `TRUSTED_PROXIES` ro'yxati noto'g'ri sozlansa (masalan, hammaga ishonish), himoya yo'qoladi. Akkaunt kaliti bilan bloklash esa qurbonni bloklash orqali DoS bo'lishi mumkin (43-dars).

## Qachon qo'llamaslik kerak

- Ichki servislararo chaqiruvlarda qattiq chastota limiti kaskad nosozlik tug'dirishi mumkin: bitta servis sekinlashganda qayta urinishlar limitga urilib, hammasini yomonlashtiradi. Ichki servislar uchun ko'proq parallellik limiti, timeout va circuit breaker mantiqiy.
- Legitim burst yuklama (har tong soat 8 da barcha mashinalar telemetriya yuboradi) bo'lsa, oddiy chastota limiti legitim trafikni kesadi. Limitni o'lchangan yuklamaga qarab sozlang, o'ylab topilgan raqamga emas.
- IP asosidagi limit korporativ NAT ortidagi mijozlarni bir butun deb hisoblaydi va ularni jazolaydi. IP'ni yagona kalit sifatida ishlatmang.
- Limit noto'g'ri xavfsizlik hissini beradi: u biznes mantiqini yoki avtorizatsiyani himoya qilmaydi. Har tenant o'z ma'lumotini o'qiy olishi bilan bir qatorda boshqasinikini ko'ra olsa, limit uni to'xtatmaydi, faqat sekinlashtiradi.
- Hamma narsani bitta limit bilan bog'lash kamdan-kam ishlaydi. Qo'pol (gateway) va aniq (ilova) limitlarni ajrating.

## Stack'da: NestJS Throttler, Fastify va Redis

NestJS'da `@nestjs/throttler` paketi `ThrottlerModule.forRoot` ichida `ttl` (millisekundda) va `limit` qabul qiladi. Hujjatda bir nechta nomli throttler (masalan, `short`: 1 soniyada 3, `medium`: 10 soniyada 20, `long`: 1 daqiqada 100) tasvirlangan; ularga `@Throttle()` va `@SkipThrottle()` dekoratorlari bilan route darajasida murojaat qilinadi. `ThrottlerGuard` global bog'lanadi (`APP_GUARD`). Quyidagi sozlama shu qismlarni ko'rsatadi.

```ts
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { Throttle, ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { Controller, Post } from "@nestjs/common";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      { name: "short", ttl: 1000, limit: 3 },
      { name: "long", ttl: 60000, limit: 100 },
    ]),
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}

@Controller("auth")
export class AuthController {
  // login uchun qattiqroq limit: 15 daqiqada 5 urinish
  @Throttle({ long: { ttl: 15 * 60 * 1000, limit: 5 } })
  @Post("login")
  login() {
    return { ok: true };
  }
}
```

Uch narsani unutmang. Birinchisi, proxy ortida adapterda `trust proxy` sozlash shart (Express'da `app.set('trust proxy', ...)`, Fastify va Node adapterida `trustProxy` opsiyasi), aks holda hamma so'rov proxy manzilidan keladi va bitta kalitga aylanadi. NestJS hujjati ogohlantiradi: Fastify v5.12.1 va undan keyingi versiyalarda `trustProxy` ga son (hop soni, masalan `1`) berilsa, Fastify hech bir proxy'ga ishonmaydi, `request.ip` proxy manzili bo'lib qoladi va throttler proxy ortidagi barcha mijozni bitta deb sanaydi; shuning uchun proxy manzili yoki diapazonini yozing. Hujjat Fastify'da standart tracker (`request.ip`) ni saqlashni tavsiya qiladi. Ikkinchisi, WebSocket gateway uchun hujjatga ko'ra `ThrottlerGuard` ni kengaytirib `handleRequest()` ni o'zgartirish kerak (77-dars). Uchinchisi, ko'p instance uchun umumiy storage kerak. Ichki storage xotirada turadigan kesh, shuning uchun u har instance uchun alohida hisoblaydi; `storage` opsiyasiga `ThrottlerStorage` interfeysini amalga oshiruvchi sinf berish mumkin va taqsimlangan serverlar uchun hujjat hamjamiyat Redis storage provayderini ko'rsatadi. Qo'shimcha opsiyalar: `blockDuration` (limitga yetgandan keyin so'rovlar bloklanadigan millisekundlar, standart qiymati `ttl`), `getTracker()` (kalitni o'zgartirish) va `skipIf`. Aynan `getTracker()` kalit tanlashni boshqaradi: unda autentifikatsiyalangan foydalanuvchi bo'lsa uning identifikatorini, bo'lmasa `req.ip` ni qaytarish mumkin. Fastify'ning o'z rate-limit plagini (`@fastify/rate-limit`) bor; uning sozlamalari bu darsning manbalarida yo'q, shuning uchun bu yerda tavsiflanmaydi. Real Redis 7 va NestJS throttler 6 bilan sinov natijalari: yuqoridagi `@Throttle({ long: ... })` faqat `long` ni almashtiradi, `short` (1 soniyada 3) qoladi, shuning uchun login'ga 4-so'rov birinchi soniyadayoq 429 oldi; tana `ThrottlerException: Too Many Requests`, nomli throttler'lar bilan sarlavhalar `Retry-After-short`, `Retry-After-long` va `X-RateLimit-*-short/long` ko'rinishida (oddiy `Retry-After` emas). Express'da `trust proxy` yoqilmaganda har so'rovda boshqa `X-Forwarded-For` yuborish limitni chetlab o'tmadi (4-so'rovdan 429), `trust proxy: true` bilan esa 6 ta so'rovning hammasi o'tdi. Fastify 5.12.8 da `trustProxy: 1` bilan `request.ip` proxy manzilida qoldi, `"127.0.0.1"` bilan esa `X-Forwarded-For` dan ishonchsiz qism olindi. Lua skripti 20 parallel so'rovdan aynan 5 tasini o'tkazdi va kalit TTL'i o'rnatildi.

## Xulosa

- Resursni cheklamaslik (API4) faqat chastota emas: so'rov soni, payload o'lchami, qaytariladigan yozuvlar, parallellik va pullik integratsiyalar xarajati ham cheklanadi.
- Fixed window oyna chegarasida limitning ikki barobarigacha burst o'tkazadi; sliding window va token bucket buni yumshatadi. Narx asosidagi limit uchun token bucket qulay.
- Kalit hujumchi boshqara oladigan qiymat bo'lmasin: `X-Forwarded-For` ga faqat ishonchli proxy qo'shgan qismida ishoning, autentifikatsiyadan keyin esa foydalanuvchi va tenant kalitiga o'ting.
- Taqsimlangan hisoblagich atomik bo'lsin (INCR va muddat birga) va storage uzilganda xatti-harakat oldindan, endpoint xavfiga qarab tanlansin.
- Brute force limiti akkaunt kaliti bilan qurbonni bloklashga aylanmasligi kerak: kalitlarni birlashtiring yoki kechikishni oshiring.
- Limit avtorizatsiyani va biznes mantiq tekshiruvini almashtirmaydi; u zararni sekinlashtiradi va cheklaydi.
