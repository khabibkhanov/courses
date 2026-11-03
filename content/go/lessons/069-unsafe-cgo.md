---
n: 69
slug: unsafe-cgo
title: "unsafe va cgo: narx va xavf"
summary: "unsafe.String/Slice bilan nusxasiz konvertatsiya qancha tejaydi va qanday qoida buzilsa nima bo'ladi, cgo chaqiruvi oddiy Go chaqiruvidan necha baravar qimmat, Go pointer qoidalari va ikkala vositani qachon ishlatmaslik kerak."
duration: 35
sources:
  - id: pkg-unsafe
    note: "String, StringData, Slice, SliceData tavsiflari: bayt'lar o'zgartirilmasligi sharti, nil va manfiy uzunlik holatlarida panic"
  - id: go126
    note: "Runtime bo'limi, Faster cgo calls: cgo chaqiruvlarining boshlang'ich runtime overhead'i ~30% kamaygan"
  - id: 100go
    note: "Ro'yxatdagi xatolar kontekstida: optimallashtirishdan oldin o'lchash; unsafe va cgo haqida alohida bob sifatida emas"
quiz:
  - q: "`key := unsafe.String(&buf[0], len(buf))` bilan olingan satr map kaliti sifatida saqlandi, keyin `buf` keyingi qator bilan qayta yozildi. Nima bo'ladi?"
    options:
      - "Hech narsa: Go satrlari o'zgarmas, shuning uchun nusxa avtomatik olinadi"
      - "Kalit buferning o'ziga ishora qiladi; bufer o'zgargach kalit ham o'zgaradi va map qidiruvlari buziladi"
      - "Compiler xato beradi"
      - "Runtime darhol panic beradi"
    answer: 1
    explain: "unsafe.String nusxa olmaydi: satr buferning baytlariga ishora qiladi. Hujjat baytlar satr yashar ekan o'zgartirilmasligi shartini qo'yadi. Shu shart buzilgach map ichki tuzilmasi (hash va kalit mos kelmay qoladi) noto'g'ri ishlaydi. Panic yoki kompilyatsiya xatosi kafolatlanmagan."
  - q: "Shu mashinada 66 baytli `[]byte` ni `string(b)` bilan o'girish median 44.4 ns va 1 alloc, `unsafe.String` bilan 1.6 ns va 0 alloc berdi. To'g'ri xulosa qaysi?"
    options:
      - "unsafe har doim 27 baravar tezlashtiradi"
      - "Alloc kamayishi ns/op ga ta'sir qilmaydi"
      - "Raqamlar o'lchov xatosi, chunki unsafe sekinroq bo'lishi kerak"
      - "Nusxa va alloc yo'qolgani uchun bu bitta konvertatsiya arzonlashdi, lekin foyda faqat chaqiruv issiq yo'lda bo'lsa va natija satri bufer o'zgarmaguncha ishlatilsa ma'noli; butun dasturda 27 baravar degani emas"
    answer: 3
    explain: "Mikrobenchmark faqat shu amalni o'lchaydi. Butun dastur vaqtiga ta'siri profil bilan aniqlanadi (62-dars). Qoidani buzish xavfi esa tezlikdan oldin turadi."
  - q: "Bitta C funksiyani (`a+b`) cgo orqali chaqirish median 60.7 ns, oddiy Go chaqiruvi 2.3 ns bo'ldi. Bundan amaliy xulosa nima?"
    options:
      - "Har bir chaqiruvda qo'shimcha narx bor, shuning uchun C bilan ishni kam, katta chaqiruvlarga jamlang (batching); mayda funksiyani tsiklda cgo orqali chaqirish yomon"
      - "cgo faqat Windows'da sekin"
      - "C kodi har doim Go'dan tezroq, shuning uchun narx ahamiyatsiz"
      - "Bu GC pauzasi"
    answer: 0
    explain: "Chegara kesishuvi (Go stack'dan C stack'ga o'tish, goroutine holati) o'lchovda oddiy chaqiruvdan 20 baravardan ko'p qimmat chiqdi. Bu shu mashina va shu Go versiyasi uchun; asosiy qoida versiyadan mustaqil: chaqiruv sonini kamaytiring."
  - q: "`C.take(&h)` chaqirilganda `runtime error: cgo argument has Go pointer to unpinned Go pointer` panic'i chiqdi, bu yerda `h` Go'da yaratilgan struct bo'lib ichida Go o'zgaruvchisiga ko'rsatkich bor. Sabab nima?"
    options:
      - "C funksiya nomi noto'g'ri"
      - "Struct juda katta"
      - "C'ga uzatilayotgan Go xotirasi ichida boshqa Go xotirasiga ko'rsatkich bor; cgo qoidasi buni (mahkamlanmagan holda) taqiqlaydi, chunki cmd/cgo hujjatiga ko'ra garbage collector Go xotirasiga har bir ko'rsatkich joyini bilishi kerak"
      - "Go 1.24 da cgo o'chirilgan"
    answer: 2
    explain: "Runtime cgo chaqiruvida argumentlarni tekshiradi (standart tekshiruv yoqilgan). Go pointer ichidagi Go pointer'ni C'ga o'tkazish taqiqlangan; kerak bo'lsa runtime.Pinner yoki C xotirasi ishlatiladi. Panic'ni shu mashinada ko'rdik."
  - q: "`b := unsafe.Slice(unsafe.StringData(s), len(s))` dan olingan `b` ga `b[0] = 'X'` yozilsa nima kutiladi?"
    options:
      - "Yangi nusxa yaratiladi va `s` o'zgarmaydi"
      - "Hujjat bunday baytlarni o'zgartirmaslikni talab qiladi: xatti-harakat noaniq, `s` o'zgarishi, panic yoki xotira buzilishi mumkin"
      - "Doim muvaffaqiyatli, `s` ham o'zgaradi va bu normal"
      - "Compile-time xato"
    answer: 1
    explain: "unsafe.StringData hujjati qaytarilgan baytlarni o'zgartirmaslikni talab qiladi, chunki satrlar o'zgarmas. Literal satrlar ko'pincha faqat o'qish uchun xotirada turadi va yozish jarayonni qulatishi mumkin."
  - q: "Quyidagilardan qaysi biri `unsafe` yoki cgo'ni ishlatishga eng yaxshi asos?"
    options:
      - "Boshqa jamoa a'zosi 'tezroq' dedi"
      - "Kod chiroyli chiqadi"
      - "Maqola 30% tezlashish haqida yozgan"
      - "Profil shu amalni issiq joy deb ko'rsatdi, xavfsiz variant (nusxa, Go kutubxonasi) o'lchandi va yetmadi, invariant kichik doirada hujjatlangan va testlangan, yoki mavjud C kutubxonasidan boshqa yo'l yo'q"
    answer: 3
    explain: "unsafe va cgo kompilyator va runtime kafolatlarini o'chiradi yoki chegarasini kesadi. Ularning qiymati faqat o'lchangan va cheklangan joyda to'laydi. Qolgan sabablar mas'uliyatni oshiradi, foydani isbotlamaydi."
task:
  title: "Qayta ishlatiladigan bufer va xavfsiz kalit"
  prompt: |
    `countDevices` har qatorni bitta qayta ishlatiladigan `buf` ga oladi va `unsafe.String` bilan olingan satrni map kaliti qiladi. Bufer keyingi qatorda qayta yoziladi, shuning uchun kalitlar buzuladi (starter `3 3 0 0` chiqaradi: uzunlik 3, lekin `dev-00418` va `dev-00419` topilmaydi).

    `unsafe` ni olib tashlang va funksiyani to'g'rilang: har qator uchun avval `idx[string(buf)]` bilan qidiring (kompilyator bunday qidiruvda satr nusxasini yaratmaydi), yangi qurilma uchungina `string(buf)` nusxasini saqlang. Natijada `counts` to'g'ri bo'lsin va ajratmalar soni qatorlar soniga emas, noyob qurilmalar soniga bog'liq bo'lsin. `main` ga 1000 qatorli ikkinchi chaqiruv qo'shilgan bo'lishi mumkin; unda `AllocsPerRun` 5 qatorli holatdagidan oshmasligi kerak.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "testing"
        "unsafe"
    )

    // countDevices har qatorni bitta qayta ishlatiladigan buferga oladi
    // va qurilma nomi bo'yicha sanaydi.
    // Muammo: kalit buferning o'ziga ishora qiladi (nusxa yo'q), bufer esa
    // keyingi qatorda qayta yoziladi, shuning uchun map buziladi.
    func countDevices(lines []string) map[string]int {
        counts := make(map[string]int)
        buf := make([]byte, 0, 32)
        for _, line := range lines {
            buf = append(buf[:0], line...)
            key := unsafe.String(&buf[0], len(buf))
            counts[key]++
        }
        return counts
    }

    func main() {
        lines := []string{"dev-00417", "dev-00418", "dev-00417", "dev-00419", "dev-00417"}
        counts := countDevices(lines)
        fmt.Println(len(counts), counts["dev-00417"], counts["dev-00418"], counts["dev-00419"])
        fmt.Println(testingAllocs(lines))
    }

    func testingAllocs(lines []string) float64 {
        return testing.AllocsPerRun(100, func() { countDevices(lines) })
    }
  solution: |
    package main

    import (
        "fmt"
        "testing"
    )

    // countDevices har qatorni bitta qayta ishlatiladigan buferga oladi
    // va qurilma nomi bo'yicha sanaydi. Kalit satri faqat yangi qurilma
    // uchun nusxalanadi; mavjud kalitni qidirish nusxa talab qilmaydi.
    func countDevices(lines []string) map[string]int {
        idx := make(map[string]*int)
        buf := make([]byte, 0, 32)
        for _, line := range lines {
            buf = append(buf[:0], line...)
            if p, ok := idx[string(buf)]; ok {
                *p++
                continue
            }
            key := string(buf)
            n := 1
            idx[key] = &n
        }
        counts := make(map[string]int, len(idx))
        for k, p := range idx {
            counts[k] = *p
        }
        return counts
    }

    func main() {
        lines := []string{"dev-00417", "dev-00418", "dev-00417", "dev-00419", "dev-00417"}
        counts := countDevices(lines)
        fmt.Println(len(counts), counts["dev-00417"], counts["dev-00418"], counts["dev-00419"])
        fmt.Println(testingAllocs(lines))
        many := make([]string, 0, 1000)
        for i := 0; i < 1000; i++ {
            many = append(many, lines[i%len(lines)])
        }
        fmt.Println(testingAllocs(many))
    }

    func testingAllocs(lines []string) float64 {
        return testing.AllocsPerRun(100, func() { countDevices(lines) })
    }
  solutionNotes: |
    - `unsafe.String` nusxa olmaydi; satr bufer baytlariga ishora qiladi. Bufer qayta yozilgach map kaliti ham o'zgaradi va map ichki invarianti (hash va kalit mosligi) buziladi. Starter chiqishi `3 3 0 0` shuni ko'rsatadi, ammo bu xatti-harakat kafolatlanmagan.
    - `idx[string(buf)]` shaklidagi qidiruvni Go compiler nusxasiz bajaradi, shuning uchun mavjud qurilma uchun alloc yo'q. Yangi qurilma uchun `key := string(buf)` haqiqiy nusxa va map kaliti sifatida xavfsiz.
    - Sanagich `*int` sifatida saqlanadi, shunda `*p++` kalitni qayta yaratmaydi (shu mashinada `m[string(buf)]++` har chaqiruvda 1 alloc qildi, `_ = m[string(buf)]` esa 0).
    - Shu mashinada (Go 1.24.7) tekshirildi: yechim `3 3 1 1` chiqardi, `AllocsPerRun` 5 qatorda ham, 1000 qatorda ham 8 bo'ldi, ya'ni ajratmalar qatorlar soniga bog'liq emas.
  checklist:
    - "`unsafe` import qilinmagan"
    - "Natija `3 3 1 1` (len, dev-00417, dev-00418, dev-00419)"
    - "Mavjud qurilma uchun `string(buf)` faqat map qidiruvida ishlatilgan"
    - "1000 qatorli holatda AllocsPerRun 5 qatorli holatdan oshmaydi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Go'da ikki "eshik" bor, ular tip tizimi va runtime kafolatlarini chetlab o'tadi: `unsafe` paketi va cgo. Ikkalasi ham optimallashtirish yoki mavjud C kutubxonasidan foydalanish uchun jozibali ko'rinadi, ikkalasi ham yomon ishlatilganda eng og'ir xatolarni beradi: tasodifiy xotira buzilishi, GC bilan bog'liq crash, yoki jimgina noto'g'ri natija.

Telemetriya servisida uchrashadigan ikki holatni ko'raylik. Birinchisi: tarmoqdan o'qilgan `[]byte` ni har safar `string(b)` qilib map kaliti yoki log maydoni sifatida ishlatamiz. Har konvertatsiya nusxa va alloc demak (65-darsda ko'rdik). Bir nuqta uchun bu arzon, lekin sekundiga yuz minglab xabar kelsa, profilda aynan shu chiqib qolishi mumkin. `unsafe.String` bilan nusxasiz o'girish mumkin, ammo bufer qayta ishlatilsa, satr "o'zgaruvchan satr"ga aylanadi va map kalitlari buziladi.

Ikkinchisi: sizga tayyor C kutubxonasi kerak (sensor protokol dekoderi, geofencing kutubxonasi). cgo uni chaqirishga imkon beradi, lekin har chaqiruv oddiy Go chaqiruvidan sezilarli qimmat, build murakkablashadi (C kompilyator kerak), kross-kompilyatsiya qiyinlashadi, Go pointer qoidalari esa runtime panic bilan ko'rinadi. Bu darsda ikkalasining narxi va xavfi o'lchangan raqamlar va real chiqishlar bilan beriladi.

## Asosiy g'oya

`unsafe` va cgo "tezlik tugmasi" emas, ular shartnoma o'zgartiruvchi vositalar. Odatiy Go kodida kompilyator va runtime sizga kafolat beradi: satr o'zgarmas, slice chegarasi tekshiriladi, GC ko'rsatkichlarni biladi. `unsafe` bu kafolatlarning bir qismini sizga topshiradi: siz qoidani bilasiz va o'zingiz saqlaysiz. cgo esa Go va C dunyosi chegarasini kesadi: GC va stack boshqaruvi Go tomonida, C kodi esa o'z qoidalari bilan ishlaydi.

Shuning uchun uch qoida:

1. Avval xavfsiz variantni yozing va o'lchang (61-dars). Faqat profil (62-63 darslar) issiq joyni ko'rsatsa, `unsafe` ni ko'rib chiqing.
2. Xavfli kodni kichik funksiyaga o'rang, invariantni izohda yozing ("b bu satr yashar ekan o'zgartirilmaydi") va test bilan qoplang.
3. cgo uchun chaqiruv sonini kamaytiring: ko'p mayda chaqiruv o'rniga bitta katta chaqiruv. Chegara kesishuvi narxi har chaqiruvga tegadi, ishning hajmiga emas.

`unsafe` paketining `String`, `StringData`, `Slice`, `SliceData` funksiyalari (Go 1.17 va 1.20 da qo'shilgan) pointer arifmetikasidan ko'ra xavfsizroq vositalar: ular uzunlikni tekshiradi (manfiy uzunlik yoki `nil` bilan nolga teng bo'lmagan uzunlikda runtime panic) va yozilishi oson. Lekin asosiy shartni olib tashlamaydi: hujjat satr uchun uzatilgan baytlar satr mavjud bo'lgan davrda o'zgartirilmasligi kerak deydi, `StringData` qaytargan baytlar esa umuman o'zgartirilmasligi kerak.

## Chuqurroq: unsafe.String, Slice va cgo narxi

### Nusxasiz konvertatsiya nimani tejaydi

`string(b)` yangi xotira ajratadi va baytlarni nusxalaydi. `unsafe.String(&b[0], len(b))` esa faqat satr sarlavhasini (ko'rsatkich va uzunlik) yaratadi; bu ikki so'z, alloc yo'q. Teskari tomon: `unsafe.Slice(unsafe.StringData(s), len(s))` satrdan slice beradi, lekin unga yozish mumkin emas, chunki satr xotirasi o'zgarmas deb qabul qilingan (literal satrlar ko'pincha faqat o'qish uchun sahifada turadi).

Bu o'zgarmaslik sharti amalda eng ko'p buziladigan joy. `bufio.Scanner.Bytes()` va `net.Conn.Read` buferi kabi qayta ishlatiladigan baytlarni satrga nusxasiz o'girsangiz, satr keyingi o'qishdan keyin boshqa narsani ko'rsatadi. Pastdagi misolda bu real chiqish bilan ko'rinadi.

### Map va qayta ishlatiladigan bufer

Map kalitlari "o'zgarmas" deb faraz qilinadi: map hash'ni kalit asosida hisoblab, bucket'ga joylaydi. Kalit baytlari keyin o'zgarsa, qidiruv hash'i boshqa bucket'ga ketadi va kalit "yo'qoladi". Standart kutubxona esa bir maxsus holatni bilib, nusxasiz bajaradi: `m[string(b)]` shaklidagi qidiruvda kompilyator vaqtinchalik satr yaratmaydi. Shu mashinada `_ = m[string(buf)]` 0 alloc berdi, `m[string(buf)]++` esa 1 alloc. Demak, ko'p holatda `unsafe` ham kerak emas: qidiruvni nusxasiz qiling, yozishda esa haqiqiy nusxa oling. Topshiriq shu naqshga qurilgan.

### cgo chaqiruvi nega qimmat

Go goroutine'lari kichik, o'sadigan stack'da ishlaydi; C kodi esa katta, o'sib bo'lmaydigan thread stack'ni kutadi. cgo chaqiruvi paytida runtime goroutine'ni "C kodida" holatiga o'tkazadi, thread stack'ga o'tadi va qaytganda holatni tiklaydi; scheduler uchun ham bu chaqiruv bloklovchi syscall'ga o'xshash hisoblanadi. Natijada ichki ishi nol bo'lgan C funksiya ham Go funksiyasidan ancha sekin. Aniq raqam pastda o'lchangan (Go 1.24.7); versiyalar o'rtasida narx o'zgarib turadi. Go 1.26 release notes'ining Runtime bo'limiga ko'ra cgo chaqiruvlarining boshlang'ich runtime overhead'i ~30% kamaygan, shuning uchun quyidagi 60.7 ns ni Go 1.26+ ga ko'chirmang va o'z Go versiyangizda qayta o'lchang. Notes qaysi mashinada o'lchangani va 60 ns dan nechaga tushganini yozmaydi, shuning uchun men yangi raqam bermayman.

### Go pointer qoidalari

C ga Go xotirasiga ko'rsatkich uzatish mumkin, lekin shu xotira ichida boshqa Go xotirasiga ko'rsatkich bo'lmasligi kerak (mahkamlanmagan holda). Sabab (cmd/cgo hujjati): garbage collector Go xotirasiga har bir ko'rsatkich joyini bilishi kerak, C kodi esa ularni ko'rmaydi. Hujjatga ko'ra argument sifatida uzatilgan Go xotirasi chaqiruv davomida avtomatik mahkamlanadi; ichidagi ko'rsatkichlar ham mahkamlangan xotiraga ishora qilishi shart. Runtime argumentlarni tekshiradi (standart `GODEBUG=cgocheck=1`) va qoida buzilsa panic beradi. Pastdagi misolda aynan shu panic real chiqishda ko'rinadi. Chiqish yo'llari: C xotirasini (`C.malloc`) ishlatish, ma'lumotni tekis bo'lakka joylash yoki `runtime.Pinner` bilan mahkamlash (bu qoidalar pkg.go.dev/cmd/cgo hujjatining "Passing pointers" bo'limida; u bu darsning manbalar ro'yxatida yo'q, shuning uchun tafsilotlarni o'sha hujjatdan o'qing).

## Misol: nusxasiz konvertatsiya, qoida buzilishi va cgo narxi

Birinchi dastur nusxasiz satr buferga bog'langanini ko'rsatadi (`go test` ichida, Go 1.24.7):

```go
func BytesToStringSafe(b []byte) string { return string(b) }

func BytesToStringZero(b []byte) string {
	if len(b) == 0 {
		return ""
	}
	return unsafe.String(&b[0], len(b))
}

func TestAlias(t *testing.T) {
	buf := []byte("abc")
	s := BytesToStringZero(buf)
	buf[0] = 'X'
	fmt.Println("nusxasiz string, buf o'zgargach:", s)
	buf2 := []byte("abc")
	s2 := BytesToStringSafe(buf2)
	buf2[0] = 'X'
	fmt.Println("nusxali string, buf o'zgargach:", s2)
}
```

```text
nusxasiz string, buf o'zgargach: Xbc
nusxali string, buf o'zgargach: abc
```

`s` bufer bilan birga o'zgardi: satr o'zgarmas degan Go kafolati shu yerda sizning zimmangizda. Ikkinchi dastur bu bilan map kalitini buzadi va cgo qoidasini buzadi (cgo qismi uchun C kompilyator kerak; gcc o'rnatilgan mashinada ishga tushirilgan):

```go
package main

/*
#include <stdint.h>
typedef struct { int *p; } holder;
static void take(holder *h) { (void)h; }
*/
import "C"

import (
	"fmt"
	"unsafe"
)

func main() {
	buf := []byte("dev-00417")
	m := map[string]int{}
	key := unsafe.String(&buf[0], len(buf))
	m[key]++
	copy(buf, "dev-99999") // bufer qayta ishlatildi
	fmt.Printf("kalit: %q, qidiruv dev-00417: %d\n", key, m["dev-00417"])

	x := 5
	h := C.holder{p: (*C.int)(unsafe.Pointer(&x))}
	defer func() { fmt.Println("recover:", recover()) }()
	C.take(&h)
}
```

```text
kalit: "dev-99999", qidiruv dev-00417: 0
recover: runtime error: cgo argument has Go pointer to unpinned Go pointer
```

Birinchi qatorda `m["dev-00417"]` 0 qaytardi: kalit "dev-99999" ga aylandi, lekin map uni eski joyda ushlab turibdi. Ikkinchi qatorda `h` Go xotirasi, ichidagi `p` ham Go xotirasiga (`x`) ko'rsatadi, shuning uchun runtime chaqiruvni panic bilan to'xtatdi. Shu holat ikkinchi qatorda `recover` bilan ushlandi; productionda bu servis crash'i bo'lardi.

### O'lchov

Quyidagi raqamlar mening o'lchovim: Go 1.24.7, `GOARCH=amd64`, Intel Xeon 2.10 GHz, 2 yadro, virtual mashina (shovqinli). `benchstat` yo'q, shuning uchun har benchmark `-count=8` bilan yurgizildi va median keltirildi. Benchmark'lar `b.Loop` bilan; kirish: 66 baytli `[]byte`. `goAdd` `//go:noinline`, ya'ni oddiy Go chaqiruvi inline qilinmagan holda o'lchandi; cgo funksiyasi `static int c_add(int, int)`.

| Benchmark | Median ns/op | B/op | allocs/op |
|---|---|---|---|
| `string(b)` (nusxa) | 44.4 | 80 | 1 |
| `unsafe.String` (nusxasiz) | 1.61 | 0 | 0 |
| Go funksiya chaqiruvi (noinline) | 2.32 | 0 | 0 |
| cgo orqali C funksiya | 60.7 | 0 | 0 |

Birinchi juftlikda nusxasiz variant nusxa va allocni olib tashladi (80 baytli blok, chunki 66 bayt o'lcham sinfiga yaxlitlanadi). Nusxali variantning ns/op sochilishi katta edi (38 dan 121 ns gacha, GC ta'siri), nusxasizniki esa tor (1.49 dan 1.84 gacha). Ikkinchi juftlikda cgo chaqiruvi shu mashinada oddiy chaqiruvdan 20 baravardan ko'p qimmat chiqdi. Bu qiymat `1 + 1` hisoblaydigan funksiya uchun: ichki ish nolga yaqin bo'lgani uchun faqat chegara narxi ko'rinadi. C funksiya 1 mikrosekund ishlasa, 60 ns qo'shimcha 6% bo'ladi; 50 ns ishlasa, ikki baravar.

## Qachon qo'llamaslik kerak

`unsafe` ni "chiroyli" yoki "tezroq bo'lishi kerak" degan sabab bilan ishlatmang. Alloc bitta qo'ng'iroqda 40 ns bo'lsa, u sekundiga milliondan kam chaqiriladigan joyda ahamiyatsiz. Avval nusxani kamaytiring: `strings.Builder`, oldindan ajratish, `m[string(b)]` qidiruv naqshi (65-dars). `unsafe` oxirgi chora.

`unsafe.Pointer` bilan `uintptr` arifmetikasi ancha xavfli: GC pointer'ni `uintptr` ga o'tganda ko'rmaydi. Imkon bo'lsa `unsafe.String`, `unsafe.Slice`, `unsafe.Add` kabi tekshiriladigan shakllarni ishlating; `pkg.go.dev/unsafe` hujjatidagi ruxsat etilgan naqshlardan tashqariga chiqmang.

Qayta ishlatiladigan buferdan olingan nusxasiz satrni qaytarmang, kanalga yubormang, map'da saqlamang, goroutine'ga bermang. Natija bufer yashagan doiradan chiqib ketsa, nusxa oling.

cgo ni oddiy bog'liqlik sifatida qabul qilmang. Narxi: C kompilyator kerak (`CGO_ENABLED=0` bilan statik, sof Go binary olinadi, lekin cgo kodi ishlamaydi), kross-kompilyatsiya qiyinlashadi, race detector va profil C tomonini yaxshi ko'rmaydi, debug murakkablashadi. Sof Go muqobili bor bo'lsa (masalan, SQLite uchun sof Go drayveri, geometriya uchun Go kutubxonasi), avval uni o'lchang. cgo mantiqli: mavjud, sinalgan C kutubxonasini qayta yozish qimmat bo'lsa va chaqiruvlar yirik bo'lakli bo'lsa.

Tez-tez chaqiriladigan mayda C funksiyani tsiklda chaqirish (har nuqta uchun bitta chaqiruv) eng yomon naqsh: 60 ns qo'shimcha har nuqtaga tegadi. Massivni bitta chaqiruvga uzating.

## Stack'da: Node.js/TypeScript bilan solishtirish

Node.js'da `Buffer.toString()` har doim nusxa oladi; V8 satrlari o'zgarmas va JavaScript'da o'zgarmaslikni buzish usuli yo'q. Shuning uchun "nusxasiz konvertatsiya" tushunchasi frontend/Node dasturchisiga begona: u yerda xotira xavfsizligini runtime kafolatlaydi. Go'da bu kafolat standart, lekin `unsafe` import qilinishi bilan o'chadi. Kod ko'rib chiqishda (code review) `unsafe` va `import "C"` ni qizil bayroq sifatida qabul qiling va ularga profil hamda o'lchov ilova qilishni talab qiling.

Node.js'ning native addon'lari (N-API, `node-gyp`) cgo bilan o'xshash: ularda ham chegara narxi bor, build C++ kompilyatorni talab qiladi, GC bilan o'zaro ta'sir xatolarga olib keladi. `node-gyp` kabi cgo ham CI va Docker image hajmiga ta'sir qiladi: build image'da gcc bo'lishi kerak, ishchi image esa libc'ga bog'lanib qoladi. Go'ning asosiy afzalligi (bitta statik binary) cgo bilan kamayadi.

## Xulosa

- `unsafe.String` va `unsafe.Slice` nusxa va allocni olib tashlaydi (shu mashinada 44.4 ns va 1 alloc o'rniga 1.61 ns va 0 alloc), lekin satr yashar ekan baytlar o'zgartirilmasligi sharti sizning zimmangizda.
- Qayta ishlatiladigan bufer va nusxasiz satr map kalitini buzadi (real chiqish: `m["dev-00417"]` 0). Qidiruvda `m[string(b)]` nusxasiz, yozishda esa haqiqiy nusxa oling.
- cgo chaqiruvi shu mashinada oddiy Go chaqiruvidan 20 baravardan ko'p qimmat (60.7 ga qarshi 2.32 ns). Mayda chaqiruvlarni jamlang, yirik ish uchun ishlating.
- Go pointer qoidasi buzilsa runtime panic beradi (`cgo argument has Go pointer to unpinned Go pointer`); C xotirasi, tekis bo'lak yoki `runtime.Pinner` bilan chiqing.
- Ikkala vosita ham faqat profil ko'rsatgan va xavfsiz variant yetmagan joyda, kichik doirada, hujjatlangan invariant va test bilan ishlatiladi.
