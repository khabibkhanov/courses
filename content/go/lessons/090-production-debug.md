---
n: 90
slug: production-debug
title: "Production'da debug: pprof endpoint, crash va flight recorder"
summary: "Ishlayotgan servisni xavfsiz tekshirish: ichki portdagi pprof endpoint'i, goroutine va heap profillarini o'qish, panic va GOTRACEBACK, SIGQUIT dump, debug.SetCrashOutput va Go 1.25 flight recorder."
duration: 45
sources:
  - id: pkg-http-pprof
    note: "pprof endpoint'lari, query parametrlar (debug, seconds, gc), DefaultServeMux'ga ro'yxatdan o'tish va GET talabi"
  - id: blog-flight-recorder
    note: "Flight recorder maqsadi va ishlatilishi (Go 1.25). Maqola bu sessiyada qayta o'qilmagan; kod shu tavsifga tayanadi"
  - id: diagnostics
    note: "Diagnostika vositalari tasnifi: profiling, tracing, debugging va runtime statistikasi"
quiz:
  - q: "Dasturda faqat `import _ \"net/http/pprof\"` bor va ommaviy server `http.ListenAndServe(\":8080\", nil)` bilan ishga tushgan. Nima bo'ladi?"
    options:
      - "Hech narsa: pprof faqat `-tags pprof` bilan yoqiladi"
      - "pprof faqat localhost'dan so'rovlarni qabul qiladi"
      - "Kompilyator xato beradi"
      - "pprof endpoint'lari DefaultServeMux'ga ro'yxatdan o'tadi va ommaviy portda hamma uchun ochiq bo'ladi (/debug/pprof/)"
    answer: 3
    explain: "Paket init'da o'zini DefaultServeMux'ga qo'shadi; nil handler bilan ishga tushgan server DefaultServeMux'dan foydalanadi. Biz buni tekshirdik: starter'dagi ommaviy handler /debug/pprof/ ga 200 qaytardi. Yechim: pprof'ni alohida ichki portda, aniq mux bilan xizmat qiling va ommaviy serverda DefaultServeMux ishlatmang."
  - q: "`/debug/pprof/goroutine?debug=1` chiqishida `50 @ 0x47562e ... main.leakyWorker` qatori bor. Bu nimani bildiradi?"
    options:
      - "leakyWorker 50 marta chaqirilgan va tugagan"
      - "50 ta goroutine aynan bir xil stack'da turibdi (bu yerda leakyWorker ichida): sizish yoki bloklanish belgisi"
      - "Heap'da 50 ta obyekt bor"
      - "50 ta mutex kutilmoqda"
    answer: 1
    explain: "debug=1 bir xil stack'dagi goroutine'larni guruhlab, oldiga sonini yozadi. Ko'p goroutine bitta joyda to'planib turgan bo'lsa (bizning misolda kanaldan o'qishda), bu odatda goroutine leak. Vaqt o'tishi bilan bu son o'sib borsa, sizish tasdiqlanadi."
  - q: "Process'da nil pointer panic chiqdi, lekin boshqa goroutine'lar ham bog'liq bo'lishi mumkin. Standart holatda stack trace'da faqat panic qilgan goroutine ko'rindi. Qanday qilib hammasini ko'rish mumkin?"
    options:
      - "Qayta kompilyatsiya qilish kerak"
      - "Faqat debugger bilan mumkin"
      - "`GOTRACEBACK=all` muhit o'zgaruvchisi bilan ishga tushirish: boshqa goroutine'lar ham ko'rsatiladi"
      - "recover() ichida runtime.Stack chaqirish yagona yo'l"
    answer: 2
    explain: "Tekshirdik: standart holatda faqat goroutine 1 chiqdi, GOTRACEBACK=all bilan esa chan receive'da kutayotgan goroutine 5 ham ko'rindi. Bu sozlama runtime'ning ishga tushishida o'qiladi, qayta kompilyatsiya kerak emas. Konteynerda uni env orqali beriladi."
  - q: "`debug.SetCrashOutput(f, debug.CrashOptions{})` nimani beradi?"
    options:
      - "Fatal xato va ushlanmagan panic'ning chiqishini stderr bilan birga faylga ham yozadi (Go 1.23 dan); konteyner log'i yo'qolgan holatda foydali"
      - "Panic'ni ushlab, dasturni davom ettiradi"
      - "Core dump yaratadi"
      - "Crash'ni metrikaga yozadi"
    answer: 0
    explain: "Tekshirdik: stderr va crash.log ikkalasida ham panic va stack trace bor, chiqish kodi 2. SetCrashOutput Go 1.23 dan mavjud. Dastur baribir to'xtaydi: u panic'ni ushlamaydi, faqat chiqishni qo'shimcha joyga yo'naltiradi."
  - q: "Flight recorder va oddiy `runtime/trace` (trace.Start) o'rtasidagi asosiy farq?"
    options:
      - "Flight recorder CPU profilini oladi"
      - "Flight recorder faqat metrikalar uchun"
      - "Hech qanday farq yo'q"
      - "Oddiy trace butun davr uchun yoziladi; flight recorder esa trace'ni xotirada aylanma bufer sifatida saqlab, hodisa bo'lgach faqat oxirgi bir necha soniyani faylga yozishga imkon beradi"
    answer: 3
    explain: "Muammo kamdan-kam va oldindan noma'lum bo'lsa, doimiy trace yozish qimmat. Flight recorder oxirgi MinAge oynasini xotirada ushlaydi; anomaliya aniqlanganda (masalan, sekin so'rov) snapshot olinadi. Bu Go 1.25 xususiyati; bu darsdagi kodi bu sessiyada kompilyatsiya qilinmagan."
  - q: "Heap profilida `main.remember` 67 MB `inuse_space` ko'rsatdi, aslida 64 MiB ajratilgan. Nima uchun bunday farq chiqishi mumkin?"
    options:
      - "Profil buzilgan"
      - "Heap profil namuna olish (sampling) orqali yig'iladi, shuning uchun qiymatlar taxminiy baho"
      - "GC xotirani ikki barobar hisoblaydi"
      - "pprof birliklarni noto'g'ri o'qiydi"
    answer: 1
    explain: "Heap profili ajratishlarni namuna olish bilan kuzatadi (runtime.MemProfileRate), shuning uchun summa baho. Misolda baho 64 MiB atrofida chiqdi. Aniq hajm kerak bo'lsa runtime/metrics ning heap hisoblagichlariga qarang (85-dars)."
task:
  title: "pprof ni ommaviy portdan ajratish"
  prompt: |
    Quyidagi servis `net/http/pprof` ni bo'sh import qiladi va ommaviy handler sifatida `http.DefaultServeMux` ni qaytaradi. Natijada `/debug/pprof/` ommaviy portda ochiq.

    Vazifa: faylni `server_test.go` deb saqlang. Ommaviy handler uchun yangi `http.NewServeMux()` ishlating (faqat `GET /health`). Alohida `newDebugHandler()` yozing: u `pprof.Index`, `Cmdline`, `Profile`, `Symbol`, `Trace` ni ro'yxatdan o'tkazsin (faqat ichki portda xizmat qilinadi). Table-driven test yozing: ommaviy handler `/health` ga 200, `/debug/pprof/` va `/debug/pprof/heap` ga 404; debug handler `/debug/pprof/` va `/debug/pprof/goroutine?debug=1` ga 200, `/health` ga 404 qaytarsin.
  lang: go
  starter: |
    package server

    import (
        "fmt"
        "net/http"
        "net/http/httptest"
        _ "net/http/pprof" // yon ta'sir: handler'lar DefaultServeMux'ga qo'shiladi
        "testing"
    )

    func init() {
        http.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
            fmt.Fprintln(w, "ok")
        })
    }

    // newPublicHandler ommaviy portda xizmat qilinadigan handler.
    func newPublicHandler() http.Handler {
        return http.DefaultServeMux
    }

    func TestHealth(t *testing.T) {
        rec := httptest.NewRecorder()
        newPublicHandler().ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/health", nil))
        if rec.Code != http.StatusOK {
            t.Fatalf("/health status = %d, kutilgan 200", rec.Code)
        }
    }
  solution: |
    package server

    import (
        "fmt"
        "net/http"
        "net/http/httptest"
        "net/http/pprof"
        "testing"
    )

    // newPublicHandler ommaviy portda xizmat qilinadi: pprof yo'q.
    // DefaultServeMux ishlatilmaydi, chunki net/http/pprof import qilinishi bilan
    // unga o'zini ro'yxatdan o'tkazadi.
    func newPublicHandler() http.Handler {
        mux := http.NewServeMux()
        mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
            fmt.Fprintln(w, "ok")
        })
        return mux
    }

    // newDebugHandler faqat ichki (loopback) portda xizmat qilinadi.
    func newDebugHandler() http.Handler {
        mux := http.NewServeMux()
        mux.HandleFunc("GET /debug/pprof/", pprof.Index)
        mux.HandleFunc("GET /debug/pprof/cmdline", pprof.Cmdline)
        mux.HandleFunc("GET /debug/pprof/profile", pprof.Profile)
        mux.HandleFunc("GET /debug/pprof/symbol", pprof.Symbol)
        mux.HandleFunc("GET /debug/pprof/trace", pprof.Trace)
        return mux
    }

    func status(h http.Handler, path string) int {
        rec := httptest.NewRecorder()
        h.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, path, nil))
        return rec.Code
    }

    func TestHandlers(t *testing.T) {
        tests := []struct {
            name string
            h    http.Handler
            path string
            want int
        }{
            {"ommaviy: health", newPublicHandler(), "/health", http.StatusOK},
            {"ommaviy: pprof yo'q", newPublicHandler(), "/debug/pprof/", http.StatusNotFound},
            {"ommaviy: heap yo'q", newPublicHandler(), "/debug/pprof/heap", http.StatusNotFound},
            {"debug: pprof indeks", newDebugHandler(), "/debug/pprof/", http.StatusOK},
            {"debug: goroutine", newDebugHandler(), "/debug/pprof/goroutine?debug=1", http.StatusOK},
            {"debug: health yo'q", newDebugHandler(), "/health", http.StatusNotFound},
        }
        for _, tt := range tests {
            t.Run(tt.name, func(t *testing.T) {
                if got := status(tt.h, tt.path); got != tt.want {
                    t.Errorf("GET %s status = %d, kutilgan %d", tt.path, got, tt.want)
                }
            })
        }
    }
  solutionNotes: |
    - `net/http/pprof` import qilinishi bilan (bo'sh yoki nomli) `DefaultServeMux` ga o'zini qo'shadi. Yechim paketni import qiladi (handler'lar uchun), lekin `DefaultServeMux` ni hech qachon xizmat qilmaydi: ommaviy handler yangi mux.
    - Starter'dagi ommaviy handler `/debug/pprof/` ga 200 qaytarishini alohida testda tasdiqladik.
    - Debug handler aniq ro'yxat bilan quriladi (`GET` metodlari bilan, Go 1.22 dan pprof faqat GET qabul qiladi). `/debug/pprof/` indeks sahifasi `goroutine`, `heap` kabi profillarni ham xizmat qiladi.
    - Debug mux ichki (`127.0.0.1`) listener'ga ulanadi, ommaviy portga emas; kirish tarmoq darajasida ham cheklanadi.
    - Testda ikki yo'nalish tekshiriladi: kerakli narsa ochiq va kerak bo'lmagan narsa yopiq.
  checklist:
    - "Ommaviy handler `http.NewServeMux()` bilan quriladi, `DefaultServeMux` ishlatilmaydi"
    - "`newDebugHandler()` pprof handler'larini aniq mux'ga ro'yxatdan o'tkazadi"
    - "Test ommaviy handler'da `/debug/pprof/` va `/debug/pprof/heap` 404 ekanini tekshiradi"
    - "Test debug handler'da pprof 200 va `/health` 404 ekanini tekshiradi"
    - "`go vet` va `go test -race` o'tadi"
---

## Muammo

Production'da muammo kam hollarda lokal takrorlanadi: xotira soatlar davomida o'sadi, goroutine soni sekin ko'payadi, ba'zan so'rovlar 5 soniya osilib qoladi, haftada bir marta process panic bilan o'ladi. Log va metrika "nimadir noto'g'ri" deydi, lekin aniq qayerda ekanini ko'rsatmaydi. Bu yerda ishlayotgan processning ichiga qarash kerak: profillar, goroutine dump va crash ma'lumoti. Go bunga tayyor vositalar beradi, ammo ikki xavf bor: bu vositalarni ommaviy tarmoqqa ochib qo'yish (ichki tuzilma va servisni sekinlashtirish imkoniyati oshkor bo'ladi) va muammo bo'lganda kerakli ma'lumot yig'ilmay qolishi (konteyner qayta ishga tushadi, log yo'qoladi).

Bu dars production debug uchun amaliy to'plamni beradi: pprof endpoint'ini xavfsiz ulash, goroutine va heap profillarini o'qish, crash chiqishini saqlab qolish va Go 1.25 flight recorder. Natijalar lokal ishga tushirilgan tajribalardan. 62-63-darslarda profillarni tahlil qilish ko'rilgan; bu yerda ularni production jarayoniga bog'laymiz. Flight recorder kodi Go 1.25 talab qiladi va sandbox'da (Go 1.24.7) kompilyatsiya qilinmagan.

## Asosiy g'oya

### Uch savol, uch vosita

| Savol | Vosita |
|---|---|
| Hozir process nima qilyapti? (CPU, xotira, goroutine'lar) | pprof endpoint (profil, heap, goroutine) |
| Nega process o'ldi? | panic/fatal chiqishi, `GOTRACEBACK`, `SetCrashOutput`, core dump |
| Kamdan-kam hodisa oldidan nima bo'lgan edi? | execution trace; flight recorder (Go 1.25) |

### pprof endpoint

`net/http/pprof` paketi `/debug/pprof/` ostida profillarni HTTP orqali beradi (hujjat: Go 1.22 dan barcha yo'llar GET bilan so'raladi). Parametrlar: `debug=N` (0 binary, 1 va undan katta matn), `gc=N` (heap profildan oldin GC), `seconds=N` (CPU va trace uchun davomiylik, allocs, block, goroutine, heap, mutex uchun delta profil). Foydalanish:

```text
go tool pprof http://localhost:6060/debug/pprof/heap
go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30
```

Eng muhim xavfsizlik nuqtasi: paket `init` da o'zini `DefaultServeMux` ga qo'shadi. Agar ommaviy server `http.ListenAndServe(addr, nil)` bilan yoki `DefaultServeMux` bilan ishlasa, pprof dunyoga ochiladi. Biz buni sinab ko'rdik (topshiriqdagi starter ommaviy handler `/debug/pprof/` ga 200 qaytardi). Qoida: pprof'ni alohida ichki listener'da, aniq mux bilan xizmat qiling (`127.0.0.1:6060`), unga kirishni tarmoq darajasida cheklang, ommaviy serverda esa `DefaultServeMux` ishlatmang.

## Chuqurroq: o'qish va saqlash

### Goroutine dump

`/debug/pprof/goroutine?debug=1` goroutine'larni bir xil stack bo'yicha guruhlab sanaydi, `debug=2` esa har goroutine'ni to'liq stack bilan chiqaradi (holati bilan: `chan receive`, `select`, `IO wait`, vaqt). Sizish belgisi: bitta stack ostida soni vaqt o'tishi bilan o'sib boradigan guruh. Ikki marta (masalan, 10 daqiqa farq bilan) olingan dump'larni solishtirish yetarli. Katta goroutine soni bo'lsa `debug=2` qimmat bo'lishi mumkin; o'lchang. Goroutine hayoti mavzusi 41-darsda.

### Heap va delta profillar

Heap profil `inuse_space` (hozir band), `inuse_objects`, `alloc_space` (jami ajratilgan) kesimlarini beradi. U namuna olish bilan yig'iladi, shuning uchun qiymatlar baho. `seconds=N` delta profil beradi: shu oraliqda nima o'sdi. Sizish uchun delta, tezlik uchun `alloc_*` kerak. Profil oxirgi tugagan GC holatini ko'rsatadi, shuning uchun test paytida `runtime.GC()` yoki `gc=1`.

### Crash ma'lumoti

Ushlanmagan panic stack trace'ni stderr'ga yozadi va dastur 2 kodi bilan chiqadi. Qaysi goroutine'lar ko'rsatilishi `GOTRACEBACK` bilan boshqariladi: standart holatda faqat panic qilgan goroutine, `all` bilan hammasi, `crash` bilan esa chiqishdan keyin core dump. `crash` rejimi operatsion tizim sozlamalariga bog'liq va biz uni sinamadik. SIGQUIT process'ga goroutine dump'ini chiqartirib to'xtatadi: osilib qolgan, lekin hali tirik process uchun "oxirgi chora" diagnostika.

Konteynerda stderr qayta ishga tushishda yo'qolishi mumkin. Go 1.23 dan `runtime/debug.SetCrashOutput(f, debug.CrashOptions{})` crash chiqishini qo'shimcha faylga ham yozadi (persistent volume yoki log agentiga ko'riladigan joy).

### Flight recorder (Go 1.25)

Execution trace (64-dars) juda boy, lekin uni doim yozish qimmat, kerak bo'lgan hodisa esa oldindan noma'lum. Flight recorder trace'ni xotirada aylanma bufer sifatida saqlaydi va faqat siz so'raganda (masalan, sekin so'rov yoki xato aniqlanganda) oxirgi bir necha soniyani faylga yozadi. Shu bilan "muammo bo'lganda nima sodir bo'lgan edi?" savoliga javob topiladi. Quyidagi kod `blog-flight-recorder` maqolasi tavsifiga tayanadi, maqola bu sessiyada qayta o'qilmagan va Go 1.25 kerak: kompilyatsiya qilinmagan, `FlightRecorderConfig` maydon nomlari va metod imzolarini rasmiy hujjat bilan solishtiring.

```go
package main

import (
	"log"
	"net/http"
	"os"
	"runtime/trace"
	"sync/atomic"
	"time"
)

// Go 1.25 runtime/trace.FlightRecorder. Kod blog va hujjat tavsifiga tayanadi;
// sandbox'da Go 1.24 bor, shuning uchun kompilyatsiya qilinmagan.
var (
	recorder *trace.FlightRecorder
	dumped   atomic.Bool // bitta hodisa uchun bitta snapshot
)

func startFlightRecorder() error {
	recorder = trace.NewFlightRecorder(trace.FlightRecorderConfig{
		MinAge:   5 * time.Second, // kamida oxirgi ~5 soniya saqlansin
		MaxBytes: 16 << 20,        // bufer hajmi yuqori chegarasi
	})
	return recorder.Start()
}

func snapshot(reason string) {
	if !dumped.CompareAndSwap(false, true) {
		return
	}
	f, err := os.Create("/var/tmp/flight-" + time.Now().Format("150405") + ".trace")
	if err != nil {
		log.Println("flight recorder fayli:", err)
		return
	}
	defer f.Close()
	if _, err := recorder.WriteTo(f); err != nil {
		log.Println("flight recorder yozuvi:", err)
		return
	}
	log.Println("flight recorder snapshot yozildi:", reason)
}

// slowGuard sekin so'rovni aniqlab, snapshot oladi.
func slowGuard(next http.Handler, limit time.Duration) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		if time.Since(start) > limit {
			snapshot("sekin so'rov: " + r.URL.Path)
		}
	})
}
```

Bu yerda `slowGuard` sekin so'rovni aniqlaydi va bitta snapshot oladi (`atomic.Bool` bilan takrorlanishni cheklaydi: hodisa bo'ronida disk to'lib ketmasin). Faylni `go tool trace` bilan ochasiz.

## Misol: sizib chiqayotgan goroutine'larni topish

Dastur ichki loopback portda pprof server ishga tushiradi va 50 ta goroutine'ni abadiy bloklaydi (`leakyWorker` hech qachon yozilmaydigan kanaldan o'qiydi). Keyin o'zining endpoint'idan goroutine dump'ni oladi:

```go
package main

import (
	"fmt"
	"io"
	"net"
	"net/http"
	"net/http/pprof"
	"path/filepath"
	"strings"
)

// debugMux pprof endpoint'larini alohida mux'ga ulaydi.
// net/http/pprof ni bo'sh import qilish esa DefaultServeMux'ga ro'yxatdan o'tkazadi
// va u ommaviy serverga tasodifan ochilib qolishi mumkin.
func debugMux() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("/debug/pprof/", pprof.Index)
	mux.HandleFunc("/debug/pprof/cmdline", pprof.Cmdline)
	mux.HandleFunc("/debug/pprof/profile", pprof.Profile)
	mux.HandleFunc("/debug/pprof/symbol", pprof.Symbol)
	mux.HandleFunc("/debug/pprof/trace", pprof.Trace)
	return mux
}

// leakyWorker kanalga yozuvchi kutib, abadiy bloklanadi: goroutine sizishi.
func leakyWorker(ch <-chan int) {
	<-ch
}

func get(url string) string {
	resp, err := http.Get(url)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	b, _ := io.ReadAll(resp.Body)
	return string(b)
}

func main() {
	// Ichki (loopback) portda debug server.
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		panic(err)
	}
	go http.Serve(ln, debugMux())
	base := "http://" + ln.Addr().String()

	// Sizib chiqayotgan goroutine'lar: har so'rov uchun bittadan, hech qachon tugamaydi.
	never := make(chan int)
	for i := 0; i < 50; i++ {
		go leakyWorker(never)
	}

	// debug=1: bir xil stack'dagi goroutine'lar guruhlab sanaladi.
	dump := get(base + "/debug/pprof/goroutine?debug=1")
	lines := strings.Split(dump, "\n")
	fmt.Println(lines[0])
	for i, l := range lines {
		if strings.Contains(l, "main.leakyWorker") && i > 0 {
			count := strings.Fields(lines[i-1])[0]
			f := strings.Fields(l)
			fmt.Printf("%s ta goroutine: %s %s\n", count, f[2], filepath.Base(f[3]))
		}
	}
}
```

Chiqish (Go 1.24.7, linux/amd64):

```text
goroutine profile: total 56
50 ta goroutine: 0x6959e4 main.leakyWorker+0x24
```

Jami 56 ta goroutine, shundan 50 tasi `main.leakyWorker` ichida (kanaldan o'qish, `main.go:26`). Qolgan 6 tasi runtime va HTTP infratuzilmasi. Haqiqiy servisda bu guruhning soni so'rovlar bilan o'sib borsa, sizish aniq. Sababni topish: stack'dagi funksiya (`leakyWorker`) va satr; davolash: kanalni yopish yoki context bilan chiqish (41, 42-darslar).

Debug mux aniq quriladi, `DefaultServeMux` ishlatilmaydi. Endi xotira: dastur 64 ta 1 MiB ajratishni global xaritada saqlab qoladi (kesh sizishi):

```go
package main

import (
	"fmt"
	"os"
	"runtime"
	"runtime/pprof"
)

// seen hech qachon tozalanmaydigan kesh: xotira sizishi.
var seen = map[int][]byte{}

func remember(id int) {
	seen[id] = make([]byte, 1<<20) // har id uchun 1 MiB
}

func main() {
	for i := 0; i < 64; i++ {
		remember(i)
	}
	runtime.GC() // heap profili oxirgi tugallangan GC holatini ko'rsatadi
	f, err := os.Create(os.Args[1])
	if err != nil {
		panic(err)
	}
	defer f.Close()
	if err := pprof.WriteHeapProfile(f); err != nil {
		panic(err)
	}
	fmt.Println("heap profili yozildi, saqlangan:", len(seen))
}
```

Profilni `go tool pprof -sample_index=inuse_space -top` bilan o'qiymiz:

```text
File: heap
Build ID: 8cae999c212f04988294845e558660aeb4e8eca6
Type: inuse_space
Time: 2026-11-03 12:45:30 +05
Showing nodes accounting for 67.08MB, 100% of 67.08MB total
      flat  flat%   sum%        cum   cum%
   67.08MB   100%   100%    67.08MB   100%  main.remember (inline)
         0     0%   100%    67.08MB   100%  main.main
         0     0%   100%    67.08MB   100%  runtime.main
```

Hammasi `main.remember` da, 67.08 MB. 64 MiB ajratilgan edi: farq namuna olish bahosi tufayli. Funksiya nomi va qatorni ko'rib, sizish manbasini topasiz.

### Crash ma'lumotini saqlash

Quyidagi dastur nil xaritaga yozadi va crash chiqishini faylga ham yo'naltiradi:

```go
package main

import (
	"fmt"
	"os"
	"runtime/debug"
)

func main() {
	f, err := os.Create(os.Args[1])
	if err != nil {
		panic(err)
	}
	// Go 1.23 dan: yaxshi imkoniyat, fatal xato va panic stack trace'ini faylga ham yozadi.
	if err := debug.SetCrashOutput(f, debug.CrashOptions{}); err != nil {
		panic(err)
	}
	fmt.Println("boshlandi")
	var m map[string]int
	m["x"] = 1
}
```

Natija (qisqartirilgan, chiqish kodi 2):

```text
stderr:   panic: assignment to entry in nil map
          goroutine 1 [running]:
crash.log: panic: assignment to entry in nil map
          goroutine 1 [running]:
          main.main()
          	.../crash/main.go:20 +0xa9
chiqish kodi: 2
```

Stderr'dagi izni orkestrator yo'qotib qo'ysa ham, fayl qoladi.

GOTRACEBACK farqi (boshqa goroutine kutayotgan holatda nil pointer panic):

```text
== GOTRACEBACK o'rnatilmagan
panic: runtime error: invalid memory address or nil pointer dereference
[signal SIGSEGV: segmentation violation code=0x1 addr=0x0 pc=0x4730ab]
goroutine 1 [running]:
== GOTRACEBACK=all
panic: runtime error: invalid memory address or nil pointer dereference
[signal SIGSEGV: segmentation violation code=0x1 addr=0x0 pc=0x4730ab]
goroutine 1 [running]:
goroutine 5 [chan receive]:
```

Standart holatda faqat panic qilgan goroutine; `all` bilan kanalda `chan receive` da kutayotgan goroutine 5 ham ko'rindi. SIGQUIT bilan to'xtatilgan process esa hamma goroutine'ni chiqaradi (tanlab ko'rsatildi):

```text
SIGQUIT: quit
goroutine 0 gp=0x5175c0 m=0 mp=0x518260 [idle]:
goroutine 1 gp=0xc000002380 m=nil [sleep]:
goroutine 5 gp=0xc000003500 m=nil [chan receive]:
exit=2
```

## Qachon qo'llamaslik kerak

- pprof'ni autentifikatsiyasiz ommaviy portda ochish. Stack'lar, argument nomlari va ichki yo'llar oshkor bo'ladi, `profile?seconds=` esa CPU yuki bilan servisni sekinlashtirishi mumkin. Ichki port, VPN yoki `kubectl port-forward` kabi cheklangan kirish ishlating.
- Doim yoqilgan og'ir profillar. Block va mutex profillari (`SetBlockProfileRate`, `SetMutexProfileFraction`) nol bo'lmagan qiymatda xarajat qo'shadi: ularni muammo tekshirilayotganda yoqing (63-dars).
- `debug=2` goroutine dump'ni tez-tez avtomatik olish: goroutine soni katta bo'lsa u sezilarli xarajat. Avtomatlashtirsangiz, chastotani cheklang.
- Core dump'ni hamma muhitda yoqish: u xotira tarkibini, jumladan sirlarni faylga yozadi. Saqlash va kirish siyosati bo'lmasa, yoqmang.
- Flight recorder'ni "ehtiyot uchun" katta bufer bilan yoqish: u xotira va CPU sarflaydi. Hajmni va yoqilgan muhitni ongli tanlang; bu Go 1.25 xususiyati, eski toolchain'da yo'q.
- Debug vositalari observability o'rnini bosmaydi: muammoni tez topishning asosi baribir metrika (85-dars), log (84-dars) va trace (86-dars). Profil esa ularning ko'rsatganini chuqurlashtiradi.

## Stack'da: Node.js bilan farq

Node.js'da jonli processni tekshirish `--inspect`, heap snapshot (`v8.writeHeapSnapshot`) va `clinic` kabi vositalar bilan amalga oshadi; heap snapshot butun heap'ni to'xtatib yozadi va katta faylga aylanadi. Go'dagi pprof heap profili namuna olish bilan ishlaydi, shuning uchun yengil va production'da yoqilgan holda qoldirilishi mumkin. Event loop bloklanishini topish Node.js'da qiyin joy; Go'da goroutine dump qaysi goroutine nimani kutayotganini bevosita ko'rsatadi.

Telemetriya platformasi uchun odatiy ish tartibi: ichki `:6060` pprof; Kubernetes'da `kubectl port-forward` bilan ulaniladi; alert "goroutine soni o'sdi" (85-dars, `/sched/goroutines:goroutines`) kelganda ikki dump olinadi va solishtiriladi; `GOTRACEBACK=all` image'da standart; `SetCrashOutput` persistent katalogga; kamdan-kam sekin so'rovlar uchun Go 1.25 da flight recorder. Hodisadan keyingi tekshirish: binary'ni simvollari bilan saqlang (89-dars) va `go tool pprof` bilan profilni shu binary'ga qarshi oching.

## Xulosa

- pprof endpoint'i foydali va xavfli: `net/http/pprof` `DefaultServeMux` ga o'zini qo'shadi, shuning uchun uni ichki portda, aniq mux bilan xizmat qiling va ommaviy serverda `DefaultServeMux` ishlatmang.
- Goroutine sizishini `goroutine?debug=1` dump'dagi o'sib boruvchi guruh topadi; ikki vaqtdagi dump'larni solishtiring. Heap sizishi uchun `inuse_space` va delta profil; qiymatlar sampling bahosi.
- Crash chiqishini saqlang: `GOTRACEBACK=all` (hamma goroutine), SIGQUIT (osilgan process dump'i), `debug.SetCrashOutput` (Go 1.23, faylga qo'shimcha yozuv).
- Flight recorder (Go 1.25) kamdan-kam hodisa oldidagi trace'ni xotirada saqlab, hodisada snapshot yozishga imkon beradi; kodi bu sessiyada kompilyatsiya qilinmagan.
- Debug vositalari xavfsizlik va xarajat nuqtai nazaridan cheklanadi: kirishni cheklang, og'ir profillarni faqat kerak bo'lganda yoqing.
