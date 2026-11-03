---
n: 70
slug: optimizatsiya-amaliyoti
title: "Optimizatsiya amaliyoti: o'lchash, gipoteza, takrorlash"
summary: "Modul 7 ni birlashtiruvchi amaliy tsikl: benchmark bilan bazani o'lchash, pprof bilan issiq joyni topish, bitta gipoteza, bitta o'zgartirish, qayta o'lchash, shovqin va haqiqiy farqni ajratish va qachon to'xtash. Haqiqiy hisobot funksiyasi uch qadamda tezlashtiriladi."
duration: 40
sources:
  - id: diagnostics
    note: "Profiling bo'limi: pprof profil turlari va ular nimani o'lchashi; diagnostika vositalari bir-birini almashtirmasligi"
  - id: blog-pprof
    note: "Profiling Go Programs: pprof bilan issiq joyni topish va o'zgartirishdan keyin qayta o'lchash yondashuvi"
  - id: pgo-doc
    note: "PGO hujjati: optimallashtirish tsiklida kompilyator darajasidagi qadam sifatida, unrepresentativ profil haqidagi ogohlantirish"
quiz:
  - q: "CPU profilda `fmt.Sprintf` kumulativ 66% chiqdi (u har nuqtada map kaliti yasaydi). Eng to'g'ri keyingi qadam qaysi?"
    options:
      - "Butun funksiyani unsafe bilan qayta yozish"
      - "Darhol PGO yoqish"
      - "Gipoteza qo'yish ('kalit yasash qimmat'), shu bitta narsani o'zgartirish va o'sha benchmark'ni qayta ishga tushirib solishtirish"
      - "Hisobotni goroutine'lar bilan parallellashtirish"
    answer: 2
    explain: "Profil issiq joyni ko'rsatadi, lekin yechim isbot emas. Tsikl: gipoteza, bitta o'zgartirish, qayta o'lchash. unsafe va parallellik xavf va murakkablik qo'shadi, ular profil boshqa narsani ko'rsatsa kerak bo'ladi."
  - q: "V1 va V2 medianlari 428 va 410 mikrosekund, 10 ta o'lchovning min..max oraliqlari kesishadi, B/op esa 110280 dan 81464 gacha tushdi. Qaysi xulosa to'g'ri?"
    options:
      - "Vaqt bo'yicha yaxshilanish isbotlanmadi (shovqin), lekin B/op kamayishi deterministik va haqiqiy; o'zgartirishni xotira tejash sifatida saqlash mumkin, tezlashish sifatida e'lon qilmaslik kerak"
      - "V2 4.3% tezroq, bu isbotlangan"
      - "V2 sekinroq"
      - "B/op ga ishonib bo'lmaydi, chunki u o'zgaruvchan"
    answer: 0
    explain: "ns/op shovqinli, B/op esa o'lchovlar orasida deyarli bir xil (110280-110282). Shuning uchun xotira bo'yicha farq haqiqiy, vaqt bo'yicha esa oraliqlar kesishgani uchun isbotlanmagan."
  - q: "Nega bir vaqtda uchta o'zgartirishni (kalit turi, oldindan ajratish, saralash usuli) kiritib, bitta o'lchov o'tkazish yomon?"
    options:
      - "Go bunga ruxsat bermaydi"
      - "Foyda yoki zararni qaysi o'zgartirish keltirganini ajrata olmaysiz; bittasi yordam berib, boshqasi zarar qilsa, ular bir-birini yashiradi"
      - "Benchmark faqat bitta funksiyani o'lchaydi"
      - "pprof uch o'zgartirishni qo'llab-quvvatlamaydi"
    answer: 1
    explain: "Bu o'lchovda kalit turini o'zgartirish 6.9 baravar tezlashtirdi, keyingi qadam esa vaqtda ko'rinmadi. Agar ikkalasi birgalikda kiritilsa, ikkinchisining foydasiz ekani ko'rinmas edi."
  - q: "Mikrobenchmark 7 baravar tezlashish ko'rsatdi, lekin production'da p99 latency o'zgarmadi. Qaysi sabab eng ehtimoliy?"
    options:
      - "Go versiyasi eski"
      - "Production'da benchmark ishlamaydi"
      - "GC o'chirilgan"
      - "Production latency'da bu funksiya ulushi kichik (vaqt DB, tarmoq yoki boshqa joyda ketadi) yoki benchmark yuklamasi haqiqiy kirishni aks ettirmaydi; production profili bilan tasdiqlash kerak edi"
    answer: 3
    explain: "Amdahl qonuni: funksiya umumiy vaqtning kichik qismi bo'lsa, uni cheksiz tezlashtirish ham umumiy natijani o'zgartirmaydi. Profil production'dan (net/http/pprof, 63-dars) yoki real kirish bilan olinishi shart."
  - q: "Optimallashtirishni qachon to'xtatish kerak?"
    options:
      - "Benchmark nolga yetganda"
      - "Kod murakkablashganda emas, tezlashganda"
      - "Maqsad (masalan, p99 byudjeti yoki CPU xarajati) bajarilganda yoki keyingi o'zgartirish o'lchanadigan foyda bermay qolganda"
      - "Bir kunlik ish tugaganda"
    answer: 2
    explain: "Maqsad oldindan raqam bilan belgilanadi. Keyingi o'zgartirish shovqin ichida qolsa (V1 dan V2 ga kabi), davom etish murakkablikni oshiradi, foydani emas."
  - q: "PGO (67-dars) bu tsiklda qayerga qo'yiladi?"
    options:
      - "Birinchi qadamga: avval PGO, keyin boshqasi"
      - "Kod darajasidagi o'zgartirishlardan keyin, kompilyator darajasidagi qo'shimcha qadam sifatida; profil yangilangan kodning real yuklamasidan olinadi va A/B o'lchanadi"
      - "PGO benchmark o'rnini bosadi"
      - "PGO faqat test uchun"
    answer: 1
    explain: "PGO'ning foydasi kafolatlanmagan va profilga bog'liq (67-dars). Kod o'zgargach eski profil mos kelmay qolishi mumkin; shuning uchun u tsiklning oxirida, yangi profil bilan va o'lchov bilan qo'llanadi."
task:
  title: "Haqiqiy farqni shovqindan ajratish"
  prompt: |
    `compare(oldS, newS)` ikki o'lchov to'plamini (ms) solishtiradi, lekin o'rtachaga tayanadi, har doim "yaxshilandi" deydi va bo'sh kirishda `NaN` chiqaradi. Shovqin ichidagi farq ham isbotlangandek ko'rinadi.

    Funksiyani to'g'rilang: mediana bilan solishtiring; kirishlardan biri bo'sh bo'lsa `ma'lumot yo'q` qaytaring; farq "aniq" bo'lishi uchun ikki to'plamning min..max oraliqlari kesishmasligi shart, aks holda `shovqin`. Format: `old=<mediana> new=<mediana> delta=<foiz> <aniq|shovqin>` (3 xonali kasr, delta ishorali, bitta kasr). `main` o'zgarmasin.
  lang: go
  starter: |
    package main

    import "fmt"

    // compare ikki o'lchov to'plamini (ms) solishtiradi.
    // Muammo: o'rtachaga tayanadi va har doim "yaxshilandi" deydi,
    // shovqin ichidagi farqni ham isbotlangan deb e'lon qiladi.
    func compare(oldS, newS []float64) string {
        mo, mn := mean(oldS), mean(newS)
        delta := (mn - mo) / mo * 100
        return fmt.Sprintf("old=%.3f new=%.3f delta=%+.1f%% yaxshilandi", mo, mn, delta)
    }

    func mean(xs []float64) float64 {
        var s float64
        for _, x := range xs {
            s += x
        }
        return s / float64(len(xs))
    }

    func main() {
        v0 := []float64{3.80, 2.93, 2.98, 3.07, 2.71, 2.86, 3.00, 2.64, 3.00, 2.92}
        v1 := []float64{0.494, 0.401, 0.420, 0.384, 0.386, 0.422, 0.435, 0.486, 0.541, 0.530}
        v2 := []float64{0.454, 0.359, 0.436, 0.501, 0.411, 0.372, 0.386, 0.413, 0.353, 0.409}
        fmt.Println("V0 -> V1:", compare(v0, v1))
        fmt.Println("V1 -> V2:", compare(v1, v2))
        fmt.Println("bo'sh:", compare(nil, v2))
    }
  solution: |
    package main

    import (
        "fmt"
        "slices"
    )

    // compare ikki o'lchov to'plamini (ms) mediana bilan solishtiradi.
    // Farq "aniq" faqat to'plamlar oralig'i (min..max) kesishmasa;
    // aks holda "shovqin".
    func compare(oldS, newS []float64) string {
        if len(oldS) == 0 || len(newS) == 0 {
            return "ma'lumot yo'q"
        }
        mo, mn := median(oldS), median(newS)
        delta := (mn - mo) / mo * 100
        verdict := "shovqin"
        if slices.Max(newS) < slices.Min(oldS) || slices.Max(oldS) < slices.Min(newS) {
            verdict = "aniq"
        }
        return fmt.Sprintf("old=%.3f new=%.3f delta=%+.1f%% %s", mo, mn, delta, verdict)
    }

    func median(xs []float64) float64 {
        s := slices.Clone(xs)
        slices.Sort(s)
        n := len(s)
        if n%2 == 1 {
            return s[n/2]
        }
        return (s[n/2-1] + s[n/2]) / 2
    }

    func main() {
        v0 := []float64{3.80, 2.93, 2.98, 3.07, 2.71, 2.86, 3.00, 2.64, 3.00, 2.92}
        v1 := []float64{0.494, 0.401, 0.420, 0.384, 0.386, 0.422, 0.435, 0.486, 0.541, 0.530}
        v2 := []float64{0.454, 0.359, 0.436, 0.501, 0.411, 0.372, 0.386, 0.413, 0.353, 0.409}
        fmt.Println("V0 -> V1:", compare(v0, v1))
        fmt.Println("V1 -> V2:", compare(v1, v2))
        fmt.Println("bo'sh:", compare(nil, v2))
    }
  solutionNotes: |
    - Mediana bir-ikkita chetga chiqqan o'lchovga (masalan, V0 dagi 3.80 ms) o'rtachadan kam sezgir. Kirishni `slices.Clone` bilan nusxalab saralaymiz, shunda chaqiruvchining massivi o'zgarmaydi.
    - "Aniq" mezoni sodda: oraliqlar kesishmasa. Bu `benchstat` ning to'liq statistik testi emas, lekin yolg'on xulosadan himoya qiladi. `benchstat` bu mashinada o'rnatilmagan va ishlatilmadi.
    - Shu mashinada tekshirildi: V0 -> V1 `delta=-85.5% aniq`, V1 -> V2 `delta=-4.3% shovqin`, bo'sh kirish `ma'lumot yo'q`. Starter ikkala solishtirishni ham 'yaxshilandi' deb e'lon qildi va bo'sh kirishda NaN chiqardi.
    - Haqiqiy loyihada bu funksiyani `-count=10` natijalarini parse qiladigan skriptga ulash mumkin; muhimi tamoyil: bir marta yurgizilgan o'lchovga ishonmaslik.
  checklist:
    - "Mediana ishlatiladi, o'rtacha emas"
    - "Oraliqlar kesishmasa `aniq`, kesishsa `shovqin`"
    - "Bo'sh kirishda `ma'lumot yo'q`, NaN yo'q"
    - "Chaqiruvchining massivi saralanib o'zgarib qolmaydi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Modul 7 bo'yicha bir nechta vositani ko'rdik: benchmark (61-dars), CPU va heap profillari (62-63), trace (64), alloc'larni kamaytirish (65), xotira joylashuvi (66), PGO (67), JSON (68), unsafe va cgo (69). Real loyihada ularning har biri alohida ishlatilmaydi, ular bitta tsiklga ulanadi. Tsiklsiz ikki xato odatiy: yo'nalishsiz "tezlashtirish" (nimani o'zgartirish kerakligini taxmin qilish) va natijani tekshirmay e'lon qilish ("tezlashdi" deb yozish, aslida shovqin).

Birinchi xato qimmatga tushadi, chunki issiq bo'lmagan kodni murakkablashtirasiz. Kod 1% vaqt olsa, uni cheksiz tezlashtirish ham umumiy natijani 1% dan ko'p yaxshilamaydi. Ikkinchi xato esa ishonchni yo'qotadi: jamoa "optimallashtirish" nomi bilan o'zgartirish kiritadi, hech narsa o'zgarmaydi va keyingi safar hech kim o'lchovga ishonmaydi.

Bu darsning vazifasi: bitta kichik, lekin real hisobot funksiyasini boshidan oxirigacha o'tkazish va har qadamda nima o'lchanganini ko'rsatish. Hamma raqamlar mening lokal o'lchovlarim; sharoit pastda yozilgan.

## Asosiy g'oya

Tsikl olti qadamdan iborat va ular tartibi bilan ishlaydi:

1. Maqsadni raqam bilan belgilang ("hisobot 100 ms dan kam", "CPU xarajati ikki baravar kam"). Maqsadsiz to'xtash nuqtasi yo'q.
2. Bazani o'lchang: benchmark, `-benchmem`, bir necha `-count`. Natijani saqlang.
3. Issiq joyni toping: profil (62-63 darslar). Taxmin emas, profil.
4. Bitta gipoteza qo'ying va faqat bitta narsani o'zgartiring.
5. Qayta o'lchang, xuddi shu benchmark va xuddi shu sharoitda. Farq haqiqiymi yoki shovqinmi, hal qiling.
6. Hal qiling: saqlash, qaytarish yoki to'xtash. Maqsadga yetgan bo'lsangiz to'xtang; yetmagan bo'lsa 3-qadamga qayting (profil endi boshqa joyni ko'rsatadi).

"Bitta narsa" qoidasining sababi oddiy: ikki o'zgartirishni birga kiritsangiz, qaysi biri yordam bergani ko'rinmaydi, bittasining foydasi ikkinchisining zararini yashirishi mumkin. Pastdagi misolda aynan shu holat ko'rinadi: birinchi o'zgartirish katta farq berdi, ikkinchisi vaqtda ko'rinmadi, ammo agar ikkalasi birga kiritilsa, ikkinchisi foydasiz ekanini bilmagan bo'lardik.

Sizga ma'lum bo'lgan ikki tushuncha bu yerda ham ishlaydi. Amdahl qonuni: funksiya vaqtning p ulushini olsa, uni qanchalik tezlashtirmang, umumiy tezlashish `1/(1-p)` dan oshmaydi. Va ikkinchisi: o'lchov faqat o'lchangan sharoitni bildiradi. Mikrobenchmark production emas.

## Chuqurroq: o'lchov intizomi

### Shovqin va haqiqiy farq

Virtual mashinada, boshqa jarayonlar bilan birga, bitta o'lchov hech narsani isbotlamaydi. Bir xil benchmark'ni `-count=10` bilan yurgizib, natijalar to'plamini olasiz. Kerakli minimal intizom: median bilan ishlash (bitta chetga chiqqan natija medianani siljitmaydi), min..max oralig'ini ko'rish, va oraliqlar kesishsa farqni "isbotlanmagan" deb hisoblash. Standart vosita `benchstat` (golang.org/x/perf) buni statistik testlar bilan qiladi; bu mashinada u o'rnatilmagan, shuning uchun men sodda variantni qo'lda hisobladim va topshiriqda uni o'zingiz yozasiz.

Alloc ko'rsatkichlari (B/op, allocs/op) kamdan-kam shovqinli: pastdagi jadvalda B/op bir xil benchmark'ning o'n o'lchovida bir necha baytga farq qildi. Shuning uchun alloc bo'yicha farq ns/op'ga qaraganda ishonchliroq, lekin alloc kamaygani vaqt kamaygani degani emas.

### Profil nimani ko'rsatadi va nimani ko'rsatmaydi

CPU profil (62-dars) namuna olish bilan ishlaydi: u issiq joyni ko'rsatadi, sababini emas. `fmt.Sprintf` 66% bo'lsa, bu "Sprintf qimmat" degani emas, "bu yerda ko'p chaqirilyapti" degani. Gipoteza shu yerdan chiqadi: "har nuqtada kalit yasash ortiqcha". Gipotezani benchmark tekshiradi.

Profil faqat o'lchangan kirish uchun to'g'ri. Benchmark uchun yasalgan sintetik kirish (bu darsda 20 ming nuqta, 500 qurilma) production'dagi taqsimotdan farq qilishi mumkin. Oxirgi tekshiruv har doim production profili yoki real kirish bilan (63-dars).

### Qachon to'xtash

To'xtash mezonlari: maqsadga yetildi; keyingi gipoteza uchun profilda 5-10% dan ko'p ulush qolmadi (bu muallifning tajribaviy bahosi, qoida emas); keyingi o'zgartirish shovqin ichida qoldi; kod murakkabligi foydadan oshdi. Oxirgi mezon sub'ektiv, shuning uchun uni jamoa bilan, kod ko'rib chiqishda hal qiling.

### PGO va boshqa kompilyator vositalari

PGO (67-dars) tsiklning oxirgi qadami: kod darajasidagi o'zgartirishlar tugagach, production profilidan `default.pgo` olib, A/B o'lchov qilinadi. Birinchi qadamga qo'yilmaydi, chunki kod o'zgarsa eski profil mos kelmay qoladi, foydasi esa kafolatlanmagan.

## Misol: hisobot funksiyasi uch qadamda

Maqsad: qurilmalar bo'yicha hisobot (nuqtalar soni, tezlik yig'indisi, maksimum), nomi bo'yicha saralangan. Kirish: 20 000 nuqta, 500 qurilma. Sharoit: Go 1.24.7, `GOARCH=amd64`, Intel Xeon 2.10 GHz, 2 yadro, virtual mashina; har variant uchun `-count=10`, median keltirilgan; `benchstat` yo'q. Uch variantning natijalari `reflect.DeepEqual` bilan bir xil ekani tekshirildi.

### 0-qadam: baza

```go
func ReportV0(pts []Point) []Row {
	byName := map[string]*Row{}
	for _, p := range pts {
		name := fmt.Sprintf("dev-%05d", p.Dev)
		r, ok := byName[name]
		if !ok {
			r = &Row{Name: name}
			byName[name] = r
		}
		r.Count++
		r.Sum += p.Speed
		if p.Speed > r.Max {
			r.Max = p.Speed
		}
	}
	rows := []Row{}
	for _, r := range byName {
		rows = append(rows, *r)
	}
	sort.Slice(rows, func(i, j int) bool { return rows[i].Name < rows[j].Name })
	return rows
}
```

Baza: median 2.95 ms/op, 525 KB/op, 30288 allocs/op. Profil (`go test -bench V0 -count=10 -cpuprofile`, `go tool pprof -top -cum`):

```text
      flat  flat%   sum%        cum   cum%
         0     0%     0%     10.99s 94.17%  l70.BenchmarkV0
     0.24s  2.06%  2.06%     10.99s 94.17%  l70.ReportV0
     0.15s  1.29%  3.34%      7.71s 66.07%  fmt.Sprintf
     1.15s  9.85% 13.20%      4.66s 39.93%  fmt.(*pp).doPrintf
```

Flat bo'yicha ham `fmt` ichidagi funksiyalar tepada (`fmtInteger` 10.8%, `doPrintf` 9.85%), `mapaccess2_faststr` esa kumulyativ 16%. Natija: `ReportV0` vaqtining uchdan ikki qismi `fmt.Sprintf` da.

### 1-qadam: gipoteza va bitta o'zgartirish

Gipoteza: kalit yasash har nuqtada ortiqcha. 20 ming nuqta uchun 20 ming marta satr yasaymiz, qurilma esa 500 ta. O'zgartirish: map kaliti `int`, nom faqat 500 marta, oxirida yasaladi.

```go
byDev := map[int]*agg{}
// ... nuqtalar bo'yicha tsikl: a := byDev[p.Dev] ...
for dev, a := range byDev {
	rows = append(rows, Row{Name: "dev-" + pad5(dev), Count: a.count, Sum: a.sum, Max: a.max})
}
```

Natija: median 0.429 ms/op, 110 KB/op, 2538 allocs/op. Median 2.95 dan 0.43 ms ga tushdi (6.9 baravar, -85.5%); eng yomon V1 o'lchovi (0.541 ms) eng yaxshi V0 o'lchovidan (2.64 ms) ancha past. Oraliqlar kesishmaydi, farq aniq. Gipoteza tasdiqlandi. Shuni ham aytish kerak: o'zgartirish bir vaqtda ikki narsani tegdi (string map o'rniga int map va Sprintf), shuning uchun 6.9 baravarni faqat Sprintf ga nisbat bermayman; Amdahl hisobi (66% dan 3 baravar atrofida) bundan kam, demak map kalitini string'dan int'ga o'tkazish ham hissa qo'shdi, bu qo'shimcha gipoteza va uni men alohida o'lchamadim.

### 2-qadam: kichik tuzatishlar

Gipoteza: map va slice uchun joy oldindan ajratilsa, o'sish nusxalari kamayadi; `sort.Slice` o'rniga `slices.SortFunc` reflection'siz ishlaydi. O'zgartirish: `make(map[int]*agg, 1024)`, `make([]Row, 0, len(byDev))`, `slices.SortFunc`.

Natija: median 0.410 ms/op, 81 KB/op, 2516 allocs/op. Mana jadval:

| Variant | Median ms/op | min..max ms | B/op | allocs/op |
|---|---|---|---|---|
| V0 (Sprintf kalit) | 2.95 | 2.64 .. 3.80 | 525305 | 30288 |
| V1 (int kalit) | 0.429 | 0.384 .. 0.541 | 110280 | 2538 |
| V2 (+ oldindan ajratish, SortFunc) | 0.410 | 0.353 .. 0.501 | 81464 | 2516 |

V1 va V2 oraliqlari kesishadi (0.384..0.541 va 0.353..0.501). Median farqi -4.3%, lekin shovqin ichida. B/op esa 110 KB dan 81 KB gacha tushdi va u deterministik. Xulosa: V2 xotira tejaydi, tezlashishi isbotlanmadi; kodni saqlash mumkin (murakkablik oshmadi), lekin "tezlashtirdi" deb yozish noto'g'ri. Shu daqiqada tsikl to'xtash nuqtasiga keldi: maqsadimiz 100 ms dan past edi, biz 0.4 ms dasiz, keyingi gipotezalar foydasiz.

Bu hisoblashni topshiriqda `compare` funksiyasi qiladi: median, min..max va "aniq/shovqin" hukmi. Shu mashinada V0 -> V1 uchun `-85.5% aniq`, V1 -> V2 uchun `-4.3% shovqin` chiqadi.

## Qachon qo'llamaslik kerak

Optimallashtirish tsikli har doim kerak emas. Servis o'z maqsadidan (SLO) ancha past ishlayotgan bo'lsa, o'lchov va tsikl vaqt oladi, foyda esa yo'q. "Tezlashtirish" o'zi maqsad bo'lmasin.

Mikrobenchmark tsikli production'dagi muammoga javob bermaydi, agar muammo boshqa joyda bo'lsa: DB so'rovi, tarmoq, blokirovka (63 va 64 darslar). Latency muammosida avval trace yoki production profili ko'riladi, keyin mikrobenchmark.

Shovqinli muhitda (umumiy CI, ko'p tenantli VM) mutlaq raqamlarni solishtirmang. Bir mashinada, bir sessiyada, navbatma-navbat o'lchang. Katta farqlar (6.9 baravar) shovqindan ustun turadi, 4% esa yo'q.

Hamma optimallashtirishni darhol kodga qo'ymang. Har qadam kodni murakkablashtiradi: V2 dagi oldindan ajratish `1024` raqami "sehrli son" bo'lib qoladi. Foydasi isbotlanmasa va murakkablik oshsa, qaytaring. Foyda xotirada bo'lib, vaqtda bo'lmasa, qaror sizniki, lekin sababini kod izohida yozing.

## Stack'da: Node.js/TypeScript bilan solishtirish

Node.js'da bu tsikl `--cpu-prof`, Chrome DevTools yoki `clinic.js` bilan quriladi, mikrobenchmark uchun `benchmark.js` yoki `tinybench`. Tamoyil bir xil: profil, gipoteza, o'lchov. Farq: Go'da benchmark va profiler standart kutubxonada (`testing`, `runtime/pprof`), shuning uchun tsikl bir buyruq qatori bilan reproduktsiya qilinadi va CI'ga ulanadi.

TypeScript'da JIT va GC o'lchovga ko'proq ta'sir qiladi ("isinish" fazalari); Go'da kompilyatsiya oldindan, lekin GC va inlining baribir benchmark'ni buzishi mumkin (61-dars). Node'da ham, Go'da ham "tezlashdi" degan da'vo takrorlanadigan o'lchovga tayanishi kerak. Jamoa miqyosida: pull request'ga benchmark natijasi (median va oraliq) ilova qilish odatini kiritsangiz, bahslar kamayadi.

## Xulosa

- Tsikl: maqsad, baza, profil, bitta gipoteza, bitta o'zgartirish, qayta o'lchash, qaror. Profilsiz taxmin qilmang, o'lchovsiz e'lon qilmang.
- Shovqinni median va min..max oralig'i bilan boshqaring: oraliqlar kesishsa, farq isbotlanmagan. Bu mashinada V0 dan V1 ga 6.9 baravar (aniq), V1 dan V2 ga -4.3% (shovqin).
- B/op va allocs/op ns/op'dan barqarorroq, lekin alloc kamayishi tezlashish kafolati emas.
- Amdahl qonuni va production profili: benchmark'dagi katta farq production'da ko'rinmasligi mumkin, agar funksiyaning umumiy ulushi kichik bo'lsa.
- PGO va boshqa kompilyator vositalari tsiklning oxirida, A/B o'lchov bilan; maqsadga yetilganda yoki keyingi o'zgartirish foyda bermaganda to'xtang.
