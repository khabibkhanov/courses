---
n: 54
slug: allocator
title: "Xotira allocator'i: size class va keshlar"
summary: "Go kichik obyektlarni size class'lar bo'yicha qanday joylaydi, mcache, mcentral va mheap qanday zanjir hosil qiladi, tiny allocator va katta obyektlar nima bilan farq qiladi, ajratilgan xotira o'lchovda qanday ko'rinadi."
duration: 40
sources:
  - id: runtime-hacking
    note: "Unmanaged memory bo'limi: sysAlloc, persistentalloc, fixalloc; Error handling bo'limi: mallocgc paytida panic fatal xatoga aylanishi"
  - id: gc-guide
    note: "Understanding costs va GOGC bo'limlari: ajratish tezligi GC chastotasini belgilaydi; Implementation-specific optimizations: pointer-free qiymatlar ajratiladi; A note about virtual memory; Additional resources: TCMalloc"
  - id: pkg-runtime
    note: "MemStats, SetFinalizer hujjatidagi tiny obyektlarni bir slotga birlashtirish haqidagi izoh, GODEBUG ro'yxati (scavtrace, madvdontneed, efence, sbrk)"
  - id: pkg-runtime-metrics
    note: "/gc/heap/allocs-by-size:bytes, /gc/heap/tiny/allocs:objects va /memory/classes/* metrikalari tavsifi"
  - id: go127
    note: "Runtime bo'limi, Faster memory allocation: size-specialized ajratish chaqiruvlari"
quiz:
  - q: "`make([]byte, 33)` (pointer-free, heap'ga qochadi) 20000 marta ajratilganda `runtime.MemStats.TotalAlloc` bir obyektga necha bayt qo'shdi (Go 1.24.7, darsdagi tajriba)?"
    options:
      - "33 bayt: allocator so'ralgan hajmni aynan beradi"
      - "64 bayt: hajm doim ikkining darajasigacha yaxlitlanadi"
      - "48 bayt: so'rov eng yaqin kattaroq size class'ga yaxlitlanadi"
      - "40 bayt: sakkizlikka karrali eng yaqin son"
    answer: 2
    explain: "O'lchovda 17 -> 24, 33 -> 48, 100 -> 112, 1025 -> 1152 chiqdi. malloc.go izohi: kichik hajmlar (32 KB gacha) 70 ga yaqin size class'dan biriga yaxlitlanadi, har class'ning o'z bo'sh obyektlar to'plami bor. Hajmlar ikkining darajasiga yoki sakkizning karrasiga emas, class jadvaliga yaxlitlanadi."
  - q: "Nega 32769 baytlik ajratish 40960 bayt hisoblandi, 32768 baytlik esa aynan 32768?"
    options:
      - "32768 - eng katta kichik size class; undan kattalari 'katta obyekt' bo'lib, mheap'dan butun sahifalar (8 KiB) bilan ajratiladi: 5 sahifa = 40960"
      - "Bu o'lchov xatosi"
      - "GC 32768 dan kattasini ikki baravar ajratadi"
      - "40960 - doimiy minimal katta obyekt hajmi"
    answer: 0
    explain: "malloc.go: katta obyektlar mcache va mcentral'ni aylanib o'tib, to'g'ridan-to'g'ri mheap'dan ajratiladi; mheap 8192 baytlik sahifa granulyarligida ishlaydi. 32769 baytga 5 sahifa (5 x 8192 = 40960) kerak."
  - q: "Kichik obyekt ajratishning tezkor yo'li nima uchun ko'p hollarda lock olmaydi?"
    options:
      - "Chunki Go bitta thread'da ishlaydi"
      - "Chunki ajratish har doim atomic instruksiya bilan bajariladi"
      - "Chunki ajratish stack'da bo'ladi"
      - "Chunki har P'ning o'z mcache'si bor: unda har size class uchun bo'sh joyli mspan turadi va bo'sh slot bitmap'dan topiladi"
    answer: 3
    explain: "malloc.go izohi: avval shu P'ning mcache'idagi mspan'ning free bitmap'i skanerlanadi va bu 'butunlay lock olmasdan' bajariladi. Span tugasa mcentral'dan yangisi olinadi (u yerda lock bor, lekin butun span olinishi lock narxini ulushlarga bo'ladi)."
  - q: "Servis 1000 ta 24 baytlik `Reading` uchun alohida `&Reading{}` ajratadi. Ularni bitta `[]Reading` slab'iga ko'chirib, ko'rsatkichlarni slab elementlariga qaratdik: `AllocsPerRun` 1001 dan 2 ga tushdi. Bunda qanday xavf bor?"
    options:
      - "Xavf yo'q, slab har doim yaxshi"
      - "Slab elementlariga bitta ko'rsatkich qolsa ham, butun slab tirik qoladi (GC uni bo'laklab bo'shatmaydi)"
      - "Slab ichidagi ko'rsatkichlar GC tomonidan e'tiborsiz qoldiriladi"
      - "Struct hajmi 8 baytga yaxlitlanadi, shuning uchun ma'lumot yo'qoladi"
    answer: 1
    explain: "Ko'rsatkich obyektning istalgan qismiga ishora qilsa ham, butun ajratilgan obyektni tirik ushlab turadi. Slab bitta katta obyekt, shuning uchun ayrim elementlar kerak bo'lmay qolsa ham xotira qaytmaydi. Slab faqat elementlar hayoti birga tugasa mos."
  - q: "gc-guide'ga ko'ra 'pointer-free values are segregated from other values'. Amaliy ma'no nima?"
    options:
      - "Pointer yo'q struct'lar stack'da bo'lishi shart"
      - "Pointer saqlamaydigan ma'lumot tuzilmalari GC uchun arzonroq: ularni skanerlash shart emas va GC bosimi kamayadi; shuning uchun ba'zan pointer o'rniga indeks ishlatish foydali"
      - "Pointer-free obyektlar hech qachon GC tomonidan tozalanmaydi"
      - "Pointer-free obyektlar faqat tiny allocator'dan ajratiladi"
    answer: 1
    explain: "gc-guide: pointer'siz qiymatlar boshqalardan ajratib saqlanadi, indeksga asoslangan tuzilmalar ba'zan tezroq ishlaydi, lekin buni faqat GC marking va scanning ko'p vaqt olayotgani aniq bo'lsa qiling. Pointer-free obyektlar baribir GC tomonidan tozalanadi va faqat kichiklari (16 bayt atrofida va kam) tiny blokka birlashadi."
  - q: "Konteynerda `top` Go servisining RSS'i 900 MB, `runtime/metrics` dagi `/memory/classes/heap/objects:bytes` esa 300 MB ko'rsatmoqda. Bu zid emasmi?"
    options:
      - "Zid: metrika xato"
      - "Zid emas: heap'da obyektlardan tashqari bo'sh (hali OS'ga qaytarilmagan), metadata, stack va boshqa runtime xotirasi ham bor; hamma ajratilgan xotira `/memory/classes/total:bytes` da, qaytarilgani `heap/released` da"
      - "Zid emas, chunki RSS har doim heap'dan 3 baravar katta"
      - "Zid emas, chunki heap metrikasi virtual xotirani sanaydi"
    answer: 1
    explain: "pkg runtime/metrics: /memory/classes/total - runtime read-write xaritalagan barcha xotira; heap/free OS'ga qaytarilishi mumkin, lekin hali qaytarilmagan xotira; heap/released qaytarilgan; alohida stack, mcache/mspan metadata sinflari bor. 'Uch baravar' kabi doimiy nisbat yo'q."
task:
  title: "Alohida ajratishlarni slab bilan almashtirish"
  prompt: |
    Telemetriya qabul qilish servisi har paketdagi 1000 ta o'lchov uchun alohida `&Reading{}` ajratadi. Ajratish tezligi GC chastotasini belgilaydi, shuning uchun hot path'da ajratishlar sonini kamaytirish kerak.

    Boshlang'ich `build(n)` n ta alohida obyekt va ko'rsatkichlar slice'ini ajratadi: `testing.AllocsPerRun` n+1 ta ajratishni ko'rsatadi. `build` ni qayta yozing, shunda ajratishlar soni 2 dan oshmasin (bitta slab va bitta ko'rsatkichlar slice'i), natija esa avvalgicha: `[]*Reading`, `r[i]` i-o'lchovga ishora qiladi. Imzoni o'zgartirmang.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "testing"
    )

    // Reading - datchikdan kelgan bitta o'lchov (24 bayt, pointer yo'q).
    type Reading struct {
        SensorID uint32
        Value    float64
        TS       int64
    }

    var sink []*Reading

    // build n ta o'lchovni yaratadi va ularga ko'rsatkichlar qaytaradi.
    func build(n int) []*Reading {
        out := make([]*Reading, 0, n)
        for i := 0; i < n; i++ {
            out = append(out, &Reading{SensorID: uint32(i), Value: float64(i) / 2, TS: int64(i)})
        }
        return out
    }

    func main() {
        const n = 1000
        allocs := testing.AllocsPerRun(20, func() { sink = build(n) })
        r := build(n)
        fmt.Println("ajratishlar soni:", allocs)
        fmt.Println("maqsad (<= 2) bajarildi:", allocs <= 2)
        fmt.Println("tekshiruv:", len(r) == n && r[999].SensorID == 999 && r[10].Value == 5)
    }
  solution: |
    package main

    import (
        "fmt"
        "testing"
    )

    // Reading - datchikdan kelgan bitta o'lchov (24 bayt, pointer yo'q).
    type Reading struct {
        SensorID uint32
        Value    float64
        TS       int64
    }

    var sink []*Reading

    // build n ta o'lchovni yaratadi va ularga ko'rsatkichlar qaytaradi.
    func build(n int) []*Reading {
        slab := make([]Reading, n) // bitta katta ajratish
        out := make([]*Reading, n) // ko'rsatkichlar uchun ikkinchisi
        for i := range slab {
            slab[i] = Reading{SensorID: uint32(i), Value: float64(i) / 2, TS: int64(i)}
            out[i] = &slab[i]
        }
        return out
    }

    func main() {
        const n = 1000
        allocs := testing.AllocsPerRun(20, func() { sink = build(n) })
        r := build(n)
        fmt.Println("ajratishlar soni:", allocs)
        fmt.Println("maqsad (<= 2) bajarildi:", allocs <= 2)
        fmt.Println("tekshiruv:", len(r) == n && r[999].SensorID == 999 && r[10].Value == 5)
    }
  solutionNotes: |
    - `make([]Reading, n)` bitta katta obyekt ajratadi (n x 24 bayt), `make([]*Reading, n)` esa ko'rsatkichlar uchun ikkinchisi: jami 2 ta ajratish.
    - `&slab[i]` slab ichiga ishora qiladi. Ko'rsatkich obyektning istalgan qismiga ishora qilsa, butun obyekt tirik bo'ladi, shuning uchun bitta element ushlanib qolsa butun slab ushlanadi. Bu yechim faqat o'lchovlar guruh bo'lib ishlatilib, birga tashlansa mos.
    - `Reading` pointer saqlamaydi, shuning uchun slab pointer-free obyekt va GC uni skanerlamaydi (gc-guide).
    - Agar kod `[]*Reading` o'rniga `[]Reading` bilan ishlay olsa, ko'rsatkichlar slice'i ham kerak bo'lmaydi: ajratish 1 taga tushadi.
    - Kutilgan chiqish: `ajratishlar soni: 2`, `maqsad (<= 2) bajarildi: true`, `tekshiruv: true`.
  checklist:
    - "`testing.AllocsPerRun` natijasi 2 yoki undan kam"
    - "`r[999].SensorID == 999` va `r[10].Value == 5` tekshiruvi `true`"
    - "Imzo (`build(n int) []*Reading`) o'zgarmagan"
    - "Slab bilan bog'liq xotirani ushlab turish xavfi yechim izohida yozilgan"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

JavaScript'da obyekt yaratish deyarli hisobga olinmaydi: V8 yosh avlod uchun tez ajratish yo'lini va ko'chiruvchi (moving) GC'ni ishlatadi. Go'da vaziyat boshqacha. Go GC'si obyektlarni ko'chirmaydi va avlodlarga bo'lmaydi (manba kodidagi izoh: non-generational va non-compacting; gc-guide: non-moving), shuning uchun xotira boshqaruvi allocator'ning o'zida bajariladi: u obyektni qayerga joylashtirishni, bo'sh joyni qanday topishni va xotirani qachon operatsion tizimga qaytarishni hal qiladi.

Production'da bu quyidagicha seziladi. Birinchidan, ajratish tezligi (allocation rate) GC chastotasini belgilaydi (56-dars): gc-guide'ga ko'ra GC xarajatining asosiy omillaridan biri shu. Hot path'dagi har bir `&T{}` kelajakda GC ishini ko'paytiradi. Ikkinchidan, "servis 300 MB heap ishlatyapti, nega RSS 900 MB?" savoli deyarli hamma jamoada bo'ladi, va javob allocator'ning xotirani qanday ushlab turishida. Uchinchidan, `GODEBUG=gctrace=1` yoki heap profili ko'rsatgan raqamlarni (60, 63-darslar) allocator tuzilmasini bilmay tushunib bo'lmaydi: nega 33 baytlik obyekt 48 bayt hisoblanadi?

Bu dars allocator'ning tuzilishini hujjatlar va runtime manba kodidagi izohlar darajasida ko'rib chiqadi, va har bir muhim da'voni o'lchov bilan tasdiqlaydi. Muhim ogohlik: size class jadvali, sahifa o'lchami va sath tuzilmasi implementatsiya tafsilotlari. Ularni Go 1.24.7 va Go 1.27.0 manba kodidagi `malloc.go` izohlaridan tekshirdik, lekin ilova kodi ularga tayanmasligi kerak.

## Asosiy g'oya

### Kichik va katta obyektlar

`malloc.go` ning kirish izohi allocator qanday ishlashini aytadi. Uning kelib chiqishi tcmalloc'ga asoslangan (gc-guide'ning "Additional resources" bo'limi ham Go memory allocator TCMalloc'ga asoslangani haqida yozadi), lekin ancha farq qilib ketgan. Asosiy g'oya: allocator sahifalar ketma-ketligi (run of pages) bilan ishlaydi. Sahifa 8192 bayt. Kichik hajmlar (32 KB gacha, shu jumladan) 70 ga yaqin size class'ning biriga yaxlitlanadi, har class'ning o'z bo'sh obyektlar to'plami bor. Istalgan bo'sh sahifani bitta size class'dagi obyektlarga bo'lish mumkin, ular free bitmap bilan boshqariladi.

Muhim natija: bitta sahifadagi (aniqrog'i, bitta mspan'dagi) hamma obyekt bir xil hajmda. Bu fragmentatsiyani kamaytiradi va GC metadata'sini oddiy qiladi: har obyekt uchun bir bit (belgilangan/belgilanmagan). 55-darsda ko'rasiz, GC aynan shu bitmap'larni to'ldiradi; Green Tea GC (57-dars) esa sahifa darajasida ishlash g'oyasiga tayanadi.

32 KB dan katta obyektlar mcache va mcentral'ni aylanib o'tib, to'g'ridan-to'g'ri `mheap`dan ajratiladi va bo'shatiladi.

### Beshta tuzilma

Izohda sanalgan allocator tuzilmalari:

| Tuzilma | Vazifasi |
|---|---|
| `mcache` | har P uchun alohida kesh: har size class uchun bo'sh joyli mspan |
| `mspan` | bir size class'ga bo'lingan sahifalar ketma-ketligi |
| `mcentral` | bitta size class'dagi hamma mspan'larni yig'adi |
| `mheap` | malloc heap'i, 8192 baytli sahifalar bilan boshqariladi |
| `fixalloc` | allocator o'zi uchun metadata ajratadigan, heap'dan tashqaridagi qat'iy hajmli ajratgich |

Kichik obyekt ajratish zanjir bo'ylab yuqoriga ko'tariladi:

1. Hajm size class'ga yaxlitlanadi va shu P'ning `mcache`idagi mspan'ning free bitmap'idan bo'sh slot qidiriladi. Topilsa, ajratish tugadi. Bu butunlay lock olmasdan bajarilishi mumkin: P'ga bog'liq ma'lumot (51-dars) shu yerda foyda beradi.
2. Mspan to'lgan bo'lsa, `mcentral`dan bo'sh joyli yangi mspan olinadi. Butun span olish mcentral lock narxini ko'p ajratishga bo'lib yuboradi.
3. mcentral'da yo'q bo'lsa, `mheap`dan sahifalar ketma-ketligi olinadi.
4. mheap'da ham yetarli bo'lmasa, operatsion tizimdan yangi sahifalar guruhi (kamida 1 MB) so'raladi. Katta bo'lak so'rash tizim bilan muloqot narxini bo'lib yuboradi.

Manba kodidagi izoh heap'ni arenalardan iborat deb tasvirlaydi: 64-bitli tizimlarda arena 64 MB, har biri o'z metadata'si (`heapArena`) bilan. Bu ham implementatsiya tafsiloti.

### Tozalash allocator bilan bog'langan

Sweeping (55-dars) bilan allocator bir-biriga ulangan: mgc.go izohiga ko'ra, goroutine yangi span kerak bo'lganda avval sweep qilib xotira qaytarib olishga urinadi, operatsion tizimdan ko'proq xotira so'ramaslik uchun. Ya'ni sweep faqat orqa fonda emas, ajratish paytida ham (lazy) bajariladi, va tozalanmagan span'lar bor ekan, allocator yangi xotira so'ramaydi.

## Chuqurroq: tiny allocator, metadata va xotira sinflari

### Tiny allocator

Juda kichik, pointer saqlamaydigan obyektlar uchun alohida yo'l bor. `runtime.SetFinalizer` hujjati buni bilvosita tasdiqlaydi: runtime joyni tejash uchun obyektlarni bitta ajratish slotiga birlashtirishi mumkin; bu odatda 16 bayt atrofidagi va undan kichik pointer-free obyektlarga tegishli. `runtime/metrics` hujjati `/gc/heap/tiny/allocs:objects` metrikasini shunday tavsiflaydi: bloklarga birlashtirilgan kichik ajratishlar soni, ularning har biri alohida hisoblanmaydi, faqat bloklar sanaladi.

Bu finalizer va weak pointer uchun oqibat beradi (59-dars): bunday obyekt boshqa tirik obyekt bilan bir blokda yashasa, uning finalizer'i, cleanup'i yoki weak pointer'i hech qachon ishlamasligi mumkin.

### Katta obyektlar sahifa granulyarligida

32 KB dan katta ajratish mheap'dan butun sahifalar bilan olinadi. Bu darsdagi birinchi o'lchovda ko'rinadi.

### Metadata va boshqa xotira

HACKING.md "Unmanaged memory" bo'limida allocator uchun ham xotira kerakligini yozadi: ba'zan runtime GC bilan boshqariladigan heap'dan tashqarida xotira ajratishi kerak (xotira menejerining o'zi uchun yoki chaqiruvchida P bo'lmagan vaqtda). Uch mexanizm: `sysAlloc` (OS'dan butun sahifalar), `persistentalloc` (kichik ajratishlarni birlashtiradi, bo'shatib bo'lmaydi) va `fixalloc` (qat'iy hajmli SLAB-uslubidagi ajratgich). Ular GC tomonidan skanerlanmaydigan xotira, shuning uchun `runtime/metrics` ularni alohida sinflarda ko'rsatadi: `/memory/classes/metadata/mcache/inuse:bytes`, `/memory/classes/metadata/mspan/inuse:bytes`, `/memory/classes/metadata/other:bytes`.

HACKING.md yana bir muhim narsani eslatadi: `mallocgc` ichida (ajratish jarayonida) panic chaqirilsa, u darhol fatal xatoga aylanadi. Shuning uchun runtime kodi ajratish paytida xato holatlarini `panic` bilan emas, `throw` bilan ishlaydi.

### Heap va RSS nega farq qiladi

gc-guide'ning "virtual memory haqida eslatma" bo'limi: runtime hech qachon xaritalagan virtual xotirasini o'chirmaydi, balki operatsion tizimning maxsus operatsiyalari bilan fizik xotirani qaytaradi. Shuning uchun `top`dagi VSS foydasiz, RSS esa fizik xotirani aks ettiradi. Go FAQ ham virtual xotira katta ko'rinishining sababini allocator katta virtual maydonni arena sifatida zaxiralashi bilan tushuntiradi. `runtime/metrics` shu manzarani sinflarga bo'ladi: `heap/objects` (tirik va hali sweep qilinmagan o'lik obyektlar), `heap/free` (bo'sh, OS'ga qaytarilishi mumkin, lekin qaytarilmagan), `heap/released` (qaytarilgan), `heap/unused`, `heap/stacks`, va hammasining yig'indisi `/memory/classes/total:bytes`. Memory limit (56-dars) aynan `total` minus `heap/released` ni cheklaydi.

GODEBUG sozlamalari xotirani qaytarishni kuzatishga yordam beradi: `scavtrace=1` scavenger (xotirani OS'ga qaytaruvchi) ishi haqida har GC siklida bir qator chiqaradi, `madvdontneed` Linux'da qaytarish usulini tanlaydi (RSS qanchalik tez tushishiga ta'sir qiladi). Bular runtime paketi hujjatida tavsiflangan.

### Go 1.27: size-specialized ajratish

Go 1.27 release notes: compiler endi hajmi 80 baytdan kichik ba'zi ajratishlar uchun size-specialized runtime funksiyalarini chaqiradi; kichik ajratishlar narxi 30% gacha kamayishi mumkin, real ajratish-og'ir dasturlarda umumiy yaxshilanish esa ~1% kutiladi, binary 60 KB atrofida kattalashadi. Opt-out: build vaqtida `GOEXPERIMENT=nosizespecializedmalloc`, u Go 1.28 da olib tashlanishi kutiladi. Bu bo'lim Go 1.27 release notes'iga tayanadi, lokal sinalmagan (sandbox'da Go 1.24.7). Raqamlar bizning o'lchovimiz emas.

## Misol: size class'larni o'lchash

Dastur turli hajmdagi pointer-free baytlar slice'ini 20000 martadan ajratadi (ular global `keep`da saqlanadi, shuning uchun heap'ga qochadi) va `runtime.MemStats.TotalAlloc` o'sishini ajratishlar soniga bo'ladi:

```go
package main

import (
	"fmt"
	"runtime"
)

var keep [][]byte

// measure n baytli (pointer-free) obyektni count marta ajratadi va
// runtime hisobiga ko'ra bitta obyekt uchun ajratilgan baytni qaytaradi.
func measure(n, count int) (perObj float64, mallocs uint64) {
	keep = make([][]byte, 0, count) // ro'yxatning o'zi o'lchovdan oldin ajratiladi
	runtime.GC()
	var a, b runtime.MemStats
	runtime.ReadMemStats(&a)
	for i := 0; i < count; i++ {
		keep = append(keep, make([]byte, n)) // keep'ga yozilgani uchun heap'ga qochadi
	}
	runtime.ReadMemStats(&b)
	return float64(b.TotalAlloc-a.TotalAlloc) / float64(count), b.Mallocs - a.Mallocs
}

func main() {
	fmt.Printf("%9s %18s %9s\n", "so'ralgan", "ajratilgan/obyekt", "mallocs")
	for _, n := range []int{1, 8, 16, 17, 24, 33, 100, 500, 1000, 1025, 4000, 32768, 32769} {
		per, m := measure(n, 20000)
		fmt.Printf("%9d %18.1f %9d\n", n, per, m)
	}
}
```

Go 1.24.7, linux/amd64, 2 vCPU. Natija ikkala ishga tushirishda bir xil chiqdi (500 baytlik qatorda `mallocs` bir marta 20001 bo'ldi, boshqa jarayon ajratishi shovqini):

```text
so'ralgan  ajratilgan/obyekt   mallocs
        1                1.0     20000
        8                8.0     20000
       16               16.0     20000
       17               24.0     20000
       24               24.0     20000
       33               48.0     20000
      100              112.0     20000
      500              512.0     20001
     1000             1024.0     20000
     1025             1152.0     20000
     4000             4096.0     20000
    32768            32768.0     20000
    32769            40960.0     20000
```

Qatorlarni o'qing. 17 baytlik so'rov 24 ga, 33 baytlik 48 ga, 100 baytlik 112 ga, 1025 baytlik 1152 ga yaxlitlandi: jadvalda ikkining darajalari ham, sakkizning karralari ham bor, lekin ular orasida teshiklar bor. Eng katta kichik class 32768 bayt (aynan 32 KB); 32769 bayt esa 40960 ga chiqdi, ya'ni 5 ta 8192 baytlik sahifa. 1 baytlik so'rov uchun hisob 1.0: bu tiny allocator ishi bo'lishi mumkin (obyektlar umumiy blokka joylashadi va hisobda so'ralgan hajm bilan chiqadi), lekin bu bizning izohimiz, biz uni alohida o'lchamadik.

Yaxlitlash xarajati ichki fragmentatsiya: 33 baytlik obyekt 15 bayt (31%) isrof qiladi. Struct maydonlarini size class chegarasiga "mosla"shga urinmang: jadval implementatsiya tafsiloti, versiyalar o'rtasida o'zgarishi mumkin.

Ikkinchi dastur `runtime/metrics` orqali shu jadvalni to'g'ridan-to'g'ri ko'rsatadi, chunki `/gc/heap/allocs-by-size:bytes` histogrammasining bucket chegaralari size class'lar atrofida qurilgan:

```go
package main

import (
	"fmt"
	"runtime/metrics"
)

func main() {
	s := []metrics.Sample{
		{Name: "/gc/heap/allocs-by-size:bytes"},
		{Name: "/memory/classes/metadata/mcache/inuse:bytes"},
		{Name: "/memory/classes/metadata/mspan/inuse:bytes"},
		{Name: "/memory/classes/heap/objects:bytes"},
	}
	metrics.Read(s)
	h := s[0].Value.Float64Histogram()
	fmt.Println("bucket chegaralari soni:", len(h.Buckets))
	fmt.Println("birinchi 12:", h.Buckets[:12])
	fmt.Println("oxirgi 4:", h.Buckets[len(h.Buckets)-4:])
	fmt.Println("mcache inuse:", s[1].Value.Uint64(), "bayt")
	fmt.Println("mspan inuse:", s[2].Value.Uint64(), "bayt")
	fmt.Println("heap objects:", s[3].Value.Uint64(), "bayt")
}
```

```text
bucket chegaralari soni: 69
birinchi 12: [1 9 17 25 33 49 65 81 97 113 129 145]
oxirgi 4: [27265 28673 32769 +Inf]
mcache inuse: 2416 bayt
mspan inuse: 24960 bayt
heap objects: 8064 bayt
```

Chegaralar 1, 9, 17, 25, 33, 49 ... 8 baytlik qadam bilan boshlanadi va 16 lik qadamga o'tadi; 69 chegara 68 oraliq beradi, bu malloc.go izohidagi "70 ga yaqin" size class bilan mos. Oxirgi chegara 32769 bo'lib, undan katta ajratishlar katta obyektlar. Faqat boshlang'ich holatdagi (kichik) dastur uchun metadata hajmlari: mcache 2.4 KB, mspan 25 KB (qayta ishga tushirishda mspan 14.7 KB chiqdi, ya'ni bu son ishga tushirishlar orasida o'zgaradi).

## Qachon qo'llamaslik kerak

- Size class jadvaliga qarab struct'larni "yaxlitlamang" va padding qo'shmang. Jadval hujjatlashtirilmagan va o'zgaradi (Go 1.27 da ajratish yo'llari o'zgarishi ham shuning isboti). Struct'ni maydonlar tartibi va keshga moslashuvi nuqtai nazaridan loyihalang (16, 66-darslar).
- Hamma narsani slab'ga o'ramang. Mashqdagi yechim ajratishlarni 1001 dan 2 ga tushiradi, lekin bitta ko'rsatkich qolsa butun slab tirik qoladi. Hayot davrlari bir xil obyektlar guruhi uchun foydali, aralash hayot davrlari uchun xavfli.
- `GODEBUG=sbrk=1`, `efence=1` kabi sozlamalar faqat disk raskadrovka uchun: runtime hujjatiga ko'ra sbrk allocator va GC'ni hech qachon xotira qaytarmaydigan oddiy ajratgichga almashtiradi.
- RSS'ni heap bilan tenglashtirmang. Yagona son (`heap objects`) hamma xotirani aks ettirmaydi; production dashboard'ida kamida `/memory/classes/total:bytes`, `heap/released` va `heap/objects` ni birga ko'rsating.
- Mikro-optimallashtirishdan oldin o'lchang. Ajratishlar sonini kamaytirish foyda berishi uchun u haqiqiy hot path'da bo'lishi kerak (62, 63-darslar).

## Stack'da: Node.js/TypeScript bilan farq

- V8 yosh avlod va ko'chiruvchi GC bilan ishlaydi, `process.memoryUsage()` esa heapUsed, heapTotal va rss'ni beradi. Go'da obyektlar ko'chmaydi, shuning uchun ko'rsatkichlar barqaror (cgo uchun foydali), lekin fragmentatsiya size class va span darajasida boshqariladi. Qiyoslash muallifning umumiy bilimiga tayanadi, dars manbalarida V8 haqida ma'lumot yo'q.
- Go'da qiymat semantikasi (struct, massiv, ko'rsatkichsiz maydonlar) ajratishlarni kamaytirishga imkon beradi: `[]Reading` bitta ajratish, JavaScript'da obyektlar massivi esa ko'p obyekt. Ma'lumot tuzilmalarini dizayn qilganda pointer'siz maydonlarni afzal ko'ring, bu GC va allocator uchun arzonroq.
- Monitoring: Prometheus kabi tizimlarga heap sinflari (`/memory/classes/*`) va `/gc/heap/allocs:bytes` chiqaring (85-dars). Ajratish tezligi (bayt/soniya) GC chastotasining asosiy belgisi.
- Kod tekshiruvi: `go test -bench . -benchmem` allocs/op ni beradi (61-dars), `testing.AllocsPerRun` esa unit testda ajratishlar soni regressiyasini ushlaydi (mashqdagi kabi).

## Xulosa

- Kichik obyektlar (32 KB gacha) 70 ga yaqin size class'ning biriga yaxlitlanadi: o'lchovda 17 -> 24, 33 -> 48, 1025 -> 1152; undan kattalari mheap'dan butun 8 KiB sahifalar bilan ajratiladi (32769 -> 40960).
- Ajratish zanjiri: P ning mcache'i (lock'siz) -> mcentral -> mheap -> operatsion tizim. Har pog'ona narxni ko'p ajratishga bo'lib yuboradi.
- Kichik pointer-free obyektlar tiny allocator tufayli birlashtirilishi mumkin; bunday obyektlarda finalizer yoki cleanup ishlamay qolishi mumkin.
- Heap, metadata, stack va OS'ga qaytarilgan xotira alohida sinflar: RSS va `heap/objects` farqi odatiy, `/memory/classes/*` metrikalari buni tushuntiradi.
- Ajratishlar sonini kamaytirish (slab, pointer'siz maydonlar) GC yukini kamaytiradi, lekin bitta ko'rsatkich butun slab'ni ushlab turadi: o'lchab, trade-off'ni bilib qo'llang.
