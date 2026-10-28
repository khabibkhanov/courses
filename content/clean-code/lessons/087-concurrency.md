---
n: 87
slug: concurrency
title: "JS'da toza concurrency: race, idempotentlik"
summary: "Node.js bitta thread'da ishlaydi, lekin har bir await boshqa so'rovlarga navbat beradi. Shuning uchun check-then-act xatolari, yo'qolgan yangilanishlar va takroriy to'lovlar JS'da ham real. Bu darsda race condition'larni topish, ularni atomik operatsiyalar bilan yo'qotish, idempotency key va bekor qilishni toza yozishni ko'ramiz."
duration: 40
sources:
  - id: cc1
    note: "Concurrency bobi: concurrency haqidagi afsonalar, himoya tamoyillari (concurrency kodini alohida saqlash, umumiy ma'lumot doirasini cheklash, nusxalardan foydalanish) va testlash maslahatlari"
  - id: cc2
    note: "Ikkinchi nashrdagi concurrency mavzusi (umumiy havola)"
  - id: mdn-abortcontroller
    note: "AbortController: signal xususiyati va abort() metodi; AbortSignal.timeout va AbortSignal.any MDN'ning AbortSignal sahifasida"
quiz:
  - q: "Node.js bitta thread'da ishlaydi. Quyidagi kodda race condition bo'lishi mumkinmi? `const v = await repo.find(id); if (v.status === \"available\") { await repo.update(id, { status: \"reserved\" }); }`"
    options:
      - "Yo'q, chunki JavaScript bitta thread'da ishlaydi"
      - "Faqat worker_threads ishlatilsa"
      - "Ha: birinchi await'dan keyin event loop boshqa so'rovni ishlatadi, ikkala so'rov ham `available`ni ko'rib, ikkalasi ham rezerv qilishi mumkin"
      - "Faqat bitta so'rov bir vaqtda kelsa"
    answer: 2
    explain: "Bitta thread sinxron kod bo'laklarining atomikligini kafolatlaydi, lekin await nuqtalari orasida emas. Check va act orasidagi har bir await - interleaving nuqtasi. Bundan tashqari, production'da odatda bir nechta process bor."
  - q: "Ikki instance'li NestJS ilovasida mashinani faqat bir marta rezerv qilishni kafolatlashning eng ishonchli yo'li qaysi?"
    options:
      - "Process ichidagi mutex (`Map<string, Promise>`)"
      - "Bazada atomik shartli yangilash: `UPDATE vehicles SET status='reserved' WHERE id=$1 AND status='available'` va o'zgargan qatorlar sonini tekshirish"
      - "`setTimeout` bilan kechiktirish"
      - "Frontend'da tugmani o'chirish"
    answer: 1
    explain: "Process ichidagi lock faqat o'sha process uchun ishlaydi. Shartli UPDATE tekshirish va o'zgartirishni bitta atomik operatsiyaga birlashtiradi va bazaning o'zi uni ketma-ketlashtiradi."
  - q: "Mijoz to'lov so'rovini yubordi, tarmoq uzildi va klient bir xil `Idempotency-Key` bilan qayta yubordi. Birinchi so'rov hali tugamagan. Server nima qilishi kerak?"
    options:
      - "Ikkinchi so'rovni ham bajarish"
      - "Kalitni o'chirib, qaytadan boshlash"
      - "Birinchi so'rov natijasini kutmasdan 200 qaytarish"
      - "Kalit 'jarayonda' holatida ekanini aniqlab, ikkinchi so'rovni bajarmasdan konflikt (masalan, 409) qaytarish va klientga keyinroq qayta urinishni aytish"
    answer: 3
    explain: "Idempotency store uch holatni farqlashi kerak: yangi, jarayonda va tugagan. 'Jarayonda' holatida ikkinchi bajarish aynan oldini olmoqchi bo'lgan takroriy to'lov. Tugagan bo'lsa, saqlangan natija qaytariladi."
  - q: "Bir xil `Idempotency-Key` bilan, lekin boshqa `amount` qiymati bilan so'rov keldi. Eng to'g'ri xatti-harakat qaysi?"
    options:
      - "So'rov tanasi kalitga mos kelmasligini aniqlab, uni rad etish (masalan, 422)"
      - "Yangi summa bilan qayta to'lov qilish"
      - "Eski natijani jimgina qaytarish"
      - "Kalitni e'tiborsiz qoldirish"
    answer: 0
    explain: "Kalit bilan birga so'rov fingerprint'i (masalan, tananing hash'i) saqlanadi. Mos kelmasa, bu klient xatosi: eski natijani qaytarish ham, yangi to'lov ham noto'g'ri bo'ladi."
  - q: "Martin \"Clean Code\"ning concurrency bobida qaysi himoya tamoyilini taklif qiladi?"
    options:
      - "Har bir funksiyaga lock qo'yish"
      - "Concurrency bilan bog'liq kodni boshqa koddan alohida saqlash va umumiy (shared) ma'lumot doirasini imkon qadar cheklash"
      - "Concurrency har doim performance'ni oshiradi, shuning uchun uni hamma joyda ishlatish"
      - "Concurrency xatolarini testda tasodifiy deb e'tiborsiz qoldirish"
    answer: 1
    explain: "Martin concurrency kodiga SRP'ni qo'llashni, umumiy ma'lumotni cheklashni va ma'lumot nusxalaridan foydalanishni tavsiya qiladi. U 'concurrency doim tezlashtiradi' kabi fikrlarni afsona deb ataydi va bir martalik xatolarni e'tiborsiz qoldirmaslikni maslahat beradi."
  - q: "Foydalanuvchi qidiruv maydoniga tez yozmoqda va har bir harf uchun `fetch` yuboriladi. Eski javoblar yangilaridan keyin kelib, natijani buzmoqda. Toza yechim qaysi?"
    options:
      - "Javoblarni vaqt bo'yicha saralash"
      - "`setTimeout(…, 0)` qo'shish"
      - "Har bir yangi so'rovda oldingi `AbortController`ni `abort()` qilish va faqat oxirgi signal bilan yuborilgan so'rov natijasini qabul qilish"
      - "So'rovlarni ketma-ket bajarish uchun hammasini await qilish"
    answer: 2
    explain: "Bu ham race condition: javoblar tartibi kafolatlanmagan. AbortController eski so'rovni bekor qiladi va resursni bo'shatadi. Ketma-ket bajarish UX'ni sekinlashtiradi va muammoni hal qilmaydi."
task:
  title: "Yoqilg'i kartasini to'ldirishdagi race va takrorni tuzatish"
  prompt: |
    Fleet tizimida kompaniya balansidan haydovchining yoqilg'i kartasiga pul o'tkaziladi. Hozirgi kod:
    - balansni o'qiydi, tekshiradi, keyin yangi qiymatni yozadi (lost update va manfiy balans xavfi);
    - mobil ilova timeout'dan keyin so'rovni qayta yuborsa, pul ikki marta o'tadi.

    1. Balansni tekshirish va kamaytirishni bitta atomik operatsiyaga aylantiring.
    2. `Idempotency-Key` qo'llab-quvvatlang: yangi, jarayonda, tugagan va mos kelmagan holatlarni farqlang.
    3. Biznes mantiqni idempotentlik mexanizmidan ajrating.
  lang: ts
  starter: |
    import type { Pool } from "pg";

    export class FuelCardService {
      constructor(private readonly db: Pool) {}

      async topUp(companyId: string, cardId: string, amountUzs: number): Promise<{ balance: number }> {
        const { rows } = await this.db.query<{ balance: number }>(
          "select balance from company_wallets where company_id = $1",
          [companyId],
        );
        const balance = rows[0].balance;
        if (balance < amountUzs) throw new Error("insufficient funds");
        await this.db.query("update company_wallets set balance = $2 where company_id = $1", [
          companyId,
          balance - amountUzs,
        ]);
        await this.db.query("update fuel_cards set balance = balance + $2 where id = $1", [cardId, amountUzs]);
        return { balance: balance - amountUzs };
      }
    }
  solution: |
    import { createHash } from "node:crypto";
    import type { Pool, PoolClient } from "pg";

    export type TopUpResult =
      | { ok: true; companyBalance: number }
      | { ok: false; reason: "insufficient_funds" | "card_not_found" };

    // 1. Biznes amali: bitta tranzaksiya, atomik shartli yangilash
    export async function topUpCard(
      tx: PoolClient,
      companyId: string,
      cardId: string,
      amountUzs: number,
    ): Promise<TopUpResult> {
      const debit = await tx.query<{ balance: number }>(
        `update company_wallets set balance = balance - $2
          where company_id = $1 and balance >= $2
          returning balance`,
        [companyId, amountUzs],
      );
      if (debit.rowCount === 0) return { ok: false, reason: "insufficient_funds" };
      const credit = await tx.query("update fuel_cards set balance = balance + $2 where id = $1", [cardId, amountUzs]);
      if (credit.rowCount === 0) throw new CardNotFound();
      return { ok: true, companyBalance: debit.rows[0].balance };
    }
    class CardNotFound extends Error {}

    // 2. Idempotentlik: biznes amalidan alohida qatlam
    type Begin =
      | { state: "new" }
      | { state: "in_progress" }
      | { state: "mismatch" }
      | { state: "completed"; result: TopUpResult };

    async function beginIdempotent(tx: PoolClient, key: string, fingerprint: string): Promise<Begin> {
      const inserted = await tx.query(
        `insert into idempotency_keys(key, fingerprint, status) values ($1, $2, 'in_progress')
         on conflict (key) do nothing`,
        [key, fingerprint],
      );
      if (inserted.rowCount === 1) return { state: "new" };
      const { rows } = await tx.query<{ fingerprint: string; status: string; result: TopUpResult | null }>(
        "select fingerprint, status, result from idempotency_keys where key = $1",
        [key],
      );
      const row = rows[0];
      if (row.fingerprint !== fingerprint) return { state: "mismatch" };
      if (row.status === "completed" && row.result) return { state: "completed", result: row.result };
      return { state: "in_progress" };
    }

    export type TopUpResponse = TopUpResult | { ok: false; reason: "in_progress" | "key_mismatch" };

    export class FuelCardService {
      constructor(private readonly db: Pool) {}

      async topUp(
        idempotencyKey: string,
        companyId: string,
        cardId: string,
        amountUzs: number,
      ): Promise<TopUpResponse> {
        const scopedKey = `fuel-topup:${companyId}:${idempotencyKey}`;
        const fingerprint = createHash("sha256").update(JSON.stringify({ cardId, amountUzs })).digest("hex");
        const tx = await this.db.connect();
        try {
          await tx.query("begin");
          const begin = await beginIdempotent(tx, scopedKey, fingerprint);
          if (begin.state !== "new") {
            await tx.query("rollback");
            if (begin.state === "completed") return begin.result;
            return { ok: false, reason: begin.state === "mismatch" ? "key_mismatch" : "in_progress" };
          }
          const result = await topUpCard(tx, companyId, cardId, amountUzs).catch((e: unknown) => {
            if (e instanceof CardNotFound) return { ok: false, reason: "card_not_found" } as const;
            throw e;
          });
          if (!result.ok) {
            await tx.query("rollback");
            return result;
          }
          await tx.query(
            "update idempotency_keys set status = 'completed', result = $2 where key = $1",
            [scopedKey, JSON.stringify(result)],
          );
          await tx.query("commit");
          return result;
        } catch (error) {
          await tx.query("rollback");
          throw error;
        } finally {
          tx.release();
        }
      }
    }
  solutionNotes: |
    - `balance >= $2` sharti `UPDATE` ichida: tekshirish va kamaytirish bitta atomik operatsiya. Ikki parallel so'rov baza tomonidan ketma-ketlashtiriladi, ikkinchisi yangilangan balansni ko'radi. Lost update va manfiy balans yo'qoldi.
    - Hamma narsa bitta tranzaksiyada: kompaniya balansi kamayib, karta topilmasa, rollback qilinadi.
    - Idempotency kaliti `insert ... on conflict do nothing` bilan olinadi: bu ham atomik. Ikki bir xil so'rovdan faqat bittasi `new` holatini oladi.
    - Bir xil tranzaksiyada kalit 'in_progress' qatori boshqa tranzaksiyaga commit'gacha ko'rinmaydi; parallel ikkinchi so'rov unique index lock'ida kutadi va birinchisi commit qilgach `completed` natijani oladi. Bu PostgreSQL'ning unique constraint xatti-harakati. Agar tashqi API chaqiruvi bo'lsa (tranzaksiyadan tashqarida), kalitni alohida commit qilib, `in_progress` holatini aniq qaytarish kerak bo'ladi.
    - Kalit kompaniya va amal bilan scope qilingan: boshqa mijozning kaliti bilan to'qnashmaydi.
    - Fingerprint so'rov tanasidan: bir xil kalit, boshqa summa bo'lsa `key_mismatch`.
    - Biznes muvaffaqiyatsizligi (`insufficient_funds`) saqlanmaydi va kalit bo'shatiladi: mijoz balansni to'ldirib, xuddi shu kalit bilan qayta urinishi mumkin. Bu dizayn tanlovi, ba'zi API'lar xatoni ham saqlaydi.
  checklist:
    - "Balans tekshiruvi va kamaytirish bitta SQL operatsiyasida"
    - "Ikki bosqichli yozuvlar bitta tranzaksiyada"
    - "Idempotency kaliti atomik insert bilan olinadi"
    - "Yangi, jarayonda, tugagan va mos kelmagan holatlar farqlanadi"
    - "Biznes amali (topUpCard) idempotentlik kodidan alohida"
---

## Muammo

"JavaScript bitta thread'da ishlaydi, demak bizda race condition yo'q" - Node.js jamoalarida eng qimmatga tushadigan noto'g'ri fikrlardan biri. Real misollar:

- Mobil ilova "Mashinani band qilish" tugmasini ikki marta yubordi. Ikkala so'rov ham mashinani `available` deb ko'rdi va ikkita reys bitta mashinaga biriktirildi.
- Yoqilg'i kartasini to'ldirishda timeout bo'ldi, klient qayta urindi, va pul ikki marta yechildi.
- Kesh bo'sh bo'lganda 200 ta parallel so'rov bir vaqtda bitta qimmat hisobotni hisoblashni boshladi.
- Qidiruv maydonida eski so'rovning javobi yangisidan keyin keldi va foydalanuvchi noto'g'ri natijani ko'rdi.

Bularning hech biri ko'p thread'li xotira muammosi emas. Hammasi **interleaving** natijasi: bir nechta mantiqiy oqim bitta resursga navbat bilan murojaat qiladi va ularning qadamlari aralashib ketadi.

## Asosiy g'oya

Robert Martin *Clean Code*ning concurrency bobida concurrency'ni "nima" va "qachon" ni ajratish strategiyasi deb ta'riflaydi va bir nechta afsonani rad etadi: concurrency har doim tezlik bermaydi, u dizaynni o'zgartiradi va uning xatolari ko'pincha qayta takrorlanmaydi. Bob Java thread'lari haqida yozilgan, lekin uning himoya tamoyillari JS'ga to'g'ridan-to'g'ri ko'chadi:

- **Concurrency kodini alohida saqlang.** Lock, retry, idempotentlik mexanizmi - bu o'z hayot sikliga ega alohida mas'uliyat. Uni biznes mantiq bilan aralashtirmang (SRP).
- **Umumiy ma'lumot doirasini cheklang.** Qancha kam joy umumiy holatni o'zgartirsa, xato qiladigan joy shuncha kam.
- **Nusxalardan foydalaning.** Umumiy obyektni o'zgartirish o'rniga nusxa bilan ishlash va natijani bir joyda birlashtirish.
- **Oqimlar iloji boricha mustaqil bo'lsin.**

Martin testlash haqida ham muhim maslahat beradi: bir martalik, takrorlanmaydigan xatolarni "kosmik nur" deb e'tiborsiz qoldirmang, ular ehtimoliy concurrency xatosi.

Node.js uchun bularni uchta amaliy qoidaga keltiramiz:

1. **Har bir `await` - interleaving nuqtasi.** Undan oldin o'qilgan holat undan keyin eskirgan bo'lishi mumkin.
2. **Check-then-act'ni atomik operatsiyaga aylantiring.** Tekshirish va o'zgartirish bitta qadamda bo'lsin, odatda bazada.
3. **Takrorlanishi mumkin bo'lgan amallarni idempotent qiling.** Tarmoq so'rovni ikki marta yetkazishi mumkin, va bu normal holat.

## Chuqurroq: Node.js'da race qanday paydo bo'ladi

### Event loop va await

JavaScript'da sinxron kod bo'lagi to'xtatilmasdan oxirigacha bajariladi. Bu haqiqiy kafolat: `balance -= amount` qatorining o'rtasida boshqa kod ishlamaydi. Lekin `await` funksiyani to'xtatadi va boshqaruvni event loop'ga qaytaradi. Shu payt boshqa so'rov handler'i ishlashi mumkin.

```ts
let walletBalance = 100_000;

async function withdraw(amount: number, audit: () => Promise<void>): Promise<void> {
  const current = walletBalance; // 1. o'qish
  await audit();                 // 2. navbat boshqalarga
  walletBalance = current - amount; // 3. eskirgan qiymat asosida yozish
}

export async function demoLostUpdate(): Promise<number> {
  const audit = () => new Promise<void>((resolve) => setTimeout(resolve, 10));
  await Promise.all([withdraw(30_000, audit), withdraw(50_000, audit)]);
  return walletBalance; // 20_000 emas, 50_000 yoki 70_000
}
```

Ikkala chaqiruv ham `current = 100_000` ni o'qiydi, ikkalasi ham kutadi, keyin ikkalasi ham o'z hisobini yozadi. Ikkinchi yozuv birinchisini o'chiradi: **lost update**. Hech qanday thread yo'q, lekin xato bor.

Bazada ham xuddi shunday: `SELECT` va `UPDATE` orasidagi har bir `await` - boshqa so'rov uchun eshik. Va production'da odatda bir nechta Node process (cluster, Kubernetes replica'lari) bor, ular haqiqatan parallel ishlaydi.

### Atomik operatsiyalar

Eng ishonchli yechim - tekshirishni o'zgartirish ichiga ko'chirish:

- **Shartli UPDATE.** `UPDATE vehicles SET status = 'reserved', trip_id = $2 WHERE id = $1 AND status = 'available'`. Natijada o'zgargan qatorlar soni 0 bo'lsa - kimdir sizdan oldin rezerv qilgan.
- **Nisbiy yangilash.** `SET balance = balance - $1 WHERE balance >= $1` - o'qilgan qiymatni yozish o'rniga baza o'zi hisoblaydi.
- **Unique constraint.** "Bitta mashina - bitta faol reys" qoidasi uchun partial unique index (`WHERE status = 'active'`). Baza ikkinchi yozuvni rad etadi.
- **Optimistik lock.** `version` ustuni: `UPDATE ... SET version = version + 1 WHERE id = $1 AND version = $2`. Aggregate'larni saqlashda qulay (84-dars).
- **Pessimistik lock.** `SELECT ... FOR UPDATE` tranzaksiya ichida. Murakkab tekshiruvlar uchun, lekin lock'ni uzoq ushlamang va tranzaksiya ichida tashqi API chaqirmang.

Process ichidagi mutex (masalan, kalit bo'yicha `Promise` zanjiri) faqat bitta process ichida ishlaydi. U kesh yoki fayl kabi lokal resurslar uchun foydali, lekin bir nechta instance o'rtasidagi biznes invariantini himoya qilmaydi.

### Single-flight: bir xil ishni bir marta bajarish

Kesh bo'sh bo'lganda parallel so'rovlar bir xil qimmat ishni boshlaydi. Natijani emas, **Promise'ni** keshlash bu muammoni process ichida hal qiladi:

```ts
export function singleFlight<K, V>(load: (key: K) => Promise<V>): (key: K) => Promise<V> {
  const inFlight = new Map<K, Promise<V>>();
  return (key: K) => {
    const existing = inFlight.get(key);
    if (existing) return existing;
    const promise = load(key).finally(() => inFlight.delete(key));
    inFlight.set(key, promise);
    return promise;
  };
}

// const monthlyReport = singleFlight((companyId: string) => buildMonthlyReport(companyId));
```

`get` va `set` orasida `await` yo'q, shuning uchun bu ikki qadam sinxron va atomik. `finally` xato bo'lganda ham yozuvni o'chiradi, aks holda rad etilgan Promise abadiy keshlanib qoladi.

### Idempotentlik

Tarmoq "aynan bir marta" yetkazishni kafolatlamaydi. Klient javobni olmasa, u so'rov bajarilganmi yoki yo'qmi bilmaydi va qayta yuboradi. Server tomonidagi yechim - **idempotency key**: klient har bir mantiqiy amal uchun noyob kalit (UUID) yaratadi va uni `Idempotency-Key` sarlavhasida yuboradi. Bu naqsh to'lov API'larida keng tarqalgan va IETF'da uni standartlashtirish bo'yicha draft bor.

Toza implementatsiya uchun muhim tafsilotlar:

- **Kalitni atomik oling.** `INSERT ... ON CONFLICT DO NOTHING` yoki Redis'da `SET key value NX`. "Avval tekshir, keyin yoz" - o'sha race.
- **Uch holat.** Yangi (bajaring), jarayonda (bajarmang, konflikt qaytaring), tugagan (saqlangan natijani qaytaring).
- **Fingerprint.** Kalit bilan so'rov tanasining hash'ini saqlang. Bir xil kalit, boshqa tana - klient xatosi.
- **Scope va muddat.** Kalit mijoz va endpoint bo'yicha scope qilinadi va ma'lum muddatdan keyin (masalan, 24 soat) o'chiriladi.

### Bekor qilish: AbortController

Concurrency'ning yana bir tomoni - keraksiz ishni to'xtatish. MDN'ga ko'ra `AbortController`ning `signal` xususiyati asinxron operatsiya bilan bog'lanadigan `AbortSignal`ni qaytaradi, `abort()` esa operatsiyani tugashidan oldin bekor qiladi: fetch so'rovlari, javob tanasini o'qish va stream'lar. `AbortSignal.timeout(ms)` va `AbortSignal.any([...])` statik metodlari timeout va bir nechta bekor qilish manbasini birlashtirishni toza qiladi (29-dars).

```ts
export function createLatestOnly<T>(run: (signal: AbortSignal) => Promise<T>) {
  let current: AbortController | null = null;
  return async (): Promise<T | undefined> => {
    current?.abort();
    const controller = new AbortController();
    current = controller;
    try {
      return await run(AbortSignal.any([controller.signal, AbortSignal.timeout(5_000)]));
    } catch (error: unknown) {
      if (controller.signal.aborted) return undefined; // eskirgan so'rov, natija kerak emas
      throw error;
    }
  };
}
```

## Misol: mashinani rezerv qilish

Yomon variant:

```ts
import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ReservationService {
  constructor(private readonly prisma: PrismaService) {}

  async reserve(vehicleId: string, tripId: string): Promise<void> {
    const vehicle = await this.prisma.vehicle.findUniqueOrThrow({ where: { id: vehicleId } });
    if (vehicle.status !== "AVAILABLE") throw new ConflictException("band");
    await this.notifyDispatcher(vehicleId); // yana bitta await - oyna kengaydi
    await this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status: "RESERVED", tripId },
    });
  }

  private async notifyDispatcher(vehicleId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}
```

Tekshirish va yozish orasida ikkita `await` bor. Yuklama ostida ikki parallel so'rov ikkalasi ham muvaffaqiyatli bo'ladi va oxirgi yozuv g'olib.

Yaxshi variant:

```ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export type ReserveResult = { ok: true } | { ok: false; reason: "not_available" };

@Injectable()
export class ReservationService {
  constructor(private readonly prisma: PrismaService) {}

  async reserve(vehicleId: string, tripId: string): Promise<ReserveResult> {
    const { count } = await this.prisma.vehicle.updateMany({
      where: { id: vehicleId, status: "AVAILABLE" },
      data: { status: "RESERVED", tripId },
    });
    if (count === 0) return { ok: false, reason: "not_available" };
    await this.notifyDispatcher(vehicleId);
    return { ok: true };
  }

  private async notifyDispatcher(vehicleId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}
```

Nima o'zgardi:

- **Check va act birlashdi.** `updateMany` sharti bilan baza bitta atomik operatsiyada tekshiradi va yozadi. `count` qaysi so'rov g'olib ekanini aytadi.
- **Yon ta'sir g'alabadan keyin.** Dispetcherga xabar faqat rezerv muvaffaqiyatli bo'lgandan keyin yuboriladi.
- **Natija biznes tilida.** `not_available` - kutilgan holat, exception emas (28-dars). Controller uni 409'ga aylantiradi.

## Qachon qo'llamaslik kerak

- **Haqiqatan umumiy holat bo'lmasa.** Har bir so'rov faqat o'z ma'lumoti bilan ishlasa (foydalanuvchining o'z profili, yangi yozuv yaratish), lock va idempotentlik qo'shish ortiqcha. Avval "bu yerda ikki oqim bitta narsani o'zgartiradimi?" deb so'rang.
- **Tabiiy idempotent amallar.** `PUT /vehicles/:id/status { status: "maintenance" }` - qayta yuborilsa ham natija bir xil. Bunday endpoint'ga idempotency key mexanizmi kerak emas. U pul o'tkazish, buyurtma yaratish, xabar yuborish kabi takrorlanishi zararli amallar uchun.
- **Process ichidagi lock bilan "hal qilish".** Bitta instance'da ishlaydigan mutex testlarda yashil, production'da esa ikkinchi replica qo'shilgan kuni jimgina buziladi. Agar invariant biznes uchun muhim bo'lsa, uni baza darajasida himoya qiling.
- **Pessimistik lock hamma joyda.** `FOR UPDATE` deadlock va kutish vaqtlarini olib keladi. Ko'p holatlarda shartli UPDATE yoki unique constraint yetarli va arzonroq.
- **Ko'p xizmatli tranzaksiyalar.** Agar amal bir nechta tashqi tizimni (to'lov provayderi, SMS, boshqa servis) qamrab olsa, bu darsdagi vositalar yetmaydi: saga, outbox va kompensatsiya kerak. Bu mavzular System Design kursida.

## Stack'da: NestJS'da idempotency interceptor

Idempotentlikni har bir handler ichida yozish o'rniga, uni interceptor sifatida chegarada ushlab, biznes kodidan ajratish mumkin (Martin'ning "concurrency kodini alohida saqlang" tamoyili):

```ts
import {
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnprocessableEntityException,
} from "@nestjs/common";
import { createHash } from "node:crypto";
import type { Request } from "express";
import { Observable, of, tap } from "rxjs";

export type BeginResult =
  | { state: "new" }
  | { state: "in_progress" }
  | { state: "mismatch" }
  | { state: "completed"; body: unknown };

export abstract class IdempotencyStore {
  abstract begin(key: string, fingerprint: string): Promise<BeginResult>;
  abstract complete(key: string, body: unknown): Promise<void>;
  abstract release(key: string): Promise<void>;
}

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(private readonly store: IdempotencyStore) {}

  async intercept(ctx: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const rawKey = req.header("idempotency-key");
    if (!rawKey) throw new BadRequestException("Idempotency-Key sarlavhasi majburiy");

    const key = `${req.method}:${req.path}:${rawKey}`;
    const fingerprint = createHash("sha256").update(JSON.stringify(req.body ?? null)).digest("hex");
    const begin = await this.store.begin(key, fingerprint);

    if (begin.state === "completed") return of(begin.body);
    if (begin.state === "in_progress") throw new ConflictException("So'rov hali bajarilmoqda");
    if (begin.state === "mismatch") {
      throw new UnprocessableEntityException("Kalit boshqa so'rov tanasi bilan ishlatilgan");
    }

    return next.handle().pipe(
      tap({
        next: (body) => void this.store.complete(key, body),
        error: () => void this.store.release(key),
      }),
    );
  }
}
```

- **Store'ning `begin` metodi atomik bo'lishi shart:** Postgres'da `INSERT ... ON CONFLICT DO NOTHING`, Redis'da `SET NX` va muddat (`EX`).
- **Interceptor faqat kerakli endpoint'larga:** `@UseInterceptors(IdempotencyInterceptor)` to'lov va buyurtma yaratish handler'lariga. Global qilish GET so'rovlariga ham sarlavha talab qiladi.
- **Kalitni foydalanuvchi bilan scope qiling:** real loyihada kalitga autentifikatsiya qilingan mijoz id'sini qo'shing, aks holda ikki mijoz kaliti to'qnashishi mumkin.
- **Cheklov:** bu variant faqat javob tanasini saqlaydi. HTTP status kodini ham qayta tiklash kerak bo'lsa, uni ham saqlang.

## Xulosa

- Node.js'ning bitta thread'i sinxron bo'laklarni himoya qiladi, `await` nuqtalari orasini emas. Check-then-act va read-modify-write JS'da ham race beradi.
- Biznes invariantlarini baza darajasida atomik operatsiyalar bilan himoya qiling: shartli UPDATE, nisbiy yangilash, unique constraint, optimistik lock.
- Takrorlanishi zararli amallarni idempotency key bilan himoya qiling: atomik olish, uch holat, fingerprint va scope.
- Concurrency mexanizmini biznes kodidan ajrating: interceptor, alohida funksiya, alohida qatlam.
- Keraksiz ishni AbortController bilan bekor qiling va bir martalik "tushunarsiz" xatolarni e'tiborsiz qoldirmang.
