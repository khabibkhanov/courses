---
n: 100
slug: capstone
title: "Capstone: production-darajadagi servis"
summary: "Kursning yakuniy servisi: config, domen, service, store, HTTP chegarasi va middleware, alohida admin port (healthz, readyz, metrics, pprof), tartibli to'xtash va readiness; lokal tekshirilgan kod, sinov va binary smoke-test, Dockerfile/Makefile/CI/govulncheck matn sifatida."
duration: 60
sources:
  - id: 100go
    note: "Xatolarni qayta ishlash, context, HTTP va testlash bilan bog'liq keng tarqalgan xatolar; servis tuzilmasi qarorlari shu ro'yxatga qarshi tekshirilgan"
  - id: diagnostics
    note: "Profiling va tracing asboblari: servisning admin portida pprof endpoint'lari shu hujjatdagi asboblar uchun ochiladi"
  - id: vuln-mgmt
    note: "govulncheck va Go zaifliklar bazasi: bu darsdagi CI qadami uchun asos; asbob sandbox'da ishga tushirilmagan"
quiz:
  - q: "Nima uchun pprof endpoint'lari public portda emas, alohida admin portda (127.0.0.1) ochilgan?"
    options:
      - "pprof public portda ishlamaydi"
      - "Profil va metrikalar ichki ma'lumot beradi va resurs sarflaydi; ularni tashqariga ochish xavfli, admin port esa tarmoq darajasida yopiladi"
      - "Admin portda pprof tezroq ishlaydi"
      - "net/http/pprof faqat 127.0.0.1 da ishlaydi"
    answer: 1
    explain: "Profillar dastur ichki tuzilmasini ko'rsatadi, `/debug/pprof/profile` esa sekundlar davomida CPU yuklaydi. Lokal sinovda admin portda /debug/pprof/cmdline 200, public portda 404 bo'ldi. pprof o'zi portga bog'liq emas: qaysi mux'ga ulansangiz, o'sha yerda ishlaydi."
  - q: "Servis SIGTERM oldi. Quyidagi tartiblardan qaysi biri to'g'ri?"
    options:
      - "Serverni darhol Close qilish, keyin readiness'ni o'chirish"
      - "Faqat Shutdown chaqirish, readiness'ga tegmaslik"
      - "Readiness'ni 503 ga o'tkazish, load balancer trafikni olib tashlashi uchun drain kutish, keyin Shutdown bilan ishlayotgan so'rovlarni tugatish"
      - "os.Exit(0) chaqirish"
    answer: 2
    explain: "Readiness o'zgarmasa, load balancer yangi so'rovlarni yuborishda davom etadi va ular to'xtayotgan serverga tushadi. Close ishlayotgan so'rovlarni uzadi: topshiriqda uzoq so'rov `xato` bilan tugadi, Shutdown bilan `200 tugadi`. os.Exit deferred funksiyalarni o'tkazib yuboradi."
  - q: "`Timeout` middleware `r.WithContext(ctx)` bilan so'rov nusxasini yaratadi. Bu access log'dagi `route` maydoniga qanday ta'sir qildi va qanday hal qilindi?"
    options:
      - "Ta'sir qilmadi"
      - "Tashqi qatlam o'z so'rovida `r.Pattern` ni bo'sh ko'rdi (mux nusxaga yozadi); `RouteCapture` mux atrofida turib tanlangan marshrutni statusWriter'ga yozadi"
      - "Route doim 404 bo'ldi; mux almashtirildi"
      - "Log yozilmadi; Observe olib tashlandi"
    answer: 1
    explain: "Birinchi variantda access log'da route bo'sh edi: mux `Request.Pattern` (Go 1.23 dan) ni ichki nusxada o'rnatadi. RouteCapture mux'ni o'rab, uning so'rovidagi qiymatni statusWriter'ga uzatadi, Observe esa uni log qiladi."
  - q: "`config.Load(getenv func(string) string)` nega `os.Getenv` ni to'g'ridan-to'g'ri chaqirmaydi?"
    options:
      - "os.Getenv sekin"
      - "Funksiya paketlar ichida chaqirilmasligi kerak"
      - "Go muhit o'zgaruvchilarini faqat main'da o'qishga ruxsat beradi"
      - "Getenv'ni parametr qilish sinovga global holatsiz xaritadan sozlama berish imkonini beradi; noto'g'ri qiymatlar `errors.Join` bilan hammasi birdan qaytariladi"
    answer: 3
    explain: "Bog'liqlikni parametr qilish (91-dars) sinovni deterministik qiladi: `t.Setenv` yoki global holat kerak emas. Joriy xato ro'yxati foydalanuvchiga bir ishga tushirishda hamma muammoni ko'rsatadi."
  - q: "CI'da `govulncheck ./...` (vuln-mgmt) nimani ko'rsatadi?"
    options:
      - "Bog'liqliklardagi barcha CVE'larni, ishlatilishidan qat'i nazar"
      - "Faqat go.mod'dagi eski versiyalarni"
      - "Zaiflik kodingizdan haqiqatan chaqirilishi mumkin bo'lgan funksiyalarda bo'lsa, shuni ko'rsatadi; bu shovqinni kamaytiradi"
      - "Faqat standart kutubxona zaifliklarini"
    answer: 2
    explain: "govulncheck Go zaifliklar bazasini kodingizning chaqiruv grafiga qarshi tekshiradi va ta'sir qiladigan zaifliklarni ajratadi (87-dars). Shu darsda asbob sandbox'da yuklanmagani uchun ishga tushirilmagan: CI konfiguratsiyasi faqat matn sifatida berilgan."
  - q: "`ReadyDrain >= ShutdownTimeout` konfiguratsiyasi nega xato hisoblanadi?"
    options:
      - "Shutdown'ga vaqt qolmaydi: umumiy to'xtash vaqtidan drain ayirilgach qoldiq nol yoki manfiy bo'ladi va ishlayotgan so'rovlar tugatilmaydi"
      - "Go bu qiymatlarni solishtirishga ruxsat bermaydi"
      - "Drain doim 5 soniya bo'lishi shart"
      - "Bu xato emas, faqat ogohlantirish"
    answer: 0
    explain: "app.Run Shutdown kontekstini `ShutdownTimeout - ReadyDrain` bilan yaratadi. Drain umumiy vaqtni yeb qo'ysa, kontekst darhol tugaydi. Shuning uchun config.Load buni boshlanishda tekshiradi (fail-fast)."
task:
  title: "Tartibli to'xtash: Close o'rniga readiness + Shutdown"
  prompt: |
    Dastur HTTP server ishga tushiradi, `stop` funksiyasi esa uni `srv.Close()` bilan to'xtatadi. Natijada uzoq davom etayotgan `/slow` so'rovi uziladi va `/readyz` o'zgarmaydi (load balancer trafikni yuborishda davom etadi).

    `stop(srv *http.Server, drain, timeout time.Duration) error` funksiyasini qayta yozing:

    - avval `ready` bayrog'ini `false` qiling (`/readyz` 503 qaytaradi);
    - `drain` davomida kuting (load balancer trafikni olib tashlaydi);
    - keyin `timeout` bilan kontekst yarating va `srv.Shutdown(ctx)` chaqiring, xatoni qaytaring.

    Lokal tekshirish: `go run .` da `/readyz` to'xtash paytida 503 qaytaradi va uzoq so'rov `200 tugadi` bilan tugaydi.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "io"
        "net"
        "net/http"
        "sync/atomic"
        "time"
    )

    var ready atomic.Bool

    func newServer() *http.Server {
        mux := http.NewServeMux()
        mux.HandleFunc("GET /slow", func(w http.ResponseWriter, _ *http.Request) {
            time.Sleep(200 * time.Millisecond)
            fmt.Fprint(w, "tugadi")
        })
        mux.HandleFunc("GET /readyz", func(w http.ResponseWriter, _ *http.Request) {
            if !ready.Load() {
                http.Error(w, "to'xtamoqda", http.StatusServiceUnavailable)
            }
        })
        return &http.Server{Handler: mux}
    }

    // stop serverni to'xtatadi. Muammo: Close ishlayotgan so'rovlarni uzib tashlaydi
    // va readiness o'zgarmaydi, shuning uchun load balancer trafikni yuborishda davom etadi.
    func stop(srv *http.Server) {
        srv.Close()
    }

    func main() {
        ln, _ := net.Listen("tcp", "127.0.0.1:0")
        ready.Store(true)
        srv := newServer()
        go srv.Serve(ln)
        base := "http://" + ln.Addr().String()

        res := make(chan string, 1)
        go func() {
            resp, err := http.Get(base + "/slow")
            if err != nil {
                res <- "xato"
                return
            }
            defer resp.Body.Close()
            b, _ := io.ReadAll(resp.Body)
            res <- fmt.Sprint(resp.StatusCode, " ", string(b))
        }()

        time.Sleep(50 * time.Millisecond)
        stop(srv)
        fmt.Println("uzoq so'rov natijasi:", <-res)
    }
  solution: |
    package main

    import (
        "context"
        "fmt"
        "io"
        "net"
        "net/http"
        "sync/atomic"
        "time"
    )

    var ready atomic.Bool

    func newServer() *http.Server {
        mux := http.NewServeMux()
        mux.HandleFunc("GET /slow", func(w http.ResponseWriter, _ *http.Request) {
            time.Sleep(200 * time.Millisecond)
            fmt.Fprint(w, "tugadi")
        })
        mux.HandleFunc("GET /readyz", func(w http.ResponseWriter, _ *http.Request) {
            if !ready.Load() {
                http.Error(w, "to'xtamoqda", http.StatusServiceUnavailable)
            }
        })
        return &http.Server{Handler: mux}
    }

    // stop: avval readiness o'chadi, drain kutiladi, keyin Shutdown ishlayotgan so'rovlarni tugatadi.
    func stop(srv *http.Server, drain, timeout time.Duration) error {
        ready.Store(false)
        time.Sleep(drain)
        ctx, cancel := context.WithTimeout(context.Background(), timeout)
        defer cancel()
        return srv.Shutdown(ctx)
    }

    func main() {
        ln, _ := net.Listen("tcp", "127.0.0.1:0")
        ready.Store(true)
        srv := newServer()
        go srv.Serve(ln)
        base := "http://" + ln.Addr().String()

        res := make(chan string, 1)
        go func() {
            resp, err := http.Get(base + "/slow")
            if err != nil {
                res <- "xato"
                return
            }
            defer resp.Body.Close()
            b, _ := io.ReadAll(resp.Body)
            res <- fmt.Sprint(resp.StatusCode, " ", string(b))
        }()

        time.Sleep(50 * time.Millisecond)
        done := make(chan error, 1)
        go func() { done <- stop(srv, 20*time.Millisecond, time.Second) }()

        time.Sleep(10 * time.Millisecond)
        resp, err := http.Get(base + "/readyz")
        if err == nil {
            fmt.Println("readyz to'xtash paytida:", resp.StatusCode)
            resp.Body.Close()
        }
        fmt.Println("uzoq so'rov natijasi:", <-res)
        fmt.Println("shutdown xatosi:", <-done)
    }
  solutionNotes: |
    - `Shutdown` yangi ulanishlarni qabul qilishni to'xtatadi va ishlayotgan so'rovlar tugashini kutadi, `Close` esa ularni uzadi. Lokal chiqish: starter `uzoq so'rov natijasi: xato`, yechim `200 tugadi` va `shutdown xatosi: <nil>`.
    - Readiness drain'dan oldin o'chadi: load balancer yangi so'rovlarni boshqa nusxaga yo'naltirishga ulguradi.
    - Kontekst `timeout` bilan cheklangan: ilib qolgan so'rov servisni abadiy ushlab turmaydi. Timeout tugasa, Shutdown kontekst xatosini qaytaradi.
    - Capstone'da shu naqsh `app.Run` ichida (public va admin serverlar uchun).
  checklist:
    - "`ready` bayrog'i drain'dan oldin `false` ga o'tadi"
    - "Drain davomida kutiladi, so'ng `Shutdown` chaqiriladi"
    - "Shutdown konteksti `timeout` bilan cheklangan va xato qaytariladi"
    - "Uzoq so'rov `200 tugadi` bilan tugaydi, `go vet` toza"
---

## Muammo

Kursning oxirgi darsi: oldingi 99 darsdagi qismlarni bitta servisga yig'amiz. Real loyihalarda dasturlar tilni bilmagani uchun emas, atrofdagi narsalar uchun yiqiladi: noto'g'ri sozlama jimgina qabul qilinadi, deploy paytida so'rovlar uzib tashlanadi, pprof tashqariga ochiq qoladi, panic butun jarayonni o'chiradi, access log'da qaysi marshrut ishlagani ko'rinmaydi, sinab bo'lmaydigan `main`. Bu hammasi algoritmik emas, "yopishtiruvchi" qatlam. 100 Go Mistakes shunday xatolarning ko'pini (context, HTTP server timeout'lari, `os.Exit`, xatolarni qayta ishlash) ro'yxatlaydi, va capstone shu ro'yxatga qarshi tekshirilgan.

Servisning vazifasi kichik, ataylab: avtopark monitoring platformasidan yoqilg'i datchigi o'qishlarini qabul qiladi (`POST /v1/vehicles/{id}/readings`) va mashinaning oxirgi o'qishini qaytaradi (`GET /v1/vehicles/{id}/last`). Domen sodda bo'lgani uchun e'tibor tuzilmaga va hayot siklida qoladi. Saqlash xotirada (35 satrlik adapter): SQL adapter xuddi shu interface'ni bajaradi, uni qanday yozishni 94, 95 va 97-darslarda ko'rdingiz va 78-darsda `database/sql` bilan.

## Asosiy g'oya

Servis beshta qatlamdan iborat, bog'liqlik faqat ichkariga qarab (91-dars):

- `config`: muhit o'zgaruvchilarini tekshirib `Config` qiladi.
- `domain`: tiplar va qoidalar; boshqa paketlarga bog'liq emas.
- `service`: ilova mantiqi; saqlashni o'zi e'lon qilgan kichik `Store` interface'i orqali ko'radi.
- `store`: adapter (xotira).
- `httpapi`: marshrutlar, DTO, xatolarni statusga aylantirish va middleware.

`app` paketi bularni yig'adi va hayot siklini boshqaradi, `cmd/fleetapi/main.go` esa faqat sozlamani o'qiydi, listener'larni ochadi va `app.Run` ga beradi. Daraxt:

```text
fleetapi/
  cmd/fleetapi/main.go          # composition root: run() error, signal.NotifyContext
  internal/config/              # Load(getenv), config_test.go
  internal/domain/              # Reading, NewReading, ErrInvalid, ErrNotFound
  internal/service/             # Service, Store interface, service_test.go
  internal/store/               # Memory (RWMutex)
  internal/httpapi/             # marshrutlar, middleware, Metrics
  internal/app/                 # Run: serverlar, readiness, graceful shutdown; app_test.go
```

Qarorlar va ularning sabablari:

- **`run() error`, `os.Exit` faqat `main`da** (91, 88-dars): `defer` lar ishlaydi, xato bir joyda log qilinadi.
- **Config fail-fast**: noto'g'ri qiymatlar boshlanishda `errors.Join` bilan hammasi birdan qaytariladi, servis yarim sozlangan holda ishga tushmaydi.
- **Xatolar chegarada tarjima qilinadi** (92-dars): `ErrInvalid` -> 422, `ErrNotFound` -> 404, kontekst muddati -> 504, qolgani -> 500 va mijozga umumiy xabar, logga to'liq xato.
- **Soat parametr**: `service.New(store, time.Now)`; sinov deterministik.
- **Admin port alohida**: `/healthz`, `/readyz`, `/metrics`, pprof `127.0.0.1:9090` da; public port tashqariga ochiladi.
- **Tartibli to'xtash** (88-dars): readiness 503, drain, ikkala serverni `Shutdown`.

## Chuqurroq: nozik joylar

### Middleware zanjiri va RouteCapture

`Chain(RouteCapture(mux), RequestID, Observe, Recover, Timeout)`: birinchi ro'yxatdagisi eng tashqi. So'rov `RequestID -> Observe -> Recover -> Timeout -> RouteCapture -> mux` yo'lidan o'tadi. Nega `RouteCapture` mux'dan tashqarida, lekin Timeout'dan ichkarida? Go 1.23 dan `Request.Pattern` maydoni mux tanlagan marshrutni beradi. `Timeout` esa `r.WithContext(ctx)` bilan so'rovning nusxasini yaratadi: mux marshrutni ichki nusxaga yozadi, tashqaridagi `Observe` o'z `r.Pattern`ida bo'sh qiymat ko'radi. Birinchi variantda access log'da route bo'sh chiqdi. Yechim: `RouteCapture` mux'ni o'rab, mux ishlaganidan keyin `r.Pattern` ni (shu nusxadan) o'rtadagi `statusWriter`ga yozadi; `Observe` uni loga qo'yadi. Bu nozik, shuning uchun test va ishga tushirish natijasida tekshirildi (pastda route maydoni to'g'ri).

`statusWriter` ham bitta: status kodi, access log va status sinfi bo'yicha sanagich uchun xizmat qiladi. Sanagich `Metrics` ichida `atomic.Int64`; Prometheus formatiga o'tish 85-darsda.

`Recover` panic'ni ushlaydi va 500 qaytaradi, lekin `http.ErrAbortHandler` ni qayta panic qiladi: net/http bu qiymatni maxsus ma'noda ishlatadi. Muhim cheklov: `Recover` faqat so'rov goroutine'idagi panic'ni ushlaydi. Handler ichida ochilgan goroutine'dagi panic jarayonni o'ldiradi (93-dars: supervisor).

### Server timeout'lari

`newServer` hamma timeout'larni belgilaydi: `ReadHeaderTimeout`, `ReadTimeout`, `WriteTimeout`, `IdleTimeout`. Standart `http.Server` ularni nolga (cheksiz) qoldiradi, bu sekin mijoz bilan resurs ushlab turishga yo'l ochadi. Eslatma kodda ham bor: pprof profili 30 soniyagacha davom etishi mumkin, shuning uchun productionda admin server uchun `WriteTimeout` alohida bo'lishi kerak (90-dars). Namunada ikkala server bitta konstruktor ishlatadi, bu soddalashtirish.

### Admin mux va pprof

`net/http/pprof` import qilinganda o'zini `http.DefaultServeMux`ga ulaydi. Biz DefaultServeMux'ni ishlatmaymiz va endpoint'larni admin mux'ga qo'lda ulaymiz (`pprof.Index`, `Profile`, `Trace`...). Lokal sinov: admin portda `/debug/pprof/cmdline` 200, public portda 404. Profilni olish `go tool pprof` bilan (diagnostics hujjati: CPU, heap, goroutine, block, mutex profillari va trace).

### Graceful shutdown tartibi

`app.Run`:

1. `ctx` bekor bo'lganda (SIGTERM yoki Ctrl-C, `signal.NotifyContext`) `ready.Store(false)`: `/readyz` 503 qaytara boshlaydi.
2. `ReadyDrain` kutiladi: load balancer yoki Kubernetes readiness probe'ni ko'rib, nusxani aylanmadan oladi. Bu yerda probe davri drain'dan kichik bo'lishi shart: aks holda drain foyda bermaydi. Mos qiymatni muhitingizdan oling (men bu raqamni o'lchamadim).
3. `Shutdown(ctx)` ikkala serverda; kontekst vaqti `ShutdownTimeout - ReadyDrain`. Bu ayirma sababli config `ReadyDrain >= ShutdownTimeout` ni rad etadi.
4. `errors.Join` bilan xatolar yig'iladi, `wg.Wait()` serve goroutine'lar tugaganini kutadi.

Taqqoslash uchun topshiriq: `Close` ishlayotgan so'rovni uzadi, `Shutdown` tugashini kutadi. `Shutdown` WebSocket kabi hijack qilingan ulanishlarni kutmaydi: bunday ulanishlar uchun alohida bildirish kerak (bu namunada yo'q).

## Misol: kod

Kirish nuqtasi:

```go
// Command fleetapi - yoqilg'i o'qishlari servisi.
package main

import (
	"context"
	"fmt"
	"log/slog"
	"net"
	"os"
	"os/signal"
	"runtime/debug"
	"syscall"

	"example.com/fleetapi/internal/app"
	"example.com/fleetapi/internal/config"
)

func main() {
	log := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	if err := run(log); err != nil {
		log.Error("servis to'xtadi", "err", err)
		os.Exit(1)
	}
}

func run(log *slog.Logger) error {
	cfg, err := config.Load(os.Getenv)
	if err != nil {
		return fmt.Errorf("sozlama: %w", err)
	}
	if bi, ok := debug.ReadBuildInfo(); ok {
		log.Info("build", "go", bi.GoVersion, "module", bi.Main.Path)
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	pub, err := net.Listen("tcp", cfg.Addr)
	if err != nil {
		return err
	}
	admin, err := net.Listen("tcp", cfg.AdminAddr)
	if err != nil {
		return err
	}
	return app.Run(ctx, cfg, log, pub, admin)
}
```

Config:

```go
// Package config muhit o'zgaruvchilaridan sozlamalarni o'qiydi va tekshiradi.
package config

import (
	"errors"
	"fmt"
	"time"
)

type Config struct {
	Addr            string        // public API
	AdminAddr       string        // healthz, readyz, metrics, pprof
	ShutdownTimeout time.Duration // graceful shutdown uchun umumiy vaqt
	ReadyDrain      time.Duration // readyz 503 ga o'tgach, serverni yopishdan oldingi kutish
	RequestTimeout  time.Duration
	MaxBodyBytes    int64
}

// Load getenv funksiyasini oladi (os.Getenv yoki sinov uchun map), shuning uchun testda global holat kerak emas.
func Load(getenv func(string) string) (Config, error) {
	var errs []error
	str := func(key, def string) string {
		if v := getenv(key); v != "" {
			return v
		}
		return def
	}
	dur := func(key string, def time.Duration) time.Duration {
		v := getenv(key)
		if v == "" {
			return def
		}
		d, err := time.ParseDuration(v)
		if err != nil || d < 0 {
			errs = append(errs, fmt.Errorf("%s=%q: musbat davomiylik kerak (masalan 5s)", key, v))
			return def
		}
		return d
	}
	c := Config{
		Addr:            str("FLEET_ADDR", ":8080"),
		AdminAddr:       str("FLEET_ADMIN_ADDR", "127.0.0.1:9090"),
		ShutdownTimeout: dur("FLEET_SHUTDOWN_TIMEOUT", 20*time.Second),
		ReadyDrain:      dur("FLEET_READY_DRAIN", 5*time.Second),
		RequestTimeout:  dur("FLEET_REQUEST_TIMEOUT", 3*time.Second),
		MaxBodyBytes:    1 << 20,
	}
	if c.ReadyDrain >= c.ShutdownTimeout {
		errs = append(errs, errors.New("FLEET_READY_DRAIN FLEET_SHUTDOWN_TIMEOUT dan kichik bo'lishi kerak"))
	}
	return c, errors.Join(errs...)
}
```

Domen:

```go
// Package domain - biznes tiplari va qoidalari. Boshqa paketlarga bog'liq emas.
package domain

import (
	"errors"
	"fmt"
	"time"
)

var (
	ErrInvalid  = errors.New("yaroqsiz ma'lumot")
	ErrNotFound = errors.New("topilmadi")
)

type Reading struct {
	VehicleID string
	Liters    float64
	At        time.Time
}

// NewReading yaroqsiz Reading yaratib bo'lmasligini ta'minlaydi.
func NewReading(vehicleID string, liters float64, at, now time.Time) (Reading, error) {
	switch {
	case vehicleID == "" || len(vehicleID) > 32:
		return Reading{}, fmt.Errorf("%w: vehicle_id 1-32 belgi", ErrInvalid)
	case liters < 0 || liters > 2000:
		return Reading{}, fmt.Errorf("%w: liters 0..2000 oralig'ida emas", ErrInvalid)
	case at.IsZero() || at.After(now.Add(5*time.Minute)):
		return Reading{}, fmt.Errorf("%w: at bo'sh yoki kelajakda", ErrInvalid)
	}
	return Reading{VehicleID: vehicleID, Liters: liters, At: at}, nil
}
```

Service:

```go
// Package service - ilova mantig'i. Saqlashni o'zi e'lon qilgan kichik interface orqali ko'radi.
package service

import (
	"context"
	"fmt"
	"time"

	"example.com/fleetapi/internal/domain"
)

type Store interface {
	Save(ctx context.Context, r domain.Reading) error
	Last(ctx context.Context, vehicleID string) (domain.Reading, error)
}

type Service struct {
	store Store
	now   func() time.Time
}

func New(store Store, now func() time.Time) *Service { return &Service{store: store, now: now} }

func (s *Service) Record(ctx context.Context, vehicleID string, liters float64, at time.Time) (domain.Reading, error) {
	r, err := domain.NewReading(vehicleID, liters, at, s.now())
	if err != nil {
		return domain.Reading{}, err
	}
	if err := s.store.Save(ctx, r); err != nil {
		return domain.Reading{}, fmt.Errorf("record %s: %w", vehicleID, err)
	}
	return r, nil
}

func (s *Service) Last(ctx context.Context, vehicleID string) (domain.Reading, error) {
	return s.store.Last(ctx, vehicleID)
}
```

Xotiradagi saqlash:

```go
// Package store - saqlash adapterlari. Hozir faqat xotiradagi; SQL adapter xuddi shu interface'ni bajaradi.
package store

import (
	"context"
	"sync"

	"example.com/fleetapi/internal/domain"
)

type Memory struct {
	mu   sync.RWMutex
	last map[string]domain.Reading
}

func NewMemory() *Memory { return &Memory{last: map[string]domain.Reading{}} }

func (m *Memory) Save(_ context.Context, r domain.Reading) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	if cur, ok := m.last[r.VehicleID]; !ok || r.At.After(cur.At) {
		m.last[r.VehicleID] = r
	}
	return nil
}

func (m *Memory) Last(_ context.Context, vehicleID string) (domain.Reading, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	r, ok := m.last[vehicleID]
	if !ok {
		return domain.Reading{}, domain.ErrNotFound
	}
	return r, nil
}
```

HTTP chegarasi:

```go
// Package httpapi - HTTP chegarasi: marshrutlar, DTO'lar, xatolarni statusga aylantirish.
package httpapi

import (
	"context"
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"time"

	"example.com/fleetapi/internal/domain"
)

type API interface {
	Record(ctx context.Context, vehicleID string, liters float64, at time.Time) (domain.Reading, error)
	Last(ctx context.Context, vehicleID string) (domain.Reading, error)
}

type readingDTO struct {
	VehicleID string    `json:"vehicle_id"`
	Liters    float64   `json:"liters"`
	At        time.Time `json:"at"`
}

func toDTO(r domain.Reading) readingDTO { return readingDTO{r.VehicleID, r.Liters, r.At} }

type Options struct {
	MaxBody        int64
	RequestTimeout time.Duration
	Log            *slog.Logger
	Metrics        *Metrics
}

func New(api API, o Options) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /v1/vehicles/{id}/readings", func(w http.ResponseWriter, r *http.Request) {
		var in struct {
			Liters float64   `json:"liters"`
			At     time.Time `json:"at"`
		}
		r.Body = http.MaxBytesReader(w, r.Body, o.MaxBody)
		if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "yaroqsiz JSON"})
			return
		}
		rd, err := api.Record(r.Context(), r.PathValue("id"), in.Liters, in.At)
		if err != nil {
			writeError(w, r, o.Log, err)
			return
		}
		writeJSON(w, http.StatusCreated, toDTO(rd))
	})
	mux.HandleFunc("GET /v1/vehicles/{id}/last", func(w http.ResponseWriter, r *http.Request) {
		rd, err := api.Last(r.Context(), r.PathValue("id"))
		if err != nil {
			writeError(w, r, o.Log, err)
			return
		}
		writeJSON(w, http.StatusOK, toDTO(rd))
	})
	return Chain(RouteCapture(mux), RequestID, Observe(o.Log, o.Metrics), Recover(o.Log), Timeout(o.RequestTimeout))
}

func writeError(w http.ResponseWriter, r *http.Request, log *slog.Logger, err error) {
	switch {
	case errors.Is(err, domain.ErrInvalid):
		writeJSON(w, http.StatusUnprocessableEntity, map[string]string{"error": err.Error()})
	case errors.Is(err, domain.ErrNotFound):
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "topilmadi"})
	case errors.Is(err, context.DeadlineExceeded):
		writeJSON(w, http.StatusGatewayTimeout, map[string]string{"error": "vaqt tugadi"})
	default:
		log.ErrorContext(r.Context(), "ichki xato", "err", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "ichki xato"})
	}
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}
```

Middleware:

```go
package httpapi

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"log/slog"
	"net/http"
	"sync/atomic"
	"time"
)

type Middleware func(http.Handler) http.Handler

// Chain: Chain(h, a, b) -> a(b(h)); birinchisi eng tashqi.
func Chain(h http.Handler, mws ...Middleware) http.Handler {
	for i := len(mws) - 1; i >= 0; i-- {
		h = mws[i](h)
	}
	return h
}

type ctxKey struct{}

func RequestIDFrom(ctx context.Context) string { s, _ := ctx.Value(ctxKey{}).(string); return s }

func RequestID(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := r.Header.Get("X-Request-ID")
		if id == "" || len(id) > 64 {
			b := make([]byte, 8)
			rand.Read(b)
			id = hex.EncodeToString(b)
		}
		w.Header().Set("X-Request-ID", id)
		next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), ctxKey{}, id)))
	})
}

// statusWriter status kodini eslab qoladi.
type statusWriter struct {
	http.ResponseWriter
	status int
	route  string
}

func (w *statusWriter) WriteHeader(code int) {
	w.status = code
	w.ResponseWriter.WriteHeader(code)
}

func Recover(log *slog.Logger) Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if v := recover(); v != nil {
					if v == http.ErrAbortHandler {
						panic(v) // net/http o'zi qayta ishlaydi
					}
					log.ErrorContext(r.Context(), "panic", "value", v)
					http.Error(w, "ichki xato", http.StatusInternalServerError)
				}
			}()
			next.ServeHTTP(w, r)
		})
	}
}

// Observe bitta statusWriter bilan ham access log, ham sanagichni yuritadi.
func Observe(log *slog.Logger, m *Metrics) Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			sw := &statusWriter{ResponseWriter: w, status: http.StatusOK}
			start := time.Now()
			next.ServeHTTP(sw, r)
			if c := sw.status / 100; c >= 1 && c <= 5 {
				m.byClass[c].Add(1)
			}
			log.InfoContext(r.Context(), "request",
				"id", RequestIDFrom(r.Context()), "method", r.Method, "route", sw.route,
				"status", sw.status, "ms", time.Since(start).Milliseconds())
		})
	}
}

// RouteCapture mux atrofida turadi va tanlangan marshrutni (r.Pattern) statusWriter'ga yozadi.
// Sabab: Timeout kabi middleware r.WithContext bilan so'rov nusxasini yaratadi va tashqi qatlam
// o'z r.Pattern'ida mux qo'ygan qiymatni ko'rmaydi.
func RouteCapture(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		next.ServeHTTP(w, r)
		if sw, ok := w.(*statusWriter); ok {
			sw.route = r.Pattern
		}
	})
}

func Timeout(d time.Duration) Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx, cancel := context.WithTimeout(r.Context(), d)
			defer cancel()
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// Metrics - status sinflari bo'yicha sanagich (Prometheus'ga o'tish: 85-dars).
type Metrics struct{ byClass [6]atomic.Int64 }

func (m *Metrics) Snapshot() map[string]int64 {
	out := map[string]int64{}
	for c := 1; c <= 5; c++ {
		out[string(rune('0'+c))+"xx"] = m.byClass[c].Load()
	}
	return out
}

func (m *Metrics) Handler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(m.Snapshot())
	})
}
```

Hayot sikli:

```go
// Package app servislarni yig'adi va hayot siklini boshqaradi (composition root yordamchisi).
package app

import (
	"context"
	"errors"
	"log/slog"
	"net"
	"net/http"
	"net/http/pprof"
	"sync"
	"sync/atomic"
	"time"

	"example.com/fleetapi/internal/config"
	"example.com/fleetapi/internal/httpapi"
	"example.com/fleetapi/internal/service"
	"example.com/fleetapi/internal/store"
)

// Run public va admin serverlarni ishga tushiradi. ctx bekor bo'lganda tartibli to'xtatadi:
// readyz -> 503, ReadyDrain kutish, ikkala serverni Shutdown qilish.
func Run(ctx context.Context, cfg config.Config, log *slog.Logger, pub, admin net.Listener) error {
	metrics := &httpapi.Metrics{}
	svc := service.New(store.NewMemory(), time.Now)
	api := httpapi.New(svc, httpapi.Options{
		MaxBody: cfg.MaxBodyBytes, RequestTimeout: cfg.RequestTimeout, Log: log, Metrics: metrics,
	})

	var ready atomic.Bool
	ready.Store(true)
	pubSrv := newServer(api)
	adminSrv := newServer(adminMux(&ready, metrics))

	errc := make(chan error, 2)
	var wg sync.WaitGroup
	for _, s := range []struct {
		srv *http.Server
		ln  net.Listener
	}{{pubSrv, pub}, {adminSrv, admin}} {
		wg.Add(1)
		go func() {
			defer wg.Done()
			if err := s.srv.Serve(s.ln); !errors.Is(err, http.ErrServerClosed) {
				errc <- err
			}
		}()
	}
	log.Info("ishga tushdi", "addr", pub.Addr().String(), "admin", admin.Addr().String())

	var runErr error
	select {
	case runErr = <-errc: // server kutilmaganda yiqildi
	case <-ctx.Done():
	}

	// 1. Load balancer trafikni olib tashlashi uchun readiness'ni o'chiramiz.
	ready.Store(false)
	time.Sleep(cfg.ReadyDrain)
	// 2. Yangi ulanishlarni to'xtatib, ishlayotgan so'rovlarni tugatamiz.
	shutCtx, cancel := context.WithTimeout(context.Background(), cfg.ShutdownTimeout-cfg.ReadyDrain)
	defer cancel()
	runErr = errors.Join(runErr, pubSrv.Shutdown(shutCtx), adminSrv.Shutdown(shutCtx))
	wg.Wait()
	log.Info("to'xtatildi")
	return runErr
}

func newServer(h http.Handler) *http.Server {
	return &http.Server{
		Handler:           h,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      30 * time.Second, // pprof profile 30s gacha davom etishi mumkin: productionda admin uchun alohida qiymat
		IdleTimeout:       60 * time.Second,
	}
}

// adminMux alohida portda: pprof va metrikalar tashqariga ochilmaydi.
func adminMux(ready *atomic.Bool, m *httpapi.Metrics) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) { w.WriteHeader(http.StatusOK) })
	mux.HandleFunc("GET /readyz", func(w http.ResponseWriter, _ *http.Request) {
		if !ready.Load() {
			http.Error(w, "to'xtamoqda", http.StatusServiceUnavailable)
			return
		}
		w.WriteHeader(http.StatusOK)
	})
	mux.Handle("GET /metrics", m.Handler())
	// net/http/pprof import qilinganda DefaultServeMux'ga o'zini ulaydi; biz uni ishlatmaymiz,
	// endpoint'larni faqat admin mux'ga qo'lda ulaymiz.
	mux.HandleFunc("/debug/pprof/", pprof.Index)
	mux.HandleFunc("/debug/pprof/cmdline", pprof.Cmdline)
	mux.HandleFunc("/debug/pprof/profile", pprof.Profile)
	mux.HandleFunc("/debug/pprof/symbol", pprof.Symbol)
	mux.HandleFunc("/debug/pprof/trace", pprof.Trace)
	return mux
}
```

### Sinovlar

`go vet`, `gofmt -l` va `go test -race` lokal ishga tushirildi (Go 1.24.7, linux/amd64):

```text
gofmt: toza
vet: toza
?   	example.com/fleetapi/cmd/fleetapi	[no test files]
ok  	example.com/fleetapi/internal/app	1.127s
ok  	example.com/fleetapi/internal/config	1.012s
?   	example.com/fleetapi/internal/domain	[no test files]
?   	example.com/fleetapi/internal/httpapi	[no test files]
ok  	example.com/fleetapi/internal/service	1.012s
?   	example.com/fleetapi/internal/store	[no test files]
```

`TestLifecycle` butun servisni xotirada ko'taradi (ikkita listener `:0` da), so'rovlar yuboradi, `ctx` ni bekor qilib SIGTERM'ni taqlid qiladi va natijalarni jurnalga yozadi:

```text
=== RUN   TestLifecycle
app_test.go:49: POST readings: 201
app_test.go:52: GET last: 200 {"vehicle_id":"truck-7","liters":182.5,"at":"2026-11-03T07:59:47Z"}
app_test.go:54: GET noma'lum: 404
app_test.go:56: readyz (ishlayapti): 200
app_test.go:58: metrics: 200 {"1xx":0,"2xx":2,"3xx":0,"4xx":1,"5xx":0}
app_test.go:60: pprof (admin): 200
app_test.go:62: pprof (public): 404
app_test.go:67: readyz (to'xtash boshlangach): 503
app_test.go:71: Run qaytdi: err=<nil>
--- PASS: TestLifecycle (0.11s)
PASS
ok  	example.com/fleetapi/internal/app	1.129s
```

### Binary smoke-test

Haqiqiy binary qurilib, shell skripti bilan ishga tushirildi: so'rovlar, SIGTERM va noto'g'ri sozlama. Vaqt tamg'alari va `id` har ishga tushirishda boshqacha:

```text
--- POST:
{"vehicle_id":"truck-7","liters":182.5,"at":"2026-11-03T07:59:49Z"}
 [201]
--- POST yaroqsiz (liters=-1):
{"error":"yaroqsiz ma'lumot: liters 0..2000 oralig'ida emas"}
 [422]
--- GET last:
{"vehicle_id":"truck-7","liters":182.5,"at":"2026-11-03T07:59:49Z"}
 [200]
--- metrics:
{"1xx":0,"2xx":2,"3xx":0,"4xx":1,"5xx":0}
--- SIGTERM chiqish kodi: 0
--- log:
{"time":"2026-11-03T13:00:49.234140601+05:00","level":"INFO","msg":"build","go":"go1.24.7","module":"example.com/fleetapi"}
{"time":"2026-11-03T13:00:49.23499966+05:00","level":"INFO","msg":"ishga tushdi","addr":"127.0.0.1:18080","admin":"127.0.0.1:19090"}
{"time":"2026-11-03T13:00:49.743645827+05:00","level":"INFO","msg":"request","id":"d38ec2eb9a070d6f","method":"POST","route":"POST /v1/vehicles/{id}/readings","status":201,"ms":0}
{"time":"2026-11-03T13:00:49.754138704+05:00","level":"INFO","msg":"request","id":"d3e4dcac259fdcb6","method":"POST","route":"POST /v1/vehicles/{id}/readings","status":422,"ms":0}
{"time":"2026-11-03T13:00:49.764939617+05:00","level":"INFO","msg":"request","id":"b5d872e5f6a32c7f","method":"GET","route":"GET /v1/vehicles/{id}/last","status":200,"ms":0}
{"time":"2026-11-03T13:00:49.982147225+05:00","level":"INFO","msg":"to'xtatildi"}
--- noto'g'ri sozlama:
{"time":"2026-11-03T13:00:49.991481043+05:00","level":"ERROR","msg":"servis to'xtadi","err":"sozlama: FLEET_READY_DRAIN=\"abc\": musbat davomiylik kerak (masalan 5s)\nFLEET_READY_DRAIN FLEET_SHUTDOWN_TIMEOUT dan kichik bo'lishi kerak"}
chiqish kodi: 1
```

Nimaga e'tibor bering: yaroqsiz o'qish 422 va domen xabari bilan, oxirgi log qatorlarida route to'g'ri (`POST /v1/vehicles/{id}/readings`), SIGTERM'dan keyin chiqish kodi 0, `to'xtatildi` log'i drain (200 ms) o'tgach yozilgan. Oxirgi blokda ikkita sozlama xatosi bor: skriptda `FLEET_SHUTDOWN_TIMEOUT=2s`, `FLEET_READY_DRAIN=abc` nosoz, shuning uchun standart drain (5s) timeout'dan katta chiqdi va ikkinchi xabar ham qaytdi. Bu `errors.Join` ning ishlashi: bitta urinishda hamma muammo ko'rinadi. Chiqish kodi 1.

### Build, Docker, CI: kompilyatsiya qilinmagan / ishga tushirilmagan

Quyidagi fayllar matn sifatida beriladi. Men ularni sandbox'da ishga tushirmadim: `govulncheck` o'rnatilmagan va tashqi tarmoq cheklangan, Docker tasviri qurilmagan. Ulardagi har bir qator o'z muhitingizda tekshiriladi.

`Makefile`:

```text
.PHONY: test lint build vuln
test:
	go test -race -count=1 ./...
lint:
	gofmt -l . && go vet ./...
build:
	CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o bin/fleetapi ./cmd/fleetapi
vuln:
	go run golang.org/x/vuln/cmd/govulncheck@latest ./...
```

`Dockerfile` (ko'p bosqichli; bu darsdagi binary hajmlari: oddiy build 9 745 702 bayt, `-s -w` bilan 6 648 100 bayt):

```text
FROM golang:1.24 AS build
WORKDIR /src
COPY go.mod ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/fleetapi ./cmd/fleetapi

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /out/fleetapi /fleetapi
EXPOSE 8080
ENTRYPOINT ["/fleetapi"]
```

GitHub Actions (`.github/workflows/ci.yml`):

```text
name: ci
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version-file: go.mod
      - run: gofmt -l . | (! grep .)
      - run: go vet ./...
      - run: go test -race -count=1 ./...
      - run: go run golang.org/x/vuln/cmd/govulncheck@latest ./...
```

govulncheck Go zaifliklar bazasini kodingizning chaqiruv grafiga qarshi tekshiradi va ta'sir qiladiganlarini ajratadi (87-dars; vuln-mgmt hujjati). CI'da `@latest` o'rniga aniq versiya yozish takrorlanuvchanlikni oshiradi (98-dars: `tool` direktivasi shu uchun).

## Qachon qo'llamaslik kerak

- Bu servis kichik bir pattern, shablon emas. Uchta endpoint uchun besh qatlam ortiqcha ko'rinishi mumkin. Haqiqiy kichik skript yoki ichki asbob uchun `main` ichidagi bitta fayl yetarli; qatlamlar servis o'sganda va jamoa kengayganda oqlanadi (91-dars).
- `internal/` bo'linishi kutubxonaga kerak emas; uni tashqaridan import qilmaslik uchun ishlatamiz. Bir modulda bir servis bo'lsa, chuqur daraxt ham ortiqcha.
- Xotiradagi `store` real saqlash emas: jarayon qayta ishga tushsa ma'lumot yo'qoladi va bir nechta nusxada har biri o'zinikini ko'radi. Production uchun SQL adapter kerak (78, 97-dars); u ham `service.Store` interface'ini bajaradi, shuning uchun service o'zgarmaydi.
- `Metrics` oddiy JSON hisoblagichi, Prometheus emas. Haqiqiy servisda 85-dars. Tracing (86-dars) ham namunada yo'q.
- Drain kutish (`time.Sleep`) sodda va deterministik, lekin load balancer qanday ishlashini bilmasdan qiymat tanlab bo'lmaydi. Ba'zi muhitlarda (masalan, orkestrator trafikni o'zi to'xtatadigan) drain kerak emas bo'lishi mumkin. Bu muallifning tajribaviy bahosi, tekshirilgan raqam emas.
- `Recover` middleware dasturiy xatolarni yashirmasligi kerak: panic loglanadi, lekin tez-tez bo'lsa, buni signal sifatida ko'ring, normal holat sifatida emas.
- `govulncheck` zaiflik topmasa, bu xavfsizlik kafolati emas: u faqat ma'lum, bazaga kiritilgan zaifliklarni ko'radi.

## Stack'da: Node.js/NestJS'dan farq

NestJS'da bu qatlamlarning ko'pi framework tomonidan beriladi: modullar, DI konteyneri, guard/interceptor/pipe, ConfigModule, health checks (`@nestjs/terminus`), graceful shutdown hook'lari. Go'da ular kod: har biri 20-100 qator, ko'rinadigan va sinab ko'riladigan. Mapping:

- `ConfigModule` + validatsiya -> `config.Load(getenv)` va `errors.Join`.
- Interceptor/guard -> `Middleware` (`func(http.Handler) http.Handler`).
- Exception filter -> `writeError` bitta joyda: `errors.Is` bilan tasnif.
- `enableShutdownHooks` -> `signal.NotifyContext` + `Shutdown`.
- Terminus health -> `/healthz` (jarayon tirik) va `/readyz` (trafik qabul qila oladi). Ikkalasini ajratish muhim: liveness xato bo'lsa konteyner qayta ishga tushadi, readiness xato bo'lsa faqat trafik to'xtatiladi.

Farq: Go'da "sehr" kam, shuning uchun qaror ko'proq jamoaga tegishli. Bu ham afzallik (hamma narsa kodda), ham xarajat (bir xil qoliplarni o'zingiz saqlaysiz). Til tanlash haqida 99-darsga qarang.

## Xulosa

- Servis `config -> domain -> service -> store/httpapi -> app -> main` qatlamlari bilan yig'iladi; bog'liqlik ichkariga yo'naladi va `main` kichik, `run() error` qaytaradi.
- Sozlama boshlanishda tekshiriladi (`getenv` parametr, `errors.Join`); xatolar chegarada statusga tarjima qilinadi, ichki tafsilot mijozga chiqmaydi.
- Middleware tartibi muhim: `Timeout` so'rov nusxasini yaratgani uchun marshrutni `RouteCapture` bilan olish kerak edi; `Recover` faqat so'rov goroutine'idagi panic'ni ushlaydi.
- pprof va metrikalar alohida admin portda; readiness (503) va drain `Shutdown` dan oldin keladi, `Close` so'rovlarni uzadi.
- Tekshirilgan: `go vet`, `gofmt`, `go test -race` va haqiqiy binary smoke-testi. Tekshirilmagan: Dockerfile, Makefile, CI, `govulncheck` (matn sifatida).
- Kurs shu yerda tugaydi: keyingi qadam o'z servisingizda shu qoliplarni qo'llash, profil bilan o'lchash va qarorni raqamlarga tayanib qabul qilish.
