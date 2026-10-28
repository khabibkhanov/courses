---
n: 69
slug: frontend-testlari
title: "React testlari: implementatsiya detallarisiz"
summary: "React komponentining testi state nomi o'zgarganda yiqilsa, lekin tugma ishlamay qolganda o'tsa, u testni emas, implementatsiyani tekshiradi. Bu darsda Testing Library tamoyillarini, Kent C. Dodds tasvirlagan ikki foydalanuvchi g'oyasini, query ustuvorligini va refaktoringga chidamli React testlarini ko'rib chiqamiz."
duration: 40
sources:
  - id: testing-library-principles
    note: "Guiding Principles: DOM node'lar bilan ishlash, foydalanuvchi qanday ishlatsa shunday test qilish; query'lar ustuvorligi (Queries > About) va user-event qo'llanmasi"
  - id: dodds-implementation-details
    note: "Implementatsiya detallari ta'rifi, yolg'on salbiy va yolg'on ijobiy natijalar, end-user va developer-user, Accordion misoli (openIndex holati)"
quiz:
  - q: "Accordion testi komponent state'idagi `openIndex` qiymatini tekshiradi. Dasturchi state'ni `openIndexes` massiviga o'zgartirdi, komponent avvalgidek ishlaydi, test yiqildi. Bu qanday natija?"
    options:
      - "Yolg'on ijobiy (false positive)"
      - "To'g'ri natija, chunki kod o'zgardi"
      - "Yolg'on salbiy (false negative): kod to'g'ri, lekin test yiqildi, chunki u implementatsiya detaliga bog'langan"
      - "Flaky test"
    answer: 2
    explain: "Dodds bu holatni refaktoringdagi yolg'on salbiy natija deb ataydi. Foydalanuvchi uchun hech narsa o'zgarmagan, lekin test ichki state nomiga tayangan. Bunday testlar refaktoringni qimmatlashtiradi."
  - q: "Dodds bo'yicha React komponentining 'foydalanuvchilari' kimlar?"
    options:
      - "Faqat end-user"
      - "End-user (ekranni ko'radi va bosadi) va developer-user (komponentga props beradi). Test ikkalasi kabi ishlashi kerak"
      - "Faqat QA muhandisi"
      - "End-user, developer-user va test"
    answer: 1
    explain: "Dodds ikki foydalanuvchini ajratadi. State yoki instance metodlariga kiradigan test uchinchi 'foydalanuvchi'ni yaratadi - testning o'zi, va Dodds ta'kidlaydiki, uni hech kim qadrlamaydi."
  - q: "Testing Library hujjatidagi query ustuvorligi bo'yicha qaysi query birinchi tanlanishi kerak?"
    options:
      - "`getByRole` va boshqa hamma uchun ochiq query'lar (label, text)"
      - "`getByTestId`"
      - "`container.querySelector('.btn-primary')`"
      - "`getByTitle`"
    answer: 0
    explain: "Ustuvorlik: avval hamma uchun ochiq query'lar (getByRole, getByLabelText, getByPlaceholderText, getByText, getByDisplayValue), keyin semantik (getByAltText, getByTitle), oxirida getByTestId. CSS selektorlari ro'yxatda umuman yo'q, chunki foydalanuvchi klass nomlarini ko'rmaydi."
  - q: "Forma yuborilgandan keyin server javobi kelgach 'Saqlandi' xabari chiqadi. Uni qanday kutish kerak?"
    options:
      - "`getByText('Saqlandi')` darhol"
      - "`await new Promise(r => setTimeout(r, 2000))`"
      - "`queryByText('Saqlandi')` va null emasligini tekshirish"
      - "`await screen.findByText('Saqlandi')`"
    answer: 3
    explain: "findBy query'lari elementni kutadi (standart 1000 ms) va topilganda resolve qiladi. getBy darhol tekshiradi va hali paydo bo'lmagan elementda yiqiladi. Qat'iy setTimeout esa sekin va beqaror, queryBy faqat element yo'qligini tekshirish uchun."
  - q: "Nega `fireEvent.click` o'rniga `user-event` tavsiya qilinadi?"
    options:
      - "fireEvent React 18'da ishlamaydi"
      - "user-event to'liq o'zaro ta'sirni simulyatsiya qiladi: bir nechta hodisalar va brauzerdagi kabi tekshiruvlar (masalan, yashirin elementni bosmaydi, disabled maydonga yozmaydi)"
      - "user-event tezroq"
      - "fireEvent faqat Enzyme bilan ishlaydi"
    answer: 1
    explain: "fireEvent bitta DOM hodisasini yuboradi. user-event esa real foydalanuvchi harakatiga yaqin ketma-ketlikni beradi va brauzer ruxsat bermaydigan harakatlarni rad etadi. Bu testni foydalanuvchi tajribasiga yaqinlashtiradi."
  - q: "Komponent ichidagi `useVehicleFilter` hook'ini `vi.mock` bilan almashtirib, komponent faqat hook qaytargan qiymatni render qilishini tekshirish - bu qanday yondashuv?"
    options:
      - "Implementatsiya detalini test qilish: komponent qaysi hook'dan foydalanishi ichki qaror, hook o'zgarsa yoki inline qilinsa test buziladi"
      - "Eng to'g'ri yondashuv, chunki izolyatsiya maksimal"
      - "Testing Library tavsiya qilgan usul"
      - "Bu integratsion test"
    answer: 0
    explain: "Komponent qaysi hook bilan tuzilgani foydalanuvchiga ko'rinmaydi. Bunday mock testni ichki tuzilmaga bog'laydi. Odatda tashqi chegarani (tarmoq so'rovi) almashtirib, komponent va hook'ni birga test qilish yaxshiroq. Hook murakkab umumiy kutubxona bo'lsa, uni alohida renderHook bilan testlash mumkin."
task:
  title: "Implementatsiyaga bog'langan React testini qayta yozish"
  prompt: |
    Quyidagi komponent transport parki dashboard'ida mashinalar ro'yxatini holat bo'yicha filtrlaydi. Test komponentning ichki tuzilishini tekshiradi.

    1. Testdagi har bir tasdiq foydalanuvchi uchun ko'rinadigan natijami yoki implementatsiyami - ajrating.
    2. Testni React Testing Library va user-event bilan qayta yozing: faqat role, label va text orqali.
    3. Komponentda accessibility kamchiligi bo'lsa (masalan, label yo'q), uni tuzating: bu ham testlanuvchanlikni yaxshilaydi.
    4. Kamida 3 ta xatti-harakatni tekshiring: standart holatda hamma mashinalar, filtr tanlanganda faqat mos mashinalar, natija bo'sh bo'lganda xabar.
  lang: tsx
  starter: |
    // VehicleList.tsx
    import { useState } from "react";

    export type Vehicle = { plate: string; status: "moving" | "parked" | "offline" };

    export function VehicleList({ vehicles }: { vehicles: Vehicle[] }) {
      const [filter, setFilter] = useState<"all" | Vehicle["status"]>("all");
      const visible = filter === "all" ? vehicles : vehicles.filter((v) => v.status === filter);

      return (
        <div>
          <select className="status-filter" value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
            <option value="all">Hammasi</option>
            <option value="moving">Harakatda</option>
            <option value="parked">To'xtagan</option>
            <option value="offline">Aloqasiz</option>
          </select>
          <ul>
            {visible.map((v) => (
              <li key={v.plate} className={`vehicle vehicle--${v.status}`}>{v.plate}</li>
            ))}
          </ul>
        </div>
      );
    }

    // VehicleList.test.tsx
    import { fireEvent, render } from "@testing-library/react";
    import { VehicleList } from "./VehicleList";

    const vehicles = [
      { plate: "01A123BC", status: "moving" as const },
      { plate: "10B456CD", status: "parked" as const },
    ];

    it("filters", () => {
      const { container } = render(<VehicleList vehicles={vehicles} />);
      expect(container.querySelectorAll("li.vehicle")).toHaveLength(2);
      fireEvent.change(container.querySelector(".status-filter")!, { target: { value: "moving" } });
      expect(container.querySelectorAll("li.vehicle--moving")).toHaveLength(1);
      expect(container.querySelectorAll("li.vehicle--parked")).toHaveLength(0);
    });
  solution: |
    // VehicleList.tsx
    import { useId, useState } from "react";

    export type Vehicle = { plate: string; status: "moving" | "parked" | "offline" };
    type StatusFilter = "all" | Vehicle["status"];

    const FILTER_LABELS: Record<StatusFilter, string> = {
      all: "Hammasi",
      moving: "Harakatda",
      parked: "To'xtagan",
      offline: "Aloqasiz",
    };

    export function VehicleList({ vehicles }: { vehicles: Vehicle[] }) {
      const [filter, setFilter] = useState<StatusFilter>("all");
      const selectId = useId();
      const visible = filter === "all" ? vehicles : vehicles.filter((v) => v.status === filter);

      return (
        <section aria-label="Mashinalar">
          <label htmlFor={selectId}>Holat</label>
          <select
            id={selectId}
            value={filter}
            onChange={(e) => setFilter(e.target.value as StatusFilter)}
          >
            {(Object.keys(FILTER_LABELS) as StatusFilter[]).map((key) => (
              <option key={key} value={key}>
                {FILTER_LABELS[key]}
              </option>
            ))}
          </select>
          {visible.length === 0 ? (
            <p>Bu holatda mashina yo'q</p>
          ) : (
            <ul>
              {visible.map((v) => (
                <li key={v.plate}>{v.plate}</li>
              ))}
            </ul>
          )}
        </section>
      );
    }

    // VehicleList.test.tsx
    import { render, screen, within } from "@testing-library/react";
    import userEvent from "@testing-library/user-event";
    import { describe, expect, it } from "vitest";
    import { VehicleList, type Vehicle } from "./VehicleList";

    const vehicles: Vehicle[] = [
      { plate: "01A123BC", status: "moving" },
      { plate: "10B456CD", status: "parked" },
    ];

    function visiblePlates(): string[] {
      const list = screen.queryByRole("list");
      if (!list) return [];
      return within(list).getAllByRole("listitem").map((li) => li.textContent ?? "");
    }

    describe("VehicleList", () => {
      it("standart holatda barcha mashinalarni ko'rsatadi", () => {
        render(<VehicleList vehicles={vehicles} />);

        expect(visiblePlates()).toEqual(["01A123BC", "10B456CD"]);
      });

      it("holat tanlanganda faqat shu holatdagi mashinalarni ko'rsatadi", async () => {
        const user = userEvent.setup();
        render(<VehicleList vehicles={vehicles} />);

        await user.selectOptions(screen.getByLabelText("Holat"), "Harakatda");

        expect(visiblePlates()).toEqual(["01A123BC"]);
      });

      it("mos mashina bo'lmasa xabar ko'rsatadi", async () => {
        const user = userEvent.setup();
        render(<VehicleList vehicles={vehicles} />);

        await user.selectOptions(screen.getByLabelText("Holat"), "Aloqasiz");

        expect(screen.getByText("Bu holatda mashina yo'q")).toBeInTheDocument();
        expect(visiblePlates()).toEqual([]);
      });
    });
  solutionNotes: |
    - Starter'dagi barcha tasdiqlar CSS klasslariga tayangan (`li.vehicle--moving`). Bu implementatsiya: dizayner klassni o'zgartirsa, test yiqiladi, foydalanuvchi esa hech narsa sezmaydi. Bundan tashqari, test qaysi raqamlar ko'rinishini umuman tekshirmagan.
    - Yangi testlar foydalanuvchi ko'radigan narsani tekshiradi: label orqali select, ro'yxat elementlari matni, bo'sh holat xabari.
    - Select'da label yo'q edi: ekran o'quvchi foydalanuvchi uchun bu tushunarsiz maydon. `getByLabelText` ishlatish uchun label qo'shildi va bu bir vaqtda accessibility muammosini tuzatdi. Testing Library query ustuvorligi aynan shunday ta'sir qiladi.
    - `user.selectOptions` foydalanuvchi ko'radigan option matnini qabul qiladi. `fireEvent.change` esa value'ni to'g'ridan-to'g'ri o'rnatardi.
    - `visiblePlates` - domenga xos test yordamchisi: u ham faqat role orqali ishlaydi.
    - `toBeInTheDocument` uchun `@testing-library/jest-dom` setup faylida ulangan bo'lishi kerak (Vitest'da `@testing-library/jest-dom/vitest`).
  checklist:
    - "Testlarda CSS klass, container.querySelector yoki state'ga murojaat yo'q"
    - "Elementlar role, label yoki text orqali topiladi"
    - "Harakatlar user-event orqali (userEvent.setup) bajariladi"
    - "Bo'sh holat xabari tekshirilgan"
    - "Komponentga label qo'shilib, accessibility yaxshilangan"
---

## Muammo

React loyihasida komponent testlari ko'pincha ikki holatdan birida bo'ladi. Birinchisi: testlar deyarli yo'q, chunki "UI tez-tez o'zgaradi, testlar buziladi". Ikkinchisi: testlar ko'p, lekin ular haqiqatan ham har o'zgarishda buziladi. Ular komponentning state'ini, ichki funksiyalarini, CSS klasslarini, bola komponentlar soni va propslarini tekshiradi. Dizayner tugmaning klassini o'zgartirsa - 12 ta test yiqiladi. Dasturchi class komponentni funksiyaga o'tkazsa - butun fayl qayta yoziladi.

Ikkinchi holat birinchisiga olib keladi: jamoa bunday testlardan charchaydi va ularni o'chiradi. Lekin muammo testlarning o'zida emas, ular **nimani** tekshirayotganida.

Kent C. Dodds *Testing Implementation Details* maqolasida bu muammoni aniq ta'riflaydi va uning ikki yuzini ko'rsatadi: bunday testlar to'g'ri kodda yiqiladi va noto'g'ri kodda o'tadi. Ya'ni ular qimmat va ishonchsiz bir vaqtda.

## Asosiy g'oya

### Implementatsiya detallari nima

Dodds ta'rifi: implementatsiya detallari - kodingiz foydalanuvchilari odatda ishlatmaydigan, ko'rmaydigan va hatto bilmaydigan narsalar. Komponent state'ining nomi, ichki handler funksiyasi, qaysi hook ishlatilgani, CSS klass nomlari, DOM'ning aniq tuzilishi - bularning hammasi implementatsiya.

### Ikki xil yolg'on natija

Dodds o'z maqolasida Accordion komponenti misolida ikki muammoni ko'rsatadi:

- **Yolg'on salbiy (refaktoringda).** Test komponent state'idagi `openIndex` qiymatini tekshiradi. Dasturchi bir nechta bo'limni ochish imkoniyati uchun state'ni `openIndexes` massiviga o'zgartiradi. Komponent avvalgidek ishlaydi, lekin test yiqiladi.
- **Yolg'on ijobiy.** Test handler'ni to'g'ridan-to'g'ri chaqiradi va state o'zgarganini tekshiradi. Dasturchi tugmaning `onClick`ida xato qiladi (handler noto'g'ri ulanadi). Production'da accordion ochilmaydi, test esa o'tadi, chunki hech qaysi test tugmani bosmagan.

Birinchi muammo testlarni qimmat qiladi, ikkinchisi ularni foydasiz qiladi.

### Ikki foydalanuvchi

Dodds'ning asosiy g'oyasi: React komponentining ikki foydalanuvchisi bor. **End-user** - ekranda natijani ko'radi va u bilan o'zaro ta'sir qiladi (bosadi, yozadi, tanlaydi). **Developer-user** - komponentni ishlatadigan dasturchi, u komponentga props beradi. Test shu ikki foydalanuvchi kabi ishlashi kerak: props bilan render qilish va ekrandagi natija bilan o'zaro ta'sir qilish. State yoki instance metodlariga kiradigan test uchinchi "foydalanuvchi"ni yaratadi - testning o'zini, va Dodds ta'kidlaydiki, uni hech kim qadrlamaydi.

Dodds bu yondashuvni React Testing Library bilan ko'rsatadi: komponent props bilan render qilinadi, tugmalar bosiladi, ko'rinadigan kontent tekshiriladi. Bunday test, uning so'zlari bilan, state `openIndex`, `openIndexes` yoki boshqa istalgan nom bilan atalsa ham o'tadi. Shuning uchun u bunday testlarni refaktoringga do'stona deb ataydi: masalan, class komponentdan hook'larga o'tish testlarni o'zgartirmaydi.

### Testing Library tamoyillari

Testing Library hujjatidagi yo'naltiruvchi tamoyillar bu g'oyani kutubxona dizayniga aylantiradi. Uchta tamoyil:

1. Agar gap komponentlarni render qilish haqida bo'lsa, kutubxona komponent instansiyalari bilan emas, DOM node'lar bilan ishlashi kerak.
2. U ilova komponentlarini foydalanuvchi ishlatadigan tarzda test qilish uchun umuman foydali bo'lishi kerak.
3. Yordamchi implementatsiyalar va API'lar sodda va moslashuvchan bo'lishi kerak.

Va umumiy g'oya, 61-darsda ko'rgan Dodds jumlasi: test dasturdan foydalanishga qanchalik o'xshasa, shuncha ko'p ishonch beradi.

## Chuqurroq: query'lar, harakatlar va asinxronlik

### Query ustuvorligi

Testing Library hujjati elementlarni topish uchun ustuvorlik tartibini beradi:

1. **Hamma uchun ochiq:** `getByRole`, `getByLabelText`, `getByPlaceholderText`, `getByText`, `getByDisplayValue`. Bular ko'ruvchi foydalanuvchi ham, ekran o'quvchi (screen reader) foydalanuvchisi ham elementni qanday topishini aks ettiradi.
2. **Semantik:** `getByAltText`, `getByTitle`.
3. **Test ID:** `getByTestId`. Oxirgi chora, foydalanuvchi buni ko'rmaydi.

CSS selektorlari (`container.querySelector(".btn")`) bu ro'yxatda umuman yo'q. Muhim yon ta'sir: `getByRole` va `getByLabelText` faqat to'g'ri belgilangan HTML'da ishlaydi. Agar forma maydonida label bo'lmasa, test uni topa olmaydi. Shuning uchun bu query'lar accessibility'ni ham majburlaydi: test yozish qiyin bo'lsa, ehtimol ekran o'quvchi foydalanuvchisi uchun ham sahifa tushunarsiz.

### getBy, queryBy, findBy

Uch xil variant uch xil maqsad uchun:

- **`getBy...`** - element bo'lishi kutilganda. Topilmasa yoki bir nechta bo'lsa, xato tashlaydi.
- **`queryBy...`** - element **yo'qligini** tekshirish uchun. Topilmasa `null` qaytaradi.
- **`findBy...`** - asinxron o'zgarishdan keyin paydo bo'ladigan element uchun. Bu `getBy` va `waitFor` birikmasi, standart 1000 ms kutadi.

Keng tarqalgan xato: element yo'qligini `getBy` bilan tekshirishga urinish (u xato tashlaydi) yoki asinxron elementni `getBy` bilan darhol qidirish.

### user-event

`fireEvent` bitta DOM hodisasini yuboradi. `@testing-library/user-event` esa to'liq o'zaro ta'sirni simulyatsiya qiladi: bitta "bosish" bir nechta hodisani (pointer, mouse, focus, click) chaqiradi va yo'l-yo'lakay brauzerdagi kabi tekshiruvlar qiladi. Masalan, u yashirin elementni bosmaydi va disabled maydonga yozmaydi. v14 dagi tavsiya etilgan usul: test ichida, render'dan oldin `const user = userEvent.setup()`, keyin `await user.click(...)`, `await user.type(...)`. Hujjat `userEvent`ni `before`/`after` hook'larida ishlatmaslikni ham maslahat beradi.

### Nimani mock qilish kerak

React testlarida ham 66-darsdagi qoida ishlaydi: chegarani mock qiling, ichki tuzilmani emas. Komponentning bola komponentlarini, uning hook'larini yoki util funksiyalarini `vi.mock` bilan almashtirish testni ichki tuzilmaga bog'laydi. Odatda eng to'g'ri chegara - **tarmoq**: `fetch` yoki API klient. Mock Service Worker (MSW) kabi vositalar so'rovlarni tarmoq darajasida ushlaydi, shunda komponent, hook'lar, kesh va parsing real ishlaydi. Agar loyiha arxitekturasi API klientni props yoki context orqali bersa, testda fake klient berish ham yaxshi.

## Misol: haydovchi reytingi kartasi

Komponent haydovchi reytingini yuklaydi va "Batafsil" tugmasi bosilganda qoidabuzarliklar ro'yxatini ochadi.

```tsx
import { useEffect, useState } from "react";

export type Violation = { id: string; kind: string; points: number };
export type DriverScore = { name: string; score: number; violations: Violation[] };
export type LoadDriverScore = (driverId: string) => Promise<DriverScore>;

export function DriverScoreCard({ driverId, load }: { driverId: string; load: LoadDriverScore }) {
  const [data, setData] = useState<DriverScore | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    load(driverId).then((d) => {
      if (!cancelled) setData(d);
    });
    return () => {
      cancelled = true;
    };
  }, [driverId, load]);

  if (!data) return <p role="status">Yuklanmoqda...</p>;

  return (
    <article aria-label={`${data.name} reytingi`}>
      <h2>{data.name}</h2>
      <p>Reyting: {data.score}</p>
      <button aria-expanded={expanded} onClick={() => setExpanded((v) => !v)}>
        Batafsil
      </button>
      {expanded && (
        <ul aria-label="Qoidabuzarliklar">
          {data.violations.map((v) => (
            <li key={v.id}>
              {v.kind}: -{v.points}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
```

Implementatsiyaga bog'langan test (shunga o'xshashlari ko'p uchraydi):

```tsx
vi.mock("react", async (orig) => {
  const actual = await orig<typeof import("react")>();
  return { ...actual, useState: vi.fn(actual.useState) };
});

it("expands", async () => {
  const { container } = render(<DriverScoreCard driverId="d-1" load={loadStub} />);
  await waitFor(() => expect(container.querySelector("h2")).not.toBeNull());
  fireEvent.click(container.querySelector("button")!);
  expect(vi.mocked(useState)).toHaveBeenCalledTimes(4);
  expect(container.querySelectorAll("li")).toHaveLength(2);
});
```

`useState` chaqiruvlari soni - sof implementatsiya: state'ni `useReducer`ga o'tkazish testni buzadi. `querySelector("button")` sahifada ikkinchi tugma paydo bo'lsa noto'g'ri tugmani bosadi.

Foydalanuvchi ko'zi bilan:

```tsx
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DriverScoreCard, type DriverScore } from "./DriverScoreCard";

const aliyev: DriverScore = {
  name: "Aliyev Bekzod",
  score: 82,
  violations: [
    { id: "v1", kind: "Tezlikni oshirish", points: 10 },
    { id: "v2", kind: "Keskin tormozlash", points: 8 },
  ],
};
const loadAliyev = async () => aliyev;

describe("DriverScoreCard", () => {
  it("yuklangandan keyin haydovchi ismi va reytingini ko'rsatadi", async () => {
    render(<DriverScoreCard driverId="d-1" load={loadAliyev} />);

    expect(screen.getByRole("status")).toHaveTextContent("Yuklanmoqda");
    expect(await screen.findByRole("heading", { name: "Aliyev Bekzod" })).toBeInTheDocument();
    expect(screen.getByText("Reyting: 82")).toBeInTheDocument();
  });

  it("Batafsil bosilganda qoidabuzarliklar ro'yxatini ochadi", async () => {
    const user = userEvent.setup();
    render(<DriverScoreCard driverId="d-1" load={loadAliyev} />);
    const toggle = await screen.findByRole("button", { name: "Batafsil" });

    expect(screen.queryByRole("list", { name: "Qoidabuzarliklar" })).not.toBeInTheDocument();
    await user.click(toggle);

    const list = screen.getByRole("list", { name: "Qoidabuzarliklar" });
    expect(within(list).getAllByRole("listitem").map((li) => li.textContent)).toEqual([
      "Tezlikni oshirish: -10",
      "Keskin tormozlash: -8",
    ]);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });
});
```

Nima o'zgardi va nima uchun:

- **React'ning o'zi mock qilinmaydi.** Komponent qaysi hook'lardan foydalanishi testni qiziqtirmaydi. `useReducer`ga o'tish, custom hook ajratish yoki React Query'ga ko'chish testlarni buzmaydi.
- **Tarmoq chegarasi props orqali.** `load` funksiyasi - developer-user beradigan narsa. Testda u oddiy async stub. Agar komponent `fetch`ni to'g'ridan-to'g'ri chaqirsa, MSW bilan tarmoq darajasida ushlash kerak bo'lardi.
- **Query'lar role va accessible name orqali.** `getByRole("button", { name: "Batafsil" })` tugmani foydalanuvchi uni qanday ko'rsa, shunday topadi. Ikkinchi tugma qo'shilsa ham test to'g'ri tugmani bosadi.
- **Yo'qlik `queryBy` bilan.** Bosishdan oldin ro'yxat yo'qligi tekshiriladi, shunda test "ro'yxat har doim ko'rinadi" degan xatoni ham ushlaydi.
- **`aria-expanded` tekshirildi.** Bu implementatsiya emas: ekran o'quvchi foydalanuvchisi uchun aynan shu atribut tugma holatini aytadi.
- **Asinxronlik `findBy` bilan.** Qat'iy `setTimeout` yoki `act` bilan qo'lda o'rash yo'q.

## Qachon qo'llamaslik kerak

- **Vizual ko'rinish.** Ranglar, joylashuv, responsive tartib DOM testlarida tekshirilmaydi. Buning uchun vizual regressiya vositalari yoki qo'lda ko'rib chiqish kerak. Vocke ham layout'ni test qilishni alohida, qiyinroq vazifa deb ataydi.
- **Murakkab umumiy hook yoki kutubxona.** Agar hook ko'p komponentlarda ishlatiladigan mustaqil modul bo'lsa (masalan, `useDebouncedSearch`), uni `renderHook` bilan alohida test qilish o'rinli: uning developer-user'i - hook'ni chaqiradigan dasturchi.
- **Sof logika.** Narx hisoblash, sanalarni formatlash, filtrlash funksiyalari komponentdan tashqarida sof funksiya sifatida unit test oladi (67-dars). Ularning har bir chegaraviy holatini render orqali tekshirish ortiqcha.
- **Test ID'dan butunlay qochish.** Ba'zan elementni foydalanuvchi ko'radigan biror narsa bilan topib bo'lmaydi (masalan, kanvas ustidagi xarita yoki dinamik matnli grafik). Bunday holatda `data-testid` oqilona. Ustuvorlik - bu taqiq emas.
- **Brauzerga xos xatti-harakat.** jsdom real brauzer emas: layout, scroll, `IntersectionObserver`, haqiqiy fokus boshqaruvi cheklangan. Bunday narsalar uchun Playwright komponent testlari yoki Vitest browser mode yaxshiroq.

## Stack'da: Vitest, Jest, Next.js

- **Sozlash.** Vitest'da `environment: "jsdom"` (yoki `happy-dom`) va setup faylida `import "@testing-library/jest-dom/vitest"`. Jest'da `testEnvironment: "jsdom"` va `@testing-library/jest-dom`.
- **`screen` ishlating.** `render` qaytargan `container` o'rniga `screen.getByRole(...)`: test butun hujjatni foydalanuvchi kabi ko'radi.
- **ESLint.** `eslint-plugin-testing-library` va `eslint-plugin-jest-dom` keng tarqalgan xatolarni (container.querySelector, keraksiz act, noto'g'ri query varianti) avtomatik topadi.
- **Next.js server komponentlari.** Async server komponentlarni jsdom'da render qilish cheklangan. Ularning ichidagi logikani sof funksiyalarga ajrating, sahifani esa e2e (Playwright) bilan tekshiring. Client komponentlar odatdagidek RTL bilan.
- **Tarmoq.** MSW bilan `http.get("/api/vehicles", ...)` handler'lari: komponent, data-fetching kutubxonasi va kesh real ishlaydi, faqat server almashtiriladi.

## Xulosa

- Implementatsiya detallari - foydalanuvchi ko'rmaydigan narsalar: state nomlari, ichki funksiyalar, hook'lar, CSS klasslari.
- Bunday detallarni tekshiradigan testlar refaktoringda yolg'on yiqiladi va haqiqiy xatolarda yolg'on o'tadi.
- Komponentning ikki foydalanuvchisi bor: end-user va developer-user. Test props bilan render qiladi va ekran bilan o'zaro ta'sir qiladi.
- Query ustuvorligi: role, label, text, keyin semantik, oxirida test ID. Bu accessibility'ni ham yaxshilaydi.
- user-event to'liq o'zaro ta'sirni simulyatsiya qiladi, findBy asinxron elementlarni kutadi, queryBy yo'qlikni tekshiradi.
- Ichki tuzilmani emas, chegarani (tarmoq, props orqali berilgan klient) almashtiring.
