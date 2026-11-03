---
n: 91
slug: servis-tuzilmasi
title: "Servis tuzilmasi: qatlamlar va dependency injection"
summary: "Go servisini cmd va internal kataloglariga, transport, servis va saqlash qatlamlariga ajratish; interface'ni iste'molchi tomonda e'lon qilish; konstruktor orqali dependency injection va main'dagi composition root."
duration: 40
sources:
  - id: mod-layout
    note: "Server loyihasi uchun tavsiya etilgan tuzilma: cmd va internal kataloglari, paketlarga ajratish"
  - id: code-review-comments
    note: "Interface'lar va paket nomlari bo'limlari: interface qiymatni ishlatadigan paketda e'lon qilinadi"
  - id: 100go
    note: "100go.co bo'yicha tekshirilgan bandlar: #5 interface pollution, #6 interface producer tomonda, #7 interface qaytarish, #13 utility paketlar"
quiz:
  - q: "FuelService saqlash uchun ReadingStore interface'iga tayanadi, MemStore va SQLStore esa uni bajaradi. Interface'ni qayerda e'lon qilish to'g'ri?"
    options:
      - "store paketida, chunki realizatsiyalar o'sha yerda"
      - "Alohida interfaces paketida, hamma paketlar uni import qilishi uchun"
      - "service paketida, ya'ni uni ishlatadigan tomonda"
      - "Domen paketida, chunki u barcha qatlamlardan pastda"
    answer: 2
    explain: "Go'da interface qiymatni ishlatadigan paketda e'lon qilinadi: iste'molchi o'ziga kerak bo'lgan eng kichik shartnomani yozadi, realizatsiya esa uni bilmasdan bajaraveradi. Realizatsiya tomonida e'lon qilish iste'molchini realizatsiya paketiga bog'laydi va interface'ni keraksiz katta qiladi. Alohida interfaces paketi esa utility paket anti-patterniga o'xshaydi."
  - q: "service paketi store'ni, store paketi esa Reading tipi uchun service'ni import qildi. Kompilyator `import cycle not allowed` deydi. Eng to'g'ri tuzatish qaysi?"
    options:
      - "Reading va umumiy xatolarni domain paketiga ko'chirish; service va store ikkalasi domain'ni import qiladi"
      - "store'ni service paketining ichiga ko'chirib, bitta paket qilish"
      - "Import'ni `_` bilan yozib aylanishni yashirish"
      - "Aylanma import'ni GODEBUG bilan ruxsat etish"
    answer: 0
    explain: "Aylanishning odatiy sababi: ikki paket bir-birining tiplariga muhtoj. Umumiy tiplar uchinchi, hech narsaga bog'liq bo'lmagan paketga (domen) chiqarilsa, bog'liqlik yo'nalishi bir tomonga qaytadi. Paketlarni birlashtirish aniq chegarani yo'qotadi. Blank import va GODEBUG aylanma import'ni ruxsat etmaydi."
  - q: "main funksiyasi `defer db.Close()` yozgan, so'ng xato bo'lsa `log.Fatal(err)` chaqiradi. Nima bo'ladi?"
    options:
      - "db.Close() baribir bajariladi, chunki defer har doim ishlaydi"
      - "db.Close() ishlamaydi, chunki log.Fatal os.Exit(1) ni chaqiradi"
      - "Dastur panic qiladi va defer panic paytida ishlaydi"
      - "Faqat xato bo'lmasa defer ishlaydi, xatoda esa jarayon kutadi"
    answer: 1
    explain: "os.Exit jarayonni darhol tugatadi va deferred funksiyalar bajarilmaydi; log.Fatal ham os.Exit(1) bilan tugaydi. Shu sababli resurslar ochadigan kodni run() error qaytaradigan funksiyaga chiqarib, main'da faqat natijaga qarab chiqamiz."
  - q: "FuelService.Record ichida time.Now() to'g'ridan-to'g'ri chaqirilgan. Sinov nega qiyinlashadi?"
    options:
      - "time.Now() faqat main paketida ishlaydi"
      - "Sinov har safar yangi goroutine ochishga majbur bo'ladi"
      - "time.Now() qiymati hech qachon kutilgan formatda bo'lmaydi"
      - "Natija har ishga tushirishda boshqacha bo'ladi, aniq qiymatni tekshirib bo'lmaydi va vaqtga bog'liq qoidalarni (kelajakdagi sana) sinash qiyin"
    answer: 3
    explain: "Yashirin bog'liqlik (global soat) sinovni nondeterministik qiladi. Soatni konstruktorga func() time.Time sifatida berish bog'liqlikni ochiq qiladi: sinovda qotirilgan vaqt beriladi, production'da time.Now."
  - q: "HTTP handler FuelService (struct) o'rniga ikki metodli FuelAPI interface'ini qabul qiladi. Bunda asosiy foyda nima?"
    options:
      - "Interface chaqiruvi struct chaqiruvidan tezroq ishlaydi"
      - "Handler faqat o'ziga kerak metodlarga bog'lanadi va sinovda kichik fake bilan almashtiriladi"
      - "Go interface'siz struct'ni argument sifatida qabul qila olmaydi"
      - "Interface qiymatlar heap'ga chiqmasligini kafolatlaydi"
    answer: 1
    explain: "Kichik interface bog'liqlikni kamaytiradi va fake yozishni osonlashtiradi. Tezlik haqidagi da'vo noto'g'ri: dinamik chaqiruv odatda ko'proq xarajatli. Go struct'ni argument qilib qabul qila oladi, escape analysis esa interface bilan bog'liq emas."
  - q: "Qaysi konstruktor imzosi dependency injection qoidasiga mos keladi?"
    options:
      - "func NewFuelService() *FuelService, ichida global db o'zgaruvchisidan foydalanadi"
      - "func NewFuelService() *FuelService, ichida sql.Open chaqiradi"
      - "func NewFuelService(store ReadingStore, log *slog.Logger, now func() time.Time) *FuelService"
      - "func NewFuelService(cfg map[string]string) *FuelService, ichida kerakli narsalarni o'zi yaratadi"
    answer: 2
    explain: "Bog'liqliklar parametr sifatida tashqaridan beriladi: xotira, logger va soat. Global o'zgaruvchi yoki konstruktor ichida resurs ochish bog'liqlikni yashiradi va almashtirishni qiyinlashtiradi. Konfiguratsiya map'i esa tip xavfsizligini yo'qotadi."
  - q: "Quyidagilardan qaysi biri qatlamlarga bo'lishning ortiqcha ceremoniyaga aylanganini ko'rsatadi?"
    options:
      - "Har bir struct uchun, birgina realizatsiyasi bor interface va uning mock'i yozilgan; mantiq esa bitta funksiyada"
      - "Servis uchun cmd va internal kataloglari yaratilgan"
      - "Handler xatoni errors.Is bilan HTTP statusga aylantiradi"
      - "Soat konstruktorga parametr sifatida berilgan"
    answer: 0
    explain: "Interface sinov yoki ikkinchi realizatsiya kerak bo'lganda paydo bo'ladi. Har struct uchun oldindan interface yozish ortiqcha murakkablik (100 Go Mistakes'dagi interface pollution xatosi). Qolgan uch amaliyot esa bog'liqliklarni ochiq va sinaladigan qiladi."
task:
  title: "Global holatni konstruktor orqali injection bilan almashtirish"
  prompt: |
    `RecordFuel` funksiyasi global `lastLiters` map'ga yozadi va vaqt uchun `time.Now()` ni to'g'ridan-to'g'ri chaqiradi. Uni sinash qiyin: holat testlar orasida ulashiladi, vaqt esa har safar boshqacha.

    Quyidagini bajaring:

    1. `Store` interface'ini e'lon qiling: bitta metod `SetLiters(vehicleID string, liters float64)`. Interface `FuelRecorder` yonida, ya'ni iste'molchi tomonda turadi.
    2. `FuelRecorder` struct'i va `NewFuelRecorder(store Store, now func() time.Time)` konstruktorini yozing. `Record` metodi manfiy litrda xato qaytarsin, aks holda store'ga yozib, `now()` qiymatini qaytarsin.
    3. Global o'zgaruvchini olib tashlang. `main`da sinov uchun fake store va qotirilgan vaqt bering.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "time"
    )

    var lastLiters = map[string]float64{}

    // RecordFuel global holat va time.Now'ga bog'liq: sinash qiyin.
    func RecordFuel(vehicleID string, liters float64) (time.Time, error) {
        if liters < 0 {
            return time.Time{}, fmt.Errorf("liters manfiy: %v", liters)
        }
        lastLiters[vehicleID] = liters
        return time.Now(), nil
    }

    func main() {
        at, err := RecordFuel("truck-7", 182.5)
        fmt.Println(at.IsZero(), err, lastLiters["truck-7"])
    }
  solution: |
    package main

    import (
        "errors"
        "fmt"
        "time"
    )

    // Store - FuelRecorder'ga kerak bo'lgan eng kichik interface (iste'molchi tomonda).
    type Store interface {
        SetLiters(vehicleID string, liters float64)
    }

    type FuelRecorder struct {
        store Store
        now   func() time.Time
    }

    func NewFuelRecorder(store Store, now func() time.Time) *FuelRecorder {
        return &FuelRecorder{store: store, now: now}
    }

    func (r *FuelRecorder) Record(vehicleID string, liters float64) (time.Time, error) {
        if liters < 0 {
            return time.Time{}, fmt.Errorf("liters manfiy: %v", liters)
        }
        r.store.SetLiters(vehicleID, liters)
        return r.now(), nil
    }

    // fakeStore sinov uchun: nima yozilganini eslab qoladi.
    type fakeStore struct{ got map[string]float64 }

    func (f *fakeStore) SetLiters(id string, l float64) { f.got[id] = l }

    func main() {
        fixed := time.Date(2026, 11, 3, 9, 0, 0, 0, time.UTC)
        fs := &fakeStore{got: map[string]float64{}}
        rec := NewFuelRecorder(fs, func() time.Time { return fixed })

        at, err := rec.Record("truck-7", 182.5)
        fmt.Println(at.Format(time.RFC3339), err, fs.got["truck-7"])

        _, err = rec.Record("truck-7", -1)
        fmt.Println(err, errors.Unwrap(err) == nil, len(fs.got))
    }
  solutionNotes: |
    - `Store` interface'i bitta metodli va `FuelRecorder` bilan bir paketda: iste'molchi o'ziga kerak shartnomani e'lon qiladi, realizatsiya (xotira, SQL) uni bilmaydi.
    - Soat `func() time.Time` sifatida beriladi, shuning uchun sinovda `2026-11-03T09:00:00Z` qotirilgan va chiqish har safar bir xil.
    - Fake store holatni o'zida saqlaydi, global map yo'q: testlar bir-biriga ta'sir qilmaydi.
    - Manfiy litr xatosi store'ga hech narsa yozmaydi (`len(fs.got)` 1 bo'lib qoladi).
  checklist:
    - "Global o'zgaruvchi qolmagan"
    - "`Store` interface'i bitta metodli va iste'molchi tomonda e'lon qilingan"
    - "`time.Now` faqat main'dagi ulanishda emas, konstruktorga parametr sifatida berilgan"
    - "Chiqish har ishga tushirishda bir xil: `2026-11-03T09:00:00Z <nil> 182.5`"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Servis birinchi haftada bitta `main.go` bo'ladi, uchinchi oyda esa unda HTTP marshrutlari, SQL so'rovlari, biznes qoidalari va global `var db *sql.DB` aralashib ketadi. Bunday kodning og'rig'i tanish: bitta funksiyani sinash uchun butun bazani ko'tarish kerak, `init()` ichida ulanish ochilgani uchun import qilish o'zi yon ta'sir beradi, ikki paket bir-birini import qilgani uchun kompilyator `import cycle not allowed` deydi. Teskari holat ham bor: dasturchi Java yoki NestJS tajribasidan `controllers`, `services`, `repositories`, `models`, `utils` paketlarini ochadi va Go'da bu papkalar tezda o'zaro aylanma bog'liqlikka kirib qoladi.

Node.js/NestJS'da bu masala tanish yo'l bilan hal qilinadi: `@Injectable()` dekoratorlari va konteyner bog'liqliklarni reflection orqali yig'adi. Go'da bunday konteyner standart emas. Til bog'liqlikni ochiq yozishga undaydi: konstruktor parametrlari, bitta joyda yig'ish, kompilyatsiya vaqtida tekshirish. Bu dars shu uch narsani birlashtiradi: papkalar tuzilmasi, qatlamlar orasidagi bog'liqlik yo'nalishi va dependency injection (DI) ni konteynersiz amalga oshirish. Keyingi darslar (92-dars: domen va chegaralar, 93-dars: concurrency arxitekturasi) aynan shu tuzilmaga tayanadi.

## Asosiy g'oya

### Papkalar: cmd va internal

"Organizing a Go module" hujjati server loyihasi uchun oddiy tuzilma tavsiya qiladi: ishga tushiriladigan dasturlar `cmd/<nom>` ostida, qayta ishlatilmasligi kerak bo'lgan hamma narsa `internal/` ostida. `internal` maxsus kompilyator qoidasiga ega: bunday katalogdagi paketni faqat uning ota katalogi daraxtidagi kod import qila oladi. Natijada servisingizning ichki paketlari tashqi modullar uchun yopiq, va API'ni buzmasdan qayta tashkil qilish erkinligi saqlanadi (compatibility haqida 1-dars va 37-dars). Boshidan katta daraxt yaratmang: tuzilmani kod o'sgan sari murakkablashtirish muallifning tavsiyasi (hujjatdan emas).

```text
fleet/
  go.mod
  cmd/fleetapi/main.go        # composition root: faqat ulash
  internal/
    domain/                   # tiplar, qoidalar, domen xatolari (hech narsani import qilmaydi)
    service/                  # biznes mantiq; saqlashni o'zi e'lon qilgan interface orqali ko'radi
    store/                    # SQL va xotira adapterlari
    httpapi/                  # handler, DTO, xatoni statusga aylantirish
```

Paket nomlari vazifa yoki domen bo'yicha beriladi. Code Review Comments `util`, `common` kabi mazmunsiz nomlardan qochishni tavsiya qiladi; 100 Go Mistakes ham utility paketlarni xato sifatida sanaydi. Sabab amaliy: `utils.Format()` chaqiruvi hech narsa aytmaydi, `fuel.Format()` esa paketning vazifasini ko'rsatadi.

### Bog'liqlik yo'nalishi

Qatlamlar to'rtta qoidaga bo'ysunadi:

| Qatlam | Nimani biladi | Nimani bilmaydi |
|---|---|---|
| `domain` | faqat o'zini va standart kutubxonani | HTTP, SQL, logger |
| `service` | `domain`, o'zi e'lon qilgan `Store` interface'i | konkret baza, HTTP |
| `store`, `httpapi` | `domain`, `service` interface'larini bajaradi yoki chaqiradi | bir-birini |
| `cmd` | hammasini | - (faqat ulaydi) |

Strelkalar doim ichkariga, ya'ni domen tomonga qaraydi. Aylanma import xatosi odatda shu yo'nalish buzilganda chiqadi: ikki paket bir-birining tipiga muhtoj bo'lib qoladi. Davo - umumiy tipni uchinchi paketga (domen) chiqarish, paketlarni yopishtirish emas.

### Interface iste'molchi tomonda

Code Review Comments aniq yozadi: interface'lar qiymatni ishlatadigan paketga tegishli, uni bajaradigan paketga emas; realizatsiya paketi konkret tip qaytarishi kerak. 100 Go Mistakes buni "interface producer tomonda e'lon qilish" va "interface qaytarish" xatolari sifatida ko'rsatadi. Sabab: Go interface'lari tuzilmaviy (structural). Realizatsiya `Save` va `Last` metodlariga ega bo'lsa, u shartnomani `implements` deb yozmasdan bajaradi. Shuning uchun shartnomani eng kerakli joyda, iste'molchi yonida va eng kichik shaklda yozish mumkin: `FuelService` ikki metod kerak deydi, `httpapi` o'ziga `Record` va `Last` yetarli deydi, va ikkalasi ham bir xil `*FuelService` bilan ishlaydi.

### Dependency injection konteynersiz

DI - bog'liqlikni ob'ekt o'zi yaratmasdan, tashqaridan olishi. Go'da bu oddiy konstruktor parametrlari:

```go
func NewFuelService(store ReadingStore, log *slog.Logger, now func() time.Time) *FuelService
```

Uch bog'liqlikning hammasi ko'rinib turibdi. Kontainer kerak emas, chunki yig'ish bitta joyda, `main` yoki u chaqiradigan `run`da bajariladi. Bu joy composition root deyiladi: butun dastur grafi (konfiguratsiya, ulanishlar, store, service, handler) shu yerda qurilib, serverga uzatiladi. Qolgan paketlar hech qachon `sql.Open` yoki `os.Getenv` chaqirmaydi; ular tayyor bog'liqlikni oladi.

## Chuqurroq: run(), global holat va vaqt

### main kichik, run() xato qaytaradi

`os.Exit` hujjati aniq: jarayon darhol tugaydi, deferred funksiyalar bajarilmaydi. `log.Fatal` ham `os.Exit(1)` bilan tugaydi. Shu sababli resurs ochadigan kod `main` ichida emas, `run() error` funksiyasida turadi: `defer db.Close()` o'z vaqtida ishlaydi, `main` esa faqat xatoni ko'rib `os.Exit(1)` chaqiradi. Bu shakl testlashni ham osonlashtiradi, chunki `run`ni argumentlar bilan chaqirib natijani tekshirish mumkin (98-darsda CLI uchun xuddi shu shakl).

### Global holat va init()

Paket darajasidagi `var db = connect()` yoki `init()` ichidagi ulanish uchta muammo beradi. Birinchisi, import yon ta'sirga ega bo'ladi: sinov faylini kompilyatsiya qilish ham bazaga ulanishga urinadi. Ikkinchisi, testlar orasida holat ulashiladi va `t.Parallel()` bilan tartibga bog'liq xatolar chiqadi. Uchinchisi, init tartibi paketlar bog'liqligidan kelib chiqadi (10-dars) va uni o'qib bilish qiyin. Konstruktor orqali berilgan bog'liqlikda bu uchala muammo yo'q: har bir test o'z grafini quradi.

### Vaqt, tasodif va identifikatorlar ham bog'liqlik

`time.Now()`, `rand.Int()` va `uuid.New()` yashirin global bog'liqliklar. Ularni `func() time.Time` kabi kichik funksiya qiymatlari sifatida berish yetarli; alohida `Clock` interface'i ko'pincha ortiqcha. Namunadagi sinov shu tufayli `09:00:00Z` ni qotirib, chiqishni aniq tekshiradi.

### Interface o'lchami

Handler servisni `FuelAPI` orqali ko'radi (2 metod), servis esa saqlashni `ReadingStore` orqali (2 metod). Interface qancha kichik bo'lsa, fake shuncha qisqa yoziladi va shuncha kam sabab bilan o'zgaradi. Agar interface'da ettita metod bo'lsa, bu odatda iste'molchi bir nechta vazifani bajarayotganini ko'rsatadi (21-dars: interface dizayni).

## Misol: qatlamli servis va xato yo'li

Quyidagi dastur bir faylda, lekin qatlamlar alohida bloklar sifatida ajratilgan: domen, servis (o'z `ReadingStore` interface'i bilan), xotira adapteri, HTTP handler va composition root. Haqiqiy loyihada har blok yuqoridagi daraxtdagi o'z paketiga o'tadi.

```go
package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"sync"
	"time"
)

// --- domen ---

type Reading struct {
	VehicleID string    `json:"vehicle_id"`
	Liters    float64   `json:"liters"`
	At        time.Time `json:"at"`
}

var (
	ErrInvalid  = errors.New("noto'g'ri o'qish")
	ErrNotFound = errors.New("topilmadi")
)

// --- servis qatlami: kerakli interface'ni iste'molchi e'lon qiladi ---

type ReadingStore interface {
	Save(ctx context.Context, r Reading) error
	Last(ctx context.Context, vehicleID string) (Reading, error)
}

type FuelService struct {
	store ReadingStore
	log   *slog.Logger
	now   func() time.Time
}

func NewFuelService(store ReadingStore, log *slog.Logger, now func() time.Time) *FuelService {
	return &FuelService{store: store, log: log, now: now}
}

func (s *FuelService) Record(ctx context.Context, r Reading) error {
	if r.VehicleID == "" || r.Liters < 0 {
		return fmt.Errorf("record %q: %w", r.VehicleID, ErrInvalid)
	}
	if r.At.IsZero() {
		r.At = s.now()
	}
	if err := s.store.Save(ctx, r); err != nil {
		return fmt.Errorf("record %q: %w", r.VehicleID, err)
	}
	s.log.InfoContext(ctx, "reading saved", "vehicle", r.VehicleID, "liters", r.Liters)
	return nil
}

func (s *FuelService) Last(ctx context.Context, id string) (Reading, error) {
	return s.store.Last(ctx, id)
}

// --- adapter: xotiradagi store ---

type MemStore struct {
	mu   sync.Mutex
	data map[string]Reading
}

func NewMemStore() *MemStore { return &MemStore{data: map[string]Reading{}} }

func (m *MemStore) Save(_ context.Context, r Reading) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.data[r.VehicleID] = r
	return nil
}

func (m *MemStore) Last(_ context.Context, id string) (Reading, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	r, ok := m.data[id]
	if !ok {
		return Reading{}, ErrNotFound
	}
	return r, nil
}

// --- transport qatlami: servisni kichik interface orqali ko'radi ---

type FuelAPI interface {
	Record(ctx context.Context, r Reading) error
	Last(ctx context.Context, id string) (Reading, error)
}

func NewHandler(api FuelAPI) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /readings", func(w http.ResponseWriter, req *http.Request) {
		var r Reading
		if err := json.NewDecoder(req.Body).Decode(&r); err != nil {
			http.Error(w, "yaroqsiz JSON", http.StatusBadRequest)
			return
		}
		switch err := api.Record(req.Context(), r); {
		case errors.Is(err, ErrInvalid):
			http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		case err != nil:
			http.Error(w, "ichki xato", http.StatusInternalServerError)
		default:
			w.WriteHeader(http.StatusCreated)
		}
	})
	mux.HandleFunc("GET /vehicles/{id}/last", func(w http.ResponseWriter, req *http.Request) {
		r, err := api.Last(req.Context(), req.PathValue("id"))
		if errors.Is(err, ErrNotFound) {
			http.Error(w, "topilmadi", http.StatusNotFound)
			return
		}
		if err != nil {
			http.Error(w, "ichki xato", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(r)
	})
	return mux
}

// --- composition root ---

func run(out *strings.Builder) error {
	log := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
		ReplaceAttr: func(groups []string, a slog.Attr) slog.Attr {
			if a.Key == slog.TimeKey {
				return slog.Attr{}
			}
			return a
		},
	}))
	fixed := func() time.Time { return time.Date(2026, 11, 3, 9, 0, 0, 0, time.UTC) }

	store := NewMemStore()
	svc := NewFuelService(store, log, fixed)
	h := NewHandler(svc)

	do := func(method, path, body string) {
		req := httptest.NewRequest(method, path, strings.NewReader(body))
		rec := httptest.NewRecorder()
		h.ServeHTTP(rec, req)
		fmt.Fprintf(out, "%s %s -> %d %s", method, path, rec.Code, rec.Body.String())
		if !strings.HasSuffix(rec.Body.String(), "\n") {
			fmt.Fprintln(out)
		}
	}
	do("POST", "/readings", `{"vehicle_id":"truck-7","liters":182.5}`)
	do("POST", "/readings", `{"vehicle_id":"","liters":10}`)
	do("GET", "/vehicles/truck-7/last", "")
	do("GET", "/vehicles/truck-9/last", "")
	return nil
}

func main() {
	var out strings.Builder
	if err := run(&out); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	fmt.Print(out.String())
}
```

Go 1.24.7 da, linux/amd64:

```text
level=INFO msg="reading saved" vehicle=truck-7 liters=182.5
POST /readings -> 201 
POST /readings -> 422 record "": noto'g'ri o'qish
GET /vehicles/truck-7/last -> 200 {"vehicle_id":"truck-7","liters":182.5,"at":"2026-11-03T09:00:00Z"}
GET /vehicles/truck-9/last -> 404 topilmadi
```

Nimaga e'tibor berish kerak:

- `ReadingStore` `service` blokida e'lon qilingan, `MemStore` esa uni tilga olmaydi. Ertaga SQL adapteri qo'shilsa, servis kodiga tegilmaydi.
- `FuelService.Record` xatoni `fmt.Errorf("...: %w", err)` bilan o'raydi, handler esa `errors.Is(err, ErrInvalid)` bilan 422, `ErrNotFound` bilan 404 qaytaradi. Bu mexanizmni 92-darsda kengaytiramiz.
- `run` hamma narsani ulaydi: logger (vaqt maydoni olib tashlangan, chiqish aniq bo'lishi uchun), qotirilgan soat, store, servis, handler. Boshqa hech qayerda `time.Now` yoki global holat yo'q.
- Handler `*FuelService`ni emas, `FuelAPI`ni oladi, shuning uchun uni xotira store'siz ham sinash mumkin.

Servisning xato yo'lini sinash uchun bazani buzish shart emas: fake store xato qaytaradi.

```go
type failingStore struct{ err error }

func (f failingStore) Save(context.Context, Reading) error { return f.err }
func (f failingStore) Last(context.Context, string) (Reading, error) {
	return Reading{}, f.err
}

func TestRecordWrapsStoreError(t *testing.T) {
	boom := errors.New("db uzildi")
	svc := NewFuelService(failingStore{boom}, slog.New(slog.NewTextHandler(io.Discard, nil)), time.Now)
	err := svc.Record(context.Background(), Reading{VehicleID: "truck-7", Liters: 10})
	if !errors.Is(err, boom) {
		t.Fatalf("store xatosi o'rab qaytarilishi kerak, olindi: %v", err)
	}
}
```

Bu test `go test -race` bilan o'tdi (`ok example.com/l91`). Fake bor-yo'g'i ikki qator: aynan kichik interface shuni ta'minlaydi.

## Qachon qo'llamaslik kerak

- 200 qatorlik bitta vazifali servisda uch qatlam va to'rt paket yaratmang. Bitta `main` paketi va ikki-uch fayl yetarli; tuzilmani kod o'sganda va aniq og'riq paydo bo'lganda murakkablashtiring (YAGNI).
- Har struct uchun interface yozmang. Bitta realizatsiyasi bor va sinovda almashtirilmaydigan narsa uchun interface faqat o'qishni qiyinlashtiradi. Interface sinov yoki ikkinchi realizatsiya kerak bo'lgan chegarada paydo bo'lishi kerak.
- Qatlamni qatlam uchun yaratmang. Agar `service` metodi faqat `store` metodini chaqirib qaytarsa, qatlam qiymat qo'shmayapti; bu CRUD servislarda normal va uni majburan boyitish shart emas.
- DI konteyner kutubxonalari (kod generatsiyasi yoki reflection asosida) mavjud. Ular yuzlab bog'liqligi bor katta grafda foyda berishi mumkin, lekin bu kurs manbalarida ular tekshirilmagan; ko'p servislar uchun qo'lda yig'ish ravshanroq va kompilyatorga ko'rinadi.
- `internal` ichiga ham hamma narsani tiqmang: boshqa modullar foydalanishi kerak bo'lgan kutubxona kodi alohida modul yoki ochiq paket bo'lishi kerak.

## Stack'da: NestJS bilan solishtirish

| NestJS | Go |
|---|---|
| `@Module`, `@Injectable` metadata | Metadata yo'q; bog'liqliklar konstruktor parametrlari |
| IoC konteyner bog'liqliklarni runtime'da topadi | `run()` grafni qo'lda quradi, xato kompilyatsiyada chiqadi |
| Interface TypeScript'da faqat tip, injection token alohida | Interface - oddiy tip, realizatsiya avtomatik moslashadi |
| Provider yetishmasa, xato ishga tushirishda | Parametr yetishmasa, kod kompilyatsiya bo'lmaydi |
| Aylanma bog'liqlik `forwardRef` bilan hal qilinadi | Import cycle kompilyatsiya xatosi, dizaynni qayta ko'rishga majbur qiladi |

Amaliy xulosalar: Nest'dagi `Module` chegarasini Go'da paket chegarasi sifatida o'ylang; Nest'dagi `@Injectable` servisni Go'da konstruktori bor struct deb o'ylang; `ConfigService` o'rniga esa `config.Load(os.Getenv)` natijasini qiymat sifatida uzating (88-dars). Bu tuzilmaning to'liq, ko'p paketli ishlaydigan ko'rinishini 100-dars capstone'da ko'rasiz.

## Xulosa

- `cmd/<nom>` ishga tushiriladigan dastur uchun, `internal/` ichki paketlar uchun; tuzilmani ehtiyoj paydo bo'lganda murakkablashtiring.
- Bog'liqlik yo'nalishi domen tomonga qaraydi; aylanma import odatda umumiy tipni domen paketiga chiqarish bilan hal qilinadi.
- Interface iste'molchi paketda, eng kichik shaklda e'lon qilinadi; realizatsiya konkret tip qaytaradi.
- DI - konstruktor parametrlari; composition root (`main` yoki `run`) butun grafni bitta joyda quradi.
- `main` kichik, `run() error` resurslarni boshqaradi, chunki `os.Exit` deferred funksiyalarni o'tkazib yuboradi.
- Vaqt, tasodif va resurslar ham bog'liqlik: ularni tashqaridan bering, shunda sinovlar deterministik bo'ladi.
