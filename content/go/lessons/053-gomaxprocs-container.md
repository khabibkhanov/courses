---
n: 53
slug: gomaxprocs-container
title: "GOMAXPROCS va konteynerlar"
summary: "GOMAXPROCS aniq nimani cheklaydi, Go 1.25 gacha konteynerda nega noto'g'ri qiymat olardi, Go 1.25 dagi container-aware default qanday hisoblanadi, go.mod'dagi go versiyasi buni qanday o'chirib qo'yadi va cgroup CPU throttling'ni qanday o'lchash mumkin."
duration: 40
sources:
  - id: go125
    note: "Runtime bo'limi, Container-aware GOMAXPROCS: ikki o'zgarish, CPU limit va CPU requests farqi, o'chirish yo'llari"
  - id: pkg-runtime
    note: "GOMAXPROCS funksiyasi hujjati: Default, Updates, Compatibility, Implementation details bo'limlari; SetDefaultGOMAXPROCS"
  - id: diagnostics
    note: "Runtime statistics va GODEBUG bo'limlari: runtime ko'rsatkichlarini kuzatish"
  - id: gc-guide
    note: "Latency bo'limi: mark fazasida GC CPU resurslarining 25% ini oladi"
quiz:
  - q: "Host'da 8 mantiqiy CPU, konteynerning cgroup CPU limiti 2.5 (`cpu.max` = `250000 100000`). Go 1.25 toolchain, go.mod'da `go 1.25`, GOMAXPROCS muhit o'zgaruvchisi yo'q. Release notes va runtime hujjatiga ko'ra default GOMAXPROCS nima?"
    options:
      - "8, chunki Go cgroup'ni ko'rmaydi"
      - "2, chunki kasr qismi tashlab yuboriladi"
      - "3, chunki limit butun son bo'lmasa yuqoriga yaxlitlanadi"
      - "2.5, chunki GOMAXPROCS kasr son qabul qiladi"
    answer: 2
    explain: "Hujjat: CPU throughput limiti butun bo'lmasa, runtime uni keyingi butun songa yaxlitlaydi. Limit 2.5 -> 3, bu 8 dan kichik. GOMAXPROCS esa doim butun son."
  - q: "Xuddi shu konteyner va Go 1.25 toolchain, lekin go.mod'da `go 1.24` yozilgan. Default GOMAXPROCS?"
    options:
      - "8: language version 1.24 va undan eskilar uchun containermaxprocs=0 default, ya'ni cgroup limiti hisobga olinmaydi"
      - "3: toolchain versiyasi hal qiladi, go.mod emas"
      - "2: eski go qatori minimal qiymatni beradi"
      - "Dastur kompilyatsiya bo'lmaydi"
    answer: 0
    explain: "runtime hujjati: containermaxprocs=0 va updatemaxprocs=0 language version 1.24 va undan eskilar uchun default. Toolchain'ni yangilab go.mod'dagi go qatorini ko'tarmasangiz, yangi xatti-harakat yoqilmaydi (1-darsdagi GODEBUG qoidasi)."
  - q: "Kubernetes manifestida pod uchun faqat CPU requests berilgan (limit yo'q), cgroup CPU bandwidth limiti o'rnatilmagan. Go 1.25 default GOMAXPROCS'ni qanday tanlaydi?"
    options:
      - "Requests qiymatiga qarab"
      - "Har doim 2"
      - "Har doim 1"
      - "Mantiqiy CPU'lar va CPU affinity bo'yicha; release notes: runtime 'CPU requests' variantini hisobga olmaydi"
    answer: 3
    explain: "Go 1.25 release notes: cgroup CPU bandwidth limiti 'CPU limit'ga mos keladi, 'CPU requests' esa hisobga olinmaydi. Limit bo'lmasa, default mantiqiy CPU soni va affinity mask'dan keladi."
  - q: "Konteyner limiti 1 CPU, host'da 16 mantiqiy CPU, Go 1.25 va yangi go.mod. Runtime hujjati bo'yicha default GOMAXPROCS?"
    options:
      - "1"
      - "2: runtime mantiqiy CPU soni 2 dan kam bo'lmasa, GOMAXPROCS'ni 2 dan kam qilmaydi"
      - "16"
      - "0, ya'ni parallellik o'chiriladi"
    answer: 1
    explain: "Hujjat: odatda minimum olinadi, lekin mantiqiy CPU soni yoki affinity mask 2 dan kam bo'lmasa, GOMAXPROCS 2 dan kam qilinmaydi. Shu sabab 1 CPU limitli konteynerda ham 2 chiqadi va throttling to'liq yo'qolmasligi mumkin."
  - q: "Sandbox tajribasi: 1 CPU quota, 2 vCPU, Go 1.24, ikkita CPU-bound goroutine. GOMAXPROCS=2 da 51 davrdan 46-50 tasida throttling bo'ldi, p99 ping 68 ms; GOMAXPROCS=1 da throttling deyarli yo'q, p99 38.7 ms; fon ishi ikkalasida ~395-410 ming blok. Bu nimani ko'rsatadi?"
    options:
      - "GOMAXPROCS=1 doim tezroq ishlaydi"
      - "Throttling faqat xotira bilan bog'liq"
      - "Quota'dan ko'p thread bir vaqtda ishlasa, quota davr boshida tugaydi va butun jarayon davr oxirigacha to'xtatiladi: jami ish deyarli o'zgarmaydi, lekin kechikish o'sadi"
      - "Go cgroup fayllarini o'qiy olmagani uchun dastur xato natija beradi"
    answer: 2
    explain: "Ikkala holatda ham jami ish quota bilan cheklangan (deyarli bir xil), lekin ko'p thread quota'ni tezroq sarflab, davrning qolgan qismida to'xtatiladi; shu to'xtashlar tail latency'ni oshiradi. 'Har doim tezroq' deyish noto'g'ri: bu faqat shu sharoitdagi o'lchov."
  - q: "Go 1.25 da servis kodi ishga tushganda `runtime.GOMAXPROCS(4)` chaqirdi. Konteyner limiti keyinroq oshirildi. Nima bo'ladi va qanday qaytariladi?"
    options:
      - "Runtime limitni kuzatib GOMAXPROCS'ni avtomatik oshiradi"
      - "Qo'lda chaqiruv avtomatik yangilanishni o'chiradi; default va yangilanishni `runtime.SetDefaultGOMAXPROCS()` qaytaradi"
      - "Dastur panic qiladi"
      - "GOMAXPROCS(4) e'tiborsiz qoldiriladi"
    answer: 1
    explain: "Release notes va runtime hujjati: muhit o'zgaruvchisi yoki runtime.GOMAXPROCS chaqiruvi avtomatik yangilanishni o'chiradi. SetDefaultGOMAXPROCS esa defaultni va avtomatik yangilanishni qayta yoqadi."
task:
  title: "cpu.max qatoridan GOMAXPROCS hisoblash"
  prompt: |
    Servis ishga tushganda cgroup v2 `cpu.max` faylidagi qatorni o'qib, mantiqiy CPU'lar soniga qarab GOMAXPROCS'ni log'ga yozmoqchi (diagnostika uchun, o'zi o'rnatmaydi). Qoida runtime hujjatidan: qiymat mantiqiy CPU soni va cgroup throughput limiti (quota / period) orasidagi minimum; limit butun bo'lmasa yuqoriga yaxlitlanadi; mantiqiy CPU'lar soni 2 va undan ko'p bo'lsa natija 2 dan kam bo'lmaydi; `max` yozilgan bo'lsa limit yo'q.

    Boshlang'ich kod butun bo'lishda kasr qismini tashlaydi, `max` qatorida 0 qaytaradi va minimum 2 qoidasini bilmaydi. `procsFromCPUMax` ni tuzating. Noto'g'ri formatdagi qator uchun mantiqiy CPU sonini qaytaring.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "strconv"
        "strings"
    )

    // procsFromCPUMax cgroup v2 `cpu.max` qatori ("<quota> <period>" yoki
    // "max <period>") va mantiqiy CPU'lar soni bo'yicha GOMAXPROCS qiymatini hisoblaydi.
    func procsFromCPUMax(cpuMax string, logical int) int {
        fields := strings.Fields(cpuMax)
        quota, _ := strconv.ParseInt(fields[0], 10, 64)
        period, _ := strconv.ParseInt(fields[1], 10, 64)
        limit := int(quota / period)
        if limit < logical {
            return limit
        }
        return logical
    }

    func main() {
        cases := []struct {
            cpuMax  string
            logical int
        }{
            {"max 100000", 8},
            {"100000 100000", 8},
            {"150000 100000", 8},
            {"250000 100000", 8},
            {"400000 100000", 2},
            {"50000 100000", 1},
            {"1600000 100000", 8},
        }
        for _, c := range cases {
            fmt.Printf("%-16s logical=%d -> %d\n", c.cpuMax, c.logical, procsFromCPUMax(c.cpuMax, c.logical))
        }
    }
  solution: |
    package main

    import (
        "fmt"
        "strconv"
        "strings"
    )

    // procsFromCPUMax cgroup v2 `cpu.max` qatori ("<quota> <period>" yoki
    // "max <period>") va mantiqiy CPU'lar soni bo'yicha GOMAXPROCS qiymatini hisoblaydi.
    func procsFromCPUMax(cpuMax string, logical int) int {
        fields := strings.Fields(cpuMax)
        if len(fields) != 2 || fields[0] == "max" {
            return logical // chegara yo'q yoki format noma'lum
        }
        quota, err1 := strconv.ParseInt(fields[0], 10, 64)
        period, err2 := strconv.ParseInt(fields[1], 10, 64)
        if err1 != nil || err2 != nil || quota <= 0 || period <= 0 {
            return logical
        }
        limit := int((quota + period - 1) / period) // butun bo'lmasa, yuqoriga yaxlitlanadi
        if limit < 2 && logical >= 2 {
            limit = 2 // 2 dan kam qilinmaydi, agar mantiqiy CPU'lar 2 va undan ko'p bo'lsa
        }
        if limit < logical {
            return limit
        }
        return logical
    }

    func main() {
        cases := []struct {
            cpuMax  string
            logical int
        }{
            {"max 100000", 8},
            {"100000 100000", 8},
            {"150000 100000", 8},
            {"250000 100000", 8},
            {"400000 100000", 2},
            {"50000 100000", 1},
            {"1600000 100000", 8},
        }
        for _, c := range cases {
            fmt.Printf("%-16s logical=%d -> %d\n", c.cpuMax, c.logical, procsFromCPUMax(c.cpuMax, c.logical))
        }
    }
  solutionNotes: |
    - `max` yoki noto'g'ri format: limit yo'q deb hisoblanadi va mantiqiy CPU soni qaytariladi; `ParseInt` xatolari e'tiborsiz qoldirilmaydi.
    - `(quota + period - 1) / period` butun sonlar uchun yuqoriga yaxlitlash: 150000/100000 -> 2, 250000/100000 -> 3.
    - Minimum 2 qoidasi faqat `logical >= 2` bo'lganda qo'llanadi: 1 CPU'li mashinada natija 1 bo'ladi.
    - Kutilgan chiqish: 8, 2, 2, 3, 2, 1, 8 (jadvaldagi tartibda).
    - Bu hisoblash runtime hujjatidagi qoidaning soddalashtirilgan nusxasi: affinity mask hisobga olinmagan va runtime davriy yangilaydi. Haqiqiy qiymatni `runtime.GOMAXPROCS(0)` yoki `/sched/gomaxprocs:threads` metrikasi beradi.
  checklist:
    - "`max 100000` va 8 CPU uchun 8 qaytadi"
    - "`100000 100000` va `150000 100000` ikkalasi uchun 2 qaytadi (minimum 2 va yuqoriga yaxlitlash)"
    - "`50000 100000` va 1 CPU uchun 1 qaytadi"
    - "Noto'g'ri qatorda panic bo'lmaydi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Servis lokal mashinada yaxshi ishlaydi: 8 yadro, 8 ta P, hammasi tekis. Keyin uni Kubernetes'ga joylashtirasiz: pod uchun CPU limiti 2, lekin tugunda 64 mantiqiy CPU. Go 1.24 va undan eski versiyalarda GOMAXPROCS default'i mantiqiy CPU soniga teng bo'ladi, ya'ni 64. Runtime 64 ta P bilan ishlaydi, konteyner esa kernel tomonidan 2 CPU'ga cheklangan. Natija: CPU grafigi "limitdan past" ko'rinadi, lekin p99 latency tartibsiz sakraydi. Sabab kernel'ning CPU throttling'i: quota davr boshida tugaydi va jarayon davr oxirigacha to'xtatiladi.

Node.js dasturchisi uchun bunday muammo kamdan-kam uchraydi, chunki JavaScript kodi bitta thread'da ishlaydi va konteyner limiti 1 yoki undan ko'p CPU bo'lsa, bitta thread uni oshira olmaydi. Go'da parallellik runtime ichida, va "nechta P" qarori runtime'ning o'zida. Go 1.25 gacha bu qarorni dasturchi/operator konteynerga moslashi kerak edi. Go 1.25 da runtime cgroup limitini o'zi hisobga oladi. Bu dars shu o'zgarish nima qiladi, nima qilmaydi va qaysi hollarda sizning kodingizga tegmaydi (go.mod'dagi `go` qatori tufayli) haqida.

Eslatma: Bu sandbox'da Go 1.24.7 o'rnatilgan, shuning uchun Go 1.25 xatti-harakati lokal sinab ko'rilmadi. Go 1.25 haqidagi barcha da'volar rasmiy release notes va `runtime` paketi hujjatiga tayanadi. Go 1.24 xatti-harakati va throttling mexanizmi esa o'lchandi, o'lchov sharoiti har misol ostida yozilgan.

## Asosiy g'oya

### GOMAXPROCS nimani cheklaydi

51-darsdan: GOMAXPROCS foydalanuvchi Go kodini bir vaqtda bajara oladigan thread'lar sonini, ya'ni P'lar sonini belgilaydi. System call'dagi thread'lar bu chegaraga kirmaydi. Shuning uchun GOMAXPROCS parallellik chegarasi, xotira yoki goroutine soni chegarasi emas.

### Go 1.25 gacha va undan keyin

Go 1.25 release notes default xatti-harakat o'zgarganini yozadi. Oldingi versiyalarda GOMAXPROCS mantiqiy CPU soniga (`runtime.NumCPU`) teng bo'lgan. Go 1.25 ikki o'zgarish kiritdi:

1. Linux'da runtime jarayon joylashgan cgroup'ning CPU bandwidth limitini hisobga oladi. Agar limit mantiqiy CPU'lar sonidan past bo'lsa, GOMAXPROCS shu past qiymatga teng bo'ladi. Kubernetes kabi tizimlarda cgroup CPU bandwidth limiti odatda "CPU limit" opsiyasiga mos keladi; "CPU requests" opsiyasi esa Go runtime tomonidan hisobga olinmaydi.
2. Barcha operatsion tizimlarda runtime mavjud mantiqiy CPU'lar soni yoki cgroup limiti o'zgarsa, GOMAXPROCS'ni davriy yangilaydi.

Ikkala xatti-harakat avtomatik o'chadi, agar GOMAXPROCS muhit o'zgaruvchisi bilan yoki `runtime.GOMAXPROCS` chaqiruvi bilan qo'lda qo'yilgan bo'lsa. Ularni alohida GODEBUG sozlamalari bilan ham o'chirish mumkin: `containermaxprocs=0` va `updatemaxprocs=0`. Yangilanishlarni o'qish uchun runtime jarayon umri davomida cgroup fayllarining keshlangan file descriptor'larini saqlaydi.

### Qiymat qanday hisoblanadi

`runtime.GOMAXPROCS` hujjati default tanlash qoidasini aniq beradi. Agar GOMAXPROCS muhit o'zgaruvchisi musbat butun son bo'lsa, default shu. Aks holda runtime uchta narsadan tanlaydi: mantiqiy CPU'lar soni, jarayonning CPU affinity mask'i va (Linux'da) cgroup CPU quota'siga asoslangan o'rtacha CPU throughput limiti.

Implementatsiya tafsilotlari bo'limida: cgroup v2 da quota va period `cpu.max` faylidan, cgroup v1 da `cpu.cfs_quota_us` va `cpu.cfs_period_us` fayllaridan olinadi; limit quota / period nisbati. Runtime odatda mantiqiy CPU soni, affinity mask soni va cgroup limiti orasidan eng kichigini tanlaydi, lekin mantiqiy CPU soni yoki affinity mask soni 2 dan kam bo'lmasa, GOMAXPROCS'ni hech qachon 2 dan kam qilmaydi. Limit butun bo'lmasa, yuqoriga yaxlitlanadi. Yangilanishlar sekundiga bir martagacha bajariladi, ilova ishsiz bo'lsa kamroq.

Hujjat o'zi ogohlantiradi: default xatti-harakat scheduler yaxshilangani sari o'zgarishi mumkin, ayniqsa implementatsiya tafsilotlari. Ya'ni "ikkidan kam bo'lmaydi" kabi qoidalarga ilova mantig'ini bog'lamang.

`runtime.SetDefaultGOMAXPROCS()` funksiyasi (runtime paketining joriy hujjatida bor; qaysi versiyada qo'shilgani bu darsda tekshirilmagan) GOMAXPROCS'ni runtime default'iga qaytaradi va GOMAXPROCS muhit o'zgaruvchisini e'tiborsiz qoldiradi. Hujjatga ko'ra uni avtomatik yangilanishni qayta yoqish uchun yoki o'zgarishni bilgan holda darhol yangilashni majburlash uchun ishlatish mumkin.

## Chuqurroq: go.mod, GODEBUG va throttling

### Nega yangilangan toolchain hech narsani o'zgartirmasligi mumkin

Runtime hujjatida bir muhim jumla bor: `containermaxprocs=0` va `updatemaxprocs=0` language version 1.24 va undan eskilari uchun default. Bu 1-darsdagi GODEBUG qoidasining aniq misoli: default'lar toolchain'dan, so'ng go.mod'dagi `go` qatoriga moslab olinadi. Go 1.25 toolchain'ida go.mod'da `go 1.24` bo'lsa, dastur eski xatti-harakatda qoladi: cgroup hisobga olinmaydi va davriy yangilash yo'q. Yangi default'ni yoqish uchun go.mod'da `go 1.25` yoki undan yuqori bo'lishi kerak (yoki go.mod/go.work'dagi `godebug` qatorlarida aniq `containermaxprocs=1`). Yangilash alohida pull request bo'lishi kerak, chunki P'lar soni o'zgarishi performance va GC xatti-harakatiga ta'sir qiladi.

Runtime bu qaysi dasturda ishlatilganini ko'rsatadi: `runtime/metrics` ro'yxatida `/godebug/non-default-behavior/containermaxprocs:events` va `/godebug/non-default-behavior/updatemaxprocs:events` hisoblagichlari bor. Ular default bo'lmagan qiymat tufayli eski yo'l necha marta bajarilganini sanaydi (60-dars).

### CPU throttling: nima uchun ko'p P zarar

cgroup CPU quota quyidagicha ishlaydi: har period (bu sandbox'da `cpu.cfs_period_us` = 100000 mikrosekund, ya'ni 100 ms) ichida guruhga quota qadar CPU vaqti beriladi. Quota 100000 bo'lsa, bu 100 ms CPU vaqti 100 ms davr uchun, ya'ni 1 CPU. Ammo agar 8 thread bir vaqtda ishlasa, ular 100 ms CPU vaqtini atigi 12.5 ms devor soatida sarflab bo'ladi. Qolgan 87.5 ms davomida guruhdagi hamma thread to'xtatiladi (throttling). Kernel hisobi `cpu.stat` faylida: `nr_periods`, `nr_throttled` va `throttled_time`.

Throttling jami ishni kamaytirmaydi (quota baribir cheklangan), lekin ish bir tekis emas, to'xtashlar bilan bajariladi va bu tail latency'ni oshiradi. Go uchun yana bir sabab: GC mark fazasida CPU resurslarining 25% ini oladi (gc-guide, "Latency" bo'limi), ya'ni ko'p P bo'lsa GC ham ko'p parallel ishchi ishga tushiradi va quota'ni tezroq yeydi. Bu bo'lim GC bilan bog'liq aniq hisob-kitob emas, faqat yo'nalishni ko'rsatadi.

## Misol: Go 1.24 da o'lchov va hisoblash

### 1. Go 1.24 cgroup'ni ko'rmaydi, affinity'ni ko'radi

```go
package main

import (
	"fmt"
	"os"
	"runtime"
	"runtime/metrics"
)

func main() {
	s := []metrics.Sample{{Name: "/sched/gomaxprocs:threads"}}
	metrics.Read(s)
	fmt.Printf("NumCPU=%d GOMAXPROCS=%d metrika=%d env=%q\n",
		runtime.NumCPU(), runtime.GOMAXPROCS(0), s[0].Value.Uint64(), os.Getenv("GOMAXPROCS"))
}
```

Go 1.24.7, linux/amd64, 2 vCPU. Birinchi ishga tushirish oddiy; ikkinchisi `taskset -c 0` bilan (affinity mask 1 CPU); uchinchisi `GOMAXPROCS=1` bilan; to'rtinchisi cgroup v1 da `cpu.cfs_quota_us=100000` (1 CPU) o'rnatilgan guruhda:

```text
NumCPU=2 GOMAXPROCS=2 metrika=2 env=""
NumCPU=1 GOMAXPROCS=1 metrika=1 env=""
NumCPU=2 GOMAXPROCS=1 metrika=1 env="1"
NumCPU=2 GOMAXPROCS=2 metrika=2 env=""     (cgroup quota 1 CPU, Go 1.24)
```

CPU affinity'ni Go 1.24 hisobga oladi (NumCPU 1 ga tushdi), cgroup quota'ni esa yo'q: 1 CPU quota'da ham GOMAXPROCS=2. Aynan shu bo'shliqni Go 1.25 yopadi. Lekin bu sandbox'da quota 1 ga teng va mantiqiy CPU 2 ta, shuning uchun Go 1.25 hujjatiga ko'ra ham natija 2 bo'lardi (minimum 2 qoidasi); farq kattaroq mashinada ko'rinadi (masalan 64 CPU va quota 2).

### 2. Throttling'ni o'lchash

Har P uchun bitta CPU-bound goroutine ishlaydi, parallel ravishda "ping" goroutine har 2 ms uxlab, kechikishni o'lchaydi. Dastur cgroup v1 da 1 CPU quota ostida GOMAXPROCS=2 va GOMAXPROCS=1 bilan 5 soniya ishlatildi:

```go
package main

import (
	"fmt"
	"runtime"
	"slices"
	"sync"
	"sync/atomic"
	"time"
)

var sink atomic.Uint64

// burn - bitta P'ni to'liq band qiladigan CPU ishi (blok = 10 000 amal).
func burn(stop *atomic.Bool, blocks *atomic.Uint64) {
	var x uint64 = 1
	var n uint64
	for !stop.Load() {
		for i := 0; i < 10_000; i++ {
			x = x*6364136223846793005 + 1442695040888963407
		}
		n++
	}
	sink.Add(x)
	blocks.Add(n)
}

func main() {
	procs := runtime.GOMAXPROCS(0)
	fmt.Printf("NumCPU=%d GOMAXPROCS=%d\n", runtime.NumCPU(), procs)

	var stop atomic.Bool
	var blocks atomic.Uint64
	var wg sync.WaitGroup
	for i := 0; i < procs; i++ { // har P uchun bitta CPU-bound goroutine
		wg.Add(1)
		go func() { defer wg.Done(); burn(&stop, &blocks) }()
	}

	var lat []time.Duration // 2 ms uxlab, kechikishni o'lchaydigan "ping"
	deadline := time.Now().Add(5 * time.Second)
	for time.Now().Before(deadline) {
		t := time.Now()
		time.Sleep(2 * time.Millisecond)
		lat = append(lat, time.Since(t)-2*time.Millisecond)
	}
	stop.Store(true)
	wg.Wait()

	slices.Sort(lat)
	q := func(p float64) time.Duration { return lat[int(float64(len(lat)-1)*p)].Round(100 * time.Microsecond) }
	fmt.Printf("ping=%d p50=%v p99=%v max=%v\n", len(lat), q(0.5), q(0.99), lat[len(lat)-1].Round(100*time.Microsecond))
	fmt.Printf("fon ishi: %d blok\n", blocks.Load())
}
```

Jarayon quota o'rnatilgan cgroup'ga shell orqali (`echo $$ > .../tasks`) o'tkazildi. Har konfiguratsiya ikki marta ishga tushirildi:

```text
GOMAXPROCS=2: nr_periods 51, nr_throttled 50 / 46, throttled_time 4.7 s / 4.1 s
              ping p50 21.8 / 21.1 ms, p99 68.0 / 67.7 ms, max 87.9 / 69.8 ms
              fon ishi 410122 / 394311 blok
GOMAXPROCS=1: nr_periods 51 / 50, nr_throttled 1 / 0
              ping p50 18.3 ms, p99 38.6 / 38.7 ms, max 40.8 / 38.9 ms
              fon ishi 396008 / 394801 blok
```

Jami ish ikkala holatda ham bir xil darajada (~395-410 ming blok), chunki quota ikkalasida ham 1 CPU. Lekin ikki thread bilan har davrda throttling bo'ldi (51 davrdan 46-50 tasida), p99 ping esa deyarli ikki baravar yomonlashdi. p50 ning 18-22 ms bo'lishi bu sun'iy yuk (hamma P band) ta'siri, throttling emas. Bu sandbox boshqa jarayonlar bilan umumiy bo'lgani uchun aniq millisekundlarni emas, yo'nalishni oling: quota'dan ko'p parallellik tail latency'ni yomonlashtiradi.

### 3. Hisoblash funksiyasi

Hujjatdagi qoidani koddagi funksiya sifatida ko'rish foydali (mashqda shuni yozasiz). Yechimdagi funksiya `max 100000` va 8 CPU uchun 8, `100000 100000` uchun 2, `150000 100000` uchun 2, `250000 100000` uchun 3, 1 CPU'li mashinada `50000 100000` uchun 1 qaytaradi. Kod ishga tushirib tekshirilgan, lekin u runtime'ning to'liq nusxasi emas: affinity mask yo'q va yangilanish yo'q.

## Qachon qo'llamaslik kerak

- Go 1.25 va yangi go.mod bo'lsa, GOMAXPROCS'ni qo'lda o'rnatmang. Qo'lda qiymat avtomatik yangilanishni o'chiradi: konteyner limiti keyinroq o'zgarsa, dastur eski qiymatda qoladi. Avvalgi versiyalarda shu vazifa uchun tashqi kutubxonalar yoki init-kod ishlatilgan; yangi toolchain'da ularni olib tashlash mumkinligini tekshiring.
- CPU requests'ni limit deb o'ylamang. Faqat requests berilgan bo'lsa, cgroup bandwidth limiti yo'q va default mantiqiy CPU'lar bilan aniqlanadi. Shunday tuzilmada parallellikni chegaralash kerak bo'lsa, `GOMAXPROCS`ni qo'lda qo'yish ongli qaror bo'lishi kerak.
- Yangi toolchain bilan eski `go` qatorini saqlab, "Go 1.25 container-aware" deb ishonmang. runtime hujjati language version 1.24 va undan eskilari uchun `containermaxprocs=0` ekanini aytadi.
- Limit 1 CPU bo'lgan latency-sezgir servisda "minimum 2" qoidasi throttling'ni to'liq yo'qotmaydi. Muallifning baholashi (faqat shu sandbox'dagi 1.24 o'lchoviga tayanadi, Go 1.25 da sinalmagan): bunday servis uchun GOMAXPROCS=1 ni o'lchab ko'rish arziydi. Ammo 1 P bilan GC, timer va netpoller ham bir P'ni bo'lishadi (52-dars), shuning uchun qaror o'lchovga asoslanishi kerak.
- Throttling yagona sabab emas. p99 oshganda avval execution trace va profil oling (62, 64-darslar), keyin GOMAXPROCS'ni o'zgartiring.

## Stack'da: Node.js/TypeScript bilan farq

- Node.js'da parallellik soni (cluster worker'lari, worker_threads) sizning konfiguratsiyangizda. Go'da u runtime'ning default qarori. Shu sababli Go servisining deployment manifestidagi CPU limiti to'g'ridan-to'g'ri runtime xatti-harakatiga aylanadi.
- Deploy tekshiruvi: pod ichida `runtime.GOMAXPROCS(0)` yoki `/sched/gomaxprocs:threads` qiymatini start log'iga yozing. Kutilgan qiymat bilan solishtirganda go.mod'dagi eski `go` qatori tufayli yangi xatti-harakat yoqilmay qolgani darrov ko'rinadi.
- Monitoringda kernel throttling hisoblagichlarini (`nr_throttled`, `throttled_time`) servis latency grafigi bilan yonma-yon qo'ying: CPU "limitdan past" ko'rinib, latency yomon bo'lsa, birinchi gumon throttling.
- CPU limitini o'zgartirgan holatda Go 1.25 da qayta ishga tushirish shart emas: runtime davriy yangilaydi (sekundiga bir martagacha).

## Xulosa

- GOMAXPROCS - bir vaqtda Go kodini bajaradigan P'lar soni. Go 1.24 gacha default mantiqiy CPU soni edi; Go 1.24.7 da o'lchandi: affinity hisobga olinadi, cgroup quota yo'q.
- Go 1.25 da Linux'da cgroup CPU bandwidth limiti (CPU limit, requests emas) hisobga olinadi va qiymat davriy yangilanadi. Qo'lda qo'yilgan GOMAXPROCS yoki GODEBUG bularni o'chiradi.
- Qiymat: min(mantiqiy CPU, affinity, quota/period yuqoriga yaxlitlangan), mantiqiy CPU 2 dan kam bo'lmasa kamida 2.
- go.mod'dagi `go 1.24` yoki eskisi `containermaxprocs=0` va `updatemaxprocs=0` default'larini saqlaydi: toolchain yangilanishi o'zi yetmaydi.
- Quota'dan ko'p parallel thread throttling beradi: sandbox o'lchovida jami ish bir xil, p99 deyarli ikki baravar yomon. Haqiqiy qiymat va throttling'ni production'da doim o'lchang.
