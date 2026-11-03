import type { Metadata } from "next";
import Link from "next/link";
import { listCourses, publishedNumbers, syllabus } from "@/lib/content";
import { siteStats } from "@/lib/stats";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Platforma haqida",
  description: `${SITE.name}: o'zbek tilidagi chuqur dasturlash kurslari, ular qanday yoziladi va tekshiriladi.`,
};

const WORKFLOW = [
  { title: "Manbalarni tekshirish", text: "Avval rasmiy hujjatlar, RFC, original maqolalar va kitob mundarijalari ko'riladi. Versiya, sana va raqamlar alohida tekshiriladi." },
  { title: "Yozish standarti", text: "Har kursning yozish standarti bor: dars bo'limlari, misollar, test formati va taqiqlangan narsalar (tekshirilmagan raqamlar, \"taxminan\" kabi so'zlar) aniq belgilangan. Validator skripti har build oldidan buni tekshiradi." },
  { title: "Mustaqil tekshiruv", text: "Darsni yozmagan tekshiruvchi faktlarni, raqamlarni, kod misollarini va manbalarni birlamchi manbalar bilan solishtiradi, topilgan xatolar tuzatiladi. Kod misollari haqiqiy ishga tushirilib, natijasi darsdagi natija bilan solishtiriladi." },
  { title: "O'quvchi izohlari", text: "Matnni belgilab qoldirilgan izohlar ko'rib chiqiladi va dars tuzatiladi. Past baholangan darslar birinchi navbatda qayta ko'riladi." },
];

export default function AboutPage() {
  const stats = siteStats();
  const courses = listCourses();

  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 pb-24">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Platforma haqida</h1>
      <p className="mt-4 max-w-[62ch] text-lg leading-relaxed">
        {SITE.name} - o&apos;zbek tilidagi chuqur texnik kurslar sayti. Maqsad: dasturlashning asosiy mavzularini
        ichki mexanikasi bilan, manbaga asoslangan holda va amaliy mashq bilan o&apos;zbek tilida bir joyda berish.
      </p>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight">Nimani taklif qiladi</h2>
        <p className="mt-3 max-w-[62ch] leading-relaxed text-muted">
          Hozir {stats.courses} ta kurs, jami {stats.lessons} darslik reja, {stats.published} ta dars ochiq. Atamalar
          lug&apos;atida {stats.terms} ta texnik atama qisqa o&apos;zbekcha izoh va tushuntirilgan dars havolasi bilan
          berilgan.
        </p>
        <ul className="mt-6 border-t border-rule">
          {courses.map((c) => (
            <li key={c.slug} style={{ "--line": c.color } as React.CSSProperties} className="relative border-b border-rule py-4 pl-5">
              <span aria-hidden className="absolute top-3 bottom-3 left-0 w-1.5 rounded-full bg-line" />
              <Link href={`/${c.slug}`} className="font-semibold underline-offset-4 hover:underline">
                {c.title}
              </Link>
              <p className="text-sm text-muted">
                {c.subtitle}. Ochiq: {publishedNumbers(c).length} / {syllabus(c).length}.
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight">Darslar qanday tayyorlanadi</h2>
        <ol className="mt-6 space-y-6">
          {WORKFLOW.map((w, i) => (
            <li key={w.title} className="border-t border-rule pt-4">
              <h3 className="font-semibold">
                {i + 1}. {w.title}
              </h3>
              <p className="mt-2 max-w-[62ch] leading-relaxed text-muted">{w.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight">Til</h2>
        <p className="mt-3 max-w-[62ch] leading-relaxed text-muted">
          Tushuntirish o&apos;zbek tilida (lotin yozuvi), texnik atamalar inglizcha qoladi: shunda ularni xalqaro
          hujjatlarda va qidiruvda topish oson.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight">Manbalar va mualliflik</h2>
        <p className="mt-3 max-w-[62ch] leading-relaxed text-muted">
          Darslar matni bizniki; manbalar har darsning oxirida havola sifatida beriladi. CS50 kursi Harvard CS50x
          dasturining ketma-ketligiga tayanadi: CS50 materiallari tarjima qilinmaydi (ular CC BY-NC-SA 4.0 ostida
          tarqatiladi), faqat manba sifatida havola qilinadi. {SITE.name} Harvard, CS50 yoki boshqa manba mualliflari bilan
          rasmiy bog&apos;liq emas.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight">Hozircha yo&apos;q</h2>
        <p className="mt-3 max-w-[62ch] leading-relaxed text-muted">
          Akkaunt va qurilmalar orasida progress sinxronlash, sertifikat, forum yoki ommaviy izohlar yo&apos;q. Progress
          faqat o&apos;zingizning brauzeringizda saqlanadi.
        </p>
      </section>

      <section className="mt-14 border-t border-rule pt-8">
        <h2 className="text-2xl font-semibold tracking-tight">Xato topdingizmi?</h2>
        <p className="mt-3 max-w-[62ch] leading-relaxed text-muted">
          Darsdagi matnni belgilang va izoh qoldiring, yoki dars oxirida baho bering. Qo&apos;shimcha savollar{" "}
          <Link href="/faq" className="underline underline-offset-4 hover:no-underline">
            FAQ
          </Link>{" "}
          sahifasida.
        </p>
      </section>
    </div>
  );
}
