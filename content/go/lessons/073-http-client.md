---
n: 73
slug: http-client
title: "net/http client: Transport, pooling, timeout va retry"
summary: "Client va Transport vazifalari, connection pool qanday ishlaydi, nega javob tanasini o'qib yopish kerak, Client.Timeout nimani qamraydi, Transport'ni qanday sozlash va qaysi so'rovlarni qayta yuborish xavfsiz."
duration: 45
sources:
  - id: pkg-net-http
    note: "Client.Timeout, Response.Body, Transport maydonlari (MaxIdleConnsPerHost, MaxConnsPerHost, ForceAttemptHTTP2) va Transport'ning qayta urinish qoidasi; Request.GetBody"
  - id: 100go
    note: "\"Using the default HTTP client and server\" (#81) va \"Not closing transient resources\" (#79)"
  - id: go126
    note: "net/http bo'limi: Transport.NewClientConn va HTTP2Config.StrictMaxConcurrentRequests"
  - id: go127
    note: "net/http bo'limi: HTTP/1 Response.Body yopilganda o'qilmagan ma'lumotni konservativ limitgacha avtomatik o'qib tashlaydi"
quiz:
  - q: "Mijoz bir xil serverga ketma-ket 5 ta GET yuboradi. Har javob 1 MB, kod esa faqat `resp.Body.Close()` chaqiradi, tanani o'qimaydi. Go 1.24 da lokal o'lchovda nechta TCP ulanish ochildi?"
    options:
      - "1 ta, chunki Close ulanishni poolga qaytaradi"
      - "5 ta: o'qilmagan tana qolgan ulanish qayta ishlatilmadi"
      - "2 ta, chunki MaxIdleConnsPerHost 2"
      - "0 ta, HTTP/2 ishlatildi"
    answer: 1
    explain: "O'lchovda faqat Close qilinganda 5 ta ulanish, tana io.Copy(io.Discard) bilan o'qib tashlanganda esa 1 ta ulanish hisoblandi. Hujjat ham HTTP/1.x keep-alive ulanish tana to'liq o'qilmasa qayta ishlatilmasligi mumkinligini aytadi. Go 1.27 release notes'da bu xatti-harakat yumshatilgan (Close konservativ limitgacha o'zi o'qiydi), lekin katta javoblarda bunga tayanmang."
  - q: "`Client{Timeout: 150 * time.Millisecond}`. Server sarlavhalarni darhol yubordi, tanani esa 500 ms dan keyin. Natija?"
    options:
      - "Get xato bilan qaytadi, chunki umumiy muddat o'tgan"
      - "Get muvaffaqiyatli qaytadi, tananing o'qilishi esa muddat o'tgani uchun xato beradi (context deadline exceeded ... while reading body)"
      - "Timeout faqat ulanish o'rnatilishiga tegadi, tana cheksiz kutiladi"
      - "Timeout 150 ms dan keyin faqat bitta uzilishsiz urinishni takrorlaydi"
    answer: 1
    explain: "Hujjatga ko'ra Client.Timeout ulanish, redirect'lar va javob tanasini o'qishni qamraydi, taymer Get qaytgandan keyin ham ishlaydi. Lokal sinovda aynan shu chiqdi: sarlavha keldi, ReadAll esa context deadline exceeded xatosini qaytardi."
  - q: "Jamoadan biri `client := &http.Client{Transport: &http.Transport{MaxIdleConnsPerHost: 50}}` yozdi. DefaultTransport bilan solishtirganda nima yo'qoladi?"
    options:
      - "Hech narsa: yangi Transport DefaultTransport sozlamalarini meros qilib oladi"
      - "Faqat HTTP/2 yo'qoladi"
      - "Faqat idle ulanishlar vaqti cheksiz bo'ladi"
      - "Proxy muhit o'zgaruvchilari (ProxyFromEnvironment), dial va TLS handshake timeout'lari, MaxIdleConns va IdleConnTimeout default'lari: nol qiymatlar cheklovsizlikni bildiradi"
    answer: 3
    explain: "DefaultTransport o'z maydonlarini aniq o'rnatadi (30 s dial timeout, TLS handshake 10 s, IdleConnTimeout 90 s, MaxIdleConns 100, Proxy: ProxyFromEnvironment, ForceAttemptHTTP2). Bo'sh &http.Transport{} bularni meros qilmaydi. To'g'ri yo'l: DefaultTransport.(*http.Transport).Clone() qilib, kerakli maydonlarni o'zgartirish."
  - q: "Quyidagilardan qaysi birini ilova kodida avtomatik retry qilish eng xavfsiz?"
    options:
      - "POST /payments, Idempotency-Key sarlavhasiz"
      - "POST /orders, server har chaqiruvda yangi buyurtma yaratadi"
      - "PUT /sensors/7 (to'liq holatni almashtiradi) yoki Idempotency-Key bilan yuborilgan POST"
      - "PATCH /balance, {\"delta\": -100}"
    answer: 2
    explain: "PUT semantikasi bo'yicha idempotent, kalitli POST ham takror qo'llanganda bir xil natija berishi kerak. Qolgan variantlarda takror yuborish ikki marta to'lov, ikki buyurtma yoki ikki marta ayirishga olib keladi. Transport o'zi ham faqat idempotent so'rovlarni (GET, HEAD, OPTIONS, TRACE yoki Idempotency-Key bilan) qayta yuboradi."
  - q: "Servis bitta ichki API serveriga bir vaqtda 50 ta so'rov yuboradi, Transport sozlamalari default. Burst'dan keyin yana burst keladi. Nima kuzatiladi?"
    options:
      - "Har safar 50 ta ulanish qayta ishlatiladi, chunki MaxIdleConns 100"
      - "Har burst'da yangi ulanishlar ochiladi: bitta host uchun idle ulanishlar default'da 2 ta bilan cheklangan (DefaultMaxIdleConnsPerHost), qolganlari yopiladi"
      - "Transport avtomatik HTTP/2 ga o'tib, bitta ulanish ishlatadi, shuning uchun muammo yo'q"
      - "50 ta so'rov ketma-ket bajariladi, chunki MaxConnsPerHost 1"
    answer: 1
    explain: "MaxIdleConns umumiy chegara (100), MaxIdleConnsPerHost esa bitta host uchun (default 2). Bitta ichki servisga ko'p parallel so'rov yuboradigan klientda ikkinchisini oshirish kerak. MaxConnsPerHost default nol, ya'ni cheklanmagan. HTTP/2 faqat serverda va TLS (yoki aniq sozlangan h2c) bo'lsa ishlaydi."
  - q: "Retry funksiyasi `req.Body` bytes.Reader'dan yaratilgan so'rovni qayta yuboradi, lekin har urinishda bir xil `*http.Request` obyektini `client.Do` ga beradi. Muammo?"
    options:
      - "Muammo yo'q: Do tanani har safar boshidan o'qiydi"
      - "Faqat redirect bo'lsa muammo bo'ladi"
      - "Tana birinchi urinishda iste'mol qilingan; keyingi urinishda bo'sh yuboriladi. Har urinish uchun so'rovni yangidan yarating yoki GetBody bilan tanani qayta oling"
      - "Go so'rovni klonlaydi, shuning uchun hamma narsa to'g'ri ishlaydi"
    answer: 2
    explain: "Request.Body bir marta o'qiladigan oqim. Shuning uchun misolda build funksiyasi har urinishda so'rovni yangidan quradi (bytes.Reader bilan NewRequest GetBody'ni ham o'rnatadi). Yoki req.GetBody() dan yangi tana olinadi."
task:
  title: "Tanani o'qib tashlaydigan va muddatli fetchStatus"
  prompt: |
    Servis boshqa komponentning health-endpoint'iga `fetchStatus` bilan murojaat qiladi. Hozir funksiya `c.Get(url)` ni context'siz chaqiradi va javob tanasini yopmaydi.

    Natija: (1) har chaqiruv yangi TCP ulanish ochadi, (2) osilgan server `fetchStatus`ni cheksiz kutdiradi.

    `fetchStatus` ni tuzating:
    - so'rov berilgan `ctx` ga bog'lansin va yana 200 ms muddat bilan cheklansin;
    - tana yopilsin va o'qib tashlansin (hajmi cheklangan holda, 1 MiB gacha), shunda ulanish qayta ishlatiladi;
    - status kodi qaytarilsin.

    Kutilgan natija: 5 ta ketma-ket chaqiruv 1 ta TCP ulanish ochadi, osilgan serverga chaqiruv esa `context deadline exceeded` xatosi bilan qaytadi.
  lang: go
  starter: |
    package main

    import (
        "context"
        "fmt"
        "net"
        "net/http"
        "net/http/httptest"
        "sync/atomic"
        "time"
    )

    // fetchStatus url'ga GET yuboradi va status kodni qaytaradi.
    func fetchStatus(ctx context.Context, c *http.Client, url string) (int, error) {
        resp, err := c.Get(url)
        if err != nil {
            return 0, err
        }
        return resp.StatusCode, nil
    }

    func main() {
        var conns atomic.Int32
        ok := httptest.NewUnstartedServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            fmt.Fprint(w, "{\"status\":\"ok\"}")
        }))
        ok.Config.ConnState = func(_ net.Conn, s http.ConnState) {
            if s == http.StateNew {
                conns.Add(1)
            }
        }
        ok.Start()
        defer ok.Close()

        hang := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            <-r.Context().Done() // javob bermaydi
        }))
        defer func() {
            hang.CloseClientConnections()
            hang.Close()
        }()

        client := &http.Client{Transport: &http.Transport{MaxIdleConnsPerHost: 4}}
        for i := 0; i < 5; i++ {
            code, err := fetchStatus(context.Background(), client, ok.URL)
            fmt.Println("status:", code, "xato:", err)
        }
        fmt.Println("TCP ulanishlar:", conns.Load())

        done := make(chan error, 1)
        go func() {
            _, err := fetchStatus(context.Background(), client, hang.URL)
            done <- err
        }()
        select {
        case err := <-done:
            fmt.Println("osilgan server:", err)
        case <-time.After(time.Second):
            fmt.Println("osilgan server: 1 soniyada qaytmadi")
        }
    }
  solution: |
    package main

    import (
        "context"
        "fmt"
        "io"
        "net"
        "net/http"
        "net/http/httptest"
        "sync/atomic"
        "time"
    )

    // fetchStatus url'ga GET yuboradi va status kodni qaytaradi. So'rov 200ms
    // bilan cheklangan, javob tanasi o'qib tashlanadi, ulanish qayta ishlatiladi.
    func fetchStatus(ctx context.Context, c *http.Client, url string) (int, error) {
        ctx, cancel := context.WithTimeout(ctx, 200*time.Millisecond)
        defer cancel()
        req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
        if err != nil {
            return 0, err
        }
        resp, err := c.Do(req)
        if err != nil {
            return 0, err
        }
        defer resp.Body.Close()
        _, _ = io.Copy(io.Discard, io.LimitReader(resp.Body, 1<<20))
        return resp.StatusCode, nil
    }

    func main() {
        var conns atomic.Int32
        ok := httptest.NewUnstartedServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            fmt.Fprint(w, "{\"status\":\"ok\"}")
        }))
        ok.Config.ConnState = func(_ net.Conn, s http.ConnState) {
            if s == http.StateNew {
                conns.Add(1)
            }
        }
        ok.Start()
        defer ok.Close()

        hang := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            <-r.Context().Done() // javob bermaydi
        }))
        defer func() {
            hang.CloseClientConnections()
            hang.Close()
        }()

        client := &http.Client{Transport: &http.Transport{MaxIdleConnsPerHost: 4}}
        for i := 0; i < 5; i++ {
            code, err := fetchStatus(context.Background(), client, ok.URL)
            fmt.Println("status:", code, "xato:", err)
        }
        fmt.Println("TCP ulanishlar:", conns.Load())

        done := make(chan error, 1)
        go func() {
            _, err := fetchStatus(context.Background(), client, hang.URL)
            done <- err
        }()
        select {
        case err := <-done:
            fmt.Println("osilgan server:", err)
        case <-time.After(time.Second):
            fmt.Println("osilgan server: 1 soniyada qaytmadi")
        }
    }
  solutionNotes: |
    - `http.NewRequestWithContext` + `ctx` ga `WithTimeout` so'rovning butun hayotini (ulanish, sarlavha, tana) cheklaydi. `Client.Timeout` ham shuni qiladi, lekin context chaqiruvchi tomonidan ham bekor qilinishi mumkin va komponentlar orasida uzatiladi.
    - `defer resp.Body.Close()` har doim kerak: tanani yopmaslik ulanish va goroutine'ni oqizadi.
    - `io.Copy(io.Discard, io.LimitReader(resp.Body, 1<<20))` tananing qolgan qismini o'qib tashlaydi, shunda HTTP/1.x ulanishi poolga qaytadi. Limit zararli serverdan cheksiz tana kelishining oldini oladi. 1 MiB dan katta tana qolsa, ulanish yopiladi: bu to'g'ri tanlov.
    - Lokal tekshiruv: 5 ta chaqiruv 1 ta TCP ulanish ochdi; osilgan server 200 ms dan keyin `context deadline exceeded` bilan qaytdi. Starter esa 5 ulanish ochdi va osilgan serverda qaytmadi.
  checklist:
    - "So'rov `NewRequestWithContext` bilan yaratilgan va `ctx` ga 200 ms muddat qo'yilgan"
    - "`resp.Body.Close()` defer bilan chaqiriladi"
    - "Tana `io.Discard` ga hajmi cheklangan holda o'qib tashlanadi"
    - "5 ta chaqiruv 1 ta TCP ulanish ochadi"
    - "Osilgan serverga chaqiruv `context deadline exceeded` bilan tugaydi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

HTTP client kodi ko'rinishidan oddiy: `http.Get(url)`, javobni o'qi, tamom. Aynan shu soddalik production'da uch xil sekin to'planadigan muammoga olib keladi.

Birinchisi: `http.DefaultClient` va `http.Get` timeout'siz. Sust yoki osilgan server chaqiruvchi goroutine'ni abadiy ushlaydi. Servisning bitta bog'liq komponenti sekinlashsa, barcha so'rov goroutine'lari unda to'planadi va servis o'zi ham javob bermay qoladi. 100 Go Mistakes kitobi buni #81 xato ("default HTTP client va server'dan foydalanish") sifatida keltiradi.

Ikkinchisi: javob tanasi bilan noto'g'ri munosabat. Tana yopilmasa, ulanish va goroutine oqadi (#79). Tana yopilib, lekin o'qilmasa, HTTP/1.x ulanishi qayta ishlatilmaydi: har so'rov yangi TCP (va TLS) handshake qiladi, kechikish va CPU xarajati o'sadi. Lokal o'lchovda shunday: 5 ta 1 MB javobdan keyin faqat `Close` qilinsa 5 ulanish, o'qib tashlansa 1 ulanish ochildi.

Uchinchisi: noto'g'ri retry. To'lov so'rovi tarmoq xatosida qayta yuborilsa, mijoz ikki marta yechilishi mumkin. Retry'ni butunlay qo'ymaslik ham yomon: vaqtinchalik 503 yoki uzilgan ulanish tufayli keraksiz xato ko'rsatiladi.

Node.js'da `fetch`, axios yoki undici bilan ishlagan dasturchi bu mavzularni biladi: timeout uchun `AbortController`, ulanish pooling uchun `Agent`. Go'da shu tushunchalar `context`, `Transport` va `Client` ga xaritalanadi. Farqi: standart kutubxona nima qilishini aniq bilish kerak, chunki default'lar sizni himoya qilmaydi.

## Asosiy g'oya

### Client va Transport

`http.Client` siyosat qatlami: redirect'larni qanday kuzatish (`CheckRedirect`, default 10 ta ketma-ket so'rovdan keyin to'xtaydi), cookie jar va umumiy `Timeout`. `http.Transport` mexanizm qatlami: DNS va dial, TLS handshake, proxy, ulanishlar pool'i, HTTP/1 va HTTP/2. Client `Transport` maydonidan foydalanadi (nil bo'lsa `DefaultTransport`).

Muhim qoida: Client va Transport bir marta yaratiladi va butun dastur bo'ylab, ko'p goroutine'dan qayta ishlatiladi. Har so'rovga yangi Transport yaratish pool'dan foydalanishni yo'qqa chiqaradi: har Transport o'z ulanishlarini ochadi va ular `IdleConnTimeout` gacha idle holda ushlanadi.

### Timeout'lar qatlamlari

- `Client.Timeout` hujjatga ko'ra ulanish vaqtini, redirect'larni va javob tanasini o'qishni qamraydi; taymer `Get` qaytgandan keyin ham ishlaydi va `Body` o'qishni uzadi. Lokal sinov: sarlavha tez keldi, `ReadAll` esa `context deadline exceeded (Client.Timeout or context cancellation while reading body)` xatosini berdi.
- So'rov context'i (`NewRequestWithContext`): chaqiruvchi tomonidan bekor qilinishi mumkin va bir necha chaqiruvdan iborat operatsiyaga umumiy muddat qo'yadi (34-dars).
- `Transport` darajasida aniq bosqich timeout'lari: dialer'ning `Timeout`i, `TLSHandshakeTimeout`, `ResponseHeaderTimeout`, `ExpectContinueTimeout`, `IdleConnTimeout`.

Amaliy qoida: har chaqiruvga context bilan muddat bering, Transport'da esa bosqich chegaralarini (dial, TLS, sarlavha) qo'ying. `Client.Timeout`ni streaming yoki katta fayl yuklashda ehtiyot bilan ishlating: u butun tanani qamraydi.

### DefaultTransport nimani sozlaydi

Go 1.24 manba kodida `DefaultTransport`: `Proxy: ProxyFromEnvironment`, dialer 30 s timeout va 30 s keep-alive, `ForceAttemptHTTP2: true`, `MaxIdleConns: 100`, `IdleConnTimeout: 90 s`, `TLSHandshakeTimeout: 10 s`, `ExpectContinueTimeout: 1 s`. `MaxIdleConnsPerHost` nol bo'lsa `DefaultMaxIdleConnsPerHost` = 2 ishlatiladi.

Bo'sh `&http.Transport{}` bu sozlamalarni olmaydi: proxy muhit o'zgaruvchilari e'tiborga olinmaydi va timeout'lar nol. To'g'ri yo'l: `http.DefaultTransport.(*http.Transport).Clone()` qilib, kerakli maydonlarni o'zgartirish.

Yana bir nozik joy: hujjat `ForceAttemptHTTP2` haqida shuni aytadi: Dial, DialTLS, DialContext yoki TLSClientConfig o'rnatilsa, HTTP/2 konservativ tarzda o'chiriladi; uni yoqish uchun `ForceAttemptHTTP2: true` qo'yiladi.

### Javob tanasi qoidasi

Hujjat: tanani yopish chaqiruvchining vazifasi, va HTTP/1.x keep-alive ulanish tana to'liq o'qilib yopilmasa qayta ishlatilmasligi mumkin. Shuning uchun andoza uch qismdan iborat: `defer resp.Body.Close()`, kerak bo'lmasa ham qolganini o'qib tashlash (`io.Copy(io.Discard, io.LimitReader(resp.Body, limit))`), va status kodini tekshirish.

Go 1.27 release notes bu qismni o'zgartirdi: HTTP/1 `Response.Body` yopilganda o'qilmagan ma'lumotni konservativ limitgacha o'zi o'qib tashlaydi, shunda ulanish yaxshiroq qayta ishlatiladi. Bu o'zgarish sandbox'da (Go 1.24) tekshirilmadi, shuning uchun yuqoridagi o'lchov faqat Go 1.24 ga tegishli. Kodni bir necha Go versiyasida ishlatsangiz, aniq o'qib tashlashni qoldiring.

### Qayta yuborish: Transport nima qiladi, siz nima qilasiz

Transport hujjatiga ko'ra tarmoq xatosida so'rovni o'zi faqat uchta shartda qayta yuboradi: ulanish allaqachon muvaffaqiyatli ishlatilgan bo'lsa, so'rov idempotent bo'lsa va tanasi bo'lmasa yoki `GetBody` aniqlangan bo'lsa. GET, HEAD, OPTIONS, TRACE yoki `Idempotency-Key` (`X-Idempotency-Key`) sarlavhasi bor so'rovlar idempotent hisoblanadi. Qolganini ilova darajasida siz hal qilasiz.

Ilova retry qoidalari:

- Faqat idempotent operatsiyalarni yoki idempotency kalitli so'rovlarni qayta yuboring (80-darsda bu g'oya chuqur ko'riladi).
- Tanani qayta yuborish uchun `GetBody` kerak. `http.NewRequest` `bytes.Reader`, `strings.Reader` va `bytes.Buffer` bilan uni o'zi o'rnatadi; boshqa oqim uchun o'zingiz yozasiz.
- Kutish vaqtini eksponentsial oshiring va tasodifiy tarqating (jitter), aks holda ko'p klient bir vaqtda qayta urinib, tiklanayotgan serverni yana yiqitadi.
- Urinishlar soni va umumiy vaqt cheklanadi; context bekor qilinsa, kutish ham to'xtaydi.
- 4xx (400, 404, 422) qayta yuborilmaydi: natija o'zgarmaydi. 5xx va tarmoq xatolari, `429` va `Retry-After` hisobga olinadi.

## Chuqurroq: pool va HTTP/2

### Per-host pool

HTTP/1.x da Transport har host (va proxy/sxema) uchun idle ulanishlar ro'yxatini saqlaydi. So'rov kelganda idle ulanish olinadi, yo'q bo'lsa yangisi ochiladi. `MaxIdleConns` umumiy idle ulanishlar chegarasi, `MaxIdleConnsPerHost` bitta host uchun. Bitta ichki servisga bir vaqtda ko'p so'rov yuboradigan klientda default 2 juda kichik: burst tugagach ortiqcha ulanishlar yopiladi, keyingi burst yana handshake qiladi. `MaxConnsPerHost` esa dial, faol va idle ulanishlarning umumiy sonini cheklaydi; chegara oshganda dial'lar bloklanadi. Nol qiymat cheklovsizlikni bildiradi. Bu chegara orqa tomonni himoya qiladi, lekin so'rovlarni navbatga qo'yadi, shuning uchun context muddati bilan birga ishlating.

### HTTP/2

HTTP/2 da bitta ulanish ichida ko'p stream multiplekslanadi, shuning uchun pool kamroq ulanish bilan ishlaydi. Server bir ulanishda ruxsat etadigan parallel stream soni cheklangan; Go 1.26 release notes `HTTP2Config.StrictMaxConcurrentRequests` maydonini qo'shdi: u stream chegarasi oshganda yangi ulanish ochilishini boshqaradi. Go 1.24 dan `Transport.Protocols` va `Transport.HTTP2` maydonlari protokol tanlash va HTTP/2 sozlamalari uchun bor. Go 1.26 yana `Transport.NewClientConn` ni qo'shdi: ulanishni o'zingiz boshqarishingiz kerak bo'lgan kam uchraydigan holatlar uchun; ko'pchilik uchun `RoundTrip` va pool yetarli. Bu ikki Go 1.26 xususiyati sandbox'da kompilyatsiya qilinmadi.

### Kuzatish

`net/http/httptrace` paketi so'rov hayotidagi hodisalarni (DNS, ulanish olish, `GotConnInfo.Reused`, birinchi bayt) bildiradi. "Nega kechikish oshdi" savoliga javob topishning eng to'g'ri usuli: ulanish qayta ishlatilyaptimi yoki yangidan ochilyaptimi.

## Misol: ulanish qayta ishlatilishini o'lchash

```go
package main

import (
	"fmt"
	"io"
	"net"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync/atomic"
)

func main() {
	var conns atomic.Int32
	srv := httptest.NewUnstartedServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 1 MB javob: Transport uni o'zi "bepul" yuta olmaydi.
		w.Write([]byte(strings.Repeat("x", 1<<20)))
	}))
	srv.Config.ConnState = func(_ net.Conn, s http.ConnState) {
		if s == http.StateNew {
			conns.Add(1)
		}
	}
	srv.Start()
	defer srv.Close()

	run := func(name string, consume func(*http.Response)) {
		conns.Store(0)
		client := &http.Client{Transport: &http.Transport{}}
		for i := 0; i < 5; i++ {
			resp, err := client.Get(srv.URL)
			if err != nil {
				fmt.Println(err)
				return
			}
			consume(resp)
		}
		client.CloseIdleConnections()
		fmt.Printf("%-34s 5 so'rov -> %d ta TCP ulanish\n", name, conns.Load())
	}

	run("Body.Close, o'qimasdan:", func(r *http.Response) { r.Body.Close() })
	run("io.Copy(io.Discard) + Close:", func(r *http.Response) {
		io.Copy(io.Discard, r.Body)
		r.Body.Close()
	})
	run("to'liq o'qish (io.ReadAll) + Close:", func(r *http.Response) {
		io.ReadAll(r.Body)
		r.Body.Close()
	})
}
```

Go 1.24.7, linux/amd64 da chiqish:

```text
Body.Close, o'qimasdan:            5 so'rov -> 5 ta TCP ulanish
io.Copy(io.Discard) + Close:       5 so'rov -> 1 ta TCP ulanish
to'liq o'qish (io.ReadAll) + Close: 5 so'rov -> 1 ta TCP ulanish
```

Server har so'rovda 1 MB javob beradi. Faqat `Close` qilinganda tananing katta qismi o'qilmay qoladi va ulanish yo'qoladi; tana o'qib tashlanganda 5 so'rov bitta ulanishni ishlatadi. `server.Config.ConnState` yordamida `StateNew` hodisalari sanaladi.

Endi retry va timeout. `doWithRetry` har urinishda so'rovni yangidan quradi, 5xx da tanani o'qib tashlab yopadi (ulanish qayta ishlatilishi uchun), kutishni jitter bilan oshiradi va context bekor qilinsa to'xtaydi:

```go
package main

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"math/rand/v2"
	"net/http"
	"net/http/httptest"
	"sync/atomic"
	"time"
)

// doWithRetry faqat idempotent so'rovlarni qayta yuboradi.
func doWithRetry(ctx context.Context, c *http.Client, build func() (*http.Request, error), attempts int) (*http.Response, error) {
	var lastErr error
	delay := 20 * time.Millisecond
	for i := 1; i <= attempts; i++ {
		req, err := build()
		if err != nil {
			return nil, err
		}
		resp, err := c.Do(req.WithContext(ctx))
		switch {
		case err == nil && resp.StatusCode < 500:
			return resp, nil
		case err == nil:
			lastErr = fmt.Errorf("status %d", resp.StatusCode)
			io.Copy(io.Discard, resp.Body) // ulanish qayta ishlatilishi uchun
			resp.Body.Close()
		default:
			lastErr = err
		}
		if i == attempts {
			break
		}
		// full jitter: 0..delay
		sleep := time.Duration(rand.Int64N(int64(delay)))
		select {
		case <-time.After(sleep):
		case <-ctx.Done():
			return nil, ctx.Err()
		}
		delay *= 2
	}
	return nil, fmt.Errorf("%d urinishdan keyin: %w", attempts, lastErr)
}

func main() {
	var hits atomic.Int32
	flaky := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if hits.Add(1) < 3 {
			http.Error(w, "vaqtincha", http.StatusServiceUnavailable)
			return
		}
		io.Copy(io.Discard, r.Body)
		fmt.Fprint(w, "qabul qilindi")
	}))
	defer flaky.Close()

	client := &http.Client{Timeout: 2 * time.Second}
	payload := []byte(`{"vehicle":"truck-7","fuel":41.5}`)
	build := func() (*http.Request, error) {
		// bytes.Reader bo'lgani uchun NewRequest GetBody'ni o'zi o'rnatadi.
		return http.NewRequest(http.MethodPut, flaky.URL+"/sensors/7", bytes.NewReader(payload))
	}
	resp, err := doWithRetry(context.Background(), client, build, 5)
	if err != nil {
		fmt.Println("xato:", err)
		return
	}
	b, _ := io.ReadAll(resp.Body)
	resp.Body.Close()
	fmt.Printf("natija: %d %s, urinishlar: %d\n", resp.StatusCode, b, hits.Load())

	// Client.Timeout tananing o'qilishini ham qamrab oladi.
	slowBody := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.(http.Flusher).Flush()
		time.Sleep(500 * time.Millisecond)
		fmt.Fprint(w, "kech")
	}))
	defer slowBody.Close()
	c2 := &http.Client{Timeout: 150 * time.Millisecond}
	resp, err = c2.Get(slowBody.URL)
	fmt.Println("sarlavha keldi, xato:", err)
	_, err = io.ReadAll(resp.Body)
	resp.Body.Close()
	fmt.Println("tanani o'qish:", err)
	fmt.Println("deadline:", errors.Is(err, context.DeadlineExceeded))
}
```

```text
natija: 200 qabul qilindi, urinishlar: 3
sarlavha keldi, xato: <nil>
tanani o'qish: context deadline exceeded (Client.Timeout or context cancellation while reading body)
deadline: true
```

Server dastlabki ikki so'rovga 503 berdi, uchinchisiga 200. Ikkinchi qism `Client.Timeout` tananing o'qilishini ham qamrashini ko'rsatadi: `Get` xatosiz qaytdi, `ReadAll` esa `context deadline exceeded` bilan tugadi. `errors.Is(err, context.DeadlineExceeded)` true bo'ldi.

Qarorlar: `rand.Int64N(int64(delay))` "full jitter" beradi (0 dan delay gacha), `build` funksiyasi har urinishda yangi so'rov qaytaradi, shunda tana bo'sh qolmaydi; so'rovning o'zi `PUT` bo'lgani uchun qayta yuborish xavfsiz.

## Qachon qo'llamaslik kerak

- Retry'ni quyi darajada bir necha qatlamda (SDK, HTTP client, orkestrator) takrorlamang: 3 qatlamda 3 martadan urinish 27 ta so'rovga aylanadi va tiklanayotgan servisni yiqitadi. Bitta qatlamni tanlang, qolganlarida o'chiring.
- Retry byudjetsiz: servis butunlay yiqilgan paytda barcha klientlar urinishni davom ettirsa, retry bo'ron hosil qiladi. Urinishlar soni va umumiy vaqtni cheklang, kerak bo'lsa circuit breaker qo'shing.
- `Client.Timeout`ni katta fayl yoki stream yuklashda umumiy deb qo'ymang: u butun tanani qamraydi. Bunday holda context va Transport bosqich timeout'lari kerak.
- `MaxConnsPerHost`ni asossiz past qo'ymang: u so'rovlarni navbatga qo'yadi va kechikishni oshiradi. Uni faqat orqa tomonni himoyalash zarur bo'lganda ishlating.
- `InsecureSkipVerify` bilan "vaqtincha" ishlashni qoldirmang: 75-darsda sertifikat tekshirishni to'g'ri sozlashni ko'ramiz.
- Javob tanasini cheklovsiz `io.ReadAll` bilan o'qimang: tashqi server minglab MB yuborishi mumkin. `io.LimitReader` yoki `http.MaxBytesReader` (server tomonda) ishlating.

## Stack'da: Node.js/TypeScript bilan solishtirish

`fetch` va axios'da `timeout` va `AbortController` odat. Go'da bu `context.WithTimeout` va `NewRequestWithContext`. Go'da tana bilan bog'liq qoida hujjatda yozilgan va uni yuqoridagidek o'lchash mumkin.

Servis uchun andoza:

- Bitta umumiy `*http.Client` (har tashqi bog'liqlik uchun alohida Transport sozlamalari bilan) yarating va uni konstruktor orqali uzating.
- `DefaultTransport.Clone()` dan boshlang; `MaxIdleConnsPerHost`ni kutilgan parallellikka moslang.
- Har chaqiruv `ctx` bilan, javobni `defer Close` + `LimitReader` bilan o'qib tashlang.
- Retry'ni bitta joyda, idempotentlik bilan va jitter'li backoff bilan yozing; to'lov kabi operatsiyalarga `Idempotency-Key` yuboring.
- Kechikish tahlili uchun `httptrace` yoki metrikada "yangi ulanish / qayta ishlatilgan ulanish" nisbatini kuzating.

## Xulosa

- Client siyosat, Transport mexanizm; ikkalasi bir marta yaratiladi va qayta ishlatiladi. `http.DefaultClient` timeout'siz.
- `Client.Timeout` ulanish, redirect va javob tanasini qamraydi; chaqiruv darajasida context muddati qulayroq va bekor qilinadigan.
- Tanani doim yoping va (Go 1.24 da) qolganini cheklangan holda o'qib tashlang: o'lchovda 5 so'rov 5 ulanish o'rniga 1 ulanish ishlatdi.
- Bo'sh `&http.Transport{}` DefaultTransport himoyalarini yo'qotadi; `Clone()` qiling. Bitta hostga ko'p parallel so'rov uchun `MaxIdleConnsPerHost` ni oshiring.
- Faqat idempotent (yoki idempotency kalitli) so'rovlarni, jitter'li backoff va chegaralangan urinishlar bilan qayta yuboring.
