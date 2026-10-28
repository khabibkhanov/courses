---
n: 49
slug: xatolarni-yoq-qilish
title: "Xatolarni mavjud bo'lmaydigan qilish"
summary: "Eng yaxshi xato ishlovchisi - umuman yozilmagani. Ousterhout exception'larni murakkablikning asosiy manbalaridan biri deb hisoblaydi va ularni kamaytirishning to'rt usulini beradi: xatoni semantika orqali yo'q qilish, xatoni pastda yashirish (masking), xatolarni bir joyga yig'ish (aggregation) va ba'zan shunchaki crash qilish. Darsda ularning har birini va chegarasini ko'ramiz."
duration: 40
sources:
  - id: aposd
    note: "\"Define Errors Out of Existence\" bobi: Tcl unset va Windows fayl o'chirish misollari, substring, exception masking (TCP), exception aggregation, just crash, maxsus holatlarni yo'q qilish va \"taking it too far\" ogohlantirishi"
quiz:
  - q: "Ousterhout nima uchun exception'larni murakkablikning muhim manbai deb hisoblaydi?"
    options:
      - "Ular sekin ishlaydi"
      - "Ular faqat Java'da bor"
      - "Ularni qayta ishlash kodi yozish qiyin va kam test qilinadi; har bir tashlangan exception interfeysning bir qismiga aylanadi va chaqiruvchilarga yuk yuklaydi"
      - "Ular xotirani ko'p sarflaydi"
    answer: 2
    explain: "Exception chaqiruvchilarni uni ushlashga va nimadir qilishga majbur qiladi. Bunday kod kam ishlaydi va kam test qilinadi, shuning uchun unda bug'lar ko'p. Exception tashlash oson, uni to'g'ri qayta ishlash esa qiyin."
  - q: "Tcl'dagi `unset` buyrug'i misolidan Ousterhout qanday xulosa chiqaradi?"
    options:
      - "Mavjud bo'lmagan o'zgaruvchini o'chirishda xato tashlash to'g'ri edi"
      - "Tcl'ni ishlatmaslik kerak"
      - "`unset` semantikasini \"o'zgaruvchi endi mavjud emasligini ta'minla\" deb belgilaganda, o'zgaruvchi oldindan yo'q bo'lsa xato tashlash shart emas edi; xato aniqlov orqali yo'q bo'ladi"
      - "Har bir buyruq exception tashlashi kerak"
    answer: 2
    explain: "Ousterhout o'zi yozgan `unset` mavjud bo'lmagan o'zgaruvchida xato tashlardi va foydalanuvchilar uni har doim catch bilan o'rashga majbur bo'lgan. Semantikani o'zgartirish xatoni butunlay yo'q qiladi."
  - q: "Exception masking nima?"
    options:
      - "Xatoni yutib yuborib, hech narsa qilmaslik"
      - "Xatoni pastki darajada aniqlab, o'sha joyda qayta ishlash, shunda yuqori qatlamlar undan bexabar qoladi (masalan, TCP yo'qolgan paketlarni qayta yuboradi)"
      - "Xato xabarini o'zgartirish"
      - "Xatoni boshqa tilga tarjima qilish"
    answer: 1
    explain: "Masking xatoni yutish emas: muammo haqiqatan hal qilinadi, faqat pastki qatlamda. TCP'da paket yo'qolishi ilovaga ko'rinmaydi, chunki protokolning o'zi qayta yuboradi. Bu modulni chuqurroq qiladi."
  - q: "Exception aggregation qaysi holatda eng mos?"
    options:
      - "Ko'plab turli joylarda tashlanadigan, lekin bir xil qayta ishlanadigan xatolar uchun ko'p handler o'rniga yuqoridagi bitta handler"
      - "Har bir xato uchun alohida catch yozish kerak bo'lganda"
      - "Xatolarni massivga yig'ib, oxirida qaytarish"
      - "Faqat validatsiya xatolari uchun"
    answer: 0
    explain: "Ousterhout misolida veb-server'da parametr topilmasa har bir handler o'zi xato yozishi o'rniga, xato yuqoriga ko'tariladi va bitta joyda standart xato javobiga aylanadi. NestJS exception filter bu g'oyaning aniq namunasi (48-dars)."
  - q: "Ousterhout qachon \"just crash\" (shunchaki to'xtash) ni maqbul deb hisoblaydi?"
    options:
      - "Har qanday xatoda"
      - "Faqat test muhitida"
      - "Hech qachon"
      - "Xato juda kam uchraydigan, qayta ishlash qiyin va qayta ishlashdan foyda kam bo'lgan holatlarda (masalan, xotira tugashi yoki ichki ma'lumotlar buzilishi)"
    answer: 3
    explain: "Ousterhout xotira ajratish muvaffaqiyatsizligini misol qiladi: uni qayta ishlash deyarli imkonsiz, shuning uchun xato haqida xabar berib to'xtash oqilona. Lekin u ham bu yondashuv ilovaga bog'liq ekanini ta'kidlaydi: ba'zi tizimlar uchun aynan shu xatolarni boshqarish asosiy vazifa."
  - q: "Quyidagi qaysi o'zgarish \"xatoni semantika orqali yo'q qilish\"ga misol?"
    options:
      - "`cancelBooking(id)` bron allaqachon bekor qilingan bo'lsa ham xatosiz qaytadi, chunki uning vazifasi \"bron bekor qilingan holatda bo'lsin\""
      - "`cancelBooking(id)` bron topilmasa 404 qaytaradi"
      - "`cancelBooking(id)` xatoni log'ga yozadi va yutadi"
      - "`cancelBooking(id)` har doim throw qiladi"
    answer: 0
    explain: "Bu idempotent semantika: natija holati bir xil bo'lgani uchun takroriy chaqiruv xato emas. Bu `unset` misolining aynan o'zi va tarmoqdagi retry'lar bilan ham yaxshi ishlaydi."
task:
  title: "Geozona servisidagi xatolarni kamaytirish"
  prompt: |
    Quyidagi servis transportlarni geozonalarga biriktiradi. U deyarli har bir chetki holatda exception tashlaydi va chaqiruvchilar uni har joyda try/catch bilan o'raydi.

    1. Har bir exception uchun so'rang: chaqiruvchi bu xatoni ushlab, nima qiladi? Agar "hech narsa" yoki "e'tiborsiz qoldiradi" bo'lsa, xatoni semantika orqali yo'q qilishni ko'rib chiqing.
    2. Haqiqiy xatolarni (masalan, mavjud bo'lmagan geozona) qoldiring.
    3. Diapazon bilan ishlaydigan funksiyada chegaradan chiqishni xato emas, kesish (clamp) bilan hal qiling, xuddi `Array.prototype.slice` kabi.
    4. Chaqiruvchi kodning soddalashganini ko'rsating.
  lang: ts
  starter: |
    type Point = { lat: number; lng: number; at: Date };

    export class GeofenceService {
      private members = new Map<string, Set<string>>(); // zoneId -> vehicleIds
      private zones = new Set<string>(["tashkent-center", "chilonzor-depot"]);

      add(zoneId: string, vehicleId: string): void {
        if (!this.zones.has(zoneId)) throw new Error("ZONE_NOT_FOUND");
        const set = this.members.get(zoneId) ?? new Set<string>();
        if (set.has(vehicleId)) throw new Error("ALREADY_IN_ZONE");
        set.add(vehicleId);
        this.members.set(zoneId, set);
      }

      remove(zoneId: string, vehicleId: string): void {
        const set = this.members.get(zoneId);
        if (!set) throw new Error("ZONE_EMPTY");
        if (!set.has(vehicleId)) throw new Error("NOT_IN_ZONE");
        set.delete(vehicleId);
      }

      track(points: Point[], from: number, to: number): Point[] {
        if (from < 0 || to > points.length || from > to) throw new Error("RANGE");
        return points.slice(from, to);
      }
    }

    // chaqiruvchi:
    // try { geo.add(z, v) } catch (e) { if ((e as Error).message !== "ALREADY_IN_ZONE") throw e; }
    // try { geo.remove(z, v) } catch (e) { /* e'tiborsiz */ }
  solution: |
    type Point = { lat: number; lng: number; at: Date };

    export class ZoneNotFoundError extends Error {
      constructor(readonly zoneId: string) {
        super(`Geozona topilmadi: ${zoneId}`);
        this.name = "ZoneNotFoundError";
      }
    }

    export class GeofenceService {
      private readonly members = new Map<string, Set<string>>();
      private readonly zones = new Set<string>(["tashkent-center", "chilonzor-depot"]);

      /** Transport geozonada bo'lishini ta'minlaydi. Takroriy chaqiruv xavfsiz. */
      ensureMember(zoneId: string, vehicleId: string): void {
        this.membersOf(zoneId).add(vehicleId);
      }

      /** Transport geozonada bo'lmasligini ta'minlaydi. Takroriy chaqiruv xavfsiz. */
      ensureNotMember(zoneId: string, vehicleId: string): void {
        this.membersOf(zoneId).delete(vehicleId);
      }

      /** [from, to) oralig'idagi nuqtalar; chegaradan chiqqan indekslar kesiladi. */
      track(points: readonly Point[], from: number, to: number): Point[] {
        const start = Math.max(0, from);
        const end = Math.min(points.length, to);
        return start < end ? points.slice(start, end) : [];
      }

      private membersOf(zoneId: string): Set<string> {
        if (!this.zones.has(zoneId)) throw new ZoneNotFoundError(zoneId);
        let set = this.members.get(zoneId);
        if (!set) {
          set = new Set<string>();
          this.members.set(zoneId, set);
        }
        return set;
      }
    }

    // chaqiruvchi:
    // geo.ensureMember(z, v);
    // geo.ensureNotMember(z, v);
  solutionNotes: |
    - `ALREADY_IN_ZONE` va `NOT_IN_ZONE` semantika orqali yo'q qilindi: metodlar endi "holatni ta'minla" deb aniqlangan, shuning uchun allaqachon kerakli holatda bo'lish xato emas. Nomlar ham shu semantikani aytadi (`ensureMember`).
    - `ZONE_EMPTY` umuman bo'lmasligi kerak edi: bo'sh zona - normal holat, u ichki tasvirning (Map'da kalit bor-yo'qligi) oqib chiqishi edi.
    - `ZoneNotFoundError` qoldi: mavjud bo'lmagan geozona - chaqiruvchining haqiqiy xatosi (noto'g'ri ID), uni yashirish bug'ni yashirishga olib keladi.
    - `track` diapazonni kesadi, xuddi `slice` kabi. Ousterhout Java'dagi `substring` ning chegaradan chiqishda exception tashlashini aynan shunday tanqid qiladi.
    - Chaqiruvchidagi try/catch'lar yo'qoldi. Ayniqsa `catch { /* e'tiborsiz */ }` xavfli edi: u `ZONE_NOT_FOUND` ni ham yutib yuborardi.
    - Narx: endi "transport allaqachon zonada edi" degan ma'lumot yo'qoldi. Agar u biror joyda kerak bo'lsa (masalan, audit), metod `boolean` qaytarishi mumkin: "o'zgarish bo'ldimi".
  checklist:
    - "Chaqiruvchi e'tiborsiz qoldiradigan exception'lar semantika orqali yo'q qilindi"
    - "Metod nomlari yangi semantikani aks ettiradi"
    - "Haqiqiy xato (mavjud bo'lmagan geozona) saqlanib qoldi"
    - "Diapazon funksiyasi chegaradan chiqishda kesadi, xato tashlamaydi"
    - "Chaqiruvchida try/catch qolmadi"
---

## Muammo

Ijara tizimida bronni bekor qilish endpoint'i bor. Mobil ilova tarmoq uzilganda so'rovni qayta yuboradi. Birinchi so'rov serverga yetib borgan va bronni bekor qilgan, javob esa yo'qolgan. Ikkinchi so'rov `BookingAlreadyCancelledError` bilan 409 qaytaradi. Ilova "Xato yuz berdi" ko'rsatadi. Foydalanuvchi bron bekor qilinmadi deb o'ylaydi va qo'llab-quvvatlash xizmatiga qo'ng'iroq qiladi.

Boshqa joyda, servis kodi:

```ts
try {
  await geofences.remove(zoneId, vehicleId);
} catch (e) {
  // NOT_IN_ZONE bo'lishi mumkin, e'tiborsiz qoldiramiz
}
```

Bu `catch` `NOT_IN_ZONE` bilan birga DB ulanishi uzilishini ham yutib yuboradi.

Bu ikki holatning umumiy jihati: xato **tashlangan**, lekin uni ushlagan har bir chaqiruvchi uni aslida xato deb hisoblamaydi. Xato interfeysning bir qismiga aylangan va har bir foydalanuvchiga ish yaratgan.

## Asosiy g'oya

John Ousterhout *A Philosophy of Software Design*da exception'larga butun bir bob bag'ishlaydi va uni "Define Errors Out of Existence" deb nomlaydi. Uning tezisi: exception'larni qayta ishlash dasturiy tizimlardagi murakkablikning eng yomon manbalaridan biri.

Nima uchun? Ousterhout bir nechta sabab keltiradi:

- **Exception kodi yozish qiyin.** Xato yuz berganda tizim noaniq holatda bo'lishi mumkin: yarim bajarilgan operatsiya, qisman o'zgargan ma'lumot. To'g'ri tiklash ko'pincha asosiy mantiqdan murakkabroq.
- **Exception kodi kam ishlaydi.** U kamdan-kam bajariladi, shuning uchun kam test qilinadi. Ousterhout ta'kidlaydiki, bajarilmagan kod ishlamaydi deb faraz qilish kerak, va exception handler'lar aynan shunday kod.
- **Exception tashlash oson.** Dasturchi chetki holatni ko'rib, uni qanday hal qilishni bilmasa, exception tashlab, muammoni chaqiruvchiga o'tkazadi. Bu "men qaror qilmayman, siz qiling" degani. Har bir tashlangan exception esa modul interfeysining bir qismiga aylanadi va uni sayozroq qiladi.

Xulosa: **qayta ishlanishi kerak bo'lgan exception'lar sonini kamaytiring.** Buning uchun Ousterhout to'rt usul beradi.

### 1. Xatolarni aniqlov orqali yo'q qilish

Eng yaxshi usul - API semantikasini shunday belgilashki, xato holati umuman bo'lmasin.

Ousterhout o'z xatosini misol qiladi: u Tcl tilini yaratganda `unset` buyrug'i mavjud bo'lmagan o'zgaruvchini o'chirishga urinilganda xato tashlardi. Unga bu mantiqiy tuyulgan: yo'q narsani o'chirish - bug bo'lishi kerak. Amalda esa foydalanuvchilar `unset`ni ko'pincha oldingi operatsiyalardan qolgan holatni tozalash uchun ishlatgan va o'zgaruvchi bor-yo'qligini bilmagan. Natijada deyarli har bir `unset` chaqiruvi xatoni ushlash va e'tiborsiz qoldirish bilan o'ralgan. Agar `unset` semantikasi "o'zgaruvchi endi mavjud emasligini ta'minla" deb belgilanganida, o'zgaruvchi allaqachon yo'q bo'lsa, buyruq shunchaki hech narsa qilmasdi va xato yo'qolardi.

Boshqa misollari:

- **Fayl o'chirish.** Windows'da ochiq faylni o'chirib bo'lmaydi va bu foydalanuvchiga xato sifatida chiqadi. Unix'da esa ochiq faylni o'chirish mumkin: fayl nomi darhol yo'qoladi, uni ochgan jarayonlar esa yopilguncha ishlashda davom etadi. Xato holati semantika orqali yo'q qilingan.
- **Substring.** Java'da `substring` chegaradan chiqqan indekslar bilan exception tashlaydi. Ousterhout buni ortiqcha deb hisoblaydi: diapazonning mavjud matn bilan kesishmasini qaytarish oddiyroq va chaqiruvchilardan tekshiruvni olib tashlaydi. JavaScript'ning `slice` aynan shunday ishlaydi.

### 2. Exception masking

Ikkinchi usul - xatoni tizimning pastki darajasida aniqlab, shu yerda qayta ishlash, shunda yuqori qatlamlar undan bexabar qoladi. Ousterhout TCP misolini keltiradi: tarmoqda paketlar yo'qoladi, lekin TCP ularni qayta yuboradi va ilova faqat ishonchli bayt oqimini ko'radi. Paket yo'qolishi ilova uchun xato emas.

Masking modulni chuqurroq qiladi (52-dars): murakkablik modul ichida, interfeys oddiy. Bu yutish (swallowing) emas: muammo haqiqatan hal qilinadi, faqat chaqiruvchiga yetib bormaydi.

### 3. Exception aggregation

Uchinchi usul - ko'plab exception'larni bitta joyda qayta ishlash. Ousterhout veb-server misolini beradi: har bir URL handler kerakli parametr yo'q bo'lsa o'zi xato javobini yasashi o'rniga, parametr olish funksiyasi exception tashlaydi va u server darajasidagi bitta handler'da standart xato javobiga aylanadi. Natijada o'nlab handler'lardagi takroriy xato kodi bitta joyga yig'iladi.

Bu g'oya NestJS exception filter'larida (48-dars) to'g'ridan-to'g'ri qo'llaniladi.

Ousterhout aggregation'ning boshqa ko'rinishini ham ko'rsatadi: turli xil kam uchraydigan xatolarni (masalan, xotirada buzilgan ma'lumot) bitta umumiy tiklash mexanizmiga (crash va qayta tiklash) yo'naltirish. Shunda maxsus handler'lar soni kamayadi, umumiy mexanizm esa tez-tez ishlaydi va yaxshi test qilinadi.

### 4. Just crash

To'rtinchi usul: ba'zi xatolarni qayta ishlashga urinishning o'zi qiymatsiz. Ousterhout xotira ajratishning muvaffaqiyatsizligini misol qiladi: zamonaviy tizimlarda bu juda kam uchraydi, va bunday holatda qayta tiklashga urinish deyarli har doim muvaffaqiyatsiz bo'ladi, chunki tiklash kodi ham xotira talab qiladi. Eng oqilona reaksiya - diagnostik ma'lumotni chiqarib, to'xtash.

Ousterhout darhol cheklov qo'shadi: bu ilovaga bog'liq. Xatoni boshqarish tizimning asosiy vazifasi bo'lgan joyda (masalan, ma'lumotlarni ishonchli saqlashga mo'ljallangan tizim disk xatolarini boshqarishi kerak - bu bizning misolimiz) crash qilish to'g'ri emas.

### Maxsus holatlarni ham yo'q qiling

Ousterhout bu g'oyani exception'lardan tashqariga kengaytiradi: kod ichidagi maxsus holatlar ham xuddi shunday murakkablik qo'shadi. Uning matn muharriri misolida "tanlov yo'q" holati alohida tekshiruvlarni talab qilardi. Agar "tanlov yo'q" ni bo'sh tanlov (boshi va oxiri bir joyda) deb aniqlasa, ko'p tekshiruvlar yo'qoladi. Bu 46-darsdagi Special Case g'oyasiga yaqin.

## Chuqurroq: "Taking it too far"

Ousterhout bobni muhim ogohlantirish bilan yakunlaydi: xatolarni yo'q qilish yoki yashirish faqat xato haqidagi ma'lumot modul tashqarisida kerak bo'lmaganda to'g'ri. Uning misoli: tarmoq modulida barcha tarmoq xatolarini yashirish, ilovaga xato bo'lganini umuman bildirmaslik. Bunda ilova xabar yo'qolganini bila olmaydi va to'g'ri reaksiya qila olmaydi. Ba'zi xatolar interfeysning ajralmas qismi bo'lishi kerak.

Shuning uchun har bir exception uchun savol: **chaqiruvchi bu xato bilan nima qila oladi?**

- Hech narsa yoki "e'tiborsiz qoldiradi" - semantikani o'zgartiring (1-usul).
- Pastki modul uni o'zi hal qila oladi (qayta urinish, standart qiymat) - masking (2-usul).
- Ko'p joyda bir xil qayta ishlanadi - aggregation (3-usul).
- Hech kim hal qila olmaydi va juda kam - crash (4-usul).
- Chaqiruvchi haqiqatan turlicha qaror qabul qiladi - exception (yoki Result) qoladi va interfeysda hujjatlanadi.

### Idempotentlik bilan bog'liqlik

Taqsimlangan tizimlarda 1-usulning eng muhim ko'rinishi - idempotent operatsiyalar. Mijozlar va navbatlar so'rovlarni qayta yuboradi (at-least-once yetkazish). Agar `cancelBooking` "bron bekor qilingan holatda bo'lishini ta'minla" deb aniqlansa, takroriy so'rov muammo emas. Agar u ikkinchi chaqiruvda xato bersa, har bir mijoz bu xatoni maxsus qayta ishlashi kerak. Idempotentlik va retry mavzusini 87-darsda batafsil ko'ramiz.

## Misol: bronni bekor qilish

Yomon:

```ts
type Booking = { id: string; status: "active" | "cancelled" | "completed" };

export class BookingAlreadyCancelledError extends Error {}
export class BookingCompletedError extends Error {}

export async function cancelBooking(repo: BookingRepo, id: string): Promise<void> {
  const booking = await repo.getOrThrow(id);
  if (booking.status === "cancelled") throw new BookingAlreadyCancelledError(id);
  if (booking.status === "completed") throw new BookingCompletedError(id);
  await repo.updateStatus(id, "cancelled");
}

interface BookingRepo {
  getOrThrow(id: string): Promise<Booking>;
  updateStatus(id: string, status: Booking["status"]): Promise<void>;
}
```

Yaxshi:

```ts run
export class BookingCompletedError extends Error {
  constructor(readonly bookingId: string) {
    super(`Yakunlangan bronni bekor qilib bo'lmaydi: ${bookingId}`);
    this.name = "BookingCompletedError";
  }
}

/**
 * Bron bekor qilingan holatda bo'lishini ta'minlaydi.
 * Allaqachon bekor qilingan bron uchun hech narsa qilmaydi (idempotent).
 * @returns true - agar shu chaqiruv holatni o'zgartirgan bo'lsa.
 */
export async function cancelBooking(repo: BookingRepo, id: string): Promise<boolean> {
  const booking = await repo.getOrThrow(id);
  switch (booking.status) {
    case "cancelled":
      return false;
    case "completed":
      throw new BookingCompletedError(id);
    case "active":
      await repo.updateStatus(id, "cancelled");
      return true;
  }
}

// Sinab ko'ring: bir bronni ikki marta bekor qiling.
const statuses = new Map<string, Booking["status"]>([["b1", "active"], ["b2", "completed"]]);
const repo: BookingRepo = {
  getOrThrow: async (id) => ({ id, status: statuses.get(id)! }),
  updateStatus: async (id, status) => void statuses.set(id, status),
};
console.log(await cancelBooking(repo, "b1"));
console.log(await cancelBooking(repo, "b1"));
await cancelBooking(repo, "b2").catch((e) => console.log(e.name, e.message));
```

Nima o'zgardi va nega:

- **`BookingAlreadyCancelledError` yo'q qilindi.** Semantika "ta'minla" deb o'zgardi. Takroriy so'rovlar endi xato emas, mobil ilova uchun maxsus holat yo'qoldi.
- **`BookingCompletedError` qoldi.** Yakunlangan bronni bekor qilish - haqiqatan boshqa vaziyat: foydalanuvchiga "bu bron allaqachon yakunlangan, pulni qaytarish uchun murojaat qiling" deyish kerak. Chaqiruvchi bu xato bilan aniq ish qiladi.
- **Ma'lumot yo'qolmadi.** `boolean` natija "o'zgarish bo'ldimi" degan savolga javob beradi. Audit log yoki bildirishnoma yuborish uchun kerak bo'lsa, shu yetarli. Bu Ousterhoutning "taking it too far" ogohlantirishini hisobga oladi.
- **Interfeys sharhi semantikani qayd etadi.** Idempotentlik - chaqiruvchi tayanishi mumkin bo'lgan va'da, uni yozib qo'ying (34-dars).

## Qachon qo'llamaslik kerak

- **Xatoni yashirish chaqiruvchidan muhim ma'lumotni olib qo'ysa.** To'lovni "jimgina" muvaffaqiyatsiz qilish, SMS yuborilmaganini bildirmaslik, yarim saqlangan ma'lumotni muvaffaqiyat deb qaytarish - bular masking emas, yolg'on. Ousterhout ham aynan shundan ogohlantiradi.
- **Xato semantikasi biznes uchun muhim bo'lsa.** "Allaqachon to'langan hisob-fakturani qayta to'lash" ba'zi tizimlarda idempotent bo'lishi kerak (bir xil idempotency key bilan), ba'zilarida esa ikki marta to'lash urinishi firibgarlik belgisi va xato sifatida ko'rinishi kerak. Qaror biznes bilan qabul qilinadi.
- **Clamp xatolarni yashirsa.** `slice`ga o'xshash kesish UI va hisobotlarda qulay, lekin moliyaviy hisob-kitobda "100 so'mni 3 ga bo'lish" yoki "manfiy miqdorni 0 ga kesish" bug'ni yashirishi mumkin. Noto'g'ri kirish - dasturchi xatosi bo'lsa, uni ochiq qiling.
- **"Just crash" serverda ehtiyotkorlik bilan.** Ko'p foydalanuvchiga xizmat qiladigan Node process bitta so'rovdagi kutilgan xato uchun to'xtamasligi kerak. Crash - noma'lum, buzilgan holat uchun (48-dars, process darajasidagi xatolar).
- **Bo'sh catch masking emas.** `catch {}` hech narsani hal qilmaydi, faqat yashiradi. Masking'da muammo haqiqatan hal qilinishi kerak: retry, fallback, standart qiymat.

## Stack'da: Node.js, PostgreSQL, NestJS

- **Postgres'da semantika orqali yo'q qilish.** `INSERT ... ON CONFLICT DO NOTHING`, `CREATE TABLE IF NOT EXISTS`, `DELETE` (yo'q qatorni o'chirish xato emas) - bular `unset` g'oyasining SQL ko'rinishi. Prisma'da `upsert` va `deleteMany` ham shunday, `delete` esa yozuv topilmasa xato tashlaydi.
- **`fs.rm(path, { force: true })`** mavjud bo'lmagan faylda xato tashlamaydi. `fs.mkdir(path, { recursive: true })` mavjud papkada xato bermaydi. Node API'larida bu flaglar aynan shu dizayn uchun.
- **Masking: HTTP klientda retry.** Vaqtinchalik tarmoq xatolari va 503 uchun eksponensial kechikishli retry'ni SDK o'ramida (50-dars) bir marta qiling, har bir chaqiruvchida emas. Faqat idempotent so'rovlar uchun.
- **Aggregation: NestJS exception filter.** Controller'larda try/catch yozish o'rniga bitta global filter (48-dars).
- **Array metodlari.** `slice`, `at`, `find`, `Map.prototype.delete` - JS standart kutubxonasi ko'p joyda xatolarni allaqachon semantika orqali yo'q qilgan. O'z API'laringizni ham shu ruhda loyihalang.

## Xulosa

- Exception'lar interfeysning bir qismi va har bir chaqiruvchiga yuk. Ularni tashlash oson, to'g'ri qayta ishlash qiyin.
- Birinchi usul: API semantikasini shunday belgilangki, xato holati bo'lmasin ("ta'minla", idempotentlik, slice'ga o'xshash kesish).
- Masking: xatoni pastki qatlamda haqiqatan hal qiling. Aggregation: ko'plab xatolarni bitta handler'ga yig'ing. Crash: kam uchraydigan va hal qilib bo'lmaydigan holatlar uchun.
- Ousterhout ogohlantiradi: chaqiruvchiga kerak bo'lgan xato ma'lumotini yashirmang.
- Har bir exception uchun so'rang: chaqiruvchi bu xato bilan nima qiladi?
