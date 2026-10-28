---
n: 92
slug: toza-react
title: "Toza React: komponentlar, state, effektlar"
summary: "React kodidagi chalkashlikning katta qismi uchta manbadan keladi: noto'g'ri chegaralangan komponentlar, ortiqcha yoki qarama-qarshi state va keraksiz useEffect. Bu darsda react.dev'ning rasmiy tamoyillari asosida ularni tartibga solamiz."
duration: 40
sources:
  - id: react-docs-thinking
    note: "Thinking in React: UI'ni komponent ierarxiyasiga bo'lish, minimal state'ni topish va uning joyini aniqlash, state ekanini aniqlaydigan uchta savol"
  - id: react-docs-state
    note: "Choosing the State Structure: bog'liq state'ni guruhlash, qarama-qarshilik, ortiqchalik, takror va chuqur ichma-ichlikdan qochish"
  - id: react-docs-effect
    note: "You Might Not Need an Effect: derived qiymatlar, key bilan reset, event handler va effekt farqi, effektlar zanjiri, fetch'da race condition"
quiz:
  - q: "Komponentda `const [filtered, setFiltered] = useState([])` va `useEffect(() => setFiltered(trips.filter(...)), [trips, query])` bor. Asosiy muammo nima?"
    options:
      - "useEffect dependency massivi noto'g'ri"
      - "Derived qiymat state'da saqlanmoqda: u ortiqcha render beradi va bir lahza eskirgan qiymat ko'rsatadi, render paytida hisoblash yetarli"
      - "filter metodi sekin, useMemo kerak"
      - "useState'ga boshlang'ich qiymat noto'g'ri berilgan"
    answer: 1
    explain: "react.dev bo'yicha props yoki state'dan hisoblab bo'ladigan narsa state emas. Effekt bilan sinxronlash avval eski qiymat bilan render, keyin yana bir render beradi. useMemo faqat hisoblash haqiqatan sekin bo'lsa kerak."
  - q: "`isSending` va `isSent` degan ikkita boolean state bor. React hujjati nimani tavsiya qiladi?"
    options:
      - "Ularni bitta obyektga birlashtirish: { isSending, isSent }"
      - "useReducer'ga o'tkazish"
      - "Ikkalasini ham saqlab, useEffect bilan bir-biriga moslash"
      - "Faqat to'g'ri qiymatlarni qabul qiladigan bitta status: 'typing' | 'sending' | 'sent'"
    answer: 3
    explain: "Ikki boolean bir vaqtda true bo'lishi mumkin, bu imkonsiz holat. Bitta status o'zgaruvchisi qarama-qarshilikni yo'qotadi. Obyektga birlashtirish qarama-qarshilikni saqlab qoladi."
  - q: "Foydalanuvchi profil sahifasida boshqa mashinaga o'tganda (vehicleId o'zgarganda) formadagi barcha local state tozalanishi kerak. Eng toza yo'l?"
    options:
      - "Komponentga key={vehicleId} berish"
      - "useEffect ichida vehicleId o'zgarganda har bir setState'ni chaqirish"
      - "Formani global store'ga ko'chirish"
      - "Sahifani window.location.reload() bilan yangilash"
    answer: 0
    explain: "key o'zgarganda React komponentni yangi instance sifatida yaratadi va uning hamda bolalarining state'ini tozalaydi. Effekt bilan reset avval eski state bilan render qiladi va yangi state qo'shilganda unutilishi oson."
  - q: "Savatga mahsulot qo'shilganda bildirishnoma ko'rsatish kerak. Kod `useEffect(() => { if (product.isInCart) showToast(); }, [product])` ko'rinishida. Nima noto'g'ri?"
    options:
      - "Hech narsa, bu standart yondashuv"
      - "showToast asinxron bo'lishi kerak"
      - "Bu foydalanuvchi harakatiga javob, u event handler'da bo'lishi kerak: effekt sahifa qayta yuklanganda ham bildirishnoma chiqaradi"
      - "Dependency massivida product.isInCart bo'lishi kerak"
    answer: 2
    explain: "react.dev'ning savoli: kod nega ishlayapti? Foydalanuvchi bosgani uchun bo'lsa - event handler. Komponent ko'rsatilgani uchun bo'lsa - effekt. Effektdagi versiya savatda mahsulot bor sahifani har ochishda toast ko'rsatadi."
  - q: "Effekt ichida `fetchTrips(query).then(setTrips)` qilinadi. Foydalanuvchi tez yozganda eski javob yangisini bosib ketadi. To'g'ri tuzatish?"
    options:
      - "Debounce qo'shish, bu muammoni butunlay hal qiladi"
      - "Cleanup funksiyasida ignore flag'ini o'rnatish va eski javobni e'tiborsiz qoldirish (yoki AbortController)"
      - "fetch'ni useMemo ichiga olish"
      - "setTrips'ni setTimeout bilan kechiktirish"
    answer: 1
    explain: "Javoblar har qanday tartibda kelishi mumkin. Cleanup'da ignore = true qilish faqat oxirgi so'rov natijasini qabul qiladi. Debounce ehtimolni kamaytiradi, lekin race condition'ni yo'qotmaydi."
  - q: "Thinking in React bo'yicha qaysi narsa state EMAS?"
    options:
      - "Qidiruv maydonidagi matn"
      - "\"Faqat faol mashinalar\" checkbox'i"
      - "Ochiq modal oynaning id'si"
      - "Mashinalar ro'yxati va filtr matnidan hisoblangan ko'rinadigan mashinalar soni"
    answer: 3
    explain: "Uchta savol: vaqt bilan o'zgarmaydimi, props orqali keladimi, mavjud state/props'dan hisoblash mumkinmi. Ko'rinadigan mashinalar soni hisoblanadi, demak u state emas. Qolgan uchtasi foydalanuvchi harakati bilan o'zgaradi va hisoblanmaydi."
task:
  title: "Reys ro'yxati komponentidan keraksiz state va effektlarni olib tashlash"
  prompt: |
    Quyidagi komponent ishlaydi, lekin unda beshta state va uchta effekt bor. Uni react.dev tamoyillari bo'yicha qayta yozing:

    1. Hisoblanadigan qiymatlarni state'dan chiqaring.
    2. Qarama-qarshi bo'lishi mumkin bo'lgan boolean'larni bitta holatga keltiring.
    3. Tanlangan obyekt o'rniga id saqlang.
    4. Foydalanuvchi harakatiga bog'liq mantiqni event handler'ga ko'chiring.
    5. Fetch effektida race condition'ni tuzating.

    Xatti-harakat (ekranda nima ko'rinishi) o'zgarmasligi kerak.
  lang: tsx
  starter: |
    import { useEffect, useState } from "react";

    type Trip = { id: string; plate: string; distanceKm: number; status: "active" | "done" };

    declare function fetchTrips(driverId: string): Promise<Trip[]>;
    declare function track(event: string, payload: object): void;

    export function TripList({ driverId }: { driverId: string }) {
      const [trips, setTrips] = useState<Trip[]>([]);
      const [onlyActive, setOnlyActive] = useState(false);
      const [visible, setVisible] = useState<Trip[]>([]);
      const [totalKm, setTotalKm] = useState(0);
      const [selected, setSelected] = useState<Trip | null>(null);
      const [isLoading, setIsLoading] = useState(false);
      const [isError, setIsError] = useState(false);

      useEffect(() => {
        setIsLoading(true);
        fetchTrips(driverId)
          .then((data) => { setTrips(data); setIsLoading(false); })
          .catch(() => setIsError(true));
      }, [driverId]);

      useEffect(() => {
        const v = onlyActive ? trips.filter((t) => t.status === "active") : trips;
        setVisible(v);
        setTotalKm(v.reduce((s, t) => s + t.distanceKm, 0));
      }, [trips, onlyActive]);

      useEffect(() => {
        if (selected) track("trip_selected", { id: selected.id });
      }, [selected]);

      if (isLoading) return <p>Yuklanmoqda...</p>;
      if (isError) return <p>Xato</p>;
      return (
        <div>
          <label>
            <input type="checkbox" checked={onlyActive} onChange={(e) => setOnlyActive(e.target.checked)} />
            Faqat faol
          </label>
          <p>Jami: {totalKm} km</p>
          <ul>
            {visible.map((t) => (
              <li key={t.id} onClick={() => setSelected(t)} aria-selected={selected?.id === t.id}>
                {t.plate} - {t.distanceKm} km
              </li>
            ))}
          </ul>
        </div>
      );
    }
  solution: |
    import { useEffect, useState } from "react";

    type Trip = { id: string; plate: string; distanceKm: number; status: "active" | "done" };

    declare function fetchTrips(driverId: string): Promise<Trip[]>;
    declare function track(event: string, payload: object): void;

    type TripsRequest =
      | { status: "loading" }
      | { status: "error" }
      | { status: "success"; trips: Trip[] };

    function useDriverTrips(driverId: string): TripsRequest {
      const [request, setRequest] = useState<TripsRequest>({ status: "loading" });

      useEffect(() => {
        let ignore = false;
        setRequest({ status: "loading" });
        fetchTrips(driverId)
          .then((trips) => { if (!ignore) setRequest({ status: "success", trips }); })
          .catch(() => { if (!ignore) setRequest({ status: "error" }); });
        return () => { ignore = true; };
      }, [driverId]);

      return request;
    }

    export function TripList({ driverId }: { driverId: string }) {
      const request = useDriverTrips(driverId);
      const [onlyActive, setOnlyActive] = useState(false);
      const [selectedId, setSelectedId] = useState<string | null>(null);

      if (request.status === "loading") return <p>Yuklanmoqda...</p>;
      if (request.status === "error") return <p>Xato</p>;

      const visibleTrips = onlyActive
        ? request.trips.filter((trip) => trip.status === "active")
        : request.trips;
      const totalKm = visibleTrips.reduce((sum, trip) => sum + trip.distanceKm, 0);

      function handleSelect(trip: Trip) {
        setSelectedId(trip.id);
        track("trip_selected", { id: trip.id });
      }

      return (
        <div>
          <label>
            <input type="checkbox" checked={onlyActive} onChange={(e) => setOnlyActive(e.target.checked)} />
            Faqat faol
          </label>
          <p>Jami: {totalKm} km</p>
          <ul>
            {visibleTrips.map((trip) => (
              <li key={trip.id} onClick={() => handleSelect(trip)} aria-selected={selectedId === trip.id}>
                {trip.plate} - {trip.distanceKm} km
              </li>
            ))}
          </ul>
        </div>
      );
    }
  solutionNotes: |
    - `visible` va `totalKm` hisoblanadigan qiymatlar edi. Ular render paytida hisoblanadi: ikkita state va bitta effekt yo'qoldi, "eskirgan qiymat bilan bir render" muammosi ham.
    - `isLoading` va `isError` bir vaqtda `true` bo'lishi mumkin edi, starter'da xato holatida `isLoading` hech qachon `false` bo'lmasdi, demak foydalanuvchi abadiy "Yuklanmoqda" ko'rardi. Discriminated union buni imkonsiz qiladi.
    - `selected` butun obyektni saqlardi: ro'yxat yangilansa, u eski nusxa bo'lib qolardi. Endi faqat `selectedId`.
    - Analitika foydalanuvchi bosgani uchun ishlaydi, shuning uchun u `handleSelect` ichida. Effekt versiyasi bir xil reysni qayta tanlashni o'tkazib yuborardi va boshqa sabab bilan `selected` o'zgarganda ham chaqirilardi.
    - Fetch custom hook'ga ajratildi va `ignore` flag bilan race condition yopildi: `driverId` tez o'zgarsa, eski javob yangi holatni bosib ketmaydi.
    - `useMemo` qo'shilmadi: bir necha yuz reys uchun filter va reduce arzon. React Compiler ishlatilsa, u ko'p holatda memoizatsiyani o'zi qiladi.
  checklist:
    - "Hisoblanadigan qiymatlar (ko'rinadigan reyslar, jami km) state'da emas"
    - "Yuklanish holati bitta union bilan ifodalangan, qarama-qarshi boolean'lar yo'q"
    - "Tanlov id orqali saqlanadi, obyekt nusxasi emas"
    - "Analitika chaqiruvi event handler ichida"
    - "Fetch effektida cleanup bor va eski javob e'tiborsiz qoldiriladi"
---

## Muammo

React komponentlari odatda bir xil yo'l bilan buziladi. Boshida komponent oddiy: bitta `useState`, bitta `fetch`. Keyin filtr qo'shiladi va filtrlangan ro'yxat uchun yangi state ochiladi. Keyin jami summa uchun yana bitta. Keyin ularni sinxron ushlab turish uchun `useEffect`. Keyin tanlangan element, yuklanish, xato. Olti oydan keyin komponentda o'nta state va beshta effekt bor, ular bir-birini zanjir bo'lib qo'zg'atadi, va "nega bu ro'yxat bir lahza eski ma'lumotni ko'rsatadi?" degan savolga hech kim javob bera olmaydi.

Bu muammo React'ning o'ziga xos shakli: bu yerda chalkashlik ko'pincha murakkab algoritmdan emas, balki **ma'lumot qayerda yashashi va qachon o'zgarishi** noaniqligidan keladi. Har bir ortiqcha state - sinxronlash kerak bo'lgan yana bir nusxa. Har bir keraksiz effekt - "bu kod qachon ishlaydi?" degan savolga murakkabroq javob.

React jamoasi bu muammoni yaxshi biladi va react.dev'da unga uchta asosiy sahifa bag'ishlagan: *Thinking in React*, *Choosing the State Structure* va *You Might Not Need an Effect*. Bu dars shu uchta hujjatga tayanadi.

## Asosiy g'oya

Toza React kodi uchta savolga aniq javob beradi:

1. **Komponent chegarasi qayerda?** Har bir komponent UI'ning bitta ma'noli qismi va ma'lumot modelining bitta bo'lagiga mos keladi.
2. **Minimal state nima?** Faqat hisoblab bo'lmaydigan, vaqt bilan o'zgaradigan va props orqali kelmaydigan narsa state. Qolgan hamma narsa render paytida hisoblanadi.
3. **Effekt nima uchun kerak?** Faqat React'dan tashqaridagi tizim bilan sinxronlash uchun: tarmoq, DOM API, uchinchi tomon widget, brauzer obunasi. Foydalanuvchi harakatiga javob esa event handler'da.

## Chuqurroq: uchta hujjatning mexanikasi

### Thinking in React: komponent va state'ni topish

Hujjat besh qadamni taklif qiladi: UI'ni komponent ierarxiyasiga bo'lish, statik versiyani qurish, UI state'ining minimal, lekin to'liq ko'rinishini topish, state qayerda yashashini aniqlash va teskari ma'lumot oqimini qo'shish.

Komponentlarga bo'lishda hujjat bitta foydali kuzatuvni beradi: agar JSON ma'lumot modeli yaxshi tuzilgan bo'lsa, u ko'pincha UI tuzilishiga tabiiy ravishda mos keladi. Bu bizning kursdagi Single Responsibility g'oyasining (53-dars) UI'dagi ko'rinishi: komponent bitta narsani ko'rsatadi, agar u o'sib ketsa, kichikroq komponentlarga bo'linadi.

State'ni aniqlash uchun hujjat uchta savol beradi. Qiymat vaqt bilan o'zgarmaydimi? Unda u state emas. Ota komponentdan props orqali keladimi? State emas. Mavjud state yoki props'dan hisoblab bo'ladimi? U aniq state emas. Bu uchta savoldan o'tgan narsa - haqiqiy state.

State qayerda yashashi kerak? Uni ishlatadigan barcha komponentlarning eng yaqin umumiy ota komponentida. Bu "lifting state up" deb ataladi.

### Choosing the State Structure: beshta tamoyil

1. **Bog'liq state'ni guruhlang.** Ikki qiymat doim birga o'zgarsa (koordinata `x` va `y`), ular bitta state bo'lsin.
2. **Qarama-qarshilikdan qoching.** `isSending` va `isSent` bir vaqtda `true` bo'lishi mumkin. Bitta `status: "typing" | "sending" | "sent"` bu imkonsiz holatni yo'q qiladi. Bu 45-darsdagi "noqonuniy holatlarni ifodalab bo'lmaydigan qilish" g'oyasining aynan o'zi.
3. **Ortiqcha state'dan qoching.** `fullName` ni `firstName` va `lastName` dan hisoblash mumkin bo'lsa, uni saqlamang. Bu yerda nozik holat bor: props'ni state'ga ko'chirish (`useState(color)`) faqat birinchi qiymatni oladi va keyingi o'zgarishlarni jimgina e'tiborsiz qoldiradi. Agar bu ataylab qilinsa, hujjat prop'ni `initialColor` yoki `defaultColor` deb nomlashni maslahat beradi: nom o'quvchiga niyatni aytadi.
4. **Takrordan qoching.** Ro'yxatdagi tanlangan elementni butun obyekt sifatida saqlash uni ikki joyda saqlash demak. Ro'yxat elementi tahrirlansa, tanlangan nusxa eskiradi. `selectedId` saqlang va obyektni render paytida toping.
5. **Chuqur ichma-ichlikdan qoching.** Ichma-ich daraxtni yangilash har bir ota darajani nusxalashni talab qiladi. Uni ma'lumotlar bazasi jadvali kabi "tekis" (normalized) qiling: id bo'yicha xarita va `childIds`.

Hujjatning yakuniy tamoyili: state'ni imkon qadar oddiy qiling, lekin undan ham oddiy emas.

### You Might Not Need an Effect

Hujjat effektni "escape hatch" deb ataydi: React'dan tashqariga chiqish yo'li. Agar tashqi tizim ishtirok etmasa, effekt deyarli har doim keraksiz. Asosiy holatlar:

- **Derived ma'lumot.** Ro'yxatni filtrlash, jami hisoblash - render paytida. Effekt bilan qilinganda React avval eski qiymat bilan render qiladi, keyin effekt ishlab yangi state o'rnatadi va yana render bo'ladi.
- **Qimmat hisoblash.** Faqat haqiqatan sekin bo'lsa (hujjat `console.time` bilan o'lchashni taklif qiladi) `useMemo`. U birinchi renderni tezlashtirmaydi, faqat keyingilarini. Hujjat React Compiler ko'p holatda memoizatsiyani avtomatik qilishini ham qayd etadi.
- **Prop o'zgarganda butun state'ni tozalash.** `key` bering. Kalit o'zgarsa, React komponentni yangi instance sifatida yaratadi.
- **Foydalanuvchi harakati.** Hujjatning markaziy savoli: bu kod *nega* ishlayapti? Foydalanuvchi biror narsa qilgani uchun bo'lsa - event handler. Komponent ekranda ko'rsatilgani uchun bo'lsa - effekt.
- **Effektlar zanjiri.** Bir effekt state o'rnatadi, u boshqa effektni qo'zg'atadi va hokazo. Har bir qadam qo'shimcha render va mantiq qattiq bog'lanadi. Keyingi holatni event handler'da bir joyda hisoblang.
- **Ota komponentni xabardor qilish.** Bolada effekt ichida `onChange` chaqirish o'rniga, ikkala komponent state'ini bitta event handler'da yangilang yoki state'ni yuqoriga ko'taring.
- **Tashqi store'ga obuna.** Qo'lda yozilgan effekt o'rniga `useSyncExternalStore`.
- **Ma'lumot yuklash.** Effektda fetch qilish to'g'ri bo'lishi mumkin, lekin cleanup bilan: javoblar tartibsiz kelishi mumkin va eski javob yangisini bosib ketmasligi kerak. Hujjat freymvorklarning o'rnatilgan data fetching mexanizmlarini afzal ko'radi (Next.js'da Server Components, 93-dars).

## Misol: effekt zanjiridan oddiy hisoblashga

Yoqilg'i hodisalari jadvali. Yomon variant:

```tsx
import { useEffect, useState } from "react";

type FuelEvent = { id: string; vehicleId: string; liters: number; kind: "refuel" | "drain" };

export function FuelEventsTable({ events }: { events: FuelEvent[] }) {
  const [kind, setKind] = useState<FuelEvent["kind"] | "all">("all");
  const [rows, setRows] = useState<FuelEvent[]>(events);
  const [drainTotal, setDrainTotal] = useState(0);
  const [hasSuspicious, setHasSuspicious] = useState(false);

  useEffect(() => {
    setRows(kind === "all" ? events : events.filter((e) => e.kind === kind));
  }, [events, kind]);

  useEffect(() => {
    setDrainTotal(rows.filter((r) => r.kind === "drain").reduce((s, r) => s + r.liters, 0));
  }, [rows]);

  useEffect(() => {
    setHasSuspicious(drainTotal > 50);
  }, [drainTotal]);

  return (
    <section>
      <select value={kind} onChange={(e) => setKind(e.target.value as FuelEvent["kind"] | "all")}>
        <option value="all">Hammasi</option>
        <option value="refuel">Quyish</option>
        <option value="drain">To'kish</option>
      </select>
      {hasSuspicious && <p role="alert">Shubhali to'kish: {drainTotal} l</p>}
      <ul>{rows.map((r) => <li key={r.id}>{r.vehicleId}: {r.liters} l</li>)}</ul>
    </section>
  );
}
```

Filtr o'zgarganda nima bo'ladi? Render, keyin `rows` effekti, render, keyin `drainTotal` effekti, render, keyin `hasSuspicious` effekti, render. To'rtta render va oraliq renderlarda ekranda bir-biriga mos kelmaydigan qiymatlar: yangi qatorlar, lekin eski jami. Bundan tashqari `e.target.value as ...` yolg'on tip.

Toza variant:

```tsx
import { useState } from "react";

type FuelEvent = { id: string; vehicleId: string; liters: number; kind: "refuel" | "drain" };
type KindFilter = FuelEvent["kind"] | "all";

const SUSPICIOUS_DRAIN_LITERS = 50;
const KIND_FILTERS: readonly KindFilter[] = ["all", "refuel", "drain"];
const KIND_LABELS: Record<KindFilter, string> = { all: "Hammasi", refuel: "Quyish", drain: "To'kish" };

function isKindFilter(value: string): value is KindFilter {
  return KIND_FILTERS.some((k) => k === value);
}

export function FuelEventsTable({ events }: { events: FuelEvent[] }) {
  const [kind, setKind] = useState<KindFilter>("all");

  const rows = kind === "all" ? events : events.filter((e) => e.kind === kind);
  const drainTotal = rows
    .filter((r) => r.kind === "drain")
    .reduce((sum, r) => sum + r.liters, 0);
  const hasSuspiciousDrain = drainTotal > SUSPICIOUS_DRAIN_LITERS;

  return (
    <section>
      <select
        value={kind}
        onChange={(e) => {
          if (isKindFilter(e.target.value)) setKind(e.target.value);
        }}
      >
        {KIND_FILTERS.map((k) => <option key={k} value={k}>{KIND_LABELS[k]}</option>)}
      </select>
      {hasSuspiciousDrain && <p role="alert">Shubhali to'kish: {drainTotal} l</p>}
      <ul>{rows.map((r) => <li key={r.id}>{r.vehicleId}: {r.liters} l</li>)}</ul>
    </section>
  );
}
```

Nima o'zgardi: to'rtta state o'rniga bitta (`kind`), chunki Thinking in React'ning uchinchi savoliga ko'ra qolganlari hisoblanadi. Uchta effekt yo'qoldi, demak "bu qiymat qachon yangilanadi" degan savol ham yo'qoldi: u har doim joriy props va state'ga mos. Magic number nomlandi. `as` o'rniga kichik type predicate. Kod qisqardi, lekin bu maqsad emas edi, natija edi.

## Qachon qo'llamaslik kerak

- **Haqiqatan qimmat hisoblash.** Agar `rows` o'n minglab GPS nuqtalari bo'lsa va har bir klaviatura bosishida qayta hisoblansa, `useMemo` (yoki React Compiler) kerak. Lekin avval o'lchang: hujjat ham shuni aytadi.
- **Effekt to'g'ri bo'lgan joylar.** WebSocket'ga ulanish, xarita kutubxonasini (Leaflet, Mapbox) DOM elementiga biriktirish, `document.title` ni sinxronlash, komponent ko'rsatilganda analitika yuborish - bular tashqi tizim bilan sinxronlash va effekt aynan shu uchun mavjud. "Effektsiz" kodni dogma qilmang.
- **Ataylab nusxalangan state.** Forma tahrirlash rejimida serverdan kelgan qiymatni boshlang'ich qiymat sifatida olib, keyingi server o'zgarishlarini e'tiborsiz qoldirish - bu to'g'ri. Faqat prop'ni `initialValue` deb nomlang.
- **Normalizatsiya har doim kerak emas.** Ikki darajali, kam o'zgaradigan ma'lumot uchun id xaritalari va `childIds` ortiqcha murakkablik. Tekislash chuqur va tez-tez o'zgaradigan daraxtlar uchun.
- **Komponentni haddan tashqari maydalash.** Har bir `<li>` uchun alohida fayl va props zanjiri 52-darsdagi "sayoz modul" muammosini UI'ga ko'chiradi. Komponent qayta ishlatilsa yoki o'zining mantig'i bo'lsa ajrating.

## Stack'da: React 19, Next.js, testlar

- **React 19 va React Compiler.** Compiler komponent va hook'larni avtomatik memoizatsiya qiladi, shuning uchun qo'lda yozilgan `useMemo`/`useCallback` soni kamayadi. Lekin compiler React qoidalariga (render paytida sof bo'lish, props va state'ni mutatsiya qilmaslik) amal qiladigan kodni kutadi. Toza komponent compiler uchun ham yaxshi komponent.
- **Formalar.** React 19 dagi `useActionState` va `<form action={...}>` Server Function bilan birga yuborish holatini (`isPending`) qo'lda boshqarishni kamaytiradi. Bu "isSubmitting va isError" boolean'larining yana bir tabiiy o'rnini bosadi.
- **Next.js.** Ma'lumot yuklash ko'pincha Server Component'ga o'tadi va client komponentda fetch effekti umuman qolmaydi (93-dars).
- **Testlar.** Derived qiymatlar render paytida hisoblanganda Testing Library bilan foydalanuvchi ko'radigan natijani tekshirish oson: effekt va oraliq renderlarni kutish shart emas (69-dars).

## Xulosa

- React'dagi chalkashlik ko'pincha ortiqcha state va keraksiz effektlardan keladi, murakkab mantiqdan emas.
- State - faqat vaqt bilan o'zgaradigan, props orqali kelmaydigan va hisoblab bo'lmaydigan narsa. Qolgani render paytida hisoblanadi.
- Qarama-qarshi boolean'lar o'rniga bitta status, obyekt nusxasi o'rniga id.
- Effekt - tashqi tizim bilan sinxronlash uchun. Foydalanuvchi harakatiga javob event handler'da, butun state reset `key` bilan.
- Fetch effektida har doim cleanup, imkon bo'lsa freymvork darajasidagi data fetching.
