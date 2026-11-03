---
n: 4
slug: assignability-va-konversiya
title: "Type identity, assignability va konversiyalar"
summary: "Named va unnamed tiplar, underlying type, type identity qoidalari, qaysi qiymat qaysi tipga assignable ekani va konversiya qachon kerak: sonlar, struct tag'lar, string va slice->array konversiyalari hamda ularning run-time xarajati."
duration: 40
sources:
  - id: go-spec
    note: "Underlying types, Type identity, Assignability, Representability va Conversions bo'limlari (sonlar orasidagi, string va slice->array konversiyalari)"
  - id: gopl
    note: "Kitobning tiplar, nomlangan tiplar va konversiyalar haqidagi boblari (umumiy tayanch; aniq qoidalar spetsifikatsiyadan olingan)"
quiz:
  - q: "type VehicleID int64; type OrderID int64; type RouteID = int64 e'lonlari bor. v - VehicleID o'zgaruvchisi. Qaysi yozuv konversiyasiz kompilyatsiya bo'ladi?"
    options:
      - "var o OrderID = v"
      - "var n int64 = v"
      - "var r RouteID = int64(7)"
      - "var o OrderID = VehicleID(1)"
    answer: 2
    explain: "RouteID alias, shuning uchun u int64 bilan bir xil tip. VehicleID, OrderID va int64 uchtasi alohida named type: ularning underlying type bir xil, lekin assignability uchun kamida bittasi named bo'lmagan tip bo'lishi kerak. Birinchi, ikkinchi va to'rtinchi yozuvlar xato beradi."
  - q: "var v uint16 = 0x10F0 bo'lsa, uint32(int8(v)) nimaga teng?"
    options:
      - "0xFFFFFFF0"
      - "0xF0"
      - "0x10F0"
      - "Run-time panic: overflow"
    answer: 0
    explain: "Butun sonlar orasida konversiya avval aniq kengaytiriladi (signed bo'lsa sign extension), keyin natija tipining o'lchamiga qirqiladi. int8(v) 0xF0 = -16 beradi, uint32 ga o'tganda sign extension tufayli 0xFFFFFFF0. Overflow haqida hech qanday signal yo'q."
  - q: "f := -3.99 bo'lsa, int(f) nima beradi?"
    options:
      - "-4"
      - "-3"
      - "-3.99 (int float qiymatini saqlab qoladi)"
      - "Run-time panic: kasr qismi yo'qoladi"
    answer: 1
    explain: "Floating-point sonni integerga aylantirganda kasr qismi tashlanadi, ya'ni nol tomonga qirqish bo'ladi: -3.99 -> -3. Yaxlitlash kerak bo'lsa, math.Round ishlatiladi. Panic yo'q."
  - q: "n := 65 (int) uchun string(n) nima beradi va go vet nima deydi?"
    options:
      - "\"65\"; vet jim"
      - "Kompilyatsiya xatosi"
      - "\"\" (bo'sh string), chunki 65 rune emas"
      - "\"A\"; vet 'string of one rune, not a string of digits' deb ogohlantiradi"
    answer: 3
    explain: "Integerdan string ga konversiya qiymatni Unicode code point deb oladi, 65 -> \"A\". Raqamlar matni kerak bo'lsa strconv.Itoa yoki fmt.Sprint. go vet bu xavfli konversiyani ogohlantirish bilan belgilaydi."
  - q: "type Reading struct{ Sensor string `json:\"sensor\"` } va type Wire struct{ Sensor string `db:\"sensor_id\"` }. r - Reading. Qaysi gap to'g'ri?"
    options:
      - "Wire(r) kompilyatsiya bo'ladi, var w Wire = r esa bo'lmaydi"
      - "Ikkalasi ham kompilyatsiya bo'ladi, tag'lar e'tiborga olinmaydi"
      - "Ikkalasi ham xato: tag'lar farq qiladi"
      - "Wire(r) xato, var w Wire = r kompilyatsiya bo'ladi"
    answer: 0
    explain: "Konversiyada struct tag'lar hisobga olinmaydi, underlying type'lar boshqa jihatdan bir xil bo'lsa yetarli. Assignability uchun esa Reading va Wire ikkalasi ham named type va identical emas, shuning uchun to'g'ridan-to'g'ri assign qilib bo'lmaydi."
  - q: "s := []int{1, 2, 3, 4} bo'lsa, a := [8]int(s) (Go 1.20 dan) nima qiladi?"
    options:
      - "Kompilyatsiya xatosi: o'lcham mos emas"
      - "Qolgan elementlarni nol bilan to'ldirib massiv yaratadi"
      - "Run-time panic: slice uzunligi massivdan kichik"
      - "Faqat 4 ta elementli massiv qaytaradi"
    answer: 2
    explain: "Slice -> array konversiyasi uzunlik massiv uzunligidan kichik bo'lsa run-time'da panic beradi (xabar: cannot convert slice with length 4 to array or pointer to array with length 8). Kompilyator uzunlikni bilmaydi, chunki slice uzunligi dinamik."
task:
  title: "Pul va butun son konversiyalarini xavfsiz qilish"
  prompt: |
    To'lov servisida narx `float64` dollarda keladi, ichida `Cents` (tiyin) butun son sifatida saqlanadi, eski protokol esa miqdorni `int32`, kategoriya kodini bitta bayt (`uint8`) sifatida talab qiladi. Hozirgi kod ikki xatoga ega:

    1. `Cents(d * 100)` kasr qismini qirqadi: `19.99` dollar 1998 tiyin bo'lib qoladi, chunki `19.99*100` float64 da `1998.9999999999998` chiqadi.
    2. `int32(c)` va `uint8(n)` konversiyalari qiymat sig'masa jimgina qirqadi (`300` -> `44`).

    Tuzating: `fromDollars` eng yaqin butun songa yaxlitlasin (manfiy qiymatlarni ham), `Int32` va `toUint8` qiymat sig'masa nol qiymat va tushunarli error qaytarsin. Imzolarni o'zgartirmang.
  lang: go
  starter: |
    package main

    import (
        "fmt"
    )

    // Cents - pul miqdori eng kichik birlikda (tiyin).
    type Cents int64

    // fromDollars so'mni/dollarni tiyinga aylantiradi.
    func fromDollars(d float64) Cents {
        return Cents(d * 100)
    }

    // Int32 miqdorni int32 maydonga (masalan, eski protokolga) o'tkazadi.
    func (c Cents) Int32() (int32, error) {
        return int32(c), nil
    }

    // toUint8 qiymatni bir baytli maydonga o'tkazadi.
    func toUint8(n int64) (uint8, error) {
        return uint8(n), nil
    }

    func main() {
        fmt.Println(fromDollars(19.99), fromDollars(0.29), fromDollars(-1.15))

        v, err := Cents(5_000_000_000).Int32()
        fmt.Println(v, err)

        b, err := toUint8(300)
        fmt.Println(b, err)

        b, err = toUint8(200)
        fmt.Println(b, err)
    }
  solution: |
    package main

    import (
        "fmt"
        "math"
    )

    // Cents - pul miqdori eng kichik birlikda (tiyin).
    type Cents int64

    // fromDollars so'mni/dollarni tiyinga aylantiradi (eng yaqin butun songa yaxlitlab).
    func fromDollars(d float64) Cents {
        return Cents(math.Round(d * 100))
    }

    // Int32 miqdorni int32 maydonga (masalan, eski protokolga) o'tkazadi.
    func (c Cents) Int32() (int32, error) {
        if c < math.MinInt32 || c > math.MaxInt32 {
            return 0, fmt.Errorf("cents: %d int32 ga sig'maydi", int64(c))
        }
        return int32(c), nil
    }

    // toUint8 qiymatni bir baytli maydonga o'tkazadi.
    func toUint8(n int64) (uint8, error) {
        if n < 0 || n > math.MaxUint8 {
            return 0, fmt.Errorf("%d uint8 ga sig'maydi", n)
        }
        return uint8(n), nil
    }

    func main() {
        fmt.Println(fromDollars(19.99), fromDollars(0.29), fromDollars(-1.15))

        v, err := Cents(5_000_000_000).Int32()
        fmt.Println(v, err)

        b, err := toUint8(300)
        fmt.Println(b, err)

        b, err = toUint8(200)
        fmt.Println(b, err)
    }
  solutionNotes: |
    - Konversiya `Cents(d * 100)` float -> integer bo'lgani uchun kasrni nol tomonga qirqadi (spetsifikatsiya). Pul uchun avval `math.Round`, keyin konversiya. Manfiy qiymatlarda ham ishlaydi: `-1.15*100` = `-114.99999999999999`, `math.Round` esa -115 beradi.
    - Integerlar orasidagi konversiya hech qachon xato bermaydi, faqat yuqori bitlarni tashlaydi. Shuning uchun diapazon tekshiruvi konversiyadan oldin, ayni shu tiplarning chegaralari (`math.MinInt32`, `math.MaxUint8`) bilan qilinadi.
    - `c < math.MinInt32` da `math.MinInt32` untyped constant, shuning uchun u `Cents` (int64) ga moslashadi; konversiyaga hojat yo'q.
    - Xato matnida `int64(c)` ishlatilgan: `Cents` uchun keyinchalik `String()` metodi qo'shilsa, `%d` va rekursiyadan qochish uchun aniq konversiya xavfsizroq.
  checklist:
    - "`fromDollars` 19.99, 0.29 va -1.15 uchun 1999, 29, -115 qaytaradi"
    - "`Int32` 5_000_000_000 uchun xato qaytaradi, sig'adigan qiymatda `nil`"
    - "`toUint8` 300 uchun xato qaytaradi, 200 uchun 200"
    - "Tekshiruv konversiyadan oldin bajariladi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Backend kodida tiplar chegaralarda aralashadi: ID'lar bazadan `int64` bo'lib keladi, JSON'dan `float64`, tashqi protokoldan `uint16` yoki `int32`. TypeScript'da hammasi `number`, shuning uchun adashgan argument tartibi (`transfer(orderID, vehicleID)`) kompilyatsiyadan o'tadi. Go'da bu holat mumkin bo'lishi yoki bo'lmasligi sizning tiplaringizni qanday e'lon qilganingizga bog'liq. Bu qoidalarni noto'g'ri tushunish ikki tomonga ziyon qiladi: yoki haddan tashqari ko'p konversiya yozasiz (va ularning har biri jimgina ma'lumot qirqishi mumkin), yoki tiplar tizimining himoyasidan umuman foydalanmaysiz.

Ikkinchi muammo: konversiya ko'pincha "tipni almashtiradi" deb o'ylanadi, aslida sonlar va string konversiyalari qiymatni o'zgartiradi. `int8(v)` bitlarni qirqadi, `int(f)` kasrni tashlaydi, `string(65)` raqam emas, harf beradi. Bular kompilyatsiya xatosi emas, shuning uchun production'da topiladi.

## Asosiy g'oya

### Named va unnamed tiplar, underlying type

Spetsifikatsiya har bir tip uchun **underlying type**ni belgilaydi. Predeclared tip (`int`, `string`) yoki tip literal (`[]Point`, `map[string]int`, `struct{...}`) uchun underlying type o'zi. Boshqa holatda e'londa ko'rsatilgan tipning underlying type'i olinadi. Spetsifikatsiya misoli: `B1 string`, `B2 B1` ning underlying type'i `string`, `B3 []B1` va `B4 B3` niki `[]B1`.

**Named type** - ismi bor tip: predeclared tiplar va `type X ...` bilan e'lon qilinganlar. **Unnamed type** - tip literal. Qoida: yangi nom bilan e'lon qilingan tip (`type VehicleID int64`) **defined type**, `type RouteID = int64` esa **type alias**: u yangi tip yaratmaydi, mavjudning ikkinchi nomi.

### Type identity

Spetsifikatsiya: named type har doim boshqa har qanday tipdan farq qiladi. Aks holda ikki tip underlying literal'larining tuzilmasi bir xil bo'lsa identical: massivlar element tipi va uzunligi bilan, slice'lar element tipi bilan, struct'lar maydonlar ketma-ketligi, nomlari, tiplari **va tag'lari** bilan, funksiyalar parametr va natija tiplari bilan (nomlari muhim emas), map'lar kalit va element tipi bilan. Natijalar:

- `type B0 []string` va `type B1 []string` identical emas, chunki ikkalasi alohida defined type.
- `A0 = []string` alias bo'lgani uchun `A0` va `[]string` identical.
- Funksiya tipi `func(x int, y float64)` va `func(int, float64)` identical, parametr nomlari hisobga olinmaydi.

### Assignability

Qiymat x (tipi V) T tipidagi o'zgaruvchiga assign qilinadi, agar quyidagilardan biri bajarilsa:

- V va T identical;
- V va T underlying type'lari identical, ikkalasi type parameter emas va **kamida bittasi named bo'lmagan tip**;
- ikkalasi channel tipi, element tiplari bir xil, V bidirectional va kamida bittasi named emas;
- T interface va x uni implement qiladi;
- x `nil`, T esa pointer, function, slice, map, channel yoki interface;
- x untyped constant va T da ifodalanadi (representable).

Shu ro'yxatdan kelib chiqadigan amaliy xulosa: `type Route []Point` va `type Track []Point` bir-biriga assign qilinmaydi (ikkalasi named), lekin `[]Point{}` literal'i ikkalasiga ham assign qilinadi (u unnamed). `VehicleID` va `OrderID` aralashmaydi, lekin ikkalasiga ham `42` literal'ini yozish mumkin.

## Chuqurroq: konversiya qoidalari va ularning narxi

### Qachon konversiya mumkin

Explicit konversiya `T(x)` ko'rinishida. Constant uchun x T da ifodalansa bo'ladi va natija typed constant. Non-constant qiymat uchun spetsifikatsiya ro'yxati: x T ga assignable; yoki tag'larni e'tiborga olmasdan underlying type'lar bir xil; yoki ikkala tip ham integer yoki float; ikkalasi ham complex; integer yoki `[]byte`/`[]rune` -> string; string -> `[]byte`/`[]rune`; slice -> array (Go 1.20) yoki array pointer (Go 1.17), element tiplari bir xil bo'lsa. Pointer tiplari uchun ham xuddi shu qoida: nomsiz pointer tiplarining bazaviy tiplari underlying jihatdan bir xil bo'lsa.

Struct tag'lar konversiyada hisobga olinmaydi, identity va assignability'da esa hisobga olinadi. Spetsifikatsiya buni `*Person` va tag'li nomsiz struct pointer'i misolida ko'rsatadi. Amaliy foydasi: HTTP DTO va DB modelini bir xil maydonlar bilan, lekin turli tag'lar (`json` va `db`) bilan e'lon qilib, ular orasida nusxalamasdan konversiya qilish mumkin.

### Sonlar orasidagi konversiya o'zgartiradi

Spetsifikatsiya qoidalari:

- Integerlar orasida: avval signed bo'lsa sign extension, unsigned bo'lsa zero extension bilan aniq kengaytiriladi, keyin natija tipining o'lchamiga qirqiladi. Overflow haqida signal yo'q. Spetsifikatsiya misoli: `v := uint16(0x10F0)` uchun `uint32(int8(v)) == 0xFFFFFFF0`.
- Float -> integer: kasr qismi tashlanadi (nol tomonga qirqish). Natija tipga sig'masa konversiya muvaffaqiyatli bo'ladi, lekin natija implementation-dependent. Ya'ni bu holatda qiymat arxitekturaga bog'liq bo'lishi mumkin va dasturlar unga tayanmasligi kerak.
- Integer/float -> float: natija destination tipning aniqligigacha yaxlitlanadi. Float32 qiymatni aniq yaxlitlash uchun `float32(x + 0.1)` yozing, aks holda kompilyator oraliq natijani kengroq aniqlikda saqlashi mumkin.

Bu konversiyalar run-time xarajatga ega bo'lishi mumkin: spetsifikatsiya aytadi, sonlar va string konversiyalari tasvirni o'zgartiradi, qolgan konversiyalar esa faqat tipni almashtiradi, qiymat tasviriga tegmaydi.

### String konversiyalari

`string(x)` integer x uchun uni Unicode code point deb talqin qiladi (65 -> `"A"`). Shuning uchun `go vet` ogohlantiradi: `conversion from int to string yields a string of one rune, not a string of digits`. Raqamlar matni uchun `strconv.Itoa` yoki `fmt.Sprint`. `[]byte` va string orasidagi konversiyalar tasvirni o'zgartiradi, shuning uchun qimmat bo'lishi mumkin (13-dars string ichini ko'radi); `[]rune` konversiyasi UTF-8 dekodlash/kodlashni ham o'z ichiga oladi.

### Slice -> array

Go 1.20 dan `[N]T(s)` slice elementlarini massivga nusxalaydi; `len(s) < N` bo'lsa run-time panic. Go 1.17 dan `(*[N]T)(s)` esa nusxalamaydi: pointer slice'ning boshlang'ich N elementiga ishora qiladi, uzunlik shartlari xuddi shunday. Ikkinchi shakl aliasing beradi: pointer orqali yozish slice'ni o'zgartiradi (11-12-darslar).

### Defined type metod to'plamini meros qilmaydi

Aliasdan farqli, `type Timeout time.Duration` yangi tip yaratadi va `time.Duration` ning metodlari unga o'tmaydi. Bu keyingi qismdagi misolda ko'rinadi.

## Misol: ID'lar, konversiyalar va tag'lar

### 1. Defined type, alias va unnamed type

```go run
package main

import "fmt"

type VehicleID int64
type OrderID int64
type RouteID = int64 // alias: int64 bilan bir xil tip

type Point struct{ Lat, Lon float64 }

type Route []Point
type Track []Point

func totalPoints(r Route) int { return len(r) }

func main() {
	var v VehicleID = 42 // untyped constant: assignable
	var o OrderID = OrderID(v)
	var plain int64 = int64(o)
	var rid RouteID = plain // alias, konversiya shart emas
	fmt.Println(v, o, plain, rid)

	pts := []Point{{41.31, 69.28}, {41.32, 69.29}}
	fmt.Println(totalPoints(pts)) // []Point nomsiz tip: Route'ga assignable

	t := Track(pts)
	// totalPoints(t)         // xato: Track Route'ga assignable emas
	fmt.Println(totalPoints(Route(t))) // underlying type bir xil: konversiya mumkin

	fmt.Printf("%T %T %T\n", v, rid, pts)
}
```

```text
42 42 42 42
2
2
main.VehicleID int64 []main.Point
```

`VehicleID` va `OrderID` orasida faqat aniq konversiya bor. `RouteID` alias, shuning uchun `plain` unga o'zi tushadi. `totalPoints(pts)` ishlaydi, chunki `[]Point` nomsiz tip va uning underlying type'i `Route` nikiga teng. Kommentga olingan `totalPoints(t)` xato bergan bo'lardi. Sandbox'da (Go 1.24.7) shu xatolarning matni:

```text
cannot use v (variable of int64 type VehicleID) as OrderID value in variable declaration
cannot use r (variable of slice type Route) as Track value in variable declaration
cannot use v (variable of int64 type VehicleID) as int64 value in variable declaration
```

Uchinchi qator ayniqsa muhim: `VehicleID` ni `int64` parametrga ham to'g'ridan-to'g'ri berib bo'lmaydi. Bu himoya, lekin chegarada (DB'ga yozish) aniq konversiya talab qiladi.

### 2. Konversiyalar o'zgartiradi

```go
package main

import "fmt"

type Reading struct {
	Sensor string `json:"sensor"`
	Value  int
}

type Wire struct {
	Sensor string `db:"sensor_id"`
	Value  int
}

func main() {
	v := uint16(0x10F0)
	fmt.Printf("%#x\n", uint32(int8(v)))

	f := -3.99
	fmt.Println(int(f), int(-f))

	var big int64 = 300
	fmt.Println(uint8(big), int8(big))

	r := Reading{"fuel-1", 17}
	w := Wire(r) // struct tag'lar konversiyada e'tiborga olinmaydi
	fmt.Println(w)

	s := []int{1, 2, 3, 4}
	a := [4]int(s)
	p := (*[2]int)(s)
	p[0] = 99
	fmt.Println(a, s)

	defer func() { fmt.Println("recover:", recover()) }()
	_ = [8]int(s)
}
```

```text
0xfffffff0
-3 3
44 44
{fuel-1 17}
[1 2 3 4] [99 2 3 4]
recover: runtime error: cannot convert slice with length 4 to array or pointer to array with length 8
```

Birinchi qator spetsifikatsiya misoli bilan mos: `0xfffffff0`. `int(f)` -3.99 ni -3 qiladi, `big` o'zgaruvchisi 300 bo'lganda `uint8(big)` 44 beradi (300 mod 256), `int8(big)` ham 44, chunki 44 int8 ga sig'adi. (`uint8(300)` yozuvi constant konversiya bo'lgani uchun kompilyatsiya xatosi bo'lardi.) `Wire(r)` tag'lar farq qilsa ham ishlaydi. `(*[2]int)(s)` orqali `p[0] = 99` yozuvi `s` ni o'zgartirdi, `a` esa nusxa bo'lgani uchun o'zgarmadi. Oxirgi satr: `[8]int(s)` panic berdi va `recover` uni ushladi.

### 3. string(int) tuzog'i va metod yo'qolishi

```go run
package main

import "fmt"

func main() {
	n := 65
	fmt.Println(string(rune(n)), fmt.Sprint(n))
	fmt.Println(string(n))
}
```

Bu faylda `go vet` quyidagicha ogohlantiradi (dastur esa baribir kompilyatsiya bo'ladi va `go run` chiqaradi):

```text
A 65
A
```

Birinchi qatordagi `string(rune(n))` niyatni aniq ko'rsatadi, ikkinchi `string(n)` esa ogohlantirishga tushadi. Defined type va alias farqi:

```go run
package main

import (
	"fmt"
	"time"
)

type Timeout time.Duration // defined type: String metodi o'tmaydi
type Wait = time.Duration  // alias: metodlar saqlanadi

func main() {
	d := 5 * time.Second
	fmt.Println(d, Timeout(d), Wait(d))
	// Timeout(d).Seconds() // xato: Timeout.Seconds undefined
	fmt.Println(time.Duration(Timeout(d)).Seconds())
}
```

```text
5s 5000000000 5s
5
```

`Timeout(d)` `String()` metodini yo'qotgani uchun `5000000000` chiqdi, alias `Wait` esa `5s`. Izohdagi `Timeout(d).Seconds()` ni yoqsak, `Timeout(d).Seconds undefined (type Timeout has no field or method Seconds)` xatosi chiqadi.

## Qachon qo'llamaslik kerak

- Har bir `int64` uchun defined type yaratmang. `VehicleID`, `OrderID` kabi tiplar adashish xavfi real bo'lgan joyda foydali (to'lovlar, ko'p ID uzatiladigan funksiyalar). Bitta lokal hisoblagich uchun ortiqcha konversiya shovqini bo'ladi.
- Konversiyani "tipni tuzatish" uchun ishlatmang. Kompilyator xatosi ko'pincha model noto'g'ri ekanini aytadi; `int(x)`, `float64(y)` bilan jimgina yopilgan joylar keyin ma'lumot yo'qotadi. Sonli konversiyani faqat diapazon va yaxlitlash qarori bilan birga yozing (topshiriqdagi kabi).
- Alias (`=`) ni yangi tip o'rnida ishlatmang. Alias xavfsizlik bermaydi, uning vazifasi kod bazasini ko'chirishda eski va yangi nomni bir tipga bog'lash. Domen tiplari uchun defined type kerak.
- Struct konversiyasiga tayanib DTO va domen modelini bir xil maydonli juft qilib saqlamang. Bog'lanish mo'rt: maydon qo'shilsa yoki tartibi o'zgarsa, konversiya kompilyatsiya bo'lmay qoladi (identity maydonlar ketma-ketligiga bog'liq), maydonlar ko'paygach esa modellar baribir ajraladi.
- Float -> integer konversiyasida qiymat sig'masa natija arxitekturaga bog'liq. Buni sinab ko'rmadik: natija mashinangizda farq qilishi mumkin, shuning uchun bunday kod yozmang, avval diapazonni tekshiring.

## Stack'da: Node.js/TypeScript bilan solishtirish

- TypeScript'dagi branded type (`type OrderId = string & { __brand: 'order' }`) Go'da defined type bilan tabiiy ravishda keladi va run-time xarajatsiz. Farq: Go'da bu tizimning asosiy qismi, TypeScript'da esa trik.
- TypeScript tiplari strukturaviy: ikki obyekt tipi mos bo'lsa assign qilinadi. Go'da faqat nomsiz tip literal'lar strukturaviy; named type'lar nominal. Struct tipi identity uchun tag'lar ham muhim.
- `number` -> `BigInt` tanlovi o'rniga Go'da `int64`, `uint64`, `float64` va aniq konversiya bor; JSON bilan ishlaganda `float64` dan `int64` ga o'tishda yuqoridagi yaxlitlash va diapazon qoidalari kerak.
- DB qatori (`sql.Null...`), JSON DTO va domen modeli orasidagi konversiyalarni bitta paketda, chegarada (mapper funksiyalarida) yozing; ichkarida domen tiplari bilan ishlang (92-dars).

## Xulosa

- Named type har doim boshqa tipdan farq qiladi; alias (`=`) esa yangi tip emas, ikkinchi nom.
- Assignability: identical tip, yoki underlying type bir xil va kamida bitta tip nomsiz, yoki interface implementatsiyasi, nil, representable untyped constant.
- Konversiya sonlar va stringlar uchun qiymatni o'zgartiradi: integer qirqiladi, float kasrni tashlaydi, `string(int)` code point beradi. Overflow bo'yicha signal yo'q, diapazonni o'zingiz tekshirasiz.
- Struct tag'lar konversiyada e'tiborga olinmaydi, identity va assignability'da hisobga olinadi.
- Slice -> array (Go 1.20) nusxalaydi va uzunlik kichik bo'lsa panic qiladi; slice -> array pointer (Go 1.17) aliasing beradi.
- Defined type underlying type'ning metodlarini meros qilmaydi; domen ID'lari va birliklar uchun defined type'dan foydalaning, chegarada konversiyani bir joyda to'plang.
