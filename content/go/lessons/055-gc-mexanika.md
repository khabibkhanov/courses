---
n: 55
slug: gc-mexanika
title: "Garbage collector: tri-color, write barrier va pacing"
summary: "Go GC'ning fazalari, tri-color belgilash, hybrid write barrier, mutator assist va 25 foizlik CPU maqsadi qanday ishlaydi, GC'ning haqiqiy narxi runtime/metrics va gctrace'da qanday ko'rinadi."
duration: 45
sources:
  - id: gc-guide
    note: "Understanding costs bo'limi: GC CPU va xotira narxi modeli; Implementation-specific optimizations: pointer-free qiymatlar; non-moving va concurrent tabiati haqidagi umumiy tavsif"
  - id: runtime-hacking
    note: "Write barriers bo'limi: go:nowritebarrier, go:nowritebarrierrec va go:yeswritebarrierrec direktivalari, scheduler ichida write barrier'ni taqiqlash sababi"
  - id: pkg-runtime
    note: "GODEBUG ro'yxatidagi gctrace maydonlari tavsifi, runtime.GC va MemStats hujjatlari"
quiz:
  - q: "Mark fazasi davomida goroutine heap'dagi obyektning yagona ko'rsatkichini o'z stack'idagi o'zgaruvchiga ko'chirdi, so'ng heap'dagi maydonni nil qildi. Hybrid write barrier bu obyektni GC'dan qanday himoya qiladi?"
    options:
      - "Barrier faqat yangi yozilayotgan qiymatni (nil) belgilaydi, shuning uchun himoya yo'q va obyekt yo'qoladi"
      - "GC har safar mark fazasini boshidan qayta boshlaydi"
      - "Qayta yozilayotgan eski qiymat (`shade(*slot)`) belgilanadi, ya'ni obyekt kulrang bo'ladi va yo'qolmaydi"
      - "Barrier goroutine'ni to'xtatib, stack'ini qayta skanerlaydi"
    answer: 2
    explain: "mbarrier.go pseudokodi: `shade(*slot)` eski qiymatni belgilaydi. Yuasa tipidagi bu qism obyektni heap'dan stack'ka 'yashirib' ko'chirish yo'lini yopadi. Birinchi variant barrier'ning bir yarmini unutadi. GC mark fazasini qayta boshlamaydi: izohga ko'ra stack bir marta skanerlanadi va qayta skanerlanmaydi."
  - q: "Kodda `t.ID = 7` (int maydon) va `t.Last = p` (ko'rsatkich maydoni) bor. Compiler chiqargan assembly'da (Go 1.24.7, amd64) nima farq qiladi?"
    options:
      - "Ko'rsatkichni yozishdan oldin `runtime.writeBarrier` bayrog'i tekshiriladi va yoqilgan bo'lsa `runtime.gcWriteBarrier2` chaqiriladi; int yozish oddiy `MOVQ`"
      - "Ikkalasida ham bir xil write barrier bor, chunki compiler turni hisobga olmaydi"
      - "Int yozishda barrier bor, ko'rsatkichda yo'q"
      - "Ikkalasida ham barrier yo'q: barrier faqat runtime paketining ichida ishlaydi"
    answer: 0
    explain: "Darsdagi tajribada setID faqat `MOVQ BX, (AX)` ga aylandi, setLast esa `CMPL runtime.writeBarrier(SB), $0` va `CALL runtime.gcWriteBarrier2` oladi. Barrier faqat heap'ga ko'rsatkich yozishda kerak; mark fazasi tugaganda bayroq o'chiq va narx bitta tekshiruvga tushadi."
  - q: "Servis ichida GC fazasi davomida goroutine'lar sekinlashdi, `/cpu/classes/gc/mark/assist:cpu-seconds` esa katta. Bu nimani anglatadi?"
    options:
      - "Fon GC worker'lari ishlamayapti, shuning uchun GC to'xtab qolgan"
      - "GC to'xtash (STW) vaqti 100 ms dan oshgan"
      - "Heap'ga ajratayotgan goroutine'larning o'zi mark ishining bir qismini bajarmoqda: ajratish tezligi fon worker'lar ulgura oladigan tezlikdan yuqori"
      - "Write barrier o'chirilgan"
    answer: 2
    explain: "mutator assist: mark paytida ko'p ajratayotgan goroutine ajratish hajmiga mutanosib mark ishi bajarishga majbur qilinadi. Fon worker'lar uchun maqsad CPU'ning 25 foizi (gcBackgroundUtilization), qolganini assist to'ldiradi. Assist STW emas: goroutine to'xtamaydi, balki o'z CPU vaqtini GC'ga sarflaydi. Darsdagi tajribada assist umumiy CPU'ning 43-44 foizini oldi."
  - q: "`runtime.GC()` ni 10 marta chaqirdingiz va `/sched/pauses/total/gc:seconds` gistogrammasidagi hisoblagich 20 ga o'sdi. Nega aynan 20?"
    options:
      - "Gistogramma har siklni ikki marta sanaydi: boshida va oxirida"
      - "GC har sikl uchun ikkita goroutine ishga tushiradi"
      - "Tasodif: har bir sikl uchun to'xtashlar soni har xil"
      - "Har sikl ikkita stop-the-world to'xtashga ega: sweep termination va mark termination; mark fazasining o'zi dastur bilan parallel"
    answer: 3
    explain: "mgc.go izohi: 1-qadam (sweep termination) va 3-qadam (mark termination) STW. Mark (2-qadam) va sweep (4-qadam) dastur bilan birga ishlaydi. Tajribada 10 majburiy sikl aynan 20 to'xtash berdi. Gistogrammada hisoblagich emas, paketlar (bucket) bor, shuning uchun jami to'xtashlar sonini olish uchun Counts yig'iladi."
  - q: "Quyidagi gctrace qatoridan nimani to'g'ri o'qish mumkin? `gc 6 @0.261s 32%: 0.081+89+0.20 ms clock, 0.16+109/42/0+0.41 ms cpu, 163->193->125 MB, 192 MB goal, 0 MB stacks, 0 MB globals, 2 P`"
    options:
      - "GC 163 MB dan 125 MB gacha tozalagan, 193 MB goal"
      - "GC boshlanganda heap 163 MB, tugaganda 193 MB, tirik qismi 125 MB edi; mark davomida 109 ms CPU vaqti assist'ga ketgan"
      - "Dastur boshlanganidan beri vaqtning 32 foizi GC'da o'tgan; 89 ms davomida butun dastur to'xtab turgan"
      - "125 MB - bu keyingi GC maqsadi"
    answer: 1
    explain: "pkg runtime hujjati: #->#-># - heap GC boshida, oxirida va tirik hajm; cpu maydonida mark/scan assist/background/idle ga bo'lingan. 109 ms - assist. Birinchi variant maydonlarni chalkashtiradi. Uchinchisida 32 foiz to'g'ri, lekin 89 ms - concurrent mark'ning devor vaqti, STW emas (STW - birinchi va uchinchi son). To'rtinchisida goal - 192 MB."
  - q: "Nega scheduler va allocator kodida write barrier taqiqlangan, buning uchun `//go:nowritebarrierrec` direktivasi bor?"
    options:
      - "Barrier sekin bo'lgani uchun faqat optimizatsiya maqsadida"
      - "Barrier faqat unsafe.Pointer bilan ishlaydi"
      - "Barrier faol P talab qiladi, scheduler kodi esa ko'pincha P siz ishlaydi; direktiva compiler'ga shunday funksiyada barrier chiqarilsa xato berishni buyuradi"
      - "Direktiva faqat test uchun"
    answer: 2
    explain: "HACKING.md: write barrier faol P talab qiladi (`getg().m.p != nil`), scheduler kodi esa ko'pincha P siz ishlaydi; `go:nowritebarrierrec` chaqiruvlar zanjiri bo'ylab barrier bor-yo'qligini tekshiradi. Direktiva barrier chiqarilishini to'xtatmaydi, faqat tasdiqlaydi. Birinchi variant (tezlik) hujjatdagi sabab emas; direktiva unsafe.Pointer bilan bog'liq emas va test uchun ham emas."
task:
  title: "GC oynasini o'lchaydigan yordamchi"
  prompt: |
    Avtopark monitoring servisi ikki o'lchov orasida GC qanchalik faol bo'lganini ko'rsatishi kerak: tugagan sikllar soni, stop-the-world to'xtashlar soni va oynadagi GC CPU ulushi.

    Boshlang'ich `diff` kumulyativ qiymatlarni qaytaradi va gistogrammadagi paketlar sonini to'xtashlar soni deb oladi. Uni tuzating: `Cycles` va `Pauses` ikki snapshot orasidagi o'sish bo'lsin (`Pauses` uchun `Counts` yig'indisi ayirmasi), `CPUShare` esa oyna ichidagi GC CPU vaqtining oyna ichidagi umumiy CPU vaqtiga nisbati. Umumiy CPU vaqti nol bo'lsa, ulush 0 bo'lsin. Imzolarni o'zgartirmang.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "runtime"
        "runtime/metrics"
    )

    // Window - ikki o'lchov orasidagi GC faolligi.
    type Window struct {
        Cycles   uint64  // tugagan GC sikllari soni
        Pauses   uint64  // stop-the-world to'xtashlar soni
        CPUShare float64 // oynadagi GC CPU vaqtining umumiy CPU vaqtiga ulushi
    }

    var names = []string{
        "/gc/cycles/total:gc-cycles",
        "/sched/pauses/total/gc:seconds",
        "/cpu/classes/gc/total:cpu-seconds",
        "/cpu/classes/total:cpu-seconds",
    }

    func snapshot() []metrics.Sample {
        s := make([]metrics.Sample, len(names))
        for i, n := range names {
            s[i].Name = n
        }
        metrics.Read(s)
        return s
    }

    // diff before va after orasidagi farqni hisoblaydi.
    func diff(before, after []metrics.Sample) Window {
        var w Window
        w.Cycles = after[0].Value.Uint64()
        w.Pauses = uint64(len(after[1].Value.Float64Histogram().Counts))
        w.CPUShare = after[2].Value.Float64() / after[3].Value.Float64()
        return w
    }

    var keep [][]byte

    func main() {
        live := make([]*[64]int, 200000)
        for i := range live {
            live[i] = new([64]int)
        }
        runtime.GC()
        before := snapshot()
        for i := 0; i < 10; i++ {
            keep = append(keep[:0], make([]byte, 1<<20))
            runtime.GC()
        }
        mid := snapshot()
        w := diff(before, mid)
        idle := diff(mid, snapshot())
        fmt.Println("jami:", w.Cycles, "sikl,", w.Pauses, "to'xtash")
        fmt.Println("sikllar >= 10:", w.Cycles >= 10)
        fmt.Println("to'xtashlar >= 20:", w.Pauses >= 20)
        fmt.Println("ulush (0, 1):", w.CPUShare > 0 && w.CPUShare < 1)
        fmt.Println("bo'sh oyna: sikllar <= 1:", idle.Cycles <= 1 && idle.Pauses <= 4)
        runtime.KeepAlive(live)
    }
  solution: |
    package main

    import (
        "fmt"
        "runtime"
        "runtime/metrics"
    )

    // Window - ikki o'lchov orasidagi GC faolligi.
    type Window struct {
        Cycles   uint64  // tugagan GC sikllari soni
        Pauses   uint64  // stop-the-world to'xtashlar soni
        CPUShare float64 // oynadagi GC CPU vaqtining umumiy CPU vaqtiga ulushi
    }

    var names = []string{
        "/gc/cycles/total:gc-cycles",
        "/sched/pauses/total/gc:seconds",
        "/cpu/classes/gc/total:cpu-seconds",
        "/cpu/classes/total:cpu-seconds",
    }

    func snapshot() []metrics.Sample {
        s := make([]metrics.Sample, len(names))
        for i, n := range names {
            s[i].Name = n
        }
        metrics.Read(s)
        return s
    }

    // diff before va after orasidagi farqni hisoblaydi.
    func diff(before, after []metrics.Sample) Window {
        var w Window
        w.Cycles = after[0].Value.Uint64() - before[0].Value.Uint64()
        w.Pauses = histTotal(after[1]) - histTotal(before[1])
        total := after[3].Value.Float64() - before[3].Value.Float64()
        if total > 0 {
            w.CPUShare = (after[2].Value.Float64() - before[2].Value.Float64()) / total
        }
        return w
    }

    var keep [][]byte

    func main() {
        live := make([]*[64]int, 200000)
        for i := range live {
            live[i] = new([64]int)
        }
        runtime.GC()
        before := snapshot()
        for i := 0; i < 10; i++ {
            keep = append(keep[:0], make([]byte, 1<<20))
            runtime.GC()
        }
        mid := snapshot()
        w := diff(before, mid)
        idle := diff(mid, snapshot())
        fmt.Println("jami:", w.Cycles, "sikl,", w.Pauses, "to'xtash")
        fmt.Println("sikllar >= 10:", w.Cycles >= 10)
        fmt.Println("to'xtashlar >= 20:", w.Pauses >= 20)
        fmt.Println("ulush (0, 1):", w.CPUShare > 0 && w.CPUShare < 1)
        fmt.Println("bo'sh oyna: sikllar <= 1:", idle.Cycles <= 1 && idle.Pauses <= 4)
        runtime.KeepAlive(live)
    }

    // histTotal gistogramdagi barcha paketlar sonini yig'adi.
    func histTotal(s metrics.Sample) uint64 {
        var n uint64
        for _, c := range s.Value.Float64Histogram().Counts {
            n += c
        }
        return n
    }
  solutionNotes: |
    - `/gc/cycles/total:gc-cycles` va `/cpu/classes/*` kumulyativ hisoblagichlar: oynadagi qiymat ikki o'lchov ayirmasi. Kumulyativ nisbat dastur boshidan beri o'rtacha, u qisqa GC bo'ronini yashiradi.
    - `/sched/pauses/total/gc:seconds` gistogramma. `len(Counts)` paketlar sonini beradi (bu doimiy, tajribada 162), to'xtashlar sonini emas. To'xtashlar soni - `Counts` elementlari yig'indisi.
    - Yig'indi ayirmasi 10 majburiy sikl uchun 20 to'xtash berdi: har sikl ikkita STW (sweep termination va mark termination).
    - Umumiy CPU vaqti nolga teng bo'lishi mumkin bo'lgan holat (juda qisqa oyna) nolga bo'lishdan saqlash uchun alohida tekshiriladi.
    - Kutilgan chiqish: `jami: 10 sikl, 20 to'xtash`, keyin `true` qatorlar. Bo'sh oynada sikllar soni 1 dan oshmaydi.
  checklist:
    - "`Cycles` ikki snapshot ayirmasi"
    - "`Pauses` gistogramma `Counts` yig'indisining ayirmasi (paketlar soni emas)"
    - "`CPUShare` oyna ayirmalari nisbati, maxraj nol bo'lsa 0"
    - "Bo'sh oynada `idle.Cycles <= 1` chiqishi `true`"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Node.js'dan kelgan dasturchi uchun GC odatda qora quti: V8 yosh avlod uchun tez ajratish va obyektlarni ko'chiruvchi (moving) kollektor ishlatadi, va ko'pincha heap haqida o'ylash shart emas. Go'da GC boshqacha qurilgan va uning narxi servis kodida ko'rinadi. Bu darsning amaliy maqsadi uchta savolga javob berish.

Birinchi savol: GC'ning qaysi qismi dasturni to'xtatadi va qaysi qismi faqat CPU oladi? Ko'pchilik "STW to'xtashlar qisqa, demak muammo yo'q" deb to'xtaydi. Darsdagi o'lchovda STW to'xtashlari umumiy CPU vaqtining 0.1 foizidan kam bo'ldi, GC ishi esa CPU'ning 60 foizidan ko'pini oldi. Kechikish va o'tkazuvchanlik alohida o'qlar.

Ikkinchi savol: nega servisning p99 kechikishi GC bilan bog'liq, garchi to'xtashlar millisekundlardan kam bo'lsa ham? Javob mutator assist mexanizmida: ko'p ajratayotgan goroutine'ning o'zi mark ishiga majbur qilinadi. Uchinchi savol: `GODEBUG=gctrace=1` chiqargan qatorni qanday o'qish kerak? Bu qator servis haqida ko'p narsa aytadi, lekin maydonlarni bilmasdan foydasiz.

Ogohlik: bu dars Go 1.24.7 (darslardagi hamma o'lchov shu versiyada, linux/amd64, 2 vCPU) va Go 1.27.0 runtime manba izohlariga tayanadi. Fazalar tartibi va tri-color tushunchasi barqaror, lekin aniq o'lchamlar, worker soni va heuristikalar implementatsiya tafsilotlari: ular versiyadan versiyaga o'zgaradi va ilova kodi ularga tayanmasligi kerak. Go 1.26 dan Green Tea GC default bo'ladi (57-dars), bu darsdagi umumiy tuzilma esa uning ostida ham saqlanadi, lekin mark ishining ichki tashkil etilishi o'zgaradi.

## Asosiy g'oya

### GC'ning to'rt bosqichi

`mgc.go` fayli boshidagi izoh GC'ni qisqa aytadi: u dastur bilan bir vaqtda ishlaydi (concurrent), turni aniq biladi (type accurate, ya'ni konservativ emas), bir necha GC thread'i parallel ishlay oladi, mark-and-sweep, write barrier ishlatadi, avlodlarga bo'linmagan (non-generational) va xotirani zichlamaydi (non-compacting). Xuddi shu xususiyatni gc-guide ham ta'riflaydi: Go GC obyektlarni ko'chirmaydi. 54-darsda ko'rdik: shu sababli xotira boshqaruvining og'irligi allocator zimmasida.

Bitta GC sikli beshta qadamdan iborat (izohdagi raqamlash bilan):

1. Sweep termination. Dunyo to'xtatiladi (stop-the-world, STW), hamma P xavfsiz nuqtaga keladi, hali tozalanmagan span bo'lsa tozalanadi. Bunday span faqat sikl rejadagidan oldin majburan boshlangan bo'lsa bo'ladi.
2. Mark. Write barrier yoqiladi, mutator assist yoqiladi, ildizlarni belgilash vazifalari navbatga qo'yiladi. Keyin dunyo qayta ishga tushadi va GC ishini scheduler ishga tushirgan mark worker'lar hamda ajratish paytidagi assist'lar bajaradi.
3. Mark termination. Yana STW: faza o'zgartiriladi, worker va assist'lar o'chiriladi, mcache'lar tozalanadi.
4. Sweep. Write barrier o'chiriladi, dunyo ishga tushadi. Tozalash fonda va ajratish paytida span-span bajariladi (54-dars).
5. Yetarli ajratish bo'lgach, sikl 1-qadamdan takrorlanadi. Qachon boshlanishini pacing hal qiladi (56-dars).

Muhim natija: faqat 1 va 3 to'xtatadi. Mark (2) va sweep (4) dastur bilan birga ishlaydi, lekin CPU'ni oladi.

### Tri-color belgilash

Mark fazasi graf yurish masalasi. Ildizlardan (global o'zgaruvchilar, goroutine stack'lari) boshlab erishish mumkin bo'lgan hamma obyekt tirik. Algoritm obyektlarni uch rangga bo'ladi. Oq (white): hali ko'rilmagan, mark oxirida oq qolgan obyekt axlat. Kulrang (grey): ko'rilgan, lekin ichidagi ko'rsatkichlar hali skanerlanmagan, ular ish navbatida. Qora (black): ko'rilgan va ichidagi hamma ko'rsatkich skanerlangan. Worker kulrang obyektni olib skanerlaydi, topgan oq obyektlarni kulrang qiladi, o'zini qora qiladi. Kulrang obyekt qolmaganda mark tugaydi.

Mark fazasidan keyin yangi ajratilgan obyektlar darhol qora qilinadi (izoh: newly allocated objects are immediately marked black), shuning uchun ajratish GC'ning ishini ko'paytirmaydi, lekin sikl uzaygan sayin tirik qolgan "vaqtinchalik" obyektlar xotirada qoladi: ular keyingi siklda tozalanadi.

Tri-color invariantining asosiy sharti: qora obyekt oq obyektga to'g'ridan-to'g'ri ishora qilmasligi kerak. Agar dastur mark paytida shunday ko'rsatkich yaratsa va oq obyektga boshqa yo'l qolmasa, GC uni axlat deb o'chiradi, dastur esa o'chirilgan xotiraga murojaat qiladi. Buni oldini olish uchun write barrier kerak.

## Chuqurroq: hybrid write barrier, assist va pacing

### Write barrier

Dastur mark davomida ishlayotgani uchun ko'rsatkichlarni o'zgartiradi. `mbarrier.go` izohi Go barrier'ini ikki klassik g'oyaning gibridi deb ataydi: Yuasa tipidagi o'chirish barrier'i (qayta yozilayotgan eski obyektni belgilaydi) va Dijkstra tipidagi qo'shish barrier'i (yozilayotgan yangi obyektni belgilaydi). Izohdagi pseudokod:

```text
writePointer(slot, ptr):
    shade(*slot)
    if current stack is grey:
        shade(ptr)
    *slot = ptr
```

`shade` oq obyektni kulrang qilish demak. Birinchi satr obyektni heap'dan stack'ka yashirib ko'chirishni to'sadi: yagona ko'rsatkichni heap'dan olib tashlash obyektni belgilaydi. Ikkinchi qator stack'dagi yagona ko'rsatkichni qora heap obyektiga yozishni to'sadi. Izohga ko'ra, goroutine stack'i bir marta skanerlanib qora bo'lgach, ikkinchi shart kerak emas, shuning uchun Go mark paytida stack'ni qayta skanerlamaydi. Bu qaror pauzalarni qisqartirgan; to'liq isbot izohda ko'rsatilgan proposal'ga havola qilingan va biz uni tekshirmadik.

Barrier compiler tomonidan chiqariladi. Compiler heap'ga yozilishi mumkin bo'lgan ko'rsatkich maydoniga har yozuvdan oldin tekshiruv va chaqiruv qo'yadi. Buni darsning birinchi tajribasida ko'ramiz. Narxi: ko'rsatkich yozuvlari ko'p bo'lgan kod mark davomida sekinroq ishlaydi, mark tugagach esa har yozuvga faqat bayroq tekshiruvi qoladi. Ko'rsatkichsiz yozuv (int, float, ko'rsatkichsiz maydon) barrier olmaydi. Bu gc-guide'dagi pointer-free qiymatlar maslahati bilan mos: ko'rsatkichsiz ma'lumot GC uchun ham, barrier uchun ham arzon.

HACKING.md runtime ichida barrier'ni nazorat qilish uchun direktivalarni tavsiflaydi: `go:nowritebarrier` funksiyada barrier bo'lsa compiler xato beradi, `go:nowritebarrierrec` chaqiruvlar zanjirini ham tekshiradi, `go:yeswritebarrierrec` tekshiruvni to'xtatadi. Ular scheduler'da ishlatiladi: HACKING.md ga ko'ra write barrier faol P talab qiladi, scheduler kodi esa ko'pincha P siz ishlaydi. Bu runtime mualliflari uchun ma'lumot: ilova kodida bunday direktivalar kerak emas.

### Mutator assist

Fon worker'lar mark ishini bajaradi, lekin ular ulgurmasligi mumkin. Agar goroutine'lar mark davomida tez ajratsa, heap GC tugamasdan maqsaddan oshib ketadi. Buni to'xtatish uchun runtime ajratayotgan goroutine'ning o'ziga mark ishini topshiradi: ajratilgan baytga mutanosib miqdorda skanerlash (`assistWorkPerByte` nisbati, mgcpacer.go). Bu mutator assist. Assist STW emas: goroutine to'xtatilmaydi, lekin keyingi ajratish o'rniga GC ishi bilan band bo'ladi, ya'ni uning so'rov kechikishi oshadi.

Fon worker'lar uchun CPU maqsadi `gcBackgroundUtilization = 0.25` (mgcpacer.go): GOMAXPROCS'ning 25 foizi. Izohga ko'ra, 0.25 dan farqni assist to'ldirishi mumkin. Bu son implementatsiya doimiysi, hujjatlashtirilgan kafolat emas, lekin amaliyotda tushunarli darajani beradi.

### Pacing va narx modeli

GC qachon boshlanishi va qanday tezlikda ishlashi pacer'ning vazifasi. gc-guide'ning asosiy modeli: GC CPU narxi ikki qismdan iborat, siklga bog'liq o'zgarmas qism va tirik heap hajmiga mutanosib qism; xotira narxi esa GOGC orqali heap maqsadiga bog'liq. Bu 56-darsning mavzusi; bu yerda bitta xulosa muhim: tirik heap qancha katta va ajratish tezligi qancha yuqori bo'lsa, GC shuncha ko'p CPU oladi, va STW to'xtash vaqti bu narxning kichik qismi.

## Misol: GC narxini ko'rish

### Write barrier assembly'da

Eng kichik tajriba: ikki funksiya, biri int maydonga, biri ko'rsatkich maydoniga yozadi.

```go
package main

import "fmt"

type Point struct {
	Lat, Lon float64
}

type Track struct {
	ID     int
	Last   *Point
	Points []Point
}

//go:noinline
func setID(t *Track, id int) { t.ID = id }

//go:noinline
func setLast(t *Track, p *Point) { t.Last = p }

func main() {
	t := &Track{}
	setID(t, 7)
	setLast(t, &Point{1, 2})
	fmt.Println(t.ID, *t.Last)
}
```

Kompilyator assembly'sini `go build -gcflags=-S .` bilan chiqaramiz va ikki funksiyaning yozuv satrlarini ajratib olamiz (Go 1.24.7, linux/amd64):

```text
main.setID STEXT nosplit size=4
	0x0000 00000 (main.go:16)	MOVQ	BX, (AX)
main.setLast STEXT size=70
	0x000c 00012 (main.go:19)	CMPL	runtime.writeBarrier(SB), $0
	0x0015 00021 (main.go:19)	CALL	runtime.gcWriteBarrier2(SB)
	0x001d 00029 (main.go:19)	MOVQ	8(AX), CX
	0x0025 00037 (main.go:19)	MOVQ	BX, 8(AX)
```

`setID` bitta `MOVQ`: barrier yo'q. `setLast` avval `runtime.writeBarrier` bayrog'ini tekshiradi; bayroq yoqilgan bo'lsa (ya'ni mark fazasida) `gcWriteBarrier2` chaqiriladi, so'ng eski qiymat `8(AX)` dan o'qiladi va yangisi yoziladi. Funksiya nomidagi `2` bufferdan ikki joy so'rashni bildiradi: bu bizning o'qishimiz, eski va yangi qiymat uchun ikkita yacheyka (pseudokoddagi ikki `shade` bilan mos), lekin runtime kodida buni alohida tekshirmadik. `setID` ning `nosplit` belgisi esa shunchaki juda kichik funksiya ekanini bildiradi.

### Ajratish tezligi va GC CPU ulushi

Endi katta tirik graf (2 million tugun) va ikkita goroutine qisqa umrli 256 baytlik buffer ajratadi. Dastur ikki o'lchov oralig'ida `runtime/metrics` ni o'qiydi. Metrikalar 1.24 da mavjudligini tekshirdik.

```go
package main

import (
	"fmt"
	"runtime"
	"runtime/metrics"
	"sync"
	"time"
)

// Node - pointerlarga boy tirik ma'lumot (GC skanerlashi kerak bo'lgan graf).
type Node struct {
	Left, Right *Node
	ID          int
}

func build(depth int) *Node {
	if depth == 0 {
		return &Node{}
	}
	return &Node{Left: build(depth - 1), Right: build(depth - 1)}
}

// churn d davomida qisqa umrli 256 baytlik bufferlar ajratadi.
func churn(d time.Duration, wg *sync.WaitGroup) {
	defer wg.Done()
	end := time.Now().Add(d)
	var buf []byte
	for time.Now().Before(end) {
		for i := 0; i < 1000; i++ {
			buf = make([]byte, 256)
		}
	}
	_ = buf
}

func read(names ...string) map[string]metrics.Value {
	s := make([]metrics.Sample, len(names))
	for i, n := range names {
		s[i].Name = n
	}
	metrics.Read(s)
	out := map[string]metrics.Value{}
	for _, x := range s {
		out[x.Name] = x.Value
	}
	return out
}

func histCount(h *metrics.Float64Histogram) uint64 {
	var n uint64
	for _, c := range h.Counts {
		n += c
	}
	return n
}

func main() {
	live := build(21) // ~2 mln tugun, tirik qoladi
	_ = live
	runtime.GC()

	names := []string{
		"/gc/cycles/total:gc-cycles",
		"/sched/pauses/total/gc:seconds",
		"/cpu/classes/gc/mark/assist:cpu-seconds",
		"/cpu/classes/gc/mark/dedicated:cpu-seconds",
		"/cpu/classes/gc/mark/idle:cpu-seconds",
		"/cpu/classes/gc/pause:cpu-seconds",
		"/cpu/classes/total:cpu-seconds",
		"/gc/heap/goal:bytes",
		"/gc/heap/live:bytes",
	}
	before := read(names...)

	var wg sync.WaitGroup
	for i := 0; i < 2; i++ {
		wg.Add(1)
		go churn(3*time.Second, &wg)
	}
	wg.Wait()
	after := read(names...)

	d := func(n string) float64 { return after[n].Float64() - before[n].Float64() }
	cycles := after[names[0]].Uint64() - before[names[0]].Uint64()
	pauses := histCount(after[names[1]].Float64Histogram()) - histCount(before[names[1]].Float64Histogram())
	fmt.Printf("GC sikllari: %d, STW to'xtashlar: %d\n", cycles, pauses)
	fmt.Printf("heap goal: %.0f MiB, live: %.0f MiB\n", float64(after[names[7]].Uint64())/(1<<20), float64(after[names[8]].Uint64())/(1<<20))
	total := d(names[6])
	fmt.Printf("GC CPU ulushi: mark/assist %.2f%%, mark/dedicated %.2f%%, mark/idle %.2f%%, pause %.3f%%\n",
		100*d(names[2])/total, 100*d(names[3])/total, 100*d(names[4])/total, 100*d(names[5])/total)
	runtime.KeepAlive(live)
}
```

Birinchi ishga tushirish natijasi (Go 1.24.7, linux/amd64, 2 vCPU, 3 soniyalik oyna):

```text
GC sikllari: 20, STW to'xtashlar: 41
heap goal: 275 MiB, live: 137 MiB
GC CPU ulushi: mark/assist 43.48%, mark/dedicated 19.78%, mark/idle 0.20%, pause 0.096%
```

Ikkinchi ishga tushirishda 25 sikl, 51 to'xtash, assist 44.35 foiz, dedicated 17.97 foiz, pause 0.062 foiz chiqdi. Sikllar soni ishga tushirishlar orasida farq qildi (bu mashina boshqa jarayonlar bilan bo'lingan), foizlar esa barqaror qoldi. Hamma foizlar `/cpu/classes/total:cpu-seconds` ga nisbatan, ya'ni oynadagi 2 vCPU x 3 soniyaga.

Natijalardan uch xulosa. Birinchisi: har sikl uchun ikki STW to'xtash (41 ga 20 sikl, 51 ga 25 sikl; oyna chegarasida bitta sikl yarim kesilgani uchun nisbat aniq 2 emas). Ikkinchisi: STW'ning CPU ulushi 0.1 foizdan kam, mark ishi esa assist va dedicated bilan birga 60 foizdan ko'p. Uchinchisi: assist ulushi dedicated worker'lardan ikki baravar katta: ajratish tezligi fon worker'lardan oshib ketgani uchun goroutine'lar o'zi mark qilishga majbur bo'lgan. Bu sun'iy yuklama (ikkita goroutine hech narsa qilmasdan faqat ajratadi), real servis bunchalik ekstremal emas, lekin mexanizm o'sha.

Xuddi shu dasturni `GODEBUG=gctrace=1` bilan ishga tushirsak, runtime har siklga bitta qator yozadi (birinchi sakkiz qator):

```text
gc 1 @0.004s 14%: 0.10+4.3+0.051 ms clock, 0.21+0.30/2.1/2.8+0.10 ms cpu, 3->5->5 MB, 4 MB goal, 0 MB stacks, 0 MB globals, 2 P
gc 4 @0.092s 15%: 0.020+58+0.10 ms clock, 0.040+5.8/26/44+0.20 ms cpu, 53->74->73 MB, 63 MB goal, 0 MB stacks, 0 MB globals, 2 P
gc 5 @0.182s 15%: 0.018+66+0.005 ms clock, 0.037+0/30/98+0.011 ms cpu, 96->96->96 MB, 148 MB goal, 0 MB stacks, 0 MB globals, 2 P (forced)
gc 6 @0.261s 32%: 0.081+89+0.20 ms clock, 0.16+109/42/0+0.41 ms cpu, 163->193->125 MB, 192 MB goal, 0 MB stacks, 0 MB globals, 2 P
gc 8 @0.502s 44%: 0.16+94+0.003 ms clock, 0.33+103/49/0.21+0.007 ms cpu, 227->267->135 MB, 267 MB goal, 0 MB stacks, 0 MB globals, 2 P
```

Qatorni pkg runtime hujjatidagi tavsif bo'yicha o'qiymiz. `gc 6` GC raqami; `@0.261s` dastur boshidan beri vaqt; `32%` dastur boshidan beri vaqtning GC'da o'tgan ulushi. `0.081+89+0.20 ms clock`: sweep termination STW, concurrent mark, mark termination STW devor vaqtlari. `0.16+109/42/0+0.41 ms cpu`: STW fazalarining CPU vaqti va mark ichida assist (109), fon (42) va idle (0) worker vaqti. `163->193->125 MB`: heap GC boshida, oxirida va tirik hajm. `192 MB goal`: heap maqsadi. Oxiridagi `(forced)` bu GC `runtime.GC()` chaqiruvi bilan boshlangani (dasturdagi `runtime.GC()` dan, 5-qator). 6-qatorda mark davomida heap 163 MB dan 193 MB gacha o'sgan, ya'ni goal 192 MB dan sal oshib ketgan: assist shuni cheklashga urinadi, lekin oshishni butunlay yo'q qila olmaydi. Aniq mexanizmni bu o'lchovdan chiqarib bo'lmaydi, shuning uchun bu yerda faqat kuzatuvni yozamiz.

Shuni ham qayd etamiz: gctrace qatori formati hujjatda "o'zgarishi mumkin" deb belgilangan. Uni parsing qilib dashboard qurmang; shu maqsad uchun `runtime/metrics` bor (60-dars).

## Qachon qo'llamaslik kerak

GC'ning ichki tuzilishi haqidagi bilimni optimizatsiya uchun ishlatishdan oldin quyidagilarni tekshiring.

Birinchidan, GC narxini o'lchamasdan kodni "GC uchun" qayta yozmang. gc-guide GC narxi muammo ekanini aniq ko'rsatadigan o'lchovsiz pointer'larni indeksga almashtirish kabi o'zgarishlarni tavsiya etmaydi. Dastlab pprof va metrikalar (62, 63-darslar) GC haqiqatan CPU ning sezilarli qismini olayotganini ko'rsatsin.

Ikkinchidan, assist yoki barrier narxini kamaytirish uchun `unsafe` bilan ko'rsatkichlarni yashirmang. Compiler va GC turni biladi; `uintptr` ga aylantirilgan ko'rsatkich GC uchun ko'rsatkich emas, obyekt tozalanishi yoki ko'chirilishi mumkin (stack ko'chadi, 58-dars). Bunday kod bugni tasodifiy qiladi.

Uchinchidan, `runtime.GC()` ni production kodida davriy chaqirmang. U butun siklni majburan ishga tushiradi (gctrace'da `(forced)`), pacer rejasini buzadi. Testlarda va misollarda foydali, xolos.

To'rtinchidan, bu dars tavsiflagan sonlar (0.25 maqsad, ikki STW, assist nisbati) hujjatlashtirilgan API emas. Yangi Go versiyasida (Green Tea, 57-dars) ular o'zgarishi mumkin; shuning uchun monitoringda mutlaq chegaralar emas, o'zingizning bazaviy o'lchovingiz bilan solishtiring.

## Stack'da: Node.js bilan farq

V8'da GC to'xtashlari asosan bitta thread'ni to'xtatadi va o'lchov bir joyda: `--trace-gc`. Go'da ish ko'p thread bo'yicha taqsimlanadi, shuning uchun narx uchta joyda ko'rinadi: STW to'xtashlari (kechikishga), fon worker'lar (umumiy CPU'ga) va assist (aynan ajratayotgan so'rovlarga). So'rov kechikishi GC bilan oshganda birinchi qaraladigan joy `/cpu/classes/gc/mark/assist:cpu-seconds` va `/gc/cycles/total` o'sish tezligi.

Servisga qo'llash qoidalari: ajratish tezligini kamaytirish (54, 65-darslar) GC chastotasini va assist ehtimolini kamaytiradi; tirik heap ichida ko'rsatkichlar sonini kamaytirish mark ishini kamaytiradi; sozlash vositalari (GOGC, GOMEMLIMIT) keyingi darsda. Monitoringga kamida `/gc/cycles/total:gc-cycles`, `/cpu/classes/gc/total:cpu-seconds` va `/sched/pauses/total/gc:seconds` ni qo'shing, oyna ayirmalari bilan (topshiriqdagi `diff` aynan shu).

## Xulosa

- GC sikli: sweep termination (STW), concurrent mark, mark termination (STW), concurrent sweep. Faqat ikki bosqich dasturni to'xtatadi; tajribada har sikl uchun aynan ikki to'xtash.
- Mark tri-color: oq, kulrang, qora. Write barrier dastur mark paytida ko'rsatkichlarni o'zgartirganda qora obyekt oq obyektni yashirib qo'yishini to'sadi; compiler uni faqat ko'rsatkich yozuvlariga qo'yadi (assembly'da ko'rdik).
- Mutator assist: ajratish tezligi fon worker'lardan oshganda goroutine'ning o'zi mark ishini bajaradi. Tajribada assist umumiy CPU'ning 43-44 foizini oldi, STW esa 0.1 foizdan kam.
- Kechikish (STW) va CPU narxi alohida o'lchanadi: ikkalasini ham `runtime/metrics` oyna ayirmalari bilan kuzating.
- gctrace qatori hujjatlashtirilgan, lekin formati o'zgaradi; tuzilishni o'qish uchun foydali, parsing uchun yaroqsiz.
