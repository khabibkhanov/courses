---
n: 21
slug: injection-umumiy-model
title: "Injection'ning umumiy modeli: ma'lumot va kod chegarasi"
summary: "Injection - kiritilgan ma'lumotning interpreter tomonidan buyruq sifatida o'qilishi. Dars SQL, shell, template va boshqa interpreter'lar uchun umumiy modelni, himoya ierarxiyasini (kanallarni ajratish, kontekstli encoding, validatsiya, minimal huquq) va oddiy tokenizer yordamida mexanizmni ko'rsatadi."
duration: 45
sources:
  - id: t10-a05
    note: "A05 Injection: ta'rif (ishonchsiz kiritish interpreter'ga yuborilib, qismi buyruq sifatida bajariladi), 37 ta CWE, ma'lumotni buyruqdan ajratish eng yaxshi chora, validatsiya to'liq himoya emas, escape xatoga moyil"
  - id: cs-input
    note: "Input Validation Cheat Sheet: SQL uchun parametrlangan so'rov, XSS uchun kontekstli output encoding ishlatish tavsiyasi; noto'g'ri kiritishni rad etish"
  - id: cs-sqli
    note: "SQL Injection Prevention Cheat Sheet: parametrlash asosiy himoya, tuzilma qismlari uchun qat'iy allow-list (tafsilotlar 22-darsda)"
quiz:
  - q: "Quyidagi parchada zaiflikning ildizi nima?\n\n```ts\nconst cmd = `grep ${term} /var/log/app.log`;\n```"
    options:
      - "`term` uzun bo'lishi mumkin"
      - "grep sekin ishlaydi"
      - "`term` buyruq matniga qo'shilib, interpreter uni ham sintaksis sifatida o'qiy oladi"
      - "Log fayl yo'li qattiq yozilgan"
    answer: 2
    explain: "Ma'lumot (term) va buyruq bitta qator ichida aralashgan, shuning uchun interpreter ma'lumot ichidagi probel yoki maxsus belgini sintaksis deb o'qiy oladi. Uzunlik, tezlik va qattiq yo'l injection mexanizmiga aloqador emas."
  - q: "Qaysi himoya injection'ni mexanizm darajasida yopadi?"
    options:
      - "Ma'lumot va buyruqni alohida kanalda uzatish (masalan, parametrlangan so'rov)"
      - "Kirishdagi `'` belgisini bo'sh joyga almashtirish"
      - "Kirishni 50 belgigacha qisqartirish"
      - "Faqat klient tomonda validatsiya qilish"
    answer: 0
    explain: "Kanallar ajratilganda interpreter ma'lumotni hech qachon sintaksis sifatida o'qimaydi. Belgini almashtirish bitta kontekstga moslangan va chetlab o'tiladi, qisqartirish hujumni to'xtatmaydi, klient tekshiruvi esa hujumchi uchun mavjud emas."
  - q: "Foydalanuvchi ism sifatida `O'Brien` kiritdi va ilova xato berdi. Bu nimani ko'rsatadi?"
    options:
      - "Apostrof taqiqlangan belgi bo'lishi kerak"
      - "Ilova ma'lumotni sintaksisdan ajratmayapti; xato hujumchi uchun ham belgi"
      - "Ism maydoni uzunligi kam"
      - "Bu faqat UX muammosi"
    answer: 1
    explain: "To'g'ri, zararsiz kiritish interpreter sintaksisini buzsa, hujumchi ham shu yo'l bilan sintaksisni boshqara oladi. Apostrofni taqiqlash ismni buzadi va muammoni yopmaydi."
  - q: "`ORDER BY ${sortField}` ustun nomi mijozdan keladi. Parametrlangan so'rov bu yerda nima uchun yetmaydi va nima yetadi?"
    options:
      - "Yetadi: `ORDER BY ?` ishlaydi"
      - "Yetmaydi; ustun nomi parametr bo'la olmaydi, shuning uchun ruxsat etilgan nomlar ro'yxatiga (allow-list) solishtirish kerak"
      - "Yetmaydi; faqat `'` ni escape qilish kerak"
      - "Yetmaydi; ustunni lowercase qilish yetarli"
    answer: 1
    explain: "Parametr qiymat o'rnini egallaydi, identifikator (ustun, jadval) o'rnini emas. Identifikatorlar uchun ruxsat etilgan qiymatlar ro'yxati eng ishonchli usul. Escape va lowercase ko'p kontekstda buziladi."
  - q: "Birinchi tuzatish: kirishdagi `--` ni olib tashlaydigan filtr. Hujumchi `x' OR 1=1 #` yuboradi (boshqa izoh belgisi). Nima bo'ladi?"
    options:
      - "Hujum to'xtaydi, chunki filtr izohlarni olib tashlaydi"
      - "Hujum to'xtaydi, chunki `#` ruxsat etilmagan"
      - "Hujum to'xtaydi, chunki `OR` kalit so'z"
      - "Hujum ishlaydi: kontekstga bog'liq qora ro'yxat bitta variantni yopadi, interpreter boshqa sintaksis variantlarini ham tushunadi"
    answer: 3
    explain: "Qora ro'yxat (blacklist) hujumchining imkoniyatlarini sanab chiqolmaydi, chunki interpreter ko'p sintaksis variantlarini taniydi. Mexanizmni yopish kerak, belgilarni emas."
  - q: "Foydalanuvchi nomi bazaga xavfsiz yozildi (parametr bilan), keyin boshqa joyda hisobot qatoriga shu nomni qo'shib shell buyrug'i yasaldi. Nima uchun bu xavfli?"
    options:
      - "Baza ma'lumotni o'zgartiradi"
      - "Ma'lumot saqlanishi bilan xavfsiz bo'lib qolmaydi: har bir interpreter kirishida alohida himoya kerak (ikkinchi tartibli injection)"
      - "Xavfli emas: ma'lumot bazadan kelgan, ishonchli"
      - "Parametrli so'rov shell'ni ham himoya qiladi"
    answer: 1
    explain: "Himoya interpreter chegarasida qo'llanadi, ma'lumot manbasida emas. Bazadagi qiymat ham asl foydalanuvchi kiritishi; u keyingi interpreter kirishida yana ma'lumot sifatida ajratilishi kerak."
task:
  title: "Audit log qatori: yozuvni soxtalashtirishni to'sing"
  prompt: |
    Platforma audit logga `user=<ism> action=<harakat>` ko'rinishida bir qator yozadi, har yozuv alohida qatorda. `buildAuditLine` qiymatlarni to'g'ridan-to'g'ri qatorga qo'shadi. Foydalanuvchi ismi sifatida `ali action=login\nuser=admin action=export` yuborilsa, logda ikkita yozuv paydo bo'ladi va ikkinchisi (soxta admin eksporti) haqiqiy ko'rinadi.

    `buildAuditLine(user, action)` funksiyasini shunday tuzatingki, qiymat ichidagi probel, `=`, yangi qator va boshqa maxsus belgilar qiymat chegarasini buza olmasin. Parser (`parseAudit`) o'zgarmaydi va asl qiymatni qaytara olishi kerak. Imzoni o'zgartirmang. Kutilgan natija: oddiy ism uchun 1 yozuv, hujum uchun ham 1 yozuv, ism esa asl matn bilan tengligicha qaytadi (`true`).
  lang: ts
  starter: |
    // Har yozuv: "user=<ism> action=<harakat>" va yangi qator.
    function buildAuditLine(user: string, action: string): string {
      return `user=${user} action=${action}`;
    }

    // Log faylni qatorlarga bo'lib o'qiydi.
    function parseAudit(log: string): { user: string; action: string }[] {
      return log
        .split("\n")
        .filter((l) => l.length > 0)
        .map((l) => {
          const m = /^user=(\S*) action=(\S*)$/.exec(l);
          if (!m) return { user: "?", action: "?" };
          return { user: decodeURIComponent(m[1]), action: decodeURIComponent(m[2]) };
        });
    }

    const normal = buildAuditLine("ali", "login") + "\n";
    const evil = buildAuditLine("ali action=login\nuser=admin action=export", "login") + "\n";

    console.log("oddiy yozuvlar:", parseAudit(normal).length);
    console.log("hujum yozuvlari:", parseAudit(evil).length);
    const back = parseAudit(buildAuditLine("a b=c\nd", "x") + "\n")[0];
    console.log("asl qiymat qaytdimi:", back.user === "a b=c\nd");
  solution: |
    const enc = (v: string) => encodeURIComponent(v);

    // Har yozuv: "user=<ism> action=<harakat>" va yangi qator.
    function buildAuditLine(user: string, action: string): string {
      return `user=${enc(user)} action=${enc(action)}`;
    }

    // Log faylni qatorlarga bo'lib o'qiydi.
    function parseAudit(log: string): { user: string; action: string }[] {
      return log
        .split("\n")
        .filter((l) => l.length > 0)
        .map((l) => {
          const m = /^user=(\S*) action=(\S*)$/.exec(l);
          if (!m) return { user: "?", action: "?" };
          return { user: decodeURIComponent(m[1]), action: decodeURIComponent(m[2]) };
        });
    }

    const normal = buildAuditLine("ali", "login") + "\n";
    const evil = buildAuditLine("ali action=login\nuser=admin action=export", "login") + "\n";

    console.log("oddiy yozuvlar:", parseAudit(normal).length);
    console.log("hujum yozuvlari:", parseAudit(evil).length);
    const back = parseAudit(buildAuditLine("a b=c\nd", "x") + "\n")[0];
    console.log("asl qiymat qaytdimi:", back.user === "a b=c\nd");
  solutionNotes: |
    - Bu yerda "interpreter" log parser: u probel va yangi qatorni sintaksis deb o'qiydi. Qiymatni `encodeURIComponent` bilan kodlash probel, `=` va `\n` ni ma'lumot ichida qoldiradi, chunki kodlangan qiymatda bu belgilar yo'q.
    - Kodlash formati parser bilan juft: `decodeURIComponent` asl qiymatni qaytaradi. Hech narsa o'chirib tashlanmadi, shuning uchun zararsiz maxsus belgilar (apostrof, probel) ham buzilmaydi.
    - Bu kontekstli encoding: u faqat shu log formati uchun to'g'ri. Xuddi shu qiymat HTML yoki SQL'ga qo'shilsa, boshqa himoya kerak.
    - Tuzatish qoplamaydi: log faylga yozishga ruxsat, log hajmi va qiymat uzunligi cheklovi, logni ko'rsatadigan panelda HTML encoding (31-32-darslar).
  checklist:
    - "`user` ichidagi yangi qator yangi yozuv yarata olmaydi"
    - "Qiymat parser orqali asl holida qaytadi"
    - "Qiymat tozalanmaydi yoki o'chirilmaydi, kodlanadi"
    - "Imzo va `parseAudit` o'zgarmagan"
    - "Nima uchun bu kontekstli encoding ekanini tushuntira olasiz"
---

## Muammo

Injection zaifligi har safar bir xil shaklda yoziladi: dasturchi matn yig'adi, bu matnni boshqa dastur (interpreter) bajaradi, matn tarkibida esa kimdir boshqarib turgan qism bor. SQL'da bu `WHERE plate = '` + kiritish + `'`, shell'da `grep ` + kiritish, HTML'da `<p>` + kiritish + `</p>`. Sintaksis har xil, mexanizm bitta. Shuning uchun dasturchi har interpreter uchun alohida "qoida" yodlasa, yangi interpreter chiqqanda (GraphQL, template engine, log parser, LDAP filtri, regex) yana muammoga tushadi.

Ikkinchi og'riq: injection'ga qarshi eng ommabop "tuzatishlar" belgilarni ushlashga asoslangan. Apostrofni olib tashlash, `--` ni qidirish, `<script>` so'zini bloklash. Bunday filtr bugungi payload'ni to'sadi, ertangi variantni o'tkazadi, zararsiz foydalanuvchini esa buzadi (`O'Brien` ismi ro'yxatdan o'tmaydi). Filtr yozish juda oson va tekshirish qiyin, shuning uchun u xavfsizlik hissini beradi, xavfsizlikni emas.

OWASP Top 10:2025 da bu oila A05 Injection nomi ostida; kategoriyaga 37 ta CWE kiritilgan va u injection'ni interpreter'ga yuborilgan ishonchsiz kiritishning bir qismi buyruq sifatida bajarilishi deb ta'riflaydi. Bu modulning (21-30-darslar) vazifasi har bir interpreter uchun mexanizmni ko'rsatish va har joyda bir xil savolga javob berish: ma'lumot qayerda kodga aylanadi va qaysi chegarada ularni ajratish mumkin. Bu dars umumiy modelni beradi, keyingi darslar uni SQL (22-23), NoSQL va Redis (24), shell (25), fayl yo'llari (26), SSRF (27), template (28), deserialization (29) va regex/validatsiya (30) ga qo'llaydi. Shuni ham aytib o'tish kerak: path traversal va SSRF klassik "interpreter" emas, lekin ularda ham xuddi shu g'oya bor: kiritilgan qiymat tizimning boshqa qismi tushunadigan ko'rsatmaga aylanadi.

## Asosiy g'oya

### Ikki kanal: ma'lumot va boshqaruv

Har interpreter kirishini ikki qismga bo'lib tasavvur qiling: boshqaruv qismi (kalit so'zlar, operatorlar, buyruq nomlari, tag'lar) va ma'lumot qismi (satr qiymatlari, raqamlar). Dasturchi niyati: boshqaruv qismini men yozaman, ma'lumot qismini foydalanuvchi beradi. Injection shu niyat buzilganda yuz beradi: foydalanuvchi qiymati ma'lumot chegarasidan chiqib, boshqaruv qismiga kiradi.

Buning uchun uchta shart birga bajarilishi kerak:

1. Qiymat hujumchi ta'sirida (to'g'ridan-to'g'ri yoki bilvosita, masalan bazadan o'qilgan).
2. Qiymat boshqaruv matni bilan bitta qatorga yig'iladi (konkatenatsiya, template string).
3. Interpreter yig'ilgan qatorni to'liq tahlil qiladi (parse) va qiymat ichidagi maxsus belgilarni sintaksis sifatida o'qiydi.

Himoya shu uch shartdan kamida bittasini buzadi. Eng ishonchli yo'l ikkinchisini buzish: boshqaruv va ma'lumotni hech qachon bitta qatorga yig'maslik, ularni interpreter'ga alohida uzatish. Parametrlangan so'rov (22-dars), `execFile` ga argumentlar massivi (25-dars), strukturali template konteksti (28-dars) shu g'oyaning turli ko'rinishi.

### Himoya ierarxiyasi

Himoya vositalari bir xil kuchga ega emas. Kurs bo'ylab quyidagi tartibdan foydalanamiz (bu kursning umumlashtirishi; A05 sahifasida ham eng yaxshi chora ma'lumotni buyruqdan ajratish, validatsiya va escape esa zaifroq choralar sifatida keltirilgan):

| Daraja | Vosita | Nimani yopadi | Cheklovi |
|---|---|---|---|
| 1 | Kanallarni ajratish (parametr, argument massivi) | Mexanizmning o'zini | Hamma interpreter ham qo'llab-quvvatlamaydi; identifikatorlar parametr bo'la olmaydi |
| 2 | Kontekstli encoding | Qiymatni shu kontekstda ma'lumot qilib qoldiradi | Har kontekst uchun alohida; noto'g'ri kontekst - noto'g'ri encoding |
| 3 | Allow-list validatsiya | Qiymat to'plamini toraytiradi | Mexanizmni yopmaydi; faqat to'plamni kichraytiradi |
| 4 | Minimal huquq | Muvaffaqiyatli hujum ta'sirini cheklaydi | Hujumni to'xtatmaydi |

OWASP A05 sahifasi shunday yozadi: ijobiy (allow-list) server tomonidagi validatsiya to'liq himoya emas, chunki ko'p ilovalarga maxsus belgilar kerak; belgilarni escape qilish esa murakkab satrlarni tahlil qilishni talab qiladi va xatoga moyil. Input Validation Cheat Sheet ham SQL uchun parametrlangan so'rovlarni, XSS uchun kontekstli encoding'ni alohida tavsiya qiladi. Ya'ni validatsiya ilovaning mantiqiy talablarini bajaradi (telefon raqami shaklida bo'lsin), lekin injection'dan himoyaning yagona vositasi emas. Bu yerda ham darajalar aralashmasligi kerak: validatsiya qiymatni toraytiradi, kanal ajratish esa toraytirilgan qiymatdan ham xavfsiz qiladi.

## Chuqurroq: injection oilasi va nozik holatlar

### Bir mexanizm, ko'p interpreter

| Interpreter | Boshqaruv belgilari | Dars |
|---|---|---|
| SQL | `'`, `--`, `;`, kalit so'zlar | 22-23 |
| MongoDB operatorlari, Redis protokoli | `$ne`, CRLF | 24 |
| OS shell | `;`, `\|`, `` ` ``, `$()` | 25 |
| Fayl tizimi yo'li | `../` | 26 |
| URL / HTTP so'rov | sxema, host | 27 |
| Template engine | `{{ }}`, `${ }` | 28 |
| Serializer / deserializer | tur va prototip maydonlari | 29 |
| Regex dvigateli | backtracking | 30 |
| HTML / JS / URL | `<`, `"`, `javascript:` | 31-34 |

Jadvaldagi har qator uchun savol bir xil: qiymat boshqaruv belgilarini olib kira oladimi va interpreter ularni qanday o'qiydi. Yangi texnologiya uchrasa, shu ikki savol bilan boshlang.

### Kontekst hal qiladi

Bir xil qiymat bir kontekstda zararsiz, boshqasida xavfli. `a b` qiymati shell'da ikki argument bo'ladi, URL'da `a%20b`, SQL satr literalida bir qiymat. Shuning uchun "universal escape funksiyasi" mavjud emas: encoding doim "qaysi interpreter, qaysi pozitsiya" savoliga bog'liq. Bir pozitsiyada to'g'ri bo'lgan encoding boshqasida yetmaydi (masalan, HTML matn uchun encoding atribut ichidagi JavaScript uchun yetmaydi; 32-dars).

### Ikkinchi tartibli injection

Qiymat bazaga xavfsiz yozilishi mumkin, lekin keyinroq boshqa interpreter'ga ishonchli deb qo'shilishi mumkin. Misol: foydalanuvchi nomi parametr bilan saqlandi, keyin kechasi ishlaydigan hisobot skripti shu nomni shell buyrug'iga qo'shdi. "Ma'lumot bazadan keldi, demak ishonchli" degan taxmin noto'g'ri. Himoya interpreter kirishida turadi, ma'lumot manbasida emas.

### Framework ham kafolat emas

A05 sahifasi ikki nozik holatni alohida eslatadi. Birinchisi: parametrlangan chaqiruv ham saqlangan protseduraning ichida matn yig'ilsa yoki `EXECUTE IMMEDIATE` kabi konstruksiya bilan kelgan matn bajarilsa, yana zaif bo'ladi. Parametr chegarasi faqat ilova va baza o'rtasida turadi; protsedura ichidagi yig'ish uni qayta buzadi. Ikkinchisi: ORM'ga ishonch. Sahifa ORM qidiruv parametrlariga tozalanmagan ma'lumot berilib, ortiqcha yozuvlar olinishi mumkinligini ham yozadi. Ya'ni "ORM ishlatamiz" degan gap tekshiruv emas: har bir joyda qiymat parametr sifatida ketayotganini yoki matn sifatida yig'ilayotganini ko'rish kerak (bu 23-darsning mavzusi).

### Kanonizatsiya va tartib

Validatsiya va encoding tartibi ham muhim. Qiymatni avval tekshirib, keyin dekodlasangiz (URL decode, Unicode normalizatsiya), tekshiruv boshqa qiymatni ko'rgan bo'ladi. Qoida: avval kanonik shaklga keltiring, keyin tekshiring, so'ng ishlating. Va tekshirilgan shaklning o'zini ishlating, asl satrni emas.

## Misol: mini interpreter'da chegara buzilishi

Mexanizmni ko'rish uchun kichik "SQL-ga o'xshash" interpreter yozamiz. U kalit so'zlar, identifikatorlar, satr literallari (`'...'`, ichida `''` apostrof), `=` va `!=` operatorlari hamda `--` izohini taniydi. `WHERE` qismida `AND` `OR` dan kuchliroq bog'lanadi. Bu o'quv modeli, real SQL emas, lekin lekser (tokenizer) darajasidagi mexanizm xuddi shu.

### 1. Zaif kod

```ts run
type Tok = { t: "kw" | "id" | "str" | "op"; v: string };
const KW = new Set(["SELECT", "FROM", "WHERE", "AND", "OR"]);

// Matnni tokenlarga ajratadi; "?" o'rniga tayyor str token qo'yadi (qiymat qayta tahlil qilinmaydi).
function lex(src: string, params: string[] = []): Tok[] {
  const out: Tok[] = [];
  let i = 0, p = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === " ") { i++; continue; }
    if (c === "-" && src[i + 1] === "-") break; // izoh: qator oxirigacha
    if (c === "'") {
      let v = ""; i++;
      while (i < src.length && !(src[i] === "'" && src[i + 1] !== "'")) {
        if (src[i] === "'") { v += "'"; i += 2; } else v += src[i++];
      }
      if (i >= src.length) throw new Error("yopilmagan satr");
      i++; out.push({ t: "str", v }); continue;
    }
    if (c === "?") { out.push({ t: "str", v: params[p++] }); i++; continue; }
    if (c === "=") { out.push({ t: "op", v: "=" }); i++; continue; }
    if (c === "!" && src[i + 1] === "=") { out.push({ t: "op", v: "!=" }); i += 2; continue; }
    const m = /^[A-Za-z_]+/.exec(src.slice(i));
    if (!m) throw new Error("noma'lum belgi: " + c);
    out.push({ t: KW.has(m[0].toUpperCase()) ? "kw" : "id", v: KW.has(m[0].toUpperCase()) ? m[0].toUpperCase() : m[0] });
    i += m[0].length;
  }
  return out;
}

type Row = Record<string, string>;
const vehicles: Row[] = [
  { plate: "01 A 111 AA", tenant: "alfa" },
  { plate: "10 B 222 BB", tenant: "beta" },
];

// WHERE: OR guruhlari, har guruh AND shartlari, har shart: id op str
function run(src: string, params: string[] = []): string[] {
  const toks = lex(src, params);
  const w = toks.findIndex((t) => t.t === "kw" && t.v === "WHERE");
  const cond = toks.slice(w + 1);
  const groups: Tok[][][] = [[[]]];
  for (const t of cond) {
    if (t.t === "kw" && t.v === "OR") groups.push([[]]);
    else if (t.t === "kw" && t.v === "AND") groups[groups.length - 1].push([]);
    else groups[groups.length - 1][groups[groups.length - 1].length - 1].push(t);
  }
  const ok = (r: Row) =>
    groups.some((g) => g.every(([a, op, b]) => (op.v === "=" ? r[a.v] === b.v : r[a.v] !== b.v)));
  return vehicles.filter(ok).map((r) => r.plate + " (" + r.tenant + ")");
}

// ZAIF: kiritish matnga qo'shiladi, "tenant = 'alfa'" sharti esa kodda qattiq yozilgan
function findWeak(plate: string): string[] {
  return run(`SELECT plate FROM vehicles WHERE plate = '${plate}' AND tenant = 'alfa'`);
}

const keywords = (s: string) => lex(s).filter((t) => t.t === "kw").map((t) => t.v).slice(2).join(" ");
console.log("kalit so'zlar:", keywords("SELECT plate FROM vehicles WHERE plate = '01 A 111 AA' AND tenant = 'alfa'"));
console.log("natija:  ", findWeak("01 A 111 AA"));
```

```text
kalit so'zlar: WHERE AND
natija:   [
  "01 A 111 AA (alfa)"
]
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu injection namunasi faqat shu darsning o'quv kodiga qarshi ko'rsatilgan; uni faqat o'z tizimingizda yoki yozma ruxsat bilan, kelishilgan doirada qo'llang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Hujumchi "alfa" foydalanuvchisi. U davlat raqami maydoniga o'z mashinasi raqamini emas, quyidagini yuboradi: `x' OR tenant = 'beta' --`. Yig'ilgan matn `... WHERE plate = 'x' OR tenant = 'beta' --' AND tenant = 'alfa'` bo'ladi. Lekser birinchi `'` dan keyin `x` ni satr deb o'qiydi, `'` satrni yopadi, `OR` va `tenant = 'beta'` esa endi ma'lumot emas, kod, `--` esa tenant shartini izohga aylantiradi.

```ts run
// (yuqoridagi lex, run va findWeak funksiyalari shu blokda takrorlangan)
type Tok = { t: "kw" | "id" | "str" | "op"; v: string };
const KW = new Set(["SELECT", "FROM", "WHERE", "AND", "OR"]);
function lex(src: string, params: string[] = []): Tok[] {
  const out: Tok[] = [];
  let i = 0, p = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === " ") { i++; continue; }
    if (c === "-" && src[i + 1] === "-") break;
    if (c === "'") {
      let v = ""; i++;
      while (i < src.length && !(src[i] === "'" && src[i + 1] !== "'")) {
        if (src[i] === "'") { v += "'"; i += 2; } else v += src[i++];
      }
      if (i >= src.length) throw new Error("yopilmagan satr");
      i++; out.push({ t: "str", v }); continue;
    }
    if (c === "?") { out.push({ t: "str", v: params[p++] }); i++; continue; }
    if (c === "=") { out.push({ t: "op", v: "=" }); i++; continue; }
    if (c === "!" && src[i + 1] === "=") { out.push({ t: "op", v: "!=" }); i += 2; continue; }
    const m = /^[A-Za-z_]+/.exec(src.slice(i));
    if (!m) throw new Error("noma'lum belgi: " + c);
    out.push({ t: KW.has(m[0].toUpperCase()) ? "kw" : "id", v: KW.has(m[0].toUpperCase()) ? m[0].toUpperCase() : m[0] });
    i += m[0].length;
  }
  return out;
}
type Row = Record<string, string>;
const vehicles: Row[] = [
  { plate: "01 A 111 AA", tenant: "alfa" },
  { plate: "10 B 222 BB", tenant: "beta" },
];
function run(src: string, params: string[] = []): string[] {
  const toks = lex(src, params);
  const w = toks.findIndex((t) => t.t === "kw" && t.v === "WHERE");
  const cond = toks.slice(w + 1);
  const groups: Tok[][][] = [[[]]];
  for (const t of cond) {
    if (t.t === "kw" && t.v === "OR") groups.push([[]]);
    else if (t.t === "kw" && t.v === "AND") groups[groups.length - 1].push([]);
    else groups[groups.length - 1][groups[groups.length - 1].length - 1].push(t);
  }
  const ok = (r: Row) =>
    groups.some((g) => g.every(([a, op, b]) => (op.v === "=" ? r[a.v] === b.v : r[a.v] !== b.v)));
  return vehicles.filter(ok).map((r) => r.plate + " (" + r.tenant + ")");
}
function findWeak(plate: string): string[] {
  return run(`SELECT plate FROM vehicles WHERE plate = '${plate}' AND tenant = 'alfa'`);
}

const payload = "x' OR tenant = 'beta' --";
const src = `SELECT plate FROM vehicles WHERE plate = '${payload}' AND tenant = 'alfa'`;
const keywords = lex(src).filter((t) => t.t === "kw").map((t) => t.v).slice(2).join(" ");
console.log("kalit so'zlar:", keywords);
console.log("natija:  ", findWeak(payload));
```

```text
kalit so'zlar: WHERE OR
natija:   [
  "10 B 222 BB (beta)"
]
```

Birinchi blokda oddiy kiritishda `WHERE` dan keyingi kalit so'z faqat `AND` edi. Hujumda u `OR` bo'ldi: kiritish kodga yangi kalit so'z qo'shdi, ya'ni struktura o'zgardi. Natijada "alfa" foydalanuvchisi "beta" kompaniyasi mashinasini ko'rdi, bu maxfiylik buzilishi (1-dars). Hujum faqat shu o'quv interpreter'iga qarshi; real SQL tafsilotlari va bazaga xos jihatlar 22-darsda.

### 3. Tuzatilgan kod

Tuzatish: boshqaruv matni (`... plate = ? AND tenant = ?`) o'zgarmas, qiymatlar alohida massivda beriladi. Lekserda `?` allaqachon tayyor `str` tokeniga aylanadi: qiymat matn sifatida qayta tahlil qilinmaydi. Tenant ham qattiq yozilgan matn emas, serverdagi sessiyadan olingan parametr.

```ts run
type Tok = { t: "kw" | "id" | "str" | "op"; v: string };
const KW = new Set(["SELECT", "FROM", "WHERE", "AND", "OR"]);
function lex(src: string, params: string[] = []): Tok[] {
  const out: Tok[] = [];
  let i = 0, p = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === " ") { i++; continue; }
    if (c === "-" && src[i + 1] === "-") break;
    if (c === "'") {
      let v = ""; i++;
      while (i < src.length && !(src[i] === "'" && src[i + 1] !== "'")) {
        if (src[i] === "'") { v += "'"; i += 2; } else v += src[i++];
      }
      if (i >= src.length) throw new Error("yopilmagan satr");
      i++; out.push({ t: "str", v }); continue;
    }
    if (c === "?") { out.push({ t: "str", v: params[p++] }); i++; continue; }
    if (c === "=") { out.push({ t: "op", v: "=" }); i++; continue; }
    if (c === "!" && src[i + 1] === "=") { out.push({ t: "op", v: "!=" }); i += 2; continue; }
    const m = /^[A-Za-z_]+/.exec(src.slice(i));
    if (!m) throw new Error("noma'lum belgi: " + c);
    out.push({ t: KW.has(m[0].toUpperCase()) ? "kw" : "id", v: KW.has(m[0].toUpperCase()) ? m[0].toUpperCase() : m[0] });
    i += m[0].length;
  }
  return out;
}
type Row = Record<string, string>;
const vehicles: Row[] = [
  { plate: "01 A 111 AA", tenant: "alfa" },
  { plate: "10 B 222 BB", tenant: "beta" },
  { plate: "O'N 5", tenant: "alfa" },
];
function run(src: string, params: string[] = []): string[] {
  const toks = lex(src, params);
  const w = toks.findIndex((t) => t.t === "kw" && t.v === "WHERE");
  const cond = toks.slice(w + 1);
  const groups: Tok[][][] = [[[]]];
  for (const t of cond) {
    if (t.t === "kw" && t.v === "OR") groups.push([[]]);
    else if (t.t === "kw" && t.v === "AND") groups[groups.length - 1].push([]);
    else groups[groups.length - 1][groups[groups.length - 1].length - 1].push(t);
  }
  const ok = (r: Row) =>
    groups.some((g) => g.every(([a, op, b]) => (op.v === "=" ? r[a.v] === b.v : r[a.v] !== b.v)));
  return vehicles.filter(ok).map((r) => r.plate + " (" + r.tenant + ")");
}

function find(tenant: string, plate: string): string[] {
  return run("SELECT plate FROM vehicles WHERE plate = ? AND tenant = ?", [plate, tenant]);
}

console.log("hujum:      ", find("alfa", "x' OR tenant = 'beta' --"));
console.log("oddiy:      ", find("alfa", "01 A 111 AA"));
console.log("apostrofli: ", find("alfa", "O'N 5"));
```

```text
hujum:       []
oddiy:       [
  "01 A 111 AA (alfa)"
]
apostrofli:  [
  "O'N 5 (alfa)"
]
```

Nima uchun yetarli: invariant "kiritilgan qiymat hech qachon `kw`, `op` yoki `id` token bo'la olmaydi" endi tuzilma bilan ta'minlangan, chunki qiymat lekserga tayyor `str` token sifatida kiradi va matn qayta ko'rilmaydi. Shuning uchun `O'N 5` kabi zararsiz apostrof ham ishlaydi: biz hech narsani filtrlamadik. Yopilgan hujum: ko'rsatilgan `OR`+izoh payload'i va uning barcha o'xshash variantlari (bu interpreter uchun). Yopilmagan: identifikatorlar (ustun, jadval nomi) parametr bo'la olmaydi, ularni alohida allow-list bilan tekshirish kerak (22-23-darslar). Tenant qiymatining o'zi to'g'ri manbadan (sessiya) olinishi esa authorization masalasi (51-58-darslar).

## Qachon qo'llamaslik kerak

- Kanal ajratish mumkin bo'lmagan joyda uni "majburlamang". Dinamik ustun nomi, `ORDER BY`, jadval nomi, dinamik shell buyrug'i nomi: bu yerda parametr yo'q. To'g'ri yechim allow-list: ruxsat etilgan qiymatlar kodda ro'yxat sifatida turadi, kiritish shu ro'yxatdan tanlanadi, hech qachon matnga qo'shilmaydi.
- Hamma kiritishga bir xil "tozalash" funksiyasini qo'llamang. U bir kontekstda ma'lumotni buzadi (ismdagi apostrof, parolning maxsus belgilari), boshqasida yetmaydi. Parolga hech qachon sanitizatsiya qo'llamang: u hash'lanadi.
- Validatsiyani ham ortiqcha qilmang. Qat'iy format (UUID, raqam, enum) bo'lgan maydonlarda validatsiya foydali va oson. Erkin matnda (izoh, ism, manzil) qat'iy validatsiya haqiqiy foydalanuvchilarni rad etadi va baribir injection'ni to'xtatmaydi.
- Minimal huquq hujumni to'xtatmaydi. Faqat o'qish huquqli baza foydalanuvchisi ham ma'lumotni sizdiradi. U zarar kattaligini kamaytiradi, parametrlash o'rnini bosmaydi.

## Stack'da: qaerda chegara turadi

Node.js stack'ida chegaralar bir xil joylarda uchraydi va ularni xarita sifatida yodda tuting:

- Baza drayveri: `pg` va Prisma/Kysely'ning so'rov API'si qiymatlarni parametr sifatida yuboradi. Chegara buziladigan joy: raw API'larda matn yig'ish (23-dars).
- Tizim buyruqlari: `child_process.exec` buyruq matnini shell'ga beradi, `execFile` esa argumentlar massivini beradi (25-dars).
- Fayl yo'llari: `path.join(base, user)` qiymatni yo'lga qo'shadi; chegara `..` bilan buziladi (26-dars).
- Tashqi so'rovlar: `fetch(userUrl)` qiymatni URL sifatida talqin qiladi (27-dars).
- Template: server tomonda matn sifatida render qilinadigan shablon (28-dars).

Quyidagi parcha shu g'oyaning kod ko'rinishi: ruxsat etilgan saralash maydonlarini allow-list bilan tanlash va qiymatni parametr sifatida berish. Bu kod ishga tushirilmaydi (`pg` mijozi brauzer worker'ida mavjud emas), faqat TypeScript sintaksisi jihatidan tekshirilgan.

```ts
import { Pool } from "pg";

const pool = new Pool();
const SORTABLE = { plate: "plate", lastSeen: "last_seen_at" } as const;

export async function listVehicles(
  tenantId: string,
  sort: string,
  minFuel: number,
) {
  // identifikator: allow-list, qiymat: parametr
  const column = (SORTABLE as Record<string, string>)[sort] ?? SORTABLE.plate;
  const { rows } = await pool.query(
    `SELECT id, plate FROM vehicles WHERE tenant_id = $1 AND fuel >= $2 ORDER BY ${column}`,
    [tenantId, Number.isFinite(minFuel) ? minFuel : 0],
  );
  return rows;
}
```

`column` qiymati hech qachon foydalanuvchi matni emas, u faqat kodda yozilgan ikki qiymatdan biri. Shuning uchun `ORDER BY` ga qo'shilgan matn ham "qattiq yozilgan" kategoriyasida qoladi.

## Xulosa

- Injection - qiymat ma'lumot chegarasidan chiqib, interpreter tomonidan boshqaruv sifatida o'qilishi. Mexanizm SQL, shell, template va boshqa joylarda bir xil.
- Eng ishonchli himoya - boshqaruv va ma'lumotni alohida kanalda uzatish. Undan keyin kontekstli encoding, allow-list validatsiya va minimal huquq keladi, ular bir-birining o'rnini bosmaydi.
- Belgilarni ushlaydigan filtr (qora ro'yxat) mexanizmni yopmaydi: hujumchi interpreter tushunadigan boshqa variantga o'tadi, zararsiz foydalanuvchi esa zarar ko'radi.
- Identifikatorlar parametr bo'la olmaydi: ular uchun allow-list ishlatiladi.
- Himoya interpreter kirishida turadi: bazadan o'qilgan qiymat ham ma'lumot sifatida ajratilishi kerak (ikkinchi tartibli injection).
- Har bir tuzatishning qoplamaydigan tomonini yozib qo'ying: bu darsda tenant sharti va identifikatorlar.
