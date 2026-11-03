---
n: 23
slug: type-assertion-switch
title: "Type assertion, type switch va yopiq interface'lar"
summary: "Interface qiymatidan konkret tipni qanday olish kerak: type assertion va comma-ok, type switch qoidalari, nil holati, xato xabarlari, ixtiyoriy interface'ga o'tish naqshi va unexported metod bilan yopilgan (sealed) interface'lar."
duration: 40
sources:
  - id: go-spec
    note: "Type assertions va Type switches bo'limlari: x.(T) semantikasi, comma-ok shakli, nil case, bir tipli va ko'p tipli case'dagi o'zgaruvchi tipi"
  - id: 100go
    note: "#8 any says nothing: any faqat haqiqatan har qanday tip kerak bo'lganda ishlatiladi; type assertion'ga undan qochish uchun asos"
  - id: gopl
    note: "7-bob (Interfaces) ichidagi type assertion va type switch mavzulari umumiy ma'noda; darsdagi aniq da'volar spetsifikatsiyadan tekshirilgan"
quiz:
  - q: "`var x any = \"gps\"` berilgan. Quyidagilardan qaysi biri to'g'ri?"
    options:
      - "`n := x.(int)` nol qiymat qaytaradi, panic bermaydi"
      - "`n, ok := x.(int)` panic beradi, chunki tip mos emas"
      - "`n := x.(int)` panic beradi (`interface conversion: interface {} is string, not int`), `n, ok := x.(int)` esa `0, false` qaytaradi"
      - "Ikkala shakl ham kompilyatsiya xatosi beradi, chunki `any` dan `int`ga o'tib bo'lmaydi"
    answer: 2
    explain: "Spetsifikatsiya: assertion bajarilmasa va comma-ok shakli ishlatilmasa, run-time panic; comma-ok shaklda panic yo'q, `v` T ning nol qiymati, `ok` false. Kompilyatsiya xatosi faqat T interface'ning type set'iga kira olmaydigan bo'lsa chiqadi, `any` uchun har qanday T mumkin."
  - q: "`switch v := x.(type) { case int, int64: ... }` (x - `any`). Shu case ichida `v` ning statik tipi nima?"
    options:
      - "`int`, birinchi ko'rsatilgan tip"
      - "`any`, ya'ni `x` ning tipi"
      - "`int64`, eng keng tip"
      - "Kompilyatsiya xatosi: bir case'da ikki tip bo'lmaydi"
    answer: 1
    explain: "Spetsifikatsiya: aynan bitta tip ko'rsatilgan case'da o'zgaruvchi shu tipga ega, aks holda (ko'p tip yoki default) o'zgaruvchi guard ifodasining tipiga ega. Shuning uchun ko'p tipli case'da `v` hamon `any` va `int` operatsiyalarini bajarib bo'lmaydi."
  - q: "`type Event interface{ isEvent() }`, `func (*Offline) isEvent() {}`. `var e Event = &Offline{}; switch e.(type) { case Offline: }` nima beradi?"
    options:
      - "Run-time'da `case Offline` hech qachon tanlanmaydi, lekin kompilyatsiya bo'ladi"
      - "`case Offline` tanlanadi, chunki Go pointerni avtomatik ochadi"
      - "Run-time panic"
      - "Kompilyatsiya xatosi: `impossible type switch case`, chunki `Offline` qiymat tipi `Event`ni implement qilmaydi (metod pointer receiver'li)"
    answer: 3
    explain: "Type switch'dagi har bir non-interface tip guard ifodasi tipini implement qilishi shart. `Offline` qiymatining method set'ida `isEvent` yo'q, kompilyator 'impossible type switch case' xatosini beradi. Kerakli case `*Offline`."
  - q: "Kutubxona `Event` interface'ini unexported `isEvent()` metodi bilan e'lon qildi. Tashqi paket `Custom` tipi uchun `func (Custom) isEvent() {}` yozdi. Nima bo'ladi?"
    options:
      - "Ishlaydi: metod nomi bir xil bo'lsa yetarli"
      - "Kompilyatsiya xatosi: `Custom does not implement event.Event (unexported method isEvent)`; unexported metod boshqa paketdagi metod bilan mos kelmaydi"
      - "Run-time panic type assertion paytida"
      - "Ishlaydi, lekin faqat `go vet` ogohlantiradi"
    answer: 1
    explain: "Unexported metod nomi paketga bog'langan, boshqa paketdagi bir xil yozilgan nom boshqa nom hisoblanadi. Shu sababli interface 'yopiq' bo'ladi: uni faqat e'lon qilingan paket ichidagi tiplar implement qila oladi. Bu yopiq bo'lgan tiplar to'plamini (sum type'ga o'xshash) kuzatish imkonini beradi."
  - q: "`var e Event` (nil interface) bo'yicha `switch e.(type)` da faqat `case fmt.Stringer` va `default` shoxlari bor. Nil `e` qaysi shoxga tushadi?"
    options:
      - "`case fmt.Stringer`, chunki nil har qanday interface'ga mos"
      - "Run-time panic, chunki nil'ni type switch'ga berib bo'lmaydi"
      - "`default`, chunki nil interface hech qaysi tipli case'ga mos kelmaydi"
      - "Hech qaysi shoxga, switch o'tkazib yuboriladi"
    answer: 2
    explain: "Spetsifikatsiya: `nil` case guard nil interface bo'lganda tanlanadi. `case nil` yo'q bo'lsa va boshqa case'larga tip mos kelmasa, `default` ishlaydi. `nil` shoxini aniq yozish ma'qul."
  - q: "`json.Unmarshal` natijasidagi `map[string]any` da `\"fuel\": 54` bor. `m[\"fuel\"].(int)` nima qaytaradi?"
    options:
      - "`54, true`"
      - "`0, false`: JSON raqamlari `any`ga `float64` sifatida joylanadi"
      - "`54, false`"
      - "Panic: `int` bo'lmagan tipga assertion mumkin emas"
    answer: 1
    explain: "`encoding/json` hujjati: JSON raqami `any`ga `float64` bo'lib dekodlanadi. Dynamic tip `float64`, shuning uchun `.(int)` comma-ok shaklda `0, false` beradi; yagona shaklda esa panic bo'lardi."
task:
  title: "Ochiq interface va satr bo'yicha tarmoqlanishni yopiq interface + type switch bilan almashtirish"
  prompt: |
    `handle` funksiyasi `Command` interface'idagi `Name()` bo'yicha satrga qarab tarmoqlanadi va ichkarida `c.(Start)` kabi yakka assertion'lar ishlatadi. Muammolar: `SetLimit` buyrug'i hech qayerda ko'rilmagan va jimgina bo'sh satr qaytaradi; `Name()` satri bilan haqiqiy tip bir-biriga mos kelmasa panic bo'ladi; tashqi paket ham `Command`ni implement qila oladi.

    Vazifa:
    1. `Command`ni yopiq interface qiling (unexported metod, `Name()` kerak emas).
    2. `handle`ni type switch bilan qayta yozing. U `(string, error)` qaytarsin. Har bir buyruq tipi uchun ma'noli natija bering, `nil` buyruq va noma'lum tip uchun alohida xato qaytaring (panic emas).
    3. `main`da `SetLimit` va `nil` holatlarini ham chaqiring.
  lang: go
  starter: |
    package main

    import "fmt"

    type Command interface {
        Name() string
    }

    type Start struct{ DeviceID string }
    type Stop struct{ DeviceID string }
    type SetLimit struct {
        DeviceID string
        Liters   float64
    }

    func (Start) Name() string    { return "start" }
    func (Stop) Name() string     { return "stop" }
    func (SetLimit) Name() string { return "set-limit" }

    // handle buyruqni qayta ishlaydi. Muammo: Command ochiq interface, yangi tip
    // qo'shilganda default jimgina yutib yuboradi va Name() bo'yicha satr taqqoslash xatoga moyil.
    func handle(c Command) string {
        switch c.Name() {
        case "start":
            return "ishga tushirildi: " + c.(Start).DeviceID
        case "stop":
            return "to'xtatildi: " + c.(Stop).DeviceID
        }
        return ""
    }

    func main() {
        fmt.Println(handle(Start{"T-1"}))
        fmt.Println(handle(Stop{"T-2"}))
        fmt.Printf("%q\n", handle(SetLimit{"T-3", 50}))
    }
  solution: |
    package main

    import "fmt"

    // Command yopiq interface: faqat shu paketdagi tiplar uni implement qila oladi.
    type Command interface {
        isCommand()
    }

    type Start struct{ DeviceID string }
    type Stop struct{ DeviceID string }
    type SetLimit struct {
        DeviceID string
        Liters   float64
    }

    func (Start) isCommand()    {}
    func (Stop) isCommand()     {}
    func (SetLimit) isCommand() {}

    // handle type switch ishlatadi; noma'lum tip panic emas, aniq xato.
    func handle(c Command) (string, error) {
        switch v := c.(type) {
        case Start:
            return "ishga tushirildi: " + v.DeviceID, nil
        case Stop:
            return "to'xtatildi: " + v.DeviceID, nil
        case SetLimit:
            return fmt.Sprintf("limit %.0f l: %s", v.Liters, v.DeviceID), nil
        case nil:
            return "", fmt.Errorf("buyruq nil")
        default:
            return "", fmt.Errorf("qayta ishlanmagan buyruq: %T", v)
        }
    }

    func main() {
        for _, c := range []Command{Start{"T-1"}, Stop{"T-2"}, SetLimit{"T-3", 50}, nil} {
            fmt.Println(handle(c))
        }
    }
  solutionNotes: |
    - `isCommand()` unexported metod: faqat shu paketdagi tiplar `Command`ni implement qila oladi. `Name()` va satr bo'yicha tarmoqlanish kerak bo'lmay qoldi: tipning o'zi ma'lumot tashiydi.
    - Type switch har bir shoxda tipga mos o'zgaruvchi (`v`) beradi, shuning uchun `c.(Start)` kabi yakka assertion va u keltirib chiqaradigan panic xavfi yo'q.
    - `case nil` aniq yozilgan: aks holda nil `Command` `default` shoxiga tushar va xabar `%T` bilan `<nil>` chiqarar edi.
    - `default` shoxi xato qaytaradi, jimgina bo'sh satr emas. Kompilyator type switch to'liqligini tekshirmaydi, shuning uchun yangi buyruq tipi qo'shilib, `handle` yangilanmasa, bu shox buni run-time'da xabar beradi.
    - Yopiq interface foydalanuvchi paketlarga yangi buyruq qo'shishga ruxsat bermaydi. Bu ataylab tanlangan cheklov (trade-off): kengaytirish kerak bo'lsa, ochiq interface va metod bilan polimorfizm to'g'riroq.
  checklist:
    - "`Command` unexported metodli interface"
    - "`handle` type switch ishlatadi va `(string, error)` qaytaradi"
    - "`SetLimit` uchun ma'noli natija chiqadi"
    - "`nil` buyruq panic emas, aniq xato beradi"
    - "`default` shoxi noma'lum tipni xato sifatida qaytaradi, `go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Go'da interface qiymati ichida konkret tip va qiymat yashaydi (17-dars). Ko'p vaqt interface orqali ishlash yetarli, lekin ba'zan qiymatning aniq tipiga qaytish kerak: hodisalar oqimida har xil turdagi xabarlar, `json.Unmarshal` natijasidagi `any`, xatolarning konkret turi, yoki ixtiyoriy imkoniyat (masalan, `Flush` metodi) bor-yo'qligini bilish. Bu ishni type assertion va type switch bajaradi.

Production'dagi og'riq ikki tomondan keladi. Birinchisi: yakka `x.(T)` yozuvi tip mos kelmasa panic beradi va bu panic goroutine'ni, ko'p hollarda butun servisni yiqitadi. Ikkinchisi: ochiq interface bo'yicha type switch yozilganda yangi tip qo'shilganda eski shoxlar uni jimgina `default`ga tushiradi yoki umuman e'tiborsiz qoldiradi. TypeScript'da discriminated union va `never` bilan to'liqlik tekshiruvi bor, Go'da yo'q, shuning uchun bu yerda dizayn va disiplin kerak: qachon assertion, qachon type switch, qachon yopiq interface va qachon umuman metod orqali polimorfizm.

## Asosiy g'oya

### Type assertion

Spetsifikatsiya: `x.(T)` ifodasi interface tipidagi `x` nil emasligini va ichidagi qiymat `T` tipida ekanini tasdiqlaydi. Ikki holat bor:

- `T` interface bo'lmagan tip: `x` ning dynamic tipi `T` ga aynan teng bo'lishi kerak (identical). `T` shu bilan birga `x` ning interface tipini implement qilishi shart, aks holda assertion tuzilishining o'zi noto'g'ri (kompilyatsiya xatosi).
- `T` interface tip: `x` ning dynamic tipi `T` interface'ini implement qilishi kerak.

Tasdiq bajarilmasa va yakka shakl ishlatilgan bo'lsa, run-time panic bo'ladi. `v, ok := x.(T)` shaklida panic yo'q: `ok` true yoki false, va false bo'lganda `v` `T` ning nol qiymati. Bu comma-ok shakli, ish kodida odatiy tanlov.

### Type switch

Type switch tiplarni qiymatlar o'rniga solishtiradi. Guard `x.(type)` shaklida yoziladi, har bir `case` esa tip (yoki tiplar ro'yxati, yoki `nil`) bo'ladi. Qoidalar spetsifikatsiyadan:

- `x` interface tipida bo'lishi kerak, va case'dagi har bir non-interface tip shu interface'ni implement qilishi shart.
- Case'lardagi tiplar bir-biridan farqli bo'lishi shart.
- `case nil` guard ifodasi nil interface bo'lganda tanlanadi, va ko'pi bilan bittasi bo'lishi mumkin.
- `v := x.(type)` shaklida `v` har bir case'da e'lon qilinadi: case'da aynan bitta tip bo'lsa `v` shu tipda, aks holda (ko'p tip, `nil`, `default`) `v` guard ifodasining tipida.

Bu qoidalar amaliy xulosa beradi: qiymatni ishlatmoqchi bo'lsangiz, tipni bitta case'ga bittadan yozing.

## Chuqurroq: nozik holatlar

### Xato xabarlari

Yakka shakl muvaffaqiyatsiz bo'lganda panic matni dynamic va so'ralgan tipni ko'rsatadi. Go 1.24.7 da:

```text
interface conversion: interface {} is string, not int
interface conversion: interface is nil, not main.Stringer
```

Birinchisi tip mos kelmaganda, ikkinchisi `x` nil bo'lganda. Nil interface bo'yicha comma-ok shakl ham xavfsiz: `ok` false. Kompilyator imkonsiz assertion'ni ham kompilyatsiya vaqtida ushlaydi:

```text
impossible type assertion: r.(T)
	T does not implement Reader (missing method Read)
```

### Qiymat yoki pointer

Dynamic tip aniq teng bo'lishi kerak, shuning uchun `T` va `*T` ikki xil tip. `*Offline` saqlangan interface uchun `case Offline` mos kelmaydi. Agar `Offline` qiymat tipi interface'ni implement qilmasa (metod pointer receiver'li), kompilyator buni oldindan ushlaydi:

```text
impossible type switch case: Offline
	e (variable of interface type Event) cannot have dynamic type Offline (method isEvent has pointer receiver)
```

Bu xabar ham Go 1.24.7 dan. Shu sababli type switch'da qaysi tipni (qiymat yoki pointer) interface'ga solishingiz konvensiya bo'lishi kerak va butun kodda izchil saqlanishi lozim.

### Nil interface

Nil interface type switch'ga berilsa, tip case'lari mos kelmaydi. `case nil` bo'lmasa `default` tanlanadi. Shuning uchun `case nil`ni ochiq yozish tushunarliroq. Bu 18-darsdagi klassik tuzoq bilan chalkashmasin: u yerda interface nil emas (tipi bor, qiymati nil pointer) va `case nil` unga mos kelmaydi, `case *T` esa mos keladi.

### Ixtiyoriy interface'ga o'tish

Ma'lum qiymatga qo'shimcha imkoniyat bor-yo'qligini type assertion bilan interface'ga o'tib tekshirish mumkin: `if f, ok := w.(flusher); ok { f.Flush() }`. Bu 'optional interface' naqshi. Uning afzalligi: asosiy interface kichik qoladi (`io.Writer`ga `Flush` qo'shilmaydi), imkoniyat esa mavjud bo'lganda ishlatiladi. Kamchiligi: tekshiruv ish vaqtida, kompilyator talabni nazorat qilmaydi, va o'rovchi (wrapper) tip ichki qiymatning qo'shimcha interface'larini yo'qotib qo'yishi mumkin. O'rovchi `w` ni o'rasa, `flusher` assertion o'rovchiga qo'llanadi, ichkariga emas. Shu sababli o'rovchilar ham kerakli metodlarni ochiqlashi lozim.

### Yopiq (sealed) interface

Unexported metodli interface faqat e'lon qilingan paket ichidagi tiplar tomonidan implement qilinadi, chunki unexported nom paketga bog'langan. Tashqi paketdan urinish kompilyatsiya xatosi beradi:

```text
cannot use Custom{} (value of struct type Custom) as event.Event value in variable declaration: Custom does not implement event.Event (unexported method isEvent)
```

Bu Go'da sum type'ga eng yaqin vosita: tiplar to'plami ma'lum va yopiq, shuning uchun type switch shu to'plamni qamrab olishi mumkin. Lekin kompilyator to'liqlikni tekshirmaydi: yangi tip qo'shilganda eski switch'lar `default`ga tushadi. Shu sababli `default`da xato qaytaring yoki panic qiling (dasturchi xatosi bo'lsa), jimgina e'tiborsiz qoldirmang. To'liqlikni tekshiradigan uchinchi tomon linter'lar bor, lekin ular bu kursning manbalarida yo'q va bu yerda tavsiya sifatida emas, mavjud variant sifatida eslatiladi.

## Misol: hodisa oqimi va ixtiyoriy interface

Dastur telemetriya hodisalarini yopiq `Event` interface'i orqali ifodalaydi: `Position`, `FuelDrop` (qiymat tiplari) va `*Offline` (pointer). `describe` type switch bilan tarmoqlanadi, `kind` ko'p tipli case'da `v`ning tipini ko'rsatadi, `write` esa ixtiyoriy `flusher` interface'iga o'tadi.

```go
package main

import (
	"fmt"
	"io"
	"strings"
)

// Event yopiq interface: isEvent eksport qilinmagan, tashqi paket uni implement qila olmaydi.
type Event interface {
	isEvent()
}

type Position struct{ Lat, Lon float64 }
type FuelDrop struct {
	DeviceID string
	Liters   float64
}
type Offline struct{ DeviceID string }

func (Position) isEvent() {}
func (FuelDrop) isEvent() {}
func (*Offline) isEvent() {}

func describe(e Event) string {
	switch v := e.(type) {
	case nil:
		return "hodisa yo'q"
	case Position:
		return fmt.Sprintf("nuqta %.2f,%.2f", v.Lat, v.Lon)
	case FuelDrop:
		if v.Liters > 20 {
			return "yoqilg'i o'g'irlanishi shubhasi: " + v.DeviceID
		}
		return "yoqilg'i pasayishi"
	case *Offline:
		return "oflayn: " + v.DeviceID
	default:
		return fmt.Sprintf("noma'lum tip %T", v)
	}
}

// Ikki tipli case: v interface'ligicha qoladi.
func kind(x any) string {
	switch v := x.(type) {
	case int, int64:
		return fmt.Sprintf("butun son, dinamik tip %T", v)
	case string:
		return "satr, uzunligi " + fmt.Sprint(len(v))
	}
	return "boshqa"
}

// Ixtiyoriy imkoniyat: qabul qilingan qiymatda qo'shimcha interface bormi.
type flusher interface{ Flush() error }

type bufWriter struct{ pending int }

func (b *bufWriter) Write(p []byte) (int, error) { b.pending += len(p); return len(p), nil }
func (b *bufWriter) Flush() error                { b.pending = 0; return nil }

func write(w io.Writer, s string) {
	w.Write([]byte(s))
	if f, ok := w.(flusher); ok {
		f.Flush()
		fmt.Println("flush chaqirildi")
	} else {
		fmt.Println("flush yo'q")
	}
}

func main() {
	events := []Event{Position{41.31, 69.28}, FuelDrop{"T-7", 35}, &Offline{"T-9"}, nil}
	for _, e := range events {
		fmt.Println(describe(e))
	}

	fmt.Println(kind(7), "|", kind(int64(7)), "|", kind("gps"), "|", kind(2.5))

	write(&bufWriter{}, "abc")
	write(&strings.Builder{}, "abc")

	var x any = "telemetriya"
	n, ok := x.(int)
	fmt.Println(n, ok)

	defer func() { fmt.Println("recover:", recover()) }()
	_ = x.(int)
}
```

Chiqish (Go 1.24.7, linux/amd64):

```text
nuqta 41.31,69.28
yoqilg'i o'g'irlanishi shubhasi: T-7
oflayn: T-9
hodisa yo'q
butun son, dinamik tip int | butun son, dinamik tip int64 | satr, uzunligi 3 | boshqa
flush chaqirildi
flush yo'q
0 false
recover: interface conversion: interface {} is string, not int
```

Tahlil:

- `describe` hodisalar ro'yxatida har tipni o'z shoxiga yuboradi, `nil` hodisa esa `case nil` ga tushadi. `FuelDrop` shoxida `v.Liters` ga kirish mumkin, chunki bu case'da `v` aynan `FuelDrop`.
- `kind` ko'p tipli `case int, int64` da `v` hamon `any`: `%T` dynamic tipni (`int` yoki `int64`) ko'rsatadi, lekin `v` ustida `int` operatsiyalari ishlamaydi.
- `write(&bufWriter{}, ...)` `Flush` bor tip uchun assertion'ni bajaradi, `strings.Builder` uchun esa `flush yo'q` chiqadi. Asosiy `io.Writer` interface'i o'zgarmadi.
- Oxirgi qatorlar: comma-ok `0 false` beradi, yakka assertion `recover`da ushlangan panic bilan tugaydi. Haqiqiy kodda panic'ni ushlash o'rniga comma-ok ishlatiladi.

JSON bilan ishlashda ham xuddi shu mexanizm: `json.Unmarshal` natijasi `map[string]any` bo'lganda qiymatlar `any` ichida keladi va ularni type switch ochadi.

```go
package main

import (
	"encoding/json"
	"fmt"
)

func main() {
	var m map[string]any
	_ = json.Unmarshal([]byte(`{"device":"T-1","fuel":54,"active":true,"tags":["gps"]}`), &m)
	for _, k := range []string{"device", "fuel", "active", "tags", "missing"} {
		switch v := m[k].(type) {
		case string:
			fmt.Println(k, "string", v)
		case float64:
			fmt.Println(k, "float64", v)
		case bool:
			fmt.Println(k, "bool", v)
		case []any:
			fmt.Println(k, "[]any", len(v))
		case nil:
			fmt.Println(k, "nil")
		}
	}
	_, isInt := m["fuel"].(int)
	fmt.Println(isInt)
}
```

```text
device string T-1
fuel float64 54
active bool true
tags []any 1
missing nil
false
```

`fuel` qiymati `float64` bo'lib keldi (JSON raqami `any`ga `float64` bo'lib dekodlanishi `encoding/json` hujjatida yozilgan), shuning uchun `.(int)` `false` beradi. `missing` kaliti mavjud emas, map nol qiymat (`nil` interface) qaytaradi va `case nil` unga mos. Tarkibi oldindan ma'lum JSON'ni `any` orqali ochishdan ko'ra struct'ga dekodlash ishonchliroq; `any` va type switch noma'lum yoki o'zgaruvchan shakldagi ma'lumot uchun.

## Qachon qo'llamaslik kerak

- Xatti-harakat tipga qarab farq qilsa, ko'pincha type switch o'rniga interface metodi yozish to'g'ri: har bir tip o'z mantig'ini o'zi biladi, yangi tip qo'shilganda switch'larni qidirib yurish kerak emas. Type switch shunda mos, qachonki tiplar to'plami yopiq va tarmoqlanish tashqaridan (masalan, serializatsiya yoki UI) keladi.
- Xatolarni `err.(*MyErr)` yoki `==` bilan tekshirmang: wrap qilingan xato assertion'dan o'tmaydi. Buning uchun `errors.Is` va `errors.As` bor (31-dars).
- `any` qabul qiladigan API'larda hamma narsani type switch bilan ochish tipik belgi: 100 Go Mistakes #8 'any hech narsa aytmaydi' deydi va kompilyator tekshiruvini yo'qotishni eslatadi. Imkon bo'lsa, generics (24-dars) yoki aniq interface ishlating.
- Konkret tipga assertion abstraksiyani buzadi: funksiya interface qabul qilib, ichkarida `*PgStore`ga o'tsa, soxta tip bilan test imkoni yo'qoladi (21-dars).
- Yopiq interface tashqi kod yoki testlar uchun soxta tip yozishni imkonsiz qiladi. Agar tashqi paketlar interface'ni implement qilishi kerak bo'lsa (masalan, plagin tizimi), yopiq interface mos emas.

## Stack'da: TypeScript bilan farq

TypeScript'da `type Event = Position | FuelDrop | Offline` va `kind` maydoni bo'yicha discriminated union kompilyator tomonidan to'liq tekshiriladi: `switch (e.kind)` da yangi variant qo'shsangiz, `never` tekshiruvi xato beradi. Go'da eng yaqin shakl yopiq interface va type switch, lekin to'liqlik tekshiruvi kompilyatorda yo'q. Amaliy xulosalar:

- Hodisa va buyruq turlari uchun yopiq interface + type switch yozing, `default`da aniq xato qaytaring, va yangi tip qo'shilganda `handle` testi uni qamrab olishi uchun har tip uchun test yozing.
- TypeScript'dagi `as Type` majburiy konvertatsiyasi tekshirmaydi, Go'da yakka `x.(T)` esa tekshiradi va panic beradi. Go'da `as`ga o'xshash narsa yo'q; ishonchsiz ma'lumot uchun doim comma-ok.
- TypeScript'da `typeof x === 'number'` JSON'dagi har qanday raqamni tutadi. Go'da `any` ichidagi raqam `float64`, shuning uchun `int` kutgan kod `false` oladi. Aniq struct'ga dekodlash bu tuzoqni yo'qotadi.
- NestJS'da `instanceof` bilan tekshirish Go'dagi type assertion'ga yaqin, lekin sinf ierarxiyasi bo'yicha emas, aniq tip bo'yicha ishlaydi (interface'ga assertion bundan mustasno).

## Xulosa

- `x.(T)` yakka shaklda mos kelmasa panic beradi; ishonchsiz ma'lumot uchun doim `v, ok := x.(T)` ishlating.
- Type switch'da `v` faqat bitta tipli case'da shu tipga ega; ko'p tipli, `nil` va `default` shoxlarida u guard ifodasining tipida qoladi.
- Dynamic tip aniq teng bo'lishi kerak: `T` va `*T` boshqa-boshqa tip, va qiymat tipi interface'ni implement qilmasa, kompilyator `impossible type switch case` xatosini beradi.
- Nil interface `case nil`ga (yoki u bo'lmasa `default`ga) tushadi: `case nil`ni ochiq yozing.
- Unexported metodli yopiq interface tiplar to'plamini chegaralaydi, lekin kompilyator switch to'liqligini tekshirmaydi: `default`da xato qaytaring. Xatti-harakat tipga bog'liq bo'lsa, avval interface metodini ko'rib chiqing.
