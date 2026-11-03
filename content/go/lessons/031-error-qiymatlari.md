---
n: 31
slug: error-qiymatlari
title: "Error qiymatlari: wrapping, Is/As/Join va errors.AsType"
summary: "error interface, Unwrap konvensiyasi, %w bilan wrapping, errors.Is/As/Join semantikasi (chain emas, daraxt), As'ning pointer talabi va panic'i, Go 1.26 dagi errors.AsType hamda qachon wrap qilmaslik kerak."
duration: 40
sources:
  - id: pkg-errors
    note: "Is, As, Join, Unwrap funksiyalari hujjati; ErrUnsupported; daraxtni chuqurlik bo'yicha birinchi aylanish tartibi; AsType (added in go1.26.0)"
  - id: blog-errors-go113
    note: "Unwrap metodi konvensiyasi, %w verb'i, Is va As, 'Whether to Wrap' va 'Customizing error tests' bo'limlari"
  - id: go126
    note: "Minor changes to the library, errors bo'limi: yangi AsType funksiyasi"
quiz:
  - q: "Quyidagi kod nima chiqaradi? `err := fmt.Errorf(\"collect: %w\", ErrNoSignal); fmt.Println(err == ErrNoSignal, errors.Is(err, ErrNoSignal))`"
    options:
      - "true true, chunki %w asl qiymatni o'zgartirmaydi"
      - "false true: == o'rovchi qiymatni solishtiradi, Is esa zanjir bo'ylab qidiradi"
      - "false false, chunki sentinel error faqat paket ichida taqqoslanadi"
      - "true false, chunki Is faqat custom tipli xatolar uchun ishlaydi"
    answer: 1
    explain: "fmt.Errorf %w bilan yangi *fmt.wrapError qiymatini yaratadi, shuning uchun == uni ErrNoSignal bilan teng deb topmaydi. errors.Is esa Unwrap orqali ichkariga tushib, ErrNoSignal'ga yetib boradi. Qolgan variantlarda %w qiymatni o'zgartirmaydi degan yoki Is'ni custom tiplar bilan cheklagan noto'g'ri taxmin bor."
  - q: "Ikkita xatoni `errors.Join(a, b)` bilan birlashtirdingiz va natijani `errors.Unwrap` ga berdingiz. Nima qaytadi?"
    options:
      - "a, ya'ni birinchi xato"
      - "b, ya'ni oxirgi xato"
      - "Ikkala xatoning matni birlashgan yangi error"
      - "nil, chunki Join natijasi Unwrap() []error metodini beradi, Unwrap() error ni emas"
    answer: 3
    explain: "Hujjat aniq aytadi: errors.Unwrap faqat `Unwrap() error` shakldagi metodni chaqiradi va Join qaytargan xatoni ochmaydi. Join natijasini errors.Is va errors.As bilan tekshiring, ular daraxtni to'liq aylanadi."
  - q: "Servis `fmt.Errorf(\"db: %v\", sql.ErrNoRows)` qaytaradi. Chaqiruvchi `errors.Is(err, sql.ErrNoRows)` deb tekshiradi. Natija va sabab?"
    options:
      - "false: %v faqat matnni yozadi, Unwrap metodi yaratilmaydi, shuning uchun asl xato yashirinadi"
      - "true, chunki Is xato matnini ham solishtiradi"
      - "Kompilyatsiya xatosi: %v xato operandi bilan ishlatilmaydi"
      - "true, chunki sql.ErrNoRows global o'zgaruvchi va hamma joyda bir xil"
    answer: 0
    explain: "%w va %v matnni bir xil yozadi, lekin faqat %w Unwrap metodini beradi. Blog buni ongli vosita sifatida tavsiflaydi: asl xatoni API'ning bir qismiga aylantirmaslik uchun %v bilan qayta o'rash mumkin. Is matnni solishtirmaydi."
  - q: "Quyidagi kod ishga tushganda nima bo'ladi? `var se SensorError; errors.As(err, &se)`, bunda err zanjirida `*SensorError` turgan."
    options:
      - "true qaytaradi va se to'ldiriladi, chunki maydonlar mos"
      - "false qaytaradi, chunki tip mos kelmaydi"
      - "Run-time panic: target error'ni amalga oshiruvchi tipga ko'rsatkich bo'lishi shart, SensorError qiymat tipi error emas, *SensorError esa error"
      - "Kompilyatsiya xatosi, chunki As'ning ikkinchi argumenti any"
    answer: 2
    explain: "Metod `*SensorError` uchun e'lon qilingan, shuning uchun error interface'ini *SensorError amalga oshiradi, SensorError qiymati emas. &se esa *SensorError emas, `**SensorError` tipidagi qiymatga ko'rsatkich. Natijada As panic qiladi (go vet buni oldindan ham ushlaydi). To'g'ri yozuv: `var se *SensorError; errors.As(err, &se)`."
  - q: "Go 1.26 da qo'shilgan `errors.AsType[E error](err error) (E, bool)` haqida qaysi gap to'g'ri?"
    options:
      - "U faqat Go 1.13 dan oldingi kodni ko'chirish uchun kerak, yangi kodda As afzal"
      - "Natijani qiymat sifatida qaytaradi, shuning uchun alohida target o'zgaruvchi va & kerak emas; release notes uni type-safe va tezroq deb ataydi"
      - "U As'ni almashtiradi, eski As chaqiruvlari yangi toolchain'da kompilyatsiya bo'lmaydi"
      - "U errors.Is ning generic varianti, sentinel qiymatlarni solishtiradi"
    answer: 1
    explain: "Release notes AsType'ni As'ning generic versiyasi, type-safe va tezroq deb tasvirlaydi. Go 1 compatibility sababli As o'z joyida qoladi. AsType tip bo'yicha qidiradi, sentinel qiymat bo'yicha emas: sentinel uchun Is ishlatiladi."
  - q: "Paket `LookupUser` ichida database/sql ishlatadi va `fmt.Errorf(\"accessing DB: %w\", err)` qaytaradi. Keyinchalik jamoa pgx'ga o'tmoqchi. Nima xavf tug'iladi?"
    options:
      - "Hech narsa: wrapping ichki xatoni API'dan yashiradi"
      - "Xato matni o'zgarib ketadi, lekin errors.Is baribir ishlayveradi"
      - "%w faqat bitta darajagacha ishlaydi, shuning uchun zanjir uziladi"
      - "Chaqiruvchilar errors.Is(err, sql.ErrNoRows) ga tayanib qolgan bo'lishi mumkin; wrapping bu xatoni API'ning bir qismiga aylantirgan, endi ham uni qaytarish majburiyati bor"
    answer: 3
    explain: "Go blogidagi aynan shu misol: %w ichki xatoni chaqiruvchilarga ochadi va u API shartnomasiga kiradi. Implementatsiya tafsiloti bo'lsa, %v bilan yoki o'z xatoingizga tarjima qilib qaytaring (32-dars)."
task:
  title: "Wrapping'ga chidamli classify"
  prompt: |
    Telemetriya ingest servisida `classify` funksiyasi xatoni qayta ishlash qaroriga aylantiradi: `ok`, `retry`, `skip` yoki `alert:<sabab>`. Hozirgi variant xatolarni `==` va type assertion bilan tekshiradi, shuning uchun `fmt.Errorf("...: %w", err)` yoki `errors.Join` bilan o'ralgan xatolarda noto'g'ri qaror beradi (hamma narsa `alert:unknown` chiqadi).

    `classify`ni qayta yozing. Qoidalar, ustuvorlik tartibida:
    - `nil` - `ok`
    - zanjirda `context.DeadlineExceeded` bor - `retry`
    - zanjirda `ErrNoSignal` bor - `skip` (hatto u `*SensorError` ichida o'ralgan bo'lsa ham)
    - zanjirda `*SensorError` bor - `alert:<datchik nomi>`
    - qolganlari - `alert:unknown`

    Imzoni va `main`ni o'zgartirmang. Kutilgan chiqish: `ok`, `retry`, `skip`, `alert:dut-3`, `retry`, `alert:unknown` (har biri alohida qatorda).
  lang: go
  starter: |
    package main

    import (
        "context"
        "errors"
        "fmt"
    )

    // ErrNoSignal - datchik signal bermagan.
    var ErrNoSignal = errors.New("signal yo'q")

    // SensorError qaysi datchikda xato bo'lganini saqlaydi.
    type SensorError struct {
        Sensor string
        Err    error
    }

    func (e *SensorError) Error() string { return "datchik " + e.Sensor + ": " + e.Err.Error() }

    func (e *SensorError) Unwrap() error { return e.Err }

    // classify xatoni qayta ishlash qaroriga aylantiradi: ok, retry, skip yoki alert:<sabab>.
    func classify(err error) string {
        if err == nil {
            return "ok"
        }
        if err == context.DeadlineExceeded {
            return "retry"
        }
        if err == ErrNoSignal {
            return "skip"
        }
        if se, ok := err.(*SensorError); ok {
            return "alert:" + se.Sensor
        }
        return "alert:unknown"
    }

    func main() {
        cases := []error{
            nil,
            fmt.Errorf("fetch: %w", context.DeadlineExceeded),
            fmt.Errorf("collect: %w", &SensorError{Sensor: "dut-7", Err: ErrNoSignal}),
            fmt.Errorf("collect: %w", &SensorError{Sensor: "dut-3", Err: errors.New("checksum xato")}),
            errors.Join(errors.New("db yozish"), fmt.Errorf("fetch: %w", context.DeadlineExceeded)),
            errors.New("noma'lum"),
        }
        for _, err := range cases {
            fmt.Println(classify(err))
        }
    }
  solution: |
    package main

    import (
        "context"
        "errors"
        "fmt"
    )

    // ErrNoSignal - datchik signal bermagan.
    var ErrNoSignal = errors.New("signal yo'q")

    // SensorError qaysi datchikda xato bo'lganini saqlaydi.
    type SensorError struct {
        Sensor string
        Err    error
    }

    func (e *SensorError) Error() string { return "datchik " + e.Sensor + ": " + e.Err.Error() }

    func (e *SensorError) Unwrap() error { return e.Err }

    // classify xatoni qayta ishlash qaroriga aylantiradi: ok, retry, skip yoki alert:<sabab>.
    func classify(err error) string {
        if err == nil {
            return "ok"
        }
        if errors.Is(err, context.DeadlineExceeded) {
            return "retry"
        }
        if errors.Is(err, ErrNoSignal) {
            return "skip"
        }
        var se *SensorError
        if errors.As(err, &se) {
            return "alert:" + se.Sensor
        }
        return "alert:unknown"
    }

    func main() {
        cases := []error{
            nil,
            fmt.Errorf("fetch: %w", context.DeadlineExceeded),
            fmt.Errorf("collect: %w", &SensorError{Sensor: "dut-7", Err: ErrNoSignal}),
            fmt.Errorf("collect: %w", &SensorError{Sensor: "dut-3", Err: errors.New("checksum xato")}),
            errors.Join(errors.New("db yozish"), fmt.Errorf("fetch: %w", context.DeadlineExceeded)),
            errors.New("noma'lum"),
        }
        for _, err := range cases {
            fmt.Println(classify(err))
        }
    }
  solutionNotes: |
    - `errors.Is(err, context.DeadlineExceeded)` o'rovchi qatlamlarni va `errors.Join` daraxtini ichkariga qarab aylanadi, `==` esa faqat eng tashqi qiymatni ko'radi.
    - Ustuvorlik tartibi muhim: `ErrNoSignal` `*SensorError` ichida o'ralgan bo'lishi mumkin, shuning uchun `Is(ErrNoSignal)` tekshiruvi `As(*SensorError)` dan oldin turadi. Teskari tartibda `dut-7` uchun `alert:dut-7` chiqib qolardi.
    - `var se *SensorError` va `errors.As(err, &se)`: target - `*SensorError` tipidagi o'zgaruvchiga ko'rsatkich. `&se` o'rniga `se` yoki qiymat tipi berilsa, `As` panic qiladi.
    - Go 1.26 va undan yangi toolchain'da `errors.AsType[*SensorError](err)` bilan `var se` e'lonisiz yozish mumkin; bu variant bu yerda ishlatilmadi, chunki u lokal toolchain'da tekshirilmagan.
  checklist:
    - "Wrapping bilan o'ralgan `DeadlineExceeded` va `errors.Join` ichidagi `DeadlineExceeded` uchun `retry` chiqadi"
    - "`*SensorError` ichidagi `ErrNoSignal` uchun `skip` chiqadi (`alert:dut-7` emas)"
    - "`==` taqqoslash va `err.(*SensorError)` type assertion qolmagan"
    - "`errors.As` target'i `*SensorError` tipidagi o'zgaruvchiga ko'rsatkich"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Production'da xato log'ga tushishi yetarli emas. Servis xatoga qarab qaror qilishi kerak: so'rovni qayta urinish, datchikni o'tkazib yuborish, navbatchini chaqirish yoki foydalanuvchiga 404 qaytarish. Qaror qabul qilish uchun xato matnini emas, xato qiymatini tekshirish kerak. Matnni `strings.Contains(err.Error(), "not found")` bilan tekshiradigan kod har bir kutubxona yangilanishida, har bir tarjima yoki matn tuzatishida jimgina buziladi.

Ikkinchi og'riq: xatoga kontekst qo'shish. `collect dut-7: datchik dut-7: signal yo'q` kabi zanjir diagnostika uchun yaxshi, lekin xatoni `fmt.Errorf("...: %v", err)` bilan o'rasangiz, asl xato qiymati yo'qoladi va faqat matn qoladi. Go 1.13 gacha bu ikki ehtiyoj ziddiyatda edi: kontekst qo'shsangiz, tekshirish imkoniyatini yo'qotasiz. Go 1.13 `Unwrap` konvensiyasini, `errors.Is`, `errors.As` va `%w` verb'ini qo'shib buni hal qildi. Go 1.20 zanjirni daraxtga aylantirdi (`errors.Join`, bir nechta `%w`), Go 1.26 esa `errors.AsType` ni qo'shdi.

Node.js/TypeScript'dan kelgan dasturchi uchun taqqoslash foydali: u yerda `catch (e)` ichida `e instanceof NotFoundError` yoki `e.cause` (ES2022) ishlatiladi. Go'da exception yo'q, xato oddiy qiymat, shuning uchun uni tekshirish ham oddiy qiymat operatsiyalari bilan, lekin zanjirni to'g'ri aylanadigan standart funksiyalar orqali bajariladi.

## Asosiy g'oya

`error` - bitta metodli interface: `Error() string`. Go blogi (Working with Errors in Go 1.13) shuni eslatadi: standart kutubxona uzoq vaqt faqat `errors.New` va `fmt.Errorf` bilan cheklangan edi, ma'lumot qo'shish esa o'zingizning tip yozishingizga qoldirilgan. Boshqa xatoni ichiga olgan tiplar shu qadar keng tarqaldiki (`os.PathError` kabi), Go 1.13 buning uchun aniq konvensiya kiritdi.

Konvensiya: boshqa xatoni o'z ichiga olgan xato `Unwrap() error` metodini amalga oshirishi mumkin. `e1.Unwrap()` `e2` ni qaytarsa, `e1` `e2` ni o'raydi (wraps) deymiz. Takroriy `Unwrap` natijasi error chain deb ataladi. Shu konvensiya ustiga uchta funksiya qurilgan:

- `errors.Is(err, target)` - zanjirdagi biror xato `target`ga teng yoki o'zining `Is(error) bool` metodi orqali mos deb e'lon qilsa, `true` qaytaradi. Oddiy holda sentinel bilan `==` taqqoslashga o'xshaydi, lekin zanjir bo'ylab.
- `errors.As(err, &target)` - zanjirdagi birinchi mos tipni topib, `target`ga yozadi. Oddiy holda type assertion'ga o'xshaydi, lekin zanjir bo'ylab.
- `errors.Unwrap(err)` - bir qadam ichkariga. Blog odatda `Is` va `As` yaxshiroq ekanini yozadi, chunki ular butun zanjirni bir chaqiruvda tekshiradi.

Xatoni o'rash uchun `fmt.Errorf("collect %s: %w", id, err)` yoziladi. `%w` boshqa jihatdan `%v` bilan bir xil, ya'ni matn bir xil chiqadi, farqi faqat natijada `Unwrap` metodi borligida. Bu muhim: o'rash qaroridan qat'i nazar, odam o'qiydigan matn bir xil. Tanlov dastur qanday ma'lumotga ega bo'lishi haqida.

### Wrap qilish yoki qilmaslik

Blog bu savolga yagona javob yo'qligini yozadi, lekin qoida aniq: xatoni chaqiruvchiga ochish uchun o'rang, implementatsiya tafsilotini ochib qo'ymaslik uchun o'ramang. Blogdagi misol: `LookupUser` ichida `database/sql` ishlatilsa va siz `fmt.Errorf("accessing DB: %w", err)` qaytarsangiz, chaqiruvchi `errors.Is(err, sql.ErrNoRows)` deb yoza oladi. Shundan keyin siz `sql.ErrNoRows`ni abadiy qaytarishga majbursiz, hatto boshqa database paketiga o'tsangiz ham. Boshqacha aytganda, wrapping xatoni API'ning bir qismiga aylantiradi. Agar bu majburiyatni olishni xohlamasangiz, `%v` ishlating yoki xatoni o'z xatoingizga tarjima qiling (32-dars). Aksincha, funksiya chaqiruvchi bergan `io.Reader`dan o'qiyotgan bo'lsa, reader xatosini o'rash to'g'ri: reader chaqiruvchiniki, uning xatosini ko'rish chaqiruvchining huquqi.

## Chuqurroq: daraxt, Is, As va AsType

### Chain emas, daraxt (Go 1.20 dan)

Pkg.go.dev hujjatiga ko'ra `errors.Join` Go 1.20 da qo'shilgan. U berilgan xatolarni o'raydi, `nil` qiymatlarni tashlab yuboradi, hammasi `nil` bo'lsa `nil` qaytaradi, matni esa xatolar matnining yangi qator bilan birlashmasi. Natija `Unwrap() []error` metodini amalga oshiradi. `fmt.Errorf` ham bir nechta `%w` ni qabul qiladi: fmt hujjatiga ko'ra bunda natija `[]error` qaytaruvchi `Unwrap` metodiga ega bo'ladi, operandlar argumentlardagi tartibda.

Natijada "zanjir" aslida daraxt. `errors.Is` va `errors.As` hujjatiga ko'ra daraxt `err`ning o'zidan boshlanadi, keyin `Unwrap() error` yoki `Unwrap() []error` natijalari bo'ylab chuqurlik bo'yicha birinchi (depth-first) tartibda aylanadi. Muhim oqibat: `errors.Unwrap` faqat `Unwrap() error` shaklini chaqiradi va `Join` natijasini ochmaydi, ya'ni `nil` qaytaradi. Kod `errors.Unwrap` bilan zanjirni qo'lda aylansa, `Join` ichiga kirmaydi. Shuning uchun daraxtni faqat `Is`/`As`/`AsType` orqali tekshiring.

`Join` mustaqil xatolarni jamlash uchun: bir nechta datchikni parallel o'qiganda hammasining xatosini qaytarish, `Close` xatolarini yig'ish, validatsiyada barcha buzilgan maydonlarni birdan ko'rsatish. Sabab-oqibat zanjiri uchun esa oddiy `%w` qoladi.

### Is: tenglik va Is metodi

Hujjat bo'yicha xato maqsadga mos hisoblanadi, agar u maqsadga teng bo'lsa yoki `Is(error) bool` metodi `true` qaytarsa. Taqqoslanmaydigan tipli `target` bilan `Is` panic qilmaydi: `==` solishtirish o'tkazilmaydi, mos kelish faqat `Is` metodi orqali bo'lishi mumkin (Go 1.24.7 da tekshirildi: slice maydonli xato tipi uchun `errors.Is` `false` qaytardi). `Is` metodi faqat sayoz taqqoslashi kerak: `Unwrap`ni chaqirmasligi, zanjirni o'zi aylanmasligi lozim, aylanishni `errors.Is` bajaradi. Blog bunga shablon xato misolini keltiradi: shablondagi nol maydonlar "farqi yo'q" ma'nosini beradi. Quyidagi misolda aynan shu naqsh ishlatilgan.

### As: pointer talabi

`errors.As(err, &target)` ikkinchi argumenti `any` bo'lgani uchun kompilyator tipni tekshirmaydi. Hujjat talabi: `target` - `error`ni amalga oshiruvchi tipga yoki istalgan interface tipiga nol bo'lmagan ko'rsatkich bo'lishi shart. Buzilsa, `As` panic qiladi, va bu klassik xato: metodlar `*SensorError` uchun e'lon qilingan bo'lsa, `var se SensorError; errors.As(err, &se)` panic beradi, to'g'ri yozuv `var se *SensorError; errors.As(err, &se)`. Blog buni "pointer to pointer" deb tushuntiradi va ko'rsatkichga ko'rsatkich odatiy emasligini, lekin bu yerda to'g'ri ekanini aytadi: uni "xato tipidagi qiymatga ko'rsatkich" deb o'ylang, shu tip esa ko'rsatkich bo'lib chiqqan. `go vet` ning `errorsas` tekshiruvi bunday chaqiruvlarni kompilyatsiya vaqtida ushlaydi, quyida real chiqish bor.

`Is`dagi kabi, `As` ham xatoning o'zida `As(any) bool` metodi bo'lsa, uni chaqiradi; bu holda target'ni to'ldirish metodning vazifasi.

### AsType (Go 1.26)

Go 1.26 release notes'ga ko'ra `errors.AsType` - `As`ning generic versiyasi; type-safe, tezroq va ko'p holatda ishlatish osonroq. Pkg.go.dev hujjatidagi imzo: `func AsType[E error](err error) (E, bool)`. Mos kelgan birinchi xatoni va `true` qaytaradi, topilmasa `E`ning nol qiymatini va `false`. Mos kelish qoidasi `As`dagi bilan o'xshash: `err.(E)` type assertion o'rinli bo'lsa yoki xatoda `As(any) bool` metodi bo'lib, u `*E` uchun `true` qaytarsa.

Imzodan ikki xulosa chiqadi (bu mening imzoni o'qishimdan kelib chiqqan xulosa, lokal kompilyatsiya qilinmagan). Birinchi: `var se *SensorError` e'loni va `&` kerak emas, shuning uchun panic qilish imkoni ham yo'q: noto'g'ri target tipi kompilyatsiya vaqtida ushlanadi. Ikkinchi: `E` cheklovi `error`, demak `As` kabi "istalgan interface" bo'yicha qidirib bo'lmaydi: `Timeout() bool` kabi faqat xulq-atvor interface'i `error`ni amalga oshirmaydi va `E` sifatida o'tmaydi. Bunday holatda `error`ni o'z ichiga olgan interface e'lon qiling yoki `As` ishlating. Hujjat `As` haqida ham "ko'p holatda AsType afzal" deydi, lekin Go 1 compatibility tufayli `As` o'chirilmaydi.

## Misol: telemetriya xatolari

Quyidagi dastur Go 1.24 da ishga tushirilgan va `go vet`dan o'tgan.

```go
package main

import (
	"errors"
	"fmt"
	"io/fs"
	"os"
)

// ErrNoSignal - datchik signal bermaganini bildiruvchi sentinel error.
var ErrNoSignal = errors.New("signal yo'q")

// SensorError qaysi datchikda xato bo'lganini saqlaydi.
type SensorError struct {
	Sensor string
	Err    error
}

func (e *SensorError) Error() string { return "datchik " + e.Sensor + ": " + e.Err.Error() }

func (e *SensorError) Unwrap() error { return e.Err }

func readFuel(id string) error {
	if id == "dut-7" {
		return &SensorError{Sensor: id, Err: ErrNoSignal}
	}
	_, err := os.Open("/nonexistent/" + id)
	return err
}

func collect(id string) error {
	if err := readFuel(id); err != nil {
		return fmt.Errorf("collect %s: %w", id, err)
	}
	return nil
}

func main() {
	err := collect("dut-7")
	fmt.Println(err)
	fmt.Println("Is ErrNoSignal:", errors.Is(err, ErrNoSignal))
	fmt.Println("== ErrNoSignal:", err == ErrNoSignal)

	var se *SensorError
	if errors.As(err, &se) {
		fmt.Println("As: datchik =", se.Sensor)
	}

	err = collect("dut-9")
	fmt.Println(err)
	fmt.Println("Is fs.ErrNotExist:", errors.Is(err, fs.ErrNotExist))
	var pe *fs.PathError
	if errors.As(err, &pe) {
		fmt.Println("As: op =", pe.Op, "path =", pe.Path)
	}

	joined := errors.Join(collect("dut-7"), nil, collect("dut-9"))
	fmt.Printf("Join:\n%v\n", joined)
	fmt.Println("Join Is ErrNoSignal:", errors.Is(joined, ErrNoSignal))
	fmt.Println("Unwrap(Join):", errors.Unwrap(joined))

	multi := fmt.Errorf("sinxronlash: %w va %w", ErrNoSignal, fs.ErrPermission)
	fmt.Println(multi)
	fmt.Println("multi Is ErrNoSignal:", errors.Is(multi, ErrNoSignal), "Is ErrPermission:", errors.Is(multi, fs.ErrPermission))
	fmt.Println("Unwrap(multi):", errors.Unwrap(multi))
}
```

Chiqish (Go 1.24.7, linux/amd64):

```text
collect dut-7: datchik dut-7: signal yo'q
Is ErrNoSignal: true
== ErrNoSignal: false
As: datchik = dut-7
collect dut-9: open /nonexistent/dut-9: no such file or directory
Is fs.ErrNotExist: true
As: op = open path = /nonexistent/dut-9
Join:
collect dut-7: datchik dut-7: signal yo'q
collect dut-9: open /nonexistent/dut-9: no such file or directory
Join Is ErrNoSignal: true
Unwrap(Join): <nil>
sinxronlash: signal yo'q va permission denied
multi Is ErrNoSignal: true Is ErrPermission: true
Unwrap(multi): <nil>
```

Nimalarni ko'rish kerak:

- `err == ErrNoSignal` `false`, `errors.Is` `true`: `collect` ikki qatlam o'ragan.
- `os.Open` xatosi `*fs.PathError` bo'lib, u `fs.ErrNotExist`ni o'raydi, shuning uchun platformaga bog'liq bo'lmagan `errors.Is(err, fs.ErrNotExist)` ishlaydi. Xato matniga (`no such file or directory`) tayanish esa operatsion tizimga bog'liq.
- `errors.Unwrap(joined)` va `errors.Unwrap(multi)` ikkalasi ham `nil`: ikkalasi `Unwrap() []error` beradi, lekin `Is`/`As` ularni ochadi (`multi` uchun ikkala sentinel ham `true`).

As'ning pointer talabini buzadigan kod:

```go
var se SensorError // xato: *SensorError emas
fmt.Println(errors.As(err, &se))
```

`go vet` va `go run` natijasi (Go 1.24.7):

```text
second argument to errors.As must be a non-nil pointer to either a type that implements error, or to any interface type
panic: errors: *target must be interface or implement error
```

Birinchi qator `go vet`dan, ikkinchisi dastur ishga tushgandagi panic xabari. Shuning uchun CI'da `go vet` majburiy.

`Is` metodi bilan shablon xato:

```go run
package main

import (
	"errors"
	"fmt"
)

// QuotaError - shablon sifatida ham ishlatiladigan xato: nol maydonlar "farqi yo'q" degani.
type QuotaError struct {
	Tenant string
	Limit  int
}

func (e *QuotaError) Error() string {
	return fmt.Sprintf("kvota oshdi: tenant=%s limit=%d", e.Tenant, e.Limit)
}

// Is shablon bilan taqqoslaydi: shablondagi nol qiymatli maydonlar e'tiborga olinmaydi.
func (e *QuotaError) Is(target error) bool {
	t, ok := target.(*QuotaError)
	if !ok {
		return false
	}
	return (t.Tenant == "" || t.Tenant == e.Tenant) && (t.Limit == 0 || t.Limit == e.Limit)
}

func main() {
	err := fmt.Errorf("ingest: %w", &QuotaError{Tenant: "fleet-12", Limit: 1000})
	fmt.Println(errors.Is(err, &QuotaError{}))
	fmt.Println(errors.Is(err, &QuotaError{Tenant: "fleet-12"}))
	fmt.Println(errors.Is(err, &QuotaError{Tenant: "fleet-99"}))

	var nilErr error
	fmt.Println(fmt.Errorf("sinxronlash: %w", nilErr))
}
```

```text
true
true
false
sinxronlash: %!w(<nil>)
```

Oxirgi qator: `nil` xatoni `%w` bilan o'rash `%!w(<nil>)` chiqaradi, ya'ni `fmt` operandni xato deb tanimaydi. `err != nil` tekshiruvi `Errorf` dan oldin turishi kerak.

Go 1.26 va undan yangi toolchain'da `As` o'rniga yozish mumkin bo'lgan variant. **Bu kod lokal kompilyatsiya qilinmagan** (sandbox'da Go 1.24), u pkg.go.dev'dagi imzoga va release notes'ga tayanadi:

```go
if se, ok := errors.AsType[*SensorError](err); ok {
	fmt.Println("datchik:", se.Sensor)
}
```

`var se` e'loni yo'q, `&` yo'q, nom `if` ichida yashaydi.

## Qachon qo'llamaslik kerak

- Implementatsiya tafsilotini ochmang. Ichki database, HTTP client yoki parser xatosini `%w` bilan o'rash uni API'ga aylantiradi (yuqoridagi `sql.ErrNoRows` misoli). Chegarada `%v` yoki tarjima ishlating.
- `errors.Is` ni "hamma narsani tekshirish" uchun ishlatmang. Har bir chaqiruvchi o'nlab sentinel'ni ketma-ket tekshirsa, bu xato dizaynining belgisi: xulq-atvor interface'i yoki bitta tip yaxshiroq (32-dars).
- `errors.Join` ni sabab zanjiri o'rniga ishlatmang. U mustaqil xatolar uchun; bitta amal ichidagi kontekst qatlamlari uchun `%w` yoziladi.
- Xato matnini tekshirmang. `strings.Contains(err.Error(), ...)` tarjima, kutubxona versiyasi va OS bo'yicha o'zgaradi. Istisno: faqat log yoki test xabarlari uchun.
- Har qatlamda mexanik ravishda o'ramang. `failed to X: failed to Y: failed to Z` kabi takroriy prefikslar o'qishni qiyinlashtiradi; har qatlam faqat o'zi biladigan ma'lumotni (amal nomi, identifikator) qo'shsin.
- Chuqur ichki tsiklda `errors.Is`ning narxi haqida taxmin qilmang: o'lchang (61-dars). Bu darsda ns/op o'lchanmagan va release notes'dagi "tezroq" iborasi aniq raqam bermaydi.

## Stack'da: Node.js/TypeScript bilan solishtirish

- `instanceof` va `e.cause` o'rniga `errors.As` va zanjir. TypeScript'da `catch (e: unknown)` ni toraytirish kerak bo'lgani kabi, Go'da ham xatoning tipini aniq so'rash kerak, faqat bu yerda tekshiruv standart kutubxona funksiyasi orqali.
- JavaScript'da `AggregateError` va `Promise.allSettled` natijalarini qo'lda yig'asiz; Go'da `errors.Join` shunday vazifani bajaradi va natijasi `Is`/`As` bilan tekshiriladi.
- Servis chegarasida (HTTP handler, gRPC interceptor) xatoni status kodiga aylantiradigan bitta joy bo'lsin: `errors.Is(err, ErrNotFound)` yoki `errors.As` bilan. Ichki qatlamlar `%w` bilan kontekst qo'shadi, chegara esa qaror qiladi. Bu 74 va 92-darslarda davom etadi.
- Kodni tekshirish: `go vet` (errorsas) CI'da ishlasin; u `errors.As` ga noto'g'ri target berilishini ushlaydi.

## Xulosa

- `error` oddiy interface; zanjir `Unwrap() error` konvensiyasi va `%w` verb'i bilan quriladi, `%w` matnni `%v` kabi yozadi.
- Qaror qilish uchun `errors.Is` (qiymat) va `errors.As` (tip) ishlating; `==` va type assertion faqat eng tashqi qatlamni ko'radi.
- Go 1.20 dan beri xato daraxti bo'lishi mumkin (`errors.Join`, bir nechta `%w`); `errors.Unwrap` `Join` ichiga kirmaydi, `Is`/`As` chuqurlik bo'yicha birinchi tartibda aylanadi.
- `errors.As` target'i xato tipiga ko'rsatkich bo'lishi shart, aks holda panic; `go vet` buni ushlaydi.
- Go 1.26 da `errors.AsType[E error](err) (E, bool)` qo'shilgan (lokal kompilyatsiya qilinmagan); `As` o'z joyida qoladi.
- Wrapping xatoni API'ga aylantiradi: ochishni ongli qaror qiling, aks holda `%v` yoki tarjima.
