---
n: 96
slug: case-gateway
title: "Case study: API gateway va reverse proxy"
summary: "httputil.ReverseProxy va Rewrite bilan sodda API gateway: marshrutlash, API kalit va rate limit middleware'lari, ishonchsiz sarlavhalarni tozalash, Transport timeout'lari, 502/504 xato xaritasi va TLS/mTLS sozlamalari."
duration: 55
sources:
  - id: pkg-net-http
    note: "http.Transport maydonlari (ResponseHeaderTimeout, MaxIdleConnsPerHost, DefaultMaxIdleConnsPerHost = 2), StripPrefix, Server timeout'lari; httputil.ReverseProxy, ProxyRequest, SetURL va SetXForwarded hujjatlari"
  - id: go126
    note: "net/http/httputil bo'limi: ReverseProxy.Director eskirgan, Rewrite tavsiya etiladi va sababi"
  - id: pkg-tls
    note: "tls.Config: MinVersion, RootCAs va Certificates maydonlari"
quiz:
  - q: "Go 1.26 release notes `ReverseProxy.Director` ni eskirgan deb e'lon qildi. Sababi nima?"
    options:
      - "Director sekin ishlaydi"
      - "Director faqat HTTP/1 da ishlaydi"
      - "Zararli mijoz Director qo'shgan sarlavhalarni hop-by-hop deb belgilab olib tashlata oladi, va bu muammoni Director API doirasida hal qilib bo'lmaydi; Go 1.20 da Rewrite qo'shilgan"
      - "Director goroutine leak keltirib chiqaradi"
    answer: 2
    explain: "Release notes aynan shuni yozadi: hop-by-hop sarlavhalar Director qaytgandan keyin olib tashlanadi va mijoz `Connection` sarlavhasi orqali Director qo'shgan sarlavhani nomlab, uni yo'qotishi mumkin. Rewrite'da hop-by-hop sarlavhalar Rewrite chaqirilishidan oldin olib tashlanadi, shuning uchun uning o'zgarishlari saqlanadi."
  - q: "Gateway `/telemetry` prefiksini `http.StripPrefix` bilan olib tashlab, so'rovni `ReverseProxy` ga beradi, `Rewrite` ichida `r.SetURL(target)` (target yo'li bo'sh). Mijoz `/telemetry/v1/points` ga so'rov yubordi. Upstream qaysi yo'lni ko'radi?"
    options:
      - "/telemetry/v1/points"
      - "/v1/points"
      - "/"
      - "/telemetry"
    answer: 1
    explain: "StripPrefix prefiksni yo'ldan olib tashlaydi (`/v1/points`), SetURL esa target yo'lini (bo'sh) kiruvchi yo'l oldiga qo'shadi. Natija `/v1/points`. Target yo'li `/base` bo'lsa, upstream `/base/v1/points` ko'rardi."
  - q: "Upstream 300 ms ichida javob sarlavhasini yubormadi. `Transport.ResponseHeaderTimeout` 300 ms edi. Gateway nima qaytarishi to'g'ri?"
    options:
      - "502 Bad Gateway, chunki upstream ulanishi uzildi"
      - "200 OK bo'sh tana bilan"
      - "429 Too Many Requests"
      - "504 Gateway Timeout, chunki xato timeout turiga kiradi (net.Error.Timeout() true yoki DeadlineExceeded)"
    answer: 3
    explain: "Timeout upstream javob bermagani bilan bog'liq, shuning uchun 504. Ulanish rad etilgan (port yopiq) holat esa 502. Namunadagi ErrorHandler `errors.Is(err, context.DeadlineExceeded)` yoki `net.Error.Timeout()` bilan ajratadi."
  - q: "`http.Transport` da `MaxIdleConnsPerHost` nol qoldirildi. Gateway bir upstream'ga bir vaqtda 50 so'rov yuboradi. Qanday oqibat kutiladi?"
    options:
      - "Default qiymat DefaultMaxIdleConnsPerHost = 2: so'rovlar tugagach faqat 2 ta ulanish idle saqlanadi, qolganlari yopiladi va keyingi to'lqinda qayta ochiladi (yangi TCP/TLS qo'l siqish)"
      - "Cheksiz ulanish saqlanadi"
      - "50 ta ulanish doim ochiq turadi"
      - "Ulanishlar umuman qayta ishlatilmaydi"
    answer: 0
    explain: "Hujjatga ko'ra nol qiymat DefaultMaxIdleConnsPerHost (2) ni beradi. Gateway kabi bitta upstream'ga ko'p parallel so'rov yuboradigan kod uchun bu ulanishlarni muntazam yopish va qayta ochishga olib keladi. Qiymatni parallellikka qarab oshirish kerak."
  - q: "Auth middleware API kalitni tekshirib, mijoz identifikatorini kontekstga qo'yadi. Nima uchun Rewrite ichida avval `r.Out.Header.Del(\"X-Client-ID\")`, keyin qiymatni qo'yadi?"
    options:
      - "Del bo'lmasa sarlavha ikki marta yuboriladi"
      - "Mijoz o'zi `X-Client-ID: admin` yuborishi mumkin; gateway ishonchsiz tashqi qiymatni o'chirib, faqat o'zi aniqlagan identifikatorni qo'yishi kerak"
      - "Header.Set avvalgi qiymatni o'chirmaydi"
      - "Go sarlavhalarni avtomatik nusxalamaydi"
    answer: 1
    explain: "Ishonch chegarasi gateway'da: upstream `X-Client-ID` ga ishonadi, shuning uchun uni faqat gateway qo'ya olishi kerak. Set avvalgi qiymatni almashtiradi, lekin Del niyatni aniq ko'rsatadi va identifikator bo'lmagan holatda (`id == \"\"`) soxta qiymat o'tib ketmaydi. Namunada mijoz `admin` yuborgani `client-17` ga almashgan."
  - q: "Token bucket limiter: tezlik 1 token/soniya, burst 3. Bir klient ketma-ket 3 so'rov yubordi (hammasi o'tdi), 4-si rad etildi. 2 soniya o'tgach yana yubordi. Natija?"
    options:
      - "Yana rad etiladi, chunki bucket to'ldirilmaydi"
      - "Barcha tokenlar qaytadi, 3 ta so'rov o'tadi"
      - "Faqat 1 ta so'rov o'tadi, chunki oxirgi rad etish vaqtidan sanaladi"
      - "2 token qaytadi (2 soniya x 1 token), ya'ni ikkita so'rov o'tadi, uchinchisi rad etiladi"
    answer: 3
    explain: "Bucket vaqt o'tishi bilan `rate` tezlikda to'ladi, `burst` bilan chegaralanadi. 2 soniyada 2 token qo'shiladi. Namunada 'soxta soat' 2 soniya ilgarilab, keyingi so'rov o'tdi. Bucket'larning har klient uchun saqlanishi esa xotirani o'stiradi: eskirgan yozuvlarni tozalash kerak."
task:
  title: "Upstream timeout va xato xaritasi"
  prompt: |
    Gateway'ning `newProxy` funksiyasi `http.DefaultTransport`dan foydalanadi: upstream javob bermasa, kutish chegarasi yo'q, o'lik upstream uchun esa standart xato ishlovchi 502 beradi. Sekin upstream 600 ms kutadi va gateway ham shuncha kutib 200 qaytaradi.

    `newProxy`ni quyidagicha o'zgartiring:

    - alohida `http.Transport` yarating: `DialContext` timeout 1 s, `ResponseHeaderTimeout` 200 ms;
    - `ErrorHandler` yozing: `context.DeadlineExceeded` yoki `net.Error.Timeout()` bo'lsa 504, aks holda 502;
    - `main` va `get` ni o'zgartirmang.

    Kutilgan chiqish: `sekin upstream: 504 tez javob: true` va `o'lik upstream: 502`.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "net/http"
        "net/http/httptest"
        "net/http/httputil"
        "net/url"
        "time"
    )

    func newProxy(target *url.URL) *httputil.ReverseProxy {
        return &httputil.ReverseProxy{
            Rewrite: func(r *httputil.ProxyRequest) { r.SetURL(target) },
            // Transport yo'q: DefaultTransport, upstream javobiga kutish chegarasi yo'q.
        }
    }

    func get(h http.Handler) (int, time.Duration) {
        start := time.Now()
        rec := httptest.NewRecorder()
        h.ServeHTTP(rec, httptest.NewRequest("GET", "/x", nil))
        return rec.Code, time.Since(start)
    }

    func main() {
        slow := httptest.NewServer(http.HandlerFunc(func(http.ResponseWriter, *http.Request) {
            time.Sleep(600 * time.Millisecond)
        }))
        defer slow.Close()
        dead := httptest.NewServer(http.NotFoundHandler())
        deadURL := dead.URL
        dead.Close()

        su, _ := url.Parse(slow.URL)
        du, _ := url.Parse(deadURL)

        code, d := get(newProxy(su))
        fmt.Println("sekin upstream:", code, "tez javob:", d < 400*time.Millisecond)
        code, _ = get(newProxy(du))
        fmt.Println("o'lik upstream:", code)
    }
  solution: |
    package main

    import (
        "context"
        "errors"
        "fmt"
        "net"
        "net/http"
        "net/http/httptest"
        "net/http/httputil"
        "net/url"
        "time"
    )

    func newProxy(target *url.URL) *httputil.ReverseProxy {
        tr := &http.Transport{
            DialContext:           (&net.Dialer{Timeout: time.Second}).DialContext,
            ResponseHeaderTimeout: 200 * time.Millisecond,
        }
        return &httputil.ReverseProxy{
            Rewrite:   func(r *httputil.ProxyRequest) { r.SetURL(target) },
            Transport: tr,
            ErrorHandler: func(w http.ResponseWriter, r *http.Request, err error) {
                var ne net.Error
                status := http.StatusBadGateway
                if errors.Is(err, context.DeadlineExceeded) || (errors.As(err, &ne) && ne.Timeout()) {
                    status = http.StatusGatewayTimeout
                }
                http.Error(w, http.StatusText(status), status)
            },
        }
    }

    func get(h http.Handler) (int, time.Duration) {
        start := time.Now()
        rec := httptest.NewRecorder()
        h.ServeHTTP(rec, httptest.NewRequest("GET", "/x", nil))
        return rec.Code, time.Since(start)
    }

    func main() {
        slow := httptest.NewServer(http.HandlerFunc(func(http.ResponseWriter, *http.Request) {
            time.Sleep(600 * time.Millisecond)
        }))
        defer slow.Close()
        dead := httptest.NewServer(http.NotFoundHandler())
        deadURL := dead.URL
        dead.Close()

        su, _ := url.Parse(slow.URL)
        du, _ := url.Parse(deadURL)

        code, d := get(newProxy(su))
        fmt.Println("sekin upstream:", code, "tez javob:", d < 400*time.Millisecond)
        code, _ = get(newProxy(du))
        fmt.Println("o'lik upstream:", code)
    }
  solutionNotes: |
    - `ResponseHeaderTimeout` upstream so'rovni to'liq yuborgandan keyin javob sarlavhasini kutish vaqtini cheklaydi; undan oshsa Transport timeout xatosi qaytaradi.
    - Timeout xatosi `net.Error` interface'ini bajaradi va `Timeout()` true qaytaradi; `errors.As` bilan ajratiladi. `DeadlineExceeded` kontekst deadline'i uchun.
    - Ulanish rad etilishi (port yopiq) timeout emas, shuning uchun 502 qoladi.
    - Standart `ErrorHandler` har qanday xatoda 502 qaytaradi va logga yozadi. Maxsus handler 502/504 farqini mijozga bildiradi.
    - Production'da qiymatlar SLO'ga qarab belgilanadi; 200 ms faqat namuna uchun.
  checklist:
    - "Alohida `http.Transport` ishlatilgan, `DefaultTransport` emas"
    - "`ResponseHeaderTimeout` o'rnatilgan va sekin upstream tez 504 beradi"
    - "O'lik upstream 502 qaytaradi"
    - "Timeout `errors.Is(DeadlineExceeded)` yoki `net.Error.Timeout()` bilan aniqlanadi"
    - "`go vet` va `go run -race` ogohlantirishsiz o'tadi"
---

## Muammo

Servislar soni oshgach, har birining oldida bir xil vazifalar paydo bo'ladi: API kalitni tekshirish, tezlikni cheklash, so'rov identifikatori berish, marshrutlash, kirish loglari. Bularni har servisda qayta yozish ham takror, ham xavfli, chunki bitta servis unutilsa, himoyada teshik qoladi. Gateway shu vazifalarni bitta kirish nuqtasiga yig'adi. Go bu uchun qulay: `net/http/httputil.ReverseProxy` standart kutubxonada, va ko'pincha yagona maxsus mantiq - auth va marshrutlash - o'nlab qatorga sig'adi.

Lekin gateway oddiy "so'rovni oldinga uzat" emas. Real xatolar kam sonli joyda to'planadi: mijoz yuborgan sarlavhaga (`X-Client-ID`, `X-Forwarded-For`) ishonib qo'yish; upstream sekin javob berganda gateway'ning o'zi cheksiz kutib, so'rovlarni to'plashi; `http.Transport` ning standart sozlamalari tufayli ulanishlarning doim yopilib-ochilishi; upstream xatosini mijozga noto'g'ri statusda qaytarish. Bu dars shu to'rt tuzoqni namunada bosqichma-bosqich yopadi. Node.js tajribasidan: `http-proxy-middleware` yoki nginx bilan o'xshash vazifa; Go'da esa hammasi bitta binary va bitta tilda, so'rov esa har biri alohida goroutine'da ishlaydi.

## Asosiy g'oya

### ReverseProxy: Director emas, Rewrite

`ReverseProxy` kiruvchi so'rovni oladi, uni o'zgartirib upstream'ga yuboradi va javobni mijozga qaytaradi. So'rovni o'zgartirish uchun ikkita hook bor. Eskisi - `Director`. Go 1.26 release notes uni eskirgan deb e'lon qiladi va sababini yozadi: zararli mijoz Director qo'shgan sarlavhalarni hop-by-hop deb belgilab, ularni olib tashlata oladi; Director API doirasida buni hal qilib bo'lmaydi. Yangi hook - `Rewrite` - Go 1.20 da qo'shilgan va ikkita so'rovni beradi: o'zgartirilmagan kiruvchi (`r.In`) va yuboriladigan (`r.Out`).

`httputil` hujjatiga ko'ra `Rewrite` chaqirilishidan oldin ikki narsa allaqachon tozalangan: `Out` so'rovdan hop-by-hop sarlavhalar olib tashlangan va `Forwarded`, `X-Forwarded-For`, `X-Forwarded-Host`, `X-Forwarded-Proto` sarlavhalari ham olib tashlangan. Demak mijoz yuborgan `X-Forwarded-For` ga ishonish masalasi sukut bo'yicha hal qilingan: ular tashlanadi. Agar gateway o'zi boshqa proxy (masalan, bulut load balancer) ortida tursa va uning `X-Forwarded-For` iga ishonishi kerak bo'lsa, hujjat misolidagidek, sarlavhani `SetXForwarded` dan oldin ongli ravishda ko'chirasiz. Qaysi proxy'ga ishonish - xavfsizlik qarori va deploy topologiyasiga bog'liq.

Yordamchilar: `SetURL(target)` so'rovni target'ning sxemasi, hosti va bazaviy yo'liga yo'naltiradi (target yo'li `/base`, kiruvchi `/dir` bo'lsa, upstream `/base/dir` ni oladi) va `Host` sarlavhasini target hostiga almashtiradi. `SetXForwarded` esa `X-Forwarded-For/Host/Proto` ni mijoz IP, so'ralgan host va sxema bilan to'ldiradi.

### Ishonch chegarasi

Gateway ichkaridagi servislar uchun "qopqa" vazifasini bajaradi: ichki servis `X-Client-ID` ga ishonadi, chunki uni faqat gateway qo'ya oladi. Bu ishonch gateway mijozdan kelgan shu nomli sarlavhani majburan o'chirgandagina to'g'ri. Shuning uchun namunadagi `Rewrite` avval `Del`, keyin autentifikatsiyadan o'tgan identifikatorni `Set` qiladi. Sinov mijozi `X-Client-ID: admin` yuborganida upstream baribir `client-17` ni ko'radi.

Boshqa tomondan, upstream'larga tarmoq darajasida faqat gateway'dan kirishni ruxsat etish va, kerak bo'lsa, mTLS bilan ulanish (75-dars) bu ishonchni kuchaytiradi: aks holda ichki tarmoqdagi istalgan mijoz soxta sarlavha yuborishi mumkin.

## Chuqurroq: Transport, xato xaritasi, limit

### Transport: standart qiymatlar gateway uchun mos emas

`ReverseProxy.Transport` nol qoldirilsa, `http.DefaultTransport` ishlatiladi. Gateway uchun alohida, o'ylab sozlangan Transport yaratish kerak. Asosiy sabablar:

- Kutish chegaralari. Upstream javob bermasa, `ResponseHeaderTimeout` bo'lmaganda so'rov (va uni ushlab turgan goroutine, xotira, mijoz ulanishi) cheksiz kutadi. Chegara upstream SLO'siga qarab qo'yiladi; namunadagi 300 ms faqat sinov uchun.
- `DialContext` timeout'i. Ulanish o'rnatishning o'zi uzoq kutmasligi uchun.
- `MaxIdleConnsPerHost`. `net/http` hujjatiga ko'ra nol qiymat `DefaultMaxIdleConnsPerHost` ni beradi va u 2 ga teng. Gateway bitta upstream'ga ko'p parallel so'rov yuboradi; idle ulanishlar 2 tadan oshmasa, to'lqin tugagach ulanishlarning ko'pi yopiladi va keyingi to'lqinda yangi TCP (va TLS) qo'l siqish kerak bo'ladi. Namunada 32 qo'yilgan; real qiymatni parallellikdan kelib chiqib, o'lchab tanlang (73-dars).

### Xato xaritasi: 502, 504 va mijoz uzilishi

`ErrorHandler` upstream bilan aloqa xatosini mijozga status sifatida tarjima qiladi (92-dars). Namunadagi qoida: timeout (`DeadlineExceeded` yoki `net.Error.Timeout()`) bo'lsa 504, qolgan hamma aloqa xatosi 502. Mijoz o'zi uzilgan holat (`context.Canceled`) uchun javob yozishning ma'nosi yo'q va log shovqinini kamaytirish uchun e'tiborsiz qoldiriladi. `ErrorHandler` bo'lmaganda `ReverseProxy` standart xatti-harakat bilan 502 qaytaradi va xatoni standart logga yozadi; topshiriqdagi starter shuni namoyish etadi.

502/504 farqi mijoz va operator uchun foydali: 504 - upstream sekin, 502 - upstream ishlamayapti yoki noto'g'ri javob berdi. Ikkalasi uchun ham gateway retry qilmaydi; GET kabi idempotent so'rovlarda retry mijozga yoki alohida, ehtiyotkor mexanizmga qoldiriladi (73-dars).

### Marshrutlash

`ServeMux` prefiks bo'yicha upstream tanlaydi: `/telemetry/` bir upstream'ga, `/reports/` boshqasiga. `http.StripPrefix` hujjatiga ko'ra yo'ldan prefiksni olib tashlaydi va prefiksga mos kelmagan yo'lga 404 beradi. Namunada har route uchun alohida `ReverseProxy` yaratiladi, lekin ularning hammasi bitta `Transport` ni (shu bilan ulanishlar pulini) ulashadi.

### Rate limit: token bucket

Namunadagi `Limiter` har klient uchun bucket saqlaydi: u `rate` token/soniya tezlikda to'ladi, `burst` bilan chegaralanadi va har so'rov bitta token sarflaydi. Soat tashqaridan beriladi (91-dars), shuning uchun sinov deterministik. Cheklovlar, halol aytganda: bucket'lar xotirada va hech qachon o'chirilmaydi (klientlar soni cheksiz o'ssa, xotira ham o'sadi; eskirgan yozuvlarni tozalash kerak); har gateway nusxasi o'z hisobini yuritadi, shuning uchun N nusxada umumiy limit N barobargacha kattalashadi. Aniq umumiy limit uchun markaziy saqlash kerak (Redis, 79-dars) yoki limitni nusxalar soniga bo'lib belgilash.

## Misol: gateway

Reverse proxy: Rewrite, sarlavha siyosati va xato xaritasi:

```go
package main

import (
	"context"
	"errors"
	"log/slog"
	"net"
	"net/http"
	"net/http/httputil"
	"net/url"
	"time"
)

// newTransport upstream bilan aloqa uchun alohida, sozlangan Transport yaratadi.
func newTransport() *http.Transport {
	return &http.Transport{
		DialContext:           (&net.Dialer{Timeout: 2 * time.Second}).DialContext,
		MaxIdleConnsPerHost:   32,
		IdleConnTimeout:       90 * time.Second,
		ResponseHeaderTimeout: 300 * time.Millisecond, // namunada qisqa; productionda SLO'ga qarab
	}
}

func newProxy(target *url.URL, tr http.RoundTripper, log *slog.Logger) *httputil.ReverseProxy {
	return &httputil.ReverseProxy{
		Rewrite: func(r *httputil.ProxyRequest) {
			r.SetURL(target)
			r.SetXForwarded() // mijozdan kelgan X-Forwarded-* Rewrite'dan oldin olib tashlangan
			// Ichki sarlavhalarni mijoz yubora olmaydi: faqat auth middleware qo'yadi.
			r.Out.Header.Del("X-Client-ID")
			if id := clientID(r.In.Context()); id != "" {
				r.Out.Header.Set("X-Client-ID", id)
			}
			r.Out.Header.Set("X-Request-ID", requestID(r.In.Context()))
		},
		Transport: tr,
		ErrorHandler: func(w http.ResponseWriter, r *http.Request, err error) {
			var ne net.Error
			status := http.StatusBadGateway
			if errors.Is(err, context.DeadlineExceeded) || (errors.As(err, &ne) && ne.Timeout()) {
				status = http.StatusGatewayTimeout
			}
			if errors.Is(err, context.Canceled) {
				return // mijoz o'zi uzdi: javob yozishning foydasi yo'q
			}
			log.Warn("upstream xatosi", "path", r.URL.Path, "status", status, "err", err)
			http.Error(w, http.StatusText(status), status)
		},
	}
}
```

Middleware'lar: so'rov identifikatori, API kalit (o'zgarmas vaqtli solishtirish) va limiter:

```go
package main

import (
	"context"
	"crypto/rand"
	"crypto/subtle"
	"encoding/hex"
	"net/http"
	"sync"
	"time"
)

type ctxKey int

const (
	keyClient ctxKey = iota
	keyRequestID
)

func clientID(ctx context.Context) string  { s, _ := ctx.Value(keyClient).(string); return s }
func requestID(ctx context.Context) string { s, _ := ctx.Value(keyRequestID).(string); return s }

type Middleware func(http.Handler) http.Handler

// Chain middleware'larni tashqaridan ichkariga qarab o'raydi: Chain(h, a, b) -> a(b(h)).
func Chain(h http.Handler, mws ...Middleware) http.Handler {
	for i := len(mws) - 1; i >= 0; i-- {
		h = mws[i](h)
	}
	return h
}

func WithRequestID(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		b := make([]byte, 8)
		rand.Read(b)
		id := hex.EncodeToString(b)
		w.Header().Set("X-Request-ID", id)
		next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), keyRequestID, id)))
	})
}

// Auth API kalitini tekshiradi; kalitlar o'zgarmas vaqtda solishtiriladi.
func Auth(keys map[string]string) Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			given := []byte(r.Header.Get("X-API-Key"))
			var client string
			for k, id := range keys {
				if subtle.ConstantTimeCompare(given, []byte(k)) == 1 {
					client = id
				}
			}
			if client == "" {
				http.Error(w, "kalit yaroqsiz", http.StatusUnauthorized)
				return
			}
			next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), keyClient, client)))
		})
	}
}

// Limiter - klient bo'yicha token bucket.
type Limiter struct {
	mu      sync.Mutex
	rate    float64 // token/soniya
	burst   float64
	now     func() time.Time
	buckets map[string]*bucket
}

type bucket struct {
	tokens float64
	last   time.Time
}

func NewLimiter(rate float64, burst int, now func() time.Time) *Limiter {
	return &Limiter{rate: rate, burst: float64(burst), now: now, buckets: map[string]*bucket{}}
}

func (l *Limiter) Allow(key string) bool {
	l.mu.Lock()
	defer l.mu.Unlock()
	t := l.now()
	b, ok := l.buckets[key]
	if !ok {
		b = &bucket{tokens: l.burst, last: t}
		l.buckets[key] = b
	}
	b.tokens = min(l.burst, b.tokens+t.Sub(b.last).Seconds()*l.rate)
	b.last = t
	if b.tokens < 1 {
		return false
	}
	b.tokens--
	return true
}

func RateLimit(l *Limiter) Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if !l.Allow(clientID(r.Context())) {
				w.Header().Set("Retry-After", "1")
				http.Error(w, "so'rovlar chegarasi oshdi", http.StatusTooManyRequests)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
```

Yig'ish va sinov mijozi: uchta upstream (echo, sekin, o'lik), soxta soat bilan limiter:

```go
package main

import (
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"net/url"
	"sync/atomic"
	"time"
)

func buildGateway(routes map[string]*url.URL, keys map[string]string, lim *Limiter, log *slog.Logger) http.Handler {
	tr := newTransport()
	mux := http.NewServeMux()
	for prefix, target := range routes {
		mux.Handle(prefix+"/", http.StripPrefix(prefix, newProxy(target, tr, log)))
	}
	protected := Chain(mux, WithRequestID, Auth(keys), RateLimit(lim))
	// /healthz auth va limitdan tashqarida: alohida, qolganlari zanjir ichida
	root := http.NewServeMux()
	root.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) { w.WriteHeader(http.StatusOK) })
	root.Handle("/", protected)
	return root
}

func main() {
	log := slog.New(slog.NewTextHandler(io.Discard, nil))

	// upstream'lar
	echo := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "echo path=%s client=%q xff_set=%v fwd_proto=%q req_id_set=%v",
			r.URL.Path, r.Header.Get("X-Client-ID"), r.Header.Get("X-Forwarded-For") != "",
			r.Header.Get("X-Forwarded-Proto"), r.Header.Get("X-Request-ID") != "")
	}))
	defer echo.Close()
	slow := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(time.Second)
	}))
	defer slow.Close()
	dead := httptest.NewServer(http.NotFoundHandler())
	deadURL := dead.URL
	dead.Close() // port yopildi: ulanish rad etiladi

	mk := func(s string) *url.URL { u, _ := url.Parse(s); return u }
	routes := map[string]*url.URL{"/telemetry": mk(echo.URL), "/reports": mk(slow.URL), "/legacy": mk(deadURL)}
	var tick atomic.Int64
	clock := func() time.Time { return time.Unix(1_700_000_000, 0).Add(time.Duration(tick.Load()) * time.Second) }
	gw := httptest.NewServer(buildGateway(routes, map[string]string{"k-7f3a": "client-17"}, NewLimiter(1, 3, clock), log))
	defer gw.Close()

	call := func(path, key string, spoof bool) {
		req, _ := http.NewRequest("GET", gw.URL+path, nil)
		if key != "" {
			req.Header.Set("X-API-Key", key)
		}
		if spoof {
			req.Header.Set("X-Client-ID", "admin")
		}
		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			fmt.Println(path, "xato:", err)
			return
		}
		defer resp.Body.Close()
		b, _ := io.ReadAll(resp.Body)
		fmt.Printf("%-22s -> %d %s\n", path, resp.StatusCode, string(b[:len(b)-trailingNL(b)]))
	}

	call("/healthz", "", false)
	call("/telemetry/v1/points", "", false)
	call("/telemetry/v1/points", "k-7f3a", true)
	call("/reports/daily", "k-7f3a", false)
	call("/legacy/old", "k-7f3a", false)
	call("/telemetry/v1/points", "k-7f3a", false) // bucket: burst 3 tugadi
	tick.Add(2)                                   // 2 soniya o'tdi: 2 token qaytdi
	call("/telemetry/v1/points", "k-7f3a", false)
}

func trailingNL(b []byte) int {
	if len(b) > 0 && b[len(b)-1] == '\n' {
		return 1
	}
	return 0
}
```

Go 1.24.7, linux/amd64, `go run -race .`:

```text
/healthz               -> 200 
/telemetry/v1/points   -> 401 kalit yaroqsiz
/telemetry/v1/points   -> 200 echo path=/v1/points client="client-17" xff_set=true fwd_proto="http" req_id_set=true
/reports/daily         -> 504 Gateway Timeout
/legacy/old            -> 502 Bad Gateway
/telemetry/v1/points   -> 429 so'rovlar chegarasi oshdi
/telemetry/v1/points   -> 200 echo path=/v1/points client="client-17" xff_set=true fwd_proto="http" req_id_set=true
```

Qatorma-qator:

- `/healthz` auth va limitdan tashqarida 200 qaytaradi; qolgan yo'llar `Chain` ichidan o'tadi.
- Kalitsiz so'rov 401. Kalit bilan so'rov echo upstream'ga yetdi: `path=/v1/points` (prefiks olib tashlangan), `client="client-17"` (mijoz yuborgan `admin` almashtirilgan), `xff_set=true` va `fwd_proto="http"` (`SetXForwarded`), `req_id_set=true`.
- `/reports/daily` 1 soniya kutadigan upstream'ga boradi, 300 ms `ResponseHeaderTimeout` tufayli 504. `/legacy/old` yopilgan portga boradi: 502.
- To'rtinchi autentifikatsiyalangan so'rov burst (3) ni to'ldirgani uchun 429. 2 soniya "o'tgach" 2 token qaytadi va so'rov yana 200.

TLS: gateway tashqi tomondan TLS bilan xizmat qiladi va upstream bilan mTLS orqali gaplashishi mumkin. `crypto/tls` hujjatiga ko'ra `MinVersion` sukut bo'yicha TLS 1.2 (Go 1.24 hujjati), lekin uni ochiq yozish niyatni ko'rinadigan va kelajakdagi o'zgarishlarga chidamli qiladi. Quyidagi kod kompilyatsiya va `go vet`dan o'tgan, lekin haqiqiy sertifikatlar bo'lmagani uchun ishga tushirilmagan (faqat fayl yo'q xatosi qaytdi):

```go
package main

import (
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"net/http"
	"os"
	"time"
)

// upstreamTransport upstream bilan mTLS: gateway o'z sertifikatini ko'rsatadi va upstream sertifikatini ichki CA bilan tekshiradi.
func upstreamTransport(caFile, certFile, keyFile string) (*http.Transport, error) {
	caPEM, err := os.ReadFile(caFile)
	if err != nil {
		return nil, err
	}
	pool := x509.NewCertPool()
	if !pool.AppendCertsFromPEM(caPEM) {
		return nil, fmt.Errorf("%s: CA sertifikat topilmadi", caFile)
	}
	cert, err := tls.LoadX509KeyPair(certFile, keyFile)
	if err != nil {
		return nil, err
	}
	return &http.Transport{
		TLSClientConfig: &tls.Config{
			MinVersion:   tls.VersionTLS12,
			RootCAs:      pool,
			Certificates: []tls.Certificate{cert},
		},
		ResponseHeaderTimeout: 5 * time.Second,
	}, nil
}

func main() {
	srv := &http.Server{
		Addr:              ":8443",
		Handler:           http.NotFoundHandler(),
		TLSConfig:         &tls.Config{MinVersion: tls.VersionTLS12},
		ReadHeaderTimeout: 5 * time.Second,
	}
	_ = srv // srv.ListenAndServeTLS("gateway.pem", "gateway-key.pem")
	_, err := upstreamTransport("ca.pem", "gw.pem", "gw-key.pem")
	fmt.Println(err)
}
```

mTLS, sertifikat yangilash va CA boshqaruvi 75-darsda batafsil.

## Qachon qo'llamaslik kerak

- Faqat TLS tugatish, marshrutlash va oddiy limit kerak bo'lsa, tayyor reverse proxy (nginx, Envoy, bulut load balancer) yaxshiroq: ular sinovdan o'tgan, konfiguratsiya bilan boshqariladi va sizning kodingizga bog'liq emas. Go gateway maxsus mantiq (kalit bo'yicha tenant tanlash, biznes qoidasi bilan marshrutlash, yagona tilda sinov) kerak bo'lganda oqlanadi.
- Gateway'ga biznes mantiq qo'shmang. U ingichka bo'lib qolsin: auth, marshrutlash, limit, kuzatuv. Mantiq u yerga ko'chsa, gateway o'zgarishning bo'yniga tushgan hamma servisga bog'liq bo'g'inga aylanadi.
- Gateway bitta nosozlik nuqtasiga aylanishi mumkin. Bir nechta nusxa va readiness tekshiruvi (88, 100-darslar) kerak, shuningdek limiter holati nusxalar orasida ulashilmasligini hisobga oling.
- Streaming, uzun so'rovlar va WebSocket: `ReverseProxy`ning bu holatlardagi xatti-harakati va `WriteTimeout` ta'siri bu darsda tekshirilmagan; ishlatishdan oldin hujjat va sinov bilan tasdiqlang.
- Retry'ni gateway'da kiritishdan oldin idempotentlikni o'ylang: POST so'rovni qayta yuborish takror yaratadi (80-dars).

## Stack'da: Node.js bilan solishtirish

Node.js'da gateway odatda Express/Fastify va `http-proxy-middleware` yoki `http-proxy` bilan quriladi; ko'p hollarda esa nginx/Envoy oldinda turadi. Go'da `ReverseProxy` standart va tarmoq stack'i bitta jarayonda: har so'rov alohida goroutine, `Transport` esa ulanishlar pulini va timeout'larni bir joyda boshqaradi. Amaliy farqlar: Go'da `Rewrite` ning "kirish va chiqish alohida so'rov" modeli sarlavhalarni xavfsiz boshqarishni osonlashtiradi; Node'da sarlavhalarni `proxyReq` hodisasida o'zgartirish tez-tez ishonch chegarasi xatolariga olib keladi (muallifning tajribaviy bahosi). CPU og'ir gateway ishida (TLS, sarlavhalarni tahlil, JWT tekshiruvi) Go'da barcha yadrolar ishlatiladi, Node'da esa `cluster` yoki ko'p jarayon kerak; raqamli taqqoslash bu darsda berilmaydi, chunki o'lchanmagan.

## Xulosa

- `ReverseProxy.Rewrite` ishlating; `Director` Go 1.26 da eskirgan, chunki mijoz uning sarlavhalarini hop-by-hop deb yo'qotishi mumkin.
- Ishonch chegarasini gateway'da saqlang: ichki sarlavhalarni mijozdan olib tashlab, faqat o'zingiz aniqlagan qiymatni qo'ying.
- Alohida `Transport` yarating: dial va javob sarlavhasi timeout'lari, `MaxIdleConnsPerHost` (standart 2) ni parallellikka moslang.
- `ErrorHandler` timeout'ni 504, boshqa aloqa xatosini 502 ga tarjima qilsin; mijoz uzilishini e'tiborsiz qoldiring.
- Token bucket oddiy va foydali, lekin xotira o'sishi va nusxalar bo'yicha taqsimlanishi cheklov; umumiy limit uchun markaziy saqlash kerak.
- Gateway ingichka bo'lsin; faqat TLS va marshrutlash kerak bo'lsa, tayyor proxy ma'qul.
