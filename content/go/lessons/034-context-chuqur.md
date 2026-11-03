---
n: 34
slug: context-chuqur
title: "context: bekor qilish, deadline, cause va value qoidalari"
summary: "Context daraxti, cancel va deadline ketma-ketligi, Err va Cause farqi (WithCancelCause, WithTimeoutCause), WithoutCancel va AfterFunc, WithValue qoidalari, HTTP so'rov kontekstining umri va uni noto'g'ri uzatish xatosi, lostcancel."
duration: 45
sources:
  - id: pkg-context
    note: "Package context: Context interface hujjati, WithCancel/WithDeadline/WithTimeout, WithCancelCause, WithDeadlineCause, WithTimeoutCause (go1.21), Cause (go1.20), WithoutCancel va AfterFunc (go1.21), WithValue qoidalari"
  - id: blog-context
    note: "Introduction, Context va Derived contexts bo'limlari: Cancel metodi yo'qligi sababi, kontekst daraxti; Conclusion"
  - id: 100go
    note: "#60 (Misunderstanding Go contexts) va #61 (Propagating an inappropriate context)"
  - id: code-review-comments
    note: "Contexts bo'limi: ctx birinchi parametr, struct'da saqlamaslik, maxsus Context tiplari yaratmaslik"
  - id: pkg-net-http
    note: "Request.Context hujjati: server so'rovi konteksti qachon bekor qilinadi"
  - id: go126
    note: "os/signal bo'limi: NotifyContext endi CancelCauseFunc bilan bekor qiladi"
quiz:
  - q: "`parent` 50 ms muddatli kontekst. Siz `context.WithTimeout(parent, time.Hour)` bilan bola yaratdingiz. Bolaning muddati qanday?"
    options:
      - "1 soat, chunki bola o'z muddatini o'zi belgilaydi"
      - "50 ms va 1 soatning yig'indisi"
      - "50 ms: WithDeadline ota muddatidan keyingi muddatni qabul qilmaydi, ota muddati qoladi"
      - "Kompilyatsiya xatosi"
    answer: 2
    explain: "WithDeadline hujjati: muddat ota muddatidan kech bo'lsa, natija semantik jihatdan otaning o'zi bilan teng. Shuning uchun bola otadan uzoq yashay olmaydi. Darsdagi misolda `cd.Equal(pd)` true chiqdi."
  - q: "Kodda `ctx, _ := context.WithTimeout(parent, 5*time.Second)` yozilgan. Muammo nima?"
    options:
      - "cancel funksiyasi tashlab yuborilgan: kontekst muddat tugaguncha yoki ota bekor bo'lguncha resurslarini bo'shatmaydi (context leak); `go vet` lostcancel buni ushlaydi"
      - "Hech narsa: muddat tugagach kontekst o'zi tozalanadi, cancel kerak emas"
      - "Kompilyatsiya xatosi: `_` ga yozib bo'lmaydi"
      - "Kontekst ishlamaydi, chunki cancel chaqirilmagan"
    answer: 0
    explain: "Hujjat: kontekstni bekor qilish unga bog'liq resurslarni bo'shatadi, shuning uchun amal tugashi bilan cancel chaqirilishi kerak. Kontekst muddat tugaganda ishlaydi, lekin cancel'siz erta tugagan holatda resurslar muddatgacha ushlanadi. go vet: `the cancel function returned by context.WithTimeout should be called, not discarded, to avoid a context leak`."
  - q: "`ctx, cancel := context.WithCancelCause(parent); cancel(errShutdown)`. `ctx.Err()` va `context.Cause(ctx)` nima qaytaradi?"
    options:
      - "Ikkalasi ham errShutdown"
      - "Ikkalasi ham context.Canceled"
      - "Err() errShutdown, Cause() context.Canceled"
      - "Err() context.Canceled, Cause() errShutdown"
    answer: 3
    explain: "Err() tarkibi o'zgarmaydi, bekor qilish uchun context.Canceled yoki DeadlineExceeded qaytaradi (eski kod buzilmaydi). Sababni Cause() beradi. Darsdagi misolda aynan shu chiqdi."
  - q: "HTTP handler javob yozadi va oldin `go publish(r.Context(), ...)` bilan fon ishi ishga tushirgan edi. Javobdan keyin nima bo'ladi?"
    options:
      - "Fon ishi so'rov kontekstidan mustaqil, normal tugaydi"
      - "ServeHTTP qaytgach server so'rov kontekstini bekor qiladi, fon ishi `context canceled` bilan uziladi; yechim: WithoutCancel va o'z muddati"
      - "Server fon goroutine tugaguncha javobni ushlab turadi"
      - "Fon ishi darhol panic qiladi"
    answer: 1
    explain: "Request.Context hujjati: server so'rovlari uchun kontekst mijoz ulanishi yopilganda, so'rov bekor qilinganda (HTTP/2) yoki ServeHTTP qaytganda bekor qilinadi. Darsdagi serverli misolda `r.Context()` `context canceled`, `WithoutCancel` esa nil natija berdi."
  - q: "Qaysi imzo idiomatik va nega?"
    options:
      - "`func (s *Store) Find(id int, ctx context.Context) (Order, error)`: kontekst oxirida bo'lsin"
      - "`type Store struct { ctx context.Context }`, har metod `s.ctx` ni ishlatadi"
      - "`func (s *Store) Find(ctx context.Context, id int) (Order, error)`: ctx birinchi parametr, struct'da saqlanmaydi"
      - "`var ctx = context.Background()` global o'zgaruvchi"
    answer: 2
    explain: "Paket hujjati va Code Review Comments: kontekstni struct ichida saqlamang, har bir kerakli funksiyaga birinchi parametr sifatida uzating (odatda nomi ctx). Struct ichidagi ctx so'rovlar o'rtasida ulashiladi, bekor qilish va muddat esa bitta so'rovga tegishli."
  - q: "`context.WithValue` uchun qaysi kalit tipi to'g'ri?"
    options:
      - "Eksport qilinmagan o'z tipingiz, masalan `type requestIDKey struct{}`"
      - "Oddiy qator: `\"requestID\"`"
      - "Butun son: `1`"
      - "Istalgan `any` qiymat, farqi yo'q"
    answer: 0
    explain: "Hujjat: kalit comparable bo'lishi va to'qnashuvni oldini olish uchun string yoki boshqa o'rnatilgan tipda bo'lmasligi kerak; foydalanuvchilar o'z kalit tipini e'lon qiladi, ko'pincha `struct{}`. Boshqa paket ham `\"requestID\"` ishlatsa, qiymatlar ustma-ust tushadi."
task:
  title: "So'rovdan keyin ishlaydigan audit"
  prompt: |
    `handle` so'rovni qayta ishlaydi va audit hodisasini fon goroutine'da yuboradi. Server (bu yerda `main`) `handle` qaytgach so'rov kontekstini bekor qiladi. Hozirgi variantda audit so'rov konteksti bilan yuboriladi, shuning uchun u har doim `context canceled` bilan uziladi.

    Tuzating:
    - Audit so'rov bekor qilinishiga bog'liq bo'lmasin, lekin kontekst qiymatlari (trace ID) saqlansin.
    - Audit uchun o'z muddati (1 soniya) bo'lsin va muddat tugasa sabab `errAuditSlow` bo'lsin.
    - `cancel` funksiyasi har holda chaqirilsin (`go vet` lostcancel ogohlantirmasin).
    - `publish` va `main`ni o'zgartirmang. Kutilgan chiqish: `audit trace=abc-123 err=<nil>`.
  lang: go
  starter: |
    package main

    import (
        "context"
        "fmt"
        "sync"
        "time"
    )

    type traceKey struct{}

    // publish audit hodisasini yuboradi (20 ms) yoki ctx bekor qilinsa sababini qaytaradi.
    func publish(ctx context.Context, event string) error {
        select {
        case <-time.After(20 * time.Millisecond):
            return nil
        case <-ctx.Done():
            return context.Cause(ctx)
        }
    }

    // handle so'rovni qayta ishlaydi va audit hodisasini fonda yuboradi.
    func handle(ctx context.Context, wg *sync.WaitGroup, results chan<- string) {
        trace, _ := ctx.Value(traceKey{}).(string)
        wg.Add(1)
        go func() {
            defer wg.Done()
            err := publish(ctx, "order.created")
            results <- fmt.Sprintf("audit trace=%s err=%v", trace, err)
        }()
    }

    func main() {
        results := make(chan string, 1)
        var wg sync.WaitGroup

        base := context.WithValue(context.Background(), traceKey{}, "abc-123")
        reqCtx, cancel := context.WithCancel(base)
        handle(reqCtx, &wg, results)
        cancel() // so'rov tugadi: server kontekstni bekor qiladi

        wg.Wait()
        fmt.Println(<-results)
    }
  solution: |
    package main

    import (
        "context"
        "errors"
        "fmt"
        "sync"
        "time"
    )

    type traceKey struct{}

    var errAuditSlow = errors.New("audit yuborish 1 soniyada tugamadi")

    // publish audit hodisasini yuboradi (20 ms) yoki ctx bekor qilinsa sababini qaytaradi.
    func publish(ctx context.Context, event string) error {
        select {
        case <-time.After(20 * time.Millisecond):
            return nil
        case <-ctx.Done():
            return context.Cause(ctx)
        }
    }

    // handle so'rovni qayta ishlaydi va audit hodisasini fonda yuboradi.
    func handle(ctx context.Context, wg *sync.WaitGroup, results chan<- string) {
        trace, _ := ctx.Value(traceKey{}).(string)
        // So'rov bekor qilinishi audit'ni to'xtatmasin: qiymatlar saqlanadi, o'z muddati qo'yiladi.
        bg, cancel := context.WithTimeoutCause(context.WithoutCancel(ctx), time.Second, errAuditSlow)
        wg.Add(1)
        go func() {
            defer wg.Done()
            defer cancel()
            err := publish(bg, "order.created")
            results <- fmt.Sprintf("audit trace=%s err=%v", trace, err)
        }()
    }

    func main() {
        results := make(chan string, 1)
        var wg sync.WaitGroup

        base := context.WithValue(context.Background(), traceKey{}, "abc-123")
        reqCtx, cancel := context.WithCancel(base)
        handle(reqCtx, &wg, results)
        cancel() // so'rov tugadi: server kontekstni bekor qiladi

        wg.Wait()
        fmt.Println(<-results)
    }
  solutionNotes: |
    - `context.WithoutCancel(ctx)` ota bekor qilinishini uzadi, lekin `Value` zanjirini saqlaydi, shuning uchun trace ID yo'qolmaydi. Natija kontekstida `Done` kanali `nil`, ya'ni uzluksiz.
    - `WithoutCancel` o'zi hech qanday muddat bermaydi, shuning uchun fon ishiga o'z muddatini qo'shish shart; aks holda yuborish osilib qolsa, goroutine abadiy qoladi. Bu yerda `WithTimeoutCause` muddat tugasa `errAuditSlow` sababini o'rnatadi.
    - Qaytarilgan `CancelFunc` sabab o'rnatmaydi (hujjat). Shuning uchun `defer cancel()` goroutine ichida: ish tugagach resurslar bo'shaydi.
    - Bu 100 Go Mistakes #61 dagi hol: so'rov kontekstini asinxron ishga uzatish.
  checklist:
    - "Audit `context canceled` bilan uzilmaydi, natija `err=<nil>`"
    - "Trace ID audit qatorida saqlangan (`abc-123`)"
    - "Fon kontekstida o'z muddati bor va muddat sababi `errAuditSlow`"
    - "`cancel` goroutine ichida `defer` bilan chaqiriladi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Mijoz so'rovni uzib qo'ydi, lekin servis uch soniyalik database so'rovini oxirigacha bajaryapti va natijani hech kim kutmayapti. Boshqa holat: tashqi servis sekinlashdi, har so'rov o'z goroutine'ini ushlab turibdi va minglab goroutine to'planib, xotira tugaydi. Uchinchi: so'rov oqimida trace ID kerak, lekin u beshta qatlamdan o'tadi va har funksiya imzosiga qo'shib yurish noqulay. `context` paketi aynan shu uchta muammoni hal qiladi: bekor qilish, muddat (deadline) va so'rov doirasidagi qiymatlar.

Node.js'dan kelgan dasturchi uchun yaqin tushuncha `AbortController` va `AbortSignal` (masalan `fetch(url, { signal })`), qiymatlar uchun esa `AsyncLocalStorage`. Farq shundaki, Go'da context til konvensiyasi darajasida: har bir blokirovka qiluvchi yoki tarmoqqa chiqadigan funksiya uni birinchi parametr sifatida oladi, Node.js'da esa `signal`ni qo'llab-quvvatlash har kutubxona uchun alohida qaror.

Bu darsning maqsadi `context`ning aniq semantikasi: daraxt tuzilishi, `Err` va `Cause` farqi, `WithoutCancel`, qiymat qoidalari va eng ko'p uchraydigan xato: so'rov kontekstini so'rovdan uzoq yashaydigan ishga uzatish.

## Asosiy g'oya

`context.Context` to'rtta metodli interface: `Deadline()`, `Done()`, `Err()` va `Value(key)`. Go blogi (Go Concurrency Patterns: Context) uni shunday tasvirlaydi: kontekst muddatni, bekor qilish signalini va so'rov doirasidagi qiymatlarni API chegaralari bo'ylab uzatadi; uning metodlari bir vaqtda ko'p goroutine'dan chaqirilishi xavfsiz.

Muhim dizayn qarori: `Context`da `Cancel` metodi yo'q. Blog sababini tushuntiradi: `Done` kanali faqat qabul qilish uchun bo'lgani kabi, signalni qabul qiluvchi funksiya odatda uni yuboruvchi emas. Ota operatsiya bola operatsiyalarni boshlasa, bolalar otani bekor qila olmasligi kerak. Bekor qilish huquqi kontekstni yaratgan joyda qoladi (`CancelFunc`).

Kontekstlar daraxt hosil qiladi. `Background` ildiz (hech qachon bekor qilinmaydi, qiymatsiz, muddatsiz). `WithCancel`, `WithTimeout`, `WithDeadline`, `WithValue` mavjud kontekstdan yangi bola yaratadi. Ota bekor qilinsa, barcha avlodlar ham bekor qilinadi. Bola o'zini bekor qilsa, ota o'zgarmaydi. Kontekstlar o'zgarmas (immutable) bo'lgani uchun bitta `ctx`ni bir nechta chaqiruvga berish xavfsiz (Code Review Comments).

### Paket hujjatidagi qoidalar

Paket hujjati statik tahlil mumkin bo'lishi uchun shu qoidalarni belgilaydi:

- Kontekstni struct ichida saqlamang, har funksiyaga aniq uzating.
- Kontekst birinchi parametr, odatda `ctx` nomi bilan.
- `nil` kontekst bermang; qaysi kontekst kerakligi noaniq bo'lsa, `context.TODO` ishlating.
- `Value` faqat jarayonlar va API'lar orasida yuruvchi so'rov doirasidagi ma'lumot uchun, funksiyaning ixtiyoriy parametrlarini uzatish uchun emas.
- Bitta kontekstni turli goroutine'larda ishlatish xavfsiz.

Code Review Comments qo'shimcha: maxsus Context tiplari yaratmang, signaturalarda `Context` o'rniga boshqa interface ishlatmang; faqat standart kutubxona yoki uchinchi tomon interface imzosiga moslash zarur bo'lsa struct'da `ctx` saqlash istisno.

## Chuqurroq: cancel, muddat, sabab va qiymat

### Cancel'ni doim chaqiring

`WithCancel`, `WithTimeout` va `WithDeadline` `CancelFunc` qaytaradi. Hujjat: kontekstni bekor qilish unga bog'liq resurslarni bo'shatadi, shuning uchun amal tugashi bilan cancel chaqirilishi kerak. Odatiy shakl: `ctx, cancel := context.WithTimeout(...)` va darhol `defer cancel()`. `go vet`ning lostcancel tekshiruvi cancel'ni tashlab yuborishni ushlaydi (quyida real chiqish bor). `CancelFunc` bir vaqtda ko'p goroutine'dan chaqirilishi mumkin va birinchi chaqiruvdan keyingilari hech narsa qilmaydi.

### Muddat ketma-ketligi

`WithDeadline` hujjati: ota muddati allaqachon erta bo'lsa, `WithDeadline(parent, d)` semantik jihatdan `parent`ning o'ziga teng. Ya'ni muddatlar daraxt bo'ylab faqat qisqaradi. Bu microservice zanjirida foydali: gateway 800 ms muddat qo'ysa, undan keyingi barcha chaqiruvlar shu byudjetda qoladi. `Deadline()` muddat borligini ham qaytaradi (`ok`), blog buni "ish boshlashga arziydimi" deb baholash uchun ishlatish mumkinligini aytadi.

### Err va Cause (Go 1.20, 1.21)

`ctx.Err()` o'zgarmagan: `context.Canceled` yoki `context.DeadlineExceeded`. Sababni aytish uchun Go 1.20 `WithCancelCause`, `CancelCauseFunc` va `Cause`ni qo'shdi, Go 1.21 esa `WithDeadlineCause` va `WithTimeoutCause`ni. Hujjatning qoidalari:

- `Cause(c)` kontekstning bekor qilinish sababini qaytaradi. Birinchi bekor qilish (o'zining yoki otasining) sababni belgilaydi. `CancelCauseFunc(err)` bilan bekor qilingan bo'lsa, `err`; aks holda `c.Err()` bilan bir xil. Hali bekor qilinmagan bo'lsa, `nil`.
- `cancel(nil)` sababni `Canceled` qiladi.
- `WithTimeoutCause` va `WithDeadlineCause` muddat tugaganda sabab o'rnatadi. **Ularning qaytargan `CancelFunc`i sabab o'rnatmaydi**: erta cancel chaqirsangiz, `Cause` `context.Canceled` bo'ladi.
- Bola otadan keyin bekor qilinsa, `Cause(child)` otaning sababiga teng bo'ladi (birinchi bekor qilish yutadi).

Amaliy foydasi: log va metrikada `context deadline exceeded` o'rniga "database 10 ms ichida javob bermadi" yoki "servis to'xtatilmoqda" ni ko'rasiz. Go 1.26 release notes'ga ko'ra `os/signal.NotifyContext` endi qaytarilgan kontekstni `CancelCauseFunc` bilan bekor qiladi va sababda qaysi signal kelgani bor (bu go.dev/doc/go1.26 da tasdiqlangan; Go 1.24 da lokal ishga tushirilmagan).

### WithoutCancel va AfterFunc (Go 1.21)

`WithoutCancel(parent)` ota bekor qilinganda bekor qilinmaydigan bola qaytaradi: u `Deadline` va `Err` bermaydi, `Done` kanali `nil`, `Cause` esa `nil`. Qiymatlar saqlanadi. Bu so'rovdan keyin davom etishi kerak bo'lgan ish uchun (audit, hodisa yuborish). Uning o'zida muddat yo'q, shuning uchun unga `WithTimeout` qo'shish kerak.

`AfterFunc(ctx, f)` kontekst bekor qilinganda `f`ni alohida goroutine'da ishga tushiradi. Qaytgan `stop` funksiyasi bog'lanishni to'xtatadi; u `f` ishga tushmagan bo'lsa `true` qaytaradi. `stop` `f` tugashini kutmaydi. Foydali joy: `context`ni qo'llab-quvvatlamaydigan eski API'ni (masalan, `Close()` bilan to'xtatiladigan ulanish) kontekstga bog'lash.

### Qiymatlar

`WithValue` hujjati: kalit comparable bo'lishi va to'qnashuvni oldini olish uchun string yoki boshqa o'rnatilgan tipda bo'lmasligi kerak. Foydalanuvchilar o'z kalit tipini e'lon qilishadi; ko'pincha `struct{}` tipi (interface'ga o'tkazishda ajratilmaydi). Qiymatni olish va qo'yishni paketning kichik yordamchi funksiyalari orasiga yashiring, kalit tipi eksport qilinmasin (quyida misol).

### Kontekst "hamma narsa" emas

Kontekst bekor qilish kooperativ: u goroutine'ni majburan to'xtatmaydi. Funksiya blokirovkalanadigan joyda `ctx.Done()`ni tinglashi (yoki `ctx`ni qabul qiladigan API'ni chaqirishi) kerak. 100 Go Mistakes #60 shuni ta'kidlaydi: muddat, bekor qilish signali va qiymatlar kontekstning uchta ishi, va masalan fayl kuzatuvchisi kontekst bekor bo'lganda ochiq fayl deskriptorini yopishi lozim.

## Misol: sababdan so'rov hayotigacha

Birinchi dastur bekor qilish, sabab va muddat qoidalarini ko'rsatadi (Go 1.24.7, `go vet`dan o'tgan):

```go run
package main

import (
	"context"
	"errors"
	"fmt"
	"time"
)

var (
	errShutdown = errors.New("servis to'xtatilmoqda")
	errSlowDB   = errors.New("database 10 ms ichida javob bermadi")
)

func main() {
	// 1. WithCancelCause: Err() har doim Canceled, sabab Cause() orqali olinadi.
	ctx, cancel := context.WithCancelCause(context.Background())
	cancel(errShutdown)
	fmt.Println("Err:  ", ctx.Err())
	fmt.Println("Cause:", context.Cause(ctx))

	// 2. WithTimeoutCause: muddat tugaganda sabab o'rnatiladi.
	tctx, tcancel := context.WithTimeoutCause(context.Background(), 10*time.Millisecond, errSlowDB)
	defer tcancel()
	<-tctx.Done()
	fmt.Println("Err:  ", tctx.Err(), "| Is DeadlineExceeded:", errors.Is(tctx.Err(), context.DeadlineExceeded))
	fmt.Println("Cause:", context.Cause(tctx))

	// 3. Qaytarilgan cancel() sabab o'rnatmaydi.
	cctx, ccancel := context.WithTimeoutCause(context.Background(), time.Hour, errSlowDB)
	ccancel()
	fmt.Println("cancel() dan keyin Cause:", context.Cause(cctx))

	// 4. Bola kontekst ota muddatini uzaytira olmaydi.
	parent, pcancel := context.WithTimeout(context.Background(), 50*time.Millisecond)
	defer pcancel()
	child, ccancel2 := context.WithTimeout(parent, time.Hour)
	defer ccancel2()
	pd, _ := parent.Deadline()
	cd, _ := child.Deadline()
	fmt.Println("bola muddati ota muddatiga teng:", cd.Equal(pd))

	// 5. Ota bekor qilinsa, bola ham bekor qilinadi.
	root, rootCancel := context.WithCancel(context.Background())
	leaf, leafCancel := context.WithCancel(root)
	defer leafCancel()
	rootCancel()
	<-leaf.Done()
	fmt.Println("bola holati:", leaf.Err())
}
```

```text
Err:   context canceled
Cause: servis to'xtatilmoqda
Err:   context deadline exceeded | Is DeadlineExceeded: true
Cause: database 10 ms ichida javob bermadi
cancel() dan keyin Cause: context canceled
bola muddati ota muddatiga teng: true
bola holati: context canceled
```

Kuzatuvlar: `Err` har doim standart qiymat, sabab faqat `Cause`da. `cancel()` erta chaqirilganda `WithTimeoutCause`ning sababi o'rnatilmaydi. Bola muddati otaning muddatiga teng (`Equal`), 1 soat bermagan.

`WithoutCancel` va `AfterFunc`:

```go run
package main

import (
	"context"
	"fmt"
)

type traceKey struct{}

func main() {
	base := context.WithValue(context.Background(), traceKey{}, "abc-123")
	parent, cancel := context.WithCancel(base)

	detached := context.WithoutCancel(parent)

	// AfterFunc: kontekst bekor qilinganda f alohida goroutine'da ishga tushadi.
	done := make(chan struct{})
	stop := context.AfterFunc(parent, func() {
		fmt.Println("AfterFunc: tozalash ishga tushdi")
		close(done)
	})

	cancel()
	<-done

	fmt.Println("parent.Err():     ", parent.Err())
	fmt.Println("detached.Err():   ", detached.Err())
	fmt.Println("detached.Done():  ", detached.Done() == nil)
	fmt.Println("Cause(detached):  ", context.Cause(detached))
	fmt.Println("detached qiymati: ", detached.Value(traceKey{}))
	fmt.Println("stop() natijasi:  ", stop())
}
```

```text
AfterFunc: tozalash ishga tushdi
parent.Err():      context canceled
detached.Err():    <nil>
detached.Done():   true
Cause(detached):   <nil>
detached qiymati:  abc-123
stop() natijasi:   false
```

`detached` ota bekor bo'lsa ham `Err() == nil`, `Done() == nil`, `Cause == nil`, lekin trace ID qiymati saqlangan. `stop()` `false` qaytardi, chunki `f` allaqachon ishga tushgan.

Cancel'ni tashlab yuborish:

```go
ctx, _ := context.WithTimeout(context.Background(), 10*time.Millisecond)
```

`go vet`:

```text
./main.go:19:7: the cancel function returned by context.WithTimeout should be called, not discarded, to avoid a context leak
```

Kontekst qiymatlari uchun yopiq kalit tipi:

```go run
package main

import (
	"context"
	"fmt"
)

// requestIDKey o'z paketingizga xos, eksport qilinmagan kalit tipi.
type requestIDKey struct{}

// WithRequestID kontekstga so'rov identifikatorini qo'shadi.
func WithRequestID(ctx context.Context, id string) context.Context {
	return context.WithValue(ctx, requestIDKey{}, id)
}

// RequestID kontekstdan identifikatorni oladi.
func RequestID(ctx context.Context) (string, bool) {
	id, ok := ctx.Value(requestIDKey{}).(string)
	return id, ok
}

func main() {
	ctx := WithRequestID(context.Background(), "req-77")
	id, ok := RequestID(ctx)
	fmt.Println(id, ok)

	// Boshqa paket ham "requestID" qatori bilan yozsa, kalitlar to'qnashardi;
	// struct tipidagi kalit bilan to'qnashuv imkonsiz.
	fmt.Println(ctx.Value("requestIDKey"))

	_, ok = RequestID(context.Background())
	fmt.Println(ok)
}
```

```text
req-77 true
<nil>
false
```

Qator kaliti (`"requestIDKey"`) bilan qidirish `nil` qaytardi: struct tipidagi kalit boshqa paketlar bilan to'qnashmaydi, ular qator yoki o'z tipi bilan qidira olmaydi.

### So'rov konteksti so'rovdan uzoq yashamaydi

100 Go Mistakes #61: handler javobni yozadi va fon goroutine'da hodisani Kafka kabi brokerga yuboradi. Agar yuborish `r.Context()` bilan bajarilsa, `ServeHTTP` qaytgach server kontekstni bekor qiladi (Request.Context hujjati) va yuborish uziladi. Quyidagi misol haqiqiy `httptest` serverda ikkala variantni solishtiradi. Mijoz javobni to'liq olgandan keyin `release` kanali yopiladi, shunda goroutine tekshirishni ishonchli tartibda bajaradi:

```go
package main

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"time"
)

// publish hodisani yuboradi (20 ms) yoki ctx bekor qilinsa to'xtaydi.
func publish(ctx context.Context) error {
	select {
	case <-time.After(20 * time.Millisecond):
		return nil
	case <-ctx.Done():
		return context.Cause(ctx)
	}
}

func main() {
	release := make(chan struct{})
	results := make(chan string, 2)

	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		reqCtx := r.Context()
		// Javobdan keyin ishlashi uchun alohida kontekst: bekor qilish ajratiladi, qiymatlar saqlanadi.
		bgCtx, cancel := context.WithTimeout(context.WithoutCancel(reqCtx), time.Second)

		go func() {
			defer cancel()
			<-release // mijoz javobni to'liq olguncha kutamiz
			results <- fmt.Sprintf("r.Context() bilan:   %v", publish(reqCtx))
			results <- fmt.Sprintf("WithoutCancel bilan: %v", publish(bgCtx))
		}()
		fmt.Fprintln(w, "buyurtma qabul qilindi")
	}))
	defer srv.Close()

	resp, err := http.Get(srv.URL)
	if err != nil {
		panic(err)
	}
	body, _ := io.ReadAll(resp.Body)
	resp.Body.Close()
	fmt.Print(string(body))

	close(release)
	fmt.Println(<-results)
	fmt.Println(<-results)
}
```

```text
buyurtma qabul qilindi
r.Context() bilan:   context canceled
WithoutCancel bilan: <nil>
```

`r.Context()` bilan yuborish `context canceled` bilan uzildi, `WithoutCancel` va o'z muddati (1 soniya) bilan esa muvaffaqiyatli bo'ldi. Dastur 5 marta ketma-ket ishga tushirilganda natija bir xil chiqdi. `defer cancel()` goroutine ichida: `cancel` shu yerda `WithTimeout` resurslarini bo'shatadi.

## Qachon qo'llamaslik kerak

- Kontekstni ixtiyoriy parametrlar, konfiguratsiya yoki dependency'larni uzatish uchun ishlatmang. `Value` turi xavfsiz emas (`any`) va imzodan ko'rinmaydi; bunday qiymat funksiya parametri, receiver maydoni yoki global bo'lishi kerak (Code Review Comments buni shunday tartiblaydi). Kontekstda faqat so'rov doirasidagi ma'lumot: trace ID, autentifikatsiya identifikatori.
- Blokirovka qilmaydigan, qisqa hisoblash funksiyalariga `ctx` qo'shmang. Kontekst bekor qilishni tinglashga joy bo'lmasa, parametr yolg'on va'da beradi.
- `WithoutCancel`ni muddatsiz qoldirmang. U otani bekor qilish va uning muddatini ham uzadi, shuning uchun fon ishi osilib qolsa, hech narsa to'xtatmaydi. Har doim o'z `WithTimeout`ini qo'shing.
- Fon ishi uchun `r.Context()` ni to'g'ridan-to'g'ri uzatmang (yuqoridagi misol); davomi kerak bo'lsa `WithoutCancel` va o'z muddati, yoki ishni navbatga (outbox, 80-dars) topshiring.
- `Cause`ga tayanib kodni tarmoqlamang. Qaror `ctx.Err()` va `errors.Is(ctx.Err(), context.DeadlineExceeded)` bilan qabul qilinsin; `Cause` diagnostika va ilovaga xos sabablar uchun.
- Kontekst bekor qilish ish ketayotgan driver/kutubxona tomonidan qo'llab-quvvatlanishiga bog'liq. Kontekstni qabul qilmaydigan chaqiruv bekor qilinmaydi; har bir ulanuvchi kutubxona uchun buni hujjatdan tekshiring.

## Stack'da: Node.js/TypeScript bilan solishtirish

- `AbortSignal.timeout(ms)` va `AbortSignal.any([...])` `WithTimeout` va kontekst daraxti rolini o'xshash tarzda bajaradi, lekin Node.js'da signal'ni hurmat qilish har API'ning ixtiyoriy parametri; Go'da bu imzoda birinchi parametr sifatida ko'rinadi.
- `AsyncLocalStorage` ko'rinmas "global" qiymat beradi, Go'da `ctx.Value` imzoda ko'rinadi (parametr sifatida), lekin tipsiz. Shuning uchun Go jamoalari uni kamdan-kam va yopiq yordamchi funksiyalar orqali ishlatadi.
- NestJS request-scoped provider'lar o'rniga Go'da so'rov doirasidagi bog'lanishni parametr yoki receiver bilan, trace uchun esa `ctx`ni uzatish bilan hal qilasiz.
- Servis arxitekturasida bitta qoida yetarli: HTTP handlerdan boshlab, gRPC, database va Redis chaqiruvlarigacha `ctx` birinchi parametr. Keyingi darslarda net/http (72-74), database/sql (78) va Redis (79) bu qoidani qo'llaydi.

## Xulosa

- Kontekst daraxt: ota bekor qilinsa avlodlar bekor qilinadi, muddat faqat qisqaradi, bola otani bekor qila olmaydi.
- `cancel`ni doim chaqiring (`defer cancel()`); `go vet` lostcancel tashlab yuborilganini ushlaydi.
- `Err` faqat `Canceled` yoki `DeadlineExceeded`; ilovaga xos sababni `WithCancelCause`, `WithTimeoutCause` va `Cause` beradi. Qaytarilgan `CancelFunc` sabab o'rnatmaydi (`WithTimeoutCause`/`WithDeadlineCause` uchun).
- So'rov konteksti `ServeHTTP` qaytgach bekor qilinadi: fon ishi uchun `WithoutCancel` va o'z muddati (yoki navbat).
- `WithValue` kalitlari eksport qilinmagan o'z tipingizda bo'lsin va qiymatni faqat so'rov doirasidagi ma'lumot uchun ishlating.
- Bekor qilish kooperativ: kod `ctx.Done()`ni tinglagandagina to'xtaydi.
