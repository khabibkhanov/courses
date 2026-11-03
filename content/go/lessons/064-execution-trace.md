---
n: 64
slug: execution-trace
title: "Execution tracer va flight recorder"
summary: "Execution trace nimani ko'rsatadi (kutish va vaqt chizig'i), runtime/trace API'si (Start, Task, Region, Log), go tool trace va -pprof rejimlari, Go 1.21-1.22 dagi yaxshilanishlar va Go 1.25 dagi FlightRecorder bilan kamdan-kam hodisalarni ushlash."
duration: 40
sources:
  - id: blog-traces-2024
    note: "Muammolar ro'yxati (overhead, hajm, qachon boshlash, tahlil), Go 1.21 dagi overhead pasayishi, Go 1.22 dagi trace bo'laklash va flight recording g'oyasi"
  - id: blog-flight-recorder
    note: "Flight recorder g'oyasi, Go 1.25 da mavjudligi va HTTP server misoli (mutex ushlab turish sababli sekin so'rovlar)"
  - id: pkg-runtime-trace
    note: "Start/Stop, NewTask, WithRegion, Log, FlightRecorder va FlightRecorderConfig (MinAge, MaxBytes) hujjatlari"
  - id: go125
    note: "Trace flight recorder bo'limi: FlightRecorder API'si xotiradagi halqa buferiga yozadi va WriteTo bilan snapshot oladi"
  - id: go127
    note: "Trace bo'limi: go tool trace -http faqat port berilsa localhost'ni tinglaydi"
quiz:
  - q: "Latency yuqori, CPU esa past. 40 ta goroutine bitta kanalda bloklanib turibdi. Qaysi vosita bu manzarani eng aniq ko'rsatadi?"
    options:
      - "Execution trace: u goroutine'larning qachon ishlayotgani va qachon ishlamayotganini vaqt chizig'ida ko'rsatadi, bloklangan stack'lar bilan"
      - "CPU profil: u bloklangan goroutine'larni ham namuna qiladi"
      - "Heap profil: kutish xotira bilan bog'liq"
      - "Faqat runtime/metrics"
    answer: 0
    explain: "CPU profil faqat bajarilayotgan kodni namuna qiladi, kanalda kutish unda ko'rinmaydi. Blog yozganidek, bunday konkurent bottleneck trace'da 'ijro yo'qligi' sifatida yaqqol ko'rinadi, bloklangan goroutine stack'lari esa sababni ko'rsatadi."
  - q: "Go 1.21 va 1.22 execution trace'ni qanday o'zgartirdi?"
    options:
      - "Trace endi faqat testlarda ishlaydi"
      - "go tool trace brauzer o'rniga terminalga o'tdi"
      - "Trace formati o'chirildi va faqat pprof qoldi"
      - "Go 1.21 da overhead 10-20% dan ko'pgina ilovalarda 1-2% gacha tushdi (traceback optimallashtirilgani uchun); Go 1.22 trace'ni bo'laklash orqali masshtablanadigan qildi"
    answer: 3
    explain: "Blog (2024) aynan shuni yozadi: overhead pasayishi tracebacklarni tezlashtirish hisobiga bo'ldi, Go 1.22 esa trace'ni muntazam bo'laklarga ajratadigan yangi implementatsiyani berdi. Boshqa variantlar xato: format qoldi, go tool trace brauzer UI'ni saqlab qoldi."
  - q: "Servis kam uchraydigan 300 ms li so'rovlardan aziyat chekadi. Hodisa bo'lib o'tgandan keyin trace boshlash befoyda. Nima yordam beradi?"
    options:
      - "trace.Start ni doim yoqib, butun trace'ni diskka yozish"
      - "FlightRecorder: oxirgi bir necha soniyalik trace xotirada halqa buferida saqlanadi va muammo aniqlangan lahzada WriteTo bilan snapshot olinadi"
      - "Har so'rovdan keyin runtime.GC() chaqirish"
      - "GOMAXPROCS ni 1 ga tushirish"
    answer: 1
    explain: "Flight recorder aynan shu muammo uchun yaratilgan: u trace'ni doimiy yig'adi, lekin faqat oxirgi oynani buferda ushlaydi va dastur 'muammo bo'ldi' deb bilgan paytda snapshot oladi. Butun trace'ni yozish hajm va xarajat jihatidan amaliy emas."
  - q: "`trace.Start(&buf)` dan keyin ish bajarildi va `buf.Bytes()` darhol o'qildi (Stop chaqirilmadi). Natija?"
    options:
      - "To'liq trace, chunki Start yozishni sinxron bajaradi"
      - "Kompilyatsiya xatosi"
      - "Trace to'liq emas va hali to'xtamagan: Stop faqat barcha yozuvlar tugagandan keyin qaytadi, shuning uchun o'qishdan oldin chaqirish shart"
      - "Panic bo'ladi"
    answer: 2
    explain: "Paket hujjati: Stop barcha yozuvlar tugaguncha qaytmaydi. Stop'siz trace yoqilgan holda qoladi (lokal tajribada IsEnabled true qaytardi) va buferdagi ma'lumot to'liq bo'lishi kafolatlanmaydi."
  - q: "`go tool trace -pprof=sync trace.out` nimani beradi?"
    options:
      - "Sinxronizatsiya primitivlarida bloklanishning pprof formatidagi profili (kim qayerda kutdi)"
      - "Faqat tarmoq chaqiruvlari bo'yicha profil"
      - "Trace'ni boshqa serverga sinxronlaydi"
      - "CPU profil"
    answer: 0
    explain: "go tool trace -h qo'llab-quvvatlanadigan turlarni sanaydi: net (tarmoq bloklanishi), sync (sinxronizatsiya bloklanishi), syscall (syscall bloklanishi) va sched (scheduler kechikishi). Natijani go tool pprof bilan o'qiysiz."
  - q: "FlightRecorderConfig'dagi MinAge va MaxBytes o'zaro qanday bog'liq?"
    options:
      - "MinAge har doim MaxBytes'dan ustun"
      - "Ikkalasi ham qat'iy kafolat beradi"
      - "MaxBytes faqat disk uchun, MinAge xotira uchun"
      - "MaxBytes ustun (hint sifatida), MinAge esa oynaning pastki yosh chegarasi; MaxBytes belgilangan yoshni bekor qiladi"
    answer: 3
    explain: "Paket hujjatiga ko'ra MinAge hodisaning oynadagi minimal yoshi chegarasi, ammo MaxBytes bilan bekor qilinadi. MaxBytes ham aniq kafolat emas: yozilgan hajm va xotira sarfi uchun maslahat sifatida qaraladi."
task:
  title: "Task va region bilan trace yig'ish"
  prompt: |
    `collectTrace` `parseBatch` ishini trace qilib, trace baytlarini qaytarishi kerak. Hozir u uch xato qiladi: `trace.Stop()` chaqirilmaydi (buferdan to'liq bo'lmagan ma'lumot o'qiladi va trace yoqilgan holda qoladi), `parseBatch` ichida `batch` nomli task va `parse` nomli region yo'q.

    `parseBatch` ichida `trace.NewTask` bilan `"batch"` task'i va `trace.WithRegion` bilan `"parse"` region'ini yarating, `collectTrace` ichida buferni o'qishdan oldin trace'ni to'xtating. `main` o'zgarmasin. Kutilgan natija: barcha qatorlar `true`.
  lang: go
  starter: |
    package main

    import (
        "bytes"
        "context"
        "fmt"
        "runtime/trace"
        "time"
    )

    // parseBatch ishni bajaradi. Trace'da "batch" task'i va "parse" region'i
    // ko'rinishi kerak.
    func parseBatch(ctx context.Context) {
        time.Sleep(2 * time.Millisecond)
    }

    // collectTrace parseBatch ishini trace qiladi va trace baytlarini qaytaradi.
    func collectTrace() ([]byte, error) {
        var buf bytes.Buffer
        if err := trace.Start(&buf); err != nil {
            return nil, err
        }
        parseBatch(context.Background())
        data := buf.Bytes()
        return data, nil
    }

    func main() {
        data, err := collectTrace()
        if err != nil {
            fmt.Println("xato:", err)
            return
        }
        fmt.Println("trace bo'sh emas:", len(data) > 0)
        fmt.Println("sarlavha go 1.:", bytes.HasPrefix(data, []byte("go 1.")))
        fmt.Println("task nomi bor:", bytes.Contains(data, []byte("batch")))
        fmt.Println("region nomi bor:", bytes.Contains(data, []byte("parse")))
        fmt.Println("trace to'xtagan:", !trace.IsEnabled())
    }
  solution: |
    package main

    import (
        "bytes"
        "context"
        "fmt"
        "runtime/trace"
        "time"
    )

    // parseBatch ishni bajaradi. Trace'da "batch" task'i va "parse" region'i
    // ko'rinishi kerak.
    func parseBatch(ctx context.Context) {
        ctx, task := trace.NewTask(ctx, "batch")
        defer task.End()
        trace.WithRegion(ctx, "parse", func() {
            time.Sleep(2 * time.Millisecond)
        })
    }

    // collectTrace parseBatch ishini trace qiladi va trace baytlarini qaytaradi.
    func collectTrace() ([]byte, error) {
        var buf bytes.Buffer
        if err := trace.Start(&buf); err != nil {
            return nil, err
        }
        parseBatch(context.Background())
        trace.Stop() // Stop qaytgandan keyingina buf to'liq yozilgan bo'ladi
        return buf.Bytes(), nil
    }

    func main() {
        data, err := collectTrace()
        if err != nil {
            fmt.Println("xato:", err)
            return
        }
        fmt.Println("trace bo'sh emas:", len(data) > 0)
        fmt.Println("sarlavha go 1.:", bytes.HasPrefix(data, []byte("go 1.")))
        fmt.Println("task nomi bor:", bytes.Contains(data, []byte("batch")))
        fmt.Println("region nomi bor:", bytes.Contains(data, []byte("parse")))
        fmt.Println("trace to'xtagan:", !trace.IsEnabled())
    }
  solutionNotes: |
    - `trace.NewTask(ctx, "batch")` yangi context va `*Task` qaytaradi; `defer task.End()` task'ni yopadi. Task bir necha goroutine'ga yoyilgan mantiqiy operatsiyani belgilaydi.
    - `trace.WithRegion(ctx, "parse", fn)` bitta goroutine ichidagi kod bo'lagini belgilaydi. Region'lar goroutine ichida ichma-ich joylashishi kerak.
    - `trace.Stop()` barcha yozuvlar tugagandan keyin qaytadi, shuning uchun `buf.Bytes()` faqat undan keyin to'liq. Stop chaqirilmasa, `trace.IsEnabled()` `true` qoladi va keyingi `trace.Start` xato qaytaradi.
    - Task va region nomlari trace ichida qator sifatida saqlanadi, shuning uchun `bytes.Contains` bilan tekshirish ishlaydi. Haqiqiy tahlil `go tool trace` yoki `-pprof` bilan qilinadi.
  checklist:
    - "`trace.Stop()` buferni o'qishdan oldin chaqiriladi"
    - "`batch` task'i `trace.NewTask` bilan yaratilgan va yopilgan"
    - "`parse` region'i `trace.WithRegion` bilan belgilangan"
    - "Barcha chiqish qatorlari `true`"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

p99 latency 40 ms dan 300 ms ga sakradi, CPU esa past. CPU profil (62-dars) bo'sh: hech narsa "yonmayapti". Heap profil ham normal. Muammo shundaki, goroutine'lar nimadir kutmoqda: lock, kanal, tarmoq, yoki scheduler ularga navbat bermayapti. Bunday sabablarni agregat profil ko'rsatishi qiyin, chunki profil vaqtni stack bo'yicha yig'adi, voqealar ketma-ketligini esa yo'qotadi.

Execution trace boshqacha yondashadi: runtime goroutine'larning hayotida bo'lgan hodisalarni (ishga tushdi, bloklandi, uyg'ondi, syscall'ga kirdi, GC boshlandi) vaqt tamg'asi bilan yozadi. Natija "qaysi funksiya qancha vaqt oldi" emas, "har bir goroutine har lahzada nima qilayotgan edi" jadvali. Go Blog maqolasi buni shunday izohlaydi: ko'p goroutine bitta kanalda bloklangan konkurent bottleneck CPU profilda ko'rinmaydi, chunki bajarilish yo'q, execution trace'da esa ijro yo'qligi yaqqol ko'rinadi, bloklangan goroutine stack'lari esa aybdorni ko'rsatadi.

Node.js'da bunga eng yaqin narsa DevTools'dagi Performance yozuvi (event loop vaqt chizig'i), lekin Go'da u ko'p yadroli, goroutine darajasida va production'da ishlatishga yaroqli bo'lib bormoqda. Bu darsda trace API'si, vositalar va Go 1.25 dagi flight recorder ko'riladi.

## Asosiy g'oya

### Trace nimani ko'rsatadi va nimani emas

Trace goroutine'lar, OS thread'lar (M) va protsessorlar (P) holatini vaqt chizig'ida ko'rsatadi (51-dars): qaysi goroutine qaysi P'da qancha ishladi, qachon bloklandi, qachon qayta ishga tushdi, GC qachon ishladi. U yo'qolgan vaqtni topish uchun: "bu so'rov 300 ms ishladi, shundan 280 ms mutex kutdi". Agregat va nisbiy tahlil uchun profil qulayroq; sababning aniq ketma-ketligi uchun trace.

### Yaxshilanishlar: Go 1.21, 1.22 va 1.25

Go Blog (2024) trace'ning to'rt tarixiy muammosini sanaydi: katta overhead, katta hajm, qachon boshlashni bilmaslik va tahlil qilish uchun ommaviy paket yo'qligi. Hisobotga ko'ra:

- Go 1.21 gacha tracing overhead'i ko'p ilovalarda 10-20% CPU edi. Traceback'larni optimallashtirish natijasida ko'pgina ilovalarda 1-2% gacha tushdi. Bu trace'ni vaqti-vaqti bilan emas, uzluksiz ishlatish imkonini yaratdi.
- Go 1.22 yangi implementatsiya berdi: trace vaqti-vaqti bilan bo'laklanadi, har bir bo'lak mustaqil. Eskidan bir necha yuz MiB trace tahlil uchun bir necha GiB RAM talab qilardi; maqola esa `go tool trace` hali ham butun trace'ni xotiraga yuklashini eslatadi.
- Uzluksiz tracing va bo'laklash flight recording uchun poydevor bo'ldi: avval `golang.org/x/exp/trace` da eksperiment, Go 1.25 da `runtime/trace.FlightRecorder` sifatida standart kutubxonada (go125 release notes va blog).

### API: Start, Stop, Task, Region, Log

`runtime/trace` hujjatiga ko'ra:

- `trace.Start(w io.Writer) error` - hozirgi dastur uchun tracing'ni yoqadi, trace buferlanib `w` ga yoziladi; allaqachon yoqilgan bo'lsa xato qaytaradi. `trace.Stop()` to'xtatadi va barcha yozuvlar tugagandan keyingina qaytadi. `trace.IsEnabled()` holatni ko'rsatadi (faqat ma'lumot uchun).
- `trace.NewTask(ctx, "request")` - foydalanuvchi aniqlagan mantiqiy operatsiya (so'rov, job); u bir nechta goroutine'ga yoyilishi mumkin. Yangi context qaytaradi; `task.End()` bilan yopiladi.
- `trace.WithRegion(ctx, "parse", fn)` yoki `defer trace.StartRegion(ctx, "parse").End()` - bitta goroutine ichidagi kod bo'lagi. Region'lar goroutine ichida ichma-ich joylashishi shart.
- `trace.Log(ctx, category, msg)` / `Logf` - bir martalik hodisa. Hujjat kategoriyalar soni kam (bir necha) bo'lishini taxmin qiladi.

Task va region'lar trace'ni biznes tushunchalariga bog'laydi: `go tool trace` UI'da "request" task'ining ichki vaqti region bo'yicha taqsimlanadi (UI qismi lokal ko'rilmagan, sandbox'da brauzer yo'q).

### Vositalar

- `go test -trace=trace.out pkg` - testdan trace yig'ish (`go tool trace -h` yordami shuni yozadi).
- `go tool trace trace.out` - brauzerda ochadi (hujjat Chrome/Chromium da faol sinalganini eslatadi). `-http=addr` manzilni belgilaydi; Go 1.27 release notes'ga ko'ra faqat port berilganda (`-http=:6060`) endi localhost tinglanadi, hamma interfeys uchun manzilni to'liq yozing.
- `go tool trace -pprof=TYPE trace.out` - trace'dan pprof formatidagi profil chiqaradi: `net` (tarmoq bloklanishi), `sync` (sinxronizatsiya bloklanishi), `syscall` (syscall bloklanishi), `sched` (scheduler kechikishi). Natija `go tool pprof` bilan o'qiladi, ya'ni profil bilan trace orasidagi ko'prik.
- `net/http/pprof` endpoint'i `/debug/pprof/trace?seconds=5` jonli servisdan 5 soniyalik trace beradi (62-dars).

## Chuqurroq: flight recorder

Muammo: servis haftalar ishlaydi, sekin so'rov esa kamdan-kam bo'ladi. Hodisa ro'y bergach `trace.Start` chaqirish kech: sabab allaqachon o'tib ketgan. Butun vaqt davomida trace yozish esa katta hajm beradi. Flight recorder uchinchi yo'l: trace doimiy yig'iladi, lekin faylga emas, xotiradagi halqa buferiga, ya'ni faqat oxirgi bir necha soniya saqlanadi. Dastur "muammo bo'ldi" deb aniqlagan lahzada (masalan, so'rov 300 ms dan oshdi) `WriteTo` bilan shu oynani snapshot qiladi.

`runtime/trace` hujjatiga ko'ra (Go 1.25 dan):

- `trace.NewFlightRecorder(cfg FlightRecorderConfig)`, `fr.Start() error`, `fr.Stop()`, `fr.Enabled() bool`, `fr.WriteTo(w) (n int64, err error)`.
- `FlightRecorderConfig.MinAge` - hodisaning oynadagi yoshi uchun pastki chegara (0 bo'lsa, soniyalar tartibidagi implementatsiyaga bog'liq qiymat). `MaxBytes` - oyna hajmining yuqori chegarasi; u `MinAge`dan ustun, lekin aniq kafolat emas, maslahat sifatida qaraladi.
- Bir vaqtda faqat bitta flight recorder faol bo'lishi mumkin (hujjat kelajakda bu cheklov olib tashlanishi mumkinligini aytadi). U `trace.Start` bilan parallel ishlay oladi.

Quyidagi kod hujjatdagi API va blog misoliga tayanadi. U lokal kompilyatsiya qilinmagan: sandbox Go 1.24.7, `trace.NewFlightRecorder` esa Go 1.25 da paydo bo'lgan (lokal `go vet` `undefined: trace.NewFlightRecorder` deb xabar berdi, `gofmt` esa sintaksisni to'g'ri deb topdi). Siz o'z mashinangizda Go 1.25+ bilan sinab ko'ring:

```go
fr := trace.NewFlightRecorder(trace.FlightRecorderConfig{
	MinAge:   5 * time.Second,
	MaxBytes: 3 << 20,
})
if err := fr.Start(); err != nil {
	log.Fatal(err)
}
defer fr.Stop()

var once sync.Once
http.HandleFunc("/orders", func(w http.ResponseWriter, r *http.Request) {
	start := time.Now()
	handleOrder(w, r)
	if time.Since(start) > 300*time.Millisecond {
		once.Do(func() {
			f, err := os.Create("slow-request.trace")
			if err != nil {
				log.Print(err)
				return
			}
			defer f.Close()
			if _, err := fr.WriteTo(f); err != nil {
				log.Print(err)
			}
		})
	}
})
```

`sync.Once` blog misolidagi soddalashtirish: haqiqiy tizimda snapshot'lar sonini cheklash (rate limit) yoki nom bilan ketma-ket yozish kerak, aks holda sekinlashgan servis bir xil trace'larni ko'plab yozadi. Blog misolida sekinlikning sababi ham trace bilan topiladi: hisobot goroutine'i `defer` ichida lock'larni ushlab qolib, so'rovlarni kuttirgan.

## Misol: lock ushlab turgan snapshot

Quyidagi dastur blog misoliga o'xshash, lekin o'zimizning domenimizda: xarita himoyalangan `sync.Mutex`, fon goroutine'i har 100 ms da `snapshot()` chaqiradi, u lock ushlab turib 40 ms "tarmoqqa yozadi". To'rt worker 400 tadan so'rov bajaradi. Har so'rov `trace.NewTask("request")` va ikki region (`parse`, `update`) ichida ishlaydi:

```go
func (s *store) snapshot() {
	s.mu.Lock()
	defer s.mu.Unlock()
	time.Sleep(40 * time.Millisecond) // lock ushlab turib tarmoqqa yozish
}

func handle(ctx context.Context, s *store, id int) time.Duration {
	ctx, task := trace.NewTask(ctx, "request")
	defer task.End()
	start := time.Now()

	trace.WithRegion(ctx, "parse", func() {
		time.Sleep(200 * time.Microsecond)
	})
	trace.WithRegion(ctx, "update", func() {
		trace.Logf(ctx, "device", "dev-%d", id%10)
		s.add(fmt.Sprintf("dev-%d", id%10))
	})
	return time.Since(start)
}
```

Go 1.24.7, linux/amd64, 2 vCPU (shared VM). Dastur `trace.out` yozadi (159 012 bayt; fayl `go 1.23 trace` sarlavhasi bilan boshlanadi: trace formati versiyasi, toolchain emas) va eng sekin so'rovni chiqaradi, uch marta ishga tushirganda `42ms`, `43ms`, `43ms`. Ya'ni eng sekin so'rov aynan lock ushlab turish vaqtiga teng.

Sababni topish: `go tool trace -pprof=sync trace.out > sync.pprof` va `go tool pprof -top`:

```text
      flat  flat%   sum%        cum   cum%
     2.22s 42.64% 42.64%      2.22s 42.64%  main.(*store).add
     1.50s 28.68% 71.32%      1.50s 28.68%  sync.(*WaitGroup).Wait
     1.50s 28.68%   100%      1.50s 28.68%  runtime.selectgo
         0     0%   100%      2.22s 42.64%  main.handle
         0     0%   100%      2.22s 42.64%  main.handle.func2
```

`main.(*store).add` 2.22 s jami bloklangan (barcha goroutine'lar bo'yicha), `WaitGroup.Wait` va `selectgo` esa oddiy kutishlar (main va fon goroutine'i). Stack `handle.func2`, ya'ni `update` region'ini ko'rsatadi. Shunday qilib, sekin so'rovlar `update` region'ida lock kutgan. Mutex profili (63-dars) ham xuddi shu javobni berardi, trace esa bundan tashqari qachon va qaysi goroutine kuttirganini ko'rsatadi.

Tuzatish: `snapshot` xaritani lock ostida tez nusxalaydi, tarmoqqa esa lock'siz yozadi. Qayta o'lchash (uch ishga tushirish): eng sekin so'rov `4ms`, `70ms`, `4ms`. 70 ms - shared VM'dagi tasodifiy to'xtalish (outlier), tuzatish bilan bog'liq emas; bitta eng yomon qiymat shovqinga juda sezgir. Shuning uchun real tizimda p99 va ko'p so'rov bo'yicha taqsimotni o'lchang (70-dars). Yangi trace'ning `sync` profilida `store.add` endi ko'rinmaydi, faqat oddiy kutishlar qoldi.

Topshiriqda task, region va `Stop` tartibini mustahkamlaysiz.

## Qachon qo'llamaslik kerak

- Agregat savollar uchun trace emas, profil. "Qaysi funksiya CPU'ning 30% ini yeydi?" savoliga CPU profil javob beradi. Trace hajmi katta, o'qish vaqt oladi.
- Trace'ni doim yoqib, butun hajmini yozmang. Hajm tez o'sadi; uzluksiz kerak bo'lsa, flight recorder yoki qisqa oynali namuna.
- Flight recorder xotira sarfini oshiradi: oyna hajmi (`MaxBytes`) shu xotirani egallaydi. Go 1.25 da bu overhead'ni o'z yuklamangizda o'lchamasdan production'ga qo'ymang. Blog CPU overhead raqamini bermaydi, shuning uchun men ham uydirmayman; u faqat hajm bo'yicha taxminiy o'lchovni keltiradi (trace odatda soniyasiga bir necha MB, band servis uchun taxminan 10 MB/s) va `MinAge` ni kerakli hodisa oynasidan taxminan 2 baravar katta qo'yishni tavsiya qiladi. Shu hajmda yuqoridagi misolning `MaxBytes: 3 << 20` qiymati band servisda `MinAge: 5s` dan oldin to'lib, oynani taxminan 1 soniyagacha qisqartirishi mumkin (MaxBytes ustun).
- `go tool trace` butun trace'ni xotiraga yuklaydi (blog 1.22 dan keyin ham shunday ekanini yozadi): katta trace uchun RAM zahirasi kerak va brauzer sekinlashadi.
- Trace'da maxfiy ma'lumot bo'lishi mumkin (`trace.Log` xabarlari, region nomlari). Foydalanuvchi ma'lumotini Log'ga yozmang, trace fayllarini oshkor qilmang.
- Trace goroutine darajasini ko'rsatadi, mikro-optimizatsiya uchun emas (cache miss, allocation tafsilotlari uchun benchmark va profil kerak).

## Stack'da: Node.js/TypeScript bilan solishtirish

Node.js'da event loop kechikishi `perf_hooks` (`monitorEventLoopDelay`) va Performance yozuvi bilan o'lchanadi; bitta thread bo'lgani uchun "kim bloklayapti" savoli ko'pincha bitta sinxron funksiya bilan tugaydi. Go'da bloklanish sabablari ko'p (lock, kanal, syscall, GC, scheduler), shuning uchun trace deyarli birinchi darajali asbob.

Amaliy tavsiyalar:

- Servisning muhim operatsiyalarini `trace.NewTask` bilan belgilang (so'rov, job); ichki bosqichlarni `WithRegion` bilan. Yoqilganda ular tahlilni biznes tilida olib borishga imkon beradi; ularning narxini o'z yuklamangizda o'lchab ko'ring (61-dars).
- Kam uchraydigan sekin so'rovlar uchun Go 1.25+ da flight recorder qo'shing va snapshot'ni vaqt chegarasi (masalan, SLO oshishi) va rate limit bilan cheklang.
- Trace'ni profil bilan birga ishlating: avval `-pprof=sync` yoki mutex profili sababni toraytiradi, so'ng trace vaqt chizig'ida tasdiqlaydi. Diagnostics hujjati vositalar bir-biriga xalaqit berishi mumkinligini aytadi, shuning uchun bir vaqtda bitta vositani yoqing.
- Testlarda `go test -trace=trace.out` bilan flaky yoki sekin testning vaqt chizig'ini oling.

## Xulosa

- Execution trace goroutine hodisalarini vaqt chizig'ida yozadi; CPU profilda ko'rinmaydigan kutishlarni (lock, kanal, scheduler) ochadi.
- Go 1.21 overhead'ni ko'p ilovalarda 10-20% dan 1-2% gacha tushirdi, Go 1.22 trace'ni bo'laklab masshtablanadigan qildi; bular uzluksiz tracing va flight recorder uchun poydevor.
- `trace.Start/Stop`, `NewTask`, `WithRegion`, `Log` trace'ni biznes operatsiyalariga bog'laydi; `Stop` qaytmaguncha buferni o'qimang.
- `go tool trace -pprof=sync|net|syscall|sched` trace'dan pprof profil chiqaradi.
- Go 1.25 `trace.FlightRecorder` oxirgi oynani xotirada ushlab, muammo aniqlanganda snapshot beradi; `MaxBytes` `MinAge`dan ustun, ikkalasi ham aniq kafolat emas. Bu kod lokal kompilyatsiya qilinmagan.
