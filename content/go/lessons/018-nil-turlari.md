---
n: 18
slug: nil-turlari
title: "nil: pointer, interface, slice, map, channel va klassik tuzoq"
summary: "nil har bir tip uchun nimani anglatadi va nil qiymat bilan qaysi amallar xavfsiz, nima uchun nil pointer solingan error interface'i nil bo'lmaydi (typed nil), nil receiver, nil slice va bo'sh slice farqi, JSON'da null va []."
duration: 40
sources:
  - id: go-spec
    note: "Variables (dynamic type va nil), Map types, Channel types, Receive operator va Close bo'limlari, Representation of values (nil havola saqlashi mumkin bo'lgan tiplarning zero value'i)"
  - id: 100go
    note: "#22 (nil va bo'sh slice), #23 (slice bo'shligini tekshirish), #45 (nil receiver qaytarish)"
quiz:
  - q: "func find(id int) error { var e *NotFound; if id < 0 { e = &NotFound{id} }; return e }. find(5) != nil natijasi nima va nima uchun?"
    options:
      - "false: e nil bo'lgani uchun error ham nil"
      - "Kompilyatsiya xatosi: *NotFound ni error qilib bo'lmaydi"
      - "true: interface'ning dinamik tipi *NotFound, qiymati nil; interface nil emas"
      - "Panic: nil pointer error ga aylanmaydi"
    answer: 2
    explain: "Interface faqat dinamik tip ham, qiymat ham yo'q bo'lganda nil. Bu yerda dinamik tip *NotFound, qiymat esa nil pointer. Natija: error != nil true. To'g'ri yozuv: return nil yoki if id < 0 { return &NotFound{id} }; return nil."
  - q: "Quyidagi amallardan qaysi biri nil qiymat ustida panic BERMAYDI?"
    options:
      - "var m map[string]int; m[\"x\"] = 1"
      - "var s []int; s = append(s, 1)"
      - "var ch chan int; close(ch)"
      - "var f func(); f()"
    answer: 1
    explain: "Nil slice'ga append ishlaydi: yangi massiv ajratiladi. Nil map'ga yozish, nil kanalni yopish va nil funksiyani chaqirish run-time panic beradi."
  - q: "type Sensor struct{ ID int }. var p *Sensor; p.Label() chaqiriladi. Label qiymat receiver (func (s Sensor) Label()) bilan e'lon qilingan. Natija?"
    options:
      - "Label ichida s nil bo'ladi va chaqiruv ishlaydi"
      - "Kompilyatsiya xatosi"
      - "Bo'sh Sensor{} bilan ishlaydi"
      - "Nil pointer dereference panic: qiymat receiver uchun p dereference qilinadi"
    answer: 3
    explain: "Qiymat receiver chaqirilganda Go *p ni nusxalashi kerak, p esa nil: panic. Pointer receiver bo'lsa (func (s *Sensor) Label()), nil pointer metodga o'tadi va metod ichida s == nil ni tekshirish mumkin."
  - q: "type Report struct{ Alerts []string `json:\"alerts\"` }. Report{} json.Marshal qilinganda alerts maydoni qanday chiqadi?"
    options:
      - "[]"
      - "null"
      - "Maydon umuman chiqmaydi"
      - "\"\""
    answer: 1
    explain: "Nil slice JSON'da null bo'ladi, bo'sh nil bo'lmagan slice ([]string{}) esa []. Frontend alerts.map(...) ni kutayotgan bo'lsa, null uni sindiradi. Biz o'lchaganimizda nil uchun {\"alerts\":null}, bo'sh slice uchun {\"alerts\":[]} chiqdi."
  - q: "select ichida kanal o'zgaruvchisini ba'zan nil ga o'rnatish nima uchun foydali?"
    options:
      - "Kanal yopiladi va GC uni bo'shatadi"
      - "Nil kanalni yuborish/qabul qilish hech qachon tayyor bo'lmaydi, shu case select'dan 'o'chiriladi'"
      - "Nil kanal darhol nol qiymat beradi"
      - "Select panic bermasligi uchun"
    answer: 1
    explain: "Spetsifikatsiya: nil kanal hech qachon aloqa uchun tayyor emas, undan qabul qilish abadiy bloklanadi. Shu sababli select ichidagi unga tegishli case hech qachon tanlanmaydi. Bu tugagan manbani o'chirishning idiomatik usuli (42-dars)."
  - q: "Reestr xatosi typed nil edi, fmt.Println(err) esa 'xato: <nil>' chop etdi, panic bo'lmadi. Nima uchun?"
    options:
      - "err haqiqatan nil edi"
      - "fmt nil receiver sabab Error() metodida bo'lgan panic'ni ushlaydi va '<nil>' chop etadi; err esa baribir nil emas"
      - "Println xatolarni hech qachon chaqirmaydi"
      - "Error() metodi nil pointer bilan ishlaydi"
    answer: 1
    explain: "fmt hujjati: Error/String/GoString nil receiver tufayli panic qilsa, natija '<nil>' bo'ladi. Bu typed nil xatoni yashiradi: chop etilgan matn nil ko'rinadi, lekin err != nil rost. Shuning uchun nil bo'lgan natijani bevosita return nil qiling."
task:
  title: "Typed nil error va JSON null: ikki xatoni tuzatish"
  prompt: |
    Servisning `Validate` funksiyasi `*ValidationError` o'zgaruvchisini e'lon qilib, uni `error` sifatida qaytaradi. Xato bo'lmasa o'zgaruvchi nil qoladi, lekin natija `error` interface'iga o'ralgani uchun `err != nil` doim rost va `T-1 xato: <nil>` chop etiladi. Bundan tashqari `Build` ogohlantirishlar ro'yxatini `nil` slice sifatida olsa, JSON'da `"alerts":null` chiqadi, frontend esa `[]` kutadi.

    Vazifa: (1) `Validate` xato bo'lmaganda haqiqiy `nil` qaytarsin; (2) `Build` nil slice'ni bo'sh (nil bo'lmagan) slice'ga aylantirib, JSON'da `[]` chiqarsin. Imzolar o'zgarmasin. Kutilgan chiqish: `T-1 ok`, `T-2 xato: noto'g'ri maydon: fuel`, `{"device":"T-1","alerts":[]}`.
  lang: go
  starter: |
    package main

    import (
        "encoding/json"
        "fmt"
    )

    // ValidationError o'qish noto'g'ri bo'lganda qaytariladi.
    type ValidationError struct {
        Field string
    }

    func (e *ValidationError) Error() string { return "noto'g'ri maydon: " + e.Field }

    type Reading struct {
        Device string
        Fuel   float64
    }

    // Validate o'qishni tekshiradi; xato bo'lmasa nil qaytarishi kerak.
    func Validate(r Reading) error {
        var verr *ValidationError
        if r.Fuel < 0 {
            verr = &ValidationError{Field: "fuel"}
        }
        return verr
    }

    // Response API javobi: ogohlantirishlar ro'yxati har doim massiv bo'lishi kerak.
    type Response struct {
        Device string   `json:"device"`
        Alerts []string `json:"alerts"`
    }

    func Build(r Reading, alerts []string) Response {
        return Response{Device: r.Device, Alerts: alerts}
    }

    func main() {
        for _, r := range []Reading{{"T-1", 40}, {"T-2", -5}} {
            if err := Validate(r); err != nil {
                fmt.Println(r.Device, "xato:", err)
                continue
            }
            fmt.Println(r.Device, "ok")
        }

        b, _ := json.Marshal(Build(Reading{Device: "T-1"}, nil))
        fmt.Println(string(b))
    }
  solution: |
    package main

    import (
        "encoding/json"
        "fmt"
    )

    // ValidationError o'qish noto'g'ri bo'lganda qaytariladi.
    type ValidationError struct {
        Field string
    }

    func (e *ValidationError) Error() string { return "noto'g'ri maydon: " + e.Field }

    type Reading struct {
        Device string
        Fuel   float64
    }

    // Validate o'qishni tekshiradi; xato bo'lmasa nil qaytaradi.
    // Konkret pointer tipidagi nil error interface'iga o'ralmaydi.
    func Validate(r Reading) error {
        if r.Fuel < 0 {
            return &ValidationError{Field: "fuel"}
        }
        return nil
    }

    // Response API javobi: ogohlantirishlar ro'yxati har doim massiv bo'lishi kerak.
    type Response struct {
        Device string   `json:"device"`
        Alerts []string `json:"alerts"`
    }

    // Build nil slice'ni bo'sh (nil bo'lmagan) slice'ga aylantiradi: JSON'da [] chiqadi.
    func Build(r Reading, alerts []string) Response {
        if alerts == nil {
            alerts = []string{}
        }
        return Response{Device: r.Device, Alerts: alerts}
    }

    func main() {
        for _, r := range []Reading{{"T-1", 40}, {"T-2", -5}} {
            if err := Validate(r); err != nil {
                fmt.Println(r.Device, "xato:", err)
                continue
            }
            fmt.Println(r.Device, "ok")
        }

        b, _ := json.Marshal(Build(Reading{Device: "T-1"}, nil))
        fmt.Println(string(b))
    }
  solutionNotes: |
    - `Validate` endi konkret pointer o'zgaruvchisi o'rniga `return &ValidationError{...}` va `return nil` ishlatadi. `return nil` interface'ning dinamik tipini ham, qiymatini ham nil qiladi, shuning uchun `err != nil` to'g'ri ishlaydi. Qoida: error qaytaradigan funksiyada konkret xato tipidagi o'zgaruvchini hech qachon `error` sifatida qaytarmang.
    - Starter'dagi `xato: <nil>` chiqishi `fmt` ning nil receiver bilan bog'liq xatti-harakati (`Error()` ichida `e.Field` nil pointer dereference qiladi, `fmt` buni ushlab `<nil>` chop etadi). Bu typed nil'ni yashiradi.
    - `Build` da `if alerts == nil { alerts = []string{} }`: bo'sh, lekin nil emas slice JSON'da `[]` bo'ladi. Boshqa yechim: API qatlamida DTO tuzishda har doim `make([]string, 0, n)` ishlatish.
    - Dastur ichida nil va bo'sh slice'ni farqlamang: `len(s) == 0` ikkalasi uchun ishlaydi. Farq faqat tashqi chegarada (JSON, reflect) muhim.
  checklist:
    - "`Validate` xatosiz o'qish uchun haqiqiy `nil` qaytaradi (`err != nil` false)"
    - "Xatoli o'qishda `err` `*ValidationError` ni o'z ichiga oladi va matn saqlangan"
    - "JSON'da `alerts` nil slice uchun ham `[]` chiqadi"
    - "Imzolar o'zgarmagan"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

`nil` Go'da bitta so'z, lekin olti xil tipda olti xil ma'noga ega. Node.js'dan kelgan dasturchi `null`/`undefined` ni bilishi bilan tayyor deb o'ylaydi. Production'da esa to'rt xil xato chiqadi.

Birinchisi: nil map'ga yozish panic beradi, nil slice'ga yozish (append) esa ishlaydi, va ikkalasi tashqaridan bir xil ko'rinadi. Ikkinchisi: nil pointer bilan metod chaqirish ba'zan ishlaydi, ba'zan panic beradi. Uchinchisi: API javobida bo'sh ro'yxat `null` bo'lib ketadi va frontend `list.map` da qulaydi. To'rtinchisi eng mashhuri: funksiya nil xato qaytaradi, chaqiruvchi esa `err != nil` ni rost deb topadi, chunki interface ichida nil pointer o'ralgan. Bu dars nil'ni tip bo'yicha ajratib, ko'rsatadi: nimaga ruxsat berilgan, nima panic beradi va nima uchun interface'ning nil'i boshqacha.

## Asosiy g'oya

### nil nima

Spetsifikatsiyaning "Representation of values" bo'limi nil'ni shunday ta'riflaydi: `nil` - qiymatlari havolalarni o'z ichiga olishi mumkin bo'lgan tiplarning zero value'i. Bular: pointer, funksiya, interface, slice, map va kanal. `nil` o'zi tipga ega emas; kontekstga qarab shu tiplardan biriga aylanadi. Interface tipida u dinamik tipi ham yo'q qiymat degani (17-dars).

### Tipga qarab nima mumkin

Quyidagi jadval spetsifikatsiya qoidalari va bizning o'lchovimiz (Go 1.24.7) birlashmasi:

| Tip | O'qish, uzunlik, range | Yozish | Boshqa |
|---|---|---|---|
| pointer | `p.f` panic (nil dereference) | `p.f = x` panic | pointer receiver'li metod chaqirilishi mumkin, ichida `p == nil` tekshiriladi |
| slice | `len`, `cap` = 0; `range` 0 marta | `s[i] = x` panic (indeks chegarasidan tashqari) | `append(nil, x)` ishlaydi |
| map | `m[k]` zero value va `ok=false`; `range` 0 marta | `m[k] = x` panic | `delete` xavfsiz |
| kanal | qabul qilish abadiy bloklanadi | yuborish abadiy bloklanadi | `close(nil)` panic; nil kanal hech qachon tayyor emas |
| funksiya | - | - | chaqirish panic |
| interface | metod chaqirish panic | - | `==` nil bilan, dinamik tipi yo'q bo'lsa true |

Spetsifikatsiya map bo'yicha: nil map bo'sh map bilan teng, faqat element qo'shib bo'lmaydi; kanal bo'yicha: nil kanal hech qachon aloqa uchun tayyor emas, undan qabul qilish abadiy bloklanadi, nil kanalni yopish ham run-time panic.

### Interface nil'i va typed nil

Interface qiymati faqat dinamik tip ham, qiymat ham yo'q bo'lganda nil. Spetsifikatsiyaning "Variables" bo'limidagi misol buni to'g'ridan-to'g'ri ko'rsatadi: `var v *T` qiymati nil, statik tipi `*T`; `x = v` dan keyin `x` ning qiymati `(*T)(nil)`, dinamik tipi esa `*T`. Bu `x` ni nil emas qiladi: dinamik tipi bor. Bunday holatni typed nil deymiz.

Klassik tuzoq shu: funksiya `error` qaytarishi kerak, siz esa `*ValidationError` tipidagi o'zgaruvchini qaytarasiz. O'zgaruvchi nil bo'lsa ham, `error` interface'i (`*ValidationError`, nil) juftligini saqlaydi va nil emas. 100 Go Mistakes #45 buni "Returning a nil receiver" deb nomlaydi va yechim beradi: nil holatni aniq `return nil` bilan qaytaring.

## Chuqurroq: nil va tizim chegaralari

### Nil receiver

Pointer receiver'li metod nil pointer bilan chaqirilishi mumkin: metodning o'zi chaqiriladi, `p == nil` tekshiruvi esa metod ichida. Bu bog'langan ro'yxat, daraxt kabi tuzilmalarda "bo'sh tuzilma" ni tabiiy ifodalaydi (`func (n *Node) Len() int { if n == nil { return 0 }; ... }`). Qiymat receiver'da esa chaqiruv `*p` ni nusxalashi kerak, nil uchun panic. Shu sababli nil-xavfsizlik pointer receiver'ning xususiyati va hujjatlashtirilgan bo'lishi kerak.

### fmt va typed nil

Typed nil xatoni chop etish yashirin: `fmt` hujjati Error, String yoki GoString nil receiver tufayli panic qilsa, natija `<nil>` bo'lishini yozadi. Natijada log'da `xato: <nil>` ko'rinadi va tushunmovchilik chiqadi: matn nil, lekin shart rost. Quyidagi dastur ikkala variantni solishtiradi:

```go
package main

import (
	"errors"
	"fmt"
)

type ValidationError struct{ Field string }

func (e *ValidationError) Error() string { return "noto'g'ri maydon: " + e.Field }

// validateBad nuqsonli: *ValidationError (nil) ni error ga o'raydi.
func validateBad(fuel float64) error {
	var verr *ValidationError
	if fuel < 0 {
		verr = &ValidationError{Field: "fuel"}
	}
	return verr
}

// validateGood nil ni to'g'ridan-to'g'ri qaytaradi.
func validateGood(fuel float64) error {
	if fuel < 0 {
		return &ValidationError{Field: "fuel"}
	}
	return nil
}

func main() {
	errBad := validateBad(40)
	fmt.Println("validateBad(40) == nil:", errBad == nil)
	fmt.Printf("  tip: %T, ichidagi pointer nil: %v\n", errBad, errBad == (*ValidationError)(nil))

	errGood := validateGood(40)
	fmt.Println("validateGood(40) == nil:", errGood == nil)

	// typed nil bilan metod chaqirish pointer receiver ichida paydo bo'ladigan panic
	func() {
		defer func() { fmt.Println("recover:", recover()) }()
		fmt.Println(errBad.Error())
	}()

	var ve *ValidationError
	fmt.Println("errors.As:", errors.As(validateGood(-1), &ve), ve.Field)
}
```

Go 1.24.7 da chiqish:

```text
validateBad(40) == nil: false
  tip: *main.ValidationError, ichidagi pointer nil: true
validateGood(40) == nil: true
recover: runtime error: invalid memory address or nil pointer dereference
errors.As: true fuel
```

`validateBad(40) == nil` false. `%T` tipni `*main.ValidationError` deb ko'rsatadi, ichidagi pointer esa nil. Metod chaqirilsa, `e.Field` nil pointer dereference beradi. `validateGood` esa to'g'ridan-to'g'ri `nil` qaytaradi va `err == nil` true. `errors.As` muvaffaqiyatli xato (`-1`) uchun mos tipni ochadi.

### nil va bo'sh slice, null va []

Nil slice va bo'sh slice ikkalasida ham `len == 0`, ikkalasiga ham `append` ishlaydi. Farq: nil slice header'ining pointer'i nil (11-dars). 100 Go Mistakes #22 va #23 amaliy xulosa beradi: bo'shlikni `len(s) == 0` bilan tekshiring (nil va bo'shni farqlamang), nil va bo'sh slice'ni farqlaydigan kutubxonalarga (`encoding/json`, `reflect`) ehtiyot bo'ling. API dizaynida nil va bo'sh slice orasida ma'no farqi bermang. Farq JSON'da ko'rinadi:

```go
package main

import (
	"encoding/json"
	"fmt"
)

type Report struct {
	Alerts []string          `json:"alerts"`
	Tags   map[string]string `json:"tags"`
}

func main() {
	nilR := Report{}
	b, _ := json.Marshal(nilR)
	fmt.Println("nil:    ", string(b))

	emptyR := Report{Alerts: []string{}, Tags: map[string]string{}}
	b, _ = json.Marshal(emptyR)
	fmt.Println("bo'sh:  ", string(b))

	var back Report
	_ = json.Unmarshal([]byte(`{"alerts":[],"tags":null}`), &back)
	fmt.Println("[] -> nil emasmi:", back.Alerts != nil, "| null -> nil:", back.Tags == nil)
}
```

```text
nil:     {"alerts":null,"tags":null}
bo'sh:   {"alerts":[],"tags":{}}
[] -> nil emasmi: true | null -> nil: true
```

Nil slice va nil map `null` bo'ladi, bo'sh ko'rinishlari `[]` va `{}`. `json.Unmarshal` esa `[]` ni nil bo'lmagan bo'sh slice'ga, `null` ni nil ga aylantiradi. Frontend uchun ro'yxat maydonlari doim massiv bo'lishi kerak bo'lsa, javob qurishda nil'ni bo'shga aylantiring.

### Qiymat receiver, nil pointer va interface

Nil receiver xavfsizligi faqat pointer receiver'ga tegishli. Qiymat receiver'li metod (`func (g Gauge) String() string`) `*Gauge` orqali chaqirilganda kompilyator `*g` ni nusxalashi kerak, nil uchun bu nil pointer dereference. Interface orqali chaqirilganda ham natija shu: `var s fmt.Stringer = gp` (`gp` nil `*Gauge`) dan keyin `s.String()` Go 1.24.7 da `invalid memory address or nil pointer dereference` panic'ini berdi. `fmt.Println(s)` esa panic'ni ichkarida ushlab `<nil>` chop etdi (yuqorida keltirilgan `fmt` hujjati qoidasi). Pointer receiver'li `Alert` metodi typed nil bilan to'liq ishladi va `nasos yo'q` qaytardi, garchi `al == nil` `false` bo'lsa ham. Nil interface'ning o'zidan (dinamik tipi yo'q) metod chaqirish esa har doim panic: chaqiriladigan metodni topish uchun dinamik tip kerak.

Taqqoslash qoidasi ham tipga bog'liq. Spetsifikatsiya: slice, map va funksiya tiplari taqqoslanmaydi, faqat predeklaratsiya qilingan `nil` bilan solishtirish mumkin; pointer, kanal va interface'ni `nil` bilan solishtirish umumiy qoidalardan kelib chiqadi. Shu sababli ikki `func` yoki ikki map'ni `==` bilan solishtirish kompilyatsiya xatosi, slice'lar uchun esa `slices.Equal` kerak (29-dars).

### omitempty va omitzero

JSON chegarasida nil va bo'sh qiymatni boshqarish uchun Go 1.24 `encoding/json` ga `omitzero` tag opsiyasini qo'shdi. Release notes: `omitzero` maydonni qiymati zero bo'lsa tushirib qoldiradi (tipda `IsZero() bool` metodi bo'lsa shu ishlatiladi), `omitempty` va `omitzero` birga berilsa maydon ulardan biri bajarilsa tushiriladi. Slice va map uchun farq muhim: nil slice zero qiymat, bo'sh (`[]string{}`) esa zero emas. Quyidagi dastur ikkala opsiyani nil va bo'sh qiymatda solishtiradi:

```go
package main

import (
	"encoding/json"
	"fmt"
	"reflect"
)

type Gauge struct{ Level float64 }

// Value receiver: nil *Gauge orqali interface'dan chaqirilsa panic.
func (g Gauge) String() string { return fmt.Sprintf("%.1f L", g.Level) }

type Alerter interface{ Alert() string }

type Pump struct{ ID int }

// Pointer receiver: nil receiver bilan xavfsiz.
func (p *Pump) Alert() string {
	if p == nil {
		return "nasos yo'q"
	}
	return fmt.Sprint("nasos-", p.ID)
}

type Report struct {
	A []string          `json:"a,omitempty"`
	B []string          `json:"b,omitzero"`
	C map[string]string `json:"c,omitempty"`
	D map[string]string `json:"d,omitzero"`
}

func try(name string, f func() any) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Printf("%-30s panic: %v\n", name, r)
		}
	}()
	fmt.Printf("%-30s %v\n", name, f())
}

// merge: manba tugagach kanal o'zgaruvchisi nil qilinadi.
func merge(a, b <-chan int) []int {
	var out []int
	for a != nil || b != nil {
		select {
		case v, ok := <-a:
			if !ok {
				a = nil
				continue
			}
			out = append(out, v)
		case v, ok := <-b:
			if !ok {
				b = nil
				continue
			}
			out = append(out, v)
		}
	}
	return out
}

func gen(vals ...int) <-chan int {
	ch := make(chan int)
	go func() {
		defer close(ch)
		for _, v := range vals {
			ch <- v
		}
	}()
	return ch
}

func main() {
	// 1. Value receiver + nil pointer interface orqali
	var gp *Gauge
	var s fmt.Stringer = gp
	try("nil *Gauge -> Stringer", func() any { return s.String() })
	fmt.Println("fmt chiqishi:", s) // fmt panic'ni ushlaydi
	fmt.Printf("%v | %s\n", gp, gp)

	// 2. Pointer receiver typed nil interface orqali ishlaydi
	var pp *Pump
	var al Alerter = pp
	fmt.Println("typed nil, pointer receiver:", al.Alert(), "| al == nil:", al == nil)

	// 3. Nil interface'dan metod chaqirish
	var nilAl Alerter
	try("nil interface metodi", func() any { return nilAl.Alert() })

	// 4. omitempty va omitzero (Go 1.24)
	for _, r := range []Report{
		{},
		{A: []string{}, B: []string{}, C: map[string]string{}, D: map[string]string{}},
	} {
		b, _ := json.Marshal(r)
		fmt.Println(string(b))
	}

	// 5. reflect va nil
	try("reflect.ValueOf(5).IsNil()", func() any { return reflect.ValueOf(5).IsNil() })
	var e error
	fmt.Println("reflect.ValueOf(nil interface).IsValid():", reflect.ValueOf(e).IsValid())
	fmt.Println("reflect.ValueOf(gp).IsNil():", reflect.ValueOf(gp).IsNil())

	// 6. Nil kanal bilan merge
	fmt.Println("merge:", len(merge(gen(1, 2, 3), gen(10, 20))))
}
```

Go 1.24.7 da chiqish:

```text
nil *Gauge -> Stringer         panic: runtime error: invalid memory address or nil pointer dereference
fmt chiqishi: <nil>
<nil> | <nil>
typed nil, pointer receiver: nasos yo'q | al == nil: false
nil interface metodi           panic: runtime error: invalid memory address or nil pointer dereference
{}
{"b":[],"d":{}}
reflect.ValueOf(5).IsNil()     panic: reflect: call of reflect.Value.IsNil on int Value
reflect.ValueOf(nil interface).IsValid(): false
reflect.ValueOf(gp).IsNil(): true
merge: 5
```

`omitempty` ham nil, ham bo'sh slice va map'ni tushirdi (`A`, `C` ikkala holatda yo'q). `omitzero` faqat nil'ni tushirdi, bo'sh qiymat `[]` va `{}` bo'lib chiqdi (`B`, `D`). Demak API shartnomasi "ro'yxat maydoni har doim bor, lekin bo'sh bo'lishi mumkin" bo'lsa, `omitzero` va javob qurishda nil'ni bo'shga aylantirish birga ishlaydi; "bo'sh bo'lsa maydon umuman yo'q" bo'lsa `omitempty`. Bu tanlovni 68-darsda API dizayni nuqtai nazaridan ko'ramiz.

Dasturning qolgan qismi tekshirilgan nozik holatlarni qamrab oladi. `reflect.ValueOf(5).IsNil()` panic beradi, chunki `IsNil` faqat nil bo'la oladigan kindlar uchun; nil interface'ni `reflect.ValueOf` ga bersangiz `IsValid()` `false` qaytaradi (zero `Value`), typed nil pointer uchun esa `IsValid()` `true` va `IsNil()` `true`. Bu `reflect` bilan yozilgan umumiy kodda (serializer, validator) ikki bosqichli tekshiruv kerakligini bildiradi. Oxirgi qism `merge` funksiyasi: ikki manbadan o'qiyotganda manba yopilgach, kanal o'zgaruvchisini nil qilish `select` ning shu case'ni qayta tanlashini to'xtatadi va sikl ikkala manba tugaganda (`a != nil || b != nil` yolg'on) chiqadi. Natija `merge: 5`, ya'ni uchta va ikkita qiymat ham olindi, goroutine qolmadi va busy-loop bo'lmadi (42-dars).

## Misol: nil bilan amallar to'plami

Ushbu dastur har tipdagi nil bilan nima mumkinligini bir joyda ko'rsatadi:

```go
package main

import (
	"fmt"
	"time"
)

type Sensor struct{ ID int }

// Label nil receiver bilan ham xavfsiz.
func (s *Sensor) Label() string {
	if s == nil {
		return "sensor-yo'q"
	}
	return fmt.Sprint("sensor-", s.ID)
}

func try(name string, f func()) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Printf("%-22s panic: %v\n", name, r)
		}
	}()
	f()
}

func main() {
	var (
		p  *Sensor
		s  []int
		m  map[string]int
		ch chan int
		fn func()
	)

	fmt.Println("pointer metodi:  ", p.Label())
	fmt.Println("nil slice:       ", len(s), cap(s), s == nil, append(s, 1))
	fmt.Println("nil map o'qish:  ", m["x"], len(m))

	try("p.ID (pointer o'qish)", func() { _ = p.ID })
	try("nil map ga yozish", func() { m["x"] = 1 })
	try("nil funksiya chaqirish", func() { fn() })
	try("nil kanalni yopish", func() { close(ch) })

	select {
	case v := <-ch:
		fmt.Println("kanaldan:", v)
	case <-time.After(10 * time.Millisecond):
		fmt.Println("nil kanaldan o'qish hech qachon tayyor bo'lmaydi: timeout")
	}
}
```

```text
pointer metodi:   sensor-yo'q
nil slice:        0 0 true [1]
nil map o'qish:   0 0
p.ID (pointer o'qish)  panic: runtime error: invalid memory address or nil pointer dereference
nil map ga yozish      panic: assignment to entry in nil map
nil funksiya chaqirish panic: runtime error: invalid memory address or nil pointer dereference
nil kanalni yopish     panic: close of nil channel
nil kanaldan o'qish hech qachon tayyor bo'lmaydi: timeout
```

Qatorlar: pointer metodi nil bilan ishlaydi (`Label` ichida tekshiruv); nil slice uzunligi 0 va `append` ishlaydi; nil map o'qiladi; `p.ID`, nil map'ga yozish, nil funksiya va nil kanalni yopish panic beradi; nil kanaldan qabul qilish esa timeout berdi: hech qachon tayyor bo'lmadi. Bu oxirgisi select'da case'ni o'chirish usuli: manba tugasa, kanal o'zgaruvchisini nil qilsangiz, select shu case'ni qayta tanlamaydi (42-dars).

## Qachon qo'llamaslik kerak

- Nil bilan "bo'sh" yoki "sozlanmagan" ma'nosini kodlashga urinmang. Nil receiver metodlari ma'nosi aniq bo'lgan tuzilmalar (daraxt, ro'yxat) uchun qulay, lekin servis tiplarida nil pointer ko'pincha xato belgisi: erta panic, jimgina noto'g'ri natijadan yaxshiroq.
- Konkret xato tipini `error` qaytaruvchi funksiyadan o'zgaruvchi sifatida qaytarmang; faqat `return nil` yoki `return &E{...}`.
- Nil va bo'sh slice orasidagi farqni API shartnomasining qismi qilmang. Dastur ichida `len(s) == 0` yetarli; farq faqat chegarada (JSON) bartaraf qilinadi.
- Interface ichida nil borligini `reflect` bilan tekshirib "tuzatish" odatda belgi: muammo yuqoriroqda (xato qaytarilish joyida). `reflect.Value.IsNil` kamdan-kam hollarda kerak.
- Nil funksiya maydonini "ixtiyoriy callback" deb qoldirish qulay, lekin chaqirishdan oldin tekshiruvni unutish panic beradi. Standart (no-op) funksiya qo'yish ishonchliroq.
- Global nil map yoki slice'ni "keyin to'ldiramiz" deb qoldirmang: init tartibi (10-dars) va concurrent foydalanish xato manbai.

## Stack'da: Node.js/TypeScript bilan solishtirish

JavaScript'da `null` va `undefined` ikki alohida qiymat, har qanday obyekt maydoni ularni saqlashi mumkin, `strictNullChecks` kompilyatsiya vaqtida himoya qiladi. Go'da nil tipga bog'liq va nil bo'la oladigan tiplar chegaralangan (son, satr, struct, massiv nil bo'la olmaydi: ularning zero value'si bor). Boshqa tomondan, TypeScript'da `null` ni `string | null` bilan tipga kiritasiz, Go'da esa nil pointer tipda ko'rinmaydi: `*Sensor` har doim nil bo'lishi mumkin.

Amaliy qoidalar:

- Error qaytarishda faqat `return nil` yoki aniq xato; konkret tipli xato o'zgaruvchisini qaytarmang.
- JSON chegarasida ro'yxat va map maydonlarini nil'dan bo'shga aylantiring yoki `omitempty`/`omitzero` siyosatini aniq tanlang (68-dars).
- Pointer receiver nil-xavfsiz bo'lsa, buni metod hujjatida yozing.
- Select'da tugagan kanal manbasini nil qilib "o'chiring".
- Kodni `go vet` va linter bilan tekshiring: typed nil kabi xatolar ko'p hollarda kod ko'rib chiqishda topiladi (40-dars).

## Xulosa

- `nil` - pointer, funksiya, interface, slice, map va kanalning zero value'si; tipga qarab mazmuni va xavfsiz amallari boshqacha.
- Nil slice bilan `len`, `range`, `append` ishlaydi; nil map o'qiladi, lekin yozilmaydi; nil kanal hech qachon tayyor emas; nil funksiya va nil pointer dereference panic beradi.
- Interface faqat dinamik tipi ham, qiymati ham yo'q bo'lganda nil. Nil pointer solingan interface nil emas (typed nil).
- Error qaytaradigan funksiyada konkret tip o'zgaruvchisini emas, aniq `return nil` ni qaytaring; `fmt` typed nil xatoni `<nil>` deb yashiradi.
- Nil receiver pointer receiver'li metodlarda mumkin; qiymat receiver'da panic.
- Nil slice JSON'da `null`, bo'sh slice `[]`; dastur ichida `len(s) == 0` bilan tekshiring, chegarada nil'ni bo'shga aylantiring.
