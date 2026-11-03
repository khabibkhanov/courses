# Dars yozish qoidalari (Go kursi)

Bu fayl Go kursidagi har bir darsni yozish uchun yagona standart. Format Clean Code kursi bilan bir xil (`format: clean-code`): har dars bitta `.md` fayl, test va topshiriq frontmatter ichida. Namuna: `lessons/001-go-falsafa-va-versiyalar.md`.

## Fayl

- Yo'l: `content/go/lessons/NNN-slug.md` (NNN - uch xonali raqam, slug - `course.yaml`dagi bilan bir xil).
- Frontmatter sxemasi: `src/lib/content/loaders/clean-code.ts` (`n`, `slug`, `title`, `summary`, `duration`, `sources`, `quiz`, `task`).
- Tekshiruv: `npx tsx scripts/validate.ts --partial --from N --to M` (yoki `npm run validate -- go N M`). Xatosiz o'tishi shart.
- Agent faqat o'z dars fayllarini yozadi. `course.yaml`, `sources.yaml`, validator va boshqa darslarga tegmaydi. Yangi manba kerak bo'lsa, hisobotda so'raydi (id, sarlavha, muallif, yil, kind, tekshirilgan URL).
- Lug'at atamalari: `content/glossary/go-mNN.yaml` (NN - modul raqami, masalan `go-m01.yaml`). Faqat o'z modulingiz fayli, `course: go`.

## Til va uslub

- O'zbek tili, lotin yozuvi. Apostrof oddiy `'` (o', g', ma'no).
- Texnik terminlar inglizcha: goroutine, escape analysis, garbage collector, happens-before. Birinchi uchraganda qisqa o'zbekcha izoh berish mumkin.
- **Em-dash (—) va en-dash (–) taqiqlangan.** Faqat oddiy defis `-`. Validator buni tekshiradi.
- Emoji yo'q. Maqtov va bo'sh so'zlar yo'q. To'g'ridan-to'g'ri, aniq. "deylik", "taxminan", "xotiradan" yo'q.
- O'quvchi: 5 yillik tajribali backend dasturchi (Node.js/NestJS, TypeScript, PostgreSQL, Redis). Go'ni sirtdan biladi yoki endi o'tmoqda. Dasturlash asoslarini tushuntirmang, lekin har bir Go mavzusini spetsifikatsiya va runtime darajasida bering. Node.js/TypeScript bilan farq foydali bo'lgan joyda taqqoslang (event loop va goroutine, Promise va channel, exception va error qiymati).
- Misollar domeni: telemetriya (GPS nuqtalari, yoqilg'i datchiklari), buyurtmalar, to'lovlar, foydalanuvchilar. Kompaniya nomi yo'q (neytral "avtopark monitoring platformasi" o'quv misoli). Foo/bar yo'q.

## Aniqlik va manbalar

- Birlamchi manbalar ustun: spetsifikatsiya, xotira modeli, release notes, runtime hujjatlari, Go Blog. Dars faqat `sources.yaml`dagi id'larga tayanadi.
- Versiya va sana da'volari (qaysi Go versiyasida nima paydo bo'lgan, qaysi biri default bo'lgan) rasmiy release notes'dan tekshiriladi va matnda versiya aniq yoziladi ("Go 1.25 dan", "Go 1.26 da default").
- Manbaga fikr nisbat berilsa, u haqiqatan o'sha manbada bo'lishi shart. Aniq bo'lim nomini bilmasangiz yozmang (`note`da umumiyroq yozing).
- Web tekshiruvi: foydalanuvchi talabi bo'yicha WebFetch emas, Kernel cloud brauzeri (`mcp__Kernel__*`) orqali. Har agent o'z sessiyasini ochadi (`manage_browsers` create, nom: `go-lesson-<dars raqamlari>`), sahifalarni `execute_playwright_code` bilan o'qiydi (kerakli bo'limni qidirib, qisqa natija qaytaring), tugagach sessiyani o'chiradi. O'qib bo'lmagan sahifa (masalan, O'Reilly "Access Denied") haqida da'vo yozmang.
- Tekshirib bo'lmagan narsa matnga kirmaydi yoki ochiq belgilanadi ("bu muallifning tajribaviy bahosi", "bu qism tekshirilmagan"). Raqamlar (ns/op, MB, foiz) faqat o'zingiz o'lchagan yoki manbada aniq yozilgan bo'lsa beriladi; o'lchaganda sharoitni (Go versiyasi, `GOARCH`, mashina turi) yozing.
- Mualliflik huquqi: manbalardan uzun iqtibos yo'q. Bitta manbadan ko'pi bilan bitta, 15 so'zdan qisqa iqtibos. Qolgani o'z so'zlaringiz bilan.

## Tuzilma (majburiy `##` bo'limlar, shu tartibda)

1. `## Muammo` - bu mavzu production'da qanday real og'riqni hal qiladi yoki qaysi xatoga olib keladi.
2. `## Asosiy g'oya` - qoida yoki mexanizmning o'zi, manbalarga tayangan holda.
3. `## Chuqurroq: ...` - ichki mexanika, nozik holatlar, versiyalar o'rtasidagi farq. Kerak bo'lsa `###` kichik bo'limlar.
4. `## Misol: ...` - ishlaydigan Go kodi va natijasi. Har bir qaror nega shunday ekanini tushuntiring.
5. `## Qachon qo'llamaslik kerak` - qoida/vosita zarar qiladigan holatlar, trade-off'lar. Halol va aniq.
6. `## Stack'da: ...` (tavsiya etiladi) - Node.js/TypeScript bilan farq yoki Go servisida aniq qo'llanilishi.
7. `## Xulosa` - 4-6 ta qisqa band.

- Matn hajmi: kamida 1100 so'z (kod bloklarisiz), maqsad 1500-2200. Chuqur mavzularda (runtime, concurrency, memory model) ko'proq.
- Kamida bitta ` ```go ` blok. Kod real bo'lsin; kompilyatsiya talablari pastda.
- Boshqa darslarga havola: "(23-dars)" ko'rinishida, faqat `course.yaml`dagi raqam va mavzuga mos.

## Kod: kompilyatsiya va tekshiruv

- Sandbox'da Go 1.24.x o'rnatilgan, yangisini yuklab bo'lmaydi (tarmoq cheklangan, `proxy.golang.org` yopiq). Shuning uchun:
  - Go 1.24 va undan eski xususiyatlar (generics, iter, slices/maps, slog, Swiss map, `unique`, `weak`, `os.Root` va h.k.) bo'yicha kod **albatta** lokal `go run` / `go vet` / `go test` (kerak bo'lsa `-race`) bilan ishga tushiriladi, matndagi natija haqiqiy chiqish bilan bir xil bo'ladi.
  - Go 1.25+ xususiyatlari (`sync.WaitGroup.Go`, `testing/synctest`, `runtime/trace.FlightRecorder`, container-aware GOMAXPROCS, Green Tea GC, 1.26 dagi `new(expr)`, `errors.AsType`, self-referential constraint, 1.27 dagi generic metodlar, `goroutineleak` profili, `encoding/json/v2`) lokal kompilyatsiya qilinmaydi. Ular uchun kod rasmiy hujjat yoki release notes'dagi namunaga tayanadi, dars matnida versiya yoziladi, hisobotda "kompilyatsiya qilinmagan" deb ro'yxatga kiritiladi. Natijani o'ylab topmang: chiqishni ko'rsatmang yoki "natija sizning mashinangizda farq qilishi mumkin, chunki ..." deb aniq sababni yozing.
  - Uchinchi tomon modullari (pgx, go-redis, grpc, otel, prometheus, x/sync) sandbox'da yuklanmaydi. Ularning kodi hujjatdagi API'ga tayanadi, hisobotda "kompilyatsiya qilinmagan" deb belgilanadi. Imkon bo'lsa, mexanizmni standart kutubxona bilan ko'rsating va tashqi kutubxonani faqat bog'lash uchun ishlating.
- Bir dars ichidagi to'liq dastur `package main` bilan boshlansin va o'z-o'zidan ishlasin; parcha ko'rsatilsa, to'liq dastur ham bo'lishi shart emas, lekin sintaksis to'g'ri bo'lsin.
- Kod `gofmt`dan o'tgan bo'lsin (`gofmt -l` bo'sh).
- Brauzerda Go ishga tushirilmaydi (`go run` bloki yo'q; validator "run" bloki uchun Go'ni qabul qilmaydi). Natijani kod blokidan keyin oddiy ` ```text ` blokida bering.
- Xato yoki race ko'rsatadigan kod bo'lsa, buni matnda aniq yozing ("bu kod data race'ga ega").

## Mashqlar

- `quiz`: 5-6 savol. Faktni yodlash emas, tushunishni tekshirsin (vaziyat, kod parchasi, "bu kod nima chiqaradi", "qaysi holatda..."). Noto'g'ri variantlar ishonarli bo'lsin. `answer` - 0 dan boshlanadigan indeks. **To'g'ri javob o'rnini aralashtiring** (0, 1, 2, 3 hammasi uchrasin). `explain` nega to'g'ri va nega boshqalari noto'g'ri ekanini aytadi.
- `task`: amaliy topshiriq. `lang: go`. `starter` - muammoli, lekin kompilyatsiya bo'ladigan kod (15-60 qator). `solution` - to'liq yechim. `solutionNotes` - markdown ro'yxat, nima va nega. `checklist` - 3-6 ta tekshiriladigan band. Boshlang'ich kod va yechim ikkalasi ham `go vet` dan o'tsin; yechim topshiriq shartini bajarishini `go test` (yoki `go run`) bilan tasdiqlang. Concurrency topshiriqlarida `-race` bilan ham.

## YAML ehtiyotkorligi

- `: ` yoki `#` bor, yoki `"`/`'`/`[`/`{`/`-` bilan boshlanadigan qiymatlarni qo'shtirnoqqa oling.
- Qo'shtirnoq ichida `"` bo'lsa `\"` qiling. Go kodida `"` ko'p: kod va ko'p qatorli matn uchun `|` block scalar, bir xil chekinish bilan.
- Frontmatter ichidagi Go kodida tab o'rniga bo'shliq ishlating (YAML tab'ni taqiqlaydi); `gofmt` tekshiruvi esa alohida fayl uchun bajariladi.

## Atamalar lug'ati

Dars yangi texnik atamani tushuntirsa, uni `content/glossary/go-mNN.yaml`ga qo'shing:

```yaml
- term: escape analysis
  aliases: []
  uz: "Compiler o'zgaruvchi funksiyadan tashqariga chiqib ketishini aniqlaydi va uni stack o'rniga heap'ga joylashtiradi."
  course: go
  lesson: 20
```

- `term` va `aliases` - darslar matnida aynan shu ko'rinishda uchraydigan shakllar. Atama faqat o'z kursi darslarida bog'lanadi. Katta harfli qisqartmalar faqat katta harf bilan topiladi.
- `uz` - 1-2 gap, oddiy matn. `lesson` - atama batafsil tushuntirilgan dars.
- Umumiy so'zlarni (data, server, test, package) qo'shmang. Takror yo'q: boshqa fayllardagi (system-design, clean-code, cs50, boshqa go-mNN) atamalarni tekshiring.

## Hisobot (agent oxirida, qisqa)

- Yozilgan fayllar ro'yxati va har birining so'z soni.
- Kompilyatsiya qilinmagan kod (sabab bilan: yangi versiya yoki tashqi modul).
- Ishonchsiz yoki tekshirib bo'lmagan faktlar.
- Qo'shilishi so'ralgan yangi manbalar (id, sarlavha, muallif, yil, kind, tekshirilgan URL).
- Validator natijasi.
