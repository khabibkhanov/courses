---
n: 61
slug: benchmark
title: "Benchmark: testing.B, B.Loop va benchstat"
summary: "Benchmark nimani o'lchaydi va nimani yashiradi: b.N tsikli, Go 1.24 dagi B.Loop, compiler bilan bog'liq tuzoqlar (dead code elimination), shovqin, -count va benchstat bilan ishonchli solishtirish."
duration: 40
sources:
  - id: pkg-testing
    note: "B tipi: Loop, ReportAllocs, ResetTimer, RunParallel; -benchtime va -benchmem bayroqlari"
  - id: go126
    note: "testing bo'limi: B.Loop endi tsikl tanasida inlining'ga to'sqinlik qilmaydi"
  - id: diagnostics
    note: "Introduction bo'limidagi eslatma: ba'zi diagnostika vositalari bir-biriga xalaqit berishi mumkin, aniq natija uchun ularni alohida ishlating"
quiz:
  - q: "Eski uslubdagi `for i := 0; i < b.N; i++ { SpeedKmh(625) }` benchmark'i 0.3 ns/op ko'rsatdi (bitta CPU tsikliga ham yetmaydi). Eng ehtimolli sabab nima?"
    options:
      - "CPU bu funksiyani juda tez bajaradi, natija to'g'ri"
      - "Compiler funksiyani inline qildi, natija ishlatilmagani uchun hisoblashni va tsikl tanasini olib tashladi"
      - "b.N juda katta tanlangan, shuning uchun o'rtacha kamaygan"
      - "-benchmem bayrog'i berilmagan"
    answer: 1
    explain: "0.3 ns/op real hisoblash bo'lishi mumkin emas. Pure funksiya inline bo'lgach, uning natijasi hech qayerda ishlatilmasa, compiler uni dead code deb o'chiradi va benchmark bo'sh tsiklni o'lchaydi. b.N tanlovi o'rtacha qiymatga bunday ta'sir qilmaydi, -benchmem esa faqat B/op va allocs/op ustunlarini qo'shadi."
  - q: "Go 1.24 dagi `for b.Loop()` eski `for range b.N` ga nisbatan qaysi ikki afzallikni beradi?"
    options:
      - "Har doim tezroq ishlaydi va CPU profilini avtomatik yozadi"
      - "-count ni e'tiborsiz qoldiradi va faqat bir marta o'lchaydi"
      - "b.N ni o'zingiz tanlaysiz va ResetTimer chaqirish shart emas"
      - "Benchmark funksiyasi har -count uchun aniq bir marta ishlaydi (setup bir marta bajariladi), chaqiruv argumentlari va natijalari tirik saqlanadi"
    answer: 3
    explain: "Go 1.24 release notes aynan shu ikki afzallikni sanaydi: funksiya har -count uchun bir marta bajariladi va parametrlar hamda natijalar tirik qoladi, shu sabab compiler tsikl tanasini butunlay o'chira olmaydi. B.Loop tezlikni oshirmaydi va profil yozmaydi, -count esa avvalgidek ishlaydi."
  - q: "Ikki variant uchun 10 ta o'lchov oldingiz: A 163-343 ns/op, B 121-481 ns/op. Oraliqlar katta kesishadi. Qaysi qaror to'g'ri?"
    options:
      - "Ko'proq namuna yig'ish (-count), benchstat bilan statistik solishtirish va deterministik ko'rsatkichlarga (allocs/op) tayanish"
      - "Medianasi kichik variantni tanlash, chunki median har doim ishonchli"
      - "Eng kichik qiymatni (121 ns) olib, B ni tezroq deb e'lon qilish"
      - "Benchmark'ni bir marta qo'shimcha ishga tushirib, oxirgi natijani olish"
    answer: 0
    explain: "Oraliqlar kesishganda vaqt bo'yicha farq statistik jihatdan ishonchsiz. Eng kichik qiymat shovqinning eng 'yaxshi' lahzasi, xolos. allocs/op esa deterministik, shuning uchun u o'zgargan bo'lsa, bu real farq. Yakuniy xulosa benchstat kabi vosita bilan chiqariladi."
  - q: "Go 1.26 release notes B.Loop haqida nimani o'zgartirdi?"
    options:
      - "B.Loop endi parallel benchmark'larni qo'llab-quvvatlaydi"
      - "B.Loop natijalarni faylga yozadi"
      - "Tsikl tanasida inlining'ga to'sqinlik qilmaydi, parametrlar, natijalar va o'zlashtirilgan o'zgaruvchilar esa tirik saqlanadi"
      - "B.Loop o'chirildi va faqat b.N qoldi"
    answer: 2
    explain: "Go 1.24 da B.Loop tsikl tanasidagi chaqiruvlarni inline qilishga to'sqinlik qilardi, bu kutilmagan allocation'larga va sekinroq benchmark'ga olib kelishi mumkin edi. Go 1.26 buni tuzatdi, endi barcha benchmark'larni B.N uslubidan B.Loop ga o'tkazish mumkin."
  - q: "`go test -bench=. -benchtime=100x` buyrug'i nima qiladi?"
    options:
      - "Har benchmark'ni 100 soniya ishlatadi"
      - "Har benchmark'ni 100 marta qaytadan ishga tushiradi va o'rtachasini oladi"
      - "Har benchmark uchun b.N ni aynan 100 ga o'rnatadi (vaqt bo'yicha moslash o'chadi)"
      - "Benchmark'ni 100 ta goroutine'da parallel yuritadi"
    answer: 2
    explain: "`Nx` shakli iteratsiyalar sonini qat'iy belgilaydi. Standart `1s` shakli esa vaqt bo'yicha ishlaydi: framework b.N ni toki umumiy vaqt shu qiymatga yetguncha oshiradi. Qayta ishga tushirishni -count belgilaydi."
  - q: "Eski uslubda natijani himoya qilishning to'g'ri usuli qaysi?"
    options:
      - "Natijani lokal o'zgaruvchiga yozib, hech qayerda ishlatmaslik"
      - "Natijani paket darajasidagi o'zgaruvchiga (sink) yozish"
      - "Funksiyaga //go:noinline qo'yib, natijani chiqarmaslik"
      - "b.StopTimer() ni har iteratsiyada chaqirish"
    answer: 1
    explain: "Lokal o'zgaruvchi ishlatilmasa, compiler uni baribir o'chiradi. Paket darajasidagi sink compiler uchun kuzatiladigan yon ta'sir bo'ladi. //go:noinline chaqiruvni saqlab qoladi, lekin inlining'ni o'chirib benchmark'ni real koddan farqli qiladi (natijani himoya qilishning odatiy usuli emas), StopTimer esa vaqtni boshqaradi, himoya qilmaydi."
task:
  title: "Setup'i tsikldan chiqarilgan batch benchmark"
  prompt: |
    `benchBatch` 1000 qatorli telemetriya paketini tahlil qilish narxini o'lchashi kerak. Hozir har iteratsiyada qatorlar qaytadan yaratiladi (`fmt.Sprintf`), shuning uchun benchmark tahlilni emas, qator yaratishni o'lchaydi va minglab allocation ko'rsatadi.

    `benchBatch`ni qayta yozing: qatorlarni tsikldan oldin bir marta yarating, o'lchanadigan qismni Go 1.24 dagi `for b.Loop()` ichiga qo'ying. `parseSpeed` va `main`ni o'zgartirmang. Natijada `allocs/op` 0 bo'lishi kerak.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "strconv"
        "strings"
        "testing"
    )

    // parseSpeed "imei,lat,lon,tezlik" qatoridan tezlikni oladi.
    func parseSpeed(line string) float64 {
        i := strings.LastIndexByte(line, ',')
        v, err := strconv.ParseFloat(line[i+1:], 64)
        if err != nil {
            return -1
        }
        return v
    }

    // benchBatch 1000 qatorli paketni tahlil qilish narxini o'lchashi kerak.
    func benchBatch(b *testing.B) {
        b.ReportAllocs()
        for i := 0; i < b.N; i++ {
            lines := make([]string, 1000)
            for j := range lines {
                lines[j] = fmt.Sprintf("86612345678%04d,41.31,69.24,%d.5", j, j%120)
            }
            for _, l := range lines {
                parseSpeed(l)
            }
        }
    }

    func main() {
        r := testing.Benchmark(benchBatch)
        fmt.Println("iteratsiyalar > 0:", r.N > 0)
        fmt.Println("allocs/op:", r.AllocsPerOp())
    }
  solution: |
    package main

    import (
        "fmt"
        "strconv"
        "strings"
        "testing"
    )

    // parseSpeed "imei,lat,lon,tezlik" qatoridan tezlikni oladi.
    func parseSpeed(line string) float64 {
        i := strings.LastIndexByte(line, ',')
        v, err := strconv.ParseFloat(line[i+1:], 64)
        if err != nil {
            return -1
        }
        return v
    }

    // benchBatch 1000 qatorli paketni tahlil qilish narxini o'lchaydi.
    func benchBatch(b *testing.B) {
        b.ReportAllocs()
        lines := make([]string, 1000)
        for j := range lines {
            lines[j] = fmt.Sprintf("86612345678%04d,41.31,69.24,%d.5", j, j%120)
        }
        for b.Loop() {
            for _, l := range lines {
                parseSpeed(l)
            }
        }
    }

    func main() {
        r := testing.Benchmark(benchBatch)
        fmt.Println("iteratsiyalar > 0:", r.N > 0)
        fmt.Println("allocs/op:", r.AllocsPerOp())
    }
  solutionNotes: |
    - Qatorlarni yaratish setup. U `for b.Loop()` dan oldin bir marta bajariladi; Loop birinchi chaqirilganda taymer va hisoblagichlar qayta o'rnatiladi, shuning uchun setup'ning allocation'lari `allocs/op`ga kirmaydi (shu mashinada `0` chiqdi).
    - `b.Loop()` ishlatilganda `b.N` bilan qo'lda tsikl yozish shart emas, funksiya har `-count` uchun bir marta chaqiriladi.
    - Go 1.24 da `parseSpeed` chaqiruvining natijasi tirik saqlanadi, shuning uchun alohida sink o'zgaruvchisi kerak emas.
    - `main` ichida `testing.Benchmark` ishlatilgani uchun kod `go run` bilan ishlaydi. Haqiqiy loyihada bu funksiya `_test.go` faylida `BenchmarkXxx(b *testing.B)` nomi bilan yoziladi.
  checklist:
    - "Qatorlar (`fmt.Sprintf`) `for b.Loop()` dan oldin bir marta yaratiladi"
    - "O'lchanadigan qism `for b.Loop()` ichida"
    - "`allocs/op` natijasi `0`"
    - "`parseSpeed` va `main` o'zgarmagan"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

"Bu funksiya sekin" degan fikr deyarli har doim his-tuyg'uga tayanadi. Jamoa `time.Now()` bilan ikki nuqta orasini o'lchaydi, bir marta ishga tushiradi, "ikki barobar tezlashdi" deb yozadi va pull request'ni yuboradi. Production'da esa farq ko'rinmaydi. Sabablar tanish: bitta o'lchov shovqinga to'la, birinchi chaqiruvda cache sovuq, GC tasodifan o'sha lahzada ishga tushgan, compiler esa natija ishlatilmagan hisoblashni umuman bajarmagan.

Node.js'dan kelgan dasturchi bu muammoni biladi: V8'da JIT isinishi, `performance.now()` aniqligi, `tinybench` yoki `benchmark.js` kabi kutubxonalarning mavjudligi shundan. Go'da vosita til bilan birga keladi: `testing.B` va `go test -bench`. U b.N ni o'zi tanlaydi, allocation'larni sanaydi va natijani standart formatda chiqaradi. Lekin vosita to'g'ri ishlatilmasa, ishonchli ko'ringan noto'g'ri raqam beradi. Bu dars benchmark yozishning uch qismini ko'radi: to'g'ri struktura (`B.Loop`), compiler bilan bog'liq tuzoqlar va shovqin sharoitida solishtirish. Keyingi darslardagi har bir optimizatsiya (62-70) shu poydevorga tayanadi: o'lchamasdan turib, optimizatsiya haqida gapirish mumkin emas.

## Asosiy g'oya

### testing.B va b.N

Benchmark - `_test.go` faylidagi `BenchmarkXxx(b *testing.B)` funksiyasi. `go test -bench=.` uni ishga tushiradi. Klassik shakl:

```go
func BenchmarkParseSplit(b *testing.B) {
	for i := 0; i < b.N; i++ {
		ParseSplit(line)
	}
}
```

Framework funksiyani avval `b.N = 1` bilan chaqiradi, so'ng `b.N` ni oshirib boradi, toki umumiy vaqt `-benchtime` ga (standart `1s`) yetguncha. Shu sabab funksiya bir necha marta chaqiriladi va o'lchanadigan qism `b.N` marta takrorlanadi. Natija `ns/op`: bitta iteratsiyaning o'rtacha vaqti. `-benchtime=100x` shakli iteratsiyalar sonini qat'iy belgilaydi, `-benchtime=5s` esa vaqtni.

Qo'shimcha hisoblagichlar: `-benchmem` (yoki kod ichida `b.ReportAllocs()`) `B/op` va `allocs/op` ustunlarini qo'shadi. `b.SetBytes(n)` MB/s hisoblaydi, `b.ReportMetric` o'zingizning birligingizni (masalan, `points/op`) qo'shadi, `b.Run` sub-benchmark'lar yaratadi, `b.RunParallel` esa bir necha goroutine'dan yuklaydi.

### B.Loop (Go 1.24)

Go 1.24 release notes `testing.B.Loop` metodini kiritdi: `for b.Loop() { ... }`. Eski `b.N` tsikliga nisbatan u ikki afzallik beradi. Birinchisi, benchmark funksiyasi har `-count` uchun aniq bir marta bajariladi, shuning uchun qimmat setup va cleanup ham bir marta ishlaydi. Ikkinchisi, chaqiruv parametrlari va natijalari tirik saqlanadi, shuning uchun compiler tsikl tanasini butunlay optimallashtirib tashlay olmaydi. Amalda bu eski tuzoqlarning ikkitasini yopadi: setup'ni tsikl ichiga tushirib yuborish va natijani ishlatmaslik.

Go 1.26 release notes yana bir tuzatishni qayd etadi: `B.Loop` avval tsikl tanasida inlining'ga to'sqinlik qilardi, bu kutilmagan allocation'larga va sekinroq benchmark'ga olib kelishi mumkin edi. Go 1.26 da bu tuzatilgan va notes'ga ko'ra barcha benchmark'larni eski `b.N` uslubidan `B.Loop` ga o'tkazish mumkin. Tsikl tanasida chaqiruv parametrlari, natijalar va o'zlashtirilgan o'zgaruvchilar baribir tirik saqlanadi. Demak, Go 1.24 va 1.25 da `B.Loop` bilan o'lchangan, inline bo'ladigan kichik funksiya Go 1.26 da boshqacha raqam berishi mumkin. Toolchain'ni yangilaganda benchmark'larni qayta o'lchash shu sababdan ham kerak (1-dars: performance Go 1 kafolatiga kirmaydi).

## Chuqurroq: benchmark nimani yashiradi

### Dead code elimination

Compiler pure funksiyani inline qilib, natijasi ishlatilmasa, hisoblashni o'chirib tashlaydi. Bu to'g'ri optimizatsiya, lekin benchmark uchun halokatli: siz bo'sh tsiklni o'lchaysiz. Quyidagi misolda aynan shu ko'rinadi (Misol bo'limidagi raqamlarga qarang). Eski uslubda himoya: natijani paket darajasidagi `sink` o'zgaruvchisiga yozish. Lokal o'zgaruvchi yetmaydi, chunki uni ham ishlatilmagan deb o'chirish mumkin. `B.Loop` bu ishni siz uchun qiladi.

Teskari tuzoq ham bor: har iteratsiyada bir xil kirishni berish. Branch predictor va cache bir xil ma'lumotni "o'rganib" oladi va real yuklamada ko'rinmaydigan tezlik beradi. Real servisda 5000 xil qator keladi, benchmark'da esa bitta qator. Kirish to'plamini real taqsimotga yaqin tanlang.

### Setup va timer

`b.ResetTimer()` shu paytgacha sarflangan vaqt va allocation'larni nolga tushiradi, `StopTimer`/`StartTimer` esa tsikl ichida bo'lakni chiqarib tashlaydi. `StopTimer` har iteratsiyada chaqirilsa, o'zi sezilarli xarajat qo'shadi, shuning uchun uni tez operatsiyalarda ishlatmang. `B.Loop` da setup tsikldan oldin turadi va birinchi `Loop` chaqiruvi hisoblagichlarni qayta o'rnatadi: pastdagi topshiriqda setup'ning minglab allocation'i `allocs/op` ga kirmaganini ko'rasiz.

### Shovqin

Raqamni buzadigan manbalar: boshqa jarayonlar (ayniqsa shared VM va CI runner'lar), CPU chastotasi va termal holat, GC, OS scheduler. Diagnostika hujjati ham shunga yaqin ogohlantiradi: vositalar bir-biriga xalaqit berishi mumkin va aniq natija uchun ularni alohida ishlatish kerak. Benchmark paytida profilerni yoqmang, ikkinchi benchmark'ni parallel yuritmang.

Davosi: bir nechta namuna. `-count=10` har benchmark'ni 10 marta takrorlaydi, har qator alohida o'lchov. Ikki variantni solishtirishda eski va yangi natijani ikki faylga yozib, `benchstat` (`golang.org/x/perf/cmd/benchstat`) bilan solishtiriladi. U har to'plam uchun markaziy qiymat va tarqoqlikni chiqaradi, farq statistik jihatdan ishonchli bo'lmasa, buni belgilaydi. Bu qism lokal tekshirilmagan: sandbox'da `benchstat` o'rnatilmagan va tashqi modul yuklab bo'lmaydi. Shu sabab quyidagi misolda xom o'lchovlarni o'zim ko'rsataman va 70-darsda oddiy solishtirish funksiyasini o'zingiz yozasiz.

Eng ishonchli ko'rsatkich - `allocs/op`. U deterministik, shovqinga bog'liq emas. Shuning uchun CI'da vaqt bo'yicha qat'iy chegara qo'ymang, allocation soni bo'yicha qo'ying.

## Misol: ikki parser va yo'qolgan tsikl

Telemetriya qatori `imei,lat,lon,tezlik` shaklida keladi. Ikki yondashuv: `strings.Split` bilan bo'lish va `strings.Cut` bilan ketma-ket kesish. Kod `Reading` tipi, `ParseSplit` va `ParseCut`dan iborat; benchmark'lar:

```go
package l61

import "testing"

const line = "866123456789012,41.311081,69.240562,62.5"

func BenchmarkParseSplit(b *testing.B) {
	b.ReportAllocs()
	for i := 0; i < b.N; i++ {
		ParseSplit(line)
	}
}

func BenchmarkParseCut(b *testing.B) {
	b.ReportAllocs()
	for b.Loop() {
		ParseCut(line)
	}
}

// Eski uslubda natija ishlatilmasa, compiler pure funksiyani butunlay olib tashlashi mumkin.
func BenchmarkSpeedOldLoop(b *testing.B) {
	for i := 0; i < b.N; i++ {
		SpeedKmh(625)
	}
}

func BenchmarkSpeedLoop(b *testing.B) {
	for b.Loop() {
		SpeedKmh(625)
	}
}
```

`SpeedKmh` - `float64(raw) / 10` qaytaradigan bir qatorli funksiya. Go 1.24.7, linux/amd64, Intel Xeon 2.10GHz, 2 vCPU (umumiy virtual mashina), `go test -bench . -benchmem -count=3` natijasi (har benchmark'ning birinchi qatori):

```text
goos: linux
goarch: amd64
pkg: l61
cpu: Intel(R) Xeon(R) Processor @ 2.10GHz
BenchmarkParseSplit-2     	 3422240	       307.3 ns/op	      64 B/op	       1 allocs/op
BenchmarkParseCut-2       	 4487790	       224.0 ns/op	       0 B/op	       0 allocs/op
BenchmarkSpeedOldLoop-2   	1000000000	         0.3036 ns/op	       0 B/op	       0 allocs/op
BenchmarkSpeedLoop-2      	442307942	         2.802 ns/op	       0 B/op	       0 allocs/op
```

Bu natijadan uch xulosa chiqadi:

1. `SpeedOldLoop` 0.30 ns/op berdi, bu 2.1 GHz chastotada bitta tsikldan ham kam. Tsikl tanasi o'chirilgan, `b.N` esa milliardga yetgan. `SpeedLoop` esa 2.8-3.6 ns/op berdi: bu qiymat tsikl nazorati va saqlangan natijaning narxi, funksiya o'zi emas. Hatto to'g'ri benchmark ham bir qatorli funksiya haqida ko'p narsa demaydi.
2. `ParseSplit` har chaqiruvda 64 B va 1 allocation sarflaydi (`Split` natija slice'ini ajratadi), `ParseCut` esa 0. Bu farq har ishga tushirishda bir xil.
3. Vaqt bo'yicha esa tasvir noaniq. Har biri uchun `-count=10` bilan o'lchangan `ns/op` qiymatlari (o'sish tartibida):

```text
ParseSplit: 162.5 163.6 166.5 169.8 175.7 189.7 193.7 202.9 226.3 342.9
ParseCut:   121.4 140.8 148.9 161.2 169.2 254.4 254.8 263.1 311.9 481.4
```

Oraliqlar kesishadi. Eng kichik qiymat `Cut` da past, medianasi esa `Split`da past (5- va 6-qiymatlarning o'rtachasi: 182.7 va 211.8 ns/op). Bunday ma'lumotdan "Cut tezroq" degan xulosa chiqmaydi. Chiqadigan yagona ishonchli xulosa: `Cut` allocation'ni yo'qotadi. Shovqin shared VM'dan kelgan; bo'sh ajratilgan mashinada tarqoqlik kichikroq bo'ladi, lekin nolga tushmaydi. Qaror qabul qilish uchun ko'proq namuna va benchstat kerak.

Nega `ParseCut` ni `B.Loop`, `ParseSplit` ni `b.N` bilan yozdik? Ataylab: ikkala uslubning o'zi natijaga farq qo'shmasligini ko'rsatish uchun. Parserlar natijani `Reading` qiymati sifatida qaytaradi va xato tekshiruvi tufayli compiler ularni o'chira olmaydi, shuning uchun ikkala uslub ishlaydi. Himoyasiz qolgan faqat `SpeedKmh` kabi sof, kichik funksiyalar.

## Qachon qo'llamaslik kerak

- Microbenchmark butun tizim haqida emas. U bitta funksiyani issiq cache, bir xil kirish va GC bosimisiz o'lchaydi. Servis latency'si (p99) benchmark bilan hal bo'lmaydi: bu uchun profil (62-63-darslar), trace (64-dars) va yuklama testi kerak.
- Arxitektura qarorini microbenchmark bilan asoslamang. "`Cut` 20 ns tezroq" degan natija servisingizda p99 ni o'zgartirmaydi, agar bu funksiya yuklamaning 0.1% ini tashkil qilsa. Avval profil: qayerda vaqt ketayotganini ko'ring, keyin o'sha joy uchun benchmark yozing.
- Umumiy CI runner'da `ns/op` bo'yicha qat'iy chegara (threshold) qo'ymang. Soxta alarm ko'p bo'ladi va jamoa signalga ishonmay qo'yadi. `allocs/op` va `B/op` bo'yicha chegara ishonchliroq.
- Real ma'lumotsiz benchmark yozmang. Bitta qatorni million marta parse qilish bilan real taqsimotdagi (uzun, qisqa, buzuq qatorlar) narx farq qiladi.
- `RunParallel` ni "servis shunday ishlaydi" deb o'ylamang. U lock contention va cache bahsini ko'rsatadi, lekin real yuklama shakli (arrival rate, request aralashmasi) bunda yo'q.

## Stack'da: Node.js/TypeScript bilan solishtirish

Node.js'da benchmark uchun uchinchi tomon kutubxonasi tanlanadi (`tinybench`, `benchmark.js`), isinish (warmup) iteratsiyalari JIT uchun kerak va natija V8 versiyasiga bog'liq. Go oldindan kompilyatsiya qilinadi, JIT yo'q, shuning uchun warmup deyarli kerak emas. Lekin o'rniga boshqa omillar bor: GC, inlining va dead code elimination, CPU chastotasi. Node.js'da `console.time` bilan o'lchash keng tarqalgan, Go'da `time.Now()` bilan o'lchash esa `testing.B` borligi uchun asossiz.

Amaliy tavsiyalar:

- Har kritik funksiya yonida `_test.go` ichida benchmark saqlang va `-benchmem` bilan ishlating. `b.ReportAllocs()` ni fayl darajasidagi odat qiling.
- O'zgarishdan oldin va keyin bir xil mashinada `-count=10` bilan ikki faylga yozing, so'ng benchstat bilan solishtiring. PR tavsifiga raqamlarni va sharoitni (Go versiyasi, GOARCH, CPU) kiriting.
- `go test -run '^$' -bench ...` shaklida unit testlarni o'tkazib yuboring, aks holda ular ham ishlaydi.
- Toolchain yangilanganda (masalan, 1.25 dan 1.26 ga) kritik benchmark'larni qayta o'lchang: inlining va allocation qarorlari o'zgarishi mumkin, B.Loop xatti-harakati ham 1.26 da o'zgargan.

## Xulosa

- Benchmark - `testing.B` bilan yoziladigan, `go test -bench` bilan ishga tushadigan o'lchov. `-benchmem` va `b.ReportAllocs()` allocation'larni ko'rsatadi.
- Go 1.24 dan `for b.Loop()` ishlating: setup bir marta bajariladi, natijalar tirik qoladi. Go 1.26 da u inlining'ga to'sqinlik qilmaydi.
- Eski uslubda natijasiz sof funksiya dead code elimination tufayli 0.3 ns/op kabi mantiqsiz raqam beradi. Bunday raqamga ishonmang.
- Vaqt shovqinli: `-count=10` va benchstat bilan solishtiring; `allocs/op` deterministik, shuning uchun u eng ishonchli ko'rsatkich.
- Microbenchmark bitta funksiyani o'lchaydi. Optimizatsiyaga qaror berishdan oldin profil (62-dars) bilan qayerda vaqt ketayotganini toping.
