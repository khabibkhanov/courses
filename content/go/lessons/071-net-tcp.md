---
n: 71
slug: net-tcp
title: "net: TCP, deadline va netpoller"
summary: "net.Listener va net.Conn qanday ishlaydi, TCP oqim ekani nimani anglatadi, deadline mutlaq vaqt sifatida qanday ishlaydi, har bir ulanish uchun alohida goroutine nega arzon va buni runtime netpoller qanday ta'minlaydi."
duration: 40
sources:
  - id: gopl
    note: "Concurrent server misollari (8-bob): har bir ulanish uchun alohida goroutine yondashuvi"
  - id: 100go
    note: "Resurslarni yopish (HTTP body, sql.Rows, os.File) haqidagi xato: net.Conn uchun ham xuddi shu qoida"
  - id: runtime-hacking
    note: "G, M va P tushunchalari: bloklangan goroutine OS thread'ni band qilmasligini tushuntirish uchun"
quiz:
  - q: "Server har bir ulanish uchun bir marta `conn.SetReadDeadline(time.Now().Add(5 * time.Second))` chaqiradi va keyin sikl ichida qator o'qiydi. Klient har soniyada ma'lumot yuboradi. Nima bo'ladi?"
    options:
      - "Deadline har bir muvaffaqiyatli Read'dan keyin avtomatik 5 soniyaga uzaytiriladi, ulanish ochiq qoladi"
      - "Birinchi 5 soniyadan keyin barcha Read chaqiruvlari klient faol bo'lsa ham timeout xatosi bilan tugaydi"
      - "Deadline faqat birinchi Read chaqiruviga tegishli, keyingilari cheklanmagan"
      - "Deadline o'tgach ulanish avtomatik yopiladi va Read io.EOF qaytaradi"
    answer: 1
    explain: "Deadline davomiylik emas, mutlaq vaqt nuqtasi va u barcha kutilayotgan hamda kelgusi I/O ga tegadi. Idle timeout kerak bo'lsa, har Read'dan oldin deadline qayta o'rnatiladi. Ulanish o'zi yopilmaydi, xato ham io.EOF emas, os.ErrDeadlineExceeded'ni o'z ichiga oladi."
  - q: "Quyidagilardan qaysi biri Read timeout'ini peer ulanishni yopganidan ishonchli ajratadi?"
    options:
      - "err == io.EOF bo'lsa timeout, aks holda peer yopgan"
      - "strings.Contains(err.Error(), \"timeout\")"
      - "errors.Is(err, os.ErrDeadlineExceeded) timeout bo'lsa true, peer toza yopganda esa Read io.EOF qaytaradi"
      - "err == nil && n == 0 bo'lsa timeout"
    answer: 2
    explain: "Hujjat deadline xatosi os.ErrDeadlineExceeded'ni o'rab olishini va errors.Is bilan tekshirilishini aytadi. Peer ulanishni toza yopsa, Read io.EOF qaytaradi. Matn bo'yicha qidirish mo'rt, n == 0 va nil xato esa Read kontraktida kutilmaydi."
  - q: "Server 2000 ta bo'sh turgan ulanishni qabul qildi, har biri alohida goroutine'da Read'da bloklangan. Lokal o'lchovda (Go 1.24, Linux, GOMAXPROCS=2) nima kuzatildi?"
    options:
      - "2000 ga yaqin OS thread, chunki har bir bloklangan Read thread talab qiladi"
      - "2002 goroutine, lekin OS thread soni 5-6 atrofida qoldi: bloklangan goroutine netpoller'da park qilinadi"
      - "Goroutine soni 2 qoldi, chunki runtime ulanishlarni bitta goroutine'ga birlashtiradi"
      - "Server GOMAXPROCS ortishini kutib, ulanishlarni qabul qilishni to'xtatdi"
    answer: 1
    explain: "Socket'lar non-blocking rejimda, Read EAGAIN qaytarganda goroutine park qilinadi va fayl deskriptori epoll/kqueue/IOCP orqali kuzatiladi. Thread band bo'lmaydi. Shuning uchun blocking uslubidagi kod ko'p ulanishda ishlaydi."
  - q: "Mijoz mashinasi elektr uzilishi sababli yo'qoldi, FIN yoki RST kelmadi. Serverda deadline yo'q, TCP keep-alive default holatda. Nima kutiladi?"
    options:
      - "Read darhol xato qaytaradi, chunki TCP uzilishni biladi"
      - "Read abadiy bloklanadi, keep-alive bu holatda hech narsa qilmaydi"
      - "Keep-alive probe'lar javobsiz qolgach (Go default konstantalari bilan 150 soniya atrofida) Read xato bilan tugaydi; deadline esa buni tezroq va kafolatli qiladi"
      - "Go runtime ulanishni o'zi 30 soniyadan keyin yopadi"
    answer: 2
    explain: "TCP peer yo'qolganini faqat paket almashinuvi orqali biladi. Go 1.24 manba kodidagi default'lar: idle 15 s, interval 15 s, count 9, ya'ni 15 + 9*15 = 150 s. Ilova darajasidagi deadline bundan tezroq va nazorat ostida, shuning uchun keep-alive deadline o'rnini bosmaydi."
  - q: "bufio.Scanner bilan qator o'qiyotgan serverda `sc.Buffer(make([]byte, 0, 512), 512)` o'rnatilgan. Klient 1000 baytli qator yubordi. Natija?"
    options:
      - "Scan false qaytaradi, sc.Err() bufio.ErrTooLong, ya'ni \"token too long\" bo'ladi"
      - "Scanner qatorni 512 baytga qirqib qaytaradi"
      - "Scanner buferni avtomatik kattalashtiradi, chunki max faqat tavsiya"
      - "Scan panic qiladi"
    answer: 0
    explain: "Buffer'ning ikkinchi argumenti token uchun qat'iy maksimum. Undan uzun qator Scan'ni to'xtatadi va sc.Err() ErrTooLong qaytaradi. Aynan shu xususiyat bitta klient butun xotirani to'ldirib yuborishining oldini oladi."
  - q: "Accept sikli `for { conn, err := ln.Accept(); if err != nil { return } ... }` ko'rinishida. Production'da bu nimasi bilan xavfli?"
    options:
      - "Accept hech qachon xato qaytarmaydi, shuning uchun tekshiruv ortiqcha"
      - "Har qanday xato (masalan fayl deskriptorlari tugashi) butun serverni to'xtatadi; net.ErrClosed'ni alohida ajratib, qolgan xatolarda qisqa kutib qayta urinish kerak"
      - "Accept sikli alohida goroutine'da bo'lmasa deadlock bo'ladi"
      - "Accept faqat bitta ulanishdan keyin ishlaydi"
    answer: 1
    explain: "Listener yopilganda Accept net.ErrClosed qaytaradi, bu normal chiqish. Lekin vaqtinchalik xatolar (masalan EMFILE) uchun serverni o'ldirish noto'g'ri: kutib qayta urinish kerak. net/http serveri ham shunday qiladi."
task:
  title: "Qayta ishlatiladigan deadline bilan readLine"
  prompt: |
    Telemetriya servisida `session` tipi ulanishdan datchik qatorlarini o'qiydi. Hozir `readLine` deadline qo'ymaydi: sust datchik goroutine'ni cheksiz band qiladi.

    `readLine(limit)` ni yozing:
    - qatorni `limit` ichida o'qisin; vaqt tugasa `errors.Is(err, os.ErrDeadlineExceeded)` true bo'ladigan xato qaytarsin;
    - deadline har chaqiruvda qayta o'rnatilsin va funksiyadan chiqishda olib tashlansin, shunda timeout'dan keyin ham ulanishdan keyingi chaqiruvda ma'lumot o'qish mumkin bo'lsin;
    - `bufio.Reader` `session` ichida qolsin (yo'qotilgan baytlar bo'lmasin).

    Kutilgan natija: 1-urinishda timeout, 2-urinishda `"truck-7,41.31,69.28\n"`.
  lang: go
  starter: |
    package main

    import (
        "bufio"
        "errors"
        "fmt"
        "net"
        "os"
        "time"
    )

    type session struct {
        conn net.Conn
        r    *bufio.Reader
    }

    func newSession(conn net.Conn) *session {
        return &session{conn: conn, r: bufio.NewReader(conn)}
    }

    // readLine bitta qatorni o'qiydi. Hozir deadline yo'q: sust datchik
    // goroutine'ni cheksiz band qiladi.
    func (s *session) readLine(limit time.Duration) (string, error) {
        return s.r.ReadString('\n')
    }

    func main() {
        ln, err := net.Listen("tcp", "127.0.0.1:0")
        if err != nil {
            panic(err)
        }
        defer ln.Close()

        go func() {
            conn, err := ln.Accept()
            if err != nil {
                return
            }
            defer conn.Close()
            time.Sleep(300 * time.Millisecond)
            fmt.Fprintln(conn, "truck-7,41.31,69.28")
            time.Sleep(time.Second)
        }()

        conn, err := net.Dial("tcp", ln.Addr().String())
        if err != nil {
            panic(err)
        }
        defer conn.Close()
        s := newSession(conn)

        line, err := s.readLine(100 * time.Millisecond)
        fmt.Printf("1-urinish: %q timeout=%v\n", line, errors.Is(err, os.ErrDeadlineExceeded))
        line, err = s.readLine(2 * time.Second)
        fmt.Printf("2-urinish: %q timeout=%v\n", line, errors.Is(err, os.ErrDeadlineExceeded))
    }
  solution: |
    package main

    import (
        "bufio"
        "errors"
        "fmt"
        "net"
        "os"
        "time"
    )

    type session struct {
        conn net.Conn
        r    *bufio.Reader
    }

    func newSession(conn net.Conn) *session {
        return &session{conn: conn, r: bufio.NewReader(conn)}
    }

    // readLine bitta qatorni limit ichida o'qiydi. Deadline mutlaq vaqt bo'lgani
    // uchun har chaqiruvda qayta o'rnatiladi va chiqishda tozalanadi.
    func (s *session) readLine(limit time.Duration) (string, error) {
        if err := s.conn.SetReadDeadline(time.Now().Add(limit)); err != nil {
            return "", err
        }
        defer s.conn.SetReadDeadline(time.Time{})
        return s.r.ReadString('\n')
    }

    func main() {
        ln, err := net.Listen("tcp", "127.0.0.1:0")
        if err != nil {
            panic(err)
        }
        defer ln.Close()

        go func() {
            conn, err := ln.Accept()
            if err != nil {
                return
            }
            defer conn.Close()
            time.Sleep(300 * time.Millisecond)
            fmt.Fprintln(conn, "truck-7,41.31,69.28")
            time.Sleep(time.Second)
        }()

        conn, err := net.Dial("tcp", ln.Addr().String())
        if err != nil {
            panic(err)
        }
        defer conn.Close()
        s := newSession(conn)

        line, err := s.readLine(100 * time.Millisecond)
        fmt.Printf("1-urinish: %q timeout=%v\n", line, errors.Is(err, os.ErrDeadlineExceeded))
        line, err = s.readLine(2 * time.Second)
        fmt.Printf("2-urinish: %q timeout=%v\n", line, errors.Is(err, os.ErrDeadlineExceeded))
    }
  solutionNotes: |
    - `SetReadDeadline(time.Now().Add(limit))` mutlaq vaqtni o'rnatadi, shuning uchun u har chaqiruvda qayta hisoblanadi. Bir marta o'rnatilgan deadline keyingi barcha Read'larga ham ta'sir qiladi.
    - `defer s.conn.SetReadDeadline(time.Time{})` nol vaqt bilan deadline'ni o'chiradi. Bu qadam bo'lmasa ham keyingi chaqiruv o'z deadline'ini qo'yadi, lekin boshqa kod (masalan Write yoki yopish jarayoni) eski qiymatga duch kelmasligi uchun tozalash yaxshi odat.
    - `bufio.Reader` timeout'dan keyin ham ishlaydi: xato bir marta qaytariladi, ichki bufer saqlanadi. Shuning uchun reader har chaqiruvda yangidan yaratilmaydi, aks holda bufer ichidagi baytlar yo'qoladi.
    - Timeout `errors.Is(err, os.ErrDeadlineExceeded)` bilan tekshiriladi, xato matni bo'yicha emas.
  checklist:
    - "1-urinishda `errors.Is(err, os.ErrDeadlineExceeded)` true"
    - "2-urinishda server yuborgan qator to'liq o'qiladi"
    - "Deadline har chaqiruvda `time.Now().Add(limit)` bilan qayta o'rnatiladi"
    - "Chiqishda deadline `time.Time{}` bilan tozalanadi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Avtopark monitoring platformasida GPS trekerlar va yoqilg'i datchiklari ko'pincha HTTP emas, oddiy TCP orqali, o'z qator yoki ikkilik protokolida ma'lumot yuboradi. Server ming-o'n minglab ulanishni ushlab turadi va ularning ko'pchiligi ko'p vaqt jim turadi. Shu yerda uchta klassik og'riq paydo bo'ladi.

Birinchisi: sust yoki yo'qolgan klient. Treker SIM-kartasi signal yo'qotdi, mashina tunnelga kirdi, NAT jadvali yozuvni o'chirdi. Server tomondan ulanish ochiq ko'rinadi, `Read` esa cheksiz kutadi. Har bir shunday ulanish goroutine, bufer va fayl deskriptorini ushlab turadi. Deadline qo'yilmagan servis asta-sekin resurslarini yo'qotadi va kuniga bir marta "ghost" ulanishlar tufayli qayta ishga tushirishni talab qiladi.

Ikkinchisi: TCP xabarlarni emas, baytlar oqimini uzatadi. Klient ikki marta `Write` qilgani serverda ikki marta `Read` degani emas. Bitta `Read` yarim qatorni, bir yarim qatorni yoki uch qatorni qaytarishi mumkin. Chegaralarni (framing) dastur o'zi belgilaydi.

Uchinchisi: cheksiz kirish hajmi. Qator uzunligi cheklanmagan bo'lsa, bitta xato yoki zararli klient `\n` yubormay xotirani to'ldirishi mumkin.

Node.js dasturchisi bu muammolarni callback va hodisalar bilan hal qilgan: `data` hodisasi bo'laklarni beradi, ularni o'zingiz yig'asiz. Go'da kod ketma-ket, blocking uslubida yoziladi: "qator o'qi, qayta ishla, javob yoz". Bu uslub arzon, chunki runtime pastda hamma narsani non-blocking qiladi. Bu dars shu mexanizmni, deadline qoidalarini va ulardan kelib chiqadigan xavfsiz server shablonini ko'rsatadi.

## Asosiy g'oya

### Listener va Conn

`net.Listen("tcp", addr)` `net.Listener` qaytaradi; `Accept` har chaqiruvda yangi `net.Conn` beradi. `net.Conn` interface'i `io.Reader`, `io.Writer`, `Close` va uchta deadline metodini o'z ichiga oladi. TCP uchun konkret tip `*net.TCPConn`, unda qo'shimcha imkoniyatlar bor: `CloseWrite` va `CloseRead` (half-close, ya'ni bir yo'nalishni yopish), keep-alive sozlamalari.

Port sifatida `127.0.0.1:0` bersangiz, tizim bo'sh port tanlaydi va `ln.Addr()` uni qaytaradi. Testlarda ana shu usul ishlatiladi.

### Goroutine har bir ulanishga

Go serverining odatiy modeli: `Accept` siklida har bir ulanish uchun `go handle(conn)`. Handler ichida oddiy blocking kod yoziladi. "The Go Programming Language" kitobining concurrency bobidagi clock va chat server misollari aynan shu modelni ko'rsatadi. Bu modelning ustuni kod soddaligi: holat mashinasi yo'q, callback zanjiri yo'q, har bir ulanishning holati lokal o'zgaruvchilarda turadi.

### Deadline: mutlaq vaqt

`SetDeadline`, `SetReadDeadline` va `SetWriteDeadline` hujjatdagi ta'rifga ko'ra mutlaq vaqt nuqtasini o'rnatadi. Bu nuqtadan keyin I/O bloklanish o'rniga xato qaytaradi. Uchta muhim qoida:

- Deadline barcha kutilayotgan va kelgusi I/O ga tegadi, faqat keyingi chaqiruvga emas. Davomiylik ("5 soniya jimlik") kerak bo'lsa, har `Read`dan oldin `time.Now().Add(d)` bilan qayta o'rnatish kerak.
- Muddat o'tgach ulanishni yangi deadline bilan "tiriltirish" mumkin: hujjat shuni aytadi. Ya'ni timeout xatosi ulanishni avtomatik yaroqsiz qilmaydi (lekin ayrim yuqori darajadagi o'quvchilar, masalan `bufio.Scanner`, xatodan keyin to'xtaydi).
- Nol qiymat (`time.Time{}`) deadline'ni olib tashlaydi.

Xatoni tekshirish: deadline xatosi `os.ErrDeadlineExceeded`ni o'raydi, shuning uchun `errors.Is(err, os.ErrDeadlineExceeded)` ishlatiladi. Hujjat shuni ham qo'shimcha qiladi: `Timeout()` metodi true qaytargan ba'zi xatolar deadline bilan bog'liq bo'lmasligi mumkin. Peer ulanishni toza yopsa, `Read` `io.EOF` qaytaradi.

### Dial va muddatlar

Klient tomonda `net.DialTimeout` yoki `net.Dialer` va `DialContext` ishlatiladi. Context bilan ulanish urinishini bekor qilish mumkin. `Dialer.Timeout` faqat ulanish o'rnatilishigacha bo'lgan vaqtni cheklaydi; ulanish o'rnatilgandan keyingi I/O uchun deadline alohida o'rnatiladi.

## Chuqurroq: netpoller va keep-alive

### Bloklangan goroutine thread band qilmaydi

Go socket'larni non-blocking rejimda ochadi. `conn.Read` ichida tizim chaqiruvi `EAGAIN` ("hozircha ma'lumot yo'q") qaytarsa, `internal/poll` paketi goroutine'ni `waitRead` orqali park qiladi, ya'ni uni ishga yaroqsiz deb belgilaydi va fayl deskriptorini runtime'ning tarmoq poller'iga ro'yxatdan o'tkazadi. Poller operatsion tizim mexanizmiga tayanadi: Linux'da epoll, BSD va macOS'da kqueue, Windows'da IOCP (runtime manba kodida `netpoll_epoll.go`, `netpoll_kqueue.go`, `netpoll_windows.go` fayllari). Scheduler ish qidirayotganda `netpoll` ni chaqiradi va ma'lumot kelgan goroutine'larni ishga tayyor qilib qaytaradi. Bu mexanizmni Go 1.24 manba kodidan tekshirdik: `runtime/proc.go` ichida `netpoll(0)` va bloklanuvchi `netpoll(delay)` chaqiruvlari bor.

G, M va P tushunchalari (goroutine, OS thread, protsessor konteksti) 51-darsda batafsil ko'riladi. Bu yerda kerakli xulosa: M, ya'ni OS thread, bloklangan `Read`da kutib turmaydi, u boshqa tayyor goroutine'ni bajaradi. Shuning uchun ming ulanish ming thread degani emas.

Buni o'lchadik. Misol dasturida 2000 ta loopback ulanish ochildi, server har birini alohida goroutine'da `ReadString` bilan bloklab qo'ydi. Natija "Misol" bo'limida: 2002 goroutine, thread soni esa 5-6 oralig'ida qoldi.

### Narx qayerda

Goroutine arzon, lekin bepul emas. Ulanish uchun asosiy xotira goroutine stack'i emas, o'quvchi buferlari: `bufio.NewReader` default 4096 baytlik bufer ajratadi. 100 ming ulanishda faqat shu buferlar 400 MB atrofida xotira oladi, shuning uchun juda ko'p bo'sh ulanishli serverlarda buferni faqat ma'lumot kelganda ajratish yoki kichik bufer tanlash o'ylab ko'riladi. Ulanish soni cheklovi esa fayl deskriptorlari bilan belgilanadi (`ulimit -n`).

### Keep-alive: deadline o'rnini bosmaydi

TCP keep-alive probe'lar jim ulanish ortidagi peer tirikligini tekshiradi. Go'da `Dialer.KeepAlive` nol bo'lsa, probe'lar default qiymat (hujjatga ko'ra hozir 15 soniya) bilan yuboriladi, manfiy bo'lsa o'chadi. Go 1.23 dan `KeepAliveConfig` bor: `Idle`, `Interval` va `Count` alohida sozlanadi, u `Dialer`, `ListenConfig` va `TCPConn.SetKeepAliveConfig` orqali beriladi. Go 1.24 manba kodidagi default konstantalar: idle 15 s, interval 15 s, count 9.

Demak, jim yo'qolgan peer uchun `Read` 15 + 9 * 15 = 150 soniyadan keyin xato bilan tugaydi (Linux semantikasi bilan). Bu cheklov bor, lekin ikkita kamchiligi bor: (1) u faqat o'lik peerni topadi, peer tirik, lekin sust bo'lsa, hech narsa qilmaydi; (2) muddat tizim sozlamalariga bog'liq. Ilova darajasidagi deadline ("30 soniya ichida hech narsa kelmasa, uzamiz") aniq va nazorat ostida. Ikkalasi ham kerak.

### MPTCP

Go 1.21 Linux'da Multipath TCP'ni opt-in qilib kiritdi (`ListenConfig.SetMultipathTCP`). Go 1.24 release notes'ga ko'ra `ListenConfig` endi qo'llab-quvvatlanadigan tizimlarda (hozircha faqat Linux) MPTCP'ni default ishlatadi. Peer MPTCP'ni bilmasa, ulanish jimgina oddiy TCP'ga qaytadi, shuning uchun odatda ilova kodi o'zgarmaydi; lekin ulanish xususiyatlarini `ss` yoki tcpdump bilan tahlil qilganda buni bilish kerak.

### Accept sikli va yopish

`Listener.Close` bloklangan `Accept` ni `net.ErrClosed` bilan uyg'otadi: bu normal to'xtash belgisi. Boshqa xatolar (masalan fayl deskriptorlari tugagan) vaqtinchalik bo'lishi mumkin; `net/http` serveri bunda qisqa kutib qayta urinadi, o'z siklingizda ham shunday qiling. `Conn.Close` esa boshqa goroutine'da `Read`da turgan chaqiruvni xato bilan uyg'otadi, shuning uchun to'xtatish jarayonida ulanishlarni yopish kifoya. Yopishni unutmaslik qoidasi 100 Go Mistakes kitobidagi "vaqtinchalik resurslarni yopmaslik" xatosi bilan bir xil: `net.Conn` ham yopilishi shart.

### Yozish tomoni

`Write` hamma baytlar yozilguncha yoki deadline tugaguncha bloklanadi; deadline tugasa u yozilgan bayt sonini va xatoni qaytaradi. Sust o'quvchi (klient ma'lumotni olmaydi) yadro send bufer'ini to'ldiradi va `Write` bloklanadi: bu tabiiy backpressure. Write deadline'siz bitta sust klient javob yuboruvchi goroutine'ni abadiy ushlaydi.

## Misol: qator protokoli, idle timeout va o'lchov

Birinchi dastur server handler'ini ko'rsatadi: har qatordan oldin deadline qayta o'rnatiladi, qator uzunligi 512 bayt bilan cheklanadi, tugash sababi aniq ajratiladi.

```go
package main

import (
	"bufio"
	"errors"
	"fmt"
	"net"
	"os"
	"strings"
	"time"
)

const idleTimeout = 200 * time.Millisecond

// handle bitta ulanishni xizmat qiladi: "id,lat,lon" qatorlarini o'qiydi.
func handle(conn net.Conn, done chan<- string) {
	defer conn.Close()
	sc := bufio.NewScanner(conn)
	sc.Buffer(make([]byte, 0, 512), 512) // bitta qator 512 baytdan oshmasin
	count := 0
	for {
		// Deadline mutlaq vaqt: har qatordan oldin qayta o'rnatiladi.
		_ = conn.SetReadDeadline(time.Now().Add(idleTimeout))
		if !sc.Scan() {
			break
		}
		count++
		fmt.Fprintf(conn, "ok %d\n", count)
	}
	err := sc.Err()
	var ne net.Error
	switch {
	case err == nil:
		done <- fmt.Sprintf("klient yopdi, %d qator", count)
	case errors.Is(err, os.ErrDeadlineExceeded):
		done <- fmt.Sprintf("idle timeout, %d qator (net.Error timeout=%v)", count, errors.As(err, &ne) && ne.Timeout())
	default:
		done <- fmt.Sprintf("xato: %v", err)
	}
}

func main() {
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		panic(err)
	}
	defer ln.Close()
	done := make(chan string, 1)
	go func() {
		conn, err := ln.Accept()
		if err != nil {
			return
		}
		handle(conn, done)
	}()

	c, err := net.Dial("tcp", ln.Addr().String())
	if err != nil {
		panic(err)
	}
	defer c.Close()
	r := bufio.NewReader(c)
	for _, line := range []string{"truck-7,41.31,69.28", "truck-7,41.32,69.29"} {
		fmt.Fprintln(c, line)
		reply, _ := r.ReadString('\n')
		fmt.Print("javob: ", reply)
	}
	// Klient jim qoladi: server idle timeout bilan ulanishni yopadi.
	fmt.Println("server:", <-done)

	// Ikkinchi ulanish: juda uzun qator.
	go func() {
		conn, err := ln.Accept()
		if err != nil {
			return
		}
		handle(conn, done)
	}()
	c2, _ := net.Dial("tcp", ln.Addr().String())
	defer c2.Close()
	fmt.Fprintln(c2, strings.Repeat("x", 1000))
	fmt.Println("server:", <-done)
}
```

Natija:

```text
javob: ok 1
javob: ok 2
server: idle timeout, 2 qator (net.Error timeout=true)
server: xato: bufio.Scanner: token too long
```

Nima uchun shunday:

- `SetReadDeadline` sikl ichida, `sc.Scan()` dan oldin chaqiriladi. Natijada 200 ms jimlik "idle" bo'ladi, faol klient esa ulanishni cheksiz ushlay oladi.
- `bufio.Scanner` xatodan keyin to'xtaydi (u xatoni saqlaydi). Shuning uchun u yerda timeout bo'lsa, ulanishni yopamiz. Agar ulanishni tiriltirish kerak bo'lsa, `bufio.Reader` ishlatiladi (topshiriqda shunday).
- Timeout `errors.Is(err, os.ErrDeadlineExceeded)` bilan, juda uzun qator `sc.Err()` ichidagi `bufio.ErrTooLong` bilan ajraladi. Klient yopsa, `sc.Err()` nil bo'ladi (`io.EOF` Scanner tomonidan xato deb hisoblanmaydi).

Ikkinchi dastur netpoller xususiyatini o'lchaydi. Ulanishlar bir jarayon ichida, loopback orqali ochiladi:

```go
package main

import (
	"bufio"
	"fmt"
	"net"
	"os"
	"runtime"
	"strings"
	"sync"
	"time"
)

// threads /proc/self/status dan OS thread sonini o'qiydi (faqat Linux).
func threads() string {
	data, err := os.ReadFile("/proc/self/status")
	if err != nil {
		return "?"
	}
	for _, line := range strings.Split(string(data), "\n") {
		if strings.HasPrefix(line, "Threads:") {
			return strings.TrimSpace(strings.TrimPrefix(line, "Threads:"))
		}
	}
	return "?"
}

func main() {
	const conns = 2000
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		panic(err)
	}
	defer ln.Close()

	var served sync.WaitGroup
	go func() {
		for {
			c, err := ln.Accept()
			if err != nil {
				return
			}
			served.Add(1)
			go func() {
				defer served.Done()
				defer c.Close()
				// Har bir ulanish uchun bitta goroutine: o'qishda bloklanadi.
				_, _ = bufio.NewReader(c).ReadString('\n')
			}()
		}
	}()

	fmt.Println("boshida: goroutine =", runtime.NumGoroutine(), "thread =", threads(), "GOMAXPROCS =", runtime.GOMAXPROCS(0))

	clients := make([]net.Conn, 0, conns)
	for i := 0; i < conns; i++ {
		c, err := net.Dial("tcp", ln.Addr().String())
		if err != nil {
			fmt.Println("dial:", err)
			break
		}
		clients = append(clients, c)
	}
	time.Sleep(300 * time.Millisecond)
	fmt.Println("ulanishlar:", len(clients), "goroutine =", runtime.NumGoroutine(), "thread =", threads())

	for _, c := range clients {
		_, _ = c.Write([]byte("\n"))
		c.Close()
	}
	served.Wait()
	fmt.Println("yopilgach: goroutine =", runtime.NumGoroutine())
}
```

Go 1.24.7, linux/amd64, GOMAXPROCS=2 (2 yadroli sandbox) da chiqish:

```text
boshida: goroutine = 2 thread = 5 GOMAXPROCS = 2
ulanishlar: 2000 goroutine = 2002 thread = 6
yopilgach: goroutine = 2
```

2000 ulanish uchun 2000 ta server goroutine'i qo'shildi (2 + 2000), thread soni esa o'smadi. Thread soni 5 va 6 oralig'ida o'zgarishi mumkin: runtime ichki ishlar uchun bir-ikki yordamchi thread yaratadi. Aniq qiymat sizning mashinangizda boshqacha bo'ladi, lekin 2000 ga yaqin bo'lmaydi.

Deadline xatosining o'zi quyidagicha ko'rinadi (portlar har ishga tushirishda o'zgaradi):

```text
xato: read tcp 127.0.0.1:34400->127.0.0.1:34175: i/o timeout
net.Error: true timeout: true
os.ErrDeadlineExceeded: true
```

## Qachon qo'llamaslik kerak

- O'z TCP protokoli kerak bo'lmasa, HTTP yoki gRPC (77-dars) ishlating. Framing, versiyalash, autentifikatsiya, TLS, load balancer va proxy qo'llab-quvvatlashi tayyor keladi. Xom TCP faqat qurilma protokoli buni talab qilganda (masalan, trekerlarning tayyor ikkilik protokoli) mantiqli.
- Har bir ulanish uchun goroutine modeli millionlab ulanishda xotira va fayl deskriptori cheklovlariga yetadi. Bunday masshtabda ulanishlar sonini cheklash, bufer hajmini kamaytirish va kerak bo'lsa gateway qatlami kerak bo'ladi. Bu raqamlar muammosi, model xatosi emas.
- Keep-alive'ga tayanib "ulanish tirik" deb hisoblamang. Ilova darajasidagi heartbeat yoki idle deadline ishlating.
- Deadline'ni "so'rov butun muddati" sifatida ishlatmang. Bir so'rov ichida bir necha I/O bo'lsa, `context` va umumiy deadline (34-dars) qulayroq; `SetDeadline` ni aynan bir ulanish ustida bajariladigan bosqichlar uchun qoldiring.
- `bufio.Scanner`ni noma'lum, cheklanmagan kirishda `Buffer` limitisiz ishlatmang: default token chegarasi mavjud, lekin uni oshirsangiz xotira xavfi tug'iladi.

## Stack'da: Node.js bilan solishtirish

Node.js'da ulanish `net.Socket` hodisalari bilan boshqariladi: `data` bo'laklarni beradi, ularni qator yoki xabarga yig'ish sizning vazifangiz, kechikish boshqaruvi ham hodisa uslubida. Go'da bir xil vazifa ketma-ket kod bilan yoziladi va `Read` bloklanadi, lekin pastda baribir epoll/kqueue turadi: ikkala model ham bir mexanizmga (OS hodisa bildirishnomasi) tayanadi. Farq shuki, Node.js uni bitta event loop thread'iga ochadi, Go esa goroutine'larni bir necha thread ustida taqsimlaydi. Natijada Go'da bitta sekin handler (masalan, hisoblash) boshqa ulanishlarni to'xtatmaydi, Node.js'da esa event loop'ni bloklash hammaga ta'sir qiladi.

Amaliy qoidalar:

- Har bir `net.Conn` uchun `defer conn.Close()` va aniq deadline siyosati (idle, write) yozing.
- Qator yoki xabar uzunligini doim cheklang (`Scanner.Buffer` yoki o'z uzunlik prefiksi bilan maksimum).
- Testlarda `127.0.0.1:0` va `net.Pipe` ishlating, real portga bog'lamang.
- Servis to'xtaganda listener'ni yopib, faol handler'larni context orqali xabardor qiling (72-darsdagi graceful shutdown shu g'oyaga tayanadi).

## Xulosa

- TCP bayt oqimi: xabar chegaralarini dastur o'zi belgilaydi (qator, uzunlik prefiksi), `Read` bitta xabar qaytarishi kafolatlanmagan.
- Deadline mutlaq vaqt nuqtasi: idle timeout uchun har `Read`dan oldin qayta o'rnating, tugagach `errors.Is(err, os.ErrDeadlineExceeded)` bilan tekshiring.
- Har ulanishga bitta goroutine arzon, chunki netpoller (epoll, kqueue, IOCP) bloklangan goroutine'ni thread'siz kutdiradi: 2000 ulanishda thread soni o'smadi.
- Keep-alive o'lik peerni 150 soniya atrofida topadi (Go 1.24 default'lari bilan), ilova deadline'ini almashtirmaydi.
- Kirish hajmini doim cheklang va `Accept` xatolarini farqlang: `net.ErrClosed` - chiqish, qolganlari qayta urinish.
