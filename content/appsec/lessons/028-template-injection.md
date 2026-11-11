---
n: 28
slug: template-injection
title: "Server-side template injection"
summary: "SSTI: foydalanuvchi kiritishi template manbasiga aylanib, engine tomonidan kod sifatida baholanadi. Dars kiritish template'ga o'tadigan uch yo'lni, escaping nega SSTI'dan himoya qilmasligini, minimal render kontekstini, mantiqsiz engine tanlovini va foydalanuvchi template'lari uchun sandbox chegarasini mini engine'da ko'rsatadi."
duration: 45
sources:
  - id: cs-input
    note: "Input Validation Cheat Sheet: ijobiy validatsiya va ma'lumotni kod sifatida ishlatmaslik g'oyasi (umumiy yo'nalish)"
  - id: t10-a05
    note: "A05 Injection: ishonchsiz kiritish interpreter'ga yuborilib, qismi buyruq sifatida bajariladi; ma'lumot va buyruqni ajratish eng yaxshi chora"
  - id: wstg
    note: "WSTG-INJT-18 Server-side Template Injection: foydalanuvchi kiritishi template'ga xavfsiz bo'lmagan tarzda joylashganda yuz beradi, wiki, sharh, marketing va CMS kabi foydalanuvchi markupini qo'llab-quvvatlaydigan funksiyalar xavfli bo'lishi mumkin"
  - id: asvs
    note: "ASVS 5.0.0 talab 1.3.2: eval() va boshqa dinamik kod bajarish xususiyatlaridan qochish; muqobil bo'lmasa, kiritilgan qiymat bajarishdan oldin tozalanishi kerak (Level 1)"
quiz:
  - q: "Quyidagi kodda SSTI bormi?\n\n```ts\nconst html = engine.compile(\"Salom, \" + user.name + \"!\")(ctx);\n```"
    options:
      - "Yo'q: `ctx` alohida uzatilgan"
      - "Yo'q: engine auto-escape qiladi"
      - "Faqat `name` uzun bo'lsa"
      - "Ha: `user.name` template manbasiga qo'shilmoqda, shuning uchun engine uni template kodi sifatida tahlil qiladi"
    answer: 3
    explain: "Xavfli joy - `compile` ga beriladigan matnning o'zi. Foydalanuvchi qiymati manba matnining qismi bo'lsa, engine uning ichidagi `{{ ... }}` kabi sintaksisni baholaydi. `ctx` alohida uzatilgani yoki auto-escape bu holatni o'zgartirmaydi."
  - q: "Auto-escape yoqilgan. Nima uchun u SSTI'dan himoya qilmaydi?"
    options:
      - "Auto-escape faqat JSON uchun ishlaydi"
      - "Escape template parse qilingandan keyin chop etiladigan qiymatlarga qo'llanadi; template kodi allaqachon parse qilingan va baholangan"
      - "Auto-escape SSTI'dan himoya qiladi"
      - "Auto-escape faqat atributlarda ishlaydi"
    answer: 1
    explain: "Escape qiymat chiqarilayotganda ishlaydi (XSS uchun). SSTI'da hujumchi qiymatni emas, template manbasini boshqaradi, shuning uchun u escape'dan oldingi bosqichda kodni ishlatadi. Cheat sheet buni shunday ta'riflaydi."
  - q: "Foydalanuvchi hisobot shabloni nomini yuboradi: `?tpl=monthly`. Kod `engine.render(req.query.tpl, data)`. Nima qilish kerak?"
    options:
      - "Nomning oxiriga `.html` qo'shish"
      - "Nomni serverdagi qat'iy ro'yxatga (map) solishtirib, ro'yxatdagi template'ni tanlash; ro'yxatda bo'lmasa rad etish"
      - "Nomdagi `/` belgilarini olib tashlash"
      - "Hech narsa: nom faqat matn"
    answer: 1
    explain: "Kiritish template tanlasa, engine fayllarni yoki include'larni kutilmagan joydan yuklashi mumkin. To'g'ri yechim: nomni ruxsat etilgan ro'yxatga bog'lash. Kengaytma qo'shish yoki belgilarni olib tashlash allow-list o'rnini bosmaydi."
  - q: "Template'ga `render(tpl, { user, config, db, secrets })` kabi katta kontekst beriladi. Nima uchun bu muammo?"
    options:
      - "Sekin ishlaydi"
      - "Kontekst obyekti ham ma'lumot sifatida yoziladi"
      - "SSTI bo'lsa, injection'ga kontekstdagi hamma narsa ochiq bo'ladi; kontekst faqat template'ga kerak qiymatlardan iborat bo'lishi kerak"
      - "Muammo yo'q: template matni qattiq yozilgan bo'lsa"
    answer: 2
    explain: "Minimal kontekst zarar radiusini cheklaydi: injection bo'lsa ham undan ko'rinadigan narsalar kam. Cheat sheet buni alohida tavsiya qiladi, lekin sandboxsiz engine'da kod bajarilishini o'zi to'xtatmasligini ham aytadi."
  - q: "Mijozlar o'z xat shablonlarini tahrirlaydigan funksiya (email builder) bor. Qaysi yondashuv to'g'ri?"
    options:
      - "Imtiyozli funksiya sifatida qarash: tahrirlash huquqini cheklash, auditga yozish, engine sandbox/cheklangan rejimida render qilish, jarayonni vaqt va xotira cheklovi bilan izolyatsiya qilish"
      - "Template matnidagi `{{` belgilarini qora ro'yxatga solish"
      - "Hamma foydalanuvchiga ruxsat berish, auto-escape yoqilgan bo'lsa yetarli"
      - "Hech narsa qilmaslik"
    answer: 0
    explain: "Foydalanuvchi template yozishi kod yozishdir. Cheat sheet qora ro'yxatni (sintaksis engine va kontekstga qarab farq qiladi) rad etadi, sandbox, huquq cheklovi, audit va izolyatsiyani tavsiya qiladi. Sandbox CPU/xotirani ham cheklamaydi."
  - q: "Engine tanlashda cheat sheet qaysi tamoyilni aytadi?"
    options:
      - "Eng kuchli engine'ni tanlang"
      - "Faqat kompilyatsiya qilinadigan engine"
      - "Imkon qadar kam kuchga ega (masalan, mantiqsiz, Mustache kabi) engine tanlang; ro'yxatdan o'tkazilgan helper'lar baribir ilova kodi sifatida ishlaydi"
      - "Engine tanlash xavfsizlikka ta'sir qilmaydi"
    answer: 2
    explain: "Ifoda quvvati kamroq bo'lsa, injection imkoniyati ham kamroq. Lekin siz ro'yxatdan o'tkazgan helper va lambda funksiyalar to'liq ilova kodi sifatida bajariladi, ularning o'zi ham xavfsiz bo'lishi kerak."
task:
  title: "Xat shabloni: manba o'rniga ma'lumot"
  prompt: |
    Platforma mijozga hisob xabarini `renderMail(name)` bilan yuboradi. Mini engine `{{ yo'l }}` ifodalarini kontekstdan oladi. Hozir `name` shablon matniga qo'shiladi, shuning uchun `name = "{{config.dbUrl}}"` kontekstdagi maxfiy qiymatni xatga chiqaradi. Kontekstga esa konfiguratsiya ham qo'shilgan.

    Tuzating: shablon qat'iy matn bo'lsin, `name` faqat `user.name` o'zgaruvchisi sifatida uzatilsin, kontekstda faqat shablonga kerak narsa (`user.name`) qolsin. Qiymat engine tomonidan HTML-escape qilinadi (mavjud). `render` va imzoni o'zgartirmang. Kutilgan natija: oddiy ism uchun salom, hujum qiymati esa o'z shaklida (escape qilingan holda) xatda ko'rinadi, `postgres://` matni hech qachon chiqmaydi.
  lang: ts
  starter: |
    const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

    // Mini engine: faqat {{ yo'l }} ifodalari, bir o'tishda
    function render(tpl: string, ctx: Record<string, unknown>): string {
      return tpl.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_m, path: string) => {
        let v: unknown = ctx;
        for (const k of path.split(".")) v = (v as Record<string, unknown> | undefined)?.[k];
        return v === undefined ? "" : esc(String(v));
      });
    }

    const CONFIG = { dbUrl: "postgres://app:s3cr3t@db/fleet" };

    function renderMail(name: string): string {
      return render("Salom, " + name + "! Hisobingiz tayyor.", { user: { name }, config: CONFIG });
    }

    for (const n of ["Ali", "{{config.dbUrl}}", "<b>x</b>"]) console.log(renderMail(n));
  solution: |
    const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

    // Mini engine: faqat {{ yo'l }} ifodalari, bir o'tishda
    function render(tpl: string, ctx: Record<string, unknown>): string {
      return tpl.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_m, path: string) => {
        let v: unknown = ctx;
        for (const k of path.split(".")) v = (v as Record<string, unknown> | undefined)?.[k];
        return v === undefined ? "" : esc(String(v));
      });
    }

    const MAIL_TEMPLATE = "Salom, {{ user.name }}! Hisobingiz tayyor.";

    function renderMail(name: string): string {
      return render(MAIL_TEMPLATE, { user: { name: String(name) } });
    }

    for (const n of ["Ali", "{{config.dbUrl}}", "<b>x</b>"]) console.log(renderMail(n));
  solutionNotes: |
    - Template manbasi endi koddagi doimiy: foydalanuvchi qiymati faqat `user.name` o'zgaruvchisi sifatida o'tadi. Engine qiymatni bir o'tishda almashtirgani va natijani qayta tahlil qilmagani uchun `{{config.dbUrl}}` matn bo'lib qoladi (parametrlangan so'rovning template'dagi o'xshashi).
    - Kontekstdan `config` olib tashlandi: template ko'rishi mumkin bo'lgan narsa `user.name` bilan cheklandi. Agar kelajakda manba yana kiritish bilan yig'ilsa ham, zarar radiusi kichik.
    - Escape ham saqlanadi (XSS uchun), lekin SSTI'dan himoya qilgan u emas: SSTI'ni template manbasi va ma'lumot ajratilishi yopadi.
    - Qoplanmaydi: haqiqiy engine'lar (EJS, Pug va boshqalar) ifodalarni JavaScript sifatida baholaydi, shuning uchun bu yerda kontekstni cheklash sandbox o'rnini bosmaydi; manba hech qachon kiritish bilan yig'ilmasligi shart. Xat yuborish zanjiridagi boshqa xavflar (header injection, 50-dars) ham alohida.
  checklist:
    - "Shablon matni qat'iy doimiy, kiritish bilan yig'ilmaydi"
    - "`name` faqat `user.name` o'zgaruvchisi sifatida uzatiladi"
    - "Kontekstda `config` yo'q"
    - "HTML-escape saqlangan"
    - "Kontekstni cheklash sandbox emasligini tushuntira olasiz"
---

## Muammo

Server tomonda HTML, xat yoki PDF yasash uchun template engine ishlatiladi: EJS, Pug, Handlebars, Nunjucks, Mustache yoki Next.js'dagi JSX (u template engine emas, lekin xuddi shu savol bor). Dasturchi uchun template shunchaki "matn va bo'sh joylar". Template engine uchun esa bu kichik dastur: ifodalar, sikllar, shartlar, funksiya chaqiruvlari. Foydalanuvchi qiymati bo'sh joyga ma'lumot sifatida tushsa hammasi joyida. Lekin qiymat template matnining o'ziga qo'shilsa, engine uni dastur qismi deb o'qiydi.

OWASP Server-Side Template Injection Prevention Cheat Sheet SSTI'ni shunday ta'riflaydi: server tomondagi template engine ishonchsiz kiritishni ma'lumot o'rniga template kodi sifatida baholaydi. Natijada kiritilgan sintaksis engine'ning ilova obyektlariga kirish huquqi bilan bajariladi, va engine hamda sozlamaga qarab ta'sir maxfiy ma'lumot va fayllarni o'qishdan masofadan kod bajarilishigacha boradi. WSTG ham (WSTG-INJT-18) wiki sahifalar, sharhlar, marketing ilovalari va CMS kabi foydalanuvchi markupini qo'llab-quvvatlaydigan funksiyalar xavfli bo'lishi mumkinligini yozadi.

Ikkinchi muammo: dasturchilar SSTI'ni XSS bilan aralashtiradi. XSS'da qiymat brauzerga zararli HTML bo'lib boradi va himoya output encoding (32-dars). SSTI'da zarar serverda, template parse qilinayotganda yuz beradi, shuning uchun HTML escape bu yerda yordam bermaydi. 21-darsdagi modelda interpreter template engine, boshqaruv qismi template manbasi, ma'lumot qismi esa o'zgaruvchilar. Himoya: manbani qiymat bilan hech qachon yig'maslik.

## Asosiy g'oya

### Kiritish template'ga o'tadigan uch yo'l

Cheat sheet kiritish template kodiga o'tadigan uch yo'lni ajratadi:

1. Kiritish template manbasiga aylanadi. So'rov parametri, saqlangan foydalanuvchi matni yoki uchinchi tomon fayli template satriga qo'shiladi, hatto `"Hello {{" + name + "}}"` kabi ifoda ichida bo'lsa ham, yoki "satrdan template" API'siga uzatiladi (Jinja2'ning `from_string()`, Flask'ning `render_template_string()`).
2. Qat'iy template ichidagi xususiyat satrni kod sifatida baholaydi. Misollar: FreeMarker'ning `?interpret` va `?eval`, Twig'ning `template_from_string()`.
3. Kiritish template'ni tanlaydi. Foydalanuvchi template nomi, yo'li yoki include maqsadini belgilaydi va engine kutilmagan fayllarni yuklaydi.

Node.js ekotizimida bu mos ravishda `ejs.render(userString, data)`, `Handlebars.compile(userString)`, `pug.render(userString)` va `res.render(req.query.view)` kabi qatorlar. Qoida: template satrini hech qachon kiritish bilan yig'maslik va `render(nom)` ga foydalanuvchi nomini to'g'ridan-to'g'ri bermaslik.

### Himoya choralar

ASVS 5.0.0 ning 1.3.2 talabi (Level 1) ham eval() va shunga o'xshash dinamik kod bajarish xususiyatlaridan qochishni so'raydi; template engine'ga satrdan template yig'ish shu toifaga yaqin.

Cheat sheet'ning prevention bo'limi quyidagi tartibda:

- Template'larni kod deb qarash: ilova manbasi bilan saqlash, o'zgarishlarini code review'dan o'tkazish, ishonchsiz ma'lumotdan yasamaslik. Template nomini foydalanuvchi tanlasa, uni serverdagi ruxsat etilgan nomlar ro'yxatiga bog'lash.
- Ishonchsiz kiritishni faqat ma'lumot sifatida berish: qat'iy template renderlanadi, qiymatlar nomlangan o'zgaruvchilar orqali uzatiladi (parametrlangan so'rovga o'xshab).
- Render kontekstini minimal saqlash: template kontekstdagi hamma narsani o'qiy oladi va engine'ga qarab obyektlar metodlarini chaqira oladi; maxfiy qiymatlar, konfiguratsiya, servis klientlari va yon ta'sirli obyektlar kontekstga berilmasligi kerak. Bu injection ko'ra oladigan narsani cheklaydi, lekin sandboxsiz engine'da kod bajarilishini o'zi to'xtatmaydi.
- Eng kam kuchli engine'ni tanlash, masalan Mustache kabi mantiqsiz engine; ro'yxatdan o'tkazilgan helper va lambda funksiyalar baribir ilova kodi sifatida ishlaydi.
- Chiqish escape'ini yoqilgan holda saqlash: u XSS'dan yordam beradi, lekin SSTI'dan emas, chunki escape engine allaqachon parse qilgan template kodiga emas, chop etiladigan qiymatlarga qo'llanadi.

Cheat sheet bitta muhim ogohlantirishni alohida beradi: template sintaksisini kiritishdan filtrlashga urinmang, chunki sintaksis engine va kontekstga qarab farq qiladi va qora ro'yxat payload'larni o'tkazib yuboradi.

## Chuqurroq: nozik holatlar

### Aniqlash: "ifoda baholanadimi"

Testlashda (WSTG) maqsad kiritilgan qiymat ma'lumot sifatida emas, template sintaksisi sifatida talqin qilinishini aniqlash. Bu bosqichda sintaksis engine'ga bog'liq, shuning uchun test avval qaysi engine ishlatilayotganini aniqlashni talab qiladi. Bu dars bu tafsilotlarni bermaydi: qaysi engine bo'lishidan qat'i nazar, ushbu kursda himoya bitta: manba kiritish bilan yig'ilmaydi.

### Node.js engine'larining xususiyati

EJS va Pug kabi engine'lar template'ni JavaScript kodiga kompilyatsiya qiladi va ifodalar ichida JavaScript ishlaydi; shuning uchun manbaga kiritilgan qiymat to'g'ridan-to'g'ri Node.js jarayonida kod bajarilishiga olib kelishi mumkin. Handlebars va Mustache mantiqini cheklaydi, lekin ro'yxatdan o'tkazilgan helper'lar va `{{{ }}}` (escape'siz chiqarish) tufayli chegarani siz boshqarasiz. Bu qism bu dars yozilganda mahalliy manba korpusidan tekshirilmagan: cheat sheet faqat Jinja2, Twig va FreeMarker uchun konfiguratsiya beradi; Node engine'lari uchun o'z hujjatiga qarang.

### Sandbox chegarasi

Cheat sheet'ga ko'ra sandbox (Jinja2 `SandboxedEnvironment`, Twig sandbox, FreeMarker sozlamalari) foydalanuvchi template yozadigan funksiyalar uchun bor, lekin u CPU va xotira sarfini cheklamaydi va chiqarilgan natijani xavfsiz qilmaydi. Shuning uchun cheat sheet izolyatsiyani tavsiya qiladi: alohida jarayon yoki konteyner, vaqt va xotira cheklovi, maxfiy ma'lumotsiz muhit va cheklangan tarmoq.

### Template ichidagi maxfiy ma'lumot

Kontekstga `process.env`, ORM klienti, konfiguratsiya obyekti yoki `req` obyektining o'zini berish keng tarqalgan qulaylik. Bu qulaylik SSTI paytida eng katta zarar manbai bo'ladi. Template'ga faqat ko'rsatiladigan qiymatlarni DTO ko'rinishida bering.

### Qaerda template bor: inventar

Cheat sheet tavsiyasi: ilovada template render qilinadigan hamma joyni sanab chiqing, shu jumladan xat va bildirishnoma matnlari, PDF va hisobot yaratish, LLM uchun prompt shablonlari va foydalanuvchi template yaratadigan yoki tahrirlaydigan har funksiya. Uchinchi tomon fayllari bilan kelgan template'larni o'zingiz yozmagan kod sifatida qarang. Avtopark platformasida bu odatda: haydovchiga SMS, mijozga haftalik hisobot, PDF dalolatnoma, webhook payload shabloni. Har birining manbasi koddami yoki bazadami, kim tahrirlay oladi, kontekstga nima beriladi, shularni jadvalga yozing.

### Qidirish

Kod bazasida "satrdan template" API'larini qidiring (cheat sheet misollar sanaydi: Jinja2'ning `from_string()`, Flask'ning `render_template_string()`, Twig'ning `createTemplate()` va `template_from_string()`, FreeMarker'ning `Template` konstruktori va `?interpret`, `?eval`). Node.js'da shunga o'xshash chaqiruvlar engine'ning `compile` va `render` funksiyalari, ularga satr berilgan joylar. Har chaqiruv uchun tasdiqlang: ishonchsiz ma'lumot faqat render o'zgaruvchilariga tushadi va hech bir template uni satrni kod sifatida baholaydigan xususiyatga uzatmaydi.

### SSTI va boshqa injection'larning chegarasi

Template ichiga yig'ilgan HTML qismi XSS beradi (31-34-darslar), template ichiga yig'ilgan SQL esa SQL injection. Engine'ning o'zi ham interpreter, shuning uchun uning kirishi uchun alohida himoya qatlami kerak. Har interpreter o'z kirishi chegarasida ma'lumotni kodga aylantirmaslikni talab qiladi: bu 21-darsdagi asosiy xulosa.

## Misol: mini engine'da

Mini engine `{{ yo'l }}` ifodalarini kontekstdan oladi, qiymatni HTML-escape qiladi va natijani qayta tahlil qilmaydi. Haqiqiy engine'lardan sodda, lekin "manba va ma'lumot" chegarasi ko'rsatiladi. Haqiqiy kod bajarilishiga olib keladigan payload'lar keltirilmaydi.

### 1. Zaif kod

```ts run
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// Mini engine: faqat {{ yo'l }} ifodalari, bir o'tishda; qiymatlar HTML-escape qilinadi
function render(tpl: string, ctx: Record<string, unknown>): string {
  return tpl.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_m, path: string) => {
    let v: unknown = ctx;
    for (const k of path.split(".")) v = (v as Record<string, unknown> | undefined)?.[k];
    return v === undefined ? "" : esc(String(v));
  });
}

const CONFIG = { dbUrl: "postgres://app:s3cr3t@db/fleet" };

// ZAIF: name template manbasiga qo'shiladi, kontekstda esa config ham bor
function renderMailWeak(name: string): string {
  return render("Salom, " + name + "! Hisobingiz tayyor.", { user: { name }, config: CONFIG });
}

console.log(renderMailWeak("Ali"));
```

```text
Salom, Ali! Hisobingiz tayyor.
```

### 2. Hujum

Hujumchi "alfa" foydalanuvchisi, profil ismiga oddiy ism emas, template ifodasi yozadi. Xat yuborilganda server uni ifoda sifatida baholaydi. Faqat shu o'quv engine'iga qarshi.

```ts run
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
function render(tpl: string, ctx: Record<string, unknown>): string {
  return tpl.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_m, path: string) => {
    let v: unknown = ctx;
    for (const k of path.split(".")) v = (v as Record<string, unknown> | undefined)?.[k];
    return v === undefined ? "" : esc(String(v));
  });
}
const CONFIG = { dbUrl: "postgres://app:s3cr3t@db/fleet" };
function renderMailWeak(name: string): string {
  return render("Salom, " + name + "! Hisobingiz tayyor.", { user: { name }, config: CONFIG });
}

console.log(renderMailWeak("{{config.dbUrl}}"));
```

```text
Salom, postgres://app:s3cr3t@db/fleet! Hisobingiz tayyor.
```

Kontekstdagi maxfiy ulanish satri xatga tushdi. Escape uni to'sa olmadi: ifoda template manbasida baholandi, escape esa faqat baholangan natijani (`postgres://...` oddiy matn) HTML uchun xavfsiz qildi. Haqiqiy engine'larda ifodalar kontekstdagi qiymatni o'qishdan ko'proq narsa qila oladi (engine va sozlamaga bog'liq).

### 3. Tuzatilgan kod

```ts run
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
function render(tpl: string, ctx: Record<string, unknown>): string {
  return tpl.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_m, path: string) => {
    let v: unknown = ctx;
    for (const k of path.split(".")) v = (v as Record<string, unknown> | undefined)?.[k];
    return v === undefined ? "" : esc(String(v));
  });
}

// Template'lar kodda, nomi bo'yicha ro'yxatda
const TEMPLATES: Record<string, string> = {
  welcome: "Salom, {{ user.name }}! Hisobingiz tayyor.",
  monthly: "{{ user.name }}, oylik hisobot tayyor.",
};
function renderMail(templateName: string, name: string): string {
  if (!Object.hasOwn(TEMPLATES, templateName)) throw new Error("template ruxsat etilmagan");
  return render(TEMPLATES[templateName], { user: { name } }); // minimal kontekst
}

console.log(renderMail("welcome", "Ali"));
console.log(renderMail("welcome", "{{config.dbUrl}}"));
console.log(renderMail("monthly", "<b>x</b>"));
try { renderMail("../../etc/passwd", "Ali"); } catch (e) { console.log("rad etildi:", (e as Error).message); }
```

```text
Salom, Ali! Hisobingiz tayyor.
Salom, {{config.dbUrl}}! Hisobingiz tayyor.
&lt;b&gt;x&lt;/b&gt;, oylik hisobot tayyor.
rad etildi: template ruxsat etilmagan
```

Nima uchun yetarli: invariant "template manbasi hech qachon kiritishdan yig'ilmaydi" kodda qat'iy `TEMPLATES` jadvali va `render(shablon, ma'lumot)` ajratishi bilan ta'minlangan. Kiritilgan `{{config.dbUrl}}` ma'lumot sifatida o'tdi, shuning uchun u o'z shaklida (matn) chiqdi va qayta baholanmadi; kontekstda `config` ham yo'q. Template nomi ro'yxatga bog'langan, shuning uchun nom bo'yicha tanlash hujumi rad etiladi. Yopilmagan: engine haqiqiy bo'lsa (EJS, Pug), kontekst cheklovi sandbox o'rnini bosmaydi, shuning uchun manba kiritish bilan yig'ilmasligi shart; foydalanuvchi o'zi template yozadigan funksiya (quyida) alohida himoya talab qiladi; escape saqlangani XSS uchun, SSTI uchun emas; xat sarlavhalari va havola injection'i (50-dars) bu darsga kirmaydi.

## Qachon qo'llamaslik kerak

- Foydalanuvchi template yozishi mahsulot talabi bo'lsa (email builder, hisobot dizayneri), "manba hech qachon kiritish bilan yig'ilmaydi" qoidasini qo'llab bo'lmaydi. Bunda funksiyani imtiyozli deb hisoblab, quyidagi chora-tadbirlar to'plami ishlatiladi: tahrirlash huquqi cheklangan rollarda, o'zgarishlar auditga yoziladi, engine sandbox yoki cheklangan rejimda ishlaydi, ro'yxatdan o'tkazilgan helper faqat har qanday argument bilan xavfsiz chaqiriladiganlar, render esa vaqt/xotira cheklangan, maxfiy ma'lumotsiz, tarmog'i cheklangan alohida jarayonda.
- Foydalanuvchi qiymatlarini template'ga qo'yish uchun engine kerak emas bo'lishi mumkin. Oddiy "ism va raqamni xatga qo'yish" uchun `String.prototype.replaceAll` bilan belgilangan joylarni (`{{name}}`) almashtirish yetarli, lekin bu o'zingiz yozgan engine bo'ladi: u bir o'tishda ishlashi va natijani qayta tahlil qilmasligi kerak. Tayyor mantiqsiz engine ishonchliroq.
- Qora ro'yxat filtrni "qo'shimcha qatlam" sifatida ham qo'shmang. Cheat sheet buni to'g'ridan-to'g'ri tavsiya qilmaydi: sintaksis engine va kontekstga qarab farq qiladi.
- Mantiqsiz engine ham mutlaq xavfsiz emas: unga ulangan helper funksiyalari, escape'siz chiqarish (`{{{ }}}` kabi) va noto'g'ri kontekst hali ham muammo.

## Stack'da: Node.js

Node.js loyihada server tomonda template ishlatilganda tekshirish ro'yxati shunday: (1) `compile`, `render` kabi chaqiruvlarni qidiring va ularning birinchi argumenti qat'iy doimiy ekanini tekshiring; (2) `render(req.query.x)` kabi nom bo'yicha tanlashni ro'yxatga bog'lang; (3) kontekstni DTO bilan cheklang. Quyidagi kod ishga tushirilmaydi (engine kutubxonasi brauzer worker'ida mavjud emas), faqat TypeScript sintaksisi tekshirilgan. `handlebars` misolida g'oya ko'rsatilgan; API tafsilotlari uchun kutubxona hujjatiga qarang (bu darsda tekshirilmagan).

```ts
import Handlebars from "handlebars";

// Template'lar ilova ishga tushganda bir marta kompilyatsiya qilinadi; manba kodda
const sources = {
  welcome: "Salom, {{user.name}}! Hisobingiz tayyor.",
  monthly: "{{user.name}}, oylik hisobot tayyor: {{summary.km}} km.",
} as const;

const compiled = Object.fromEntries(
  Object.entries(sources).map(([k, v]) => [k, Handlebars.compile(v, { strict: true })]),
) as Record<keyof typeof sources, (ctx: unknown) => string>;

type MailData = { user: { name: string }; summary?: { km: number } };

export function renderMail(name: string, data: MailData): string {
  if (!Object.hasOwn(compiled, name)) throw new Error("template ruxsat etilmagan");
  return compiled[name as keyof typeof sources](data); // DTO: config, db, req yo'q
}
```

Bu yerda manba kod ichida, nom ro'yxatga bog'langan, kontekst DTO. NestJS'da bu `MailService` ichiga o'raladi va controller faqat nom va DTO beradi. `{{{ }}}` kabi escape'siz chiqarishdan foydalanmang; HTML kerak bo'lsa, uni sanitizatsiyalash kerak (34-dars).

## Xulosa

- SSTI - kiritilgan qiymat template manbasiga aylanib, engine tomonidan kod sifatida baholanishi. Oqibat engine va sozlamaga qarab ma'lumot o'qishdan masofadan kod bajarilishigacha.
- Uch yo'l: kiritish manbaga qo'shiladi, qat'iy template satrni kod sifatida baholaydi, kiritish template'ni tanlaydi.
- Himoya: template'ni kod deb qarash, qiymatlarni faqat o'zgaruvchi sifatida berish, template nomini ro'yxatga bog'lash, kontekstni minimal qilish, kam kuchli engine tanlash.
- Auto-escape XSS uchun, SSTI uchun emas. Template sintaksisini filtrlash ishonchsiz.
- Foydalanuvchi template yozadigan funksiya imtiyozli: sandbox, huquq, audit va izolyatsiya; sandbox resurs sarfini cheklamaydi.
- Tuzatishning chegarasini yozing: haqiqiy engine'da kontekst cheklovi sandbox emas, manba doimiy bo'lishi shart.
