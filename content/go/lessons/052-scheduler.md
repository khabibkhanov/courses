---
n: 52
slug: scheduler
title: "Scheduler: work stealing, preemption va netpoller"
summary: "Goroutine'lar P'larning local va global queue'laridan qanday tanlanadi, bo'sh P boshqa P'dan ishni qanday o'g'irlaydi, uzoq ishlayotgan goroutine'ni runtime qanday to'xtatadi (async preemption) va tarmoq I/O'si nega thread band qilmaydi."
duration: 45
sources:
  - id: runtime-hacking
    note: "Scheduler structures va Synchronization bo'limlari: P system call paytida qaytariladi; gopark/goready; notetsleepg system call kabi P'ni bo'shatadi"
  - id: pkg-runtime
    note: "GODEBUG ro'yxati: asyncpreemptoff, schedtrace, scheddetail tavsifi; GOMAXPROCS tavsifi"
  - id: diagnostics
    note: "Execution tracer va GODEBUG bo'limlari: tracer scheduling va syscall hodisalarini ko'rsatishi, schedtrace=X"
quiz:
  - q: "GOMAXPROCS=1 va `go func() { for {} }()` goroutine'i bor. Main goroutine `time.Sleep(50ms)` dan keyin Go 1.24 da uyg'onadi. Nega, va `GODEBUG=asyncpreemptoff=1` bilan nima bo'ladi?"
    options:
      - "Sleep timer'i alohida thread'da ishlaydi, shuning uchun har doim uyg'onadi"
      - "Hech narsa farq qilmaydi, chunki bo'sh sikl compiler tomonidan o'chiriladi"
      - "Runtime `for {}` ni olib tashlaydi, preemption bu yerga aloqasiz"
      - "Async preemption signal bilan uzoq ishlayotgan goroutine'ni to'xtatadi; o'chirilsa, bitta P'dagi bo'sh sikl main'ni qaytarmaydi va dastur osilib qoladi"
    answer: 3
    explain: "Darsdagi tajribada default'da dastur 'main davom etdi' deb chiqdi, asyncpreemptoff=1 bilan esa 3 soniyalik timeout'gacha hech narsa chiqmadi. runtime hujjati: bu sozlama ba'zi sikllarni uzoq vaqt preemption qilib bo'lmaydigan qiladi va GC hamda scheduling'ni kechiktirishi mumkin."
  - q: "Bitta goroutine 8 ta CPU-bound goroutine yaratdi. GOMAXPROCS=1 da umumiy vaqt 3.2s, GOMAXPROCS=2 da 1.8s bo'ldi (2 vCPU). Bu natija scheduler haqida nimani ko'rsatadi?"
    options:
      - "Yangi goroutine'lar yaratuvchi P'ning local queue'siga tushsa ham, bo'sh P ularning bir qismini o'g'irlab oladi (work stealing)"
      - "Har goroutine yaratilganda yangi thread ochiladi"
      - "Goroutine'lar faqat global queue orqali taqsimlanadi"
      - "GOMAXPROCS=2 tezlikni ikki baravar emas, har doim 10 baravar oshiradi"
    answer: 0
    explain: "Hammasi bitta goroutine'dan yaratilgani uchun dastlab bitta P'ning queue'sida turadi. Vaqtning deyarli yarmiga tushishi (nisbat 1.7 atrofida) ikkinchi P ishni boshqa P'dan olishini ko'rsatadi. 'Ikki baravar'ga yetmasligi o'lchov sharoitiga bog'liq."
  - q: "schedtrace qatori: `SCHED 2020ms: gomaxprocs=2 idleprocs=0 threads=5 spinningthreads=0 needspinning=0 idlethreads=2 runqueue=3 [8 0]`. Runtime manba kodiga ko'ra uni qanday o'qish kerak?"
    options:
      - "Uchta M uxlayapti, ikkita goroutine ishlayapti"
      - "Global run queue'da 3 ta goroutine; P0'ning local queue'sida 8 ta, P1'nikida 0 ta; barcha P'lar band (idleprocs=0)"
      - "8 ta thread bor, 3 tasi bloklangan"
      - "gomaxprocs=2 ta global queue, har birida 3 ta"
    answer: 1
    explain: "schedtrace funksiyasi (Go manba kodida) runqueue=sched.runqsize, ya'ni global queue uzunligi, qavs ichida esa har P'ning local queue uzunligini chiqaradi. idleprocs=0 hamma P'lar goroutine bajarayotganini anglatadi, shuning uchun P1'ning bo'sh local queue'si 'P1 band emas' degani emas."
  - q: "1000 ta TCP ulanish bor, har birida alohida goroutine `conn.Read` da kutmoqda. Darsdagi tajribaga ko'ra thread'lar soni qanday o'zgardi?"
    options:
      - "1000 ta thread yaratildi"
      - "GOMAXPROCS ta thread yaratildi"
      - "Deyarli o'zgarmadi (0 yoki 1 ta yangi thread): goroutine'lar park qilinadi va tarmoq tayyorligini netpoller kuzatadi"
      - "Dastur ulanishlarni 100 tadan keyin rad etdi"
    answer: 2
    explain: "Tajribada ikki ishga tushirishda yangi thread yozuvlari 0 va 1 bo'ldi. Tarmoq I/O'sida goroutine M'ni ushlab turmaydi, bu bloklovchi system call'lardan (40 ta Nanosleep 40 ga yaqin thread bergan edi) tubdan farq qiladi."
  - q: "Go 1.14 da async preemption kiritilgach, `syscall` yoki `golang.org/x/sys/unix` orqali sekin system call'larni to'g'ridan-to'g'ri chaqiradigan kod uchun release notes nimani ogohlantiradi?"
    options:
      - "Bunday kod endi umuman ishlamaydi"
      - "Dastur ko'proq signal oladi, shuning uchun sekin system call'lar EINTR bilan tez-tez tugashi mumkin va kod ularni qayta urinishi kerak"
      - "System call'lar faqat GOMAXPROCS=1 da ishlaydi"
      - "Hech narsa, chunki Go EINTR'ni doim yashiradi"
    answer: 1
    explain: "Go 1.14 release notes: preemption tufayli Unix tizimlarida dasturlar ko'proq signal oladi, shuning uchun to'g'ridan-to'g'ri syscall ishlatadigan kod EINTR xatolarini qayta urinish bilan hal qilishi kerak. Standart kutubxona (os, net) buni o'zi hal qiladi."
  - q: "Bloklovchi system call'larni (har biri M ushlab turadi) 5000 goroutine'dan cheklovsiz chaqirsangiz nima xavf bor va qanday kamaytiriladi?"
    options:
      - "Xavf yo'q, chunki GOMAXPROCS bloklangan thread'larni ham cheklaydi"
      - "Faqat CPU 100% bo'ladi, thread'lar ko'paymaydi"
      - "Dastur compile bo'lmaydi"
      - "Thread'lar soni keskin o'sadi (system call'dagi M'lar GOMAXPROCS'ga kirmaydi); bir vaqtdagi chaqiruvlarni semaphore yoki worker pool bilan cheklash kerak"
    answer: 3
    explain: "pkg runtime: system call'dagi thread'lar soniga chegara yo'q va ular GOMAXPROCS'ga hisoblanmaydi. Shuning uchun parallel bloklovchi chaqiruvlarni dastur o'zi cheklashi kerak, masalan buferli channel'dan semaphore sifatida foydalanib."
task:
  title: "Bir vaqtdagi bloklovchi system call'larni cheklash"
  prompt: |
    Avtopark monitoring platformasi diskka yoki tashqi qurilmaga bloklovchi system call bilan yozadi. Har bloklangan chaqiruv goroutine bilan birga M'ni ham ushlab turadi va M'lar GOMAXPROCS chegarasiga kirmaydi, shuning uchun 40 ta ishni bir vaqtda ishga tushirish thread'lar sonini oshiradi.

    Boshlang'ich kod `runAll(jobs, limit)` ichida hamma ishni darhol parallel ishga tushiradi va `limit` parametrini e'tiborsiz qoldiradi, shuning uchun "bir vaqtda eng ko'pi <= 4" tekshiruvi `false` chiqaradi. Funksiyani tuzating: bir vaqtda `limit` tadan ortiq `blockingCall` ishlamasin, lekin barcha `jobs` ta ish bajarilsin. Imzoni o'zgartirmang, tashqi paket ishlatmang.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "sync"
        "sync/atomic"
        "syscall"
    )

    // blockingCall bloklovchi system call'ni modellashtiradi: goroutine ham, M ham band.
    func blockingCall() {
        ts := syscall.Timespec{Nsec: 20_000_000}
        syscall.Nanosleep(&ts, nil)
    }

    // runAll barcha ishlarni bajaradi. limit - bir vaqtda nechta
    // bloklovchi chaqiruv ruxsat etilishi.
    func runAll(jobs, limit int) (done, maxInFlight int64) {
        var inFlight, peak, finished atomic.Int64
        var wg sync.WaitGroup
        for i := 0; i < jobs; i++ {
            wg.Add(1)
            go func() {
                defer wg.Done()
                cur := inFlight.Add(1)
                for {
                    p := peak.Load()
                    if cur <= p || peak.CompareAndSwap(p, cur) {
                        break
                    }
                }
                blockingCall()
                inFlight.Add(-1)
                finished.Add(1)
            }()
        }
        wg.Wait()
        return finished.Load(), peak.Load()
    }

    func main() {
        done, peak := runAll(40, 4)
        fmt.Println("bajarildi:", done)
        fmt.Println("bir vaqtda eng ko'pi <= 4:", peak <= 4)
    }
  solution: |
    package main

    import (
        "fmt"
        "sync"
        "sync/atomic"
        "syscall"
    )

    // blockingCall bloklovchi system call'ni modellashtiradi: goroutine ham, M ham band.
    func blockingCall() {
        ts := syscall.Timespec{Nsec: 20_000_000}
        syscall.Nanosleep(&ts, nil)
    }

    // runAll barcha ishlarni bajaradi. limit - bir vaqtda nechta
    // bloklovchi chaqiruv ruxsat etilishi.
    func runAll(jobs, limit int) (done, maxInFlight int64) {
        var inFlight, peak, finished atomic.Int64
        var wg sync.WaitGroup
        sem := make(chan struct{}, limit)
        for i := 0; i < jobs; i++ {
            wg.Add(1)
            go func() {
                defer wg.Done()
                sem <- struct{}{}
                defer func() { <-sem }()
                cur := inFlight.Add(1)
                for {
                    p := peak.Load()
                    if cur <= p || peak.CompareAndSwap(p, cur) {
                        break
                    }
                }
                blockingCall()
                inFlight.Add(-1)
                finished.Add(1)
            }()
        }
        wg.Wait()
        return finished.Load(), peak.Load()
    }

    func main() {
        done, peak := runAll(40, 4)
        fmt.Println("bajarildi:", done)
        fmt.Println("bir vaqtda eng ko'pi <= 4:", peak <= 4)
    }
  solutionNotes: |
    - Buferli `chan struct{}` semaphore vazifasini bajaradi: `sem <- struct{}{}` joy olgunicha goroutine park qilinadi (thread band qilmaydi), `defer func() { <-sem }()` joyni qaytaradi.
    - Semaphore `inFlight` hisoblagichidan oldin olinadi, shuning uchun hisoblagich haqiqiy bir vaqtdagi bloklovchi chaqiruvlarni o'lchaydi.
    - 40 ta goroutine yaratiladi, lekin 36 tasi semaphore'da park holatida kutadi. Ular M ushlab turmaydi, shuning uchun bloklovchi thread'lar soni `limit` bilan cheklanadi.
    - Ko'p ish bo'lsa goroutine'larni ham cheklash uchun worker pool ishlating (49-dars); bu yechim soddaligi uchun har ish uchun goroutine yaratadi.
    - Tekshiruv: `go run -race .` ham xatosiz o'tadi. Kutilgan chiqish: `bajarildi: 40` va `bir vaqtda eng ko'pi <= 4: true`.
  checklist:
    - "Chiqishda `bajarildi: 40` va `bir vaqtda eng ko'pi <= 4: true`"
    - "Semaphore buferli channel bilan qilingan va `defer` bilan qaytariladi"
    - "Imzo (`runAll(jobs, limit int) (done, maxInFlight int64)`) o'zgarmagan"
    - "`go run -race .` ma'lumot poygasi haqida xabar bermaydi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Production'da scheduler odatda ko'rinmaydi, to'g'rirog'i, u buzilmaguncha ko'rinmaydi. Buzilish belgilari odatda shunday: p99 latency to'satdan oshadi, lekin CPU 100% emas; bitta ishchi goroutine hamma narsani "yeb qo'yadi"; `GOMAXPROCS=4` bo'lsa-da 4 yadroli mashinada faqat bitta yadro band; yoki DB'ga tushadigan fayl yozuvlari paytida thread'lar soni minglarga chiqadi.

Node.js'da bunday muammolar bitta nom bilan ma'lum: event loop bloklangan. Go'da esa "loop" yo'q, scheduler bor, va u uchta savolni hal qiladi. Birinchi: bo'sh qolgan P qayerdan ish topadi (work stealing)? Ikkinchi: bitta goroutine uzoq ishlasa, qolganlar ochlikdan qutulishi uchun uni qanday to'xtatish mumkin (preemption)? Uchinchi: minglab tarmoq ulanishi uchun nega thread kerak emas (netpoller)?

Oldingi darsdagi G, M va P modelini (51-dars) bilasiz. Bu darsda scheduler shu uch resursni qanday harakatga keltirishini ko'ramiz. Muhim ogohlik: scheduler algoritmi dasturchiga berilgan shartnoma emas. Rasmiy hujjatlar (runtime paketi, HACKING.md, Diagnostics) yuqori darajadagi xatti-harakatni tasvirlaydi; aniq konstantalar (queue o'lchami, vaqt kvanti) esa runtime manba kodida bor va versiyadan versiyaga o'zgarishi mumkin. Bu darsda bunday tafsilotlar "manba kodi" deb belgilanadi: ular Go 1.24.7 va Go 1.27.0 manba kodlarida `proc.go` izohlari va funksiyalaridan tekshirilgan, lekin hujjatlashtirilgan kafolat emas.

## Asosiy g'oya

### Navbatlar: local, runnext va global

Har P'ning o'zining local run queue'si bor, va butun scheduler uchun bitta global run queue mavjud. Manba kodida (Go 1.24.7 va 1.27.0 da bir xil) local queue 256 ta goroutine sig'adigan halqa, undan tashqari `runnext` degan alohida bitta o'rin bor: joriy goroutine tomonidan endigina tayyor qilingan (masalan channel'ga yozib, kutayotgan goroutine'ni uyg'otgan) goroutine ko'pincha navbatning eng boshiga emas, `runnext`ga tushadi, shunda ma'lumot almashayotgan ikki goroutine bir P'da ketma-ket ishlaydi. Local queue to'lsa, goroutine global queue'ga o'tadi.

Yangi goroutine, ya'ni `go f()`, yaratuvchi P'ning local queue'siga tushadi. Bu locality uchun yaxshi (lock kerak emas), lekin nomutanosiblik beradi: bitta goroutine 1000 ta goroutine yaratsa, ular hammasi bitta P'da turadi. Buni work stealing tuzatadi.

P keyingi goroutine'ni tanlaganda tartib murakkab, lekin asosiy qoida manba kodidagi izohda ochiq yozilgan: global queue vaqti-vaqti bilan tekshiriladi (kod `schedtick%61` shartidan foydalanadi), aks holda ikkita goroutine bir-birini qayta-qayta yaratib, local queue'ni to'liq egallab olishi va global queue'dagilarni ochlikda qoldirishi mumkin. Shundan keyin local queue, undan keyin global queue, undan keyin bloklanmaydigan tarmoq so'rovi (netpoll), va faqat shundan keyin boshqa P'lardan o'g'irlash keladi.

### Work stealing

Local ham, global ham bo'sh bo'lsa, M "spinning" holatiga o'tadi, ya'ni uxlashdan oldin boshqa P'larning queue'larini qidiradi. Manba kodiga ko'ra, u P'larni tasodifiy tartibda ko'rib chiqadi (to'rt urinishgacha) va tanlangan P'ning local queue'idagi goroutine'larning yarmini oladi (kodda `n = n - n/2`). Oxirgi urinishda `runnext` va timer'larni ham ko'radi, lekin `runnext`ni darrov o'g'irlamaydi: egasi P uni bir zumda ishga tushirishi mumkin bo'lgani uchun avval qisqa kutadi.

Spinning thread'lar CPU yeydi, shuning uchun ularni chegaralash kerak. Manba kodidagi izohlar ikkita qoidani aytadi: spinning M'lar soni band P'lar sonining yarmidan oshmaydi, va yangi ish paydo bo'lganda (`wakep`) qo'shimcha thread faqat bo'sh P bor va spinning thread yo'q bo'lsa uyg'otiladi. Bu uyg'otishlarni sozlash masalasi: juda ko'p uyg'otish thread'larni behuda aylantiradi, juda kam uyg'otish esa CPU'ni yetarlicha ishlatmaydi. Hujjat darajasida shuni bilish yetarli: bo'sh P ishsiz o'tirmaydi, boshqa P'dan ish oladi.

## Chuqurroq: preemption, sysmon va netpoller

### Preemption: kooperativ va asinxron

Uzoq ishlayotgan goroutine uchun ikki mexanizm bor.

Birinchisi kooperativ: har funksiya prologi stack chegarasini tekshiradi (58-darsda stack o'sishini ko'ramiz), runtime esa goroutine'ning stack chegarasini maxsus qiymatga o'zgartirib, keyingi funksiya chaqiruvida goroutine'ni to'xtatishi mumkin. Bu mexanizm faqat funksiya chaqiruvi bor joyda ishlaydi, shuning uchun `for {}` kabi chaqiruvsiz sikl uni to'xtata olmaydi.

Ikkinchisi asinxron: Go 1.14 release notes'iga ko'ra goroutine'lar asinxron preemption qilinadi. Natijada chaqiruvsiz sikllar scheduler'ni qulflab qo'ymaydi va garbage collection'ni sezilarli kechiktirmaydi. Bu mexanizm signalga tayanadi, shuning uchun Unix tizimlarida 1.14 dan keyin kompilyatsiya qilingan dasturlar ko'proq signal oladi va to'g'ridan-to'g'ri `syscall` yoki `golang.org/x/sys/unix` ishlatadigan kod sekin system call'larda ko'proq EINTR xatosiga duch keladi; bunday kod EINTR'da qayta urinishi kerak. Standart kutubxona (`os`, `net`) buni o'zi qiladi. `GODEBUG=asyncpreemptoff=1` signalga asoslangan preemption'ni o'chiradi; runtime hujjati bu "ba'zi sikllarni uzoq vaqt preemption qilib bo'lmaydigan qiladi va GC hamda goroutine scheduling'ni kechiktirishi mumkin" deb ogohlantiradi, va uni GC muammolarini disk raskadrovka qilishda ishlatishni tavsiya qiladi, production uchun emas.

Kim goroutine'ni to'xtatishni so'raydi? Manba kodida buni `sysmon` deb ataladigan alohida monitoring thread'i qiladi (u P talab qilmaydi). Agar P bir xil `schedtick`da 10 millisekunddan ortiq turib qolsa (`forcePreemptNS` konstantasi), sysmon `preemptone` orqali preemption so'raydi. Preemption qilingan goroutine local emas, global queue'ga qo'yiladi (`goschedImpl`, u `runtime.Gosched` ham ishlatadigan funksiya). Shuning uchun "uzun ishlagan goroutine" navbat oxiriga tushadi va boshqa P'lar uni olishi mumkin.

### System call va netpoller

System call'ga kirgan M P'sini qaytarishi kerakligini bilamiz (HACKING.md). Agar system call uzoq cho'zilsa, sysmon P'ni M'dan "retake" qiladi, ya'ni boshqa M'ga beradi. Bu sabab, bloklovchi chaqiruvlar bor dasturda ham boshqa goroutine'lar ishlayveradi, narxi esa qo'shimcha thread'lar.

Tarmoq I/O'si boshqacha. Soket nonblocking rejimda ishlaydi, goroutine esa `Read`da park qilinadi va operatsion tizimning tayyorlik mexanizmi (Linux'da epoll) kuzatadi; `internal/poll` va `netpoll` shu ishni qiladi. Manba kodida `findRunnable` ishsiz qolgan P uchun avval bloklanmaydigan `netpoll(0)` chaqiradi, hammasi bo'sh bo'lsa esa timer yetguncha bloklanuvchi netpoll'da kutadi. Tayyor bo'lgan goroutine'lar run queue'ga qaytariladi. Diagnostics hujjati bu hodisalarni execution tracer ko'rsatishini aytadi: tracer tarmoq yoki system call goroutine'lar preemption'iga sabab bo'lgan joyni topishga yordam beradi.

Fayl tizimi operatsiyalari odatda bloklovchi system call hisoblanadi; bu muallifning umumiy bilimi, dars manbalarida aniq bo'lim yo'q. Shu sababli "tarmoq I/O'si arzon, disk I/O'si thread yeydi" ning o'lchovini quyida ko'rasiz.

## Misol: preemption, work stealing va netpoller o'lchovi

Preemption tajribasi. GOMAXPROCS=1, bitta goroutine chaqiruvsiz `for {}` aylanadi, main esa 50 ms uxlab keyin xabar chiqarishi kerak:

```go
package main

import (
	"fmt"
	"runtime"
	"time"
)

func main() {
	runtime.GOMAXPROCS(1)

	go func() {
		// funksiya chaqiruvi yo'q: sinxron preemption nuqtalari yo'q
		for {
		}
	}()

	time.Sleep(50 * time.Millisecond)
	fmt.Println("main davom etdi")
}
```

Go 1.24.7, linux/amd64 da ikki holatni solishtirdik:

```text
default:           main davom etdi (exit=0)
asyncpreemptoff=1: hech narsa chiqmadi, 3 soniyalik timeout'da to'xtatildi (exit=124)
```

Default rejimda signal asosidagi preemption `for {}` goroutine'ini to'xtatadi va main'ga navbat tegadi. O'chirilganda bitta P'dagi bo'sh sikl main'ni abadiy kuttiradi. Bu 1.14 dan oldingi muammo edi. Hujjat uni o'chirishni disk raskadrovka uchun tavsiya qiladi.

Work stealing tajribasi. Bitta goroutine 8 ta CPU-bound goroutine yaratadi va hammasi tugaguncha kutadi; GOMAXPROCS 1 va 2 uchun vaqtni o'lchaymiz:

```go
package main

import (
	"fmt"
	"runtime"
	"sync"
	"time"
)

// burn - CPU-bound ish: funksiya natijasi ishlatiladi, shuning uchun compiler olib tashlamaydi.
func burn(n int) uint64 {
	var x uint64 = 1
	for i := 0; i < n; i++ {
		x = x*6364136223846793005 + 1442695040888963407
	}
	return x
}

func run(procs int) time.Duration {
	runtime.GOMAXPROCS(procs)
	var wg sync.WaitGroup
	var sink uint64
	var mu sync.Mutex
	start := time.Now()
	// barcha goroutine'lar BITTA goroutine'dan yaratiladi:
	// ular dastlab o'sha goroutine ishlayotgan P'ning local queue'siga tushadi
	wg.Add(1)
	go func() {
		defer wg.Done()
		for i := 0; i < 8; i++ {
			wg.Add(1)
			go func() {
				defer wg.Done()
				v := burn(300_000_000)
				mu.Lock()
				sink ^= v
				mu.Unlock()
			}()
		}
	}()
	wg.Wait()
	_ = sink
	return time.Since(start)
}

func main() {
	d1 := run(1)
	d2 := run(2)
	fmt.Printf("GOMAXPROCS=1: %v\n", d1.Round(10*time.Millisecond))
	fmt.Printf("GOMAXPROCS=2: %v\n", d2.Round(10*time.Millisecond))
	fmt.Printf("nisbat: %.2f\n", float64(d1)/float64(d2))
}
```

2 vCPU li mashinada, Go 1.24.7, ikki ishga tushirishda:

```text
GOMAXPROCS=1: 3.23s      GOMAXPROCS=1: 3.14s
GOMAXPROCS=2: 1.82s      GOMAXPROCS=2: 1.87s
nisbat: 1.77             nisbat: 1.68
```

Hamma ish bitta goroutine'dan yaratilgan, ya'ni dastlab bitta P'ning local queue'sida. Ikkinchi P ishga qo'shilganda vaqt deyarli yarmiga tushdi. "Ikki baravar"dan biroz kam bo'lishi tabiiy: o'lchov boshqa jarayonlar bilan umumiy mashinada olingan va 1.7 qiymati ikki ishga tushirishning natijasi, aniq benchmark emas (61-darsda to'g'ri benchmark yozishni o'rganasiz).

Xuddi shu dasturni `GODEBUG=schedtrace=500` bilan ishga tushirsak, scheduler holatini ko'ramiz. Birinchi to'rt qator:

```text
SCHED 0ms: gomaxprocs=2 idleprocs=0 threads=4 spinningthreads=1 needspinning=0 idlethreads=0 runqueue=0 [0 0]
SCHED 502ms: gomaxprocs=1 idleprocs=0 threads=4 spinningthreads=0 needspinning=1 idlethreads=2 runqueue=0 [7]
SCHED 1007ms: gomaxprocs=1 idleprocs=0 threads=4 spinningthreads=0 needspinning=1 idlethreads=2 runqueue=1 [6]
SCHED 1517ms: gomaxprocs=1 idleprocs=0 threads=4 spinningthreads=0 needspinning=1 idlethreads=2 runqueue=0 [7]
```

Maydonlar (Go manba kodidagi `schedtrace` funksiyasiga ko'ra): `gomaxprocs` joriy P'lar soni, `idleprocs` bo'sh P'lar, `threads` jami M, `spinningthreads` ish qidirayotganlar, `idlethreads` uxlayotgan M'lar, `runqueue` global queue uzunligi, qavs ichidagi sonlar esa har P'ning local queue uzunligi. Dastur avval `GOMAXPROCS(1)` da ishlagani uchun qavsda bitta son bor: 7 ta CPU-bound goroutine kutmoqda. Ba'zi qatorlarda `runqueue=1` va `[6]`: bu 10 ms kvant tugab preemption qilingan goroutine global queue'ga o'tganini ko'rsatadi. Bu bizning izohimiz; schedtrace bunday izoh bermaydi.

Netpoller tajribasi. Loopback'da 1000 ta TCP ulanish ochamiz, server tomonida har ulanish uchun goroutine `Read`da bloklanadi:

```go
package main

import (
	"fmt"
	"net"
	"runtime"
	"runtime/pprof"
	"sync"
	"time"
)

func main() {
	runtime.GOMAXPROCS(2)
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		panic(err)
	}
	defer ln.Close()

	const n = 1000
	// server tomoni: har bir ulanish uchun bitta goroutine Read'da bloklanadi
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
				buf := make([]byte, 16)
				c.Read(buf) // M'ni band qilmaydi: netpoller kutadi
			}()
		}
	}()

	before := pprof.Lookup("threadcreate").Count()
	conns := make([]net.Conn, 0, n)
	for i := 0; i < n; i++ {
		c, err := net.Dial("tcp", ln.Addr().String())
		if err != nil {
			panic(err)
		}
		conns = append(conns, c)
	}
	time.Sleep(300 * time.Millisecond)
	fmt.Println("bloklangan server goroutine'lari ~", runtime.NumGoroutine()-1)
	fmt.Println("yangi thread'lar:", pprof.Lookup("threadcreate").Count()-before)

	for _, c := range conns {
		c.Write([]byte("x"))
		c.Close()
	}
	served.Wait()
}
```

```text
bloklangan server goroutine'lari ~ 1001
yangi thread'lar: 0
```

Ikkinchi ishga tushirishda yangi thread'lar soni 1 bo'ldi. 1001 son: 1000 ulanish va bitta `Accept` sikli. 51-darsdagi 40 ta `Nanosleep` bilan solishtiring: u yerda thread'lar deyarli 40 taga o'sgan edi. Farq aynan shu darsning xulosasi: park qilingan goroutine arzon, system call'dagi goroutine M ushlab turadi.

## Qachon qo'llamaslik kerak

- Scheduler tartibiga tayanib to'g'rilikni ta'minlamang. Qaysi goroutine birinchi ishlashi spetsifikatsiyada belgilanmagan. Manba kodidagi izohga ko'ra Go poyga detektori (`-race`) yoqilganda scheduler tartibiga ataylab tasodifiylik kiritadi, chunki Go 1.5 da tartib o'zgarganda yomon yozilgan testlar sinib qolgan edi. Sinxronizatsiya faqat channel, mutex va atomic orqali bo'lishi kerak (43-dars).
- `runtime.Gosched()` ni to'g'rilik uchun ishlatmang. U goroutine'ni global queue'ga qaytaradi, xolos; "boshqalar o'tib ketdi" kafolati yo'q.
- `asyncpreemptoff=1` ni production'ga qo'ymang. U faqat disk raskadrovka sozlamasi.
- Queue o'lchami, 61 tick, 10 ms kvant kabi konstantalarga tayanadigan kod yozmang: ular hujjatlashtirilmagan.
- Bloklovchi system call'larni cheksiz parallel chaqirmang. Mashqda semaphore bilan chegaralaysiz.

## Stack'da: Node.js/TypeScript bilan farq

- Node.js'da libuv event loop tarmoq tayyorligini kuzatadi (Linux'da epoll). Go'da netpoller xuddi shu vazifani bajaradi, lekin natija goroutine'ga qaytib, "oddiy bloklash"ga o'xshab ko'rinadi. `await` kerak emas.
- Node.js'da bitta sinxron og'ir hisoblash hamma so'rovni to'xtatadi. Go'da bunday hisoblash faqat bitta P'ni egallaydi va 10 ms dan keyin preemption qilinishi mumkin. Lekin bu kafolatli latency emas: GOMAXPROCS=1 yoki konteynerda CPU limiti juda past bo'lsa (53-dars) ta'sir seziladi.
- Go servisida p99 oshganini ko'rsangiz, birinchi navbatda execution trace oling (64-dars): u goroutine'lar runnable holatida qancha kutganini (`/sched/latencies:seconds` metrikasi ham shuni o'lchaydi, 60-dars) ko'rsatadi.
- Bloklovchi cgo yoki `syscall` chaqiruvlari bor servisda thread soni (`threads=` schedtrace'da yoki `/sched/gomaxprocs:threads` bilan yonma-yon) monitoringda bo'lishi kerak.

## Xulosa

- Har P'ning local queue'si, bitta global queue va `runnext` o'rni bor; global queue vaqti-vaqti bilan tekshiriladi, shuning uchun goroutine'lar ochlikdan saqlanadi. Bular manba kodidagi tafsilotlar, kafolat emas.
- Bo'sh P boshqa P'ning queue'idan ishni o'g'irlaydi (work stealing): bitta goroutine yaratgan 8 ta CPU-bound ish GOMAXPROCS=2 da deyarli ikki baravar tez tugadi.
- Go 1.14 dan goroutine'lar asinxron preemption qilinadi: chaqiruvsiz sikl scheduler'ni qulflamaydi. `asyncpreemptoff=1` bilan esa shu dastur osilib qoldi. Narxi: to'g'ridan-to'g'ri syscall kodida EINTR'ni qayta urinish kerak.
- Tarmoq I/O'sida goroutine netpoller orqali park qilinadi va thread band qilmaydi (1000 ulanishda 0 yoki 1 yangi thread), bloklovchi system call esa M ushlab turadi (40 ta chaqiruvda deyarli 40 thread).
- Diagnostika uchun `GODEBUG=schedtrace=X` va execution tracer: birinchisi tezkor rasm, ikkinchisi tafsilot beradi.
