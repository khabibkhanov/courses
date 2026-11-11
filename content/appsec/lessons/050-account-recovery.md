---
n: 50
slug: account-recovery
title: "Account recovery va email tasdiqlash"
summary: "Parolni tiklash oqimining xavfsizlik modeli: tiklash yo'li eng zaif bo'g'in ekani, reset token'ning tasodifiyligi, hash saqlash, muddati va bir martaligi, bir xil javob, Host sarlavhasi, tiklashdan keyingi sessiya bekor qilish va bildirishnoma, NIST recovery usullari va email tasdiqlash."
duration: 50
sources:
  - id: cs-forgot-password
    note: "Forgot Password Cheat Sheet: bir xil xabar va bir xil javob vaqti, side-channel orqali yuborish, token'lar kriptografik xavfsiz generatordan, yetarlicha uzun, xavfsiz saqlangan, bir martalik va muddatli; reset havolasini Host sarlavhasidan qurmaslik; tiklashdan keyin avtomatik kirgizmaslik; mavjud sessiyalarni bekor qilish; tiklashdan keyin foydalanuvchiga xabar; tiklash so'rovlariga akkaunt bo'yicha rate limit; akkauntni qulflamaslik"
  - id: nist-63-4
    note: "SP 800-63B-4 account recovery usullari: saqlangan recovery code (kamida 64 bit, hash qilingan holda saqlanadi, ishlatilgach bekor qilinib yangisi beriladi), yuboriladigan recovery code (kamida olti o'nlik raqam; amal qilish muddati SMS/ovoz uchun ko'pi bilan 10 daqiqa, email uchun 24 soat), tekshiruv throttling'ga bo'ysunadi, yangi recovery manzil tasdiqlash kodi bilan tasdiqlanadi, tiklash bildirishnoma yuborishga olib keladi; yuborilgan kod muddati: SMS/ovoz 10 daqiqa, email 24 soat, AQSh ichidagi pochta 21 kun, undan tashqari 30 kun; kamida ikkita recovery manzil va ikkita bildirishnoma manzili; AAL2 tiklash: ikkita turli recovery code yoki bitta kod va bog'langan bir faktorli authenticator yoki qayta identity proofing; unutilgan parolni boshqa authenticator bilan almashtirish recovery emas, yangi authenticator bog'lash; buzilgan authenticator darrov to'xtatiladi; email out-of-band authenticator sifatida ishlatilmaydi"
  - id: cs-authn
    note: "Authentication Cheat Sheet: parolni tiklash javobida mavjud va mavjud bo'lmagan akkaunt uchun bir xil xabar; parolni tiklash kabi yuqori xavfli harakatlardan keyin qayta autentifikatsiya, sessiyalarni bekor qilish va token'larni almashtirish; email'ni username sifatida ishlatish faqat ro'yxatdan o'tishda tasdiqlansa; email almashtirish jarayoni (MFA bilan va MFA'siz variantlar, ikkita yoki uchta vaqt bilan cheklangan nonce, joriy manzilga ogohlantirish)"
  - id: t10-a07
    note: "OWASP Top 10:2025 A07: kuchsiz yoki samarasiz zaxira yo'llar va sessiyani to'g'ri bekor qilmaslik autentifikatsiya zaifligi sifatida"
quiz:
  - q: "'Parolni unutdim' formasi mavjud email uchun 'Havola yuborildi', mavjud bo'lmagan email uchun 'Bunday email topilmadi' deydi. Nima uchun bu xavfsizlik muammosi?"
    options:
      - "Foydalanuvchi uchun noqulay, lekin xavfsizlikka aloqasi yo'q"
      - "Email jo'natish sekinlashadi"
      - "Javob farqi orqali hujumchi qaysi email'lar ro'yxatdan o'tganini aniqlaydi (enumeration) va keyingi hujumlarni (stuffing, phishing) shu ro'yxatga yo'naltiradi"
      - "Faqat spam xavfi"
    answer: 2
    explain: "Cheat sheet mavjud va mavjud bo'lmagan akkaunt uchun bir xil xabar va bir xil javob vaqtini talab qiladi. Misol xabar: 'Agar bu email bazada bo'lsa, tiklash havolasi yuboriladi'."
  - q: "Reset token bazada ochiq matnda saqlanadi. Hujumchi bazadan faqat o'qish huquqi oldi (masalan, SQL injection orqali). Nima bo'ladi?"
    options:
      - "Hujumchi hozir amal qilayotgan hamma token bilan istalgan foydalanuvchining parolini almashtira oladi; hash saqlansa bu yo'l yopiladi"
      - "Hech narsa: token faqat bir marta ishlaydi"
      - "Faqat o'z akkauntini tiklay oladi"
      - "Token'lar avtomatik eskiradi"
    answer: 0
    explain: "Token parol kabi sirdir: kim bilsa, akkauntni egallaydi. Shuning uchun token'ning o'zi emas, uning hash'i saqlanadi (token yuqori entropiyali bo'lgani uchun tez hash, masalan SHA-256, yetarli; sekin parol hash'i shart emas). Bir martalik bo'lish hujumchining birinchi ishlatishini to'xtatmaydi."
  - q: "Reset token sifatida `sha1(email + Date.now())` ishlatilgan. Hujumchi nimani bilishi bilan token'ni hisoblay oladi?"
    options:
      - "Hech narsani: SHA-1 qaytarilmaydi"
      - "Faqat parolni"
      - "Faqat server kalitini"
      - "Qurbonning email'ini (ma'lum) va taxminiy so'rov vaqtini: kiritilgan qiymatlar bashorat qilinadi, hash esa ularni yashirmaydi"
    answer: 3
    explain: "Hash bashorat qilinadigan kirishni tasodifiy qilmaydi. Hujumchi email va vaqt oralig'ini sinab chiqadi. Token CSPRNG'dan olingan tasodifiy bayt bo'lishi kerak (67-dars)."
  - q: "Parol muvaffaqiyatli tiklangandan keyin foydalanuvchining eski sessiyalari nima bo'lishi kerak?"
    options:
      - "Davom etadi: foydalanuvchi o'zi tiklagan"
      - "Bekor qilinadi (yoki foydalanuvchiga tanlov beriladi): hisob buzilgan bo'lsa, hujumchining sessiyasi ham shu orqali tugaydi"
      - "Faqat joriy sessiya bekor qilinadi"
      - "Faqat bir kun o'tgach bekor qilinadi"
    answer: 1
    explain: "Parol ko'pincha hisob xavf ostida bo'lganda tiklanadi: hujumchining ochiq sessiyasi parol almashishi bilan tugamasa, tiklash foydasiz. Cheat sheet sessiyalarni bekor qilish yoki foydalanuvchidan so'rashni tavsiya etadi, 46-darsdagi foydalanuvchi bo'yicha indeks shuni ta'minlaydi."
  - q: "Parolni tiklaganidan so'ng tizim foydalanuvchini avtomatik kirgizadi. Cheat sheet bu haqda nima deydi?"
    options:
      - "Tavsiya etiladi: qulaylik uchun"
      - "Majburiy"
      - "Avtomatik kirgizmaslik tavsiya etiladi: foydalanuvchi odatiy kirish mexanizmi orqali kirsin, bu autentifikatsiya va sessiya kodining murakkabligi va xato ehtimolini kamaytiradi"
      - "Faqat MFA yoqilgan bo'lsa"
    answer: 2
    explain: "Tiklash oqimi alohida 'yashirin kirish' yo'lini yaratadi, uni qo'llab-quvvatlash va tekshirish qo'shimcha xato manbai. Odatiy kirish yo'li MFA, throttling va sessiya yaratishning hammasini allaqachon amalga oshiradi."
  - q: "Reset havolasi `https://${req.headers.host}/reset?token=...` ko'rinishida quriladi. Hujumchi `Host: evil.test` bilan qurbon uchun tiklash so'rovini yuboradi. Natija?"
    options:
      - "Qurbonga haqiqiy emailda hujumchi domenidagi havola keladi; qurbon bossa, token hujumchi serveriga tushadi"
      - "Server so'rovni rad etadi"
      - "Hech narsa bo'lmaydi: email provayderi domenni tekshiradi"
      - "Faqat sahifa sekin ochiladi"
    answer: 0
    explain: "Host sarlavhasi mijoz nazoratida. Cheat sheet reset URL'ini qattiq yozilgan manzildan yoki ishonchli domenlar ro'yxati bilan tekshirilgan qiymatdan qurishni aytadi. Havola bosilsa token hujumchi domeniga uzatiladi."
task:
  title: "Reset token store: hash, muddat va bir martalik foydalanish"
  prompt: |
    Starter reset token'larni ochiq matnda saqlaydi, muddatni tekshirmaydi va token ishlatilgandan keyin ham qabul qiladi. Tuzating:

    - `issue(userId, token, now)` token'ning SHA-256 hash'ini (hex) kalit sifatida saqlasin, ochiq token omborda bo'lmasin;
    - `consume(token, now)` hash bo'yicha topsin; topilgan yozuvni har holatda o'chirsin (bir martalik); muddati o'tgan (`TTL_MS` = 15 daqiqa) yoki topilmasa `"invalid"`, aks holda `"user:" + userId` qaytarsin.

    Imzolarni o'zgartirmang. Kutilgan chiqish: `user:u1`, `invalid`, `invalid`, `invalid`, `false`.
  lang: ts
  starter: |
    const MIN = 60_000;
    const TTL_MS = 15 * MIN;
    type Entry = { userId: string; expiresAt: number };
    const store = new Map<string, Entry>();

    async function issue(userId: string, token: string, now: number): Promise<void> {
      store.set(token, { userId, expiresAt: now + TTL_MS });
    }

    async function consume(token: string, now: number): Promise<string> {
      const e = store.get(token);
      return e ? "user:" + e.userId : "invalid";
    }

    const now = 1_700_000_000_000;
    await issue("u1", "tok-valid", now);
    console.log(await consume("tok-valid", now + MIN));
    console.log(await consume("tok-valid", now + MIN + 1000));
    await issue("u2", "tok-old", now - 20 * MIN);
    console.log(await consume("tok-old", now));
    console.log(await consume("tok-unknown", now));
    console.log([...store.keys()].some((k) => k.includes("tok-")));
  solution: |
    const MIN = 60_000;
    const TTL_MS = 15 * MIN;
    type Entry = { userId: string; expiresAt: number };
    const store = new Map<string, Entry>();

    async function sha256hex(s: string): Promise<string> {
      const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
      return [...new Uint8Array(d)].map((x) => x.toString(16).padStart(2, "0")).join("");
    }

    async function issue(userId: string, token: string, now: number): Promise<void> {
      store.set(await sha256hex(token), { userId, expiresAt: now + TTL_MS });
    }

    async function consume(token: string, now: number): Promise<string> {
      const key = await sha256hex(token);
      const e = store.get(key);
      store.delete(key); // bir martalik: muvaffaqiyatsiz urinishda ham o'chadi
      if (!e || e.expiresAt <= now) return "invalid";
      return "user:" + e.userId;
    }

    const now = 1_700_000_000_000;
    await issue("u1", "tok-valid", now);
    console.log(await consume("tok-valid", now + MIN));
    console.log(await consume("tok-valid", now + MIN + 1000));
    await issue("u2", "tok-old", now - 20 * MIN);
    console.log(await consume("tok-old", now));
    console.log(await consume("tok-unknown", now));
    console.log([...store.keys()].some((k) => k.includes("tok-")));
  solutionNotes: |
    - Omborda token'ning SHA-256 hash'i turadi. Token CSPRNG'dan olingan yuqori entropiyali qiymat bo'lgani uchun tez hash yetarli (parol uchun sekin funksiya shart, chunki parol past entropiyali). Baza sizsa, hujumchi hash'dan token'ni tiklay olmaydi.
    - `store.delete` tekshiruvdan oldin chaqiriladi: token ishlatilgandan keyin ham, muddati o'tgan bo'lsa ham qayta ishlatib bo'lmaydi.
    - Muddat (15 daqiqa) bu darsning tanlovi. NIST yuboriladigan recovery code uchun email'da ko'pi bilan 24 soat, SMS/ovozda 10 daqiqa belgilaydi; qisqaroq muddat hujum oynasini qisqartiradi.
    - Bu kod token'ni yaratish (CSPRNG, kamida 128-256 bit), yuborish, rate limit, bir xil javob va tiklashdan keyingi sessiya bekor qilishni qoplamaydi: ular tashqarida.
    - Parallel so'rovlarda `get` + `delete` atomik emas; haqiqiy omborda `DELETE ... RETURNING` yoki Redis `GETDEL` ishlating (60-dars).
  checklist:
    - "Omborda ochiq matnli token yo'q"
    - "Token ikkinchi marta ishlamaydi"
    - "Muddati o'tgan token rad etiladi"
    - "Noma'lum token `invalid`, xato tashlamaydi"
    - "Imzolar o'zgarmagan"
---

## Muammo

Kuchli parol, MFA va passkey (42-45-darslar) faqat kirish yo'li bitta bo'lganda ishlaydi. Amalda har tizimda ikkinchi yo'l bor: "parolni unutdim". Hujumchi uchun eng arzon yo'l ko'pincha shu. Agar tiklash faqat emailga havola yuborishdan iborat bo'lsa, hujumchi parolni, TOTP'ni, hatto passkey'ni ham buzishi shart emas: foydalanuvchining pochta qutisini egallash yetarli. 41-darsdagi qoida shu: tizimning ishonchi eng zaif kirish yo'li bilan belgilanadi. OWASP Top 10:2025 A07 shuning uchun MFA mavjud bo'lmaganda kuchsiz yoki samarasiz zaxira yo'llarni alohida zaiflik sifatida sanaydi.

Forgot Password Cheat Sheet bu funksiyani qisqa va aniq ta'riflaydi: u "to'g'ri ko'rinadi", lekin zaifliklarning keng tarqalgan manbai. Eng ko'p uchraydigan xatolar: tiklash formasi akkaunt mavjudligini oshkor qiladi; token bashorat qilinadi (ketma-ket raqam, vaqt belgisi, foydalanuvchi identifikatori hash'i); token muddatsiz va qayta ishlatiladi; token bazada ochiq matnda; havola so'rovning `Host` sarlavhasidan quriladi; tiklangandan keyin eski sessiyalar ishlayveradi; foydalanuvchiga hech qanday xabar bormaydi.

Ikkinchi qism: ro'yxatdan o'tishdagi email tasdiqlash. Email tasdiqlanmagan bo'lsa, tiklash kanali ham, bildirishnoma kanali ham bo'sh. Agar hujumchi sizning email'ingiz bilan oldindan akkaunt ochib qo'ygan bo'lsa (pre-hijacking), siz keyinroq ro'yxatdan o'tganingizda yoki tashqi provayder orqali kirganingizda (49-dars) tizim chalkashishi mumkin. Bu dars ikkala jarayonni tartibga soladi va NIST SP 800-63-4 ning recovery usullaridan nimani olish mumkinligini ko'rsatadi.

## Asosiy g'oya

### Tiklash autentifikatsiya emas, balki boshqa authenticator berish

Tiklash foydalanuvchining authenticator'ini almashtirishga imkon beradi, ya'ni uning o'zi yangi autentifikatsiya dalili yaratadi. Shuning uchun tiklash oqimiga kirish oqimidan kam bo'lmagan e'tibor beriladi. NIST SP 800-63-4 account recovery'ni subscriber kerakli AAL uchun zarur authenticator'lar ustidan nazoratni yo'qotganda tiklanish deb ta'riflaydi va to'rt umumiy usulni tan oladi: saqlangan recovery code, yuboriladigan recovery code, recovery contact va qayta identity proofing. Har qanday tiklash subscriber'ga bildirishnoma yuborilishiga olib kelishi kerak (SHALL). Muhim ayirma: NIST'ga ko'ra, subscriber boshqa authenticator bilan kira oladigan holatda unutilgan parolni almashtirish account recovery emas, balki yangi authenticator bog'lash hisoblanadi. Ya'ni shu darsdagi "parolni unutdim" oqimi odatda NIST'ning recovery bo'limi emas, authenticator bog'lash qoidalariga tushadi; recovery code'lar esa kirish uchun kerakli authenticator'lar hammasi yo'qolganda ishga tushadi. Ikkala holatda ham xavf bir xil: hujumchi yangi authenticator bog'lab oladi.

### Reset token talablari

Cheat sheet va NIST bir-biriga mos talablar beradi. Token (yoki kod):

- kriptografik xavfsiz tasodifiy generatordan olinadi (JWT'dan emas: cheat sheet JWT qo'shimcha zaifliklar keltirishi mumkinligini aytadi);
- brute force'ga chidamli uzunlikda;
- xavfsiz saqlanadi: NIST saqlangan recovery code'larni hash qilingan holda saqlashni talab qiladi, cheat sheet esa token'larni Password Storage qoidalariga muvofiq saqlashni aytadi. Yuqori entropiyali token uchun tez hash yetarli ekani bu darsning xulosasi (token taxmin qilinmaydi, parol esa taxmin qilinadi);
- aniq foydalanuvchiga bog'langan;
- bir martalik va muddatli.

NIST yuboriladigan recovery code uchun kamida olti o'nlik raqam (yoki ekvivalent) talab qiladi; amal qilish muddati ko'pi bilan 10 daqiqa (SMS yoki ovoz), 24 soat (email). Tekshiruv throttling talablariga bo'ysunadi. Qisqa raqamli kod uchun muddat va throttling ayniqsa muhim; havola ichidagi uzun token uchun entropiya o'zi asosiy himoya.

## Chuqurroq: oqim bosqichlari

### So'rov bosqichi

Foydalanuvchi email kiritadi. Cheat sheet qoidalari:

- Mavjud va mavjud bo'lmagan akkaunt uchun bir xil xabar ("Agar bu email bazada bo'lsa, tiklash havolasi yuboriladi"). Authentication Cheat Sheet ham aynan shunday misol beradi.
- Javob vaqti ham bir xil bo'lsin: tez chiqish yo'li (akkaunt yo'q bo'lsa darhol qaytish) vaqt farqi orqali sizdiradi. Yechim: ishni asinxron navbatda bajarish yoki ikki holatda ham bir xil mantiq.
- Akkaunt bo'yicha rate limit: aks holda hujumchi qurbonning pochta qutisini minglab xat bilan to'ldiradi.
- Akkauntni qulflamang: tiklash so'rovi bilan akkauntni bloklash hujumchiga ma'lum foydalanuvchini ishdan chiqarish imkonini beradi (cheat sheet shunday ogohlantiradi).
- Havolani `Host` sarlavhasidan qurmang: qattiq yozilgan yoki ishonchli domenlar ro'yxati bilan tekshirilgan manzil ishlating, aks holda hujumchi `Host: evil.test` yuborib, qurbonga o'z domenidagi havolani yuboradi (Host header injection). Reset sahifasida `Referrer-Policy: no-referrer` qo'ying, aks holda token tashqi resurslarga Referer orqali chiqib ketishi mumkin.

### Tiklash bosqichi

Token tekshirilgach, yangi parol parol siyosatiga (43-dars) mos bo'lishi va 42-darsdagidek hash qilinishi kerak. Cheat sheet qo'shimcha: foydalanuvchiga parol almashgani haqida email yuboring (parolni xatga yozmang), tiklangandan keyin avtomatik kirgizmang, mavjud sessiyalarni bekor qilishni taklif qiling yoki avtomatik bekor qiling. Authentication Cheat Sheet ham akkaunt tiklash va parol almashtirishdan keyin qayta autentifikatsiya va tokenlarni yangilashni tavsiya etadi.

### Gumon qilinayotgan buzilishdan keyin tiklash

Cheat sheet alohida qism ajratadi: parol almashtirish hisobni to'liq qaytarmasligi mumkin, chunki hujumchi ochiq sessiyaga ega bo'lishi yoki tiklash ma'lumotlarini va MFA usullarini almashtirib qo'ygan bo'lishi mumkin. Tavsiyalar: yaqinda qo'shilgan yoki o'zgartirilgan tiklash ma'lumotiga yolg'iz tayanmang; almashtirilgan eski tiklash manzillarini avtomatik tiklamang; gumon qilingan authenticator'larni to'xtating; muvaffaqiyatli tiklashdan keyin mavjud sessiyalarni va hali ishlatilmagan reset havolalarini bekor qiling; foydalanuvchiga barcha ro'yxatdan o'tgan kanallar orqali xabar bering.

### Recovery code'lar

NIST saqlangan recovery code'larni quyidagicha tasvirlaydi: ro'yxatdan o'tkazishda beriladi, kamida 64 bit tasodifiy bit generatoridan, hash qilingan holda saqlanadi, ishlatilgach bekor qilinadi va yangisi beriladi; foydalanuvchi ularni oflayn saqlaydi. Kod tekshiruvi throttling'ga bo'ysunadi. MFA yo'qolganda (telefon yo'qolgan) shu kodlar ikkinchi faktor o'rnini bosadi. Bundan tashqari, NIST yangi tiklash manzili qo'shilganda manzilga tasdiqlash kodi yuborilib, to'g'ri kiritilgandan keyingina manzil o'rnatilishini talab qiladi va kamida ikkita tiklash manzili bo'lishiga ruxsat berilishini aytadi. Email out-of-band authenticator sifatida ishlatilmaydi (NIST), lekin tiklash manzili sifatida ishlatilishi mumkin: bu ikkita turli rol.

Tiklash kuchi akkauntning AAL darajasiga bog'liq. NIST AAL2 gacha bo'lgan akkauntni tiklash uchun quyidagilardan birini talab qiladi (SHALL): turli usullardan olingan ikkita recovery code (saqlangan, yuborilgan yoki recovery contact), yoki bitta recovery code va akkauntga bog'langan bir faktorli authenticator, yoki (akkaunt identity-proofing'dan o'tgan bo'lsa) qayta identity proofing. Identity proofing'dan o'tmagan akkaunt uchun qayta proofing imkoni yo'q, tiklash faqat recovery code yoki recovery contact bilan bo'ladi. AAL1 gacha bo'lgan akkauntlar identity-proofing'siz hisoblanadi. Boshqacha aytganda, bitta email havolasi (bitta yuborilgan kod) yuqori AAL akkaunti uchun tiklashga yetmaydi: bu Forgot Password Cheat Sheet'ning "yaqinda o'zgartirilgan tiklash ma'lumotiga yolg'iz tayanmang" qoidasi bilan mos.

Quyidagi kod saqlangan recovery code'ning hayot siklini ko'rsatadi (deterministik namuna: haqiqiy kodlar CSPRNG bilan hosil bo'ladi):

```ts run
async function sha256hex(s: string): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

// O'quv uchun qat'iy kodlar; real tizimda har biri kamida 64 bit CSPRNG qiymati.
const issued = ["K7QF-2M9D-X4HB-T8RW", "P3ZN-6YCA-D5GE-V2JL"];
const stored = new Set<string>();
for (const c of issued) stored.add(await sha256hex(c.replace(/-/g, "")));

async function useCode(input: string): Promise<boolean> {
  const h = await sha256hex(input.replace(/-/g, "").toUpperCase());
  const ok = stored.delete(h); // bir martalik
  return ok;
}

console.log("omborda ochiq kod bor:", [...stored].some((h) => issued.some((c) => h.includes(c))));
console.log("birinchi ishlatish:", await useCode("k7qf-2m9d-x4hb-t8rw"));
console.log("qayta ishlatish:", await useCode("K7QF-2M9D-X4HB-T8RW"));
console.log("noto'g'ri kod:", await useCode("AAAA-BBBB-CCCC-DDDD"));
console.log("qolgan kodlar soni:", stored.size);
```

```text
omborda ochiq kod bor: false
birinchi ishlatish: true
qayta ishlatish: false
noto'g'ri kod: false
qolgan kodlar soni: 1
```

Eslatma: bu kodda recovery code uchun oddiy SHA-256 ishlatilgan, bu o'quv soddalashtirishi. NIST saqlangan recovery code'ni 3.1.1.2 bo'limidagi tasdiqlangan bir tomonlama funksiya bilan hash qilishni talab qiladi, ya'ni parol saqlash qoidalari (tuz va cost factor, 42-dars). Sabab arifmetikada: 64 bitlik kod uzun token (256 bit) kabi offlayn brute force'ga chidamli emas, shuning uchun hash'ning o'zi sekin va tuzli bo'lishi kerak. Reset havolasidagi 256 bitlik token uchun tez hash yetarli degan xulosa faqat shu yuqori entropiyaga tegishli.

### Yuborilgan kod: muddatlar va bildirishnoma

Yuborilgan recovery code'ning amal qilish muddati kanalga qarab farq qiladi (NIST, SHALL): matnli xabar yoki ovoz uchun ko'pi bilan 10 daqiqa, email uchun 24 soat, AQShning qit'a qismidagi pochta manzili uchun 21 kun, undan tashqarisi uchun 30 kun. Forgot Password Cheat Sheet SMS orqali yuboriladigan PIN uchun 6 dan 12 gacha raqamni tavsiya etadi va PIN'dan faqat parol almashtirishga ruxsat beradigan cheklangan sessiya yaratishni aytadi: PIN o'zi to'liq kirish bermaydi.

Bildirishnoma ham talab. NIST subscriber akkauntida kamida ikkita bildirishnoma manzili bo'lishini talab qiladi (SHALL) va bildirishnoma pochta manzilidan tashqari hamma manzillarga yuboriladi. Xabarda aniq yo'riqnoma va bog'lanish ma'lumoti bo'lishi shart, ya'ni foydalanuvchi voqeani rad etsa nima qilishini bilsin: "Bu siz bo'lmasangiz, shu yerga murojaat qiling". Tiklashda faqat yuborilgan kod manziliga yuborilgan xabar yetarli emas: agar akkauntdagi yagona boshqa manzil kod yuborilgan manzilning o'zi bo'lsa, NIST pochta manziliga ham xabar yuborishni talab qiladi.

Yo'qolgan yoki buzilgan authenticator'ni NIST darrov to'xtatish, bekor qilish yoki yo'q qilish kerak deb hisoblaydi (SHALL), chunki NIST fikricha buzilgan authenticator'ni bekor qilmaslikning oqibati odatda uni xato bekor qilishdan og'irroq. Shu bois "telefonim yo'qoldi" tugmasi mavjud bo'lishi kerak va u zaxira authenticator (parol yoki fizik authenticator) bilan ishlashi mumkin.

### Email tasdiqlash va email almashtirish

Email tasdiqlash tiklash va bildirishnoma kanalini ishonchli qiladi. Authentication Cheat Sheet email'ni username sifatida ishlatishga ruxsat beradi, lekin ro'yxatdan o'tishda email tasdiqlanishi sharti bilan. Tasdiqlash tokeni reset token'ning o'zidek talablarga bo'ysunishi (CSPRNG, hash saqlash, muddat, bir martalik) va boshqa maqsadga ishlamasligi kerak (bu muallifning tavsiyasi). Tasdiqlanmagan email'ni tiklash kanali sifatida ishlatmang. Tashqi provayder orqali kirishda (49-dars) `email_verified` ni provayderning da'vosi deb biling, o'zingiz tasdiqlagan email o'rnida emas.

Email almashtirish ham tiklash kabi akkauntni egallash yo'li, shuning uchun Authentication Cheat Sheet aniq jarayon beradi. Foydalanuvchi autentifikatsiyalangan bo'lishi kerak; yangi email avval kutilayotgan o'zgarish sifatida saqlanadi. MFA yoqilgan bo'lsa: MFA bilan identifikatsiya, ikkita vaqt bilan cheklangan nonce, joriy manzilga faqat ogohlantiruvchi xabar (shubhali holatni xabar qilish havolasi bilan) va yangi manzilga tasdiqlash xabari. MFA yo'q bo'lsa: joriy parol so'raladi, uchta nonce yaratiladi va tasdiqlash xabari ham joriy, ham yangi manzilga alohida yuboriladi. Ikkala holatda ham o'zgarish ikkala tomon tasdiqlamaguncha amalga oshmaydi. Cheat sheet help-desk xodimlarini ijtimoiy muhandislikka qarshi o'qitishni ham tavsiya etadi.

## Misol: parolni tiklash oqimi

### Zaif kod

Token ketma-ket raqamdan, mavjud bo'lmagan email alohida xabar bilan, muddatsiz va bir necha marta ishlaydi:

```ts run
const users = new Map([
  ["dispatcher@alfa.example", { id: "u1", password: "eski-parol-1" }],
  ["attacker@evil.test", { id: "u2", password: "hujumchi-paroli" }],
]);
const tokens = new Map<string, string>(); // token -> email
let seq = 1000;
const outbox: Record<string, string> = {};

// ZAIF: ketma-ket token, farqli xabar, muddatsiz, qayta ishlatiladi.
function requestReset(email: string): string {
  if (!users.has(email)) return "Bunday email topilmadi";
  const token = `r-${++seq}`;
  tokens.set(token, email);
  outbox[email] = token; // emailga yuborilgan deb faraz qilinadi
  return "Havola yuborildi";
}
function resetPassword(token: string, newPassword: string): boolean {
  const email = tokens.get(token);
  if (!email) return false;
  users.get(email)!.password = newPassword;
  return true;
}

console.log(requestReset("dispatcher@alfa.example"));
console.log(requestReset("noma'lum@alfa.example"));
console.log("egasi tiklaydi:", resetPassword(outbox["dispatcher@alfa.example"], "yangi-parol-1"));
```

```text
Havola yuborildi
Bunday email topilmadi
egasi tiklaydi: true
```

### Hujum

Hujumchi o'z email'iga tiklash so'rovini yuboradi, o'z tokenini ko'radi (`r-1002`). Qurbon so'rovi undan oldin yuborilgan edi; hujumchi tokenlar ketma-ket ekanini payqab, bittasi pastroqni sinaydi. Bu faqat shu o'quv kodiga qarshi.

```ts run
const users = new Map([
  ["dispatcher@alfa.example", { id: "u1", password: "eski-parol-1" }],
  ["attacker@evil.test", { id: "u2", password: "hujumchi-paroli" }],
]);
const tokens = new Map<string, string>();
let seq = 1000;
const outbox: Record<string, string> = {};
function requestReset(email: string): string {
  if (!users.has(email)) return "Bunday email topilmadi";
  const token = `r-${++seq}`;
  tokens.set(token, email);
  outbox[email] = token;
  return "Havola yuborildi";
}
function resetPassword(token: string, newPassword: string): boolean {
  const email = tokens.get(token);
  if (!email) return false;
  users.get(email)!.password = newPassword;
  return true;
}

console.log("enumeration:", requestReset("kimdir@alfa.example"));
requestReset("dispatcher@alfa.example"); // qurbon so'rovi (hujumchi buni emailida ko'rmaydi)
requestReset("attacker@evil.test");
const mine = outbox["attacker@evil.test"];
console.log("hujumchining token'i:", mine);
const guess = "r-" + (Number(mine.slice(2)) - 1);
console.log("qo'shni token bilan qurbon paroli almashtirildi:", resetPassword(guess, "hujumchi-bilgan"));
console.log("qurbon paroli endi:", users.get("dispatcher@alfa.example")!.password);
```

```text
enumeration: Bunday email topilmadi
hujumchining token'i: r-1002
qo'shni token bilan qurbon paroli almashtirildi: true
qurbon paroli endi: hujumchi-bilgan
```

Hujumchi qurbonning pochta qutisiga kirmay, parolini almashtirdi. Bundan tashqari, formaning javobi qaysi email'lar mavjudligini oshkor qildi.

### Tuzatilgan kod

Token CSPRNG'dan, hash saqlanadi, muddatli va bir martalik, javob bir xil, tiklashdan keyin hamma sessiya bekor qilinadi va foydalanuvchiga xabar yuboriladi, avtomatik kirgizilmaydi.

```ts run
const enc = new TextEncoder();
const hex = (b: Uint8Array) => [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
const sha256hex = async (s: string) => hex(new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(s))));
const MIN = 60_000;
const TTL_MS = 15 * MIN;
const BASE_URL = "https://app.avtopark.example"; // qattiq, Host sarlavhasidan emas

const users = new Map([
  ["dispatcher@alfa.example", { id: "u1", password: "eski-parol-1" }],
  ["attacker@evil.test", { id: "u2", password: "hujumchi-paroli" }],
]);
const resets = new Map<string, { email: string; expiresAt: number }>();
const sessions = new Map<string, string>([["sess-hujumchi-ochiq", "u1"]]); // qurbonning buzilgan sessiyasi
const outbox: { to: string; body: string }[] = [];
const GENERIC = "Agar bu email bazada bo'lsa, tiklash havolasi yuboriladi";

async function requestReset(email: string, now: number): Promise<string> {
  const user = users.get(email);
  if (user) {
    const token = hex(crypto.getRandomValues(new Uint8Array(32)));
    resets.set(await sha256hex(token), { email, expiresAt: now + TTL_MS });
    outbox.push({ to: email, body: `${BASE_URL}/reset?token=${token}` });
  }
  return GENERIC; // ikkala holatda ham bir xil
}

async function resetPassword(token: string, newPassword: string, now: number): Promise<boolean> {
  const key = await sha256hex(token);
  const r = resets.get(key);
  resets.delete(key); // bir martalik
  if (!r || r.expiresAt <= now) return false;
  const user = users.get(r.email)!;
  user.password = newPassword; // real tizimda Argon2id hash (42-dars) va parol siyosati (43-dars)
  for (const [sid, uid] of [...sessions]) if (uid === user.id) sessions.delete(sid); // hamma sessiya bekor
  outbox.push({ to: r.email, body: "Parolingiz almashtirildi. Bu siz bo'lmasangiz, support bilan bog'laning." });
  return true; // avtomatik kirgizilmaydi
}

const now = 1_700_000_000_000;
console.log("mavjud email:", await requestReset("dispatcher@alfa.example", now));
console.log("mavjud bo'lmagan email:", await requestReset("kimdir@alfa.example", now));
const token = outbox[0].body.split("token=")[1];
console.log("havola domeni:", new URL(outbox[0].body).host);
console.log("taxminiy token:", await resetPassword("r-1000", "hujumchi-bilgan", now));
console.log("muddati o'tgach:", await resetPassword(token, "yangi-parol-1", now + 16 * MIN));
await requestReset("dispatcher@alfa.example", now);
const token2 = outbox[outbox.length - 1].body.split("token=")[1];
console.log("egasi tiklaydi:", await resetPassword(token2, "yangi-parol-1", now + MIN));
console.log("qayta ishlatish:", await resetPassword(token2, "boshqa", now + 2 * MIN));
console.log("eski sessiyalar qoldi:", sessions.size);
console.log("xabarnoma yuborildi:", outbox[outbox.length - 1].body.startsWith("Parolingiz"));
```

```text
mavjud email: Agar bu email bazada bo'lsa, tiklash havolasi yuboriladi
mavjud bo'lmagan email: Agar bu email bazada bo'lsa, tiklash havolasi yuboriladi
havola domeni: app.avtopark.example
taxminiy token: false
muddati o'tgach: false
egasi tiklaydi: true
qayta ishlatish: false
eski sessiyalar qoldi: 0
xabarnoma yuborildi: true
```

Nima uchun yetarli: token 256 bit tasodifiy, taxmin qilish mumkin emas; bazada faqat hash bor; muddat va bir martalik foydalanish oynani yopadi; javob bir xil, shuning uchun email ro'yxati sizmaydi; hujumchining ochiq sessiyasi tiklash bilan tugaydi. Yopilmagan: hujumchi qurbonning pochta qutisiga kirgan bo'lsa, u tiklashni to'liq bajara oladi (email xavfsizligi tashqi risk; MFA'ni tiklashdan keyin ham talab qilish bu xavfni kamaytiradi, bu muallifning tavsiyasi); bu kodda javob vaqtining tengligi, akkaunt bo'yicha rate limit, parol siyosati va qayta autentifikatsiya yo'q; navbatga yuborilgan xat kechikishi vaqt farqini yopish usullaridan biri.

## Qachon qo'llamaslik kerak

Hamma tizimga bir xil tiklash yo'li to'g'ri kelmaydi. Admin va ko'p huquqli akkauntlarda faqat email havolasi yetarli emas: qo'shimcha dalil (saqlangan recovery code, ikkinchi qurilma, support orqali identifikatsiya) talab qiling. Aksincha, past xavfli iste'molchi servislarda juda og'ir tiklash (qo'ng'iroq, hujjat) foydalanuvchini yo'qotadi; NIST ham usullarni risk tahlili asosida tanlanishi va hujjatlashtirilishini aytadi. Maxfiy savollar tiklashning yagona mexanizmi bo'lmasin: cheat sheet ularning javoblari ko'pincha taxmin qilinishi yoki topilishini ta'kidlaydi, ular faqat boshqa usullarga qo'shimcha qatlam bo'lishi mumkin. Support xodimi orqali tiklash ijtimoiy muhandislik nuqtasi: xodimda "foydalanuvchining parolini almashtirish" tugmasi bo'lsa, u hujumchi uchun maqsad bo'ladi; bu amalni audit log (79-dars) va ikkinchi xodim tasdig'i bilan himoyalang. Va nihoyat, SMS orqali tiklash NIST'da cheklangan kanalga bog'liq (44-dars): ishlatsangiz, risk qabul qilinganini hujjatlashtiring.

## Stack'da: NestJS, PostgreSQL va Redis

NestJS'da tiklash alohida `RecoveryModule`: `POST /auth/forgot` har doim 202 qaytaradi va ishni navbatga (BullMQ) qo'yadi, shu bilan javob vaqti tenglashadi. PostgreSQL'da `password_resets(token_hash bytea primary key, user_id, expires_at, created_at)` jadvali va `DELETE FROM password_resets WHERE token_hash = $1 RETURNING user_id, expires_at` bilan atomik ishlatish: parallel ikki so'rov bir token'ni ishlata olmaydi (60-dars). Akkaunt bo'yicha rate limit uchun Redis hisoblagich (43-dars). Bitta foydalanuvchi uchun faol token soni cheklansin: yangi so'rov eskisini bekor qilsin. Tiklashdan so'ng `SessionService.revokeUser(userId)` (46-dars) va bildirishnoma. Email havolasidagi bazaviy domen konfiguratsiyadan. Next.js'da reset sahifasi `Referrer-Policy: no-referrer` bilan javob bersin va token URL'dan o'qilgach, formani POST bilan yuborib, URL'dan olib tashlansin (history.replaceState); token'ni analitika skriptlari ko'rmasin (40-dars). Email tasdiqlash uchun ham xuddi shu token mexanikasi, lekin boshqa maqsadli (`purpose=verify-email`) va boshqa jadval: bir maqsad uchun chiqarilgan token boshqasida ishlamasin (47-dars).

## Xulosa

- Tiklash yo'li ham authenticator yaratadi: u eng zaif bo'g'in bo'lib, MFA va passkey'ni chetlab o'tishi mumkin.
- So'rov bosqichida bir xil xabar va bir xil javob vaqti, akkaunt bo'yicha rate limit; akkauntni qulflamang.
- Token CSPRNG'dan, kamida 128-256 bit, bazada faqat hash, muddatli (qisqa) va bir martalik.
- Havolani qattiq manzildan quring, `Host` sarlavhasidan emas; reset sahifasida `no-referrer`.
- Muvaffaqiyatli tiklashdan keyin: hamma sessiya va ochiq reset havolalarini bekor qiling, foydalanuvchiga xabar yuboring, avtomatik kirgizmang.
- Recovery code: kamida 64 bit, hash saqlanadi, bir martalik; yangi tiklash manzili tasdiqlash kodi bilan tasdiqlanadi.
