---
n: 44
slug: mfa-totp
title: "Multi-factor authentication: TOTP, push va SMS xavflari"
summary: "Ikkinchi faktor turlari va ularning hujumga chidamliligi: TOTP algoritmi (RFC 6238), qabul oynasi va replay'ni to'sish, secret saqlash, recovery kodlar, push charchatish hujumi va SMS'ning NIST'dagi cheklangan maqomi."
duration: 45
sources:
  - id: rfc6238
    note: "TOTP = HOTP(K, T), vaqt qadami standarti 30 soniya, HMAC-SHA-1 asosli HOTP; kalitlar tasodifiy va HMAC chiqishi uzunligida bo'lishi (SHOULD); tekshiruvchi muvaffaqiyatli tekshirilgan OTP'ning ikkinchi urinishini qabul qilmasligi (MUST NOT); tarmoq kechikishi uchun ko'pi bilan bir qadam oyna tavsiyasi; Appendix B test vektorlari"
  - id: nist-63-4
    note: "SP 800-63B-4: out-of-band autentifikatsiyada email ishlatilmasligi; PSTN cheklangan (restricted) authenticator ekani, qabul qilish shartlari (alternativ, ogohlantirish, migratsiya rejasi) va SIM almashtirish kabi risk belgilari; out-of-band sir kamida olti o'nlik raqam, 10 daqiqa, bir martalik, yangi sir urinishlar hisobini nolga tushirmasligi; OTP verifier replay va rate limiting talablari; push yuborish tezligi/sonini cheklash (SHOULD); look-up secret kamida olti o'nlik raqam"
  - id: cs-authn
    note: "Authentication Cheat Sheet: ko'p faktorli autentifikatsiya bo'limi va yuqori xavfli harakatlar (akkaunt tiklash, parol almashtirish) uchun qayta autentifikatsiya talabi"
  - id: cs-mfa
    note: "Multifactor Authentication Cheat Sheet: OTP gigiyenasi (TTL, bir martalik, urinishlar limiti, OTP hash'ining sababi), faktorni almashtirish va MFA'ni tiklash, push fatigue, SIM swap, real vaqtli phishing va MFA downgrade mitigatsiyalari"
quiz:
  - q: "Foydalanuvchi TOTP kodini bir marta muvaffaqiyatli kiritdi. Hujumchi kodni yelkadan ko'rib, 10 soniyadan keyin xuddi shu kodni yuboradi. Server kod hali oynada ekanini tekshiradi, xolos. Natija?"
    options:
      - "Rad etiladi: TOTP bir martalik"
      - "Rad etiladi, chunki hujumchi parolni bilmaydi"
      - "Qabul qilinadi: kod hali amal qilish oynasida va server ishlatilganini eslab qolmaydi"
      - "Qabul qilinadi, lekin faqat 30 soniya ichida bo'lsa"
    answer: 2
    explain: "TOTP kodining o'zi bir martalik emas, u vaqt oynasida amal qiladi. RFC 6238 muvaffaqiyatli tekshirilgan OTP'ning ikkinchi urinishini rad etishni talab qiladi: buning uchun oxirgi ishlatilgan qadamni saqlash kerak. Hujumchi parolni allaqachon bilishi mumkin (u ham sizib chiqqan bo'lishi mumkin), oyna esa 30 soniya bilan cheklanmaydi: kengaytirilgan oynada kod yana ham uzoq yashaydi."
  - q: "Server TOTP kodini joriy qadam va undan bitta oldingi/keyingi qadam bilan tekshiradi. Nega oyna kengaytirilmaydi (masalan, ±10 qadam)?"
    options:
      - "Kengroq oynada bir vaqtda ko'p kod yaroqli; hujumchining taxmin qilish va o'g'irlangan kodni ishlatish imkoniyati oshadi"
      - "Kengroq oyna serverni sekinlashtiradi"
      - "Kengroq oyna HMAC'ni buzadi"
      - "Standart faqat ±10 ga ruxsat bermaydi"
    answer: 0
    explain: "6 xonali kod uchun taxmin qilish ehtimoli yaroqli kodlar soniga proporsional oshadi, o'g'irlangan kod ham uzoq amal qiladi. RFC 6238 tarmoq kechikishi uchun ko'pi bilan bir qadamni tavsiya qiladi; bundan ortig'i xavfni oshiradi, texnik cheklov esa emas."
  - q: "Platforma ikkinchi faktor sifatida SMS orqali kod yuboradi. NIST SP 800-63-4 bu haqda nima deydi?"
    options:
      - "SMS taqiqlangan"
      - "SMS barcha AAL uchun eng xavfsiz usul"
      - "SMS faqat AAL3 uchun mos"
      - "PSTN orqali tasdiqlash cheklangan (restricted) authenticator: foydalanish uchun tashkilot riskni baholab qabul qilishi va tegishli xavflarni yumshatishi kerak"
    answer: 3
    explain: "Standart PSTN orqali out-of-band tasdiqlashni yagona cheklangan authenticator sifatida belgilaydi. U taqiqlanmagan, lekin riskni baholash va qabul qilish talab qilinadi; xavf vaqt o'tishi bilan ortishi mumkinligi ham aytilgan."
  - q: "Hujumchi parolni bilib, qurbonga tunda 30 ta push-tasdiq yubordi; qurbon uxlab qolgan telefonni to'xtatish uchun 'Tasdiqlash' ni bosdi. Qaysi chora aynan shu hujumga qaratilgan?"
    options:
      - "Parolni uzunroq qilish"
      - "Push yuborish tezligi va umumiy sonini cheklash hamda tasdiqlash uchun kontekstga bog'liq (masalan, ekrandagi kodni kiritish) amal talab qilish"
      - "Push matnini kattalashtirish"
      - "Pushni SMS bilan almashtirish"
    answer: 1
    explain: "NIST push yuboradigan verifier'lar yuborish tezligi yoki soniga oqilona chek qo'yishini tavsiya qiladi (SHOULD). Kodni kiritishni talab qilish foydalanuvchini 'ko'r-ko'rona' bosishdan to'xtatadi: bu muallifning dizayn tavsiyasi. Parol uzunligi bu hujumga ta'sir qilmaydi, SMS esa o'zi cheklangan authenticator."
  - q: "TOTP secret'ini bazada qanday saqlash kerak?"
    options:
      - "Argon2id bilan hash qilib, parol kabi"
      - "Ochiq matnda, chunki 6 xonali kod baribir qisqa"
      - "Qaytariladigan shifrlash bilan (kalit bazadan alohida), chunki server har tekshiruvda kodni hisoblashi kerak"
      - "Saqlamaslik, faqat mijozda tursin"
    answer: 2
    explain: "Server TOTP'ni tekshirish uchun secret'ning o'zi bilan HMAC hisoblashi shart, shuning uchun hash qilib bo'lmaydi. Secret sizsa, hujumchi cheksiz kod yarata oladi: uni shifrlab, kalitni alohida saqlang (68-dars). Mijozda saqlansa, server tekshira olmaydi."
  - q: "Hujumchi soxta kirish sahifasi qurdi; foydalanuvchi parol va TOTP kodini unga kiritadi, hujumchi ularni darhol haqiqiy saytga uzatadi. Nega TOTP bu hujumni to'xtatmaydi?"
    options:
      - "TOTP kodi tashqi saytga bog'lanmagan: uni kimga kiritilayotgani tekshirilmaydi, shu sababli real vaqtda uzatish ishlaydi"
      - "TOTP kodi juda qisqa"
      - "Hujumchi secret'ni biladi"
      - "TOTP faqat bir marta ishlaydi"
    answer: 0
    explain: "TOTP phishing-resistant emas: kod origin'ga bog'lanmagan, foydalanuvchi uni soxta saytga o'zi beradi. Bir martalik bo'lishi yordam bermaydi, chunki hujumchi uni darhol ishlatadi. Origin'ga bog'langan usul passkey (45-dars)."
task:
  title: "TOTP tekshiruvi: bir qadamli oyna va replay himoyasi"
  prompt: |
    `verifyCode(state, userId, code, nowSec)` TOTP kodini tekshiradi. Hozir u joriy qadamdan ±5 qadam oraliqdagi kodlarni qabul qiladi va ishlatilgan kodni eslab qolmaydi.

    Tuzating:
    - faqat joriy qadam va unga qo'shni bittadan qadam (-1, 0, +1) qabul qilinsin;
    - foydalanuvchi uchun oxirgi qabul qilingan qadam `state.last` da saqlansin va undan kichik yoki teng qadamdagi kod rad etilsin (replay himoyasi);
    - kodlarni doimiy vaqtli taqqoslang (taqqoslash funksiyasi berilgan).

    `codeFor(step)` - o'quv uchun soddalashtirilgan kod generatori (HMAC emas). Imzolarni o'zgartirmang. Kutilgan chiqish: `true`, `false`, `false`, `true`.
  lang: ts
  starter: |
    const STEP = 30;
    const codeFor = (step: number) => String((step * 7919 + 13) % 1_000_000).padStart(6, "0");

    function equalConst(a: string, b: string): boolean {
      if (a.length !== b.length) return false;
      let d = 0;
      for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
      return d === 0;
    }

    type State = { last: Map<string, number> };

    function verifyCode(state: State, userId: string, code: string, nowSec: number): boolean {
      const cur = Math.floor(nowSec / STEP);
      for (let d = -5; d <= 5; d++) {
        if (equalConst(code, codeFor(cur + d))) return true;
      }
      return false;
    }

    const state: State = { last: new Map() };
    const now = 100 * STEP + 5;
    console.log(verifyCode(state, "u1", codeFor(100), now));
    console.log(verifyCode(state, "u1", codeFor(100), now));
    console.log(verifyCode(state, "u1", codeFor(97), now));
    console.log(verifyCode(state, "u1", codeFor(101), now));
  solution: |
    const STEP = 30;
    const codeFor = (step: number) => String((step * 7919 + 13) % 1_000_000).padStart(6, "0");

    function equalConst(a: string, b: string): boolean {
      if (a.length !== b.length) return false;
      let d = 0;
      for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
      return d === 0;
    }

    type State = { last: Map<string, number> };

    function verifyCode(state: State, userId: string, code: string, nowSec: number): boolean {
      const cur = Math.floor(nowSec / STEP);
      const last = state.last.get(userId) ?? -1;
      for (const d of [-1, 0, 1]) {
        const step = cur + d;
        if (step <= last) continue;
        if (equalConst(code, codeFor(step))) {
          state.last.set(userId, step);
          return true;
        }
      }
      return false;
    }

    const state: State = { last: new Map() };
    const now = 100 * STEP + 5;
    console.log(verifyCode(state, "u1", codeFor(100), now));
    console.log(verifyCode(state, "u1", codeFor(100), now));
    console.log(verifyCode(state, "u1", codeFor(97), now));
    console.log(verifyCode(state, "u1", codeFor(101), now));
  solutionNotes: |
    - Oyna `[-1, 0, 1]`: soat farqi va tarmoq kechikishiga bardosh beradi, lekin yaroqli kodlar soni uchtadan oshmaydi (RFC 6238 ko'pi bilan bir qadamni tavsiya qiladi).
    - `state.last` faqat muvaffaqiyatli tekshiruvdan keyin yangilanadi va `step <= last` shartli kodlar rad etiladi. Shu tufayli aynan bir kod ikkinchi marta o'tmaydi (RFC 6238: ikkinchi urinishni qabul qilmaslik shart).
    - Kod 97-qadamdan: oyna tashqarisida, rad etildi. 101-qadam esa oyna ichida va `last=100` dan katta: soat oldinga siljigan haqiqiy foydalanuvchi o'tadi.
    - Bu yechim urinishlar sonini cheklamaydi. 6 xonali kod bo'shlig'i kichik (10^6), shuning uchun akkaunt bo'yicha throttling (43-dars) alohida va majburiy.
    - Ko'p instance'li serverda `last` umumiy bazada (Redis/PostgreSQL) atomik yangilanishi kerak, aks holda ikki parallel so'rov bir kodni qabul qiladi (60-dars).
  checklist:
    - "Faqat -1, 0, +1 qadamdagi kodlar qabul qilinadi"
    - "Qabul qilingan kod ikkinchi marta o'tmaydi"
    - "Oyna tashqarisidagi kod rad etiladi"
    - "Soat oldinga siljigan foydalanuvchi (keyingi qadam kodi) o'tadi"
    - "Taqqoslash doimiy vaqtli funksiya orqali"
---

## Muammo

Parol, uni qanchalik yaxshi saqlamang (42-dars), oxir-oqibat bitta sirdir: uni foydalanuvchi ham, hujumchi ham yozib kirsa bo'ladi. Phishing, keylogger, boshqa servisdan sizgan parol (43-dars) kirish uchun yetarli. Ikkinchi faktor shu bitta nuqtani olib tashlaydi: parol sizsa ham, hujumchi boshqa toifadagi dalilga muhtoj bo'ladi (41-dars). OWASP Top 10:2025 da A07 kategoriyasi MFA yo'qligi yoki samarasizligini, shuningdek MFA mavjud bo'lmaganda kuchsiz zaxira yo'llarni alohida zaiflik sifatida sanaydi.

Lekin "MFA yoqilgan" degan gap ikkinchi faktor qanday amalga oshirilganini aytmaydi. Real tizimlarda to'rt xil kamchilik uchraydi. TOTP kodi ishlatilgandan keyin yana qabul qilinadi (replay). Kod oynasi juda keng. SMS kodi telefon tarmog'idagi hujumlarga ochiq. Push-tasdiq charchatish hujumiga beriladi: foydalanuvchi "Tasdiqlash" ni bosib yuboradi. Va yana bir keng tarqalgan teshik: "ikkinchi faktorni yo'qotdim" yo'li (recovery) parolsiz yoki bitta email bilan ochiladi, shu bilan MFA qadrsizlanadi (50-dars).

Bu darsda eng ko'p qo'llaniladigan ikkinchi faktor turi TOTP'ni mexanizm darajasida ochamiz, uni to'g'ri tekshirishni kodda yozamiz, so'ng SMS va push xavflarini manbalarga tayanib solishtiramiz.

## Asosiy g'oya

### TOTP qanday ishlaydi

TOTP (Time-Based One-Time Password) RFC 6238 da tavsiflangan. U HOTP (RFC 4226) algoritmining variantidir: HOTP HMAC-SHA-1 ga asoslangan va hisoblagich qiymatini kalit bilan HMAC qilib, natijani foydalanuvchiga qulay qisqa raqamga kesadi. TOTP'da hisoblagich o'rniga vaqt qadami olinadi:

`TOTP = HOTP(K, T)`, bunda `T` boshlang'ich vaqtdan (odatda Unix epoch) beri o'tgan vaqt qadamlari soni. Standartdagi qadam uzunligi X = 30 soniya (sozlanuvchi parametr). Ya'ni 30 soniya davomida kod o'zgarmaydi, keyin yangisi chiqadi. Server va foydalanuvchi ilovasi ulashgan sirni (K) biladi, ikkalasi ham soatni ko'radi va bir xil kodni mustaqil hisoblaydi: tarmoq orqali hech narsa almashilmaydi.

Standart yana ikkita muhim talabni belgilaydi. Birinchisi: kalitlar tasodifiy yoki kriptografik jihatdan kuchli tasodifiy generator bilan yaratilishi va HMAC chiqishi uzunligida bo'lishi tavsiya etiladi (SHOULD). SHA-1 uchun bu 20 bayt. Ikkinchisi: tekshiruvchi muvaffaqiyatli tekshirilgan OTP'ning ikkinchi urinishini qabul qilmasligi shart (MUST NOT). Chunki foydalanuvchi bir kodni qadam oynasi ichida bir necha marta yuborishi mumkin va aynan shu qadam bir martalikni ta'minlaydi.

### Test vektori bilan tekshirish

RFC 6238 Appendix B bir nechta test vaqti uchun kutilgan natijani beradi. Sir sifatida ASCII `12345678901234567890` olinadi, T=59 va SHA-1 uchun 8 xonali kod `94287082`. Quyidagi kod shu vektorni o'z implementatsiyamiz bilan solishtiradi (production'da o'zingiz yozmang, kutubxona ishlating; maqsad mexanizmni ko'rish):

```ts run
const enc = new TextEncoder();

async function hotp(secret: Uint8Array, counter: number, digits: number): Promise<string> {
  const key = await crypto.subtle.importKey("raw", secret, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const msg = new Uint8Array(8);
  new DataView(msg.buffer).setBigUint64(0, BigInt(counter));
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, msg));
  const off = mac[19] & 0x0f;
  const bin = ((mac[off] & 0x7f) << 24) | (mac[off + 1] << 16) | (mac[off + 2] << 8) | mac[off + 3];
  return String(bin % 10 ** digits).padStart(digits, "0");
}
const totp = (secret: Uint8Array, nowSec: number, digits = 6, step = 30) =>
  hotp(secret, Math.floor(nowSec / step), digits);

const secret = enc.encode("12345678901234567890");
console.log("RFC 6238, T=59, 8 raqam:", await totp(secret, 59, 8));
console.log("vektor bilan mos:", (await totp(secret, 59, 8)) === "94287082");
console.log("6 raqamli kod:", await totp(secret, 59, 6));
console.log("30 va 59 soniya bir xil:", (await totp(secret, 30)) === (await totp(secret, 59)));
console.log("60 soniyada boshqa:", (await totp(secret, 60)) !== (await totp(secret, 59)));
```

```text
RFC 6238, T=59, 8 raqam: 94287082
vektor bilan mos: true
6 raqamli kod: 287082
30 va 59 soniya bir xil: true
60 soniyada boshqa: true
```

6 xonali kod 8 xonalining oxirgi olti raqami ekaniga e'tibor bering: kesish `mod 10^digits` bilan bajariladi. Kod bo'shlig'i 10^6, ya'ni milliondan bir. Shuning uchun TOTP'ning xavfsizligi urinishlar sonini cheklashga tayanadi, kodning o'zi hujumchiga qarshi katta bo'shliq emas.

## Chuqurroq: ikkinchi faktorning kamchiliklari

### Qabul oynasi va replay

Soat siljishi va foydalanuvchining kodni yozib yuborishgacha o'tgan vaqt tufayli server qo'shni qadamlarni ham qabul qilishi kerak. RFC 6238 tarmoq kechikishi uchun ko'pi bilan bir qadam ruxsat etishni tavsiya etadi (bu oyna kengaysa, hujumchi uchun imkoniyat ham kengayadi: yaroqli kodlar soni ko'payadi). Oynani kengaytirish o'rniga ilova soatini sinxronlashni foydalanuvchiga tushuntiring.

Replay'dan himoya esa "oxirgi qabul qilingan qadam"ni saqlash bilan amalga oshiriladi: keyingi kod shu qadamdan qat'iy katta qadamga tegishli bo'lishi kerak. Bu holat foydalanuvchi qatorida saqlanadi va parallel so'rovlarda atomik yangilanishi kerak.

### Secret'ni saqlash

Parolni hash qilsangiz bo'ladi, TOTP secret'ni esa yo'q: har tekshiruvda server secret bilan HMAC hisoblashi kerak. Demak secret qaytariladigan shaklda saqlanadi, va bazaning sizishi barcha foydalanuvchilar uchun ikkinchi faktorni yo'q qiladi. Himoya: secret'ni shifrlash (kalit bazadan alohida, 68-dars) va ro'yxatdan o'tkazishda uni faqat bir marta ko'rsatish (QR kod orqali). Ro'yxatdan o'tkazishda foydalanuvchi birinchi kodni kiritib tasdiqlamaguncha MFA yoqilgan hisoblanmaydi, aks holda xato sozlangan ilova akkauntni qulflab qo'yadi.

### Recovery kodlar

Ikkinchi faktor yo'qolsa, kirish usuli kerak. NIST SP 800-63-4 look-up secret (oldindan berilgan kodlar ro'yxati) authenticator turini tasniflaydi va uning kamida olti o'nlik raqam bo'lishini talab qiladi. Amalda: 8-10 ta bir martalik kod, tasodifiy, parol kabi hash qilib saqlanadi, ishlatilgach o'chiriladi. Foydalanuvchi ularni xavfsiz joyda saqlashi kerak. Bu kodlar birinchi faktor emas, ikkinchi faktor o'rnini bosadi, shuning uchun ular ham throttling'dan o'tadi.

### Faktorni almashtirish va MFA'ni tiklash

MFA'ning eng zaif joyi ko'pincha faktorning o'zi emas, uni almashtirish oqimi. Cheat sheet bu haqda aniq: faktor almashtirishni yuqori xavfli amal deb qarang, o'zgarishdan oldin allaqachon ro'yxatdan o'tgan faktor bilan qayta autentifikatsiya talab qiling, faqat ochiq sessiyaga tayanmang (sessiya o'g'irlangan bo'lishi mumkin), o'zgarish haqida alohida kanal orqali (email yoki push) xabar bering, yuqori qiymatli akkauntlarda esa kechikish yoki qo'shimcha tekshiruv qo'shing. Shunda sessiyani qo'lga kiritgan hujumchi egasining faktorini jimgina o'zinikiga almashtirib, uni akkauntdan chiqarib yubora olmaydi. Tiklash usullari ro'yxati ham cheat sheet'da: ro'yxatdan o'tishda berilgan bir martalik recovery kodlar, bir nechta turdagi faktorni majburan ro'yxatdan o'tkazish, qo'llab-quvvatlash xizmati orqali qat'iy identifikatsiya, boshqa ishonchli foydalanuvchining kafolati. "Eng yaxshi" yo'l yo'q: tanlov ilovaning xavfi va foydalanuvchilar ustidan nazoratga bog'liq (50-dars). Parol to'g'ri, lekin ikkinchi faktor muvaffaqiyatsiz bo'lsa, foydalanuvchiga vaqt, brauzer va joylashuv ko'rsatilgan xabar yuboring: bu yo faktor yo'qolgani, yo parol sizgani.

### SMS va ovozli qo'ng'iroq

NIST SP 800-63-4 PSTN orqali out-of-band tasdiqlashni cheklangan (restricted) authenticator deb belgilaydi. Standart "xavf vaqt o'tishi bilan ortishi mumkin" deb yozadi va tashkilot riskni baholab, qabul qilib, yumshatish usullarini belgilashini talab qiladi; agar xavf qabul qilib bo'lmasa, boshqa authenticator ishlatilishi shart. Shuningdek email out-of-band authenticator sifatida ishlatilmaydi: parol bilan kirib olingan pochta qutisi, pochta serverlaridagi uzatish va yo'naltirish hujumlari sabab. Mexanizm: SMS kodi telefon raqamiga bog'liq, raqamni o'g'irlash yoki yo'naltirish (SIM almashtirish) kodni hujumchiga yetkazadi. Telefon tarmog'iga qarshi aniq hujum statistikasini bu yerda keltirmaymiz, chunki tekshirilmagan.

### Bir martalik kodlar uchun NIST va OWASP gigiyenasi

Kodni SMS yoki boshqa out-of-band kanal bilan yuborsangiz, NIST SP 800-63B-4 verifier uchun aniq talablar qo'yadi. Autentifikatsiya sirri tasodifiy bit generatori bilan yaratilgan kamida olti o'nlik raqam (yoki unga teng) bo'lishi kerak. Javob 10 daqiqa ichida kelmasa, autentifikatsiya yaroqsiz hisoblanadi. Berilgan sir amal qilish muddatida faqat bir marta qabul qilinadi (replay resistance). Sir 64 bitdan qisqa bo'lgani uchun (olti raqam 20 bitga yetmaydi) akkaunt bo'yicha muvaffaqiyatsiz urinishlarni cheklovchi rate limiting majburiy (SHALL), va muhim detal: yangi kod yaratish muvaffaqiyatsiz urinishlar hisobini nolga tushirmaydi. Aks holda hujumchi "kodni qayta yuborish" tugmasini bosib, har safar yangi urinishlar to'plamiga ega bo'ladi. TOTP uchun ham shu mantiq: vaqt kodining amal qilish muddati soat siljishi va kiritish kechikishiga qarab belgilanadi, kod ikkinchi marta qabul qilinmaydi, chiqishi 64 bitdan qisqa bo'lgani uchun urinishlar cheklanadi.

Multifactor Authentication Cheat Sheet shu qoidalarni amaliy ro'yxatga aylantiradi. OTP uchun qisqa TTL, bir martalik foydalanish, qat'iy urinishlar limiti va muvaffaqiyatli tekshiruvdan keyin yaroqsiz qilish minimal talab. OTP qiymatini log'ga yozmang va uzoq muddat ochiq matnda saqlamang. Kriptografik xavfsiz generator ishlating, usability ruxsat bersa 8 raqam yoki undan uzun kodni ko'rib chiqing, "qayta yuborish"da esa eski yozuvni yangi kod bilan almashtiring. OTP'ni hash qilish tavsiya etiladi, lekin parol hash'idan boshqa sababli: 6 raqamli kodning kalit bo'shlig'i atigi bir million atrofida, shuning uchun bazaga kirgan hujumchi hash'ni zumda sindiradi. Hash faqat qisqa muddatli ta'sirdan (log, metrika, qisqa vaqt bazaning ochilib qolishi) saqlaydi, uzoq muddatli maxfiylikni bermaydi. Quyidagi mashqda shu qoidalar bitta kichik funksiyada: yarim tuzatilgan versiyani to'ldiring.

```ts run
type Challenge = { code: string; issuedAt: number; used: boolean };
type Account = { fails: number; ch: Challenge | null };
const TTL_MS = 10 * 60 * 1000;
const MAX_FAILS = 5;

function issue(acc: Account, code: string, now: number): void {
  acc.ch = { code, issuedAt: now, used: false };
  acc.fails = 0; // ZAIF: qayta yuborish urinishlar hisobini nolga tushiradi
}

function verify(acc: Account, code: string, now: number): boolean {
  return acc.ch?.code === code; // ZAIF: muddat, bir martalik va urinishlar limiti yo'q
}

const acc: Account = { fails: 0, ch: null };
issue(acc, "482913", 0);
console.log("to'g'ri kod:", verify(acc, "482913", 1000));
console.log("xuddi shu kod yana:", verify(acc, "482913", 2000));
console.log("11 daqiqadan keyin:", verify(acc, "482913", 11 * 60 * 1000));
```

```ts test
const mk = (): Account => ({ fails: 0, ch: null });
check("to'g'ri kod muddat ichida qabul qilinadi", () => {
  const a = mk(); issue(a, "111111", 0);
  return verify(a, "111111", 60_000) === true;
});
check("noto'g'ri kod rad etiladi", () => {
  const a = mk(); issue(a, "111111", 0);
  return verify(a, "222222", 1000) === false;
});
check("10 daqiqadan keyin kod yaroqsiz", () => {
  const a = mk(); issue(a, "111111", 0);
  return verify(a, "111111", TTL_MS + 1) === false;
});
check("kod ikkinchi marta o'tmaydi", () => {
  const a = mk(); issue(a, "111111", 0);
  return verify(a, "111111", 1000) === true && verify(a, "111111", 2000) === false;
});
check("5 ta xatodan keyin to'g'ri kod ham rad etiladi", () => {
  const a = mk(); issue(a, "111111", 0);
  for (let i = 0; i < 5; i++) verify(a, "000000", 1000 + i);
  return verify(a, "111111", 2000) === false;
});
check("qayta yuborish xatolar hisobini nolga tushirmaydi", () => {
  const a = mk(); issue(a, "111111", 0);
  for (let i = 0; i < 3; i++) verify(a, "000000", 1000 + i);
  issue(a, "333333", 5000);
  for (let i = 0; i < 2; i++) verify(a, "000000", 6000 + i);
  return verify(a, "333333", 7000) === false;
});
check("yangi kod chiqarilgach eski kod o'tmaydi", () => {
  const a = mk(); issue(a, "111111", 0); issue(a, "333333", 1000);
  return verify(a, "111111", 2000) === false;
});
```

### Push va charchatish

Push-tasdiq foydalanuvchiga qulay, lekin bir tugma bilan tasdiqlanadi. Hujumchi parolni bilsa, ko'p marta kirishga urinib, foydalanuvchini tasdiqlashga undashi mumkin. NIST push yuboradigan verifier'larga muvaffaqiyatli autentifikatsiyadan beri yuborilgan pushlar tezligi yoki umumiy soniga oqilona chek qo'yishni tavsiya etadi. Muallif tavsiyasi: tasdiqlash uchun so'rov kontekstini (joy, qurilma) ko'rsating va foydalanuvchidan ekrandagi kodni kiritishni talab qiling.

Multifactor Authentication Cheat Sheet charchatish hujumiga qarshi uchta chorani sanaydi: challenge-response push (masalan, ekranda ko'rsatilgan raqamni telefonda tanlash: "number matching"), push'larni tezlik yoki son bo'yicha cheklash va qisqa vaqt ichida ko'p push yoki yangi qurilma tokenini qayta ishlatish kabi anomaliyalarni kuzatish. Bundan tashqari cheat sheet yana ikki hujum naqshini ajratadi. Birinchisi, SIM almashtirish va raqamni o'g'irlash: tavsiya shuki, SMS/ovozli OTP o'rniga phishing-resistant authenticator yoki TOTP afzal, raqam egasi operator hisobiga PIN yoki port-out himoyasini yoqsin, ilova esa telefon raqami yoki SIM kutilmaganda o'zgarishini kuzatsin; NIST ham PSTN orqali kod yuborishdan oldin qurilma almashishi, SIM o'zgarishi, raqam ko'chirilishi kabi risk belgilarini hisobga olishni tavsiya etadi (SHOULD). Ikkinchisi, MFA downgrade: hujumchi MFA talab qilmaydigan eski protokol yoki zaxira oqim orqali kiradi. Mitigatsiya: MFA'ni bir xil majburlay olmaydigan legacy endpoint'larni o'chirish va phishing-resistant authenticator'dan zaifroq usulga o'tishga hujjatlashtirilgan siyosatsiz ruxsat bermaslik.

SMS'ni qabul qilgan tashkilot uchun NIST qo'shimcha majburiyatlar ham yozadi: kamida bitta cheklanmagan alternativ authenticator taklif qilish, foydalanuvchiga xavf haqida aniq ogohlantirish berish, xavfni o'z risk baholashiga kiritish va cheklangan authenticator kelajakda qabul qilinmay qolsa, migratsiya rejasini tayyorlash. Telefon qamrovi zaif hududdagi foydalanuvchi SMS ololmasligi mumkin, shuning uchun alternativ barcha foydalanuvchilarga mavjud bo'lishi shart (SHALL).

Va nihoyat, bu usullarning hech biri origin'ga bog'lanmagan. Foydalanuvchi TOTP kodini yoki SMS kodini soxta saytga kiritsa, hujumchi uni real vaqtda haqiqiy saytga uzatadi. Shuning uchun NIST AAL2 da phishing-resistant variantni taklif qilishni talab qiladi, passkey esa shu xossani beradi (45-dars).

## Misol: TOTP tekshiruvi

### Zaif kod

Eski modul oynani "ishonch uchun" ±10 qadamga kengaytirgan va ishlatilgan kodni eslab qolmaydi.

```ts run
const enc = new TextEncoder();
async function hotp(secret: Uint8Array, counter: number): Promise<string> {
  const key = await crypto.subtle.importKey("raw", secret, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const msg = new Uint8Array(8);
  new DataView(msg.buffer).setBigUint64(0, BigInt(counter));
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, msg));
  const off = mac[19] & 0x0f;
  const bin = ((mac[off] & 0x7f) << 24) | (mac[off + 1] << 16) | (mac[off + 2] << 8) | mac[off + 3];
  return String(bin % 1_000_000).padStart(6, "0");
}
const secret = enc.encode("12345678901234567890");

// ZAIF: oyna +-10 qadam (5 daqiqa), ishlatilgan kod eslab qolinmaydi.
async function verifyTotp(code: string, nowSec: number): Promise<boolean> {
  const cur = Math.floor(nowSec / 30);
  for (let d = -10; d <= 10; d++) {
    if (code === (await hotp(secret, cur + d))) return true;
  }
  return false;
}

const t0 = 1_700_000_000;
const code = await hotp(secret, Math.floor(t0 / 30));
console.log("birinchi kirish:", await verifyTotp(code, t0));
```

```text
birinchi kirish: true
```

### Hujum

Hujumchi foydalanuvchi kodni kiritayotganda uni ko'rib qoldi (yoki soxta sahifadan oldi) va o'quv serveriga qayta yuboradi.

```ts run
const enc = new TextEncoder();
async function hotp(secret: Uint8Array, counter: number): Promise<string> {
  const key = await crypto.subtle.importKey("raw", secret, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const msg = new Uint8Array(8);
  new DataView(msg.buffer).setBigUint64(0, BigInt(counter));
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, msg));
  const off = mac[19] & 0x0f;
  const bin = ((mac[off] & 0x7f) << 24) | (mac[off + 1] << 16) | (mac[off + 2] << 8) | mac[off + 3];
  return String(bin % 1_000_000).padStart(6, "0");
}
const secret = enc.encode("12345678901234567890");
async function verifyTotp(code: string, nowSec: number): Promise<boolean> {
  const cur = Math.floor(nowSec / 30);
  for (let d = -10; d <= 10; d++) if (code === (await hotp(secret, cur + d))) return true;
  return false;
}

const t0 = 1_700_000_000;
const stolen = await hotp(secret, Math.floor(t0 / 30));
console.log("egasi kirdi:", await verifyTotp(stolen, t0));
console.log("replay, +5 soniya:", await verifyTotp(stolen, t0 + 5));
console.log("replay, +4 daqiqa:", await verifyTotp(stolen, t0 + 240));
```

```text
egasi kirdi: true
replay, +5 soniya: true
replay, +4 daqiqa: true
```

O'g'irlangan kod to'rt daqiqadan keyin ham o'tdi. Kod "bir martalik" bo'lishi kerak edi, lekin tizim buni majburlamadi.

### Tuzatilgan kod

Oyna bir qadamga qisqartirildi, oxirgi qabul qilingan qadam saqlanadi, taqqoslash doimiy vaqtli.

```ts run
const enc = new TextEncoder();
async function hotp(secret: Uint8Array, counter: number): Promise<string> {
  const key = await crypto.subtle.importKey("raw", secret, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const msg = new Uint8Array(8);
  new DataView(msg.buffer).setBigUint64(0, BigInt(counter));
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, msg));
  const off = mac[19] & 0x0f;
  const bin = ((mac[off] & 0x7f) << 24) | (mac[off + 1] << 16) | (mac[off + 2] << 8) | mac[off + 3];
  return String(bin % 1_000_000).padStart(6, "0");
}
const secret = enc.encode("12345678901234567890");

function equalConst(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

const lastStep = new Map<string, number>();

async function verifyTotp(userId: string, code: string, nowSec: number): Promise<boolean> {
  const cur = Math.floor(nowSec / 30);
  const last = lastStep.get(userId) ?? -1;
  for (const d of [-1, 0, 1]) {
    const step = cur + d;
    if (step <= last) continue;
    if (equalConst(code, await hotp(secret, step))) {
      lastStep.set(userId, step);
      return true;
    }
  }
  return false;
}

const t0 = 1_700_000_000;
const stolen = await hotp(secret, Math.floor(t0 / 30));
console.log("egasi kirdi:", await verifyTotp("u1", stolen, t0));
console.log("replay, +5 soniya:", await verifyTotp("u1", stolen, t0 + 5));
console.log("replay, +4 daqiqa:", await verifyTotp("u1", stolen, t0 + 240));
console.log("keyingi yangi kod:", await verifyTotp("u1", await hotp(secret, Math.floor(t0 / 30) + 1), t0 + 30));
```

```text
egasi kirdi: true
replay, +5 soniya: false
replay, +4 daqiqa: false
keyingi yangi kod: true
```

Nima uchun yetarli: invariant "har foydalanuvchi uchun qabul qilingan qadamlar qat'iy o'sadi" saqlanadi, shuning uchun bitta kod ikki marta o'tmaydi va eski kod ham o'tmaydi. Oyna kichik, yaroqli kodlar soni uchtadan oshmaydi. Yopilmagan: kodni haqiqiy foydalanuvchidan oldin yuborish (real vaqtli phishing relay) hali ishlaydi, chunki hujumchi birinchi bo'lib yuboradi; 10^6 bo'shliqni taxmin qilishga qarshi throttling (43-dars) alohida kerak; `lastStep` ko'p instance'da umumiy atomik holat talab qiladi.

## Qachon qo'llamaslik kerak

Agar akkaunt AAL2 phishing-resistant talabiga duch kelsa (masalan, admin paneli), TOTP yolg'iz o'zi yetmaydi: passkey yoki hardware kalit qo'shing (45-dars). Mijozlari sodda foydalanuvchilar bo'lgan B2C tizimda TOTP'ni majburlash o'rniga tavsiya qilib, passkey'ni birinchi taklif sifatida ko'rsatish yaxshiroq. SMS'ni faqat boshqa variant yo'q bo'lganda va riskni yozma qabul qilib ishlating; shuningdek SMS kodiga ega bo'lish akkaunt tiklash uchun yagona dalil bo'lmasin. Push-tasdiqni charchatishga qarshi hech qanday chek va kontekst bo'lmagan holda yoqmang. Va oxirgisi: o'zingiz HMAC va vaqtni hisoblab TOTP yozmang: bu darsdagi kod mexanizmni ko'rsatish uchun, production'da sinalgan kutubxona va qurilma qo'llab-quvvatlashi bor ro'yxatdan o'tkazish oqimi kerak.

## Stack'da: NestJS va PostgreSQL

NestJS'da MFA tekshiruvi ikki bosqichli guard bilan modellanadi: birinchi bosqichda parol to'g'ri bo'lsa "ko'rilmagan MFA" holatidagi vaqtinchalik sessiya yaratiladi (faqat `/mfa/verify` endpoint'iga kirish mumkin), ikkinchi bosqichda TOTP tekshiriladi va to'liq sessiya beriladi (46-dars: sessiya identifikatorini shu paytda yangilang). PostgreSQL'da `user_mfa(user_id, secret_enc bytea, last_step bigint, confirmed_at timestamptz)` jadvali, `last_step` ni tekshiruv paytida `UPDATE ... WHERE last_step < $1 RETURNING` bilan atomik oshiring: bir so'rov muvaffaqiyatli bo'lsa, ikkinchi parallel so'rov 0 qator yangilaydi va rad etiladi. Secret shifrlash uchun AEAD (63-dars) va KMS kaliti (68-dars). MFA urinishlari ham kirish throttling'iga qo'shiladi. Redis'da ham holat saqlash mumkin, lekin Redis ma'lumoti yo'qolsa replay oynasi ochiladi, shuning uchun `last_step` uchun doimiy saqlash afzal.

## Xulosa

- TOTP = HOTP(K, T), qadam 30 soniya, kalit tasodifiy va HMAC chiqishi uzunligida; RFC 6238 Appendix B vektori bilan implementatsiyani tekshiring.
- Muvaffaqiyatli tekshirilgan kodning ikkinchi urinishini rad eting: oxirgi qabul qilingan qadamni saqlang. Oynani bir qadam atrofida cheklang.
- 10^6 kod bo'shlig'i throttling'siz himoya emas.
- Secret hash qilinmaydi, shifrlanadi; ro'yxatdan o'tkazishda birinchi kod bilan tasdiqlanadi. Recovery kodlar tasodifiy, hash qilingan, bir martalik.
- NIST'da PSTN (SMS/ovoz) cheklangan authenticator; email out-of-band authenticator bo'la olmaydi; push'da yuborish tezligi va soni cheklanadi.
- TOTP, SMS va push origin'ga bog'lanmagan va real vaqtli phishing'ga ochiq; phishing resistance uchun passkey (45-dars).
