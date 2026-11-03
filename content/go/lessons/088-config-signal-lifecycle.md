---
n: 88
slug: config-signal-lifecycle
title: "Konfiguratsiya, signal va ilova hayot sikli"
summary: "Konfiguratsiyani ishga tushishda yig'ib tekshirish (errors.Join), signal.NotifyContext bilan SIGTERM/SIGINT, http.Server.Shutdown bilan toza to'xtash, readiness va to'xtatish tartibi, hayot siklidagi tuzoqlar."
duration: 40
sources:
  - id: pkg-os-signal
    note: "Notify, NotifyContext va stop funksiyasining semantikasi, buferlangan kanal talabi"
  - id: pkg-context
    note: "WithTimeout va bekor qilish: shutdown muddati uchun mustaqil context"
  - id: 100go
    note: "Bandlar (100go.co bo'yicha tekshirilgan): #62 goroutine'ni qachon to'xtashini bilmay ishga tushirish, #61 kontekstni noto'g'ri uzatish. Graceful shutdown tartibi 100go.co ro'yxatida alohida band emas"
  - id: k8s-pod-lifecycle
    note: "Pod Termination Flow: preStop, TERM, EndpointSlice yangilanishi, grace period."
quiz:
  - q: "Orkestrator konteynerni to'xtatish uchun SIGTERM yuboradi. Dastur `signal.NotifyContext(ctx, os.Interrupt, syscall.SIGTERM)` ishlatgan, lekin to'xtash muddati o'tib ketdi. Qaysi signal kod ichida ushlab bo'lmaydi va oxirgi chora sifatida ishlatiladi?"
    options:
      - "SIGINT"
      - "SIGHUP"
      - "SIGKILL"
      - "SIGTERM"
    answer: 2
    explain: "SIGKILL ni dastur ushlay olmaydi, yo'naltira olmaydi va e'tiborsiz qoldira olmaydi: operatsion tizim jarayonni darhol tugatadi. Orkestratorlar odatda avval SIGTERM yuboradi, belgilangan muddatdan keyin SIGKILL. Shuning uchun shutdown muddati orkestrator muddatidan qisqa bo'lishi kerak."
  - q: "`signal.NotifyContext` qaytargan `stop` funksiyasini signal olingach darhol chaqirish nimani beradi?"
    options:
      - "Signal ushlashni to'xtatadi va standart xatti-harakatni tiklashi mumkin: keyingi Ctrl+C jarayonni darhol tugatadi, to'xtash qotib qolsa ham"
      - "Context'ni qayta ishga tushiradi"
      - "Hamma goroutine'larni darhol to'xtatadi"
      - "Hech narsa, faqat resurslarni bo'shatadi"
    answer: 0
    explain: "Hujjatga ko'ra stop signal xatti-harakatini ro'yxatdan chiqaradi va (signal.Reset kabi) standart xatti-harakatni tiklashi mumkin; SIGINT uchun standart xatti-harakat chiqish. Shu sababli to'xtash jarayonida qotib qolsa, ikkinchi Ctrl+C jarayonni uzishga imkon beradi."
  - q: "`signal.Notify(sig, syscall.SIGTERM)` bilan `sig := make(chan os.Signal)` (bufersiz) yaratildi. Muammo nima?"
    options:
      - "Muammo yo'q, kanal bufersiz ham ishlaydi"
      - "Bufersiz kanal goroutine sizishiga olib keladi"
      - "Notify faqat chan struct{} qabul qiladi"
      - "Signal kelgan paytda qabul qiluvchi tayyor bo'lmasa, signal yo'qolishi mumkin; kamida 1 buferli kanal kerak (go vet buni ogohlantiradi)"
    answer: 3
    explain: "Notify signalni bloklamasdan yuboradi: kanal band bo'lsa, signal tashlab yuboriladi. Shuning uchun kanal buferli bo'lishi kerak (odatda 1). go vet bufersiz kanalni Notify'da ishlatishni ogohlantiradi. NotifyContext bu detalni yashiradi."
  - q: "Server `srv.Shutdown(ctx)` chaqirdi va `ListenAndServe` darhol `http.ErrServerClosed` bilan qaytdi. `main` shu xato bilan chiqib ketsa nima bo'ladi?"
    options:
      - "Hech narsa, Shutdown o'zi hamma so'rovni kutadi"
      - "Process chiqadi va hali bajarilayotgan so'rovlar uziladi; main Shutdown qaytguncha kutishi shart"
      - "Go runtime main'ni Shutdown tugaguncha ushlab turadi"
      - "Server qayta ishga tushadi"
    answer: 1
    explain: "Hujjat aynan shuni ogohlantiradi: ListenAndServe Shutdown boshlanishi bilan qaytadi, dastur esa Shutdown tugaguncha kutishi kerak. Aks holda main tugab, process so'rovlarni uzadi. Shuning uchun Shutdown natijasi kutiladigan oqimda chaqiriladi va main uning qaytishini kutadi."
  - q: "Servisda WebSocket yoki boshqa hijack qilingan ulanishlar bor. `Shutdown` ular bilan nima qiladi?"
    options:
      - "Ularni yopadi va kutadi"
      - "Ularni avtomatik qayta ulaydi"
      - "Ularni yopmaydi ham, kutmaydi ham; ularga alohida xabar yuborish kerak (masalan RegisterOnShutdown bilan)"
      - "Faqat HTTP/2 ulanishlarini yopadi"
    answer: 2
    explain: "Hujjat: Shutdown hijack qilingan ulanishlarni (WebSocket kabi) yopishga ham, kutishga ham urinmaydi. Chaqiruvchi ularni alohida xabardor qilib, yopilishini kutishi kerak; RegisterOnShutdown shu uchun funksiya ro'yxatdan o'tkazadi."
  - q: "`LoadConfig` birinchi xatoda darhol qaytadi (fail-fast). `errors.Join` bilan hamma xatoni yig'ib qaytarishning afzalligi nima?"
    options:
      - "Operator bitta ishga tushirishda barcha noto'g'ri sozlamani ko'radi va ularni bir yurishda tuzatadi"
      - "Dastur tezroq ishga tushadi"
      - "errors.Join xatolarni yashiradi"
      - "Joylashuv ahamiyatsiz, bu faqat uslub"
    answer: 0
    explain: "Konfiguratsiya xatosi deploy paytida topiladi; har xato uchun alohida qayta ishga tushirish (va kutish) vaqt yo'qotadi. errors.Join (Go 1.20) bir nechta xatoni bitta qiymatga yig'adi, matni har xatoni yangi qatordan ko'rsatadi (misolda ikkita satr chiqdi)."
task:
  title: "Ishchilarni to'xtatishda yo'qotishsiz tugatish"
  prompt: |
    Quyidagi dastur uchta ishchi goroutine'ga ish beradi. 100 ms dan keyin o'ziga SIGTERM yuboradi (haqiqiy servisda uni orkestrator yuboradi). Hozirgi `main` signalni olgach darhol chiqib ketadi: bajarilayotgan ishlar yo'qoladi (`boshlangan` > `tugagan`).

    Vazifa: `signal.NotifyContext` ishlating. Produser context bekor bo'lganda yangi ish berishni to'xtatsin va `jobs` kanalini yopsin, `main` esa ishchilar tugashini `WaitGroup` bilan kutsin. Kutish 2 soniyalik timeout bilan cheklansin. Signal olingach `stop()` chaqirilsin (ikkinchi signal standart xatti-harakatni tiklasin). Oxirida `boshlangan == tugagan: true` chiqishi kerak. Linux/macOS uchun yozing.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "os"
        "os/signal"
        "sync"
        "sync/atomic"
        "syscall"
        "time"
    )

    var started, finished atomic.Int64

    func worker(jobs <-chan int, wg *sync.WaitGroup) {
        defer wg.Done()
        for range jobs {
            started.Add(1)
            time.Sleep(40 * time.Millisecond) // bitta nuqtani qayta ishlash
            finished.Add(1)
        }
    }

    func main() {
        sig := make(chan os.Signal, 1)
        signal.Notify(sig, syscall.SIGTERM)

        jobs := make(chan int)
        var wg sync.WaitGroup
        for i := 0; i < 3; i++ {
            wg.Add(1)
            go worker(jobs, &wg)
        }

        // Demo: 100 ms dan keyin o'ziga SIGTERM yuboradi.
        time.AfterFunc(100*time.Millisecond, func() { _ = syscall.Kill(os.Getpid(), syscall.SIGTERM) })

        go func() {
            for i := 0; ; i++ {
                jobs <- i
            }
        }()

        <-sig
        // Muammo: ishchilarni kutmasdan chiqib ketadi, bajarilayotgan ishlar yo'qoladi.
        fmt.Printf("boshlangan=%d tugagan=%d\n", started.Load(), finished.Load())
        fmt.Println("boshlangan == tugagan:", started.Load() == finished.Load())
    }
  solution: |
    package main

    import (
        "context"
        "fmt"
        "os"
        "os/signal"
        "sync"
        "sync/atomic"
        "syscall"
        "time"
    )

    var started, finished atomic.Int64

    func worker(jobs <-chan int, wg *sync.WaitGroup) {
        defer wg.Done()
        for range jobs {
            started.Add(1)
            time.Sleep(40 * time.Millisecond) // bitta nuqtani qayta ishlash
            finished.Add(1)
        }
    }

    func produce(ctx context.Context, jobs chan<- int) {
        defer close(jobs) // ishchilar range'dan chiqishi uchun
        for i := 0; ; i++ {
            select {
            case jobs <- i:
            case <-ctx.Done():
                return
            }
        }
    }

    func main() {
        ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGTERM)
        defer stop()

        jobs := make(chan int)
        var wg sync.WaitGroup
        for i := 0; i < 3; i++ {
            wg.Add(1)
            go worker(jobs, &wg)
        }

        // Demo: 100 ms dan keyin o'ziga SIGTERM yuboradi.
        time.AfterFunc(100*time.Millisecond, func() { _ = syscall.Kill(os.Getpid(), syscall.SIGTERM) })

        go produce(ctx, jobs)

        <-ctx.Done()
        stop() // ikkinchi signal oddiy xatti-harakatni (chiqish) tiklaydi
        fmt.Println("signal olindi: yangi ish qabul qilinmaydi")

        done := make(chan struct{})
        go func() { wg.Wait(); close(done) }()
        select {
        case <-done:
        case <-time.After(2 * time.Second): // shutdown timeout
            fmt.Println("timeout: ishchilar tugamadi")
            os.Exit(1)
        }
        fmt.Printf("boshlangan=%d tugagan=%d\n", started.Load(), finished.Load())
        fmt.Println("boshlangan == tugagan:", started.Load() == finished.Load())
    }
  solutionNotes: |
    - `produce` `select` ichida `jobs <- i` va `ctx.Done()` ni kutadi: signal kelganda yangi ish berish to'xtaydi. `defer close(jobs)` ishchilarning `range jobs` siklidan chiqishini ta'minlaydi.
    - Yopish faqat jo'natuvchi tomonidan (produser) bajariladi; ishchilar kanalni yopmaydi.
    - `wg.Wait()` ni alohida goroutine'da chaqirib, `select` bilan `time.After(2s)` ga qarshi qo'yish: ishchi osilib qolsa, shutdown cheksiz kutmaydi. Muddat orkestratorning o'ldirish muddatidan qisqa tanlanadi.
    - `stop()` signaldan keyin chaqirilgani uchun ikkinchi Ctrl+C jarayonni darhol uzadi: qotib qolgan shutdown'ni qo'lda to'xtatish mumkin.
    - Starter'da natija `boshlangan=9 tugagan=6` bo'ldi (bizning ishga tushirishimizda har safar farq bor edi); yechimda har safar teng.
  checklist:
    - "`signal.NotifyContext` ishlatilgan va signal olingach `stop()` chaqirilgan"
    - "Produser `ctx.Done()` da to'xtaydi va `jobs` ni o'zi yopadi"
    - "`main` ishchilarni `WaitGroup` bilan kutadi, kutish 2 soniya bilan cheklangan"
    - "Chiqishda `boshlangan == tugagan: true`"
    - "`go vet` va `go build -race` bilan ishga tushirish xatosiz"
---

## Muammo

Servis ishga tushadi, ishlaydi va qachondir to'xtatiladi: yangi versiya deploy qilinganda, autoscaler tugunni olib tashlaganda, node yangilanganda. Ko'pchilik faqat birinchi qismga (ishga tushish) e'tibor beradi. Ammo "to'xtatish" har kuni sodir bo'ladigan holat va noto'g'ri bajarilsa, har deploy'da foydalanuvchi xato oladi: yarim yozilgan nuqta bazaga tushmaydi, javob kutayotgan mijozning ulanishi uziladi, buferdagi log va trace yo'qoladi. Ikkinchi tomon: noto'g'ri sozlama bilan ishga tushgan servis ishlagandek ko'rinadi va 10 daqiqadan keyin kutilmagan joyda yiqiladi.

Bu dars servisning ikki chegarasini yopadi: ishga tushishdagi konfiguratsiya (yig'ib tekshirish, tez yiqilish) va to'xtashdagi signal bilan boshqaruv (graceful shutdown). Namunalar haqiqiy: dastur o'ziga SIGTERM yuborib, bajarilayotgan so'rovning tugashini va to'xtagandan keyin yangi ulanishning rad etilishini ko'rsatadi. 72-darsda `http.Server` timeout'lari va graceful shutdown asoslari, 86-darsda tracer flush ko'rilgan edi; bu yerda ularni yagona hayot sikliga yig'amiz.

## Asosiy g'oya

### Konfiguratsiya: bir joyda, ishga tushishda, yig'ib tekshirish

Qoidalar:

1. Konfiguratsiya `main` ning boshida bir marta o'qiladi va `Config` struct'iga yig'iladi. Chuqur kod `os.Getenv` ni chaqirmaydi: bunday kod testlanmaydi va sozlamalar tarqalib ketadi. `LoadConfig(getenv func(string) string)` kabi imzo testda soxta muhit berishga imkon beradi.
2. Hamma qiymat ishga tushishda tekshiriladi (diapazon, format, bo'sh emasligi). Noto'g'ri bo'lsa, servis ishlay boshlamaydi.
3. Barcha xatolar yig'iladi: `errors.Join` (Go 1.20) bir nechta xatoni bitta qiymatga birlashtiradi, matni har xatoni yangi qatordan beradi. Operator bitta urinishda hammasini ko'radi.
4. Ustuvorlik tartibi (aniq belgilang): odatda bayroq > muhit o'zgaruvchisi > fayl > standart qiymat. Standart `flag` paketi bayroqlarni beradi; muhit o'zgaruvchilari konteyner dunyosida asosiy usul.
5. Sirlar (parol, token) konfiguratsiya struct'ida bo'lsa ham logga chiqmasin: 84-darsdagi `LogValuer` tipi yoki alohida maydon. Konfiguratsiyani to'liq logga yozishdan oldin sirlarni niqoblang.

### Signal: orkestrator qanday gaplashadi

Konteyner orkestratorlari (Kubernetes va boshqalar) to'xtatishda avval SIGTERM yuboradi, ma'lum muddatdan keyin SIGKILL. Bu Go standart kutubxonasi hujjatida emas, orkestratorning o'z hujjatiga tegishli. Kubernetes hujjatida (Pod Lifecycle, "Termination of Pods") yozilishicha, kubelet har konteynerdagi 1-jarayonga TERM signalini yuboradi, `terminationGracePeriodSeconds` standart bo'yicha 30 soniya, muddat tugagach ishlayotgan jarayonlarga SIGKILL yuboriladi. Boshqa platformalarda muddatni o'zingiz ishlatadigan platforma hujjatidan tekshiring. Lokal ishlab chiqishda Ctrl+C SIGINT yuboradi. SIGKILL ni dastur ushlay olmaydi. Demak, qoida: shutdown muddati orkestrator kutish muddatidan qisqa bo'lishi kerak.

Go'da signalni ushlash uchun ikki yo'l bor: `signal.Notify(ch, ...)` va `signal.NotifyContext(ctx, ...)`. Birinchisida kanal buferli bo'lishi shart (`make(chan os.Signal, 1)`), chunki signal kelganda qabul qiluvchi tayyor bo'lmasa, u tashlab yuboriladi; `go vet` bufersiz kanalni ogohlantiradi. `NotifyContext` esa signal kelganda context'ni bekor qiladi va dasturning qolgan qismi uchun bekor qilishni yagona mexanizmga (context, 34-dars) birlashtiradi.

## Chuqurroq: to'xtash tartibi

### Teskari tartib

Servis ishga tushishida bog'liqliklar ketma-ketligi: konfiguratsiya, logger, tracer, DB pool, ichki komponentlar, HTTP server, "tayyor" belgisi. To'xtash teskari tartibda:

1. **Readiness'ni o'chirish.** `/readyz` 503 qaytara boshlaydi, shunda load balancer yangi trafikni yuborishni to'xtatadi. Ba'zi platformalarda balanser o'zgarishni bilishi uchun qisqa pauza kerak bo'ladi (platformaga bog'liq, o'lchab ko'ring).
2. **Yangi ish qabul qilishni to'xtatish.** HTTP serverda `srv.Shutdown(ctx)`: avval listener'larni yopadi, bo'sh ulanishlarni yopadi, keyin faol so'rovlar tugashini kutadi. Navbat consumer'larida: yangi xabar olishni to'xtatish.
3. **Tugallanmagan ishni kutish**, lekin muddat bilan (`context.WithTimeout`). Muddat o'tsa, `Shutdown` context xatosini qaytaradi va siz majburan yopishga qaror qilasiz (`srv.Close`).
4. **Fon goroutine'larni to'xtatish va kutish.** Context bekor qilinadi, `WaitGroup` yoki `errgroup` kutadi (48-dars).
5. **Buferlarni flush qilish.** Tracer (`tp.Shutdown`, 86-dars), metrikalar, log buferlari.
6. **Resurslarni yopish.** DB pool, Redis ulanishi, fayllar: ularni ishlatuvchilar to'xtagandan keyin.

### Shutdown ning aniq semantikasi

`http.Server.Shutdown` hujjati: u faol ulanishlarni uzmaydi; listener'larni yopadi, bo'sh ulanishlarni yopadi va ulanishlar bo'shashini kutadi. Berilgan context tugasa, Shutdown context xatosini qaytaradi. U chaqirilishi bilan `Serve` va `ListenAndServe` darhol `ErrServerClosed` qaytaradi, shuning uchun `main` Shutdown qaytguncha kutishi kerak, aks holda process chiqib so'rovlarni uzadi. Hijack qilingan ulanishlarni (WebSocket) yopmaydi va kutmaydi; ularga alohida xabar berish kerak (`RegisterOnShutdown`). Shutdown'ga beriladigan context signal context'idan olinmaydi (u allaqachon bekor qilingan), yangi `context.Background()` + timeout olinadi.

### Ikkinchi signal

`NotifyContext` signalni o'zgartiradi: Ctrl+C endi jarayonni tugatmaydi, faqat context'ni bekor qiladi. Agar to'xtash qotib qolsa, dasturchi bosgan ikkinchi Ctrl+C ham hech narsa qilmaydi. Hujjatga ko'ra `stop` funksiyasi ro'yxatdan chiqaradi va standart xatti-harakatni tiklashi mumkin; shuning uchun signal olingach `stop()` ni darhol chaqirish ikkinchi signalni "majburan chiqish" ga aylantiradi.

### main va os.Exit

`os.Exit` deferred chaqiruvlarni bajarmaydi. Shuning uchun naqsh: `func main() { if err := run(); err != nil { log...; os.Exit(1) } }`, hamma tozalash `run` ichida `defer` bilan. Konfiguratsiya xatosi uchun alohida chiqish kodi (misolda 2) deploy tizimi uchun foydali.

### Kubernetes: SIGTERM va trafikning to'xtashi bir vaqtda sodir bo'lmaydi

Kubernetes hujjati (Pod Lifecycle, "Pod Termination Flow") ketma-ketlikni shunday beradi: Pod o'chirishga belgilanadi va grace period boshlanadi; kubelet `preStop` hook bo'lsa avval uni ishga tushiradi; keyin konteyner runtime har konteynerdagi 1-jarayonga TERM yuboradi. Aynan shu paytda control plane Pod'ni Service'ning EndpointSlice'laridan chiqarish masalasini ko'radi. Ya'ni "SIGTERM keldi" va "balanser sizga trafik yuborishni to'xtatdi" bir lahzada emas, parallel jarayonlar. Hujjat shuningdek, terminating endpoint'ning `ready` holati doim `false` bo'lishini, haqiqiy holat esa `serving` sharti bilan ko'rinishini yozadi. Shu sababli ba'zi jamoalar signal olingach readiness'ni o'chirib, darhol `Shutdown` chaqirmay, qisqa pauza (yoki `preStop` da sleep) qo'yadi. Pauza uzunligi hujjatda berilmagan, uni o'z klasteringizda o'lchash kerak. `preStop` ham `terminationGracePeriodSeconds` ichiga sanaladi: hujjat hook muddatdan oshib ketsa, kubelet atigi 2 soniyalik bir martalik uzaytirish so'rashini yozadi. Demak, `preStop` pauzasi + `Shutdown` timeout'i yig'indisi grace period'dan kichik bo'lishi shart.

### BaseContext: signal context'ini so'rovlarga ulashdan ehtiyot bo'ling

`http.Server.Shutdown` hujjatiga ko'ra faol ulanishlarni uzmaydi va ular bo'shashini kutadi. Lekin handler ichidagi `r.Context()` qayerdan kelishi sizning qo'lingizda: `Server.BaseContext` `nil` bo'lsa, `context.Background()` olinadi. Ba'zi kodlarda "hamma narsa signal bilan to'xtasin" deb `BaseContext` ga `signal.NotifyContext` natijasi beriladi. Natija: signal kelgan zahoti har bir faol so'rovning context'i bekor bo'ladi, `Shutdown` esa kutadigan so'rovlar allaqachon yarim yo'lda uzilgan bo'ladi. Ikki variantni solishtiruvchi tajriba (signalni `cancel()` bilan taqlid qildik, Go 1.24.7, linux/amd64, 3 marta ishga tushirildi):

```go
package main

import (
	"context"
	"fmt"
	"io"
	"net"
	"net/http"
	"time"
)

// scenario slow so'rov ketayotganda "signal" (cancel) keladi va Shutdown chaqiriladi.
// useBase true bo'lsa, signal context'i serverning BaseContext'i qilib berilgan.
func scenario(useBase bool) string {
	sigCtx, cancel := context.WithCancel(context.Background())
	defer cancel()

	mux := http.NewServeMux()
	mux.HandleFunc("/slow", func(w http.ResponseWriter, r *http.Request) {
		select {
		case <-time.After(300 * time.Millisecond):
			fmt.Fprint(w, "tugadi")
		case <-r.Context().Done():
			http.Error(w, "bekor qilindi", http.StatusServiceUnavailable)
		}
	})
	srv := &http.Server{Handler: mux}
	if useBase {
		srv.BaseContext = func(net.Listener) context.Context { return sigCtx }
	}
	ln, _ := net.Listen("tcp", "127.0.0.1:0")
	go srv.Serve(ln)

	type result struct {
		code int
		body string
	}
	done := make(chan result)
	go func() {
		resp, err := http.Get("http://" + ln.Addr().String() + "/slow")
		if err != nil {
			done <- result{0, err.Error()}
			return
		}
		defer resp.Body.Close()
		b, _ := io.ReadAll(resp.Body)
		done <- result{resp.StatusCode, string(b)}
	}()

	time.Sleep(100 * time.Millisecond)
	cancel() // signal keldi
	sctx, c2 := context.WithTimeout(context.Background(), 2*time.Second)
	defer c2()
	err := srv.Shutdown(sctx)
	res := <-done
	return fmt.Sprintf("status=%d body=%q shutdown=%v", res.code, res.body, err)
}

func main() {
	fmt.Println("BaseContext default :", scenario(false))
	fmt.Println("BaseContext = signal:", scenario(true))
}
```

```text
BaseContext default : status=200 body="tugadi" shutdown=<nil>
BaseContext = signal: status=503 body="bekor qilindi\n" shutdown=<nil>
```

Birinchi holatda so'rov to'liq bajarildi. Ikkinchisida `Shutdown` xatosiz qaytdi (ulanish tez bo'shadi), lekin mijoz 503 oldi: "toza to'xtash" metrikasi yashil, foydalanuvchi esa xato ko'rdi. Xulosa: `BaseContext` ni faqat so'rovlarni ataylab shu zahoti bekor qilmoqchi bo'lsangiz ulang. Odatiy graceful shutdown uchun signal context'i faqat `main`/`run` ichidagi fon goroutine'larga beriladi, so'rov context'lari esa Shutdown timeout'i tugagach (`srv.Close`) bekor bo'ladi.

## Misol: server, readiness va toza to'xtash

Dastur konfiguratsiyani yig'ib tekshiradi, serverni ephemeral portda ishga tushiradi, 300 ms davom etadigan `/slow` so'rovini yuboradi, 100 ms dan keyin o'ziga SIGTERM yuboradi (bu demo uchun; haqiqiy servisda signalni orkestrator beradi, Linux/macOS), va to'xtash natijasini ko'rsatadi:

```go
package main

import (
	"context"
	"errors"
	"fmt"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"sync/atomic"
	"syscall"
	"time"
)

// Config muhit o'zgaruvchilaridan o'qiladi va ishga tushishdan oldin tekshiriladi.
type Config struct {
	Addr            string
	ShutdownTimeout time.Duration
}

func LoadConfig(getenv func(string) string) (Config, error) {
	cfg := Config{Addr: "127.0.0.1:0", ShutdownTimeout: 5 * time.Second}
	var errs []error
	if v := getenv("APP_ADDR"); v != "" {
		cfg.Addr = v
	}
	if v := getenv("APP_SHUTDOWN_TIMEOUT"); v != "" {
		d, err := time.ParseDuration(v)
		if err != nil || d <= 0 {
			errs = append(errs, fmt.Errorf("APP_SHUTDOWN_TIMEOUT=%q: musbat davomiylik kerak", v))
		} else {
			cfg.ShutdownTimeout = d
		}
	}
	if v := getenv("APP_WORKERS"); v != "" {
		if n, err := strconv.Atoi(v); err != nil || n < 1 {
			errs = append(errs, fmt.Errorf("APP_WORKERS=%q: 1 yoki katta butun son kerak", v))
		}
	}
	return cfg, errors.Join(errs...)
}

func run(ctx context.Context, cfg Config, ready chan<- string) error {
	var draining atomic.Bool

	mux := http.NewServeMux()
	mux.HandleFunc("GET /readyz", func(w http.ResponseWriter, r *http.Request) {
		if draining.Load() {
			http.Error(w, "to'xtayapti", http.StatusServiceUnavailable)
			return
		}
		fmt.Fprintln(w, "tayyor")
	})
	mux.HandleFunc("GET /slow", func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(300 * time.Millisecond) // hali tugamagan so'rovni modellashtiradi
		fmt.Fprintln(w, "slow tugadi")
	})

	ln, err := net.Listen("tcp", cfg.Addr)
	if err != nil {
		return err
	}
	srv := &http.Server{Handler: mux, ReadHeaderTimeout: 5 * time.Second}

	serveErr := make(chan error, 1)
	go func() { serveErr <- srv.Serve(ln) }()
	ready <- ln.Addr().String()

	select {
	case err := <-serveErr:
		return err // Serve kutilmagan xato bilan tugadi
	case <-ctx.Done():
	}

	fmt.Println("signal olindi: to'xtash boshlandi")
	draining.Store(true) // readiness 503 qaytaradi: balanser trafikni olib qo'yadi

	sctx, cancel := context.WithTimeout(context.Background(), cfg.ShutdownTimeout)
	defer cancel()
	if err := srv.Shutdown(sctx); err != nil {
		return fmt.Errorf("shutdown: %w", err)
	}
	fmt.Println("server toza to'xtadi")
	return nil
}

func main() {
	cfg, err := LoadConfig(os.Getenv)
	if err != nil {
		fmt.Fprintln(os.Stderr, "konfiguratsiya xatosi:", err)
		os.Exit(2)
	}
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	ready := make(chan string, 1)
	done := make(chan error, 1)
	go func() { done <- run(ctx, cfg, ready) }()

	// Demo: o'ziga SIGTERM yuboradi (Linux/macOS). Haqiqiy servisda signalni orkestrator yuboradi.
	addr := <-ready
	slowDone := make(chan string, 1)
	go func() {
		resp, err := http.Get("http://" + addr + "/slow")
		if err != nil {
			slowDone <- "xato: " + err.Error()
			return
		}
		defer resp.Body.Close()
		b := make([]byte, 64)
		n, _ := resp.Body.Read(b)
		slowDone <- fmt.Sprintf("slow so'rov: %d, %s", resp.StatusCode, string(b[:n-1]))
	}()
	time.Sleep(100 * time.Millisecond) // so'rov server ichiga kirib ulgursin
	_ = syscall.Kill(os.Getpid(), syscall.SIGTERM)

	if err := <-done; err != nil {
		fmt.Fprintln(os.Stderr, "run xatosi:", err)
		os.Exit(1)
	}
	fmt.Println(<-slowDone)
	if _, err := http.Get("http://" + addr + "/readyz"); err != nil {
		fmt.Println("to'xtagandan keyin yangi ulanish: rad etildi")
	}
}
```

Chiqish (Go 1.24.7, linux/amd64; 15 marta ishga tushirdik, har safar bir xil):

```text
signal olindi: to'xtash boshlandi
server toza to'xtadi
slow so'rov: 200, slow tugadi
to'xtagandan keyin yangi ulanish: rad etildi
```

Nimalar ko'rinadi:

- Signal olingach `draining` bayrog'i o'rnatiladi: `/readyz` shundan keyin 503 beradi (bu demo faqat bayroqni o'rnatadi; balanser tomoni platformaga bog'liq).
- `Shutdown` hali tugamagan `/slow` so'rovini kutdi: mijoz `200` va to'liq javobni oldi.
- To'xtagandan keyin yangi ulanish rad etildi.
- `ready` kanali orqali server manzili berilgani uchun `run` testlanadigan: manzil tayyor bo'lgach test so'rov yuborishi mumkin.

Noto'g'ri sozlamalar bilan ishga tushirish (`APP_WORKERS=0 APP_SHUTDOWN_TIMEOUT=abc`):

```text
konfiguratsiya xatosi: APP_SHUTDOWN_TIMEOUT="abc": musbat davomiylik kerak
APP_WORKERS="0": 1 yoki katta butun son kerak
```

Ikkala xato bitta ishga tushirishda ko'rindi, jarayon `2` kodi bilan chiqdi (`go run` buni "exit status 2" deb ko'rsatadi). `APP_WORKERS` bu misolda faqat tekshiriladi: qiymatni ishlatuvchi komponent yo'q, lekin tekshiruv ishga tushishdagi qoidani ko'rsatadi.

### Qarorlar

- `run(ctx, cfg, ready)` `main` dan ajratilgan: signal va chiqish kodi `main` da, mantiq `run` da. Test `run` ni o'z context'i bilan chaqiradi va signalga muhtoj emas.
- `Serve` xatosi alohida kanal orqali keladi: kutilmagan xato bilan tugasa (masalan listener yopilsa), `select` buni ushlaydi va bekor qilishni kutmaydi.
- `ReadHeaderTimeout` o'rnatilgan (72-dars): sekin mijoz serverni egallab turmasligi uchun.

## Qachon qo'llamaslik kerak

- Cheksiz kutish: `Shutdown` ga timeout bermasangiz, osilib qolgan ulanish to'xtashni abadiy ushlab turadi. Muddatni orkestrator muddatidan qisqa qiling.
- Hamma narsani bir tartibda to'xtatish: tartib bog'liqlikka bog'liq. DB ni server to'xtamasdan yopsangiz, hali bajarilayotgan so'rovlar xato oladi.
- Konfiguratsiya o'zgarishini ishlash vaqtida qayta o'qish (hot reload) hammasi uchun kerak emas. U murakkablik, race va test yuklarini qo'shadi. Ko'p servis uchun konfiguratsiyani o'zgartirib qayta ishga tushirish yetarli (rolling update).
- Konfiguratsiyani global o'zgaruvchi qilib hamma joydan o'qish: testlash qiyinlashadi. `Config` ni konstruktor orqali bering (91-dars).
- Signalni kutubxona ichida ushlash: signalni faqat `main` ushlaydi; kutubxona esa context qabul qiladi.
- Graceful shutdown ni "muvaffaqiyatli deploy" bilan tenglash: agar mijoz klienti qayta urinmasa yoki so'rovlar shutdown muddatidan uzoq bo'lsa, baribir xato bo'ladi. Uzoq so'rovlar uchun idempotentlik va qayta urinish zarur (80-dars).

## Stack'da: Node.js bilan farq

Node.js'da `process.on('SIGTERM', ...)` ichida `server.close()` chaqiriladi: hozirgi hujjatga ko'ra u yangi ulanishlarni to'xtatadi va so'rov yubormayotgan (bo'sh) ulanishlarni yopadi, faol so'rovlarni majburan uzish uchun esa `server.closeAllConnections()` bor. Eski Node.js versiyalarida keep-alive ulanishlar `close()` callback'ini kutdirib qo'yishi mumkin edi. Go'da `Shutdown` bo'sh ulanishlarni o'zi yopadi va faol so'rovni kutadi, muddat esa context orqali aniq beriladi. NestJS'da `app.enableShutdownHooks()` va `OnApplicationShutdown` hook'lari bor; Go'da bu tartib aniq yoziladi, odatda `run` funksiyasida ketma-ket yoki `errgroup` bilan, framework yashirin chaqirmaydi.

Konfiguratsiya tomonida NestJS `ConfigModule` + `class-validator`/`zod` bilan validatsiya qiladi. Go'da ekvivalenti oddiy: struct, `LoadConfig` va `errors.Join`. Telemetriya platformasi uchun amaliy to'plam: HTTP server, navbat consumer'lari va fon "flush" goroutine'i bitta context'dan boshqariladi; signal kelganda avval readiness, so'ng server va consumer'lar, keyin batch flush, keyin DB pool yopiladi.

## Xulosa

- Konfiguratsiya `main` ning boshida bir marta o'qiladi, to'liq tekshiriladi va barcha xatolar `errors.Join` bilan birga qaytariladi; yaroqsiz bo'lsa servis ishga tushmaydi.
- Signalni `main` da `signal.NotifyContext(ctx, os.Interrupt, syscall.SIGTERM)` bilan ushlang; `signal.Notify` kanali buferli bo'lishi shart; signal olingach `stop()` ni chaqiring.
- To'xtash tartibi ishga tushishning teskarisi: readiness, yangi ishni to'xtatish, tugallanmaganni (muddat bilan) kutish, fon goroutine'lar, flush, resurslarni yopish.
- `Shutdown` faol so'rovlarni kutadi, lekin hijack qilingan ulanishlarni kutmaydi; `ListenAndServe` darhol qaytadi, shuning uchun `main` Shutdown tugashini kutishi kerak.
- `os.Exit` defer'larni bajarmaydi: `run() error` naqshini qo'llang; shutdown muddati orkestrator muddatidan qisqa bo'lsin.
