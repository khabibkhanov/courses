---
n: 10
slug: package-va-init
title: "Package, ko'rinish, init tartibi va blank identifier"
summary: "Package va modul chegaralari, eksport qoidasi va internal katalog, o'zgaruvchi hamda init funksiyalarining aniq ishga tushish tartibi, init'ning yon ta'sirlari va blank identifier'ning to'rt vazifasi."
duration: 40
sources:
  - id: go-spec
    note: "Exported identifiers, Blank identifier, Package initialization, Program initialization, Import declarations va An example package bo'limlari"
  - id: gopl
    note: "Kitobning package va import boblari (umumiy tayanch; aniq qoidalar spetsifikatsiya va go buyrug'idan olingan)"
  - id: code-review-comments
    note: "Imports va Package Names bo'limlari (blank import faqat main yoki testlarda, nomlash qoidalari)"
quiz:
  - q: "Paketda ikki fayl: a_first.go va telemetry.go, ikkalasida init() bor. Qaysi biri avval ishlaydi?"
    options:
      - "Spetsifikatsiya tartibni kafolatlamaydi, tasodifiy"
      - "telemetry.go, chunki u asosiy fayl"
      - "Ikkala init bir vaqtda goroutine'larda"
      - "a_first.go: go buyrug'i fayllarni nom tartibida beradi, init'lar manbada uchrash tartibida chaqiriladi"
    answer: 3
    explain: "Spetsifikatsiya: init funksiyalari kompilyatorga berilgan tartibda chaqiriladi va build tizimlariga fayllarni leksik nom tartibida berish tavsiya etiladi. Standart go buyrug'i shunday qiladi. Shu sababli fayl nomiga tayanish mo'rt: fayl qayta nomlansa tartib o'zgaradi."
  - q: "var total = base + extra; var base = load(\"base\"); var extra = load(\"extra\") bir faylda shu tartibda. Qaysi tartibda baholanadi?"
    options:
      - "total, base, extra"
      - "base, extra, total: bog'liqliklar tayyor bo'lganda baholanadi"
      - "extra, base, total"
      - "Kompilyatsiya xatosi: oldindan foydalanish"
    answer: 1
    explain: "Paket darajasidagi o'zgaruvchi bog'liqliklari tayyor bo'lgan eng birinchi e'lon qilinganini tanlab, qadamma-qadam initsializatsiya qilinadi. total base va extra'ga bog'liq, shuning uchun ular avval baholanadi (base, keyin extra). Funksiya ichidagi tartib bundan farq qiladi."
  - q: "var defaultEnc = registry[\"json\"] va init() ichida registry[\"json\"] = ... bo'lsa, defaultEnc qiymati?"
    options:
      - "Doim nol qiymat: barcha paket o'zgaruvchilari init'dan oldin baholanadi"
      - "init natijasi, chunki init oldin ishlaydi"
      - "Tasodifiy"
      - "Kompilyatsiya xatosi"
    answer: 0
    explain: "Spetsifikatsiya: avval paketning barcha paket-darajali o'zgaruvchilari initsializatsiya qilinadi, so'ng init funksiyalari chaqiriladi. defaultEnc init'dan oldin baholanib, bo'sh map'dan nol qiymat (interface uchun nil) oladi."
  - q: "import _ \"example.com/l10/a/driver/mem\" nima qiladi?"
    options:
      - "Paketni import qilmaydi, faqat tekshiradi"
      - "Paketning eksport qilingan nomlarini hozirgi fayl scope'iga ochadi"
      - "Paketni dasturga bog'laydi va uning o'zgaruvchi hamda init'larini bajaradi, nomlarga murojaat qilmaydi"
      - "Paketdan faqat o'zgaruvchilarni oladi, init'ni emas"
    answer: 2
    explain: "Blank import paketni faqat yon ta'sir (initsializatsiya) uchun import qiladi. Misol: ro'yxatga olish init() da bo'ladigan driver paketlari. Nom yaratmaydi, shu sababli 'imported and not used' xatosi ham bo'lmaydi."
  - q: "example.com/ext moduli example.com/l10/a/internal/cfg paketini import qilsa nima bo'ladi?"
    options:
      - "Ishlaydi, chunki paket eksport qilingan nomlarga ega"
      - "Faqat go vet ogohlantiradi"
      - "Faqat run-time xato"
      - "go buyrug'i qurish bosqichida xato beradi: use of internal package ... not allowed"
    answer: 3
    explain: "internal katalogi go buyrug'ining qoidasi, til spetsifikatsiyasida emas: internal'ning ota katalogi daraxti tashqarisidan import qilish taqiqlangan. Biz buni sandbox'da ikkinchi modul bilan sinadik."
  - q: "var _ Sensor = (*Fuel)(nil) satrining vazifasi?"
    options:
      - "Run-time'da Fuel ni Sensor'ga aylantiradi"
      - "Kompilyatsiya vaqtida *Fuel Sensor'ni qondirishini tekshiradi va hech narsa ajratmaydi"
      - "Global nil pointer yaratadi"
      - "Fuel metodlarini Sensor'ga qo'shadi"
    answer: 1
    explain: "Blank o'zgaruvchiga tayinlash bog'lanish yaratmaydi, lekin tayinlash qoidalari tekshiriladi. Metod imzosi o'zgarsa, xato paketning o'zida kompilyatsiya vaqtida chiqadi, interface ishlatilgan joyda emas."
task:
  title: "Registry init tartibi: nil encoder"
  prompt: |
    Servis `Encoder`larni nom bo'yicha saqlaydi. Hozir dastur `defaultEncoder.Encode(p)` da nil pointer dereference bilan yiqiladi. Sabab: `defaultEncoder` paket o'zgaruvchisi `init()` dan oldin baholanadi va bo'sh map'dan nil oladi.

    1. Registry'ni `init()` o'rniga o'zgaruvchi initsializatori bilan to'ldiring (bog'liqlik tahlili tartibni o'zi to'g'rilaydi).
    2. `jsonEncoder` va `csvEncoder` `Encoder` interface'ini qondirishini kompilyatsiya vaqtida tekshiring (`var _ Encoder = ...`).
    3. `init()` ni olib tashlang.

    Kutilgan chiqish: `41.31,69.24` va `{"lat":41.31,"lon":69.24}`.
  lang: go
  starter: |
    package main

    import "fmt"

    type Point struct{ Lat, Lon float64 }

    type Encoder interface{ Encode(p Point) string }

    type jsonEncoder struct{}
    type csvEncoder struct{}

    func (jsonEncoder) Encode(p Point) string {
        return fmt.Sprintf(`{"lat":%.2f,"lon":%.2f}`, p.Lat, p.Lon)
    }

    func (csvEncoder) Encode(p Point) string { return fmt.Sprintf("%.2f,%.2f", p.Lat, p.Lon) }

    var registry = map[string]Encoder{}

    var defaultEncoder = registry["json"]

    func init() {
        registry["json"] = jsonEncoder{}
        registry["csv"] = csvEncoder{}
    }

    func main() {
        p := Point{41.31, 69.24}
        fmt.Println(registry["csv"].Encode(p))
        fmt.Println(defaultEncoder.Encode(p))
    }
  solution: |
    package main

    import "fmt"

    type Point struct{ Lat, Lon float64 }

    type Encoder interface{ Encode(p Point) string }

    type jsonEncoder struct{}
    type csvEncoder struct{}

    var (
        _ Encoder = jsonEncoder{}
        _ Encoder = csvEncoder{}
    )

    func (jsonEncoder) Encode(p Point) string {
        return fmt.Sprintf(`{"lat":%.2f,"lon":%.2f}`, p.Lat, p.Lon)
    }

    func (csvEncoder) Encode(p Point) string { return fmt.Sprintf("%.2f,%.2f", p.Lat, p.Lon) }

    var registry = map[string]Encoder{
        "json": jsonEncoder{},
        "csv":  csvEncoder{},
    }

    var defaultEncoder = registry["json"]

    func main() {
        p := Point{41.31, 69.24}
        fmt.Println(registry["csv"].Encode(p))
        fmt.Println(defaultEncoder.Encode(p))
    }
  solutionNotes: |
    - Paket o'zgaruvchilari barcha `init()` lardan oldin initsializatsiya qilinadi. `defaultEncoder = registry["json"]` init'dan oldin baholanganida map bo'sh edi.
    - Registry'ni literal bilan e'lon qilsangiz, `defaultEncoder` unga bog'liq bo'lib, bog'liqlik tahlili ularni to'g'ri tartibda baholaydi. Init'ga bog'liq tartib mo'rt va faylga qarab o'zgarishi mumkin.
    - `var _ Encoder = jsonEncoder{}` hech narsa ajratmaydi, lekin imzo buzilsa kompilyatsiya xato beradi.
    - `init()` ni faqat haqiqiy yon ta'sir (driver ro'yxatga olish) uchun qoldiring; bu yerda u keraksiz.
  checklist:
    - "Dastur panic bermaydi va ikkala qatorni chiqaradi"
    - "`init()` funksiyasi yo'q"
    - "`jsonEncoder` va `csvEncoder` uchun `var _ Encoder = ...` bor"
    - "`defaultEncoder` registry'ga bog'liq bo'lgani uchun avtomatik to'g'ri tartibda baholanadi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Go'da paket - kompilyatsiya, ko'rinish va nomlash birligi. Production'da bu mavzu ikki joyda og'riq beradi. Birinchisi, `init()` funksiyalari: ular ko'rinmas yon ta'sir qiladi (driver ro'yxatga olish, flag'lar, global holat), tartibi esa ko'pchilik o'ylagandan nozikroq. Loyiha o'sib, fayl qayta nomlansa yoki yangi import qo'shilsa, bir kun global o'zgaruvchi `nil` bo'lib qoladi. Ikkinchisi, ko'rinish: eksport qilingan nom API bo'lib qoladi, uni keyin olib tashlab bo'lmaydi (1-dars, Go 1 compatibility).

Node.js'da modul bir marta, birinchi `require` da baholanadi, tartibi import grafidan keladi. Go'da ham shunday, lekin qoidalar aniqroq va tilning o'zida yozilgan. Bu darsda spetsifikatsiya qoidalarini ishlaydigan paketlar bilan sinab ko'ramiz.

## Asosiy g'oya

### Paket, modul va eksport

Har fayl `package name` bilan boshlanadi; bir katalogdagi fayllar bitta paket. Modul (`go.mod`, 2-dars) paketlar to'plami. Eksport qoidasi spetsifikatsiyada: identifikator eksport qilinadi, agar uning birinchi harfi Unicode bosh harf (Lu kategoriyasi) bo'lsa va u paket blokida e'lon qilingan yoki maydon yoki metod nomi bo'lsa. Qolganlari paketga yopiq. Bu yagona mexanizm: `public`/`private` kalit so'zi yo'q.

Eksport qilinmagan nomga paket tashqarisidan murojaat qilish kompilyatsiya xatosi: `name secret not exported by package telemetry`.

`internal` katalogi go buyrug'ining qoidasi, til spetsifikatsiyasida emas: `a/internal/cfg` paketini faqat `a` ning daraxti ichidagi kod import qila oladi. Boshqa modul urinsa, `use of internal package ... not allowed`. Bu eksport qilingan, lekin ommaviy API bo'lmasligi kerak bo'lgan kod uchun to'g'ri vosita.

### Initsializatsiya tartibi

Spetsifikatsiya bosqichma-bosqich tartibni belgilaydi.

1. **Paket ichida o'zgaruvchilar**: har qadamda "tayyor" o'zgaruvchilardan e'lon tartibida eng birinchisi baholanadi. O'zgaruvchi tayyor, agar initsializatori hali baholanmagan o'zgaruvchilarga bog'liq bo'lmasa. Bog'liqlik leksik tahlil bilan topiladi: funksiya tanasidagi murojaatlar ham hisobga olinadi. Tugamagan o'zgaruvchilar qolsa, bu initsializatsiya sikli va dastur noto'g'ri (kompilyatsiya xatosi).
2. **Barcha o'zgaruvchilardan keyin** `init` funksiyalari manbada uchrash tartibida chaqiriladi. Paketda ularning soni cheksiz, hatto bitta faylda ham bir nechta bo'lishi mumkin. `init` e'lon qilinmaydi, unga murojaat qilib bo'lmaydi.
3. **Paketlar orasida**: import qilingan paketlar avval initsializatsiya qilinadi. Bog'liq bo'lmagan paketlar orasidagi tartib Go 1.21 dan aniq: paketlar import yo'li bo'yicha saralanadi, har qadamda ro'yxatdagi birinchi, barcha importlari tayyor paket initsializatsiya qilinadi. Go 1.21 gacha bu tartib spetsifikatsiyada aniq emas edi.

Hammasi bitta goroutine'da, ketma-ket. `init` goroutine ishga tushirishi mumkin, lekin keyingi init'ga o'tishdan oldin oldingisi qaytishi shart.

Ko'p fayl bo'lsa, o'zgaruvchi e'lon tartibi va init tartibi fayllarning kompilyatorga berilish tartibiga bog'liq. Spetsifikatsiya build tizimlariga fayllarni leksik nom tartibida berishni tavsiya qiladi, `go` buyrug'i shunday qiladi.

## Chuqurroq: init'ning yon ta'sirlari

### Blank identifier: to'rt vazifa

Blank identifier `_` bog'lanish yaratmaydi. Undan foydalaniladi:

- **Qiymatni e'tiborsiz qoldirish**: `v, _ := f.Read()`. Xatoni qasddan tashlayotganingiz kodda ko'rinadi.
- **"Declared and not used" ni yopish**: `_ = unused` (vaqtincha, debug uchun).
- **Compile-time interface tekshiruvi**: `var _ Sensor = (*Fuel)(nil)`. Metod imzosi o'zgarsa, xato tipning o'z paketida chiqadi.
- **Blank import**: `import _ "lib/math"`. Paket faqat initsializatsiya uchun bog'lanadi, yon ta'sirlari (`init`) bajariladi, nomlari kiritilmaydi.

Blank import `database/sql`, tasvir formatlari va shunga o'xshash "plugin" modelida keng tarqalgan: driver paketi `init()` da o'zini markaziy registry'ga yozadi, asosiy dastur esa `_` bilan import qiladi. Code Review Comments blank import'ni faqat `main` paketi yoki testlarda ishlatishni tavsiya qiladi: kutubxona uchun bu yashirin bog'liqlik.

### Nega init'dan qochish kerak

`init` ni chaqirib ham, tekshirib ham bo'lmaydi: test uchun uni aylanib o'tish yo'q. Global holatni yashirincha o'zgartiradi, xatoni qaytara olmaydi (faqat panic yoki `log.Fatal`), tartibi esa fayl nomlari va import grafiga bog'liq. Alternativa: aniq konstruktor (`NewRegistry()`), `main` ichida chaqiriladigan `Register()`, yoki paket o'zgaruvchisini initsializator bilan e'lon qilish (bog'liqlik tahlili tartibni o'zi hal qiladi).

`init` o'rinli holatlar: driver/format registry'si (yuqoridagi `database/sql` modeli) va hisoblanishi kerak bo'lgan, boshqacha ifodalab bo'lmaydigan paket holati.

## Misol: init tartibi va ko'rinish

Quyidagi dastur uch paketdan iborat: `telemetry` (uch faylda to'rtta `init`), `driver/mem` (blank import) va `main`.

### 1. telemetry paketi

```go
package telemetry

import "fmt"

var Version = initVersion()

func initVersion() string {
	fmt.Println("telemetry: var Version")
	return "v1"
}

func init() { fmt.Println("telemetry: init (telemetry.go)") }

// secret eksport qilinmagan: paket tashqarisidan ko'rinmaydi.
var secret = "x"

func Reveal() int { return len(secret) }
```

`a_first.go` va `b_extra.go` fayllarida yana uchta `init` bor (`b_extra.go` da ikkitasi).

### 2. main va natija

```go
package main

import (
	"fmt"

	"example.com/l10/a/driver"
	_ "example.com/l10/a/driver/mem"
	"example.com/l10/a/internal/cfg"
	"example.com/l10/a/telemetry"
)

var (
	total = base + extra
	base  = load("base", 10)
	extra = load("extra", 5)
)

func load(name string, v int) int {
	fmt.Println("main: var", name)
	return v
}

func init() { fmt.Println("main: init") }

func main() {
	fmt.Println("main: main", total, telemetry.Version, telemetry.Reveal(), cfg.Region)
	s, ok := driver.Open("mem")
	fmt.Println(s.Name(), ok)
}
```

```text
mem: init
driver.Register: mem
telemetry: var Version
telemetry: init (a_first.go)
telemetry: init (b_extra.go)
telemetry: ikkinchi init (b_extra.go)
telemetry: init (telemetry.go)
main: var base
main: var extra
main: init
main: main 15 v1 1 uz
mem true
```

Natijani o'qing. `mem` va `driver.Register` `telemetry` dan oldin chiqdi: paketlar import yo'li bo'yicha saralangan (`.../driver`, `.../driver/mem`, `.../internal/cfg`, `.../telemetry`), `main` oxirida. `telemetry` ichida avval o'zgaruvchi (`var Version`), so'ng init'lar: `a_first.go`, `b_extra.go` (ikkalasi, manbada uchrash tartibida), `telemetry.go`. Ya'ni fayl nom tartibida. `main` paketida `total` e'lon tartibida birinchi, lekin `base` va `extra` ga bog'liq, shuning uchun avval `base`, `extra`, so'ng `total`. `driver.Open("mem")` blank import tufayli ro'yxatdan o'tgan driver'ni topdi, `main` esa `mem` paketining nomini hech qayerda ishlatmadi.

Sandbox: Go 1.24.7, linux/amd64.

### 3. Ko'rinish xatolari

Eksport qilinmagan nom va `init` ga murojaat:

```text
name secret not exported by package telemetry
undefined: telemetry.init
```

Bog'liqlik sikli (`var a = b + 1; var b = f(); func f() int { return a }`):

```text
initialization cycle for a
	a refers to b
	b refers to f
	f refers to a
```

Boshqa modul `internal` paketni import qilsa (`replace` bilan lokal modul):

```text
use of internal package example.com/l10/a/internal/cfg not allowed
```

### 4. Blank identifier amalda

```go
package main

import (
	"fmt"
	"strconv"
)

type Sensor interface{ Read() (float64, error) }

type Fuel struct{ raw string }

func (f *Fuel) Read() (float64, error) { return strconv.ParseFloat(f.raw, 64) }

// Kompilyatsiya vaqtidagi tekshiruv: *Fuel Sensor'ni qondirishi shart.
var _ Sensor = (*Fuel)(nil)

func main() {
	f := &Fuel{raw: "41.5"}
	v, _ := f.Read() // xatoni ataylab e'tiborsiz qoldirish
	fmt.Println(v)

	_, err := (&Fuel{raw: "x"}).Read()
	fmt.Println(err)

	var unused int
	_ = unused // "declared and not used" xatosini yopadi

	for range 2 {
		fmt.Print(".")
	}
	fmt.Println()
}
```

```text
41.5
strconv.ParseFloat: parsing "x": invalid syntax
..
```

`var _ Sensor = (*Fuel)(nil)` hech narsa ajratmadi, lekin tekshirildi. Agar `Read` imzosi o'zgarsa (`Read() float64`), kompilyator shu satrda to'xtaydi:

```text
cannot use (*Fuel)(nil) (value of type *Fuel) as Sensor value in variable declaration: *Fuel does not implement Sensor (wrong type for method Read)
		have Read() float64
		want Read() (float64, error)
```

## Qachon qo'llamaslik kerak

- `init()` ni oddiy sozlash uchun ishlatmang. Konfiguratsiya o'qish, tarmoqqa chiqish yoki fayl ochish `init` ichida xatoni qaytara olmaydi va testni sekinlashtiradi. `main` da aniq chaqiring.
- Kutubxona paketida blank import orqali yon ta'sirni yashirmang. Foydalanuvchi bog'liqlikni ko'rmaydi. `main` ichida aniq `_` import qiling.
- Init tartibiga fayl nomi orqali tayanmang. `a_first.go` qayta nomlansa, tartib o'zgaradi. Bog'liqlik kerak bo'lsa, uni o'zgaruvchi bog'liqligi yoki funksiya argumenti sifatida ifodalang.
- Hamma narsani eksport qilmang. Har eksport qilingan nom keyinchalik API sifatida qoladi. Dastlab yopiq qiling, `internal` bilan chegaralang.
- Paket nomini `util`, `common`, `helpers` deb qo'ymang: Code Review Comments qisqa, mazmunli, kichik harfli nomlarni tavsiya qiladi. Nom import qiluvchi kodda `package.Name` ko'rinishida o'qiladi.
- Global o'zgaruvchilarga tayanmang. Concurrent kodda ular data race manbai, testda esa holatni tozalash qiyin (47-dars).

## Stack'da: Node.js/TypeScript bilan solishtirish

- Node.js moduli birinchi `require` da baholanadi va keshlanadi; yon ta'sir shu paytda. Go'da paket bir marta initsializatsiya qilinadi, lekin tartib dastur ishga tushishida aniq, bog'liqlik grafidan keladi, kod ichidagi chaqiruvlar tartibidan emas.
- ES `export`/`import` o'rniga Go'da bosh harf. TypeScript'dagi `private` metod kompilyatsiyadan keyin yo'qoladi; Go'da kichik harf paket chegarasi.
- `import _ "pkg"` Node.js'dagi `import "side-effect"` (nomsiz import) ga o'xshaydi: faqat yon ta'sir uchun.
- `internal/` Node.js'da `package.json` `exports` maydoniga yaqin: ichki fayllarni tashqaridan yashirish. Go'da bu `go` buyrug'ining qoidasi.
- TypeScript'da sikl import jim ishlaydi (`undefined` qiymat). Go'da import sikli kompilyatsiya xatosi, o'zgaruvchi sikli ham.

## Xulosa

- Eksport qoidasi yagona: bosh harf va paket bloki yoki maydon/metod; `internal` esa go buyrug'i qoidasi.
- Paket ichida avval barcha o'zgaruvchilar (bog'liqlik tartibida), keyin `init` funksiyalari manbada uchrash tartibida; fayllar odatda nom tartibida beriladi.
- Paketlar: import qilinganlar avval, mustaqillari Go 1.21 dan import yo'li bo'yicha saralangan tartibda, hammasi bitta goroutine'da.
- Bir paketda bir nechta `init` bo'lishi mumkin, unga murojaat qilib bo'lmaydi; undan faqat zarur yon ta'sirlar uchun foydalaning.
- Blank identifier: qiymatni tashlash, "not used" ni yopish, `var _ I = (*T)(nil)` compile-time tekshiruvi va yon ta'sirli blank import.
- Init tartibiga bog'liq kod mo'rt: o'zgaruvchi initsializatori yoki aniq konstruktorni afzal ko'ring.
