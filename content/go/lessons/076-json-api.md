---
n: 76
slug: json-api
title: "JSON API: validatsiya, xatolar va versiyalash"
summary: "Kirishni qat'iy o'qish (hajm, noma'lum maydon, ortiqcha ma'lumot), yo'q qiymat va nol qiymatni ajratish, validatsiya xatolarini yig'ish, problem+json xato formati, API versiyalash va encoding/json v1 tuzoqlari bilan Go 1.27 dagi json/v2."
duration: 45
sources:
  - id: pkg-json-v2
    note: "Go 1.27: v2 ning standart xatti-harakatlari (noma'lum a'zolar default'da e'tiborsiz, katta-kichik harfga sezgir moslik, duplicate nomlar rad etiladi), RejectUnknownMembers, UnmarshalRead va FormatNilSliceAsNull"
  - id: 100go
    note: "\"JSON handling common mistakes\" (#77) xatolar guruhi"
  - id: pkg-net-http
    note: "MaxBytesReader va MaxBytesError, ResponseWriter bilan javob yozish tartibi"
quiz:
  - q: "`dec := json.NewDecoder(r.Body); dec.Decode(&in)` ga `{\"vehicle\":\"a\"} {\"vehicle\":\"b\"}` tanasi keldi. Decode nima qiladi va xavfsiz API uchun nima qo'shish kerak?"
    options:
      - "Ikkala obyektni ham o'qiydi va oxirgisini qoldiradi"
      - "Xato qaytaradi, chunki tana bitta JSON qiymat emas"
      - "Faqat birinchi qiymatni o'qiydi, ikkinchisi e'tiborsiz qoladi; Decode'dan keyin `dec.Token()` io.EOF qaytarishini tekshirish kerak"
      - "Birinchi qiymatni o'qiydi va ikkinchisini keyingi so'rovga qoldiradi"
    answer: 2
    explain: "Decoder oqimdan bitta qiymatni o'qiydi, qolgan baytlarga tegmaydi. Lokal sinovda shu holat uchun 'trailing-data' xatosi aynan shu tekshiruv bilan qaytarildi. Go 1.27 json/v2 da UnmarshalRead butun oqimni EOF gacha o'qib, ortiqcha baytlarni o'zi rad etadi."
  - q: "`type Reading struct { Fuel float64 `json:\"fuel\"` }` va tana `{}`. Kod `in.Fuel == 0` ni 'datchik 0 litr ko'rsatdi' deb talqin qiladi. Muammo?"
    options:
      - "Muammo yo'q: yo'q maydon xato beradi"
      - "Fuel `*float64` bo'lsa, `nil` (maydon kelmagan) va `0` (0 litr) ajratiladi; qiymat tipida bu ikkisi bir xil ko'rinadi"
      - "Faqat `omitempty` teg'i bu muammoni hal qiladi"
      - "Faqat `json.Number` ishlatilsa hal bo'ladi"
    answer: 1
    explain: "JSON'da yo'q maydon va 0 qiymat boshqa narsa, Go qiymat tipida esa ikkalasi zero value. Ajratish kerak bo'lsa pointer ishlatiladi (misoldagi Reading.Fuel). omitempty/omitzero faqat yozishga (marshaling) ta'sir qiladi."
  - q: "Go 1.24 da `Out{A time.Time `json:\"a,omitempty\"`; B time.Time `json:\"b,omitzero\"`; C []string `json:\"c\"`}` ning zero value'si marshal qilindi. Lokal natija?"
    options:
      - "`{\"a\":\"0001-01-01T00:00:00Z\",\"c\":null}`"
      - "`{}`"
      - "`{\"a\":\"0001-01-01T00:00:00Z\",\"b\":\"0001-01-01T00:00:00Z\",\"c\":[]}`"
      - "`{\"c\":[]}`"
    answer: 0
    explain: "omitempty struct qiymatini (time.Time) hech qachon 'bo'sh' deb hisoblamaydi, shuning uchun 'a' yoziladi. omitzero (Go 1.24) IsZero() true bo'lgan qiymatni tashlaydi, 'b' yo'q. Nil slice v1 da null bo'ladi (v2 da default [] ), 'c' teg'ida omitempty yo'q."
  - q: "Servis `strings.HasPrefix(err.Error(), \"json: unknown field\")` bilan noma'lum maydonni aniqlaydi. Go 1.27 release notes bunga nisbatan nima deydi?"
    options:
      - "encoding/json endi v2 implementatsiyasiga tayanadi; xatti-harakat saqlanadi, lekin xato xabarlarining aniq matni farq qilishi mumkin: matn bo'yicha tekshirish mo'rt"
      - "Xato xabarlari hech qachon o'zgarmaydi, chunki Go 1 compatibility ularni kafolatlaydi"
      - "encoding/json olib tashlandi"
      - "Noma'lum maydonlar endi doim rad etiladi"
    answer: 0
    explain: "Go 1.27 notes: encoding/json v2 asosida ishlaydi, xatti-harakat saqlanadi, lekin xato matni farq qilishi mumkin. Xato matni Go 1 compatibility kafolati doirasida emas, shuning uchun mantiqni undan qurmang. Typed xatolarga (SyntaxError, UnmarshalTypeError, MaxBytesError) tayaning, qolganini umumiy 400 deb qaytaring."
  - q: "Tana 2000 baytli, `http.MaxBytesReader(w, r.Body, 1<<10)` o'rnatilgan. Decode xatosi qaysi tipda va qaysi HTTP status mos?"
    options:
      - "`*json.SyntaxError`, 400"
      - "`*http.MaxBytesError`, 413"
      - "`io.EOF`, 400"
      - "`*json.UnmarshalTypeError`, 422"
    answer: 1
    explain: "MaxBytesReader limitdan oshganda *http.MaxBytesError qaytaradi va (iloji bo'lsa) ulanishni yopishni so'raydi. Decoder bu xatoni o'rab qaytaradi, shuning uchun errors.As kerak. 413 Content Too Large mos status."
  - q: "Eski mijozlar ishlayotgan API'ning javobiga yangi maydon `eta` qo'shmoqchisiz. Qaysi yondashuv eng xavfsiz?"
    options:
      - "Mavjud `distance` maydoni ma'nosini o'zgartirib, birligini kilometrdan metrga o'tkazish"
      - "Maydon nomini `distance`dan `dist` ga o'zgartirish"
      - "Yangi maydonni qo'shish (additive o'zgarish): eski mijozlar noma'lum maydonlarni e'tiborsiz qoldirishi kerak. Mavjud maydonni olib tashlash yoki ma'nosini o'zgartirish uchun yangi versiya (/v2) kerak"
      - "Barcha mijozlar bir kunda yangilanishini kutib, eski maydonni o'chirish"
    answer: 2
    explain: "Qo'shish orqaga mos o'zgarish. Nomni o'zgartirish, birlikni almashtirish yoki maydonni o'chirish eski mijozlarni buzadi va yangi versiyani talab qiladi. Server noma'lum kirish maydonlarini rad etishi mumkin, lekin mijozlar javobdagi noma'lum maydonlarni e'tiborsiz qoldirishi qoidasi API shartnomasining bir qismi bo'lishi kerak."
task:
  title: "Qat'iy decode: hajm, noma'lum maydon, ortiqcha ma'lumot"
  prompt: |
    `decode` funksiyasi so'rov tanasini `dst` ga o'qiydi, hozir esa faqat `json.NewDecoder(r.Body).Decode(dst)` chaqiradi. Natijada katta tana, noma'lum maydonlar va ikkita ketma-ket JSON qiymat jimgina qabul qilinadi.

    `decode` ni qat'iy qiling. U `(status int, err error)` qaytaradi: muvaffaqiyatda `0, nil`.
    - Tana 1 KiB dan katta bo'lsa: `413`;
    - noma'lum maydon bo'lsa: `400`;
    - JSON qiymatdan keyin ortiqcha ma'lumot bo'lsa: `400`;
    - bo'sh yoki buzuq tana: `400`.

    Kutilgan natija: "to'g'ri" holat `status=0 xato=false`, qolgan to'rt holat xato bilan (413 faqat "juda katta" uchun).
  lang: go
  starter: |
    package main

    import (
        "encoding/json"
        "fmt"
        "net/http"
        "net/http/httptest"
        "strings"
    )

    type Point struct {
        Vehicle string  `json:"vehicle"`
        Lat     float64 `json:"lat"`
        Lon     float64 `json:"lon"`
    }

    // decode so'rov tanasini dst ga o'qiydi. Xato bo'lsa HTTP status va error qaytaradi.
    func decode(w http.ResponseWriter, r *http.Request, dst any) (int, error) {
        if err := json.NewDecoder(r.Body).Decode(dst); err != nil {
            return http.StatusBadRequest, err
        }
        return 0, nil
    }

    func main() {
        cases := []struct{ name, body string }{
            {"to'g'ri", `{"vehicle":"truck-7","lat":41.31,"lon":69.28}`},
            {"noma'lum maydon", `{"vehicle":"truck-7","lat":41.31,"lon":69.28,"speed":80}`},
            {"ortiqcha ma'lumot", `{"vehicle":"truck-7"} {"vehicle":"truck-8"}`},
            {"juda katta", `{"vehicle":"` + strings.Repeat("x", 4096) + `"}`},
            {"bo'sh", ``},
        }
        for _, c := range cases {
            req := httptest.NewRequest("POST", "/points", strings.NewReader(c.body))
            var p Point
            status, err := decode(httptest.NewRecorder(), req, &p)
            fmt.Printf("%-18s status=%d xato=%v\n", c.name, status, err != nil)
        }
    }
  solution: |
    package main

    import (
        "encoding/json"
        "errors"
        "fmt"
        "io"
        "net/http"
        "net/http/httptest"
        "strings"
    )

    type Point struct {
        Vehicle string  `json:"vehicle"`
        Lat     float64 `json:"lat"`
        Lon     float64 `json:"lon"`
    }

    // decode so'rov tanasini dst ga o'qiydi. Xato bo'lsa HTTP status va error qaytaradi.
    func decode(w http.ResponseWriter, r *http.Request, dst any) (int, error) {
        r.Body = http.MaxBytesReader(w, r.Body, 1<<10)
        dec := json.NewDecoder(r.Body)
        dec.DisallowUnknownFields()
        if err := dec.Decode(dst); err != nil {
            var tooBig *http.MaxBytesError
            if errors.As(err, &tooBig) {
                return http.StatusRequestEntityTooLarge, err
            }
            return http.StatusBadRequest, err
        }
        if _, err := dec.Token(); !errors.Is(err, io.EOF) {
            return http.StatusBadRequest, errors.New("JSON'dan keyin ortiqcha ma'lumot")
        }
        return 0, nil
    }

    func main() {
        cases := []struct{ name, body string }{
            {"to'g'ri", `{"vehicle":"truck-7","lat":41.31,"lon":69.28}`},
            {"noma'lum maydon", `{"vehicle":"truck-7","lat":41.31,"lon":69.28,"speed":80}`},
            {"ortiqcha ma'lumot", `{"vehicle":"truck-7"} {"vehicle":"truck-8"}`},
            {"juda katta", `{"vehicle":"` + strings.Repeat("x", 4096) + `"}`},
            {"bo'sh", ``},
        }
        for _, c := range cases {
            req := httptest.NewRequest("POST", "/points", strings.NewReader(c.body))
            var p Point
            status, err := decode(httptest.NewRecorder(), req, &p)
            fmt.Printf("%-18s status=%d xato=%v\n", c.name, status, err != nil)
        }
    }
  solutionNotes: |
    - `http.MaxBytesReader` tanani o'rab, 1 KiB dan oshganda `*http.MaxBytesError` qaytaradi. U `Decode` xatosi ichida o'ralgan, shuning uchun `errors.As` bilan ajratiladi va 413 beriladi.
    - `DisallowUnknownFields` JSON'dagi tanilmagan maydonlarni xatoga aylantiradi. Xato matniga qarab mantiq qurilmaydi: bu yerda har qanday boshqa decode xatosi 400 hisoblanadi.
    - `Decode` faqat birinchi qiymatni o'qiydi. Keyin `dec.Token()` chaqiriladi va `io.EOF` kutiladi; boshqa natija ortiqcha ma'lumot degani.
    - Lokal tekshiruv: starter beshta holatning to'rttasini qabul qildi, yechim noma'lum maydon va ortiqcha ma'lumotni 400, katta tanani 413, bo'sh tanani 400 bilan rad etdi.
  checklist:
    - "Tana `http.MaxBytesReader` bilan 1 KiB ga cheklangan va `*http.MaxBytesError` 413 beradi"
    - "`DisallowUnknownFields` yoqilgan"
    - "Decode'dan keyin `dec.Token()` `io.EOF` qaytarishi tekshiriladi"
    - "Xato turi `errors.As`/`errors.Is` bilan aniqlanadi, xato matni bo'yicha emas"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

JSON API'da bug ko'pincha mantiqda emas, chegarada: tashqi dunyodan kelgan baytlarni Go qiymatlariga aylantirish joyida. `json.NewDecoder(r.Body).Decode(&in)` bir qatorda ishlaydi va ko'rinishidan to'g'ri. Lekin u:

- tana hajmini cheklamaydi: klient 2 GB yuborsa, server xotirasini yeydi;
- noma'lum maydonlarni jimgina tashlaydi: `"fuell": 41.5` (xato yozilgan) qabul qilinadi, `Fuel` esa nol qoladi va hech kim sezmaydi;
- birinchi qiymatdan keyingi baytlarga qaramaydi: `{...} {...}` yoki `{...} axlat` qabul qilinadi;
- yo'q maydon bilan 0 qiymatni ajratmaydi;
- xatoni o'zi mijozga tushunarli ko'rinishga keltirmaydi.

Bundan tashqari, kalit nomlari katta-kichik harfga e'tiborsiz moslanadi (`"VEHICLE"` ham `vehicle` maydoniga tushadi), bitta struct qayta ishlatilsa, kelmagan maydon oldingi qiymatini saqlaydi, `interface{}` ga o'qilgan katta butun son `float64` bo'lib aniqligini yo'qotadi. Bular 100 Go Mistakes kitobidagi JSON xatolari guruhiga (#77) mos keladi va ularning hammasini lokal sinab ko'rdik (quyida).

Node.js'dan kelgan dasturchiga bu tanish: `JSON.parse` + `zod` yoki `class-validator` bilan tekshirish. Go'da bu ish `encoding/json` + o'z validatsiyangiz. Standart kutubxona sxema tekshirmaydi, shuning uchun chegarani yaxshi loyihalash kerak. Go 1.27 da ham bu o'zgardi: `encoding/json/v2` paydo bo'ldi va `encoding/json` ning o'zi v2 asosiga o'tdi. Bu darsda avval hozirgi, keng tarqalgan v1 usullarini, keyin v2 ni ko'ramiz.

## Asosiy g'oya

### Chegara qatlami: o'qi, tekshir, domenga o't

Tavsiya etilgan ketma-ketlik uch qadamdan iborat:

1. Qat'iy o'qish: hajm, noma'lum maydonlar, ortiqcha ma'lumot, tur xatolari.
2. Validatsiya: qiymatlar mazmunan to'g'rimi (diapazon, majburiy maydonlar), barcha xatolarni birdan yig'ib.
3. Domen tipiga o'tkazish: ichki mantiq tashqi DTO emas, o'z tipida ishlaydi. Shunda JSON shakli o'zgarsa, domen kodi o'zgarmaydi.

### Qat'iy decode

Misoldagi `decodeStrict`:

- `http.MaxBytesReader(w, r.Body, 1<<10)`: limitdan oshsa `*http.MaxBytesError`. Hujjatga ko'ra imkon bo'lsa ulanishni yopishni ham so'raydi.
- `dec.DisallowUnknownFields()`: noma'lum maydon xatoga aylanadi.
- `Decode`dan keyin `dec.Token()` `io.EOF` qaytarishi kerak. Bo'lmasa ortiqcha ma'lumot bor.
- Xato turlari: `*json.SyntaxError` (sintaksis), `*json.UnmarshalTypeError` (tur mos kelmadi, `Field` va `Value` bilan), `io.ErrUnexpectedEOF` (tana yarim joyda tugadi), `io.EOF` (tana bo'sh), `*http.MaxBytesError` (juda katta).

Lokal sinovda yarim JSON `io.ErrUnexpectedEOF`, bo'sh tana esa `io.EOF` berdi, shuning uchun bu ikki holatni alohida tekshirish kerak.

### Yo'q va nol qiymatni ajratish

Maydon tipi `float64` bo'lsa, `{}` va `{"fuel":0}` bir xil ko'rinadi. Farq muhim bo'lsa (majburiy maydon yoki "0 litr" haqiqiy o'lchov), pointer ishlatiladi: `*float64` `nil` bo'lsa, maydon kelmagan. Yozish tomonida (marshaling) `omitempty` bilan Go 1.24 da qo'shilgan `omitzero` farq qiladi: `omitempty` bo'sh string, 0, nil, bo'sh slice/map ni tashlaydi, lekin struct qiymatlarini (masalan `time.Time`) tashlamaydi; `omitzero` esa `IsZero()` metodi bor tiplar uchun shu metodni, boshqalar uchun Go zero value'ni tekshiradi. Lokal natija (Go 1.24.7): `omitempty` bilan `time.Time` nol qiymati `"0001-01-01T00:00:00Z"` ko'rinishida yozildi, `omitzero` bilan tashlandi.

### Xato formati: problem+json

Mijoz xatoni mashina o'qiy oladigan shaklda olishi kerak. RFC 9457 ("Problem Details for HTTP APIs") `application/problem+json` formatini belgilaydi: `type`, `title`, `status`, `detail` va kengaytma maydonlari. Misolda kengaytma sifatida `errors` ro'yxati bor (maydon nomi va xabar). RFC 9457 o'zi ham "errors" kengaytmasini validatsiya xatolari misoli sifatida keltiradi (rfc-editor.org/rfc/rfc9457, Extension Members bo'limi). Bu RFC darsning manbalar ro'yxatida yo'q, shuning uchun uning aniq matniga emas, keng qo'llaniladigan shakliga tayanamiz.

Status kodlari (bu jamoa kelishuvi, qat'iy qoida emas): 400 sintaksis va tur xatolari, 413 juda katta tana, 415 noto'g'ri `Content-Type`, 422 validatsiya xatolari (sintaksis to'g'ri, mazmun noto'g'ri). Ba'zi jamoalar 422 o'rniga 400 ishlatadi; muhimi bir xillik.

### Validatsiya xatolarini yig'ish

Birinchi xatoda to'xtash mijozni besh marta so'rov yuborishga majbur qiladi. Hamma xatolarni `[]FieldError` ga yig'ib, bir javobda qaytaring. Xato maydon nomi JSON'dagi nom bo'lishi kerak (Go struct nomi emas), xabarni esa mijoz ko'rsatishi mumkin bo'lgan darajada aniq yozing.

### Versiyalash

Eng sodda va ko'rinadigan usul: yo'lda versiya (`/v1/readings`), `ServeMux` pattern'ida `POST /v1/readings`. Boshqa variantlar: sarlavha yoki media type orqali. Qoidalar usuldan muhimroq:

- Orqaga mos o'zgarish: yangi maydon, yangi endpoint, yangi ixtiyoriy parametr. Mijozlar javobdagi noma'lum maydonlarni e'tiborsiz qoldirishi API shartnomasiga yozilishi kerak.
- Buzuvchi o'zgarish: maydonni olib tashlash, nomi yoki birligini o'zgartirish, majburiy parametr qo'shish, xato semantikasini o'zgartirish. Bular yangi versiya (`/v2`) talab qiladi.
- Eski versiyani o'chirish muddatini oldindan e'lon qiling va metrikada kim hali ishlatayotganini ko'ring.

## Chuqurroq: v1 tuzoqlari va Go 1.27 json/v2

### v1 xatti-harakatlari (Go 1.24.7 da sinalgan)

```go
package main

import (
	"encoding/json"
	"fmt"
	"time"
)

type Reading struct {
	Vehicle string `json:"vehicle"`
	Fuel    int    `json:"fuel"`
}

type Out struct {
	A time.Time `json:"a,omitempty"`
	B time.Time `json:"b,omitzero"`
	C []string  `json:"c"`
	D []string  `json:"d,omitempty"`
}

func main() {
	// 1. Bitta struct qayta ishlatilsa, kelmagan maydon eski qiymatini saqlaydi.
	var r Reading
	json.Unmarshal([]byte(`{"vehicle":"truck-7","fuel":40}`), &r)
	json.Unmarshal([]byte(`{"vehicle":"truck-8"}`), &r)
	fmt.Printf("1. %+v\n", r)

	// 2. v1 kalitlarni katta-kichik harfga e'tiborsiz moslaydi.
	var r2 Reading
	err := json.Unmarshal([]byte(`{"VEHICLE":"truck-9","Fuel":12}`), &r2)
	fmt.Printf("2. %+v xato=%v\n", r2, err)

	// 3. omitempty struct'ni (time.Time) tashlamaydi, omitzero tashlaydi; nil slice null bo'ladi.
	b, _ := json.Marshal(Out{})
	fmt.Printf("3. %s\n", b)

	// 4. any ga o'qilgan katta butun son float64 bo'lib aniqligini yo'qotadi.
	var v map[string]any
	json.Unmarshal([]byte(`{"id": 9007199254740993}`), &v)
	fmt.Printf("4. %.0f\n", v["id"])
}
```

```text
1. {Vehicle:truck-8 Fuel:40}
2. {Vehicle:truck-9 Fuel:12} xato=<nil>
3. {"a":"0001-01-01T00:00:00Z","c":null}
4. 9007199254740992
```

- (1) Bitta `Reading` ikki marta o'qildi: ikkinchi tanada `fuel` yo'q, shuning uchun `Fuel:40` oldingi so'rovdan qoldi. Har so'rovda yangi `var in Reading` ishlating.
- (2) `"VEHICLE"` va `"Fuel"` kalitlari `vehicle` va `fuel` maydonlariga tushdi va xato bo'lmadi. v2 hujjati ham buni tasdiqlaydi: v1 loose, katta-kichik harfga e'tiborsiz moslashadi, v2 default'da sezgir.
- (3) `omitempty` bilan `time.Time` yozildi, `omitzero` bilan tashlandi; nil slice `null` bo'ldi.
- (4) `9007199254740993` `any` ga o'qilganda `9007199254740992` bo'ldi. ID'lar kabi katta butun sonlar uchun maxsus tip yoki `json.Number` (`Decoder.UseNumber`) ishlating, yoki ID'larni string sifatida yuboring.

### Go 1.27: encoding/json/v2

Go 1.27 release notes bo'yicha yangi `encoding/json/v2` va `encoding/json/jsontext` paketlari mavjud. v2 `Marshal`, `Unmarshal`, `MarshalWrite`, `UnmarshalRead`, `MarshalEncode`, `UnmarshalDecode` funksiyalarini beradi va ularning hammasi variadic `Options` oladi. v2 qat'iyroq va muvofiqroq default'larni tanlaydi: noto'g'ri UTF-8 va object ichidagi takror nomlarni rad etadi. `encoding/json` (v1) endi v2 implementatsiyasi ustida ishlaydi: xatti-harakat saqlanadi, lekin xato xabarlari matni farq qilishi mumkin; v1 API qo'llab-quvvatlanadi va migratsiya majburiy emas. Muammo bo'lsa `GOEXPERIMENT=nojsonv2` bilan eski implementatsiyaga qaytish mumkin.

Pkg.go.dev hujjatiga ko'ra v2 da:

- noma'lum a'zolar default'da e'tiborsiz qoldiriladi, `RejectUnknownMembers(true)` opsiyasi ularni rad etadi;
- struct maydonlari default'da katta-kichik harfga sezgir moslanadi (`MatchCaseInsensitiveNames(true)` v1 ga o'xshatadi);
- takror nomlar rad etiladi (`jsontext.AllowDuplicateNames` bilan ruxsat etiladi);
- `UnmarshalRead` butun oqimni EOF gacha o'qib, JSON qiymatdan keyingi ortiqcha baytlarni tekshiradi (v1 da buni qo'lda qilasiz);
- nil slice default'da `[]` bo'lib yoziladi (`FormatNilSliceAsNull(true)` `null` beradi);
- `omitzero` faqat nil slice/map ni tashlaydi, bo'sh slice/map ni `omitempty` tashlaydi;
- tur xatolari `*json.SemanticError` bilan keladi (`JSONPointer`, `GoType`, `Err` maydonlari bilan).

Quyidagi kod hujjat API'siga tayanadi va sandbox'da (Go 1.24) kompilyatsiya qilinmadi:

```go
import jsonv2 "encoding/json/v2" // Go 1.27+: kompilyatsiya qilinmagan

func decodeV2(r *http.Request, dst any) error {
	r.Body = http.MaxBytesReader(nil, r.Body, 1<<20)
	// UnmarshalRead ortiqcha baytlarni o'zi rad etadi.
	return jsonv2.UnmarshalRead(r.Body, dst, jsonv2.RejectUnknownMembers(true))
}
```

Eksperimental davrdagi maqolalardagi kodlarga ishonmang: opsiyalar va teg'lar nomi o'zgargan bo'lishi mumkin, har doim pkg.go.dev hujjatini tekshiring.

## Misol: to'liq endpoint

```go
package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"time"
)

type Problem struct {
	Type   string       `json:"type"`
	Title  string       `json:"title"`
	Status int          `json:"status"`
	Detail string       `json:"detail,omitempty"`
	Errors []FieldError `json:"errors,omitempty"`
}

type FieldError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeProblem(w http.ResponseWriter, p Problem) {
	w.Header().Set("Content-Type", "application/problem+json")
	w.WriteHeader(p.Status)
	_ = json.NewEncoder(w).Encode(p)
}

// decodeStrict: hajm limiti, noma'lum maydon taqiqi va ortiqcha ma'lumot tekshiruvi.
func decodeStrict(w http.ResponseWriter, r *http.Request, dst any) *Problem {
	r.Body = http.MaxBytesReader(w, r.Body, 1<<10)
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	err := dec.Decode(dst)

	var syn *json.SyntaxError
	var typ *json.UnmarshalTypeError
	var tooBig *http.MaxBytesError
	switch {
	case err == nil:
	case errors.As(err, &tooBig):
		return &Problem{Type: "/errors/too-large", Title: "So'rov juda katta", Status: 413}
	case errors.As(err, &syn):
		return &Problem{Type: "/errors/bad-json", Title: "JSON sintaksis xatosi", Status: 400, Detail: fmt.Sprintf("%d-bayt yaqinida", syn.Offset)}
	case errors.As(err, &typ):
		return &Problem{Type: "/errors/bad-type", Title: "Maydon turi noto'g'ri", Status: 400, Detail: fmt.Sprintf("%s: %s kutilgan, %s keldi", typ.Field, typ.Type, typ.Value)}
	case errors.Is(err, io.ErrUnexpectedEOF):
		return &Problem{Type: "/errors/truncated", Title: "JSON tugallanmagan", Status: 400}
	case errors.Is(err, io.EOF):
		return &Problem{Type: "/errors/empty-body", Title: "Tana bo'sh", Status: 400}
	case strings.HasPrefix(err.Error(), "json: unknown field"):
		return &Problem{Type: "/errors/unknown-field", Title: "Noma'lum maydon", Status: 400, Detail: err.Error()}
	default:
		return &Problem{Type: "/errors/bad-json", Title: "JSON o'qib bo'lmadi", Status: 400}
	}
	// Decode faqat birinchi qiymatni o'qiydi: keyingisi bo'lmasligi kerak.
	if _, err := dec.Token(); !errors.Is(err, io.EOF) {
		return &Problem{Type: "/errors/trailing-data", Title: "JSON'dan keyin ortiqcha ma'lumot", Status: 400}
	}
	return nil
}

type Reading struct {
	Vehicle string    `json:"vehicle"`
	Fuel    *float64  `json:"fuel"`
	At      time.Time `json:"at"`
	Note    string    `json:"note,omitzero"`
}

func (r Reading) validate() []FieldError {
	var errs []FieldError
	if r.Vehicle == "" {
		errs = append(errs, FieldError{"vehicle", "majburiy"})
	}
	if r.Fuel == nil {
		errs = append(errs, FieldError{"fuel", "majburiy"})
	} else if *r.Fuel < 0 || *r.Fuel > 1000 {
		errs = append(errs, FieldError{"fuel", "0 dan 1000 gacha bo'lishi kerak"})
	}
	if r.At.IsZero() {
		errs = append(errs, FieldError{"at", "majburiy"})
	}
	return errs
}

func postReading(w http.ResponseWriter, r *http.Request) {
	var in Reading
	if p := decodeStrict(w, r, &in); p != nil {
		writeProblem(w, *p)
		return
	}
	if errs := in.validate(); len(errs) > 0 {
		writeProblem(w, Problem{Type: "/errors/validation", Title: "Tekshiruv xatosi", Status: 422, Errors: errs})
		return
	}
	writeJSON(w, http.StatusCreated, in)
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /v1/readings", postReading)
	srv := httptest.NewServer(mux)
	defer srv.Close()

	bodies := []string{
		`{"vehicle":"truck-7","fuel":41.5,"at":"2026-11-03T09:00:00Z"}`,
		`{"vehicle":"truck-7","fuel":41.5,"at":"2026-11-03T09:00:00Z","color":"red"}`,
		`{"vehicle":"truck-7","fuel":"ko'p","at":"2026-11-03T09:00:00Z"}`,
		`{"vehicle":"truck-7",`,
		`{"vehicle":"","fuel":-5}`,
		`{"vehicle":"a","fuel":1,"at":"2026-11-03T09:00:00Z"} {"x":1}`,
		`{"vehicle":"a","note":"` + strings.Repeat("x", 2000) + `"}`,
		``,
	}
	for _, b := range bodies {
		resp, err := http.Post(srv.URL+"/v1/readings", "application/json", strings.NewReader(b))
		if err != nil {
			fmt.Println("xato:", err)
			continue
		}
		out, _ := io.ReadAll(resp.Body)
		resp.Body.Close()
		show := b
		if len(show) > 40 {
			show = show[:40] + "..."
		}
		fmt.Printf("%-46q -> %d %s", show, resp.StatusCode, out)
	}
}
```

Sakkiz xil tana bilan chiqish (Go 1.24.7; so'rovning boshi qisqartirilib ko'rsatilgan):

```text
"{\"vehicle\":\"truck-7\",\"fuel\":41.5,\"at\":\"2..." -> 201 {"vehicle":"truck-7","fuel":41.5,"at":"2026-11-03T09:00:00Z"}
"{\"vehicle\":\"truck-7\",\"fuel\":41.5,\"at\":\"2..." -> 400 {"type":"/errors/unknown-field","title":"Noma'lum maydon","status":400,"detail":"json: unknown field \"color\""}
"{\"vehicle\":\"truck-7\",\"fuel\":\"ko'p\",\"at\":..." -> 400 {"type":"/errors/bad-type","title":"Maydon turi noto'g'ri","status":400,"detail":"fuel: float64 kutilgan, string keldi"}
"{\"vehicle\":\"truck-7\","                    -> 400 {"type":"/errors/truncated","title":"JSON tugallanmagan","status":400}
"{\"vehicle\":\"\",\"fuel\":-5}"               -> 422 {"type":"/errors/validation","title":"Tekshiruv xatosi","status":422,"errors":[{"field":"vehicle","message":"majburiy"},{"field":"fuel","message":"0 dan 1000 gacha bo'lishi kerak"},{"field":"at","message":"majburiy"}]}
"{\"vehicle\":\"a\",\"fuel\":1,\"at\":\"2026-11-03..." -> 400 {"type":"/errors/trailing-data","title":"JSON'dan keyin ortiqcha ma'lumot","status":400}
"{\"vehicle\":\"a\",\"note\":\"xxxxxxxxxxxxxxxxx..." -> 413 {"type":"/errors/too-large","title":"So'rov juda katta","status":413}
""                                             -> 400 {"type":"/errors/empty-body","title":"Tana bo'sh","status":400}
```

Qarorlar:

- `Reading.Fuel` `*float64`: `{"vehicle":"","fuel":-5}` holatida `fuel` bor, `at` yo'q, shuning uchun validatsiya `vehicle`, `fuel` va `at` ni birdan qaytardi (3 ta xato, bitta 422 javobda).
- `decodeStrict` ichida har bir xato turi alohida status oladi. Noma'lum maydon uchun v1 da typed xato yo'q, shuning uchun matn prefiksi tekshiriladi. Bu mo'rt joy: Go 1.27 da xato matni farq qilishi mumkin (yuqorida). Yagona qarorni "noma'lum maydon" deb aniqlashga tayanmang, javobda umumiy 400 qoldiring.
- Javob tanasi `Content-Type: application/problem+json` bilan yoziladi. `writeJSON` va `writeProblem` sarlavhani `WriteHeader`dan oldin o'rnatadi.
- Tana 1 KiB bilan cheklangan: 2000 baytli tana 413 oldi.
- `omitzero` `Note` maydonida: bo'sh izoh javobda ko'rinmaydi.

## Qachon qo'llamaslik kerak

- `DisallowUnknownFields` ni **javoblarni** o'qiydigan klientda ishlatmang: server yangi maydon qo'shsa, klient yiqiladi. Qat'iylik kirish tomonida; chiqish tomonida bag'rikenglik.
- Qat'iy kirish API'ni tashqi mijozlar uchun ochganda ham o'ylab qo'llang: yangi mijoz yangi maydon yuborsa va server hali bilmasa, rad etish mijozni to'sadi. Ichki servislarda va yangi versiya chiqishi nazorat ostida bo'lganda qat'iylik foydali; ochiq API'da qaror shartnoma bilan birga olinadi.
- Validatsiyani struct teg'larida yashiringan "sehrli" kutubxonaga topshirib, domen qoidalarini yo'qotmang. Oddiy tekshiruvlar kodda aniq yozilgani yaxshi o'qiladi va test qilinadi; teg asosidagi kutubxonalar juda ko'p maydonli DTO'larda foydali bo'lishi mumkin.
- `any`/`map[string]any` ga o'qishni noma'lum tuzilma uchun qoldiring: katta sonlar va tur xatolari yashiringan holda o'tadi.
- v2 ga shoshilib o'tmang: Go 1.27 da `encoding/json` allaqachon v2 implementatsiyasi ustida; migratsiya majburiy emas va xato matniga tayangan testlar o'zgarishi mumkin. Avval mavjud testlar bilan yangi toolchain'ni sinang.
- Katta fayllarni JSON ichida base64 qilib yubormang: multipart yoki alohida yuklash endpoint'i kerak.

## Stack'da: Node.js/TypeScript bilan solishtirish

TypeScript'da tur tekshiruvi kompilyatsiya vaqtida bo'ladi, `JSON.parse` esa ishonchsiz `any` qaytaradi; xavfsizlik `zod` kabi runtime sxema bilan keladi. Go'da tur tizimi decode paytida ishlaydi (`UnmarshalTypeError`), lekin majburiy maydon, diapazon va format tekshiruvi sizning kodingiz. Shuning uchun DTO va domen tiplarini ajrating: DTO kirish shaklini, domen tipi invariantlarni ifodalaydi.

Servis uchun andoza:

- Har endpoint: `MaxBytesReader` -> qat'iy decode -> validatsiya (hamma xato) -> domen -> javob.
- Bitta joyda `writeJSON` va `writeProblem`; handler'lar xatoni o'zi formatlamaydi.
- Majburiy yoki "0 ma'noli" maydonlar uchun pointer; yozishda `omitzero` (Go 1.24 dan).
- Katta ID'lar JS mijozlar uchun string sifatida; sana va vaqt UTC RFC 3339 da.
- Versiya yo'lda; o'zgarish turi (additive/buzuvchi) har PR'da belgilansin.
- Go 1.27 ga o'tganda xato matniga tayangan testlarni qidiring va typed xatolarga o'tkazing.

## Xulosa

- Chegarada qat'iy bo'ling: `MaxBytesReader`, `DisallowUnknownFields` va `Decode`dan keyin `io.EOF` tekshiruvi (v1 da qo'lda; v2 `UnmarshalRead` o'zi qiladi).
- Yo'q maydon va nol qiymatni pointer bilan ajrating; yozishda `omitzero` (Go 1.24) `time.Time` kabi struct'larni tashlaydi, `omitempty` tashlamaydi.
- Xatolarni `problem+json` shaklida, hamma validatsiya xatosini bir javobda qaytaring; status kodlari bo'yicha jamoa kelishuvi bo'lsin.
- v1 tuzoqlari lokal sinaldi: struct qayta ishlatilsa eski qiymat qoladi, kalitlar katta-kichik harfga e'tiborsiz moslanadi, katta butun son `any` da aniqligini yo'qotadi.
- Go 1.27 da `encoding/json` v2 asosida ishlaydi va xato matni o'zgarishi mumkin: xato matniga tayanmang, typed xatolardan foydalaning. Versiyalashda additive o'zgarish xavfsiz, buzuvchi o'zgarish yangi versiya talab qiladi.
