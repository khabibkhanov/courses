import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Maxfiylik",
  description: `${SITE.name} qanday ma'lumotlarni brauzerda va serverda saqlashi haqida.`,
};

const SECTIONS = [
  {
    title: "Akkaunt yo'q",
    body: ["Saytdan foydalanish uchun ism, e-pochta yoki parol so'ralmaydi."],
  },
  {
    title: "Brauzeringizda saqlanadiganlar",
    body: [
      "Progress (o'tilgan darslar, test natijalari), mashqlarga yozgan kodingiz, tanlangan mavzu (Tizim, Yorug', Qorong'i) va anonim qurilma identifikatori (tasodifiy UUID) brauzerning localStorage'ida turadi. Bular serverga progress sifatida yuborilmaydi va brauzer ma'lumotlarini tozalasangiz o'chadi.",
      "Qurilma identifikatori faqat bitta qurilma bitta darsga bitta baho berishi uchun kerak.",
    ],
  },
  {
    title: "Serverda saqlanadiganlar",
    body: [
      "Dars bahosi (yulduz, teglar, ixtiyoriy izoh) va matnga qoldirilgan izohlar (belgilangan matn, uning atrofidagi qisqa kontekst, bo'lim nomi, izoh) qurilma identifikatori bilan birga bazada saqlanadi. Izohlarni faqat sayt administratori ko'radi.",
      "Spamdan himoya uchun IP manzilingizning o'zi emas, uning qisqa hash'i saqlanadi va soatiga yuboriladigan so'rovlar sonini cheklash uchun ishlatiladi.",
    ],
  },
  {
    title: "Kod qayerda bajariladi",
    body: [
      "Darslardagi kodni ishga tushirganingizda u serverimizga yuborilmaydi: Python, SQL, JavaScript, TypeScript va C brauzerning o'zida bajariladi. Python, SQL va C ishga tushirish komponentlari jsDelivr CDN'dan yuklanadi, shuning uchun bu so'rovlar CDN'ga ko'rinadi.",
      "Go istisno: Go kodini ishga tushirsangiz, u saytimiz orqali rasmiy Go Playground'ga (go.dev) yuboriladi va u yerda bajariladi. Kod saqlanmaydi, lekin go.dev uni ko'radi. Soatiga so'rovlar soni cheklangan.",
    ],
  },
  {
    title: "Statistika",
    body: [
      "Sahifa ko'rishlar sonini Vercel Web Analytics hisoblaydi. U cookie ishlatmaydi. Maqsad: qaysi darslar o'qilayotgani va qayerda to'xtab qolinayotganini bilish.",
    ],
  },
  {
    title: "Infratuzilma",
    body: ["Sayt Vercel'da joylashgan, baho va izohlar Neon Postgres bazasida (Frankfurt) saqlanadi. Shriftlar saytning o'zidan beriladi."],
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 pb-24">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Maxfiylik</h1>
      <p className="mt-3 max-w-[62ch] leading-relaxed text-muted">
        {SITE.name} qanday ma&apos;lumotlarni qayerda saqlashi. Oxirgi yangilanish: 2026-11-03.
      </p>
      <div className="mt-10 space-y-10">
        {SECTIONS.map((s) => (
          <section key={s.title} className="border-t border-rule pt-4">
            <h2 className="text-xl font-semibold tracking-tight">{s.title}</h2>
            {s.body.map((p) => (
              <p key={p} className="mt-3 max-w-[65ch] leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
