---
n: 32
slug: error-dizayni
title: "Error dizayni: sentinel, typed va opaque error'lar"
summary: "Paket xatolarini chaqiruvchi qanday tekshirishiga qarab loyihalash: sentinel qiymat, ma'lumotli tip, faqat xulq-atvor ochiq bo'lgan opaque error; qatlam chegarasida tarjima, xatoni bir marta qayta ishlash va xato matni qoidalari."
duration: 40
sources:
  - id: blog-error-handling
    note: "error interface, errors.New/fmt.Errorf, ma'lumotli xato tiplari (SyntaxError.Offset), net.Error'dagi qo'shimcha metodlar, takroriy xatoni bartaraf etish (appHandler)"
  - id: blog-errors-go113
    note: "Errors and package APIs bo'limi: sentinel'ni o'rab qaytarish, xatoni %v bilan qayta o'rash; Whether to Wrap bo'limi"
  - id: 100go
    note: "Error Management bo'limi: #49 (wrap qilish), #50 va #51 (Is/As bilan taqqoslash), #52 (xatoni ikki marta qayta ishlash), #53 va #54"
  - id: code-review-comments
    note: "Error Strings, Handle Errors, In-Band Errors va Indent Error Flow bo'limlari"
quiz:
  - q: "Ikki xato holati bor: (1) hisobda mablag' yetarli emas, buni deyarli har bir chaqiruvchi tekshiradi; (2) to'lov rad etildi, kerakli ma'lumot rad etish kodi. Qaysi dizayn mos?"
    options:
      - "Ikkalasi uchun ham faqat xato matni, chaqiruvchi matnni tekshiradi"
      - "Ikkalasi uchun ham sentinel qiymat, kodni esa matnga qo'shib yoziladi"
      - "(1) uchun sentinel qiymat (`ErrInsufficientFunds`), (2) uchun `Code` maydonli xato tipi"
      - "Ikkalasi uchun ham panic, chaqiruvchi recover qiladi"
    answer: 2
    explain: "100 Go Mistakes qoidasi: kutilgan xatolar qiymat (sentinel) sifatida, kutilmagan va qo'shimcha ma'lumot talab qiladigan xatolar tip sifatida loyihalanadi. Matnni tekshirish buziladigan usul, kodni matnga qo'shish esa chaqiruvchini uni qayta tahlil qilishga majbur qiladi. Panic oddiy xato holati uchun emas (33-dars)."
  - q: "Servis qatlami `store` xatosini `logger.Printf` bilan yozib, keyin `fmt.Errorf(\"service: %w\", err)` qaytaradi; handler esa uni yana log qiladi. Nima noto'g'ri va nima qilish kerak?"
    options:
      - "Xato ikki marta qayta ishlanadi (log ham xatoni qayta ishlash). O'rab qaytaring, log'ni faqat chegarada (handler) yozing"
      - "Hech narsa noto'g'ri emas, ko'p log yaxshi"
      - "Xatoni log qilib, `nil` qaytarish kerak, shunda chaqiruvchi bilmaydi"
      - "Log'ni service'da qoldirib, handler'da `panic(err)` chaqirish kerak"
    answer: 0
    explain: "100 Go Mistakes #52: xatoni log qilish uni qayta ishlash degani, shuning uchun log qilish yoki qaytarish tanlanadi, ikkalasi emas. Ikki marta log debug'ni qiyinlashtiradi (bir xato ikki qatorda). Xatoni yutib nil qaytarish chaqiruvchini yolg'on muvaffaqiyat bilan aldaydi."
  - q: "Code Review Comments qoidasiga mos xato qatori qaysi?"
    options:
      - "`errors.New(\"Cannot open file.\")`"
      - "`errors.New(\"ERROR: cannot open file\")`"
      - "`fmt.Errorf(\"Cannot open file %q\", name)`"
      - "`fmt.Errorf(\"cannot open file %q\", name)`"
    answer: 3
    explain: "Xato qatori bosh harf bilan boshlanmasligi (ism yoki qisqartma bo'lmasa) va tinish belgisi bilan tugamasligi kerak, chunki u odatda boshqa kontekstdan keyin chop etiladi: `log.Printf(\"Reading %s: %v\", filename, err)`. Qolgan variantlarda bosh harf, nuqta yoki ortiqcha ERROR prefiksi bor."
  - q: "Beshta kutubxona turli tipdagi vaqtinchalik xatolarni qaytaradi, qayta urinish kodi esa hamma joyda bir xil bo'lishi kerak. Qaysi yondashuv eng kam bog'lanish beradi?"
    options:
      - "Har bir kutubxonaning xato tipini import qilib, ketma-ket `errors.As` chaqirish"
      - "`interface{ Retryable() bool }` kabi xulq-atvor interface'ini e'lon qilib, `errors.As` bilan shu interface'ni qidirish"
      - "Xato matnida `timeout` so'zini qidirish"
      - "Hamma vaqtinchalik xatolar uchun yagona global sentinel o'zgaruvchi"
    answer: 1
    explain: "As ikkinchi argument sifatida interface tipiga ko'rsatkichni qabul qiladi, shuning uchun chaqiruvchi faqat xulqni biladi va yangi tip qo'shilganda kodi o'zgarmaydi (blogdagi `net.Error` ham shu g'oyaga asoslangan). Birinchi variant kutubxonalarga bog'laydi, matn qidirish mo'rt, yagona sentinel esa har bir kutubxona xatosini o'rash va tarjima qilishni talab qiladi."
  - q: "Nega blog `return fmt.Errorf(\"%w\", ErrPermission)` ni `return ErrPermission` dan afzal ko'radi?"
    options:
      - "Chunki `%w` xatoni tezroq qaytaradi"
      - "Chunki sentinel'ni to'g'ridan-to'g'ri qaytarish kompilyatsiya xatosi"
      - "Chunki chaqiruvchilar `==` ga tayanib qolmaydi va `errors.Is` ishlatishga majbur bo'ladi; keyinroq kontekst qo'shish API'ni buzmaydi"
      - "Chunki `Is` faqat o'ralgan xatolarda ishlaydi"
    answer: 2
    explain: "Sentinel'ni to'g'ridan-to'g'ri qaytarsangiz, kimdir `err == pkg.ErrPermission` yozadi va keyin kontekst qo'shish uni buzadi. O'ralgan qiymat qaytarilsa, hamma `errors.Is` ishlatadi. Tezlik haqida da'vo yo'q, `==` kompilyatsiya bo'ladi, `Is` esa o'ralmagan xatoda ham ishlaydi."
  - q: "`func Lookup(key string) string` kalit yo'q bo'lsa `\"\"` qaytaradi. Bu dizaynning asosiy muammosi nima?"
    options:
      - "Chaqiruvchi `\"\"` ni xato belgisi sifatida tekshirishni unutishi mumkin va bo'sh qiymat bilan yo'q kalitni ajrata olmaydi. `(value, ok)` yoki `error` qaytarish kerak"
      - "Go string qaytarishga ruxsat bermaydi"
      - "Funksiya nomi `Get` bo'lishi shart"
      - "Muammo yo'q, standart kutubxona hamma joyda shunday qiladi"
    answer: 0
    explain: "Code Review Comments 'in-band errors' deb ataydi: xatoni oddiy qiymat ichida yuborish. Ko'p qiymat qaytarish buni oldini oladi va `Parse(Lookup(key))` kabi noto'g'ri ishlatish kompilyatsiya xatosiga aylanadi. Hujjat strings paketidagi ba'zi funksiyalar in-band qiymat qaytarishini tan oladi, lekin umumiy qoida xatoni alohida qiymat bilan qaytarishdir."
task:
  title: "Opaque chegara: matn tekshirish o'rniga tip va xulq"
  prompt: |
    To'lov modulida `Charge` va `Status` bor. `Status` xato matnini `strings.Contains` bilan tekshiradi, shuning uchun ledger xatosi (`ledger: lock timeout`) `timeout` so'zi sababli noto'g'ri `503` oladi. Bundan tashqari `Charge` ichki drayver xatosini `%w` bilan o'raydi, ya'ni chaqiruvchi `errors.Is(err, errDriverTimeout)` yoza oladi va ichki xato API'ga aylanib qoladi.

    Kodni qayta loyihalang:
    - `ErrInvalidAmount` sentinel (kutilgan xato), `Charge` uni `%w` bilan o'rab qaytarsin (summa xabarga qo'shilsin).
    - `*DeclinedError` tipi (`Code` maydoni bilan), limit oshganda qaytsin.
    - Gateway nosozligi uchun `Retryable() bool` metodli xato tipi; ichki `errDriverTimeout` unga `%v` bilan yozilsin (o'ralmasin).
    - Ledger xatosi `%v` bilan qayta yozilsin (o'ralmasin) va `500` olsin.
    - `Status` faqat `errors.Is`, `errors.As` va xulq interface'i bilan ishlasin, matnga qaramasin.

    `main`ni o'zgartirmang. Kutilgan chiqish: `50 200 false`, `0 400 false`, `5000 402 false`, `13 503 false`, `7 500 false`.
  lang: go
  starter: |
    package main

    import (
        "errors"
        "fmt"
        "strings"
    )

    // errDriverTimeout - gateway drayverining ichki xatosi.
    var errDriverTimeout = errors.New("driver: timeout")

    // errLedger - hisob-kitob jadvalidagi ichki xato.
    var errLedger = errors.New("ledger: lock timeout")

    // Charge to'lovni bajaradi.
    func Charge(amount int) error {
        switch {
        case amount <= 0:
            return errors.New("payments: invalid amount")
        case amount > 1000:
            return errors.New("payments: declined (limit)")
        case amount == 13:
            return fmt.Errorf("payments: gateway: %w", errDriverTimeout)
        case amount == 7:
            return fmt.Errorf("payments: ledger: %w", errLedger)
        }
        return nil
    }

    // Status xatoni HTTP statusiga aylantiradi.
    func Status(err error) int {
        if err == nil {
            return 200
        }
        msg := err.Error()
        switch {
        case strings.Contains(msg, "invalid"):
            return 400
        case strings.Contains(msg, "declined"):
            return 402
        case strings.Contains(msg, "timeout"):
            return 503
        }
        return 500
    }

    func main() {
        for _, a := range []int{50, 0, 5000, 13, 7} {
            err := Charge(a)
            fmt.Println(a, Status(err), errors.Is(err, errDriverTimeout) || errors.Is(err, errLedger))
        }
    }
  solution: |
    package main

    import (
        "errors"
        "fmt"
    )

    // errDriverTimeout - gateway drayverining ichki xatosi.
    var errDriverTimeout = errors.New("driver: timeout")

    // errLedger - hisob-kitob jadvalidagi ichki xato.
    var errLedger = errors.New("ledger: lock timeout")

    // ErrInvalidAmount - summa noto'g'ri (kutilgan holat).
    var ErrInvalidAmount = errors.New("payments: invalid amount")

    // DeclinedError - to'lov rad etilgan, sababi Code maydonida.
    type DeclinedError struct {
        Code string
    }

    func (e *DeclinedError) Error() string { return "payments: declined (" + e.Code + ")" }

    // unavailableError - vaqtinchalik nosozlik, ichki sababni o'ramaydi.
    type unavailableError struct{ msg string }

    func (e *unavailableError) Error() string   { return e.msg }
    func (e *unavailableError) Retryable() bool { return true }

    // Charge to'lovni bajaradi.
    func Charge(amount int) error {
        switch {
        case amount <= 0:
            return fmt.Errorf("amount %d: %w", amount, ErrInvalidAmount)
        case amount > 1000:
            return &DeclinedError{Code: "limit"}
        case amount == 13:
            // %v: errDriverTimeout API'ga chiqmaydi, faqat Retryable xulqi ochiq.
            return &unavailableError{msg: fmt.Sprintf("payments: gateway: %v", errDriverTimeout)}
        case amount == 7:
            return fmt.Errorf("payments: ledger: %v", errLedger)
        }
        return nil
    }

    // Status xatoni HTTP statusiga aylantiradi.
    func Status(err error) int {
        var de *DeclinedError
        var r interface{ Retryable() bool }
        switch {
        case err == nil:
            return 200
        case errors.Is(err, ErrInvalidAmount):
            return 400
        case errors.As(err, &de):
            return 402
        case errors.As(err, &r) && r.Retryable():
            return 503
        }
        return 500
    }

    func main() {
        for _, a := range []int{50, 0, 5000, 13, 7} {
            err := Charge(a)
            fmt.Println(a, Status(err), errors.Is(err, errDriverTimeout) || errors.Is(err, errLedger))
        }
    }
  solutionNotes: |
    - Kutilgan holat (`ErrInvalidAmount`) qiymat, ma'lumotli holat (`DeclinedError`) tip, vaqtinchalik nosozlik esa xulq (`Retryable`) orqali ifodalandi. Har biri chaqiruvchiga kerak bo'lgan minimal ma'lumotni ochadi.
    - `%v` ichki xatoni matn sifatida saqlaydi (log uchun foydali), lekin `Unwrap` yaratmaydi, shuning uchun `errors.Is(err, errDriverTimeout)` `false`. Bu blogdagi 'wrapping xatoni API'ning bir qismiga aylantiradi' ogohlantirishiga amal qilish.
    - `errors.As(err, &r)` bilan interface'ni qidirish mumkin, chunki `As` hujjatiga ko'ra target istalgan interface tipiga ko'rsatkich bo'la oladi.
    - Ledger xatosi uchun alohida holat yo'q: u noma'lum xato sifatida `500` oladi. Matnda `timeout` so'zi borligi hech narsani o'zgartirmaydi.
  checklist:
    - "`Status` ichida `strings` paketi ishlatilmaydi"
    - "`errors.Is(err, errDriverTimeout)` va `errors.Is(err, errLedger)` ikkalasi ham `false`"
    - "13 miqdori `503`, 7 miqdori `500` beradi"
    - "`ErrInvalidAmount` `%w` bilan o'ralgan, `DeclinedError` tipi `errors.As` bilan topiladi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Xato qaytarish oson, uni to'g'ri loyihalash qiyin. Paket muallifi har bir `return err` bilan chaqiruvchilarga tekshirish uchun nimadir taklif qiladi: matn, qiymat, tip yoki hech narsa. Keyin bu taklif API'ning bir qismiga aylanadi va uni o'zgartirish chaqiruvchilarni buzadi. Production'da bu uch xil og'riq beradi.

Birinchisi: chaqiruvchilar xato matnini tekshiradi, chunki paket boshqa imkoniyat bermagan. Matn o'zgarsa, yetkazib berish qismi, tarjima yoki kutubxona yangilanishi jimgina qaror mantiqini buzadi. Ikkinchisi: ichki implementatsiya (database driver, HTTP client) xatosi sizib chiqadi, chaqiruvchilar `pgconn.PgError` ga tayanib qoladi va storage'ni almashtirish ko'p paketlarga tegadi. Uchinchisi: bir xato uch qatlamda log qilinadi, incident paytida bitta nosozlik uch xil qator bo'lib ko'rinadi.

Go jamoasining qarori shu: xato oddiy qiymat, uning ma'nosini paket muallifi hujjatda belgilaydi. Shuning uchun dizayn savoli "qanday xato yarataman" emas, "chaqiruvchi bu xato bilan nima qiladi" bo'ladi. Bu dars uch javobni ko'rib chiqadi: sentinel qiymat, ma'lumotli tip va faqat xulq-atvor ochiq bo'lgan opaque (shaffof bo'lmagan) xato.

## Asosiy g'oya

Go blogi (Error handling and Go) `error`ni bitta metodli interface deb tushuntiradi va natijani muhim aytadi: xato qiymati o'zini tavsiflashi kerak. `os.Open` qaytargan xato `open /etc/passwd: permission denied` deb chop etiladi, shunchaki `permission denied` emas: kontekstni umumlashtirish xato amalga oshiruvchisining vazifasi. Xuddi shu blog xatoga nimadir ma'lumot qo'shish uchun o'z tipingizni yozishingiz mumkinligini ko'rsatadi: `json.SyntaxError` ning `Offset` maydoni standart formatlashda ko'rinmaydi, lekin chaqiruvchi uni qator va ustun raqamini hisoblashda ishlatadi.

Shundan uchta dizayn chiqadi.

| Dizayn | Chaqiruvchi nimani tekshiradi | Qachon mos | Narxi |
|---|---|---|---|
| Sentinel qiymat | `errors.Is(err, pkg.ErrX)` | Kutilgan holat, ko'pchilik tekshiradi (topilmadi, kvota tugadi) | Qiymat API'ning doimiy qismi, ma'lumot qo'shib bo'lmaydi |
| Xato tipi | `errors.As(err, &typed)` | Kutilmagan yoki ma'lumotli holat (rad etish kodi, offset, maydon nomi) | Tip va uning maydonlari API'ga kiradi |
| Opaque (xulq) | Faqat `err != nil` yoki xulq interface'i | Ichki tafsilotni yashirish kerak; chaqiruvchiga faqat qaror kerak | Chaqiruvchi sababni bilmaydi, diagnostika matnga tayanadi |

100 Go Mistakes (#51) umumiy yo'riqnomani beradi: kutilgan xatolar qiymat (`var ErrNotFound = errors.New("not found")`, nomi `Err` bilan boshlanadi), kutilmagan xatolar tip sifatida loyihalanadi. Sentinel xatoni global o'zgaruvchi sifatida e'lon qilish, o'ralgan holda esa `==` o'rniga `errors.Is` bilan tekshirish kerak (#51), tipni esa `errors.As` bilan (#50).

### Xulq-atvor interface'i

Blogdagi `net.Error` misoli: `error`ni o'z ichiga olgan interface qo'shimcha metodlar qo'shadi (`Timeout() bool`, `Temporary() bool`). Mijoz kodi tipni emas, xulqni so'raydi: veb-crawler vaqtinchalik xatoda uxlab qayta urinadi, aks holda to'xtaydi. Shu naqshning afzalligi: chaqiruvchi kutubxona tiplarini import qilmaydi, yangi xato tipi mos metodni amalga oshirsa, hech narsa o'zgarmaydi. `errors.As` ikkinchi argument sifatida interface tipiga ko'rsatkichni qabul qilgani (31-dars) bu naqshni to'g'ridan-to'g'ri qo'llab-quvvatlaydi.

## Chuqurroq: chegaradagi qarorlar

### Tarjima: ichki xato API'ga chiqmasin

Go 1.13 blogi qoidani aniq beradi: boshqa paketdan xato olib qaytarayotgan bo'lsangiz, uni asl xatoni oshkor qilmaydigan shaklga aylantiring, agar kelajakda aynan shu xatoni qaytarishga tayyor bo'lmasangiz. Blogdagi usul: `%w` o'rniga `%v` bilan qayta o'rash, bunda matn bir xil, lekin chaqiruvchi `Unwrap` orqali asl xatoga yeta olmaydi. 100 Go Mistakes #49 buni "error transformation" deb ataydi va wrapping potensial bog'lanish yaratishini ta'kidlaydi.

Repository qatlami uchun amaliy shakl: `sql.ErrNoRows` qatlam ichida uziladi va paketning o'z `ErrNotFound`iga aylanadi; qolgan hamma xatolar matn sifatida saqlanib, xulq (masalan `Retryable`) bilan belgilanadi. Quyidagi misolda aynan shu ko'rsatilgan.

### Sentinel'ni o'ralgan holda qaytaring

Blog yana bir nozik qoidani beradi: agar funksiya hujjatida "`ErrPermission`ni o'rab qaytaradi" desa, uni to'g'ridan-to'g'ri qaytarmang. To'g'ridan-to'g'ri qaytarilgan sentinel'ni kimdir `err == pkg.ErrPermission` bilan tekshiradi va keyin kontekst qo'shish kodni buzadi. O'ralgan qiymat qaytarilsa, hamma `errors.Is`ga majbur bo'ladi. Blogning o'z yo'li: `fmt.Errorf("%w", ErrPermission)`. Shartnomani hujjatga yozing: "FetchItem nom bo'yicha topilmasa, `ErrNotFound`ni o'raydigan xato qaytaradi".

### Xatoni bir marta qayta ishlash

100 Go Mistakes #52: xatoni log qilish uni qayta ishlash degani. Shuning uchun xato yo log qilinadi, yo qaytariladi. Ikkalasi bir vaqtda qilinsa, bir nosozlik bir nechta log qatori hosil qiladi va incident tahlilini chalkashtiradi. Yechim: quyi qatlamlar kontekst qo'shib qaytaradi (`%w`), log esa chegarada (HTTP handler, worker tsikli) bir marta yoziladi. Bu Go blogidagi `appHandler` naqshiga to'g'ri keladi: handler xato qaytaradi, takroriy `if err != nil { http.Error(...) }` bloklari esa bitta `ServeHTTP` metodiga ko'chadi.

### Xato qatori qoidalari va boshqa kichik qoidalar

Code Review Comments xato qatorlari bosh harf bilan boshlanmasin (ism yoki qisqartma bo'lmasa) va tinish belgisi bilan tugamasin, deydi, chunki ular odatda boshqa kontekstdan keyin chop etiladi (`log.Printf("Reading %s: %v", filename, err)`). Bu qoida log xabarlariga tegishli emas, ular alohida qatordir.

Xuddi shu hujjat xatoni `_` bilan tashlab yubormaslikni talab qiladi: yo qayta ishlang, yo qaytaring, yo juda istisno holatda panic qiling. 100 Go Mistakes #53 va #54: agar xatoni ataylab e'tiborsiz qoldirsangiz (masalan, `defer` ichidagi `Close`), buni `_ = f.Close()` kabi aniq yozing va sababini izohlang, shunda keyingi o'quvchi bu unutilmaganini biladi.

In-band xatolar (Code Review Comments): `Lookup(key) string` bo'sh qatorni "yo'q" ma'nosida qaytarsa, `Parse(Lookup(key))` noto'g'ri xabar beradi. Go'da ko'p qiymat qaytarish bor: `(value, ok)` yoki `(value, error)`. Va oxirgi qoida: xato yo'lini kichik chekinishda ushlang, normal yo'l chap chetda qolsin (Indent Error Flow).

## Misol: to'lov va buyurtma chegarasi

Quyidagi dastur uchala dizaynni bitta joyda ishlatadi: `ErrNotFound` va `ErrInsufficientFunds` sentinel, `DeclinedError` tip, `unavailableError` esa `Retryable` xulqi bilan. `FindOrder` `sql.ErrNoRows`ni tarjima qiladi, boshqa xatoni `%v` bilan yashiradi. Go 1.24.7 da ishga tushirilgan, `go vet`dan o'tgan.

```go
package main

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
)

// ErrNotFound - buyurtma topilmadi. Paket API'sining bir qismi.
var ErrNotFound = errors.New("orders: not found")

// ErrInsufficientFunds - hisobda mablag' yetarli emas (kutilgan holat).
var ErrInsufficientFunds = errors.New("payments: insufficient funds")

// DeclinedError - to'lov rad etilgan, sababi Code maydonida (kutilmagan holat, ma'lumot bor).
type DeclinedError struct {
	Code string
}

func (e *DeclinedError) Error() string { return "payments: declined (" + e.Code + ")" }

// unavailableError - vaqtinchalik nosozlik; chaqiruvchi faqat Retryable xulqini biladi.
type unavailableError struct{ msg string }

func (e *unavailableError) Error() string   { return e.msg }
func (e *unavailableError) Retryable() bool { return true }

// IsRetryable xato qayta urinishga arziydimi, shuni aytadi.
func IsRetryable(err error) bool {
	var r interface{ Retryable() bool }
	return errors.As(err, &r) && r.Retryable()
}

// queryOrder database/sql qatlamini taqlid qiladi.
func queryOrder(id int) error {
	switch id {
	case 1:
		return nil
	case 2:
		return sql.ErrNoRows
	default:
		return errors.New("pq: connection reset by peer")
	}
}

// FindOrder ichki xatolarni paket xatolariga tarjima qiladi.
func FindOrder(id int) error {
	err := queryOrder(id)
	switch {
	case err == nil:
		return nil
	case errors.Is(err, sql.ErrNoRows):
		return fmt.Errorf("order %d: %w", id, ErrNotFound)
	default:
		// %v: ichki driver xatosi API'ga chiqmaydi.
		return &unavailableError{msg: fmt.Sprintf("order %d: storage: %v", id, err)}
	}
}

// Status chegarada xatoni HTTP statusiga aylantiradi.
func Status(err error) int {
	var de *DeclinedError
	switch {
	case err == nil:
		return http.StatusOK
	case errors.Is(err, ErrNotFound):
		return http.StatusNotFound
	case errors.Is(err, ErrInsufficientFunds):
		return http.StatusPaymentRequired
	case errors.As(err, &de):
		return http.StatusUnprocessableEntity
	case IsRetryable(err):
		return http.StatusServiceUnavailable
	default:
		return http.StatusInternalServerError
	}
}

func main() {
	errs := []error{
		FindOrder(1),
		FindOrder(2),
		FindOrder(3),
		fmt.Errorf("charge: %w", ErrInsufficientFunds),
		fmt.Errorf("charge: %w", &DeclinedError{Code: "stolen_card"}),
		errors.New("kutilmagan holat"),
	}
	for _, err := range errs {
		fmt.Printf("%d %v\n", Status(err), err)
	}

	err := FindOrder(2)
	fmt.Println("ErrNotFound:", errors.Is(err, ErrNotFound), "sql.ErrNoRows:", errors.Is(err, sql.ErrNoRows))
}
```

Chiqish:

```text
200 <nil>
404 order 2: orders: not found
503 order 3: storage: pq: connection reset by peer
402 charge: payments: insufficient funds
422 charge: payments: declined (stolen_card)
500 kutilmagan holat
ErrNotFound: true sql.ErrNoRows: false
```

Nimalarni ko'rish kerak:

- Oxirgi qator: `FindOrder(2)` natijasida `errors.Is(err, ErrNotFound)` `true`, `errors.Is(err, sql.ErrNoRows)` esa `false`. Storage almashsa ham chaqiruvchi kodi o'zgarmaydi.
- `FindOrder(3)` 503 beradi, lekin chaqiruvchi hech qanday driver tipini import qilmagan: faqat `IsRetryable` bor. Matnda `pq:` ko'rinadi (log uchun foydali), lekin kod unga tayanmaydi.
- `Status` tartibi: sentinel, keyin tip, keyin xulq, oxirida standart 500. Bunday markazlashtirilgan funksiya chegarada bitta bo'ladi.

Ikki marta qayta ishlash:

```go
package main

import (
	"errors"
	"fmt"
	"log"
	"os"
)

var errLock = errors.New("lock timeout")

func store() error { return errLock }

// service ham log yozadi, ham qaytaradi: xato ikki marta qayta ishlanadi.
func service(logger *log.Logger) error {
	if err := store(); err != nil {
		logger.Printf("store xatosi: %v", err)
		return fmt.Errorf("service: %w", err)
	}
	return nil
}

// handler ham log yozadi.
func handler(logger *log.Logger) {
	if err := service(logger); err != nil {
		logger.Printf("handler xatosi: %v", err)
	}
}

func main() {
	logger := log.New(os.Stdout, "", 0)
	handler(logger)
}
```

```text
store xatosi: lock timeout
handler xatosi: service: lock timeout
```

Bir nosozlik ikki qatorda: `store xatosi` va `handler xatosi`. `service` faqat o'rab qaytarsa, log chegarada bitta qatorda `service: lock timeout` chiqardi.

Go blogidagi `appHandler` naqshi bilan xatoni bitta joyda qayta ishlash va javobga aylantirish:

```go
package main

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
)

var ErrNotFound = errors.New("orders: not found")

// appHandler xato qaytaradigan handler; xatoni bitta joyda javobga aylantiramiz.
type appHandler func(w http.ResponseWriter, r *http.Request) error

func (fn appHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if err := fn(w, r); err != nil {
		status := http.StatusInternalServerError
		if errors.Is(err, ErrNotFound) {
			status = http.StatusNotFound
		}
		// Xato aynan shu yerda, bir marta log qilinadi.
		log.Printf("%s %s: %v", r.Method, r.URL.Path, err)
		http.Error(w, http.StatusText(status), status)
	}
}

func getOrder(w http.ResponseWriter, r *http.Request) error {
	id := r.URL.Query().Get("id")
	if id != "42" {
		return fmt.Errorf("order %s: %w", id, ErrNotFound)
	}
	_, err := fmt.Fprintln(w, "order 42")
	return err
}

func main() {
	log.SetFlags(0)
	log.SetOutput(os.Stdout)
	h := appHandler(getOrder)
	for _, target := range []string{"/orders?id=42", "/orders?id=7"} {
		rec := httptest.NewRecorder()
		h.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, target, nil))
		fmt.Printf("%d %q\n", rec.Code, rec.Body.String())
	}
}
```

```text
200 "order 42\n"
GET /orders: order 7: orders: not found
404 "Not Found\n"
```

Handler `getOrder` faqat xato qaytaradi; status tanlash va log `ServeHTTP` ichida, bir marta bajariladi. Mijoz `Not Found` javobini ko'radi, ichki matn (`order 7: orders: not found`) esa faqat log'da.

## Qachon qo'llamaslik kerak

- Har bir xato holati uchun alohida sentinel yoki tip yaratmang. Agar hech bir chaqiruvchi farq qilmasa, oddiy `fmt.Errorf` yetadi. Blogning o'zi eng oddiy shartnomani tavsiflaydi: amal muvaffaqiyatli bo'ladi yoki xato qaytaradi. Qo'shimcha tafsilot va'dasi doimiy majburiyat.
- Sentinel o'zgaruvchilar ro'yxatini uzaytirib borish dizayn belgisi: o'nlab `ErrX` bo'lsa, xulq-atvor interface'i yoki bitta ma'lumotli tip yaxshiroq.
- Opaque xato diagnostikani qiyinlashtirishi mumkin. `%v` ichki sababning faqat matnini saqlaydi, shuning uchun ichki matn log'ga to'liq tushishi kerak. Matnga tayanib qaror qilmang, lekin uni yo'qotmang.
- Tip dizayni bilan ortiqcha ishlamang: tip maydonlari ham API. Maydon qo'shish mumkin (keyed literal), olib tashlash yoki ma'nosini o'zgartirish esa mumkin emas (37-dars).
- `Temporary()` kabi eski xulq metodlariga tayanishdan oldin ularning hozirgi holatini hujjatdan tekshiring: bu darsda faqat `net.Error` blog misolida ko'rsatilgan, uning hozirgi ahvoli tekshirilmagan. Shuning uchun o'z xulq interface'ingizni (`Retryable`) e'lon qiling.

## Stack'da: Node.js/TypeScript bilan solishtirish

- Node.js'da xato sinflari ierarxiyasi (`class NotFoundError extends AppError`) va `instanceof` keng tarqalgan. Go'da ierarxiya yo'q: sentinel qiymat, tip va interface alohida vositalar, ularni kerakli joyda aralashtirasiz.
- Express'dagi markaziy error middleware Go'dagi `appHandler` naqshiga o'xshaydi: handler xato qaytaradi/tashlaydi, javobga aylantirish bitta joyda. Farq: Go'da xato imzoda ko'rinadi, `throw` kabi yashirin emas.
- NestJS'dagi `HttpException` filter'lari kabi, Go servisida ham domen xatosi HTTP statusidan alohida bo'lishi kerak: domen qatlami `ErrNotFound`ni qaytaradi, status esa handler chegarasida tanlanadi (92-darsda davom etadi).
- TypeScript kodingizda `err.message.includes(...)` ni ko'rgan bo'lsangiz, bu yerda uning aniq ekvivalenti `strings.Contains(err.Error(), ...)`: ikkala tilda ham mo'rt naqsh.

## Xulosa

- Dizayn savoli: chaqiruvchi bu xato bilan nima qiladi? Javobga qarab sentinel (kutilgan holat), tip (ma'lumotli holat) yoki xulq interface'i (faqat qaror kerak) tanlanadi.
- Ichki implementatsiya xatosini chegarada `%v` bilan yashiring yoki o'z xatoingizga tarjima qiling; `%w` xatoni API'ga aylantiradi.
- Hujjatda va'da qilingan sentinel'ni o'rab qaytaring, shunda chaqiruvchilar `errors.Is` ishlatadi va kontekst qo'shish API'ni buzmaydi.
- Xatoni bir marta qayta ishlang: log qilish ham qayta ishlash. Quyi qatlamlar o'rab qaytaradi, log chegarada.
- Xato qatori kichik harfda, tinish belgisiz; xatoni jimgina tashlamang, tashlasangiz `_ =` va izoh bilan.
- Matn bo'yicha qaror qilmang: u o'zgaradi, xatoni tekshiradigan kod esa buziladi.
