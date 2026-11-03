---
n: 82
slug: fake-httptest
title: "Fake'lar, httptest va integratsiya testlari"
summary: "Interface orqali bog'liqlikni almashtirish, fake va mock farqi, httptest.NewRecorder va NewServer bilan handler hamda client testlari, TLS server, build tag bilan integratsiya testlarini ajratish."
duration: 40
sources:
  - id: pkg-net-http
    note: "Handler, Client va ResponseWriter tavsifi; net/http/httptest paketi alohida sahifada, bu manba esa http turlarini tushuntiradi"
  - id: pkg-testing
    note: "T.Cleanup, T.Context va testing.Short tavsifi"
  - id: 100go
    note: "Testing mavzusidagi tavsiyalar: httptest va iotest kabi yordamchi paketlar, vaqtga bog'liq testlar. Aniq band raqamlari tekshirilmagan"
quiz:
  - q: "Handler `Store` interface'ini oladi va test uchun `fakeStore` yozildi. Interface qaysi paketda e'lon qilingani nega muhim?"
    options:
      - "Joylashuv muhim emas, lekin metodlar soni hech qachon ahamiyat kasb etmaydi"
      - "Interface har doim realizatsiya paketida bo'lishi shart, aks holda kompilyator uni qabul qilmaydi"
      - "Interface alohida `interfaces` paketida bo'lishi kerak, chunki aks holda import sikli yuzaga keladi"
      - "Interface ishlatuvchi (iste'molchi) paketda, faqat kerakli metodlar bilan e'lon qilinsa, fake kichik va realizatsiyaga bog'liq bo'lmaydi"
    answer: 3
    explain: "Go'da interface'ni implement qilish yashirin (structural). Shu sabab uni ishlatuvchi tomonda, faqat ishlatiladigan metodlar bilan e'lon qilish idiomatik: fake kichrayadi, realizatsiya esa interface'dan xabarsiz qoladi. Katta interface har bir fake'ga keraksiz metodlarni yozdiradi."
  - q: "`httptest.NewRecorder()` bilan handler testi va `httptest.NewServer()` bilan test orasidagi asosiy farq nima?"
    options:
      - "NewRecorder haqiqiy TCP port ochadi, NewServer esa ochmaydi"
      - "NewRecorder handler'ni to'g'ridan-to'g'ri chaqiradi (tarmoq, timeout va HTTP protokoli ishtirok etmaydi), NewServer esa haqiqiy listener ochib, to'liq HTTP orqali ishlaydi"
      - "NewServer faqat HTTPS bilan ishlaydi"
      - "Ikkalasi bir xil, faqat nomi boshqa"
    answer: 1
    explain: "Recorder handler.ServeHTTP'ni bevosita chaqiradi: tez, lekin server timeout'lari, keep-alive, haqiqiy header normalizatsiyasi tekshirilmaydi. NewServer loopback'da real listener ochadi, shuning uchun HTTP client kodini (Transport, redirect, retry) tekshirishga mos."
  - q: "Retry qiluvchi client testida fake server 503, 503, 202 qaytarishi kerak. Server handler'idagi chaqiruvlar hisoblagichi uchun qaysi tanlov to'g'ri?"
    options:
      - "Oddiy `int` o'zgaruvchi: handler va test bir process'da ishlaydi, shuning uchun xavfsiz"
      - "Global `map`"
      - "`atomic.Int32`: handler server goroutine'ida ishlaydi, test esa boshqasida, shuning uchun oddiy o'zgaruvchi data race beradi"
      - "Hisoblagich shart emas, status kodlarini tekshirish yetarli"
    answer: 2
    explain: "httptest.Server so'rovlarni o'z goroutine'larida qayta ishlaydi. Testning goroutine'i bilan umumiy oddiy o'zgaruvchi race detector tomonidan topiladi. atomic yoki mutex kerak. (Eslatma: client javobini olgach, handler yozuvi bilan o'qish orasida happens-before bor, lekin ketma-ket bir nechta so'rovlarda hisoblagichni himoyalash xavfsizroq va aniqroq.)"
  - q: "Integratsiya testi faylining birinchi qatori `//go:build integration` va undan keyin bo'sh qator. `go test ./...` bu testni ishga tushiradimi?"
    options:
      - "Yo'q, fayl `-tags integration` berilmaguncha kompilyatsiyaga umuman kirmaydi"
      - "Ha, lekin faqat `-short` bayrog'i berilmasa"
      - "Ha, build tag faqat hujjat vazifasini bajaradi"
      - "Yo'q, lekin `go vet` baribir uni tekshiradi va xato beradi"
    answer: 0
    explain: "Build constraint fayl paketga kiradimi-yo'qmi shuni hal qiladi. Teg berilmasa, fayl kompilyatsiyadan chiqib ketadi. go vet ham teg bilan alohida ishga tushiriladi (`go vet -tags integration`), aks holda fayl tekshirilmay qoladi. testing.Short esa boshqa mexanizm: kod ichida t.Skip bilan o'tkazib yuborish."
  - q: "`httptest.NewTLSServer` bilan test yozyapsiz, lekin `http.DefaultClient` bilan so'rov yuborganda sertifikat xatosi chiqdi. To'g'ri yechim?"
    options:
      - "`InsecureSkipVerify: true` ni production client konfiguratsiyasiga qo'shish"
      - "NewTLSServer o'rniga NewServer ishlatish va HTTPS'ni umuman tekshirmaslik"
      - "Sertifikat xatosini e'tiborsiz qoldiruvchi global GODEBUG o'rnatish"
      - "Testda `srv.Client()` ishlatish: u shu serverning sertifikatiga ishonadigan client qaytaradi"
    answer: 3
    explain: "NewTLSServer o'z-o'zidan imzolangan sertifikat bilan ishlaydi. srv.Client() shu sertifikatga ishonadigan client beradi, production kodni o'zgartirish shart emas. Client'ni parametr sifatida qabul qilish (Forwarder.Client kabi) aynan shu testlashni mumkin qiladi. Production client'da tekshiruvni o'chirish xavfsizlik teshigi."
  - q: "Fake va mock o'rtasidagi farq haqida qaysi gap aniq?"
    options:
      - "Fake faqat HTTP uchun, mock esa ma'lumotlar bazasi uchun"
      - "Fake - ishlaydigan soddalashtirilgan realizatsiya (masalan, xotiradagi Store), holatni tekshiramiz; mock - kutilgan chaqiruvlar ketma-ketligini oldindan belgilab, ularni tekshiradi"
      - "Mock tezroq ishlaydi, fake esa har doim haqiqiy tarmoqdan foydalanadi"
      - "Farq yo'q, ikkalasi bir narsaning sinonimi"
    answer: 1
    explain: "Fake'da mantiq bor (Save slice'ga qo'shadi, Get o'qiydi), test natijaviy holatni tekshiradi, shuning uchun u refaktoringga chidamli. Mock chaqiruvlar tartibini qotirib qo'yadi va ichki tafsilotga bog'laydi. Go jamoasida fake va kichik interface afzal ko'riladi, ammo bu uslub tanlovi, qat'iy qoida emas."
task:
  title: "Webhook client'ini haqiqiy HTTP server bilan sinash"
  prompt: |
    Quyidagi `Notify` webhook manziliga xabar yuboradi. Uning testi faqat 200 holatini tekshiradi va o'tadi, lekin funksiyada ikkita muammo bor: javob statusi tekshirilmaydi (404 va 500 muvaffaqiyat deb hisoblanadi) va `resp.Body` yopilmaydi.

    Vazifa: faylni `webhook_test.go` deb saqlang. Testni `httptest.NewServer` bilan table-driven qilib, status kodlari 200, 204, 404, 500 uchun yozing. Server tomonida metod, `Content-Type` va tana tekshirilsin. Yopilgan server uchun alohida test qo'shing. Testlar yiqilishini ko'rgach, `Notify`ni tuzating.
  lang: go
  starter: |
    package webhook

    import (
        "net/http"
        "net/http/httptest"
        "strings"
        "testing"
    )

    // Notify xabarni webhook manziliga POST qiladi.
    func Notify(client *http.Client, url, msg string) error {
        resp, err := client.Post(url, "text/plain", strings.NewReader(msg))
        if err != nil {
            return err
        }
        _ = resp
        return nil
    }

    func TestNotify(t *testing.T) {
        srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            w.WriteHeader(http.StatusOK)
        }))
        defer srv.Close()

        if err := Notify(srv.Client(), srv.URL, "yoqilg'i kam"); err != nil {
            t.Fatal(err)
        }
    }
  solution: |
    package webhook

    import (
        "fmt"
        "io"
        "net/http"
        "net/http/httptest"
        "strings"
        "testing"
    )

    // Notify xabarni webhook manziliga POST qiladi.
    func Notify(client *http.Client, url, msg string) error {
        resp, err := client.Post(url, "text/plain", strings.NewReader(msg))
        if err != nil {
            return err
        }
        defer resp.Body.Close()
        if resp.StatusCode < 200 || resp.StatusCode > 299 {
            return fmt.Errorf("webhook: status %d", resp.StatusCode)
        }
        return nil
    }

    func TestNotify(t *testing.T) {
        tests := []struct {
            name    string
            status  int
            wantErr bool
        }{
            {"200", http.StatusOK, false},
            {"204", http.StatusNoContent, false},
            {"404", http.StatusNotFound, true},
            {"500", http.StatusInternalServerError, true},
        }
        for _, tt := range tests {
            t.Run(tt.name, func(t *testing.T) {
                t.Parallel()
                var gotBody, gotType, gotMethod string
                srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
                    b, _ := io.ReadAll(r.Body)
                    gotBody, gotType, gotMethod = string(b), r.Header.Get("Content-Type"), r.Method
                    w.WriteHeader(tt.status)
                }))
                t.Cleanup(srv.Close)

                err := Notify(srv.Client(), srv.URL, "yoqilg'i kam")
                if (err != nil) != tt.wantErr {
                    t.Fatalf("Notify() xatosi = %v, xato kutilganmi: %v", err, tt.wantErr)
                }
                if gotMethod != http.MethodPost || gotType != "text/plain" || gotBody != "yoqilg'i kam" {
                    t.Errorf("server oldi: %s %q %q", gotMethod, gotType, gotBody)
                }
            })
        }
    }

    func TestNotifyServerDown(t *testing.T) {
        srv := httptest.NewServer(http.NotFoundHandler())
        url, client := srv.URL, srv.Client()
        srv.Close()

        if err := Notify(client, url, "x"); err == nil {
            t.Fatal("yopilgan server bilan xato kutilgan edi")
        }
    }
  solutionNotes: |
    - 2xx dan tashqari status xato qaytarishi kerak: starter test bu holatni umuman tekshirmagani uchun yashil edi.
    - `defer resp.Body.Close()` kerak: aks holda keep-alive ulanish qayta ishlatilmaydi va ulanishlar sizadi.
    - Server handler'i o'z goroutine'ida ishlaydi, shuning uchun `gotBody` kabi o'zgaruvchilarni o'qish faqat `Notify` qaytgandan keyin, response orqali happens-before o'rnatilgandan so'ng xavfsiz. Ko'p so'rovli testlarda atomic yoki mutex ishlating.
    - `srv.Client()` ishlatilgan: client server bilan bog'langan (TLS server bo'lsa sertifikatga ham ishonadi).
    - Yopilgan serverga so'rov ulanish xatosi beradi; client xatolarni ham yuqoriga uzatadi.
  checklist:
    - "Test `httptest.NewServer` ishlatadi va har status uchun alohida subtest bor"
    - "Server so'rov metodi, `Content-Type` va tanasini tekshiradi"
    - "404 va 500 da `Notify` xato qaytaradi, 200 va 204 da `nil`"
    - "`resp.Body` yopiladi (`defer`)"
    - "Yopilgan server uchun alohida test bor; `go test -race` va `go vet` o'tadi"
---

## Muammo

Production servislarida testlar ikki xil usulda og'riqli bo'ladi. Birinchisi: kod to'g'ridan-to'g'ri haqiqiy bog'liqlikka (ma'lumotlar bazasi, tashqi API, soat) bog'langan, shuning uchun testni ishga tushirish uchun butun infratuzilma kerak, test sekin va ba'zan yiqiladigan bo'ladi. Ikkinchisi: aksincha, bog'liqlik mock bilan to'liq almashtirilgan, test chaqiruvlar ketma-ketligini qotirib qo'ygan va har refaktoringda sinadi, lekin real xatti-harakatni tekshirmaydi.

Node.js dunyosida buning vositasi `jest.mock`, `nock` yoki `supertest`. Go'da modul almashtirish yo'q, lekin ikkita kuchli narsa bor: interface'lar (ular yashirin implement qilinadi) va standart kutubxonadagi `net/http/httptest`. Bu dars shu ikkisini birga ishlatib, tez va ishonchli testlar yozish usulini ko'rsatadi: kichik interface va fake, handler testi uchun `httptest.NewRecorder`, HTTP client testi uchun `httptest.NewServer` va sekin testlarni build tag bilan ajratish. 81-darsdagi `t.Cleanup`, `t.Context` va table-driven shakl bu yerda ham ishlatiladi.

## Asosiy g'oya

### Kichik interface iste'molchi tomonda

Handler ma'lumotni saqlashi kerak. U butun repository tipini emas, faqat o'ziga kerak bo'lgan bitta metodli interface'ni oladi:

- interface handler paketida e'lon qilinadi, repository paketi undan xabardor emas;
- metodlar soni kam bo'lgani uchun fake ham kichik;
- production realizatsiya (masalan, pgx bilan, 78-dars) interface'ni avtomatik implement qiladi.

Bu "accept interfaces, return structs" qoidasining test tomonidagi foydasi. Interface paydo bo'lishi uchun ikkinchi realizatsiya kerak: test fake'i shu ikkinchi realizatsiya vazifasini bajaradi.

### Fake, stub va mock

Terminlar ko'p aralashtiriladi. Bu kursda shunday ishlatamiz: stub qat'iy javob qaytaradi; fake haqiqiy mantiqqa ega soddalashtirilgan realizatsiya (xotiradagi `Store`); mock esa chaqiruvlar kutilgan ketma-ketlikda bo'lganini tekshiradi. Go jamoasi amaliyotida fake afzal: test natijaviy holatni tekshiradi ("nuqta saqlandi"), qanday saqlangani esa ahamiyatsiz. Mock testi "Save bir marta, so'ng Flush chaqirildi" deb ichki tafsilotni qotiradi va realizatsiya o'zgarsa, to'g'ri ishlaydigan kod uchun ham yiqiladi. Bu absolyut qoida emas, uslub tanlovi: tashqi tizimga yuboriladigan so'rovlar sonini aniq tekshirish kerak bo'lsa (masalan, to'lov faqat bir marta chaqirilishi), chaqiruvlarni sanash mantiqli.

### httptest ikki rejimda

- `httptest.NewRecorder()` va `httptest.NewRequest()` handler'ni bevosita chaqiradi: `handler.ServeHTTP(rec, req)`. Tarmoq yo'q, tez. `NewRequest` yaroqsiz kirishda panic beradi (bu test yordamchisi); kontekst kerak bo'lsa `NewRequestWithContext` (Go 1.23 dan).
- `httptest.NewServer(handler)` loopback'da haqiqiy listener ochadi, URL beradi. Client kodi (Transport, redirect, timeout, retry) shu bilan tekshiriladi. `NewTLSServer` esa o'z-o'zidan imzolangan sertifikat bilan HTTPS server ochadi, `srv.Client()` shu sertifikatga ishonadigan client qaytaradi.

## Chuqurroq: nozik joylar

### Recorder nimani tekshirmaydi

Recorder handler'ni bevosita chaqirgani uchun u server darajasidagi narsalarni o'tkazib yuboradi: `http.Server` timeout'lari, keep-alive, header'larni kanonik shaklga keltirish (server tomonidan), `Content-Length`ni o'rnatish, haqiqiy `Hijack`. Shuning uchun handler mantig'ini recorder bilan, middleware zanjiri va to'liq yo'lni (router, middleware, handler) esa `NewServer` bilan tekshirish ma'qul. Middleware'lar 74-darsda.

### Server goroutine'lari va data race

`httptest.Server` so'rovlarni o'z goroutine'larida bajaradi. Handler ichida testning o'zgaruvchilarini yozsangiz va test ularni o'qisa, race detector buni topishi mumkin. Misolimizda chaqiruvlar hisoblagichi `atomic.Int32`. Bitta so'rovdan keyin javobni olgan client uchun handler yozuvi bilan test o'qishi orasida happens-before bor, lekin bir nechta so'rov yoki fon goroutine bo'lsa, buni o'ylab o'tirmaslik uchun atomic yoki mutex ishlating. Ikkinchi tuzoq: `srv.Close()` hamma bajarilayotgan so'rovlar tugashini kutadi, shuning uchun handler'da cheksiz bloklanish testni osib qo'yadi. `t.Cleanup(srv.Close)` yozing (defer emas, chunki parallel subtestlar bilan ishlaganda defer ertaroq ishlashi mumkin, 81-dars).

### Vaqtni inject qilish

`time.Sleep` bilan kutadigan test sekin va flaky. Retry kodi kutish vaqtini parametr qilib oladi (`Backoff`), testda u millisekund bo'ladi. Soatga bog'liq mantiq (muddat tugashi, TTL) uchun `func() time.Time` ni maydon sifatida inject qiling, testda qat'iy vaqt qaytaring. Parallel mantiq uchun maxsus vosita `testing/synctest` bor, lekin Go 1.24 da u faqat `GOEXPERIMENT=synctest` bilan yoqiladi (paket manbasida shu build tag bor), shu sabab bu darsda ishlatmaymiz.

### Port ochmasdan: http.RoundTripper

Ba'zan haqiqiy listener ortiqcha: masalan, sandbox'da port ochish cheklangan yoki faqat bitta so'rovning shaklini tekshirmoqchisiz. `http.Client` o'z `Transport` maydonidagi `http.RoundTripper` interface'i orqali ishlaydi (yagona metod `RoundTrip`). Uni funksiya tipi bilan implement qilib, tarmoqsiz fake client yasash mumkin:

```go
package main

import (
	"fmt"
	"io"
	"net/http"
	"strings"
)

// roundTripFunc http.RoundTripper'ni oddiy funksiya sifatida implement qiladi.
type roundTripFunc func(*http.Request) (*http.Response, error)

func (f roundTripFunc) RoundTrip(r *http.Request) (*http.Response, error) { return f(r) }

func main() {
	client := &http.Client{Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
		fmt.Println("so'rov:", r.Method, r.URL)
		return &http.Response{
			StatusCode: http.StatusAccepted,
			Body:       io.NopCloser(strings.NewReader("ok")),
			Header:     make(http.Header),
			Request:    r,
		}, nil
	})}

	resp, err := client.Post("https://api.example.com/points", "application/json", strings.NewReader("{}"))
	if err != nil {
		fmt.Println("xato:", err)
		return
	}
	defer resp.Body.Close()
	fmt.Println("javob:", resp.Status)
}
```

Chiqish (Go 1.24.7):

```text
so'rov: POST https://api.example.com/points
javob: 
```

`javob:` dan keyin bo'sh joy: biz `Response.Status` maydonini to'ldirmadik, faqat `StatusCode`ni. Haqiqiy transport ikkalasini to'ldiradi, shuning uchun kodda doim `StatusCode`ga tayaning va fake'da kerakli maydonlarni (`Body`, `Header`) o'zingiz bering. Bu usulning chegarasi: u HTTP protokolini, redirect va TLS'ni emas, faqat client kodini tekshiradi. Shu sabab retry va redirect mantig'ini sinashda `NewServer` ishonchliroq.

### Integratsiya testlarini ajratish

Sekin yoki tashqi resurs talab qiladigan testlarni ikki yo'l bilan ajratish mumkin:

1. `testing.Short()`: test ichida `if testing.Short() { t.Skip("sekin") }`. Test har doim kompilyatsiya bo'ladi, faqat `-short` bilan o'tkazib yuboriladi.
2. Build tag: fayl boshida `//go:build integration` (va undan keyin bo'sh qator). Teg berilmasa fayl kompilyatsiyaga kirmaydi; `go test -tags integration ./...` bilan qo'shiladi. Kamchiligi: `go vet` ham `-tags integration` bilan ishga tushirilmasa, fayl tekshirilmay qoladi.

Haqiqiy PostgreSQL yoki Redis kerak bo'lsa, konteyner yoki servisni CI'da ko'taring va ulanish manzilini environment orqali bering; manzil yo'q bo'lsa `t.Skip`. Bu qismni bu dars kodida ko'rsatmaymiz: tashqi modullarsiz haqiqiy bazani ko'rsatib bo'lmaydi va natijani o'ylab topmaslik kerak.

## Misol: nuqta qabul qilish va uzatish

Avtopark monitoring platformasida ikki komponent bor: `IngestHandler` GPS nuqtasini qabul qilib `Store`ga yozadi, `Forwarder` esa nuqtani tashqi API'ga yuboradi va 5xx da qayta urinadi.

```go
// Package app - GPS nuqtalarini qabul qiluvchi va uzatuvchi komponentlar.
package app

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"
)

// Point - GPS nuqtasi.
type Point struct {
	Device string  `json:"device"`
	Lat    float64 `json:"lat"`
	Lon    float64 `json:"lon"`
}

// Store - handler'ga kerak bo'lgan yagona narsa. Interface iste'molchi tomonda e'lon qilingan.
type Store interface {
	Save(ctx context.Context, p Point) error
}

// IngestHandler POST /points so'rovini qabul qiladi.
func IngestHandler(s Store) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "faqat POST", http.StatusMethodNotAllowed)
			return
		}
		var p Point
		if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<10)).Decode(&p); err != nil || p.Device == "" {
			http.Error(w, "noto'g'ri tana", http.StatusBadRequest)
			return
		}
		if err := s.Save(r.Context(), p); err != nil {
			http.Error(w, "saqlab bo'lmadi", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
	})
}

// Forwarder nuqtani tashqi API'ga yuboradi; 5xx da retry qiladi.
type Forwarder struct {
	Client   *http.Client
	URL      string
	Attempts int
	Backoff  time.Duration
}

// ErrUpstream - tashqi API muvaffaqiyatsiz javob berdi.
var ErrUpstream = errors.New("app: upstream xatosi")

// Forward nuqtani yuboradi.
func (f *Forwarder) Forward(ctx context.Context, p Point) error {
	body, err := json.Marshal(p)
	if err != nil {
		return err
	}
	var last error
	for i := 0; i < f.Attempts; i++ {
		if i > 0 {
			select {
			case <-time.After(f.Backoff):
			case <-ctx.Done():
				return ctx.Err()
			}
		}
		req, err := http.NewRequestWithContext(ctx, http.MethodPost, f.URL, bytes.NewReader(body))
		if err != nil {
			return err
		}
		resp, err := f.Client.Do(req)
		if err != nil {
			last = err
			continue
		}
		resp.Body.Close()
		switch {
		case resp.StatusCode < 300:
			return nil
		case resp.StatusCode >= 500:
			last = fmt.Errorf("%w: status %d", ErrUpstream, resp.StatusCode)
		default:
			return fmt.Errorf("%w: status %d (retry yo'q)", ErrUpstream, resp.StatusCode)
		}
	}
	return last
}
```

Testlar: handler uchun jadval va recorder, forwarder uchun haqiqiy server:

```go
package app

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"sync/atomic"
	"testing"
	"time"
)

// fakeStore - xotirada ishlaydigan haqiqiy implementatsiya (mock emas: chaqiruvlarni emas, holatni saqlaydi).
type fakeStore struct {
	mu     sync.Mutex
	points []Point
	err    error
}

func (f *fakeStore) Save(_ context.Context, p Point) error {
	f.mu.Lock()
	defer f.mu.Unlock()
	if f.err != nil {
		return f.err
	}
	f.points = append(f.points, p)
	return nil
}

func TestIngestHandler(t *testing.T) {
	tests := []struct {
		name      string
		method    string
		body      string
		storeErr  error
		wantCode  int
		wantSaved int
	}{
		{"muvaffaqiyat", http.MethodPost, `{"device":"T-104","lat":41.3,"lon":69.2}`, nil, http.StatusCreated, 1},
		{"buzuq JSON", http.MethodPost, `{"device":`, nil, http.StatusBadRequest, 0},
		{"qurilma yo'q", http.MethodPost, `{"lat":1}`, nil, http.StatusBadRequest, 0},
		{"GET", http.MethodGet, ``, nil, http.StatusMethodNotAllowed, 0},
		{"store xatosi", http.MethodPost, `{"device":"T-104"}`, errors.New("disk"), http.StatusInternalServerError, 0},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			store := &fakeStore{err: tt.storeErr}
			req := httptest.NewRequest(tt.method, "/points", strings.NewReader(tt.body))
			rec := httptest.NewRecorder()

			IngestHandler(store).ServeHTTP(rec, req)

			if rec.Code != tt.wantCode {
				t.Errorf("status = %d, kutilgan %d", rec.Code, tt.wantCode)
			}
			if len(store.points) != tt.wantSaved {
				t.Errorf("saqlangan nuqtalar = %d, kutilgan %d", len(store.points), tt.wantSaved)
			}
		})
	}
}

func TestForwarderRetry(t *testing.T) {
	var calls atomic.Int32
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if calls.Add(1) < 3 {
			w.WriteHeader(http.StatusServiceUnavailable)
			return
		}
		w.WriteHeader(http.StatusAccepted)
	}))
	t.Cleanup(srv.Close)

	f := &Forwarder{Client: srv.Client(), URL: srv.URL, Attempts: 3, Backoff: time.Millisecond}
	if err := f.Forward(t.Context(), Point{Device: "T-104"}); err != nil {
		t.Fatalf("Forward() = %v, kutilgan nil", err)
	}
	if got := calls.Load(); got != 3 {
		t.Errorf("upstream chaqiruvlari = %d, kutilgan 3", got)
	}
}

func TestForwarderNoRetryOn4xx(t *testing.T) {
	var calls atomic.Int32
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		calls.Add(1)
		w.WriteHeader(http.StatusBadRequest)
	}))
	t.Cleanup(srv.Close)

	f := &Forwarder{Client: srv.Client(), URL: srv.URL, Attempts: 3, Backoff: time.Millisecond}
	err := f.Forward(t.Context(), Point{Device: "T-104"})
	if !errors.Is(err, ErrUpstream) {
		t.Fatalf("Forward() = %v, kutilgan ErrUpstream", err)
	}
	if got := calls.Load(); got != 1 {
		t.Errorf("upstream chaqiruvlari = %d, kutilgan 1", got)
	}
}

func TestForwarderTLS(t *testing.T) {
	srv := httptest.NewTLSServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))
	t.Cleanup(srv.Close)

	// srv.Client() server sertifikatiga ishonadigan tayyor client.
	f := &Forwarder{Client: srv.Client(), URL: srv.URL, Attempts: 1}
	if err := f.Forward(t.Context(), Point{Device: "T-104"}); err != nil {
		t.Fatalf("TLS server bilan Forward() = %v", err)
	}
	// Oddiy client esa sertifikatga ishonmaydi.
	f.Client = &http.Client{Timeout: time.Second}
	if err := f.Forward(t.Context(), Point{Device: "T-104"}); err == nil {
		t.Error("oddiy client bilan xato kutilgan edi")
	}
}
```

Natija (`go test -race -v`, Go 1.24.7, linux/amd64):

```text
--- PASS: TestIngestHandler (0.00s)
--- PASS: TestForwarderRetry (0.01s)
--- PASS: TestForwarderNoRetryOn4xx (0.00s)
--- PASS: TestForwarderTLS (0.08s)
ok  	lesson82/app	1.107s
```

Qarorlar:

- `fakeStore` mutex bilan himoyalangan, chunki handler boshqa goroutine'dan chaqirilishi mumkin. Test faqat holatni (`points`) tekshiradi.
- Retry testi server 503 qaytarishini hisoblagich orqali boshqaradi va `Attempts: 3`, `Backoff: 1ms` beradi: test millisekundlarda tugaydi, `time.Sleep` yo'q.
- 4xx da retry bo'lmasligi alohida testda tasdiqlanadi: bu xato mijoz tomonidan, qayta urinish foyda bermaydi va yuk oshiradi.
- TLS testida `srv.Client()` ishlaydi, oddiy client esa sertifikat xatosini beradi. Production kodda client parametr bo'lgani uchun TLS tekshiruvini o'chirish kerak emas.

Integratsiya fayli build tag bilan ajratilgan:

```go
//go:build integration

package app

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

// To'liq zanjir: haqiqiy HTTP server -> handler -> store.
func TestIngestEndToEnd(t *testing.T) {
	store := &fakeStore{}
	srv := httptest.NewServer(IngestHandler(store))
	t.Cleanup(srv.Close)

	resp, err := srv.Client().Post(srv.URL, "application/json", strings.NewReader(`{"device":"T-104","lat":41.3,"lon":69.2}`))
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusCreated {
		t.Fatalf("status = %d, kutilgan 201", resp.StatusCode)
	}
	if len(store.points) != 1 {
		t.Fatalf("saqlangan = %d, kutilgan 1", len(store.points))
	}
}
```

Teg bilan va tegsiz natija:

```text
--- PASS: TestIngestEndToEnd (0.00s)
ok  	lesson82/app	0.006s
testing: warning: no tests to run
ok  	lesson82/app	0.004s [no tests to run]
```

Teg berilmaganda fayl umuman kompilyatsiya bo'lmaydi, shuning uchun "no tests to run" chiqadi.

## Qachon qo'llamaslik kerak

- Hamma narsani fake bilan almashtirish xavfli: SQL so'rovlari, tranzaksiya izolyatsiyasi, indeks va constraint xatti-harakati fake'da bo'lmaydi. Ma'lumotlar bazasi bilan ishlaydigan qatlamni haqiqiy bazada tekshiring, fake faqat uning ustidagi mantiq uchun.
- Fake o'zi murakkablashsa (o'z xatolari, o'z mantig'i), uni ham test qilish kerak bo'lib qoladi. Bunday holda haqiqiy bog'liqlikni integratsiya testida ishlatish arzonroq.
- Har paket uchun interface yozish ortiqcha. Interface faqat ikkinchi realizatsiya (fake yoki boshqa) haqiqatan kerak bo'lganda paydo bo'lsin. Bitta realizatsiya uchun interface - spekulyativ umumlashtirish.
- `NewRecorder` bilan server darajasidagi xatti-harakatni (timeout, graceful shutdown, HTTP/2) tekshirib bo'lmaydi; buning uchun `NewServer` yoki haqiqiy `http.Server` kerak.
- Tashqi API'ning fake serveri haqiqiy API bilan mos kelmay qolishi mumkin. Shartnoma o'zgarsa, fake yashil bo'lib qolaveradi. Muhim tashqi integratsiyalar uchun vaqti-vaqti bilan haqiqiy sandbox'ga qarshi test o'tkazing.

## Stack'da: NestJS bilan solishtirish

NestJS'da bog'liqliklar DI konteyneri orqali beriladi va `Test.createTestingModule({ providers: [{ provide: X, useValue: fake }] })` bilan almashtiriladi. Go'da konteyner yo'q: konstruktor interface qabul qiladi, test esa fake uzatadi. `supertest` bilan `app.getHttpServer()` ni sinash `httptest.NewServer` ga mos keladi, `nock` bilan tashqi so'rovlarni to'xtatish esa Go'da boshqacha yo'l bilan hal qilinadi: client'ni (yoki base URL'ni) parametr qilib olasiz va testda `srv.URL` berasiz. Shu sababli Go servislarida client'ni global `http.DefaultClient` o'rniga maydon sifatida saqlash odat: bu timeout'ni sozlash (73-dars) va testlashni birdaniga yengillashtiradi.

DI haqida to'liq gap 91-darsda. Hozircha yodda tuting: bog'liqlik konstruktorga interface (yoki `*http.Client`) sifatida beriladi, global holat esa testni murakkablashtiradi.

## Xulosa

- Interface'ni ishlatuvchi tomonda, faqat kerakli metodlar bilan e'lon qiling; fake shunda kichik bo'ladi.
- Fake (ishlaydigan soddalashtirilgan realizatsiya) odatda mock'dan chidamliroq: holatni tekshiring, chaqiruv ketma-ketligini emas.
- Handler mantig'i uchun `httptest.NewRecorder`, client va to'liq yo'l uchun `httptest.NewServer`; HTTPS uchun `NewTLSServer` va `srv.Client()`.
- Server handler'i boshqa goroutine'da ishlaydi: umumiy holatni atomic yoki mutex bilan himoyalang, serverni `t.Cleanup` bilan yoping.
- Sekin va tashqi resursli testlarni `//go:build integration` yoki `testing.Short()` bilan ajrating; `go vet` ni ham teg bilan ishga tushiring.
