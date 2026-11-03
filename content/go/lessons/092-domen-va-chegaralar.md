---
n: 92
slug: domen-va-chegaralar
title: "Domen modeli va chegaralarda xato/tip konvertatsiyasi"
summary: "Tashqi DTO'ni domen tipiga aylantirish, yaroqsiz holatni tip darajasida taqiqlash, pastki qatlam xatolarini domen xatolariga, domen xatolarini HTTP statusga tarjima qilish va ichki tafsilotni mijozga chiqarmaslik."
duration: 40
sources:
  - id: blog-error-handling
    note: "Xato qiymat sifatida, maxsus xato tiplari va HTTP handler'dagi takroriy xato qayta ishlashni soddalashtirish bo'limi"
  - id: 100go
    note: "Xatolarni o'rash, errors.Is/As va 'errors are values' bilan bog'liq xatolar"
  - id: code-review-comments
    note: "Error strings va Handle Errors bo'limlari: xatoni e'tiborsiz qoldirmaslik, xabar formati"
quiz:
  - q: "JSON so'rovda `{}` kelganda DTO'dagi `Liters float64` maydoni 0 bo'ladi, `{\"liters\": 0}` kelganda ham 0. Maydon yo'qligini 0 qiymatdan ajratish uchun nima qilinadi?"
    options:
      - "Maydonni `*float64` qilib e'lon qilish va nil'ni 'yuborilmagan' deb talqin qilish"
      - "Maydonga `json:\"liters,omitempty\"` tegi qo'shish"
      - "Dekoderga `DisallowUnknownFields` o'rnatish"
      - "Qiymatni string sifatida qabul qilib, keyin parse qilish"
    answer: 0
    explain: "Ko'rsatkich nil bo'lsa maydon kelmagan, nil bo'lmasa qiymat kelgan (nol bo'lsa ham). `omitempty` faqat encode paytida ta'sir qiladi, `DisallowUnknownFields` noma'lum kalitlarni rad etadi, lekin yo'q maydonni ajratmaydi. String yo'li ishlaydi, lekin keraksiz murakkab."
  - q: "`json.Unmarshal` ma'lumotni `map[string]any` ichiga o'qiganda `{\"odometer\": 9007199254740993}` qiymati qanday bo'ladi?"
    options:
      - "int64 sifatida aniq saqlanadi"
      - "string sifatida saqlanadi"
      - "Xato qaytariladi, chunki son juda katta"
      - "float64 bo'ladi va oxirgi raqam yo'qoladi (9.007199254740992e+15)"
    answer: 3
    explain: "any ichiga o'qilgan JSON sonlari float64 bo'ladi va 2^53 dan katta butun sonlar aniqligini yo'qotadi. Tuzatish: aniq int64 maydonli struct yoki Decoder.UseNumber. Dars namunasida uchala variant ham ishga tushirilgan."
  - q: "Servis `fmt.Errorf(\"%w: %w\", ErrDuplicate, pgErr)` qaytardi. Handler `errors.Is(err, ErrDuplicate)` va `errors.As(err, &pe)` ni tekshirsa nima bo'ladi?"
    options:
      - "Faqat birinchi %w ishlaydi, ikkinchisi e'tiborsiz qoldiriladi"
      - "Kompilyatsiya xatosi: bitta Errorf'da ikkita %w taqiqlangan"
      - "Ikkala tekshiruv ham muvaffaqiyatli bo'ladi: ikkala xato zanjirda"
      - "Is true, As false qaytaradi, chunki As faqat ildiz xatoga qaraydi"
    answer: 2
    explain: "Go 1.20 dan fmt.Errorf bir nechta %w ni qabul qiladi va natija ikkala xatoni ham o'raydi; errors.Is va errors.As ikkalasini ham topadi. Shuning uchun domen xatosini saqlab, asl sababni logga yo'qotmasdan olib o'tish mumkin."
  - q: "Handler ichki xatoda mijozga `err.Error()` matnini yozdi: `record broken-1: pg: 08006 connection failure`. Bunda asosiy muammo nima?"
    options:
      - "Xabar ingliz tilida yozilgan"
      - "Ichki tuzilma (baza turi, xato kodi) tashqariga sizadi va hujumchiga ma'lumot beradi; mijozga umumiy xabar, logga to'liq sabab berilishi kerak"
      - "HTTP 500 status faqat JSON bilan qaytariladi"
      - "Xabarda ikki nuqta ishlatilgan"
    answer: 1
    explain: "Pastki qatlam xabarlari tashqi shartnomaning bir qismi emas: ular tuzilmani oshkor qiladi va o'zgarganda mijozlarni buzadi. Chegara ichki xatoni log qiladi (request id bilan), mijozga esa barqaror, umumiy xabar qaytaradi."
  - q: "Quyidagi kod xatoni qanday tasniflaydi: `if strings.Contains(err.Error(), \"duplicate\") { return 409 }`. Nima uchun bu yomon?"
    options:
      - "strings.Contains Go'da xato matni bilan ishlamaydi"
      - "Hech qanday kamchiligi yo'q, bu eng tez yo'l"
      - "Xabar matni shartnoma emas: drayver yoki til o'zgarsa, o'ralgan xabarda matn boshqacha bo'lsa tasnif jimgina buziladi; errors.Is/As tipga tayanadi"
      - "Faqat nil xatolarda panic beradi"
    answer: 2
    explain: "Matn bo'yicha tasniflash mo'rt: xabarni tahrirlash yoki drayverni yangilash 409 ni 500 ga aylantiradi, va buni kompilyator ham, test ham ko'pincha tutmaydi. Sentinel yoki typed xatolar bilan errors.Is/As o'ralgan zanjirda ham ishonchli ishlaydi."
  - q: "`NewLiters(v float64) (Liters, error)` konstruktori nima uchun foydali, `Liters` esa `type Liters float64`?"
    options:
      - "Kompilyator Liters ga manfiy son tayinlashni taqiqlaydi"
      - "Liters qiymatini yaratish yagona yo'l orqali o'tadi va servis ichida qiymat allaqachon tekshirilgan deb hisoblanishi mumkin (aniq tip faqat konvensiya bilan himoyalangan)"
      - "Konstruktor runtime'da tezroq ishlaydi"
      - "Go bunday tipni avtomatik JSON'ga aylantira olmaydi"
    answer: 1
    explain: "Go'da `Liters(-5)` konversiyasi baribir kompilyatsiya bo'ladi: tip faqat nomlangan chegara, kompilyator diapazonni tekshirmaydi. Himoya konvensiyaga tayanadi: paketdan tashqarida qiymat konstruktor orqali yaratiladi (maydonlar yashirin bo'lsa, struct'da bu majburiy ham bo'ladi). Foyda - tekshiruv bir joyda."
task:
  title: "Xatoni HTTP statusga ishonchli tarjima qilish"
  prompt: |
    `statusOf` funksiyasi xatoni HTTP statusga aylantiradi, lekin o'ralgan xatolarda noto'g'ri ishlaydi: `err == ErrNotFound` o'ralgan xatoni topmaydi, `ConflictError` esa matn bo'yicha qidiriladi, `errors.Join` natijasida esa 404 o'rniga 500 chiqadi.

    `statusOf`ni qayta yozing:

    - `nil` uchun 200;
    - zanjirda `ErrNotFound` bo'lsa 404 (`errors.Is`);
    - zanjirda `*ConflictError` bo'lsa 409 (`errors.As`);
    - qolgan hammasi uchun 500.

    Imzo va `main`ni o'zgartirmang. Kutilgan chiqish: `404 409 404 500`.
  lang: go
  starter: |
    package main

    import (
        "errors"
        "fmt"
        "net/http"
        "strings"
    )

    var ErrNotFound = errors.New("topilmadi")

    type ConflictError struct{ Key string }

    func (e *ConflictError) Error() string { return "konflikt: " + e.Key }

    // statusOf xatoni HTTP statusga aylantiradi. Hozir o'ralgan xatolarda noto'g'ri ishlaydi.
    func statusOf(err error) int {
        if err == nil {
            return http.StatusOK
        }
        if err == ErrNotFound {
            return http.StatusNotFound
        }
        if strings.Contains(err.Error(), "konflikt") {
            return http.StatusConflict
        }
        return http.StatusInternalServerError
    }

    func main() {
        wrapped := fmt.Errorf("load vehicle: %w", ErrNotFound)
        conflict := fmt.Errorf("save: %w", &ConflictError{Key: "truck-7"})
        joined := errors.Join(errors.New("log yozilmadi"), wrapped)
        fmt.Println(statusOf(wrapped), statusOf(conflict), statusOf(joined), statusOf(errors.New("kutilmagan")))
    }
  solution: |
    package main

    import (
        "errors"
        "fmt"
        "net/http"
    )

    var ErrNotFound = errors.New("topilmadi")

    type ConflictError struct{ Key string }

    func (e *ConflictError) Error() string { return "konflikt: " + e.Key }

    // statusOf xatoni HTTP statusga aylantiradi: o'ralgan va birlashtirilgan xatolarda ham ishlaydi.
    func statusOf(err error) int {
        var ce *ConflictError
        switch {
        case err == nil:
            return http.StatusOK
        case errors.Is(err, ErrNotFound):
            return http.StatusNotFound
        case errors.As(err, &ce):
            return http.StatusConflict
        default:
            return http.StatusInternalServerError
        }
    }

    func main() {
        wrapped := fmt.Errorf("load vehicle: %w", ErrNotFound)
        conflict := fmt.Errorf("save: %w", &ConflictError{Key: "truck-7"})
        joined := errors.Join(errors.New("log yozilmadi"), wrapped)
        fmt.Println(statusOf(wrapped), statusOf(conflict), statusOf(joined), statusOf(errors.New("kutilmagan")))
    }
  solutionNotes: |
    - `errors.Is` zanjirni (`%w` va `errors.Join` orqali o'ralgan xatolarni) yuqoridan pastga yuradi, `==` esa faqat eng tashqi qiymatni solishtiradi.
    - `errors.As` tipga tayanadi: xabar matni o'zgarsa ham 409 saqlanadi.
    - `switch` tartibi muhim: `nil` birinchi, keyin aniqroq tekshiruvlar, `default` - 500.
    - Birlashtirilgan xatoda (`errors.Join`) ikkinchi xato `ErrNotFound` o'rab olgani uchun 404 chiqadi.
  checklist:
    - "`nil` xato 200 qaytaradi"
    - "O'ralgan `ErrNotFound` 404 beradi (`errors.Is`)"
    - "O'ralgan `*ConflictError` 409 beradi (`errors.As`), matn tekshiruvi yo'q"
    - "`errors.Join` ichidagi `ErrNotFound` ham topiladi"
    - "Kutilmagan xato 500; chiqish `404 409 404 500`"
---

## Muammo

Servisning chekkalarida uch xil dunyo uchrashadi: tashqi mijoz JSON yuboradi, biznes mantiq o'z qoidalari bilan ishlaydi, baza esa o'z drayver xatolari va tiplari bilan javob beradi. Har chegarada tarjima qilinmasa, bir qatlamning tafsiloti boshqasiga o'tib ketadi. Real oqibatlar: mijoz javobida `pq: duplicate key value violates unique constraint` yoki `connection failure` matni ko'rinadi; domen kodi `http.StatusConflict` konstantasini biladi va endi uni gRPC yoki CLI'dan chaqirib bo'lmaydi; `{}` va `{"liters": 0}` bir xil ko'rinadi va noto'g'ri yuborilgan so'rov nol litr sifatida saqlanadi; 64 bitli identifikator JSON orqali o'tganda oxirgi raqamlari yo'qoladi.

Node.js'da bu ko'pincha `throw new HttpException(409, ...)` ni servis ichida otish va global exception filter bilan ushlash orqali yechiladi. U ishlaydi, lekin servis HTTP tushunchasiga bog'lanadi. Go'da xato qiymat, shuning uchun tarjima oddiy kodga aylanadi: har qatlam o'z xatolarini qaytaradi, chegara ularni tashqi shartnomaga o'giradi. Bu dars 91-darsdagi tuzilmaning tikuvlarini ko'rib chiqadi: DTO dan domenga, domendan saqlashga va xatolarning teskari yo'nalishda tarjimasi.

## Asosiy g'oya

### Xato qiymat va tarjima

"Error handling and Go" maqolasi xato oddiy `error` interface qiymati ekanini, ya'ni dasturchi xatoga o'z tipini berib, ma'lumot qo'shishi mumkinligini ko'rsatadi. Maqolaning keyingi qismi aynan HTTP uchun amaliy naqsh beradi: handler `error` qaytaradi, yagona o'rovchi uni javobga aylantiradi, shunda takroriy `if err != nil { http.Error(...) }` bloklari bir joyga yig'iladi. Biz shu fikrni zamonaviy `errors.Is/As` bilan birlashtiramiz:

1. Pastki qatlam (baza adapteri) drayver xatosini oladi va domen xatosiga tarjima qiladi: unique violation `ErrDuplicate`, qator yo'qligi `ErrNotFound`.
2. Servis domen xatolarini o'z kontekstini qo'shib (`%w` bilan) yuqoriga uzatadi.
3. Chegara (HTTP handler) xatoni `errors.Is/As` bilan tasniflaydi va status hamda xavfsiz xabarga aylantiradi. Kutilmagan xatoni log qiladi va mijozga umumiy "ichki xato" qaytaradi.

Code Review Comments ikkita qo'shimcha qoida beradi: xatoni `_` bilan e'tiborsiz qoldirmaslik va xato matnini kichik harf bilan, tinish belgisiz yozish (chunki u boshqa xabarlar ichiga qo'shiladi). 100 Go Mistakes bo'limlari esa o'rash (`%w`) bilan oddiy matn qo'shish (`%v`) farqini va `errors.Is/As` o'rniga `==` ishlatishning xavfini tushuntiradi (31-32 darslar).

### Yaroqsiz holatni tip bilan taqiqlash

Tashqi so'rov DTO'ga o'qiladi, DTO tekshirilib domen tipiga aylanadi, va faqat domen tipi servisga o'tadi. Bu "tekshirish" emas, "tahlil qilish" (parse) g'oyasi: chegaradan keyin kod tekshirilgan qiymat bilan ishlaydi va har qatlam qayta tekshirishga majbur emas. Go'da buni konstruktor funksiyalar va yashirin maydonlar beradi:

```go
type Liters float64

func NewLiters(v float64) (Liters, error) {
	if v < 0 || v > 2000 {
		return 0, fmt.Errorf("liters %v: 0 dan 2000 gacha bo'lishi kerak", v)
	}
	return Liters(v), nil
}
```

Muhim aniqlik: Go kompilyatori `Liters(-5)` konversiyasini taqiqlamaydi. Tip nomlangan chegara beradi, diapazonni majburlamaydi. Ishonchli himoya uchun struct maydonlarini kichik harf bilan yopib, qiymatni faqat konstruktor orqali yaratish mumkin; oddiy tipda esa himoya jamoa konvensiyasiga tayanadi. Shuni halol hisobga olish kerak.

## Chuqurroq: konvertatsiya nuqtalari

### DTO va domen alohida

Transport DTO'si JSON teglari, ixtiyoriy maydonlar (`*float64`) va tashqi nomlarni biladi. Domen tipi esa ularni bilmaydi va to'liq to'ldirilgan bo'ladi. Ular bitta struct bo'lsa, ichki o'zgarish (maydon qo'shish, qayta nomlash) tashqi API'ni buzadi va aksincha. Ajratishning narxi - `toDomain()` kabi bitta funksiya. Bu funksiya barcha maydon xatolarini yig'adi (birinchisida to'xtamaydi), shunda mijoz hammasini birdan ko'radi.

### Mavjud emas va nol

Go'da maydonning zero value'si va "yuborilmagan" farqlanmaydi. Quyidagi tajriba (Go 1.24.7) buni ko'rsatadi, shuningdek JSON sonlarining aniqligini:

```go
package main

import (
	"encoding/json"
	"fmt"
	"strings"
)

type withPtr struct {
	Liters *float64 `json:"liters"`
}

type withValue struct {
	Liters float64 `json:"liters"`
}

func main() {
	const raw = `{"odometer": 9007199254740993}`

	var anyMap map[string]any
	json.Unmarshal([]byte(raw), &anyMap)
	fmt.Printf("any ichiga:    %v\n", anyMap["odometer"])

	dec := json.NewDecoder(strings.NewReader(raw))
	dec.UseNumber()
	var numMap map[string]any
	dec.Decode(&numMap)
	fmt.Printf("UseNumber:     %v\n", numMap["odometer"])

	var typed struct {
		Odometer int64 `json:"odometer"`
	}
	json.Unmarshal([]byte(raw), &typed)
	fmt.Printf("int64 maydon:  %d\n", typed.Odometer)

	for _, body := range []string{`{}`, `{"liters": 0}`} {
		var v withValue
		var p withPtr
		json.Unmarshal([]byte(body), &v)
		json.Unmarshal([]byte(body), &p)
		fmt.Printf("%-14s qiymat=%v ko'rsatkich nil=%v\n", body, v.Liters, p.Liters == nil)
	}
}
```

```text
any ichiga:    9.007199254740992e+15
UseNumber:     9007199254740993
int64 maydon:  9007199254740993
{}             qiymat=0 ko'rsatkich nil=true
{"liters": 0}  qiymat=0 ko'rsatkich nil=false
```

Xulosa: majburiy bo'lmagan maydon uchun ko'rsatichli tip ishlatiladi; `any` ichiga o'qilgan JSON soni `float64` bo'ladi va 2^53 dan katta butun sonlarni buzadi, shuning uchun identifikatorlarni aniq `int64` (yoki string) maydonda yoki `UseNumber` bilan o'qing. Pul uchun ham `float64` ishlatmang: kopeyka/tiyin butun sonda yoki satr ko'rinishidagi decimal'da saqlanadi (bu muallifning tavsiyasi).

### Ikki sabab, bitta xato

Adapter drayver xatosini domen xatosiga o'girganda asl sababni yo'qotmasligi kerak, aks holda logda kontekst qolmaydi. `fmt.Errorf("%w: %w", ErrDuplicate, err)` ikkala xatoni o'raydi (bir nechta `%w` Go 1.20 dan): `errors.Is(err, ErrDuplicate)` handler uchun, `errors.As(err, &pgErr)` esa log yoki retry qarori uchun ishlaydi. Bu qaror adapter ichida qabul qilinadi, servis esa drayver tiplarini import qilmaydi.

### Ichki tafsilotni chiqarmaslik

Tarjima ikki yo'nalishli: ichki xato mijozga umumiy matn bilan boradi, to'liq zanjir esa logga (so'rov identifikatori bilan) yoziladi. Mijozga tafsilot faqat u tuzata oladigan holatda beriladi: validatsiya xatosi (qaysi maydon, nega) va konflikt. Baza xabari, stack yoki fayl yo'li hech qachon tashqariga chiqmaydi.

## Misol: DTO, domen, adapter va chegara

Dastur 91-dars tuzilmasini davom ettiradi: `readingRequest` DTO'si `toDomain()` bilan tekshiriladi va `Reading` domen tipiga aylanadi; `Store.Insert` drayver xatosini (SQLSTATE kodli soddalashtirilgan `pgError`) beradi; `Service.Record` uni `ErrDuplicate`ga tarjima qiladi; `writeError` esa chegarada status tanlaydi.

```go
package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"time"
)

// --- domen: tiplar yaroqsiz holatni ifodalay olmaydi ---

type VehicleID string

func NewVehicleID(s string) (VehicleID, error) {
	if s == "" || len(s) > 32 || strings.ContainsAny(s, " /") {
		return "", fmt.Errorf("vehicle_id %q: 1-32 belgi, bo'sh joy va / yo'q", s)
	}
	return VehicleID(s), nil
}

type Liters float64

func NewLiters(v float64) (Liters, error) {
	if v < 0 || v > 2000 {
		return 0, fmt.Errorf("liters %v: 0 dan 2000 gacha bo'lishi kerak", v)
	}
	return Liters(v), nil
}

type Reading struct {
	Vehicle VehicleID
	Liters  Liters
	At      time.Time
}

// Domen xatolari: pastki qatlam tafsilotlari ularda ko'rinmaydi.
var ErrDuplicate = errors.New("o'qish allaqachon mavjud")

// ValidationError chegarada to'plangan maydon xatolarini tashiydi.
type ValidationError struct{ Fields map[string]string }

func (e *ValidationError) Error() string {
	return fmt.Sprintf("validatsiya: %d ta maydon yaroqsiz", len(e.Fields))
}

// --- transport DTO va uni domenga aylantirish ---

type readingRequest struct {
	VehicleID string  `json:"vehicle_id"`
	Liters    float64 `json:"liters"`
	At        string  `json:"at"`
}

func (r readingRequest) toDomain() (Reading, error) {
	fields := map[string]string{}
	var out Reading
	var err error
	if out.Vehicle, err = NewVehicleID(r.VehicleID); err != nil {
		fields["vehicle_id"] = err.Error()
	}
	if out.Liters, err = NewLiters(r.Liters); err != nil {
		fields["liters"] = err.Error()
	}
	if out.At, err = time.Parse(time.RFC3339, r.At); err != nil {
		fields["at"] = "RFC 3339 vaqt kutilgan"
	}
	if len(fields) > 0 {
		return Reading{}, &ValidationError{Fields: fields}
	}
	return out, nil
}

// --- storage adapter: driver xatosini domen xatosiga aylantiradi ---

// pgError - drayver xatosining soddalashtirilgan ko'rinishi (SQLSTATE kodi bilan).
type pgError struct{ Code, Message string }

func (e *pgError) Error() string { return "pg: " + e.Code + " " + e.Message }

type Store struct{ seen map[string]bool }

func (s *Store) Insert(_ context.Context, r Reading) error {
	key := string(r.Vehicle) + "@" + r.At.Format(time.RFC3339)
	switch {
	case strings.HasPrefix(string(r.Vehicle), "broken"):
		return &pgError{Code: "08006", Message: "connection failure"}
	case s.seen[key]:
		return fmt.Errorf("insert reading: %w", &pgError{Code: "23505", Message: "unique_violation"})
	}
	s.seen[key] = true
	return nil
}

type Saver interface {
	Insert(ctx context.Context, r Reading) error
}

type Service struct{ store Saver }

func (s Service) Record(ctx context.Context, r Reading) error {
	err := s.store.Insert(ctx, r)
	var pe *pgError
	switch {
	case err == nil:
		return nil
	case errors.As(err, &pe) && pe.Code == "23505":
		// ikkala xatoni saqlaymiz: domen xatosi va asl sabab (Go 1.20 dan ko'p %w).
		return fmt.Errorf("%w: %w", ErrDuplicate, err)
	default:
		return fmt.Errorf("record %s: %w", r.Vehicle, err)
	}
}

// --- chegara: xatoni HTTP javobiga aylantirish ---

type problem struct {
	Error  string            `json:"error"`
	Fields map[string]string `json:"fields,omitempty"`
}

func writeError(w http.ResponseWriter, err error) {
	var ve *ValidationError
	status, p := http.StatusInternalServerError, problem{Error: "ichki xato"}
	switch {
	case errors.As(err, &ve):
		status, p = http.StatusUnprocessableEntity, problem{Error: "yaroqsiz so'rov", Fields: ve.Fields}
	case errors.Is(err, ErrDuplicate):
		status, p = http.StatusConflict, problem{Error: "allaqachon mavjud"}
	default:
		fmt.Println("LOG ichki sabab:", err) // mijozga chiqmaydi, logga ketadi
	}
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(p)
}

func handler(svc Service) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		var dto readingRequest
		if err := json.NewDecoder(req.Body).Decode(&dto); err != nil {
			writeError(w, &ValidationError{Fields: map[string]string{"body": "yaroqsiz JSON"}})
			return
		}
		r, err := dto.toDomain()
		if err == nil {
			err = svc.Record(req.Context(), r)
		}
		if err != nil {
			writeError(w, err)
			return
		}
		w.WriteHeader(http.StatusCreated)
	})
}

func main() {
	h := handler(Service{store: &Store{seen: map[string]bool{}}})
	send := func(body string) {
		rec := httptest.NewRecorder()
		h.ServeHTTP(rec, httptest.NewRequest("POST", "/readings", strings.NewReader(body)))
		fmt.Printf("%d %s", rec.Code, rec.Body.String())
		if rec.Body.Len() == 0 {
			fmt.Println()
		}
	}
	ok := `{"vehicle_id":"truck-7","liters":182.5,"at":"2026-11-03T09:00:00Z"}`
	send(ok)
	send(ok)
	send(`{"vehicle_id":"","liters":-5,"at":"kecha"}`)
	send(`{"vehicle_id":"broken-1","liters":10,"at":"2026-11-03T09:00:00Z"}`)
}
```

Go 1.24.7, linux/amd64 da chiqish:

```text
201 
409 {"error":"allaqachon mavjud"}
422 {"error":"yaroqsiz so'rov","fields":{"at":"RFC 3339 vaqt kutilgan","liters":"liters -5: 0 dan 2000 gacha bo'lishi kerak","vehicle_id":"vehicle_id \"\": 1-32 belgi, bo'sh joy va / yo'q"}}
LOG ichki sabab: record broken-1: pg: 08006 connection failure
500 {"error":"ichki xato"}
```

Qatorma-qator:

- Birinchi so'rov 201. Ikkinchisi xuddi shu `(vehicle, at)` juftligi, adapter `23505` (unique violation) qaytaradi, servis `ErrDuplicate`ga tarjima qiladi, handler 409 beradi. Mijoz "allaqachon mavjud" ni ko'radi, SQLSTATE emas.
- Uchinchi so'rovda uchala maydon xato; `toDomain()` hammasini birdan qaytaradi (422 va `fields`). Maydon xabarlari kalit tartibida JSON'ga tushadi, chunki `encoding/json` map kalitlarini saralaydi.
- To'rtinchi so'rov kutilmagan xatoga olib keladi (`08006`). Mijoz faqat `ichki xato` oladi, `LOG ichki sabab:` qatori esa to'liq zanjirni ko'rsatadi. Production'da bu qator `slog` orqali request id bilan yoziladi (84-dars).

## Qachon qo'llamaslik kerak

- Oddiy CRUD'da DTO va domen tiplarini majburan ajratish ko'p takror yozuvga olib keladi. Agar ikkala struct maydon-ma'noda bir xil bo'lsa va API ichki xizmatlar uchun bo'lsa, bitta tip yetarli; ajratishni birinchi haqiqiy farq (yashirin maydon, boshqa nom) paydo bo'lganda kiriting.
- Har qiymat uchun alohida tip (`VehicleID`, `Liters`, `Lat`, `Lon`...) o'qishni og'irlashtirishi mumkin. Tipni xato tarixi yoki muhim qoida bor joyga qo'ying, hamma `string`ni o'rab chiqmang.
- Har xato holati uchun alohida tip yozmang. Ko'pincha 3-5 sentinel yoki bitta `ValidationError` yetadi. Xatolar soni o'sib ketsa, ular domen xatolari emas, balki tafsilotlardir.
- Xatoni har qatlamda qayta o'ramang: `a: b: c: d: not found` zanjiri o'qishni qiyinlashtiradi. Kontekst qo'shing, takrorlamang.
- Validatsiyani hamma qatlamda takrorlamang. Chegarada tekshirib, domen konstruktorida himoyalansangiz, servis va store qayta tekshirishga muhtoj emas.

## Stack'da: TypeScript bilan solishtirish

TypeScript tiplari ish vaqtida mavjud emas: `body: CreateReadingDto` deb yozish tashqi JSON shu shaklda ekanini kafolatlamaydi, shuning uchun `class-validator` yoki `zod` kabi runtime tekshiruv chegarada majburiy. Go'da JSON struct'ga o'qilganda tip mosligi (son o'rniga satr kelsa) dekodlashning o'zida xato beradi, lekin diapazonlar, majburiy maydonlar va biznes qoidalar baribir qo'lda tekshiriladi. Ikkinchi farq - exception'lar: NestJS'da `ExceptionFilter` xatoni global ushlaydi, Go'da esa har xato qiymat va `errors.Is/As` bilan aniq tasniflanadi, shuning uchun xato yo'li funksiya imzosida ko'rinadi. Uchinchi tomondan, Go'da `any` va map'ga o'qish sonlarni `float64` ga aylantiradi, bu JavaScript `number` bilan bir xil cheklov (2^53); BigInt yoki satr identifikator ikkala stekda ham xavfsiz yo'l.

## Xulosa

- Har chegarada tarjima qiling: DTO dan domenga, drayver xatosidan domen xatosiga, domen xatosidan statusga.
- Yaroqsiz holatni imkon qadar ifodalab bo'lmaydigan qiling: konstruktor, yashirin maydonlar; tip o'zi diapazonni tekshirmasligini unutmang.
- Maydon yo'qligi uchun ko'rsatkich, aniq sonlar uchun `int64` yoki `UseNumber` ishlating; `any` ichidagi JSON sonlari `float64`.
- Xatoni matn bo'yicha emas, `errors.Is/As` bilan tasniflang; bir nechta `%w` (Go 1.20 dan) domen xatosini ham, asl sababni ham saqlaydi.
- Ichki xato tafsilotini mijozga chiqarmang: logga to'liq zanjir, javobga barqaror xabar.
- DTO/domen ajratish va maxsus tiplar xarajat keltiradi: ularni haqiqiy farq yoki xavf bor joyga qo'ying.
