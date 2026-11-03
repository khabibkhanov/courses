---
n: 95
slug: case-telemetriya
title: "Case study: telemetriya qabul qilish servisi"
summary: "GPS nuqtalarini HTTP orqali qabul qilib, chegaralangan navbat va batch yozuvchi orqali bazaga yozadigan servis: kirishni tekshirish, hammasi-yoki-hech-narsa qabul qilish, backpressure, qayta urinish, tartibli to'xtash va nima yo'qolishi mumkinligi."
duration: 55
sources:
  - id: 100go
    note: "HTTP server timeout'lari, kontekst va goroutine hayoti, xatolarni qayta ishlash bilan bog'liq xatolar"
  - id: pkg-net-http
    note: "Server, Shutdown, MaxBytesReader va MaxBytesError, ServeMux naqshlari, Request.PathValue"
  - id: pgx
    note: "pgx: Postgres bilan ulanish va ommaviy yozish (CopyFrom) variantlari; bu darsda faqat database/sql orqali, drayver kodi kompilyatsiya qilinmagan"
quiz:
  - q: "Mijoz 500 nuqta yubordi, pipeline'da faqat 300 joy bor. Servis birinchi 300 tasini qabul qilib, qolganini rad etsa, qanday muammo tug'iladi?"
    options:
      - "Hech qanday muammo: mijoz faqat rad etilganlarini qayta yuboradi"
      - "Mijoz qaysi nuqtalar qabul qilinganini bilmaydi va butun so'rovni qayta yuboradi; qabul qilingan 300 ta ikkinchi marta yoziladi. Shuning uchun so'rov to'liq qabul qilinadi yoki to'liq rad etiladi"
      - "Servis panic qiladi"
      - "HTTP bunday javobni qaytarishga ruxsat bermaydi"
    answer: 1
    explain: "Qisman qabul qilish mijoz uchun noaniq holat yaratadi. To'liq qabul yoki to'liq rad (503 + Retry-After) semantikasi oddiy va idempotent yozuv bilan birga xavfsiz. Namunadagi `Submit` shuni CAS bilan amalga oshiradi."
  - q: "`Pipeline.Submit` navbatga `p.queue <- pt` bilan yozadi, lekin u hech qachon bloklanmaydi. Nima uchun?"
    options:
      - "Kanal buferi cheksiz"
      - "Go kanalga yozishni hech qachon bloklamaydi"
      - "Yozish alohida goroutine'da bajariladi"
      - "pending hisoblagichi Limit dan oshmaydi (CAS bilan band qilingan), kanal sig'imi esa Limit ga teng, ya'ni band qilingan joylar soni sig'imdan ko'p bo'la olmaydi"
    answer: 3
    explain: "Invariant: navbatdagi va hali flush tugamagan nuqtalar soni <= Limit == cap(queue). Hisoblagichni worker flush tugagach kamaytiradi, shuning uchun yozilayotgan batchdagi nuqtalar ham hisobga kiradi. Bu qadar qat'iy invariant bo'lmasa, yuborish bloklanib, HTTP handler'ni ushlab qolardi."
  - q: "Servis to'xtatilganda `srv.Shutdown`dan keyin `pl.Close` chaqiriladi. Teskari tartib (avval Close, keyin Shutdown) nima qiladi?"
    options:
      - "Hech narsa o'zgarmaydi"
      - "Close'dan keyin ham ishlayotgan handler'lar Submit chaqiradi va ErrClosed oladi (503), ya'ni qabul qilingan so'rovlar rad etiladi; to'g'ri tartibda avval yangi so'rovlar to'xtaydi, keyin navbat bo'shatiladi"
      - "Pipeline'dagi nuqtalar yo'qolmaydi, lekin server yopilmaydi"
      - "Dastur deadlock bo'ladi"
    answer: 1
    explain: "Ishlab chiqaruvchilar (HTTP) avval to'xtashi kerak, so'ng iste'molchi (pipeline) navbatni tugatadi. Teskari tartibda hali jarayondagi so'rovlar yopilgan pipeline'ga uriladi. `Shutdown` ishlayotgan so'rovlar tugashini kutadi."
  - q: "Handler muvaffaqiyatda 202 Accepted qaytaradi. Bu mijozga nimani bildiradi?"
    options:
      - "Nuqtalar bazaga yozilgan va commit qilingan"
      - "Nuqtalar mijozga qaytarilgan"
      - "So'rov qabul qilindi va qayta ishlanadi, lekin ishlov hali tugamagan bo'lishi mumkin"
      - "So'rov noto'g'ri, qayta yuboring"
    answer: 2
    explain: "202 'qabul qilindi, qayta ishlash tugamagan' degani. Bu halol status: nuqtalar bufer va batch navbatida, jarayon yiqilsa yo'qolishi mumkin. 200/201 yozuv amalga oshganini anglatadi; bu servis uni va'da qilmaydi."
  - q: "`http.MaxBytesReader` 1 MiB bilan o'rnatilgan. Mijoz 5 MiB tana yubordi. Dekoder qanday xato oladi va handler qaysi statusni qaytaradi?"
    options:
      - "io.EOF, 400"
      - "*http.MaxBytesError, 413 (Request Entity Too Large)"
      - "context.DeadlineExceeded, 504"
      - "Xato yo'q, tana kesilib o'qiladi"
    answer: 1
    explain: "MaxBytesReader limitdan oshganda `*http.MaxBytesError` qaytaradi (`errors.As` bilan ajratiladi), handler 413 beradi. Bu servisni xotirani to'ldiradigan katta tanalardan himoya qiladi. `io.LimitReader` esa jimgina kesadi va xato bermaydi."
  - q: "Sink uch urinishdan keyin ham xato qaytardi. Namunadagi pipeline nima qiladi va production'da bu yetarlimi?"
    options:
      - "Batchni `dropped` hisoblagichiga qo'shib, xato logini yozadi; production'da ma'lumot yo'qotilgani uchun dead-letter yoki bardoshli navbat kerak"
      - "Servisni to'xtatadi"
      - "Batchni cheksiz qayta urinadi"
      - "Batchni mijozga qaytaradi"
    answer: 0
    explain: "Mijozga 202 allaqachon qaytgan, shuning uchun endi uni xabardor qilib bo'lmaydi. Namuna halol yo'qotadi va hisoblaydi (dropped). Yo'qotish qabul qilinmasa, tashlangan batch diskka, outbox jadvaliga yoki navbatga yoziladi (80 va 97-darslar)."
task:
  title: "Hammasi-yoki-hech-narsa band qilish: CAS Reserve"
  prompt: |
    `Limiter.Reserve(n)` pipeline sig'imidan `n` joyni band qiladi yoki rad etadi. Hozirgi realizatsiya hisoblagichni avval o'qiydi, keyin alohida qadamda oshiradi, shuning uchun parallel chaqiruvlar limitdan oshib ketishi mumkin (data race bo'lmasa ham mantiqiy poyga).

    `Reserve`ni compare-and-swap sikli bilan qayta yozing: `Load`, limit tekshiruvi va `CompareAndSwap` bitta atomik band qilishni tashkil qilsin. Muvaffaqiyatsiz CAS'da sikl qayta urinadi. `main`ni o'zgartirmang.

    Kutilgan natija: 100 ta goroutine 3 tadan band qilishga urinsa, jami band qilingan 99 (33 muvaffaqiyatli chaqiruv), va `oshdi: false` har ishga tushirishda.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "runtime"
        "sync"
        "sync/atomic"
    )

    type Limiter struct {
        pending atomic.Int64
        limit   int64
    }

    // Reserve n ta joy band qiladi. Muammo: tekshirish va qo'shish alohida qadamlar,
    // shuning uchun parallel chaqiruvlar limitdan oshib ketishi mumkin.
    func (l *Limiter) Reserve(n int64) bool {
        if l.pending.Load()+n > l.limit {
            return false
        }
        runtime.Gosched()
        l.pending.Add(n)
        return true
    }

    func main() {
        l := &Limiter{limit: 100}
        var wg sync.WaitGroup
        var accepted atomic.Int64
        for range 100 {
            wg.Add(1)
            go func() {
                defer wg.Done()
                if l.Reserve(3) {
                    accepted.Add(3)
                }
            }()
        }
        wg.Wait()
        fmt.Println("band qilingan:", accepted.Load(), "limit:", l.limit, "oshdi:", accepted.Load() > l.limit)
    }
  solution: |
    package main

    import (
        "fmt"
        "sync"
        "sync/atomic"
    )

    type Limiter struct {
        pending atomic.Int64
        limit   int64
    }

    // Reserve n ta joyni hammasi-yoki-hech-narsa tarzida band qiladi: CAS sikli tekshirish
    // va qo'shishni bitta atomik qadamga aylantiradi.
    func (l *Limiter) Reserve(n int64) bool {
        for {
            cur := l.pending.Load()
            if cur+n > l.limit {
                return false
            }
            if l.pending.CompareAndSwap(cur, cur+n) {
                return true
            }
        }
    }

    func main() {
        l := &Limiter{limit: 100}
        var wg sync.WaitGroup
        var accepted atomic.Int64
        for range 100 {
            wg.Add(1)
            go func() {
                defer wg.Done()
                if l.Reserve(3) {
                    accepted.Add(3)
                }
            }()
        }
        wg.Wait()
        fmt.Println("band qilingan:", accepted.Load(), "limit:", l.limit, "oshdi:", accepted.Load() > l.limit)
    }
  solutionNotes: |
    - `Load` + `Add` alohida atomik amallar bo'lsa-da, ularning orasida boshqa goroutine ham `Add` qilishi mumkin: tekshiruv eskirgan qiymatga tayanadi (TOCTOU).
    - `CompareAndSwap(cur, cur+n)` faqat qiymat hali `cur` bo'lsa o'zgartiradi; aks holda sikl yangi qiymatni o'qib qayta tekshiradi.
    - Limitga yetganda sikl `false` bilan chiqadi, shuning uchun band qilingan joy hech qachon limitdan oshmaydi. 100 goroutine x 3 = 300 so'rovdan faqat 33 tasi (99) sig'adi.
    - Bu 95-dars pipeline'idagi `Submit` ning yadrosi. Mutex ham to'g'ri yechim bo'lardi; atomic variant bu yerda bitta o'zgaruvchi uchun yengilroq.
  checklist:
    - "`Reserve` `Load` va `CompareAndSwap` sikli bilan yozilgan"
    - "Band qilingan joy limitdan hech qachon oshmaydi (`oshdi: false`)"
    - "Chiqish har ishga tushirishda `band qilingan: 99`"
    - "`go run -race` ogohlantirishsiz o'tadi"
    - "Imzo va `main` o'zgarmagan"
---

## Muammo

Avtopark monitoring platformasida har mashinadagi qurilma bir necha soniyada bir marta GPS nuqtasi va yoqilg'i datchigi ko'rsatkichini yuboradi. Yuzlab mashina bo'lsa, servisga bir vaqtda ko'p mijoz ulanadi, ularning har biri yig'ib kelgan nuqtalar to'plamini yuboradi (qurilma aloqa uzilganda yig'ib, tiklanganda hammasini yuboradi, shuning uchun pik yuk yaxshi bashorat qilinmaydi). Servis uchta narsani bir vaqtda uddalashi kerak: noto'g'ri ma'lumotni toza rad etish, bazani ortiqcha yuklamaslik va yuk oshganda yiqilib qolmasdan, boshqariladigan tarzda "hozir olmayman" deb aytish.

Oddiy yondashuv - handler ichida har nuqtani `INSERT` qilish. U kichik yukda ishlaydi, lekin yuk oshganda baza ulanishlari to'ladi, handler'lar kutadi, mijozlar timeout bo'lib qayta yuboradi va yuk yanada oshadi. Bu darsda 91-94 darslardagi g'oyalar bitta ishlaydigan servisga birlashadi: qatlamlar (91), chegarada tekshirish (92), pipeline va degradatsiya (93), batch yozish (94). Kod to'liq, standart kutubxona bilan lokal ishlaydi; faqat Postgres adapteri ishga tushirilmagan.

## Asosiy g'oya

### Talablar va ularning dizayniga ta'siri

Avval talablarni aniq yozamiz, chunki dizayn ulardan kelib chiqadi:

| Talab | Qaror |
|---|---|
| Noto'g'ri nuqta bazaga tushmasin | Chegarada `Validate` (domen qoidalari), 422 |
| Katta/yomon tana xotirani to'ldirmasin | `MaxBytesReader` 1 MiB, ko'pi bilan 500 nuqta |
| Baza yukini silliqlash | Chegaralangan navbat + batch yozuvchilar |
| Yuk oshsa servis yiqilmasin | Navbat to'lganda 503 + `Retry-After` |
| Mijoz retry'si xavfsiz bo'lsin | So'rov to'liq qabul/to'liq rad, yozuv idempotent |
| Deploy paytida ma'lumot yo'qolmasin | Tartibli to'xtash: HTTP, so'ng pipeline |
| Baza vaqtincha uzilsa | Backoff bilan qayta urinish, so'ng yo'qotishni hisoblash |

### Javob semantikasi: 202

Handler muvaffaqiyatda 202 Accepted qaytaradi: nuqtalar qabul qilindi, lekin hali bazada emas. Bu halol, chunki ular xotiradagi navbatda. Agar mahsulot "qaytgan javob = saqlangan" kafolatini talab qilsa, dizayn boshqa bo'ladi (sinxron yozish yoki bardoshli navbat) va throughput hisobiga ketadi. Telemetriyada bir necha soniyalik oynani qabul qilish keng tarqalgan, lekin bu biznes qarori va u hujjatlashtirilishi kerak.

### Hammasi-yoki-hech-narsa qabul

Navbatga joy yetmasa, servis butun so'rovni rad etadi. Qisman qabul qilish mijozni noaniq holatga soladi: qaysi nuqtalar olingani ma'lum emas, shuning uchun u hammasini qayta yuboradi va qabul qilinganlar takrorlanadi. Joyni band qilish `pending` hisoblagichida atomik CAS sikli bilan bajariladi (95-dars topshirig'ida shu yadroni mashq qilasiz). Navbat kanalining sig'imi `Limit` ga teng, `pending` esa hech qachon `Limit` dan oshmagani uchun kanalga yuborish hech qachon bloklanmaydi. `pending` navbatdagi va hali flush tugamagan nuqtalarni birgalikda sanaydi: worker uni flush tugagach kamaytiradi. Natijada servis xotirasi `Limit` bilan yuqoridan cheklangan.

## Chuqurroq: dizayn qarorlari

### Qatlamlar

Tuzilma 91-darsdagi qoidaga amal qiladi:

```text
ingest/
  cmd/ingestd/main.go           # composition root, signal, tartibli to'xtash
  internal/point/               # domen: Point va Validate (soatni tashqaridan oladi)
  internal/pipeline/            # navbat, batch yozuvchilar, Sink interface (iste'molchi tomonda)
  internal/httpapi/             # handler, DTO, status tanlash
  internal/sqlsink/             # Sink'ning database/sql adapteri
```

`Sink` interface'i `pipeline` paketida e'lon qilingan: `MemSink` (xotira) va `sqlsink.Sink` uni bajaradi. `httpapi` pipeline'ni emas, bitta metodli `Submitter` interface'ini ko'radi, shuning uchun handler sinovlari haqiqiy pipeline'siz ham yoziladi.

### Backpressure va qayta urinish

Worker'lar bitta umumiy kanaldan o'qiydi (`Workers` ta), har biri o'z buferini yig'adi va hajm yoki vaqt bo'yicha flush qiladi (94-dars). Flush `Sink.WriteBatch` ni mustaqil deadline bilan chaqiradi. Xato bo'lsa, `Attempts` marta backoff bilan qayta uriniladi; barcha urinishlar yiqilsa batch `dropped` hisoblagichiga o'tadi va xato logga yoziladi. Bu halol yo'qotish: mijozga 202 allaqachon qaytgan. Yo'qotish qabul qilinmasa, tashlangan batch dead-letter jadvaliga yoki diskka yoziladi (80 va 97-darslar).

Worker'ning qayta urinish paytida `time.Sleep` bilan kutishi uni boshqa batchlardan band qiladi. Bu soddalik uchun qilingan va uning narxi bor: baza uzoq uzilsa, hamma worker'lar kutadi, navbat to'ladi va servis 503 qaytara boshlaydi. Aynan shu xatti-harakat kerak (yuk bazaga o'tib ketmaydi), lekin u metrikada ko'rinishi shart (85-dars).

### Server timeout'lari va to'xtatish

`http.Server` da `ReadHeaderTimeout`, `ReadTimeout`, `WriteTimeout` va `IdleTimeout` berilgan: bularsiz sekin mijoz ulanishlarni cheksiz ushlab turishi mumkin (72-dars). To'xtatish `signal.NotifyContext` bilan boshlanadi: `SIGTERM` kelganda kontekst bekor bo'ladi, `srv.Shutdown` yangi ulanishlarni to'xtatib, ishlayotgan so'rovlarni kutadi, undan keyingina `pl.Close` navbatni bo'shatadi. Tartib muhim: pipeline avval yopilsa, hali jarayondagi so'rovlar `ErrClosed` oladi.

`Pipeline.Close` kanalni yopadi, `Submit` esa `RWMutex`ning o'qish qulfini ushlaydi: yopilish yozuvchi qulfni oladi, shuning uchun yopiq kanalga yuborish mumkin emas (94-darsdagi panic xavfi shu bilan yo'qotilgan).

## Misol: to'liq servis

Domen: nuqta va uning qoidalari. Soat tashqaridan beriladi (91-dars), xatolar `errors.Join` bilan yig'iladi:

```go
// Package point - telemetriya nuqtasi va uning domen qoidalari.
package point

import (
	"errors"
	"fmt"
	"time"
)

type Point struct {
	VehicleID string    `json:"vehicle_id"`
	Lat       float64   `json:"lat"`
	Lon       float64   `json:"lon"`
	At        time.Time `json:"at"`
}

// Validate nuqtani tekshiradi. now tashqaridan beriladi: sinovda vaqt qotirilishi mumkin.
func (p Point) Validate(now time.Time) error {
	var errs []error
	if p.VehicleID == "" || len(p.VehicleID) > 32 {
		errs = append(errs, errors.New("vehicle_id: 1-32 belgi"))
	}
	if p.Lat < -90 || p.Lat > 90 {
		errs = append(errs, fmt.Errorf("lat %v: -90..90 oralig'ida emas", p.Lat))
	}
	if p.Lon < -180 || p.Lon > 180 {
		errs = append(errs, fmt.Errorf("lon %v: -180..180 oralig'ida emas", p.Lon))
	}
	if p.At.IsZero() || p.At.After(now.Add(5*time.Minute)) {
		errs = append(errs, errors.New("at: bo'sh yoki kelajakda"))
	}
	return errors.Join(errs...)
}
```

Pipeline: navbat, worker'lar, qayta urinish va hisoblagichlar:

```go
// Package pipeline - qabul qilingan nuqtalarni chegaralangan navbat orqali batch qilib Sink'ka yozadi.
package pipeline

import (
	"context"
	"errors"
	"log/slog"
	"sync"
	"sync/atomic"
	"time"

	"example.com/ingest/internal/point"
)

var (
	ErrOverloaded = errors.New("pipeline to'lgan")
	ErrClosed     = errors.New("pipeline yopilgan")
)

// Sink - batch yozuvchi. Iste'molchi (pipeline) e'lon qiladi, SQL va xotira adapterlari uni bajaradi.
type Sink interface {
	WriteBatch(ctx context.Context, pts []point.Point) error
}

type Config struct {
	Limit    int           // navbatdagi va yozilayotgan nuqtalar yuqori chegarasi
	Workers  int           // parallel yozuvchilar soni
	Size     int           // batch hajmi
	Every    time.Duration // batch vaqt chegarasi
	Attempts int           // Sink xatosida urinishlar soni
	Backoff  time.Duration // urinishlar orasidagi boshlang'ich kutish
}

type Stats struct{ Accepted, Rejected, Written, Dropped int64 }

type Pipeline struct {
	cfg     Config
	sink    Sink
	log     *slog.Logger
	queue   chan point.Point
	pending atomic.Int64
	mu      sync.RWMutex // Submit RLock, Close Lock: yopilgan kanalga yozishning oldini oladi
	closed  bool
	wg      sync.WaitGroup

	accepted, rejected, written, dropped atomic.Int64
}

func New(sink Sink, log *slog.Logger, cfg Config) *Pipeline {
	p := &Pipeline{cfg: cfg, sink: sink, log: log, queue: make(chan point.Point, cfg.Limit)}
	for range cfg.Workers {
		p.wg.Add(1)
		go p.worker()
	}
	return p
}

// Submit nuqtalarni to'liq qabul qiladi yoki to'liq rad etadi (qisman qabul yo'q).
func (p *Pipeline) Submit(pts []point.Point) error {
	p.mu.RLock()
	defer p.mu.RUnlock()
	if p.closed {
		return ErrClosed
	}
	n := int64(len(pts))
	for {
		cur := p.pending.Load()
		if cur+n > int64(p.cfg.Limit) {
			p.rejected.Add(n)
			return ErrOverloaded
		}
		if p.pending.CompareAndSwap(cur, cur+n) {
			break
		}
	}
	// pending <= Limit == cap(queue): bu yuborish hech qachon bloklanmaydi.
	for _, pt := range pts {
		p.queue <- pt
	}
	p.accepted.Add(n)
	return nil
}

// Close yangi nuqtalarni to'xtatadi, navbatni yozib bo'lguncha yoki ctx tugaguncha kutadi.
func (p *Pipeline) Close(ctx context.Context) error {
	p.mu.Lock()
	if !p.closed {
		p.closed = true
		close(p.queue)
	}
	p.mu.Unlock()

	done := make(chan struct{})
	go func() { p.wg.Wait(); close(done) }()
	select {
	case <-done:
		return nil
	case <-ctx.Done():
		return context.Cause(ctx)
	}
}

func (p *Pipeline) Stats() Stats {
	return Stats{p.accepted.Load(), p.rejected.Load(), p.written.Load(), p.dropped.Load()}
}

func (p *Pipeline) worker() {
	defer p.wg.Done()
	buf := make([]point.Point, 0, p.cfg.Size)
	timer := time.NewTimer(p.cfg.Every)
	defer timer.Stop()
	for {
		select {
		case pt, ok := <-p.queue:
			if !ok {
				p.flush(buf)
				return
			}
			if buf = append(buf, pt); len(buf) >= p.cfg.Size {
				p.flush(buf)
				buf = buf[:0]
			}
		case <-timer.C:
			p.flush(buf)
			buf = buf[:0]
			timer.Reset(p.cfg.Every)
		}
	}
}

func (p *Pipeline) flush(buf []point.Point) {
	if len(buf) == 0 {
		return
	}
	n := int64(len(buf))
	defer p.pending.Add(-n)

	delay := p.cfg.Backoff
	var err error
	for attempt := 1; attempt <= p.cfg.Attempts; attempt++ {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		err = p.sink.WriteBatch(ctx, buf)
		cancel()
		if err == nil {
			p.written.Add(n)
			return
		}
		p.log.Warn("batch yozilmadi", "attempt", attempt, "n", n, "err", err)
		time.Sleep(delay)
		delay *= 2
	}
	p.dropped.Add(n)
	p.log.Error("batch tashlandi", "n", n, "err", err)
}
```

Sinov va lokal ishga tushirish uchun xotiradagi `Sink`. U `Gate` (yozishni to'xtatib turish) va `Fail` (dastlabki xatolar) bilan sinovlarda yuk va xatoni modellashtiradi:

```go
package pipeline

import (
	"context"
	"sync"

	"example.com/ingest/internal/point"
)

// MemSink - xotiradagi Sink: lokal ishga tushirish va sinovlar uchun.
type MemSink struct {
	mu   sync.Mutex
	pts  []point.Point
	Gate chan struct{} // nil bo'lmasa, WriteBatch shu kanal yopilguncha kutadi
	Fail int           // dastlabki Fail ta chaqiruv xato qaytaradi
}

func (m *MemSink) WriteBatch(ctx context.Context, pts []point.Point) error {
	if m.Gate != nil {
		select {
		case <-m.Gate:
		case <-ctx.Done():
			return ctx.Err()
		}
	}
	m.mu.Lock()
	defer m.mu.Unlock()
	if m.Fail > 0 {
		m.Fail--
		return context.DeadlineExceeded
	}
	m.pts = append(m.pts, pts...)
	return nil
}

func (m *MemSink) Len() int {
	m.mu.Lock()
	defer m.mu.Unlock()
	return len(m.pts)
}
```

HTTP chegarasi: tana limiti, tekshirish, status tanlash:

```go
// Package httpapi - ingestion servisining HTTP chegarasi.
package httpapi

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"
	"time"

	"example.com/ingest/internal/pipeline"
	"example.com/ingest/internal/point"
)

const (
	maxBody   = 1 << 20 // 1 MiB
	maxPoints = 500
)

type Submitter interface {
	Submit(pts []point.Point) error
}

type request struct {
	Points []point.Point `json:"points"`
}

type response struct {
	Accepted int    `json:"accepted,omitempty"`
	Error    string `json:"error,omitempty"`
}

func New(sub Submitter, now func() time.Time) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	})
	mux.HandleFunc("POST /v1/points", func(w http.ResponseWriter, r *http.Request) {
		r.Body = http.MaxBytesReader(w, r.Body, maxBody)
		var req request
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			status := http.StatusBadRequest
			var mbe *http.MaxBytesError
			if errors.As(err, &mbe) {
				status = http.StatusRequestEntityTooLarge
			}
			reply(w, status, response{Error: "yaroqsiz so'rov tanasi"})
			return
		}
		if len(req.Points) == 0 || len(req.Points) > maxPoints {
			reply(w, http.StatusUnprocessableEntity, response{Error: "points: 1..500 ta nuqta kerak"})
			return
		}
		t := now()
		for i, p := range req.Points {
			if err := p.Validate(t); err != nil {
				reply(w, http.StatusUnprocessableEntity, response{Error: "points[" + strconv.Itoa(i) + "]: " + strings.ReplaceAll(err.Error(), "\n", "; ")})
				return
			}
		}
		switch err := sub.Submit(req.Points); {
		case errors.Is(err, pipeline.ErrOverloaded), errors.Is(err, pipeline.ErrClosed):
			w.Header().Set("Retry-After", "1")
			reply(w, http.StatusServiceUnavailable, response{Error: err.Error()})
		case err != nil:
			reply(w, http.StatusInternalServerError, response{Error: "ichki xato"})
		default:
			reply(w, http.StatusAccepted, response{Accepted: len(req.Points)})
		}
	})
	return mux
}

func reply(w http.ResponseWriter, status int, v response) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}
```

Postgres adapteri. Bu fayl `go vet` dan o'tgan, lekin Postgres bo'lmagani uchun ishga tushirilmagan. Drayver (masalan pgx'ning `database/sql` ulagichi) alohida import qilinadi va u sandbox'da yuklanmaydi, shuning uchun ulanish kodi kompilyatsiya qilinmagan:

```go
// Package sqlsink - Sink'ning database/sql (PostgreSQL) adapteri.
package sqlsink

import (
	"context"
	"database/sql"
	"fmt"
	"strings"

	"example.com/ingest/internal/point"
)

const (
	cols     = 4
	maxRows  = 1000 // bitta so'rovdagi qatorlar: parametr soni = maxRows*cols
	insertSQ = "INSERT INTO points (vehicle_id, lat, lon, at) VALUES "
	onConfl  = " ON CONFLICT (vehicle_id, at) DO NOTHING"
)

type Sink struct{ DB *sql.DB }

// WriteBatch nuqtalarni bitta tranzaksiyada, maxRows li ko'p qatorli INSERT'lar bilan yozadi.
// (vehicle_id, at) bo'yicha UNIQUE cheklov mijoz retry'larini idempotent qiladi.
func (s Sink) WriteBatch(ctx context.Context, pts []point.Point) error {
	tx, err := s.DB.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("begin: %w", err)
	}
	defer tx.Rollback()

	for start := 0; start < len(pts); start += maxRows {
		end := min(start+maxRows, len(pts))
		q, args := build(pts[start:end])
		if _, err := tx.ExecContext(ctx, q, args...); err != nil {
			return fmt.Errorf("insert [%d:%d]: %w", start, end, err)
		}
	}
	return tx.Commit()
}

func build(pts []point.Point) (string, []any) {
	var sb strings.Builder
	sb.WriteString(insertSQ)
	args := make([]any, 0, len(pts)*cols)
	for i, p := range pts {
		if i > 0 {
			sb.WriteByte(',')
		}
		n := i * cols
		fmt.Fprintf(&sb, "($%d,$%d,$%d,$%d)", n+1, n+2, n+3, n+4)
		args = append(args, p.VehicleID, p.Lat, p.Lon, p.At)
	}
	sb.WriteString(onConfl)
	return sb.String(), args
}
```

Composition root:

```go
package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"example.com/ingest/internal/httpapi"
	"example.com/ingest/internal/pipeline"
)

func main() {
	log := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	if err := run(log); err != nil {
		log.Error("to'xtadi", "err", err)
		os.Exit(1)
	}
}

func run(log *slog.Logger) error {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	addr := os.Getenv("INGEST_ADDR")
	if addr == "" {
		addr = ":8080"
	}

	sink := &pipeline.MemSink{} // Postgres uchun: sqlsink.Sink{DB: db}
	pl := pipeline.New(sink, log, pipeline.Config{
		Limit: 10_000, Workers: 4, Size: 500, Every: 200 * time.Millisecond,
		Attempts: 3, Backoff: 100 * time.Millisecond,
	})
	srv := &http.Server{
		Addr:              addr,
		Handler:           httpapi.New(pl, time.Now),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	errc := make(chan error, 1)
	go func() { errc <- srv.ListenAndServe() }()
	log.Info("ishga tushdi", "addr", addr)

	select {
	case err := <-errc:
		return err
	case <-ctx.Done():
	}

	// Tartib muhim: avval HTTP (yangi so'rov yo'q), keyin pipeline (navbat bo'shaydi).
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	if err := srv.Shutdown(shutdownCtx); err != nil && !errors.Is(err, http.ErrServerClosed) {
		return err
	}
	if err := pl.Close(shutdownCtx); err != nil {
		return err
	}
	st := pl.Stats()
	log.Info("to'xtatildi", "accepted", st.Accepted, "written", st.Written, "dropped", st.Dropped)
	return nil
}
```

Postgres ulash uchun `main`dagi `sink` qatori o'zgaradi (kompilyatsiya qilinmagan, drayver paketi tashqi):

```go
// import _ "github.com/jackc/pgx/v5/stdlib"
db, err := sql.Open("pgx", os.Getenv("DATABASE_URL"))
if err != nil {
	return err
}
defer db.Close()
db.SetMaxOpenConns(20) // qiymatni o'z bazangizning ulanish limitiga qarab tanlang
sink := sqlsink.Sink{DB: db}
```

### Sinovlar va ishga tushirish

Uchta sinov servis xatti-harakatini tekshiradi: qabul va drenaj (birinchi yozish ataylab xato beradi, retry ishlaydi), validatsiya va to'lib ketish:

```go
package httpapi_test

import (
	"context"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"example.com/ingest/internal/httpapi"
	"example.com/ingest/internal/pipeline"
)

var fixed = func() time.Time { return time.Date(2026, 11, 3, 9, 0, 0, 0, time.UTC) }

func newPipeline(sink pipeline.Sink, limit int) *pipeline.Pipeline {
	return pipeline.New(sink, slog.New(slog.NewTextHandler(io.Discard, nil)), pipeline.Config{
		Limit: limit, Workers: 2, Size: 3, Every: 10 * time.Millisecond, Attempts: 3, Backoff: time.Millisecond,
	})
}

func post(t *testing.T, h http.Handler, body string) (int, string) {
	t.Helper()
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, httptest.NewRequest("POST", "/v1/points", strings.NewReader(body)))
	return rec.Code, strings.TrimSpace(rec.Body.String())
}

const okBody = `{"points":[
 {"vehicle_id":"truck-7","lat":41.31,"lon":69.27,"at":"2026-11-03T08:59:00Z"},
 {"vehicle_id":"truck-7","lat":41.32,"lon":69.28,"at":"2026-11-03T08:59:05Z"},
 {"vehicle_id":"truck-9","lat":41.33,"lon":69.29,"at":"2026-11-03T08:59:10Z"}]}`

func TestAcceptAndDrain(t *testing.T) {
	sink := &pipeline.MemSink{Fail: 1} // birinchi yozish xato: retry ishlashi kerak
	pl := newPipeline(sink, 100)
	h := httpapi.New(pl, fixed)

	code, body := post(t, h, okBody)
	t.Logf("valid: %d %s", code, body)
	if code != http.StatusAccepted {
		t.Fatalf("status = %d", code)
	}
	if err := pl.Close(context.Background()); err != nil {
		t.Fatal(err)
	}
	st := pl.Stats()
	t.Logf("stats: %+v, sink: %d", st, sink.Len())
	if sink.Len() != 3 || st.Written != 3 || st.Dropped != 0 {
		t.Fatalf("kutilmagan: %+v sink=%d", st, sink.Len())
	}
}

func TestValidation(t *testing.T) {
	pl := newPipeline(&pipeline.MemSink{}, 100)
	defer pl.Close(context.Background())
	h := httpapi.New(pl, fixed)
	code, body := post(t, h, `{"points":[{"vehicle_id":"","lat":95,"lon":0,"at":"2026-11-03T08:59:00Z"}]}`)
	t.Logf("invalid: %d %s", code, body)
	if code != http.StatusUnprocessableEntity {
		t.Fatalf("status = %d", code)
	}
}

func TestOverloadRejectsWholeRequest(t *testing.T) {
	gate := make(chan struct{})
	sink := &pipeline.MemSink{Gate: gate}
	pl := newPipeline(sink, 4) // sig'im: 4 nuqta
	h := httpapi.New(pl, fixed)

	c1, b1 := post(t, h, okBody) // 3 nuqta sig'adi
	c2, b2 := post(t, h, okBody) // 3+3 > 4: butunlay rad
	t.Logf("1-so'rov: %d %s", c1, b1)
	t.Logf("2-so'rov: %d %s", c2, b2)
	if c1 != http.StatusAccepted || c2 != http.StatusServiceUnavailable {
		t.Fatalf("statuslar: %d %d", c1, c2)
	}
	close(gate)
	if err := pl.Close(context.Background()); err != nil {
		t.Fatal(err)
	}
	st := pl.Stats()
	t.Logf("stats: %+v", st)
	if st.Accepted != 3 || st.Rejected != 3 || st.Written != 3 {
		t.Fatalf("kutilmagan: %+v", st)
	}
	if code, _ := post(t, h, okBody); code != http.StatusServiceUnavailable {
		t.Fatalf("yopilgandan keyin status = %d", code)
	}
}
```

Go 1.24.7, linux/amd64, `go test -race -v`:

```text
    handler_test.go:43: valid: 202 {"accepted":3}
    handler_test.go:51: stats: {Accepted:3 Rejected:0 Written:3 Dropped:0}, sink: 3
--- PASS: TestAcceptAndDrain (0.00s)
    handler_test.go:62: invalid: 422 {"error":"points[0]: vehicle_id: 1-32 belgi; lat 95: -90..90 oralig'ida emas"}
--- PASS: TestValidation (0.00s)
    handler_test.go:76: 1-so'rov: 202 {"accepted":3}
    handler_test.go:77: 2-so'rov: 503 {"error":"pipeline to'lgan"}
    handler_test.go:86: stats: {Accepted:3 Rejected:3 Written:3 Dropped:0}
--- PASS: TestOverloadRejectsWholeRequest (0.00s)
PASS
ok  	example.com/ingest/internal/httpapi
```

Haqiqiy binary'ni ishga tushirib, signal bilan to'xtatish (kichik skript: build, ikkita so'rov, `SIGTERM`):

```text
{"accepted":1}
{"error":"points[0]: vehicle_id: 1-32 belgi; lat 95: -90..90 oralig'ida emas"}
chiqish kodi: 0
{"level":"INFO","msg":"ishga tushdi","addr":"127.0.0.1:18095"}
{"level":"INFO","msg":"to'xtatildi","accepted":1,"written":1,"dropped":0}
```

Qatorma-qator:

- Birinchi test: so'rov 202, dastlabki yozish ataylab xato bergani uchun retry ishladi: `Written:3 Dropped:0`. Xato logi sinovda `io.Discard` ga yo'naltirilgan.
- To'lib ketish testi: sig'im 4, birinchi so'rov 3 nuqta (sig'adi), ikkinchisi 3 nuqta (3+3>4) butunlay rad etiladi. `Rejected:3`. Keyin `Gate` yopiladi, birinchi so'rovning nuqtalari yoziladi. `Close`dan keyin yangi so'rov ham 503 oladi.
- Binary: birinchi so'rov 202, ikkinchi (bo'sh `vehicle_id`, `lat: 95`) 422 va ikkala maydon xatosi bitta javobda. `SIGTERM`dan keyin `accepted 1, written 1, dropped 0` va chiqish kodi 0. Bu demo uchun nuqta vaqti sinov paytidagi soatga nisbatan o'tmishda tanlangan: `Validate` kelajakdagi (5 daqiqadan keyingi) vaqtni rad etadi.

## Qachon qo'llamaslik kerak

- Ma'lumot yo'qolmasligi shart bo'lsa, xotiradagi navbat yetarli emas. Servis yiqilsa, 202 qaytgan, lekin yozilmagan nuqtalar yo'qoladi. Bunday oqim uchun bardoshli navbat (Kafka, NATS, Postgres jadvali), outbox yoki sinxron yozish kerak (80, 97-darslar).
- Past hajmda (sekundiga bir necha nuqta) bu arxitektura ortiqcha: oddiy handler va `INSERT` yetadi. Navbat va workerlar murakkablik va yangi xatolar (yopish tartibi, hisoblagich invariantlari) manbai.
- Tartib muhim bo'lsa (har mashina nuqtalari qat'iy ketma-ketlikda), ko'p workerli umumiy kanal tartibni buzadi. Mashina bo'yicha shard (`hash(vehicle_id) % workers`) yoki tartibsiz o'qiydigan sxema kerak; yozuvdagi `at` maydoni va UNIQUE kalit tartibni emas, takrorni hal qiladi.
- Bu namuna metrika, trace va rate limit'ni o'z ichiga olmagan. Production'da ular majburiy (84-86-darslar): `dropped`, `rejected`, navbat uzunligi va flush davomiyligini ko'rmasdan servisni boshqarib bo'lmaydi.
- Namunadagi raqamlar (Limit, Workers, Size) sinov uchun tanlangan va hech qanday o'lchovga tayanmaydi. Ularni o'z yukingizda benchmark va profil bilan belgilang (61, 62-darslar).

## Stack'da: Node.js bilan solishtirish

Node.js'da shunday servisni Express/Fastify va massiv bufer bilan yozish oson, va ko'p hollarda ishlaydi. Farqlar muhim joylarda chiqadi. Birinchi: Node bitta oqimda ishlaydi, shuning uchun hisoblagichlar va massivga poyga yo'q; Go'da handler'lar parallel ishlaydi, `pending` uchun atomic/CAS yoki mutex kerak. Ikkinchi: Node'da backpressure `stream` mexanizmi bilan qo'lda boshqariladi, to'lgan massivni tashlash esa osonlik bilan unutiladi; Go'da chegaralangan kanal va `select/default` buni tilning o'zi ifodalaydi. Uchinchi: Node'da tartibli to'xtatish `process.on('SIGTERM')` va `server.close()` ni qo'lda bog'lashni talab qiladi, ishlayotgan so'rovlar va fon vazifalarning hayot sikli esa dasturchi zimmasida; Go'da kontekst bekor qilinishi va `Shutdown` buni bir tizimga keltiradi. Muallifning tajribaviy bahosi: ikkala stekda ham to'g'ri servis yozish mumkin, Go'da kam sonli standart vositalar (kanal, kontekst, `http.Server`) bilan yopilish va yuk chegarasini kodda aniq qilish osonroq.

## Xulosa

- Talablarni dizayndan oldin yozing: qaysi ma'lumot yo'qolishi mumkin, javob nimani va'da qiladi (202), yuk oshsa nima bo'ladi (503).
- So'rovni to'liq qabul qiling yoki to'liq rad eting; joyni CAS bilan band qilib, navbat sig'imini invariant sifatida ushlang.
- Chegarada tekshiring (tana limiti, soni, domen qoidalari), ichkarida toza tipli ma'lumot bilan ishlang.
- Batch yozuvchi qayta urinadi, so'ng yo'qotishni hisoblaydi; yo'qotish qabul qilinmasa bardoshli saqlash qo'shing.
- To'xtatish tartibi: server (yangi so'rov yo'q), pipeline (navbat bo'shaydi), baza.
- Metrika va benchmark'siz Limit, Workers, Size kabi raqamlar taxmin; ularni o'lchab belgilang.
