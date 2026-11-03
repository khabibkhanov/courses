---
n: 17
slug: interface-ichi
title: "Interface qanday ishlaydi: dinamik tip va qiymat"
summary: "Interface qiymati nimadan iborat (dynamic type va dynamic value), interface'lar qachon teng bo'ladi va qachon panic beradi, qiymat interface'ga solinganda nima nusxalanadi va qachon allokatsiya bo'ladi, hamda gc toolchain'dagi ikki so'zli tuzilma."
duration: 40
sources:
  - id: go-spec
    note: "Variables (static va dynamic type), Interface types, Comparison operators va Type assertions bo'limlari"
  - id: gopl
    note: "7-bob (Interfaces): interface qiymatlari, dinamik tip va dinamik qiymat qismi"
  - id: 100go
    note: "#29 (qiymatlarni noto'g'ri taqqoslash): interface'lar va taqqoslanmaydigan tiplar"
quiz:
  - q: "var c any = int32(7); var d any = int64(7). c == d natijasi nima?"
    options:
      - "true, chunki ikkalasi 7"
      - "false, chunki dinamik tiplar farq qiladi"
      - "Panic: tiplar mos emas"
      - "Kompilyatsiya xatosi"
    answer: 1
    explain: "Spetsifikatsiya: ikki interface qiymati teng bo'lishi uchun dinamik tiplar bir xil va qiymatlar teng bo'lishi kerak (yoki ikkalasi nil). Tiplar farq qilgani uchun natija false; panic faqat tiplar bir xil va taqqoslanmaydigan bo'lganda chiqadi."
  - q: "type Reading struct{ Level float64 }; r := Reading{10}; var b any = r; r.Level = 99. b.(Reading).Level nechaga teng?"
    options:
      - "10: qiymat interface'ga nusxalanadi"
      - "99: interface asl qiymatga havola saqlaydi"
      - "0: type assertion zero value qaytaradi"
      - "Panic: interface ichidagi struct o'zgarmas"
    answer: 0
    explain: "Struct qiymati interface'ga solinganda nusxalanadi. Keyingi r.Level o'zgarishi interface ichidagi nusxaga ta'sir qilmaydi. Biz o'lchaganimizda ham 99 va 10 chiqdi."
  - q: "Qaysi holatda a == b (a, b any) ish vaqtida panic beradi?"
    options:
      - "a = 1, b = \"1\""
      - "a = nil, b = []int{1}"
      - "a = int32(1), b = int64(1)"
      - "a = []int{1}, b = []int{1}"
    answer: 3
    explain: "Panic dinamik tiplar bir xil va taqqoslanmaydigan (slice, map, func yoki ular bor struct) bo'lganda chiqadi. Tiplar farq qilsa (1 va \"1\", int32 va int64), taqqoslash false bilan tugaydi; nil va slice ham false."
  - q: "Quyidagilardan qaysi biri Go tilining kafolati (spetsifikatsiya), qaysi biri esa gc toolchain'ning implementatsiyasi?"
    options:
      - "Kafolat: any amd64 da 16 bayt"
      - "Kafolat: interface qiymati har doim ikki mashina so'zi"
      - "Kafolat: dinamik tip va qiymat bir xil bo'lsa interface'lar teng; ikki so'zli tuzilma esa gc implementatsiyasi"
      - "Kafolat: int ni any ga solish har doim heap allokatsiya qiladi"
    answer: 2
    explain: "Spetsifikatsiya interface'ni dinamik tip va dinamik qiymat orqali tavsiflaydi va tenglik qoidasini beradi, lekin hajm yoki so'zlar sonini belgilamaydi. unsafe.Sizeof natijasi (16 va 386 da 8), allokatsiya qoidalari gc ning joriy xatti-harakati."
  - q: "testing.AllocsPerRun: any ga katta int (1_000_003) solish 1 allokatsiya, *Sensor solish 0 allokatsiya berdi. Eng to'g'ri izoh qaysi?"
    options:
      - "Pointer'lar har doim stack'da turadi"
      - "Pointer ma'lumot so'ziga to'g'ridan-to'g'ri yoziladi; int qiymati esa alohida joyga nusxalanib, interface unga ishora qiladi"
      - "int GC uchun maxsus belgilanadi"
      - "AllocsPerRun pointer allokatsiyalarini sanamaydi"
    answer: 1
    explain: "Tajribada ikkinchi so'z pointer qiymatining o'ziga teng chiqdi (pointer to'g'ridan-to'g'ri saqlanadi). Pointer bo'lmagan qiymat esa nusxalanib, interface shu nusxaga ishora qilishi kerak, bu esa allokatsiya. Kichik qiymatlar (biz o'lchagan 5) uchun gc maxsus optimizatsiya qiladi, bu implementatsiya tafsiloti."
  - q: "var v any = 7 bo'lsin. fmt.Println(v == 7, v == int64(7)) nima chiqaradi?"
    options:
      - "true false"
      - "true true"
      - "false false"
      - "Kompilyatsiya xatosi: any ni int bilan taqqoslab bo'lmaydi"
    answer: 0
    explain: "Spetsifikatsiya interface va taqqoslanuvchi, interface'ni implement qiladigan non-interface qiymatni taqqoslashga ruxsat beradi. 7 konstantasi int tipiga keladi, shuning uchun dinamik tip int bilan mos: true. int64(7) bilan dinamik tip farq qiladi: false."
task:
  title: "Panic bermaydigan Equal"
  prompt: |
    Telemetriya filtri qiymatlarni `any` sifatida oladi va ularni taqqoslaydi: sonlar, satrlar, koordinatalar `[]float64`, xaritalar. Boshlang'ich `Equal` shunchaki `a == b` qiladi va dinamik tip slice yoki map bo'lsa `comparing uncomparable type` panic'i bilan qulaydi (struct ichida slice bo'lsa ham).

    Vazifa: `Equal` hech qachon panic bermasin. Qoida: `nil` lar to'g'ri taqqoslansin; ikkala qiymat ham taqqoslanuvchi bo'lsa `==` ishlating; aks holda `reflect.DeepEqual`. `Equal` imzosi va `check` o'zgarmasin. Kutilgan natija: `7` va `7` teng, `7` va `"7"` teng emas, bir xil slice va map'lar teng, slice va son teng emas.
  lang: go
  starter: |
    package main

    import "fmt"

    // Equal ikki qiymatni taqqoslaydi. Telemetriya filtrida qiymatlar har xil
    // tipda keladi: son, satr, koordinatalar slice'i, xarita.
    func Equal(a, b any) bool {
        return a == b
    }

    func check(name string, a, b any) {
        defer func() {
            if r := recover(); r != nil {
                fmt.Printf("%-18s panic: %v\n", name, r)
            }
        }()
        fmt.Printf("%-18s %t\n", name, Equal(a, b))
    }

    func main() {
        check("son", 7, 7)
        check("son va satr", 7, "7")
        check("nil va nil", nil, nil)
        check("slice", []float64{41.3, 69.2}, []float64{41.3, 69.2})
        check("map", map[string]int{"a": 1}, map[string]int{"a": 1})
        check("slice va son", []float64{1}, 1)
        check("slice maydonli", struct{ Pts []int }{[]int{1}}, struct{ Pts []int }{[]int{1}})
    }
  solution: |
    package main

    import (
        "fmt"
        "reflect"
    )

    // Equal ikki qiymatni panic bermasdan taqqoslaydi: taqqoslanuvchi
    // qiymatlar == bilan, qolganlari reflect.DeepEqual bilan.
    func Equal(a, b any) bool {
        if a == nil || b == nil {
            return a == b
        }
        if reflect.ValueOf(a).Comparable() && reflect.ValueOf(b).Comparable() {
            return a == b
        }
        return reflect.DeepEqual(a, b)
    }

    func check(name string, a, b any) {
        defer func() {
            if r := recover(); r != nil {
                fmt.Printf("%-18s panic: %v\n", name, r)
            }
        }()
        fmt.Printf("%-18s %t\n", name, Equal(a, b))
    }

    func main() {
        check("son", 7, 7)
        check("son va satr", 7, "7")
        check("nil va nil", nil, nil)
        check("slice", []float64{41.3, 69.2}, []float64{41.3, 69.2})
        check("map", map[string]int{"a": 1}, map[string]int{"a": 1})
        check("slice va son", []float64{1}, 1)
        check("slice maydonli", struct{ Pts []int }{[]int{1}}, struct{ Pts []int }{[]int{1}})
    }
  solutionNotes: |
    - `a == nil || b == nil` holatini alohida ko'ramiz: bu holda `reflect.ValueOf(nil)` ning `Comparable` natijasi mazmunsiz, `a == b` esa xavfsiz (nil interface bilan taqqoslashda panic bo'lmaydi).
    - `reflect.Value.Comparable` (Go 1.20 dan) dinamik tipni tekshiradi va `true` bo'lsa `v.Interface() == x` har qanday `x` uchun panic bermasligini kafolatlaydi (hujjat). Shuning uchun ikkala tomon uchun ham tekshiramiz.
    - Taqqoslanuvchi bo'lmagan yoki bo'lmagan juftlik uchun `reflect.DeepEqual`: bir xil elementli slice'lar, bir xil juftlikli map'lar va ichida slice bo'lgan struct'lar uchun to'g'ri natija beradi. Tiplar farq qilsa `false`.
    - Narx: `reflect` sekinroq va allokatsiya qilishi mumkin; bu yo'l issiq tsiklga mos emas. Agar qiymat tiplari ma'lum bo'lsa, type switch bilan aniq taqqoslash tezroq (30-dars reflect narxini ko'radi).
    - `DeepEqual` `NaN` ni teng hisoblamaydi va funksiya qiymatlarini faqat ikkalasi nil bo'lsa teng deydi. Bu holatlarni talab qilsangiz, alohida ishlov kerak.
  checklist:
    - "`Equal` hech bir kirish uchun panic bermaydi (slice, map, ichida slice bor struct)"
    - "`7` va `7` teng; `7` va `\"7\"` teng emas"
    - "Bir xil elementli slice'lar va map'lar teng"
    - "`nil` va `nil` teng"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Go'da interface ikki xil rolda uchraydi. Birinchisi - mantiqiy: `io.Reader`, `error` kabi shartnomalar. Ikkinchisi - quvur: `any` ga har xil tipdagi qiymatlarni solish (JSON natijalari, hodisa `payload`i, `context` qiymatlari). Ikkala holatda ham bir xil sirli savollar chiqadi: interface ichida aslida nima turadi? Ikki interface qachon teng? Nima uchun `==` ba'zan panic beradi? Nega `any` ga solish allokatsiya qiladi? Nega `*T` nil bo'lsa ham `error` nil emas (18-dars)?

Bu savollarning hammasi bitta mexanizmdan kelib chiqadi: interface qiymati ikkita qismdan iborat. Bu darsda spetsifikatsiya bu ikki qismni qanday atashini, xatti-harakat qoidalarini, va gc toolchain'da tuzilma qanday ko'rinishini alohida ajratib ko'ramiz.

## Asosiy g'oya

### Dinamik tip va dinamik qiymat

Spetsifikatsiyaning "Variables" bo'limi shunday ta'riflaydi: o'zgaruvchining statik tipi uning e'lonidagi tip. Interface tipidagi o'zgaruvchi esa alohida dinamik tipga ham ega: unga run-time da berilgan (interface bo'lmagan) qiymatning tipi. `nil` qiymatning tipi yo'q, shuning uchun `nil` interface'ning dinamik tipi ham yo'q. Dinamik tip bajarilish vaqtida o'zgarishi mumkin, lekin saqlanayotgan qiymat har doim interface tipiga assign qilinadigan bo'ladi. Spetsifikatsiya misollari: `var x interface{}` nil va statik tipi `interface{}`; `x = 42` dan keyin qiymati 42, dinamik tipi `int`.

Demak, interface qiymatini juftlik sifatida tasavvur qilish kerak: (dynamic type, dynamic value). "Interface types" bo'limi qo'shadi: interface turi tip to'plamini belgilaydi, va shu to'plamdagi har qanday qiymat interface o'zgaruvchisida saqlanishi mumkin. Initsializatsiyalanmagan interface'ning qiymati `nil`. Interface orqali metod chaqirilganda esa dinamik tipning metodi ishga tushadi (dynamic dispatch).

### Tenglik

Spetsifikatsiyaning "Comparison operators" qoidasi: ikki interface qiymati teng, agar dinamik tiplari bir xil va dinamik qiymatlari teng bo'lsa, yoki ikkalasi nil bo'lsa. Interface va non-interface qiymatni solishtirish mumkin, agar non-interface tip taqqoslanuvchi bo'lsa va interface'ni implement qilsa: shunda interface ning dinamik tipi shu tipga teng bo'lishi va qiymatlar teng bo'lishi kerak. Natijalar:

- `any(int32(7)) == any(int64(7))` - `false`: qiymatlar bir xil, dinamik tiplar farq qiladi.
- Dinamik tiplar bir xil, lekin taqqoslanmaydigan (slice, map, func yoki ular bor struct/massiv) bo'lsa, run-time panic bo'ladi. Spetsifikatsiya buni to'g'ridan-to'g'ri yozadi, interface qiymatlari massivi yoki interface maydonli struct'larni taqqoslashga ham tegishli ekanini aytadi.
- Panic faqat tiplar bir xil bo'lganda: tiplar farq qilsa, taqqoslash false bilan tugaydi.

100 Go Mistakes #29 ham shuni takrorlaydi va taqqoslanmaydigan qiymatlar uchun `reflect.DeepEqual` yoki maxsus taqqoslash tavsiya qiladi.

### Type assertion

`x.(T)` interface'ning dinamik tipi `T` ekanini (yoki `T` interface bo'lsa, dinamik tip uni implement qilishini) tekshiradi. Muvaffaqiyatsiz bo'lsa run-time panic beradi; ikki qiymatli shakl (`v, ok := x.(T)`) esa panic bermaydi. 23-darsda type assertion va type switch batafsil ko'riladi.

## Chuqurroq: gc toolchain'dagi tuzilma

Spetsifikatsiya interface qiymatining xotirada qanday turishini belgilamaydi. Quyidagi barcha gaplar gc toolchain (Go 1.24.7) uchun va biz o'zimiz o'lchaganimiz bilan cheklanadi.

### Ikki so'z

`unsafe.Sizeof(any(nil))` amd64 da 16, 386 da 8 bayt: ikkita mashina so'zi. Bo'sh bo'lmagan interface (`fmt.Stringer`) ham xuddi shunday. Birinchi so'z dinamik tipni aniqlaydi; ikkinchisi ma'lumotga tegishli. `unsafe` yordamida ikki so'zni o'qib, nimalar haqiqat ekanini tekshirdik:

```go
package main

import (
	"fmt"
	"unsafe"
)

type Sensor struct{ ID int }

func (s *Sensor) String() string { return fmt.Sprint("sensor-", s.ID) }

type Gauge float64

func (g Gauge) String() string { return fmt.Sprintf("%.1f L", float64(g)) }

// words interface qiymatining ikki mashina so'zini ochadi.
// DIQQAT: bu gc toolchain'ning joriy implementatsiyasi, til kafolati emas.
func words(p *any) [2]uintptr {
	return *(*[2]uintptr)(unsafe.Pointer(p))
}

func wordsS(p *fmt.Stringer) [2]uintptr {
	return *(*[2]uintptr)(unsafe.Pointer(p))
}

func main() {
	fmt.Println("any:", unsafe.Sizeof(any(nil)), "bayt | fmt.Stringer:", unsafe.Sizeof(fmt.Stringer(nil)), "bayt")

	s := &Sensor{ID: 7}
	var a1, a2 any = s, &Sensor{ID: 8}
	var a3 any = Gauge(40.5)
	var st fmt.Stringer = s

	w1, w2, w3 := words(&a1), words(&a2), words(&a3)
	ws := wordsS(&st)

	fmt.Println("bir xil dinamik tip -> 1-so'z teng:", w1[0] == w2[0])
	fmt.Println("boshqa dinamik tip  -> 1-so'z teng:", w1[0] == w3[0])
	fmt.Println("pointer qiymatda 2-so'z pointerning o'zi:", w1[1] == uintptr(unsafe.Pointer(s)))
	fmt.Println("Stringer va any, 1-so'z bir xilmi:", ws[0] == w1[0])
	fmt.Println("Stringer va any, 2-so'z bir xilmi:", ws[1] == w1[1])
}
```

Go 1.24.7, linux/amd64 da chiqish (386 da ham aynan shu qatorlar chiqdi, faqat `any: 8 bayt`):

```text
any: 16 bayt | fmt.Stringer: 16 bayt
bir xil dinamik tip -> 1-so'z teng: true
boshqa dinamik tip  -> 1-so'z teng: false
pointer qiymatda 2-so'z pointerning o'zi: true
Stringer va any, 1-so'z bir xilmi: false
Stringer va any, 2-so'z bir xilmi: true
```

Xulosalar: (1) bir xil dinamik tipli ikki `any` birinchi so'zi bir xil, boshqa tipniki farq qiladi, ya'ni birinchi so'z tipga bog'liq; (2) pointer saqlanganda ikkinchi so'z pointerning o'zi; (3) xuddi shu qiymat `fmt.Stringer` ga solinganda ikkinchi so'z o'sha, birinchisi esa `any` dagidan farq qiladi. Runtime manba kodida bo'sh bo'lmagan interface'ning birinchi so'zi itab deb ataluvchi jadvalga ishora qiladi: unda tip va shu interface uchun metodlar manzillari bor. Buni Go 1.24.7 manba kodida tekshirdik: `runtime.iface` ikki maydondan iborat (`tab *itab` va `data`), `internal/abi.ITab` esa interface tipi, dinamik tip va metodlar manzillarini saqlaydi. Bu rasmiy hujjat emas, faqat manba kodi; dastur kodida unga tayanmang. Spetsifikatsiya tuzilmani belgilamaydi, shuning uchun bu bo'limdagi tafsilotlar bizning kuzatuvimiz bilan cheklanadi.

### Boxing: qiymat qayerga qo'yiladi

Ikkinchi so'zga sig'adigan narsa (pointer) shu yerda to'g'ridan-to'g'ri turadi. Sig'maydigan narsa (struct, katta son, satr header'i) uchun interface qiymat nusxasiga ishora qiladi, nusxa esa odatda heap'da ajratiladi. Nusxa muhim semantik natija ham beradi: `var b any = r` dan keyin `r` ni o'zgartirish `b` ichidagi qiymatga ta'sir qilmaydi. O'lchovimiz:

```go
package main

import (
	"fmt"
	"testing"
)

type Sensor struct{ ID int }

var sink any

func box(n int)        { sink = n }
func boxPtr(s *Sensor) { sink = s }

func main() {
	big := 1_000_003
	s := &Sensor{ID: 1}

	fmt.Println("int ni any ga solish, ajratishlar:   ", testing.AllocsPerRun(1000, func() { box(big) }))
	fmt.Println("pointer ni any ga solish, ajratishlar:", testing.AllocsPerRun(1000, func() { boxPtr(s) }))
	fmt.Println("kichik int (5), ajratishlar:         ", testing.AllocsPerRun(1000, func() { box(5) }))
}
```

```text
int ni any ga solish, ajratishlar:    1
pointer ni any ga solish, ajratishlar: 0
kichik int (5), ajratishlar:          0
```

Katta `int` ni `any` ga solish bitta allokatsiya, pointer nol. Kichik qiymat (5) ham nol berdi: gc kichik butun sonlar uchun optimizatsiya qiladi, bu implementatsiya tafsiloti va aniq chegara hujjatda kafolatlanmagan. Xulosa: issiq yo'lda `any` ga qiymat solish (masalan, `fmt.Println(x)`, `log` argumentlari, `context.WithValue`) alohida allokatsiya narxiga ega bo'lishi mumkin (65-dars).

## Misol: tenglik va semantika

Quyidagi dastur yuqoridagi qoidalarni bitta joyda ko'rsatadi:

```go
package main

import "fmt"

type Reading struct {
	Device string
	Level  float64
}

func tryEqual(a, b any) (res any) {
	defer func() {
		if r := recover(); r != nil {
			res = fmt.Sprint("panic: ", r)
		}
	}()
	return a == b
}

func main() {
	var a any = Reading{"T-1", 40}
	var b any = Reading{"T-1", 40}
	fmt.Println("struct qiymatlar teng:", a == b)

	var c any = int32(7)
	var d any = int64(7)
	fmt.Println("int32(7) va int64(7):", c == d, "(dinamik tiplar farq qiladi)")

	fmt.Println("slice == slice:", tryEqual([]int{1}, []int{1}))
	fmt.Println("slice == int:  ", tryEqual([]int{1}, 1))

	// qiymat interface'ga nusxalanadi
	r := Reading{"T-2", 10}
	var boxed any = r
	r.Level = 99
	fmt.Println("asl:", r.Level, "| interface ichidagi:", boxed.(Reading).Level)

	// type assertion: dinamik tipni ochish
	if rd, ok := boxed.(Reading); ok {
		fmt.Println("ochildi:", rd.Device)
	}
	_, isStr := boxed.(string)
	fmt.Println("string deb ochish:", isStr)
}
```

```text
struct qiymatlar teng: true
int32(7) va int64(7): false (dinamik tiplar farq qiladi)
slice == slice: panic: runtime error: comparing uncomparable type []int
slice == int:   false
asl: 99 | interface ichidagi: 10
ochildi: T-2
string deb ochish: false
```

Qatorma-qator: bir xil struct qiymatlar teng; `int32(7)` va `int64(7)` dinamik tiplari farq qilgani uchun teng emas; ikki slice'ni taqqoslash panic beradi; slice va son taqqoslash esa tiplar farq qilgani uchun `false` (panic yo'q); interface ichidagi qiymat nusxa; `boxed.(Reading)` ochdi, `string` deb ochish esa `ok=false` berdi.

Nozik joy: slice va `int` taqqoslash panic bermadi, ikki slice taqqoslash esa berdi, chunki spetsifikatsiyaga ko'ra panic faqat dinamik tiplar bir xil bo'lsagina bo'ladi. Shu sababli ba'zi kod testlarda "ishlaydi" va faqat bir xil taqqoslanmaydigan tipli ikki qiymat uchrashganda qulaydi.

## Qachon qo'llamaslik kerak

- Qiymat tipi oldindan ma'lum bo'lsa, `any` kerak emas. Generics (24-dars) yoki aniq tip tezroq va xavfsizroq: `any` tip tekshiruvini ish vaqtiga suradi va boxing xarajatini qo'shadi.
- Interface kalitli map (`map[any]V`) va `==` bilan taqqoslash taqqoslanmaydigan qiymat kelganda panic beradi (19-dars). Tashqi manbadan kelgan qiymatni kalit qilishdan oldin tipini cheklang.
- `reflect.DeepEqual` bilan "hammasini taqqoslash" yechimi qimmat va semantikasi nozik (NaN, funksiya, sikllar); issiq yo'lda ishlatmang.
- `unsafe` orqali interface so'zlariga tayanmang. Biz uni faqat tuzilmani o'rganish uchun ishlatdik; layout release'lar orasida o'zgarishi mumkin va Go 1 kafolati doirasidan tashqarida (1-dars).
- Boxing'dan qochish uchun hamma narsani pointer qilmang: pointer GC ishini ko'paytiradi va aliasing xavfini qaytaradi. Avval o'lchang (70-dars).

## Stack'da: Node.js/TypeScript bilan solishtirish

TypeScript'da interface faqat kompilyatsiya vaqtidagi shartnoma: ish vaqtida `{ id: 1 }` obyektidan boshqa narsa yo'q, tip tekshiruvi tozalanadi. Go'da interface qiymati run-time da yashaydi: unda dinamik tip saqlanadi, shu sababli `x.(T)` ishlaydi, `==` tipni hisobga oladi, `%T` tipni chop etadi. Boshqa tomondan, TypeScript'da `any` yuklamaydi, Go'da `any` solish allokatsiya va qiymat nusxalash demak.

Amaliy qoidalar:

- Tenglik kerak bo'lgan `any` qiymatlar uchun `reflect.Value.Comparable` yoki type switch bilan himoya qiling; to'g'ridan-to'g'ri `==` ni faqat tiplar nazorat ostida bo'lganda ishlating.
- `any` argumentli API'larda (log, hodisa shinasi) allokatsiyani profil ko'rsatganda kamaytiring.
- Metod chaqiruvini "bepul" deb o'ylamang, lekin xarajatni o'lchamasdan interface'dan voz kechmang: o'qilish va test qulayligi odatda ustun (21-dars).
- Interface'ning ichki tuzilmasiga tayanadigan kod yozmang; til kafolati faqat dinamik tip va qiymat juftligi.

## Xulosa

- Interface qiymati (dynamic type, dynamic value) juftligi; statik tip interface'ning o'zi, dinamik tip esa unga solingan qiymatniki.
- Ikki interface qiymati dinamik tiplari bir xil va qiymatlari teng bo'lsa teng; tiplar bir xil, lekin taqqoslanmaydigan bo'lsa run-time panic.
- Qiymat interface'ga solinganda nusxalanadi; keyingi o'zgarish interface ichidagisiga ta'sir qilmaydi.
- gc toolchain'da (Go 1.24.7) interface ikki so'z: amd64 da 16 bayt, 386 da 8 bayt; bu implementatsiya tafsiloti.
- Pointer ikkinchi so'zda to'g'ridan-to'g'ri turadi; boshqa qiymatlar nusxalanadi va odatda allokatsiya qiladi (kichik sonlar bundan mustasno, o'lchovimizda).
- Taqqoslanmaydigan dinamik tip kelishi mumkin bo'lsa, `==` o'rniga `reflect.Value.Comparable` va `reflect.DeepEqual`, yoki aniq tipga o'ting.
