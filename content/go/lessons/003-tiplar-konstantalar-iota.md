---
n: 3
slug: tiplar-konstantalar-iota
title: "Tiplar, o'zgaruvchilar, untyped constant va iota"
summary: "Predeclared tiplar, int o'lchami, overflow qoidalari, untyped constant'lar (arbitrary precision va default type), shift ifodalaridagi nozik qoida, iota bilan enum va bitmask hamda := da shadowing tuzoqlari."
duration: 40
sources:
  - id: go-spec
    note: "Constants, Constant declarations, Iota, Constant expressions, Numeric types, Integer overflow, Arithmetic operators (shift qoidalari), Variable declarations va Short variable declarations bo'limlari"
  - id: gopl
    note: "Kitobning asosiy tiplar va konstantalar haqidagi boblari (umumiy tayanch; aniq qoidalar spetsifikatsiyadan olingan)"
quiz:
  - q: "Quyidagi kod nima chiqaradi?\n\nvar ratio float64 = 1 / 2\nfmt.Println(ratio)"
    options:
      - "0.5"
      - "0"
      - "NaN"
      - "Kompilyatsiya xatosi: int va float64 aralashgan"
    answer: 1
    explain: "1 / 2 - ikkala operand untyped integer constant, ifoda butun son bo'linmasi sifatida compile time'da hisoblanadi va natija 0. Shundan keyingina u float64 ga aylanadi. 0.5 olish uchun operandlardan biri floating-point bo'lishi kerak: 1 / 2.0."
  - q: "`var s uint = 33` bo'lsa, `var j int32 = 1 << s` qanday qiymat oladi?"
    options:
      - "8589934592"
      - "Run-time panic: overflow"
      - "Kompilyatsiya xatosi: constant 8589934592 overflows int32"
      - "0"
    answer: 3
    explain: "Shift o'ng operandi o'zgaruvchi, shuning uchun bu non-constant shift: 1 ifoda int32 kontekstida int32 tipini oladi va 33 bitga siljish yuqori bitlarni tashlab yuboradi. Signed overflow panic bermaydi, kompilyatsiya xatosi esa faqat constant shift'da chiqadi."
  - q: "Quyidagi blokda d qiymati nima?\n\nconst (\n    a = iota\n    b = \"x\"\n    c = iota\n    d\n)"
    options:
      - "2"
      - "3"
      - "\"x\""
      - "1"
    answer: 1
    explain: "iota ConstSpec indeksi: a=0, b=1 (qiymat string bo'lsa ham indeks oshadi), c=2. d ifodasiz yozilgan, ya'ni oldingi bo'sh bo'lmagan ifoda (iota) matn bo'yicha takrorlanadi va indeks 3 bo'lgani uchun d=3."
  - q: "`x, err := f()` dan keyingi qatorda `y, err := g()` yozildi (ikkalasi bir blokda). Nima bo'ladi?"
    options:
      - "Kompilyatsiya xatosi: err qayta e'lon qilingan"
      - "Yangi err o'zgaruvchisi paydo bo'ladi, eskisi yashiriladi"
      - "y yangi o'zgaruvchi, err esa mavjud o'zgaruvchiga yangi qiymat sifatida yoziladi"
      - "y va err ikkalasi ham yangidan yaratiladi"
    answer: 2
    explain: "Spetsifikatsiya := bir blokda, o'sha tipda e'lon qilingan o'zgaruvchilarni qayta e'lon qilishga ruxsat beradi, agar kamida bitta yangi nomi bor bo'lsa. Qayta e'lon qilish yangi o'zgaruvchi yaratmaydi, mavjudiga qiymat beradi. Shuning uchun f() dan kelgan err yo'qoladi."
  - q: "`var u uint8 = 250; u += 10` va `var b uint8 = 250 + 10` yozuvlari haqida qaysi gap to'g'ri?"
    options:
      - "Birinchisi 4 beradi (modulo 2^8), ikkinchisi kompilyatsiya xatosi: constant 260 uint8 ga sig'maydi"
      - "Ikkalasi ham 4 beradi"
      - "Birinchisi run-time panic beradi, ikkinchisi 4"
      - "Ikkalasi ham kompilyatsiya xatosi"
    answer: 0
    explain: "Unsigned amallar runtime'da modulo 2^n hisoblanadi, panic yo'q. 250 + 10 esa constant ifoda: u aniq 260 deb hisoblanadi va uint8 ga sig'maganligi uchun compile time'da rad etiladi."
  - q: "Avtopark servisida holat enum'i `const (Moving = iota; Idle; Offline)` va qiymatlar bazada raqam sifatida saqlanadi. Keyin kimdir `Idle` dan oldin `Parked` qo'shdi. Eng aniq oqibat?"
    options:
      - "Kompilyatsiya xatosi, chunki iota qiymatlari o'zgargan"
      - "Hech narsa o'zgarmaydi: iota qiymatlarni birinchi marta ishlatilgan paytda qotiradi"
      - "Bazadagi eski yozuvlarning ma'nosi jimgina siljiydi: eski Idle endi Parked bo'lib o'qiladi"
      - "Faqat yangi qo'shilgan konstanta qiymat oladi, qolganlari saqlanadi"
    answer: 2
    explain: "iota faqat tartibga bog'liq: oraga qo'yilgan nom keyingilarning raqamini siljitadi, kompilyator bunga hech narsa demaydi. Saqlanadigan qiymatlar uchun raqamlarni aniq yozing yoki yangi nomlarni faqat oxiriga qo'shing."
task:
  title: "Bitmask: iota bilan datchik bayroqlari"
  prompt: |
    Telemetriya paketida avtomobil holati bir baytli bayroqlar bilan uzatiladi: kontakt, eshik ochiq, SOS, yoqilg'i kam. Hozirgi kodda bayroqlar `iota` bilan 0, 1, 2, 3 qilib e'lon qilingan va `|` bilan birlashtiriladi, shuning uchun `FlagIgnition` (0) yo'qoladi va `Has` noto'g'ri `true` qaytaradi.

    Qayta yozing:

    1. `Flags` tipi `uint8` asosida bo'lsin, bayroqlar `1 << iota` bilan typed constant sifatida e'lon qilinsin.
    2. `Has`, `Set`, `Clear` metodlari qo'shilsin (`Clear` uchun `&^`).
    3. `String()` faol bayroqlarni `IGNITION|SOS` ko'rinishida, bo'sh bo'lsa `none` qaytarsin.

    `main`dagi chiqish quyidagicha bo'lishi kerak: `IGNITION|SOS SOS: true DoorOpen: false LowFuel: false`, keyin `IGNITION`, keyin `none`.
  lang: go
  starter: |
    package main

    import (
        "fmt"
    )

    // Datchik holatlari. Ular bir vaqtning o'zida bir nechta bo'lishi mumkin.
    const (
        FlagIgnition = iota
        FlagDoorOpen
        FlagSOS
        FlagLowFuel
    )

    type Flags int

    func (f Flags) Has(flag int) bool {
        return int(f)&flag != 0
    }

    func (f Flags) String() string {
        return fmt.Sprintf("Flags(%d)", int(f))
    }

    func main() {
        var f Flags
        f |= FlagIgnition
        f |= FlagSOS
        fmt.Println(f, "SOS:", f.Has(FlagSOS), "DoorOpen:", f.Has(FlagDoorOpen), "LowFuel:", f.Has(FlagLowFuel))
        var empty Flags
        fmt.Println(empty)
    }
  solution: |
    package main

    import (
        "fmt"
        "strings"
    )

    // Flags - datchik holatlari bitmaski. Nol qiymat "hech narsa yoq" degani.
    type Flags uint8

    const (
        FlagIgnition Flags = 1 << iota
        FlagDoorOpen
        FlagSOS
        FlagLowFuel
    )

    var flagNames = []struct {
        flag Flags
        name string
    }{
        {FlagIgnition, "IGNITION"},
        {FlagDoorOpen, "DOOR_OPEN"},
        {FlagSOS, "SOS"},
        {FlagLowFuel, "LOW_FUEL"},
    }

    func (f Flags) Has(flag Flags) bool { return f&flag == flag }

    func (f Flags) Set(flag Flags) Flags { return f | flag }

    func (f Flags) Clear(flag Flags) Flags { return f &^ flag }

    func (f Flags) String() string {
        if f == 0 {
            return "none"
        }
        var parts []string
        for _, e := range flagNames {
            if f.Has(e.flag) {
                parts = append(parts, e.name)
            }
        }
        return strings.Join(parts, "|")
    }

    func main() {
        var f Flags
        f = f.Set(FlagIgnition).Set(FlagSOS)
        fmt.Println(f, "SOS:", f.Has(FlagSOS), "DoorOpen:", f.Has(FlagDoorOpen), "LowFuel:", f.Has(FlagLowFuel))
        f = f.Clear(FlagSOS)
        fmt.Println(f)
        var empty Flags
        fmt.Println(empty)
    }
  solutionNotes: |
    - `1 << iota` har bir ConstSpec uchun 1, 2, 4, 8 beradi; ifoda va tip ikkinchi qatordan boshlab bo'sh qoldiriladi (implicit repetition), shuning uchun `Flags` tipi barcha bayroqqa o'tadi.
    - Nol qiymat ma'noli: `Flags(0)` "hech qanday bayroq yo'q". Bu zero value qoidasiga mos (8-dars).
    - `Has` da `f&flag == flag` yozilgan: bir nechta bit bilan chaqirilsa ham hammasi o'rnatilganini tekshiradi. `!= 0` esa "kamida bittasi" ma'nosini beradi.
    - `Clear` da `&^` (AND NOT) bitni o'chiradi. `Flags` ni `uint8` qilish 8 tadan ko'p bayroq qo'shilganda constant overflow xatosini compile time'da beradi.
    - `flagNames` tartibli slice, map emas: `String()` chiqishi har ishga tushirishda bir xil (map iteratsiyasi tartibi kafolatlanmagan, 14-dars).
  checklist:
    - "Bayroqlar `1 << iota` bilan, `Flags` tipida e'lon qilingan"
    - "`FlagIgnition` yo'qolmaydi: `Set(FlagIgnition).Set(FlagSOS)` ikkala bitni saqlaydi"
    - "`Has`, `Set`, `Clear` metodlari bor, `Clear` `&^` ishlatadi"
    - "`String()` bo'sh qiymat uchun `none`, aks holda nomlarni `|` bilan beradi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Go'dagi son bilan bog'liq xatolarning katta qismi kod yozilayotgan paytda ko'rinmaydi. `1 / 2` ni `float64` ga yozgan dasturchi 0.5 kutadi, 0 oladi. `iota` bilan e'lon qilingan holat kodlari bazaga raqam bo'lib yoziladi, keyin kimdir enum o'rtasiga yangi nom qo'shadi va eski yozuvlar jimgina boshqa ma'no oladi. `:=` ichki blokda tashqi `err` ni yopib qo'yadi va funksiya xatoni yo'qotib qaytaradi. Uchalasi ham kompilyatsiyadan o'tadi.

JavaScript/TypeScript dunyosida bunday xatolarning ayrimlari boshqacha ko'rinadi: `number` bitta tip, `1 / 2` har doim 0.5, `enum` esa compile time'dagi sintaktik qobiq. Go'da tiplar qat'iy, ammo konstantalar uchun alohida, "tipsiz" dunyo bor va u aynan shu muammolarning manbai. Bu darsda spetsifikatsiya darajasida: predeclared tiplar, constant'larning arbitrary precision hisobi, `iota` qoidalari va o'zgaruvchi e'lon qilish shakllari.

## Asosiy g'oya

### Predeclared tiplar va int

Spetsifikatsiya arxitekturadan mustaqil tiplarni sanaydi: `uint8`...`uint64`, `int8`...`int64`, `float32`, `float64`, `complex64`, `complex128`, `byte` (`uint8` alias'i) va `rune` (`int32` alias'i). Qiymatlar two's complement bilan saqlanadi. Alohida guruh: `uint`, `int` (ikkalasi 32 yoki 64 bit, bir xil o'lchamda) va `uintptr`. Muhim qoida: barcha numeric tiplar named type va bir-biridan farq qiladi, faqat `byte` va `rune` alias. `int32` va `int` bir arxitekturada bir xil o'lchamda bo'lsa ham, aralash ifodada aniq konversiya kerak. TypeScript'dan farqli o'laroq, `int64` bilan `int` ni qo'shib bo'lmaydi (4-dars bu qoidani assignability bilan birga ko'radi).

### Overflow

Unsigned amallar (`+`, `-`, `*`, `<<`) 2^n modulida hisoblanadi, dastur "wrap around"ga tayanishi mumkin. Signed amallarda ham overflow qonuniy: natija deterministik aniqlanadi va run-time panic bo'lmaydi. Spetsifikatsiya qo'shadi: kompilyator overflow bo'lmaydi degan faraz bilan optimizatsiya qila olmaydi, masalan `x < x + 1` har doim `true` deb hisoblanmaydi. Shuning uchun hisoblagich yoki summa 64-bit chegarasiga yetishi mumkin bo'lgan joyda (masalan, odometr yig'indisi) tekshiruvni o'zingiz yozasiz.

### Untyped constant

Spetsifikatsiya konstantalar haqida uch muhim gap aytadi:

- Numeric constant'lar **aniq qiymat**larni arbitrary precision bilan ifodalaydi va overflow qilmaydi. Shu sababli IEEE 754 manfiy nol, infinity va NaN qiymatli konstanta mavjud emas.
- Literal'lar, `true`, `false`, `iota` va faqat untyped operandli ifodalar **untyped**. Ular ma'lum tipni kontekstdan oladi; qiymat shu tipga sig'masa, bu xato.
- Untyped constant'ning **default type**i bor: tip talab qilinadigan joyda (masalan `i := 0`) u `bool`, `rune`, `int`, `float64`, `complex128` yoki `string` ga aylanadi.

Implementatsiya cheklovi: kompilyator konstantalarni cheklangan aniqlikda saqlashi mumkin, lekin integer uchun kamida 256 bit, floating-point mantissa uchun kamida 256 bit va exponent uchun kamida 16 bit bo'lishi shart. Aniq tasvirlay olmasa, xato berishi kerak.

## Chuqurroq: konstanta ifodalari, shift va iota

### Constant expression qoidalari

Faqat constant operandlardan iborat ifoda compile time'da, aniq hisoblanadi. Boshqa untyped operandli amallar (shift'dan tashqari) natijaning turini "kattaroq" operand belgilaydi: integer, rune, floating-point, complex tartibida. Spetsifikatsiya misollari:

- `15 / 4` untyped integer, natija 3;
- `15 / 4.0` untyped floating-point, natija 3.75;
- `const Θ float64 = 3/2` ning qiymati 1.0, chunki `3/2` butun son bo'linmasi, keyin tipga o'tkaziladi;
- `const Huge = 1 << 100` qonuniy, `Huge >> 98` esa `int8` ga sig'adigan 4.

Typed constant'larning qiymati o'z tipida aniq ifodalanishi shart: `uint(-1)`, `int(3.14)` va `int64(Huge)` konstanta ifodalari yaroqsiz. Constant bo'luvchi nol bo'lsa ham xato.

### Non-constant shift: bitta qoida

Shift'da chap operand untyped constant, o'ng operand o'zgaruvchi bo'lsa, chap operand "shift olib tashlansa qaysi tipni olardi" shu tipga o'tadi. Spetsifikatsiya misollari (64-bit int uchun): `var j int32 = 1<<s` da 1 `int32` tipida, s=33 bo'lganda `j == 0`; `var k = uint64(1<<s)` da `k == 1<<33`; `var v1 float32 = 1<<s` esa yaroqsiz, chunki 1 `float32` bo'lib qoladi va uni siljitib bo'lmaydi. Ma'no: `1 << s` ifodasining tipi o'zida emas, atrofidagi kontekstda. Hisoblash natijasi tipga bog'liq bo'lgani uchun bu yozuvni parametr sifatida berilgan kengliklarda ehtiyotkorlik bilan ishlating.

### iota

`iota` constant declaration ichidagi ConstSpec indeksi, noldan boshlanadi. Spetsifikatsiya qoidalari:

- Bir ConstSpec ichidagi barcha `iota` bir xil qiymatga ega.
- Qavsli blok ichida ifodalar ro'yxati birinchisidan tashqari tushirib qoldirilishi mumkin: bu oldingi bo'sh bo'lmagan ro'yxat va tipni matn bo'yicha takrorlash demak. `const (a = 1 << iota; b; c)` shu mexanizm.
- `_` (blank identifier) qiymatni o'tkazib yuboradi, lekin indeks oshadi.
- Qo'lda yozilgan qiymat (`c = 3`) ham indeksni oshiradi. Keyingi `iota` ishlatilsa, u qatordagi o'z o'rniga qarab qiymat oladi.
- Har `const` bloki uchun hisoblagich noldan boshlanadi; alohida `const x = iota` qatori har doim 0.

### Variable declarations

`var` shakllari: tip bilan, boshlang'ich qiymat bilan yoki ikkalasi. Boshlang'ich qiymat yo'q bo'lsa o'zgaruvchi zero value oladi (8-dars). Tip yo'q bo'lsa, tip qiymatdan olinadi; untyped constant bo'lsa default type'ga o'tadi. `var n = nil` yaroqsiz. `:=` faqat funksiya ichida ishlaydi va quyidagi nozik qoida bilan: chap tomonda kamida bitta yangi non-blank nom bo'lishi shart, bir blokda oldin e'lon qilingan nomlar yangi o'zgaruvchi yaratmaydi, balki ularga qiymat yoziladi. Boshqa blokdagi (masalan, tashqi funksiya darajasidagi) nom esa qayta e'lon qilinadi, ya'ni **shadowing** bo'ladi. Implementatsiya cheklovi: kompilyator funksiya ichida ishlatilmagan o'zgaruvchini xato deb hisoblashi mumkin (gc shunday qiladi).

## Misol: konstantalar, enum va shadowing

### 1. Untyped constant va overflow

```go
package main

import (
	"fmt"
	"time"
)

const Huge = 1 << 100

const (
	maxRetries = 3
	timeout    = 5
)

func main() {
	fmt.Println(Huge >> 98)

	// untyped constant context'ga moslashadi
	var d time.Duration = timeout * time.Second
	fmt.Println(d)

	var ratio float64 = 1 / 2
	fmt.Println("1/2 =", ratio, "| 1/2.0 =", 1/2.0)

	fmt.Printf("%T %T %T %T\n", 42, 4.2, 'x', 2i)

	n := 3
	// time.Sleep(n * time.Second) // mismatched types int and time.Duration
	fmt.Println(time.Duration(n) * time.Second)

	var s uint = 33
	var i = 1 << s
	var j int32 = 1 << s
	var k = uint64(1 << s)
	fmt.Println(i, j, k)

	var u8 uint8 = 250
	u8 += 10
	var i8 int8 = 127
	i8++
	fmt.Println(u8, i8)
}
```

Go 1.24.7 (linux/amd64) da natija:

```text
4
5s
1/2 = 0 | 1/2.0 = 0.5
int float64 int32 complex128
3s
8589934592 0 8589934592
4 -128
```

`timeout * time.Second` ishlaydi, chunki `timeout` untyped va `time.Duration` ga moslashadi. Xuddi shu o'rinda `n * time.Second` (n int o'zgaruvchi) tipni moslay olmaydi, shuning uchun `time.Duration(n)` kerak. Oxirgi qatorda `uint8` 250+10 ni 4 qiladi, `int8` 127 ga 1 qo'shsa -128 bo'ladi: panic yo'q. `var b byte = 255 + 1` esa compile time'da rad etiladi:

```text
cannot use 255 + 1 (untyped int constant 256) as byte value in variable declaration (overflows)
```

Shunga o'xshash: `var x int64 = math.MaxInt64 + 1` ham `(overflows)` xatosi beradi, `x + y` (int64 va int) esa `invalid operation: x + y (mismatched types int64 and int)`.

### 2. iota: enum, bitmask, o'lchamlar

```go run
package main

import "fmt"

type Status uint8

const (
	StatusUnknown Status = iota
	StatusMoving
	StatusIdle
	StatusOffline
)

type Flag uint8

const (
	FlagIgnition Flag = 1 << iota
	FlagDoorOpen
	FlagSOS
	FlagLowFuel
)

const (
	_  = iota
	KB = 1 << (10 * iota)
	MB
	GB
)

const (
	a, b = iota, iota * 10
	c, d
	_, _
	e, f
)

func main() {
	fmt.Println(StatusUnknown, StatusMoving, StatusIdle, StatusOffline)
	flags := FlagIgnition | FlagSOS
	fmt.Printf("%04b has SOS: %t, has DoorOpen: %t\n", flags, flags&FlagSOS != 0, flags&FlagDoorOpen != 0)
	fmt.Println(KB, MB, GB)
	fmt.Println(a, b, c, d, e, f)
	var s Status
	fmt.Println("zero value:", s == StatusUnknown)
}
```

```text
0 1 2 3
0101 has SOS: true, has DoorOpen: false
1024 1048576 1073741824
0 0 1 10 3 30
zero value: true
```

`Status` ning zero value'si `StatusUnknown`: yangi, hali to'ldirilmagan yozuv "noma'lum" holatda turadi. Bu ataylab qilingan dizayn qarori, chunki Go'da e'lon qilingan hamma qiymat nolga teng bo'ladi. Bayroqlarda `1 << iota` bitlarni 1, 2, 4, 8 qiladi. `_ = iota` qatori nolni "yeb" qo'yadi va `KB = 1 << (10 * iota)` 1024 dan boshlanadi. Oxirgi blokda ikkita ifoda ro'yxati takrorlanadi: `a, b = 0, 0`, `c, d = 1, 10`, bo'sh qator (2) o'tkazib yuboriladi, `e, f = 3, 30`.

Muhim: enum qiymatlari bazada yoki protokolda raqam bo'lsa, `iota` tartibiga ishonish xavfli. O'rtaga nom qo'shsangiz, kompilyator indamaydi, ammo eski ma'lumotlar boshqa ma'no oladi. Saqlanadigan kodlarni aniq yozing (`StatusIdle Status = 2`) yoki yangisini faqat oxiriga qo'shing.

### 3. := va shadowing

```go run
package main

import (
	"fmt"
	"strconv"
)

// loadWrong ichki blokda := ishlatgani uchun tashqi v va err'ni to'ldirmaydi.
func loadWrong(raw string) (int, error) {
	var v int
	var err error
	if raw != "" {
		v, err := strconv.Atoi(raw)
		if err != nil {
			fmt.Println("log:", err)
		}
		_ = v
	}
	return v, err
}

func loadRight(raw string) (int, error) {
	var v int
	var err error
	if raw != "" {
		v, err = strconv.Atoi(raw)
	}
	return v, err
}

func main() {
	fmt.Println(loadWrong("abc"))
	fmt.Println(loadWrong("42"))
	fmt.Println(loadRight("abc"))
	fmt.Println(loadRight("42"))

	x, err := strconv.Atoi("10")
	y, err := strconv.Atoi("x")
	fmt.Println(x, y, err)
}
```

```text
log: strconv.Atoi: parsing "abc": invalid syntax
0 <nil>
0 <nil>
0 strconv.Atoi: parsing "abc": invalid syntax
42 <nil>
10 0 strconv.Atoi: parsing "x": invalid syntax
```

`loadWrong` kompilyatsiyadan ham, `go vet` dan ham o'tadi: ichki `v, err :=` yangi o'zgaruvchilarni yaratadi, tashqi `v` va `err` esa nol qoladi. Natijada "abc" uchun `0 <nil>`: xato faqat logga tushdi, chaqiruvchi esa uni ko'rmadi. `loadRight` oldindan e'lon qilingan o'zgaruvchilarga `=` bilan yozadi. Ikkinchi nozik joy `main` oxirida: `y, err := ...` yangi o'zgaruvchi yaratmaydi, balki avvalgi `err` ga yozadi, shuning uchun birinchi chaqiruvning xatosi yo'qoladi. Agar birinchi chaqiruvdan keyin `err` tekshirilmasa, kompilyator buni ushlamaydi.

## Qachon qo'llamaslik kerak

- `iota` ni tashqi ma'lumotga bog'liq qiymatlar uchun ishlatmang: bazadagi status kodlari, protokol opcode'lari, JSON/Protobuf raqamlari. Ularning raqami kelishuv, tartib esa tasodif. Protobuf enum'lari uchun raqamlar `.proto` faylida aniq yoziladi.
- `1 << iota` bayrog'ini 8 yoki 64 bitdan oshiqcha qo'shmang, tipni oldindan to'g'ri tanlang. Constant overflow compile time'da chiqadi, lekin `Flags` ni `uint8` dan `uint16` ga o'zgartirish serializatsiya formatini ham o'zgartiradi.
- Pul va aniq o'nlik hisobi uchun `float64` va untyped float constant'larga tayanmang: `0.1 + 0.2` kabi ifodalar constant'larda aniq, o'zgaruvchilarda esa IEEE 754 xatosini beradi (Go 1.24.7 da `fmt.Println(0.1+0.2, x+y)` `0.3 0.30000000000000004` chiqardi, x=0.1, y=0.2). Pulni eng kichik birlikda butun son sifatida saqlang.
- `:=` ni ichki blokda tashqi o'zgaruvchiga qiymat berish uchun ishlatmang. Qiymat tashqarida kerak bo'lsa, o'zgaruvchini oldin `var` bilan e'lon qilib, ichkarida `=` ishlating. Bu qoida `if`, `for`, `switch` inicializatorlariga ham tegishli.
- Cheklovga e'tibor: bu darsdagi shadowing misolini `go vet` standart rejimida ushlamaydi. Shadow tekshiruvi alohida analyzer sifatida mavjud, uni ishga tushirish yoki yo'qligini jamoa o'zi hal qiladi (40-dars linter'lar haqida).

## Stack'da: Node.js/TypeScript bilan solishtirish

- `number` o'rniga Go'da tanlov bor: id va hisoblagichlar uchun `int64`/`uint64`, vaqt o'lchamlari uchun `time.Duration`, narx uchun butun son (tiyin). JSON'da 2^53 dan katta id'lar TypeScript tomonida aniqlik yo'qotadi, Go tomonda `int64` yo'qotmaydi: chegarada string yoki BigInt tanlovini oldindan kelishing (76-dars).
- TypeScript `enum` yoki string union o'rniga Go'da `type Status uint8` va `iota`. Farq: Go enum'i oddiy integer, tashqaridan kelgan 99 raqami ham `Status` bo'la oladi. Shuning uchun chegarada (JSON, DB) qiymatni tekshiradigan funksiya yozing (`func (s Status) Valid() bool`).
- `time.Sleep(5 * time.Second)` kabi yozuvlar untyped constant qoidasi tufayli kompilyatsiya bo'ladi, `time.Sleep(n * time.Second)` esa bo'lmaydi. Bu TypeScript'dagi yumshoq number arifmetikasidan ancha qat'iyroq.
- Ichki blokdagi `err` ni yopish xatosi Node.js'dagi `let`/`const` shadowing'iga o'xshaydi, lekin Go'da asosiy xato yo'li (error qiymati) shu o'zgaruvchi orqali o'tadi, shuning uchun oqibati og'irroq.

## Xulosa

- Numeric tiplar bir-biridan farq qiladi (faqat `byte` va `rune` alias); aralash ifodada aniq konversiya kerak.
- Unsigned va signed overflow runtime'da panic bermaydi, wrap qiladi; constant ifodada esa overflow compile time xatosi.
- Untyped constant arbitrary precision bilan hisoblanadi va default type'ga faqat tip kerak bo'lganda o'tadi: `1 / 2` nolga teng, `1 / 2.0` yarimga.
- `iota` ConstSpec indeksi: implicit repetition, `_` va qo'lda yozilgan qiymatlar indeksni oshiradi; saqlanadigan qiymatlar uchun tartibga ishonmang.
- Non-constant shift'da chap untyped operandning tipi kontekstdan olinadi: `int32` kontekstida `1 << 33` nolga teng.
- `:=` bir blokda mavjud nomni qayta e'lon qilmaydi, balki unga yozadi, ichki blokda esa tashqi nomni yopadi: xato yo'lida shadowing eng ko'p uchraydigan tuzoq.
