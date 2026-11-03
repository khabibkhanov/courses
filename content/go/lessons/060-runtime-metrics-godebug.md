---
n: 60
slug: runtime-metrics-godebug
title: "runtime/metrics, GODEBUG va crash tahlili"
summary: "runtime/metrics ning tur va gistogramma qoidalari, runtime diagnostikasi uchun GODEBUG o'zgaruvchilari (gctrace, schedtrace, inittrace va boshqalar), GOTRACEBACK darajalari va panic, fatal error, deadlock chiqishini qanday o'qish kerak: hammasi real chiqish bilan."
duration: 45
sources:
  - id: pkg-runtime-metrics
    note: "Paket hujjati: metrika kaliti formati (yo'l:birlik), kind o'zgarmasligi kafolati, NaN va cheksizlik hech qachon qaytarilmasligi, All va Description; metrikalar ro'yxati: /sched, /gc, /memory/classes, /cpu/classes (overestimate ogohlantirishi), /godebug/non-default-behavior"
  - id: godebug-doc
    note: "GODEBUG sozlamalari manbalari va tracebacklabels (Go 1.26 da qo'shilgan, Go 1.27 da default 1)"
  - id: diagnostics
    note: "Diagnostics hujjati: profiling, tracing va debugging vositalari bo'limlari (runtime statistikasi va tracebacklar bilan ishlash uchun umumiy asos)"
  - id: pkg-runtime
    note: "GODEBUG o'zgaruvchilari ro'yxati (gctrace, schedtrace, scheddetail, inittrace, scavtrace, tracebackancestors, asyncpreemptoff, dontfreezetheworld) va GOTRACEBACK darajalari"
  - id: go127
    note: "Runtime bo'limi: goroutine labels traceback sarlavhasida (go.mod da go 1.27 yoki undan yuqori bo'lsa); goroutineleak profili umumiy foydalanishga chiqqan"
quiz:
  - q: "Kod har metrikani `float64(s.Value.Uint64())` bilan o'qiydi. `/cpu/classes/gc/total:cpu-seconds` ni o'qiganda nima bo'ladi?"
    options:
      - "0 qaytadi, chunki metrika float"
      - "Qiymat butun songa yaxlitlanadi"
      - "Runtime panic: `called Uint64 on non-uint64 metric value`; metrika kindini `Value.Kind()` bilan tekshirish kerak"
      - "Kompilyatsiya xatosi"
    answer: 2
    explain: "Value accessor'lari kind mos kelmasa panic qiladi (darsdagi starter aynan shu panikani berdi). Metrika kindi o'zgarmasligi kafolatlangan, lekin turli metrikalar turli kindda: uint64, float64, gistogramma. Mavjud bo'lmagan nom KindBad beradi."
  - q: "`/gc/cycles/total:gc-cycles` joriy qiymati 12345. Oxirgi daqiqada GC tezlashganmi yoki yo'qmi, shundan bilish mumkinmi?"
    options:
      - "Yo'q: bu kumulyativ hisoblagich, oxirgi daqiqa uchun ikki o'lchov ayirmasi kerak (yoki monitoring tizimining rate funksiyasi)"
      - "Ha: qiymat har sekund nolga qaytadi"
      - "Ha: katta qiymat tez GC degani"
      - "Yo'q: GC sikllarini umuman kuzatib bo'lmaydi"
    answer: 0
    explain: "Description.Cumulative bu o'sib boruvchi hisoblagich ekanini bildiradi (Go 1.24.7 da 92 metrikadan 65 tasi shunday). Dastur boshidan beri jami sonning o'zi tezlik haqida gapirmaydi; oyna ayirmasi kerak (55-darsdagi `diff`)."
  - q: "Servisda goroutine `nil` map'ga yozib panic qildi, boshqa goroutine kanalda bloklangan. `GOTRACEBACK` o'rnatilmagan. Chiqishda nima bo'ladi?"
    options:
      - "Barcha goroutine'lar va runtime ichki goroutine'lari chiqadi"
      - "Hech narsa chiqmaydi, faqat chiqish kodi 2"
      - "Faqat bloklangan goroutine chiqadi"
      - "Faqat panic qilgan goroutine'ning stack'i (runtime ichki kadrlarsiz) chiqadi; boshqa goroutine'lar uchun `GOTRACEBACK=all` kerak"
    answer: 3
    explain: "pkg runtime: default `single`, joriy goroutine stack'i chop etiladi va jarayon 2 kod bilan tugaydi. Darsdagi tajribada default 8 qator, `all` 14 qator (bloklangan `poll` goroutine'i qo'shildi), `system` 84 qator, `none` 2 qator berdi."
  - q: "Production'da `fatal error: concurrent map writes` chiqdi. To'g'ri javob qaysi?"
    options:
      - "`recover()` bilan ushlash va davom etish"
      - "Bu panic emas, runtime'ning fatal xatosi: recover ushlamaydi. Map'ga kirishni sinxronlash (mutex, `sync.Map` yoki egalik bitta goroutine'da) va `-race` bilan sinash kerak"
      - "GOGC ni oshirish"
      - "`GOTRACEBACK=none` o'rnatish"
    answer: 1
    explain: "Darsdagi tajribada 3 ishga tushirishning hammasida shu fatal xato chiqdi va jarayon 2 kod bilan tugadi. Runtime nosoz holatni aniqlaganda dasturni davom ettirish xavfli, shuning uchun u ushlanmaydigan `throw`. Aniqlash tasodifiy: har ishga tushirishda ushlanmasligi mumkin, shu uchun race detector kerak."
  - q: "Dashboard'da `/cpu/classes/gc/total:cpu-seconds` o'sish tezligi `top` dagi jarayon CPU foizining 70 foizini beryapti, lekin `top` GC'siz ham yuqori. Nega bu to'g'ridan-to'g'ri solishtirib bo'lmaydi?"
    options:
      - "Metrika noto'g'ri ishlaydi"
      - "top faqat bitta yadroni sanaydi"
      - "Hujjat /cpu/classes metrikalarini overestimate deb ataydi va ularni faqat boshqa /cpu/classes metrikalari bilan solishtirishni tavsiya qiladi, tizim CPU vaqti bilan emas"
      - "GC CPU'si metrikaga ikki marta qo'shiladi"
    answer: 2
    explain: "pkg-runtime-metrics: bu metrikalar taxmin va ortiqcha baholanishi mumkin, tizim CPU o'lchovlari bilan to'g'ridan-to'g'ri solishtirib bo'lmaydi. GC ulushi sifatida `/cpu/classes/gc/total` ni `/cpu/classes/total` ga nisbatan oling."
  - q: "Kod `/sched/goroutines/waiting:goroutines` ni o'qiydi. Go 1.24.7 da `Sample.Value.Kind()` nima qaytaradi va xavfsiz yondashuv qaysi?"
    options:
      - "`KindBad`, chunki bu metrika Go 1.24.7 da yo'q (yangi hujjatda bor); xavfsiz kod `metrics.All()` dan mavjud nomlarni olib, `KindBad` ni tashlab ketadi"
      - "`KindUint64` va qiymat 0"
      - "Panic"
      - "Xato qiymati bilan `error`"
    answer: 0
    explain: "Darsdagi tajribada bu nom, `/gc/cleanups/queued:cleanups` va `/gc/finalizers/queued:finalizers` Go 1.24.7 da KindBad berdi (92 metrika ichida yo'q), mavjudlari esa o'z kindida o'qildi. Paket hujjati ham mavjud metrikalarni `All()` bilan aniqlashni tavsiya qiladi."
task:
  title: "Kind-xavfsiz metrika o'quvchi"
  prompt: |
    Monitoring agenti runtime metrikalarini bir xil sikl bilan o'qishi kerak: nomlar ro'yxati beriladi, natija `nom -> float64` xaritasi. Metrikalar turli kindda: `uint64` (heap maqsadi), `float64` (GC CPU sekundlari) va gistogramma (GC pauzalari). Yangi versiyada bor, joriy versiyada yo'q metrikalar ham ro'yxatda bo'lishi mumkin.

    Boshlang'ich `read` hamma metrikaga `Uint64()` ni chaqiradi va float yoki gistogramma o'qilganda panic qiladi. Uni tuzating: `Value.Kind()` bo'yicha tarmoqlang; uint64 va float64 ni `float64` ga o'giring; gistogramma uchun `q` kvantilning yuqori chegarasini (kumulyativ son umumiy sonning `q` ulushiga yetadigan paketning yuqori chegarasi, cheksiz bo'lsa oxirgi chekli chegara) qaytaring; `KindBad` metrikani natijaga qo'shmang. Imzoni o'zgartirmang.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "runtime"
        "runtime/metrics"
    )

    // read berilgan metrikalarni o'qiydi va nom -> son ko'rinishida qaytaradi.
    // Gistogramma metrikalari uchun q kvantilning yuqori chegarasini qaytaradi.
    func read(names []string, q float64) map[string]float64 {
        samples := make([]metrics.Sample, len(names))
        for i, n := range names {
            samples[i].Name = n
        }
        metrics.Read(samples)
        out := make(map[string]float64, len(names))
        for _, s := range samples {
            out[s.Name] = float64(s.Value.Uint64())
        }
        return out
    }

    func main() {
        for i := 0; i < 3; i++ {
            runtime.GC()
        }
        names := []string{
            "/gc/heap/goal:bytes",               // uint64
            "/cpu/classes/gc/total:cpu-seconds", // float64
            "/sched/pauses/total/gc:seconds",    // gistogramma
            "/gc/cleanups/queued:cleanups",      // Go 1.24.7 da yo'q (yangi versiyada bor)
        }
        got := read(names, 0.99)
        _, hasGoal := got[names[0]]
        _, hasCPU := got[names[1]]
        p99, hasPause := got[names[2]]
        _, hasNew := got[names[3]]
        fmt.Println("uint64 metrika:", hasGoal)
        fmt.Println("float64 metrika:", hasCPU)
        fmt.Println("gistogramma p99 (0 .. 1 soniya):", hasPause && p99 >= 0 && p99 <= 1)
        fmt.Println("mavjud bo'lmagan metrika tushirib qoldirildi:", !hasNew)
    }
  solution: |
    package main

    import (
        "fmt"
        "math"
        "runtime"
        "runtime/metrics"
    )

    // read berilgan metrikalarni o'qiydi va nom -> son ko'rinishida qaytaradi.
    // Gistogramma metrikalari uchun q kvantilning yuqori chegarasini qaytaradi.
    func read(names []string, q float64) map[string]float64 {
        samples := make([]metrics.Sample, len(names))
        for i, n := range names {
            samples[i].Name = n
        }
        metrics.Read(samples)
        out := make(map[string]float64, len(names))
        for _, s := range samples {
            switch s.Value.Kind() {
            case metrics.KindUint64:
                out[s.Name] = float64(s.Value.Uint64())
            case metrics.KindFloat64:
                out[s.Name] = s.Value.Float64()
            case metrics.KindFloat64Histogram:
                out[s.Name] = quantile(s.Value.Float64Histogram(), q)
            default:
                // KindBad: bu versiyada metrika yo'q, uni natijaga qo'shmaymiz.
            }
        }
        return out
    }

    // quantile gistogrammada kumulyativ son q ulushga yetadigan paketning
    // yuqori chegarasini qaytaradi. Chegara cheksiz bo'lsa, oxirgi chekli chegara olinadi.
    func quantile(h *metrics.Float64Histogram, q float64) float64 {
        var total uint64
        for _, c := range h.Counts {
            total += c
        }
        if total == 0 {
            return 0
        }
        target := uint64(q * float64(total))
        if target == 0 {
            target = 1
        }
        var cum uint64
        for i, c := range h.Counts {
            cum += c
            if cum >= target {
                hi := h.Buckets[i+1]
                if math.IsInf(hi, 1) {
                    hi = h.Buckets[i]
                }
                return hi
            }
        }
        return 0
    }

    func main() {
        for i := 0; i < 3; i++ {
            runtime.GC()
        }
        names := []string{
            "/gc/heap/goal:bytes",               // uint64
            "/cpu/classes/gc/total:cpu-seconds", // float64
            "/sched/pauses/total/gc:seconds",    // gistogramma
            "/gc/cleanups/queued:cleanups",      // Go 1.24.7 da yo'q (yangi versiyada bor)
        }
        got := read(names, 0.99)
        _, hasGoal := got[names[0]]
        _, hasCPU := got[names[1]]
        p99, hasPause := got[names[2]]
        _, hasNew := got[names[3]]
        fmt.Println("uint64 metrika:", hasGoal)
        fmt.Println("float64 metrika:", hasCPU)
        fmt.Println("gistogramma p99 (0 .. 1 soniya):", hasPause && p99 >= 0 && p99 <= 1)
        fmt.Println("mavjud bo'lmagan metrika tushirib qoldirildi:", !hasNew)
    }
  solutionNotes: |
    - `Value` accessor'lari kind mos kelmasa panic qiladi; metrika kindi o'zgarmasligi kafolatlangani uchun (paket hujjati), `Kind()` bo'yicha `switch` xavfsiz va yetarli.
    - Nomi noma'lum metrika `Read` dan keyin `KindBad` beradi. Tashlab ketish kod yangi versiya metrikalari ro'yxatda turganda ham eski Go'da ishlashini ta'minlaydi (Go 1.24.7 da `/gc/cleanups/queued:cleanups` yo'q, tekshirilgan).
    - Gistogrammada `len(Buckets) == len(Counts)+1`: i-paket `[Buckets[i], Buckets[i+1])`. `Buckets` ning oxirgisi `+Inf` bo'lishi mumkin (Float64Histogram hujjati), shuning uchun cheksiz chegara chekli bilan almashtiriladi: paket hujjati qiymatlarda NaN va cheksizlikni va'da qilmaydi, lekin chegaralarda ruxsat beradi.
    - Gistogramma umumiy soni nol bo'lsa, 0 qaytadi: bo'lishsiz va NaN yo'q.
    - Kutilgan chiqish: to'rtta `true`. Starter esa `panic: called Uint64 on non-uint64 metric value` beradi.
  checklist:
    - "uint64 va float64 metrikalar `Kind()` bo'yicha o'qiladi, panic yo'q"
    - "Gistogramma uchun kvantil paket yuqori chegarasi qaytadi, cheksiz chegara chekli bilan almashtiriladi"
    - "`KindBad` metrikalar natijada yo'q"
    - "Imzo `read(names []string, q float64) map[string]float64` o'zgarmagan"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Production'da nimadir noto'g'ri ketganda odatda uchta signal bor. Birinchisi, metrikalar: grafiklar ustida "avvalroq normal edi" degan taqqos. Ikkinchisi, runtime'ning o'z diagnostikasi: GC yoki scheduler nima qilayotganini bevosita chiqaradigan o'zgaruvchilar. Uchinchisi, jarayon halok bo'lgandagi chiqish: panic yoki fatal error va goroutine dump'i. Har uch signalni o'qiy olmaslik tashxis qo'yishni taxminga aylantiradi.

Oldingi darslarda bu signallarning har birini alohida ko'rdik: gctrace (55-dars), schedtrace (52-dars), stack overflow (58-dars), GOMAXPROCS metrikalari (53-dars). Bu dars ularni bitta tizimga bog'laydi va uchta amaliy savolga javob beradi. `runtime/metrics` ni qanday xavfsiz o'qish kerak, ya'ni tur xatolari, gistogrammalar va versiyalar o'rtasidagi farq bilan? Qaysi runtime GODEBUG o'zgaruvchisi qaysi savolga javob beradi? Halokat chiqishini qanday o'qish va `GOTRACEBACK` bilan qanday boshqarish kerak?

GODEBUG mexanizmining o'zi (sozlamalar manbalari, go.mod bilan bog'liqlik, compatibility) 1-darsda tushuntirilgan; bu yerda GODEBUG'ning diagnostika tomoni. Hamma o'lchov Go 1.24.7 da (linux/amd64, 2 vCPU). Go 1.26 va 1.27 xususiyatlari (`tracebacklabels`, goroutine leak profili) faqat hujjatga tayanadi va lokal ishga tushirilmagan.

## Asosiy g'oya

### runtime/metrics

Paket hujjati uni runtime eksport qiladigan implementatsiyaga xos metrikalarga barqaror interfeys deb ataydi; u `runtime.ReadMemStats` va `debug.ReadGCStats` ga o'xshaydi, lekin ancha umumiyroq. Interfeysning asosiy qoidalari:

Metrika satr kaliti bilan belgilanadi, kalit ikki qismdan iborat: yo'l va birlik, ikki nuqta bilan ajratilgan (`/gc/heap/goal:bytes`). Birlik kalitga kiritilgan, chunki birlik o'zgarsa ma'no ham o'zgargan bo'ladi va yangi kalit kerak bo'ladi. Har metrikaning turi (kind) bor: `KindUint64`, `KindFloat64`, `KindFloat64Histogram` yoki mavjud bo'lmagan nom uchun `KindBad`. Hujjat metrikaning kindi o'zgarmasligini kafolatlaydi; o'zgarishi kerak bo'lsa yangi kalit kiritiladi. Float qiymatlar hech qachon NaN yoki cheksiz bo'lmaydi (gistogramma chegaralari bundan mustasno, pastga qarang).

Metrikalar to'plami runtime bilan birga o'zgaradi. Shu sababli hujjat `metrics.All()` qaytargan ro'yxatdan mavjud metrikalarni olishni tavsiya qiladi, aniq nomlarni o'qish kerak bo'lsa build tag'lardan foydalanishni va metrika olib tashlanishi kamdan-kam, katta o'zgarishlar bilan birga bo'lishini aytadi. Bizning o'lchovda Go 1.24.7 `All()` 92 metrika qaytardi (guruhlari bo'yicha: `/godebug` 36, `/gc` 22, `/memory` 14, `/cpu` 11, `/sched` 7, `/cgo` 1, `/sync` 1), shundan 65 tasi kumulyativ.

Asosiy oilalar: `/sched/*` (GOMAXPROCS, goroutine soni, scheduler kechikishi va to'xtashlar), `/gc/*` (sikllar, heap maqsadi, tirik heap, GOGC va limit, limiter), `/memory/classes/*` (xotira turlari bo'yicha, 54 va 56-darslar), `/cpu/classes/*` (CPU vaqti sinflar bo'yicha, 55-dars) va `/godebug/non-default-behavior/<nom>:events` (qaysi GODEBUG default bo'lmagan xatti-harakatni necha marta ishlatgani, 1-dars).

### Ehtiyot: nimalar qiyin

Birinchidan, kumulyativ metrikalar. `Description.Cumulative` rost bo'lsa qiymat faqat o'sadi va tezlikni ikki o'lchov ayirmasidan olasiz. Ikkinchidan, `/cpu/classes/*` qiymatlari taxminiy: hujjat ularni overestimate deb ataydi va faqat boshqa `/cpu/classes` metrikalari bilan solishtirishni, tizim CPU vaqti bilan emas, tavsiya qiladi. 56-darsda GC CPU ulushi 62-68 foizga yetgani (limiter hujjatdagi 50 foizdan yuqori) shu bilan bog'liq bo'lishi mumkin, lekin buni miqdoriy tekshirmadik. Uchinchidan, hujjat ro'yxatidagi metrika sizning Go versiyangizda bo'lmasligi mumkin. Hujjat sahifasi odatda eng yangi versiyani ko'rsatadi, uni o'z toolchain'ingiz bilan solishtiring.

## Chuqurroq: gistogramma, GODEBUG, halokat

### Gistogramma

`Float64Histogram` ikkita slice'dan iborat. `Counts[n]` `[Buckets[n], Buckets[n+1])` oralig'idagi qiymatlar soni, shuning uchun `len(Buckets) == len(Counts)+1`. Hujjat `Buckets[0]` ning `-Inf` va oxirgisining `+Inf` bo'lishiga ruxsat beradi. Berilgan nom uchun `Buckets` dastur tugaguncha o'zgarmaydi, boshqa gistogrammalar bilan alias bo'lishi mumkin, shuning uchun uni o'zgartirmang. Gistogramma ham kumulyativ bo'lishi mumkin: `/sched/pauses/total/gc:seconds` va `/sched/latencies:seconds` kabilar hisoblagichlar to'plami, jami hodisalar soni `Counts` yig'indisi. 55-darsda aynan shu xatoni ko'rdik: paketlar soni (162) to'xtashlar soni emas.

Kvantil taxminiy: gistogramma aniq qiymatlarni emas paketni biladi, shuning uchun p99 "paket yuqori chegarasi" ko'rinishida (topshiriqdagi `quantile`). Pauza gistogrammasidan kechikish SLO'si uchun aniq son kutmang; paket kengligidan aniqlik kam.

### Runtime GODEBUG o'zgaruvchilari

pkg runtime hujjati runtime GODEBUG ro'yxatini beradi. Diagnostika uchun muhimlari:

| O'zgaruvchi | Nima beradi | Dars |
| --- | --- | --- |
| `gctrace=1` | Har GC siklida bitta qator: fazalar, CPU, heap, maqsad | 55 |
| `schedtrace=X`, `scheddetail=1` | Har X ms da scheduler holati: P, M, G navbatlari | 52 |
| `inittrace=1` | Har paket init'i uchun vaqt va ajratishlar | bu dars |
| `scavtrace=1` | Xotira OS'ga qaytarilishi (scavenger) | 54 |
| `tracebackancestors=N` | Goroutine yaratilgan stack'larni traceback'ka qo'shadi | bu dars |
| `asyncpreemptoff=1` | Signalga asoslangan preemption'ni o'chiradi | 52 |
| `gcstoptheworld=1` | Concurrent GC'ni o'chiradi (tashxis uchun) | 55 |
| `dontfreezetheworld=1` | Halokat boshlanishida dunyoni muzlatmaydi | bu dars |

Hujjat `gctrace` va `inittrace` formatlari o'zgarishi mumkinligini ochiq aytadi: ularni parsing qilmang. Hammasi `GODEBUG=nom=qiymat` ko'rinishida beriladi; ularning ayrimlari faqat runtime nosozligini tashxislash uchun va ishlab chiqarishda doim yoqilmaydi.

`inittrace` ni ishga tushirish ko'ngildagidek: har paket init'ini qatorda ko'rasiz. Masalan (Go 1.24.7, ushbu darsning kichik dasturi):

```text
init internal/bytealg @0 ms, 0 ms clock, 0 bytes, 0 allocs
init runtime @0.045 ms, 0.056 ms clock, 0 bytes, 0 allocs
init internal/godebug @0.45 ms, 0.078 ms clock, 312 bytes, 7 allocs
init syscall @0.55 ms, 0.009 ms clock, 4160 bytes, 3 allocs
```

Format hujjatdagi: paket nomi, init boshlangan vaqt, devor vaqti, heap bayt va ajratishlar soni. Start-up sekin bo'lgan servisda eng uzoq `init` ni topishning arzon yo'li shu.

### Halokat anatomiyasi va GOTRACEBACK

Go dasturi ikki yo'l bilan halok bo'ladi. Birinchisi, ushlanmagan panic: bu oddiy `panic` va `recover` (ko'rsatilgan joyda) ushlay oladi. Ikkinchisi, fatal error (runtime `throw`): `concurrent map writes`, `all goroutines are asleep - deadlock!`, `stack overflow` (58-dars), xotira tugashi kabilar. Ularni `recover` ushlamaydi, jarayon 2 kod bilan tugaydi.

`GOTRACEBACK` chiqishning hajmini boshqaradi (pkg runtime). Default (`single`): joriy goroutine stack'i, runtime ichki kadrlarsiz. Lekin hujjat aniq aytadi: joriy goroutine bo'lmasa yoki xato runtime ichida bo'lsa, hamma goroutine'lar chiqadi. `none` goroutine stack'larini umuman chiqarmaydi. `all` barcha foydalanuvchi goroutine'larini qo'shadi. `system` `all` ga runtime kadrlarini va runtime yaratgan goroutine'larni qo'shadi. `crash` `system` ga o'xshaydi, lekin chiqish o'rniga OS'ga xos tarzda halok bo'ladi (Unix'da SIGABRT, core dump). `wer` Windows uchun. `0`, `1`, `2` mos ravishda `none`, `all`, `system` sinonimlari. `runtime/debug.SetTraceback` ish vaqtida chiqishni ko'paytiradi, lekin env o'zgaruvchisi bergan darajadan kamaytirmaydi.

Halokatning boshida runtime ko'pincha "dunyoni muzlatadi" (freezetheworld): hamma threadni to'xtatib, goroutine'lar holatini panic nuqtasiga yaqin ushlaydi, shunda barchasining traceback'ini olish mumkin bo'ladi (`dontfreezetheworld` hujjati). Shu sababli dump bir lahzalik suratga o'xshaydi.

Dump sarlavhalari muhim: `goroutine 6 [chan receive]:` yoki `[sync.WaitGroup.Wait]`, `[runnable]` holatlari (51-dars) goroutine nima kutayotganini aytadi; vaqt qo'shilgan bo'lishi mumkin (`[chan receive, 5 minutes]`) va bu uzoq bloklanishni ko'rsatadi. `created by main.main in goroutine 1` qatori esa goroutine'ni kim yaratganini beradi, `tracebackancestors=N` esa shu zanjirni chuqurlashtiradi.

Go 1.26 yangi `tracebacklabels` GODEBUG sozlamasini qo'shdi: `1` bo'lsa `runtime/pprof` orqali qo'yilgan goroutine yorliqlari traceback sarlavhasiga va `debug=2` dump'lariga chiqadi (godebug-doc). Go 1.27 dan boshlab default 1 (go.mod da `go 1.27` yoki undan yuqori bo'lgan modullar uchun); `tracebacklabels=0` bilan o'chiriladi. Hujjat opt-out'ni cheksiz saqlashni aytadi, chunki yorliqlarga sezgir ma'lumot tushishi mumkin. Biz buni Go 1.24.7 da ishga tushira olmaymiz, shuning uchun chiqish formatini ko'rsatmaymiz; format kelajakda o'zgarishi mumkin deb hujjat ogohlantiradi. Go 1.27 goroutine leak profilini ham (`goroutineleak`, 1.26 da tajriba) umumiy foydalanishga chiqardi: u GC yordamida hech qachon ochilmaydigan bloklangan goroutine'larni topadi (41-dars).

## Misol: metrikalar va halokat chiqishi

### Metrikalar inventari

Dastur `metrics.All()` ni, guruhlarni va bir nechta nomning kindini chiqaradi; ro'yxatda hujjatda bor, ammo Go 1.24.7 da yo'q metrikalar ham bor.

```go
package main

import (
	"fmt"
	"runtime"
	"runtime/metrics"
	"sort"
	"strings"
)

func kindName(k metrics.ValueKind) string {
	switch k {
	case metrics.KindUint64:
		return "uint64"
	case metrics.KindFloat64:
		return "float64"
	case metrics.KindFloat64Histogram:
		return "histogram"
	}
	return "bad"
}

func main() {
	fmt.Println(runtime.Version(), runtime.GOARCH)
	all := metrics.All()
	fmt.Println("metrikalar soni:", len(all))

	// Metrikalar guruhlari: birinchi ikki yo'l komponenti bo'yicha.
	groups := map[string]int{}
	cumulative := 0
	for _, d := range all {
		parts := strings.Split(d.Name, "/")
		groups["/"+parts[1]]++
		if d.Cumulative {
			cumulative++
		}
	}
	keys := make([]string, 0, len(groups))
	for k := range groups {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	for _, k := range keys {
		fmt.Printf("  %-10s %d\n", k, groups[k])
	}
	fmt.Println("kumulyativ (faqat o'sadigan):", cumulative)

	// Bir nechta metrikani o'qiymiz va turini ko'ramiz. Mavjud bo'lmaganlari KindBad beradi.
	names := []string{
		"/sched/gomaxprocs:threads",
		"/sched/goroutines:goroutines",
		"/sched/latencies:seconds",
		"/gc/heap/goal:bytes",
		"/cpu/classes/gc/total:cpu-seconds",
		"/sched/goroutines/waiting:goroutines",
		"/gc/cleanups/queued:cleanups",
		"/gc/finalizers/queued:finalizers",
	}
	s := make([]metrics.Sample, len(names))
	for i, n := range names {
		s[i].Name = n
	}
	metrics.Read(s)
	for _, x := range s {
		fmt.Printf("%-42s %s\n", x.Name, kindName(x.Value.Kind()))
	}
}
```

Natija (Go 1.24.7, linux/amd64):

```text
go1.24.7 amd64
metrikalar soni: 92
  /cgo       1
  /cpu       11
  /gc        22
  /godebug   36
  /memory    14
  /sched     7
  /sync      1
kumulyativ (faqat o'sadigan): 65
/sched/gomaxprocs:threads                  uint64
/sched/goroutines:goroutines               uint64
/sched/latencies:seconds                   histogram
/gc/heap/goal:bytes                        uint64
/cpu/classes/gc/total:cpu-seconds          float64
/sched/goroutines/waiting:goroutines       bad
/gc/cleanups/queued:cleanups               bad
/gc/finalizers/queued:finalizers           bad
```

Oxirgi uch nom hujjatning yangi versiyasida tasvirlangan, lekin Go 1.24.7 da yo'q: `Read` ularga `KindBad` qaytardi. Shu sababli monitoring kodi metrikalarni nomi bo'yicha qat'iy o'qimay, yo `All()` bilan, yo `KindBad` ni tashlab, o'qishi kerak. Qiziq tomoni: `/gc/cleanups/*` va `/gc/finalizers/*` 59-darsdagi cleanup va finalizer navbatlari uzunligini baholash uchun hujjatda tavsiya qilinadi (`queued` va `executed` hisoblagichlari farqi), lekin biz ularni Go 1.24.7 da ishlatib sina olmadik va ular qaysi versiyada paydo bo'lganini tekshirmadik. `/sched/goroutines/*` (masalan `waiting`) haqida esa Go 1.26 release notes yangi scheduler metrikalari qo'shilganini yozadi.

### GOTRACEBACK darajalari

Dastur nil map'ga yozadi (`Cache.Put`), shu paytda boshqa goroutine kanalda bloklangan. Bu kod atayin xato (nil map).

```go
package main

import (
	"fmt"
	"time"
)

// Cache - noto'g'ri: map nil bo'lib qolgan.
type Cache struct {
	byPlate map[string]int
}

func (c *Cache) Put(plate string, fuel int) {
	c.byPlate[plate] = fuel // nil map ga yozish: panic
}

func poll(ch chan int) {
	<-ch // hech kim yubormaydi
}

func main() {
	go poll(make(chan int))
	time.Sleep(50 * time.Millisecond)
	c := &Cache{}
	fmt.Println("yozuv boshlandi")
	c.Put("01A123BC", 120)
}
```

Bir xil ikkilik fayl, to'rt xil `GOTRACEBACK` (Go 1.24.7). Default (o'rnatilmagan) chiqish:

```text
yozuv boshlandi
panic: assignment to entry in nil map

goroutine 1 [running]:
main.(*Cache).Put(...)
	main.go:14
main.main()
	main.go:26 +0xcf
```

`GOTRACEBACK=all` shunga bloklangan goroutine'ni qo'shadi:

```text
goroutine 6 [chan receive]:
main.poll(...)
	main.go:18
created by main.main in goroutine 1
	main.go:22 +0x66
```

`GOTRACEBACK=system` esa runtime kadrlarini (`panic`, `mapassign_faststr`, `runtime.main`) va runtime goroutine'larini (masalan `goroutine 2 [force gc (idle)]`) ko'rsatadi; chiqish uzunligi: default 8 qator, `all` 14, `system` 84, `none` 2 (faqat `panic:` qatori). Hamma holatda chiqish kodi 2. Xulosa: default dump panic'ni topishga yetadi, bloklangan "hamkasblar"ni ko'rish uchun `all` kerak, runtime ichi (scheduler, GC ishtiroki) shubha qilinsa `system`. Ammo `all` va `system` log hajmini va sezgir ma'lumot chiqish xavfini oshiradi; kerak bo'lganda yoqing.

### Fatal xatolar

Uch goroutine'dan bir nechta mutex'siz map'ga yozadi (bu kod data race'ga ega).

```go
package main

import (
	"fmt"
	"sync"
)

// Fleet - umumiy map, mutex'siz: bu kod data race'ga ega.
type Fleet struct {
	fuel map[int]int
}

func main() {
	f := &Fleet{fuel: map[int]int{}}
	var wg sync.WaitGroup
	for w := 0; w < 4; w++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for i := 0; i < 1_000_000; i++ {
				f.fuel[i%1024] = i
			}
		}()
	}
	wg.Wait()
	fmt.Println("tugadi", len(f.fuel))
}
```

Ketma-ket uch ishga tushirishning hammasida chiqish shunday boshlandi (chiqish kodi 2):

```text
fatal error: concurrent map writes

goroutine 6 [running]:
internal/runtime/maps.fatal({0x4b8109?, 0x0?})
	/usr/local/go1.24.7/src/runtime/panic.go:1058 +0x18
main.main.func1()
	main.go:21 +0x75
created by main.main in goroutine 1

goroutine 1 [sync.WaitGroup.Wait]:
...
goroutine 7 [runnable]:
main.main.func1()
	main.go:18
```

Bu holda `GOTRACEBACK` o'rnatilmagan bo'lsa ham hamma goroutine'lar chiqdi: xato runtime ichida aniqlangani uchun hujjat shuni aytadi. Dump ikkita yozuvchi goroutine'ni (6 va 7) ko'rsatadi, asosiy goroutine esa `WaitGroup.Wait` da. Tuzatish: map'ga kirishni sinxronlash va `-race` bilan sinash (43-dars). Aniqlash kafolatlanmagan: runtime bu xatoni faqat sinxronlanmagan yozuvlar to'qnashganda payqaydi, shuning uchun yo'qligi xavfsizlikni bildirmaydi.

Deadlock ham fatal error:

```text
natija kutilmoqda
fatal error: all goroutines are asleep - deadlock!

goroutine 1 [chan receive]:
main.main()
	main.go:11 +0x86
```

Bu xabar faqat hamma goroutine bloklanganida chiqadi; real servisda boshqa goroutine'lar (server, taymer) ishlab turgani uchun u chiqmaydi va bloklangan goroutine'lar jimgina to'planadi: ularni goroutine profili yoki Go 1.27 goroutine leak profili topadi (41-dars).

### Topshiriq: kind-xavfsiz o'quvchi

`read` funksiyasi nomlar ro'yxatini oladi, har metrikani kindi bo'yicha o'qiydi, gistogrammadan kvantil hisoblaydi va yo'q metrikalarni tashlaydi. Starter hamma narsaga `Uint64()` chaqirib, float metrikada panic qiladi; to'liq kod topshiriqda.

## Qachon qo'llamaslik kerak

`gctrace` va `inittrace` chiqishidan dashboard qurmang: format o'zgarishi mumkin deb hujjatlashtirilgan. Raqamlar kerak bo'lsa `runtime/metrics` ishlating.

Hujjatda tasvirlangan, lekin o'z toolchain'ingizda tekshirilmagan metrika nomiga tayanmang: `All()` yoki `KindBad` tekshiruvi bilan o'qing. Bu dasturni versiyadan versiyaga o'tkazganda xavfsiz.

`GOTRACEBACK=crash` yoki core dump'ni qasddan yoqishdan oldin o'ylang: core fayl jarayon xotirasining nusxasi, unda token va parollar bo'lishi mumkin (bu umumiy xavfsizlik ehtiyoti, dars manbalarida yo'q). Tizim cheklovlari (core hajmi, saqlash joyi) ham bor.

`tracebacklabels` yorliqlariga sezgir ma'lumot qo'ymang: ular Go 1.27 da traceback sarlavhasida chiqadi, hujjat shu sababli opt-out'ni saqlashini aytadi.

Metrikalarni juda tez-tez o'qimang va ularni "real vaqt" deb hisoblamang: ko'plari taxminiy (`Approximate`, `overestimate`) va ayrimlari faqat GC sikli oxirida yangilanadi. Qaror uchun oynalar bo'yicha tendensiyani oling, bitta o'lchovni emas.

## Stack'da: Node.js bilan farq

Node.js'da kutilmagan xato `uncaughtException` hodisasi bilan ushlanadi va jarayon davom ettirilishi mumkin; Go'da fatal error ushlanmaydi va jarayon har doim 2 kod bilan tugaydi. Shu sababli Go servisi ostida supervisor (Kubernetes, systemd) qayta ishga tushirishni hal qiladi, va halokatdan oldin muhim bo'lgan narsa traceback'ning logga tushishi: stderr'ni yig'ish va `GOTRACEBACK=all` ni production uchun qaror qilish (bu haqda yuqorida: log hajmi va xavfsizlik).

Metrikalar uchun Node.js'dagi `process.memoryUsage()` o'rnida Go'da `/memory/classes/*` va `/gc/*` bor, ular ancha batafsil. Ularni Prometheus kabi tizimga uzatish kerak bo'lsa (85-dars), avval qaysi metrikalar muhimligini hal qiling: heap maqsadi, tirik heap, GC CPU ulushi, scheduler kechikishi (`/sched/latencies:seconds`) va goroutine soni. Muallifning tajribaviy tavsiyasi: har deployment'da `go version` ni va `GOEXPERIMENT` (57-dars) ni yorliq qilib qo'shing, shunda toolchain yangilanishi grafikda ko'rinadi.

## Xulosa

- `runtime/metrics` kalitlari `yo'l:birlik` ko'rinishida; kind o'zgarmaydi, lekin metrikalar turlicha (uint64, float64, gistogramma). Kodni `Value.Kind()` bo'yicha tarmoqlang va `KindBad` ni tashlab keting: Go 1.24.7 da hujjatdagi ba'zi yangi metrikalar yo'q.
- Kumulyativ metrikalarda oyna ayirmasi kerak; gistogrammada jami son `Counts` yig'indisi, chegara `+Inf` bo'lishi mumkin; `/cpu/classes/*` qiymatlari taxminiy va faqat o'zaro solishtiriladi.
- Runtime GODEBUG o'zgaruvchilari diagnostika uchun (`gctrace`, `schedtrace`, `inittrace`, `tracebackancestors`), lekin ularning formatlari o'zgarishi mumkin; hisob-kitob uchun `runtime/metrics` ishlating.
- Panic ushlanadi, fatal error (`concurrent map writes`, deadlock, stack overflow) ushlanmaydi va jarayon 2 kod bilan tugaydi. `GOTRACEBACK` default `single`; `all` boshqa goroutine'larni, `system` runtime kadrlarini qo'shadi; runtime ichidagi xatoda hamma goroutine'lar default'da ham chiqadi.
- Go 1.26 dan `tracebacklabels` goroutine yorliqlarini traceback'ka qo'shadi (Go 1.27 da default 1), Go 1.27 goroutine leak profilini umumiy foydalanishga chiqardi: bu qismlar hujjatga tayanadi va lokal sinalmagan.
