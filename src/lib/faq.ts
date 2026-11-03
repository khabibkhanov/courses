import { listCourses, publishedNumbers, syllabus } from "./content";
import { RUNNABLE_LANGUAGES } from "./stats";

export type FaqItem = { q: string; a: string };

/** "Darslar tayyormi" javobi kontentdan hisoblanadi: yangi dars qo'shilganda o'zi yangilanadi. */
function availability(): string {
  const parts = listCourses().map((c) => {
    const total = syllabus(c).length;
    const open = publishedNumbers(c).length;
    return open === total ? `${c.title}: ${total} dars` : `${c.title}: ${open} / ${total} dars`;
  });
  return `Hozir ochiq darslar: ${parts.join("; ")}. To'liq yozilmagan kurslarning qolgan darslari tayyor bo'lgan sari qo'shiladi; kurs sahifasida har dars holati ko'rinadi.`;
}

export function faqItems(): FaqItem[] {
  return [
    {
      q: "Kurslar bepulmi? Ro'yxatdan o'tish kerakmi?",
      a: "Hozir barcha darslar bepul va ro'yxatdan o'tmasdan ochiq. Akkaunt yo'q: darsni ochasiz va o'qiysiz.",
    },
    { q: "Hamma darslar tayyormi?", a: availability() },
    {
      q: "Qaysi kursdan boshlash kerak?",
      a: "Dasturlashni boshlayotgan bo'lsangiz, CS50 dan. Kamida bitta real loyiha yozgan bo'lsangiz, Clean Code, System Design yoki Go (advanced). Har kurs sahifasida \"Kim uchun\" bloki bor: u kerakli tayyorgarlikni aniq aytadi.",
    },
    {
      q: "Darslar ketma-ket ochiladimi?",
      a: "Yo'q. Barcha ochiq darslarga istalgan tartibda kirish mumkin. Ketma-ketlik tavsiya, qulf emas.",
    },
    {
      q: "Test va topshiriqlar qanday ishlaydi?",
      a: "Har dars test va amaliy topshiriq bilan tugaydi. CS50 va System Design darslarida 10 savollik test, o'tish chegarasi 80%. Clean Code va Go darslarida testning barcha savoli to'g'ri bo'lishi kerak. Topshiriq javobini saytdagi maydonga yozasiz.",
    },
    {
      q: "Kodni qayerda ishga tushirish mumkin?",
      a: `Darslardagi "run" belgili kod bloklari brauzerning o'zida ishlaydi: ${RUNNABLE_LANGUAGES.join(", ")}. Bu kod serverga yuborilmaydi. Python va C birinchi marta ishga tushirilganda kerakli komponent yuklanadi (C uchun 23 MB), keyin brauzer keshidan ishlaydi. Go kodi brauzerda bajarilmaydi: u saytimiz orqali rasmiy Go Playground'ga (go.dev) yuboriladi va natija qaytadi.`,
    },
    {
      q: "Progressim qayerda saqlanadi?",
      a: "Faqat shu brauzerning o'zida (localStorage). Boshqa qurilmaga yoki boshqa brauzerga o'tmaydi, brauzer ma'lumotlarini tozalasangiz yo'qoladi. Akkaunt orqali sinxronlash hozircha yo'q.",
    },
    {
      q: "Darsdagi xatoni qanday xabar qilaman?",
      a: "Matnni belgilang: chiqqan oynada turini tanlang (noto'g'ri, g'aliz, imlo yoki taklif), ixtiyoriy izoh yozing va yuboring. Izoh belgilangan matn bilan birga saqlanadi, shuning uchun qaysi joy haqida ekani aniq bo'ladi. Dars oxirida 1-5 baho berish mumkin.",
    },
    {
      q: "Ma'lumotlarim bilan nima qilinadi?",
      a: "Baho va izohlar anonim saqlanadi. Ismingiz, e-pochtangiz so'ralmaydi. Tafsilot \"Maxfiylik\" sahifasida.",
    },
    {
      q: "Manbalar ishonchlimi?",
      a: "Har dars oxirida haqiqiy manbalar ro'yxati bor: rasmiy hujjatlar, RFC, original maqolalar, kitoblar. Darslar yozilgandan keyin ularni yozmagan tekshiruvchi birlamchi manbalar bilan solishtiradi va xatolarni tuzatadi.",
    },
    {
      q: "Nega darslar o'zbek tilida, terminlar inglizcha?",
      a: "Texnik terminlarni tarjima qilish ularni qidirishni va xalqaro hujjatlarni o'qishni qiyinlashtiradi. Shuning uchun tushuntirish o'zbekcha, atamalarning o'zi inglizcha qoladi. Atamalar lug'atida har biriga qisqa o'zbekcha izoh berilgan.",
    },
    {
      q: "Sertifikat beriladimi?",
      a: "Hozircha yo'q.",
    },
  ];
}
