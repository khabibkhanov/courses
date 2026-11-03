---
n: 51
slug: runtime-arxitektura
title: "Runtime arxitekturasi: G, M va P"
summary: "Goroutine (G), OS thread (M) va processor (P) nima, scheduler ularni qanday moslashtiradi, nega 100 ming goroutine bor servisda thread'lar yuzlab emas bir necha o'nlab bo'ladi va bloklovchi system call'lar M soniga qanday ta'sir qiladi."
duration: 40
sources:
  - id: runtime-hacking
    note: "Scheduler structures bo'limi: Gs, Ms, Ps; Stacks bo'limi: user stack, system stack (g0) va signal stack; Synchronization bo'limi: gopark va goready"
  - id: pkg-runtime
    note: "Muhit o'zgaruvchilari tavsifi: GOMAXPROCS threadlar sonini qanday cheklaydi, system call'dagi thread'lar chegaraga kirmaydi; Stack funksiyasi"
  - id: go-faq
    note: "Why goroutines instead of threads? va Why is there no goroutine ID? javoblari"
quiz:
  - q: "GOMAXPROCS=4 bilan ishlayotgan servisda 10 ta goroutine bloklovchi system call ichida turibdi. Runtime hujjatlariga ko'ra nima to'g'ri?"
    options:
      - "Yangi P'lar yaratiladi, chunki har bir bloklangan goroutine uchun P kerak"
      - "Servis to'xtab qoladi, chunki 4 dan ortiq goroutine bir vaqtda syscall'da tura olmaydi"
      - "P'lar soni baribir aynan 4 ta; system call'dagi thread'lar GOMAXPROCS chegarasiga kirmaydi, shuning uchun M'lar 4 dan ko'p bo'lishi mumkin"
      - "System call tugamaguncha boshqa goroutine'lar ishlamaydi"
    answer: 2
    explain: "Hujjat: aynan GOMAXPROCS ta P bor, system call'da bloklangan thread'lar soni cheklanmagan va ular GOMAXPROCS chegarasiga hisoblanmaydi. M system call'ga kirganda P'sini bo'sh P'lar to'plamiga qaytaradi, shuning uchun qolgan goroutine'lar ishlashda davom etadi."
  - q: "Quyidagilardan qaysi resurs soni runtime tomonidan aynan GOMAXPROCS ga teng qilib saqlanadi?"
    options:
      - "G - goroutine obyektlari"
      - "P - Go kodini bajarish uchun kerak bo'lgan resurslar (scheduler va allocator holati)"
      - "M - OS thread'lar"
      - "Hech biri, uchalasi ham dinamik"
    answer: 1
    explain: "runtime/HACKING.md: aynan GOMAXPROCS ta P bor. G soni dastur xohlagancha, M ham istalgancha bo'lishi mumkin, chunki istalgancha thread system call'da bloklanishi mumkin."
  - q: "GOMAXPROCS=2 da 5000 goroutine bir kanaldan `<-block` bilan kutmoqda. Thread'lar yaratilishi haqida nima kutish kerak?"
    options:
      - "Har goroutine uchun bitta thread yaratiladi, ya'ni 5000 thread"
      - "Har P uchun 2500 thread yaratiladi"
      - "Thread'lar soni goroutine soniga teng, lekin ular uxlaydi"
      - "Deyarli o'zgarmaydi: channel'da bloklangan goroutine park qilinadi va M band qilmaydi"
    answer: 3
    explain: "Channel operatsiyasida goroutine'ni runtime gopark bilan 'waiting' holatiga o'tkazadi va M boshqa goroutine'ni bajarishda davom etadi. Darsdagi tajribada 5000 ta shunday goroutine'dan keyin thread yozuvlari soni 0 ga ortdi."
  - q: "Goroutine dump'ida `goroutine 21 [syscall]:` qatori ko'rindi. Bu qatordan nima xulosa qilish mumkin?"
    options:
      - "Goroutine system call ichida; uning M'i bloklangan, P esa boshqa M'ga berilishi mumkin"
      - "Goroutine yangi thread yaratayotir"
      - "Goroutine P kutmoqda, chunki P'lar tugagan"
      - "Goroutine panic bilan to'xtagan"
    answer: 0
    explain: "Qavs ichidagi so'z goroutine holati. [syscall] - goroutine system call'da. HACKING.md bo'yicha system call'ga kirgan M o'z P'sini bo'sh P'lar to'plamiga qaytaradi. P kutayotgan goroutine'lar esa runnable holatida bo'ladi, panic esa dump'da alohida ko'rinadi."
  - q: "Go nima uchun goroutine'ga ID bermaydi va `go` ifodasidan handle qaytarmaydi?"
    options:
      - "Texnik jihatdan imkonsiz, chunki goroutine'lar thread'larda yashaydi"
      - "ID xotirani juda ko'p sarflaydi"
      - "Goroutine'lar anonim ishchilar: nomlangan goroutine'ga bog'langan modellar kutubxonalarga cheklov qo'yadi va kodni 'maxsus thread'ga moslashtirishga majbur qiladi"
      - "ID'lar faqat GOMAXPROCS=1 da mavjud"
    answer: 2
    explain: "Go FAQ shu sababni keltiradi: nomlangan goroutine maxsus bo'lib qoladi va butun hisoblashni unga bog'lashga vasvasa tug'diradi. Maxsus goroutine kerak bo'lsa, channel orqali muloqot qilinadi."
  - q: "M'ning 'g0' (system) stack'i haqida qaysi gap HACKING.md ga mos?"
    options:
      - "Foydalanuvchi kodi shu stack'da ishlaydi va u 2 KB dan boshlab o'sadi"
      - "U o'sa olmaydi, runtime va cgo kodini bajarishga yetarli kattalikda, undagi kod preemption qilinmaydi va GC uni skanerlamaydi"
      - "U har goroutine uchun alohida yaratiladi"
      - "U faqat Windows'da mavjud"
    answer: 1
    explain: "HACKING.md: system va signal stack'lar o'sa olmaydi, lekin runtime va cgo kodini bajarish uchun yetarli (sof Go binary'da 8K). System stack'dagi kod implicit non-preemptible va GC system stack'larni skanerlamaydi. Foydalanuvchi kodi esa kichik boshlanib o'sadigan user stack'da ishlaydi."
task:
  title: "Goroutine dump'idagi holatlarni to'g'ri sanash"
  prompt: |
    Servis hodisalarini tahlil qilish uchun goroutine dump'idan holatlar bo'yicha statistika kerak: nechta goroutine `chan receive`, nechtasi `select` va hokazo. Dump sarlavhasi `goroutine 18 [chan receive, 7 minutes]:` ko'rinishida bo'lishi mumkin: holatdan keyin bloklanish muddati yoki `locked to thread` kabi qo'shimchalar vergul bilan keladi.

    Boshlang'ich kod qavs ichidagi butun matnni kalit qilib oladi, shuning uchun bir xil holat turli kalitlarga bo'linib ketadi (`chan receive`, `chan receive, 3 minutes`, `chan receive, 7 minutes`). `countStates` funksiyasini tuzating: kalit faqat holat nomi bo'lsin. Dump formatiga bog'lanmaslik uchun sarlavhadan tashqari qatorlarni (stack frame'lar) e'tiborsiz qoldiring va noto'g'ri sarlavhada panic bo'lmasin.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "sort"
        "strings"
    )

    const dump = `goroutine 1 [running]:
    main.main()
        /app/main.go:21 +0x5c

    goroutine 18 [chan receive, 7 minutes]:
    main.worker(0xc000012345)
        /app/worker.go:14 +0x2a

    goroutine 19 [chan receive]:
    main.worker(0xc000012399)
        /app/worker.go:14 +0x2a

    goroutine 20 [select, 12 minutes]:
    main.poll()
        /app/poll.go:30 +0x91

    goroutine 21 [IO wait]:
    net.(*netFD).Read(0xc0000a6000)
        /usr/local/go/src/net/fd_posix.go:55 +0x25

    goroutine 22 [syscall, locked to thread]:
    syscall.Syscall(0x0, 0x7, 0xc0001b6000)
        /usr/local/go/src/syscall/syscall_linux.go:69 +0x25

    goroutine 23 [chan receive, 3 minutes]:
    main.worker(0xc0000123ff)
        /app/worker.go:14 +0x2a
    `

    // countStates goroutine dump'idagi holatlarni sanaydi.
    func countStates(dump string) map[string]int {
        counts := map[string]int{}
        for _, line := range strings.Split(dump, "\n") {
            if !strings.HasPrefix(line, "goroutine ") {
                continue
            }
            open := strings.Index(line, "[")
            end := strings.Index(line, "]")
            counts[line[open+1:end]]++
        }
        return counts
    }

    func main() {
        counts := countStates(dump)
        states := make([]string, 0, len(counts))
        for s := range counts {
            states = append(states, s)
        }
        sort.Slice(states, func(i, j int) bool {
            if counts[states[i]] != counts[states[j]] {
                return counts[states[i]] > counts[states[j]]
            }
            return states[i] < states[j]
        })
        for _, s := range states {
            fmt.Printf("%-14s %d\n", s, counts[s])
        }
    }
  solution: |
    package main

    import (
        "fmt"
        "sort"
        "strings"
    )

    const dump = `goroutine 1 [running]:
    main.main()
        /app/main.go:21 +0x5c

    goroutine 18 [chan receive, 7 minutes]:
    main.worker(0xc000012345)
        /app/worker.go:14 +0x2a

    goroutine 19 [chan receive]:
    main.worker(0xc000012399)
        /app/worker.go:14 +0x2a

    goroutine 20 [select, 12 minutes]:
    main.poll()
        /app/poll.go:30 +0x91

    goroutine 21 [IO wait]:
    net.(*netFD).Read(0xc0000a6000)
        /usr/local/go/src/net/fd_posix.go:55 +0x25

    goroutine 22 [syscall, locked to thread]:
    syscall.Syscall(0x0, 0x7, 0xc0001b6000)
        /usr/local/go/src/syscall/syscall_linux.go:69 +0x25

    goroutine 23 [chan receive, 3 minutes]:
    main.worker(0xc0000123ff)
        /app/worker.go:14 +0x2a
    `

    // countStates goroutine dump'idagi holatlarni sanaydi.
    func countStates(dump string) map[string]int {
        counts := map[string]int{}
        for _, line := range strings.Split(dump, "\n") {
            if !strings.HasPrefix(line, "goroutine ") {
                continue
            }
            open := strings.Index(line, "[")
            end := strings.Index(line, "]")
            if open < 0 || end < open {
                continue
            }
            state, _, _ := strings.Cut(line[open+1:end], ",")
            counts[strings.TrimSpace(state)]++
        }
        return counts
    }

    func main() {
        counts := countStates(dump)
        states := make([]string, 0, len(counts))
        for s := range counts {
            states = append(states, s)
        }
        sort.Slice(states, func(i, j int) bool {
            if counts[states[i]] != counts[states[j]] {
                return counts[states[i]] > counts[states[j]]
            }
            return states[i] < states[j]
        })
        for _, s := range states {
            fmt.Printf("%-14s %d\n", s, counts[s])
        }
    }
  solutionNotes: |
    - Holat nomi qavs ichidagi birinchi vergulgacha bo'lgan qism: `strings.Cut(..., ",")` shuni beradi, `TrimSpace` qolgan bo'shliqni olib tashlaydi.
    - Faqat `goroutine ` bilan boshlanadigan qatorlar sanaladi; frame qatorlari (`main.worker(...)`, tab bilan boshlanadigan fayl yo'llari) o'tkazib yuboriladi.
    - `open < 0 || end < open` tekshiruvi ixtiyoriy dump bilan ishlaganda indeks xatosi (panic) bo'lishining oldini oladi.
    - Go 1.27 da `tracebacklabels` yoqilganda sarlavhaga pprof label'lari qo'shiladi. Birinchi `[...]` ni o'qish bu o'zgarishga ham chidamli, lekin yangi formatni o'z toolchain'ingizdagi haqiqiy dump bilan tekshiring.
    - Kutilgan chiqish: `chan receive 3`, `IO wait 1`, `running 1`, `select 1`, `syscall 1`.
  checklist:
    - "`chan receive` uchta alohida kalitga bo'linmaydi, yagona kalit bo'lib 3 chiqadi"
    - "`syscall, locked to thread` kalit sifatida `syscall` bo'ladi"
    - "Frame qatorlari va bo'sh qatorlar sanashga ta'sir qilmaydi"
    - "Qavssiz noto'g'ri sarlavhada panic bo'lmaydi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Node.js'dan kelgan dasturchi uchun konkurentlik modeli tanish: JavaScript kodi bitta thread'da ishlaydi, bloklanadigan ishlar esa runtime tomonidan fonga olib ketiladi. Go'da bu rasm boshqacha, va o'zgarish production'da uchta aniq savol sifatida chiqadi.

Birinchisi: "Servisimda 80 ming goroutine bor, nega `top` atigi bir necha o'nlab thread ko'rsatyapti?" yoki aksincha: "nega thread'lar soni ming'dan oshib ketdi?" Ikkinchisi: "GOMAXPROCS=4 qo'ydim, demak bir vaqtda 4 tadan ortiq iş bajarilmaydimi? Lekin DB driver'i va fayl operatsiyalari ham ishlayapti-ku." Uchinchisi: "Goroutine dump'ida `[syscall]`, `[IO wait]`, `[semacquire]` kabi holatlar ko'rinadi. Ular nimani anglatadi va qaysi biri muammo?"

Bu savollarga javob berish uchun runtime'ning uchta tushunchasini aniq bilish kerak: G, M va P. Ular faqat scheduler muhandislari uchun emas. Profil, trace va dump'larni o'qiganda, GOMAXPROCS'ni konteynerda sozlaganda (53-dars) va "goroutine leak" izlaganda (41-dars) shu model asosida fikrlaysiz. Bu dars modulning poydevori: keyingi darslar (scheduler, allocator, GC) shu atamalarga tayanadi.

Eslatma: runtime'ning ichki tuzilishi release'dan release'ga o'zgaradi. Bu darsda faqat rasmiy hujjatlarda (runtime/HACKING.md, `runtime` paketi hujjati, Go FAQ) yozilgan mexanizmlarga tayanamiz. Runtime manba kodidan olingan tafsilotlar alohida belgilanadi.

## Asosiy g'oya

### Uch harf: G, M, P

`runtime/HACKING.md` hujjati scheduler boshqaradigan uch xil resursni sanaydi. Quyidagi jadval ularning qisqa ta'rifi:

| Harf | Nima | Soni | Runtime ichidagi tip |
|---|---|---|---|
| G | goroutine: bajarilishi kerak bo'lgan kod va uning holati | dastur xohlagancha | `g` |
| M | OS thread: foydalanuvchi kodini, runtime kodini yoki system call'ni bajarayotgan yoki bo'sh turgan | istalgancha, chunki istalgancha thread system call'da bloklanishi mumkin | `m` |
| P | foydalanuvchi Go kodini bajarish uchun kerak bo'lgan resurslar: scheduler va allocator holati | aynan GOMAXPROCS | `p` |

P eng noodatiy tushuncha. Hujjat uni OS scheduler'dagi CPU bilan solishtiradi: `p` tipining ichidagi ma'lumot "CPU boshiga" holatdir. Bu samaradorlik uchun shardlanishi kerak bo'lgan, lekin har thread yoki har goroutine uchun alohida bo'lishi shart bo'lmagan holat uchun yaxshi joy. Keyingi darslarda ko'rasiz: har P'ning o'z local run queue'si bor (52-dars), allocator'ning kichik obyektlar keshi ham P'ga bog'langan (54-dars).

Scheduler'ning vazifasini HACKING.md bitta jumlada beradi: G'ni (bajariladigan kod), M'ni (qayerda bajariladi) va P'ni (bajarish huquqi va resurslari) bir-biriga moslashtirish. Bundan muhim qoida kelib chiqadi: M foydalanuvchi Go kodini faqat P ushlab turganda bajaradi. M foydalanuvchi kodini bajarishni to'xtatsa, masalan system call'ga kirsa, P'ni bo'sh P'lar to'plamiga qaytaradi. System call'dan qaytgach Go kodini davom ettirish uchun to'plamdan P olishi kerak.

Shu yerdan GOMAXPROCS tavsifi ham tushunarli bo'ladi. `runtime` paketi hujjatiga ko'ra GOMAXPROCS foydalanuvchi darajasidagi Go kodini bir vaqtda bajara oladigan operatsion tizim thread'lari sonini cheklaydi, system call'larda bloklangan thread'lar soniga esa chegara yo'q va ular bu limitga kirmaydi. Ya'ni GOMAXPROCS "nechta goroutine bor" yoki "nechta thread bor" emas, balki "bir vaqtning o'zida nechta thread Go kodini ishga tushira oladi" degani.

### Goroutine nima uchun arzon

Go FAQ goroutine'larni mustaqil bajariladigan funksiyalarning thread'lar to'plamiga multiplekslanishi deb tushuntiradi. Coroutine bloklovchi system call'ga kirganda runtime shu thread'dagi boshqa coroutine'larni bloklanmasligi uchun boshqa thread'ga ko'chiradi, dasturchi buni ko'rmaydi. Narx: stack xotirasidan boshqa overhead kam, stack esa bir necha kilobayt. Buni resizable (o'sadigan va kichrayadigan) va chegaralangan stack'lar ta'minlaydi: yangi goroutine bir necha kilobayt oladi, yetmasa runtime stack'ni o'zi o'stiradi. FAQ bo'yicha bu uchun o'rtacha narx funksiya chaqiruvi boshiga uchta arzon instruksiya atrofida, va bir xil adres maydonida yuz minglab goroutine yaratish amaliy.

HACKING.md buni aniqroq beradi: har tirik G'ning user stack'i bor, u kichik (masalan 2K) boshlanadi va dinamik o'sib-kichrayadi. Goroutine tugaganda uning `g` obyekti bo'sh `g`lar to'plamiga qaytariladi va keyin boshqa goroutine uchun qayta ishlatiladi. Standart boshlang'ich o'lchamdagi stack `g` obyekti bilan birga saqlanadi, undan kattaroq o'sgan stack esa bo'shatiladi, `g` qayta ishlatilganda yangisi ajratiladi. Stack o'sishining mexanikasini 58-darsda ko'ramiz.

Bu yerda Node.js bilan farq aniq. Node.js'da bitta event loop thread'i bor; undagi har uzoq sinxron hisoblash hamma narsani to'xtatadi. Go'da CPU'ga bog'liq goroutine boshqa P'larda ishlayveradi, va (52-darsda ko'rasiz) uzoq ishlayotgan goroutine'ni runtime majburan to'xtata oladi. Buning evaziga Go dasturi haqiqiy parallel ishlaydi va shu sababli ma'lumot poygalari (data race) mumkin. Node.js tomoni haqidagi bu qiyoslash muallifning umumiy bilimiga tayanadi, dars manbalarida u yo'q.

### Uchta stack

HACKING.md'dagi "Stacks" bo'limi muhim farqni beradi. Har tirik G'da user stack bor, foydalanuvchi kodi shu yerda ishlaydi. Har M'da esa o'zining system stack'i ("g0" stack, chunki u stub G sifatida amalga oshirilgan) bor, Unix platformalarida qo'shimcha signal stack ("gsignal") ham. System va signal stack'lar o'sa olmaydi, lekin runtime va cgo kodini bajarishga yetarli (sof Go binary'da 8K, cgo binary'da tizim ajratgan).

Runtime kodi preemption qilinmasligi kerak bo'lgan, user stack'ni o'stirmasligi kerak bo'lgan yoki foydalanuvchi goroutine'larini almashtiradigan ishlar uchun vaqtincha system stack'ga o'tadi (`systemstack`, `mcall`, `asmcgocall`). System stack'dagi kod implicit non-preemptible, garbage collector esa system stack'larni skanerlamaydi. Foydalanuvchi sifatida buni bevosita ko'rmaysiz, lekin traceback'da `runtime.systemstack` kabi frame'lar paydo bo'lishini endi tushunasiz.

### Goroutine holatlari: park va ready

HACKING.md sinxronizatsiya mexanizmlarini ikkiga ajratadi. Runtime ichidagi `mutex` M'ning o'zini bloklaydi va Go scheduler bilan o'zaro ta'sir qilmaydi: bu runtime'ning eng quyi qatlamlari uchun xavfsiz, lekin tegishli G va P'ni qayta rejalashtirishga ham to'sqinlik qiladi. Scheduler bilan to'g'ridan-to'g'ri ishlash uchun esa `gopark` va `goready` bor: `gopark` joriy goroutine'ni "waiting" holatiga o'tkazadi, run queue'dan chiqaradi va joriy M/P'da boshqa goroutine'ni ishga tushiradi; `goready` park qilingan goroutine'ni "runnable" holatiga qaytarib run queue'ga qo'yadi.

Foydalanuvchi uchun natija: channel'da, `sync.Mutex`'da, `select`'da yoki `time.Sleep`'da bloklangan goroutine thread'ni band qilmaydi, u shunchaki park qilinadi. Faqat system call yoki cgo ichida turgan goroutine M'ni ham ushlab turadi. Shuning uchun goroutine dump'idagi holat so'zi resurs haqida ham ma'lumot beradi, buni keyingi bo'limda ko'ramiz.

## Chuqurroq: M soni qachon o'sadi

Quyidagi qoidalar birgalikda M sonini belgilaydi:

- Foydalanuvchi kodi bajarilishi uchun M'ga P kerak, P'lar esa GOMAXPROCS ta.
- System call'ga kirgan M P'sini qaytaradi, shuning uchun boshqa goroutine'lar uchun boshqa M P olib ishlashi kerak. Ishlash uchun bo'sh M bo'lmasa, yangi thread yaratiladi.
- Natijada M soni bir vaqtda bloklangan system call'lar soniga va ishlayotgan P'larga qarab o'zgaradi (aniq formula hujjatlarda berilmagan).

Bu hujjatlardan kelib chiqadigan xulosa: hujjatlar M soni cheklanmaganini va bloklangan thread'lar GOMAXPROCS'ga kirmasligini aytadi, aniq formulani yoki M yaratish algoritmini esa HACKING.md bermaydi. Algoritm tafsilotlari (qachon thread yaratiladi, qachon uxlatiladi) runtime manba kodidagi izohlarda bor va versiyalar o'rtasida o'zgaradi; ularga biz tayanmaymiz. Darsdagi tajribalar esa bu xulosani o'lchov bilan tasdiqlaydi.

Muhim amaliy oqibat: M soniga yuqori chegara kafolatlanmagan, shuning uchun bloklovchi system call'larni (sekin disk, `syscall` orqali to'g'ridan-to'g'ri chaqiruvlar, cgo) cheklanmagan parallellik bilan chaqirish thread'lar sonini oshiradi. Tarmoq I/O'si boshqa yo'l bilan ishlaydi (netpoller, 52-dars), shuning uchun minglab tarmoq ulanishi thread'lar sonini oshirmaydi.

## Misol: P, G va M ni o'lchash

Birinchi dastur uchta holatni solishtiradi: boshlang'ich holat, 40 ta bloklovchi system call (`Nanosleep`) va 5000 ta channel'da kutayotgan goroutine. P va goroutine sonini `runtime/metrics` dan, yaratilgan thread'lar sonini `threadcreate` profilidan olamiz.

```go
package main

import (
	"fmt"
	"runtime"
	"runtime/metrics"
	"runtime/pprof"
	"sync"
	"syscall"
	"time"
)

func sample() (gomaxprocs, goroutines uint64) {
	s := []metrics.Sample{
		{Name: "/sched/gomaxprocs:threads"},
		{Name: "/sched/goroutines:goroutines"},
	}
	metrics.Read(s)
	return s[0].Value.Uint64(), s[1].Value.Uint64()
}

func threads() int {
	return pprof.Lookup("threadcreate").Count()
}

func main() {
	runtime.GOMAXPROCS(2)
	p, g := sample()
	fmt.Printf("boshlanish: P=%d goroutine=%d thread(M)=%d\n", p, g, threads())

	var wg sync.WaitGroup
	for i := 0; i < 40; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			ts := syscall.Timespec{Nsec: 300_000_000}
			// bloklovchi system call: goroutine ham, M ham band
			syscall.Nanosleep(&ts, nil)
		}()
	}
	time.Sleep(100 * time.Millisecond)
	p, g = sample()
	fmt.Printf("syscall paytida: P=%d goroutine=%d thread(M)=%d\n", p, g, threads())
	wg.Wait()

	// tarmoqsiz, channel bilan bloklangan goroutine'lar: M kerak emas
	block := make(chan struct{})
	before := threads()
	for i := 0; i < 5000; i++ {
		go func() { <-block }()
	}
	time.Sleep(100 * time.Millisecond)
	p, g = sample()
	fmt.Printf("channel'da: P=%d goroutine=%d thread(M) ortdi=%d\n", p, g, threads()-before)
	close(block)
}
```

Go 1.24.7, linux/amd64, 2 vCPU mashinada (GOMAXPROCS aniq 2 ga qo'yilgan) ikki marta ishga tushirganda chiqish bir xil bo'ldi:

```text
boshlanish: P=2 goroutine=1 thread(M)=4
syscall paytida: P=2 goroutine=41 thread(M)=43
channel'da: P=2 goroutine=5001 thread(M) ortdi=0
```

Natijani o'qing. P hamma vaqt 2. Qirqta goroutine system call'da turganda thread yozuvlari 4 dan 43 ga chiqdi, ya'ni deyarli har bloklangan goroutine o'zining thread'ini ushlab turibdi (4 + 40 emas, 43: bir ayirmaning sababini o'lchamadik va hujjatlar bunday aniq sonni kafolatlamaydi). Besh ming goroutine channel'da kutganda esa yangi thread yaratilmadi. Bu yuqoridagi `gopark` tavsifining o'lchovdagi ifodasi.

Ikkinchi dastur goroutine'larni turli holatlarda to'xtatib, `runtime.Stack` dump'idagi sarlavhalarni chiqaradi:

```go
package main

import (
	"fmt"
	"runtime"
	"strings"
	"sync"
	"syscall"
	"time"
)

func main() {
	var mu sync.Mutex
	mu.Lock()
	ch := make(chan int)

	go func() { <-ch }()                                                 // chan receive
	go func() { mu.Lock() }()                                            // sync.Mutex.Lock
	go func() { time.Sleep(time.Hour) }()                                // sleep
	go func() { syscall.Nanosleep(&syscall.Timespec{Sec: 3600}, nil) }() // syscall
	go func() { select {} }()                                            // select (no cases)

	time.Sleep(200 * time.Millisecond)
	buf := make([]byte, 1<<16)
	buf = buf[:runtime.Stack(buf, true)]
	for _, line := range strings.Split(string(buf), "\n") {
		if strings.HasPrefix(line, "goroutine ") {
			fmt.Println(line)
		}
	}
}
```

```text
goroutine 1 [running]:
goroutine 18 [chan receive]:
goroutine 19 [sync.Mutex.Lock]:
goroutine 20 [sleep]:
goroutine 21 [syscall]:
goroutine 22 [select (no cases)]:
```

Goroutine raqamlari (18-22) shu ishga tushirishdan olingan va Go versiyasi hamda dasturga qarab boshqacha bo'lishi mumkin. Holat nomlari ham runtime tomonidan belgilanadi va o'zgarishi mumkin; hujjatlar ularni kafolatlamaydi. Lekin tuzilma barqaror: raqam, qavs ichida holat, ba'zan vergul bilan qo'shimcha ma'lumot (bloklanish muddati yoki `locked to thread`). Mashqda shu tuzilmani tahlil qilasiz.

Holatlardan amaliy xulosa:

- `[chan receive]`, `[select]`, `[sleep]`, `[sync.Mutex.Lock]`: goroutine park qilingan, M kerak emas. Shu holatda minglab goroutine turishi normal.
- `[syscall]`: M ham band. Ko'p `[syscall]` thread'lar soni o'sishini anglatadi.
- `[IO wait]`: tarmoq kutilmoqda, netpoller boshqaradi, M band emas (52-dars).
- Bir xil stack'dagi minglab goroutine bitta joyda to'planib qolgan bo'lsa, bu leak belgisi (41-dars).

## Qachon qo'llamaslik kerak

- Ichki nomlarga (`g`, `m`, `p`, `gopark`, scheduler konstantalari) kod yozmang va ularni "o'zgarmas" deb hisoblamang. HACKING.md o'zi "living document" deb ataydi va ba'zan eskirgan bo'lishi mumkinligini ogohlantiradi. Ilova kodi faqat ommaviy API (`runtime`, `runtime/metrics`, `runtime/pprof`) orqali ishlashi kerak.
- Goroutine ID'ga tayanadigan trik (stack dump'ni parse qilib ID olish) yozmang. Go FAQ ID yo'qligini ongli qaror deb tushuntiradi. Per-request holat uchun `context` yoki aniq argument ishlating.
- `runtime.NumGoroutine()` ni "ishlayotgan goroutine'lar soni" deb o'qimang: u tirik goroutine'lar sonini beradi, ularning ko'pchiligi park qilingan bo'lishi mumkin. Holatni ko'rish uchun dump yoki `runtime/metrics` ishlating.
- GOMAXPROCS'ni "yaxshiroq bo'lsin" deb qo'lda ko'tarmang. U P sonini belgilaydi, ya'ni parallellikni; CPU yadrolaringizdan ko'p qiymat qo'yish ko'proq ishlashni emas, ko'proq kontekst almashinuvini beradi (konteynerlarda qiymat nima bo'lishi 53-darsda).
- Bloklovchi system call'larni cheklovsiz parallel chaqirmang: har biri thread ushlab turadi. Cheklash uchun semaphore yoki worker pool ishlating (49-dars).

## Stack'da: Node.js/TypeScript bilan farq

- Node.js: JavaScript uchun bitta event loop thread'i; parallellik uchun worker_threads yoki alohida process kerak. Go: bitta process ichida GOMAXPROCS ta parallel bajaruvchi, goroutine'lar ular orasida avtomatik taqsimlanadi.
- Node.js'da `await` bloklanmaydigan kutish. Go'da kutish sintaktik jihatdan oddiy bloklash (`<-ch`, `conn.Read`), lekin runtime uni park qilib, thread'ni boshqa ishga beradi. Kod "sinxron" ko'rinadi, ishlash modeli esa asinxron.
- Production'da kuzatuv: `/sched/goroutines:goroutines` va `/sched/gomaxprocs:threads` metrikalarini monitoringga chiqaring (60-dars), goroutine soni vaqt bo'yicha o'sib borsa 41-darsdagi leak tahlilini boshlang.
- Servis kodida `go f()` ni arzon deb ko'p ishlating, lekin har goroutine'ning tugash sharti (context, channel yopilishi) oldindan ma'lum bo'lsin. Arzon yaratish, uni tugatish masalasini bekor qilmaydi.

## Xulosa

- G - goroutine, M - OS thread, P - Go kodini bajarish resurslari. P'lar aynan GOMAXPROCS ta, G va M soni cheklanmagan.
- M foydalanuvchi kodini faqat P bilan bajaradi. System call'ga kirgan M P'sini qaytaradi, shuning uchun bloklovchi system call'lar M sonini oshiradi, GOMAXPROCS'ni emas.
- Channel, mutex, select, sleep'da bloklangan goroutine park qilinadi va thread band qilmaydi: 5000 ta shunday goroutine o'lchovda yangi thread yaratmadi.
- Goroutine stack'i kichik boshlanib o'sadi; M'ning system (g0) stack'i o'smaydi va runtime kodi uchun.
- Dump'dagi holat so'zi ([syscall], [chan receive], [IO wait]) goroutine qaysi resursni ushlab turganini ko'rsatadi: uni sanash tahlil boshlanishi uchun eng arzon qadam.
