---
n: 74
slug: handler-middleware
title: "Handler, middleware va request hayot sikli"
summary: "http.Handler kontrakti, middleware zanjiri tartibi, ResponseWriter'ni o'rashdagi tuzoqlar (status, Flusher, Unwrap), recover, request ID va context qiymatlari, tana hajmini cheklash va Go 1.25 CrossOriginProtection."
duration: 40
sources:
  - id: pkg-net-http
    note: "Handler kontrakti va panic xatti-harakati; ResponseController; ErrAbortHandler; MaxBytesReader; TimeoutHandler; CrossOriginProtection (Go 1.25)"
  - id: pkg-context
    note: "Context qiymatlari faqat request doirasidagi ma'lumot uchun, ixtiyoriy parametrlar uchun emas"
  - id: code-review-comments
    note: "Contexts bo'limi: context funksiyaning birinchi parametri, struct ichida saqlanmaydi"
quiz:
  - q: "`h := Chain(mux, A, B, C)` (birinchi argument eng tashqi). Kiruvchi so'rov qaysi tartibda o'tadi?"
    options:
      - "mux -> C -> B -> A"
      - "C -> B -> A -> mux"
      - "A -> B -> C -> mux; javob esa teskari tartibda qaytadi"
      - "Tartib aniqlanmagan, chunki middleware'lar parallel ishlaydi"
    answer: 2
    explain: "Chain ro'yxatni oxiridan boshlab o'raydi, natijada A eng tashqi qatlam bo'ladi: so'rov A dan kiradi, mux'ga yetadi, javob esa mux -> C -> B -> A tartibida qaytadi. Shu sababli recover va logging odatda eng tashqarida turadi."
  - q: "Logging middleware `http.ResponseWriter`ni o'z struct'iga o'radi, lekin `Unwrap()` metodi yo'q. Handler `http.NewResponseController(w).Flush()` chaqirdi. Lokal sinovda nima chiqdi?"
    options:
      - "Flush `http.ErrNotSupported` ('feature not supported') qaytardi"
      - "Flush muvaffaqiyatli bajarildi, chunki struct embedded interface orqali Flush'ni oladi"
      - "Panic"
      - "Flush jimgina hech narsa qilmadi va nil qaytardi"
    answer: 0
    explain: "ResponseWriter interface'ida Flush metodi yo'q, u faqat konkret tipdagi ixtiyoriy interface. Struct o'ralganda bu interface yashirinadi. ResponseController Unwrap() metodini topsa, asl writer'ga o'tadi; yo'q bo'lsa ErrNotSupported qaytadi. Yechim: wrapper'ga Unwrap qo'shish."
  - q: "Status kodni yozib boruvchi wrapper faqat `WriteHeader`ni override qiladi. Handler `fmt.Fprint(w, \"ok\")` yozdi, WriteHeader chaqirmadi. Wrapper qaysi statusni ko'radi va nega?"
    options:
      - "200: wrapper uni avtomatik bilib oladi"
      - "500: yozish xatosi sifatida"
      - "Wrapper statusni umuman o'qiy olmaydi, bu texnik jihatdan mumkin emas"
      - "0 (hech narsa): birinchi Write implicit 200 yuboradi, lekin wrapper WriteHeader'ni ko'rmaydi; Write ichida ham status belgilash kerak"
    answer: 3
    explain: "Lokal sinovda status 0 chiqdi. Birinchi Write sarlavhani 200 bilan yuboradi, ya'ni WriteHeader'ni wrapper ustidan chaqirmaydi. Shuning uchun Write'da status hali belgilanmagan bo'lsa, uni 200 deb yozib qo'yish kerak."
  - q: "Handler ichida nil map'ga yozilib panic bo'ldi, recover middleware yo'q. net/http serveri nima qiladi?"
    options:
      - "Butun jarayon to'xtaydi"
      - "Panic'ni so'rov bilan cheklangan deb hisoblab qaytaradi, stack trace'ni server xato logiga yozadi va ulanishni yopadi (yoki HTTP/2 da RST_STREAM yuboradi); klient 500 olmaydi"
      - "Server 500 va JSON xato matni yuboradi"
      - "Panic keyingi so'rovga o'tadi"
    answer: 1
    explain: "Handler hujjati: server panic'ni faqat shu so'rovga tegishli deb oladi, recover qiladi, log yozadi va ulanishni yopadi. Klient yarim javob yoki uzilgan ulanish ko'radi. Shuning uchun ko'pchilik servislar recover middleware qo'yadi: 500 va strukturalangan xato qaytarish, metrika va request ID bilan log uchun. http.ErrAbortHandler esa kutilgan abort uchun, log yozilmaydi."
  - q: "Quyidagilardan qaysi qiymat `context.WithValue` orqali uzatish uchun mos?"
    options:
      - "Ma'lumotlar bazasi pool'i, chunki har handler'ga kerak"
      - "Funksiyaning ixtiyoriy parametri (masalan sahifa o'lchami)"
      - "Request ID va autentifikatsiya qilingan foydalanuvchi identifikatori"
      - "Logger sozlamalari va konfiguratsiya"
    answer: 2
    explain: "context hujjati qiymatlarni faqat protsess va API chegaralaridan o'tadigan request doirasidagi ma'lumot uchun belgilaydi, ixtiyoriy parametrlar uchun emas. Bog'liqliklar (DB, logger, config) struct maydoni sifatida konstruktorda beriladi: bu tiplangan va testlanadigan."
  - q: "Handler javobni yozib bo'ldi va qaytdi, lekin ichida ishga tushirilgan goroutine keyinroq `w.Write(...)` chaqirmoqda. Bu nima?"
    options:
      - "Noto'g'ri: ServeHTTP qaytgach ResponseWriter va Request.Body'dan foydalanish yaroqsiz; bunday ish alohida mexanizm (navbat/worker) va o'z context'i bilan qilinadi"
      - "To'g'ri, goroutine yozishni davom ettira oladi"
      - "To'g'ri, agar goroutine WaitGroup bilan kutilsa"
      - "Faqat HTTP/2 da ruxsat etiladi"
    answer: 0
    explain: "Handler hujjati: ServeHTTP qaytgach ResponseWriter'dan foydalanish yoki Request.Body'dan o'qish yaroqsiz. Shuningdek r.Context() ham handler qaytganda bekor bo'ladi. Fon ishi uchun natijani saqlab, mijozga keyin boshqa yo'l bilan (polling, webhook) xabar beriladi."
task:
  title: "Status va Flush'ni to'g'ri kuzatadigan recorder"
  prompt: |
    Logging middleware uchun `recorder` yozilgan: u `http.ResponseWriter`ni o'raydi va status kod hamda yozilgan baytlarni eslab qoladi.

    Muammolar: handler `WriteHeader` chaqirmasdan faqat `Write` qilsa, `status` 0 qoladi (aslida 200 yuborilgan), va `http.NewResponseController(w).Flush()` `ErrNotSupported` qaytaradi.

    `recorder`ni tuzating:
    - implicit 200 hisobga olinsin;
    - `WriteHeader` bir necha marta chaqirilsa, birinchi status saqlansin;
    - `ResponseController` o'rash orqali asl writer'ga yetib borsin (Flush muvaffaqiyatli bo'lsin).

    Kutilgan natija: `status: 200 bayt: 19` va `flush: <nil>`.
  lang: go
  starter: |
    package main

    import (
        "errors"
        "fmt"
        "net/http"
        "net/http/httptest"
    )

    // recorder status kodni va yozilgan baytlarni eslab qoladi.
    type recorder struct {
        http.ResponseWriter
        status int
        bytes  int
    }

    func (r *recorder) WriteHeader(code int) {
        r.status = code
        r.ResponseWriter.WriteHeader(code)
    }

    func (r *recorder) Write(p []byte) (int, error) {
        n, err := r.ResponseWriter.Write(p)
        r.bytes += n
        return n, err
    }

    func main() {
        var flushErr error
        h := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            fmt.Fprint(w, "nuqta qabul qilindi") // WriteHeader chaqirilmagan: status 200
            flushErr = http.NewResponseController(w).Flush()
        })

        rec := &recorder{ResponseWriter: httptest.NewRecorder()}
        h.ServeHTTP(rec, httptest.NewRequest("POST", "/points", nil))

        fmt.Println("status:", rec.status, "bayt:", rec.bytes)
        fmt.Println("flush:", flushErr, "| ErrNotSupported:", errors.Is(flushErr, http.ErrNotSupported))
    }
  solution: |
    package main

    import (
        "errors"
        "fmt"
        "net/http"
        "net/http/httptest"
    )

    // recorder status kodni va yozilgan baytlarni eslab qoladi.
    type recorder struct {
        http.ResponseWriter
        status int
        bytes  int
    }

    func (r *recorder) WriteHeader(code int) {
        if r.status == 0 {
            r.status = code
        }
        r.ResponseWriter.WriteHeader(code)
    }

    func (r *recorder) Write(p []byte) (int, error) {
        if r.status == 0 {
            r.status = http.StatusOK // birinchi Write implicit 200 yuboradi
        }
        n, err := r.ResponseWriter.Write(p)
        r.bytes += n
        return n, err
    }

    // Unwrap ResponseController'ga asl ResponseWriter'ni ko'rsatadi.
    func (r *recorder) Unwrap() http.ResponseWriter { return r.ResponseWriter }

    func main() {
        var flushErr error
        h := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            fmt.Fprint(w, "nuqta qabul qilindi") // WriteHeader chaqirilmagan: status 200
            flushErr = http.NewResponseController(w).Flush()
        })

        rec := &recorder{ResponseWriter: httptest.NewRecorder()}
        h.ServeHTTP(rec, httptest.NewRequest("POST", "/points", nil))

        fmt.Println("status:", rec.status, "bayt:", rec.bytes)
        fmt.Println("flush:", flushErr, "| ErrNotSupported:", errors.Is(flushErr, http.ErrNotSupported))
    }
  solutionNotes: |
    - `Write` ichida `status == 0` bo'lsa 200 belgilanadi: birinchi `Write` sarlavhani implicit 200 bilan yuboradi va `WriteHeader` bizning metodimiz orqali o'tmaydi.
    - `WriteHeader` da `if r.status == 0` sharti birinchi statusni saqlaydi. Standart kutubxona ikkinchi `WriteHeader` chaqiruvini baribir e'tiborsiz qoldiradi (log yozadi), shuning uchun recorder ham asl yuborilgan statusni ko'rsatishi kerak.
    - `Unwrap() http.ResponseWriter` ResponseController uchun kalit: u wrapper'ni zanjir bo'ylab ochib, `Flush`, `SetWriteDeadline` va boshqa metodlarni qo'llab-quvvatlaydigan writer'ni topadi. Bu usul `Flusher`, `Hijacker` kombinatsiyalari uchun alohida wrapper tiplari yozishdan qutqaradi.
    - Lokal tekshiruv: starter `status: 0` va `ErrNotSupported` berdi, yechim `status: 200 bayt: 19` va `flush: <nil>`.
  checklist:
    - "Faqat `Write` chaqirilganda `status` 200 bo'ladi"
    - "Birinchi `WriteHeader` statusi ikkinchisi bilan almashtirilmaydi"
    - "`Unwrap() http.ResponseWriter` metodi qo'shilgan"
    - "`NewResponseController(w).Flush()` xatosiz bajariladi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Har bir HTTP endpoint'ga bir xil ishlar kerak: so'rovni log qilish, panic'dan himoya, request ID, autentifikatsiya, tana hajmi cheklovi, metrika. Ularni har handler ichida takrorlash ham xato (bittasi unutiladi), ham test qilishni qiyinlashtiradi. Middleware shu muammoni hal qiladi. Lekin Go'da middleware yozishning o'ziga xos tuzoqlari bor, ular `ResponseWriter` interface'ining tuzilishidan kelib chiqadi.

Uchta tipik xato. Birinchisi: wrapper status kodni noto'g'ri yozadi (handler `WriteHeader` chaqirmasa, 0 yoki xato qiymat), logda "status 0" ko'rinadi va metrika buziladi. Ikkinchisi: wrapper `http.Flusher` va `http.Hijacker`ni yashiradi, natijada streaming endpoint (SSE) jimgina bufer to'lguncha javob bermaydi. Uchinchisi: panic. Handler ichida panic bo'lsa, `net/http` serveri jarayonni o'ldirmaydi, lekin klient 500 o'rniga uzilgan ulanish oladi va siz buni log orqali kechikib bilasiz.

Node.js'da Express middleware `(req, res, next)` shaklida; zanjir `next()` bilan davom etadi. Go'da zanjir kompozitsiya bilan quriladi: middleware handler qabul qilib, handler qaytaradi. Bu g'oya soddaroq, lekin "res" obyektini o'rash tipiga bog'liq cheklovlar bor.

## Asosiy g'oya

### Handler kontrakti

Hujjatdagi qoidalar (`http.Handler`):

- `ServeHTTP` javob sarlavhalari va tanasini yozadi va qaytadi. Qaytish so'rov tugaganini bildiradi.
- `ServeHTTP` qaytgandan keyin `ResponseWriter`dan foydalanish yoki `Request.Body`dan o'qish yaroqsiz, va bu qaytish bilan parallel ham taqiqlangan.
- Mijoz dasturi va protokolga qarab, javob yozilgandan keyin so'rov tanasini o'qib bo'lmasligi mumkin. Ehtiyotkor handler avval tanani o'qiydi, keyin javob beradi.
- Tanani o'qishdan tashqari, handler berilgan `Request`ni o'zgartirmasligi kerak. O'zgartirilgan nusxa kerak bo'lsa, `r.WithContext` yoki `r.Clone` ishlatiladi.
- `ServeHTTP` panic qilsa, server panic'ni shu so'rov bilan cheklangan deb biladi, uni recover qiladi, stack trace'ni server xato logiga yozadi va HTTP/1 da ulanishni yopadi (HTTP/2 da stream'ga RST_STREAM yuboradi).

Va `ResponseWriter` tartibi: sarlavhalar `WriteHeader` yoki birinchi `Write`dan oldin o'rnatiladi; birinchi `Write` status chaqirilmagan bo'lsa 200 yuboradi; `WriteHeader` faqat bir marta ta'sir qiladi.

### Middleware: Handler -> Handler

```go
type Middleware func(http.Handler) http.Handler
```

Middleware ichki handler'ni oladi va yangi handler qaytaradi: u oldin biror ish qiladi, `next.ServeHTTP(w, r)` ni chaqiradi, keyin yana ish qiladi. Zanjirni o'rash tartibi muhim: eng tashqi middleware so'rovni birinchi ko'radi va javobni oxirgi. Odatiy tartib: tashqarida recover va request ID, keyin logging va metrika, undan keyin autentifikatsiya va limitlar, eng ichkarida marshrut/handler.

### ResponseWriter'ni o'rash

Status, yozilgan bayt soni va davomiylikni log qilish uchun `ResponseWriter`ni struct'ga o'rash kerak. Uch qoida:

1. `WriteHeader` va `Write`ni override qiling; `Write` ichida status hali belgilanmagan bo'lsa 200 qo'ying (birinchi `Write` implicit 200 yuboradi va `WriteHeader`ni sizning metodingiz orqali chaqirmaydi).
2. `Unwrap() http.ResponseWriter` metodini qo'shing. Go 1.20 dan `http.ResponseController` mavjud: u `Flush`, `Hijack`, `SetReadDeadline`, `SetWriteDeadline` va boshqa imkoniyatlarni wrapper zanjirini `Unwrap` orqali ochib topadi. Unwrap bo'lmasa, `ErrNotSupported` qaytadi.
3. Eski usul (har kombinatsiya uchun alohida wrapper tipi: Flusher+Hijacker) yozishdan qoching.

### Context qiymatlari

`context.WithValue` request doirasidagi ma'lumot uchun: request ID, autentifikatsiya qilingan foydalanuvchi, trace span. Hujjat uni ixtiyoriy parametrlar uchun ishlatmaslikni aytadi. Kalit sifatida eksport qilinmagan maxsus tip (`type ctxKey struct{}`) ishlating, shunda boshqa paketlar kalit bilan to'qnashmaydi. DB pool, logger, konfiguratsiya kabi bog'liqliklar context'da emas, handler struct'ining maydonlarida turadi: ular tipli, testda almashtiriladi va "yashirin kirish" bo'lmaydi.

## Chuqurroq: panic, hajm cheklovi va xavfsizlik middleware'lari

### Recover middleware

Server panic'ni o'zi ushlagani uchun recover middleware kerakmi? Ha, uchta sababga ko'ra: (1) klientga aniq 500 va strukturalangan xato tanasi qaytarish, (2) panic'ni metrika va request ID bilan log qilish, (3) ulanishni uzmaslik. Cheklov: javob allaqachon yozilgan bo'lsa (sarlavha yuborilgan), statusni o'zgartirib bo'lmaydi. `http.ErrAbortHandler` maxsus qiymat: u bilan panic qilish klientga uzilgan javobni ko'rsatadi, lekin server stack trace'ni log qilmaydi. Recover middleware shu qiymatni qayta panic qilishi kerak (misol shunday qiladi).

### Tana hajmini cheklash

`http.MaxBytesReader(w, r.Body, n)` hajmi n dan oshgan tana o'qilganda xato qaytaradi (`*http.MaxBytesError`) va hujjatga ko'ra imkon bo'lsa ulanishni yopishni so'raydi. Uni middleware'da qo'yish mumkin, lekin maksimum odatda endpoint bo'yicha farq qiladi (login 1 KB, fayl yuklash 50 MB), shuning uchun handler darajasida yoki endpoint-ga xos middleware sifatida qo'yish aniqroq (76-dars).

### TimeoutHandler

`http.TimeoutHandler(h, d, msg)` handler muddatini cheklaydi, tugaganda 503 qaytaradi. Lekin hujjatga ko'ra u `Hijacker` va `Flusher`ni qo'llab-quvvatlamaydi, va handler goroutine'ini o'zi to'xtata olmaydi: handler `r.Context()` ni kuzatishi shart. Streaming endpoint'lar uchun mos emas.

### CSRF: CrossOriginProtection (Go 1.25)

Go 1.25 release notes `http.CrossOriginProtection` ni kiritdi. U brauzerlardan keladigan xavfsiz bo'lmagan (GET, HEAD, OPTIONS dan boshqa) cross-origin so'rovlarni rad etadi. Cross-origin `Sec-Fetch-Site` sarlavhasi yoki `Origin` bilan `Host` hostnomlarini solishtirish orqali aniqlanadi; bu sarlavhalar yo'q so'rovlar (brauzer bo'lmagan klientlar) o'tkaziladi. Token yoki cookie talab qilinmaydi. API: `http.NewCrossOriginProtection()`, `.Handler(h)`, `.AddTrustedOrigin(origin)`, `.AddInsecureBypassPattern(pattern)`, `.SetDenyHandler(h)`. Bu API sandbox'da (Go 1.24) kompilyatsiya qilinmadi, imzolar hujjatdan olindi:

```go
cop := http.NewCrossOriginProtection()
if err := cop.AddTrustedOrigin("https://dashboard.example.com"); err != nil {
	log.Fatal(err)
}
handler := cop.Handler(mux) // Go 1.25+: kompilyatsiya qilinmagan
```

Muhim ogohlantirish (hujjatdan): xavfsiz metodlar (GET) holatni o'zgartirmasligi shart, aks holda bu himoya ularni qamramaydi.

### Tana, kechikkan panic va per-handler muddat: uch tajriba

Middleware'ning uchta nozik xatosini bitta dasturda sinadik (Go 1.24.7, `httptest` serveri).

1. **Tanani o'qiydigan middleware.** `r.Body` oqim: bir marta o'qilgach tugaydi. Logging yoki imzo tekshiruvi uchun tanani `io.ReadAll` bilan o'qigan middleware ichki handler uchun bo'sh tana qoldiradi. Yechim: o'qib bo'lgach `r.Body` ni `io.NopCloser(bytes.NewReader(b))` bilan almashtirish. Hujjat "tanani o'qishdan tashqari handler `Request`ni o'zgartirmasligi kerak" deydi; `Body`ni almashtirish middleware uchun odatiy istisno, lekin hajm cheklovi bilan birga bo'lishi shart (`MaxBytesReader`): cheklovsiz `ReadAll` hamma tanani xotiraga yuklaydi.
2. **Sarlavha yuborilgandan keyingi panic.** Handler javobning bir qismini yozgach panic qilsa, status allaqachon 200 sifatida ketgan. Recover middleware `http.Error` ni chaqirsa, status o'zgarmaydi: server `http: superfluous response.WriteHeader call` deb log qiladi, xato matni esa oldin yozilgan tananing davomiga qo'shiladi. Mijoz 200 va buzilgan javob oladi. Bu darsdagi "javob allaqachon yozilgan bo'lsa statusni o'zgartirib bo'lmaydi" cheklovining real ko'rinishi.
3. **Per-request yozish muddati.** `Server.WriteTimeout` hujjatga ko'ra hamma so'rovga bir xil qo'llanadi va handler'ga so'rov bo'yicha qaror qilishga ruxsat bermaydi. `http.NewResponseController(w).SetWriteDeadline(t)` esa muddatni shu handler uchun uzaytiradi (hujjat: nol qiymat muddat yo'qligini bildiradi, o'tib ketgan muddatni keyin uzaytirib bo'lmaydi, shuning uchun muddat uzoq ishdan oldin qo'yiladi).

```go
package main

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"time"
)

// logBodyBroken tanani o'qiydi va handler'ga bo'sh tana qoldiradi.
func logBodyBroken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		b, _ := io.ReadAll(r.Body)
		fmt.Printf("middleware o'qidi: %d bayt\n", len(b))
		next.ServeHTTP(w, r)
	})
}

// logBodyFixed tanani o'qib, o'rniga yangi Body qo'yadi.
func logBodyFixed(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		b, _ := io.ReadAll(http.MaxBytesReader(w, r.Body, 1<<20))
		fmt.Printf("middleware o'qidi: %d bayt\n", len(b))
		r.Body = io.NopCloser(bytes.NewReader(b))
		next.ServeHTTP(w, r)
	})
}

func readHandler(w http.ResponseWriter, r *http.Request) {
	b, _ := io.ReadAll(r.Body)
	fmt.Fprintf(w, "handler ko'rdi: %d bayt", len(b))
}

func post(url, body string) string {
	resp, err := http.Post(url, "text/plain", strings.NewReader(body))
	if err != nil {
		return "xato: " + err.Error()
	}
	defer resp.Body.Close()
	b, _ := io.ReadAll(resp.Body)
	return fmt.Sprintf("%d %q", resp.StatusCode, b)
}

func main() {
	srv := httptest.NewServer(logBodyBroken(http.HandlerFunc(readHandler)))
	fmt.Println("buzuq:", post(srv.URL, `{"fuel":41.5}`))
	srv.Close()
	srv = httptest.NewServer(logBodyFixed(http.HandlerFunc(readHandler)))
	fmt.Println("tuzatilgan:", post(srv.URL, `{"fuel":41.5}`))
	srv.Close()

	// Sarlavha yuborilgandan keyin panic va "recover" middleware.
	recoverMW := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if v := recover(); v != nil {
					http.Error(w, "ichki xato", http.StatusInternalServerError)
				}
			}()
			next.ServeHTTP(w, r)
		})
	}
	late := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "qisman javob")
		panic("keyingi bosqichda xato")
	})
	srv = httptest.NewUnstartedServer(recoverMW(late))
	srv.Config.ErrorLog = log.New(os.Stdout, "server log: ", 0)
	srv.Start()
	resp, err := http.Get(srv.URL)
	if err == nil {
		b, _ := io.ReadAll(resp.Body)
		resp.Body.Close()
		fmt.Printf("panic keyin: %d %q\n", resp.StatusCode, b)
	}
	srv.Close()

	// ResponseController: handler uchun alohida yozish muddati.
	slow := func(extend bool) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if extend {
				rc := http.NewResponseController(w)
				if err := rc.SetWriteDeadline(time.Now().Add(2 * time.Second)); err != nil {
					fmt.Println("SetWriteDeadline:", err)
				}
			}
			time.Sleep(300 * time.Millisecond)
			fmt.Fprint(w, "katta hisobot")
		})
	}
	for _, extend := range []bool{false, true} {
		s := httptest.NewUnstartedServer(slow(extend))
		s.Config.WriteTimeout = 100 * time.Millisecond
		s.Start()
		c := &http.Client{Timeout: 3 * time.Second}
		resp, err := c.Get(s.URL)
		if err != nil {
			fmt.Printf("SetWriteDeadline=%v: xato: %v\n", extend, err)
		} else {
			b, _ := io.ReadAll(resp.Body)
			resp.Body.Close()
			fmt.Printf("SetWriteDeadline=%v: %d %q\n", extend, resp.StatusCode, b)
		}
		s.Close()
	}
}
```

```text
middleware o'qidi: 13 bayt
buzuq: 200 "handler ko'rdi: 0 bayt"
middleware o'qidi: 13 bayt
tuzatilgan: 200 "handler ko'rdi: 13 bayt"
server log: http: superfluous response.WriteHeader call from main.main.main.func1.func6.1 (main.go:62)
panic keyin: 200 "qisman javobichki xato\n"
SetWriteDeadline=false: xato: Get "http://127.0.0.1:40869": EOF
SetWriteDeadline=true: 200 "katta hisobot"
```

Birinchi ikki qator: buzuq middleware 13 baytni o'qib tugatdi, handler 0 bayt ko'rdi; tuzatilganida ikkalasi 13 bayt. Beshinchi va oltinchi qator: javob `200` va tana `qisman javob` + `ichki xato\n` yopishgan, server logida `superfluous` ogohlantirishi. Oxirgi ikki qator: `WriteTimeout` 100 ms, handler 300 ms ishlaydi; muddat uzaytirilmasa mijoz `EOF` oldi (ulanish serverda uzildi, port har ishga tushirishda boshqacha), uzaytirilgach javob to'liq keldi. Amaliy qoida: tez endpoint'lar uchun qisqa global `WriteTimeout`, sekin hisobot yoki eksport endpoint'lari uchun faqat shu handler'da `SetWriteDeadline`. Recover middleware javob boshlanganini bilishi uchun `statusWriter` wrapper'ining `status != 0` holatidan foydalaning: javob boshlangan bo'lsa `http.Error` chaqirmang, faqat panic'ni log qiling va `http.ErrAbortHandler` bilan ulanishni uzing, shunda mijoz buzilgan javobni to'liq deb qabul qilmaydi (alohida sinovda javobning bir qismi yuborilib, `panic(http.ErrAbortHandler)` qilinganda mijozning `io.ReadAll` chaqiruvi `unexpected EOF` qaytardi).

### Handler va context

Server so'rovi context'i klient ulanishi uzilganda yoki handler qaytganda bekor bo'ladi (72-dars). Middleware ichida `r.WithContext(...)` yangi `*Request` nusxasini yaratadi: undan keyingi handler'lar yangi nusxani ko'radi. Eslatma: Go 1.23 dan `r.Pattern` ni `ServeMux` o'rnatadi, va u buni o'ziga uzatilgan aynan o'sha `*Request` obyektida qiladi. Agar logging middleware'i `WithContext` qilgan middleware'dan tashqarida tursa, u mux ko'rgan nusxani emas, eski nusxani ushlab turadi va `r.Pattern`ni ko'rmaydi. Misolda `Logging` `RequestID` dan keyin keladi, shuning uchun mux ko'radigan `*Request` bilan bir xil obyektni oladi.

## Misol: zanjir, status wrapper, recover

```go
package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"sync/atomic"
)

type Middleware func(http.Handler) http.Handler

// Chain middleware'larni tashqaridan ichkariga qarab o'raydi: birinchisi eng tashqi.
func Chain(h http.Handler, mws ...Middleware) http.Handler {
	for i := len(mws) - 1; i >= 0; i-- {
		h = mws[i](h)
	}
	return h
}

type ctxKey struct{}

var reqSeq atomic.Int64

func RequestID(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := fmt.Sprintf("req-%03d", reqSeq.Add(1))
		w.Header().Set("X-Request-ID", id)
		next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), ctxKey{}, id)))
	})
}

// statusWriter status kodni eslab qoladi. Unwrap ResponseController uchun kerak.
type statusWriter struct {
	http.ResponseWriter
	status int
	bytes  int
}

func (w *statusWriter) WriteHeader(code int) {
	if w.status == 0 {
		w.status = code
	}
	w.ResponseWriter.WriteHeader(code)
}

func (w *statusWriter) Write(p []byte) (int, error) {
	if w.status == 0 {
		w.status = http.StatusOK
	}
	n, err := w.ResponseWriter.Write(p)
	w.bytes += n
	return n, err
}

func (w *statusWriter) Unwrap() http.ResponseWriter { return w.ResponseWriter }

func Logging(l *log.Logger) Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			sw := &statusWriter{ResponseWriter: w}
			next.ServeHTTP(sw, r)
			id, _ := r.Context().Value(ctxKey{}).(string)
			// r.Pattern: ServeMux mos kelgan pattern (Go 1.23 dan)
			l.Printf("%s %s -> %d (%d bayt)", id, r.Pattern, sw.status, sw.bytes)
		})
	}
}

func Recover(l *log.Logger) Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if v := recover(); v != nil {
					if v == http.ErrAbortHandler {
						panic(v)
					}
					l.Printf("panic: %v", v)
					http.Error(w, "ichki xato", http.StatusInternalServerError)
				}
			}()
			next.ServeHTTP(w, r)
		})
	}
}

func main() {
	l := log.New(os.Stdout, "", 0)
	mux := http.NewServeMux()
	mux.HandleFunc("GET /vehicles/{id}", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "vehicle %s", r.PathValue("id"))
	})
	mux.HandleFunc("GET /boom", func(w http.ResponseWriter, r *http.Request) {
		var m map[string]int
		m["x"] = 1 // nil map'ga yozish: panic
	})
	mux.HandleFunc("GET /stream", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "birinchi qism")
		// Wrapper Flusher'ni yashirsa ham, ResponseController Unwrap orqali topadi.
		err := http.NewResponseController(w).Flush()
		l.Printf("flush xatosi: %v", err)
	})

	h := Chain(mux, RequestID, Logging(l), Recover(l))
	srv := httptest.NewServer(h)
	defer srv.Close()

	for _, p := range []string{"/vehicles/7", "/boom", "/stream", "/yo'q"} {
		resp, err := http.Get(srv.URL + p)
		if err != nil {
			fmt.Println(err)
			continue
		}
		b, _ := io.ReadAll(resp.Body)
		resp.Body.Close()
		fmt.Printf("   %s: %d %s %q\n", p, resp.StatusCode, resp.Header.Get("X-Request-ID"), strings.TrimSpace(string(b)))
	}
}
```

Chiqish (Go 1.24.7). Matn qatorlari `RequestID`, `Logging` va `Recover` zanjiridan, chekinishli qatorlar esa test klientidan:

```text
req-001 GET /vehicles/{id} -> 200 (9 bayt)
   /vehicles/7: 200 req-001 "vehicle 7"
panic: assignment to entry in nil map
req-002 GET /boom -> 500 (11 bayt)
   /boom: 500 req-002 "ichki xato"
flush xatosi: <nil>
req-003 GET /stream -> 200 (13 bayt)
   /stream: 200 req-003 "birinchi qism"
req-004  -> 404 (19 bayt)
   /yo'q: 404 req-004 "404 page not found"
```

Qarorlar:

- `Chain` ro'yxatni oxiridan o'raydi: `RequestID` eng tashqi, `Recover` eng ichki. Shuning uchun panic bo'lganda `Logging` baribir 500 va request ID ni ko'radi: `Recover` 500 yozadi va qaytadi, `Logging` esa uning ostidan chiqqan statusni o'qiydi.
- `statusWriter` `Write` ichida implicit 200 ni belgilaydi va `Unwrap` metodiga ega, shuning uchun `/stream` endpoint'ida `ResponseController.Flush()` xatosiz bajarildi (`flush xatosi: <nil>`).
- Logda `r.Context().Value(ctxKey{})` eksport qilinmagan kalit bilan o'qiladi.
- `/yo'q` yo'li uchun mux 404 qaytardi, `r.Pattern` bo'sh: logda pattern o'rniga bo'sh joy chiqadi. Real servisda bunday holatni "unmatched" deb belgilash tavsiya etiladi, shunda metrikada yo'l kardinalligi o'smaydi.

## Qachon qo'llamaslik kerak

- Middleware'ni hamma narsa uchun ishlatmang. Faqat har endpoint'ga bir xil tegishli ishlar uchun. Bitta endpoint'ga xos tekshiruv (masalan "bu foydalanuvchi shu buyurtmaning egasimi") handler yoki servis qatlamida turadi, middleware'da emas.
- `context.WithValue` ni konfiguratsiya, bog'liqlik yoki ixtiyoriy argument uchun ishlatmang: bu yashirin bog'lanish, tip xavfsizligi yo'q, testlash qiyin.
- Logging wrapper'da javob tanasini to'liq bufer qilmang (masalan xato matnini loglash uchun): katta javoblarda xotira yo'qotiladi. Faqat status va bayt sonini yozing.
- Har bir request uchun yangi goroutine ochadigan middleware (masalan "async log") yozmang: so'rov context'i handler qaytgach bekor bo'ladi va `w`/`r` yaroqsiz.
- `TimeoutHandler` ni SSE, WebSocket yoki katta fayl yuklash handler'lariga qo'ymang.
- Recover'ni xatolarni yashirish uchun ishlatmang: panic 500 qaytarilgan zahoti log, metrika va ogohlantirishga tushishi kerak.

## Stack'da: Node.js/TypeScript bilan solishtirish

Express'da `app.use(fn)` va `next()` bor, xatolar `next(err)` bilan uzatiladi. NestJS'da guard, interceptor va filter alohida tushunchalar. Go'da bularning hammasi bitta shaklga tushadi: `func(http.Handler) http.Handler`. Xatolarni uzatish uchun maxsus mexanizm yo'q; ko'pchilik jamoalar handler'larni `func(w, r) error` ko'rinishida yozib, bitta adapter orqali `http.Handler`ga aylantiradi va xatolarni markazlashtirilgan joyda javobga o'giradi (32-dars error dizayni).

Servis uchun andoza:

- Zanjir tartibi: recover -> request ID -> logging/metrika -> (CrossOriginProtection kabi xavfsizlik) -> autentifikatsiya -> limitlar -> mux.
- Har bir wrapper `Unwrap()` metodiga ega bo'lsin; streaming endpoint'lar `ResponseController` orqali `Flush` qilinsin.
- Request ID ni chiquvchi chaqiruvlarga (HTTP client, log) uzating: bitta so'rovning izini topish osonlashadi (86-dars: tracing).
- Middleware'larni alohida test qiling: `httptest.NewRecorder` va `httptest.NewRequest` yetarli (82-dars).

## Xulosa

- Middleware `func(http.Handler) http.Handler`; zanjirda eng tashqi qatlam so'rovni birinchi ko'radi va javobni oxirgi.
- `ResponseWriter` wrapper'ida `Write` ichida implicit 200 ni belgilang va `Unwrap()` qo'shing, aks holda status 0 va `Flush` ishlamaydi (lokal sinovda ikkalasi ham kuzatildi).
- Server handler panic'ini o'zi ushlaydi, lekin klient uzilgan ulanish oladi; recover middleware 500 qaytarish, log va metrika beradi, `ErrAbortHandler`ni qayta panic qiladi.
- `context.WithValue` faqat request doirasidagi ma'lumot (request ID, foydalanuvchi) uchun; bog'liqliklar struct maydonlarida turadi.
- Handler qaytgach `w` va `r`dan foydalanish yaroqsiz; tana hajmini `MaxBytesReader` bilan cheklang, brauzer so'rovlarini CSRF'dan Go 1.25 dan `CrossOriginProtection` himoya qiladi.
- Tanani o'qiydigan middleware `r.Body` ni qaytarib qo'ymasa, handler bo'sh tana ko'radi; javob boshlangach panic bo'lsa, `http.Error` statusni o'zgartirmaydi va tanani buzadi; sekin endpoint uchun `ResponseController.SetWriteDeadline` global `WriteTimeout` ni shu handler uchun uzaytiradi.
