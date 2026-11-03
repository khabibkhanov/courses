---
n: 63
slug: heap-block-mutex-profil
title: "Heap, allocs, block va mutex profillari"
summary: "Xotira va kutish profillari: heap va allocs farqi (inuse va alloc ko'rsatkichlari), MemProfileRate, block va mutex profillarini yoqish, ularni o'qish, delta profil va production'da xavfsiz foydalanish."
duration: 40
sources:
  - id: diagnostics
    note: "Profiling bo'limi: heap, goroutine, block va mutex profillarining ta'rifi; block va mutex profillari standart holatda o'chiq ekani"
  - id: pkg-runtime
    note: "MemProfileRate, SetBlockProfileRate va SetMutexProfileFraction hujjatlari"
  - id: blog-pprof
    note: "Profiling Go Programs: heap profilni olish va tahlil qilish yondashuvi"
  - id: pkg-http-pprof
    note: "Parametrlar bo'limi: seconds=N allocs, block, goroutine, heap, mutex va threadcreate uchun delta profil beradi; gc va debug parametrlari"
  - id: go125
    note: "runtime/pprof bo'limi: runtime ichki lock'lar uchun mutex profilidagi tuzatish"
  - id: go127
    note: "Goroutine leak profile bo'limi: goroutineleak profili umumiy foydalanishga ochilgan, /debug/pprof/goroutineleak endpoint'i"
quiz:
  - q: "Servis xotirasi sekin o'sib bormoqda (leak shubhasi). Heap profilida qaysi ko'rsatkichga qaraysiz?"
    options:
      - "alloc_space: jami ajratilgan xotira, chunki leak ko'p allocation degani"
      - "alloc_objects: ajratilgan obyektlar soni"
      - "inuse_space (va inuse_objects): hozir tirik obyektlar egallagan xotira"
      - "Faqat goroutine profili"
    answer: 2
    explain: "Leak - tirik qolib ketgan obyektlar, shuning uchun inuse_* kerak. alloc_* ko'rsatkichlari dastur boshidan beri jami ajratilganni sanaydi, GC bo'shatgan obyektlarni ham. alloc_* esa GC bosimi va allocation tezligini tahlil qilish uchun, ya'ni CPU/GC xarajati uchun foydali."
  - q: "`pprof.Lookup(\"mutex\").Count() == 0`, holbuki kod lock uchun kuchli bahs ko'rsatyapti. Birinchi tekshiriladigan narsa?"
    options:
      - "GOMAXPROCS 1 ga teng emasligini"
      - "runtime.SetMutexProfileFraction chaqirilganini: mutex profili standart holatda o'chiq"
      - "Dasturda sync.RWMutex ishlatilganini"
      - "Heap profil yoqilganini"
    answer: 1
    explain: "Diagnostics hujjati mutex va block profillari standart holatda yoqilmaganini aytadi. Mutex uchun SetMutexProfileFraction, block uchun SetBlockProfileRate chaqiriladi. Sozlamasiz profil bo'sh qaytadi, bu bahs yo'qligini isbotlamaydi."
  - q: "Mutex profilida `sync.(*Mutex).Unlock` yuqorida turibdi. Bu nimani bildiradi?"
    options:
      - "Unlock sekin ishlaydi va uni optimallashtirish kerak"
      - "Lock'ni kutgan goroutine'lar yo'qotgan vaqt Unlock stack'iga, ya'ni lock'ni ushlab turgan kod bo'limiga nisbat beriladi; chaqiruvchi funksiya (main.(*counter).Inc) kritik bo'limni topishga yordam beradi"
      - "Unlock chaqirilmagan lock bor (deadlock)"
      - "Goroutine'lar Unlock'ni kutmoqda"
    answer: 1
    explain: "Mutex profili 'kim lock'ni ushlab turib boshqalarni kuttirdi' savoliga javob beradi: kechikish lock'ni bo'shatgan nuqtaga yoziladi. Shuning uchun Unlock'ning o'zi emas, uni chaqirgan funksiya va kritik bo'lim ichidagi ish muhim. Block profili esa kutuvchi tomonni (Lock, chanrecv) ko'rsatadi."
  - q: "Mutex profilida jami 8.47s delay ko'rsatilgan, lock uchun kurashgan sakkizta goroutine esa bor-yo'g'i 1.22s ishlagan. Bu xatomi?"
    options:
      - "Ha, profil buzilgan, qayta oling"
      - "Ha, SetBlockProfileRate noto'g'ri qiymatda"
      - "Yo'q, delay barcha goroutine'larning kutish vaqtini qo'shadi: yetti goroutine har biri deyarli butun davr kutsa, jami wall time'dan ancha katta bo'ladi"
      - "Yo'q, bu faqat time.Sleep ta'siri"
    answer: 2
    explain: "Block va mutex profillaridagi delay goroutine-sekundlarda yig'iladi, shuning uchun wall-clock vaqtdan oshishi normal. Sakkizta goroutine bitta lock uchun kurashsa, yettitasi doim kutadi: 7 x 1.22s = 8.54s, o'lchangan 8.47s ga yaqin. Qiymatlarni solishtirish uchun nisbat va stack muhim, mutlaq son emas."
  - q: "`runtime.MemProfileRate` standart qiymati bilan heap profilda 1 KiB'lik bitta obyektning ajratilishi har doim ko'rinadimi?"
    options:
      - "Ha, har allocation yoziladi"
      - "Faqat GC dan keyin"
      - "Faqat bitta goroutine'dan ajratilgan bo'lsa"
      - "Yo'q: profil namuna oladi (standart o'rtacha har 512 KiB uchun bitta), shuning uchun kichik va kam allocation'lar yo'qolishi mumkin, qiymatlar esa baholanadi"
    answer: 3
    explain: "MemProfileRate standart 512*1024 bayt: profiler o'rtacha shuncha bayt ajratilganda bitta allocation'ni namuna qiladi. Katta umumiy hajm statistik jihatdan to'g'ri baholanadi, lekin noyob kichik allocation ko'rinmasligi mumkin. Aniq hisob uchun benchmark'dagi allocs/op (61-dars) ishlatiladi."
  - q: "Production servisida `/debug/pprof/heap?seconds=30` so'rovi nima qaytaradi?"
    options:
      - "Servisni 30 soniyaga to'xtatadi"
      - "30 soniyadan keyin GC ni majburan ishga tushiradi"
      - "Heap profilning delta varianti: 30 soniya ichidagi o'zgarish"
      - "30 soniya yig'ilgan CPU profili"
    answer: 2
    explain: "net/http/pprof hujjatiga ko'ra seconds=N parametri allocs, block, goroutine, heap, mutex va threadcreate profillari uchun delta profil qaytaradi. CPU profil va trace uchun seconds davomiylikni bildiradi. Delta profil leak'ni 'o'sayotgan' stack'lar bo'yicha topishda qulay."
task:
  title: "Mutex va block profillarini yoqish"
  prompt: |
    Servis lock bahsini tekshirmoqchi, lekin `pprof.Lookup("mutex")` va `pprof.Lookup("block")` bo'sh qaytadi: starter'ni ishga tushirsangiz ikkala qator ham `false` chiqaradi.

    `enableProfiling` funksiyasini yozing: u mutex profilini har bir bahs hodisasi uchun (fraction 1) va block profilini har bir kutish uchun (rate 1) yoqsin. Qaytarilgan `restore` funksiyasi mutex fraction'ni avvalgi qiymatga, block rate'ni esa 0 ga qaytarsin (testlar va CI'da profilni qoldirib ketmaslik uchun). `contend` va `main` o'zgarmasin. Kutilgan natija: ikkala qator `true`.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "runtime/pprof"
        "sync"
        "time"
    )

    // enableProfiling mutex va block profillarini yoqadi.
    // Qaytargan funksiya sozlamalarni avvalgi holatga qaytaradi.
    func enableProfiling() (restore func()) {
        return func() {}
    }

    func contend() {
        var mu sync.Mutex
        var wg sync.WaitGroup
        for g := 0; g < 4; g++ {
            wg.Add(1)
            go func() {
                defer wg.Done()
                for i := 0; i < 20; i++ {
                    mu.Lock()
                    time.Sleep(time.Millisecond)
                    mu.Unlock()
                }
            }()
        }
        wg.Wait()
    }

    func main() {
        restore := enableProfiling()
        contend()
        fmt.Println("mutex profil yozuvlari > 0:", pprof.Lookup("mutex").Count() > 0)
        fmt.Println("block profil yozuvlari > 0:", pprof.Lookup("block").Count() > 0)
        restore()
    }
  solution: |
    package main

    import (
        "fmt"
        "runtime"
        "runtime/pprof"
        "sync"
        "time"
    )

    // enableProfiling mutex va block profillarini yoqadi.
    // Qaytargan funksiya sozlamalarni avvalgi holatga qaytaradi.
    func enableProfiling() (restore func()) {
        prevMutex := runtime.SetMutexProfileFraction(1)
        runtime.SetBlockProfileRate(1)
        return func() {
            runtime.SetMutexProfileFraction(prevMutex)
            runtime.SetBlockProfileRate(0)
        }
    }

    func contend() {
        var mu sync.Mutex
        var wg sync.WaitGroup
        for g := 0; g < 4; g++ {
            wg.Add(1)
            go func() {
                defer wg.Done()
                for i := 0; i < 20; i++ {
                    mu.Lock()
                    time.Sleep(time.Millisecond)
                    mu.Unlock()
                }
            }()
        }
        wg.Wait()
    }

    func main() {
        restore := enableProfiling()
        contend()
        fmt.Println("mutex profil yozuvlari > 0:", pprof.Lookup("mutex").Count() > 0)
        fmt.Println("block profil yozuvlari > 0:", pprof.Lookup("block").Count() > 0)
        restore()
    }
  solutionNotes: |
    - `runtime.SetMutexProfileFraction(1)` avvalgi qiymatni qaytaradi; uni saqlab, `restore` ichida qaytaramiz. Fraction 1 har bir hodisani yozadi, production'da odatda kattaroq qiymat (masalan 100) ishlatiladi.
    - Block profili uchun avvalgi qiymatni olib bo'lmaydi (getter yo'q), shuning uchun `restore` uni 0 (o'chirish) ga o'rnatadi.
    - `rate = 1` har bir blocking hodisani yozadi. Bu overhead qo'shadi, shuning uchun uzoq muddat yoqib qo'ymang.
    - Profil `pprof.Lookup("mutex").Count()` bilan tekshiriladi; haqiqiy servisda bu ma'lumotni `/debug/pprof/mutex` endpoint'idan olasiz.
  checklist:
    - "Mutex profili `SetMutexProfileFraction` bilan yoqilgan"
    - "Block profili `SetBlockProfileRate` bilan yoqilgan"
    - "`restore` mutex fraction'ni avvalgi qiymatga qaytaradi"
    - "Ikkala chiqish qatori `true`"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Servis soatlar o'tishi bilan xotirani ko'proq egallaydi va bir kuni OOM bilan o'ladi. Boshqa servis CPU'ni deyarli ishlatmaydi, lekin p99 latency yuqori: goroutine'lar nimadir kutmoqda. CPU profil (62-dars) bu ikkala holatda ham javob bermaydi: birinchisida u xotira egasini, ikkinchisida kutish sababini ko'rsatmaydi.

Aynan shu ikki savol uchun runtime boshqa profillarni beradi. Heap va allocs profillari "kim xotira ajratdi va kim uni ushlab turibdi" savoliga javob beradi. Block va mutex profillari "goroutine nimani kutdi va kim uni kuttirdi" savoliga javob beradi. Node.js'da heap snapshot (DevTools) bilan leak qidirish tanish bo'lsa, Go'dagi heap profil uning yengil, stack'ga asoslangan varianti: u butun heap'ni emas, allocation joylarini namuna qiladi. Lock bahsi uchun Node.js'da analog deyarli yo'q, chunki bitta thread'da lock kam kerak bo'ladi; Go'da esa bu birinchi darajali diagnostika.

Bu dars to'rtta profilni ko'radi, ularni qanday yoqish, o'qish va ularning chegaralarini tushuntiradi.

## Asosiy g'oya

### Hujjatdagi ta'rif

Diagnostics hujjati profillarni shunday ta'riflaydi. **heap** - xotira ajratish namunalari; hozirgi va tarixiy xotira sarfini kuzatish hamda leak'ni tekshirish uchun. **goroutine** - hozirgi barcha goroutine'larning stack'lari. **block** - goroutine'lar sinxronizatsiya primitivlarini (timer kanallarini ham) kutib bloklangan joylar. **mutex** - lock bahslari; CPU to'liq ishlatilmayotgan bo'lsa va sabab mutex deb o'ylasangiz. Hujjat ikkita muhim eslatma qiladi: block va mutex profillari standart holatda yoqilmagan. Block uchun `runtime.SetBlockProfileRate`, mutex uchun `runtime.SetMutexProfileFraction` chaqirilishi kerak.

### Heap va allocs

Heap profil oxirgi tugagan GC paytidagi holatni aks ettiradi (bu `runtime/pprof` manba kodidagi hujjat izohida yozilgan). Shu sabab kod ichidan olinganda oldin `runtime.GC()` chaqiriladi, aks holda ma'lumot eskirgan bo'ladi.

Profil to'rtta ko'rsatkich beradi (pprof'da `-sample_index` bilan tanlanadi):

- `inuse_space` va `inuse_objects` - hozir tirik obyektlar hajmi va soni;
- `alloc_space` va `alloc_objects` - dastur boshidan beri jami ajratilgan hajm va son, GC bo'shatganlarini ham hisoblab.

`heap` profil standart bo'yicha `inuse_space` ni, `allocs` profil esa `alloc_space` ni ko'rsatadi; ma'lumot bir xil, faqat standart ko'rsatkich boshqa (lokal tajribada `Type: inuse_space` va `Type: alloc_space` sarlavhalari shuni tasdiqladi). Qoida: leak qidirsangiz `inuse_*`, allocation tezligi va GC bosimini qisqartirmoqchi bo'lsangiz `alloc_*`.

Profil namuna oladi. `runtime.MemProfileRate` standart qiymati 512 KiB: profiler o'rtacha har 512 KiB ajratilgan xotira uchun bitta allocation'ni yozadi. Dasturni boshida o'zgartirish mumkin (hujjat buni bir marta, `main` boshida qilishni tavsiya etadi), `1` har allocation'ni yozadi, lekin sezilarli sekinlashtiradi. Natija: katta hajmlar to'g'ri baholanadi, kichik va noyob allocation'lar ko'rinmasligi mumkin.

### Block va mutex

`runtime.SetBlockProfileRate(rate)`: profiler o'rtacha har `rate` nanosekund kutish uchun bitta blocking hodisani yozadi; `1` hamma hodisani yozadi, `0` yoki manfiy qiymat o'chiradi. `runtime.SetMutexProfileFraction(rate)`: o'rtacha `1/rate` hodisa yoziladi, `0` o'chiradi, manfiy qiymat faqat joriy qiymatni qaytaradi. Funksiya oldingi qiymatni qaytaradi, shuning uchun uni tiklash oson.

Ikkala profil "delay" turida: kutilgan vaqt yig'indisi va hodisalar soni. Farq nima kuttiradi va kimga nisbat beriladi:

- **block** kutayotgan tomonni ko'rsatadi: `sync.(*Mutex).Lock`, `chanrecv`, `sync.(*WaitGroup).Wait`, `select`. U bahsning ham, oddiy kutishning ham (masalan, kanaldan ma'lumot kutish) hammasini yig'adi.
- **mutex** faqat lock bahsini ko'rsatadi va kechikishni lock'ni ushlab turgan tomonga, ya'ni `Unlock` stack'iga nisbat beradi. Shuning uchun "bahsni kim yaratdi" savoli uchun mutex profili aniqroq.

## Chuqurroq: profilni o'qish va delta

### Delta profil

`net/http/pprof` hujjatiga ko'ra `seconds=N` parametri `allocs`, `block`, `goroutine`, `heap`, `mutex` va `threadcreate` profillari uchun delta profil qaytaradi: N soniya oldin va hozirgi holat orasidagi farq. Leak qidirishda bu juda foydali: mutlaq `inuse_space` hamma narsani (kesh, buferlar, bir martalik yuklashlar) ko'rsatadi, delta esa o'sayotgan stack'larni. `gc=N` parametri (heap uchun) profildan oldin GC ishga tushiradi. `debug=1` tushunarli matn formatini beradi.

Profillarni ikkita faylga yozib, `go tool pprof -base eski yangi` bilan ham ayirish mumkin (62-dars).

### Block profili hajmi

Block va mutex "delay" qiymatlari goroutine-sekundlarda yig'iladi. Sakkizta goroutine bitta lock uchun kurashsa, yettitasi doim kutadi; delay wall-clock vaqtdan bir necha baravar katta bo'lishi normal. Mutlaq songa emas, stack'lar nisbatiga qarang.

### Yangi profillar

Go 1.25 release notes mutex profilidagi tuzatishni qayd etadi: runtime ichki lock'lar bahsi endi kritik bo'limning oxirini ko'rsatadi, bu `sync.Mutex` xatti-harakatiga mos. Go 1.26 da goroutine leak profili (`goroutineleak`) eksperiment sifatida paydo bo'ldi, Go 1.27 release notes'ga ko'ra u endi umumiy foydalanishga ochiq: `runtime/pprof`da va `/debug/pprof/goroutineleak` endpoint'ida. Leak qilgan goroutine - concurrency primitive'da (kanal, `sync.Mutex`, `sync.Cond`) bloklangan va hech qachon uyg'onmaydigan goroutine; runtime buni GC yordamida aniqlaydi. Bu qism lokal kompilyatsiya qilinmagan (sandbox Go 1.24.7), shuning uchun kod namunasi yo'q: goroutine leak'ning o'zi 41-darsda alohida ko'riladi, bu yerda esa faqat eski `goroutine` profili va uning o'sishini kuzatish usuli yetarli.

## Misol: kesh, lock va kanal

Bitta dastur uchta narsani qiladi: keshga 20 000 ta yozuv yig'adi va ko'p vaqtinchalik axlat yaratadi; sakkizta goroutine bitta `sync.Mutex` uchun kurashadi (44-dars; lock ichida `time.Sleep(50 * time.Microsecond)`); bir goroutine kanal orqali sekin ma'lumot beradi. Boshida `runtime.SetMutexProfileFraction(1)` va `runtime.SetBlockProfileRate(1)`, oxirida `runtime.GC()` va to'rtta profil `pprof.Lookup(name).WriteTo(f, 0)` bilan yoziladi:

```go
func (c *counter) Inc() {
	c.mu.Lock()
	time.Sleep(50 * time.Microsecond) // lock ichida sekin ish
	c.n++
	c.mu.Unlock()
}
```

Go 1.24.7, linux/amd64, 2 vCPU (shared VM). Heap profilni `inuse_space` bo'yicha o'qiymiz (`go tool pprof -sample_index=inuse_space -top`):

```text
      flat  flat%   sum%        cum   cum%
23071.06kB 97.83% 97.83% 23071.06kB 97.83%  main.load
  512.05kB  2.17%   100%   512.05kB  2.17%  runtime.(*scavengerState).init
```

`alloc_space` bo'yicha esa:

```text
      flat  flat%   sum%        cum   cum%
  104.36MB 99.52% 99.52%   104.36MB 99.52%  main.load
```

Farq ko'rinib turibdi: tirik qolgani 23 MB (keshdagi yozuvlar), jami ajratilgani 104 MB (qolgani 4 KiB'lik vaqtinchalik bufer). Birinchi raqam leak/xotira hajmi haqida, ikkinchisi GC ishi haqida gapiradi. Ikkala holatda ham javobgar `main.load`. Qiymatlar namuna asosida baholangan, shuning uchun `inuse_objects` uchun 22 578 kabi sonlar aniq 20 000 yozuvga teng emas.

Mutex profili (`Type: delay`):

```text
      flat  flat%   sum%        cum   cum%
     8.47s   100%   100%      8.47s   100%  sync.(*Mutex).Unlock (inline)
         0     0%   100%      8.47s   100%  main.(*counter).Inc
         0     0%   100%      8.47s   100%  main.contend.func1
```

Dastur bahsli qismi 1.22 s ishlagan. Delay 8.47 s, chunki 7 ta goroutine doim kutadi (7 x 1.22 s = 8.54 s). Stack `main.(*counter).Inc` ni ko'rsatadi, ya'ni lock ichidagi `time.Sleep` bahs manbai. Block profili `sync.(*Mutex).Lock` ni ko'rsatadi (kutayotgan tomon), shuningdek `sync.(*WaitGroup).Wait` va `runtime.chanrecv2` kabi oddiy kutishlarni ham: ular xato emas, shunchaki block profilning tabiati.

Tuzatish: sekin ishni lock'dan tashqariga chiqarish, kritik bo'limda faqat `c.n++` qoldirish:

```go
func (c *counter) Inc() {
	time.Sleep(50 * time.Microsecond) // sekin ish lock'dan tashqarida
	c.mu.Lock()
	c.n++
	c.mu.Unlock()
}
```

Natija (bir ishga tushirish): bahsli qism 1.22 s dan 130 ms ga tushdi, mutex delay 8.47 s dan 1.97 ms ga. Shared VM'da bu bitta o'lchov, lekin farq shovqin darajasidan ancha katta. Real kodda `time.Sleep` o'rnida tarmoq chaqiruvi, disk yoki og'ir hisob bo'ladi, qoida o'sha: lock ichida faqat umumiy holatga tegadigan eng qisqa ish.

Topshiriqda xuddi shu sozlamalarni yoqish va tiklash funksiyasini yozasiz.

## Qachon qo'llamaslik kerak

- Heap profil bilan "har allocation"ni topmoqchi bo'lmang: namuna olish tufayli noyob kichik allocation ko'rinmaydi. Aniq soni uchun benchmark `allocs/op` (61-dars) va `-gcflags=-m` kerak (65-dars).
- Block profilini doim `rate=1` bilan yoqib qoldirmang. Hamma hodisani yozish overhead qo'shadi; production'da kattaroq `rate` (nanosekund) yoki qisqa vaqt oynasi ishlating. Diagnostics hujjati ham profil xarajatini oldindan o'lchashni tavsiya qiladi.
- Mutex profili ko'p delay ko'rsatsa ham, har lock yomon degani emas. Avval bu lock p99 ga ta'sir qilishini tekshiring, aks holda kerakmas murakkablik (sharding, lock-free) qo'shasiz.
- Block profili oddiy kutishlarni ham yig'adi (`WaitGroup.Wait`, `chanrecv`). Ularni muammo deb talqin qilmang; faqat latency'ga to'g'ri keladigan stack'larga qarang.
- Heap profil leak'ni "goroutine" tarzida ko'rsatmaydi. Goroutine leak'ni goroutine profili va soni bo'yicha qidiring; heap faqat xotira egasini topadi.
- Heap profilning o'zi GC bilan bog'liq: profil oxirgi tugagan GC holatini ko'rsatadi, real vaqtni emas.

## Stack'da: Node.js/TypeScript bilan solishtirish

Node.js'da leak odatda heap snapshot'ni ikki marta olib, farqlash bilan qidiriladi. Snapshot butun heap'ni muzlatadi va katta; Go heap profili esa kichik (stack'lar bo'yicha agregat) va jonli servisdan HTTP orqali olinadi. Delta profil (`seconds=N`) snapshot diff'ning tayyor ko'rinishi. Lock bahsi Node.js'da asosan I/O pool yoki worker thread'larda uchraydi, Go'da esa har bir umumiy holat (kesh, counter, map) lock talab qiladi, shuning uchun mutex profili tez-tez kerak bo'ladi.

Amaliy tavsiyalar:

- Admin portda `/debug/pprof/heap`, `/debug/pprof/mutex`, `/debug/pprof/block` ochiq bo'lsin (62-dars), lekin mutex va block uchun sozlamalarni servis ishga tushganda kichik qiymat bilan yoqing (masalan, mutex fraction 100) yoki alert paytida vaqtincha yoqing.
- Leak shubhasida: ikki marta `heap?seconds=300` delta oling va `inuse_space` bo'yicha o'sayotgan stack'ni toping.
- Kesh va buferlar hajmini `runtime/metrics` bilan kuzating (60-dars); profil sababni, metrika esa o'sish faktini beradi.
- Lock bahsini topgach, avval kritik bo'limni qisqartiring; sharding yoki `sync.Map` ni oxirgi chora sifatida qoldiring.

## Xulosa

- Heap va allocs - bir xil ma'lumot: heap standart bo'yicha `inuse_*`, allocs `alloc_*` ni ko'rsatadi. Leak uchun `inuse`, GC bosimi uchun `alloc`.
- Heap profil namuna oladi (`MemProfileRate` standart 512 KiB) va oxirgi tugagan GC holatini ko'rsatadi; kodda olishdan oldin `runtime.GC()` chaqiring.
- Block va mutex profillari standart holatda o'chiq: `SetBlockProfileRate` va `SetMutexProfileFraction` bilan yoqiladi.
- Mutex profili bahsni lock'ni ushlab turgan kodga nisbat beradi; block profili kutayotgan tomonni ko'rsatadi. Delay goroutine-sekundlarda yig'iladi.
- Delta profil (`seconds=N`) leak'ni o'sayotgan stack'lar bo'yicha topishning eng qulay yo'li.
