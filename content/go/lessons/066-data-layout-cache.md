---
n: 66
slug: data-layout-cache
title: "Ma'lumot joylashuvi: cache, false sharing va SoA"
summary: "CPU cache va cache line modeli, struct maydonlari tartibi va padding (unsafe.Sizeof, Offsetof), struct massivi va massivlar strukturasi (AoS va SoA), kirish tartibining narxi, false sharing va uni padding bilan bartaraf etish, hamda GC uchun ko'rsatkichlardan qochish."
duration: 40
sources:
  - id: 100go
    note: "Optimizations bo'limi: #91 Not understanding CPU caches, #92 Writing concurrent code that leads to false sharing, #94 Not being aware of data alignment"
  - id: pkg-unsafe
    note: "Sizeof, Alignof va Offsetof hujjatlari: struct hajmi maydon alignment'idan kelib chiqqan padding'ni ham o'z ichiga oladi"
  - id: gc-guide
    note: "Implementation-specific optimizations bo'limi: pointer-free qiymatlar ajratiladi, GC oxirgi ko'rsatkichda skanerlashni to'xtatadi, indekslar ko'rsatkichdan GC uchun arzonroq"
quiz:
  - q: "`struct{ A bool; B int64; C bool }` hajmi (amd64) va maydonlarni `B, A, C` tartibiga o'zgartirgandan keyingi hajmi qancha?"
    options:
      - "10 bayt va 10 bayt: padding faqat massivlarda bo'ladi"
      - "24 bayt va 16 bayt: int64 8 baytga tekislanadi, shuning uchun A dan keyin 7 bayt padding va C dan keyin 7 bayt padding bo'ladi; tartiblashdan keyin faqat oxirgi padding qoladi"
      - "24 bayt va 24 bayt: Go maydonlarni o'zi qayta tartiblaydi"
      - "16 bayt va 10 bayt"
    answer: 1
    explain: "Go maydonlarni yozilgan tartibda joylashtiradi (qayta tartiblamaydi). A(1) + 7 padding + B(8) + C(1) + 7 padding = 24. B, A, C: 8 + 1 + 1 + 6 padding = 16. Lokal tajribada 48 baytlik Reading shu usul bilan 32 bayt bo'ldi."
  - q: "1 million yozuvdan faqat Speed maydonini yig'ish kerak. Struct 64 bayt (har yozuv bitta cache line). Nega massivlar strukturasi (SoA) tezroq?"
    options:
      - "Chunki SoA kamroq goroutine ishlatadi"
      - "Chunki Go struct maydonlarini o'qishni sekinlashtiradi"
      - "Chunki SoA'da float64 qiymatlari kompilyatorga ko'rinmaydi"
      - "AoS har yozuv uchun butun cache line'ni yuklaydi (64 MB) va uning 8 baytidan foydalanadi; SoA'da Speed massivi zich, faqat kerakli 8 MB o'qiladi va bitta cache line 8 qiymat beradi"
    answer: 3
    explain: "Xotira o'tkazuvchanligi va cache aynan shu yerda cheklanadi. Lokal o'lchovda 1 048 576 yozuv uchun AoS median 2.9 ms, SoA 0.75 ms oldi. Sabab qiymatlar soni emas, bir cache line'dan olingan foydali baytlar soni."
  - q: "Ikki goroutine bitta cache line'ga tushgan ikki alohida `atomic.Int64` ni yozmoqda. Sekinlashuv sababi nima?"
    options:
      - "False sharing: har yozuv boshqa yadroning cache nusxasini bekor qiladi (invalidate), line yadrolar orasida qayta-qayta ko'chiriladi, garchi o'zgaruvchilar mantiqan mustaqil bo'lsa ham"
      - "Data race, shuning uchun natija noto'g'ri bo'ladi"
      - "atomic operatsiyalar goroutine'larni bitta thread'ga bog'laydi"
      - "GC har yozuvda ishga tushadi"
    answer: 0
    explain: "Operatsiyalar to'g'ri va race yo'q; muammo ish unumdorligida. Yozuv cache line darajasida kuzatiladi, shuning uchun bir line'dagi ikki mustaqil o'zgaruvchi 'bahslashadi'. Lokal tajribada ikki hisoblagich yonma-yon bo'lganda median 50 va 86 ms, 64 bayt masofa bilan 20 va 21 ms chiqdi."
  - q: "`shard` struct'iga `_ [56]byte` qo'shildi (jami 64 bayt). Massivning boshi 64 baytga tekislanmagan bo'lsa ham, qo'shni elementlar bitta cache line'ga tushmaydimi?"
    options:
      - "Tushadi, shuning uchun alohida alignment kerak"
      - "Tushmaydi, faqat elementlar soni juft bo'lsa"
      - "Tushmaydi: qo'shni elementlarning hisoblagichlari orasidagi masofa aynan 64 bayt, ikki manzil 64 bayt oralig'ida bitta 64 baytlik line'da bo'la olmaydi. Faqat cache line 64 bayt deb faraz qilinadi (ba'zi arxitekturalarda 128)"
      - "Tushmaydi, chunki Go ro'yxat boshini avtomatik 4096 ga tekislaydi"
    answer: 2
    explain: "Stride 64 bayt bo'lgani uchun ikki hisoblagich hech qachon bitta 64 baytlik line'ga sig'maydi, boshlang'ich manzil qanday bo'lmasin. Cache line hajmi esa platformaga bog'liq: bu mashinada 64 bayt (sysfs coherency_line_size), boshqa arxitekturalarda katta bo'lishi mumkin."
  - q: "Bir xil 1M elementli massivda, bir xil qiymatlarni yig'ishda indekslar ketma-ket bo'lganda 3.4 ms, tasodifiy tartibda 11.4 ms oldi. Bu nimani anglatadi?"
    options:
      - "Tasodifiy sonlar generatori sekin"
      - "Kirish tartibi cache va prefetch uchun muhim: ketma-ket o'qishda har cache line to'liq ishlatiladi va CPU keyingisini oldindan yuklaydi, tasodifiy o'qishda har kirish yangi line'ni yuklashga olib keladi"
      - "Go bounds check'ni faqat tasodifiy tartibda bajaradi"
      - "Massiv ketma-ket kirishda GC tomonidan tozalanmaydi"
    answer: 1
    explain: "Ishlar soni bir xil, xotira kirish tartibi farq qiladi. Cache va hardware prefetcher ketma-ket naqshni yaxshi bashorat qiladi. Shu sabab zich slice'lar ko'rsatkichlar graflaridan tezroq ishlaydi."
  - q: "Qaysi holatda SoA'ga o'tish zarar qiladi yoki foyda bermaydi?"
    options:
      - "Yozuvlar millionlab va bitta maydon bo'yicha hisoblash qilinganda"
      - "Telemetriya ustuni bo'yicha agregatlar hisoblanganda"
      - "Yozuvdagi deyarli barcha maydonlar birga o'qilganda yoki yozuv ko'rsatkich sifatida uzatilganda: bitta yozuvni yig'ish bir necha massivga tegishni talab qiladi, kod murakkablashadi"
      - "Hech qachon, SoA har doim tezroq"
    answer: 2
    explain: "SoA bitta yozuv maydonlarini turli massivlarga ajratadi: bitta yozuvga kirish bir nechta cache line'ni talab qiladi. Foyda faqat ko'p yozuvdagi kam maydon bo'yicha tahlilda ko'rinadi. Qaror profil va benchmark bilan qabul qilinadi."
task:
  title: "Struct hajmini kichraytirish va false sharing'ni bartaraf etish"
  prompt: |
    Telemetriya servisida ikkita muammo bor. Birinchisi: `Reading` struct'ining maydon tartibi tufayli u 48 bayt egallaydi, holbuki hamma maydonlar jami 27 bayt (`unsafe.Sizeof` natijasini ko'ring). Ikkinchisi: har worker o'z `shard` hisoblagichini oshiradi, lekin hisoblagichlar massivda yonma-yon (8 baytdan) turadi va bitta cache line'ni bo'lishadi (false sharing).

    `Reading` maydonlarini qayta tartiblang, shunda hajm 32 bayt bo'lsin; `shard` struct'iga bo'shliq qo'shing, shunda uning hajmi 64 bayt bo'lsin. Maydon nomlari, `countAll` va `main` o'zgarmasin. Kutilgan natija: `Reading hajmi: 32`, `shard hajmi: 64`, `jami: 4000`.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "sync"
        "sync/atomic"
        "unsafe"
    )

    // Reading - bitta datchik o'lchovi. Hozir maydon tartibi xotirani isrof qiladi.
    type Reading struct {
        Active bool
        Speed  float64
        Fuel   bool
        Lat    float64
        Gear   uint8
        Lon    float64
    }

    // shard - har worker o'z hisoblagichini oshiradi.
    type shard struct {
        n atomic.Int64
    }

    func countAll(shards []shard, perWorker int) int64 {
        var wg sync.WaitGroup
        for i := range shards {
            wg.Add(1)
            go func() {
                defer wg.Done()
                for j := 0; j < perWorker; j++ {
                    shards[i].n.Add(1)
                }
            }()
        }
        wg.Wait()
        var total int64
        for i := range shards {
            total += shards[i].n.Load()
        }
        return total
    }

    func main() {
        fmt.Println("Reading hajmi:", unsafe.Sizeof(Reading{}))
        fmt.Println("shard hajmi:", unsafe.Sizeof(shard{}))
        fmt.Println("jami:", countAll(make([]shard, 4), 1000))
    }
  solution: |
    package main

    import (
        "fmt"
        "sync"
        "sync/atomic"
        "unsafe"
    )

    // Reading - bitta datchik o'lchovi. Maydonlar kattadan kichikka tartiblangan.
    type Reading struct {
        Speed  float64
        Lat    float64
        Lon    float64
        Active bool
        Fuel   bool
        Gear   uint8
    }

    // shard - har worker o'z hisoblagichini oshiradi. 56 bayt bo'shliq elementni
    // 64 baytga to'ldiradi, shuning uchun qo'shni hisoblagichlar bitta cache line'ga tushmaydi.
    type shard struct {
        n atomic.Int64
        _ [56]byte
    }

    func countAll(shards []shard, perWorker int) int64 {
        var wg sync.WaitGroup
        for i := range shards {
            wg.Add(1)
            go func() {
                defer wg.Done()
                for j := 0; j < perWorker; j++ {
                    shards[i].n.Add(1)
                }
            }()
        }
        wg.Wait()
        var total int64
        for i := range shards {
            total += shards[i].n.Load()
        }
        return total
    }

    func main() {
        fmt.Println("Reading hajmi:", unsafe.Sizeof(Reading{}))
        fmt.Println("shard hajmi:", unsafe.Sizeof(shard{}))
        fmt.Println("jami:", countAll(make([]shard, 4), 1000))
    }
  solutionNotes: |
    - Go struct maydonlarini yozilgan tartibda joylashtiradi. Katta (8 baytli) maydonlarni oldinga, kichiklarni (bool, uint8) oxirga qo'yish padding'ni kamaytiradi: 3 ta `float64` = 24 bayt, so'ng 3 ta 1 baytli maydon va 5 bayt oxirgi padding = 32.
    - GC qo'llanmasi ko'rsatkich maydonlarini struct boshiga qo'yishni tavsiya qiladi (GC oxirgi ko'rsatkichda skanerlashni to'xtatadi). Bu struct'da ko'rsatkich yo'q, shuning uchun hajm bo'yicha tartiblash yetarli. Ko'rsatkichli struct'larda ikki talabni birga ko'ring.
    - `_ [56]byte` `atomic.Int64` (8 bayt) bilan birga 64 bayt beradi. Qo'shni hisoblagichlar orasidagi masofa 64 bayt bo'lgani uchun ular bitta 64 baytlik cache line'ga tushmaydi.
    - 64 bayt x86-64 uchun odatiy cache line hajmi (bu mashinada tasdiqlandi); boshqa arxitekturalarda boshqacha bo'lishi mumkin. Padding xotirani oshiradi, shuning uchun uni faqat o'lchov bahsni ko'rsatganda qo'llang.
    - Haqiqiy foyda `go test -bench` bilan tasdiqlanadi (darsdagi `BenchmarkSharedLine` va `BenchmarkPaddedLine`); `go run` faqat hajmlarni tekshiradi.
  checklist:
    - "`Reading` hajmi `32` (maydon tartibi kattadan kichikka)"
    - "`shard` hajmi `64` (`_ [56]byte` bilan)"
    - "`countAll` natijasi `4000`"
    - "Maydon nomlari va `countAll` o'zgarmagan"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Dasturchi algoritmni o'ylaydi: "O(n) tsikl, tezroq bo'lishi mumkin emas". Lekin bir xil O(n) tsikl ikki xil ma'lumot joylashuvida bir necha baravar farq qilishi mumkin. Sabab protsessor xotiraga bayt-bayt emas, 64 baytlik bloklar (cache line) bilan murojaat qilishi va keshni tashkil qilishi. Dasturning ma'lumotlari cache'ga qanchalik yaxshi sig'sa va ketma-ket o'qilsa, u shunchalik tez ishlaydi. Boshqa tomondan, ikki goroutine mantiqan bog'liq bo'lmagan ikki o'zgaruvchini yozsa ham, ular bitta cache line'da tursa, yadrolar bir-biriga halaqit beradi (false sharing).

Node.js'da bu mavzuga kamdan-kam duch kelinadi: JavaScript obyektlari V8 tomonidan joylashtiriladi, massivlar esa ko'pincha ko'rsatkichlar massividir. Go'da esa struct maydonlari, massiv elementlari va slice'lar xotirada qanday joylashishini siz aniq bilasiz va boshqarasiz. Bu qobiliyat javobgarlik ham beradi: yomon tartib cache'ni isrof qiladi.

Bu dars to'rt narsani ko'radi: struct hajmi va padding, struct massivi va massivlar strukturasi (AoS va SoA), kirish tartibi va false sharing. Barcha raqamlar shu mashinada o'lchangan: Go 1.24.7, linux/amd64, Intel Xeon 2.10GHz, 2 vCPU, cache line 64 bayt (sysfs `coherency_line_size`), L1d 48 KiB har yadroga, L2 2 MiB har yadroga (`lscpu` ma'lumotidan: 96 KiB va 4 MiB, ikki nusxa).

## Asosiy g'oya

### Cache va cache line

Protsessor operativ xotiradagi ma'lumotni cache line (x86-64 da odatda 64 bayt) bo'lakchalarida yuklaydi. Bitta baytni o'qisangiz, butun line keladi. Shu line'dagi qo'shni baytlar keyingi o'qishlarda bepul. Ketma-ket o'qish naqshini esa CPU oldindan bashorat qilib, keyingi line'larni yuklab qo'yadi (prefetch). Natija: zich joylashgan, ketma-ket o'qiladigan ma'lumot tez, tarqoq va tasodifiy o'qiladigan ma'lumot sekin. "100 Go Mistakes" kitobi bu mavzuni alohida xato sifatida ko'rsatadi (#91 Not understanding CPU caches), shuningdek #92 (false sharing) va #94 (data alignment) xatolarini.

### Hajm, alignment va padding

Har tip o'z alignment'iga ega: `bool` va `uint8` uchun 1, `int64` va `float64` uchun 8 bayt. Kompilyator maydonni uning alignment'ining karrali manziliga qo'yadi, oradagi bo'shliq padding. `unsafe` hujjatiga ko'ra `Sizeof` struct uchun maydon alignment'idan kelib chiqqan padding'ni ham o'z ichiga oladi; u slice yoki interface uchun faqat descriptor hajmini qaytaradi, ko'rsatilgan ma'lumotni emas. `Alignof` kerakli alignment'ni, `Offsetof` maydonning struct boshidan siljishini beradi.

GC qo'llanmasi muhim cheklov qo'shadi: struct maydonlari manba kodida yozilgan tartibda joylanadi (compiler qayta tartiblamaydi), GC esa qiymatni oxirgi ko'rsatkichgacha skanerlaydi. Shu sabab ko'rsatkich maydonlarini struct boshiga qo'yish GC uchun foydali. Hajm bo'yicha tartiblash ("kattadan kichikka") va GC uchun tartiblash ("ko'rsatkichlar oldinda") ba'zan ziddiyatli; qaror profil bilan qabul qilinadi.

### AoS va SoA

Struct massivi (array of structs, **AoS**) `[]Telemetry` - har element barcha maydonlarni o'z ichiga oladi. Massivlar strukturasi (struct of arrays, **SoA**) esa har maydon uchun alohida slice: `Speed []float64`, `Lat []float64` va hokazo. Faqat bitta maydon bo'yicha hisob (o'rtacha tezlik) qilinsa, AoS har yozuv uchun butun cache line'ni yuklaydi va uning bir qismidan foydalanadi; SoA esa faqat kerakli maydonni zich o'qiydi.

### False sharing

Yozuv cache line darajasida kuzatiladi: bir yadro line'ga yozsa, boshqa yadrolardagi uning nusxalari bekor bo'ladi va line yadrolar orasida ko'chiriladi. Ikki goroutine bir line'dagi ikki alohida o'zgaruvchiga yozsa, mantiqan hech qanday bahs yo'q, lekin line "ping-pong" qiladi. Davosi: bahs qiluvchi o'zgaruvchilarni kamida cache line hajmicha ajratish (padding).

## Chuqurroq: o'lchovlar va cheklovlar

### Padding qaysi qiymatni kafolatlaydi

64 bayt padding "qo'shni hisoblagichlar orasidagi masofa 64 bayt" degani. Ikki manzil aynan 64 bayt farq qilsa, ular bitta 64 baytlik line'ga tusha olmaydi, massivning boshlang'ich manzili qanday bo'lmasin. Shu sababli stride 64 bayt bo'lgan massivda alohida alignment talab qilish shart emas. Lekin 64 - x86-64 uchun odatiy qiymat; Go'da cache line hajmi uchun standart konstanta yo'q (sub-repository `golang.org/x/sys/cpu` o'z `CacheLinePad` tipini beradi, ammo bu yerda tashqi modul yuklanmaydi). Ba'zi arxitekturalarda line katta bo'lishi mumkin; platformangiz uchun qiymatni tekshiring.

### Pointer-lar va GC

GC qo'llanmasi ikki foydali qoidani beradi: pointer-free (ko'rsatkichsiz) qiymatlar boshqa qiymatlardan ajratib joylanadi, shuning uchun ko'rsatkichsiz tuzilmalar GC uchun arzonroq; GC deyarli har ko'rsatkich bilan o'zaro ishlaydi, shuning uchun ko'rsatkich o'rniga slice indekslaridan foydalanish GC xarajatini kamaytirishi mumkin. Qo'llanma ogohlantiradi: bunday optimizatsiyalar kod o'qilishini yomonlashtirishi va Go versiyalarida o'zgarishi mumkin, shuning uchun ularni faqat profil GC marking va scanning ko'p vaqt olishini ko'rsatganda qo'llang.

### Instruction-level parallelism va boshqalar

CPU bir vaqtda bir necha mustaqil buyruqni bajaradi; data hazard (keyingi buyruq oldingisining natijasiga bog'liq) bu parallelizmni kamaytiradi (kitobdagi #93). Bu dars uni o'lchamaydi, lekin cache bilan bir turdagi mashina darajasidagi omil ekanini bilish foydali: bir xil algoritm turli ma'lumot tuzilmasida turlicha tezlikda ishlaydi.

## Misol: to'rt o'lchov

### 1. Struct hajmi

```go
type Reading struct {
	Active bool    // 1 bayt
	Speed  float64 // 8 bayt
	Fuel   bool    // 1 bayt
	Lat    float64 // 8 bayt
	Gear   uint8   // 1 bayt
	Lon    float64 // 8 bayt
}

type ReadingOrdered struct {
	Speed  float64
	Lat    float64
	Lon    float64
	Active bool
	Fuel   bool
	Gear   uint8
}
```

`unsafe.Sizeof`, `Alignof` va `Offsetof` bilan (`go test -v`):

```text
Reading:        size=48 align=8
ReadingOrdered: size=32 align=8
offsets: Active=0 Speed=8 Fuel=16 Lat=24 Gear=32 Lon=40
ordered offsets: Speed=0 Lat=8 Lon=16 Active=24 Fuel=25 Gear=26
```

Maydonlar yig'indisi 27 bayt. Birinchi tartibda har 1 baytli maydondan keyin 7 bayt padding, jami 48. Tartiblangan variantda uchta 8 baytli maydon, so'ng uchta 1 baytli maydon va 5 bayt oxirgi padding: 32. Bir million yozuv uchun farq 16 MB, ya'ni cache'ga sig'adigan yozuvlar 1.5 baravar ko'p.

### 2. AoS va SoA

`Telemetry` 64 baytli struct (8 maydon), 1 048 576 ta yozuv. `SumSpeedAoS` `ts[i].Speed` ni yig'adi, `SumSpeedSoA` `Speed []float64` ni. Natija `go test -bench -count=8`, qiymatlar o'sish tartibida (mikrosekund), median bilan:

```text
SumSpeedAoS: 2858 2859 2878 2915 2931 3007 3221 3231   (median 2923 us)
SumSpeedSoA:  713  733  750  751  753  756  769  827   (median  752 us)
```

SoA 3.9 baravar tez. Oraliqlar kesishmaydi. Sabab: AoS har yozuv uchun butun 64 baytlik line'ni yuklaydi (jami 64 MiB), SoA esa faqat 8 MiB zich massivni o'qiydi, bitta line'dan 8 qiymat oladi.

### 3. Kirish tartibi

Bir xil `[]Telemetry` va bir xil indekslar to'plami, farqi faqat tartibda: `idx` ketma-ket yoki `rand.Shuffle` bilan aralashtirilgan:

```text
AccessSequential: 3274 3310 3394 3400 3464 3504 3589 3596   (median  3432 us)
AccessRandom:    10947 10993 11242 11439 11461 11491 11594 11999   (median 11450 us)
```

Ishlar soni bir xil, tasodifiy tartib 3.3 baravar sekin. Ketma-ket o'qishda har line to'liq ishlatiladi va prefetch ishlaydi; tasodifiy o'qishda har kirish ko'pincha yangi line yuklaydi. (Indekslar massivi har ikkala holatda ketma-ket o'qiladi, farq faqat `ts[j]` ga kirishda.) Bu ko'rsatkichlar graflari, bog'langan ro'yxatlar va `map` bilan to'la tuzilmalar nega zich slice'dan sekin ekanini ham tushuntiradi.

### 4. False sharing

```go
type Counters struct {
	A atomic.Int64
	B atomic.Int64
}

type PaddedCounters struct {
	A atomic.Int64
	_ [56]byte
	B atomic.Int64
	_ [56]byte
}
```

`unsafe.Sizeof`: `Counters` 16 bayt (A va B bir line'da), `PaddedCounters` 128 bayt. Ikki goroutine har biri 2 000 000 marta o'z hisoblagichiga `Add(1)` qiladi. `-count=12` ning ikkita ketma-ket guruhi, millisekund, o'sish tartibida:

```text
1-guruh Shared: 32 32 34 35 46 49 51 53 55 68 68 83   (median 50)
1-guruh Padded: 16 18 18 18 19 20 20 21 21 23 26 39   (median 20)
2-guruh Shared: 60 65 72 73 74 86 86 88 89 90 91 107  (median 86)
2-guruh Padded: 18 18 19 20 20 21 21 22 23 24 28 32   (median 21)
```

Padded variant barqaror 20 ms atrofida, shared esa 2.5-4 baravar sekin va juda notekis (32 dan 107 gacha). Shared tarqoqligi katta, chunki virtual mashina yadrolari boshqa yuklama bilan bo'lishiladi; absolyut sonlar boshqa mashinada farq qiladi, lekin yo'nalish bir xil. Ikki hisoblagichning mantiqiy hech qanday bahsi yo'q, farqni faqat cache line beradi.

Topshiriqda xuddi shu ikki tuzatishni (maydon tartibi va padding) o'zingiz qo'llaysiz.

## Qachon qo'llamaslik kerak

- Profil cache yoki memory bandwidth muammosini ko'rsatmasa, ma'lumot tuzilmasini o'zgartirmang. SoA kodni murakkablashtiradi: bitta yozuvni qayta yig'ish bir nechta massivga tegadi, tartiblash va filtrlash zanjirlari uzayadi.
- SoA yozuvdagi deyarli hamma maydonlar birga o'qilganda foyda bermaydi, hatto zarar qiladi: bitta yozuv bir necha line'ga tarqaladi.
- Padding xotirani oshiradi. Millionlab elementli massivda har element 64 baytga to'ldirilsa, xotira 8 baravar o'sadi. Faqat haqiqatan bahs qilinadigan hisoblagichlar uchun ishlating (per-worker, per-shard).
- Maydon tartibini hajm uchun o'zgartirish ko'rsatkichli struct'larda GC qo'llanmasi tavsiyasi bilan to'qnashishi mumkin (ko'rsatkichlar oldinda). Ikkalasini o'lchab, afzalini tanlang.
- Cache line 64 bayt degan farazga qattiq bog'lanmang; ko'chma kodda platformani hisobga oling.
- Mikro-darajadagi o'lchov bitta mashinada olingan; boshqa CPU (cache hajmi, prefetcher) boshqa natija beradi. Raqamlarni kod qarori uchun emas, yo'nalish uchun ishlating va o'z yuklamangizda tasdiqlang (61-dars).

## Stack'da: Node.js/TypeScript bilan solishtirish

Node.js'da `Float64Array` va `ArrayBuffer` zich xotira beradi (SoA ning analogi), oddiy obyektlar massivi esa ko'rsatkichlar massividir. Go'da `[]struct` zich: elementlar ketma-ket joylashadi, `[]*struct` esa ko'rsatkichlar massivi va tarqoq. Qoida: ketma-ket o'qiladigan katta ma'lumot uchun `[]T` ni `[]*T` ga afzal ko'ring.

Amaliy tavsiyalar:

- Katta slice'lar uchun `[]*T` o'rniga `[]T` ishlating. Ko'rsatkichlar GC ishini ham, cache miss'ni ham oshiradi.
- Struct maydonlarini yozishda kattadan kichikka tartiblang va `unsafe.Sizeof` bilan tekshiring (`fieldalignment` tahlilchisi bu ishni avtomatlashtiradi, lekin u tashqi vosita va bu yerda sinalmagan).
- Per-worker hisoblagich massivlarida elementlar orasida cache line hajmicha padding qoldiring, so'ng `go test -bench` bilan farqni tasdiqlang.
- Analitik hisoblar (butun avtopark bo'yicha o'rtacha tezlik) uchun SoA yoki ustunli saqlash o'ylab ko'ring; operatsion kod uchun (bitta mashinaning yozuvlari) AoS soddaroq.

## Xulosa

- Protsessor operativ xotirani 64 baytlik cache line bilan o'qiydi. Zich va ketma-ket o'qiladigan ma'lumot tez, tarqoq va tasodifiy o'qiladigan ma'lumot sekin: lokal o'lchovda aynan shu farq 3.3 baravar chiqdi.
- Go struct maydonlarini yozilgan tartibda joylaydi. Maydonlarni kattadan kichikka tartiblash padding'ni kamaytiradi (48 bayt dan 32 baytga). `unsafe.Sizeof/Alignof/Offsetof` bilan tekshiring.
- SoA bitta maydon bo'yicha ko'p yozuvni skanerlashda AoS'dan tezroq (lokal o'lchovda 3.9 baravar), lekin kodni murakkablashtiradi.
- False sharing - mantiqan mustaqil o'zgaruvchilar bir line'da bo'lganda yadrolar bir-birini sekinlatishi. 64 baytlik padding uni bartaraf etdi (median 50-86 ms dan 20-21 ms ga).
- GC uchun ko'rsatkichsiz tuzilmalar va indekslar arzonroq; bu optimizatsiyalarni faqat profil asoslasa qo'llang.
