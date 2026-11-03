---
n: 1
slug: go-falsafa-va-versiyalar
title: "Go falsafasi, versiyalar va Go 1 compatibility"
summary: "Go nima uchun yaratilgan, Go 1 compatibility aynan nimani kafolatlaydi va nimani kafolatlamaydi, release va qo'llab-quvvatlash siyosati qanday ishlaydi, GODEBUG va go.mod'dagi go qatori eski xatti-harakatni qanday saqlaydi."
duration: 35
sources:
  - id: go1compat
    note: "Introduction va Expectations bo'limlari: istisnolar ro'yxati; Sub-repositories, Operating systems va Tools bo'limlari"
  - id: go-releases
    note: "Release Policy bo'limi va release sanalari jadvali"
  - id: go-faq
    note: "Origins bo'limi: loyiha maqsadi, nega yangi til yaratilgani va dizayn tamoyillari"
  - id: godebug-doc
    note: "GODEBUG nima, default qiymatlar qanday aniqlanadi, sozlamalar qancha muddat saqlanadi"
quiz:
  - q: "Go 1 compatibility va'dasi aynan nimani kafolatlaydi?"
    options:
      - "Kompilyatsiya qilingan binary yangi release bilan qayta kompilyatsiyasiz ham ishlayveradi"
      - "Dasturning tezligi release'lar orasida o'zgarmaydi"
      - "Go 1 spetsifikatsiyasiga mos yozilgan manba kodi keyingi 1.x release'larda ham kompilyatsiya bo'ladi va to'g'ri ishlaydi (hujjatdagi istisnolardan tashqari)"
      - "go build va go vet chiqishi release'lar orasida bir xil qoladi"
    answer: 2
    explain: "Kafolat manba kodi darajasida va faqat til hamda standart paketlar uchun. Binary compatibility berilmagan (yangi release'dan keyin qayta kompilyatsiya kerak), performance va toolchain xatti-harakati ham kafolat doirasidan tashqarida."
  - q: "Kutubxona o'zining exported struct'iga yangi maydon qo'shdi. Qaysi kod bundan keyin ham kompilyatsiya bo'ladi?"
    options:
      - "geo.Point{Lat: 41.3, Lon: 69.2}"
      - "geo.Point{41.3, 69.2}"
      - "Ikkalasi ham, chunki Go maydonlarni avtomatik to'ldiradi"
      - "Hech qaysi biri, struct'ga maydon qo'shish har doim breaking change"
    answer: 0
    explain: "Keyed literal (maydon nomlari bilan) yangi maydon qo'shilganda ham kompilyatsiya bo'ladi, qolgan maydonlar zero value oladi. Unkeyed literal esa `too few values in struct literal` xatosi beradi. Go jamoasi aynan shu sababli boshqa paket tipi uchun keyed yozuvni tavsiya qiladi."
  - q: "2026-11-03 holatiga Go 1.27 chiqqan (2026-08-19). Release Policy bo'yicha qaysi major release'lar hali qo'llab-quvvatlanadi?"
    options:
      - "1.27, 1.26 va 1.25"
      - "Faqat 1.27"
      - "1.27, 1.26, 1.25 va 1.24"
      - "1.27 va 1.26"
    answer: 3
    explain: "Siyosat: har bir major release o'zidan keyin ikkita yangi major release chiqquniga qadar qo'llab-quvvatlanadi. 1.26 dan keyin faqat 1.27 chiqqan, shuning uchun u hali qo'llab-quvvatlanadi. 1.25 dan keyin 1.26 va 1.27 chiqqan, demak 1.25 endi qo'llab-quvvatlanmaydi."
  - q: "Go 1.21+ toolchain go.mod'ida `go 1.20` yozilgan modulni kompilyatsiya qilyapti. `panic(nil)` ushlanganda `recover()` nima qaytaradi?"
    options:
      - "Har doim *runtime.PanicNilError, go.mod'dagi versiya bunga ta'sir qilmaydi"
      - "nil: GODEBUG default'lari go.mod'dagi eski versiyaga moslanadi va panicnil=1 bo'ladi"
      - "Kompilyatsiya xato bilan to'xtaydi, chunki panic(nil) taqiqlangan"
      - "Qiymat toolchain versiyasiga emas, faqat GOOS ga bog'liq"
    answer: 1
    explain: "GODEBUG default'lari uch manbadan olinadi: toolchain default'lari, go.mod'dagi go versiyasiga moslash va //go:debug qatorlari. go 1.20 bo'lsa panicnil=1 va recover() nil qaytaradi. Yangi default (panicnil=0) esa recover() ga *runtime.PanicNilError beradi."
  - q: "Quyidagilardan qaysi biri Go 1 compatibility kafolati doirasidan tashqarida?"
    options:
      - "fmt.Println funksiyasining imzosi"
      - "net/http.Get funksiyasining imzosi"
      - "unsafe orqali runtime'ning ichki joylashuviga tayanadigan kod"
      - "Til spetsifikatsiyasida aniq yozilgan xatti-harakat"
    answer: 2
    explain: "Hujjat unsafe import qiladigan paketlar implementatsiyaning ichki xususiyatlariga tayanishi mumkinligini va bunday kod buzilishi mumkinligini ochiq aytadi. Qolgan uch variant kafolatlangan til va standart paket API'siga tegishli."
  - q: "GODEBUG sozlamalari haqida qaysi gap to'g'ri?"
    options:
      - "Compatibility uchun qo'shilgan sozlamalar kamida ikki yil (to'rt release) saqlanadi, ba'zilari ancha uzoq"
      - "GODEBUG faqat environment o'zgaruvchisi orqali beriladi, kod yoki go.mod orqali bo'lmaydi"
      - "Sozlama qo'shilgan release'dan keyingi release'dayoq o'chiriladi"
      - "Noma'lum GODEBUG kaliti dasturning ishga tushishini to'xtatadi"
    answer: 0
    explain: "Hujjat minimal muddatni ikki yil (to'rt Go release) deb belgilaydi. Sozlama environment, `//go:debug` qatori yoki go.mod'dagi godebug qatori orqali beriladi, noma'lum kalitlar esa e'tiborsiz qoldiriladi."
task:
  title: "panic(nil) xatti-harakatiga bog'liq bo'lmagan safeCall"
  prompt: |
    Servisingizda `safeCall` yordamchisi bor: u berilgan funksiyani chaqiradi va panic bo'lsa uni `error`ga aylantiradi. Kod `recover()` natijasi `nil` emasligiga tayanadi.

    Muammo: fayl boshidagi `//go:debug panicnil=1` qatori Go 1.20 va undan eski xatti-harakatni yoqadi. Bu rejimda `panic(nil)` dan keyin `recover()` `nil` qaytaradi va `safeCall` panic'ni jimgina yutib yuboradi (`nil` error qaytaradi). Servis bir necha yil yashaydi, shuning uchun `safeCall` ikkala rejimda ham to'g'ri ishlashi kerak.

    `safeCall`ni qayta yozing: `panic(nil)` ham, oddiy panic ham, panic bo'lmagan holat ham to'g'ri aniqlansin. Imzoni o'zgartirmang.
  lang: go
  starter: |
    //go:debug panicnil=1
    package main

    import (
        "fmt"
    )

    // safeCall fn'ni chaqiradi va panic'ni error'ga aylantiradi.
    func safeCall(fn func()) (err error) {
        defer func() {
            if r := recover(); r != nil {
                err = fmt.Errorf("panic: %v", r)
            }
        }()
        fn()
        return nil
    }

    func main() {
        fmt.Println("oddiy panic:", safeCall(func() { panic("sensor uzildi") }))
        fmt.Println("panic(nil):", safeCall(func() { panic(nil) }))
        fmt.Println("panic yo'q:", safeCall(func() {}))
    }
  solution: |
    //go:debug panicnil=1
    package main

    import (
        "fmt"
        "runtime"
    )

    // safeCall fn'ni chaqiradi va panic'ni error'ga aylantiradi.
    func safeCall(fn func()) (err error) {
        finished := false
        defer func() {
            if finished {
                return
            }
            r := recover()
            if r == nil {
                err = fmt.Errorf("panic(nil)")
                return
            }
            if pe, ok := r.(*runtime.PanicNilError); ok {
                err = fmt.Errorf("panic(nil): %w", pe)
                return
            }
            err = fmt.Errorf("panic: %v", r)
        }()
        fn()
        finished = true
        return nil
    }

    func main() {
        fmt.Println("oddiy panic:", safeCall(func() { panic("sensor uzildi") }))
        fmt.Println("panic(nil):", safeCall(func() { panic(nil) }))
        fmt.Println("panic yo'q:", safeCall(func() {}))
    }
  solutionNotes: |
    - `finished` bayrog'i `fn()` normal tugaganini alohida belgilaydi. Defer ichida bayroq o'rnatilmagan bo'lsa, funksiya panic bilan chiqqan, `recover()` natijasi qanday bo'lishidan qat'i nazar.
    - `panicnil=1` rejimida `recover()` `nil` qaytaradi, lekin panic bo'lgani bayroq orqali ma'lum, shuning uchun `err` to'ldiriladi.
    - Default rejimda (`panicnil=0`) `recover()` `*runtime.PanicNilError` qaytaradi. Bu tipni alohida ushlash ixtiyoriy, lekin xabarni aniqroq qiladi va `errors.As` bilan tekshirish imkonini beradi.
    - `//go:debug` qatorini olib tashlab, yechimni default rejimda ham ishga tushiring: natija o'xshash bo'lishi kerak (faqat panic(nil) xabari tafsilotda farq qiladi).
  checklist:
    - "`panic(nil)` ikkala rejimda (`panicnil=1` va default) `nil`dan farqli error qaytaradi"
    - "Oddiy panic xabari saqlangan: `panic: sensor uzildi`"
    - "Panic bo'lmasa `safeCall` `nil` qaytaradi"
    - "`recover()` natijasiga yagona yo'l sifatida tayanilmagan: panic bo'lgani alohida bayroq bilan aniqlanadi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Backend servis odatda uni yozgan jamoadan uzoqroq yashaydi. Besh yil ichida Go toolchain o'nga yaqin marta yangilanadi, kutubxonalar o'zgaradi, jamoa almashadi. Bu yerda ikki xil xato uchraydi. Birinchisi: "Go'da hamma narsa har doim orqaga mos" deb o'ylab, yangilanishdan keyin kutilmagan xatti-harakat o'zgarishiga duch kelish. Ikkinchisi teskarisi: yangilashdan qo'rqib, qo'llab-quvvatlanmaydigan versiyada qolish, ya'ni xavfsizlik tuzatishlarisiz ishlash.

Node.js dunyosidan kelgan dasturchi uchun bu savol tanish: major versiyani yangilash odatda release notes'ni ehtiyotkorlik bilan o'qishni talab qiladi. Go boshqacha yo'l tutgan: til va standart kutubxona uchun yagona, yozib qo'yilgan compatibility shartnomasi bor. Lekin bu shartnomaning aniq chegaralari bor va ularni bilmasdan turib, "Go buzmaydi" deb ishonish noto'g'ri. Bu dars shartnomaning matnini, uning istisnolarini va unga qo'shimcha mexanizmlarni (GODEBUG, go.mod'dagi `go` qatori) ko'rib chiqadi. Kursning qolgan qismi shu poydevorga tayanadi: qaysi xususiyat qaysi versiyadan boshlanganini bilmay turib, runtime va concurrency mavzularini to'g'ri o'rganib bo'lmaydi.

## Asosiy g'oya

### Go nima uchun yaratilgan

Go FAQ loyiha 2007-yilda boshlanganini va o'sha paytda ishlab chiqarish dasturlari odatda C++ yoki Java'da yozilganini aytadi. Mualliflar katta loyihalarni qurishdagi ortiqcha murakkablikdan, ko'p yadroli protsessorlar universal bo'lib borayotganiga qaramay tillar ularni samarali va xavfsiz ishlatishga yordam bermasligidan norozi bo'lgan. FAQ'dagi asosiy maqsad: dinamik tilning ravonligini statik, kompilyatsiya qilinadigan tilning samaradorligi va xavfsizligi bilan bitta tilda birlashtirish. Dizayn tamoyillaridan biri: tip ierarxiyasi yo'q, tiplar o'z munosabatlarini e'lon qilishi shart emas.

Bu kursning ohangini belgilaydi: Go'da ko'p qarorlar "kam xususiyat, ko'proq bashoratlilik" tamoyiliga tayanadi. Keyingi darslarda interface'lar, error qiymatlari, goroutine'lar shu falsafaning natijasi sifatida chiqadi.

### Go 1 compatibility: matn nima deydi

`go.dev/doc/go1compat` hujjati Go 1 ikki narsani belgilashini yozadi: til spetsifikatsiyasi va "standart paketlar" deb ataladigan asosiy API'lar to'plami. Va'da: Go 1 spetsifikatsiyasiga mos yozilgan dastur shu spetsifikatsiya yashaydigan davr ichida o'zgarishsiz kompilyatsiya bo'lishi va to'g'ri ishlashi kerak. Nuqtali release'lar (1.1, 1.2, ...) bu va'dani buzmasligi kerak, API'lar esa yangi paket va imkoniyatlar bilan o'sishi mumkin.

Birinchi muhim aniqlik: kafolat manba kodi darajasida. Hujjat binary compatibility'ni kafolatlamasligini ochiq yozadi: release'dan keyin dastur yangi versiya bilan bog'lanishi uchun qayta kompilyatsiya qilinishi kerak.

### Hujjatning o'zi sanaydigan istisnolar

Hujjat "Expectations" bo'limida buzilish ehtimoli past, lekin mavjud bo'lgan hollarni sanaydi. Quyidagi jadval ularni qisqa ko'rsatadi:

| Holat | Ma'nosi | Sizning kodingizda nimaga e'tibor berish kerak |
|---|---|---|
| Security | Xavfsizlik muammosini hal qilish uchun compatibility buzilishi mumkin | Xavfsizlik yangilanishlarini kechiktirmang |
| Unspecified behavior | Spetsifikatsiyada aniq yozilmagan xatti-harakatga tayanish | Map iteratsiya tartibiga tayanmang (14-dars) |
| Spetsifikatsiya xatolari | Nomuvofiqlik tuzatilganda ba'zi dasturlarning ma'nosi o'zgarishi mumkin | Release notes'ni o'qing |
| Bug'lar | Spetsifikatsiyani buzadigan bug tuzatilsa, unga tayangan dastur buziladi | Bug'ga tayangan kod yozmang |
| Struct literal'lar | Exported struct'ga maydon qo'shilishi mumkin | Boshqa paket tipi uchun keyed literal ishlating |
| Metodlar | Yangi metod embedded tiplar bilan konfliktga olib kelishi mumkin | Embedding bilan ehtiyot bo'ling (22-dars) |
| Dot import | `import . "path"` yangi nomlar bilan to'qnashishi mumkin | Testdan tashqarida ishlatmang |
| `unsafe` | Implementatsiyaning ichki xususiyatlariga tayanish | `unsafe`ni minimal va izolyatsiya qilib ishlating |

Bundan tashqari hujjat uch narsani alohida qayd etadi. Birinchisi, sub-repository'lar (masalan `golang.org/x/net`) yumshoqroq compatibility talablari bilan rivojlanadi. Ikkinchisi, `syscall` paketi kafolat doirasidan tashqarida va Go 1.4 dan beri muzlatilgan. Uchinchisi, toolchain (kompilyator, linker, build vositalari) faol rivojlanadi va xatti-harakati o'zgarishi mumkin; hatto dastur tezligi ham release'lar orasida kafolatlanmaydi.

### Release ritmi va qo'llab-quvvatlash siyosati

Release History sahifasiga ko'ra so'nggi major release'lar: Go 1.24 (2025-02-11), 1.25 (2025-08-12), 1.26 (2026-02-10) va 1.27 (2026-08-19). Ritm yiliga ikki marta, fevral va avgust. Siyosat qisqa: har bir major release o'zidan keyin ikkita yangi major release chiqquniga qadar qo'llab-quvvatlanadi. Sahifaning o'z misoli: Go 1.5 Go 1.7 chiqquniga qadar, Go 1.6 esa 1.8 chiqquniga qadar qo'llab-quvvatlangan. Qo'llab-quvvatlanayotgan versiyalarda jiddiy muammolar, jumladan xavfsizlik muammolari, minor revision'lar bilan tuzatiladi (masalan go1.27.3, 2026-10-19).

Buni bugungi holatga qo'llasak: 1.27 dan keyin hech narsa chiqmagan, 1.26 dan keyin faqat 1.27 chiqqan, ikkalasi qo'llab-quvvatlanadi. 1.25 dan keyin esa 1.26 va 1.27 chiqqan, demak 1.25 va undan eskilari endi xavfsizlik tuzatishlarini olmaydi.

## Chuqurroq: GODEBUG va go.mod'dagi go qatori

Compatibility va'dasi ba'zi o'zgarishlarni baribir ruxsat etadi (bug'larni tuzatish, xavfsizlik, yangi xususiyatlar bilan bog'liq ta'sirlar). Shu ta'sirni yumshatish uchun Go `GODEBUG` mexanizmini beradi. `GODEBUG` sozlamasi `key=value` juftligi bo'lib, runtime yoki kutubxonaning muayyan qismi qanday ishlashini boshqaradi. Environment o'zgaruvchisi vergul bilan ajratilgan ro'yxat qabul qiladi, noma'lum kalitlar e'tiborsiz qoldiriladi. Hujjatning o'z misoli: `GODEBUG=http2client=0,http2server=0` HTTP/2 ni ham client'da, ham server'da o'chiradi.

Loyiha jamoasi buzuvchi o'zgarish tayyorlaganda avval mavjud dasturlarning ko'pchiligi ishlashda qolishini ta'minlaydi, qolganlari uchun esa eski xatti-harakatni qaytaradigan yangi `GODEBUG` sozlamasi kiritadi. Bunday sozlamalar kamida ikki yil (to'rt Go release) saqlanadi, ba'zilari (masalan `http2client`) ancha uzoq, hatto cheksiz. Imkon bo'lsa, har bir sozlama uchun `runtime/metrics`da `/godebug/non-default-behavior/<nom>:events` hisoblagichi bor: u dastur default bo'lmagan qiymat tufayli necha marta boshqacha ishlaganini sanaydi.

Sozlamaning qiymati qayerdan olinishi muhim. Agar u environment'da berilmagan bo'lsa, qiymat uch manbadan yig'iladi: dasturni qurgan toolchain default'lari, go.mod'dagi `go` versiyasiga moslab o'zgartirilgan qiymatlar, va dastur ichidagi aniq `//go:debug` qatorlari. Hujjatning o'z misoli: Go 1.21 `panicnil` sozlamasini kiritgan, default `panicnil=0`, ya'ni `panic(nil)` run-time xatosiga aylanadi. Lekin Go 1.21 toolchain go.mod'ida `go 1.20` bo'lgan modulni kompilyatsiya qilsa, default'lar eski versiyaga moslanadi va `panicnil=1` bo'ladi. Go 1.23 dan boshlab go.mod yoki go.work faylida `godebug` qatorlari ham yozish mumkin, `default=go1.21` kaliti esa GODEBUG default'larini til versiyasidan alohida belgilaydi. Istisno: xavfsizlik release'lari uchun kiritilgan sozlamalar yangi xatti-harakatni barcha versiyalarga qo'llaydi.

Xulosa: go.mod'dagi `go` qatori faqat "qaysi til xususiyatlari yoqilgan" emas, u compatibility mexanizmining ham bir qismi. Toolchain'ni yangilab, go.mod'dagi versiyani ko'tarmaslik eski xatti-harakatni vaqtincha saqlaydi. Aksincha, go.mod versiyasini ko'tarish yangi default'larni yoqadi va shuning uchun test o'tkazishni talab qiladi. Bu qismni 2-darsda toolchain va go.mod bilan birga batafsil ko'ramiz.

## Misol: uch kichik tajriba

### 1. Versiya va panicnil default'i

```go
package main

import (
	"fmt"
	"runtime"
)

func main() {
	fmt.Println("toolchain:", runtime.Version())
	fmt.Println("platforma:", runtime.GOOS+"/"+runtime.GOARCH)

	defer func() {
		r := recover()
		fmt.Printf("recover() qiymati: %v (%T)\n", r, r)
	}()
	panic(nil)
}
```

Go 1.24.7 da, go.mod'da `go 1.24` bo'lganda (linux/amd64) chiqish:

```text
toolchain: go1.24.7
platforma: linux/amd64
recover() qiymati: panic called with nil argument (*runtime.PanicNilError)
```

Yangi default'da `panic(nil)` dan keyin `recover()` nil emas, `*runtime.PanicNilError` qaytaradi. Shu sabab `if r := recover(); r != nil` kabi tekshiruv panic'ni ushlaydi.

### 2. Eski xatti-harakatni qaytarish

Aynan shu dasturga fayl boshiga `//go:debug panicnil=1` qatorini qo'shsak (yoki go.mod'da `go 1.20` yozsak, yuqoridagi qoidaga ko'ra), chiqish o'zgaradi:

```go
//go:debug panicnil=1
package main

import "fmt"

func main() {
	defer func() {
		r := recover()
		fmt.Printf("recover() qiymati: %v (%T)\n", r, r)
	}()
	panic(nil)
}
```

```text
recover() qiymati: <nil> (<nil>)
```

Ikkala yo'lni (directive va go.mod'dagi `go 1.20`) shu mashinada sinab ko'rdik: natija bir xil, `recover()` `nil` qaytardi. Muhim saboq: `recover()` natijasi `nil` bo'lishi "panic bo'lmadi" degani emas. Bu tuzoqni topshiriqda tuzatasiz.

### 3. Keyed va unkeyed literal

Faraz qiling, `geo` paketi sizning jamoangiz yozgan kutubxona (1.0 versiya):

```go
// Package geo - GPS nuqtalari bilan ishlash.
package geo

// Point - GPS nuqtasi.
type Point struct {
	Lat float64
	Lon float64
}
```

Iste'molchi kodi ikki xil yozishi mumkin:

```go
a := geo.Point{41.3111, 69.2797}              // unkeyed
b := geo.Point{Lat: 41.3111, Lon: 69.2797}    // keyed
```

`go vet` birinchi qator uchun darhol `struct literal uses unkeyed fields` ogohlantirishini beradi. Kutubxona 1.1 versiyada `Alt float64` maydonini qo'shgach, unkeyed qator kompilyatsiyadan o'tmaydi:

```text
./main.go:10:33: too few values in struct literal of type geo.Point
```

Keyed qator esa o'zgarishsiz ishlaydi va `Alt` zero value (`0`) oladi: chiqish `{41.3111 69.2797 0}`. Compatibility hujjati kutubxona muallifiga struct'ga maydon qo'shish huquqini beradi, iste'molchining vazifasi esa keyed yozuvdan foydalanish.

## Qachon qo'llamaslik kerak

Compatibility va'dasiga tayanish o'z chegarasiga ega:

- Performance'ga tayanmang. Hujjat release'lar orasida dastur tezligi kafolatlanmasligini aytadi. Latency SLO'si bo'lgan servis har toolchain yangilanishidan keyin o'z benchmark'larini ishga tushirishi kerak (61-dars).
- `unsafe`, `syscall` va sub-repository'larga (`golang.org/x/...`) tayangan kod uchun Go 1 kafolati to'liq ishlamaydi. Bunday kodni izolyatsiya qiling va release'lardan keyin alohida tekshiring.
- GODEBUG'ni abadiy yechim deb bilmang. Sozlamalar kamida ikki yil saqlanishi kafolatlangan, lekin bu "muddatsiz" degani emas. Eski xatti-harakatni yoqish vaqt ajratib beradi, kodni tuzatish o'rnini bosmaydi.
- go.mod'dagi eski `go` versiyasini yangi toolchain bilan birga uzoq muddat ushlab turmang: yangi til va runtime xususiyatlari yoqilmaydi, va yangi hujjatlar sizning kodingizni tavsiflamay qoladi.
- "Go buzmaydi" deb yangilashdan oldin test o'tkazmaslik ham noto'g'ri. Hujjatning o'zi istisnolarni yozadi.

## Stack'da: Node.js/TypeScript bilan solishtirish

Node.js'da ekosistema ikki qatlamdan iborat: runtime versiyasi va npm paketlari, har birining o'z semver'i va o'z deprecation siyosati. Go'da qatlam bitta: toolchain til, standart kutubxona va runtime'ni birga olib keladi, compatibility shartnomasi esa shu to'plam uchun yagona. Amaliy xulosalar:

- CI va Docker image'larda Go versiyasini aniq belgilang (go.mod'dagi `go` va `toolchain` qatorlari, 2-dars) va qo'llab-quvvatlanayotgan versiyada qoling.
- Toolchain yangilashni alohida pull request qiling: `go vet`, testlar, `-race` (43-dars) va benchmark'lar bilan. Release notes'ni o'qing.
- Boshqa paket tipi uchun keyed literal yozing, `import .` dan qoching: bu qoidalar linter (`go vet`) bilan tekshiriladi.
- Ichki kutubxonangizni ham Go 1 uslubida versiyalang: struct'ga maydon qo'shish minor o'zgarish bo'lishi uchun iste'molchilarga keyed literal'ni talab qiling.

## Xulosa

- Go 1 compatibility manba kodi darajasidagi va'da: til va standart paketlar uchun, binary, performance va toolchain xatti-harakati uchun emas.
- Hujjat o'zi istisnolarni sanaydi: xavfsizlik, unspecified behavior, bug'lar, struct literal'lar, embedded tiplardagi metod konfliktlari, dot import va `unsafe`.
- Release'lar fevral va avgustda chiqadi; major release o'zidan keyin ikkita yangi major chiqquniga qadar qo'llab-quvvatlanadi.
- GODEBUG va go.mod'dagi `go` qatori buzuvchi o'zgarishlar uchun vaqtinchalik moslashuv beradi: sozlamalar kamida ikki yil saqlanadi.
- `recover()` natijasi `nil` bo'lishi panic bo'lmaganini anglatmaydi: ishonchli kod panic'ni alohida bayroq bilan aniqlaydi.
