---
n: 37
slug: clickjacking-frame
title: "Clickjacking va frame siyosati"
summary: "Clickjacking (UI redress) mexanizmi: sahifa begona saytning shaffof iframe'iga joylanib, foydalanuvchi bosishi yashirin tugmaga tushadi. frame-ancestors va X-Frame-Options, ularning o'zaro munosabati, meta teg ishlamasligi, SameSite roli va DoubleClickjacking."
duration: 40
sources:
  - id: csp3
    note: "frame-ancestors direktivasi: ajdodlar URL'larini cheklaydi, default-src'ga qaytmaydi, policy meta elementda bo'lsa e'tiborsiz qoldirilishi shart (MUST), enforce rejimidagi frame-ancestors bor javobda X-Frame-Options e'tiborsiz qoldiriladi"
  - id: mdn-csp
    note: "MDN frame-ancestors sahifasi: direktiva frame, iframe, object, embed ota-onalarini belgilaydi, frame-src'dan farqi, default-src fallback yo'q, meta'da qo'llab-quvvatlanmaydi, har bir ajdod tekshiriladi va bittasi mos kelmasa yuklash bekor qilinadi"
  - id: t10-a06
    note: "A06 Insecure Design dizayn va arxitektura kamchiliklari toifasi (threat modeling va secure design'ga urg'u); clickjacking u yerda nomi bilan tilga olinmaydi, dars uni framing siyosati dizayn qarori sifatida bog'laydi"
  - id: cs-clickjacking
    note: "OWASP Clickjacking Defense Cheat Sheet: frame-ancestors, X-Frame-Options, SameSite, DoubleClickjacking va meta teg ishlamasligi"
quiz:
  - q: "Hujumchi sahifasi sizning 'Mashinani o'chirish' sahifangizni shaffof iframe'ga joylab, ustiga 'Sovg'a oling' tugmasini qo'ydi. Foydalanuvchi tugmani bosganda nima bo'ladi va eng to'g'ridan-to'g'ri server tomoni himoyasi nima?"
    options:
      - "Bosish iframe ichidagi tugmaga tushadi; himoya: sahifani javobda `frame-ancestors 'none'` (yoki `'self'`) bilan frame qilib bo'lmaydigan qilish"
      - "Bosish hujumchi sahifasiga tushadi; himoya kerak emas"
      - "Bosish HTTPS tufayli bloklanadi"
      - "Himoya: cookie'ga `Secure` qo'yish"
    answer: 0
    explain: "Clickjacking'da foydalanuvchi haqiqiy sahifa elementini bosadi, faqat u ko'rinmaydi. Brauzer sahifani frame'ga olishni taqiqlashi uchun javobda frame-ancestors (yoki eski X-Frame-Options) bo'lishi kerak. Secure atributi va HTTPS bu hujumni to'xtatmaydi."
  - q: "Policy: `Content-Security-Policy: default-src 'none'`. Boshqa direktiva yo'q. Hujumchi bu sahifani o'z saytiga iframe qilib joylay oladimi?"
    options:
      - "Yo'q: default-src 'none' hamma narsani yopadi"
      - "Ha: frame-ancestors default-src'ga qaytmaydi, uni alohida yozish kerak"
      - "Faqat HTTP sahifalar uchun"
      - "Faqat sandbox atributi bo'lsa"
    answer: 1
    explain: "frame-ancestors boshqa fetch direktivalaridan farqli o'laroq default-src'ga o'tmaydi. Embedding'ni cheklash uchun uni aniq yozish kerak."
  - q: "Dasturchi `<meta http-equiv=\"Content-Security-Policy\" content=\"frame-ancestors 'none'\">` ni HTML'ga qo'shdi. Natija?"
    options:
      - "Sahifani frame qilish taqiqlanadi"
      - "Faqat bitta brauzerda ishlaydi"
      - "frame-ancestors meta orqali berilganda e'tiborsiz qoladi: u HTTP javob sarlavhasida bo'lishi kerak"
      - "Faqat X-Frame-Options bilan birga ishlaydi"
    answer: 2
    explain: "Spetsifikatsiyaga ko'ra frame-ancestors meta element ichidagi policy'da e'tiborsiz qoldiriladi; OWASP cheat sheet ham X-Frame-Options va frame-ancestors faqat sarlavha sifatida ishlashini yozadi."
  - q: "Javobda ham `X-Frame-Options: DENY`, ham `Content-Security-Policy: frame-ancestors 'self' https://portal.alfa.example` bor. Zamonaviy brauzerda portal.alfa.example sahifani frame qila oladimi?"
    options:
      - "Yo'q: DENY ustun"
      - "Brauzer ikkalasini ham e'tiborsiz qoldiradi"
      - "Faqat bitta sarlavha yuborish mumkin"
      - "Ha: enforce rejimidagi frame-ancestors bo'lsa X-Frame-Options e'tiborsiz qoldirilishi shart (spetsifikatsiya), shuning uchun CSP qoidasi ishlaydi"
    answer: 3
    explain: "CSP3 shuni talab qiladi, lekin cheat sheet eski brauzerlar (masalan Chrome 40, Firefox 35) buni bajarmagani va X-Frame-Options'ga amal qilganini eslatadi. Ikki sarlavha mos kelishi uchun ikkalasini bir xil niyat bilan yozing yoki eski brauzerlar uchun ehtiyot chorasini ko'ring."
  - q: "Hujumchi foydalanuvchini 'ikki marta bosing' deb yangi oyna ochishga undadi; ikkinchi bosish ostidagi asosiy oynadagi 'Ruxsat berish' tugmasiga tushdi. `frame-ancestors 'none'` bu hujumga qarshi yetarlimi?"
    options:
      - "Ha, frame-ancestors hamma UI hujumlarini yopadi"
      - "Yo'q: nishon sahifa frame'da emas, top-level oynada, shuning uchun framing cheklovlari yordam bermaydi; xavfli amal uchun serverda tasdiq (transaction authorization) kerak"
      - "Ha, faqat X-Frame-Options ham qo'shilsa"
      - "Yo'q, lekin SameSite=Strict yetarli"
    answer: 1
    explain: "OWASP cheat sheet DoubleClickjacking'ni alohida bo'lim sifatida tavsiflaydi: nishon top-level oyna bo'lgani uchun frame cheklovlari ishlamaydi. Yuqori xavfli amallar uchun foydalanuvchi tafsilotni ko'rib tasdiqlashi va serverda majburlanishi kerak."
  - q: "Sessiya cookie `SameSite=Lax`. Bu clickjacking'ga qarshi nimani beradi va nimani bermaydi?"
    options:
      - "Cross-site iframe so'rovlarida cookie yuborilmaydi, shuning uchun autentifikatsiyaga tayanadigan hujum ishlamaydi; lekin sibling subdomen same-site bo'lib qolishi mumkin va autentifikatsiyasiz hujumlar baribir ishlaydi"
      - "Clickjacking'ni to'liq yo'q qiladi"
      - "Hech narsa bermaydi"
      - "Faqat HTTP sahifalarni himoya qiladi"
    answer: 0
    explain: "Cheat sheet SameSite'ni chuqur himoya qatlami deb ataydi: Strict/Lax cross-site iframe so'rovlaridan cookie'ni ushlab turadi, lekin same-site (sibling subdomen) holatini yopmaydi va autentifikatsiya talab qilmaydigan hujumga ta'sir qilmaydi. Asosiy himoya frame-ancestors."
task:
  title: "frame-ancestors sarlavhasini xavfsiz qurish"
  prompt: |
    Tenant'lar o'z mijoz portallariga bizning hisobot sahifasini iframe orqali qo'yishi mumkin. Ruxsat etilgan portal manzillari bazadan keladi. `frameAncestorsHeader(allowed)` hozir ularni tekshirmasdan yopishtiradi.

    Vazifa: funksiyani yozing. Faqat `https:` sxemasidagi toza origin'lar (yo'l, so'rov, `*`, `;`, bo'shliq yo'q; `new URL(s).origin === s`) qabul qilinadi. Yaroqsiz yozuvlar tashlanadi. Hech bir yaroqli origin qolmasa, natija `frame-ancestors 'none'`, aks holda `frame-ancestors 'self' <origin'lar bo'shliq bilan>`. Natijada `;` va `*` bo'lmasligi kerak (policy inject qilish yo'q).
  lang: ts
  starter: |
    function frameAncestorsHeader(allowed: string[]): string {
      return "frame-ancestors " + allowed.join(" "); // TUZATING
    }

    const good = ["https://portal.alfa.example", "https://hisobot.beta.example:8443"];
    const bad = [
      "*",
      "http://eski.alfa.example",
      "https://x.example/path",
      "https://x.example; script-src *",
      "https://*.alfa.example",
      "javascript:alert(1)",
    ];

    console.log(frameAncestorsHeader(good));
    console.log(frameAncestorsHeader(bad));
    console.log(frameAncestorsHeader([]));
    const mixed = frameAncestorsHeader([...good, ...bad]);
    console.log("aralash:", mixed);
    console.log("tozalangan:", !mixed.includes(";") && !mixed.includes("*") && !mixed.includes("http:"));
  solution: |
    function frameAncestorsHeader(allowed: string[]): string {
      const ok: string[] = [];
      for (const s of allowed) {
        if (/[\s;*,]/.test(s)) continue;
        try {
          const u = new URL(s);
          if (u.protocol === "https:" && u.origin === s) ok.push(s);
        } catch {
          // yaroqsiz yozuv tashlanadi
        }
      }
      return ok.length === 0 ? "frame-ancestors 'none'" : "frame-ancestors 'self' " + ok.join(" ");
    }

    const good = ["https://portal.alfa.example", "https://hisobot.beta.example:8443"];
    const bad = [
      "*",
      "http://eski.alfa.example",
      "https://x.example/path",
      "https://x.example; script-src *",
      "https://*.alfa.example",
      "javascript:alert(1)",
    ];

    console.log(frameAncestorsHeader(good));
    console.log(frameAncestorsHeader(bad));
    console.log(frameAncestorsHeader([]));
    const mixed = frameAncestorsHeader([...good, ...bad]);
    console.log("aralash:", mixed);
    console.log("tozalangan:", !mixed.includes(";") && !mixed.includes("*") && !mixed.includes("http:"));
  solutionNotes: |
    - Allowlist: faqat toza `https:` origin'lar o'tadi, qolgan hamma narsa tashlanadi. Hech narsa qolmasa xavfsiz standart `'none'` (fail-safe default).
    - `;` va bo'shliq tekshiruvi sarlavhaga yangi direktiva qo'shishni (policy injection) to'sadi; `*` esa hamma saytga ruxsat berardi.
    - `u.origin === s` yo'l, so'rov va ortiqcha qismlarni rad etadi; `https://x.example:8443` kabi port o'z ichiga olingan origin'ga ruxsat.
    - Siyosat dinamik bo'lsa, har javobda quriladi va keshda `Vary` kabi ta'sirlarni hisobga olish kerak (kesh bir tenant javobini boshqasiga bermasligi uchun).
    - Bu faqat framing'ni cheklaydi. Portal ichidagi iframe sahifa o'zining ichidagi amallar uchun avtorizatsiya, SameSite va (xavfli amallarda) tasdiqlashni talab qiladi.
  checklist:
    - "Faqat toza `https:` origin'lar qabul qilinadi"
    - "`*`, `;`, yo'l, bo'shliq va `http:` tashlanadi"
    - "Bo'sh ro'yxatda natija `frame-ancestors 'none'`"
    - "Natijada `'self'` har doim boshida (ruxsat etilgan holatda)"
    - "Policy injection nima ekanini va nega allowlist kerakligini tushuntira olasiz"
---

## Muammo

Mijoz kabinetidagi "Mashinani masofadan bloklash" sahifasida katta qizil tugma bor. Hujumchi o'z saytida "Sovg'a yutib oling" sahifasi yasaydi, ostiga sizning sahifangizni shaffof (`opacity: 0`) iframe sifatida joylaydi va sovg'a tugmasi aynan sizning qizil tugmangiz ustiga tushadigan qilib moslaydi. Foydalanuvchi kabinetga kirgan, brauzerida sessiya bor. U "sovg'a" tugmasini bosadi, lekin haqiqiy bosish ko'rinmas iframe ichidagi qizil tugmaga tushadi. Server so'rovni foydalanuvchining to'g'ri sessiyasi bilan oladi va mashina bloklanadi. Hech qanday XSS, hech qanday cookie o'g'irlash yo'q.

Bu clickjacking (UI redress attack): hujumchi foydalanuvchi ko'rayotgan narsa bilan bosayotgan narsani ajratadi. CSRF (36-dars) bilan farqi: CSRF so'rovni foydalanuvchisiz yuboradi, shuning uchun token uni to'sadi. Clickjacking'da so'rovni haqiqatan foydalanuvchining o'zi, sizning sahifangizning o'zida, to'g'ri CSRF tokeni bilan yuboradi. Token, Origin tekshiruvi, same-origin bo'lgani uchun, bu hujumga ta'sir qilmaydi. Ayni shu sabab alohida himoya kerak: sahifani boshqa sayt frame ichiga olishini brauzer darajasida taqiqlash.

OWASP Top 10:2025 ning A06 Insecure Design toifasi dizayn va arxitektura kamchiliklariga qaratilgan; u clickjacking'ni nomi bilan tilga olmaydi, lekin sabab shu turdagi: himoya bitta sarlavha bo'lsa ham, uni qo'yish dizayn qarori. Qaysi sahifani kim frame qilishi mumkin, qaysini hech kim. Qaror qabul qilinmasa, brauzer standarti "hamma frame qila oladi".

## Asosiy g'oya

Himoya mexanizmi oddiy: brauzerga javob bilan birga "meni kim frame qila oladi" qoidasini yuborasiz, brauzer qoidaga zid frame'da sahifani ko'rsatmaydi. OWASP Clickjacking Defense Cheat Sheet uchta mustaqil mexanizmni sanaydi:

1. **Framing'ni sarlavha bilan taqiqlash**: CSP `frame-ancestors` yoki eski `X-Frame-Options`.
2. **SameSite cookie**: cross-site iframe so'rovlaridan sessiya cookie'ni ushlab turish.
3. **JavaScript frame-buster**: sahifa o'zi frame ichida ekanini aniqlab, yo'q qilishga urinadi (eng zaif, faqat eski brauzerlar uchun zaxira).

Cheat sheet mexanizmlar bir-biriga bog'liq emasligini va imkon qadar bir nechtasini birga ishlatishni tavsiya qiladi.

### frame-ancestors

`Content-Security-Policy: frame-ancestors 'none'` sahifani hech kim frame qila olmasligini aytadi. `'self'` faqat o'z origin'ingiz, aniq origin ro'yxati esa ruxsat etilgan hamkorlar uchun. Muhim tafsilotlar:

- Direktiva `<frame>`, `<iframe>`, `<object>`, `<embed>` ichiga joylashtirishni boshqaradi. U `frame-src` dan farq qiladi: `frame-src` sizning sahifangiz qaysi iframe'larni yuklashini, `frame-ancestors` sizning sahifangizni kim yuklashini boshqaradi.
- `frame-ancestors` `default-src` ga qaytmaydi. `default-src 'none'` yozilgan policy'ning o'zi sahifani har kim frame qilishidan to'smaydi.
- Meta element orqali berilgan policy'da `frame-ancestors` e'tiborsiz qoldirilishi shart (CSP3: MUST; MDN ham direktiva `<meta>` da qo'llab-quvvatlanmasligini yozadi). OWASP cheat sheet ham `X-Frame-Options` va `frame-ancestors` meta tegda ishlamasligini, ular HTTP javob sarlavhasida bo'lishi kerakligini ta'kidlaydi.
- Ichma-ich frame'larda brauzer hamma ajdodni tekshiradi: bittasi mos kelmasa yuklash bekor qilinadi (MDN).

### X-Frame-Options

Eski sarlavha: `DENY` (hech kim), `SAMEORIGIN` (faqat o'z origin). `ALLOW-FROM uri` eskirgan va zamonaviy brauzerlarda ishlamaydi; cheat sheet unga tayanishdan ogohlantiradi, chunki brauzer uni tanimasa himoya umuman qolmaydi (fail open). X-Frame-Options CSP Level 2 dagi `frame-ancestors` bilan almashtirilgan. Spetsifikatsiya enforce rejimidagi `frame-ancestors` bor javobda `X-Frame-Options` e'tiborsiz qoldirilishini talab qiladi, lekin cheat sheet eski brauzerlar buni bajarmaganini eslatadi (Chrome 40 va Firefox 35 misol sifatida). Amaliy xulosa: yangi kodda `frame-ancestors`, eski brauzerlar auditoriyasi bo'lsa ikkalasi birga va bir xil niyat bilan.

## Chuqurroq: nozik holatlar

### Qaysi sahifaga qo'yiladi

Sarlavha HTML qaytaradigan har javobga qo'yiladi (cheat sheet shuni yozadi). Eng muhimi, holat o'zgartiruvchi tugmali sahifalar: sozlamalar, to'lov, rol tayinlash, mashinani bloklash, API kalit yaratish. Lekin sahifa bo'yicha tanlab qo'yish xatoga moyil; global middleware yoki reverse proxy darajasida standart `'none'` yoki `'self'` qo'yib, iframe kerak bo'lgan sahifalar uchun istisno qilish xavfsizroq (fail-safe default, 3-dars). Proxy'lar sarlavhani olib tashlashi mumkin (cheat sheet shuni ogohlantiradi): haqiqiy javobni tekshirib ko'ring.

### Qonuniy embedding

Avtopark platformasida tenant o'z portaliga "joylashuv vidjeti"ni qo'yishi mumkin. Bunda `frame-ancestors 'none'` ishlamaydi. To'g'ri yo'l: faqat vidjet sahifalariga alohida policy va ruxsat etilgan origin'lar ro'yxati (tenant sozlamasi), qolgan hamma sahifalarga `'none'`. Ro'yxat bazadan kelsa, qiymatlarni qat'iy tekshiring: `*`, `;` yoki ochiq wildcard policy'ni buzadi yoki ochadi. Wildcard (`https://*.alfa.example`) subdomen egallab olinishi xavfini tug'diradi. Maxsus embedding uchun sahifada tenant bo'yicha `Vary`/keshlashni to'g'ri sozlang, aks holda bir tenant policy'si boshqasiga ketadi.

### SameSite va cookie

Cheat sheet SameSite=Strict yoki Lax cookie'lar cross-site iframe so'rovlaridan ushlab turilishini yozadi, shuning uchun autentifikatsiyaga tayanadigan clickjacking ishlamaydi. Cheklovlar: autentifikatsiya talab qilmaydigan hujumga ta'sir qilmaydi; same-site (masalan boshqa subdomen), lekin boshqa origin bo'lgan hujumchi sahifa frame qilishni davom ettirishi mumkin; atributni qo'llab-quvvatlamaydigan brauzerlar bor. Shu sabab SameSite chuqur himoya qatlami, birlamchi emas (13-dars).

### DoubleClickjacking

Cheat sheet alohida bo'lim sifatida DoubleClickjacking'ni tasvirlaydi: hujumchi foydalanuvchini ikki marta bosishga undab, ikki bosish orasida yangi oynani almashtiradi, ikkinchi bosish esa top-level oynadagi sezgir tugmaga tushadi. Nishon frame ichida emas, shuning uchun `X-Frame-Options` va `frame-ancestors` yordam bermaydi. Cheat sheet tavsiyasi: yuqori xavfli amallar (rozilik ekrani, to'lov tasdig'i, xavfsizlik sozlamalari) uchun foydalanuvchi amal tafsilotini ko'rib, serverda majburlanadigan tasdiqdan (transaction authorization) o'tsin; qo'shimcha tugma bosish o'zi yetarli emas. Tugmalarni oldindan o'chirib, avval o'zaro ta'sir bo'lgandan keyin yoqish faqat qo'shimcha chora sifatida taklif qilinadi va yordamchi texnologiyalar bilan sinab ko'rilishi kerak. Bu mavzuning chuqur tafsilotlari cheat sheet bo'limida.

### X-Frame-Options cheklovlari

Cheat Sheet `X-Frame-Options` ning nega eskirgan hisoblanishini aniq sanaydi. Sarlavha har sahifa uchun alohida belgilanishi kerak, shuning uchun joriy qilish murakkab. U ko'p domenli sayt uchun yaroqsiz: ruxsat etilgan domenlar ro'yxatini bermaydi, shu sababli bir vaqtda o'zingiz va bitta hamkor frame qilishi kerak bo'lsa, yo'li yo'q (brauzerlar faqat bitta sarlavha va bitta qiymatni hisobga oladi). Ichma-ich frame'larda `SAMEORIGIN` va `ALLOW-FROM` kutilgandek ishlamaydi, chunki `ALLOW-FROM` ota-oynani emas, eng yuqori kontekstni tekshiradi. Va proksilar sarlavhalarni qo'shadi yoki o'chiradi, o'chirilsa himoya yo'qoladi. `frame-ancestors` bularning hammasini hal qiladi: bir nechta origin yozish mumkin, ichma-ich zanjirda har bir ajdod tekshiriladi. Sintaksis nozikligi: `'self'` va `'none'` bir tirnoq ichida yoziladi, origin'lar esa tirnoqsiz; wildcard `https://*.somesite.com` subdomenlarga mos keladi, lekin bare `somesite.com` ga emas, uni alohida yozish kerak.

### Nega frame-buster ishonchsiz

Cheat Sheet oddiy `if (top != self) top.location.href = self.location.href` skriptini ishlatmaslikni aytadi va uni yengish usullarini sanaydi. Ikki marta frame'lash (double framing): hujumchi sahifasi qurbonni frame ichidagi frame'ga qo'yadi, `parent.location` ga yozish brauzerning descendant frame navigation siyosati tufayli xavfsizlik xatosiga aylanadi va skript ishlamay qoladi. `onbeforeunload` bilan foydalanuvchiga "chiqmoqchimisiz?" so'rovi ko'rsatib navigatsiyani bekor qildirish yoki 204 javobli sahifaga takroran navigatsiya qilib asl so'rovni bekor qilish ham mumkin. Va cheklangan zonalar: `sandbox` atributi (Chrome) iframe ichida JavaScript'ni o'chiradi, shunda skript umuman ishga tushmaydi. Natija: skript sarlavhaning o'rnini bosmaydi; nomi "best-for-now" skript esa faqat sarlavhani bilmaydigan eski brauzerlar uchun zaxira. Frame qilinishi kerak bo'lgan sahifalarda esa `window.confirm()` foydalanuvchiga amalni bildirib, qisman yordam beradi, lekin Cheat Sheet uni kafolat emas, qo'shimcha tasdiq deb belgilaydi: sandbox'li frame'da brauzer oddiy dialoglarni bostirishi mumkin, shuning uchun amal faqat `true` natijadan keyin bajariladi.

### Frame-buster

JavaScript bilan "agar `top !== self` bo'lsa, `top.location = self.location`" kabi kod eski brauzerlar uchun zaxira. Cheat sheet "legacy browser frame breaking" skriptini keltiradi (oldindan `body` ni yashirib, skript frame'da emasligini tasdiqlasa ko'rsatadi). Hujumchi iframe'ga `sandbox` atributini qo'yib skriptni o'chirib qo'yishi mumkin, shuning uchun u sarlavhaning o'rnini bosmaydi. Sarlavha asosiy, skript faqat eski brauzerlar uchun.

## Misol: framing siyosati modeli

Misol brauzer xatti-harakatining soddalashtirilgan modeli: javob sarlavhalari va ajdodlar ro'yxatiga qarab sahifa frame ichida ko'rsatiladimi yoki yo'qmi. Real brauzer algoritmining (CSP3 va X-Frame-Options) kichik qismi, maqsad mexanizmni ko'rsatish; hujum faqat shu o'quv modeliga qarshi.

### 1. Zaif kod

Server hech qanday framing siyosati yubormaydi. Hujumchi sahifasi iframe qiladi:

```ts run
type Headers = Record<string, string>;

// Model: sahifa ajdodlar ro'yxatida (eng yaqinidan boshlab) frame qilinishi mumkinmi
function canFrame(h: Headers, pageOrigin: string, ancestors: string[]): boolean {
  const csp = h["content-security-policy"] ?? "";
  const fa = csp.split(";").map((p) => p.trim()).find((p) => p.startsWith("frame-ancestors"));
  if (fa) {
    const srcs = fa.split(/\s+/).slice(1);
    if (srcs.includes("'none'")) return false;
    return ancestors.every((a) => srcs.includes(a) || (srcs.includes("'self'") && a === pageOrigin));
  }
  const xfo = (h["x-frame-options"] ?? "").toUpperCase();
  if (xfo === "DENY") return false;
  if (xfo === "SAMEORIGIN") return ancestors.every((a) => a === pageOrigin);
  return true; // siyosat yo'q: har kim frame qila oladi
}

// ZAIF: framing siyosati yo'q
const weakHeaders: Headers = { "content-type": "text/html" };
const page = "https://app.example";

console.log("o'z portali frame qila oladi:", canFrame(weakHeaders, page, ["https://portal.alfa.example"]));
console.log("hujumchi sahifasi frame qila oladi:", canFrame(weakHeaders, page, ["https://evil.example"]));
```

### 2. Hujum

Hujumchi sahifasi (`evil.example`) sizning sahifangizni iframe ichiga oladi. Modelga ko'ra brauzer buni to'smaydi:

```text
o'z portali frame qila oladi: true
hujumchi sahifasi frame qila oladi: true
```

Ikkinchi qator hujumning shartini bajaradi. Keyingi qadam (iframe'ni shaffof qilish va tugmani moslash) hujumchi sahifasining ichki ishi: u bizning kodimiz emas, lekin shartini bizning javobimiz yaratdi.

### 3. Tuzatilgan kod

Standart `frame-ancestors 'none'`, hamkor portal uchun istisno, eski brauzerlar uchun `X-Frame-Options`:

```ts run
type Headers = Record<string, string>;

function canFrame(h: Headers, pageOrigin: string, ancestors: string[]): boolean {
  const csp = h["content-security-policy"] ?? "";
  const fa = csp.split(";").map((p) => p.trim()).find((p) => p.startsWith("frame-ancestors"));
  if (fa) {
    const srcs = fa.split(/\s+/).slice(1);
    if (srcs.includes("'none'")) return false;
    return ancestors.every((a) => srcs.includes(a) || (srcs.includes("'self'") && a === pageOrigin));
  }
  const xfo = (h["x-frame-options"] ?? "").toUpperCase();
  if (xfo === "DENY") return false;
  if (xfo === "SAMEORIGIN") return ancestors.every((a) => a === pageOrigin);
  return true;
}

const page = "https://app.example";

// Standart: hech kim frame qila olmaydi
const strict: Headers = {
  "content-security-policy": "frame-ancestors 'none'",
  "x-frame-options": "DENY", // frame-ancestors'ni bilmaydigan eski brauzerlar uchun
};
// Faqat vidjet sahifasi uchun: o'zimiz va bitta hamkor portal
const widget: Headers = {
  "content-security-policy": "frame-ancestors 'self' https://portal.alfa.example",
};

console.log("standart, hujumchi:", canFrame(strict, page, ["https://evil.example"]));
console.log("standart, o'zimiz:", canFrame(strict, page, [page]));
console.log("vidjet, hamkor portal:", canFrame(widget, page, ["https://portal.alfa.example"]));
console.log("vidjet, hujumchi:", canFrame(widget, page, ["https://evil.example"]));
console.log("vidjet, hamkor ichida hujumchi:", canFrame(widget, page, ["https://evil.example", "https://portal.alfa.example"]));
```

```text
standart, hujumchi: false
standart, o'zimiz: false
vidjet, hamkor portal: true
vidjet, hujumchi: false
vidjet, hamkor ichida hujumchi: false
```

### Tuzatish nima uchun yetarli

Invariant: brauzer sahifani faqat sarlavhada aytilgan ajdodlarning ichida ko'rsatadi, qolgan hamma holatda yuklashni bekor qiladi. Hujumchi sahifasi (`evil.example`) ikkala policy'da ham rad etiladi, ichma-ich holatda (hamkor iframe ichida hujumchi) ham hamma ajdod tekshiriladi. `'none'` standart bo'lgani uchun yangi sahifa avtomatik himoyalangan.

Yopilmagan narsalar: (1) frame'siz hujum, ya'ni DoubleClickjacking, framing cheklovlari bilan yopilmaydi: xavfli amallar uchun serverda tasdiq kerak (yuqorida); (2) hamkor portalning o'zi buzilsa (XSS), u sizning vidjetingizni qonuniy frame qiladi va hujum qiladi; (3) sarlavha proxy yoki CDN tomonidan olib tashlansa himoya yo'qoladi, shuning uchun uni haqiqiy javobda tekshiring; (4) model real algoritmning to'liq nusxasi emas.

## Qachon qo'llamaslik kerak

- Ataylab embed qilinadigan sahifalarda (vidjet, to'lov formasi, ommaviy hisobot) `'none'` qo'yib bo'lmaydi. Ular uchun aniq origin ro'yxati va xavfli amallarni alohida himoyalash kerak.
- Faqat `X-Frame-Options: ALLOW-FROM` ga tayanmang: zamonaviy brauzerlarda ishlamaydi va himoya fail open bo'ladi.
- Frame-buster skriptiga yolg'iz tayanish ishonchsiz: iframe `sandbox` bilan uni o'chirishi mumkin.
- `frame-ancestors` ni boshqa CSP direktivalari bilan bir policy'ga yig'ish qulay, lekin nonce asosidagi policy'ni (35-dars) sahifa bo'yicha o'zgartirish keshlashga ta'sir qiladi; sarlavhani alohida middleware'da qo'shish soddaroq bo'lishi mumkin.
- Faqat ichki tarmoqdagi, hech kim kira olmaydigan admin sahifa uchun ham `'self'` yoki `'none'` qo'yish arzon va zarar qilmaydi. Bu yerda "ortiqcha murakkablik" yo'q.
- Framing cheklovi autentifikatsiya, CSRF va avtorizatsiya o'rnini bosmaydi; u faqat UI redress vektorini yopadi.

## Stack'da: Next.js, NestJS va reverse proxy

Next.js'da sarlavhalar `next.config` dagi `headers()` orqali beriladi (nonce kerak bo'lmasa) yoki Proxy ichida (35-dars). NestJS/Fastify'da `helmet` kabi paketlar (16-dars) `frame-ancestors` va `X-Frame-Options` ni boshqaradi. Quyidagi kod ishga tushirilmaydi (Next.js muhiti kerak), faqat sintaksis jihatidan tekshirilgan:

```ts
// next.config.ts
import type { NextConfig } from "next";

const config: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      {
        // Faqat vidjet sahifasi: o'zimiz va hamkor portal
        source: "/vidjet/:path*",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors 'self' https://portal.alfa.example" },
        ],
      },
    ];
  },
};

export default config;
```

Bu yerda `/vidjet/...` yo'li ikkala `source` ga ham mos keladi. Next.js hujjatiga ko'ra bir xil kalitli sarlavhada oxirgi qoida oldingisini bosib ketadi, shuning uchun vidjet sahifasida `Content-Security-Policy` ikkinchi qoidadagisi bo'ladi. Lekin `X-Frame-Options: DENY` birinchi qoidadan qoladi: zamonaviy brauzer enforce rejimidagi `frame-ancestors` bor javobda uni e'tiborsiz qoldiradi, `frame-ancestors`ni bilmaydigan eski brauzer esa `DENY` bilan vidjetni ham bloklaydi. Toza yo'l: vidjet yo'lini birinchi qoidadan istisno qiladigan `source` yozish (masalan negative lookahead bilan) yoki sarlavhani bitta Proxy yoki middleware'da yo'l bo'yicha hisoblash. Natijani haqiqiy javobda `curl -I` bilan tekshiring. Nginx/CDN darajasida qo'yish ham mumkin, lekin ilova sarlavhasi bilan ziddiyat bo'lmasligi kerak. Tenant ro'yxati bazadan kelsa, 37-darsdagi vazifadagi kabi allowlist funksiyasidan o'tkazing.

## Xulosa

- Clickjacking: foydalanuvchi sizning sahifangizni haqiqiy bosadi, lekin begona saytning ko'rinmas iframe'i orqali; CSRF tokeni va Origin tekshiruvi bu hujumni to'xtatmaydi.
- Asosiy himoya: HTML javoblarga `Content-Security-Policy: frame-ancestors 'none'` (yoki `'self'` / aniq origin ro'yxati). `frame-ancestors` `default-src` ga qaytmaydi va meta teg orqali ishlamaydi.
- `X-Frame-Options` eski brauzerlar uchun zaxira; enforce rejimdagi `frame-ancestors` bor bo'lsa u ustun. `ALLOW-FROM` ga tayanmang.
- SameSite cookie va frame-buster qo'shimcha qatlamlar; DoubleClickjacking framing cheklovlari bilan yopilmaydi, xavfli amallar uchun serverda tasdiq kerak.
- Standart `'none'` qo'ying, embedding kerak sahifalarga tekshirilgan origin allowlist bering va haqiqiy javobda sarlavhani tekshiring.
