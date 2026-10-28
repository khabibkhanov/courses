---
n: 1
slug: clean-code-nima
title: "Clean code nima: ta'riflar va o'lchov"
summary: "Toza kodning bitta rasmiy ta'rifi yo'q. Bu darsda eng nufuzli mualliflarning ta'riflarini solishtiramiz va ularni bitta amaliy mezonga keltiramiz: kodni boshqa odam qanchalik tez va xavfsiz o'zgartira oladi."
duration: 30
sources:
  - id: cc1
    note: "1-bob \"Clean Code\": Stroustrup, Booch, Thomas, Feathers, Jeffries, Cunningham ta'riflari va \"We Are Authors\" bo'limi"
  - id: cc2
    note: "Qayta yozilgan nashrdagi toza kod ta'rifi va asosiy tamoyillar haqidagi boshlang'ich boblar"
  - id: aposd
    note: "2-bob \"The Nature of Complexity\": murakkablikning ta'rifi"
  - id: refactoring
    note: "1-bob: kod inson uchun yoziladi degan g'oya"
quiz:
  - q: "Ousterhout murakkablikni qanday ta'riflaydi?"
    options:
      - "Kodning qatorlar soni"
      - "Tizimni tushunish va o'zgartirishni qiyinlashtiradigan har qanday struktura xususiyati"
      - "Algoritmning vaqt murakkabligi (Big-O)"
      - "Bog'liqliklar (dependency) soni"
    answer: 1
    explain: "Ousterhout uchun murakkablik - bu algoritmik emas, balki tuzilmaviy tushuncha: tizimni tushunish va o'zgartirishni qiyinlashtiradigan hamma narsa. Qatorlar soni yoki dependency soni faqat uning ba'zi belgilari bo'lishi mumkin."
  - q: "Martinning kitobidagi \"o'qish va yozish nisbati\" g'oyasidan qaysi amaliy xulosa kelib chiqadi?"
    options:
      - "Kodni o'qishni osonlashtirish yozishni ham tezlashtiradi, chunki yozish vaqtining katta qismi mavjud kodni o'qishga ketadi"
      - "Kodni tezroq yozish uchun qisqa nomlar ishlatish kerak"
      - "Kod sharhlarini ko'paytirish kerak"
      - "Kod review'ni bekor qilish kerak"
    answer: 0
    explain: "Martin yangi kod yozayotganda ham dasturchi vaqtining asosiy qismini eski kodni o'qishga sarflashini ta'kidlaydi. Shuning uchun o'qilishi oson kod yozish tezligini ham oshiradi."
  - q: "Quyidagilardan qaysi biri toza kodning eng yaxshi amaliy o'lchovi?"
    options:
      - "Linter hech qanday ogohlantirish bermasligi"
      - "Barcha funksiyalar 5 qatordan kam bo'lishi"
      - "Kodni ko'rmagan malakali dasturchi o'zgarishni qancha tez va xatosiz kirita olishi"
      - "Test coverage 100% bo'lishi"
    answer: 2
    explain: "Linter, funksiya uzunligi va coverage - bu vositalar yoki proksi o'lchovlar. Asl maqsad - o'zgartirish narxini pasaytirish. Uni eng yaxshi ko'rsatadigan narsa yangi odamning kodni tushunib, xavfsiz o'zgartira olishidir."
  - q: "Michael Feathers toza kodni qanday bir g'oya bilan ifodalaydi?"
    options:
      - "Kod tez ishlashi kerak"
      - "Kod hech qachon o'zgarmasligi kerak"
      - "Kod iloji boricha qisqa bo'lishi kerak"
      - "Kodni unga g'amxo'rlik qiladigan odam yozgani ko'rinib turadi"
    answer: 3
    explain: "Feathers ta'rifining markazida g'amxo'rlik turadi: unda yaxshilash uchun aniq bir narsa qolmagan, muallif har bir detalni o'ylab chiqqan."
  - q: "Nima uchun \"ishlayapti-ku\" toza kod uchun yetarli mezon emas?"
    options:
      - "Chunki ishlayotgan kod har doim sekin bo'ladi"
      - "Chunki dasturning qiymati faqat bugungi xatti-harakatda emas, balki uni ertaga arzon o'zgartirish imkoniyatida ham"
      - "Chunki kompilyator xato bermasligi kafolat emas"
      - "Chunki foydalanuvchilar kodni o'qiydi"
    answer: 1
    explain: "Dastur ikki xil qiymatga ega: bugungi xatti-harakat va kelajakdagi o'zgaruvchanlik. Ishlayotgan, lekin o'zgartirib bo'lmaydigan kod ikkinchi qiymatni yo'qotgan."
task:
  title: "Mavjud koddagi o'zgartirish narxini baholash"
  prompt: |
    Quyidagi funksiya ishlaydi. Unga yangi talab kelgan: **VIP mijozlar uchun yetkazib berish narxi har doim 0 bo'lsin**.

    1. Avval kodni o'zgartirmasdan, o'zgarishni qayerga va qanday kiritishingizni yozing. Bunga qancha vaqt ketdi?
    2. Keyin kodni shunday qayta yozingki, yangi talab bitta aniq joyga tushsin va funksiya nima qilishi nomlardan ko'rinib tursin.
    3. Xatti-harakat o'zgarmaganini tekshiring: eski misollar bir xil natija berishi kerak.
  lang: ts
  starter: |
    export function calc(o: any) {
      let t = 0;
      for (let i = 0; i < o.items.length; i++) {
        t += o.items[i].p * o.items[i].q;
      }
      if (t > 500000) {
        return t;
      } else {
        if (o.c === "TAS") return t + 15000;
        return t + 35000;
      }
    }
  solution: |
    type OrderItem = { price: number; quantity: number };
    type Order = { items: OrderItem[]; city: string; isVip: boolean };

    const FREE_DELIVERY_THRESHOLD = 500_000;
    const DELIVERY_FEE_TASHKENT = 15_000;
    const DELIVERY_FEE_REGIONS = 35_000;

    export function calculateOrderTotal(order: Order): number {
      const subtotal = calculateSubtotal(order.items);
      return subtotal + calculateDeliveryFee(order, subtotal);
    }

    function calculateSubtotal(items: OrderItem[]): number {
      return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    function calculateDeliveryFee(order: Order, subtotal: number): number {
      if (order.isVip) return 0;
      if (subtotal > FREE_DELIVERY_THRESHOLD) return 0;
      return order.city === "TAS" ? DELIVERY_FEE_TASHKENT : DELIVERY_FEE_REGIONS;
    }
  solutionNotes: |
    - Yangi talab endi bitta joyga tushdi: `calculateDeliveryFee` ichidagi bitta qator.
    - `any` o'rniga aniq tip: endi `o.c` nima ekanini taxmin qilish shart emas.
    - Magic number'lar nomlangan konstantaga aylandi, ular biznes qoidalarini o'zi tushuntiradi.
    - Funksiyani haddan tashqari maydalamadik: ikkita kichik, ma'noli funksiya yetarli. Har bir qadam uchun alohida funksiya ochish keyingi darslarda muhokama qilinadigan "sayoz modul" muammosini keltirib chiqaradi.
    - Muhim: refaktoringdan oldin eski xatti-harakatni bir nechta misol bilan qayd qiling (masalan, 3 ta buyurtma va kutilgan natija), aks holda "toza" kod jimgina boshqa natija berishi mumkin.
  checklist:
    - "Yangi talab bitta aniq joyda o'zgarish bilan amalga oshdi"
    - "any tipi qolmadi, kirish ma'lumotining shakli tipda ko'rinadi"
    - "Raqamlar nomlangan konstantalarga aylandi"
    - "Eski misollar uchun natija o'zgarmaganini tekshirdim"
    - "Funksiyalarni keraksiz darajada maydalamadim"
---

## Muammo

Ko'p jamoalarda kod ikki marta yoziladi. Birinchi marta - u ishlashi uchun. Ikkinchi marta - u bilan ishlash imkonsiz bo'lib qolganda, "noldan qayta yozamiz" degan qaror bilan. Ikkinchi yozish odatda birinchisidan qimmatga tushadi va ko'pincha xuddi shu muammoga qaytib keladi.

Sabab oddiy: dasturning qiymati faqat bugungi xatti-harakatida emas. Robert Martin (*Clean Architecture* kitobida) buni dasturning ikki qiymati deb ataydi: **xatti-harakat** (dastur hozir nima qiladi) va **struktura** (uni ertaga qanchalik oson o'zgartirish mumkin). Biznes talablari doimo o'zgaradi, demak ikkinchi qiymat vaqt o'tishi bilan birinchisidan muhimroq bo'lib boradi. "Ishlayapti-ku" degan baho faqat birinchi qiymatni o'lchaydi.

Martin kitobining boshida mashhur hazilni keltiradi: kod sifatining yagona to'g'ri o'lchovi - code review paytida daqiqasiga aytilgan "WTF"lar soni. Hazil bo'lsa ham, unda muhim haqiqat bor: kod sifati kompyuter uchun emas, uni o'qiyotgan odam uchun o'lchanadi.

## Asosiy g'oya

Toza kodning bitta rasmiy ta'rifi yo'q. *Clean Code* kitobining 1-bobida Martin bir necha tajribali dasturchidan bu savolni so'raydi va javoblar turlicha bo'ladi. Ularni qisqacha (o'z so'zlarimiz bilan) ko'rib chiqamiz:

- **Bjarne Stroustrup** (C++ muallifi): toza kod nafis va samarali, mantig'i to'g'ridan-to'g'ri, xatolar yashirinadigan joy qolmagan, bog'liqliklar minimal va xatolarni boshqarish to'liq. U bitta ishni yaxshi qiladi.
- **Grady Booch**: toza kod oddiy va to'g'ridan-to'g'ri, yaxshi yozilgan nasr kabi o'qiladi va muallif niyatini yashirmaydi.
- **Dave Thomas**: toza kodni muallifdan boshqa dasturchi ham o'qiy va yaxshilay oladi, unda testlar bor, nomlar ma'noli va bog'liqliklar aniq.
- **Michael Feathers**: toza kodni unga g'amxo'rlik qiladigan odam yozgani ko'rinib turadi. Uni yaxshilash uchun aniq bir narsa qolmagan.
- **Ron Jeffries**: Kent Beckning oddiy dizayn qoidalariga tayanadi: barcha testlar o'tadi, takror yo'q, dizayndagi g'oyalar ochiq ifodalangan, ortiqcha element yo'q. (Bu qoidalarni 7-darsda batafsil ko'ramiz.)
- **Ward Cunningham**: har bir funksiyani o'qiganingizda, u deyarli siz kutgan ishni qilsa - bu toza kod.

Bu ta'riflardagi umumiy ip shundan iborat: **toza kod - bu boshqa odam uchun tushunarli va xavfsiz o'zgartiriladigan kod**. "Boshqa odam" deganda olti oydan keyingi o'zingiz ham kiradi.

Martin Fowler *Refactoring* kitobida xuddi shu g'oyani boshqa tomondan aytadi: kompyuter tushunadigan kodni har qanday odam yoza oladi, yaxshi dasturchi esa odam tushunadigan kod yozadi.

## Chuqurroq: o'lchovni aniq qilish

"Tushunarli" degan so'z subyektiv. Uni amaliy o'lchovga aylantirish uchun John Ousterhoutning *A Philosophy of Software Design* kitobidagi ta'rif foydali. Ousterhout murakkablikni shunday ta'riflaydi: **tizimni tushunish va o'zgartirishni qiyinlashtiradigan, uning tuzilmasi bilan bog'liq har qanday narsa**. Toza kodni esa shu murakkablik past bo'lgan kod deb tushunish mumkin.

Bu ta'rifning uchta muhim jihati bor:

1. **U algoritmik emas.** Big-O murakkabligi bu yerda gap emas. O(n) algoritm juda murakkab yozilgan bo'lishi, O(n²) esa juda oddiy bo'lishi mumkin.
2. **U o'zgarish orqali o'lchanadi.** Kodni faqat o'qish emas, unga o'zgarish kiritish narxi muhim. Hech kim tegmaydigan murakkab kod amalda kam zarar keltiradi. Har hafta o'zgaradigan murakkab kod esa jamoaning eng qimmat muammosi.
3. **U o'quvchiga nisbiy.** Ousterhout ta'kidlaydiki, murakkablikni yozuvchi emas, o'quvchi sezadi. Siz yozgan kod sizga oddiy tuyulsa, bu hech narsani isbotlamaydi.

Shu asosda kursning ishchi ta'rifini beramiz:

> Kod qanchalik toza ekanini ko'rsatadigan eng yaxshi amaliy savol: **kodni ilgari ko'rmagan malakali dasturchi unga to'g'ri o'zgarish kiritishi uchun qancha vaqt va qancha xatarga duch keladi?**

Bu savoldan bir nechta kuzatiladigan belgilar kelib chiqadi:

- **Lokallik.** Bitta talab o'zgarganda nechta faylga tegish kerak? Agar "VIP mijozlarga bepul yetkazib berish" degan talab 6 ta faylni o'zgartirishni talab qilsa, bu ishonchli belgi.
- **Bashorat qilinuvchanlik.** Funksiya nomi va tipini ko'rib, ichini o'qimasdan uning xatti-harakatini taxmin qila olasizmi? Cunninghamning "siz kutgan ishni qiladi" mezoni aynan shu.
- **Xavfsizlik to'ri.** O'zgarish biror narsani buzsa, buni kim aytadi: test, tip tekshiruvchi yoki production'dagi mijoz?

### O'qish va yozish nisbati

Martin "We Are Authors" bo'limida muhim kuzatuvni keltiradi: yangi kod yozayotganda ham dasturchi vaqtining katta qismini mavjud kodni o'qishga sarflaydi. U o'qish va yozish nisbatini 10 ga 1 dan ancha yuqori deb baholaydi. Raqamning aniq qiymati munozarali (bu o'lchangan statistika emas, muallifning tajribaviy bahosi), lekin yo'nalishi bilan hamma kelishadi: o'qish yozishdan ko'p. Undan chiqadigan xulosa paradoksal ko'rinadi: **kodni tezroq yozish uchun uni o'qishni osonlashtirish kerak**.

### Tozalik vosita, maqsad emas

Bu kursda ko'plab qoidalarni o'rganamiz: qisqa funksiyalar, ma'noli nomlar, SOLID, testlar. Ularning hech biri o'z-o'zidan maqsad emas. Har bir qoida yuqoridagi asosiy savolga xizmat qilganda foydali va xizmat qilmaganda zararli. Masalan, funksiyani 20 ta kichik bo'lakka bo'lish ba'zan o'qishni osonlashtiradi, ba'zan esa o'quvchini 20 ta joyga sakrashga majbur qiladi. Shuning uchun har bir darsda "Qachon qo'llamaslik kerak" bo'limi bor.

## Misol: yomon va yaxshi

Quyidagi kod ishlaydi va testlardan o'tadi:

```ts
export function proc(d: any[], f: number) {
  const r = [];
  for (const x of d) {
    if (x.s === 1 && (f === 0 || x.t === f)) {
      r.push({ ...x, v: x.p * 1.12 });
    }
  }
  return r;
}
```

Endi talab keldi: "QQS stavkasi 12% emas, 15% bo'ladi va arxivlangan mahsulotlar ham chiqmasin". Qaysi qator QQS? `s === 1` arxivlanmagan degani mi yoki faol degani mi? `f === 0` nimani bildiradi? Bularni bilish uchun chaqiruvchi kodni, ma'lumotlar bazasi sxemasini va ehtimol muallifni topish kerak. O'zgarish narxining asosiy qismi aynan shu qidiruvga ketadi.

Xuddi shu xatti-harakat, o'quvchi uchun yozilgan:

```ts
type ProductStatus = "active" | "archived";

type Product = {
  id: string;
  status: ProductStatus;
  categoryId: number;
  price: number;
};

type PricedProduct = Product & { priceWithVat: number };

const VAT_RATE = 0.12;
const ALL_CATEGORIES = 0;

export function listActiveProductsWithVat(
  products: Product[],
  categoryId: number = ALL_CATEGORIES,
): PricedProduct[] {
  return products
    .filter((p) => p.status === "active")
    .filter((p) => categoryId === ALL_CATEGORIES || p.categoryId === categoryId)
    .map((p) => ({ ...p, priceWithVat: p.price * (1 + VAT_RATE) }));
}
```

Nima o'zgardi va nima uchun:

- **Nomlar niyatni aytadi.** `listActiveProductsWithVat` funksiya nima qaytarishini chaqiruvchi tomonda ham tushuntiradi.
- **Tiplar savollarga javob beradi.** `status: "active" | "archived"` bo'lgani uchun `s === 1` degan jumboq yo'qoldi.
- **Biznes qoidalari nomlangan.** QQS stavkasini o'zgartirish uchun qidirish shart emas, `VAT_RATE` bitta joyda.
- **Hajm deyarli o'zgarmadi.** Toza kod uzunroq bo'lishi shart emas. Bu yerda qo'shilgan qatorlarning hammasi tip va konstantalar: ular hujjat vazifasini bajaradi.

E'tibor bering: biz funksiyani `filterActive`, `filterByCategory`, `applyVat` kabi uchta eksport qilinadigan funksiyaga bo'lmadik. Bu holatda ular hech qayerda qayta ishlatilmaydi va o'quvchini fayl bo'ylab sakrashga majbur qiladi. Qachon bo'lish kerakligini 21-darsda batafsil muhokama qilamiz.

## Qachon qo'llamaslik kerak

"Tozalikka" sarflangan vaqt ham xarajat. Quyidagi holatlarda uni cheklash oqilona:

- **Bir martalik kod.** Ma'lumotni bir marta ko'chirish uchun yozilgan skript, prototip yoki g'oyani tekshirish uchun eksperiment. Agar kod haqiqatan ham tashlab yuborilsa, uni sayqallash isrof. Xavf boshqa joyda: "vaqtinchalik" kod ko'pincha production'ga o'tib qoladi. Shuning uchun uni aniq belgilang va o'chirish rejasini qiling.
- **Hali tushunilmagan muammo.** Domen hali noaniq bo'lsa, abstraksiyalarni oldindan qurish xato yo'nalishda "toza" kod beradi. Avval ishlaydigan oddiy yechim, keyin naqsh paydo bo'lganda refaktoring (Kent Beck g'oyasi: avval ishlasin, keyin to'g'ri bo'lsin, keyin tez bo'lsin).
- **Performance-kritik ichki sikllar.** Ba'zi joylarda abstraksiya qatlamlari o'lchanadigan narxga ega. Bu kamdan-kam holat va faqat profiling bilan isbotlangandan keyin qaror qilinadi (99-dars).
- **Qoida o'zi maqsadga aylanganda.** "Funksiya 5 qatordan oshmasin" degan qoidaga ko'r-ko'rona amal qilish ko'pincha kodni yomonlashtiradi. Bu tanqidni 10-darsda batafsil ko'ramiz.

## Stack'da: TypeScript, Node.js, React

Sizning stack'ingizda toza kodning eng arzon vositalari allaqachon qo'lingizda:

- **TypeScript `strict` rejimi.** `any` tipi o'quvchidan barcha savollarni yashiradi. `strict: true` va `unknown` bilan ishlash (91-dars) toza kodning yarmini avtomatik beradi.
- **NestJS'dagi DTO'lar.** Controller kirishidagi DTO klasslari API shartnomasini hujjatlaydi. `any` qabul qiladigan controller - bu yuqoridagi `proc(d: any[])` ning backend versiyasi.
- **React komponent nomlari.** `Card2`, `NewList` kabi nomlar o'rniga domen nomlari (`VehicleStatusCard`, `FuelEventsTable`) komponent daraxtini o'qiladigan qiladi.

## Xulosa

- Toza kodning yagona ta'rifi yo'q, lekin barcha nufuzli ta'riflar bitta g'oyaga keladi: kodni boshqa odam tushunadi va xavfsiz o'zgartira oladi.
- Ousterhout ta'rifi bo'yicha murakkablik - tizimni tushunish va o'zgartirishni qiyinlashtiradigan har qanday tuzilmaviy xususiyat. U o'quvchi tomonidan seziladi.
- Amaliy o'lchov: yangi odamning to'g'ri o'zgarish kiritishi uchun ketadigan vaqt va xatar.
- Kod yozishdan ko'ra ko'proq o'qiladi, shuning uchun o'qishni osonlashtirish yozishni ham tezlashtiradi.
- Barcha qoidalar shu maqsadga xizmat qiladigan vositalar. Har bir qoidani "bu o'zgartirish narxini pasaytiradimi?" savoli bilan tekshiring.
