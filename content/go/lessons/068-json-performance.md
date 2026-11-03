---
n: 68
slug: json-performance
title: "JSON: encoding/json tuzoqlari va json/v2"
summary: "encoding/json'ning amaliy tuzoqlari (map[string]any da aniqlik yo'qolishi, UseNumber, RawMessage, omitempty va omitzero, noma'lum maydonlar), Decoder bilan oqimli o'qish, o'lchangan alloc'lar va Go 1.25 dagi tajribaviy hamda Go 1.27 dagi json/v2."
duration: 40
sources:
  - id: pkg-json-v2
    note: "encoding/json/v2 paketi: Marshal, Unmarshal, MarshalWrite, UnmarshalRead va variadic Options; jsontext bilan birga"
  - id: go127
    note: "Go 1.27 release notes, encoding/json/v2 va jsontext bo'limi: v1 endi v2 implementatsiyasiga tayanadi, GOEXPERIMENT=nojsonv2, qattiqroq standart qiymatlar"
  - id: go125
    note: "Go 1.25 release notes: GOEXPERIMENT=jsonv2 tajribaviy implementatsiyasi, dekodlash sezilarli tezroq, kodlash teng"
  - id: 100go
    note: "JSON bilan ishlashdagi odatiy xatolar ro'yxatdagi xatolardan biri sifatida"
quiz:
  - q: "`{\"id\":9007199254740993}` ni `map[string]any` ga `json.Unmarshal` bilan o'qidingiz va `m[\"id\"]` ni chop etdingiz. Nima chiqadi?"
    options:
      - "9007199254740993, tip int64"
      - "\"9007199254740993\", tip string"
      - "9.007199254740992e+15, tip float64: oxirgi raqam yo'qoladi"
      - "9007199254740993, tip json.Number"
    answer: 2
    explain: "any ga o'qilganda JSON raqami float64 bo'ladi, 2^53 dan katta butun sonlar aniq ifodalanmaydi. Tipli struct maydoni (int64) yoki Decoder.UseNumber aniqlikni saqlaydi. json.Number faqat UseNumber yoqilgan bo'lsa chiqadi."
  - q: "Diskdagi 2 GB hajmli JSON massivni elementma-element qayta ishlash kerak. Qaysi yondashuv xotirani cheklaydi?"
    options:
      - "json.NewDecoder(r), `[` tokenini o'qish, `dec.More()` shartida har elementni `dec.Decode(&p)` bilan o'qish"
      - "os.ReadFile, keyin json.Unmarshal butun massivga"
      - "io.ReadAll, keyin json.Valid, keyin Unmarshal"
      - "Decoder'ga UseNumber o'rnatish"
    answer: 0
    explain: "Decoder oqimdan o'qiydi va bir vaqtda bitta element xotirada turadi. ReadFile, ReadAll va Unmarshal butun hujjatni xotiraga oladi (o'lchov: 10 ming elementda 2.4 MB ga qarshi 162 KB). UseNumber xotira hajmiga ta'sir qilmaydi."
  - q: "`type Envelope struct { Type string; Payload json.RawMessage }` ning vazifasi nima?"
    options:
      - "Payload maydonini JSON'ga chiqarishda yashiradi"
      - "Payload'dagi barcha raqamlarni json.Number qiladi"
      - "Payload'ni avtomatik map[string]any ga aylantiradi"
      - "Payload baytlari dekodlanmay saqlanadi; Type bo'yicha qaror qilib, keyin kerakli tipga alohida Unmarshal qilinadi"
    answer: 3
    explain: "RawMessage JSON bo'lagini xom bayt ko'rinishida ushlab turadi. Shu bilan tur (type) maydoniga qarab keyingi dekodlash tanlanadi va payload ikki marta o'tilmaydi. Yashirish uchun `json:\"-\"`, raqamlar uchun UseNumber ishlatiladi."
  - q: "Shu mashinada (Go 1.24.7, amd64) bitta kichik hujjat uchun DecodeStruct 280 B/6 alloc, DecodeMap 728 B/26 alloc berdi. Eng to'g'ri xulosa?"
    options:
      - "map har doim 3 baravar sekin, shuning uchun hech qachon ishlatilmaydi"
      - "Bu hujjat va sharoitda map yo'li ko'proq alloc qildi va sekinroq bo'ldi; boshqa shakldagi hujjat yoki ish yuklamasi uchun qayta o'lchash kerak, ammo tip noma'lum bo'lgandagina map mantiqli"
      - "Alloc soni ns/op ga ta'sir qilmaydi"
      - "Struct tezroq, chunki reflection ishlatmaydi"
    answer: 1
    explain: "Struct ham reflection ishlatadi (encoding/json har ikkala holatda). Farq map'ning har kalit va qiymat uchun alohida alloc qilishidan. Raqam bitta o'lchovdan chiqqan, shuning uchun mutlaq qoida emas; asosiy sabab: tipni oldindan bilsangiz struct ham aniq, ham arzon."
  - q: "10 ming elementli massivni `Unmarshal` va `Decoder` (Token/More/Decode) bilan o'qidik. Vaqt deyarli bir xil (medianlar 13.5 va 12.5 ms), xotira 2.4 MB va 162 KB. To'g'ri xulosa?"
    options:
      - "Decoder tezroq, shuning uchun har joyda ishlating"
      - "Unmarshal kam alloc qiladi"
      - "Oqimli o'qishning foydasi bu yuklamada vaqtda emas, cho'qqi xotirada; vaqt bo'yicha farq o'lchov shovqini ichida"
      - "Decoder faqat fayllar uchun ishlaydi"
    answer: 2
    explain: "Alloc soni ikkala holatda 10 mingdan oshadi, ya'ni asosiy ish element dekodlashda. Decoder esa butun massiv va uning []Point'ini bir vaqtda ushlamaydi. Median farqi shovqin oralig'idan katta emas edi, shuning uchun 'tezroq' demaymiz."
  - q: "`type Event struct { At time.Time `json:\"at,omitempty\"` }` ning nol qiymati JSON'ga chiqarilganda `at` maydoni qanday bo'ladi (Go 1.24)?"
    options:
      - "Maydon umuman chiqmaydi, `omitzero` kerak emas"
      - "At maydoni null bo'ladi"
      - "Marshal xato qaytaradi"
      - "Maydon `\"0001-01-01T00:00:00Z\"` bo'lib chiqadi: omitempty struct uchun ishlamaydi, `omitzero` teglanishi kerak"
    answer: 3
    explain: "omitempty struct qiymatlarini hech qachon bo'sh deb hisoblamaydi, time.Time esa struct. Go 1.24 dagi `omitzero` nol qiymatni (yoki IsZero() metodi true qaytarishini) tekshiradi. Shu mashinada ikkala variantni ishga tushirib ko'rdik."
task:
  title: "Tipli, qat'iy JSON dekoder"
  prompt: |
    `parsePoint` hozir JSON'ni `map[string]any` orqali o'qiydi. Ikki muammo bor: `id` 2^53 dan katta bo'lsa `float64` orqali aniqligini yo'qotadi, va noma'lum maydonlar (`alt`) jimgina o'tib ketadi.

    `Point` struct'iga JSON teglarini qo'shing va `parsePoint` ni `json.Decoder` bilan qayta yozing: `DisallowUnknownFields` yoqilgan bo'lsin, `id` `int64` sifatida aniq saqlansin, qiymatdan keyin ortiqcha ma'lumot bo'lsa xato qaytarilsin. Xatolar `point:` prefiksi bilan o'ralsin. `main` o'zgarmasin.
  lang: go
  starter: |
    package main

    import (
        "encoding/json"
        "fmt"
    )

    // Point - telemetriya nuqtasi.
    type Point struct {
        ID    int64
        Dev   string
        Lat   float64
        Lon   float64
        Speed float64
    }

    // parsePoint JSON'ni map[string]any orqali o'qiydi.
    // Muammo: katta id float64 ga aylanib aniqligini yo'qotadi,
    // noma'lum maydonlar jimgina o'tib ketadi.
    func parsePoint(data []byte) (Point, error) {
        var m map[string]any
        if err := json.Unmarshal(data, &m); err != nil {
            return Point{}, err
        }
        return Point{
            ID:    int64(m["id"].(float64)),
            Dev:   m["dev"].(string),
            Lat:   m["lat"].(float64),
            Lon:   m["lon"].(float64),
            Speed: m["speed"].(float64),
        }, nil
    }

    func main() {
        inputs := []string{
            `{"id":9007199254740993,"dev":"dev-00417","lat":41.31,"lon":69.24,"speed":62.5}`,
            `{"id":7,"dev":"dev-00418","lat":41.3,"lon":69.2,"speed":10,"alt":410}`,
            `{"id":8,"dev":"dev-00419","lat":41.3,"lon":69.2,"speed":10} {"id":9}`,
        }
        for _, in := range inputs {
            p, err := parsePoint([]byte(in))
            fmt.Printf("%+v err=%v\n", p, err)
        }
    }
  solution: |
    package main

    import (
        "bytes"
        "encoding/json"
        "errors"
        "fmt"
        "io"
    )

    // Point - telemetriya nuqtasi.
    type Point struct {
        ID    int64   `json:"id"`
        Dev   string  `json:"dev"`
        Lat   float64 `json:"lat"`
        Lon   float64 `json:"lon"`
        Speed float64 `json:"speed"`
    }

    // parsePoint JSON'ni tipli struct'ga o'qiydi: int64 id aniq saqlanadi,
    // noma'lum maydon va ortiqcha ma'lumot xato bo'ladi.
    func parsePoint(data []byte) (Point, error) {
        dec := json.NewDecoder(bytes.NewReader(data))
        dec.DisallowUnknownFields()
        var p Point
        if err := dec.Decode(&p); err != nil {
            return Point{}, fmt.Errorf("point: %w", err)
        }
        if _, err := dec.Token(); !errors.Is(err, io.EOF) {
            return Point{}, errors.New("point: qiymatdan keyin ortiqcha ma'lumot")
        }
        return p, nil
    }

    func main() {
        inputs := []string{
            `{"id":9007199254740993,"dev":"dev-00417","lat":41.31,"lon":69.24,"speed":62.5}`,
            `{"id":7,"dev":"dev-00418","lat":41.3,"lon":69.2,"speed":10,"alt":410}`,
            `{"id":8,"dev":"dev-00419","lat":41.3,"lon":69.2,"speed":10} {"id":9}`,
        }
        for _, in := range inputs {
            p, err := parsePoint([]byte(in))
            fmt.Printf("%+v err=%v\n", p, err)
        }
    }
  solutionNotes: |
    - Struct teglari tipni oldindan beradi: `id` to'g'ridan-to'g'ri `int64` ga o'qiladi, `float64` oralig'i yo'q, shuning uchun 9007199254740993 o'zgarmaydi.
    - `Decoder.DisallowUnknownFields` noma'lum maydonda `json: unknown field "alt"` xatosini beradi. Bu kontraktni qat'iy tutadi, lekin yangi maydon qo'shgan jo'natuvchi sizni sindiradi: tashqi tomon uchun ehtiyotkor bo'ling.
    - `json.Unmarshal` qiymatdan keyingi ortiqcha matnni o'zi rad etadi, `Decoder.Decode` esa rad etmaydi. Shuning uchun `dec.Token()` io.EOF qaytarishini tekshirdik.
    - Shu mashinada (Go 1.24.7) tekshirildi: boshlang'ich kod birinchi kirishda id'ni 9007199254740992 qilib chiqardi, yechim 9007199254740993 ni saqlab, ikkinchi va uchinchi kirishni xato bilan rad etdi.
  checklist:
    - "`id` 9007199254740993 bo'lganda aniq saqlanadi"
    - "Noma'lum maydon (`alt`) xato beradi"
    - "Qiymatdan keyingi ortiqcha ma'lumot xato beradi"
    - "Xatolar `point:` prefiksi bilan o'ralgan (`%w`)"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

JSON telemetriya servisining kirish va chiqish formati: qurilmalar nuqta yuboradi, API javob qaytaradi, navbatga xabar tushadi. Shuning uchun `encoding/json` odatda profilda ham, xatolar ro'yxatida ham tez-tez uchraydigan paket bo'lib chiqadi. Bu yerda ikki xil og'riq bor va ularni aralashtirmaslik kerak.

Birinchisi - to'g'rilik. Node.js'dan kelgan dasturchi uchun `JSON.parse` har narsani qaytaradi va raqam doim `number`. Go'da esa "tipsiz" dekodlash (`map[string]any`) JSON raqamini `float64` qiladi. `float64` 2^53 dan katta butun sonlarni aniq saqlay olmaydi, ya'ni 64 bitli ID, to'lov raqami yoki vaqt tamg'asi nanosekundlarda jimgina buziladi. Xato yo'q, panic yo'q, faqat bitta raqam boshqa. Bu eng yomon turdagi xato: u production'da oylar o'tib, ikki tizim ma'lumotlari mos kelmay qolganda topiladi. Xuddi shu darajada `omitempty` `time.Time` uchun ishlamaydi, noma'lum maydonlar jimgina tashlab yuboriladi, katta-kichik harf farqi esa e'tiborsiz qoladi.

Ikkinchisi - narx. JSON dekodlash reflection va ko'p kichik alloc'lar bilan ishlaydi. Bir nuqtani dekodlash mikrosekundlarda o'lchanadi, lekin servis sekundiga o'n minglab xabar qabul qilsa, bu CPU'ning katta qismi va GC bosimi bo'ladi. 65-darsda alloc'larni umumiy usullar bilan kamaytirishni ko'rdik; bu darsda aynan JSON uchun nima o'lchanadi va nima o'zgartiriladi.

Uchinchi yo'nalish - kelajak. Go 1.25 da tajribaviy `encoding/json/v2` paydo bo'ldi, Go 1.27 da esa `encoding/json` o'zi v2 implementatsiyasiga tayanadigan bo'ldi. Bu darsda u nimani o'zgartirishi va nimani o'zgartirmasligi ham aniq yoziladi, shu jumladan men lokal tekshira olmagan qismlar.

## Asosiy g'oya

Qoida oddiy: JSON'ning shaklini bilsangiz, uni Go tipida ifodalang. Tipli struct ikki ish bajaradi. U kontraktni kodda qayd etadi (maydon nomi, tipi, teg) va dekoderga qanday tipga o'qishni aytadi, shuning uchun `int64` maydon `float64` orqali o'tmaydi. `map[string]any` esa shakl oldindan noma'lum bo'lgan holat uchun: proksi, umumiy jurnal, ixtiyoriy metadata.

Shakl qisman noma'lum bo'lsa, ikki vosita bor. Birinchisi `json.RawMessage`: tashqi qobiq (masalan, `type` va `payload`) dekodlanadi, `payload` esa xom baytlar sifatida qoladi va `type` ga qarab keyin kerakli tipga o'qiladi. Ikkinchisi `Decoder.UseNumber`: `any` ichidagi raqamlar `json.Number` (aslida satr) bo'lib qoladi va siz o'zingiz `Int64()` yoki `Float64()` bilan aniq tip tanlaysiz.

Hajm katta bo'lsa, ikkinchi qoida: butun hujjatni xotiraga olmang. `json.NewDecoder(r)` oqimdan o'qiydi; massivni `Token`, `More` va `Decode` bilan element-element qayta ishlash mumkin. Bu tezlik haqida emas, cho'qqi xotira haqida, quyida o'lchovda ko'rinadi.

Uchinchi qoida - o'lchash. Qaysi usul "tezroq" ekani hujjat shakliga, hajmiga va ish yuklamasiga bog'liq. 61-darsdagi tartib bu yerda ham amal qiladi: benchmark, `-benchmem`, bir necha `-count`, pprof (62-63 darslar) va faqat shundan keyin o'zgartirish.

## Chuqurroq: tuzoqlar, oqim va v2

### Raqamlar: float64 va json.Number

`any` ga dekodlashda JSON raqami `float64` bo'ladi (yuqoridagi dasturda ko'rinadi). Shuning uchun `9007199254740993` (2^53 + 1) `9.007199254740992e+15` ga aylanadi. Bu `encoding/json` xatosi emas, IEEE 754 chegarasi. Uch yechim bor: tipli struct (`int64` maydon), `UseNumber` yoki ID'ni satr sifatida uzatish (JSON'da `"id":"9007199254740993"`). Oxirgisi tashqi API'lar uchun eng xavfsiz yo'l: JavaScript mijozi ham xuddi shu muammoga duch keladi, chunki `JSON.parse` ham raqamni `double` qiladi. Ya'ni muammo faqat Go tomonida emas, kontrakt darajasida.

### omitempty, omitzero va o'rnatilgan tiplar

`omitempty` nol uzunlikdagi slice, map, satr, `0`, `false`, `nil` ko'rsatkich va interface uchun maydonni tashlaydi. Struct qiymati esa hech qachon "bo'sh" hisoblanmaydi, shuning uchun `time.Time` bilan `omitempty` hech narsa qilmaydi. Go 1.24 dagi `omitzero` bu bo'shliqni yopadi: maydon nol qiymatda yoki tipning `IsZero() bool` metodi `true` qaytarganda tashlanadi. Pastdagi misolda ikkalasini ham ishga tushirib ko'rdim.

### Noma'lum maydonlar, katta-kichik harf, takroriy nomlar

v1 da `{"LAT":41.3}` `lat` teg'li maydonga tushadi: nomlarni moslashtirishda katta-kichik harf farqi inobatga olinmaydi. Noma'lum maydon (`alt`) jimgina tashlanadi. `Decoder.DisallowUnknownFields` buni xatoga aylantiradi, lekin bu ikki tomonlama qurol: jo'natuvchi yangi maydon qo'shsa, siz sinasiz. Ichki, versiyalanadigan kontraktlarda foydali; tashqi hamkor API'sida ko'pincha zararli. v1 yana yaroqsiz UTF-8 baytlarini jimgina almashtirish belgisiga (U+FFFD) aylantiradi va takroriy nomli obyektda oxirgisini oladi. Pastdagi misolda ikkalasi ham ko'rinadi.

### Alloc'lar va oqimli o'qish

`Unmarshal` kirishni to'liq bayt bo'lagi sifatida talab qiladi, shuning uchun hujjat xotirada turishi shart. `Decoder` esa `io.Reader` dan bo'lak-bo'lak o'qiydi. Massiv uchun naqsh: `Token` bilan `[` ni olish, `dec.More()` shartida `Decode`, oxirida `]` tokeni. Har iteratsiyada `p = Point{}` bilan qiymatni nollash kerak, aks holda oldingi elementdan maydonlar qolib ketadi (kirishda yo'q maydon yozilmaydi). Chiqish tomonida `json.Marshal` har chaqiruvda yangi `[]byte` qaytaradi; `json.NewEncoder(w).Encode(v)` esa to'g'ridan-to'g'ri `io.Writer` ga yozadi va oldindan tayyorlangan `bytes.Buffer` bilan qo'shimcha alloc'siz ishlaydi. Pastdagi jadvalda shu farq o'lchangan.

### json/v2: nimasi tasdiqlangan

Quyidagilar rasmiy release notes'dan o'qilgan. Go 1.25 da tajribaviy implementatsiya `GOEXPERIMENT=jsonv2` bilan yoqiladi; notes dekodlash sezilarli tezroq, kodlash esa teng deb yozadi (bu rasmiy bahosi, men o'lchamadim). Go 1.27 notes'ida: `encoding/json/v2` paketi `Marshal`, `MarshalWrite`, `MarshalEncode`, `Unmarshal`, `UnmarshalRead`, `UnmarshalDecode` funksiyalarini beradi, ularning hammasi o'zgaruvchan `Options` qabul qiladi; `encoding/json/jsontext` esa JSON sintaksisi darajasidagi `Encoder`/`Decoder`. v2 qattiqroq standartlarni tanlaydi: yaroqsiz UTF-8 va obyektdagi takroriy nomlarni rad etadi. `encoding/json` (v1) esa endi v2 implementatsiyasiga tayanadi, xatti-harakati saqlangan, faqat xato matnlari farq qilishi mumkin; muammo bo'lsa `GOEXPERIMENT=nojsonv2` bilan qaytish mumkin, bu yo'l kelajakda olib tashlanishi kutiladi. v1 API qo'llab-quvvatlanishda davom etadi va ko'chish majburiy emas.

Tajribaviy bosqichda v2 tegida o'zgarishlar bo'lgan: notes `format` va `unknown` teg opsiyalari hamda `DiscardUnknownMembers` olib tashlanganini, `inline` esa `embed` ga qayta nomlanganini yozadi. Amaliy xulosa: v2 yozilgan eski blog namunalariga ishonmang, joriy `pkg.go.dev` hujjatini o'qing. v1 va v2 o'rtasidagi qolgan barcha farqlar ro'yxati (masalan, nil slice qanday chiqishi) v1 `encoding/json` hujjatida; men u ro'yxatni bu darsda tekshirib chiqmadim, shuning uchun uni sanamayman.

## Misol: aniqlik, qobiq va o'lchov

Quyidagi dastur to'rt narsani ko'rsatadi: `map[string]any` aniqlikni yo'qotadi, tipli struct saqlaydi, `UseNumber` map ichida ham saqlaydi, `RawMessage` payload'ni keyinga qoldiradi. Go 1.24.7 da `go vet` va `go run` bilan ishga tushirilgan.

```go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
)

// Point - telemetriya nuqtasi.
type Point struct {
	ID    int64   `json:"id"`
	Dev   string  `json:"dev"`
	Lat   float64 `json:"lat"`
	Lon   float64 `json:"lon"`
	Speed float64 `json:"speed"`
}

// Envelope tashqi qobiqni o'qiydi, payload'ni keyinga qoldiradi.
type Envelope struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

var sample = []byte(`{"id":9007199254740993,"dev":"dev-00417","lat":41.311081,"lon":69.240562,"speed":62.5}`)

func main() {
	// 1. map[string]any: id float64 bo'ladi
	var m map[string]any
	_ = json.Unmarshal(sample, &m)
	fmt.Printf("map:       %v (%T)\n", m["id"], m["id"])

	// 2. tipli struct: id int64 aniq
	var p Point
	_ = json.Unmarshal(sample, &p)
	fmt.Printf("struct:    %d\n", p.ID)

	// 3. UseNumber: map ichida ham aniq
	dec := json.NewDecoder(bytes.NewReader(sample))
	dec.UseNumber()
	var m2 map[string]any
	_ = dec.Decode(&m2)
	n := m2["id"].(json.Number)
	id, _ := n.Int64()
	fmt.Printf("UseNumber: %v (%T), Int64=%d\n", n, n, id)

	// 4. RawMessage: payload hozircha dekodlanmaydi
	in := `{"type":"point","payload":` + string(sample) + `}`
	var env Envelope
	_ = json.Unmarshal([]byte(in), &env)
	fmt.Printf("RawMessage: type=%s, payload %d bayt\n", env.Type, len(env.Payload))
	if env.Type == "point" {
		var q Point
		_ = json.Unmarshal(env.Payload, &q)
		fmt.Printf("keyin dekod: %+v\n", q)
	}
}
```

```text
map:       9.007199254740992e+15 (float64)
struct:    9007199254740993
UseNumber: 9007199254740993 (json.Number), Int64=9007199254740993
RawMessage: type=point, payload 86 bayt
keyin dekod: {ID:9007199254740993 Dev:dev-00417 Lat:41.311081 Lon:69.240562 Speed:62.5}
```

Natija aniq: `map` yo'li ID'ni `...992` ga o'zgartirdi, qolgan uch yo'l `...993` ni saqladi. `RawMessage` dagi 86 bayt - payload'ning dekodlanmagan holati, ya'ni qobiq o'qilganda `Point` hali yaratilmagan.

Ikkinchi dastur v1 ning "jimgina" xatti-harakatlarini ko'rsatadi. U ham Go 1.24.7 da ishga tushirilgan; `Event.At` `omitempty`, `Event.Seen` `omitzero` bilan teglangan.

```text
omitempty/omitzero: {"dev":"dev-1","at":"0001-01-01T00:00:00Z"}
RawMessage: fuel 37.5 {"level":37.5}
v1 katta-kichik harf va noma'lum maydon: {41.3 69.2} <nil>
DisallowUnknownFields: json: unknown field "alt"
v1 nil slice: {"Tags":null}
v1 yaroqsiz UTF-8: <nil> "a�b"
v1 takroriy kalit: <nil> b
```

Bu chiqishda: `at` (omitempty) nol vaqt bilan chiqdi, `seen` (omitzero) tashlandi; `{"LAT":41.3,"lon":69.2,"alt":410}` xatosiz o'qildi (katta-kichik harf farqi yo'q, `alt` tashlandi); `DisallowUnknownFields` o'sha `alt` ni xatoga aylantirdi; nil slice `null` bo'lib chiqdi; yaroqsiz bayt `U+FFFD` ga almashtirildi; takroriy `dev` kalitida oxirgi qiymat (`b`) oldi. Bu faqat v1 ning kuzatilgan xatti-harakati; v2 uchun yuqorida aytilgan ikki farq (UTF-8 va takroriy nom) tasdiqlangan, qolganini men tekshirmadim.

### O'lchov

Quyidagi raqamlar mening o'lchovim: Go 1.24.7, `GOARCH=amd64`, Intel Xeon 2.10 GHz, 2 yadro, virtual mashina (shovqinli). `benchstat` o'rnatilmagan, shuning uchun har benchmark `-count=8` bilan yurgizildi va median keltirildi; B/op va allocs/op barqaror edi, ns/op esa o'zgarib turdi (masalan, `DecodeMap` 3163 dan 6173 ns gacha). Benchmark'lar `b.Loop` bilan yozilgan (61-dars). Hujjat: `{"id":...,"dev":"dev-00417","lat":...,"lon":...,"speed":62.5}`, 86 bayt.

| Benchmark | Median ns/op | B/op | allocs/op |
|---|---|---|---|
| DecodeStruct (bitta nuqta) | 1658 | 280 | 6 |
| DecodeMap (bitta nuqta) | 4000 | 728 | 26 |
| EncodeMarshal | 491 | 80 | 1 |
| EncodeTo (tayyor bytes.Buffer) | 381 | 0 | 0 |
| DecodeAll10k (Unmarshal) | 13.5 ms | 2486104 | 10025 |
| DecodeStream10k (Decoder) | 12.5 ms | 162552 | 10010 |

Nimani aytishga haqimiz bor. Bitta kichik hujjatda `map[string]any` yo'li struct yo'lidan 26 ga qarshi 6 alloc qildi va median bo'yicha sekinroq bo'ldi (2.4 baravar, lekin ns/op shovqinli). Chiqishda `Encoder` tayyor buffer bilan allocsiz ishladi, `Marshal` esa har chaqiruvda bitta 80 baytli bo'lak oldi. 10 ming elementli massivda esa vaqt bo'yicha farq shovqin ichida qoldi, ammo cho'qqi xotira 2.4 MB dan 162 KB ga tushdi: `Decoder` butun `[]Point` ni bir vaqtda ushlab turmadi. Ya'ni oqimli o'qishni "tezlik" uchun emas, xotira chegarasi uchun tanlang.

### Go 1.25+ kodi (kompilyatsiya qilinmagan)

Quyidagi parcha v2 API'sining shaklini ko'rsatadi. U lokal kompilyatsiya qilinmadi: sandbox'da Go 1.24.7, v2 esa Go 1.25 da `GOEXPERIMENT=jsonv2` kerak, Go 1.27 da barqaror paket. Funksiya nomlari va `jsontext.AllowInvalidUTF8` opsiyasi yuqorida keltirilgan manbalardan; shuning uchun chiqishni ko'rsatmayman.

```go
import (
	"encoding/json/jsontext"
	jsonv2 "encoding/json/v2"
)

// Standart xatti-harakat qattiqroq: yaroqsiz UTF-8 va takroriy nom xato beradi.
func decodeStrict(data []byte, p *Point) error {
	return jsonv2.Unmarshal(data, p)
}

// Eski, ruxsat beruvchi xatti-harakat kerak bo'lsa, opsiya bilan aytiladi.
func decodeLenient(data []byte, p *Point) error {
	return jsonv2.Unmarshal(data, p, jsontext.AllowInvalidUTF8(true))
}
```

## Qachon qo'llamaslik kerak

`DisallowUnknownFields` tashqi hamkor API'sida ko'pincha noto'g'ri: ular maydon qo'shsa, siz ishlamay qolasiz. Ichki xizmatlar orasida va konfiguratsiya fayllarida esa yozuv xatolarini ushlaydi, shuning uchun u yerda foydali.

`UseNumber` va `RawMessage` ortiqcha murakkablik, agar shakl ma'lum bo'lsa. Tipli struct oddiyroq va arzonroq; `any` va `Number` bilan zanjir yozish boshqa dasturchiga tushunish qiyin kod beradi.

Oqimli `Decoder` kichik hujjatlarda foyda bermaydi. Bir nuqtani dekodlash uchun `Unmarshal` yetadi va u oddiyroq. `Token`/`More` naqshi faqat massiv yoki NDJSON kabi katta kirishlarda ma'noli.

Qo'lda yozilgan yoki kod generatsiyali marshaller (uchinchi tomon kutubxonalari) tezroq bo'lishi mumkin, lekin ular qo'shimcha bog'liqlik, generatsiya bosqichi va qo'llab-quvvatlash qiymatini olib keladi. Men ularni bu yerda o'lchamadim, shuning uchun "tezroq" deb aytmayman. Avval profilda JSON haqiqatan ham eng issiq joy ekanini ko'ring (62-dars); ko'pincha muammo JSON'da emas, uni chaqiruvchi tsiklda bo'ladi.

v2 ga shoshilib ko'chmang. Go 1.25 da u tajribaviy edi, API tegi o'zgargan (yuqoridagi olib tashlashlar), Go 1.27 da v1 ning o'zi v2 yadrosiga o'tdi, lekin hujjat v1 ni qo'llab-quvvatlashda davom etishini va ko'chish majburiy emasligini aytadi. Servisingizda kontrakt va test bor bo'lsa, `GOEXPERIMENT` bilan sinab ko'rish arzon tajriba; testsiz bo'lsa avval test yozing.

## Stack'da: Node.js/TypeScript bilan solishtirish

NestJS'da `class-validator`/`class-transformer` yoki `zod` bilan JSON'ni DTO'ga aylantirasiz. Go'da struct teglari va `Decoder` shu rolni qisman bajaradi: tip va nomlar tekshiriladi, lekin qiymat qoidalari (`lat` -90 dan 90 gacha) uchun alohida `Validate()` metodi yozasiz. `JSON.parse` raqamlarni `number` (double) qiladi, shuning uchun 64 bitli ID'ni string sifatida uzatish Node.js bilan integratsiyada yagona xavfsiz yo'l; Go tomonida `int64` aniq, lekin kontrakt ikki tomonli. TypeScript'dagi `unknown` + type guard Go'dagi `any` + type assertion bilan o'xshash, ammo Go'da `m["id"].(float64)` noto'g'ri tipda panic beradi (starter koddagidek); `, ok` shaklini ishlating.

Payload turi maydoniga qarab dekodlash (diskriminant) TypeScript'da discriminated union bilan yoziladi; Go'da bu aynan `RawMessage` va `switch env.Type`. Express'dagi `body-parser` butun body'ni xotiraga oladi, Go'da esa `http.Request.Body` oqim va uni `json.NewDecoder(r.Body)` ga berish mumkin. Faqat `http.MaxBytesReader` bilan hajmni cheklashni unutmang, aks holda cheksiz kirish oqimi xotirani to'ldiradi.

## Xulosa

- `map[string]any` ga dekodlash JSON raqamini `float64` qiladi: 2^53 dan katta ID jimgina buziladi. Tipli struct (`int64`), `UseNumber` yoki satr ko'rinishidagi ID bilan himoyalaning.
- `RawMessage` payload'ni keyinga qoldiradi va tur maydoniga qarab dekodlash imkonini beradi; shakli ma'lum bo'lsa tipli struct yetarli.
- `omitempty` struct'ga (`time.Time`) ta'sir qilmaydi; Go 1.24 dagi `omitzero` shu holatni yopadi. v1 noma'lum maydon, katta-kichik harf farqi, yaroqsiz UTF-8 va takroriy nomni jimgina o'tkazadi; `DisallowUnknownFields` faqat birinchisini xatoga aylantiradi.
- Shu mashinada: bitta nuqta uchun struct 6 alloc, map 26 alloc; 10 ming elementda `Decoder` vaqtni emas, cho'qqi xotirani 2.4 MB dan 162 KB ga tushirdi. Raqamlar sizning hujjatingizda boshqacha bo'ladi, o'zingiz o'lchang.
- v2 (Go 1.25 da tajribaviy, Go 1.27 da v1 uning ustiga qurilgan) qattiqroq standartlar va `Options` beradi, lekin ko'chish majburiy emas va tajribaviy bosqich API'si o'zgargan; kodni lokal tekshirmasdan ishonmang.
- JSON'ni optimallashtirishdan oldin profil (62-63 darslar) uni haqiqatan issiq joy deb ko'rsatsin.
