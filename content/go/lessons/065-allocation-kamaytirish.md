---
n: 65
slug: allocation-kamaytirish
title: "Allocation kamaytirish: preallocation, sync.Pool va escape"
summary: "Allocation tezligi GC xarajatiga qanday bog'liq, allocation'larni profil bilan topish, escape analysis natijasini -gcflags=-m bilan o'qish, slice'larni oldindan sig'imlash, strconv.Append va sync.Pool bilan buffer'larni qayta ishlatish va bu usullar zarar qiladigan joylar."
duration: 40
sources:
  - id: gc-guide
    note: "Eliminating heap allocations bo'limi: allocation tezligi GC chastotasining asosiy omili, heap profil ko'rinishlari (inuse/alloc), escape analysis va -gcflags=-m"
  - id: 100go
    note: "Optimizations bo'limi: #95 Not understanding stack vs. heap va #96 Not knowing how to reduce allocations (API change, compiler optimizations, and sync.Pool)"
  - id: pkg-sync
    note: "Pool tipi: vaqtinchalik obyektlar to'plami, element istalgan vaqtda o'chirilishi mumkin, short-lived obyektning free list'i uchun yaramaydi"
  - id: go125
    note: "Compiler bo'limi: slice backing store ko'proq holatda stack'ga joylanadi (variablemake)"
  - id: go127
    note: "Faster memory allocation bo'limi: o'lchamga ixtisoslashgan allocation chaqiruvlari"
quiz:
  - q: "GC qo'llanmasiga ko'ra allocation'larni kamaytirish nega GC xarajatini tushiradi?"
    options:
      - "Chunki GC faqat stack'ni skanerlaydi"
      - "Chunki kam allocation heap'ni kichik qiladi va GOGC avtomatik oshadi"
      - "Chunki allocation tezligi GC tsikllari chastotasining asosiy omili, kam allocation kamroq tsikl degani"
      - "Chunki heap'dagi obyektlar sekinroq o'qiladi"
    answer: 2
    explain: "Qo'llanma allocation tezligini GC chastotasining asosiy omili va xarajatning kalit ko'rsatkichi deb ataydi. GC stack'ni ham skanerlaydi va GOGC o'z-o'zidan o'zgarmaydi; heap obyektlarining 'sekinroq o'qilishi' esa xarajatning asosiy manbai emas."
  - q: "`CollectAppend(1000)` 12 allocation va 77 800 B sarflaydi, `make([]Point, 0, n)` bilan yozilgan variant esa 1 allocation va 24 576 B. Farq sababi nima?"
    options:
      - "make GC'ni o'chirib qo'yadi"
      - "Sig'imsiz append slice o'sganda yangi massiv ajratib, eskisini nusxalaydi; oldindan sig'im berilsa, massiv bir marta ajratiladi"
      - "append har doim yangi massiv yaratadi, make esa hech qachon"
      - "Point tipi ko'rsatkich bo'lgani uchun"
    answer: 1
    explain: "Boshlang'ich sig'imi nol slice o'sib borganda runtime bir necha marta kattaroq massiv ajratib, ma'lumotni ko'chiradi (B/op shuning uchun 3 baravar katta). Uzunlik oldindan ma'lum bo'lsa, make bilan bir marta ajratish yetadi. append har doim yangi massiv yaratmaydi, faqat sig'im yetmaganda."
  - q: "`WritePooled` ichida `bufPool.Put(buf)` dan keyin ham `buf.Bytes()` natijasi chaqiruvchiga qaytarilsa (saqlansa), nima xavf tug'iladi?"
    options:
      - "Hech narsa, chunki Put buffer'ni o'chirmaydi"
      - "Kompilyatsiya xatosi"
      - "Go bunday kodni avtomatik nusxalaydi"
      - "Boshqa goroutine pool'dan shu buffer'ni olib Reset qilib yozishi mumkin va qaytarilgan bayt slice'i o'sha vaqtda o'zgarib ketadi (data race va buzilgan ma'lumot)"
    answer: 3
    explain: "Put'dan keyin buffer boshqa goroutine'ga tegishli bo'lishi mumkin. Pool'dan olingan obyekt ma'lumotini Put'dan oldin iste'mol qiling (yozib bo'ling yoki nusxalang). Shu sababli WritePooled buffer'ni io.Writer'ga Put'dan oldin yozadi."
  - q: "`-gcflags=-m` `make([]byte, 64) does not escape`, lekin `make([]byte, n) escapes to heap` deb yozdi (Go 1.24.7). Nega?"
    options:
      - "Kompilyatsiya vaqtida o'lchami noma'lum slice'ni compiler stack'ga joylay olmaydi; Go 1.25 release notes bu holatlarning ko'pini stack'ga o'tkazishini yozadi"
      - "n o'zgaruvchisi int bo'lgani uchun"
      - "make faqat 64 baytgacha stack'da ishlaydi"
      - "Chunki funksiya inline qilinmagan"
    answer: 0
    explain: "Lokal tajribada (Go 1.24.7) doimiy o'lchamli slice stack'da, o'zgaruvchan o'lchamlisi heap'da qoldi. Go 1.25 va 1.26 release notes compiler slice backing store'ni ko'proq holatlarda stack'ga joylashini aytadi. Bu yangi versiyalarda natija boshqacha bo'lishi mumkin, shuning uchun o'z toolchain'ingizda -m bilan tekshiring."
  - q: "Qaysi holatda `sync.Pool` mos kelmaydi?"
    options:
      - "Bir necha goroutine bir xil turdagi vaqtinchalik buffer'larni tez-tez ishlatadigan servis"
      - "fmt kabi paketning ichki output buffer'lari"
      - "Yopilishi shart bo'lgan DB ulanishlari: Pool elementni istalgan vaqtda xabarsiz o'chirishi mumkin, shuning uchun Close chaqirilmay qoladi"
      - "bytes.Buffer'ni qayta ishlatish"
    answer: 2
    explain: "Pool hujjati: element istalgan vaqtda xabarsiz o'chirilishi mumkin. Resurs yopilishi kerak bo'lsa, bu leak'ka olib keladi. Vaqtinchalik, holatsiz buffer'lar uchun esa Pool aynan mo'ljallangan (fmt shunday qiladi)."
  - q: "`newPoint` funksiyasi alohida tahlilda `&Point{...} escapes to heap` dedi, lekin `main` ichiga inline bo'lgan chaqiruv joyida `does not escape`. Nega?"
    options:
      - "Compiler xato qilgan"
      - "Inline qilingandan keyin tahlil chaqiruvchi kontekstida bajariladi va ko'rsatkich chaqiruvchidan chiqib ketmaydi, shuning uchun obyekt stack'da qoladi"
      - "Chunki main funksiyasi har doim stack'ni ishlatadi"
      - "Chunki Point tipi kichik"
    answer: 1
    explain: "Escape analysis inlining bilan o'zaro bog'liq (58-dars). Funksiya inline qilinsa, ko'rsatkichning taqdiri chaqiruv joyiga qarab aniqlanadi. Shu sababli bir xil kod turli joyda turlicha natija beradi, -m chiqishini chaqiruv joyi qatorida o'qing."
  - q: "Telemetriya yozuvlari parsing'ida `strings.Split` har qator uchun slice ajratadi. Optimizatsiyani nimadan boshlaysiz?"
    options:
      - "Darhol sync.Pool qo'shishdan"
      - "unsafe bilan nol-nusxali o'tkazishdan"
      - "Profil (alloc_space) va benchmark bilan bu allocation yuklamaning qanchasini tashkil qilishini aniqlashdan, so'ng oddiy o'zgartirish (Cut yoki LastIndexByte) bilan boshlashdan"
      - "Barcha funksiyalarni ko'rsatkich qaytaradigan qilishdan"
    answer: 2
    explain: "Avval o'lchaymiz: allocation haqiqatan muammo bo'lsa, eng oddiy tuzatishdan (Split o'rniga Cut/LastIndexByte, oldindan sig'im) boshlanadi. Pool va unsafe murakkablik va xavf qo'shadi, ularni oxirgi bosqichga qoldiring."
task:
  title: "speeds funksiyasida allocation'larni kamaytirish"
  prompt: |
    `speeds` telemetriya qatorlaridan tezliklarni ajratib oladi. Hozir har qator uchun `strings.Split` yangi slice ajratadi va natija slice'i `append` bilan bosqichma-bosqich o'sadi, shuning uchun bitta chaqiruvda yuzdan ortiq allocation bo'ladi (starter'da `allocs <= 1: false`).

    `speeds`ni qayta yozing: natija slice'ini bir marta oldindan sig'imlang, `strings.Split` o'rniga allocation qilmaydigan usul ishlating. Xatti-harakat o'zgarmasin: to'rt maydonli bo'lmagan yoki tezligi son bo'lmagan qatorlar o'tkazib yuboriladi. `main` o'zgarmasin. Kutilgan natija: natijalar soni `99`, `allocs <= 1: true`.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "strconv"
        "strings"
        "testing"
    )

    // speeds "imei,lat,lon,tezlik" qatorlaridan tezliklarni ajratib oladi.
    // Yaroqsiz qatorlar o'tkazib yuboriladi.
    func speeds(lines []string) []float64 {
        var out []float64
        for _, l := range lines {
            parts := strings.Split(l, ",")
            if len(parts) != 4 {
                continue
            }
            v, err := strconv.ParseFloat(parts[3], 64)
            if err != nil {
                continue
            }
            out = append(out, v)
        }
        return out
    }

    func main() {
        lines := make([]string, 100)
        for i := range lines {
            lines[i] = fmt.Sprintf("86612345678%04d,41.31,69.24,%d.5", i, i%120)
        }
        lines[7] = "buzuq qator"

        got := speeds(lines)
        fmt.Println("natijalar soni:", len(got), "birinchi:", got[0], "oxirgi:", got[len(got)-1])

        allocs := testing.AllocsPerRun(20, func() { speeds(lines) })
        fmt.Println("allocs <= 1:", allocs <= 1)
    }
  solution: |
    package main

    import (
        "fmt"
        "strconv"
        "strings"
        "testing"
    )

    // speeds "imei,lat,lon,tezlik" qatorlaridan tezliklarni ajratib oladi.
    // Yaroqsiz qatorlar o'tkazib yuboriladi.
    func speeds(lines []string) []float64 {
        out := make([]float64, 0, len(lines))
        for _, l := range lines {
            i := strings.LastIndexByte(l, ',')
            if i < 0 || strings.Count(l, ",") != 3 {
                continue
            }
            v, err := strconv.ParseFloat(l[i+1:], 64)
            if err != nil {
                continue
            }
            out = append(out, v)
        }
        return out
    }

    func main() {
        lines := make([]string, 100)
        for i := range lines {
            lines[i] = fmt.Sprintf("86612345678%04d,41.31,69.24,%d.5", i, i%120)
        }
        lines[7] = "buzuq qator"

        got := speeds(lines)
        fmt.Println("natijalar soni:", len(got), "birinchi:", got[0], "oxirgi:", got[len(got)-1])

        allocs := testing.AllocsPerRun(20, func() { speeds(lines) })
        fmt.Println("allocs <= 1:", allocs <= 1)
    }
  solutionNotes: |
    - `make([]float64, 0, len(lines))` natija massivini bir marta ajratadi: bu yagona qolgan allocation.
    - `strings.Split` o'rniga `strings.Count` (vergullar sonini tekshirish) va `strings.LastIndexByte` (oxirgi maydon boshlanishi) ishlatildi. Ikkalasi ham allocation qilmaydi, `l[i+1:]` esa mavjud satrning kesimi (nusxa emas).
    - Xatti-harakat saqlangan: yaroqsiz qatorlar (`buzuq qator`) tushib qoladi, shuning uchun 100 qatordan 99 natija.
    - `testing.AllocsPerRun` deterministik hisoblaydi; CI'da `allocs/op` chegarasi vaqt chegarasidan ishonchliroq (61-dars).
    - Oldindan sig'im `len(lines)` ga teng, lekin yaroqsiz qatorlar bo'lsa, ortiqcha joy qoladi. Bu ataylab qilingan kelishuv: ortiqcha sig'im ko'pincha qayta ajratishdan arzonroq.
  checklist:
    - "Natija slice'i `make` bilan oldindan sig'imlangan"
    - "Har qator uchun `strings.Split` ishlatilmaydi"
    - "Natijalar soni `99`, birinchi `0.5`, oxirgi `99.5`"
    - "`allocs <= 1: true`"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Servisning CPU profilida (62-dars) `runtime.mallocgc`, `runtime.gcBgMarkWorker` va `runtime.memmove` tepada turibdi. Bu sizning kodingiz juda ko'p vaqtinchalik obyekt yaratayotganining belgisi: har bir so'rovda satrlar bo'linadi, slice'lar bosqichma-bosqich o'sadi, bufferlar yangidan ajratiladi. Har bir allocation o'zi arzon, lekin ularning soni ko'paysa, GC tez-tez ishga tushadi va CPU'ning sezilarli qismi ishlab chiqarishga emas, tozalashga ketadi. Latency'da esa bu p99 sakrashlari bo'lib ko'rinadi.

GC qo'llanmasi buni aniq aytadi: GC xarajatini kamaytirishning usullaridan biri GC boshqaradigan qiymatlar sonini kamaytirish, va bu eng katta yaxshilanish beradigan usullardan biri, chunki allocation tezligi GC chastotasining asosiy omili (GOGC bo'limida ko'rsatilganidek). Node.js'da V8'ning young generation GC'si qisqa umrli obyektlarni arzon tozalaydi va ko'p dasturchilar allocation haqida o'ylamaydi. Go'da GC boshqacha ishlaydi (55-dars), va qimmat allocation'larni kamaytirish eng natijali optimizatsiyalardan biri.

Lekin bu optimizatsiya ham o'lchovga tayanadi. Bu dars uch savolga javob beradi: allocation'ni qanday topish, uni qanday yo'qotish (preallocation, buffer'ni qayta ishlatish, `sync.Pool`, escape'ni oldini olish) va qachon to'xtash.

## Asosiy g'oya

### Avval topish

GC qo'llanmasi tartibni beradi. Birinchisi, GC haqiqatan xarajat manbai ekanini aniqlash. Ikkinchisi, allocation qayerdan kelishini heap profilidan topish (63-dars). Heap profil to'rt ko'rinishga ega: `inuse_objects`, `inuse_space`, `alloc_objects` va `alloc_space`. Qo'llanma GC xarajatini kamaytirish uchun odatda eng foydali ko'rinish `alloc_space` ekanini yozadi, chunki u to'g'ridan-to'g'ri allocation tezligiga mos keladi. Profil namuna olishi sababli har allocation'ni ko'rsatmaydi, lekin issiq nuqtalarni topish uchun yetarli. Funksiya darajasida esa benchmark'dagi `allocs/op` (61-dars) aniq son beradi.

### Keyin yo'qotish

Allocation'ni yo'qotishning to'rt oddiy yo'li:

1. **Natija hajmi ma'lum bo'lsa, oldindan sig'imlash.** `make([]T, 0, n)` massivni bir marta ajratadi; `var out []T` va `append` esa o'sish paytida yangi massiv ajratib, eskisini ko'chiradi.
2. **Oraliq ma'lumotni yaratmaslik.** `strings.Split` slice ajratadi, `strings.Cut` yoki `LastIndexByte` ajratmaydi. `fmt.Sprintf` o'rniga `strconv.AppendFloat`/`AppendInt` mavjud bufferga yozadi.
3. **Buffer'ni qayta ishlatish.** Qayta-qayta kerak bo'ladigan vaqtinchalik buffer'ni pool'da saqlash (`sync.Pool`).
4. **Obyekt heap'ga qochmasligini ta'minlash.** Compiler obyektni stack'da qoldira olsa, u GC'ga umuman ko'rinmaydi.

### sync.Pool

`sync` paketi hujjatiga ko'ra `Pool` - alohida saqlanadigan va olinadigan vaqtinchalik obyektlar to'plami. Muhim shartlar: pool'dagi element istalgan vaqtda xabarsiz o'chirilishi mumkin; `Pool` bir nechta goroutine'dan xavfsiz; maqsadi - ajratilgan, lekin hozir ishlatilmayotgan obyektlarni keyingi ishlatish uchun saqlab, GC'ga bosimni kamaytirish; birinchi ishlatishdan keyin nusxalanmasligi kerak. Yaxshi misol sifatida hujjat `fmt` paketini keltiradi: u vaqtinchalik output buffer'larining dinamik o'lchamli to'plamini ushlaydi, yuklama oshganda kengayadi, tinchlanganda qisqaradi. Yomon misol: qisqa umrli obyekt ichidagi free list, chunki xarajat yetarlicha taqsimlanmaydi.

`Get` pool bo'sh bo'lsa yoki pool'ni e'tiborsiz qoldirsa `New` funksiyasini chaqiradi; `Put` obyektni qaytaradi. Hujjatning xotira modeli bilan bog'liq kafolati: `Put(x)` `Get` shu `x` ni qaytarishidan oldin sodir bo'ladi (synchronizes before), ya'ni obyekt xavfsiz uzatiladi.

## Chuqurroq: escape analysis va pool tuzoqlari

### Escape analysis

Compiler har bir o'zgaruvchi uchun uning umri funksiyadan tashqariga chiqadimi yoki yo'qligini tahlil qiladi. Chiqmasa, qiymat stack'da yashaydi va funksiya tugagach o'z-o'zidan yo'qoladi. Chiqsa, heap'ga ajratiladi. GC qo'llanmasi qaror sababini ko'rsatadigan bayroqni beradi: `go build -gcflags=-m=3 [package]` (oddiy `-m` qisqa natija beradi).

Quyidagi dastur (Go 1.24.7) oddiy holatlarni ko'rsatadi:

```go
// newPoint ko'rsatkich qaytaradi: obyekt funksiyadan tashqariga chiqadi.
func newPoint(lat, lon float64) *Point {
	return &Point{Lat: lat, Lon: lon}
}

func fixedBuf() int {
	buf := make([]byte, 64)
	return len(buf)
}

func variableBuf(n int) int {
	buf := make([]byte, n)
	return len(buf)
}

func show(p Point) {
	fmt.Println(p)
}
```

`go build -gcflags=-m` natijasidan tegishli qatorlar:

```text
./main.go:11:9: &Point{...} escapes to heap
./main.go:21:13: make([]byte, 64) does not escape
./main.go:26:13: make([]byte, n) escapes to heap
./main.go:31:14: p escapes to heap
./main.go:35:15: &Point{...} does not escape
```

Nimani o'qiymiz:

- `&Point{...}` `newPoint` ichida heap'ga qochadi, chunki ko'rsatkich qaytariladi. Lekin `main` ichida `newPoint` inline qilingan chaqiruv joyida (35-qator) `does not escape`: inlining'dan keyin tahlil chaqiruvchi kontekstida bajariladi va ko'rsatkich chaqiruvchidan chiqib ketmaydi. Demak, escape qarori inlining (58-dars) bilan bog'liq va bir xil kod joyga qarab turlicha natija beradi.
- `make([]byte, 64)` stack'da qoladi, `make([]byte, n)` esa Go 1.24.7 da heap'ga qochadi: o'lchami kompilyatsiya vaqtida noma'lum. Go 1.25 release notes compiler slice backing store'ni stack'ga ko'proq holatlarda joylashini aytadi (shu o'zgarish natijasi noto'g'ri `unsafe.Pointer` ishlatilishining oqibatlarini kuchaytirishi mumkin, bisect vositasi bilan topiladi), Go 1.26 yana kengaytirgan. Bu qism lokal tekshirilmagan: sandbox'da Go 1.24.7. Yangi toolchain'da `-m` natijasi boshqacha bo'lishi mumkin.
- `p escapes to heap` (31-qator): `fmt.Println(p)` argumentni `any` interface'iga o'giradi va qiymat heap'ga qochadi. `fmt` funksiyalarida allocation'ning keng tarqalgan manbai.

Odatiy qochish sabablari: ko'rsatkichni qaytarish, interface'ga o'girish (`any` argumentlar), closure orqali ushlash, o'lchami noma'lum `make`, kanalga yoki global o'zgaruvchiga yozish. Qoida: ko'rsatkich qaytarish ("allocation-ni tejash uchun") ko'pincha teskari natija beradi; kichik struct'ni qiymat bilan qaytarish stack'da qoladi.

Go 1.27 release notes compiler endi o'lchamga ixtisoslashgan allocation funksiyalarini chaqirishini yozadi: kichik (80 baytdan kam) allocation'lar narxi 30% gacha tushadi, real allocation-og'ir dasturlarda umumiy yaxshilanish ~1% kutiladi. Bu allocation'ning arzonlashishi, lekin ularni yo'qotish baribir GC'ni ham yengillashtiradi. Qism kompilyatsiya qilinmagan (Go 1.27 yo'q).

### Pool tuzoqlari

1. **Put'dan keyin ishlatmang.** Pool'ga qaytarilgan obyekt boshqa goroutine'ga berilishi mumkin. Buffer'dan olingan bayt slice'ini `Put`dan keyin saqlash yoki qaytarish ma'lumotni buzadi. Ma'lumotni `Put`dan oldin iste'mol qiling (yozing yoki nusxalang).
2. **Reset qiling.** `Get` oldingi foydalanuvchining holatini qaytarishi mumkin. Misolda `buf.Reset()`.
3. **Katta buffer'larni saqlamang.** Pool'dagi elementlar bir xil darajadagi xotira narxiga ega bo'lishi kerak. `fmt` manba kodida bu qoida izohlangan: `cap(p.buf) > 64*1024` bo'lsa buffer tashlanadi va faqat printer qayta ishlatiladi. Bitta anomal katta so'rov pool'ni katta bufferlar bilan to'ldirib qo'ymasligi kerak.
4. **Pool resurs yopishga yaramaydi.** Element istalgan vaqtda xabarsiz o'chirilishi mumkin; DB ulanishi kabi yopilishi shart obyektlarni pool'da saqlamang.
5. **Tipni tekshiring.** `Get()` `any` qaytaradi; `New` har doim bir xil tip qaytarsin.

## Misol: nuqtalar yig'ish va formatlash

Ikki juft funksiya. Birinchisi 1000 ta `Point` yig'adi: `CollectAppend` sig'imsiz `append` bilan, `CollectPrealloc` `make([]Point, 0, n)` bilan. Ikkinchisi 100 nuqtani matn qatori sifatida `io.Writer`ga yozadi: `WriteNaive` har chaqiruvda yangi `bytes.Buffer` va `fmt.Fprintf` bilan, `WritePooled` esa pool'dan buffer olib, `strconv.AppendFloat`/`AppendInt` bilan:

```go
var bufPool = sync.Pool{
	New: func() any { return new(bytes.Buffer) },
}

// WritePooled buffer'ni pool'dan oladi va strconv.Append* bilan formatlaydi.
func WritePooled(w io.Writer, pts []Point) error {
	buf := bufPool.Get().(*bytes.Buffer)
	buf.Reset()
	defer bufPool.Put(buf)

	var tmp [32]byte
	for _, p := range pts {
		buf.Write(strconv.AppendFloat(tmp[:0], p.Lat, 'f', 5, 64))
		buf.WriteByte(',')
		buf.Write(strconv.AppendFloat(tmp[:0], p.Lon, 'f', 5, 64))
		buf.WriteByte(',')
		buf.Write(strconv.AppendInt(tmp[:0], p.TS, 10))
		buf.WriteByte('\n')
	}
	_, err := w.Write(buf.Bytes())
	return err
}
```

Funksiya buffer'ni `Put`dan oldin `w.Write` ga beradi; `tmp` lokal massiv stack'da qoladi. Test (`TestSameOutput`) ikkala yozuvchi bayt-bayt bir xil chiqish berishini tasdiqlaydi. Go 1.24.7, linux/amd64, Intel Xeon 2.10GHz, 2 vCPU (shared VM), `go test -run '^$' -bench . -benchmem -count=8`. `B/op` va `allocs/op` barcha 8 ishga tushirishda bir xil bo'ldi; `ns/op` esa o'sish tartibida, median (4- va 5-qiymatning o'rtachasi) bilan:

```text
CollectAppend    77800 B/op  12 allocs/op  ns/op: 23085 25839 26566 27636 27932 29061 29138 33893  (median 27784)
CollectPrealloc  24576 B/op   1 allocs/op  ns/op:  7878  8015  8499  9143  9891 10108 10616 11216  (median 9517)
WriteNaive        9776 B/op 208 allocs/op  ns/op: 58308 60064 60339 64461 68234 76282 94013 105033 (median 66348)
WritePooled          0 B/op   0 allocs/op  ns/op: 36487 36965 37824 37866 37962 39565 40323 41335  (median 37914)
```

Ikkala juftlikda ham vaqt oraliqlari kesishmaydi (`Append`ning eng kichigi 23085, `Prealloc`ning eng kattasi 11216; `Naive`ning eng kichigi 58308, `Pooled`ning eng kattasi 41335), shuning uchun farq shovqin emas: medianalar bo'yicha oldindan sig'imlash 2.9 baravar, pool va `strconv.Append` esa 1.75 baravar tezlashtirdi. Bu raqamlar faqat shu mashina va shu benchmark uchun; benchstat yo'q (61-dars), shuning uchun statistik test o'tkazilmadi.

`CollectAppend` 12 allocation qildi: slice o'sib, har safar kattaroq massiv ajratildi va 77 800 bayt sarfladi, `Prealloc` esa 24 576 baytlik bitta massiv. Bu 1000 ta 24 baytlik `Point` uchun aniq massiv hajmi. Qolgan 53 224 bayt - o'sish paytida tashlab yuborilgan oraliq massivlar, GC'ga qoldirilgan axlat.

Topshiriqda xuddi shu yondashuvni telemetriya qatorlarini parsing qilishga qo'llaysiz: `strings.Split` allocation'i va `append` o'sishini bartaraf etasiz.

## Qachon qo'llamaslik kerak

- Profil allocation'ni muammo deb ko'rsatmasa, tegmang. GC xarajati yuklamaning kichik qismi bo'lsa, allocation kamaytirish yaxshilanish bermaydi, kodni esa o'qilishi qiyinlashtiradi. GC qo'llanmasi ham avval GC xarajatini aniqlashni so'raydi.
- `sync.Pool`ni "har ehtimolga qarshi" qo'ymang. U `Put`dan keyin ishlatish xatolari, katta buffer'lar saqlanishi, `Reset` unutilishi kabi yangi xatolarni olib keladi. Oddiy `make` bilan oldindan sig'imlash ko'pincha yetadi va xavfsiz.
- Qisqa umrli obyekt ichida pool-free-list yaratmang: hujjat buni noto'g'ri deb aytadi.
- Ko'rsatkich qaytarishni "tezroq" deb o'ylamang. U ko'pincha obyektni heap'ga chiqaradi. Kichik struct'ni qiymat bilan uzating va qaytaring.
- Bufferlarni qayta ishlatganda xavfsizlikni unutmang: pool'dagi buffer'da oldingi so'rovning ma'lumoti (parol, token) qolishi mumkin. Maxfiy ma'lumot bilan ishlaganda `Reset` yetmaydi.
- Benchmark kichik ma'lumot bilan yaxshi ko'rinishi, katta yuklamada esa pool'ning o'zi bahs manbai bo'lishi mumkin. Haqiqiy yuklamada o'lchang.

## Stack'da: Node.js/TypeScript bilan solishtirish

Node.js'da massivga `push` qilish amortizatsiya qilingan va ko'p holda e'tibor talab qilmaydi, `Buffer` bilan ishlash esa alohida mavzu. Go'da `append` ham amortizatsiyalangan, lekin har o'sishda yangi massiv ajratiladi va eskisi axlatga aylanadi: uzunligi ma'lum bo'lsa, `make` bilan sig'im bering. TypeScript'dagi `string.split(',')` o'rniga Go'da `strings.Cut`/`LastIndexByte` ishlatilganda allocation yo'qoladi, bu tilning "qiymatlar, ko'rsatkichlar" modeli beradigan imkoniyat.

Amaliy tavsiyalar:

- Issiq yo'l (hot path) funksiyalari uchun benchmark yozing va `-benchmem` bilan `allocs/op` ni CI'da cheklang (masalan, `testing.AllocsPerRun` bilan). Bu vaqt chegarasidan ishonchli (61-dars).
- Tuzatishdan oldin `-gcflags=-m` va heap profilini ko'ring; keyin eng oddiy usuldan boshlang: `make` bilan sig'im, `Cut`, `strconv.Append*`.
- `sync.Pool`ni faqat o'lchov foyda ko'rsatgandan keyin, `Reset`, o'lcham chegarasi va `Put`dan oldin iste'mol qoidalari bilan qo'shing.
- Toolchain yangilanganda allocation sonlarini qayta o'lchang: Go 1.25-1.27 compiler yaxshilanishlari (stack'ga joylash, tezroq allocation) natijani o'zgartirishi mumkin.

## Xulosa

- Allocation tezligi GC chastotasining asosiy omili: GC qo'llanmasiga ko'ra, allocation kamaytirish eng katta yaxshilanish beradigan usullardan biri. Topish: heap profil (`alloc_space`) va benchmark `allocs/op`.
- Eng oddiy tuzatishlar: oldindan sig'im (`make([]T, 0, n)`), oraliq slice yaratmaydigan funksiyalar (`Cut`, `LastIndexByte`), `strconv.Append*`. Lokal o'lchovda sig'im 12 allocation'ni 1 ga tushirdi.
- `sync.Pool` vaqtinchalik, holatsiz buffer'lar uchun: `Reset`, `Put`dan oldin iste'mol, katta buffer'larni tashlash. Element istalgan vaqtda o'chirilishi mumkin, resurslar uchun yaramaydi.
- `-gcflags=-m` obyekt nima uchun heap'ga qochishini ko'rsatadi; natija inlining va toolchain versiyasiga bog'liq (Go 1.25+ da slice'lar ko'proq stack'da).
- Optimizatsiyadan oldin o'lchang va faqat profil allocation'ni muammo deb ko'rsatsa, murakkab usullarga o'ting.
