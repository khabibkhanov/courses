---
n: 83
slug: fuzzing-property
title: "Fuzzing va property testlar"
summary: "Go fuzzing mexanizmi: f.Add seed'lar, f.Fuzz, corpus va testdata/fuzz, yiqilgan kirishning regressiya testiga aylanishi, xossa (property) formulalari va qat'iy seed bilan oddiy property test."
duration: 40
sources:
  - id: fuzzing
    note: "Go Fuzzing hujjati: fuzz test yozish, -fuzz va -fuzztime bayroqlari, corpus va testdata/fuzz katalogi, qo'llab-quvvatlanadigan tiplar"
  - id: pkg-testing
    note: "testing.F tipi: Add, Fuzz, ruxsat etilgan argument tiplari, cheklovlar (F metodlarini fuzz funksiyasi ichida chaqirmaslik, argument xotirasini saqlamaslik va o'zgartirmaslik)"
  - id: 100go
    note: "Testing bandlari (100go.co ro'yxati bo'yicha tekshirilgan): #82 testlarni kategoriyalash, #84 test rejimlari, #90 testing imkoniyatlarini to'liq o'rganmaslik"
quiz:
  - q: "`FuzzDecode` testi mavjud, `testdata/fuzz/FuzzDecode/` ichida yiqilgan kirish saqlangan. Dasturchi `go test ./...` (hech qanday -fuzz bayrog'isiz) ishga tushirdi. Nima bo'ladi?"
    options:
      - "Fuzz testlar umuman ishga tushmaydi, faqat -fuzz bilan"
      - "Seed corpus (f.Add) va testdata/fuzz ichidagi fayllar oddiy unit test kabi bir marta ishga tushiriladi"
      - "Fuzz test yangi kirishlarni cheksiz qidiradi"
      - "Faqat f.Add qiymatlari ishlaydi, testdata fayllari e'tiborsiz"
    answer: 1
    explain: "Bayroqsiz `go test` fuzz funksiyasini seed corpus bo'yicha (f.Add va testdata/fuzz/<Nom>/ fayllari) deterministik ishga tushiradi. Shu sababli topilgan buzuq kirish git'ga qo'shilsa, u regressiya testiga aylanadi va CI'da avtomatik tekshiriladi."
  - q: "Fuzz funksiyasi `func(t *testing.T, data []byte)` ichida `f.Log(\"...\")` chaqirdingiz. Nima bo'ladi?"
    options:
      - "Log fuzz ishlayotgan paytda chiqmaydi, lekin xatosiz ishlaydi"
      - "Hujjatga ko'ra faqat f.Fatal taqiqlangan, f.Log ruxsat etilgan"
      - "Ruxsat etilmagan: fuzz funksiyasi ichida *F metodlarini (Log, Error, Skip) emas, mos *T metodlarini chaqirish kerak"
      - "Log har bir kirish uchun faylga yoziladi"
    answer: 2
    explain: "testing.F.Fuzz hujjati aniq aytadi: ff ichida *F metodlari (masalan Log, Error, Skip) chaqirilmaydi, faqat Failed va Name ruxsat. Ichkarida t (*testing.T) parametri bilan ishlang."
  - q: "Quyidagilardan qaysi biri fuzz argumenti sifatida to'g'ridan-to'g'ri ishlatilishi MUMKIN EMAS?"
    options:
      - "map[string]int"
      - "string"
      - "[]byte"
      - "float64"
    answer: 0
    explain: "Ruxsat etilgan tiplar: []byte, string, bool, byte, rune, float32/64, int va uint oilalari. map, struct, slice of struct kabi tiplar to'g'ridan-to'g'ri berilmaydi: baytlardan o'zingiz tuzasiz (masalan, ma'lumotni parse qilib)."
  - q: "Binar kodek uchun eng kuchli, kam harakatli xossa qaysi?"
    options:
      - "Kodning qamrovi 100% bo'ladi"
      - "Encode natijasi doim 1 bayt uzunlikda bo'ladi"
      - "Decode faqat o'zi yaratgan kirishlar bilan ishlaydi"
      - "Decode har qanday kirishda panic bermaydi va Decode(Encode(p)) asl paketni qaytaradi"
    answer: 3
    explain: "Fuzzing 'oracle' (kutilgan javob) talab qilmaydi: xossa kirishdan mustaqil bo'lishi kerak. 'Panic bermaslik' va 'round-trip' aynan shunday. Encode natijasining uzunligi payloadga bog'liq, va Decode faqat o'zi yaratgan kirishlar bilan emas, begona (buzuq) kirishlar bilan ham ishlashi shart: fuzzing aynan shuni sinaydi."
  - q: "Package'da ikkita fuzz test bor: FuzzDecode va FuzzEncode. `go test -fuzz Fuzz` nima qiladi?"
    options:
      - "Ikkalasini ketma-ket fuzz qiladi"
      - "Xato bilan to'xtaydi: -fuzz bitta fuzz testga mos kelishi kerak"
      - "Faqat birinchisini (alifbo bo'yicha) fuzz qiladi"
      - "Ikkalasini parallel fuzz qiladi"
    answer: 1
    explain: "Tekshirdik: `testing: will not fuzz, -fuzz matches more than one fuzz test`. Regex'ni aniqlashtiring (`-fuzz '^FuzzDecode$'`). Shu sababli CI'da har fuzz testni alohida chaqirasiz."
  - q: "Property testda `rng := rand.New(rand.NewPCG(1, 2))` qat'iy seed bilan yaratilgan. Bu qaror nega mantiqli?"
    options:
      - "Qat'iy seed testni tezlashtiradi"
      - "Seed qat'iy bo'lsa test hamma kirishlarni qamrab oladi"
      - "Seed qat'iy bo'lsa test yiqilganda aynan shu kirish ketma-ketligini takrorlash mumkin; yiqilish flaky bo'lmaydi"
      - "Qat'iy seed race detector uchun shart"
    answer: 2
    explain: "Tasodifiy testning asosiy xavfi: yiqilganda uni qayta ko'ra olmaslik. Qat'iy seed va xabarda iteratsiya raqami yiqilishni takrorlanadigan qiladi. Ammo qamrov chegaralangan; yangi kirishlarni kashf etish uchun fuzz engine (coverage-guided) kerak."
task:
  title: "Koordinata parser'i uchun fuzz test yozing"
  prompt: |
    `ParseCoord` "41.31,69.27" ko'rinishidagi qatordan kenglik va uzunlikni oladi. Mavjud unit test o'tadi, lekin funksiya yaroqsiz kirishlarga chidamsiz.

    Vazifa: faylni `coord_test.go` deb saqlang. `FuzzParseCoord` yozing: seed sifatida oddiy qator, vergulsiz qator ("41.31") va "NaN,0" bering. Xossa: xato qaytmasa, kenglik [-90, 90], uzunlik [-180, 180] oralig'ida bo'lishi kerak (NaN bu oraliqda emas). Testni ishga tushirib, topilgan muammolarni `ParseCoord`da tuzating.
  lang: go
  starter: |
    package coord

    import (
        "errors"
        "strconv"
        "strings"
        "testing"
    )

    // ParseCoord "41.31,69.27" ko'rinishidagi qatordan kenglik va uzunlikni oladi.
    func ParseCoord(s string) (lat, lon float64, err error) {
        parts := strings.Split(s, ",")
        lat, err = strconv.ParseFloat(strings.TrimSpace(parts[0]), 64)
        if err != nil {
            return 0, 0, err
        }
        lon, err = strconv.ParseFloat(strings.TrimSpace(parts[1]), 64)
        if err != nil {
            return 0, 0, err
        }
        if lat < -90 || lat > 90 || lon < -180 || lon > 180 {
            return 0, 0, errors.New("coord: diapazondan tashqari")
        }
        return lat, lon, nil
    }

    func TestParseCoord(t *testing.T) {
        lat, lon, err := ParseCoord("41.31, 69.27")
        if err != nil || lat != 41.31 || lon != 69.27 {
            t.Fatalf("ParseCoord = %v, %v, %v", lat, lon, err)
        }
        if _, _, err := ParseCoord("200,10"); err == nil {
            t.Fatal("diapazondan tashqari qiymat uchun xato kutilgan")
        }
    }
  solution: |
    package coord

    import (
        "errors"
        "math"
        "strconv"
        "strings"
        "testing"
    )

    // ParseCoord "41.31,69.27" ko'rinishidagi qatordan kenglik va uzunlikni oladi.
    func ParseCoord(s string) (lat, lon float64, err error) {
        latStr, lonStr, ok := strings.Cut(s, ",")
        if !ok {
            return 0, 0, errors.New("coord: vergul yo'q")
        }
        lat, err = strconv.ParseFloat(strings.TrimSpace(latStr), 64)
        if err != nil {
            return 0, 0, err
        }
        lon, err = strconv.ParseFloat(strings.TrimSpace(lonStr), 64)
        if err != nil {
            return 0, 0, err
        }
        if math.IsNaN(lat) || math.IsNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180 {
            return 0, 0, errors.New("coord: diapazondan tashqari")
        }
        return lat, lon, nil
    }

    func TestParseCoord(t *testing.T) {
        lat, lon, err := ParseCoord("41.31, 69.27")
        if err != nil || lat != 41.31 || lon != 69.27 {
            t.Fatalf("ParseCoord = %v, %v, %v", lat, lon, err)
        }
        if _, _, err := ParseCoord("200,10"); err == nil {
            t.Fatal("diapazondan tashqari qiymat uchun xato kutilgan")
        }
    }

    func FuzzParseCoord(f *testing.F) {
        f.Add("41.31,69.27")
        f.Add("41.31")
        f.Add("NaN,0")
        f.Fuzz(func(t *testing.T, s string) {
            lat, lon, err := ParseCoord(s)
            if err != nil {
                return
            }
            if !(lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
                t.Errorf("ParseCoord(%q) = %v, %v: diapazondan tashqari", s, lat, lon)
            }
        })
    }
  solutionNotes: |
    - `f.Add("41.31")` seed'i oddiy `go test` da ham `parts[1]` panic'ini ushlaydi: seed corpus unit test sifatida ishlaydi.
    - `strings.Cut` vergul yo'qligini `ok` bilan aniq bildiradi, indekslash yo'q.
    - `strconv.ParseFloat` "NaN" va "Inf" qabul qiladi. `lat < -90 || lat > 90` NaN uchun false, shuning uchun NaN diapazon tekshiruvidan o'tib ketardi. Xossada shart `!(lat >= -90 && lat <= 90 && ...)` shaklida yozilgan: NaN taqqoslashlari false, shuning uchun u buziladi va xato topiladi.
    - Tuzatish: `math.IsNaN` bilan aniq rad etish.
    - Fuzz'ni `go test -run xxx -fuzz '^FuzzParseCoord$' -fuzztime 10s` bilan ishga tushiring; yiqilgan kirish `testdata/fuzz/FuzzParseCoord/` ga yoziladi va git'ga qo'shilishi kerak.
  checklist:
    - "`FuzzParseCoord` uchta seed bilan yozilgan va `f.Fuzz` ichida faqat `t` metodlari ishlatilgan"
    - "Xossa NaN'ni ham tutadigan shaklda yozilgan (`!(x >= a && x <= b)`)"
    - "Oddiy `go test` starter funksiyasida vergulsiz seed bilan yiqiladi"
    - "`ParseCoord` vergulsiz qator va NaN uchun xato qaytaradi, panic bermaydi"
    - "`go vet` va `go test -race` o'tadi; 10 soniyalik fuzz yiqilishsiz tugaydi"
---

## Muammo

Unit testlarni biz yozamiz, shuning uchun ular biz o'ylagan kirishlarni tekshiradi. Production'ga esa biz o'ylamagan kirishlar keladi: qisqartirilgan paket, noldan boshlanuvchi uzunlik, juft surrogat belgisi, ichma-ich juda chuqur JSON. Parser, kodek va validator kabi kod tashqaridan kelgan baytlarni qabul qiladi, va aynan shu joyda `index out of range`, cheksiz sikl yoki xotira portlashi paydo bo'ladi. Telemetriya qabul qiluvchi servis uchun bitta buzuq paket butun process'ni panic bilan yiqitishi mumkin (agar panic ushlanmasa) yoki xavfsizlik teshigiga aylanishi mumkin.

Fuzzing bu muammoga boshqacha yondashadi: kirishlarni inson emas, dastur avtomatik hosil qiladi va kod qamrovi (coverage) bo'yicha yo'naltiriladi. Go 1.18 dan fuzzing standart `go test` ning bir qismi. Bu dars fuzz test tuzilishini, corpus ishini, yaxshi xossa (property) qanday ko'rinishini va qachon oddiy tasodifiy property test yetarli ekanini ko'rsatadi. Natijalar haqiqiy: kodni sinab, topilgan xatoni o'zimiz ko'rdik.

## Asosiy g'oya

### Fuzz test tuzilishi

Fuzz test `func FuzzXxx(f *testing.F)` imzosiga ega. Ikki qismdan iborat:

- `f.Add(args...)` seed corpus'ni to'ldiradi: bular ma'lum yaxshi (va ma'lum yomon) kirishlar. Argumentlar `f.Fuzz` funksiyasining parametrlariga tip bo'yicha mos kelishi kerak.
- `f.Fuzz(func(t *testing.T, a T1, b T2) {...})` har kirish uchun chaqiriladigan funksiyani beradi. Unda parse qilasiz, natijani tekshirasiz va xossa buzilsa `t.Errorf`/`t.Fatalf` chaqirasiz.

Hujjat bo'yicha fuzz argumentlari: `[]byte`, `string`, `bool`, `byte`, `rune`, `float32`, `float64` va `int`, `uint` oilalari. Struct yoki map to'g'ridan-to'g'ri berilmaydi: baytlardan o'zingiz tuzasiz. `f.Fuzz` ichida `*F` metodlarini (Log, Error, Skip) chaqirish ruxsat etilmaydi, faqat `t` ning metodlari.

### Ikki rejim

- `go test` (bayroqsiz): fuzz funksiyasi faqat seed corpus bo'yicha, ya'ni `f.Add` qiymatlari va `testdata/fuzz/<FuzzNom>/` ichidagi fayllar bo'yicha bir martadan ishlaydi. Bu oddiy unit test.
- `go test -fuzz '^FuzzNom$' -fuzztime 30s`: engine mutatsiya qilib yangi kirishlar hosil qiladi, kodning yangi qismlarini ochgan kirishlarni (coverage ortishi) saqlab qoladi. Birinchi yiqilgan kirish `testdata/fuzz/<FuzzNom>/` ga fayl sifatida yoziladi.

Yiqilgan kirish fayli git'ga qo'shilsa, u regressiya testiga aylanadi: bug tuzatilmaguncha oddiy `go test` yiqiladi, tuzatilgandan keyin esa abadiy tekshiradi.

## Chuqurroq: yaxshi xossa va fuzz'ning chegaralari

### Oracle yo'q: xossa kerak

Fuzz engine kirish uchun "to'g'ri javob" ni bilmaydi. Shuning uchun test kirishdan mustaqil xossani tekshirishi kerak. Foydali xossalar:

- **Panic va osilib qolish yo'q.** Eng arzon xossa: funksiya chaqiriladi, natija e'tiborsiz. Engine panic va timeout'ni o'zi topadi.
- **Round-trip.** `Decode(Encode(x)) == x` yoki teskarisi, qaysi yo'nalish ma'noli bo'lsa.
- **Invariant.** Natija har doim diapazonda, tartiblangan, uzunligi cheklangan va h.k.
- **Ikki realizatsiya.** Sekin lekin ishonchli ma'lumotnoma realizatsiya bilan tez realizatsiyani solishtirish.
- **Idempotentlik.** `Normalize(Normalize(x)) == Normalize(x)`.

Zaif xossa ("xato bo'lmasa, OK") ham foydali, lekin kuchli xossalar ko'proq nuqsonni topadi.

### Kirish baytlarini saqlab qo'ymang

Hujjat: fuzz funksiyasi tez, deterministik va umumiy holatdan mustaqil bo'lishi kerak, argumentlar ostidagi xotira keyingi chaqiruvda o'zgartirilishi mumkin va funksiya argumentni o'zgartirmasligi kerak. Natijada `Decode` kirish baytlariga ishora qiluvchi `Payload` qaytarsa (bizning misolda shunday), uni fuzz funksiyasi ichida ishlatish xavfsiz, lekin tashqariga chiqarib saqlash xavfli. Production kodda ham bu savol muhim: dekoder kirish buferiga alias qilishi kerakmi yoki nusxa olishi kerakmi, shuni hujjatda yozing.

### Corpus fayl formati

Yiqilgan kirish matn fayli sifatida yoziladi: birinchi qatorda versiya sarlavhasi `go test fuzz v1`, keyin har argument uchun bitta qator Go literal shaklida (yuqoridagi misolda `[]byte("000")`). Fayl nomi xesh ko'rinishida: Go 1.24.7 da bizda 16 ta o'n oltilik raqam chiqdi, hujjatdagi misolda esa 64 belgili xesh ko'rsatilgan, ya'ni uzunlik versiyaga bog'liq va unga tayanmang. Shu formatda siz qo'lda ham seed fayl yozishingiz mumkin, masalan prod logidan olingan buzuq paketni qo'shish uchun. Bitta kirishni takrorlash uchun `go test -run=FuzzDecode/<fayl nomi>` buyrug'i yetadi: engine kerak emas, shuning uchun debugger bilan ham ishga tushirish oson.

### Cheklovlar

- `-fuzz` bir vaqtda faqat bitta fuzz testga mos kelishi kerak: bir nechta mos kelsa, `will not fuzz, -fuzz matches more than one fuzz test` xatosi chiqadi (tekshirdik). CI'da har testni `^FuzzNom$` bilan alohida chaqiring.
- Fuzzing deterministik emas: har ishga tushirish turli kirish topishi mumkin. Shuning uchun u CI'da "vaqt byudjeti" bilan (masalan, kechalari) ishga tushiriladi, PR'da esa faqat seed corpus.
- Engine yangi qiziqarli kirishlarni `GOCACHE` ichidagi fuzz katalogida saqlaydi (alohida, git'ga kirmaydigan joy); `go clean -fuzzcache` uni tozalaydi. Faqat yiqilgan kirishlar `testdata/fuzz` ga yoziladi.
- Fuzzing katta kirish maydonini qidiradi, lekin chuqur holatli mantiqni (masalan, uzoq ketma-ketlikdagi protokol holatlari) yaxshi qamramaydi. Bunda kirishni "amallar ro'yxati" ga aylantirib, baytlardan amallar ketma-ketligini tuzish kerak.

### Oddiy property test

Fuzz engine ishlatilmagan holda ham property test yozish mumkin: tasodifiy kirishlarni o'zingiz hosil qilasiz. Standart kutubxonadagi `testing/quick` muzlatilgan ("frozen and is not accepting new features"), shuning uchun yangi kodda `math/rand/v2` bilan qat'iy seed ishlatish oddiyroq: yiqilish takrorlanadi. Bu usul coverage'ga qaramaydi, lekin tez va deterministik, va fuzz bilan to'ldiriladi.

## Misol: telemetriya paketi kodeki

Format: 1 bayt versiya, 2 bayt payload uzunligi (big endian), payload. Birinchi variant (xato bilan):

```go
// Package packet - telemetriya paketining ikkilik kodeki.
// Format: 1 bayt versiya, 2 bayt payload uzunligi (big endian), payload.
package packet

import (
	"errors"
	"fmt"
)

// Packet - bitta telemetriya paketi.
type Packet struct {
	Version byte
	Payload []byte
}

// Xatolar.
var (
	ErrShort    = errors.New("packet: ma'lumot qisqa")
	ErrTooLarge = errors.New("packet: payload 65535 baytdan katta")
)

// Encode paketni baytlarga aylantiradi.
func Encode(p Packet) ([]byte, error) {
	if len(p.Payload) > 0xFFFF {
		return nil, fmt.Errorf("%w: %d bayt", ErrTooLarge, len(p.Payload))
	}
	n := len(p.Payload)
	out := make([]byte, 0, 3+n)
	out = append(out, p.Version, byte(n>>8), byte(n))
	return append(out, p.Payload...), nil
}

// Decode baytlardan paketni tiklaydi.
func Decode(b []byte) (Packet, error) {
	if len(b) < 3 {
		return Packet{}, ErrShort
	}
	n := int(b[1])<<8 | int(b[2])
	payload := b[3 : 3+n]
	return Packet{Version: b[0], Payload: payload}, nil
}
```

`Decode`da `len(b) < 3+n` tekshiruvi yo'q. Test fayli: oddiy testlar, fuzz test va ikki xossa (panic yo'q; muvaffaqiyatli `Decode` dan keyin qayta kodlash kirish prefiksi bo'ladi):

```go
package packet

import (
	"bytes"
	"errors"
	"testing"
)

func TestEncodeTooLarge(t *testing.T) {
	_, err := Encode(Packet{Payload: make([]byte, 0x10000)})
	if !errors.Is(err, ErrTooLarge) {
		t.Fatalf("Encode() xatosi = %v, kutilgan ErrTooLarge", err)
	}
}

func TestRoundTripExample(t *testing.T) {
	in := Packet{Version: 1, Payload: []byte("42.5")}
	b, err := Encode(in)
	if err != nil {
		t.Fatal(err)
	}
	out, err := Decode(b)
	if err != nil || out.Version != in.Version || !bytes.Equal(out.Payload, in.Payload) {
		t.Fatalf("Decode(Encode(%+v)) = %+v, %v", in, out, err)
	}
}

// FuzzDecode ikkita xossani tekshiradi:
//  1. Decode hech qachon panic bermaydi;
//  2. Decode muvaffaqiyatli bo'lsa, qayta kodlash asl prefiksni beradi.
func FuzzDecode(f *testing.F) {
	f.Add([]byte{1, 0, 4, '4', '2', '.', '5'})
	f.Add([]byte{})
	f.Fuzz(func(t *testing.T, data []byte) {
		p, err := Decode(data)
		if err != nil {
			return
		}
		again, err := Encode(p)
		if err != nil {
			t.Fatalf("Encode(Decode(%x)) xatosi: %v", data, err)
		}
		if !bytes.HasPrefix(data, again) {
			t.Errorf("qayta kodlash prefiks emas: data=%x again=%x", data, again)
		}
	})
}
```

`go test -run xxx -fuzz FuzzDecode -fuzztime 10s` natijasi (Go 1.24.7, linux/amd64; stack trace qisqartirildi, fayl yo'li `...` bilan almashtirildi):

```text
fuzz: elapsed: 0s, gathering baseline coverage: 0/2 completed
fuzz: elapsed: 0s, gathering baseline coverage: 2/2 completed, now fuzzing with 2 workers
fuzz: minimizing 46-byte failing input file
fuzz: elapsed: 0s, minimizing
--- FAIL: FuzzDecode (0.02s)
    --- FAIL: FuzzDecode (0.00s)
        testing.go:1693: panic: runtime error: slice bounds out of range [:12339] with capacity 8
            ... (stack trace qisqartirildi)
            lesson83/packet.Decode(...)
            	.../packet/packet.go:39
    Failing input written to testdata/fuzz/FuzzDecode/c2501043394e49f2
    To re-run:
    go test -run=FuzzDecode/c2501043394e49f2
FAIL
exit status 1
FAIL	lesson83/packet	0.019s
```

Engine 46 baytlik kirishni topib, uni uch baytgacha qisqartirdi (minimization). Fayl mazmuni:

```text
go test fuzz v1
[]byte("000")
```

`"000"` ning baytlari `0x30 0x30 0x30`: uzunlik `0x3030 = 12336` deb o'qiladi, haqiqiy payload esa yo'q. Endi bayroqsiz `go test` ni ishga tushiramiz (tuzatishdan oldin). Fayl avtomatik regressiya testiga aylangan:

```text
--- FAIL: FuzzDecode (0.00s)
    --- FAIL: FuzzDecode/c2501043394e49f2 (0.00s)
panic: runtime error: slice bounds out of range [:12339] with capacity 8 [recovered]
	panic: runtime error: slice bounds out of range [:12339] with capacity 8
FAIL	lesson83/packet	0.011s
FAIL
```

Tuzatish: payload uzunligini tekshirish.

```go
// Package packet - telemetriya paketining ikkilik kodeki.
// Format: 1 bayt versiya, 2 bayt payload uzunligi (big endian), payload.
package packet

import (
	"errors"
	"fmt"
)

// Packet - bitta telemetriya paketi.
type Packet struct {
	Version byte
	Payload []byte
}

// Xatolar.
var (
	ErrShort    = errors.New("packet: ma'lumot qisqa")
	ErrTooLarge = errors.New("packet: payload 65535 baytdan katta")
)

// Encode paketni baytlarga aylantiradi.
func Encode(p Packet) ([]byte, error) {
	if len(p.Payload) > 0xFFFF {
		return nil, fmt.Errorf("%w: %d bayt", ErrTooLarge, len(p.Payload))
	}
	n := len(p.Payload)
	out := make([]byte, 0, 3+n)
	out = append(out, p.Version, byte(n>>8), byte(n))
	return append(out, p.Payload...), nil
}

// Decode baytlardan paketni tiklaydi.
func Decode(b []byte) (Packet, error) {
	if len(b) < 3 {
		return Packet{}, ErrShort
	}
	n := int(b[1])<<8 | int(b[2])
	if len(b) < 3+n {
		return Packet{}, fmt.Errorf("%w: kerak %d bayt, bor %d", ErrShort, 3+n, len(b))
	}
	payload := b[3 : 3+n]
	return Packet{Version: b[0], Payload: payload}, nil
}
```

Tuzatishdan keyin saqlangan kirish ham seed kabi o'tadi:

```text
=== RUN   FuzzDecode
=== RUN   FuzzDecode/seed#0
=== RUN   FuzzDecode/seed#1
=== RUN   FuzzDecode/c2501043394e49f2
--- PASS: FuzzDecode (0.00s)
    --- PASS: FuzzDecode/seed#0 (0.00s)
    --- PASS: FuzzDecode/seed#1 (0.00s)
    --- PASS: FuzzDecode/c2501043394e49f2 (0.00s)
PASS
ok  	lesson83/packet	0.003s
```

8 soniyalik yangi fuzz sessiyasi yiqilishsiz tugadi (soniyadagi chaqiruvlar soni mashinaga bog'liq va har ishga tushirishda farq qiladi):

```text
fuzz: elapsed: 6s, execs: 323165 (52904/sec), new interesting: 2 (total: 5)
fuzz: elapsed: 8s, execs: 385875 (30074/sec), new interesting: 2 (total: 5)
PASS
ok  	lesson83/packet	8.090s
```

Qarorlar: `Encode` 65535 baytdan katta payloadni xato bilan rad etadi (aks holda uzunlik 2 baytga sig'maydi va round-trip jimgina buziladi); bu holatni fuzz topishi qiyin (juda katta kirish), shuning uchun alohida unit testda. Qat'iy seed bilan property test:

```go
package packet

import (
	"bytes"
	"math/rand/v2"
	"testing"
)

// TestRoundTripProperty: har qanday to'g'ri paket uchun Decode(Encode(p)) == p.
// Seed qat'iy: yiqilish takrorlanadi; xabarda iteratsiya raqami bor.
func TestRoundTripProperty(t *testing.T) {
	rng := rand.New(rand.NewPCG(1, 2))
	for i := 0; i < 2000; i++ {
		payload := make([]byte, rng.IntN(300))
		for j := range payload {
			payload[j] = byte(rng.IntN(256))
		}
		in := Packet{Version: byte(rng.IntN(256)), Payload: payload}

		b, err := Encode(in)
		if err != nil {
			t.Fatalf("iteratsiya %d: Encode xatosi: %v", i, err)
		}
		out, err := Decode(b)
		if err != nil {
			t.Fatalf("iteratsiya %d: Decode xatosi: %v", i, err)
		}
		if out.Version != in.Version || !bytes.Equal(out.Payload, in.Payload) {
			t.Fatalf("iteratsiya %d: Decode(Encode(p)) = %+v, kutilgan %+v", i, out, in)
		}
	}
}
```

```text
=== RUN   TestRoundTripProperty
--- PASS: TestRoundTripProperty (0.02s)
PASS
ok  	lesson83/packet	1.035s
```

### Ikkinchi misol: UTF-8 va bayt bo'yicha kesish

Binary protokoldan tashqari, matn bilan ishlaydigan kod ham fuzz uchun yaxshi nishon. Jadval ustuni 8 baytga sig'sin deb qurilma yorlig'ini kesadigan funksiya:

```go
package label

// Truncate qurilma yorlig'ini ko'pi bilan n bayt qiladi (jadval ustuni uchun).
func Truncate(s string, n int) string {
	if len(s) <= n {
		return s
	}
	return s[:n]
}
```

Xossa ikkita: natija `n` baytdan oshmaydi, va kirish yaroqli UTF-8 bo'lsa, natija ham yaroqli UTF-8. Argumentlar: `string` va `int`; kerak bo'lmagan kirishlar (`n < 0`, yaroqsiz kirish) `t.Skip()` bilan o'tkazib yuboriladi:

```go
package label

import (
	"testing"
	"unicode/utf8"
)

func FuzzTruncate(f *testing.F) {
	f.Add("T-104", 8)
	f.Add("", 0)
	f.Fuzz(func(t *testing.T, s string, n int) {
		if n < 0 || !utf8.ValidString(s) {
			t.Skip()
		}
		out := Truncate(s, n)
		if len(out) > n {
			t.Errorf("uzunlik %d > %d", len(out), n)
		}
		if !utf8.ValidString(out) {
			t.Errorf("yaroqsiz UTF-8: %q (kirish %q, n=%d)", out, s, n)
		}
	})
}
```

`go test -run xxx -fuzz FuzzTruncate -fuzztime 10s` (Go 1.24.7, linux/amd64) bir soniya ichida topdi:

```text
fuzz: elapsed: 0s, gathering baseline coverage: 2/2 completed, now fuzzing with 2 workers
fuzz: elapsed: 1s, execs: 29733 (31079/sec), new interesting: 19 (total: 21)
--- FAIL: FuzzTruncate (0.96s)
    --- FAIL: FuzzTruncate (0.00s)
        label_test.go:20: yaroqsiz UTF-8: "\xf3\xb8" (kirish "\U000f83cd", n=2)
    Failing input written to testdata/fuzz/FuzzTruncate/d3991743958ab635
    To re-run:
    go test -run=FuzzTruncate/d3991743958ab635
```

To'rt baytli bitta belgi ikki baytda kesildi. Corpus fayli:

```text
go test fuzz v1
string("\U000f83cd")
int(2)
```

Bu xato qo'lda yozilgan testlarda deyarli uchramaydi: dasturchi `"T-104"` kabi ASCII yorliq yozadi, kirill yoki emoji yozmaydi, ammo kirishni mijoz yuboradi. Tuzatish: kesish nuqtasini belgi chegarasiga qaytarish.

```go
package label

import "unicode/utf8"

// Truncate qurilma yorlig'ini ko'pi bilan n bayt qiladi (jadval ustuni uchun)
// va belgini o'rtasidan kesmaydi.
func Truncate(s string, n int) string {
	if len(s) <= n {
		return s
	}
	for n > 0 && !utf8.RuneStart(s[n]) {
		n--
	}
	return s[:n]
}
```

Tuzatishdan keyin saqlangan kirish seed kabi o'tadi, 8 soniyalik yangi fuzz sessiyasi yiqilishsiz tugadi (`PASS`). Bu yerda `n` indekslash xavfsizligi uchun `len(s) > n` shartiga tayanadi; `n == 0` holati ham `for` sharti bilan himoyalangan. `n < 0` da funksiya panic beradi (`s[:n]`); fuzz xossasi bunday kirishni `t.Skip()` bilan chiqarib tashlagani uchun uni ushlamaydi, shuning uchun chaqiruvchi `n >= 0` ni kafolatlashi kerak.

### Fuzz hujjatining qo'shimcha qoidalari

go.dev/doc/security/fuzz hujjatidan tekshirilgan tafsilotlar:

- `-fuzztime` default cheksiz: tushuntirmasangiz fuzz yiqilgan kirish topilguncha yoki to'xtatilguncha ishlaydi. CI'da doim `-fuzztime` bering.
- Yiqilgan kirishni engine qisqartiradi (minimization); `-fuzzminimizetime` default 60 soniya va `-fuzzminimizetime 0` bilan butunlay o'chiriladi. Sekin fuzz funksiyasida minimization CI vaqtini yeb qo'yishi mumkin.
- `-parallel` default `$GOMAXPROCS`: fuzz ishchilari soni. Konteynerda cheklangan CPU bilan bu raqam kutilganidan boshqacha bo'lishi mumkin.
- Coverage instrumentation hozircha faqat AMD64 va ARM64 da; hujjatga ko'ra boshqa platformada corpus mazmunli o'smaydi. Boshqa arxitekturada fuzz ishga tushirish kam foyda beradi.
- Har fuzz testda aynan bitta fuzz target (`f.Fuzz`) bo'lishi shart; seed corpus yozuvlari va `testdata/fuzz` fayllari tiplari fuzz argumentlari bilan bir xil va bir xil tartibda bo'lishi kerak. `f.Add` ga noto'g'ri sondagi qiymat berilsa, `go test` bu xatoni kompilyatsiya/vet bosqichida ushlaydi: `wrong number of values in call to (*testing.F).Add: 1, fuzz target expects 2` (sinaldi, Go 1.24.7; testlar umuman ishga tushmaydi).

## Qachon qo'llamaslik kerak

- Fuzzing tashqi dunyoga chiqadigan va kirishni parse qiladigan kod uchun (parser, kodek, validator). Sof biznes mantiq (narx hisoblash, holat mashinasi) uchun jadvalli test yaxshiroq: kirish maydoni tuzilmali, xossa topish qiyin.
- Test deterministik bo'lmasa (vaqt, tarmoq, fayl tizimi) fuzz funksiyasi sekin yoki flaky bo'ladi va engine samarasiz ishlaydi. Fuzz funksiyasi tez bo'lishi kerak.
- Xossa topa olmasangiz, fuzz faqat "panic yo'q" ni tekshiradi. Bu hali ham foydali, lekin mantiqiy xatolarni topmaydi.
- Uzoq fuzz sessiyalarini PR'ning majburiy qadamiga qo'ymang: natija vaqtga bog'liq va CI'ni sekinlashtiradi. Seed corpus'ni PR'da, vaqt cheklangan fuzz'ni rejali ishga tushirishda ishlating.
- Boshqa arxitektura yoki cheklangan CI mashinasi: coverage-yo'naltirilgan fuzz hozircha AMD64 va ARM64 uchun; CPU cheklangan konteynerda `-parallel` kamayadi va natija sekin keladi. Bunday joyda seed corpus va qat'iy seedli property test yetarli.
- Property test kirishni tasodifiy tanlaydi, lekin kod qamrovini hisobga olmaydi. U fuzz'ning o'rnini bosmaydi, faqat tezkor qo'shimcha.

## Stack'da: Node.js bilan farq

Node.js ekosistemasida property-based test uchun `fast-check` kabi tashqi kutubxona ishlatiladi, fuzzing uchun esa alohida vositalar (masalan, Jazzer.js). Go'da fuzzing tilning toolchain'iga kiritilgan: tashqi dependency yo'q, corpus oddiy fayllar, regressiya testi esa bepul. Bu qabul qiluvchi servislar (telemetriya paketlari, webhook tanasi, fayl yuklash) uchun juda qulay: har yangi parser uchun 10 qatorlik fuzz test yozing.

Jamoa ish tartibi sifatida: PR'da `go test ./...` fuzz seed'larini ishlatadi (bir necha millisekund), kechalari yoki hafta oxirida alohida job har fuzz testni `-fuzztime 5m` bilan ishga tushiradi, topilgan fayllar avtomatik issue yoki PR bo'lib keladi. Mahsulot jamoasi buni talab qiladigan joylar: tashqaridan kelgan har format uchun parser (qurilma protokoli, webhook tanasi, import qilinadigan CSV). Ichki, ishonchli kirishlar uchun esa 81-darsdagi jadvalli testlar yetarli.

Telemetriya paketlari kabi baytlar bilan ishlaydigan joylarda default xossa to'plami: panic yo'q, round-trip, uzunlik chegarasi. JSON bilan ishlaganda kirish string bo'lgani uchun fuzz argumentini `string` yoki `[]byte` qilib, ichida `json.Unmarshal` qilasiz, keyin xossani tekshirasiz.

## Xulosa

- Fuzz test `FuzzXxx(f *testing.F)`: `f.Add` bilan seed, `f.Fuzz` ichida `t` bilan xossa. Argument tiplari cheklangan ([]byte, string, raqamlar).
- Bayroqsiz `go test` seed corpus va `testdata/fuzz` fayllarini oddiy test kabi ishga tushiradi; yiqilgan kirish faylini git'ga qo'shing.
- Fuzz oracle'siz ishlaydi: panic yo'q, round-trip, invariant, ikki realizatsiya, idempotentlik xossalarini yozing.
- `-fuzz` bitta testga mos kelishi kerak; fuzz sessiyasini vaqt byudjeti bilan alohida ishga tushiring, PR'da faqat seed.
- Qat'iy seedli oddiy property test tez va takrorlanadigan qo'shimcha, `testing/quick` esa muzlatilgan.
