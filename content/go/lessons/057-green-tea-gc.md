---
n: 57
slug: green-tea-gc
title: "Green Tea GC"
summary: "Go 1.25 da tajriba sifatida kelgan va Go 1.26 da default bo'lgan Green Tea GC mark fazasini obyektlar o'rniga sahifalar bo'yicha qanday tashkil qiladi, nega bu xotira kechikishini kamaytiradi, qaysi da'volar manbalardan olingan va o'z servisingizda uni qanday baholash kerak."
duration: 40
sources:
  - id: blog-greenteagc
    note: "Go Blog, 2025-yil 29-oktabr: tracing GC tushuntirishi, GC narxining taqsimoti, 'work with pages, not objects' g'oyasi, seen va scanned bitlari, FIFO navbat, vector kernel, baholash va ishlamaydigan holatlar, Availability bo'limi"
  - id: go125
    note: "Runtime bo'limi, New experimental garbage collector: GOEXPERIMENT=greenteagc bilan yoqiladi, 10-40 foiz GC overhead kamayishi kutilgan"
  - id: go126
    note: "Runtime bo'limi, New garbage collector: default yoqilgan, vector instruksiyalar, nogreenteagc bilan o'chiriladi, opt-out Go 1.27 da olib tashlanishi kutilgan"
  - id: go127
    note: "Runtime bo'limi: Green Tea opt-out'ning olib tashlanishi haqida gap yo'q (shuning uchun 1.27 va undan keyingi holat dars matnida noma'lum deb belgilangan)"
quiz:
  - q: "Green Tea'ning blog'dagi asosiy g'oyasi qaysi?"
    options:
      - "GC obyektlarni xotirada zichlaydi (compaction) va ko'chiradi"
      - "GC avlodlarga bo'linadi: yosh obyektlar tez-tez, eskilari kamdan-kam skanerlanadi"
      - "Mark fazasi olib tashlanadi va faqat sweep qoladi"
      - "Ish ro'yxati obyektlar emas sahifalar bo'yicha yuritiladi: skanerlash ham sahifa bo'yicha, bir sahifadagi bir nechta obyekt ketma-ket"
    answer: 3
    explain: "Blog g'oyasi sahifalar bilan ishlash. Sahifa 8 KiB, unda bir xil hajmli obyektlar. Ko'chirish va avlodlarga bo'lish Green Tea'ning qismi emas: 55-darsda ko'rdik, Go GC'si non-moving va non-generational, blog buni o'zgartirishni tilga olmaydi."
  - q: "Green Tea sahifa navbati nega LIFO (stack) emas, FIFO (queue) tartibida?"
    options:
      - "Sahifa navbatda turganda unga ishora qiluvchi ko'rsatkichlar to'planadi, shuning uchun sahifa olinganda ko'proq obyektni birdan skanerlash mumkin"
      - "FIFO tartibi deadlock'dan saqlaydi"
      - "FIFO sweep fazasini tezlashtiradi"
      - "LIFO sahifalarni qayta ko'rishga yo'l qo'ymaydi, FIFO esa yo'l qo'yadi, va faqat shu farq"
    answer: 0
    explain: "Blog: seen obyektlar sahifa navbatda turgan vaqtda to'planadi va keyin birga qayta ishlanadi. Misolda A sahifasi bir martada to'rtta obyekt o'rniga uchta skanerlanadi (birinchisi allaqachon scanned). Shu sababli navbat FIFO. Original algoritmda obyekt mark davomida ish ro'yxatiga ko'pi bilan bir marta kiradi, Green Tea'da esa sahifa bir necha marta navbatga qaytishi mumkin."
  - q: "Servis Go 1.26 ga o'tgach GC CPU ulushi oshdi. Birinchi tekshiruv nima?"
    options:
      - "Servisni Go 1.24 ga qaytarish"
      - "GOGC ni 400 ga ko'tarish"
      - "Bir xil yuklamada ikki variant: default (Green Tea) va `GOEXPERIMENT=nogreenteagc` bilan build; GC CPU ulushi va kechikishni solishtirish, farq bo'lsa issue ochish"
      - "Hech narsa: 10-40 foiz yaxshilanish kafolatlangan"
    answer: 2
    explain: "go126 notes: yangi GC `nogreenteagc` bilan build qilinganda o'chiriladi va performansi yoki xulqi sababli o'chirgan bo'lsangiz issue ochishni so'raydi. Blog va notes 10-40 foizni 'kutilmoqda' deb yozadi: kafolat emas, ba'zi ish yuklamalari kam yoki umuman foyda ko'rmaydi."
  - q: "Darsdagi tajribada 3 million obyektli bog'langan ro'yxat ketma-ket joylashganda `runtime.GC()` 29 ns/obyekt, aralash joylashganda 385-446 ns/obyekt oldi (Go 1.24.7, eski GC). Bu nimani isbotlaydi?"
    options:
      - "Green Tea 13 baravar tezroq ekanini"
      - "Eski GC mark vaqti obyektlarning xotira joylashuviga kuchli bog'liq ekanini (kesh va xotira kechikishi); Green Tea o'lchanmagan, va bunday yagona zanjir yaxshilanish olmaydigan ish yuklamasiga misol bo'lishi mumkin"
      - "Aralash ro'yxatlar GC'ni to'xtatib qo'yishini"
      - "Ketma-ket ro'yxat stack'ga joylashishini"
    answer: 1
    explain: "Bu o'lchov Green Tea haqida hech narsa demaydi: 1.24.7 da u mavjud emas. U blog'ning 'mark vaqtining kamida 35 foizi heap xotirasini kutishda o'tadi' da'vosi bilan mos yo'nalishni ko'rsatadi. Yagona zanjirda har sahifada bitta faol obyekt bo'ladi, blog aynan shunday ish yuklamalari kam foyda ko'rishi mumkinligini aytadi."
  - q: "Ilova CPU'ning 10 foizini GC'ga sarflaydi. Green Tea GC xarajatini 10-40 foizga kamaytirsa, umumiy CPU'da nima kutiladi?"
    options:
      - "1-4 foiz kamayish (blog'dagi misol)"
      - "10-40 foiz kamayish"
      - "Hech narsa o'zgarmaydi"
      - "GC ulushi yarmiga tushadi"
    answer: 0
    explain: "Blog: ilova vaqtining 10 foizini GC'da o'tkazsa, GC CPU'dagi 10-40 foizlik kamayish umumiy CPU'da 1-4 foizga teng. Foizlar GC ulushiga nisbatan, butun dasturga emas."
  - q: "Vector tezlashtirish (AVX-512) haqida manbalar nima deydi?"
    options:
      - "Go 1.25 eksperimentiga kiradi va barcha x86 CPU'larda ishlaydi"
      - "Faqat ARM64'da ishlaydi"
      - "GC'ni yadro darajasida GPU'ga ko'chiradi"
      - "Go 1.25 eksperimentiga kirmaydi; Go 1.26 yangi amd64 CPU'larda (Intel Ice Lake, AMD Zen 4 va yangilari) vector instruksiyalardan foydalanadi va shu yerda GC overhead'da yana 10 foiz atrofida kamayish kutiladi"
    answer: 3
    explain: "Blog 1.25 eksperimenti vector yaxshilanishsiz ekanini yozadi, go126 notes esa 1.26 vector instruksiyalardan foydalanishini va 10 foiz atrofida qo'shimcha kamayishni kutilayotganini aytadi. Aniq instruksiya (VGF2P8AFFINEQB) blog'da tasvirlangan."
task:
  title: "Green Tea holatini aniqlash"
  prompt: |
    Siz bir necha Go versiyasida qurilgan servislarni kuzatasiz va har bir ikkilik fayl uchun Green Tea GC holatini hisobotga yozishingiz kerak. Kirish: `runtime.Version()` ko'rinishidagi versiya (`go1.26.1`, `go1.26rc1`) va qurilish paytidagi `GOEXPERIMENT` qiymati (vergul bilan ajratilgan ro'yxat).

    Qoidalar manbalardan: Go 1.25 dan eski versiyada Green Tea yo'q (`mavjud emas`); Go 1.25 da default o'chiq, `greenteagc` yoqadi; Go 1.26 da default yoqilgan, `nogreenteagc` o'chiradi; Go 1.27 va undan keyingi versiyalar uchun manbalar yetarli emas (`noma'lum`), shuningdek versiya formati tanilmasa ham `noma'lum`.

    Boshlang'ich kod faqat `strings.Contains` ishlatadi va versiyani hisobga olmaydi. Uni tuzating: versiyadan minor raqamni ajrating, `GOEXPERIMENT` ro'yxatini elementlar bo'yicha taqqoslang (`nogreenteagc` ichida `greenteagc` bor!). Imzoni o'zgartirmang.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "strings"
    )

    // state Go versiyasi (runtime.Version() ko'rinishida) va GOEXPERIMENT
    // qiymatiga qarab Green Tea GC holatini aytadi.
    func state(version, goexperiment string) string {
        if strings.Contains(goexperiment, "greenteagc") {
            return "yoqilgan"
        }
        return "o'chirilgan"
    }

    type tc struct{ version, exp, want string }

    func main() {
        cases := []tc{
            {"go1.24.7", "", "mavjud emas"},
            {"go1.25.0", "", "o'chirilgan"},
            {"go1.25.3", "greenteagc", "yoqilgan"},
            {"go1.25.3", "nogreenteagc", "o'chirilgan"},
            {"go1.26.0", "", "yoqilgan"},
            {"go1.26.1", "nogreenteagc", "o'chirilgan"},
            {"go1.26.0", "swissmap,nogreenteagc", "o'chirilgan"},
            {"go1.26.0", "greenteagc", "yoqilgan"},
            {"go1.26rc1", "", "yoqilgan"},
            {"go1.27.0", "nogreenteagc", "noma'lum"},
            {"go1.27.0", "", "noma'lum"},
            {"devel go1.27-abc", "", "noma'lum"},
        }
        bad := 0
        for _, c := range cases {
            if got := state(c.version, c.exp); got != c.want {
                bad++
                fmt.Printf("XATO: state(%q, %q) = %q, kutilgan %q\n", c.version, c.exp, got, c.want)
            }
        }
        fmt.Println("xato soni:", bad)
    }
  solution: |
    package main

    import (
        "fmt"
        "strconv"
        "strings"
    )

    // minor "go1.26.1" yoki "go1.26rc1" dan 26 ni ajratadi.
    func minor(version string) (int, bool) {
        rest, ok := strings.CutPrefix(version, "go1.")
        if !ok {
            return 0, false
        }
        end := 0
        for end < len(rest) && rest[end] >= '0' && rest[end] <= '9' {
            end++
        }
        n, err := strconv.Atoi(rest[:end])
        return n, err == nil
    }

    func has(goexperiment, name string) bool {
        for _, e := range strings.Split(goexperiment, ",") {
            if strings.TrimSpace(e) == name {
                return true
            }
        }
        return false
    }

    // state Go versiyasi (runtime.Version() ko'rinishida) va GOEXPERIMENT
    // qiymatiga qarab Green Tea GC holatini aytadi.
    func state(version, goexperiment string) string {
        m, ok := minor(version)
        switch {
        case !ok:
            return "noma'lum"
        case m < 25:
            return "mavjud emas"
        case m == 25:
            if has(goexperiment, "greenteagc") {
                return "yoqilgan"
            }
            return "o'chirilgan"
        case m == 26:
            if has(goexperiment, "nogreenteagc") {
                return "o'chirilgan"
            }
            return "yoqilgan"
        default:
            // 1.27 va undan keyingi: 1.26 notes opt-out'ni 1.27 da olib tashlanishi
            // kutilmoqda deydi, 1.27 notes buni tasdiqlamaydi: javob noma'lum.
            return "noma'lum"
        }
    }

    type tc struct{ version, exp, want string }

    func main() {
        cases := []tc{
            {"go1.24.7", "", "mavjud emas"},
            {"go1.25.0", "", "o'chirilgan"},
            {"go1.25.3", "greenteagc", "yoqilgan"},
            {"go1.25.3", "nogreenteagc", "o'chirilgan"},
            {"go1.26.0", "", "yoqilgan"},
            {"go1.26.1", "nogreenteagc", "o'chirilgan"},
            {"go1.26.0", "swissmap,nogreenteagc", "o'chirilgan"},
            {"go1.26.0", "greenteagc", "yoqilgan"},
            {"go1.26rc1", "", "yoqilgan"},
            {"go1.27.0", "nogreenteagc", "noma'lum"},
            {"go1.27.0", "", "noma'lum"},
            {"devel go1.27-abc", "", "noma'lum"},
        }
        bad := 0
        for _, c := range cases {
            if got := state(c.version, c.exp); got != c.want {
                bad++
                fmt.Printf("XATO: state(%q, %q) = %q, kutilgan %q\n", c.version, c.exp, got, c.want)
            }
        }
        fmt.Println("xato soni:", bad)
    }
  solutionNotes: |
    - `strings.Contains(exp, "greenteagc")` `nogreenteagc` ni ham yoqilgan deb hisoblaydi: qism-satr tekshiruvi emas, vergul bo'yicha ajratilgan element tengligi kerak.
    - Minor raqam `strings.CutPrefix(version, "go1.")` va raqamlarni o'qish bilan olinadi; `go1.26rc1` ham 26 beradi, `devel go1.27-abc` esa formatga mos kelmaydi va `noma'lum` bo'ladi.
    - Go 1.25 da default o'chiq, Go 1.26 da yoqilgan: ikki versiya uchun mantiq teskari, shuning uchun `switch` har versiyani alohida ko'radi.
    - 1.27 va undan keyingisi uchun javob `noma'lum`: go126 notes `nogreenteagc` opt-out'ning 1.27 da olib tashlanishi kutilayotganini aytadi, go127 notes esa buni tasdiqlamaydi. Manbasiz holatni taxmin qilmaslik to'g'ri.
    - Kutilgan chiqish: `xato soni: 0`.
  checklist:
    - "`nogreenteagc` yoqilgan deb hisoblanmaydi (vergul bo'yicha ajratilgan aniq taqqoslash)"
    - "Go 1.24 va undan eskisi uchun `mavjud emas`"
    - "Go 1.25 da bo'sh `GOEXPERIMENT` o'chiq, 1.26 da yoqilgan"
    - "`go1.26rc1` va `devel ...` versiyalari xatosiz qayta ishlanadi"
    - "1.27 va undan keyingisi uchun `noma'lum` qaytadi"
---

## Muammo

55-darsda ko'rdik: GC'ning CPU narxi ko'pincha STW to'xtashlaridan emas, mark ishidan keladi. Go jamoasining o'zi buni raqamlar bilan aytadi: Go blog'iga ko'ra, Go dasturlari CPU vaqtining 20 foiz va undan ko'pini GC'da o'tkazishi kam uchramaydi, GC xarajatining 90 foizga yaqini mark fazasida, 10 foizi sweep'da, mark vaqtining esa kamida 35 foizi heap xotirasiga murojaatni kutishda o'tadi. Ya'ni GC'ning asosiy dushmani hisoblash emas, xotira kechikishi.

Bu dars Go 1.25 da tajriba sifatida kelgan va Go 1.26 da default bo'lgan Green Tea GC haqida. Muhim cheklov: bu dars Go 1.24.7 sandbox'ida yozildi va Green Tea'ni lokal kompilyatsiya qilib yoki o'lchab bo'lmaydi (u 1.25 dan keyin paydo bo'lgan). Shuning uchun darsdagi hamma Green Tea da'volari, jumladan hamma foizlar, Go blog'i (2025-yil 29-oktabr) va Go 1.25 hamda 1.26 release notes'laridan olingan va manbaga nisbat berilgan. Lokal o'lchovlar faqat bitta narsani ko'rsatadi: Go 1.24.7 dagi eski GC'ning mark vaqti xotira joylashuviga qanchalik bog'liq. Bu Green Tea'ning o'lchovi emas.

Amaliy savol shunday: servisingizni Go 1.26 ga yangilaganingizda GC CPU ulushi o'zgaradi. Nima uchun, qachon yaxshilanadi, qachon yaxshilanmaydi va buni qanday tekshirish kerak? Bu darsning maqsadi shu.

## Asosiy g'oya

### Eski mark: obyektlar bo'yicha graf yurish

Blog mark-sweep'ni sodda graf yurish deb tushuntiradi: obyektlar graf tugunlari, ko'rsatkichlar qirralar. Ildizlardan boshlab hamma erishish mumkin bo'lgan obyekt belgilanadi (55-darsda tri-color shu algoritm). Ish ro'yxati (work list) obyektlardan iborat va stack kabi ishlaydi (oxirgi kirgan birinchi chiqadi), shuning uchun yurish chuqurlik bo'yicha (depth-first) yaqin. Blog buni runtime'ning haqiqiy algoritmi deb ataydi.

Muammo shundaki, bunday yurish xotirada sakraydi. Har bir obyekt kichik ish, keyingi obyekt esa oldingisiga bog'liq va avvaldan noma'lum. Bir-biriga ishora qiluvchi ikki obyekt xotirada yaqin turishi kafolatlanmagan. Blog tilidagi o'xshatish: CPU shahar ko'chalarida ketyapti, har burilishda sekinlashadi, tezlik olish imkoni yo'q. Blog asosiy xotiraga murojaat keshdagidan 100 baravargacha sekin bo'lishi mumkinligini ham eslatadi. Va hozirgi apparat tendensiyalari buni og'irlashtiradi: NUMA (xotiraga murojaat narxi qaysi yadro murojaat qilishiga bog'liq), har yadroga to'g'ri keladigan xotira o'tkazuvchanligining kamayishi, yadrolar sonining oshishi (parallel mark umumiy navbatda tiqilinch beradi) va vector instruksiyalarni ishlatish qiyinligi.

### Green Tea: obyekt emas, sahifa

Blog'dagi asosiy g'oya bir jumlada: "Work with pages, not objects." Aniqroq: skanerlash sahifa bo'yicha, ish ro'yxati sahifalardan iborat, belgilangan obyektlar esa har sahifa ichida mahalliy kuzatiladi. Go'da sahifa 8 KiB va undagi hamma obyekt bir xil hajmda (54-dars: span va size class); shu tuzilma g'oyani mumkin qiladi.

Mexanizm: har obyekt uchun endi ikki bit saqlanadi. "Seen" biti: bu obyektga ko'rsatkich ko'rilgan. "Scanned" biti: obyekt skanerlangan. Ildizdan obyektga ishora topilsa, runtime obyektni emas, uning sahifasini navbatga qo'yadi va obyektning seen bitini o'rnatadi. Sahifa navbatdan olinganda seen va scanned bitlari farqi shu o'tishda qaysi obyektlarni skanerlash kerakligini aytadi. Navbat endi FIFO (birinchi kirgan birinchi chiqadi). Bu ataylab: sahifa navbatda turgan vaqtda unga yangi seen obyektlar to'planadi va sahifa olinganda ularni ketma-ket, xotira tartibida skanerlash mumkin. Sahifa mark davomida navbatga bir necha marta qaytishi mumkin. Blog misolida original algoritm 7 ta alohida skanerlash o'tishi, Green Tea esa 4 ta bilan tugaydi, o'tishlar uzunroq va xotira bo'ylab ketma-ket.

Bu nega mikroarxitekturaga mos? Yaqin obyektlar birga skanerlanadi, shuning uchun kesh ko'proq ishlaydi; sahifa metadata'si ham keshda bo'ladi; ish ro'yxati kichikroq (obyekt emas sahifalar) va shuning uchun navbatdagi tiqilinch kamayadi. Blog yana bir narsani qayd etadi: bu g'oyada GC'ning parallel va concurrent bajarilishi saqlanadi, "bu tafsilotlar yadro algoritmidan asosan ajralgan". Bu darsdagi faza tartibi (55-dars) o'zgarmaydi, o'zgargani faqat mark ichidagi ishni tashkil etish. Ammo bu talqin blog'ning umumiy bayoniga tayanadi; runtime kodini Green Tea uchun tekshirmadik.

### Vector tezlashtirish

Sahifa metadata'si (har obyekt uchun seen va scanned bitlari va qaysi so'zlar ko'rsatkich ekani haqida allocator ma'lumoti) bir sahifa uchun shunchalik kichikki, AVX-512 ning 512 bitli ikki registriga sig'adi. Blog skanerlash yadrosini qadamma-qadam tushuntiradi: bitlarni solishtirish, faol obyektlar bitmapini hosil qilish, uni so'z darajasidagi bitmapga kengaytirish, ko'rsatkichlar bitmapi bilan kesishtirish va keyin 64 bayt chunklab ko'rsatkichlarni yig'ish. Kengaytirish uchun GFNI to'plamidagi `VGF2P8AFFINEQB` instruksiyasi ishlatiladi; blog uni AMD Zen 4 va Intel Ice Lake dan boshlab mavjud deb yozadi. Bu faqat Go 1.26 da: blog 1.25 eksperimenti vector yaxshilanishsiz ekanini aniq yozadi.

## Chuqurroq: versiyalar, da'volar va chegaralar

### Qaysi versiyada nima

Manbalar bo'yicha xronologiya: Go 1.25 (2025-yil avgust) da yangi GC tajriba sifatida mavjud, build vaqtida `GOEXPERIMENT=greenteagc` bilan yoqiladi. Go 1.26 da u default yoqilgan; `GOEXPERIMENT=nogreenteagc` bilan build vaqtida o'chiriladi. go126 notes opt-out sozlamasi Go 1.27 da olib tashlanishi kutilayotganini yozadi. Go 1.27 notes'ining Runtime bo'limini ko'rib chiqdik: unda bu haqda gap yo'q. Shuning uchun 1.27 va undan keyingi versiyalardagi holatni bilmaymiz va topshiriqdagi funksiya ham shu holatda `noma'lum` qaytaradi. `GOEXPERIMENT` build vaqtida beriladi (blog va notes: at build time), shuning uchun allaqachon qurilgan ikkilik faylda uni o'zgartirib bo'lmaydi.

Eski versiyada bu eksperiment so'ralsa nima bo'lishini tekshirdik (Go 1.24.7, linux/amd64):

```text
$ GOEXPERIMENT=greenteagc go build -o /dev/null .
go: unknown GOEXPERIMENT greenteagc
```

Ya'ni 1.24 toolchain eksperiment nomini tanimaydi va build'ni rad etadi: jimgina e'tiborsiz qoldirmaydi.

### Foizlar nimaga nisbatan

Blog va ikkala notes bir xil diapazonni beradi: GC overhead'da 10 dan 40 foizgacha kamayish kutilmoqda, bu "GC'ni ko'p ishlatadigan real dasturlar" uchun. Blog aniqlaydi: eng tipik yaxshilanish (modal) 10 foiz atrofida, vector tezlashtirishsiz o'lchangan; vector qo'shilsa yana 10 foiz atrofida kutiladi (go126 notes ham shunday yozadi, faqat yangi amd64 CPU'lar uchun). Eng muhimi, foizlar GC CPU vaqtiga nisbatan: ilova vaqtining 10 foizini GC'da o'tkazsa, 10-40 foiz yaxshilanish butun dastur CPU'sida 1-4 foiz kamayish beradi (blog'dagi hisob). Ya'ni GC'si kichik servis Green Tea'dan deyarli hech narsa sezmaydi.

### Qachon foyda kam yoki yo'q

Blog buni yashirmaydi. Green Tea gipotezasi: bitta o'tishda bir sahifada yetarlicha obyekt to'planadi va to'plash xarajatini qoplaydi. Struktura muntazam bo'lsa (bir xil hajmli obyektlar, grafda o'xshash chuqurlikda) bu ishlaydi. Ba'zi ish yuklamalarida har o'tishda sahifada faqat bitta obyekt skanerlanadi; bunda Green Tea graf yurishdan yomonroq bo'lishi mumkin, chunki to'plashga urinib muvaffaqiyatsiz bo'ladi. Runtime bitta obyektli sahifalar uchun maxsus holatni ishlatadi, bu regressiyani kamaytiradi lekin to'liq yo'qotmaydi. Blog yana kutilmagan natijani ham yozadi: sahifaning atigi 2 foizini bir o'tishda skanerlash ham graf yurishdan yaxshiroq bo'lishi mumkin. Biz bu raqamlarni o'zimiz o'lchamadik.

## Misol: xotira joylashuvi GC vaqtiga qanday ta'sir qiladi

Quyidagi dastur 3 million 32 baytlik `Node` ajratadi va ularni bitta bog'langan ro'yxatga ulaydi. Birinchi holatda ro'yxat ajratish tartibida (qo'shni obyektlar xotirada qo'shni), ikkinchisida tasodifiy almashtirilgan tartibda. Har holatda `runtime.GC()` 9 marta chaqiriladi va mediana olinadi. GC avtomatik ishga tushmasligi uchun `GOGC=off` o'rnatiladi. Dastur build ma'lumotidan `GOEXPERIMENT` qiymatini ham o'qiydi: shu usul bilan istalgan ikkilik faylda qaysi eksperiment yoqilganini bilish mumkin.

```go
package main

import (
	"fmt"
	"math/rand"
	"runtime"
	"runtime/debug"
	"sort"
	"time"
)

// Node - 32 baytlik obyekt: ikkita ko'rsatkich va ikkita son.
type Node struct {
	Next  *Node
	Alt   *Node
	ID    int64
	Value int64
}

const n = 3_000_000

// build n ta obyekt ajratadi va ularni ikki xil tartibda bog'laydi.
func build(shuffled bool) *Node {
	nodes := make([]*Node, n)
	for i := range nodes {
		nodes[i] = &Node{ID: int64(i)}
	}
	order := make([]int, n)
	for i := range order {
		order[i] = i
	}
	if shuffled {
		rand.New(rand.NewSource(1)).Shuffle(n, func(i, j int) { order[i], order[j] = order[j], order[i] })
	}
	for i := 0; i+1 < n; i++ {
		nodes[order[i]].Next = nodes[order[i+1]]
	}
	return nodes[order[0]]
}

// gcTime runtime.GC() ni k marta chaqiradi va medianani qaytaradi.
func gcTime(k int) time.Duration {
	d := make([]time.Duration, k)
	for i := range d {
		t := time.Now()
		runtime.GC()
		d[i] = time.Since(t)
	}
	sort.Slice(d, func(i, j int) bool { return d[i] < d[j] })
	return d[k/2]
}

func main() {
	debug.SetGCPercent(-1) // sikllarni faqat o'zimiz boshlaymiz
	bi, _ := debug.ReadBuildInfo()
	exp := "(yo'q)"
	for _, s := range bi.Settings {
		if s.Key == "GOEXPERIMENT" {
			exp = s.Value
		}
	}
	fmt.Println(runtime.Version(), runtime.GOARCH, "GOMAXPROCS =", runtime.GOMAXPROCS(0), "GOEXPERIMENT =", exp)

	for _, shuffled := range []bool{false, true} {
		head := build(shuffled)
		runtime.GC()
		d := gcTime(9)
		name := "ketma-ket"
		if shuffled {
			name = "aralash  "
		}
		fmt.Printf("%s: GC mediana %6.1f ms, obyekt boshiga %5.1f ns\n", name, float64(d.Microseconds())/1000, float64(d.Nanoseconds())/n)
		runtime.KeepAlive(head)
		head = nil
		runtime.GC()
	}
}
```

Natija (Go 1.24.7, linux/amd64, GOMAXPROCS = 2, boshqa jarayonlar bilan bo'lingan mashina; ikki ishga tushirish):

```text
go1.24.7 amd64 GOMAXPROCS = 2 GOEXPERIMENT = (yo'q)
ketma-ket: GC mediana   89.5 ms, obyekt boshiga  29.8 ns
aralash  : GC mediana 1155.1 ms, obyekt boshiga 385.0 ns

go1.24.7 amd64 GOMAXPROCS = 2 GOEXPERIMENT = (yo'q)
ketma-ket: GC mediana   88.1 ms, obyekt boshiga  29.4 ns
aralash  : GC mediana 1338.8 ms, obyekt boshiga 446.3 ns
```

Bir xil obyektlar, bir xil soni, bir xil ko'rsatkichlar, lekin joylashuv farqi GC vaqtini 13-15 baravar o'zgartirdi. Nega bunday katta farq? Bog'langan ro'yxatda har keyingi obyekt oldingisini skanerlash natijasi bilan topiladi, shuning uchun CPU xotira so'rovlarini oldindan bera olmaydi; ketma-ket joylashuvda esa keyingi obyekt yonma-yon va keshda yoki apparat oldindan yuklashida bo'ladi. Bu ta'rifni biz kod darajasida tekshirmadik, u o'lchovning mantiqiy talqini; o'lchovning o'zi (13-15 baravar) haqiqiy. Bu blog'ning "mark vaqtining katta qismi xotirani kutishda" tezisiga mos yo'nalish, lekin undan ortiq narsani isbotlamaydi. Ayniqsa quyidagilarni isbotlamaydi: (1) Green Tea bu holatni tezlashtiradi; (2) real servislarda shunday farq bo'ladi. Yagona zanjir esa blog tasvirlagan yaxshilanmaydigan holatga yaqin: har sahifada bitta faol obyekt.

`GOEXPERIMENT` qiymati ikkilik faylda qanday ko'rinishi: 1.24.7 da boshqa eksperiment bilan qurilgan nusxada shunday chiqdi (boshqa eksperiment, chunki `greenteagc` bu versiyada yo'q):

```text
$ GOEXPERIMENT=noregabiwrappers go build -o app .
$ go version -m app | grep GOEXPERIMENT
	build	GOEXPERIMENT=noregabiwrappers
$ ./app | head -1
go1.24.7 amd64 GOMAXPROCS = 2 GOEXPERIMENT = noregabiwrappers
```

Go 1.25 da `greenteagc` bilan qurilgan ikkilik faylda `go version -m` aynan shu tarzda `GOEXPERIMENT=greenteagc` chiqarishi kutiladi, lekin biz buni tekshira olmadik. Xuddi shuningdek, default (1.26 da Green Tea yoqilgan) ikkilik faylda `build GOEXPERIMENT=...` qatori bo'lmaydi: bo'lmasa, versiyadan holatni chiqarish kerak, topshiriqdagi funksiya shu ishni qiladi.

## Qachon qo'llamaslik kerak

Bu bo'lim Green Tea'ni "qo'llash" emas, unga ishonishning chegaralari haqida.

Birinchidan, 10-40 foizni va'da sifatida o'qimang. Manbalar "kutilmoqda" va "ko'p ish yuklamasida" deydi, ba'zi ish yuklamalari kam yoki umuman foyda ko'rmaydi. O'z servisingizda o'lchang: bir xil yuklama ostida ikki build, `GOEXPERIMENT=nogreenteagc` (1.26 da) va default. Taqqoslang: `/cpu/classes/gc/total:cpu-seconds` ulushi (topshiriq 55-darsdagi `diff`), p99 kechikish, RSS.

Ikkinchidan, GC kichik servisda optimizatsiya mavzusi emas. GC vaqtning 2-3 foizini olsa, 40 foizlik kamayish butun CPU'da 1 foizga yetmaydi. Avval pprof bilan GC haqiqatan muammo ekanini ko'ring (62, 63-darslar).

Uchinchidan, kodni Green Tea'ga moslab yozmang. Blog'dagi g'oya runtime ichida; ilova darajasida ko'rsatkichlarni kamaytirish, obyektlarni birga ajratish va allocation'larni kamaytirish baribir foyda beradi, lekin ularni "Green Tea uchun" qilish asossiz: bu sozlash emas, algoritm.

To'rtinchidan, `nogreenteagc` opt-out'iga uzoq muddat tayanmang. go126 notes uni 1.27 da olib tashlash kutilayotganini yozadi. Agar sizda regressiya bo'lsa, issue oching (notes shuni so'raydi), va opt-outni vaqtinchalik chora deb bilib rejalashtiring.

Beshinchidan, vector tezlashtirish uchun CPU kerak (Intel Ice Lake yoki AMD Zen 4 va yangilari). ARM yoki eski x86 serverlarda go126 notes'dagi qo'shimcha 10 foiz kutilmaydi.

## Stack'da: Node.js bilan farq

Go 1.26 da `GOEXPERIMENT` build bayrog'i bilan ikki GC'ni solishtirish mumkin: bu A/B tajribasi uchun qulay imkoniyat. Deployment pipeline'da ikkita artefakt quring (default va `nogreenteagc`), canary'da ikkalasini bir xil trafikda ishga tushiring.

Monitoringda GC sozlamasi o'zgarganini ko'rish uchun ikkilik faylga `go version -m` natijasini yoki `debug.ReadBuildInfo()` dan `GOEXPERIMENT` ni metrikaga yorliq sifatida qo'shing. Metrikalar: GC CPU ulushi (`/cpu/classes/gc/total:cpu-seconds` ni `/cpu/classes/total:cpu-seconds` ga nisbati oyna bo'yicha), `/gc/cycles/total:gc-cycles` o'sishi va GC pauza gistogrammasi. Toolchain yangilangandan keyin shu uch grafikni yangilanishdan oldingi hafta bilan solishtiring.

Konteynerlarda yana bir narsa: yangilash bilan birga GOMAXPROCS ham o'zgargan bo'lishi mumkin (53-dars, Go 1.25). Ikki o'zgarishni birdaniga qilmang, aks holda GC o'zgarishini ajratib bo'lmaydi.

## Xulosa

- Green Tea mark fazasini obyektlar o'rniga sahifalar bo'yicha tashkil etadi: FIFO sahifa navbati, har obyekt uchun seen va scanned bitlari, bir sahifadagi obyektlar birga skanerlanadi. Maqsad: xotira kechikishini kamaytirish.
- Versiyalar: Go 1.25 da eksperiment (`GOEXPERIMENT=greenteagc`), Go 1.26 da default (`nogreenteagc` bilan o'chiriladi, opt-out 1.27 da olib tashlanishi kutilgan, 1.27 notes buni tasdiqlamaydi). Vector tezlashtirish Go 1.26 da yangi amd64 CPU'larda.
- Manbalardagi kutilma: GC overhead'da 10-40 foiz kamayish; 10 foizlik GC ulushida bu butun CPU'da 1-4 foiz. Biz Green Tea'ni o'lchay olmadik, hamma foizlar manbaga tegishli.
- Yaxshilanish kafolatlanmagan: sahifada bitta faol obyekt bo'ladigan ish yuklamalari kam foyda ko'radi yoki yomonlashadi. Eski GC'da ham xotira joylashuvi mark vaqtini 13-15 baravar o'zgartirdi (bizning o'lchov, Go 1.24.7).
- Baholash: bir xil yuklamada default va `nogreenteagc` build, GC CPU ulushi, kechikish va RSS bo'yicha solishtirish; regressiya bo'lsa issue ochish.
