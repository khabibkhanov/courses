---
n: 93
slug: toza-nextjs
title: "Toza Next.js: server/client chegarasi"
summary: "App Router'da eng muhim dizayn qarori - kod qaysi muhitda ishlashi. 'use client' va 'use server' direktivalari modul chegaralarini belgilaydi. Bu darsda chegarani tor va aniq saqlashni, Data Access Layer'ni va Server Action'larni xavfsiz yozishni ko'ramiz."
duration: 40
sources:
  - id: nextjs-server-client
    note: "Server and Client Components: qachon qaysi biri, 'use client' modul grafidagi chegara sifatida, interleaving (children orqali), context provider'lar, server-only bilan environment poisoning'dan himoya"
  - id: nextjs-docs
    note: "Fetching Data (parallel fetch, React.cache), Data Security qo'llanmasi (Data Access Layer, DTO, Server Action xavfsizligi, audit ro'yxati), 'use server' direktivasi, Caching (Cache Components)"
quiz:
  - q: "`app/layout.tsx` faylining tepasiga 'use client' qo'yildi, chunki navbar'dagi qidiruv maydoniga useState kerak edi. Bu qarorning asosiy narxi nima?"
    options:
      - "Layout endi umuman render bo'lmaydi"
      - "Layout import qilgan barcha modullar client bundle'ga tushadi va server'da ma'lumot yuklash imkoniyati yo'qoladi"
      - "SEO butunlay ishlamay qoladi"
      - "Hech qanday narx yo'q, Next.js buni avtomatik optimallashtiradi"
    answer: 1
    explain: "Hujjatga ko'ra 'use client' bilan belgilangan faylning barcha importlari va u to'g'ridan-to'g'ri render qiladigan komponentlar client bundle'ga kiradi. To'g'ri yo'l - faqat Search komponentini client qilish va layout'ni server'da qoldirish."
  - q: "Client komponent (Modal) ichida server'da ma'lumot yuklaydigan Cart komponentini ko'rsatish kerak. Qanday qilinadi?"
    options:
      - "Modal faylida Cart'ni import qilish"
      - "Cart'ni ham client komponentga aylantirib, useEffect bilan fetch qilish"
      - "Server komponent Page ichida <Modal><Cart /></Modal> yozish: Cart server'da render bo'lib, children sifatida uzatiladi"
      - "Cart'ni iframe ichiga joylash"
    answer: 2
    explain: "Server komponentlarni client komponentga props (odatda children) orqali uzatish mumkin. Ular client modul grafiga kirmaydi, server'da oldindan render bo'ladi. Modal ichida import qilish esa Cart'ni client grafiga tortadi."
  - q: "Server Action `deleteVehicle(id)` faqat admin sahifasida ishlatiladi va sahifa o'zi admin'ni tekshiradi. Action ichida qayta tekshirish kerakmi?"
    options:
      - "Ha: Server Action to'g'ridan-to'g'ri POST so'rov bilan chaqirilishi mumkin, sahifa darajasidagi tekshiruv unga tarqalmaydi"
      - "Yo'q, sahifa tekshiruvi yetarli"
      - "Yo'q, chunki action ID'lari shifrlangan va topib bo'lmaydi"
      - "Faqat production'da kerak"
    answer: 0
    explain: "Next.js Data Security qo'llanmasi ochiq aytadi: sahifadagi autentifikatsiya undagi Server Action'larga tarqalmaydi, har bir action ichida qayta tekshiring. Shifrlangan ID'lar qo'shimcha himoya, lekin authorization o'rnini bosmaydi."
  - q: "`lib/db.ts` faylida DATABASE_URL o'qiladi. Uni tasodifan client komponentga import qilishdan qanday himoyalanish mumkin?"
    options:
      - "Fayl nomini db.server.ts qilish"
      - "O'zgaruvchini NEXT_PUBLIC_DATABASE_URL deb nomlash"
      - "Faylga 'use server' qo'yish"
      - "Faylning boshida import 'server-only' yozish: client modul uni import qilsa, build xato beradi"
    answer: 3
    explain: "server-only importi modulni faqat server'da ishlatishni majburlaydi va noto'g'ri importda build vaqtida aniq xato beradi. NEXT_PUBLIC_ prefiksi aksincha qiymatni client bundle'ga qo'shadi. 'use server' fayldagi funksiyalarni client'dan chaqiriladigan Server Function'larga aylantiradi, bu himoya emas."
  - q: "Server komponent Prisma'dan to'liq `User` yozuvini (passwordHash bilan) olib, uni client komponentga prop sifatida uzatadi. UI faqat ism va avatar ko'rsatadi. Muammo nima?"
    options:
      - "Prop'lar serializatsiya bo'lmaydi"
      - "Client komponentga uzatilgan prop'lar RSC payload orqali brauzerga yetib boradi, demak passwordHash ham ochiladi. DAL faqat kerakli maydonli DTO qaytarishi kerak"
      - "Muammo yo'q, chunki UI passwordHash'ni ko'rsatmaydi"
      - "Faqat performance muammosi"
    answer: 1
    explain: "Server'dan client'ga uzatilgan har bir prop serializatsiya qilinib brauzerga yuboriladi. Ko'rsatilmasa ham, u tarmoq javobida bor. Data Security qo'llanmasi DAL'dan minimal DTO qaytarishni tavsiya qiladi."
task:
  title: "Mashina sahifasidagi server/client chegarasini tozalash"
  prompt: |
    Quyidagi sahifa butunlay client komponent: u ma'lumotni effektda yuklaydi, to'liq DB yozuvini oladi va mutatsiyani himoyasiz Server Action orqali qiladi.

    Qayta yozing:
    1. Sahifani Server Component qiling, interaktiv qismni (izoh tugmasi) kichik client komponentga ajrating.
    2. `server-only` bilan himoyalangan Data Access Layer funksiyasi minimal DTO qaytarsin.
    3. Server Action ichida kirishni tekshiring va foydalanuvchi huquqini qayta tekshiring.

    `getSession()` va `db` mavjud deb hisoblang.
  lang: tsx
  starter: |
    // app/vehicles/[id]/page.tsx
    "use client";

    import { useEffect, useState } from "react";
    import { addNote } from "./actions";

    type VehicleRow = {
      id: string; plate: string; companyId: string;
      simIccid: string; trackerImei: string; notes: string[];
    };

    export default function VehiclePage({ params }: { params: { id: string } }) {
      const [vehicle, setVehicle] = useState<VehicleRow | null>(null);
      const [text, setText] = useState("");

      useEffect(() => {
        fetch(`/api/vehicles/${params.id}`).then((r) => r.json()).then(setVehicle);
      }, [params.id]);

      if (!vehicle) return <p>Yuklanmoqda...</p>;
      return (
        <main>
          <h1>{vehicle.plate}</h1>
          <ul>{vehicle.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
          <input value={text} onChange={(e) => setText(e.target.value)} />
          <button onClick={() => addNote(vehicle.id, text)}>Qo'shish</button>
        </main>
      );
    }

    // app/vehicles/[id]/actions.ts
    // "use server";
    // export async function addNote(vehicleId: string, text: string) {
    //   await db.vehicleNote.create({ data: { vehicleId, text } });
    // }
  solution: |
    // lib/dal/vehicles.ts
    import "server-only";
    import { cache } from "react";
    import { db } from "@/lib/db";
    import { getSession } from "@/lib/auth";

    export type VehicleCardDto = { id: string; plate: string; notes: string[] };

    export class ForbiddenError extends Error {}

    async function requireCompanyId(): Promise<string> {
      const session = await getSession();
      if (!session) throw new ForbiddenError("Kirish talab qilinadi");
      return session.companyId;
    }

    export const getVehicleCard = cache(async (vehicleId: string): Promise<VehicleCardDto | null> => {
      const companyId = await requireCompanyId();
      const vehicle = await db.vehicle.findFirst({
        where: { id: vehicleId, companyId },
        select: { id: true, plate: true, notes: { select: { text: true }, orderBy: { createdAt: "asc" } } },
      });
      if (!vehicle) return null;
      return { id: vehicle.id, plate: vehicle.plate, notes: vehicle.notes.map((n) => n.text) };
    });

    export async function addVehicleNote(vehicleId: string, text: string): Promise<void> {
      const companyId = await requireCompanyId();
      const owned = await db.vehicle.count({ where: { id: vehicleId, companyId } });
      if (owned === 0) throw new ForbiddenError("Bu mashina sizga tegishli emas");
      await db.vehicleNote.create({ data: { vehicleId, text } });
    }

    // app/vehicles/[id]/actions.ts
    "use server";
    import { revalidatePath } from "next/cache";
    import { addVehicleNote } from "@/lib/dal/vehicles";

    const MAX_NOTE_LENGTH = 500;

    export type AddNoteState = { error: string | null };

    export async function addNoteAction(
      vehicleId: string,
      _prev: AddNoteState,
      formData: FormData,
    ): Promise<AddNoteState> {
      const raw = formData.get("text");
      const text = typeof raw === "string" ? raw.trim() : "";
      if (text.length === 0 || text.length > MAX_NOTE_LENGTH) {
        return { error: `Izoh 1-${MAX_NOTE_LENGTH} belgi bo'lishi kerak` };
      }
      await addVehicleNote(vehicleId, text);
      revalidatePath(`/vehicles/${vehicleId}`);
      return { error: null };
    }

    // app/vehicles/[id]/note-form.tsx
    "use client";
    import { useActionState } from "react";
    import { addNoteAction, type AddNoteState } from "./actions";

    const INITIAL: AddNoteState = { error: null };

    export function NoteForm({ vehicleId }: { vehicleId: string }) {
      const [state, formAction, isPending] = useActionState(addNoteAction.bind(null, vehicleId), INITIAL);
      return (
        <form action={formAction}>
          <input name="text" maxLength={500} required />
          <button disabled={isPending}>Qo'shish</button>
          {state.error && <p role="alert">{state.error}</p>}
        </form>
      );
    }

    // app/vehicles/[id]/page.tsx
    import { notFound } from "next/navigation";
    import { getVehicleCard } from "@/lib/dal/vehicles";
    import { NoteForm } from "./note-form";

    export default async function VehiclePage({ params }: { params: Promise<{ id: string }> }) {
      const { id } = await params;
      const vehicle = await getVehicleCard(id);
      if (!vehicle) notFound();
      return (
        <main>
          <h1>{vehicle.plate}</h1>
          <ul>{vehicle.notes.map((note, i) => <li key={i}>{note}</li>)}</ul>
          <NoteForm vehicleId={vehicle.id} />
        </main>
      );
    }
  solutionNotes: |
    - Sahifa Server Component bo'ldi: ma'lumot server'da, manbaga yaqin yuklanadi, `useEffect` va API route kerak emas. `params` Next.js 15+ dagidek `Promise`.
    - Client chegarasi faqat `NoteForm` atrofida. Brauzerga faqat forma kodi va `vehicleId` boradi.
    - `getVehicleCard` DTO qaytaradi: `simIccid`, `trackerImei`, `companyId` endi RSC payload'ga tushmaydi. `server-only` uni client'ga import qilishni build darajasida taqiqlaydi.
    - `cache` bir so'rov ichida bir xil id uchun takroriy so'rovni oldini oladi (masalan, `generateMetadata` ham shu funksiyani chaqirsa).
    - Server Action yupqa: kirishni tekshiradi va DAL'ga topshiradi. Huquq (mashina shu kompaniyaga tegishlimi) DAL'da tekshiriladi, chunki action to'g'ridan-to'g'ri POST bilan chaqirilishi mumkin.
    - Starter'dagi `addNote(vehicle.id, text)` istalgan `vehicleId` bilan chaqirilishi mumkin edi: bu IDOR zaifligi.
  checklist:
    - "page.tsx'da 'use client' yo'q, ma'lumot server'da yuklanadi"
    - "Client komponent faqat interaktiv qism uchun va unga faqat kerakli prop'lar uzatiladi"
    - "DAL moduli import 'server-only' bilan boshlanadi va DTO qaytaradi"
    - "Server Action kirishni tekshiradi, autentifikatsiya va resursga egalik qayta tekshiriladi"
    - "Mutatsiyadan keyin keshlangan sahifa yangilanadi (revalidatePath yoki shunga o'xshash)"
---

## Muammo

App Router'gacha React ilovasida bitta muhit bor edi: brauzer. Server alohida dunyo edi, ular orasida HTTP API turardi va chegara hammaga ko'rinib turardi. Next.js App Router bu chegarani bitta repo, bitta komponent daraxti va hatto bitta fayl ichiga olib kirdi. Endi bitta `import` qatori kodni server'dan brauzerga ko'chirishi mumkin, bitta prop ma'lumotlar bazasi yozuvini tarmoq javobiga qo'shib yuborishi mumkin.

Natijada ikki xil buzilish keng tarqalgan. Birinchisi: dasturchi xatodan qochish uchun hamma joyga `"use client"` qo'yadi. Ilova ishlaydi, lekin u aslida eski SPA: ma'lumot `useEffect` da yuklanadi, bundle katta, server komponentlarning foydasi yo'q. Ikkinchisi: chegara noaniq va xavfli. Server komponent to'liq `User` obyektini client komponentga uzatadi, Server Action hech qanday tekshiruvsiz bazaga yozadi, `process.env` o'nlab fayllarda o'qiladi.

Ikkala holatda ham o'quvchi asosiy savolga javob bera olmaydi: **bu kod qayerda ishlaydi va bu ma'lumot kimga ko'rinadi?** Toza Next.js kodi bu savolga fayl tuzilishi va direktivalar orqali javob beradi.

## Asosiy g'oya

Next.js hujjatiga ko'ra, App Router'da layout va sahifalar standart holatda Server Component. Client komponent faqat kerak bo'lganda qo'shiladi. Hujjat tanlov mezonini aniq beradi:

- **Client Component** kerak, agar state va event handler'lar (`onClick`, `onChange`), lifecycle mantiq (`useEffect`), brauzer API'lari (`localStorage`, `window`, geolokatsiya) yoki custom hook'lar kerak bo'lsa.
- **Server Component** kerak, agar ma'lumotni bazadan yoki API'dan manbaga yaqin joyda yuklash, API kalitlari va sirlarni client'ga ochmasdan ishlatish, brauzerga yuboriladigan JavaScript'ni kamaytirish kerak bo'lsa.

Toza kod uchun bundan chiqadigan qoida: **client chegarasini imkon qadar tor va daraxtning barglariga yaqin qo'ying, server bilan client o'rtasidagi har bir o'tishni ataylab va minimal qiling.** Bu Parnas'ning information hiding g'oyasining (43-dars) muhitlar darajasidagi ko'rinishi: client faqat o'ziga kerak narsani bilsin.

## Chuqurroq: chegaraning mexanikasi

### "use client" - modul grafidagi chegara

Hujjat muhim nozik narsani ta'kidlaydi: `"use client"` bitta komponentni emas, **modul grafidagi chegarani** e'lon qiladi. Fayl shu direktiva bilan belgilansa, uning barcha importlari va u to'g'ridan-to'g'ri render qiladigan komponentlar client bundle'ga kiradi. Shuning uchun direktivani har bir client komponentga yozish shart emas, faqat kirish nuqtasiga.

Bundan amaliy xulosa: direktivani qanchalik yuqoriga qo'ysangiz, shuncha ko'p kod brauzerga ketadi. Hujjat misolida layout deyarli statik (logo, navigatsiya), faqat qidiruv maydoni interaktiv. To'g'ri yechim - faqat `Search` ni client qilish.

### Interleaving: children orqali o'tkazish

Client komponent server komponentni import qila olmaydi, lekin uni props sifatida (odatda `children`) qabul qila oladi. Hujjatdagi misol: `Modal` client komponent (ochiq/yopiq state), `Cart` esa server'da ma'lumot yuklaydi. Server sahifa `<Modal><Cart /></Modal>` yozadi. `Cart` server'da oldindan render bo'ladi va client'ga tayyor natija sifatida keladi, uning kodi client grafiga kirmaydi.

Bu pattern dizaynda kuchli vosita: interaktiv "qobiq" va ma'lumotli "mazmun" ajratiladi. Context provider'lar ham shu yo'l bilan yoziladi: provider client komponent, u `children` qabul qiladi va hujjat uni daraxtda imkon qadar chuqurroq joylashtirishni maslahat beradi.

### Serializatsiya va ma'lumot oqib chiqishi

Server'dan client komponentga uzatilgan prop'lar React tomonidan serializatsiya qilinishi kerak va ular RSC payload ichida brauzerga boradi. Bu ikki narsani bildiradi. Birinchisi texnik: funksiya, klass instance kabi qiymatlarni uzatib bo'lmaydi. Ikkinchisi xavfsizlik: UI ko'rsatmasa ham, prop ichidagi har bir maydon tarmoq javobida bor.

### Data Access Layer va DTO

Next.js'ning Data Security qo'llanmasi yangi loyihalar uchun alohida **Data Access Layer (DAL)** ni tavsiya qiladi: ma'lumot qanday va qachon yuklanishini va render kontekstiga nima uzatilishini nazorat qiladigan ichki kutubxona. U so'rovlarni faqat server'da bajaradi, authorization tekshiruvlarini o'zi qiladi va xavfsiz, minimal **DTO** qaytaradi. Qo'llanma yana bir narsani aytadi: `process.env` ga faqat DAL murojaat qilsin.

Clean code nuqtai nazaridan bu oddiy repository yoki port (82-dars), lekin muhim qo'shimcha bilan: u nafaqat abstraksiya, balki xavfsizlik chegarasi.

### server-only va environment poisoning

Server uchun yozilgan modul tasodifan client'ga import qilinsa, sirlar bundle'ga tushishi yoki kod brauzerda sinishi mumkin. Next.js'da faqat `NEXT_PUBLIC_` prefiksli muhit o'zgaruvchilari client bundle'ga qo'shiladi, qolganlari bo'sh satrga almashtiriladi. Bu sirni himoya qiladi, lekin xatoni yashiradi: kod ishlaydi, faqat noto'g'ri. `import "server-only"` esa bunday importni build vaqtida aniq xatoga aylantiradi. Next.js bu paketni ichki darajada qayta ishlaydi.

### "use server" va Server Action'lar

`"use server"` fayl yoki funksiyani **Server Function** sifatida belgilaydi: uni client'dan chaqirish mumkin. Bu "bu kod server'da ishlaydi" degan oddiy belgi emas, bu **ommaviy endpoint e'lon qilish**. Qo'llanma ochiq aytadi: Server Action to'g'ridan-to'g'ri POST so'rov bilan chaqirilishi mumkin. Next.js shifrlangan, deterministik bo'lmagan action ID'lari va ishlatilmagan action'larni bundle'dan olib tashlash kabi himoyalarni beradi, lekin bu authentication va authorization o'rnini bosmaydi. Sahifa darajasidagi tekshiruv undagi action'larga tarqalmaydi.

Shuning uchun Server Action'ni HTTP controller kabi yozing: argumentlar - ishonchsiz kirish (91-dars, `unknown`), sessiya cookie'dan o'qiladi, token argument sifatida qabul qilinmaydi, qaytariladigan qiymat minimal. Qo'llanma action'larni yupqa saqlab, mantiqni `server-only` DAL'ga topshirishni tavsiya qiladi.

### Ma'lumot yuklash va kesh

Server komponentda `await` ketma-ket yozilsa, so'rovlar ketma-ket bajariladi. Mustaqil so'rovlarni `Promise.all` bilan parallel boshlang (29-dars). `fetch` ishlatilmaydigan DB so'rovlari uchun `React.cache` bir so'rov ichida natijani ulashadi. Next.js 16 da Cache Components modeli (`cacheComponents: true` va `"use cache"` direktivasi) keshlashni ochiq va lokal qiladi: kesh qaerda ekani kodda ko'rinadi, yashirin standart xatti-harakatda emas.

## Misol: hammasi client'dan aniq chegaraga

Yomon variant - transport parki dashboard'i:

```tsx
"use client";

import { useEffect, useState } from "react";
import { MapView } from "@/components/map-view";

type VehicleRow = { id: string; plate: string; lat: number; lng: number; driverPhone: string };

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/vehicles").then((r) => r.json()).then(setVehicles);
  }, []);

  return (
    <main>
      <h1>Avtopark</h1>
      <p>Jami: {vehicles.length}</p>
      <MapView vehicles={vehicles} selectedId={selectedId} onSelect={setSelectedId} />
    </main>
  );
}
```

Butun sahifa client'da, birinchi ekran bo'sh, ma'lumot uchun alohida API route, `driverPhone` esa xarita uchun kerak bo'lmasa ham brauzerga keladi.

Toza variant:

```tsx
// lib/dal/fleet.ts
import "server-only";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export type VehicleMarkerDto = { id: string; plate: string; lat: number; lng: number };

export async function listVehicleMarkers(): Promise<VehicleMarkerDto[]> {
  const { companyId } = await requireSession();
  return db.vehicle.findMany({
    where: { companyId },
    select: { id: true, plate: true, lat: true, lng: true },
  });
}
```

```tsx
// app/fleet/fleet-map.tsx
"use client";

import { useState } from "react";
import { MapView } from "@/components/map-view";
import type { VehicleMarkerDto } from "@/lib/dal/fleet";

export function FleetMap({ vehicles }: { vehicles: VehicleMarkerDto[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return <MapView vehicles={vehicles} selectedId={selectedId} onSelect={setSelectedId} />;
}
```

```tsx
// app/fleet/page.tsx
import { listVehicleMarkers } from "@/lib/dal/fleet";
import { FleetMap } from "./fleet-map";

export default async function FleetPage() {
  const vehicles = await listVehicleMarkers();
  return (
    <main>
      <h1>Avtopark</h1>
      <p>Jami: {vehicles.length}</p>
      <FleetMap vehicles={vehicles} />
    </main>
  );
}
```

E'tibor bering: `fleet-map.tsx` DAL'dan faqat `import type` qiladi. Tip importi kompilyatsiyada o'chiriladi, shuning uchun `server-only` buzilmaydi va client bilan server bir xil DTO tipiga tayanadi. Sarlavha va soni server'da render bo'ladi, faqat xarita interaktiv.

## Qachon qo'llamaslik kerak

- **Juda interaktiv ilovalar.** Real vaqtdagi dispetcher paneli, xarita muharriri yoki chat kabi sahifalarda deyarli hamma narsa client state. Bu yerda server komponentlarni majburlash props zanjiri va noqulay chegaralar beradi. Sahifa qobig'ini server'da qoldirib, asosiy ilovani client qilish halol yechim.
- **Ma'lumot tez-tez yangilanadigan joylar.** Har soniyada keladigan GPS koordinatalari uchun server render emas, WebSocket va client state to'g'ri. Server komponent faqat boshlang'ich holatni berishi mumkin.
- **Kichik ichki vosita.** Uch kishilik admin panel uchun to'liq DAL qatlami, DTO'lar va alohida modullar ortiqcha bo'lishi mumkin (90-dars). Lekin ikki qoidani bu yerda ham saqlang: Server Action ichida authorization va client'ga to'liq DB yozuvini uzatmaslik.
- **Mavjud API backend.** Agar sizda alohida NestJS backend bo'lsa, Next.js server komponentlari undan HTTP orqali ma'lumot oladi. Bu holda bazaga to'g'ridan-to'g'ri ulanadigan DAL emas, backend uchun yupqa klient qatlami kerak. Qo'llanma ham tashqi HTTP API bilan ishlashni alohida yondashuv sifatida ko'rsatadi.

## Stack'da: fayl tuzilishi va lint

- **Papkalar.** `lib/dal/*` (faqat server, `server-only`), `app/**/actions.ts` (`"use server"`, yupqa), `app/**/*-client.tsx` yoki aniq nomli client komponentlar. Fayl nomi chegarani ko'rsatsa, o'quvchi importni ochmasdan biladi.
- **Audit.** Data Security qo'llanmasi audit uchun savollar beradi: DAL izolyatsiya qilinganmi, ma'lumotlar bazasi paketlari va muhit o'zgaruvchilari DAL'dan tashqarida import qilinmaganmi, har bir `"use server"` faylda argumentlar tekshirilganmi va foydalanuvchi qayta avtorizatsiya qilinganmi. Bu code review checklist'iga to'g'ridan-to'g'ri qo'shiladi (96-dars).
- **dependency-cruiser.** `app/**` dagi client fayllar `lib/db` ni import qilmasligini qoida sifatida yozish mumkin (97-dars).
- **Middleware endi proxy.** Next.js 16 da `middleware` fayl konvensiyasi `proxy` deb qayta nomlandi va hujjat uni oxirgi chora sifatida ishlatishni tavsiya qiladi. Authorization'ni faqat proxy'ga ishonib qo'ymang, uni DAL'da ham tekshiring.

## Xulosa

- App Router'da asosiy dizayn savoli: kod qayerda ishlaydi va ma'lumot kimga ko'rinadi.
- `"use client"` modul grafidagi chegara: uni barglarga yaqin qo'ying, server komponentlarni `children` orqali uzating.
- Server'dan client'ga o'tadigan har bir prop brauzerga boradi: DAL'dan minimal DTO qaytaring, `server-only` bilan himoyalang.
- `"use server"` ommaviy endpoint e'lon qiladi: har bir action'da kirishni tekshiring va qayta avtorizatsiya qiling.
- Juda interaktiv sahifalarda client komponent halol tanlov, server komponentlar dogma emas.
