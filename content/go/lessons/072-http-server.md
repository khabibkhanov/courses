---
n: 72
slug: http-server
title: "net/http server: ServeMux, timeout'lar va graceful shutdown"
summary: "Go 1.22 ServeMux pattern'lari, Server timeout'larining aniq vazifasi, default sozlamalarning xavfi, request context va signal bilan graceful shutdown: production uchun to'g'ri http.Server sozlamasi."
duration: 45
sources:
  - id: pkg-net-http
    note: "ServeMux pattern'lari va ustuvorlik qoidalari; Server maydonlari (ReadHeaderTimeout, ReadTimeout, WriteTimeout, IdleTimeout); Server.Shutdown va RegisterOnShutdown; Request.Context; ResponseController; TimeoutHandler"
  - id: pkg-os-signal
    note: "NotifyContext: signal kelganda bekor bo'ladigan context"
  - id: 100go
    note: "\"Using the default HTTP client and server\" (#81) va \"Forgetting the return statement after replying to an HTTP request\" (#80)"
quiz:
  - q: "Server'da faqat `WriteTimeout: 30 * time.Second` o'rnatilgan, `ReadHeaderTimeout` va `ReadTimeout` nol. Klient so'rov sarlavhasini bir bayt/10 soniya tezlikda yubormoqda. Nima bo'ladi?"
    options:
      - "Server 30 soniyadan keyin ulanishni uzadi, chunki WriteTimeout butun so'rov muddatini cheklaydi"
      - "Server sarlavha o'qilayotgan ulanishni cheksiz ushlaydi: WriteTimeout sarlavha o'qish tugagandan keyin boshlanadi"
      - "Go sarlavhani 10 soniyadan sekin kelsa avtomatik rad etadi"
      - "Server darhol 408 qaytaradi"
    answer: 1
    explain: "Hujjatga ko'ra WriteTimeout yangi so'rov sarlavhasi o'qilgach qayta o'rnatiladi, ya'ni sarlavha o'qish bosqichini cheklamaydi. Slowloris turidagi hujumdan ReadHeaderTimeout himoya qiladi. Default hamma timeout nol, ya'ni cheksiz."
  - q: "`mux.HandleFunc(\"GET /files/{path...}\", a)` va `mux.HandleFunc(\"GET /files/index.html\", b)` ro'yxatdan o'tgan. `GET /files/index.html` qaysi handler'ga boradi?"
    options:
      - "a, chunki u birinchi ro'yxatdan o'tgan"
      - "a, chunki wildcard barcha yo'llarni qamraydi"
      - "Ro'yxatdan o'tish paytida panic bo'ladi, chunki ikkala pattern ham mos keladi"
      - "b, chunki aniqroq (faqat bitta yo'lga mos keladigan) pattern ustun turadi"
    answer: 3
    explain: "Go 1.22 ServeMux'da ro'yxatdan o'tish tartibi emas, aniqlik hal qiladi: b ning mos yo'llar to'plami a ning to'plamining qismi. Panic faqat ikkala pattern ham bir-birini qoplamaydigan holda, lekin umumiy yo'llarga mos kelganda chiqadi (masalan GET /a/{x} va GET /{y}/b)."
  - q: "`GET /vehicles/{id}` pattern'iga `DELETE /vehicles/42` so'rovi keldi. Boshqa pattern yo'q. Natija?"
    options:
      - "404 page not found"
      - "200, chunki method pattern'da e'tiborga olinmaydi"
      - "405 Method Not Allowed va Allow: GET, HEAD sarlavhasi"
      - "Panic"
    answer: 2
    explain: "Lokal sinovda aynan shu chiqdi: 405 va Allow=\"GET, HEAD\". Yo'l mos keladigan, lekin method mos kelmaydigan pattern bo'lsa, ServeMux 404 emas, 405 qaytaradi."
  - q: "Quyidagi main to'g'rimi? `go srv.ListenAndServe(); <-ctx.Done(); srv.Shutdown(shutdownCtx)` va undan keyin main tugaydi."
    options:
      - "Ha, Shutdown sinxron ishlaydi va barcha so'rovlar tugaguncha kutadi, shuning uchun muammo yo'q"
      - "Yo'q: ListenAndServe xatosi e'tiborsiz qoldiriladi, lekin Shutdown'ga tegishli muammo yo'q"
      - "Yo'q, Shutdown goroutine'da chaqirilishi shart"
      - "Muammoli: Shutdown natijasi tekshirilmaydi va ListenAndServe xatosi (masalan port band) jim yo'qoladi; ErrServerClosed'ni normal deb hisoblab, boshqa xatolarni qaytarish kerak"
    answer: 3
    explain: "Shutdown sinxron, lekin xatosini tekshirmasangiz muddati o'tib ketganini bilmaysiz (ctx xatosi), qolgan ulanishlar uchun srv.Close kerak bo'ladi. ListenAndServe xatosini jim yutish esa port band bo'lganda servis ishlamay turgani sezilmasligiga olib keladi. ErrServerClosed Shutdown'dan keyingi kutilgan natija."
  - q: "SSE (server-sent events) endpoint'i bir necha daqiqa ochiq turadi, server esa `WriteTimeout: 30 * time.Second` bilan ishga tushgan. Eng to'g'ri yechim?"
    options:
      - "WriteTimeout'ni 1 soatga oshirish: hamma endpoint uchun"
      - "Shu handler ichida `http.NewResponseController(w).SetWriteDeadline(...)` bilan har yozishdan oldin deadline'ni uzaytirish yoki olib tashlash"
      - "WriteTimeout'ni butunlay o'chirish va boshqa hech narsa qilmaslash"
      - "http.TimeoutHandler ishlatish: u streaming'ni qo'llab-quvvatlaydi"
    answer: 1
    explain: "ResponseController (Go 1.20) per-request deadline beradi. TimeoutHandler Flusher'ni qo'llab-quvvatlamaydi, shuning uchun streaming uchun mos emas. Global WriteTimeout'ni kattalashtirish esa oddiy endpoint'larni himoyasiz qoldiradi."
  - q: "Shutdown(ctx) chaqirildi, ctx 5 soniyadan keyin tugadi, bitta so'rov hali ishlayapti. Shutdown nima qaytaradi va keyin nima qilish kerak?"
    options:
      - "nil qaytaradi, so'rov o'zi tugaydi"
      - "ctx xatosini (context.DeadlineExceeded) qaytaradi; keyin srv.Close() bilan qolgan ulanishlarni majburan yopish kerak"
      - "ErrServerClosed qaytaradi va server allaqachon to'liq to'xtagan"
      - "Panic qiladi"
    answer: 1
    explain: "Hujjat: agar tugashdan oldin ctx muddati o'tsa, Shutdown ctx xatosini qaytaradi. Faol ulanishlar o'z-o'zidan yopilmaydi, shuning uchun muddat o'tgach Close chaqiriladi. Lokal sinovda 3-holat aynan shu: errors.Is(err, context.DeadlineExceeded) true."
  - q: "Handler ichida `if err != nil { http.Error(w, \"xato\", 400) }` yozilgan, ortidan return yo'q va kod ishlashda davom etadi. Natija?"
    options:
      - "Javob 400 bo'ladi va keyingi kod ham ishlaydi; keyingi Write sarlavhani qayta yubormaydi, lekin tana xato matniga qo'shilib ketadi"
      - "Go return'ni o'zi qo'shadi"
      - "Server panic qiladi"
      - "Keyingi kod ishlamaydi, chunki http.Error handler'ni to'xtatadi"
    answer: 0
    explain: "http.Error handler'dan chiqmaydi, u faqat javobni yozadi. Return unutilsa, mantiq davom etadi (masalan, yana yozadi yoki ma'lumotni saqlaydi) va 'superfluous WriteHeader' ogohlantirishi chiqishi mumkin. 100 Go Mistakes #80 aynan shu xato haqida."
task:
  title: "Timeout'lari va graceful shutdown'i bor run funksiyasi"
  prompt: |
    Servis `http.Serve(ln, h)` bilan ishlaydi: timeout yo'q, to'xtatish signali ham hisobga olinmaydi. Deploy paytida ishlayotgan so'rovlar uziladi.

    `run(ctx, ln, h)` ni qayta yozing:
    - `http.Server` yarating va kamida `ReadHeaderTimeout`, `ReadTimeout`, `WriteTimeout`, `IdleTimeout` ni o'rnating;
    - `ctx` bekor qilinganda `Shutdown` chaqirilsin (muddat 5 soniya): yangi ulanishlar olinmaydi, ishlayotgan so'rov tugaguncha kutiladi;
    - `Shutdown` muddati o'tsa `srv.Close()` bilan majburan yopilsin va xato qaytarilsin;
    - to'xtash normal bo'lsa `run` `nil` qaytarsin (`http.ErrServerClosed` xato emas).

    Kutilgan natija: `run` 1 soniyadan oldin tugaydi (`nil`), ishlayotgan so'rov esa `200 hisobot tayyor` oladi.
  lang: go
  starter: |
    package main

    import (
        "context"
        "fmt"
        "io"
        "net"
        "net/http"
        "time"
    )

    // run handler'ni ln'da xizmat qiladi. ctx bekor qilinganda to'xtashi kerak.
    func run(ctx context.Context, ln net.Listener, h http.Handler) error {
        return http.Serve(ln, h)
    }

    func main() {
        ln, err := net.Listen("tcp", "127.0.0.1:0")
        if err != nil {
            panic(err)
        }
        h := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            time.Sleep(300 * time.Millisecond)
            fmt.Fprint(w, "hisobot tayyor")
        })

        ctx, stop := context.WithCancel(context.Background())
        done := make(chan error, 1)
        go func() { done <- run(ctx, ln, h) }()

        reply := make(chan string, 1)
        go func() {
            resp, err := http.Get("http://" + ln.Addr().String())
            if err != nil {
                reply <- "so'rov xatosi: " + err.Error()
                return
            }
            defer resp.Body.Close()
            b, _ := io.ReadAll(resp.Body)
            reply <- fmt.Sprintf("%d %s", resp.StatusCode, b)
        }()

        time.Sleep(50 * time.Millisecond)
        stop() // SIGTERM o'rniga

        select {
        case err := <-done:
            fmt.Println("run tugadi:", err)
        case <-time.After(time.Second):
            fmt.Println("run 1 soniyada tugamadi")
        }
        fmt.Println("so'rov:", <-reply)
    }
  solution: |
    package main

    import (
        "context"
        "errors"
        "fmt"
        "io"
        "net"
        "net/http"
        "time"
    )

    // run handler'ni ln'da xizmat qiladi. ctx bekor qilinganda to'xtaydi:
    // yangi ulanish olinmaydi, ishlayotgan so'rovlar 5 soniyagacha kutiladi.
    func run(ctx context.Context, ln net.Listener, h http.Handler) error {
        srv := &http.Server{
            Handler:           h,
            ReadHeaderTimeout: 5 * time.Second,
            ReadTimeout:       30 * time.Second,
            WriteTimeout:      30 * time.Second,
            IdleTimeout:       2 * time.Minute,
        }

        serveErr := make(chan error, 1)
        go func() { serveErr <- srv.Serve(ln) }()

        select {
        case err := <-serveErr:
            return err // Serve o'zi xato bilan tugadi
        case <-ctx.Done():
        }

        shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
        defer cancel()
        if err := srv.Shutdown(shutdownCtx); err != nil {
            srv.Close()
            return err
        }
        if err := <-serveErr; !errors.Is(err, http.ErrServerClosed) {
            return err
        }
        return nil
    }

    func main() {
        ln, err := net.Listen("tcp", "127.0.0.1:0")
        if err != nil {
            panic(err)
        }
        h := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            time.Sleep(300 * time.Millisecond)
            fmt.Fprint(w, "hisobot tayyor")
        })

        ctx, stop := context.WithCancel(context.Background())
        done := make(chan error, 1)
        go func() { done <- run(ctx, ln, h) }()

        reply := make(chan string, 1)
        go func() {
            resp, err := http.Get("http://" + ln.Addr().String())
            if err != nil {
                reply <- "so'rov xatosi: " + err.Error()
                return
            }
            defer resp.Body.Close()
            b, _ := io.ReadAll(resp.Body)
            reply <- fmt.Sprintf("%d %s", resp.StatusCode, b)
        }()

        time.Sleep(50 * time.Millisecond)
        stop() // SIGTERM o'rniga

        select {
        case err := <-done:
            fmt.Println("run tugadi:", err)
        case <-time.After(time.Second):
            fmt.Println("run 1 soniyada tugamadi")
        }
        fmt.Println("so'rov:", <-reply)
    }
  solutionNotes: |
    - `Serve` alohida goroutine'da ishlaydi va natijasi kanalga yoziladi; asosiy oqim `select` bilan ctx yoki `Serve` xatosini kutadi.
    - `Shutdown` uchun yangi context (`context.Background()` dan) olinadi: asl `ctx` allaqachon bekor qilingan, u bilan Shutdown darhol muddat xatosini qaytarardi.
    - `Shutdown` chaqirilgach `Serve` darhol `http.ErrServerClosed` qaytaradi. Shuning uchun `<-serveErr` o'qiladi va aynan shu xato kutilgan deb hisoblanadi, boshqa xato qaytariladi.
    - Muddat o'tsa `srv.Close()` qolgan ulanishlarni yopadi. Aks holda jarayon tugamagan so'rovlar bilan osilib qolishi mumkin.
    - Yechim `go run` bilan lokal tekshirildi: run `nil` bilan tugadi, so'rov `200 hisobot tayyor` oldi.
  checklist:
    - "`http.Server` da to'rttala timeout (ReadHeaderTimeout, ReadTimeout, WriteTimeout, IdleTimeout) o'rnatilgan"
    - "`ctx` bekor qilinganda `Shutdown` chaqiriladi va ishlayotgan so'rov tugagach `run` qaytadi"
    - "`Shutdown` uchun alohida muddatli context ishlatiladi"
    - "`http.ErrServerClosed` normal to'xtash sifatida `nil` ga aylanadi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

`http.ListenAndServe(":8080", nil)` bir qatorli "hello world" uchun yaxshi, production uchun xavfli. Bu chaqiruv ostida default `http.Server` turadi va uning hamma timeout'lari nol, ya'ni cheksiz. 100 Go Mistakes kitobining "default HTTP client va server'dan foydalanish" xatosi (#81) aynan shuni tasvirlaydi. Natijada uch xil muammo paydo bo'ladi.

Birinchisi: sust klient. Hujumchi yoki shunchaki yomon tarmoqdagi mijoz so'rov sarlavhasini juda sekin yuborsa, server har bir shunday ulanish uchun goroutine va fayl deskriptorini ushlab turadi (slowloris hujumi). Timeout yo'q bo'lsa, bu ulanishlar abadiy yashaydi.

Ikkinchisi: deploy paytida yo'qolgan so'rovlar. Orkestrator (masalan Kubernetes) jarayonga SIGTERM yuboradi, Go dasturi esa default xatti-harakat bilan darhol chiqadi. O'sha paytda ishlayotgan to'lov so'rovi yoki hisobot yuklab olish yarim yo'lda uziladi.

Uchinchisi: global holat. `http.HandleFunc` global `DefaultServeMux`ga yozadi. Import qilingan har qanday paket (masalan `net/http/pprof`) unga o'z yo'llarini qo'shishi mumkin va siz buni bilmay turib ularni internetga ochasiz. Aniq `http.NewServeMux()` ishlatish bu xavfni yo'qotadi.

Node.js'dan kelgan dasturchiga bu tanish: Express ilovasi `app.listen` bilan ishga tushadi va to'xtatish alohida masala. Farq shundaki, Go'da bularning hammasi standart kutubxonada, lekin default qiymatlar "ehtiyotkor" emas. Ularni aniq yozish sizning vazifangiz.

## Asosiy g'oya

### Handler va ServeMux

`http.Handler` bitta metodli interface: `ServeHTTP(ResponseWriter, *Request)`. `http.HandlerFunc` oddiy funksiyani handler qiladi. `ServeMux` so'rovni pattern bo'yicha handler'ga yo'naltiradi va o'zi ham `Handler`.

Go 1.22 dan `ServeMux` pattern'lari boyidi (hujjat: "Patterns" bo'limi). Pattern shakli `[METHOD ][HOST]/[PATH]`:

| Pattern | Ma'nosi |
|---|---|
| `GET /vehicles/{id}` | faqat GET (va HEAD), `{id}` bitta yo'l segmenti, `r.PathValue("id")` bilan olinadi |
| `POST /vehicles` | faqat POST |
| `GET /files/{path...}` | oxirgi wildcard: qolgan yo'lning hammasi |
| `GET /{$}` | faqat aynan `/` ga mos (oddiy `/` pattern esa hamma narsaga mos keladi) |
| `GET /vehicles/latest` | literal: `{id}` pattern'idan aniqroq |

Ustuvorlik qoidasi: ro'yxatdan o'tish tartibi emas, aniqlik hal qiladi. Bir pattern mos keladigan so'rovlar to'plami boshqasinikining qismi bo'lsa, u aniqroq hisoblanadi. Ikkala pattern ham bir-birini qoplamasa, lekin umumiy so'rovlarga mos kelsa, ro'yxatdan o'tkazish vaqtida panic bo'ladi: bu xato production'ga yetmasdan, ishga tushishda ko'rinadi. Method mos kelmasa, `ServeMux` 404 emas, 405 va `Allow` sarlavhasini qaytaradi. Go 1.23 dan `r.Pattern` mos kelgan pattern'ni beradi (log va metrikalarda yo'l o'rniga pattern ishlatish kardinallikni kamaytiradi). Go 1.26 release notes'ga ko'ra `ServeMux` oxiridagi slash bo'yicha redirect'lar endi 301 emas, 307 status bilan keladi; bu o'zgarish bu darsda lokal tekshirilmagan.

### Server timeout'lari

`http.Server` to'rtta vaqt chegarasini beradi. Hujjatdagi ta'riflarga ko'ra:

- `ReadHeaderTimeout`: so'rov sarlavhasini o'qishga ruxsat etilgan vaqt. Sarlavha o'qilgach, ulanishning read deadline'i qayta o'rnatiladi va tana uchun nima "sekin" ekanini handler hal qiladi. Nol bo'lsa, `ReadTimeout` ishlatiladi.
- `ReadTimeout`: butun so'rovni, tanasi bilan birga o'qish uchun maksimal vaqt. Hujjat o'zi shuni qayd etadi: handler'lar har bir so'rov uchun alohida qaror qila olmagani sababli ko'pchilik `ReadHeaderTimeout`ni afzal ko'radi, ikkalasini birga ishlatish ham mumkin.
- `WriteTimeout`: javob yozish muddati; har bir yangi so'rov sarlavhasi o'qilgach qayta o'rnatiladi. Demak, u sarlavhani o'qish bosqichini cheklamaydi.
- `IdleTimeout`: keep-alive yoqilgan ulanishda keyingi so'rovni kutish muddati. Nol bo'lsa, `ReadTimeout` ishlatiladi.

`MaxHeaderBytes` sarlavha hajmini cheklaydi (default `DefaultMaxHeaderBytes` = 1 MB). Go 1.27 release notes'ga ko'ra yana `Server.MaxHeaderValueCount` qo'shildi: sarlavha qiymatlari sonini cheklaydi. Bu maydon sandbox'da (Go 1.24) kompilyatsiya qilinmadi.

Hamma qiymatlar default nol. Slowloris'dan himoya uchun minimum `ReadHeaderTimeout` kerak.

### Request context

Hujjatga ko'ra server so'rovining context'i klient ulanishi yopilganda, HTTP/2 da so'rov bekor qilinganda yoki `ServeHTTP` qaytganda bekor bo'ladi. Shuning uchun handler ichida bazaga yoki boshqa servisga qilinadigan chaqiruvlarga `r.Context()` uzatilishi kerak: klient ketsa, ishlar to'xtaydi (34-darsdagi context qoidalari). Aksincha, handler qaytgandan keyin ham ishlashi kerak bo'lgan fon ishiga `r.Context()` ni bermang: u bekor bo'ladi (100 Go Mistakes #61).

### Graceful shutdown

`Server.Shutdown(ctx)` hujjatdagi ketma-ketlik bilan ishlaydi: avval barcha listener'larni yopadi, keyin bo'sh ulanishlarni yopadi, keyin faol ulanishlar bo'shashini cheksiz kutadi. Agar tugashidan oldin `ctx` muddati o'tsa, `ctx` xatosini qaytaradi. Shutdown chaqirilishi bilan `Serve` va `ListenAndServe` darhol `http.ErrServerClosed` qaytaradi: hujjat dastur chiqib ketmasligi, Shutdown qaytguncha kutishi kerakligini ayniqsa ta'kidlaydi. Shutdown hijack qilingan ulanishlarni (masalan WebSocket) kuzatmaydi; ular uchun `RegisterOnShutdown`.

Signal bilan bog'lash `os/signal.NotifyContext` orqali: u signal kelganda, `stop` chaqirilganda yoki ota context tugaganda bekor bo'ladigan context qaytaradi. `stop` chaqirilgach signal uchun default xatti-harakat (jarayonni to'xtatish) qaytadi, shuning uchun ikkinchi Ctrl+C jarayonni majburan to'xtatadi.

## Chuqurroq: nozik joylar

### Timeout'lar nimani cheklamaydi

`WriteTimeout` va `ReadTimeout` butun ulanishga qo'yiladigan deadline'lar bilan amalga oshadi (71-dars). Shuning uchun ular "handler necha soniya ishladi" ni emas, I/O muddatini cheklaydi. Handler 10 soniya CPU bilan hisoblasa va hech narsa yozmasa, `WriteTimeout` 5 soniya bo'lsa ham bu hisoblashni to'xtatmaydi; faqat javob yozishga urinish xato bilan tugaydi. Handler vaqtini cheklash uchun `http.TimeoutHandler` bor: u muddat tugaganda 503 qaytaradi va handler yozuvlariga `ErrHandlerTimeout` beradi. Lekin hujjatga ko'ra u `Hijacker` va `Flusher`ni qo'llab-quvvatlamaydi (streaming bilan mos emas), va handler goroutine'i o'zi to'xtamaydi: handler `r.Context()` ni kuzatishi shart.

### Per-request deadline

Global timeout hamma endpoint uchun bir xil. Katta fayl yuklash yoki SSE uchun alohida qiymat kerak bo'lsa, Go 1.20 dan `http.NewResponseController(w)` ning `SetReadDeadline` va `SetWriteDeadline` metodlari bor. Hujjat: muddat o'tgandan keyin yozuv bloklanmaydi, lekin bufer to'lmagan bo'lsa muvaffaqiyatli bo'lishi mumkin; o'tib ketgan deadline'ni keyin uzaytirib bo'lmaydi, ya'ni uzaytirish muddat tugashidan oldin qilinadi.

### Shutdown tartibi servisda

Production'da to'xtatish odatda to'rt bosqich: (1) signal keldi, readiness tekshiruvi "tayyor emas" qaytara boshlaydi, shunda load balancer yangi trafik yubormaydi; (2) bir necha soniya kutiladi, chunki balancer holatni darhol yangilamaydi; (3) `Shutdown` chaqiriladi; (4) bazalar, kanal va worker'lar yopiladi. Kubernetes kabi orkestratorlarda grace period tugagach jarayon SIGKILL bilan o'ldiriladi, shuning uchun `Shutdown` muddati shu chegaradan qisqa bo'lishi kerak. Bu qism orkestrator xatti-harakati haqida umumiy tavsiya, Go hujjatidan emas.

### HTTP/2 va protokollar

Go 1.24 dan `Server.Protocols` HTTP/1, HTTP/2 va shifrlanmagan HTTP/2 (`UnencryptedHTTP2`) ni aniq tanlash imkonini beradi. Shifrlanmagan HTTP/2 ilovaga "prior knowledge" rejimida (RFC 9113) ishlaydi, `Upgrade: h2c` qo'llab-quvvatlanmaydi (Go 1.24 release notes). 77-darsda gRPC mexanizmini ko'rsatishda biz aynan shu imkoniyatdan foydalanamiz.

## Misol: routing, timeout va graceful shutdown

Birinchi dastur pattern'larning amaldagi xatti-harakatini ko'rsatadi:

```go
package main

import (
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /vehicles/{id}", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "vehicle=%s pattern=%q\n", r.PathValue("id"), r.Pattern)
	})
	mux.HandleFunc("POST /vehicles", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusCreated)
	})
	mux.HandleFunc("GET /files/{path...}", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "path=%s\n", r.PathValue("path"))
	})
	mux.HandleFunc("GET /{$}", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "root")
	})
	mux.HandleFunc("GET /vehicles/latest", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "latest (aniqroq pattern)")
	})

	srv := httptest.NewServer(mux)
	defer srv.Close()

	do := func(method, path string) {
		req, _ := http.NewRequest(method, srv.URL+path, strings.NewReader(""))
		resp, err := srv.Client().Do(req)
		if err != nil {
			fmt.Println(err)
			return
		}
		defer resp.Body.Close()
		b, _ := io.ReadAll(resp.Body)
		fmt.Printf("%-6s %-22s -> %d Allow=%q %q\n", method, path, resp.StatusCode, resp.Header.Get("Allow"), strings.TrimSpace(string(b)))
	}
	do("GET", "/vehicles/42")
	do("GET", "/vehicles/latest")
	do("DELETE", "/vehicles/42")
	do("POST", "/vehicles")
	do("GET", "/files/2026/11/report.csv")
	do("GET", "/")
	do("GET", "/nope")

	// Konflikt: ikki pattern bir-birini qoplamaydi, aniqroq emas -> panic.
	defer func() { fmt.Println("panic:", recover()) }()
	m2 := http.NewServeMux()
	m2.HandleFunc("GET /a/{x}", func(http.ResponseWriter, *http.Request) {})
	m2.HandleFunc("GET /{y}/b", func(http.ResponseWriter, *http.Request) {})
}
```

Go 1.24.7 da chiqish (panic xabaridagi uzun fayl yo'li qisqartirildi):

```text
GET    /vehicles/42           -> 200 Allow="" "vehicle=42 pattern=\"GET /vehicles/{id}\""
GET    /vehicles/latest       -> 200 Allow="" "latest (aniqroq pattern)"
DELETE /vehicles/42           -> 405 Allow="GET, HEAD" "Method Not Allowed"
POST   /vehicles              -> 201 Allow="" ""
GET    /files/2026/11/report.csv -> 200 Allow="" "path=2026/11/report.csv"
GET    /                      -> 200 Allow="" "root"
GET    /nope                  -> 404 Allow="" "404 page not found"
panic: pattern "GET /{y}/b" (registered at .../main.go:55) conflicts with pattern "GET /a/{x}" (registered at .../main.go:54):
GET /{y}/b and GET /a/{x} both match some paths, like "/a/b".
But neither is more specific than the other.
GET /{y}/b matches "/y/b", but GET /a/{x} doesn't.
GET /a/{x} matches "/a/x", but GET /{y}/b doesn't.
```

Diqqat qiling: `GET /vehicles/latest` literal pattern `{id}` ni bosib oladi, `DELETE` esa 404 emas, 405 va `Allow` oladi. Konflikt xabari qaysi so'rovlar ikkala pattern'ga mos kelishini ham aytadi.

Ikkinchi dastur timeout va Shutdown'ni sinaydi: sekin sarlavha, ishlayotgan so'rov va qisqa muddat:

```go
package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net"
	"net/http"
	"time"
)

func newServer(h http.Handler) (*http.Server, net.Listener) {
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		panic(err)
	}
	srv := &http.Server{
		Handler:           h,
		ReadHeaderTimeout: 200 * time.Millisecond,
		IdleTimeout:       time.Second,
	}
	go srv.Serve(ln)
	return srv, ln
}

func main() {
	// 1. Sekin sarlavha (slowloris): sarlavha tugamaydi.
	srv, ln := newServer(http.NotFoundHandler())
	conn, _ := net.Dial("tcp", ln.Addr().String())
	start := time.Now()
	fmt.Fprint(conn, "GET / HTTP/1.1\r\nHost: x\r\n") // bo'sh qator yuborilmaydi
	conn.SetReadDeadline(time.Now().Add(2 * time.Second))
	data, err := io.ReadAll(conn)
	fmt.Printf("1. server ulanishni yopdi: %v, kutilgan >= 200ms: %v\n", err == nil, time.Since(start) >= 200*time.Millisecond)
	fmt.Printf("   javob boshi: %.24q\n", data)
	conn.Close()
	srv.Close()

	// 2. Graceful shutdown: ishlayotgan so'rov tugaguncha kutadi.
	slow := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(300 * time.Millisecond)
		fmt.Fprint(w, "tugadi")
	})
	srv, ln = newServer(slow)
	addr := ln.Addr().String()
	result := make(chan string, 1)
	go func() {
		resp, err := http.Get("http://" + addr)
		if err != nil {
			result <- "xato: " + err.Error()
			return
		}
		defer resp.Body.Close()
		b, _ := io.ReadAll(resp.Body)
		result <- fmt.Sprintf("%d %s", resp.StatusCode, b)
	}()
	time.Sleep(50 * time.Millisecond)
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	t0 := time.Now()
	err = srv.Shutdown(ctx)
	fmt.Printf("2. Shutdown: err=%v, kutdi >= 200ms: %v\n", err, time.Since(t0) >= 200*time.Millisecond)
	fmt.Println("   so'rov natijasi:", <-result)
	_, err = net.DialTimeout("tcp", addr, time.Second)
	fmt.Println("   yangi ulanish rad etildi:", err != nil)

	// 3. Shutdown muddati juda qisqa: kontekst xatosi qaytadi.
	srv, ln = newServer(slow)
	addr = ln.Addr().String()
	go func() {
		resp, err := http.Get("http://" + addr)
		if err == nil {
			resp.Body.Close()
		}
	}()
	time.Sleep(50 * time.Millisecond)
	ctx2, cancel2 := context.WithTimeout(context.Background(), 50*time.Millisecond)
	defer cancel2()
	err = srv.Shutdown(ctx2)
	fmt.Println("3. qisqa muddat:", errors.Is(err, context.DeadlineExceeded))
	srv.Close() // majburiy yopish
}
```

```text
1. server ulanishni yopdi: true, kutilgan >= 200ms: true
   javob boshi: ""
2. Shutdown: err=<nil>, kutdi >= 200ms: true
   so'rov natijasi: 200 tugadi
   yangi ulanish rad etildi: true
3. qisqa muddat: true
```

1-holatda server sarlavha tugamagan ulanishni 200 ms dan keyin javobsiz yopdi. 2-holatda `Shutdown` ishlayotgan so'rov (300 ms) tugaguncha kutdi, so'rov `200` oldi, yangi ulanishlar esa rad etildi. 3-holatda muddat (50 ms) so'rovdan qisqa edi: `Shutdown` `context.DeadlineExceeded` qaytardi, qolgan ulanishlarni `Close` yopadi.

Uchinchi dastur hammasini bitta servisga jamlaydi: aniq mux, to'rt timeout, signal bilan to'xtatish. Sinov uchun dastur o'ziga SIGTERM yuboradi (Unix):

```go
package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func newHandler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})
	mux.HandleFunc("GET /vehicles/{id}/position", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `{"vehicle":%q,"lat":41.31,"lon":69.28}`+"\n", r.PathValue("id"))
	})
	return mux
}

func serve(ctx context.Context, ln net.Listener) error {
	srv := &http.Server{
		Handler:           newHandler(),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       2 * time.Minute,
		MaxHeaderBytes:    64 << 10,
	}
	errc := make(chan error, 1)
	go func() { errc <- srv.Serve(ln) }()

	select {
	case err := <-errc:
		return err
	case <-ctx.Done():
	}
	log.Println("signal keldi, to'xtatilmoqda")
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(shutdownCtx); err != nil {
		_ = srv.Close()
		return fmt.Errorf("shutdown: %w", err)
	}
	if err := <-errc; !errors.Is(err, http.ErrServerClosed) {
		return err
	}
	return nil
}

func main() {
	log.SetFlags(0)
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		log.Fatal(err)
	}

	// Sinov uchun: bitta so'rov yuborib, o'zimizga SIGTERM jo'natamiz.
	go func() {
		resp, err := http.Get("http://" + ln.Addr().String() + "/vehicles/truck-7/position")
		if err == nil {
			b, _ := io.ReadAll(resp.Body)
			resp.Body.Close()
			log.Printf("javob: %d %s", resp.StatusCode, b)
		}
		_ = syscall.Kill(os.Getpid(), syscall.SIGTERM)
	}()

	if err := serve(ctx, ln); err != nil {
		log.Fatal(err)
	}
	log.Println("toza chiqish")
}
```

```text
javob: 200 {"vehicle":"truck-7","lat":41.31,"lon":69.28}
signal keldi, to'xtatilmoqda
toza chiqish
```

Qarorlar:

- `serve` ichida `Serve` alohida goroutine'da va `select` ikkita hodisani kutadi: `Serve` o'zi xato bilan tugashi (masalan listener buzildi) yoki to'xtatish signali.
- `Shutdown` uchun yangi `context.Background()` dan olingan 10 soniyalik muddat ishlatiladi; asl `ctx` allaqachon bekor qilingan.
- `ErrServerClosed` kutilgan to'xtash, shuning uchun `nil`ga aylantiriladi. Boshqa xatolar yuqoriga qaytariladi.
- `MaxHeaderBytes` kamaytirildi: ko'p JSON API'larga 1 MB sarlavha kerak emas.

## Qachon qo'llamaslik kerak

- Bitta global `WriteTimeout` streaming endpoint'lar (SSE, katta fayl yuklash) uchun mos emas. Ularni `ResponseController` bilan endpoint ichida boshqaring yoki alohida `http.Server` ga ajrating.
- `ReadTimeout`ni tanaga ham taalluqli ekanini unutmang: katta fayl yuklanadigan endpoint uchun kichik qiymat yuklashni uzib qo'yadi. `ReadHeaderTimeout` + handler ichida `http.MaxBytesReader` + endpoint bo'yicha deadline yaxshiroq (76-dars).
- `http.TimeoutHandler` ni streaming yoki hijack talab qiladigan handler'larga qo'ymang. Handler goroutine'ini to'xtatmasligi sababli u faqat context'ni kuzatadigan handler'larda foydali.
- `ServeMux` murakkab marshrutlash (regex, guruhlar, versiyalash) uchun yetarli bo'lmasligi mumkin. Lekin Go 1.22 dan keyin ko'pchilik servislar uchun uchinchi tomon router'i shart emas: method, wildcard va ustuvorlik tayyor.
- `Shutdown` muddatini cheksiz qoldirmang: bitta osilib qolgan ulanish deploy'ni to'xtatib qo'yadi.

## Stack'da: Node.js/TypeScript bilan solishtirish

Express yoki Fastify'da `app.listen` server qaytaradi va `server.close()` yangi ulanishlarni to'xtatadi. Go'da `Shutdown` ham shunday, lekin muddat (context) va faol so'rovlarni kutishni aniq boshqarasiz. Asosiy farq: Go'da timeout default'lari yo'q (nol), shuning uchun ularni yozmagan servis himoyasiz.

Servis uchun andoza:

- `http.NewServeMux()` ishlating, `DefaultServeMux`dan qoching (pprof va expvar kabi paketlar unga yo'l qo'shadi).
- Kamida `ReadHeaderTimeout`, `IdleTimeout` va `MaxHeaderBytes` ni qo'ying; yuklash endpoint'lari uchun `ReadTimeout`/`WriteTimeout` ni endpoint bo'yicha tanlang.
- `signal.NotifyContext` + `Shutdown` + `Close` zanjirini bitta `run` funksiyasiga yig'ing, shunda uni test qilish mumkin (topshiriqdagi kabi).
- Log va metrikada yo'l o'rniga `r.Pattern` ishlating.
- `http.Error` dan keyin `return` yozing (100 Go Mistakes #80).

## Xulosa

- `http.Server`ning default timeout'lari nol: kamida `ReadHeaderTimeout` va `IdleTimeout`ni aniq yozing; `WriteTimeout` sarlavha o'qish bosqichini cheklamaydi.
- Go 1.22 `ServeMux` method va wildcard pattern'larini biladi: ustuvorlikni aniqlik hal qiladi, mos kelmaydigan konflikt ishga tushishda panic beradi, method mos kelmasa 405 qaytadi.
- Request context klient ketganda yoki handler qaytganda bekor bo'ladi: ichki chaqiruvlarga uni uzating, fon ishlariga bermang.
- Graceful shutdown: `NotifyContext` -> `Shutdown(yangi muddatli ctx)` -> muddat o'tsa `Close`; `ErrServerClosed` xato emas.
- Per-request cheklov kerak bo'lsa `ResponseController`, handler vaqtini cheklash uchun `TimeoutHandler` (streaming'siz).
