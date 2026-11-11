---
n: 60
slug: race-condition-toctou
title: "Race condition va TOCTOU"
summary: "Tekshirish va harakat orasidagi oraliq: ikki parallel so'rov ikkalasi ham eski qiymatni ko'rishi, balans va kuponlarning ikki marta sarflanishi, atomik shartli yangilash, qator qulfi, unique constraint, serializable tranzaksiya va idempotency kaliti bilan yopish."
duration: 50
sources:
  - id: cs-business-logic
    note: "Business Logic Security Cheat Sheet: check-then-act naqshi, SERIALIZABLE, SELECT ... FOR UPDATE, shartli UPDATE va ta'sirlangan qatorlar soni, unique constraint, idempotency kaliti, 'yetarlicha tez' degan taxminga ishonmaslik, pattern reference jadvali"
  - id: t10-a06
    note: "A06:2025 Insecure Design: tegishli CWE ro'yxatida CWE-362 (Concurrent Execution using Shared Resource with Improper Synchronization, 'Race Condition')"
  - id: asvs
    note: "ASVS 5.0 V2: 2.3.3 (biznes darajasidagi tranzaksiyalar: operatsiya to'liq bajariladi yoki oldingi holatga qaytariladi), 2.3.4 (cheklangan resurslar ikki marta bron qilinmasligi uchun qulflash)"
  - id: wstg
    note: "WSTG Business Logic Testing: WSTG-BUSL-05 (funksiyani necha marta ishlatish chegarasi) va WSTG-BUSL-04 (process timing)"
  - id: pg-mvcc
    note: "PostgreSQL hujjati (Transaction Isolation): Read Committed sukut bo'yicha izolyatsiya darajasi; FOR UPDATE/SHARE'siz SELECT so'rov boshlanishidagi snapshot'ni ko'radi; murakkab qidiruv shartlari uchun mos emasligi"
  - id: pg-rls
    note: "PostgreSQL Row Security Policies (56-dars): policy ichidagi sub-SELECT poyga holatiga duchor bo'lishi mumkinligi haqidagi eslatma (faqat 56-darsdagi o'qishga havola; bu darsda qayta tekshirilmagan)"
quiz:
  - q: "Kod `if (balance >= amount) { balance -= amount; }` ketma-ket yozilgan, lekin balans bazadan o'qiladi va keyin yoziladi. Ikki parallel so'rov nima uchun ikkalasi ham o'tishi mumkin?"
    options:
      - "Chunki JavaScript ko'p oqimli"
      - "Chunki balans manfiy bo'lishi mumkin emas"
      - "Chunki ikkalasi ham tekshiruv payti eski balansni o'qiydi, yozish esa keyin bo'ladi; tekshirish va yangilash orasida oraliq bor"
      - "Chunki baza xato qiladi"
    answer: 2
    explain: "Cheat sheet: o'qib, qaror qilib, yozadigan har operatsiya poyga ehtimoliga ega. Ikkala so'rov eski qiymatni o'qiydi, bir xil qaror qiladi va ikkalasi yozadi."
  - q: "Quyidagilardan qaysi biri cheat sheet'dagi 'conditional update' naqshiga mos?"
    options:
      - "`UPDATE accounts SET balance = balance - 80 WHERE id = $1 AND balance >= 80` va ta'sirlangan qatorlar sonini tekshirish"
      - "`SELECT balance` keyin ilovada hisoblash"
      - "Dasturda `sleep(100)` qo'yish"
      - "Klientda tugmani bir marta bosishga ruxsat berish"
    answer: 0
    explain: "Shart yozish paytida ham tekshiriladi, ta'sirlangan qatorlar soni nolga teng bo'lsa tekshiruv muvaffaqiyatsiz bo'lgan va chaqiruvchi xato oladi."
  - q: "Hujumchi bitta HTTP/2 ulanishida bir necha so'rovni deyarli bir vaqtda yuboradi. Dasturchi 'oraliq mikrosekund, hech kim ekspluatatsiya qila olmaydi' deydi. Cheat sheet nima deydi?"
    options:
      - "Oraliq juda qisqa bo'lsa xavfsiz"
      - "Faqat bulutda muammo"
      - "Faqat bitta serverli muhitda muammo"
      - "Oraliq mavjud bo'lsa, ekspluatatsiya qilish mumkin deb hisoblang; zamonaviy vositalar bitta multiplekslangan HTTP/2 so'rovda ko'plab so'rovni deyarli bir vaqtda yetkazadi"
    answer: 3
    explain: "Cheat sheet 'Don't Assume Fast Enough' bo'limida shuni aytadi: parallel so'rov vositalari bir necha so'rovni millisekund ichida jo'natadi, oraliq bo'lsa uni ekspluatatsiya qilish mumkin deb faraz qiling."
  - q: "'Har foydalanuvchiga bir martalik bonus' qoidasi ilovada `if (!hasBonus(user)) giveBonus(user)` bilan yozilgan. Cheat sheet'ning pattern reference jadvali nimani tavsiya qiladi?"
    options:
      - "Ilovada ikki marta tekshirish"
      - "(user_id, bonus_type) bo'yicha unique constraint va dublikatni bazaga rad ettirish"
      - "Bonus tugmasini yashirish"
      - "Log yozish"
    answer: 1
    explain: "Cheat sheet jadvali: 'One-per-user bonus' uchun unique constraint va dublikatlarni baza rad etishi. Qoida ma'lumotlar qatlamida kodlanadi, shuning uchun poyga uni buza olmaydi."
  - q: "Pul o'tkazmasi: ikkita hisobning balansi birgalikda o'zgaradi. Cheat sheet'ning 'cross-row consistency' uchun tavsiyasi qaysi?"
    options:
      - "Har qator uchun alohida so'rov va umid"
      - "Faqat klientda tekshirish"
      - "Serializable tranzaksiya, qayta urinish mantig'i bilan"
      - "Cron job bilan tuzatish"
    answer: 2
    explain: "Jadvalda cross-row consistency uchun explicit retry mantig'i bilan serializable tranzaksiya ko'rsatilgan: baza konfliktni topib, raqobatlashayotgan tranzaksiyalardan birini bekor qiladi."
  - q: "Tashqi to'lov provayderiga so'rov yuborgan tarmoq uzilib, javob kelmadi, ilova qayta urindi va ikki marta pul yechildi. Cheat sheet qaysi chorani ko'rsatadi?"
    options:
      - "Provayderning idempotency mexanizmidan foydalanish va bir xil operatsiya qayta urinishida bir xil kalitni ishlatish"
      - "Qayta urinishni umuman o'chirish"
      - "Lokal tranzaksiyaning o'zi tashqi amalni atomik qiladi"
      - "Tasodifiy yangi kalit har urinishda"
    answer: 0
    explain: "Cheat sheet: tashqi amallar uchun provayderning idempotency mexanizmi va bir operatsiyaning qayta urinishida bir xil kalit. Lokal tranzaksiyaning o'zi tashqi yon ta'sirni saqlash bilan atomik qila olmaydi."
task:
  title: "Kuponni atomik talab qilish"
  prompt: |
    `redeem(user)` kuponni har foydalanuvchiga bir marta beradi. Hozir u tekshiradi, `await` bilan kutadi (baza kechikishi), keyin yozadi. Bir foydalanuvchi uchta so'rovni parallel yuboradi.

    Tuzating:

    1. Tekshirish va belgilashni oralig'siz bajaring (`await` ularning orasida bo'lmasin): kalitni `claimed` to'plamiga oldin qo'shing.
    2. Faqat birinchi chaqiruv `ok`, qolganlari `rad` qaytarsin.
    3. Kupon sarflanishi (`credits`) bir marta oshsin.
    4. Imzoni o'zgartirmang. Kutilgan natija: `ok,rad,rad` va `credits=10`.
  lang: ts
  starter: |
    const claimed = new Set<string>();
    let credits = 0;
    const tick = () => new Promise<void>((r) => setTimeout(r, 1));

    async function redeem(user: string): Promise<string> {
      if (claimed.has(user)) return "rad";
      await tick(); // baza yozuvi kechikishi
      claimed.add(user);
      credits += 10;
      return "ok";
    }

    (async () => {
      const res = await Promise.all([redeem("u1"), redeem("u1"), redeem("u1")]);
      console.log(res.join(","));
      console.log(`credits=${credits}`);
    })();
  solution: |
    const claimed = new Set<string>();
    let credits = 0;
    const tick = () => new Promise<void>((r) => setTimeout(r, 1));

    async function redeem(user: string): Promise<string> {
      if (claimed.has(user)) return "rad";
      claimed.add(user); // tekshirish va belgilash orasida await yo'q
      await tick(); // baza yozuvi kechikishi
      credits += 10;
      return "ok";
    }

    (async () => {
      const res = await Promise.all([redeem("u1"), redeem("u1"), redeem("u1")]);
      console.log(res.join(","));
      console.log(`credits=${credits}`);
    })();
  solutionNotes: |
    - Bitta synchronous bo'lakda (`await`siz) `has` va `add` ketma-ket bajariladi, shuning uchun event loop ular orasida boshqa so'rovni o'tkazmaydi. Bu "atomik tekshirish va belgilash".
    - Haqiqiy tizimda bu `INSERT ... ` ning unique constraint'i yoki `UPDATE ... WHERE` bilan bajariladi: baza o'zi atomik.
    - Agar yozish keyin xatolikka uchrasa, belgini qaytarish (rollback) kerak; aks holda foydalanuvchi kuponsiz qoladi. Bazada buni tranzaksiya hal qiladi (ASVS 2.3.3).
    - Xotiradagi Set faqat bitta jarayonda ishlaydi. Bir nechta instansiya bo'lsa, atomiklik baza yoki umumiy store'da (masalan unique constraint) ta'minlanadi.
  checklist:
    - "Tekshirish va belgilash orasida await yo'q"
    - "Faqat birinchi chaqiruv `ok`"
    - "Sarflash bir marta bajariladi"
    - "Ko'p instansiya uchun atomiklik bazada kerakligi tushunilgan"
---

## Muammo

59-darsda bir turdagi zaiflik ko'rindi: server qoidani to'g'ri yozadi, lekin qoidaning bir parametrini mijozga ishonib topshiradi. Bu darsdagi zaiflik boshqacha: qoida to'liq to'g'ri, kod ham mantiqan to'g'ri, lekin ikki so'rov bir vaqtda ishlaganda qoida buziladi.

Business Logic Security Cheat Sheet muammoni bir jumlada beradi: qiymatni o'qib, qaror qilib, yangi qiymat yozadigan har operatsiya poyga holatiga duchor bo'lishi mumkin. Agar ikki so'rov bir vaqtda ishlasa, ikkalasi eski qiymatni o'qiydi, bir xil qaror qiladi va ikkalasi yozadi. Natijada loyalty ballari sarflanib ketadi, balans manfiy bo'ladi, bir martalik kupon ko'p marta ishlatiladi, "har akkauntga bitta" bonus esa "har akkauntga ko'p" bo'ladi.

Cheat sheet "tekshir, keyin harakat qil" shakliga ega operatsiyalarni sanaydi: balansni tekshirib, yechish; kupon ishlatilmaganini tekshirib, ishlatilganini yozish; foydalanuvchida N tadan kam element borligini tekshirib, qo'shish; slot bo'shligini tekshirib, bron qilish; referral kodining shu akkauntga qo'llanmaganini tekshirib, qo'llash; ro'yxatdan o'tish so'rovining noyobligini tekshirib, foydalanuvchini kiritish. Har biri tekshirish va harakat bitta atomik operatsiyaga birlashtirilmasa, poyga holati kutib turibdi. Dasturlash adabiyotida bu nom bilan ham yuradi: time-of-check to time-of-use, TOCTOU (bu atama cheat sheet matnida ishlatilmaydi, men uni shu naqshning umumiy nomi sifatida beraman). OWASP Top 10 A06 tegishli zaiflik turi sifatida CWE-362 ni (Concurrent Execution using Shared Resource with Improper Synchronization, "Race Condition") ro'yxatlaydi.

Avtopark misolida: haydovchining yoqilg'i kartasida 100 birlik limit bor. Ikkita pompa terminali bir vaqtda 80 birlik so'raydi. Agar ikkalasi ham "limit 100, 80 ruxsat" deb o'ylasa, 160 birlik beriladi.

## Asosiy g'oya

Tekshirish bilan harakat orasida boshqa so'rov kirishi mumkin bo'lgan oraliq bor. Yechim shu oraliqni yo'qotish: tekshirish va harakatni bitta bo'linmas operatsiyaga birlashtirish va buni qaror chiqaradigan joyda, ya'ni ma'lumotlar bazasida (yoki umumiy qulfda) ta'minlash. Cheat sheet uch vositani beradi:

1. **Shartli yangilash.** Shart yozish paytida tekshiriladi.
2. **Qator qulfi.** Ikkinchi chaqiruvchi birinchisi tugaguncha kutadi.
3. **Serializable tranzaksiya.** Baza konfliktni topadi va tranzaksiyalardan birini bekor qiladi.

Va ikkita yordamchi: yaxlitlikni ta'minlovchi cheklov (unique constraint) hamda tashqi yon ta'sirlar uchun idempotency kaliti.

Eng muhim ogohlantirish: "oraliq juda kichik" degan dalil ishlamaydi.

## Chuqurroq: poyga qanday ishlaydi

### Read Committed va ketma-ket so'rovlar

PostgreSQL hujjatiga ko'ra Read Committed sukut bo'yicha izolyatsiya darajasi. Bu darajada `FOR UPDATE/SHARE`siz `SELECT` faqat so'rov boshlanishidan oldin commit qilingan ma'lumotni ko'radi (so'rov boshlangan paytdagi snapshot), ya'ni parallel tranzaksiyaning o'sha so'rov davomida commit qilgan o'zgarishlarini ko'rmaydi. Natija: ikki tranzaksiya bir vaqtda `SELECT balance` qiladi, ikkalasi 100 ni ko'radi, ikkalasi `UPDATE ... SET balance = 20` yozadi. Hujjat shuningdek, Read Committed rejimida yangilovchi buyruq parallel yangilanishlarni ayni qatorlarda ko'rishi, lekin boshqa qatorlardagi ta'sirni ko'rmasligini va shu sababli murakkab qidiruv shartli buyruqlar uchun mos emasligini yozadi. Cheat sheet ham buni ta'kidlaydi: ko'pchilik bazalarning sukut bo'yicha darajasida tekshirish va yangilash alohida ishlaydi va ular orasiga boshqa tranzaksiya kirishi mumkin.

Muhim xulosa: "men tranzaksiya ishlatdim" o'z-o'zidan yetarli emas. Tranzaksiya ichida `SELECT` keyin ilovada hisoblash keyin `UPDATE` hamon poygaga ochiq, agar izolyatsiya darajasi va qulf mos tanlanmagan bo'lsa.

### Ilova darajasidagi poyga: await oralig'i

Node.js bitta oqimda ishlaydi, lekin har `await` boshqa so'rovga navbat beradi. Shuning uchun `if (!used.has(k)) { await db.save(k); used.add(k); }` kodida tekshiruv va belgilash orasida `await` bor: ikki so'rov ikkalasi ham `has` ni `false` ko'radi. Pastdagi `ts run` modeli aynan shuni ko'rsatadi. Bu ilova xotirasida ham, ko'p instansiyali tizimda ham bir xil: ko'p instansiyada Node.js'ning o'zi ham yordam bermaydi, atomiklik umumiy store (baza) darajasida bo'lishi kerak.

### "Yetarlicha tez" yo'q

Cheat sheet alohida bo'lim bag'ishlaydi: ko'pchilik "tekshiruv va yangilash orasidagi oraliq mikrosekundlar, hech kim ekspluatatsiya qila olmaydi" deb o'ylaydi. Cheat sheet: parallel so'rov vositalari o'nlab so'rovni bir millisekund ichida jo'natadi, zamonaviy bug bounty vositalari ularni bitta multiplekslangan HTTP/2 so'rovda jo'natadi va ular serverga deyarli bir vaqtda yetib keladi. Oraliq umuman mavjud bo'lsa, uni ekspluatatsiya qilish mumkin deb hisoblash kerak.

### Himoya vositalari

Cheat sheet pattern reference jadvali:

- **Bitta qatorni o'qish-o'zgartirish-yozish:** tranzaksiya ichida `SELECT ... FOR UPDATE`, keyin `UPDATE`. Ikkinchi chaqiruvchi birinchisi commit qilgunicha bloklanadi.
- **Hisoblagichni shartli kamaytirish:** `UPDATE ... SET value = value - 1 WHERE value > 0` va ta'sirlangan qatorlar sonini tekshirish. Nolga teng bo'lsa tekshiruv muvaffaqiyatsiz.
- **Har foydalanuvchiga bir martalik bonus:** (user_id, bonus_type) bo'yicha unique constraint, dublikatni baza rad etadi.
- **Tashqi idempotent bo'lmagan chaqiruv:** provayder qo'llab-quvvatlaydigan idempotency, qayta urinishlar va tiklash uchun doimiy holat bilan.
- **Qatorlararo izchillik:** serializable tranzaksiya, aniq retry mantig'i bilan.

Ikkita ASVS talabi shu vositalarga tayanadi. 2.3.3: tranzaksiyalar biznes mantiq darajasida ishlatilishi kerak, shunda operatsiya to'liq muvaffaq bo'ladi yoki oldingi to'g'ri holatga qaytariladi. 2.3.4: cheklangan resurslar (teatr o'rinlari, yetkazib berish slotlari) ikki marta bron qilinmasligi uchun biznes mantiq darajasida qulflash mexanizmlari ishlatilishi kerak.

### Idempotency

Tashqi amallar (kartadan yechish) uchun cheat sheet provayderning idempotency mexanizmini va bir operatsiyaning qayta urinishida bir xil kalitni ishlatishni aytadi. O'z API'ngiz uchun: saqlangan kalitlarni autentifikatsiya qilingan chaqiruvchi va operatsiya bilan chegaralang, ularni asl so'rov parametrlariga bog'lang va boshqa parametrlar bilan qayta ishlatishni rad eting; keshlangan natijani qaytarishdan oldin so'rovni avtorizatsiya qiling (kalitga egalik ruxsat emas); parallel so'rovlarni atomik muvofiqlashtiring, shunda amalni faqat bittasi boshlaydi. Lokal bazadagi tranzaksiyaning o'zi tashqi yon ta'sirni natijani saqlash bilan atomik qila olmaydi.

### Process timing bilan aloqasi

WSTG-BUSL-04 vaqtga bog'liq jarayonlarni ko'rsatadi: slot bron qilinib, to'lovsiz ushlab turilsa, o'rinlar tugab qoladi. Remediation: tranzaksiyalar belgilangan vaqtdan keyin bekor qilinadi yoki qayta o'rnatiladi. Bu poyga emas, lekin xuddi shu oila: vaqt oralig'i tizim xatti-harakatiga ta'sir qiladi.

## Misol: yoqilg'i kartasi limiti

### 1. Zaif kod

Model: DB kechikishi `await` bilan ifodalangan. Tekshirish va yozish alohida.

```ts run
const db = { balance: 100 };
const tick = () => new Promise<void>((r) => setTimeout(r, 1));

// ZAIF: o'qish -> qaror -> (kechikish) -> yozish
async function authorizeWeak(amount: number): Promise<string> {
  const current = db.balance; // o'qish
  if (current < amount) return "rad";
  await tick(); // boshqa so'rovlar shu paytda o'qiydi
  db.balance = current - amount; // eski qiymatdan yozish
  return "ok";
}

(async () => {
  console.log("bitta so'rov:", await authorizeWeak(80), "balans:", db.balance);
})();
```

```text
bitta so'rov: ok balans: 20
```

### 2. Hujum

Ikki terminal bir vaqtda 80 birlik so'raydi (modelda `Promise.all`):

```ts run
const db = { balance: 100 };
const tick = () => new Promise<void>((r) => setTimeout(r, 1));
async function authorizeWeak(amount: number): Promise<string> {
  const current = db.balance;
  if (current < amount) return "rad";
  await tick();
  db.balance = current - amount;
  return "ok";
}

(async () => {
  const res = await Promise.all([authorizeWeak(80), authorizeWeak(80)]);
  console.log("natijalar:", res.join(","));
  console.log("balans:", db.balance, "beriladi:", 80 * res.filter((r) => r === "ok").length);
})();
```

```text
natijalar: ok,ok
balans: 20 beriladi: 160
```

Ikkala so'rov ham `ok` oldi: 160 birlik berildi, balans esa 20 ko'rinadi (100 - 80). Yo'qotilgan yangilanish ham xatoni yashiradi: hisob qaydlari buzilgan. Hujum faqat shu model kodiga qarshi.

### 3. Tuzatilgan kod

Tekshirish va yozish orasidagi `await` olib tashlanadi: tekshirish va kamaytirish bitta bo'linmas qadam. Bu `UPDATE ... WHERE balance >= amount` va ta'sirlangan qatorlar sonini tekshirishning modeli:

```ts run
const db = { balance: 100 };
const tick = () => new Promise<void>((r) => setTimeout(r, 1));

// Atomik shartli yangilash: ichida await yo'q
function conditionalDebit(amount: number): number {
  if (db.balance >= amount) {
    db.balance -= amount;
    return 1; // ta'sirlangan qatorlar soni
  }
  return 0;
}

async function authorize(amount: number): Promise<string> {
  const affected = conditionalDebit(amount); // tekshirish + yozish birga
  await tick(); // keyingi ish (log, tashqi chaqiruv) bo'lishi mumkin
  return affected === 1 ? "ok" : "rad";
}

(async () => {
  const res = await Promise.all([authorize(80), authorize(80), authorize(80)]);
  console.log("natijalar:", res.join(","));
  console.log("balans:", db.balance);
  console.log("keyingi 20:", await authorize(20), "balans:", db.balance);
})();
```

```text
natijalar: ok,rad,rad
balans: 20
keyingi 20: ok balans: 0
```

### Tuzatish nima uchun yetarli

Endi faqat birinchi so'rov balansni kamaytiradi, qolganlari shart bajarilmagani uchun `0` qator o'zgarishini ko'radi va rad etiladi. Balans hech qachon manfiy bo'lmaydi, va hisob qaydlari to'g'ri qoladi. Model JavaScript'ning bir oqimli xususiyatiga tayanadi (`await`siz bo'lak bo'linmaydi); haqiqiy tizimda xuddi shu kafolatni baza beradi, ya'ni bitta `UPDATE ... WHERE` buyrug'i atomik. Qoldiq risklar: bir nechta jadvalga tegadigan operatsiyalar bitta shartli yangilashga sig'maydi, ularga tranzaksiya va qulf yoki serializable darajasi kerak (retry mantig'i bilan); tashqi chaqiruv (karta tizimi) lokal tranzaksiyaning bir qismi emas va idempotency bilan alohida yopiladi; va bu tuzatish nafaqat balansga, balki kupon, slot, bonus kabi har "tekshir, keyin harakat qil" nuqtasiga alohida qo'llanadi.

## Qachon qo'llamaslik kerak

- Har yerda `SERIALIZABLE` ishlatish kerak emas. Cheat sheet uni qatorlararo izchillik uchun ko'rsatadi, lekin u konfliktlarda tranzaksiyani bekor qiladi va retry mantig'ini talab qiladi. Bitta qator uchun shartli yangilash yoki unique constraint oddiyroq va tezroq.
- `FOR UPDATE` qulfi uzoq tranzaksiyalarda boshqa so'rovlarni bloklaydi. Qulfni qisqa ushlang, qulf ichida tashqi tarmoq chaqiruvini bajarmang.
- Hamma o'qish-o'zgartirish-yozish naqshi xavfli emas: faqat bitta so'rovchi yozadigan (masalan faqat foydalanuvchining o'z sozlamalari, bir vaqtda bitta sessiya) ma'lumotda poyga amaliy xavf tug'dirmasligi mumkin. Lekin "bitta sessiya" faraz, kafolat emas (ikki tab, ikki qurilma, cheat sheet misoli), shuning uchun pul, zaxira va bir martalik huquqlarga bu farazni qo'llamang.
- Idempotency kaliti har so'rovga kerak emas: tabiatan idempotent amallar (`PUT` bilan holatni belgilash) uchun u ortiqcha. Kalit pul yechish, buyurtma yaratish kabi takrorlanishi zarar keltiradigan amallar uchun.
- Xotiradagi `Set` yoki mutex bitta jarayonda yordam beradi, lekin ko'p instansiyali tizimda yetmaydi. Umumiy kafolat baza yoki umumiy store'dan keladi.

## Stack'da: PostgreSQL, Kysely va NestJS

Quyidagi kodlar ishga tushirilmaydi (PostgreSQL serveri va NestJS muhiti yo'q). Birinchisi, bitta SQL buyrug'i bilan shartli yangilash va bir martalik bonus uchun unique constraint:

```ts
import { Kysely, sql } from "kysely";

declare const db: Kysely<any>;

// Shartli yangilash: ta'sirlangan qatorlar soni muvaffaqiyatni bildiradi
export async function authorizeFuel(cardId: string, tenantId: string, amount: number) {
  const res = await db
    .updateTable("fuel_card")
    .set({ balance: sql`balance - ${amount}` })
    .where("id", "=", cardId)
    .where("tenant_id", "=", tenantId)
    .where("balance", ">=", amount) // shart yozish payti ham tekshiriladi
    .executeTakeFirst();
  if (Number(res.numUpdatedRows) === 0) throw new Error("limit yetarli emas yoki karta topilmadi");
}

// Bir martalik bonus: unique (user_id, bonus_type) indeksi, dublikatni baza rad etadi
export async function grantBonus(userId: string, type: string) {
  const res = await db
    .insertInto("bonus_grant")
    .values({ user_id: userId, bonus_type: type })
    .onConflict((oc) => oc.columns(["user_id", "bonus_type"]).doNothing())
    .executeTakeFirst();
  return Number(res.numInsertedOrUpdatedRows) === 1; // false: allaqachon berilgan
}
```

Kysely'ning `numUpdatedRows` va `onConflict` imzolari versiyaga bog'liq bo'lishi mumkin, o'z versiyangiz hujjatida tekshiring.

Qatorlararo izchillik kerak bo'lsa, serializable tranzaksiya va qayta urinish:

```ts
import { Kysely } from "kysely";
declare const db: Kysely<any>;

export async function transfer(from: string, to: string, amount: number) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await db.transaction().setIsolationLevel("serializable").execute(async (trx) => {
        const r = await trx
          .updateTable("fuel_card")
          .set((eb) => ({ balance: eb("balance", "-", amount) }))
          .where("id", "=", from)
          .where("balance", ">=", amount)
          .executeTakeFirst();
        if (Number(r.numUpdatedRows) === 0) throw new Error("limit yetarli emas");
        await trx
          .updateTable("fuel_card")
          .set((eb) => ({ balance: eb("balance", "+", amount) }))
          .where("id", "=", to)
          .execute();
      });
      return;
    } catch (e: any) {
      if (e?.code !== "40001") throw e; // serialization failure: qayta urinish
    }
  }
  throw new Error("konflikt: qayta urinishlar tugadi");
}
```

`40001` PostgreSQL'da serializatsiya xatosining SQLSTATE kodi; hujjat uni serialization failure sifatida keltiradi. NestJS'da bu funksiyalar servis qatlamida chaqiriladi (58-dars), controller esa faqat natijani HTTP javobiga aylantiradi.

56-darsda aytilganidek, RLS policy ichidagi sub-SELECT ham poyga holatiga duchor bo'lishi mumkin. Bu masalani bu darsda manbadan qayta tekshirmadim; policy yozayotganda PostgreSQL hujjatidagi tegishli ogohlantirishni o'zingiz o'qing.

## Xulosa

- Poyga holati "tekshir, keyin harakat qil" shakldagi har operatsiyada paydo bo'ladi: ikki parallel so'rov ikkalasi ham eski qiymatni ko'radi va ikkalasi yozadi.
- PostgreSQL'ning sukut bo'yicha Read Committed darajasida `FOR UPDATE`siz `SELECT` snapshot ko'radi: faqat tranzaksiyaga o'rash yetarli emas.
- Atomiklik ma'lumotlar bazasida ta'minlanadi: shartli `UPDATE ... WHERE` va ta'sirlangan qatorlar soni, `SELECT ... FOR UPDATE`, unique constraint, kerak bo'lsa serializable tranzaksiya (retry bilan). ASVS 2.3.3 va 2.3.4 shuni talab qiladi.
- "Oraliq juda qisqa" degan dalilga ishonmang: bitta multiplekslangan HTTP/2 so'rov bilan ko'p so'rov deyarli bir vaqtda yetadi.
- Tashqi yon ta'sirlar uchun idempotency kalitidan foydalaning va lokal tranzaksiya tashqi amalni atomik qilmasligini unutmang.
