---
n: 46
slug: session-boshqaruvi
title: "Session boshqaruvi: identifikator, muddat, bekor qilish"
summary: "Sessiya identifikatorining xossalari (entropiya, opaklik), session fixation va identifikatorni yangilash, idle va absolute timeout'larning farqi, NIST qayta autentifikatsiya muddatlari, serverda bekor qilish va chiqish, hamda zaif va to'g'ri sessiya menejeri."
duration: 45
sources:
  - id: cs-session
    note: "Session Management Cheat Sheet: sessiya ID kamida 64 bit entropiya va CSPRNG (o'zingiz yaratsangiz kamida 128 bit), mazmunsiz qiymat, nom fingerprinting'i; permissive va strict sessiya menejeri (fixation); imtiyoz o'zgargach ID'ni yangilash; idle (2-5 va 15-30 daqiqa diapazonlari), absolute (4-8 soat misoli) va renewal timeout, ularning serverda majburlanishi; logout barcha bog'liq ID'larni bekor qilishi, no-store va Clear-Site-Data; IP/User-Agent bog'lash chegaralari va log'da ID hash'i"
  - id: rfc6265
    note: "Cookie sarlavhalari: Set-Cookie atributlari (Expires/Max-Age, Secure, HttpOnly) va ularning mijoz tomonidagi xatti-harakati, server tomonidagi holatni almashtirmasligi"
  - id: nist-63-4
    note: "SP 800-63B-4 Session bo'limi: sessiya sirlari (kamida 64 bit, tasdiqlangan RBG, sessiya AAL'ni meros qiladi), cookie talablari (Secure, minimal host/path, HttpOnly, __Host-, SameSite), timeout'larni cookie muddatiga tayanib majburlamaslik, Local Storage'dan qochish, access token mavjudligi foydalanuvchi mavjudligini bildirmasligi; AAL1 30 kun, AAL2 24 soat va 1 soat harakatsizlik, AAL3 12 soat va 15 daqiqa"
quiz:
  - q: "Hujumchi saytga kirib, anonim sessiya identifikatori oladi va uni qurbonga yuboradi (cookie sifatida o'rnatadi). Qurbon shu sessiya bilan kiradi. Server kirishda identifikatorni almashtirmaydi. Nima bo'ladi?"
    options:
      - "Hech narsa: hujumchi parolni bilmaydi"
      - "Qurbonning sessiyasi avtomatik bekor bo'ladi"
      - "Hujumchi parolsiz qurbonning brauzeri bilan bir xil autentifikatsiyalangan sessiyaga ega bo'ladi"
      - "Hujumchi faqat anonim sahifalarni ko'radi"
    answer: 2
    explain: "Bu session fixation: autentifikatsiyadan oldin ma'lum bo'lgan identifikator autentifikatsiyadan keyin ham o'sha sessiyani ifodalaydi. Himoya: kirishda (va har imtiyoz o'zgarganda) yangi identifikator berib, eskisini bekor qilish."
  - q: "Sessiyada faqat 30 daqiqalik idle timeout bor. Hujumchi o'g'irlangan sessiyada har 10 daqiqada so'rov yuborib turadi. Nima uchun bu yetarli emas?"
    options:
      - "Idle timeout faol sessiyani to'xtatmaydi; sessiyaning umumiy umri uchun absolute timeout kerak"
      - "Idle timeout har doim 5 daqiqa bo'lishi kerak"
      - "Idle timeout faqat mobil ilovalarga tegishli"
      - "Cookie muddati buni hal qiladi"
    answer: 0
    explain: "Cheat sheet idle timeout o'g'irlangan sessiyada hujumchi faollik yaratib turishining oldini olmasligini ta'kidlaydi. Absolute timeout sessiyaning umumiy umrini chegaralaydi. NIST ham umumiy va harakatsizlik timeout'larini alohida belgilaydi."
  - q: "Ilova timeout'ni faqat cookie'ning `Max-Age` atributi bilan boshqaradi. Hujumchi ushlab olgan cookie qiymatini qo'lda saqlab, muddat o'tgandan keyin yuborsa nima bo'ladi?"
    options:
      - "Brauzer rad etadi"
      - "Server o'zi muddatni bilmasa, qabul qiladi: cookie muddati faqat brauzerga ta'sir qiladi, hujumchi brauzeriga emas"
      - "Server avtomatik bekor qiladi"
      - "Hujum ishlamaydi, chunki HttpOnly"
    answer: 1
    explain: "Max-Age brauzerga cookie'ni qachon o'chirishni aytadi; hujumchi qiymatni boshqa mijozdan yuboradi. Timeout serverda majburlanishi kerak: sessiya yozuvida yaratilish va oxirgi faollik vaqti saqlanadi."
  - q: "Foydalanuvchi parolini almashtirdi. Eski qurilmada ochiq qolgan boshqa sessiyalar nima bo'lishi kerak?"
    options:
      - "Davom etadi, chunki foydalanuvchi o'zi yaratgan"
      - "Faqat joriy sessiya qoladi, qolganlari bekor qilinadi (yoki foydalanuvchiga tanlov beriladi)"
      - "Hamma sessiyalar saqlanib, parol faqat keyingi kirish uchun amal qiladi"
      - "Faqat cookie muddati tugaguncha kutiladi"
    answer: 1
    explain: "Parol almashtirish ko'pincha hisob buzilganda amalga oshiriladi; boshqa qurilmalardagi sessiyalar hujumchida bo'lishi mumkin. Buning uchun server har foydalanuvchining sessiyalarini bekor qila olishi kerak: stateless token'larda bu qiyin (47-dars)."
  - q: "Sessiya identifikatori `Math.random().toString(36)` bilan yaratilgan. Muammo nima?"
    options:
      - "Uzunligi qisqa bo'lishi mumkin"
      - "Hech qanday muammo yo'q, ID baribir tasodifiy ko'rinadi"
      - "Kriptografik xavfsiz emas: oldingi qiymatlardan keyingisini taxmin qilish mumkin; CSPRNG kerak"
      - "Faqat kichik harflar ishlatiladi"
    answer: 2
    explain: "Cheat sheet sessiya ID'si kamida 64 bit entropiyaga ega bo'lishi va kuchli CSPRNG'dan olinishini talab qiladi. Oddiy PRNG chiqishlari bashorat qilinishi mumkin; entropiya soni emas, manba ham muhim (67-dars)."
  - q: "'Chiqish' tugmasi faqat brauzerdagi cookie'ni o'chiradi, serverdagi yozuvga tegmaydi. Nima uchun noto'g'ri?"
    options:
      - "Cookie o'chirilmaydi"
      - "Foydalanuvchi qayta kira olmaydi"
      - "Server cookie'ni baribir qayta yaratadi"
      - "Ushlab olingan identifikator chiqishdan keyin ham yaroqli qoladi; OWASP A07 chiqishda sessiyani to'g'ri bekor qilmaslikni zaiflik deb sanaydi"
    answer: 3
    explain: "Chiqish serverda sessiya yozuvini yo'q qilishi kerak. Faqat mijozdagi cookie'ni o'chirish, nusxasi boshqa joyda bo'lgan hujumchiga hech narsa qilmaydi."
task:
  title: "Sessiya menejeri: rotatsiya, timeout'lar va bekor qilish"
  prompt: |
    Starter sessiya menejeri `login` da mijoz yuborgan identifikatorni qayta ishlatadi, muddat bilan ishlamaydi va foydalanuvchi sessiyalarini bekor qila olmaydi. Tuzating:

    - `login(existingSid, userId, now)` har doim yangi identifikator yaratsin va `existingSid` ni (agar bor bo'lsa) o'chirsin;
    - `validate(sid, now)`: harakatsizlik 30 daqiqadan oshsa yoki yaratilganidan 12 soat o'tsa sessiyani o'chirib, `null` qaytarsin; aks holda `lastSeen` ni yangilab, `userId` qaytarsin;
    - `revokeUser(userId)` foydalanuvchining barcha sessiyalarini o'chirsin.

    Imzolarni o'zgartirmang. Identifikatorlar o'quv uchun ketma-ket (production'da CSPRNG). Kutilgan chiqish: `true`, `false`, `false`, `false`, `false`.
  lang: ts
  starter: |
    type Sess = { userId: string; createdAt: number; lastSeen: number };
    const store = new Map<string, Sess>();
    let n = 0;
    const newId = () => `sid-${++n}`;
    const MIN = 60_000;
    const HOUR = 60 * MIN;

    function login(existingSid: string | undefined, userId: string, now: number): string {
      const sid = existingSid ?? newId();
      store.set(sid, { userId, createdAt: now, lastSeen: now });
      return sid;
    }

    function validate(sid: string, now: number): string | null {
      return store.get(sid)?.userId ?? null;
    }

    function revokeUser(userId: string): void {}

    const t0 = 1_700_000_000_000;
    const planted = "attacker-known";
    const sid = login(planted, "u1", t0);
    console.log("id almashdi:", sid !== planted);
    console.log("eski id ishlaydi:", validate(planted, t0 + 1000) !== null);
    console.log("31 daqiqa harakatsizlikdan keyin:", validate(sid, t0 + 31 * MIN) !== null);

    const sid2 = login(undefined, "u2", t0);
    let alive = true;
    for (let t = t0; t <= t0 + 13 * HOUR; t += 20 * MIN) {
      if (validate(sid2, t) === null) { alive = false; break; }
    }
    console.log("13 soat faol bo'lsa ham davom etadi:", alive);

    const a = login(undefined, "u3", t0);
    const b = login(undefined, "u3", t0);
    revokeUser("u3");
    console.log("revoke'dan keyin amal qiladi:", validate(a, t0 + 1000) !== null || validate(b, t0 + 1000) !== null);
  solution: |
    type Sess = { userId: string; createdAt: number; lastSeen: number };
    const store = new Map<string, Sess>();
    let n = 0;
    const newId = () => `sid-${++n}`;
    const MIN = 60_000;
    const HOUR = 60 * MIN;
    const IDLE_MS = 30 * MIN;
    const ABSOLUTE_MS = 12 * HOUR;

    function login(existingSid: string | undefined, userId: string, now: number): string {
      if (existingSid) store.delete(existingSid);
      const sid = newId();
      store.set(sid, { userId, createdAt: now, lastSeen: now });
      return sid;
    }

    function validate(sid: string, now: number): string | null {
      const s = store.get(sid);
      if (!s) return null;
      if (now - s.lastSeen > IDLE_MS || now - s.createdAt > ABSOLUTE_MS) {
        store.delete(sid);
        return null;
      }
      s.lastSeen = now;
      return s.userId;
    }

    function revokeUser(userId: string): void {
      for (const [sid, s] of store) if (s.userId === userId) store.delete(sid);
    }

    const t0 = 1_700_000_000_000;
    const planted = "attacker-known";
    const sid = login(planted, "u1", t0);
    console.log("id almashdi:", sid !== planted);
    console.log("eski id ishlaydi:", validate(planted, t0 + 1000) !== null);
    console.log("31 daqiqa harakatsizlikdan keyin:", validate(sid, t0 + 31 * MIN) !== null);

    const sid2 = login(undefined, "u2", t0);
    let alive = true;
    for (let t = t0; t <= t0 + 13 * HOUR; t += 20 * MIN) {
      if (validate(sid2, t) === null) { alive = false; break; }
    }
    console.log("13 soat faol bo'lsa ham davom etadi:", alive);

    const a = login(undefined, "u3", t0);
    const b = login(undefined, "u3", t0);
    revokeUser("u3");
    console.log("revoke'dan keyin amal qiladi:", validate(a, t0 + 1000) !== null || validate(b, t0 + 1000) !== null);
  solutionNotes: |
    - `login` mijozdan kelgan identifikatorni hech qachon ishlatmaydi: yangisini yaratib, eskisini o'chiradi. Shu bilan fixation yopiladi (hujumchi biladigan id kirishdan keyin yaroqsiz).
    - `validate` ikkita alohida muddatni tekshiradi: harakatsizlik (idle) va umumiy (absolute). Faol hujumchi idle'ni yangilab tursa ham, 12 soatda sessiya tugaydi.
    - Muddat tugagan sessiya o'chiriladi (faqat `null` qaytarish yetmaydi, aks holda `lastSeen` farqi keyinroq qayta tekshirilganda xato ishlashi mumkin).
    - 30 daqiqa va 12 soat modelning tanlovi. NIST AAL2 uchun umumiy timeout 24 soatdan, harakatsizlik timeout'i bir soatdan oshmasligini tavsiya qiladi (SHOULD); sizning qiymatlaringiz xavfga bog'liq.
    - `revokeUser` barcha sessiyalarni o'chiradi. Katta tizimda foydalanuvchi bo'yicha indeks (user -> sessiyalar to'plami) kerak; bu yerda butun xaritani aylanish soddalik uchun. Identifikator manbasi (CSPRNG) bu yechimda soddalashtirilgan.
  checklist:
    - "Kirishda yangi identifikator yaratiladi, eskisi o'chiriladi"
    - "Idle va absolute timeout alohida tekshiriladi"
    - "Muddati tugagan sessiya o'chiriladi"
    - "`revokeUser` barcha sessiyalarni o'chiradi"
    - "Imzolar o'zgarmagan"
---

## Muammo

Autentifikatsiya bir marta bajariladi, lekin keyingi yuzlab so'rov "bu o'sha foydalanuvchi" degan da'voga tayanadi. Bu da'vo odatda sessiya identifikatorida saqlanadi: u parol o'rnini o'tadi. Hujumchi parolni emas, identifikatorni qo'lga kiritsa, tekshiruvdan o'tgan hisoblanadi. 41-darsda aytilganidek, MFA, passkey va kuchli parol shu nuqtada tugaydi: o'g'irlangan sessiya token'i ularni chetlab o'tadi.

OWASP Top 10:2025 A07 sessiya bilan bog'liq uchta kamchilikni alohida sanaydi: identifikator URL, yashirin maydon yoki mijozga ochiq boshqa joyda oshkor qilinadi; kirishdan keyin identifikator yangilanmaydi; chiqish yoki harakatsizlik davrida sessiya (ayniqsa SSO token'lari) to'g'ri bekor qilinmaydi. Bu xatolar oddiy: framework'ning default sozlamasi yoki sodda "men o'zim yozdim" implementatsiya ularni keltirib chiqaradi.

Amaliy og'riq: avtopark platformasida dispetcher ish kunini 12 soat ochiq brauzerda o'tkazadi, haydovchi esa umumiy planshetdan kiradi. Qisqa timeout foydalanuvchini bezdiradi, uzun timeout esa o'g'irlangan yoki unutilgan sessiyani uzoq yashaydigan qiladi. Bu trade-off ni mexanizm darajasida tushunsangiz, qiymatlarni asoslab tanlaysiz.

## Asosiy g'oya

### Identifikator: opaque va tasodifiy

Session Management Cheat Sheet sessiya identifikatori kamida 64 bit entropiyaga ega bo'lishi kerakligini va kuchli CSPRNG'dan olinishini aytadi. Mexanizm oddiy: identifikator ma'lum foydalanuvchi sessiyasiga yo'llanma bo'lib, hujumchi uni taxmin qilolmasligi kerak. 64 bit entropiya 2^64 variantni bildiradi. Identifikator ma'no tashimasligi kerak (foydalanuvchi nomi, vaqt, tartib raqami emas): u faqat serverdagi yozuvga kalit. Mijoz ichidan hech narsa o'qimasligi uchun uni `opaque` qiymat sifatida qaytaring. 256 bit (32 bayt) tasodifiy qiymat bilan zaxira katta; muallif tavsiyasi shu, minimum esa cheat sheet'dagi 64 bit. Tasodifiylik manbasi haqida 67-darsda.

Identifikatorni URL ga qo'ymang (log, Referer, brauzer tarixi orqali oshkor bo'ladi) va yashirin maydonda yubormang. Cookie ichida yuborish uchun atributlar 13-darsda: `Secure`, `HttpOnly`, `SameSite`. RFC 6265 cookie sarlavhasini tavsiflaydi, lekin muhim nuqta shuki, cookie atributlari (masalan, `Max-Age`) mijoz brauzeriga yo'riqnoma, ular serverda majburlanadigan chegara emas.

Cheat sheet identifikatorning boshqa xossalarini ham beradi. Entropiya uzunlikdan muhimroq: 16 ta o'n oltilik belgi 64 bit beradi, lekin identifikatorning bir qismi qat'iy yoki bashorat qilinadigan bo'lsa (masalan, yarmi doim bir xil bo'lsa), samarali entropiya kamayadi va uzunlikni oshirish kerak. Cheat sheet 64 bitli identifikator uchun hujumchi sekundiga 10 000 taxmin qilib, 100 000 ta faol sessiya bo'lganda ham o'rtacha 585 yil sarflashini hisoblaydi; bu foydali tartib, lekin biz zaxira uchun baribir 256 bitni tanlaymiz. Agar identifikatorni framework'siz o'zingiz yaratsangiz, cheat sheet CSPRNG va kamida 128 bit hamda har identifikator noyob bo'lishini tavsiya qiladi. Identifikator nomi ham ma'lumot beradi: `PHPSESSID`, `JSESSIONID`, `ASP.NET_SessionId` kabi default nomlar texnologiyani oshkor qiladi, shuning uchun uni umumiy nomga almashtiring. Identifikator qiymati mazmunsiz bo'lishi, shaxsiy ma'lumot (PII) va mantiqiy holat esa serverda saqlanishi kerak. Va nihoyat, kelgan identifikatorni boshqa har qanday foydalanuvchi kirishi kabi ishonchsiz deb hisoblab tekshiring: u relyatsion bazada saqlansa SQL injection, javobda qaytarilsa stored XSS uchun yo'l bo'lishi mumkin.

NIST SP 800-63B-4 sessiya sirlari uchun o'z talablarini qo'yadi, ular cheat sheet bilan mos. Sir autentifikatsiya hodisasiga javoban sessiya xosti tomonidan yaratiladi, tasdiqlangan tasodifiy bit generatoridan olinadi va kamida 64 bit bo'lishi shart. Chiqishda mijoz tomonda o'chirilishi yoki yaroqsiz qilinishi, vaqti kelganda esa qabul qilinmasligi kerak. Sessiya autentifikatsiya hodisasining AAL xossasini meros qiladi: u pastroq AAL deb hisoblanishi mumkin, lekin yuqoriroq emas. Cookie'lar sessiya uchun qisqa muddatli sir sifatida yaroqli, lekin autentifikator emas. Ular faqat HTTPS orqali yuborilishi (SHALL), minimal hostname va path uchun ochiq bo'lishi (SHALL), JavaScript'ga yopiq (HttpOnly), `__Host-` prefiksi va `Path=/` bilan, `SameSite=Lax` yoki `Strict` bilan (SHOULD) berilishi, qiymati esa shaxsiy ma'lumotsiz mazmunsiz satr bo'lishi kerak. Cookie'ning o'z muddati sessiya muddatiga yaqin qo'yiladi, lekin standart aniq yozadi: bunga timeout'ni majburlash uchun tayanib bo'lmaydi. Sessiya sirlarini HTML5 Local Storage kabi XSS'ga ochiq joyga qo'ymang, autentifikatsiyadan keyin sessiya https'dan http'ga tushmasin, o'zgartiruvchi so'rovlar esa CSRF'ga qarshi sessiya identifikatorini tekshirsin (36-dars). Yana bir nozik joy: access token (OAuth) mavjudligi foydalanuvchi hozir ham shu yerda ekanini bildirmaydi, chunki token va refresh token autentifikatsiya sessiyasi tugagandan keyin ham yaroqli qolishi mumkin.

### Session fixation va identifikatorni yangilash

Fixation hujumida hujumchi autentifikatsiyadan oldin ma'lum identifikatorga ega bo'ladi (saytga kirib oladi yoki o'zi yaratadi) va uni qurbonning brauzeriga joylaydi. Qurbon kirgach, agar server shu identifikatorni autentifikatsiyalangan holatga o'tkazsa, hujumchi ham kirgan hisoblanadi. Cheat sheet bu holatni ikki xil sessiya menejeriga ajratadi. Permissive mexanizm mijoz yuborgan istalgan identifikatorni qabul qilib, uning uchun yangi sessiya yaratadi (PHP default'i shunday). Strict mexanizm faqat o'zi yaratgan identifikatorlarni qabul qiladi. Ilova hech qachon o'zi yaratmagan identifikatorni qabul qilmasligi, kelganda yangisini berishi va buni shubhali hodisa sifatida ogohlantirishi kerak. Quyidagi "Zaif kod" aynan permissive variant. Himoya sodda: har imtiyoz darajasi o'zgarganda (kirish, MFA bosqichi, rol o'zgarishi, qayta autentifikatsiya) yangi identifikator yaratish va eskisini bekor qilish. Cheat sheet'da ham "Renew the Session ID After Any Privilege Level Change" qoidasi bor.

## Chuqurroq: muddat va bekor qilish

### Idle va absolute

Ikki xil timeout bor va ular turli hujumga qarshi:

- Idle timeout: oxirgi faollikdan beri o'tgan vaqt. U unutilgan sessiyaga (ochiq qolgan planshet) qarshi.
- Absolute timeout: sessiya yaratilganidan beri umumiy muddat. U o'g'irlangan sessiyada faollik yaratib turgan hujumchiga qarshi.

Cheat sheet buni ochiq aytadi: idle timeout hujumchining tarmoqdagi harakatlarini cheklamaydi, chunki u vaqti-vaqti bilan faollik hosil qilib sessiyani yangilab tura oladi. Ikkala timeout ham serverda majburlanishi kerak: vaqtni mijoz tokenidagi qiymat bilan hisoblasangiz, hujumchi uni o'zgartirib sessiyani uzaytirishi mumkin. Cheat sheet odatiy diapazonlarni beradi: idle timeout yuqori qiymatli ilovalar uchun 2-5 daqiqa, past xavfli ilovalar uchun 15-30 daqiqa; absolute timeout foydalanuvchi ilovadan qancha vaqt foydalanishiga bog'liq, to'liq ish kuni ishlaydigan ofis xodimi uchun 4-8 soat. Bizning mashqdagi 30 daqiqa past xavfli diapazonning yuqori chegarasida, 12 soat esa 4-8 soatlik misoldan uzun: ular to'liq smena ishlaydigan dispetcher uchun qulaylik tomonga og'gan, aniq qiymatni xavf bahosi bilan siz belgilaysiz. Uchinchi mexanizm renewal timeout: sessiya yaratilganidan ma'lum vaqt o'tgach, faollikdan qat'i nazar, identifikator foydalanuvchi sessiyasi o'rtasida avtomatik yangilanadi, eski qiymat esa qisqa xavfsizlik intervali uchun yaroqli qoladi va mijoz yangisiga o'tgach bekor qilinadi. Bu o'g'irlangan identifikatorning qayta ishlatilish vaqtini qisqartiradi, ayniqsa absolute timeout uzun bo'lsa. Cheat sheet bir race holatini ham aytadi: hujumchi yangilanish payti foydalanuvchidan oldin so'rov yuborib yangi identifikatorni olishi mumkin, lekin bunda foydalanuvchining sessiyasi to'satdan tugaydi va hujumdan xabardor bo'ladi. NIST SP 800-63-4 shunga mos ikki turni belgilaydi: umumiy timeout (AAL1 da ko'pi bilan 30 kun, AAL2 da ko'pi bilan 24 soat tavsiya, SHOULD) va harakatsizlik timeout'i (AAL2 da ko'pi bilan bir soat, SHOULD). Quyidagi kod ikkala timeout o'rtasidagi farqni ko'rsatadi:

```ts run
const MIN = 60_000;
const HOUR = 60 * MIN;
const IDLE = 30 * MIN;
const ABSOLUTE = 12 * HOUR;

// Hujumchi o'g'irlangan sessiyada har 10 daqiqada so'rov yuboradi.
function lifetime(useAbsolute: boolean): number {
  const created = 0;
  let last = 0;
  for (let t = 10 * MIN; t <= 48 * HOUR; t += 10 * MIN) {
    if (t - last > IDLE) return last;
    if (useAbsolute && t - created > ABSOLUTE) return last;
    last = t;
  }
  return last;
}

console.log("faqat idle: sessiya soat davomida yashaydi =", lifetime(false) / HOUR);
console.log("idle + absolute: sessiya soat davomida yashaydi =", lifetime(true) / HOUR);
```

```text
faqat idle: sessiya soat davomida yashaydi = 48
idle + absolute: sessiya soat davomida yashaydi = 12
```

Faqat idle bilan hujumchi sessiyani sinov oynasi tugaguncha (bu modelda 48 soat) ushlab turdi; absolute timeout uni 12 soatda to'xtatdi.

### Serverdagi holat va bekor qilish

Sessiyani bekor qilish uchun server uni bilishi kerak. Server tomonidagi sessiya xotirasi (Redis yoki PostgreSQL) buni beradi: yozuvni o'chirish yetarli. Chiqish tugmasi serverdagi yozuvni o'chirishi shart, aks holda ushlab olingan identifikator chiqishdan keyin ham yaroqli qoladi (A07 buni zaiflik deb sanaydi). Parol almashtirilganda, MFA qayta sozlanganda, "barcha qurilmalardan chiqish" bosilganda yoki xodim ishdan bo'shaganda foydalanuvchining barcha sessiyalarini bekor qilish kerak. Buning uchun foydalanuvchi bo'yicha sessiyalar indeksi saqlanadi. Cheat sheet bir nozik talabni qo'shadi: bir mantiqiy autentifikatsiyalangan sessiyaga tegishli barcha identifikatorlar birga bekor qilinishi kerak, jumladan ketma-ket yoki parallel yangilash natijasida berilganlar va grace davrida hali qabul qilinayotgan eski identifikatorlar. Chiqish tugagach, bu identifikatorlarning hech biri sessiyani tasdiqlash yoki yangilash uchun qabul qilinmasligi shart. Brauzer tomonida ham tozalang: sezgir sahifalarda `Cache-Control: no-store` qo'ying (`no-cache` esa saqlashga ruxsat beradi, faqat qayta tekshiruv talab qiladi) va chiqishda `Clear-Site-Data: "cache", "cookies", "storage"` javob sarlavhasi bilan brauzerni cookie va keshdan tozalashga undang. Cheat sheet `Clear-Site-Data: "cache"` umumiy yoki oraliq (intermediate) keshlarga ta'sir qilmasligini ham qayd etadi.

Himoyaning qo'shimcha qatlami: sessiya identifikatorini IP yoki User-Agent kabi xususiyatlarga bog'lash. Bu ishonchli himoya emas (NAT ortida yoki umumiy proxy orqali hujumchi bir xil IP'dan chiqishi, User-Agent'ni esa qo'lda yozishi mumkin), lekin sessiya o'rtasida o'zgarish yaxshi anomaliya signali bo'ladi va sessiyani to'xtatish yoki ogohlantirish uchun ishlatiladi. Sessiya hayot tsiklini (yaratish, yangilash, yo'q qilish, imtiyoz o'zgarishi, timeout, noto'g'ri identifikator) loglang, lekin xom identifikatorni emas: korrelyatsiya uchun identifikatorning tuzlangan hash'ini yozing (79-dars). Bir foydalanuvchining parallel sessiyalari ruxsat etilishi dizayn qarori; ruxsat bersangiz, foydalanuvchi faol sessiyalar ro'yxatini ko'rib, ularni masofadan tugatishi mumkin bo'lsin. Federatsiya holatida (49-dars) IdP va RP sessiyalari alohida yashaydi: IdP'dagi chiqish RP sessiyasini o'z-o'zidan tugatmaydi, shuning uchun har RP o'z sessiyasini bekor qilishi kerak.

Stateless token'lar (JWT, 47-dars) bu bekor qilishni murakkablashtiradi: server hech narsa saqlamasa, token muddati tugamaguncha yaroqli. Bekor qilish ro'yxati yoki qisqa umr bilan yumshatiladi, lekin shu bilan state qaytadi.

### Qayta autentifikatsiya va xavfli harakatlar

Sessiya mavjudligi nozik amalga ruxsat degani emas (41-dars). Parolni o'zgartirish, MFA o'chirish, to'lov rekvizitini o'zgartirish kabi amallar uchun yaqinda bajarilgan autentifikatsiyani talab qiling. Authentication Cheat Sheet ham yuqori xavfli harakatlardan (akkaunt tiklash, parol almashtirish) keyin qayta autentifikatsiya va sessiya tokenlarini yangilashni tavsiya qiladi.

## Misol: sessiya menejeri

### Zaif kod

Server cookie'dagi identifikatorni, hatto o'zi yaratmagan bo'lsa ham, qabul qiladi va kirishda uni almashtirmaydi. Muddat ham yo'q.

```ts run
type Sess = { userId: string | null };
const store = new Map<string, Sess>();

// ZAIF: mijoz yuborgan identifikatorni "o'zlashtiradi" va kirishda almashtirmaydi.
function startSession(cookieSid: string | undefined): string {
  const sid = cookieSid ?? crypto.randomUUID();
  if (!store.has(sid)) store.set(sid, { userId: null });
  return sid;
}
function login(sid: string, userId: string): void {
  store.get(sid)!.userId = userId;
}
function whoAmI(sid: string): string | null {
  return store.get(sid)?.userId ?? null;
}

const sid = startSession(undefined);
login(sid, "dispatcher-alfa");
console.log("oddiy oqim:", whoAmI(sid));
```

```text
oddiy oqim: dispatcher-alfa
```

### Hujum

> **Ta'lim maqsadida.** Bu session fixation usuli faqat shu darsning o'quv kodida ko'rsatiladi; uni o'z tizimingizda yoki yozma ruxsat va kelishilgan doira bilan sinang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Hujumchi identifikatorni o'zi tanlaydi (`attacker-chosen`) va qurbon brauzeriga joylaydi (masalan, boshqa subdomen orqali; cookie scoping haqida 13-dars). Qurbon kirgach, hujumchi o'sha identifikator bilan so'rov yuboradi. Bu faqat shu o'quv kodiga qarshi.

```ts run
type Sess = { userId: string | null };
const store = new Map<string, Sess>();
function startSession(cookieSid: string | undefined): string {
  const sid = cookieSid ?? crypto.randomUUID();
  if (!store.has(sid)) store.set(sid, { userId: null });
  return sid;
}
function login(sid: string, userId: string): void {
  store.get(sid)!.userId = userId;
}
function whoAmI(sid: string): string | null {
  return store.get(sid)?.userId ?? null;
}

const planted = "attacker-chosen";
console.log("kirishdan oldin, hujumchi ko'radi:", whoAmI(planted));
const victimSid = startSession(planted); // qurbonning brauzeri shu cookie bilan keladi
login(victimSid, "dispatcher-alfa");
console.log("qurbon kirgandan keyin, hujumchi ko'radi:", whoAmI(planted));
```

```text
kirishdan oldin, hujumchi ko'radi: null
qurbon kirgandan keyin, hujumchi ko'radi: dispatcher-alfa
```

### Tuzatilgan kod

Server mijoz taklif qilgan identifikatorni hech qachon yaratmaydi; kirishda yangi identifikator beriladi, eskisi o'chiriladi; idle va absolute timeout serverda tekshiriladi; foydalanuvchi bo'yicha indeks barcha sessiyalarni bekor qilishga imkon beradi.

```ts run
type Sess = { userId: string; createdAt: number; lastSeen: number };
const store = new Map<string, Sess>();
const byUser = new Map<string, Set<string>>();
const MIN = 60_000;
const HOUR = 60 * MIN;
const IDLE_MS = 30 * MIN;
const ABSOLUTE_MS = 12 * HOUR;

function newSid(): string {
  const b = crypto.getRandomValues(new Uint8Array(32));
  return [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function login(oldSid: string | undefined, userId: string, now: number): string {
  if (oldSid) destroy(oldSid); // eski (hujumchi biladigan bo'lishi mumkin) id bekor
  const sid = newSid();
  store.set(sid, { userId, createdAt: now, lastSeen: now });
  if (!byUser.has(userId)) byUser.set(userId, new Set());
  byUser.get(userId)!.add(sid);
  return sid;
}
function destroy(sid: string): void {
  const s = store.get(sid);
  if (s) byUser.get(s.userId)?.delete(sid);
  store.delete(sid);
}
function whoAmI(sid: string, now: number): string | null {
  const s = store.get(sid);
  if (!s) return null;
  if (now - s.lastSeen > IDLE_MS || now - s.createdAt > ABSOLUTE_MS) {
    destroy(sid);
    return null;
  }
  s.lastSeen = now;
  return s.userId;
}
function revokeUser(userId: string): void {
  for (const sid of [...(byUser.get(userId) ?? [])]) destroy(sid);
}

const t0 = 1_700_000_000_000;
const planted = "attacker-chosen";
const sid = login(planted, "dispatcher-alfa", t0);
console.log("hujumchi planted id bilan:", whoAmI(planted, t0 + 1000));
console.log("yangi id bilan:", whoAmI(sid, t0 + 1000));
console.log("31 daqiqa jim turgandan keyin:", whoAmI(sid, t0 + 32 * MIN));
const s2 = login(undefined, "dispatcher-alfa", t0);
const s3 = login(undefined, "dispatcher-alfa", t0);
revokeUser("dispatcher-alfa");
console.log("parol almashtirgandan keyin:", whoAmI(s2, t0 + 1000), whoAmI(s3, t0 + 1000));
```

```text
hujumchi planted id bilan: null
yangi id bilan: dispatcher-alfa
31 daqiqa jim turgandan keyin: null
parol almashtirgandan keyin: null null
```

Nima uchun yetarli: hujumchi biladigan identifikator hech qachon autentifikatsiyalangan holatga o'tmaydi, chunki kirish yangi identifikator beradi; muddatlar va bekor qilish serverda majburlanadi. Qoldiq risk: hujumchi kirishdan keyin berilgan yangi identifikatorni o'g'irlasa (XSS, tarmoqni tinglash), idle va absolute timeout faqat muddatni cheklaydi; cookie bayroqlari va CSP (13, 15-darslar) shu yo'lni yopadi. `Math.random` o'rniga `crypto.getRandomValues` ishlatilgan, lekin sessiya xotirasi ko'p instance'li muhitda umumiy (Redis) bo'lishi kerak.

## Qachon qo'llamaslik kerak

Server tomonidagi sessiya hamma tizim uchun yaxshi emas. Yuqori yuklangan, geografik taqsimlangan API'larda har so'rovda markaziy xotiraga murojaat qimmat bo'lishi mumkin; bunday holatda qisqa muddatli imzolangan token va refresh token juftligi mantiqiy tanlov (47-dars), lekin bekor qilishni qanday hal qilishni oldindan rejalang. Qattiq absolute timeout (masalan, 1-2 soat) dispetcher paneli kabi uzoq ishlaydigan ilovada foydalanuvchini tez-tez chiqarib yuboradi; bunday ilovada qayta autentifikatsiyani fon rejimida (passkey bilan bir tegish) yoki faqat nozik amallarda talab qiling. Sliding (har so'rovda uzaytiriladigan) idle timeout o'z-o'zidan xavfli emas, lekin absolute chegarasiz u cheksiz sessiyaga aylanadi. Va nihoyat, "meni eslab qol" sessiyasi alohida token bo'lishi, ayrim amallarda baribir qayta autentifikatsiya talab qilishi kerak.

## Stack'da: NestJS, Fastify va Redis

NestJS'da `express-session` yoki Fastify'da `@fastify/session` kabi sinalgan modullardan foydalaning, o'zingiz yozmang. Redis'da sessiya kaliti `sess:{id}`, qiymatda `userId`, `createdAt`, `lastSeen`; foydalanuvchi indeksi uchun `user_sessions:{userId}` to'plami. Kirishdan keyin identifikatorni yangilash (`regenerate`) framework'da alohida chaqiruv, uni login controller'ida unutmang. Idle timeout uchun Redis TTL, absolute timeout uchun yozuv ichidagi `createdAt` yetarli; faqat TTL ga tayansangiz, sliding yangilanish absolute chegarani yo'qotadi. Cookie atributlarini (`httpOnly`, `secure`, `sameSite`, prefiks) framework sozlamasida yoqing va test bilan tekshiring (13-dars). Next.js'da sessiyani Route Handler va Server Component'da `cookies()` orqali o'qing, cookie'ni mijoz kodidan o'qib bo'lmasin (`HttpOnly`). Chiqish endpoint'i POST bo'lsin (CSRF himoyasi bilan, 36-dars), serverda yozuvni o'chirsin va cookie'ni tozalasin.

## Xulosa

- Sessiya identifikatori opaque, CSPRNG'dan olingan, kamida 64 bit entropiyali qiymat; URL yoki yashirin maydonda yuborilmaydi.
- Kirishda va har imtiyoz o'zgarishida yangi identifikator bering, eskisini bekor qiling: bu session fixation'ni yopadi.
- Idle va absolute timeout turli hujumlarga qarshi; ikkalasi ham serverda majburlanadi, cookie muddati yetarli emas.
- NIST AAL1/AAL2 uchun umumiy timeout 30 kun/24 soat, AAL2 da harakatsizlik 1 soat deb tavsiya etadi (SHOULD).
- Chiqish va parol almashtirish serverda sessiyani bekor qiladi; buning uchun foydalanuvchi bo'yicha indeks kerak.
- Stateless token bekor qilishni qiyinlashtiradi: bu trade-off 47-darsda.
