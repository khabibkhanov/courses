---
n: 7
slug: simple-design
title: "Kent Beckning oddiy dizayn qoidalari"
summary: "Kent Beck 1990-yillar oxirida Extreme Programming doirasida oddiy dizaynning to'rt qoidasini taklif qildi: testlardan o'tadi, niyatni ochadi, takror yo'q, elementlar eng kam. Bu darsda qoidalarning ustuvorlik tartibini, ikkinchi va uchinchi qoida orasidagi o'zaro ta'sirni va ularni kundalik refaktoringda qanday ishlatishni ko'ramiz."
duration: 30
sources:
  - id: fowler-beck-design-rules
    note: "Fowler'ning 2015 yildagi BeckDesignRules maqolasi: to'rt qoidaning matni, ustuvorlik tartibi, 2- va 3-qoida orasidagi munosabat, birinchi manba sifatida XP \"White Book\"ning birinchi nashri"
  - id: cc1
    note: "12-bob \"Emergence\": oddiy dizaynning to'rt qoidasi bo'yicha bo'limlar va 1-bobdagi Ron Jeffries ta'rifi"
  - id: cc2
    note: "Qayta yozilgan nashrda oddiy dizayn qoidalariga bag'ishlangan qism"
quiz:
  - q: "Fowler bayon qilganidek, Beck'ning to'rt qoidasi qaysi tartibda va nima uchun shu tartibda?"
    options:
      - "Testlardan o'tadi, niyatni ochadi, takror yo'q, elementlar eng kam - ustuvorlik tartibida: ziddiyat bo'lsa, oldingi qoida ustun"
      - "Takror yo'q, testlardan o'tadi, elementlar eng kam, niyatni ochadi - muhimlik tartibida"
      - "Tartib ahamiyatsiz, to'rttasi teng"
      - "Elementlar eng kam, takror yo'q, niyatni ochadi, testlardan o'tadi - qo'llash ketma-ketligida"
    answer: 0
    explain: "Fowler qoidalar ustuvorlik tartibida ekanini aytadi: masalan, testlardan o'tish niyatni ochishdan muhimroq. Lekin u 2- va 3-qoida orasidagi tartib unchalik muhim emasligini qo'shimcha qiladi, chunki ular bir-birini to'ldiradi."
  - q: "To'rtinchi qoida (\"fewest elements\") qaysi holatga qarshi qaratilgan?"
    options:
      - "Funksiyalarning uzunligiga"
      - "Kommentlar soniga"
      - "Birinchi uchta qoidaga xizmat qilmaydigan elementlarga: kelajak uchun qo'shilgan klasslar, keraksiz interfeyslar, spekulyativ abstraksiyalar"
      - "Fayllar soniga"
    answer: 2
    explain: "To'rtinchi qoida eng past ustuvorlikka ega: element testlar, niyat yoki takrorni yo'qotish uchun kerak bo'lsa, u qoladi. Kerak bo'lmasa, o'chiriladi. Fowler buni ko'pincha spekulyativ umumiylikka qarshi qoida deb ko'radi (9-dars)."
  - q: "Ikki xil biznes qoidasi tasodifan bir xil kod bilan ifodalangan (masalan, haydovchi bonusi va mijoz keshbeki hozircha ikkalasi ham 5%). \"No duplication\" qoidasi bo'yicha nima qilish kerak?"
    options:
      - "Darhol bitta funksiyaga birlashtirish, chunki kod bir xil"
      - "Har doim nusxa ko'chirish, chunki takror zararsiz"
      - "Ikkalasini bitta konstantaga birlashtirish va kommentda ikki ma'noni yozish"
      - "Ehtimol birlashtirmaslik: bu bilim takrori emas, tasodifiy o'xshashlik, va \"reveals intention\" qoidasi ikki xil nomni talab qiladi"
    answer: 3
    explain: "Takror qoidasi bir xil bilim haqida, bir xil matn haqida emas (8-darsda DRY). Ikki mustaqil biznes qoidasini birlashtirish ularning niyatini yashiradi va biri o'zgarganda muammo beradi. Bu 2- va 3-qoida qanday bir-birini to'g'rilashiga misol."
  - q: "Clean Code'ning 12-bobi bu qoidalar nima berishini qaysi g'oya bilan tasvirlaydi?"
    options:
      - "Ular faqat test coverage'ni oshiradi"
      - "Qoidalarga amal qilinganda yaxshi dizayn asta-sekin \"paydo bo'ladi\" (emergence), oldindan katta loyihalashsiz"
      - "Ular faqat Java uchun"
      - "Ular arxitektura diagrammalarini almashtiradi"
    answer: 1
    explain: "Bob nomi \"Emergence\" - yaxshi dizayn oddiy qoidalarni doimiy qo'llash natijasida paydo bo'ladi degan g'oya. Bu XP falsafasining qismi va u muhokamali: Ousterhout kabi mualliflar oldindan dizayn haqida o'ylashni ko'proq qadrlaydi."
  - q: "Nima uchun \"Passes the tests\" eng birinchi qoida?"
    options:
      - "Chunki test yozish eng oson ish"
      - "Chunki testlar kod hajmini kamaytiradi"
      - "Chunki to'g'ri ishlamaydigan dizayn qanchalik chiroyli bo'lmasin foydasiz, va testlar qolgan uchta qoida bo'yicha refaktoringni xavfsiz qiladi"
      - "Chunki Beck TDD muallifi"
    answer: 2
    explain: "Birinchi qoida ikki vazifani bajaradi: dastur to'g'ri ishlashini ta'minlaydi va qolgan qoidalar uchun xavfsizlik to'ri beradi. Testlarsiz takrorni yo'qotish yoki nomlarni o'zgartirish xavfli."
  - q: "Quyidagilardan qaysi biri \"reveals intention\" qoidasining buzilishi?"
    options:
      - "Funksiya `applyLateFee(rental)` deb nomlangan va kechikish jarimasini qo'llaydi"
      - "`if (r.s === 3 && r.d > 0)` sharti ijara qaytarilgan va kechikkan holatni tekshiradi"
      - "Konstanta `MAX_RENT_DAYS = 30` deb nomlangan"
      - "Tip `RentalStatus = \"active\" | \"returned\"` deb e'lon qilingan"
    answer: 1
    explain: "Shart to'g'ri ishlashi mumkin, lekin uning ma'nosi (qaytarilgan va kechikkan) koddan o'qilmaydi. `isReturnedLate(rental)` kabi nom yoki tushuntiruvchi o'zgaruvchi niyatni ochadi."
task:
  title: "To'rt qoida bo'yicha refaktoring"
  prompt: |
    Quyidagi kod transport parki uchun haydovchilar reytingini hisoblaydi. U testlardan o'tadi (birinchi qoida bajarilgan). Qolgan uchta qoida bo'yicha refaktoring qiling, **qoidalar tartibida**:

    1. **Reveals intention.** Nomlar va sehrli raqamlar.
    2. **No duplication.** Haqiqiy bilim takrorini toping. Tasodifiy o'xshashlikni birlashtirmang.
    3. **Fewest elements.** Hech qanday qoidaga xizmat qilmaydigan elementni o'chiring.

    Har bir qadamda qaysi qoidaga xizmat qilganingizni yozing.
  lang: ts
  starter: |
    type Trip = { harshBrakes: number; speedings: number; idleMinutes: number; km: number };

    interface IScoreStrategy {
      score(trips: Trip[]): number;
    }

    export class DriverScoreCalculator implements IScoreStrategy {
      score(trips: Trip[]): number {
        let km = 0;
        for (const t of trips) km += t.km;
        if (km === 0) return 100;

        let hb = 0;
        for (const t of trips) hb += t.harshBrakes;
        let sp = 0;
        for (const t of trips) sp += t.speedings;
        let idle = 0;
        for (const t of trips) idle += t.idleMinutes;

        const p = (hb / km) * 100 * 2 + (sp / km) * 100 * 3 + (idle / km) * 100 * 0.5;
        return Math.max(0, Math.round(100 - p));
      }
    }
  solution: |
    type Trip = { harshBrakes: number; speedings: number; idleMinutes: number; km: number };

    type DrivingEvent = "harshBrakes" | "speedings" | "idleMinutes";

    /** Har 100 km dagi bitta hodisa uchun ayiriladigan ball. */
    const PENALTY_PER_100KM: Record<DrivingEvent, number> = {
      harshBrakes: 2,
      speedings: 3,
      idleMinutes: 0.5,
    };

    const PERFECT_SCORE = 100;

    export function calculateDriverScore(trips: Trip[]): number {
      const totalKm = sumBy(trips, "km");
      if (totalKm === 0) return PERFECT_SCORE;

      const events = Object.keys(PENALTY_PER_100KM) as DrivingEvent[];
      const penalty = events.reduce((sum, event) => {
        const per100Km = (sumBy(trips, event) / totalKm) * 100;
        return sum + per100Km * PENALTY_PER_100KM[event];
      }, 0);

      return Math.max(0, Math.round(PERFECT_SCORE - penalty));
    }

    function sumBy(trips: Trip[], field: keyof Trip): number {
      return trips.reduce((sum, trip) => sum + trip[field], 0);
    }
  solutionNotes: |
    - **Reveals intention.** `hb`, `sp`, `p` va `2`, `3`, `0.5`, `100` raqamlari nomlandi. `PENALTY_PER_100KM` jadvali endi biznes qoidasini o'zi tushuntiradi: "100 km'dagi har bir keskin tormoz uchun 2 ball".
    - **No duplication.** To'rtta bir xil yig'ish sikli - bu bir xil bilim ("safarlar bo'yicha maydonni yig'ish"), shuning uchun `sumBy`. Formuladagi uch marta takrorlangan `(x / km) * 100 * k` naqshi ham bitta bilim: "100 km'ga normallashtirilgan jarima". U jadval orqali bir joyga tushdi.
    - **Fewest elements.** `IScoreStrategy` interfeysining bitta implementatsiyasi bor va hech kim unga tayanmaydi: u hech bir qoidaga xizmat qilmaydi, shuning uchun o'chirildi. Holatsiz klass ham oddiy funksiyaga aylandi. Ikkinchi strategiya kerak bo'lganda interfeysni qaytarish bir daqiqalik ish.
    - Ehtiyot bo'lish kerak bo'lgan joy: suzuvchi nuqta arifmetikasining tartibi o'zgardi. Yaxlitlashdan oldingi natija juda kichik farq qilishi mumkin, shuning uchun mavjud testlarni (birinchi qoida) qayta ishga tushirish shart.
    - Agar yangi hodisa turi qo'shilsa, uni `Trip` va jadvalga qo'shish yetarli, TypeScript qolganini tekshiradi.
  checklist:
    - "Barcha sehrli raqamlar nomlangan va biznes ma'nosi ko'rinadi"
    - "To'rtta yig'ish sikli bitta yordamchiga tushdi"
    - "Formula naqshi bir joyda ifodalangan"
    - "Bitta implementatsiyali, hech kim ishlatmaydigan interfeys o'chirildi"
    - "Mavjud testlar refaktoringdan keyin ham o'tadi"
---

## Muammo

"Yaxshi dizayn" haqidagi bahslar ko'pincha cheksiz bo'ladi. Biri "bu yerda Strategy pattern kerak" deydi, boshqasi "bu ortiqcha", uchinchisi "SOLID'ga mos emas". Har kim o'z tajribasidan gapiradi, umumiy mezon yo'q. Code review'da bunday bahslar soatlab davom etadi va ko'pincha eng ishonchli ovozda gapirgan odam yutadi.

Kerak bo'lgan narsa - **qisqa, ustuvorlik tartibiga ega mezonlar ro'yxati**, ular bilan istalgan kod parchasini baholash mumkin bo'lsin. Kent Beck 1990-yillar oxirida aynan shunday ro'yxatni taklif qilgan va u bugungi kungacha eng ixcham va eng ko'p iqtibos keltiriladigan dizayn mezonlaridan biri.

## Asosiy g'oya

Martin Fowler 2015 yildagi "BeckDesignRules" maqolasida qoidalarni shunday bayon qiladi (asl inglizcha nomlari bilan):

1. **Passes the tests** - testlardan o'tadi.
2. **Reveals intention** - niyatni ochadi.
3. **No duplication** - takror yo'q.
4. **Fewest elements** - elementlar eng kam.

Fowler'ning ta'kidlashicha, qoidalar **ustuvorlik tartibida**: agar ikkitasi to'qnashsa, yuqoridagisi ustun. Masalan, testlardan o'tish niyatni ochishdan muhimroq.

Fowler qoidalar Extreme Programming ishlab chiqilgan davrda, 1990-yillar oxirida paydo bo'lganini va eng nufuzli bayon XP "White Book"ining birinchi nashrida ekanini aytadi. Keyinchalik turli odamlar ularni turlicha so'zlar bilan ifodalagan, lekin mazmun bir xil.

*Clean Code* kitobida bu qoidalarga butun bir bob (12-bob, "Emergence") bag'ishlangan va u g'oyani shunday beradi: bu to'rt qoidaga doimiy amal qilinsa, yaxshi dizayn o'z-o'zidan "paydo bo'ladi". Kitobning birinchi bobida Ron Jeffries toza kodni ta'riflaganda ham aynan shu qoidalarga tayanadi (1-dars).

### Har bir qoidaning ma'nosi

**1. Passes the tests.** Dastur kutilganidek ishlashi kerak. Bu shunchaki "to'g'rilik" emas: Beck uchun bu testlar bor va ular dizaynni qo'llab-quvvatlaydi degani. Testlar qolgan uchta qoida bo'yicha o'zgarishlarni xavfsiz qiladi. Testsiz takrorni yo'qotish yoki nomni o'zgartirish - tavakkal.

**2. Reveals intention.** Kod nima qilishini va nima uchun qilishini o'qigan odam tushunishi kerak. Bu nomlar, tuzilma va abstraksiyalar orqali ta'minlanadi. Bu 2-darsdagi kognitiv yuk bilan bevosita bog'liq.

**3. No duplication.** Bir xil g'oya bir necha joyda ifodalanmasligi kerak. Bu matn takrori emas, bilim takrori haqida (8-dars). Fowler takrorni yo'qotish ko'pincha yangi, yaxshiroq abstraksiyalarni ochib berishini ta'kidlaydi.

**4. Fewest elements.** Birinchi uchta qoidaga xizmat qilmaydigan har qanday element (klass, interfeys, funksiya, qatlam) olib tashlanishi kerak. Fowler buni ko'pincha "kelajakda kerak bo'ladi" deb qo'shilgan narsalarga qarshi qoida deb ko'radi.

## Chuqurroq: qoidalarning o'zaro ta'siri

### 2- va 3-qoida: kim ustun?

Eng qiziqarli bahs ikkinchi va uchinchi qoida tartibi atrofida. Ba'zi bayonlarda takror birinchi keladi. Fowler bu tartib uning uchun unchalik muhim emasligini aytadi, chunki ular bir-birini kuchaytiradi: takrorni yo'qotish ko'pincha yangi nomli abstraksiya yaratadi (niyat ochiladi), niyatni ochish esa yashirin takrorni ko'rsatadi. Fowler shuningdek J.B. Rainsberger'ning bu ikki qoida o'zaro munosabati haqidagi muhokamasiga havola beradi.

Fowler yana bir muhim fikrni qo'shadi: aniqlik uchun takror qo'shish holatlari ko'pincha boshqa, chuqurroq muammoni yashiradi va uni hal qilish kerak. Ya'ni, agar sizga takrorni yo'qotish kodni tushunarsiz qiladigandek tuyulsa, ehtimol siz noto'g'ri abstraksiyani tanlagansiz.

Amaliy xulosa: ikkala qoida ziddiyatga kelganda, odatda bilimni yaxshiroq ifodalaydigan uchinchi yo'l bor. Qisqa yo'l - takrorni yo'qotish, lekin niyat yashirinsa, abstraksiya noto'g'ri. Bu 8-darsdagi Sandi Metz g'oyasiga olib boradi: noto'g'ri abstraksiyadan ko'ra takror arzonroq.

### 4-qoida va YAGNI

To'rtinchi qoida eng past ustuvorlikka ega, lekin amalda ko'pincha eng ko'p buziladi. Bitta implementatsiyali interfeyslar, "kelajak uchun" generik parametrlar, hech qanday mantiqsiz o'tkazuvchi qatlamlar (`Controller -> Service -> Manager -> Repository`, har biri faqat keyingisini chaqiradi) - bularning hammasi birinchi uchta qoidaga xizmat qilmaydi.

Muhim nozik nuqta: to'rtinchi qoida "eng kam qator" yoki "eng kam fayl" emas. Agar yangi klass niyatni ochsa yoki takrorni yo'qotsa, u qoladi, chunki yuqoriroq qoidaga xizmat qiladi. Element yuqori qoidalarga xizmat qilmagandagina keraksiz.

### Emergent dizayn va uning chegarasi

Kitobning "Emergence" bobi bu qoidalarni yaxshi dizayn paydo bo'lishiga yordam beradigan oddiy qoidalar sifatida taqdim etadi: ularga doimiy amal qilsangiz, yaxshi dizayn asta-sekin "paydo bo'ladi". Bu XP falsafasining markaziy g'oyasi: katta oldindan loyihalash (Big Design Up Front) o'rniga kichik qadamlar va doimiy refaktoring.

Bu g'oya munozarali. John Ousterhout (5-darsda ko'rganimizdek) oldindan dizayn haqida o'ylashga ko'proq vazn beradi va TDD kabi kichik qadamli usullar ba'zan taktik dasturlashga olib kelishini aytadi (65-dars). Ikkala tomon ham dizayn muhimligiga qo'shiladi. Farq qachon va qancha o'ylashda: Beck va Martin kichik qadamlarda doimiy, Ousterhout esa modul interfeyslarini oldindan chuqurroq o'ylashni qo'llaydi.

Muvozanatli xulosa: to'rt qoida **mahalliy** dizayn uchun (funksiya, klass, kichik modul) juda yaxshi ishlaydi. **Global** tuzilma uchun (modullar chegarasi, ma'lumot modeli, API shartnomalari) faqat ular yetarli bo'lmasligi mumkin, chunki bunday qarorlarni keyinchalik refaktoring bilan o'zgartirish qimmat.

## Misol: to'rt qoida bilan review

Pull request'da quyidagi kod keldi (to'lov xizmati):

```ts
interface IPaymentFeeCalculator {
  calculate(amount: number, provider: string): number;
}

export class PaymentFeeCalculatorImpl implements IPaymentFeeCalculator {
  calculate(amount: number, provider: string): number {
    if (provider === "payme") {
      const f = amount * 0.01;
      return f < 500 ? 500 : f;
    }
    if (provider === "click") {
      const f = amount * 0.012;
      return f < 500 ? 500 : f;
    }
    if (provider === "uzum") {
      const f = amount * 0.009;
      return f < 300 ? 300 : f;
    }
    throw new Error("unknown");
  }
}
```

To'rt qoida bo'yicha review:

1. **Passes the tests.** Testlar bormi? PR'da yo'q. Bu birinchi izoh: qolgan o'zgarishlarni xavfsiz qilish uchun avval test kerak.
2. **Reveals intention.** `0.01`, `500` nima? Foiz va minimal komissiya ekanini taxmin qilish kerak. `provider: string` qaysi qiymatlar mumkinligini aytmaydi.
3. **No duplication.** "Foizni hisoblash va minimal komissiyagacha ko'tarish" naqshi uch marta takrorlangan. Bu bitta bilim: komissiya qoidasi.
4. **Fewest elements.** `IPaymentFeeCalculator` va `...Impl` - bitta implementatsiya, interfeys hech qanday qoidaga xizmat qilmaydi.

Refaktoringdan keyin:

```ts
type PaymentProvider = "payme" | "click" | "uzum";

type FeeRule = { rate: number; minFeeUzs: number };

const FEE_RULES: Record<PaymentProvider, FeeRule> = {
  payme: { rate: 0.01, minFeeUzs: 500 },
  click: { rate: 0.012, minFeeUzs: 500 },
  uzum: { rate: 0.009, minFeeUzs: 300 },
};

export function calculatePaymentFee(amountUzs: number, provider: PaymentProvider): number {
  const { rate, minFeeUzs } = FEE_RULES[provider];
  return Math.max(amountUzs * rate, minFeeUzs);
}
```

Va birinchi qoida uchun:

```ts
import { describe, expect, it } from "vitest";

describe("calculatePaymentFee", () => {
  it("applies the provider rate", () => {
    expect(calculatePaymentFee(1_000_000, "payme")).toBe(10_000);
  });

  it("never charges less than the provider minimum", () => {
    expect(calculatePaymentFee(10_000, "uzum")).toBe(300);
  });
});
```

Nima uchun bu tartibda: test birinchi, chunki u qolgan o'zgarishlarni xavfsiz qiladi. Keyin nomlar va tiplar (niyat), keyin takror (jadval), oxirida keraksiz interfeys. `throw new Error("unknown")` ham yo'qoldi, chunki union tip noma'lum provayderni kompilyatsiya vaqtida rad etadi. Bu yerda bitta element olib tashlanishi (runtime tekshiruv) yuqoriroq qoidaga (niyatni tip orqali ochish) xizmat qildi. Agar provayder nomi tashqi so'rovdan kelsa, chegara joyida uni parse qilish kerak bo'ladi (45-dars).

## Qachon qo'llamaslik kerak

- **Qoidalarni mexanik qo'llash.** "Takror yo'q" ni har bir o'xshash ikki qatorni birlashtirish deb tushunish noto'g'ri abstraksiyalarga olib keladi (8-dars). Takror qoidasi bilim haqida.
- **"Fewest elements" ni "eng qisqa kod" deb tushunish.** Bir qatorli zich ifoda kamroq element emas, kamroq niyat. Ikkinchi qoida to'rtinchidan ustun.
- **Testsiz muhitda.** Birinchi qoida bajarilmasa, qolgan uchtasi bo'yicha katta refaktoring xavfli. Avval xavfsizlik to'ri (79-dars, legacy kod).
- **Global arxitektura qarorlari.** Ma'lumotlar bazasi sxemasi, servislar orasidagi API, ommaviy kutubxona interfeysi - bularni "keyin refaktoring qilamiz" deb qoldirish qimmat. Bu yerda oldindan o'ylash (Ousterhout'ning strategik yondashuvi) muhimroq.
- **Interfeys texnik sabab bilan kerak bo'lganda.** NestJS'da DI token yoki test uchun almashtirish uchun interfeys bitta implementatsiyali bo'lsa ham birinchi qoidaga (testlar) xizmat qilishi mumkin. Bunday holatda u keraksiz element emas.

## Stack'da: TypeScript, NestJS, React

- **TypeScript tiplari ikkinchi qoidaga xizmat qiladi.** `Record<PaymentProvider, FeeRule>` kabi tiplar niyatni ochadi va bir vaqtda takrorni (har bir provayder uchun alohida tekshiruv) yo'qotadi.
- **NestJS'dagi interfeyslar.** NestJS'da TypeScript interfeyslari runtime'da yo'qoladi, shuning uchun DI uchun injection token yoki abstrakt klass kerak. Ularni faqat haqiqatan almashtirish (test yoki bir nechta implementatsiya) kerak bo'lganda qo'shing, aks holda konkret klassni to'g'ridan-to'g'ri inject qiling.
- **React'da to'rtinchi qoida.** Har bir kichik UI bo'lagi uchun alohida komponent, alohida fayl, alohida `index.ts` re-export - bu elementlar ko'pincha hech bir qoidaga xizmat qilmaydi. Komponent qayta ishlatilganda yoki niyatni ochganda ajrating.
- **Vitest/Jest bilan birinchi qoida.** Refaktoringdan oldin test yozish uchun katta framework kerak emas: bitta fayl, ikki-uch kutilgan natija. Bu xavfsizlik to'ri yetarli.

## Xulosa

- Beck'ning to'rt qoidasi: testlardan o'tadi, niyatni ochadi, takror yo'q, elementlar eng kam. Ular ustuvorlik tartibida.
- Testlar birinchi, chunki ular qolgan qoidalar bo'yicha refaktoringni xavfsiz qiladi.
- Fowler fikricha 2- va 3-qoida bir-birini to'ldiradi. Ular to'qnashsa, odatda yaxshiroq abstraksiya yoki takrorni saqlash kerak.
- To'rtinchi qoida yuqoridagi qoidalarga xizmat qilmaydigan elementlarni olib tashlaydi, lekin "eng qisqa kod" degani emas.
- Qoidalar mahalliy dizayn uchun kuchli. Global arxitektura qarorlari uchun ular oldindan o'ylashni almashtirmaydi.
