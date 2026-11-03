---
n: 85
slug: prometheus-metrikalar
title: "Metrikalar: Prometheus"
summary: "Counter, gauge va histogram farqi, label kardinalligi va route yorlig'i uchun ServeMux namunasi, Prometheus matn formati, client_golang bilan instrumentatsiya va runtime/metrics orqali Go runtime holati."
duration: 40
sources:
  - id: prometheus-client
    note: "Counter, Gauge, Histogram turlari, Vec (label'li) variantlari, Registry va metrika tavsifi; quyidagi client_golang kodi shu hujjatga tayanadi"
  - id: pkg-runtime-metrics
    note: "Sample, Read, All, Description (Cumulative) va metrika nomlari formati"
  - id: diagnostics
    note: "Metrikalar va profilling/tracing orasidagi farq (diagnostika vositalari tasnifi)"
quiz:
  - q: "Servis uchun `http_requests_total` hisoblagichi bor va process qayta ishga tushdi. Prometheus grafigida nima ko'rinadi va qanday so'rov bilan to'g'ri o'qiladi?"
    options:
      - "Counter nolga tushadi (reset); trend uchun `rate()` yoki `increase()` ishlatiladi, ular reset'ni hisobga oladi"
      - "Qiymat uzilishsiz o'sishda davom etadi; `sum()` yetarli"
      - "Counter eski qiymatni disk'dan tiklaydi"
      - "Prometheus metrikani o'chiradi va qayta yaratadi"
    answer: 0
    explain: "Counter faqat o'sadi va faqat process xotirasida yashaydi. Qayta ishga tushganda nolga qaytadi. Prometheus funksiyalari rate/increase reset'ni aniqlab, uni to'g'rilaydi. Shuning uchun counter'ning xom qiymati hech qachon grafikka qo'yilmaydi."
  - q: "HTTP middleware'da `route` yorlig'i `r.URL.Path` dan olindi (`/devices/T-101`, `/devices/T-102`, ...). Nima bo'ladi?"
    options:
      - "Hech narsa: label qiymatlari bepul"
      - "Faqat 404 javoblar uchun muammo bo'ladi"
      - "Prometheus bir xil prefikslarni avtomatik birlashtiradi"
      - "Har yangi qurilma yangi time series hosil qiladi; seriyalar soni cheksiz o'sib, xotira va Prometheus narxi portlaydi"
    answer: 3
    explain: "Har noyob label kombinatsiyasi alohida time series. Cheksiz qiymatli label (user id, device id, xom yo'l) kardinallik portlashiga olib keladi, bu aniq o'lchangan: misolimizda 1000 qurilma + 50 begona yo'l = 1050 seriya, namuna (`r.Pattern`) bilan esa 2 ta. Qurilma bo'yicha tahlil kerak bo'lsa, log yoki trace ishlating."
  - q: "Histogram `le` bucket'lari kumulyativmi?"
    options:
      - "Yo'q, har bucket faqat o'z oralig'idagi kuzatuvlar sonini beradi"
      - "Ha, `le=\"0.1\"` bucket'i qiymati 0.1 dan kichik yoki teng barcha kuzatuvlarni o'z ichiga oladi; `+Inf` bucket'i `_count` ga teng"
      - "Faqat Summary kumulyativ"
      - "Bu client sozlamasiga bog'liq"
    answer: 1
    explain: "Prometheus matn formatida bucket'lar kumulyativ (less than or equal). Bizning mini-registrda ichki hisoblagich har oraliq uchun alohida, chiqarishda esa yig'ib yoziladi. +Inf bucket jami kuzatuvlar soniga teng, _count bilan bir xil."
  - q: "Latency uchun histogram bucket'lari jamoa tomonidan `prometheus.DefBuckets` bilan qoldirildi, lekin sizning API'ingiz odatda 1-3 millisekundda javob beradi. Qanday xavf bor?"
    options:
      - "Xavf yo'q, DefBuckets universal"
      - "Histogram umuman ishlamaydi"
      - "Hamma kuzatuvlar eng pastki bucket'ga tushadi, kvantil bahosi (histogram_quantile) bucket chegarasiga yaxlitlangani uchun juda qo'pol bo'ladi"
      - "Kardinallik oshadi"
    answer: 2
    explain: "DefBuckets 5 ms dan 10 s gacha umumiy diapazon uchun. Hamma kuzatuv 5 ms dan past bo'lsa, ular bitta bucket'da, kvantil esa bucket ichida interpolyatsiya qilingani uchun ma'nosiz. Bucket'larni o'z latency taqsimotingizga moslang."
  - q: "`runtime/metrics` dagi `/sched/goroutines:goroutines` metrikasi qanday turdagi qiymat beradi va nima uchun gauge deb hisoblanadi?"
    options:
      - "Uint64; Description.Cumulative=false, ya'ni qiymat oshishi ham, kamayishi ham mumkin"
      - "Float64Histogram, chunki goroutine'lar taqsimlanadi"
      - "Uint64; Cumulative=true, ya'ni faqat o'sadi"
      - "String, goroutine nomlari ro'yxati"
    answer: 0
    explain: "Tekshirdik: bu metrika uint64, Cumulative=false (goroutine yaratilishi va tugashi bilan o'zgaradi). Cumulative=true bo'lganlar (masalan, /sched/latencies:seconds) faqat o'sadi va ular uchun rate hisoblanadi."
  - q: "/metrics endpoint'ini asosiy ommaviy portda (8080) ochish va mijoz trafigi bilan aralashtirish nega tavsiya qilinmaydi?"
    options:
      - "Prometheus faqat 9090 portga ulana oladi"
      - "Go bitta process'da ikki handler'ni qo'llab-quvvatlamaydi"
      - "/metrics ko'p CPU sarflaydi"
      - "Metrikalar ichki tafsilot (route, versiya, resurs holati) oshkor qiladi va tashqaridan ochiq bo'lmasligi kerak; ichki port yoki tarmoq cheklovi xavfsizroq"
    answer: 3
    explain: "Metrika endpoint'i autentifikatsiyasiz bo'ladi va servisning ichki tuzilishini ko'rsatadi. Odatda alohida ichki portda yoki tarmoq/ingress qoidalari bilan yopiq holda xizmat qilinadi. Prometheus istalgan portdan o'qiy oladi va Go bir process ichida bir nechta server ishlata oladi, shuning uchun bu cheklovlar yo'q."
task:
  title: "Yorliq kardinalligini cheklash"
  prompt: |
    Quyidagi middleware har so'rov uchun `route` yorlig'ini `r.URL.Path` dan oladi. Dastur 1000 ta qurilma so'rovi va 50 ta begona (skaner) yo'l yuboradi va seriyalar sonini chiqaradi.

    Vazifa: middleware'ni shunday o'zgartiringki, `route` yorlig'i `ServeMux` namunasidan (`r.Pattern`) olinsin; mos namuna bo'lmagan so'rovlar (404) bitta `noma'lum` seriyaga tushsin. Dastur 2 seriya chiqarishi kerak. Imzolar o'zgarmasin.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "net/http"
        "net/http/httptest"
        "sort"
        "sync"
    )

    // counter - "route" yorlig'i bo'yicha so'rovlarni sanaydigan oddiy hisoblagich.
    type counter struct {
        mu     sync.Mutex
        series map[string]int
    }

    func (c *counter) inc(route string) {
        c.mu.Lock()
        defer c.mu.Unlock()
        c.series[route]++
    }

    func instrument(c *counter, next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            next.ServeHTTP(w, r)
            c.inc(r.URL.Path) // muammo: route yorlig'i xom yo'l
        })
    }

    func main() {
        c := &counter{series: map[string]int{}}
        mux := http.NewServeMux()
        mux.HandleFunc("GET /devices/{id}", func(w http.ResponseWriter, r *http.Request) {
            fmt.Fprintln(w, "ok")
        })
        h := instrument(c, mux)

        for i := 0; i < 1000; i++ {
            h.ServeHTTP(httptest.NewRecorder(), httptest.NewRequest(http.MethodGet, fmt.Sprintf("/devices/T-%d", i), nil))
        }
        for i := 0; i < 50; i++ {
            h.ServeHTTP(httptest.NewRecorder(), httptest.NewRequest(http.MethodGet, fmt.Sprintf("/wp-admin/%d.php", i), nil))
        }

        keys := make([]string, 0, len(c.series))
        for k := range c.series {
            keys = append(keys, k)
        }
        sort.Strings(keys)
        fmt.Println("seriyalar soni:", len(keys))
        for _, k := range keys {
            if len(keys) <= 5 {
                fmt.Println(k, c.series[k])
            }
        }
    }
  solution: |
    package main

    import (
        "fmt"
        "net/http"
        "net/http/httptest"
        "sort"
        "sync"
    )

    // counter - "route" yorlig'i bo'yicha so'rovlarni sanaydigan oddiy hisoblagich.
    type counter struct {
        mu     sync.Mutex
        series map[string]int
    }

    func (c *counter) inc(route string) {
        c.mu.Lock()
        defer c.mu.Unlock()
        c.series[route]++
    }

    func instrument(c *counter, next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            next.ServeHTTP(w, r)
            route := r.Pattern // ServeMux namunasi, masalan "GET /devices/{id}"
            if route == "" {
                route = "noma'lum" // mos namuna yo'q: hamma 404 bitta seriyaga
            }
            c.inc(route)
        })
    }

    func main() {
        c := &counter{series: map[string]int{}}
        mux := http.NewServeMux()
        mux.HandleFunc("GET /devices/{id}", func(w http.ResponseWriter, r *http.Request) {
            fmt.Fprintln(w, "ok")
        })
        h := instrument(c, mux)

        for i := 0; i < 1000; i++ {
            h.ServeHTTP(httptest.NewRecorder(), httptest.NewRequest(http.MethodGet, fmt.Sprintf("/devices/T-%d", i), nil))
        }
        for i := 0; i < 50; i++ {
            h.ServeHTTP(httptest.NewRecorder(), httptest.NewRequest(http.MethodGet, fmt.Sprintf("/wp-admin/%d.php", i), nil))
        }

        keys := make([]string, 0, len(c.series))
        for k := range c.series {
            keys = append(keys, k)
        }
        sort.Strings(keys)
        fmt.Println("seriyalar soni:", len(keys))
        for _, k := range keys {
            if len(keys) <= 5 {
                fmt.Println(k, c.series[k])
            }
        }
    }
  solutionNotes: |
    - `r.Pattern` `ServeMux` so'rovga mos kelgan namunani yozadi (masalan `GET /devices/{id}`); `next.ServeHTTP` qaytgandan keyin o'qish kerak, chunki mux uni handler chaqirilishi paytida to'ldiradi.
    - Mos namuna topilmasa `Pattern` bo'sh: yorliqni `noma'lum` kabi doimiy qiymatga almashtirish skaner trafigi seriyalar sonini oshirishining oldini oladi.
    - Xom yo'l yoki `PathValue("id")` yorliqqa qo'yilmaydi: bu qiymatlar cheksiz.
    - Qurilma kesimidagi tahlil kerak bo'lsa, log yoki trace atributi ishlatiladi, metrika yorlig'i emas.
    - Haqiqiy client_golang'da ham xuddi shu qoida: `WithLabelValues(route, ...)` ga cheksiz qiymat bermang.
  checklist:
    - "`route` yorlig'i `r.Pattern` dan olinadi, handler tugagandan keyin"
    - "Mos namuna bo'lmasa yorliq doimiy `noma'lum` qiymati bilan almashtiriladi"
    - "Dastur 2 ta seriya chiqaradi (`GET /devices/{id}` = 1000, `noma'lum` = 50)"
    - "Hisoblagich mutex bilan himoyalangan, `go vet` o'tadi"
---

## Muammo

Log nima bo'lganini aytadi, lekin "tizim hozir qanday?" degan savolga javob bermaydi. Bu savolga raqamlar bilan javob beriladi: sekundiga so'rovlar, xato ulushi, javob vaqtining 99-persentili, goroutine'lar soni, heap hajmi. Bu raqamlar vaqt bo'yicha saqlanishi, grafikda ko'rinishi va ular asosida alert ishlashi kerak. Jamoalar bu yerda ikki xil xatoga yo'l qo'yadi. Birinchisi: umuman metrika qo'ymaslik va muammoni mijoz shikoyatidan bilib olish. Ikkinchisi: metrika qo'yib, label'ga cheksiz qiymat (foydalanuvchi id, xom URL) berish; natijada metrikalar saqlanadigan tizim (va hisob-kitob) portlaydi.

Prometheus pull modeliga asoslangan: servis `/metrics` endpoint'ida joriy qiymatlarni matn formatida ko'rsatadi, Prometheus uni tez-tez (odatda 15-60 soniyada) o'qib, vaqt qatoriga (time series) yozadi. Go'da standart yechim `prometheus/client_golang`, shuningdek process ichidagi runtime holati uchun standart `runtime/metrics` paketi. Bu dars metrika turlarini, kardinallik qoidasini, instrumentatsiya naqshini va runtime metrikalarini ko'rsatadi. 84-darsdagi log va 86-darsdagi trace bilan birga uchlik (observability) bo'ladi.

## Asosiy g'oya

### Uch asosiy tur

- **Counter**: faqat oshadi (yoki process qayta ishga tushganda nolga qaytadi). So'rovlar soni, xatolar soni, yuborilgan baytlar. Grafikda xom qiymat emas, tezlik (`rate(...)`) qo'yiladi.
- **Gauge**: oshishi ham kamayishi ham mumkin: hozirgi goroutine'lar soni, navbat uzunligi, ochiq ulanishlar, heap hajmi.
- **Histogram**: kuzatuvlarni oldindan belgilangan bucket'larga yig'adi (davomiylik, javob hajmi). Server tomonda `_bucket`, `_sum`, `_count` seriyalari hosil bo'ladi; persentil esa so'rovda (`histogram_quantile`) taxminiy hisoblanadi. Bucket'lar kumulyativ: `le="0.1"` bucket'i 0.1 dan kichik yoki teng barcha kuzatuvlarni sanaydi.

Client_golang'da yana Summary bor (persentilni client tomonida hisoblaydi), lekin summary'lar bir nechta instansiya bo'yicha yig'ilmaydi. Shuning uchun servislar ko'pincha histogram tanlaydi.

### Label va kardinallik

Label metrikani kesimlarga ajratadi: `route`, `method`, `code`. Har noyob label kombinatsiyasi alohida time series, va har seriya xotira hamda saqlash narxiga ega. Qoida: label qiymatlari to'plami kichik va chegaralangan bo'lishi kerak. `device_id`, `user_id`, `request_id`, xom URL kabi cheksiz qiymatlar label bo'lmaydi. Bu kesimlar log yoki trace'ga mansub. Kardinallik hisobi: bitta metrikaning seriyalar soni hamma label qiymatlari sonining ko'paytmasiga yaqin: 20 route x 5 metod x 8 status kodi = 800 seriya, histogram bo'lsa har biri bucket soniga ko'paytiriladi.

## Chuqurroq: instrumentatsiya naqshlari

### Route yorlig'i: ServeMux namunasi

Middleware'da `route` ni `r.URL.Path` dan olish klassik xato: `/devices/T-101` va `/devices/T-102` ikkita seriya. Go 1.22 dan `ServeMux` namunalarda wildcard (`GET /devices/{id}`) qo'llaydi, Go 1.23 dan esa mos kelgan namunani `Request.Pattern` maydoniga yozadi (mos kelmasa bo'sh). Shu qiymatni label sifatida ishlatish seriyalarni cheklaydi. `Pattern` handler ishga tushgandan keyin to'ldiriladi, shuning uchun `next.ServeHTTP` dan keyin o'qiladi. Mos namuna bo'lmagan so'rovlar (skanerlar, noto'g'ri URL) uchun bo'sh qiymat doimiy yorliqqa almashtiriladi.

### Histogram bucket'larini tanlash

Kvantil bahosi bucket ichida chiziqli interpolyatsiya bilan hisoblanadi, shuning uchun aniqlik bucket kengligiga bog'liq. Client_golang'ning `DefBuckets` to'plami 5 millisekunddan 10 sekundgacha umumiy diapazon uchun. Servisingiz asosan 1-3 ms da javob bersa, hamma kuzatuv bitta bucket'ga tushadi va persentil ma'nosiz bo'ladi. Bucket'larni o'z latency taqsimotingizga (SLO atrofida zichroq) moslang. Bucket qo'shish seriyalar sonini oshiradi: bu narx va aniqlik o'rtasidagi tanlov.

### Metrikalarni qayerda saqlash

Metrikalarni global o'zgaruvchi sifatida e'lon qilish (`promauto` yoki `init`) qulay, lekin testlarda bir xil nomli metrikani ikki marta ro'yxatdan o'tkazish panic beradi. Toza yo'l: `Metrics` struct, `NewMetrics(reg prometheus.Registerer)` konstruktori va har test uchun `prometheus.NewRegistry()`. Misol quyida.

### runtime/metrics

Go runtime holati `runtime/metrics` paketida: `metrics.Read([]metrics.Sample)` tanlangan metrikalarni o'qiydi, `metrics.All()` barcha metrikalar tavsifini beradi. Nomlar `/sched/goroutines:goroutines` shaklida (yo'l:birlik). `Description.Cumulative` metrika faqat o'sadimi, shuni bildiradi (counter yoki gauge tanlash uchun foydali). 56-darsda GC bilan bog'liq metrikalar, 60-darsda `GODEBUG` hisoblagichlari ko'rilgan edi; Tashqi ko'rinishda alert uchun odatda goroutine soni, heap hajmi va GC pauzasi kuzatiladi.

## Misol: mini-registry, matn formati va kardinallik

Avval Prometheus matn formatini ko'ramiz. Quyidagi kod tashqi kutubxonasiz, o'zimizda yozilgan kichik registry: counter va histogram'ni yig'adi va matn formatida chiqaradi. Bu o'quv vositasi, haqiqiy loyihada `client_golang` ishlatiladi. Route yorlig'i `r.Pattern` dan olinadi.

```go
package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"sort"
	"strings"
	"sync"
	"time"
)

// metrics - Prometheus matn formatini ko'rsatish uchun juda kichik registry.
// Haqiqiy loyihada prometheus/client_golang ishlatiladi.
type metrics struct {
	mu       sync.Mutex
	requests map[string]uint64 // "route|method|code" -> soni
	buckets  []float64
	counts   map[string][]uint64 // route -> har bucket uchun (kumulyativ emas) soni
	sum      map[string]float64
	total    map[string]uint64
}

func newMetrics() *metrics {
	return &metrics{
		requests: map[string]uint64{},
		buckets:  []float64{0.005, 0.01, 0.025, 0.05, 0.1},
		counts:   map[string][]uint64{},
		sum:      map[string]float64{},
		total:    map[string]uint64{},
	}
}

func (m *metrics) observe(route, method string, code int, d time.Duration) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.requests[fmt.Sprintf("%s|%s|%d", route, method, code)]++
	if m.counts[route] == nil {
		m.counts[route] = make([]uint64, len(m.buckets))
	}
	sec := d.Seconds()
	for i, ub := range m.buckets {
		if sec <= ub {
			m.counts[route][i]++
			break
		}
	}
	m.sum[route] += sec
	m.total[route]++
}

func (m *metrics) write(sb *strings.Builder) {
	m.mu.Lock()
	defer m.mu.Unlock()
	sb.WriteString("# HELP http_requests_total Qabul qilingan so'rovlar soni.\n# TYPE http_requests_total counter\n")
	keys := make([]string, 0, len(m.requests))
	for k := range m.requests {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	for _, k := range keys {
		p := strings.Split(k, "|")
		fmt.Fprintf(sb, "http_requests_total{route=%q,method=%q,code=%q} %d\n", p[0], p[1], p[2], m.requests[k])
	}
	sb.WriteString("# HELP http_request_duration_seconds So'rov davomiyligi.\n# TYPE http_request_duration_seconds histogram\n")
	routes := make([]string, 0, len(m.counts))
	for r := range m.counts {
		routes = append(routes, r)
	}
	sort.Strings(routes)
	for _, r := range routes {
		var cum uint64
		for i, ub := range m.buckets {
			cum += m.counts[r][i]
			fmt.Fprintf(sb, "http_request_duration_seconds_bucket{route=%q,le=\"%g\"} %d\n", r, ub, cum)
		}
		fmt.Fprintf(sb, "http_request_duration_seconds_bucket{route=%q,le=\"+Inf\"} %d\n", r, m.total[r])
		fmt.Fprintf(sb, "http_request_duration_seconds_sum{route=%q} %g\n", r, m.sum[r])
		fmt.Fprintf(sb, "http_request_duration_seconds_count{route=%q} %d\n", r, m.total[r])
	}
}

type statusWriter struct {
	http.ResponseWriter
	code int
}

func (w *statusWriter) WriteHeader(c int) { w.code = c; w.ResponseWriter.WriteHeader(c) }

// instrument route yorlig'ini ServeMux namunasidan (r.Pattern) oladi, xom yo'ldan emas.
func (m *metrics) instrument(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		sw := &statusWriter{ResponseWriter: w, code: http.StatusOK}
		start := time.Now()
		next.ServeHTTP(sw, r)
		route := r.Pattern
		if route == "" {
			route = "noma'lum"
		}
		m.observe(route, r.Method, sw.code, time.Since(start))
	})
}

func main() {
	m := newMetrics()
	mux := http.NewServeMux()
	mux.HandleFunc("GET /devices/{id}", func(w http.ResponseWriter, r *http.Request) {
		if r.PathValue("id") == "T-999" {
			http.Error(w, "topilmadi", http.StatusNotFound)
			return
		}
		fmt.Fprintln(w, "ok")
	})
	h := m.instrument(mux)

	for _, id := range []string{"T-101", "T-102", "T-103", "T-999"} {
		h.ServeHTTP(httptest.NewRecorder(), httptest.NewRequest(http.MethodGet, "/devices/"+id, nil))
	}
	var sb strings.Builder
	m.write(&sb)
	for _, line := range strings.Split(sb.String(), "\n") {
		if strings.HasPrefix(line, "http_request_duration_seconds_sum") {
			line = "http_request_duration_seconds_sum{...} (vaqtga bog'liq, bu yerda ko'rsatilmaydi)"
		}
		if line != "" {
			fmt.Println(line)
		}
	}
}
```

Chiqish (Go 1.24.7; `_sum` qatori vaqtga bog'liq bo'lgani uchun almashtirilgan):

```text
# HELP http_requests_total Qabul qilingan so'rovlar soni.
# TYPE http_requests_total counter
http_requests_total{route="GET /devices/{id}",method="GET",code="200"} 3
http_requests_total{route="GET /devices/{id}",method="GET",code="404"} 1
# HELP http_request_duration_seconds So'rov davomiyligi.
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{route="GET /devices/{id}",le="0.005"} 4
http_request_duration_seconds_bucket{route="GET /devices/{id}",le="0.01"} 4
http_request_duration_seconds_bucket{route="GET /devices/{id}",le="0.025"} 4
http_request_duration_seconds_bucket{route="GET /devices/{id}",le="0.05"} 4
http_request_duration_seconds_bucket{route="GET /devices/{id}",le="0.1"} 4
http_request_duration_seconds_bucket{route="GET /devices/{id}",le="+Inf"} 4
http_request_duration_seconds_sum{...} (vaqtga bog'liq, bu yerda ko'rsatilmaydi)
http_request_duration_seconds_count{route="GET /devices/{id}"} 4
```

Nimalar ko'rinadi:

- `# HELP` va `# TYPE` qatorlari metrikani tavsiflaydi, har seriya `nom{label="qiymat"} son` shaklida.
- Uchta 200 va bitta 404 alohida seriya (`code` label'i). Uchta turli qurilma (`T-101`, `T-102`, `T-103`) va 404 beradigan `T-999` bitta `route` ga tushdi.
- Bucket'lar kumulyativ, `+Inf` bucket'i `_count` ga teng. Bu so'rovlar juda tez bajarildi, shuning uchun hammasi birinchi (5 ms) bucket'ga tushdi: yuqoridagi bucket'larning ma'nosi yo'q. Haqiqiy API uchun bucket'larni moslash kerakligining jonli misoli.

### Client_golang bilan

Yuqoridagi mantiq `client_golang` da tayyor. Tashqi modul sandbox'da yuklanmagani uchun u kompilyatsiya qilinmagan: faqat sintaksis `gofmt` bilan tekshirilgan, `client_golang` imzolari esa hujjat sahifasi bilan avtor tomonidan qo'lda solishtirilmagan (veb tekshiruvi bu sessiyada ishlamadi). Uni loyihangizda `go build` bilan tekshirib oling.

```go
package main

import (
	"net/http"
	"strconv"
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/collectors"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

// Metrics servisning barcha metrikalarini bir joyda saqlaydi.
type Metrics struct {
	Requests *prometheus.CounterVec
	Duration *prometheus.HistogramVec
	InFlight prometheus.Gauge
}

func NewMetrics(reg prometheus.Registerer) *Metrics {
	m := &Metrics{
		Requests: prometheus.NewCounterVec(prometheus.CounterOpts{
			Name: "http_requests_total",
			Help: "Qabul qilingan HTTP so'rovlar soni.",
		}, []string{"route", "method", "code"}),
		Duration: prometheus.NewHistogramVec(prometheus.HistogramOpts{
			Name:    "http_request_duration_seconds",
			Help:    "HTTP so'rov davomiyligi.",
			Buckets: prometheus.DefBuckets,
		}, []string{"route", "method"}),
		InFlight: prometheus.NewGauge(prometheus.GaugeOpts{
			Name: "http_in_flight_requests",
			Help: "Hozir bajarilayotgan so'rovlar soni.",
		}),
	}
	reg.MustRegister(m.Requests, m.Duration, m.InFlight)
	return m
}

type statusWriter struct {
	http.ResponseWriter
	code int
}

func (w *statusWriter) WriteHeader(c int) { w.code = c; w.ResponseWriter.WriteHeader(c) }

func (m *Metrics) Instrument(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		m.InFlight.Inc()
		defer m.InFlight.Dec()

		sw := &statusWriter{ResponseWriter: w, code: http.StatusOK}
		start := time.Now()
		next.ServeHTTP(sw, r)

		route := r.Pattern // handler tugagach ServeMux uni to'ldirgan bo'ladi
		if route == "" {
			route = "noma'lum"
		}
		m.Requests.WithLabelValues(route, r.Method, strconv.Itoa(sw.code)).Inc()
		m.Duration.WithLabelValues(route, r.Method).Observe(time.Since(start).Seconds())
	})
}

func main() {
	reg := prometheus.NewRegistry()
	reg.MustRegister(collectors.NewGoCollector(), collectors.NewProcessCollector(collectors.ProcessCollectorOpts{}))
	m := NewMetrics(reg)

	mux := http.NewServeMux()
	mux.HandleFunc("GET /devices/{id}", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	})
	// /metrics asosiy portdan alohida, ichki portda xizmat qilish ma'qul.
	mux.Handle("GET /metrics", promhttp.HandlerFor(reg, promhttp.HandlerOpts{}))

	http.ListenAndServe(":8080", m.Instrument(mux))
}
```

Qarorlar: metrikalar `NewMetrics` konstruktorida yaratiladi va berilgan `Registerer` ga ro'yxatdan o'tadi (test o'z registry'sini beradi); `route` `r.Pattern` dan; `InFlight` gauge `defer` bilan kamayadi; `/metrics` ommaviy so'rovlar zanjiridan tashqarida ham xizmat qilinishi mumkin (alohida ichki port).

### runtime/metrics: haqiqiy chiqish

Quyidagi dastur bir nechta runtime metrikasini o'qiydi va sched metrikalarining tavsifini chiqaradi (Go 1.24.7, linux/amd64):

```go
package main

import (
	"fmt"
	"runtime/metrics"
	"sort"
	"strings"
)

func main() {
	names := []string{
		"/sched/goroutines:goroutines",
		"/gc/heap/goal:bytes",
		"/memory/classes/heap/objects:bytes",
		"/gc/cycles/total:gc-cycles",
		"/sched/latencies:seconds",
	}
	samples := make([]metrics.Sample, len(names))
	for i, n := range names {
		samples[i].Name = n
	}
	metrics.Read(samples)
	for _, s := range samples {
		switch s.Value.Kind() {
		case metrics.KindUint64:
			fmt.Printf("%-40s uint64\n", s.Name)
		case metrics.KindFloat64Histogram:
			h := s.Value.Float64Histogram()
			fmt.Printf("%-40s histogram, %d bucket\n", s.Name, len(h.Counts))
		case metrics.KindBad:
			fmt.Printf("%-40s MAVJUD EMAS\n", s.Name)
		default:
			fmt.Printf("%-40s %v\n", s.Name, s.Value.Kind())
		}
	}
	var all []string
	for _, d := range metrics.All() {
		if strings.HasPrefix(d.Name, "/sched/") {
			all = append(all, fmt.Sprintf("%s cumulative=%v", d.Name, d.Cumulative))
		}
	}
	sort.Strings(all)
	fmt.Println(len(metrics.All()) > 20, len(all))
	for _, a := range all {
		fmt.Println(a)
	}
}
```

```text
/sched/goroutines:goroutines             uint64
/gc/heap/goal:bytes                      uint64
/memory/classes/heap/objects:bytes       uint64
/gc/cycles/total:gc-cycles               uint64
/sched/latencies:seconds                 histogram, 162 bucket
true 7
/sched/gomaxprocs:threads cumulative=false
/sched/goroutines:goroutines cumulative=false
/sched/latencies:seconds cumulative=true
/sched/pauses/stopping/gc:seconds cumulative=true
/sched/pauses/stopping/other:seconds cumulative=true
/sched/pauses/total/gc:seconds cumulative=true
/sched/pauses/total/other:seconds cumulative=true
```

Goroutine soni, heap maqsadi va GC sikllari soni oddiy `uint64`; scheduling kechikishi esa gistogramma (bu versiyada 162 bucket). `Cumulative` bayrog'i goroutine soni va `gomaxprocs` uchun false (gauge), kechikish va pauzalar uchun true (faqat o'sadi). Metrikalar ro'yxati Go versiyasiga bog'liq, shuning uchun nomlarni `metrics.All()` bilan tekshirib oling.

## Qachon qo'llamaslik kerak

- Metrikaga cheksiz qiymatli label qo'shish. Qurilma, foydalanuvchi, buyurtma kesimi kerak bo'lsa, log yoki trace ishlating.
- Metrika "nima bo'ldi?" savoliga javob bermaydi: u agregat. Alohida so'rov bilan nima sodir bo'lganini log va trace ko'rsatadi.
- Har funksiya uchun metrika yaratish: bu shovqin va xarajat. Avval 4 ta "oltin signal" ni qo'ying: latency, trafik, xatolar va to'yinish (resurs bandligi), keyin kerak bo'lganda kengaytiring.
- Histogram o'rniga o'rtacha (average) latency'ni alert qilish. O'rtacha dumni yashiradi; persentil kerak.
- Ichki servislarda juda tez-tez chaqiriladigan funksiyada metrika yangilash: `WithLabelValues` map qidiruvi va atomik amallarni talab qiladi. Issiq yo'lda label'li metrika qiymatini oldindan olib qo'yish (`With(...)` natijasini saqlash) yaxshiroq. Aniq narxni o'lchang (61-dars).
- `/metrics` ni autentifikatsiyasiz ommaviy portda ochish. Ichki tafsilot oshkor bo'ladi.

## Stack'da: prom-client bilan farq

Node.js'da `prom-client` bir xil metrika turlariga va `collectDefaultMetrics()` ga ega; Go'da `collectors.NewGoCollector()` o'xshash. Node.js bitta event loop bo'lgani uchun "event loop lag" asosiy signal; Go'da u o'rnini goroutine soni, scheduler kechikishi (`/sched/latencies:seconds`) va GC pauzalari egallaydi. Servisingiz klaster rejimida (bir nechta process) ishlasa, Node.js'da metrikalarni worker'lar orasida yig'ish kerak bo'ladi; Go'da bitta process hamma goroutine'larni qamraydi, shuning uchun metrikalar tabiiy yig'iladi.

Telemetriya platformasi uchun amaliy to'plam: `ingest_points_total{result="ok|invalid|dropped"}` counter, `ingest_batch_size` histogram, `db_pool_in_use` gauge (78-dars bilan bog'lanadi), navbat uzunligi gauge va standart HTTP metrikalari. Qurilma identifikatori label'da emas, logda yoki trace atributida.

## Xulosa

- Counter faqat o'sadi (rate bilan o'qiladi), gauge ikki tomonga o'zgaradi, histogram bucket'larga yig'adi va kumulyativ.
- Har noyob label kombinatsiyasi alohida seriya: cheksiz qiymatlarni (user id, device id, xom URL) label qilmang; route uchun `r.Pattern` (Go 1.23 dan) ishlating va mos kelmaganlarni bitta qiymatga yig'ing.
- Histogram bucket'larini real latency taqsimotiga moslang; `DefBuckets` hamma uchun mos emas.
- Metrikalarni konstruktor va `Registerer` orqali bering; global ro'yxatdan o'tkazish testlarda panic beradi.
- Runtime holati uchun `runtime/metrics`; `/metrics` endpoint'ini ommaviy portdan ajrating.
