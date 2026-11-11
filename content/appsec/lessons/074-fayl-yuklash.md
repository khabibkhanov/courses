---
n: 74
slug: fayl-yuklash
title: "Fayl yuklash xavfsizligi"
summary: "Fayl yuklash nima uchun xavfli: kengaytma va Content-Type'ga ishonish, path traversal, ichki tarkib hujumlari, hajm va resurs. Magic byte tekshiruvi, yaratilgan fayl nomi, alohida saqlash, nosniff va attachment, hamda bu tuzatish nimani qoplamasligi."
duration: 40
sources:
  - id: cs-upload
    note: "File Upload Cheat Sheet: xavfsiz yuklash tamoyillari (ruxsat etilgan kengaytmalar ro'yxati, Content-Type'ga ishonmaslik, ilova yaratgan fayl nomi, nom uzunligi va hajm limiti, avtorizatsiya, alohida server yoki webroot'dan tashqarida saqlash, antivirus yoki sandbox, CDR, CSRF himoyasi); tahdidlar (parser zaifliklari, ZIP/XML bomba, fayl ustiga yozish, client-side faol kontent); kengaytma bypass usullari (qo'sh kengaytma, null bayt, registr, muqobil kengaytmalar, NTFS stream); signature tekshiruvi yolg'iz ishlatilmasligi; rasmni qayta kodlash; saqlash joyi ketma-ketligi; arxiv ochilgandan keyingi hajm; 'no silver bullet' va defense in depth"
  - id: t10-a05
    note: "A05:2025 Injection kategoriyasi: ishonchsiz ma'lumot interpreter'ga uzatilishi. Sahifada fayl yuklash alohida aytilmagan; fayl nomi va tarkibini ishlovga uzatishni shu mantiqqa bog'lash kurs talqini"
  - id: asvs
    note: "ASVS 5.0.0 da alohida V5 File Handling bo'limi bor; dars aniq talab raqamlarini keltirmaydi"
  - id: nestjs-file-upload
    note: "NestJS File upload: multer asosidagi interceptor'lar, standart xotira storage'i va limits.fileSize, ParseFilePipe bilan MaxFileSizeValidator va FileTypeValidator (magic number), diskStorage, @fastify/multipart standartlari"
quiz:
  - q: "Mijoz `report.png` nomi va `Content-Type: image/png` bilan fayl yukladi. Server faqat shu ikkitasini tekshirib, faylni qabul qildi. Nega bu yetarli emas?"
    options:
      - "Ikkala qiymatni ham hujumchi o'zi yozadi, shuning uchun ular faylning haqiqiy turi haqida dalil emas"
      - "Chunki PNG xavfli format"
      - "Chunki Content-Type faqat GET so'rovlarida ishlaydi"
      - "Chunki kengaytmalarni tekshirish taqiqlangan"
    answer: 0
    explain: "Cheat sheet Content-Type header'iga ishonmaslikni aytadi, chunki uni soxtalashtirish mumkin. Nom va header mijoz kiritgan ma'lumot; fayl turini tarkibdan (signature) va ilova yaratgan kengaytmadan aniqlash kerak."
  - q: "`photo.png.html` nomli fayl `filename.includes('.png')` tekshiruvidan o'tdi va `/uploads/` ostida shu nom bilan saqlandi. Bu holat qaysi xavfga olib keladi?"
    options:
      - "Faqat disk to'lib ketishiga"
      - "Fayl brauzerda HTML sifatida ochilib, shu domen kontekstida skript ishga tushishi (stored XSS) mumkin"
      - "Hech qanday xavf yo'q, chunki '.png' bor"
      - "SQL injection"
    answer: 1
    explain: "Qo'sh kengaytma tekshiruvni aldaydi, server (bu misolda) oxirgi kengaytma (.html) bo'yicha Content-Type beradi. Cheat sheet qo'sh kengaytma va registr manipulyatsiyasini ma'lum bypass sifatida sanaydi. Himoya: nomni ilova o'zi yaratadi."
  - q: "Fayl PNG signature (89 50 4E 47 ...) bilan boshlanadi va ichida HTML bor (polyglot). Magic byte tekshiruvidan o'tdi. Qaysi qo'shimcha nazorat ishlaydigan himoya beradi?"
    options:
      - "Yana bir bor kengaytmani tekshirish"
      - "Faylni `Content-Type: text/html` bilan berish"
      - "Faylni ilova domenidan yoki boshqa originda, `Content-Type` ni o'zimiz belgilab, `nosniff` va `Content-Disposition: attachment` bilan berish, mumkin bo'lsa rasmni qayta kodlash"
      - "Faylni nomi bo'yicha ko'rsatish"
    answer: 2
    explain: "Magic byte tarkibning boshini tekshiradi, qolgan qismini emas. Polyglot'ga qarshi javob xavfsiz berilishi (aniq turdagi Content-Type, nosniff, attachment) va tarkibni qayta kodlash (CDR kabi) kerak. Cheat sheet defense in depth ni talab qiladi."
  - q: "Yuklangan fayl nomi `../../app/config.js`. Server fayl yo'lini `uploads/${name}` deb yig'adi. Nima bo'ladi va to'g'ri tuzatish qaysi?"
    options:
      - "Hech narsa: `..` faqat brauzerda ishlaydi"
      - "Fayl `uploads/` ichida qoladi"
      - "Yo'l `uploads` dan chiqib ketadi (path traversal), fayl ustiga yozilishi mumkin; tuzatish: nomni umuman ishlatmaslik, saqlash nomini ilova yaratadi"
      - "Faqat `..` belgisini o'chirish yetarli"
    answer: 2
    explain: "Cheat sheet fayl nomini ilova yaratadigan nomga almashtirishni va mavjud faylni ustiga yozish tahdidini ko'rsatadi. `..` ni o'chirish ham kodlash variantlari (`....//`) tufayli ishonchsiz; nomni umuman yo'ldan chiqarib tashlash eng ishonchli."
  - q: "Quyidagilardan qaysi biri yuklash endpoint'ining resurs xavfini (mavjudlik) kamaytiradi?"
    options:
      - "Magic byte tekshiruvi"
      - "Fayl nomini kichik harfga o'tkazish"
      - "Faqat HTTPS"
      - "Hajm limiti, kiruvchi oqimni o'qishni to'xtatish va arxivlar uchun ochilgandan keyingi hajm chegarasi"
    answer: 3
    explain: "Cheat sheet ZIP bomba, XML bomba va juda katta fayllarni saqlash va mavjudlik xavfi sifatida sanaydi va hajm limitini, arxivlar uchun ochilgandan keyingi hajmni hisobga olishni aytadi. Magic byte tur haqida, hajm haqida emas. Limit tarkibni to'liq xotiraga o'qishdan oldin qo'llanishi kerak."
  - q: "Jamoa `.exe`, `.php`, `.js` kengaytmalarini bloklaydigan blocklist yozdi. Cheat sheet bu yondashuvga nisbatan nima deydi?"
    options:
      - "Blocklist eng ishonchli usul"
      - "Faqat ruxsat etilgan kengaytmalar ro'yxati (allowlist) asosiy usul bo'lishi kerak, blocklist esa qo'shimcha; yangi xavfli kengaytmalar va bypass'lar blocklist'dan o'tib ketadi"
      - "Kengaytmani tekshirish kerak emas"
      - "Faqat Windows serverlarda muhim"
    answer: 1
    explain: "Cheat sheet birinchi tamoyil sifatida ruxsat etilgan kengaytmalar ro'yxatini ko'rsatadi: biznes uchun kerakli xavfsiz kengaytmalargina. Blocklist hamma xavfli variantni bilishni talab qiladi, bu esa ishonchsiz."
task:
  title: "Yuklangan faylni tekshirish va saqlash nomini yaratish"
  prompt: |
    `validateUpload(id, name, declaredType, bytes)` platformaga yuklangan fayl (mashina hujjati) haqida qaror qaytaradi. Hozir u mijoz aytgan Content-Type'ga ishonadi va fayl nomini saqlaydi.

    Qoidalar:
    1. Tur faqat tarkibdan aniqlanadi: PNG (`89 50 4E 47 0D 0A 1A 0A`), JPEG (`FF D8 FF`) yoki PDF (`%PDF-`, ya'ni `25 50 44 46 2D`). Boshqa hamma narsa rad etiladi. `declaredType` e'tiborga olinmaydi.
    2. Hajm 5 MiB (5 * 1024 * 1024 bayt) dan oshmasin va bo'sh bo'lmasin.
    3. Saqlash nomi `f_<id>.<kengaytma>` bo'lsin (png, jpg, pdf). Mijoz nomi saqlash nomiga hech qanday ta'sir qilmasin.
    4. Natija: `{ ok: true, stored, mime }` yoki `{ ok: false, reason }`.

    Kutilgan natija: 5 ta holatdan 2 tasi qabul qilinadi (A va C), 3 tasi rad etiladi.
  lang: ts
  starter: |
    type Result = { ok: true; stored: string; mime: string } | { ok: false; reason: string };

    function validateUpload(id: number, name: string, declaredType: string, bytes: Uint8Array): Result {
      return { ok: true, stored: name, mime: declaredType };
    }

    const png = (n: number) => {
      const b = new Uint8Array(n);
      b.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      return b;
    };
    const html = new TextEncoder().encode("<script>alert(1)</script>");

    const cases: [string, Result][] = [
      ["A", validateUpload(1, "photo.png", "image/png", png(100))],
      ["B", validateUpload(2, "photo.png", "image/png", html)],
      ["C", validateUpload(3, "../../x.php", "text/plain", png(100))],
      ["D", validateUpload(4, "big.png", "image/png", png(6 * 1024 * 1024))],
      ["E", validateUpload(5, "empty.png", "image/png", new Uint8Array(0))],
    ];
    for (const [k, r] of cases) console.log(k, r.ok ? `qabul ${r.stored} ${r.mime}` : `rad ${r.reason}`);
  solution: |
    type Result = { ok: true; stored: string; mime: string } | { ok: false; reason: string };

    const MAX_BYTES = 5 * 1024 * 1024;
    const SIGNATURES: { ext: string; mime: string; magic: number[] }[] = [
      { ext: "png", mime: "image/png", magic: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
      { ext: "jpg", mime: "image/jpeg", magic: [0xff, 0xd8, 0xff] },
      { ext: "pdf", mime: "application/pdf", magic: [0x25, 0x50, 0x44, 0x46, 0x2d] },
    ];

    function validateUpload(id: number, _name: string, _declaredType: string, bytes: Uint8Array): Result {
      if (bytes.length === 0) return { ok: false, reason: "bo'sh fayl" };
      if (bytes.length > MAX_BYTES) return { ok: false, reason: "hajm limiti" };
      const sig = SIGNATURES.find((s) => s.magic.every((v, i) => bytes[i] === v));
      if (!sig) return { ok: false, reason: "ruxsat etilmagan tur" };
      return { ok: true, stored: `f_${id}.${sig.ext}`, mime: sig.mime };
    }

    const png = (n: number) => {
      const b = new Uint8Array(n);
      b.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      return b;
    };
    const html = new TextEncoder().encode("<script>alert(1)</script>");

    const cases: [string, Result][] = [
      ["A", validateUpload(1, "photo.png", "image/png", png(100))],
      ["B", validateUpload(2, "photo.png", "image/png", html)],
      ["C", validateUpload(3, "../../x.php", "text/plain", png(100))],
      ["D", validateUpload(4, "big.png", "image/png", png(6 * 1024 * 1024))],
      ["E", validateUpload(5, "empty.png", "image/png", new Uint8Array(0))],
    ];
    for (const [k, r] of cases) console.log(k, r.ok ? `qabul ${r.stored} ${r.mime}` : `rad ${r.reason}`);
  solutionNotes: |
    - Tur va kengaytma tarkibdan chiqariladi, nom va `declaredType` ishlatilmaydi (`_name`, `_declaredType`). Shuning uchun `../../x.php` nomi saqlash nomiga ta'sir qilmaydi.
    - Hajm tekshiruvi tur tekshiruvidan oldin turadi: katta faylni signature bo'yicha qidirish uchun ham resurs sarflamaymiz. Real serverda esa hajm limiti oqimni o'qish paytida (multer/busboy darajasida) qo'llanadi, fayl xotiraga to'liq o'qilgandan keyin emas.
    - Bu tekshiruv faqat faylning boshini ko'radi. PNG signature'li polyglot o'tib ketadi; shuning uchun xavfsiz berish (nosniff, attachment, aniq Content-Type) va imkon bo'lsa qayta kodlash kerak.
    - ID ni ilova yaratadi (hisoblagich yoki tasodifiy). Bashorat qilinadigan ID bo'lsa, yuklangan faylni o'qish huquqi alohida tekshirilishi shart (52-dars).
    - Antivirus, ZIP/XML bomba va metadata tozalash bu funksiyada yo'q.
  checklist:
    - "A va C qabul qilinadi, B, D, E rad etiladi"
    - "C holatida saqlash nomi `f_3.png`, mijoz nomi ishlatilmaydi"
    - "Content-Type sarlavhasi hech qaerda ishlatilmaydi"
    - "Hajm limiti 5 MiB aniq qo'llanadi"
    - "Polyglot fayl o'tib ketishini va unga qarshi qo'shimcha nazoratni ayta olasiz"
---

## Muammo

Fayl yuklash funksiyasi deyarli har platformada bor: haydovchi guvohnomasi surati, mashina texnik pasporti PDF, hodisa videosi, CSV import. Dasturchi uchun u oddiy ko'rinadi: `multipart` so'rovni qabul qil, diskka yoz, havolasini bazaga qo'y. Xavfsizlik nuqtai nazaridan esa u mijozdan keladigan eng "boy" kirish: hajmi katta, ichki tuzilmasi murakkab, nomi va turi mijoz tomonidan yoziladi, keyinroq boshqa foydalanuvchilarga qaytariladi yoki server tomonida parser tomonidan qayta ishlanadi.

File Upload Cheat Sheet tahdidlarni ikki guruhga ajratadi. Birinchisi zararli fayllar: fayl parser yoki ishlov modulidagi zaiflikdan foydalanish (cheat sheet misol sifatida ImageTrick va XXE ni keltiradi), phishing uchun foydalanish, ZIP bomba, XML bomba (billion laughs) yoki oddiy juda katta fayllar bilan saqlash joyini to'ldirib mavjudlikni buzish, mavjud faylni ustiga yozish, va fayl ommaga ochiq bo'lsa, brauzerda ishga tushadigan client-side faol kontent (XSS, CSRF). Ikkinchisi fayl ommaviy olinadigan bo'lganda qo'shimcha xavflar: boshqa fayllarning oshkor bo'lishi, kichik so'rovga katta javob qaytaradigan DoS va noqonuniy yoki zararli kontentga hosting bo'lib qolish.

Eng keng tarqalgan xato: "kengaytmani tekshirdik, Content-Type ham `image/png`, demak rasm". Ikkala qiymatni ham hujumchi yozadi. Bu dars bu ishonchni uzadigan mexanizmlarni ko'radi: tur tarkibdan aniqlanadi, nom ilova tomonidan yaratiladi, saqlash joyi ijro etilmaydigan, berish esa nosniff va attachment bilan bo'ladi.

## Asosiy g'oya

Cheat sheet "defense in depth" yondashuvini talab qiladi: hech bir usul yetarli emas, va "kumush o'q yo'q" deb yozadi. Qisqa tamoyillar ro'yxati quyidagicha (o'z so'zlarimiz bilan):

1. Faqat biznes uchun zarur, xavfsiz kengaytmalar ro'yxati. Kengaytmani tekshirishdan oldin kiritishni tekshirish (dekodlash, normalizatsiya).
2. Fayl turini tekshiring; Content-Type header'iga ishonmang, chunki uni soxtalashtirish mumkin.
3. Fayl nomini ilova yaratgan nomga almashtiring, nom uzunligini cheklang, belgilarni cheklang.
4. Fayl hajmiga limit qo'ying.
5. Faqat avtorizatsiyadan o'tgan foydalanuvchilar yuklay olsin.
6. Faylni boshqa serverda saqlang; bo'lmasa webroot'dan tashqarida.
7. Fayl ommaga ochiq bo'lsa, ilovadagi identifikator bilan fayl nomi bog'lanadigan handler orqali bering (`someid` dan `file.ext`).
8. Antivirus yoki sandbox, mos format uchun CDR (Content Disarm & Reconstruct) ishlating.
9. Ishlatilgan kutubxonalarni xavfsiz sozlang va yangilab turing.
10. Yuklash endpoint'ini CSRF dan himoyalang (36-dars).

ASVS 5.0.0 da fayl bilan ishlash alohida V5 File Handling bo'limiga ajratilgan; OWASP API Security Top 10 (2023) esa API4 ichida fayl hajmini ham nomlab qo'yadi (71 va 73-darslar).

### Nima uchun nom va header'ga ishonib bo'lmaydi

Mijoz yuborgan multipart qismida uchta mustaqil qiymat bor: fayl nomi (`filename=`), qism Content-Type'i va baytlarning o'zi. Server birinchi ikkitasini "yorliq" deb o'qiydi, lekin bu yorliqlar baytlarga bog'liq emas. Hujumchi `image/png` yozib, HTML yuborishi mumkin. Cheat sheet kengaytma tekshiruvidagi ma'lum bypass'larni sanaydi: qo'sh kengaytma (`.jpg.php`, `\.jpg` regex'ini aldaydi), null bayt (`.php%00.jpg`, `.jpg` kesilib `.php` qoladi), registr (`.pHp`, `.phP`, registrga sezgir blocklist'ni aylanib o'tadi), konfiguratsiyaga qarab bir xil interpreter'ga bog'lanadigan muqobil kengaytmalar (`.phtml`, `.php5`, `.pht`; `.jspx`, `.aspx`), Windows NTFS Alternate Data Stream (`shell.php::$DATA`; ikki nuqta bor nomni rad etish tavsiya qilinadi) va yaxshi sinalmagan o'zimiz yozgan regex. Tekshiruv fayl nomi dekodlangandan keyin bajarilishi ham ta'kidlanadi.

## Chuqurroq: qatlamlar

### Tur: kengaytma, Content-Type, signature

Uch usulning ishonchliligi har xil:

| Usul | Kim boshqaradi | Ishonchlilik |
|---|---|---|
| Kengaytma (`.png`) | Mijoz (nom) | Past; faqat allowlist bilan, qo'sh kengaytma va registr hisobga olinib |
| Content-Type header | Mijoz | Yo'q; soxtalashtiriladi |
| File signature (magic bytes) | Fayl tarkibi | O'rta; faqat boshini tekshiradi, polyglot o'tib ketadi |

Cheat sheet'da signature tekshiruvi alohida bo'lim sifatida bor va u yolg'iz ishlatilmasligi aytilgan, chunki uni aylanib o'tish keng tarqalgan va oson. Uning chegarasi: u faylning boshidagi baytlarni ko'radi. PNG yoki PDF signature bilan boshlanib, ichida brauzer HTML sifatida ham o'qiy oladigan matn bo'lgan fayl (polyglot) shu tekshiruvdan o'tadi. Shuning uchun keyingi qatlam kerak: xavfsiz berish va, imkon bo'lsa, tarkibni qayta kodlash. Cheat sheet rasmlar uchun ruxsat etilgan formatga decode va re-encode qilishni, keraksiz metadata'ni aniq olib tashlashni aytadi; lekin qayta yozish barcha zararli tarkib yo'qolishini kafolatlamaydi va rasm protsessorining o'zi ham ishonchsiz kirish bilan ishlaydi, shuning uchun yangilangan kutubxona, cheklangan formatlar, resurs limitlari va sandbox kerak. PDF, DOCX kabi turlarda CDR tilga olinadi. ZIP fayllar tavsiya etilmaydi, chunki ular har xil turdagi fayllarni olib kirishi mumkin. Ommaviy xizmat esa noqonuniy kontent haqida xabar berish yo'lini ham berishi kerak.

### Nom va yo'l: path traversal

Mijoz nomini fayl tizimi yo'liga qo'shish (`uploads/${name}`) path traversal'ning klassik manbai: `../../app/config.js` kabi nom saqlash katalogidan chiqib ketadi. Cheat sheet bu tahdidni "mavjud faylni ustiga yozish" sifatida sanaydi va yechim sifatida ilova yaratgan nomni ko'rsatadi. `..` ni qidirib o'chirish ishonchsiz (kodlash variantlari va rekursiv almashtirishlar bor); eng sodda va ishonchli yo'l: mijoz nomini fayl tizimiga umuman bermaslik. Cheat sheet tasodifiy nom (UUID/GUID) ni muhim deb ataydi. Asl nom biznesga kerak bo'lsa (yuklab olishda ko'rsatish uchun), uni bazada metadata sifatida saqlang va quyidagi qoidalarni qo'llang: maksimal uzunlik, ruxsat etilgan belgilar to'plami (harf-raqam, defis, bo'shliq, nuqta), bosh nuqta (yashirin fayl) va ketma-ket nuqtalarni (directory traversal) rad etish, bosh defis yoki bo'shliqni rad etish (shell skriptlarda xavfsizroq ishlash uchun). Windows/NTFS'da uzun nomning 8.3 qisqa alias'i bo'lishi mumkin: faqat uzun nomni tekshiradigan overwrite tekshiruvi alias orqali aylanib o'tilishi mumkin, nomni serverda yaratish bu xavfni yo'qotadi. Path traversal alohida darsda chuqur ko'riladi (26-dars).

### Saqlash joyi va berish

Cheat sheet saqlash joylarini xavfsizlik ustuvorligi bo'yicha tartiblaydi: eng yaxshisi boshqa host, keyin webroot'dan tashqarida (faqat ma'muriy kirish), eng oxirgi webroot ichida faqat yozish huquqi bilan (o'qish kerak bo'lsa nazorat shart). Bazada saqlash ham mumkin, lekin performans, zaxira va SQL injection xavfi bilan keladi. Yana bir tahdid: hujumchi `.htaccess` yoki `web.config` kabi server konfiguratsiya faylini yuklashi mumkin; upload katalogida per-directory override'larni o'chirish ikkinchi qatlam. Fayl tizimi huquqlari ham eng kam imtiyoz tamoyilida bo'lsin. Berish qoidalari cheat sheet'da emas, ular 16-dars va umumiy veb xavfsizlik amaliyotidan: faylni foydalanuvchiga berishda server o'zi Content-Type'ni belgilaydi (signature'dan chiqarilgan), `X-Content-Type-Options: nosniff` qo'yadi (16-dars) va aralash kontent uchun `Content-Disposition: attachment` ishlatadi. Rasmni sahifada ko'rsatish kerak bo'lsa, ilovaning asosiy originidan emas, alohida domen (origin) dan bering: shunda polyglot ichidagi skript ilova cookie'lari va storage'iga yetmaydi (12-dars). Ommaviy fayllar uchun cheat sheet ID bo'yicha handler (`someid` dan `file.ext`) tavsiya qiladi; bu ham bashorat qilinadigan ID ga qarshi avtorizatsiyani talab qiladi (52-dars).

### Hajm, arxivlar va xotira

Hajm limiti ikki joyda bo'lishi kerak. Birinchisi, HTTP so'rov darajasida (reverse proxy yoki framework): limitdan oshganda oqim o'qilishi to'xtatiladi. Ikkinchisi, ishlov bosqichida: ZIP yoki XML ochilgandan keyingi hajm. Cheat sheet "Upload and Download Limits" bo'limida arxiv ochilgandan keyingi hajmni hisobga olishni va ZIP hajmini xavfsiz usullar bilan hisoblashni aytadi; yuklab olish xizmati uchun ham so'rov limitlari kerak. Katta faylni `Buffer` ga to'liq yuklash serverning xotirasini bir so'rov bilan tugatishi mumkin: oqim (stream) bilan to'g'ridan-to'g'ri storage'ga yozing. Bu API4 (resurs iste'moli) ning aniq ko'rinishi.

### Ichki tarkib va ishlov

Yuklangan fayl keyin serverda ishlanadimi (rasmni kichraytirish, PDF'dan matn ajratish, CSV import)? Unda parser zaifligi (ImageTrick, XXE) va injection yuzasi (CSV'dagi qiymatlar jadvalga yoki buyruqqa uzatilishi) paydo bo'ladi. OWASP Top 10:2025 da A05 Injection kategoriyasi aynan interpreter'ga ishonchsiz ma'lumot uzatish haqida; fayl tarkibi ham shu qoidaga bo'ysunadi. Ishlovni alohida past huquqli jarayonda (sandbox) bajaring, kutubxonalarni yangilab turing.

## Misol: rasm yuklash endpoint'i

Quyida mashina rasmi yuklash funksiyasi. Kod faqat o'quv in-memory modelida: fayl tizimi o'rniga "yo'l" hisoblanadi, serverdan javob header'lari sifatida qaytadi. Real tizimga hujum yo'q.

### 1. Zaif kod

```ts run
type Upload = { filename: string; contentType: string; bytes: Uint8Array };

// Brauzerning .. ni hal qilishiga o'xshash oddiy normalizatsiya (path moduli bu yerda yo'q)
function normalize(p: string): string {
  const out: string[] = [];
  for (const part of p.split("/")) {
    if (part === "..") out.pop();
    else if (part !== "." && part !== "") out.push(part);
  }
  return out.join("/");
}

// ZAIF: nom va Content-Type'ga ishonadi, nomni yo'lga qo'shadi
function saveWeak(u: Upload) {
  if (!u.contentType.startsWith("image/")) return { ok: false as const };
  if (!u.filename.includes(".png")) return { ok: false as const };
  const path = normalize("var/www/app/uploads/" + u.filename);
  const servedAs = u.filename.endsWith(".html") ? "text/html" : u.contentType;
  return { ok: true as const, path, servedAs };
}

const enc = new TextEncoder();
const r1 = saveWeak({ filename: "photo.png.html", contentType: "image/png", bytes: enc.encode("<script>alert(1)</script>") });
const r2 = saveWeak({ filename: "../../../app/config.png", contentType: "image/png", bytes: enc.encode("x") });
console.log("1)", JSON.stringify(r1));
console.log("2)", JSON.stringify(r2));
```

### 2. Hujum

Hujumchi ikkita fayl yuboradi: birinchisi `photo.png.html` nomi, `image/png` header va ichida HTML skript. Ikkinchisi nomida `../` bor. Natija o'quv modelimizda:

```text
1) {"ok":true,"path":"var/www/app/uploads/photo.png.html","servedAs":"text/html"}
2) {"ok":true,"path":"var/app/config.png","servedAs":"image/png"}
```

Birinchi fayl tekshiruvdan o'tdi, `.html` bilan saqlandi va `text/html` sifatida beriladi: brauzer uni ilova originida HTML qilib ochadi va skript ishga tushadi (stored XSS). Ikkinchisida yo'l `uploads` papkasidan chiqib ketdi va `var/app/config.png` bo'ldi, ya'ni ilova papkalaridagi fayl ustiga yozishga yo'l ochildi.

### 3. Tuzatilgan kod

```ts run
type Upload = { filename: string; contentType: string; bytes: Uint8Array };
type Stored = { ok: true; stored: string; headers: Record<string, string> } | { ok: false; reason: string };

const MAX_BYTES = 2 * 1024 * 1024;
const SIGNATURES = [
  { ext: "png", mime: "image/png", magic: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { ext: "jpg", mime: "image/jpeg", magic: [0xff, 0xd8, 0xff] },
];

let counter = 0;
function save(u: Upload): Stored {
  if (u.bytes.length === 0 || u.bytes.length > MAX_BYTES) return { ok: false, reason: "hajm" };
  const sig = SIGNATURES.find((s) => s.magic.every((v, i) => u.bytes[i] === v));
  if (!sig) return { ok: false, reason: "tur" }; // filename va contentType e'tiborga olinmaydi
  const stored = `f_${++counter}.${sig.ext}`; // ilova yaratgan nom
  return {
    ok: true,
    stored: "var/data/uploads/" + stored, // webroot'dan tashqarida
    headers: {
      "Content-Type": sig.mime,
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": `attachment; filename="${stored}"`,
    },
  };
}

const enc = new TextEncoder();
const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
console.log("1)", JSON.stringify(save({ filename: "photo.png.html", contentType: "image/png", bytes: enc.encode("<script>alert(1)</script>") })));
console.log("2)", JSON.stringify(save({ filename: "../../../app/config.png", contentType: "image/png", bytes: png })));
console.log("3)", JSON.stringify(save({ filename: "a.png", contentType: "image/png", bytes: new Uint8Array(3 * 1024 * 1024) })));
```

```text
1) {"ok":false,"reason":"tur"}
2) {"ok":true,"stored":"var/data/uploads/f_1.png","headers":{"Content-Type":"image/png","X-Content-Type-Options":"nosniff","Content-Disposition":"attachment; filename=\"f_1.png\""}}
3) {"ok":false,"reason":"hajm"}
```

### Tuzatish nima uchun yetarli

Invariant: saqlash yo'li va berish turi mijoz yuborgan nom yoki header'dan hosil bo'lmaydi. Birinchi hujumda baytlar PNG signature'iga ega emas, shuning uchun rad etildi (HTML fayl kengaytmasi va Content-Type'ning ahamiyati yo'q). Ikkinchisida baytlar PNG, lekin nom e'tiborga olinmaydi, saqlash nomi `f_1.png`, ya'ni `..` ta'sir qila olmaydi. Berishda server turni o'zi belgilaydi va `nosniff` va `attachment` bilan chiqaradi. Uchinchi so'rov hajm limitida to'xtatildi.

Yopilmagan narsalar: PNG signature bilan boshlanuvchi polyglot o'tib ketadi. Unga qarshi yagona himoya `nosniff` va `attachment` bilan berish, alohida origin va tarkibni qayta kodlash, bular bu misolda faqat header sifatida ko'rsatilgan. Antivirus, ZIP/XML bomba, metadata (EXIF'dagi GPS) tozalash, fayl ma'nosiga mos o'lchamlar tekshiruvi (rasm eni va bo'yi) kodda yo'q. Hajm limiti ham bu yerda baytlar xotiraga allaqachon kelganidan keyin tekshirilyapti, real serverda oqim darajasida cheklanadi. Tur allowlist'i kichik (PNG, JPEG); real ehtiyojga qarab kengayadi.

## Qachon qo'llamaslik kerak

- Magic byte tekshiruvi har format uchun mavjud emas. CSV, oddiy matn va ba'zi yadroviy formatlarda signature yo'q; ular uchun tarkibni to'liq parse qilib, qat'iy sxemaga tekshirish kerak (72-dars).
- Mijoz kodidagi kengaytma tekshiruvi (`<input accept=".png">`) foydalanuvchi uchun qulaylik, xavfsizlik emas; server tekshiruvi har doim majburiy.
- Hamma yuklamani antivirus yoki sandbox'dan o'tkazish kichik jamoa uchun og'ir yuk bo'lishi mumkin. Xavf darajasiga qarab tanlang: ommaga ochiq tarqatiladigan fayllar yuqori xavf, faqat ichki tahlil uchun fayl past xavf.
- Nomni butunlay tashlash foydalanuvchi qulayligiga ta'sir qiladi (yuklab olishda asl nomni ko'rmaydi). Asl nomni metadata sifatida saqlab, chiqarishda kodlash orqali yarashtiring.
- Obyekt storage'ga to'g'ridan-to'g'ri yuklash (imzolangan havola orqali) serverni resursdan ozod qiladi, lekin hajm va tur cheklovlarini storage siyosatiga o'tkazishni talab qiladi. Bu qaror xavfsizlik va murakkablik o'rtasidagi kelishuv; bu dars uni chuqur ko'rmaydi.

## Stack'da: NestJS, Fastify va Prisma

NestJS fayl yuklashni multer ustida quradi (Express adapteri); Fastify adapterida xuddi shu interceptor'lar `@fastify/multipart` ustida ishlaydi. Xavfsizlik uchun hujjatdan muhim faktlar: multer standart holda xotira storage'idan foydalanadi, ya'ni har yuklangan fayl to'liq `Buffer` sifatida xotiraga o'qiladi, va hujjat ogohlantiradi: Multer standart holda fayl hajmini cheklamaydi, shuning uchun xotirada saqlanganda `limits.fileSize` ni doim qo'ying. Limit oshsa Nest 413 qaytaradi (boshqa limitlar uchun 400) va handler chaqirilmaydi. Hujjat farqni ham aytadi: `MaxFileSizeValidator` butun fayl qabul qilingandan keyin ishlaydi, `limits.fileSize` esa Multer fayl saqlashni limitga yetgan zahoti to'xtatadi. Xotira sarfi fayl hajmiga bog'liq bo'lmasligi uchun `diskStorage()` ishlating; `dest` opsiyasi fayllarni tasodifiy nom bilan yozadi. Diskdagi fayllar handler tugagandan keyin avtomatik o'chirilmaydi, ularni `unlink()` bilan o'zingiz o'chirasiz (hujjatga ko'ra NestJS v12.2 dan boshlab pipe so'rovni rad etsa, saqlangan fayllar xato javobi yuborilgandan keyin o'chiriladi).

Tur uchun `ParseFilePipe` ichida `FileTypeValidator` bor va u standart holda MIME turini fayl tarkibining magic number'idan aniqlaydi (client yuborgan turdan emas), `MaxFileSizeValidator` esa bayt hisobida hajmni tekshiradi. Bu cheat sheet'dagi signature tekshiruviga to'g'ri keladi, shuning uchun u polyglot'ni to'xtatmaydi. `@fastify/multipart` Multer'dan qattiqroq standartga ega: `fileSize` Fastify `bodyLimit` ga (standart 1 MiB) teng, qismlar soni 1000, Multer esa ikkalasini ham cheklamaydi. Fastify'da faqat stream bilan ishlaydigan `FileStreamInterceptor` bor; fayl buferlanmagani uchun `MaxFileSizeValidator` va `FileTypeValidator` magic number tekshiruvi unga qo'llanmaydi, lekin `fileSize` limiti saqlanadi.

```ts
import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

@Controller("vehicles/:id/photos")
export class PhotosController {
  @Post()
  @UseInterceptors(FileInterceptor("file", { limits: { fileSize: 2 * 1024 * 1024, files: 1 } }))
  async upload(@UploadedFile() file: { buffer: Buffer; originalname: string } | undefined) {
    if (!file) throw new BadRequestException();
    const isPng = PNG.every((v, i) => file.buffer[i] === v);
    if (!isPng) throw new BadRequestException("ruxsat etilmagan tur");
    // 1) mashina shu tenant'ga tegishliligini tekshirish (52-dars)
    // 2) saqlash kaliti: ilova yaratgan UUID; file.originalname faqat metadata
    // 3) obyekt storage'ga yozish, bazaga kalitni saqlash
    return { stored: true };
  }
}
```

Tekshiruvlar tartibiga e'tibor bering: avtorizatsiya (mashina egaligi) tur tekshiruvidan oldin yoki u bilan birga bo'lishi kerak, chunki ruxsati yo'q foydalanuvchining fayliga ishlov berish resurs sarflaydi va xabarlar orqali ma'lumot sizdiradi.

## Xulosa

- Fayl nomi, Content-Type va kengaytma mijoz yozadigan "yorliq"lar; faylning haqiqiy turi tarkibdan aniqlanadi va saqlash nomini ilova yaratadi.
- Faqat ruxsat etilgan kengaytmalar va turlar ro'yxati (allowlist) ishlating; qo'sh kengaytma, null bayt va registr bypass'lari blocklist'dan o'tib ketadi.
- Mijoz nomini fayl yo'liga qo'shmang: bu path traversal va mavjud faylni ustiga yozishga olib keladi.
- Hajm limitini oqim darajasida va arxivlar ochilgandan keyin qo'llang; fayl o'qishni to'liq xotiraga yuklamang.
- Magic byte tekshiruvi polyglot'ni to'xtatmaydi: xavfsiz berish (aniq Content-Type, nosniff, attachment, alohida origin) va qayta kodlash kerak.
- Faylni ijro etilmaydigan joyda saqlang va uni o'qishga avtorizatsiyani alohida tekshiring.
