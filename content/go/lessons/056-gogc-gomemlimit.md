---
n: 56
slug: gogc-gomemlimit
title: "GOGC va GOMEMLIMIT: sozlash qoidalari"
summary: "GOGC heap maqsadini qanday belgilaydi, GOMEMLIMIT yumshoq limiti va GC CPU limiter qanday ishlaydi, konteynerda qancha zaxira qoldirish kerak va thrashing nimaga o'xshaydi: hammasi o'lchov bilan."
duration: 45
sources:
  - id: gc-guide
    note: "GOGC va Memory limit bo'limlari: heap maqsadi formulasi, 4 MiB minimum, yumshoq limit, GC CPU limiter, thrashing, zaxira bo'yicha tavsiya; Understanding costs bo'limi"
  - id: pkg-runtime-metrics
    note: "/gc/gogc:percent, /gc/gomemlimit:bytes, /gc/heap/goal:bytes, /gc/heap/live:bytes, /gc/limiter/last-enabled:gc-cycle va /memory/classes/* metrikalari tavsifi"
  - id: diagnostics
    note: "Diagnostics hujjati: GC trace va runtime statistikasi orqali heap xulq-atvorini kuzatish bo'limi"
quiz:
  - q: "Tirik heap 100 MiB, GC ildizlari (stack va global) hisobga olinmaydigan darajada kichik, `GOGC=100`. Heap maqsadi qancha bo'ladi va `GOGC=200` ga o'tsak nima o'zgaradi?"
    options:
      - "200 MiB va 400 MiB: maqsad GOGC ga ikki baravar bog'liq"
      - "200 MiB va 300 MiB: maqsad = tirik heap + tirik heap x GOGC/100"
      - "100 MiB va 200 MiB: maqsad tirik heap ga teng"
      - "200 MiB va 200 MiB: GOGC faqat GC chastotasiga ta'sir qiladi"
    answer: 1
    explain: "gc-guide formulasi: maqsad = tirik heap + (tirik heap + ildizlar) x GOGC / 100. GOGC=100 da heap tirik hajmdan ikki baravar kattagacha o'sishi mumkin, GOGC=200 da uch baravargacha. Ildizlar kichik bo'lsa, ular hisobga olinmaydi."
  - q: "Konteyner limiti 512 MiB. Jamoadagi dasturchi `GOMEMLIMIT=512MiB` o'rnatdi va servis baribir OOM-kill bo'ldi. Eng ehtimolli sabab?"
    options:
      - "GOMEMLIMIT konteyner limitidan katta bo'lishi kerak"
      - "GOMEMLIMIT faqat GOGC=off bilan ishlaydi"
      - "GC limitni hisobga olmaydi"
      - "Limit yumshoq va faqat Go runtime xotirasini hisobga oladi: runtime tashqarisidagi xotira (masalan cgo) va ajratish tezligi tufayli limitdan oshib ketish mumkin; shuning uchun 5-10 foiz zaxira qoldiriladi"
    answer: 3
    explain: "gc-guide: memory limit yumshoq, u Go runtime boshqaradigan xotirani sanaydi va uni tegishli foizga ushlab turishga harakat qiladi, lekin kafolat bermaydi. Darsdagi o'lchovda 600 MiB limit bilan maksimal xotira 618 MiB ga yetgan. Shuning uchun konteyner limitiga yaqin qiymat o'rnatmaslik kerak."
  - q: "Tirik heap 120 MiB, `GOMEMLIMIT=100MiB`, `GOGC=off`. Nima bo'ladi?"
    options:
      - "GC deyarli uzluksiz ishlaydi (thrashing), GC CPU limiter uni cheklaydi, xotira baribir limitdan oshadi, dastur qulamaydi"
      - "Dastur 'out of memory' xatosi bilan darhol to'xtaydi"
      - "GC limitni e'tiborsiz qoldiradi va GOGC=off ga ko'ra umuman ishlamaydi"
      - "Runtime limitni avtomatik 120 MiB ga ko'taradi"
    answer: 0
    explain: "Darsdagi tajriba (tirik heap 100 MiB bo'lganda, limit 90 MiB): 175-256 GC sikli, GC CPU ulushi 62-68 foiz, ish vaqti 0.6 soniyadan 6-7 soniyagacha o'sdi, `/gc/limiter/last-enabled` noldan katta bo'ldi, dastur tugadi. Limit yumshoq, shuning uchun dastur qulamaydi, lekin juda sekinlashadi."
  - q: "Servisda `GOGC=off` o'rnatilgan, `GOMEMLIMIT` yo'q. Darsdagi tajriba shu rejimda nimani ko'rsatdi?"
    options:
      - "GC faqat xotira 100 MiB ga yetganda ishlaydi"
      - "GC 4 MiB dan keyin ishlaydi"
      - "Hech qanday GC sikli bo'lmadi, 2 GiB axlat to'liq to'planib, xotira 2153 MiB ga chiqdi"
      - "Xotira doimiy qoladi, chunki allocator axlatni darhol qaytaradi"
    answer: 2
    explain: "GOGC=off GC'ni heap o'sishi bo'yicha to'xtatadi. Limit bo'lmasa, GC'ni hech narsa ishga tushirmaydi: tajribada 0 sikl, 0.07 soniya va 2153 MiB maksimal xotira. Shuning uchun GOGC=off ni deyarli doim GOMEMLIMIT bilan birga ishlatishadi (yoki umuman ishlatishmaydi)."
  - q: "Production'da joriy GC sozlamalari haqiqatan qo'llanganini qaysi metrikalar bilan tekshirasiz?"
    options:
      - "`/gc/heap/live:bytes` va `/memory/classes/total:bytes`"
      - "`/gc/gogc:percent` va `/gc/gomemlimit:bytes`"
      - "`/sched/gomaxprocs:threads` va `/sched/goroutines:goroutines`"
      - "`/gc/cycles/total:gc-cycles` va `/gc/limiter/last-enabled:gc-cycle`"
    answer: 1
    explain: "Birinchi ikkita metrika runtime'ning joriy GOGC va xotira limiti qiymatlarini beradi (env yoki SetGCPercent / SetMemoryLimit qo'ygan qiymat). Boshqalari natijani ko'rsatadi (tirik heap, sikllar), sozlamani emas. Topshiriqdagi `configure` aynan `/gc/gomemlimit:bytes` dan qaytarib o'qiydi."
  - q: "`GOGC=100, GOMEMLIMIT=250MiB` va `GOGC=off, GOMEMLIMIT=250MiB` rejimlarini darsdagi ish yuklamasida solishtirdik. Natija?"
    options:
      - "Ikkinchisi tezroq, chunki GOGC=off GC'ni o'chiradi"
      - "Birinchisi limit sababli 250 MiB dan oshmaydi, ikkinchisi oshadi"
      - "Ikkalasi ham deyarli bir xil: 19-20 sikl va 44-48 foiz GC CPU, chunki ikkalasida ham maqsadni limit belgilaydi"
      - "Birinchisida GC umuman ishlamaydi"
    answer: 2
    explain: "Tirik heap 100 MiB bo'lganda GOGC=100 maqsadi 200 MiB bo'lardi, lekin ajratish tezligi yuqori va concurrent mark davomida heap o'sadi; ikkala rejimda sikllar soni 19-20, GC ulushi 44-48 foiz chiqdi. Limit tepaga chegara qo'yadi, GOGC esa chegaradan pastda GC chastotasini belgilaydi."
  - q: "Servis kunduzi 40 MiB, kechqurun batch paytida 400 MiB tirik heap ushlaydi; konteyner 512 MiB. Qaysi sozlama mantiqan eng mos?"
    options:
      - "`GOGC=off GOMEMLIMIT=100MiB`"
      - "Faqat `GOGC=off`"
      - "`GOMEMLIMIT=512MiB` va `GOGC` ni tegmaslik"
      - "`GOGC=100` saqlanadi va `GOMEMLIMIT` 460 MiB (10 foiz zaxira) o'rnatiladi"
    answer: 3
    explain: "Kunduzi GOGC GC chastotasini belgilaydi, kechqurun xotira limitga yaqinlashganda limit GC'ni kuchaytiradi. Limit juda past bo'lsa (birinchi variant) thrashing, limit yo'q bo'lsa (ikkinchi) OOM xavfi, limit konteynerga teng bo'lsa (uchinchi) zaxira yo'q. Tirik heap 400 MiB bo'lganda ham limitga yaqinligini monitoringda kuzating."
task:
  title: "Konteyner limitidan GC sozlamasini hisoblash"
  prompt: |
    Servis 500 MiB limitli konteynerda ishlaydi. Dastur ishga tushganda `configure(containerBytes, headroomPct)` chaqiriladi: u runtime xotira limitini konteyner limitidan zaxira foizini ayirib o'rnatishi va runtime ko'rsatayotgan limitni qaytarishi kerak.

    Boshlang'ich kod xatolarga ega: limitga konteyner hajmini aynan beradi (zaxira yo'q) va `GOGC` ni o'chirib qo'yadi. Uni tuzating: `limit = containerBytes - containerBytes * headroomPct / 100`; GOGC o'zgarmasin; `containerBytes <= 0` yoki `headroomPct` 0..99 oralig'idan tashqarida bo'lsa, hech narsani o'rnatmay `errBadInput` qaytaring. Natija `runtime/metrics` dagi `/gc/gomemlimit:bytes` dan o'qilsin.
  lang: go
  starter: |
    package main

    import (
        "errors"
        "fmt"
        "runtime/debug"
        "runtime/metrics"
    )

    // configure container xotira limiti asosida GC'ni sozlaydi va
    // runtime ko'rsatayotgan limitni qaytaradi.
    func configure(containerBytes int64, headroomPct int) (int64, error) {
        debug.SetGCPercent(-1)
        debug.SetMemoryLimit(containerBytes)
        return readInt("/gc/gomemlimit:bytes"), nil
    }

    func readInt(name string) int64 {
        s := []metrics.Sample{{Name: name}}
        metrics.Read(s)
        return int64(s[0].Value.Uint64())
    }

    func main() {
        const container = 500 << 20 // 500 MiB
        limit, err := configure(container, 10)
        fmt.Println("limit (MiB):", limit>>20, "xato:", err)
        fmt.Println("limit 450 MiB:", limit == 450<<20)
        fmt.Println("GOGC 100 qoldi:", readInt("/gc/gogc:percent") == 100)
        _, err = configure(0, 10)
        fmt.Println("noto'g'ri kirishda xato:", errors.Is(err, errBadInput))
    }

    var errBadInput = errors.New("container hajmi musbat bo'lishi kerak")
  solution: |
    package main

    import (
        "errors"
        "fmt"
        "runtime/debug"
        "runtime/metrics"
    )

    var errBadInput = errors.New("container hajmi musbat bo'lishi kerak")

    // configure container xotira limiti asosida GC'ni sozlaydi va
    // runtime ko'rsatayotgan limitni qaytaradi. GOGC o'zgarmaydi.
    func configure(containerBytes int64, headroomPct int) (int64, error) {
        if containerBytes <= 0 || headroomPct < 0 || headroomPct >= 100 {
            return 0, errBadInput
        }
        limit := containerBytes - containerBytes*int64(headroomPct)/100
        debug.SetMemoryLimit(limit)
        return readInt("/gc/gomemlimit:bytes"), nil
    }

    func readInt(name string) int64 {
        s := []metrics.Sample{{Name: name}}
        metrics.Read(s)
        return int64(s[0].Value.Uint64())
    }

    func main() {
        const container = 500 << 20 // 500 MiB
        limit, err := configure(container, 10)
        fmt.Println("limit (MiB):", limit>>20, "xato:", err)
        fmt.Println("limit 450 MiB:", limit == 450<<20)
        fmt.Println("GOGC 100 qoldi:", readInt("/gc/gogc:percent") == 100)
        _, err = configure(0, 10)
        fmt.Println("noto'g'ri kirishda xato:", errors.Is(err, errBadInput))
    }
  solutionNotes: |
    - Zaxira foizi Go runtime hisobiga kirmaydigan xotira (cgo, boshqa jarayonlar) va limitning yumshoq ekani uchun kerak. gc-guide 5-10 foiz zaxira tavsiya qiladi; yechim 10 foiz oladi.
    - `debug.SetGCPercent(-1)` GOGC'ni o'chiradi. Limit noto'g'ri bo'lsa, GC'ni hech narsa cheklamaydi. Yechim GOGC'ga tegmaydi, `/gc/gogc:percent` 100 qoladi.
    - Kirish tekshiruvi limit o'rnatishdan oldin bajariladi, shuning uchun noto'g'ri qiymatlar runtime holatini buzmaydi.
    - `SetMemoryLimit` oldingi limitni qaytaradi, joriy qiymat esa metrikadan o'qiladi: bu runtime'ning haqiqiy holatini tasdiqlaydi.
    - Kutilgan chiqish: `limit (MiB): 450 xato: <nil>`, keyin uchta `true`.
  checklist:
    - "Limit `containerBytes - containerBytes*headroomPct/100` ga teng (500 MiB uchun 450 MiB)"
    - "`/gc/gogc:percent` 100 bo'lib qoladi (GOGC o'chirilmagan)"
    - "`containerBytes <= 0` yoki noto'g'ri foizda `errBadInput` qaytadi"
    - "Qaytarilgan qiymat `/gc/gomemlimit:bytes` metrikasidan o'qiladi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Go servisini konteynerga joylagan har bir jamoa ertami-kechmi ikki xil muammoga duch keladi. Birinchisi: servis OOM-kill bo'ladi, garchi "heap faqat 300 MB" bo'lsa ham. Ikkinchisi: servis CPU'ning katta qismini GC'ga sarflaydi, garchi xotira yetarli bo'lsa ham. Ikkalasi ham bitta ikki o'qli kelishuvning ikki tomoni: GC kamroq ishlasa, ko'proq xotira kerak; kamroq xotira bilan ishlasa, ko'proq CPU kerak.

Node.js'da `--max-old-space-size` eski avlod heap'iga qattiq chegara qo'yadi: undan oshsa jarayon "JavaScript heap out of memory" bilan qulaydi. Go'da ikkita boshqaruv bor va ular boshqacha ishlaydi. `GOGC` heap qanchalik o'sishi mumkinligini nisbiy o'lchovda aytadi: tirik hajmga nisbatan foiz. `GOMEMLIMIT` esa Go runtime'ning umumiy xotirasiga yumshoq chegara qo'yadi: u dasturni yiqitmaydi, GC'ni kuchaytiradi. Bu farq muhim: noto'g'ri sozlangan limit qulash o'rniga sekinlashish beradi, va sekinlashishni topish qulashni topishdan qiyinroq.

Bu darsda ikkala sozlamani gc-guide asosida tushuntiramiz va Go 1.24.7 da (linux/amd64, 2 vCPU, boshqa jarayonlar bilan bo'lingan mashina) o'lchaymiz. Go 1.25 va 1.26 dagi o'zgarishlar bu mexanizmlarni tubdan o'zgartirmaydi, lekin Green Tea GC (57-dars) GC narxi tarkibini o'zgartiradi, shuning uchun raqamlaringizni yangi versiyada qayta o'lchang.

## Asosiy g'oya

### GOGC: nisbiy maqsad

GC sikli tugagach runtime keyingi sikl qachon boshlanishini hal qiladi. gc-guide'da keltirilgan formula:

```text
heap maqsadi = tirik heap + (tirik heap + GC ildizlari) x GOGC / 100
```

Tirik heap oxirgi sikl belgilab chiqqan hajm. GC ildizlari (roots) goroutine stack'lari va global o'zgaruvchilar. `GOGC=100` bo'lganda heap tirik hajmdan ikki baravar kattagacha o'sadi, `GOGC=200` da uch baravargacha. Bu qiymatlar o'zgarmas emas: GOGC o'zgartirilsa maqsad yangi formulaga ko'ra qayta hisoblanadi. GOGC'ning mantiqiy kelishuvi aniq: ikki baravar ko'p GOGC siklar sonini deyarli ikki baravar kamaytiradi, lekin xotirani ham shunga yarasha oshiradi.

Kichik heap uchun ham minimum bor: gc-guide'ga ko'ra GC umumiy heap 4 MiB dan kam bo'lganda ishga tushmaydi (GOGC=100 da; GOGC bilan miqyoslanadi). Birinchi `gctrace` qatorida `4 MB goal` aynan shu (55-dars).

`GOGC=off` (yoki `debug.SetGCPercent(-1)`) bu nisbiy maqsadni o'chiradi. Limit ham bo'lmasa, GC'ni hech narsa ishga tushirmaydi. Bu juda tor holatlar uchun (qisqa umrli CLI utilita).

### GOMEMLIMIT: yumshoq tepa chegara

`GOMEMLIMIT` (yoki `debug.SetMemoryLimit`) Go runtime boshqaradigan umumiy xotiraga chegara qo'yadi. gc-guide uni hisoblashni quyidagicha ta'riflaydi: runtime xaritalagan va hali OS'ga qaytarilmagan xotira (`runtime.MemStats` tilida `Sys - HeapReleased`). Bunga heap, stack'lar, runtime metadata'si kiradi. Runtime tashqarisidagi xotira (cgo ajratishlari, boshqa jarayonlar, yadro xotirasi) kirmaydi. Qiymat baytlarda yoki `B`, `KiB`, `MiB`, `GiB`, `TiB` qo'shimchalari bilan beriladi (`GOMEMLIMIT=450MiB`).

Limit GC'ni qanday boshqaradi? Heap maqsadi endi ikki shartning kichigi: GOGC bergan maqsad va limitdan kelib chiqadigan maqsad. Xotira limitga yaqinlashganda GC chastotasi oshadi, shunda xotira limit atrofida qoladi. Limit yumshoq: ajratish tezligi yuqori bo'lsa yoki tirik heap limitga yaqin bo'lsa, runtime limitdan oshishga yo'l qo'yadi, chunki alternativasi dasturni to'xtatish bo'lardi.

### GC CPU limiter va thrashing

Agar tirik heap limitga yaqinlashsa yoki undan oshsa, GC deyarli doim ishlaydi, dastur esa deyarli ish qilmaydi. Bu holat thrashing deyiladi. Uni cheklash uchun runtime GC CPU limiter ishlatadi: gc-guide'ga ko'ra u GC'ning CPU ulushini 50 foiz atrofida chegaralaydi (bir oyna davomida, bir oz erkinlik bilan). Limiter ishlaganda GC limit maqsadiga ulgurmaydi va xotira limitdan oshadi, lekin dastur oldinga siljiydi. `runtime/metrics` ning `/gc/limiter/last-enabled:gc-cycle` metrikasi limiter oxirgi marta qaysi GC siklida yoqilganini ko'rsatadi; u nol bo'lsa limiter hech yoqilmagan.

## Chuqurroq: ikkalasini birga ishlatish va zaxira

### Qaysi kombinatsiya qachon

gc-guide kombinatsiyalarni tavsiflaydi. Eng keng tarqalgani: `GOGC` ni o'zgartirmaslik (100) va `GOMEMLIMIT` ni tepa chegara sifatida qo'yish. Oddiy yuklamada GOGC GC chastotasini belgilaydi, yuklama oshib xotira limitga yaqinlashganda esa limit GC'ni tezlashtiradi va OOM'dan himoya qiladi. Ikkinchi variant, `GOGC=off` va `GOMEMLIMIT`: GC faqat limitga yaqinlashganda ishlaydi, xotira kamroq tez-tez qaytariladi, lekin tirik heap oldindan noma'lum bo'lsa xavfli: kutilmagan yuklama thrashing'ga olib keladi. Uchinchisi, faqat `GOGC=off`, deyarli hech qachon mos emas.

gc-guide shuningdek limitni qachon ishlatmaslikni aytadi: dasturingiz resurslarni boshqa jarayonlar bilan bo'lishsa va xotira hajmi nazoratingizda bo'lmasa, qattiq belgilangan limit foyda bermaydi. Konteyner muhitida esa limit odatda ma'lum.

### Nega zaxira kerak

Konteyner limiti 512 MiB bo'lsa, `GOMEMLIMIT=512MiB` qo'ymang. Sabablari: limit faqat Go runtime xotirasini sanaydi (cgo, mmap qilingan fayllar, thread stack'lari tashqarida bo'lishi mumkin); limit yumshoq; GC mark paytida heap limitdan oshib ketishi mumkin. gc-guide 5-10 foiz zaxira qoldirishni tavsiya qiladi. Bu dars shu doirada 10 foizni oladi: 500 MiB konteynerga 450 MiB limit.

Konteyner va Go o'rtasidagi bog'liqlik haqida: 53-darsda ko'rdik, Go 1.25 dan runtime GOMAXPROCS'ni cgroup CPU limitidan oladi. Go 1.25 release notes'da bunday avtomatik moslashuv faqat CPU uchun tilga olingan; xotira limitini GOMEMLIMIT'ga avtomatik ko'chirish haqida notes'da gap yo'q, shuning uchun bu sozlamani qo'lda (yoki deployment orqali) berish kerak. Bu fikr faqat Go 1.25 notes'iga tayanadi; 1.26 va 1.27 uchun tekshirmadik.

### Qaysi metrikalarni qarash kerak

`runtime/metrics` joriy holatni to'liq beradi (pkg-runtime-metrics): `/gc/gogc:percent` va `/gc/gomemlimit:bytes` sozlamalarni, `/gc/heap/goal:bytes` joriy maqsadni, `/gc/heap/live:bytes` oxirgi sikl belgilagan tirik hajmni, `/gc/limiter/last-enabled:gc-cycle` limiter holatini, `/memory/classes/total:bytes` va `/memory/classes/heap/released:bytes` Go xotirasi va OS'ga qaytarilgan qismini. Limit hisobiga kiradigan xotira: `total - released`. Bu darsdagi tajribalarda "maks_xotira" aynan shu.

## Misol: GOGC va GOMEMLIMIT o'lchovi

Dastur 100 MiB atrofida tirik heap quradi (800 ming ko'rsatkichli `Cell`, har biri 128 bayt), keyin 2 GiB qisqa umrli axlat ajratadi (16 KiB lik 131072 ta slice) va GC sikllari, GC CPU ulushi va maksimal xotirani chop etadi. Maksimal xotira `total - released` ni har 2048 ajratishda o'qib topiladi.

```go
package main

import (
	"fmt"
	"runtime"
	"runtime/metrics"
	"time"
)

// Cell - tirik ma'lumotning bir elementi (pointer saqlaydi, GC skanerlashi kerak).
type Cell struct {
	Next *Cell
	Data [14]int
}

var sink []byte

func read(names ...string) []metrics.Sample {
	s := make([]metrics.Sample, len(names))
	for i, n := range names {
		s[i].Name = n
	}
	metrics.Read(s)
	return s
}

func main() {
	// ~100 MiB tirik heap: 800 ming Cell x 128 bayt.
	live := make([]*Cell, 800_000)
	for i := range live {
		live[i] = &Cell{}
	}
	runtime.GC()

	names := []string{
		"/gc/gogc:percent", "/gc/gomemlimit:bytes",
		"/gc/cycles/total:gc-cycles",
		"/cpu/classes/gc/total:cpu-seconds", "/cpu/classes/total:cpu-seconds",
		"/memory/classes/total:bytes", "/memory/classes/heap/released:bytes",
		"/gc/limiter/last-enabled:gc-cycle", "/gc/heap/live:bytes",
	}
	b := read(names...)
	start := time.Now()
	var peak uint64
	// 2 GiB qisqa umrli axlat: 16 KiB lik 131072 ta ajratish.
	for i := 0; i < 131072; i++ {
		sink = make([]byte, 16<<10)
		if i%2048 == 0 {
			a := read(names...)
			if u := a[5].Value.Uint64() - a[6].Value.Uint64(); u > peak {
				peak = u
			}
		}
	}
	el := time.Since(start)
	a := read(names...)
	gogc := a[0].Value.Uint64()
	lim := a[1].Value.Uint64()
	cy := a[2].Value.Uint64() - b[2].Value.Uint64()
	gcShare := (a[3].Value.Float64() - b[3].Value.Float64()) / (a[4].Value.Float64() - b[4].Value.Float64())
	gogcS, limS := fmt.Sprint(gogc), fmt.Sprintf("%d MiB", lim>>20)
	if gogc > 1<<62 {
		gogcS = "off"
	}
	if lim > 1<<62 {
		limS = "yo'q"
	}
	if gcShare != gcShare {
		gcShare = 0
	}
	fmt.Printf("GOGC=%s limit=%s | sikllar=%d gc_cpu=%.1f%% vaqt=%.2fs maks_xotira=%d MiB limiter=%d tirik=%d MiB\n",
		gogcS, limS, cy, 100*gcShare, el.Seconds(), peak>>20, a[7].Value.Uint64(), a[8].Value.Uint64()>>20)
	runtime.KeepAlive(live)
}
```

`gofmt -l` bo'sh, `go vet` toza. Bir xil ikkilik fayl turli sozlamalar bilan ishga tushirildi (Go 1.24.7, linux/amd64, 2 vCPU). `tirik` ustuni `/gc/heap/live:bytes` bo'lib, oxirgi siklda belgilangan hajm (u mark davomida ajratilgan va qora qilingan obyektlarni ham o'z ichiga oladi, shuning uchun 100 MiB dan katta chiqadi):

```text
GOGC=50 limit=yo'q | sikllar=23 gc_cpu=53.0% vaqt=1.41s maks_xotira=394 MiB limiter=0 tirik=147 MiB
GOGC=100 limit=yo'q | sikllar=13 gc_cpu=40.3% vaqt=0.89s maks_xotira=385 MiB limiter=0 tirik=141 MiB
GOGC=200 limit=yo'q | sikllar=4 gc_cpu=7.6% vaqt=1.54s maks_xotira=1116 MiB limiter=0 tirik=302 MiB
GOGC=400 limit=yo'q | sikllar=2 gc_cpu=16.9% vaqt=1.13s maks_xotira=1289 MiB limiter=0 tirik=289 MiB
GOGC=off limit=yo'q | sikllar=0 gc_cpu=0.0% vaqt=0.07s maks_xotira=2153 MiB limiter=0 tirik=103 MiB
GOGC=off limit=600 MiB | sikllar=5 gc_cpu=20.9% vaqt=0.65s maks_xotira=618 MiB limiter=0 tirik=165 MiB
GOGC=off limit=400 MiB | sikllar=8 gc_cpu=32.8% vaqt=0.80s maks_xotira=476 MiB limiter=0 tirik=185 MiB
GOGC=off limit=250 MiB | sikllar=19 gc_cpu=48.2% vaqt=1.14s maks_xotira=275 MiB limiter=0 tirik=132 MiB
GOGC=off limit=150 MiB | sikllar=75 gc_cpu=65.0% vaqt=2.94s maks_xotira=175 MiB limiter=0 tirik=103 MiB
GOGC=off limit=90 MiB | sikllar=189 gc_cpu=66.6% vaqt=6.49s maks_xotira=150 MiB limiter=193 tirik=118 MiB
```

Aniq o'lchov sharoitiga ehtiyotkor bo'ling: mashina boshqa jarayonlar bilan bo'lingan, shuning uchun alohida qatorlar ishga tushirishlar orasida farq qiladi. Masalan, `GOGC=200` boshqa ishga tushirishlarda 6-7 sikl va 560-610 MiB maksimal xotira berdi, `GOGC=100` har safar 13-14 sikl berdi. Vaqt ustuniga ishonmang. Takrorlanuvchi, barqaror xulosalar quyidagilar.

Birinchisi, GOGC bo'yicha sikllar soni teskari proporsional: 50 dan 100 ga 23 dan 13 gacha, 400 da 2-3 gacha, `off` da nolga. GC CPU ulushi shunga mos kamayadi (53 foizdan 8-17 foizgacha). Xotira esa oshadi. Ikkinchisi, `GOGC=off` limitsiz hech qachon GC ishga tushirmaydi: 2 GiB axlat to'liq to'plandi (2153 MiB). Uchinchisi, limit bilan sikllar soni limitga qarab keskin o'zgaradi: 600 MiB da 5 sikl, 250 MiB da 19, 150 MiB da 75. Maksimal xotira limitga yaqin, lekin undan oshishi mumkin (600 MiB limitda 618 MiB): bu limitning yumshoqligi. To'rtinchisi, tirik heap atrofida 100 MiB bo'lganda 90 MiB limit thrashing berdi: 175-256 sikl (bir necha ishga tushirishda), GC CPU ulushi 62-68 foiz, ish vaqti 0.6 soniyadan 6-7 soniyagacha, `limiter` noldan katta. Dastur qulamadi, lekin o'n baravardan ko'p sekinlashdi.

Qayd etamiz: gc-guide limiter 50 foiz atrofida cheklaydi deydi, bizning o'lchovda `/cpu/classes/gc/total` ulushi 62-68 foizga yetdi. Farqning sababini tekshirmadik: mumkin, hujjatdagi 50 foiz boshqa oyna va hisobga olish bilan bog'liq, o'lchovimiz esa butun dastur davomidagi ulush. Shu sababli 50 foizni aniq chegara deb emas, yo'nalish ko'rsatkichi deb qabul qiling.

Bu tajribadagi eng muhim amaliy xulosa: limit va tirik heap orasidagi masofa GC narxini belgilaydi. Limit 600 MiB da GC CPU 21 foiz, 250 MiB da 48 foiz, 150 MiB da 65 foiz. Konteynerga ko'p xotira bermaslik bilan GC'ga ko'p CPU berish orasidagi tanlov aynan shu egri chiziq bo'ylab.

### Topshiriqdagi `configure`

Yechimda ishlatiladigan sxema (to'liq kod topshiriqda): limit `container - container*headroomPct/100`, GOGC tegilmaydi, joriy qiymat `/gc/gomemlimit:bytes` dan qaytarib o'qiladi.

## Qachon qo'llamaslik kerak

`GOMEMLIMIT` ni quyidagi hollarda ishlatmang yoki ehtiyot bo'ling.

Tirik heap noma'lum yoki o'zgaruvchan bo'lsa va limitni juda past qo'ysangiz: tirik hajm limitga yetganda thrashing boshlanadi (yuqoridagi 90 MiB tajriba). Bunday holda limit OOM'dan himoya qilmaydi, balki xizmatni sekinlashtiradi va uning sababini topish qiyin.

Dastur xotirasining katta qismi runtime tashqarisida bo'lsa (cgo, mmap qilingan ma'lumot): limit ularni ko'rmaydi, shuning uchun zaxirani oshiring yoki limitni konteyner xotirasidan ancha past o'rnating.

`GOGC=off` va limit kombinatsiyasi: GC faqat limitga yaqinlashganda ishlaydi. Kichik tirik heap bilan bu xotirani limitga yaqin ushlaydi, ya'ni servis har doim konteynerning ko'p qismini band qiladi; boshqa servislar bilan bir tugunda ishlasa, bu qulay emas.

`GOGC` ni oshirishdan oldin xotira zaxirasini hisoblang. Tajribada `GOGC=200` va `400` ba'zan 1 GiB dan oshdi, chunki katta ajratish tezligida concurrent mark davomida heap maqsaddan ancha o'sadi. GOGC ni oshirish xotira sarfini oldindan aytilganidan ko'proq ko'tarishi mumkin.

GC sozlamasi allocation muammosini hal qilmaydi. Agar GC CPU'ning katta qismini olayotgan bo'lsa, birinchi navbatda ajratishlarni kamaytiring (54, 65-darslar); sozlama faqat bu narxni xotiraga almashtiradi.

## Stack'da: Node.js bilan farq

Node.js'da xotira chegarasi odatda `--max-old-space-size` bilan beriladi va uni oshib ketish jarayonni to'xtatadi. Go'da analog yo'q: limit yumshoq, shuning uchun nazorat xotira o'sishida emas, GC CPU'da va kechikishda bo'ladi. Dashboard'ga kamida `/gc/heap/live:bytes`, `/gc/heap/goal:bytes`, `/gc/limiter/last-enabled:gc-cycle` va GC CPU ulushi oyna ayirmasi (55-darsdagi `diff`) qo'shing: limiter birinchi marta yoqilganda alert bering.

Kubernetes'da amaliy retsept: pod limitidan 10 foiz kam `GOMEMLIMIT` (deployment'da env sifatida, `450MiB` kabi qo'shimchalar bilan), `GOGC` ni tegmasdan, va tirik heap p99 ni limitga nisbatan kuzatish. Tirik heap limitning 70-80 foizidan oshsa, bu ogohlantirish: GC narxi tez o'sa boshlaydi (egri chiziq yuqorida). Bu foiz muallifning tajribaviy baholari, manbadan olingan raqam emas.

## Xulosa

- `GOGC` heap maqsadini tirik hajmga nisbatan belgilaydi: maqsad = tirik + (tirik + ildizlar) x GOGC/100. GOGC ikki baravar oshsa, sikllar soni deyarli ikki baravar kamayadi, xotira oshadi.
- `GOMEMLIMIT` Go runtime xotirasiga yumshoq tepa chegara qo'yadi: xotira limitga yaqinlashganda GC kuchayadi. Limit dasturni yiqitmaydi va undan oshib ketish mumkin (tajribada 600 MiB limitda 618 MiB).
- Konteyner limitiga teng GOMEMLIMIT qo'ymang: 5-10 foiz zaxira qoldiring, chunki runtime tashqarisidagi xotira hisobga olinmaydi.
- Tirik heap limitga yetsa thrashing boshlanadi: tajribada 0.6 soniyalik ish 6-7 soniyaga cho'zildi. GC CPU limiter dasturni qulashdan saqlaydi, lekin sekinlashishdan emas.
- `GOGC=off` limitsiz hech qachon GC ishga tushirmaydi (tajribada 2153 MiB). Sozlamalar to'g'ri qo'llanganini `/gc/gogc:percent` va `/gc/gomemlimit:bytes` bilan tekshiring.
