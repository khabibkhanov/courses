---
n: 29
slug: deserialization-prototype-pollution
title: "Deserialization va prototype pollution"
summary: "Deserialization: ishonchsiz ma'lumotdan obyekt tiklash jarayoni kodga yoki tuzilmaga ta'sir qilishi. JavaScript'da asosiy shakllari - tur nomi bo'yicha obyekt yaratish va prototype pollution. Dars ikkala mexanizmni mini-modelda ko'rsatadi: allow-list, xavfsiz merge, Map va null-prototype obyektlar."
duration: 50
sources:
  - id: t10-a08
    note: "A08 Software or Data Integrity Failures: kategoriya notable CWE'lari orasida CWE-502 (Deserialization of Untrusted Data) va CWE-915 (Improperly Controlled Modification of Dynamically-Determined Object Attributes); insecure deserialization misoli"
  - id: node-security
    note: "Node.js Security Best Practices, Prototype Pollution Attacks (CWE-1321) bo'limi: Node.js yadrosi zaifligi emas, lekin ilova va bog'liqliklar uchun jiddiy xavf; tavsiyalar: xavfsiz bo'lmagan rekursiv merge'dan qochish, JSON Schema validatsiyasi, Object.create(null), prototiplarni muzlatish, --disable-proto, Object.hasOwn"
  - id: cs-deser
    note: "Deserialization Cheat Sheet: ta'rif (serialization/deserialization), JSON hozir eng keng tarqalgan format, native formatlar ko'proq imkon beradi va ishonchsiz ma'lumotda zararli maqsadda ishlatilishi mumkin (DoS, kirish nazorati, RCE); pickle va PyYAML unsafe loader misollari; Java uchun class allow-list va serialization filtering"
  - id: cs-proto
    note: "Prototype Pollution Prevention Cheat Sheet: Set/Map ishlatish, Object.create(null) va {__proto__: null}, Object.freeze (shallow) va Object.seal (mavjud qiymatlar o'zgarishini to'smaydi), --disable-proto=delete defense in depth, constructor.prototype orqali baribir mumkin"
  - id: cs-input
    note: "Input Validation Cheat Sheet: bog'lanadigan maydonlarni faqat mo'ljallanganlar bilan cheklash (Mass Assignment bilan bog'liq) va rad etish"
  - id: asvs
    note: "ASVS 5.0.0: 1.5.2 (ishonchsiz ma'lumotni deserialize qilishda ob'ekt turlari allow-list'i, ma'lum xavfsiz bo'lmagan mexanizmlardan foydalanmaslik, Level 2) va 15.3.6 (JavaScript'da prototype pollution oldini olish, masalan Set() yoki Map(), Level 2)"
quiz:
  - q: "JSON.parse bilan `{\"__proto__\": {\"isAdmin\": true}}` o'qildi va natija o'zi hech narsani o'zgartirmadi. Pollution qaerda yuz beradi?"
    options:
      - "JSON.parse'ning o'zida"
      - "`JSON.stringify` da"
      - "Hech qayerda: JSON xavfsiz"
      - "Keyingi rekursiv merge/assign: `target[\"__proto__\"]` Object.prototype ga yetib, uning ichiga yoziladi"
    answer: 3
    explain: "JSON.parse `__proto__` ni oddiy own property sifatida yaratadi. Zarar rekursiv merge, deep clone yoki `Object.assign` kabi funksiya shu kalitni `target[key]` orqali o'qiganda, ya'ni prototipga yetib borganda boshlanadi."
  - q: "`merge` funksiyasidagi `__proto__` kalitini o'tkazib yuborish tuzatildi. Hujumchi `{\"constructor\": {\"prototype\": {\"isAdmin\": true}}}` yuboradi. Nima bo'ladi?"
    options:
      - "Hech narsa: `constructor` xavfsiz kalit"
      - "Hujum ishlaydi: `target.constructor.prototype` yana Object.prototype ga olib boradi; `constructor` va `prototype` kalitlari ham to'silishi kerak"
      - "Faqat Node.js 12 da ishlaydi"
      - "Xato tashlanadi"
    answer: 1
    explain: "`{}.constructor` Object funksiyasi, `.prototype` esa Object.prototype. Shuning uchun faqat `__proto__` ni to'sish yetmaydi (cheat sheet ham `constructor.prototype` yo'li qolishini aytadi). Eng ishonchli yo'l: kalitlarni ro'yxat bilan cheklash yoki Map/null-prototype obyektlar."
  - q: "Quyidagilardan qaysi biri prototype pollution'ni strukturaviy yopadi?"
    options:
      - "Kalitlar to'plamini `Map` da yoki `Object.create(null)` obyektda saqlash (prototipi yo'q)"
      - "`JSON.parse` o'rniga `eval` ishlatish"
      - "Kalitlarni lowercase qilish"
      - "Faqat ASCII kalitlarni qabul qilish"
    answer: 0
    explain: "Prototipi bo'lmagan yoki Map'da saqlanadigan kalitlar `__proto__` orqali Object.prototype ga yetmaydi. ASVS 15.3.6 ham `Set()` yoki `Map()` ni misol qilib keltiradi. Lowercase va ASCII filtri `__proto__` va `constructor` ni o'tkazadi."
  - q: "Ilova `{\"$type\": \"CleanupJob\", \"arg\": \"/data\"}` kabi JSON'dan tur nomi bo'yicha obyekt yaratadi (`new REGISTRY[o.$type](o.arg)`) va ro'yxatda ichki sinflar ham bor. Qaysi tuzatish yetarli?"
    options:
      - "`$type` ni lowercase qilish"
      - "JSON'ni Base64 bilan kodlash"
      - "Faqat ma'lumot tashuvchi sinflar uchun allow-list va har tur uchun maydon validatsiyasi; yon ta'sirli sinflar ro'yxatda bo'lmaydi"
      - "Ro'yxatga `try/catch` qo'shish"
    answer: 2
    explain: "Xavf: kiritish qaysi sinf yaratilishini va ctor argumentini tanlaydi. ASVS 1.5.2 ob'ekt turlari allow-list'ini talab qiladi. Base64 yoki lowercase hech narsani o'zgartirmaydi; try/catch yon ta'sirni to'xtatmaydi."
  - q: "Cookie ichida `JSON.stringify` qilingan foydalanuvchi obyekti (rol maydoni bilan) turadi va imzolanmagan. Bu qaysi OWASP kategoriyasi bilan bog'liq?"
    options:
      - "A08 Software or Data Integrity Failures: mijoz ko'ra va o'zgartira oladigan seriyalangan ma'lumotga ishonish (yaxlitlikni tekshirmaslik)"
      - "A09 Logging"
      - "Faqat XSS"
      - "Hech qaysi"
    answer: 0
    explain: "A08 sahifasi mijoz ko'ra va o'zgartira oladigan seriyalangan strukturaga ishonishni insecure deserialization misoli sifatida ko'rsatadi. Yechim: ma'lumotni serverda saqlash yoki imzolash va tekshirish, hamda deserialize qilingan qiymatni validatsiya qilish."
  - q: "`Object.freeze(Object.prototype)` prototype pollution'ga qarshi qanday yordam beradi va nimasi cheklangan?"
    options:
      - "To'liq himoya qiladi: boshqa hech narsa kerak emas"
      - "Hech qanday yordam bermaydi"
      - "Faqat brauzerda ishlaydi"
      - "Prototipga yangi xususiyat qo'shishni va mavjudlarini o'zgartirishni to'sadi, lekin shallow (ichkaridagi obyektlar o'zgarishi mumkin) va prototiplarni o'zgartiradigan kutubxonalarni buzishi mumkin; shuning uchun kod darajasidagi tuzatish bilan birga defense in depth"
    answer: 3
    explain: "Cheat sheet freeze'ning shallow ekanini va mos kelishini oldin sinab ko'rish kerakligini aytadi. U yordamchi qatlam, merge funksiyasini tuzatish yoki Map ishlatishning o'rnini bosmaydi."
task:
  title: "Deep merge: prototipga yetib bormaslik"
  prompt: |
    `merge(target, source)` konfiguratsiya obyektlarini rekursiv birlashtiradi va foydalanuvchi JSON'ini sozlamalarga qo'shish uchun ishlatiladi. U ikki yo'l bilan `Object.prototype` ga yetadi: `__proto__` kaliti va `constructor.prototype` zanjiri.

    Tuzating: `__proto__`, `constructor` va `prototype` kalitlari o'tkazib yuborilsin, faqat `target` ning o'z (own) obyektlari ichiga rekursiv kirilsin, qolgan kalitlar oddiy yoziladi. Imzoni o'zgartirmang. Kutilgan natija: ikkala hujumdan keyin `({}).p1` va `({}).p2` `undefined`, oddiy kalit esa birlashtiriladi.
  lang: ts
  starter: |
    function merge(target: any, source: any): any {
      for (const k in source) {
        const v = source[k];
        if (v !== null && typeof v === "object") target[k] = merge(target[k] ?? {}, v);
        else target[k] = v;
      }
      return target;
    }

    const settings = merge({ theme: "light" }, JSON.parse('{"theme":"dark","units":{"fuel":"l"}}'));
    console.log(JSON.stringify(settings));

    merge({}, JSON.parse('{"__proto__":{"p1":true}}'));
    // qat'iy rejimda oxirgi yozuv xato tashlashi mumkin, lekin pollution allaqachon yuz bergan
    try { merge({}, JSON.parse('{"constructor":{"prototype":{"p2":true}}}')); } catch {}
    console.log("p1:", ({} as any).p1);
    console.log("p2:", ({} as any).p2);
  solution: |
    const BLOCKED = new Set(["__proto__", "constructor", "prototype"]);
    const isObj = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === "object" && !Array.isArray(v);

    function merge(target: any, source: any): any {
      for (const k of Object.keys(source)) {
        if (BLOCKED.has(k)) continue;
        const v = source[k];
        if (isObj(v)) {
          const base = Object.hasOwn(target, k) && isObj(target[k]) ? target[k] : {};
          target[k] = merge(base, v);
        } else {
          target[k] = v;
        }
      }
      return target;
    }

    const settings = merge({ theme: "light" }, JSON.parse('{"theme":"dark","units":{"fuel":"l"}}'));
    console.log(JSON.stringify(settings));

    merge({}, JSON.parse('{"__proto__":{"p1":true}}'));
    // qat'iy rejimda oxirgi yozuv xato tashlashi mumkin, lekin pollution allaqachon yuz bergan
    try { merge({}, JSON.parse('{"constructor":{"prototype":{"p2":true}}}')); } catch {}
    console.log("p1:", ({} as any).p1);
    console.log("p2:", ({} as any).p2);
  solutionNotes: |
    - `Object.keys` faqat own kalitlarni qaytaradi. JSON.parse yaratgan own `__proto__` kaliti esa baribir ro'yxatda bo'ladi, shuning uchun u aniq `BLOCKED` bilan o'tkazib yuboriladi. `constructor` va `prototype` ham: faqat `__proto__` ni to'sish yetmaydi.
    - `Object.hasOwn(target, k)` rekursiyaga faqat target'ning o'z obyektlari ichiga kirishga ruxsat beradi; meros bo'lib kelgan qiymatlar (`target.constructor`) ichiga kirilmaydi.
    - Eng ishonchli variant: umuman rekursiv merge ishlatmaslik. Sozlamalar uchun sxema bilan ruxsat etilgan maydonlarni tanlash (72-dars), dinamik kalitlar uchun `Map`.
    - Qoplanmaydi: massivlar va boshqa tur yo'llari (bu funksiya ularni qiymat sifatida yozadi), kutubxonalardagi (lodash, minimist kabi) boshqa merge funksiyalari, `--disable-proto=delete` kabi sozlamalar (yordamchi qatlam). Bog'liqliklarni yangilab turish (81-dars).
  checklist:
    - "`__proto__`, `constructor`, `prototype` kalitlari o'tkazib yuboriladi"
    - "Rekursiya faqat target'ning own obyektlari ichiga kiradi"
    - "Oddiy kalitlar (`theme`, `units`) hamon birlashtiriladi"
    - "Ikkala hujum yo'lidan keyin `({}).p1`, `({}).p2` `undefined`"
    - "Map/null-prototype va sxema bilan tanlash afzalligini ayta olasiz"
---

## Muammo

JSON'ni obyektga aylantirish ilovaning har bir qatlamida bo'ladi: HTTP body, Redis'dagi sessiya, navbat xabari, konfiguratsiya fayli, cookie. Dasturchi uchun `JSON.parse` oddiy va xavfsiz. Ko'p holda shunday: `JSON.parse` faqat ma'lumot (obyekt, massiv, satr, raqam) yaratadi va kod bajarmaydi. Muammo undan keyin boshlanadi: olingan obyekt bilan nima qilinadi. Uni boshqa obyektga rekursiv birlashtirasizmi, `class-transformer` bilan sinfga aylantirasizmi, `$type` maydoniga qarab obyekt yaratasizmi, imzolanmagan cookie sifatida mijozga qaytarasizmi.

OWASP Top 10:2025 da bu mavzu A08 Software or Data Integrity Failures ostida. A08 sahifasi kategoriyaning notable CWE'lari orasida CWE-502 (Deserialization of Untrusted Data) va CWE-915 (Improperly Controlled Modification of Dynamically-Determined Object Attributes) ni sanaydi. CWE-915 JavaScript'dagi prototype pollution va mass assignment (54-dars) bilan yaqin. Sahifa insecure deserialization misolini ham keltiradi: ilova foydalanuvchi holatini seriyalab har so'rovda aylantirib yuboradi, hujumchi esa seriyalangan strukturani ko'rib, o'zgartiradi. Bu holda sahifa Java misolini beradi; mantiq Node.js uchun ham xuddi shu: mijoz ko'ra oladigan va o'zgartira oladigan seriyalangan ma'lumotga ishonish.

JavaScript'ning o'ziga xos xavfi prototype pollution: dinamik tilda har obyekt prototip zanjiriga ega, zanjirning oxiri esa `Object.prototype` va unga yozilgan xususiyat butun jarayondagi barcha obyektlarda ko'rinadi. Bitta rekursiv `merge` xatosi butun jarayonning "admin" bayrog'ini o'zgartirishi mumkin. Dars ikkala mexanizmni 21-darsdagi modelga bog'laydi: ma'lumot (kalit va qiymat) boshqaruvga (qaysi sinf yaratiladi, qaysi prototip o'zgaradi) aylanadi.

## Asosiy g'oya

### Deserialization nima uchun xavfli

Serializatsiya obyektni saqlash yoki uzatish uchun formatga aylantiradi, deserializatsiya esa uni qayta obyektga qaytaradi. OWASP Deserialization Cheat Sheet qayd etadi: JSON hozir eng keng tarqalgan format, lekin ko'p tillarning o'z native formatlari bor va ular ko'proq xususiyat beradi, shu jumladan seriyalash jarayonini sozlash; ishonchsiz ma'lumot ustida bu xususiyatlar zararli maqsadda ishlatilishi mumkin. Hujumlar DoS, kirish nazorati yoki masofadan kod bajarilishiga olib kelishi mumkin.

Mexanizm: format ma'lumotdan tashqari "qaysi tur" va "qanday tiklash" ma'lumotini ham tashiydi, deserializer esa bu ma'lumotga ishonib, kod (konstruktor, hook, getter) ishga tushiradi. Hujumchi tur va maydonlarni tanlaydi. Cheat sheet bir nechta tilga xos misol beradi (Python `pickle`, PyYAML unsafe loader, Java `ObjectInputStream`); Node.js uchun umumiy qoida shunday: faqat ma'lumot formatini (JSON) ishlating va undan sinf yaratishni o'zingiz qat'iy ro'yxat bilan bajaring.

ASVS 5.0.0 V1.5 bo'limi buni talab qiladi: 1.5.2 ishonchsiz ma'lumotni deserialize qilishda xavfsiz ishlov berishni (masalan, obyekt turlari allow-list'i yoki mijoz belgilaydigan turlarni cheklash) va aniq xavfsiz emas deb belgilangan mexanizmlarni ishonchsiz kirish bilan ishlatmaslikni talab qiladi (Level 2). Bu 21-darsdagi allow-list tamoyilining aynan o'zi.

### Prototype pollution

JavaScript'da `obj.x` o'qilganda `obj` da `x` bo'lmasa, prototip zanjiri bo'ylab qidiriladi; `{}` ning prototipi `Object.prototype`. `obj.__proto__` va `obj.constructor.prototype` ikkalasi ham shu prototipga olib boradi. Agar kod kalitni foydalanuvchi bergan holda `target[k] = value` desa va `k` `__proto__` bo'lsa, `target[k]` allaqachon `Object.prototype` bo'lib, rekursiv `merge` unga yozadi. OWASP Prototype Pollution Prevention Cheat Sheet buni umumiy ta'rif bilan tasvirlaydi: hujumchi ilovaning JavaScript obyektlari va xususiyatlarini boshqara oladi, bu esa ma'lumotga ruxsatsiz kirish, huquq oshirish va hatto masofadan kod bajarilishiga olib kelishi mumkin.

Muhim nozik jihat: `JSON.parse('{"__proto__": {...}}')` zararsiz: u `__proto__` ni oddiy own kalit sifatida yaratadi va prototipni o'zgartirmaydi. Zarar keyingi bosqichda: shu obyekt rekursiv `merge`, deep clone yoki `Object.assign`-ga o'xshash kod orqali boshqa obyektga yoziladi.

## Chuqurroq: himoya va nozik holatlar

### Cheat sheet tavsiyalari

OWASP Prototype Pollution Prevention Cheat Sheet quyidagilarni tavsiya qiladi:

- Obyekt literallari o'rniga `new Set()` yoki `new Map()` ishlatish.
- Obyekt kerak bo'lsa, `Object.create(null)` bilan prototipsiz obyekt yaratish; literal kerak bo'lsa, oxirgi chora sifatida `{ __proto__: null }`.
- `Object.freeze()` bilan o'rnatilgan prototiplarni muzlatish. Cheat sheet freeze'ning shallow ekanini va mos kelish uchun oldindan sinash kerakligini yozadi; `Object.seal()` esa mavjud xususiyat qiymatlarining o'zgarishini to'smaydi, unga tayanmang.
- Node.js'ning `--disable-proto=delete` bayrog'i `__proto__` xususiyatini olib tashlaydi. Cheat sheet buni defense in depth deb ataydi va `constructor.prototype` orqali pollution baribir mumkinligini ta'kidlaydi.

ASVS 15.3.6 shu g'oyani talabga aylantiradi: JavaScript kodi prototype pollution'ning oldini oladigan tarzda yozilishi kerak, masalan obyekt literallari o'rniga `Set()` yoki `Map()` bilan (Level 2).

### Qaysi kod pollution'ga olib keladi

Xavfli andozalar: rekursiv merge yoki deep clone funksiyalari kalitni filtrlashsiz qabul qiladi; `obj[a][b] = c` kabi dinamik yo'l bo'yicha yozish (`lodash.set` ga o'xshash, `a` va `b` foydalanuvchidan); query string parser'lari (`?a[__proto__][x]=1`) obyektga aylantirganda; konfiguratsiya birlashtirish. Node.js Security Best Practices sahifasi ham xavfni shunday baholaydi: kirish ma'lumotiga bog'liq prototype pollution Node.js yadrosining zaifligi emas, ilova va bog'liqliklar uchun jiddiy xavf. Sahifa xavfsiz bo'lmagan rekursiv merge'dan qochish, ishonchsiz kirishni JSON Schema bilan tekshirish, `Object.create(null)`, prototiplarni muzlatish, `--disable-proto` bayrog'i va kalitni `Object.hasOwn(obj, key)` bilan tekshirishni sanaydi. Node.js loyihasining o'z xavfsizlik siyosati ham (SECURITY.md) shuni aytadi: Node.js ilova kodi bergan kirishga ishonadi, uni tozalash ilovaning vazifasi, shuning uchun foydalanuvchi kiritishini boshqarishni talab qiladigan stsenariy Node.js zaifligi hisoblanmaydi. Bog'liqliklarda ham shunday zaifliklar uchragan: bu 81-darsda ko'riladigan supply chain mavzusiga tegadi.

### Pollution oqibati

Prototipga yozilgan qiymat shu jarayondagi hamma obyektda ko'rinadi. Oqibat kodga bog'liq: `if (user.isAdmin)` kabi tekshiruvlar yolg'on `true` beradi (huquq oshishi), `options.shell` kabi default qiymatlarni kutayotgan kutubxona kodlari o'zgaradi (xatti-harakat o'zgarishi, ba'zan kod bajarilishi), yoki ilova qulaydi (DoS). Shuning uchun mulohaza: bitta so'rov boshqa foydalanuvchilarga ham ta'sir qiladi, chunki prototip jarayon bo'yicha umumiy. Node.js jarayoni ko'p so'rovni xizmat qilgani uchun pollution, kamida jarayon qayta ishga tushguncha, saqlanib qoladi.

### Tur nomi bo'yicha obyekt yaratish

`{ "$type": "Report", ... }` kabi polimorf JSON'ni sinfga aylantirish uchun kod tur nomini sinfga bog'laydi. Agar bog'lash barcha sinflarni qamrab olsa (global registry, `require(o.type)`, dinamik import), kiritish qaysi kod ishlashini tanlaydi. Xavfsiz variant: ro'yxat faqat ma'lumot sinflaridan iborat, har tur o'z maydonlarini validatsiya qiladi, ro'yxatni `Object.hasOwn` bilan tekshirish (aks holda `constructor` kabi nomlar prototipdan keladi).

### Test va aniqlash

Pollution'ni aniqlash uchun birlik testi qo'shing: hujum shakllarini (`__proto__`, `constructor.prototype`) funksiyaga bering va keyin yangi `{}` obyektida kutilmagan xususiyat paydo bo'lmaganini tekshiring. Test oxirida prototipni tozalash kerak, aks holda keyingi testlar buziladi. Ishlab chiqarishda yangi obyektlarda kutilmagan xususiyatlar (`isAdmin`, `polluted`) paydo bo'lsa, bu jarayon ichidagi pollution belgisi; unga qarshi jarayonni qayta ishga tushirish vaqtinchalik chora, sababni topish va tuzatish asosiy chora.

## Misol: mini-modelda

Ikki mexanizm: rekursiv merge (pollution) va tur nomi bo'yicha obyekt yaratish. Ikkalasi ham faqat shu o'quv koduga qarshi; "yon ta'sir" modelda faqat jurnalga yozuv.

### 1. Zaif kod

```ts run
// ZAIF 1: kalitlar filtrlanmaydigan rekursiv merge
function merge(target: any, source: any): any {
  for (const k in source) {
    const v = source[k];
    if (v !== null && typeof v === "object") target[k] = merge(target[k] ?? {}, v);
    else target[k] = v;
  }
  return target;
}

// ZAIF 2: tur nomi bo'yicha obyekt yaratish; ro'yxatda yon ta'sirli sinf ham bor
const effects: string[] = [];
class Report { constructor(public title: string) {} }
class CleanupJob { constructor(public path: string) { effects.push("modelda tozalandi: " + path); } }
const REGISTRY: Record<string, new (a: any) => unknown> = { Report, CleanupJob };
function reviveWeak(json: string): unknown {
  const o = JSON.parse(json);
  return new REGISTRY[o.$type](o.arg);
}

const settings = merge({ theme: "light" }, JSON.parse('{"theme":"dark"}'));
console.log("sozlama:", JSON.stringify(settings));
console.log("oddiy revive:", JSON.stringify(reviveWeak('{"$type":"Report","arg":"Oylik"}')));
```

```text
sozlama: {"theme":"dark"}
oddiy revive: {"title":"Oylik"}
```

### 2. Hujum

"alfa" foydalanuvchisi profil sozlamalari JSON'ini yuboradi. Birinchi hujum `__proto__` kalitini ishlatadi, ikkinchisi tur nomini ichki sinfga o'zgartiradi.

```ts run
function merge(target: any, source: any): any {
  for (const k in source) {
    const v = source[k];
    if (v !== null && typeof v === "object") target[k] = merge(target[k] ?? {}, v);
    else target[k] = v;
  }
  return target;
}
const effects: string[] = [];
class Report { constructor(public title: string) {} }
class CleanupJob { constructor(public path: string) { effects.push("modelda tozalandi: " + path); } }
const REGISTRY: Record<string, new (a: any) => unknown> = { Report, CleanupJob };
function reviveWeak(json: string): unknown {
  const o = JSON.parse(json);
  return new REGISTRY[o.$type](o.arg);
}

const dbUser: any = { name: "ali" }; // bazadan o'qilgan oddiy foydalanuvchi
console.log("hujumdan oldin isAdmin:", dbUser.isAdmin);
merge({}, JSON.parse('{"__proto__": {"isAdmin": true}}'));
console.log("hujumdan keyin isAdmin:", dbUser.isAdmin, "| yangi obyekt:", ({} as any).isAdmin);

reviveWeak('{"$type":"CleanupJob","arg":"/data/clips"}');
console.log("yon ta'sir:", effects);
```

```text
hujumdan oldin isAdmin: undefined
hujumdan keyin isAdmin: true | yangi obyekt: true
yon ta'sir: [ 'modelda tozalandi: /data/clips' ]
```

Birinchi hujumdan keyin bazadan o'qilgan `dbUser` (u `isAdmin` ni hech qachon o'rnatmagan) ham `isAdmin: true` ko'rsatadi, chunki qiymat `Object.prototype` ga yozilgan va hamma obyektda ko'rinadi. Ikkinchi hujumda kiritish ichki sinfni tanladi va konstruktor ishga tushdi. Real tizimda ikkala holat ilovaning boshqa joylarida tekshiruvlarni aylanib o'tish yoki kod bajarilishiga olib kelishi mumkin; bu yerda faqat mexanizm.

### 3. Tuzatilgan kod

```ts run
const BLOCKED = new Set(["__proto__", "constructor", "prototype"]);
const isObj = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === "object" && !Array.isArray(v);

function merge(target: any, source: any): any {
  for (const k of Object.keys(source)) {
    if (BLOCKED.has(k)) continue;
    const v = source[k];
    if (isObj(v)) {
      const base = Object.hasOwn(target, k) && isObj(target[k]) ? target[k] : {};
      target[k] = merge(base, v);
    } else target[k] = v;
  }
  return target;
}

// Tur allow-list: faqat ma'lumot sinflari, har biri o'z maydonini tekshiradi
class Report { constructor(public title: string) {} }
const FACTORIES = new Map<string, (arg: unknown) => unknown>([
  ["Report", (arg) => {
    if (typeof arg !== "string" || arg.length > 100) throw new Error("title noto'g'ri");
    return new Report(arg);
  }],
]);
function revive(json: string): unknown {
  const o = JSON.parse(json);
  const make = FACTORIES.get(String(o.$type));
  if (!make) throw new Error("tur ruxsat etilmagan: " + String(o.$type));
  return make(o.arg);
}

const dbUser: any = { name: "ali" };
merge({}, JSON.parse('{"__proto__": {"isAdmin": true}}'));
merge({}, JSON.parse('{"constructor": {"prototype": {"isAdmin": true}}}'));
console.log("isAdmin:", dbUser.isAdmin);
console.log("birlashgan:", JSON.stringify(merge({ theme: "light" }, JSON.parse('{"theme":"dark","units":{"fuel":"l"}}'))));
console.log("revive:", JSON.stringify(revive('{"$type":"Report","arg":"Oylik"}')));
for (const bad of ['{"$type":"CleanupJob","arg":"/data"}', '{"$type":"constructor","arg":"x"}']) {
  try { revive(bad); } catch (e) { console.log("rad etildi:", (e as Error).message); }
}
```

```text
isAdmin: undefined
birlashgan: {"theme":"dark","units":{"fuel":"l"}}
revive: {"title":"Oylik"}
rad etildi: tur ruxsat etilmagan: CleanupJob
rad etildi: tur ruxsat etilmagan: constructor
```

Nima uchun yetarli: invariant "kiritilgan kalit hech qachon prototipga yetmaydi va kiritilgan tur nomi faqat ro'yxatdagi ma'lumot fabrikalarini tanlaydi". `__proto__`, `constructor` va `prototype` kalitlari bloklandi, rekursiya faqat own obyektlarga kiradi, shuning uchun ikkala pollution yo'li (shu jumladan `constructor.prototype`) yopildi. Tur ro'yxati `Map` da, ya'ni `constructor` kabi nomlar prototipdan kelmaydi, va har fabrika maydonini tekshiradi. Yopilmagan: boshqa merge/clone funksiyalari (kutubxonalarda), massivlar va boshqa tuzilma yo'llari, sxema bilan maydonlarni cheklash (72-dars), deserialize qilingan ma'lumotning ishonchliligi (imzo, 62-63-darslar) va `--disable-proto=delete` kabi yordamchi qatlamlar.

## Qachon qo'llamaslik kerak

- Har ilovada `Object.freeze(Object.prototype)` yoki `--disable-proto=delete` yoqishga shoshilmang. Cheat sheet bu choralarni yordamchi qatlam deb ataydi va mosligini oldindan sinashni aytadi: ayrim kutubxonalar prototiplarni o'zgartiradi va buzilishi mumkin. Avval kod darajasidagi tuzatish, keyin yordamchi qatlam.
- Hamma obyektni `Map` ga o'tkazish shart emas. Struktura aniq va maydonlar ma'lum bo'lsa, sxema (zod kabi) bilan ruxsat etilgan maydonlarni tanlab olish soddaroq. Map dinamik kalitlar uchun.
- Rekursiv deep merge'ni o'zingiz yozishga urinmang. Oddiy holatlarda `{ ...a, ...b }` (yuzaki) yetadi; chuqur birlashtirish haqiqatan kerak bo'lsa, sinalgan kutubxonani oxirgi versiyada ishlating va kalit filtrini sinab ko'ring.
- Polimorf deserializatsiyani butunlay taqiqlash shart emas. Muammo ro'yxatning kengligida: tur allow-list'i tor va fabrikalar maydonni tekshirsa, bu xavfsiz.
- Native binar yoki dasturlash tiliga xos serializatsiya formatlarini (cheat sheet misollari: `pickle`, Java `Serializable`) ishonchsiz ma'lumot bilan ishlatmang. Bunday ma'lumot uchun JSON va aniq sxema.

## Stack'da: Node.js

NestJS va Next.js'da kirish ma'lumoti odatda DTO sxemasi orqali o'tadi. Quyidagi kod ishga tushirilmaydi (zod va NestJS brauzer worker'ida mavjud emas), faqat TypeScript sintaksisi tekshirilgan.

```ts
import { z } from "zod";

// Sxema ruxsat etilgan maydonlarni tanlaydi: __proto__, constructor kabi kalitlar "strict" rejimda rad etiladi
const ProfileSettings = z
  .object({
    theme: z.enum(["light", "dark"]).default("light"),
    units: z.object({ fuel: z.enum(["l", "gal"]) }).strict().optional(),
  })
  .strict();

export function parseSettings(body: unknown) {
  return ProfileSettings.parse(body);
}

// Dinamik kalitlar: Map yoki prototipsiz obyekt
export function groupByVehicle(rows: { vehicleId: string; fuel: number }[]) {
  const m = new Map<string, number[]>();
  for (const r of rows) {
    const list = m.get(r.vehicleId) ?? [];
    list.push(r.fuel);
    m.set(r.vehicleId, list);
  }
  return m; // `{}` o'rniga: vehicleId "__proto__" bo'lsa ham xavfsiz
}
```

`.strict()` sxemada ko'rsatilmagan kalitlarni xato qiladi. Shunga qaramay sxema kutubxonasi o'rniga o'z testingizni yozing: `__proto__` va `constructor` kalitli JSON'ni sxemaga bering va natija (yoki xato) kutilganidek ekanini, keyin yangi `{}` da kutilmagan xususiyat yo'qligini tekshiring. `groupByVehicle` misoli: foydalanuvchi bergan ID obyekt kaliti bo'lib qolgan joyda `Map` ishlating. Next.js'da server action va route handler kirishlariga ham xuddi shu qoida qo'llanadi (58-dars). Bog'liqliklar ichidagi pollution zaifliklari uchun `npm audit` va yangilash (81-82-darslar).

## Xulosa

- Deserialization xavfi seriyalangan ma'lumot tur va tiklash ma'lumotini tashishida: kiritish qaysi kod ishlashini tanlasa, bu A08 (CWE-502, CWE-915) ga kiradi. JSON o'zi kod bajarmaydi, xavf undan keyingi ishlov bilan keladi.
- Tur nomi bo'yicha obyekt yaratishda tor allow-list va har tur uchun maydon validatsiyasi kerak (ASVS 1.5.2).
- Prototype pollution: `__proto__` va `constructor.prototype` orqali `Object.prototype` ga yozish butun jarayondagi hamma obyektga ta'sir qiladi. `JSON.parse` o'zi zararsiz, zarar rekursiv merge/clone/dinamik yozishda.
- Himoya: Map/Set yoki prototipsiz obyektlar (ASVS 15.3.6), kalit filtri, sxema bilan maydonlarni tanlash. `Object.freeze` va `--disable-proto=delete` yordamchi qatlam.
- Mijoz ko'ra oladigan seriyalangan ma'lumot (cookie, token) serverda saqlanishi yoki imzolanib tekshirilishi va deserialize qilingandan keyin validatsiya qilinishi kerak.
- Tuzatish chegarasini yozing: boshqa merge funksiyalari, bog'liqliklar, imzo va yordamchi qatlamlar.
