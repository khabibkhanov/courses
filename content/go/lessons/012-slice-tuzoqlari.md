---
n: 12
slug: slice-tuzoqlari
title: "Slice tuzoqlari: aliasing, to'liq slice ifodasi, xotirani ushlab turish"
summary: "Slice'lar umumiy massivni bo'lishganda yuzaga keladigan uch muammo: append orqali boshqa slice'ni buzish, kichik bo'lak tufayli katta massivni xotirada ushlab turish va o'chirishdan keyin pointer'larning qolib ketishi; to'liq slice ifodasi, nusxa olish va slices paketi yechimlari."
duration: 40
sources:
  - id: blog-slices-intro
    note: "A possible gotcha bo'limi: reslice butun massivni xotirada ushlab turadi, yechim - nusxalash"
  - id: 100go
    note: "#24 (slice nusxalari), #25 (append yon ta'siri), #26 (slice va xotira sizishi), #30 (range'da elementlar nusxalanadi) mistake'lar"
  - id: pkg-slices
    note: "Clone, Clip, Delete (o'chirilgan dumni nollaydi), Grow funksiyalari hujjati"
quiz:
  - q: "Quyidagi kod nima chiqaradi?\n\nbuf := []int{1, 2, 3, 4}\nh := buf[:2]\nh = append(h, 9)\nfmt.Println(buf)"
    options:
      - "[1 2 3 4]"
      - "[1 2 9]"
      - "[1 2 3 4 9]"
      - "[1 2 9 4]"
    answer: 3
    explain: "h ning cap'i 4, len'i 2. append yangi massiv ajratmaydi va buf ning 2-indeksiga 9 yozadi. buf boshqa slice sifatida o'sha massivni ko'radi, shuning uchun [1 2 9 4]."
  - q: "Ishlab chiqarish kodida o'chirish qo'lda yozilgan: s = append(s[:i], s[i+1:]...). s elementlari *Trip pointer'lari. slices.Delete(s, i, i+1) bilan nima farq qiladi?"
    options:
      - "slices.Delete dum (yangi len dan eski len gacha) elementlarini zero value'ga o'rnatadi, qo'lda yozilganda esa o'sha joyda eski pointer qoladi va GC uni tozalay olmaydi"
      - "Ikkalasi ham to'liq bir xil: massiv va dum o'zgarishsiz qoladi"
      - "slices.Delete yangi massiv ajratadi, qo'lda yozilgan variant ajratmaydi"
      - "Qo'lda yozilgan variant elementlarni tartibini buzadi, slices.Delete esa saqlaydi"
    answer: 0
    explain: "pkg.go.dev hujjati: Delete s[len(s)-(j-i):len(s)] elementlarini nollaydi. Qo'lda siljitishda oxirgi element ikki joyda qoladi (yangi len'dan tashqarida ham), va u hanuz ob'ektni ushlab turadi. Tartib ikkalasida saqlanadi, ikkalasi ham joyida ishlaydi."
  - q: "Servis 64 MiB li kadr buferini o'qib, undan 16 baytlik sarlavhani header := buf[:16] qilib global keshga yozadi. Buferga boshqa havola yo'q. Xotira nima uchun qaytmaydi va qanday tuzatiladi?"
    options:
      - "header ning cap'i 16 ga teng, GC buferning qolganini bo'shatadi"
      - "buf = nil qilish yetarli, chunki header mustaqil"
      - "header 64 MiB massivga ishora qiladi; GC massivni butunligicha ushlab turadi. Kerakli baytlarni nusxalash (slices.Clone) kerak"
      - "Faqat header[:16:16] yozish buferni bo'shatadi"
    answer: 2
    explain: "GC ob'ektni butunligicha kuzatadi: slice ichidagi pointer massiv ichiga ishora qilsa, butun massiv tirik. Full slice expression cap'ni kesadi, lekin pointer o'sha massivga qarab turadi. Faqat nusxa (yoki buferdan butunlay voz kechish) xotirani qaytaradi."
  - q: "s := make([]int, 6) berilgan. t := s[1:3:3] uchun len(t) va cap(t) nechta?"
    options:
      - "2 va 3"
      - "2 va 2"
      - "3 va 5"
      - "2 va 5"
    answer: 1
    explain: "Spetsifikatsiya: a[low:high:max] ning sig'imi max-low ga teng. 3-1 = 2, len ham high-low = 2. Shuning uchun bu t ga append har doim yangi massiv ajratadi."
  - q: "for _, s := range sensors { s.Level *= 2 } sensors []Sensor (struct elementlar) ustida ishlaydi. Sikldan keyin sensors da nima bo'ladi?"
    options:
      - "Hamma Level ikki baravar oshadi"
      - "Faqat birinchi element oshadi"
      - "O'zgarish yo'q: s har iteratsiyada element nusxasi"
      - "Kompilyatsiya xatosi: range qiymatini o'zgartirib bo'lmaydi"
    answer: 2
    explain: "range qiymat shaklida element nusxasini beradi. s.Level ni o'zgartirish nusxani o'zgartiradi. Massivdagi elementni o'zgartirish uchun sensors[i].Level yoki pointer elementlar kerak."
  - q: "Quyidagi qaysi biri 'ichki massivni sizdirmaslik' maqsadiga haqiqatan xizmat qiladi?"
    options:
      - "return w.vals[:len(w.vals):len(w.vals)]"
      - "return slices.Clone(w.vals)"
      - "return w.vals[0:len(w.vals)]"
      - "return w.vals[:cap(w.vals)]"
    answer: 1
    explain: "Full slice expression append'ning ustidan yozishini to'sadi, lekin chaqiruvchi hanuz ichki massivning elementlariga yoza oladi. Faqat nusxa (slices.Clone yoki make+copy) massivni ajratadi. Uchinchi va to'rtinchi variantlar ichki massivni bevosita ochib beradi (to'rtinchisi hatto ishlatilmagan sig'imni ham)."
task:
  title: "Qayta ishlatiladigan bufer: ID'larni nusxalash va append'dan himoya"
  prompt: |
    Servis kadrlarni bitta qayta ishlatiladigan `buf` ga o'qiydi va har kadrning birinchi 4 baytini (qurilma ID) `Registry`ga saqlaydi. Boshlang'ich kodda ikkita xato bor:

    1. `Add` `frame[:4]` ni nusxalamasdan saqlaydi: bufer qayta yozilganda barcha ID'lar oxirgi kadrning ID'siga aylanadi (`EF03 EF03 EF03`).
    2. `withChecksum` `append(id, sum)` qiladi: `id` bufer boshiga ishora qilgani uchun `append` buferning 5-baytini ustidan yozadi.

    Vazifa: ikkala xatoni tuzating. Kutilgan chiqish: `AB01 CD02 EF03`, so'ng `bufer: GH04wwww`. `withChecksum` imzosi o'zgarmasin va natijasi `id` + nazorat bayti bo'lsin.
  lang: go
  starter: |
    package main

    import "fmt"

    // Registry kadrlardan qurilma identifikatorlarini yig'adi.
    type Registry struct {
        ids [][]byte
    }

    // Add kadrning birinchi 4 baytini (qurilma ID) saqlaydi.
    func (r *Registry) Add(frame []byte) {
        r.ids = append(r.ids, frame[:4])
    }

    // withChecksum ID'ga nazorat baytini qo'shib yangi slice qaytaradi.
    func withChecksum(id []byte, sum byte) []byte {
        return append(id, sum)
    }

    func main() {
        buf := make([]byte, 8) // har kadr uchun qayta ishlatiladigan bufer
        reg := &Registry{}
        for _, frame := range []string{"AB01xxxx", "CD02yyyy", "EF03zzzz"} {
            copy(buf, frame)
            reg.Add(buf)
        }
        for _, id := range reg.ids {
            fmt.Printf("%s ", id)
        }
        fmt.Println()

        copy(buf, "GH04wwww")
        _ = withChecksum(buf[:4], '#')
        fmt.Println("bufer:", string(buf))
    }
  solution: |
    package main

    import (
        "bytes"
        "fmt"
    )

    // Registry kadrlardan qurilma identifikatorlarini yig'adi.
    type Registry struct {
        ids [][]byte
    }

    // Add kadrning birinchi 4 baytini (qurilma ID) nusxalab saqlaydi:
    // bufer qayta ishlatilsa ham saqlangan ID o'zgarmaydi.
    func (r *Registry) Add(frame []byte) {
        r.ids = append(r.ids, bytes.Clone(frame[:4]))
    }

    // withChecksum ID'ga nazorat baytini qo'shib yangi slice qaytaradi.
    // Full slice expression cap'ni len ga tenglaydi, shuning uchun append
    // har doim yangi massiv ajratadi va chaqiruvchi buferiga tegmaydi.
    func withChecksum(id []byte, sum byte) []byte {
        return append(id[:len(id):len(id)], sum)
    }

    func main() {
        buf := make([]byte, 8) // har kadr uchun qayta ishlatiladigan bufer
        reg := &Registry{}
        for _, frame := range []string{"AB01xxxx", "CD02yyyy", "EF03zzzz"} {
            copy(buf, frame)
            reg.Add(buf)
        }
        for _, id := range reg.ids {
            fmt.Printf("%s ", id)
        }
        fmt.Println()

        copy(buf, "GH04wwww")
        _ = withChecksum(buf[:4], '#')
        fmt.Println("bufer:", string(buf))
    }
  solutionNotes: |
    - `bytes.Clone(frame[:4])` ID uchun alohida massiv ajratadi: bufer keyin qayta yozilsa ham saqlangan ID o'zgarmaydi. Bu aynan "ichki massivni ushlab turmaslik" yechimi, shuningdek 64 baytli buferni ham, undagi 4 baytni ham saqlamaydi.
    - `id[:len(id):len(id)]` cap'ni len'ga tenglaydi. Natijada `append` hech qachon umumiy massivga yozmaydi: cap yetmagani uchun yangi massiv ajratadi. Xuddi shu natijani `slices.Clip(id)` ham beradi.
    - `withChecksum` imzosi o'zgarmadi, lekin chaqiruvchi endi xavfsiz: funksiya kirish slice'ining cap'iga ishonmaydi.
    - Alternativa: `Add` da `slices.Clone` va `withChecksum` da `slices.Concat(id, []byte{sum})`. Ikkala usul ham ishlaydi; to'liq slice ifodasi eng kam xotira ajratadi.
  checklist:
    - "Barcha ID'lar o'z kadrlaridan olingan: `AB01 CD02 EF03`"
    - "Buferni keyin qayta yozish `Registry` dagi ID'larga ta'sir qilmaydi"
    - "`withChecksum` chaqiruvchi buferining 5-baytini o'zgartirmaydi"
    - "`withChecksum` imzosi saqlangan"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

11-darsda slice'ning uch maydonli header ekanini va massiv bo'lishilishini ko'rdik. Bu bo'lishish samara beradi (nusxalash yo'q), lekin production'da uch xil og'riq keltiradi.

Birinchisi: ikki slice bir massivni ko'radi va biri `append` qilsa, ikkinchisining ma'lumoti jimgina o'zgaradi. Xato kod bajarilishiga qarab paydo bo'ladi, chunki `append` ba'zan yangi massiv ajratadi. Telemetriya misolida: paket parser buferdan sarlavha ajratib beradi, keyin boshqa funksiya unga nazorat bayti qo'shadi, va to'satdan keyingi maydon (payload) buziladi.

Ikkinchisi: kichik bo'lak butun massivni xotirada ushlab turadi. Servis 64 MiB li kadr buferini o'qib, undan 16 baytlik qurilma ID'sini keshga yozadi. Kesh o'sadi, har yozuv butun buferni saqlaydi, va xotira nega o'sayotganini heap profil ko'rsatmaguncha tushunmaysiz.

Uchinchisi: o'chirishdan keyin yangi uzunlikdan tashqarida eski pointer'lar qoladi va ob'ektlarni tirik ushlab turadi. Bu uchtasi bir ildizdan: slice'ning massivi o'ziga tegishli emas, uni boshqa slice'lar va GC ham ko'radi. Bu darsda har birini o'lchab, to'g'ri vositani tanlaymiz.

## Asosiy g'oya

### Aliasing

Ikki slice bir massivning kesishuvchi qismini ko'rsa, ularni alias deymiz (slice aliasing). Alias o'zi xato emas, ko'p optimizatsiya shunga tayanadi. Xato alias borligini bilmaslikdan chiqadi. 100 Go Mistakes kitobi buni #25 "Unexpected side effects using slice append" deb nomlaydi: agar hosil bo'lgan slice'ning uzunligi sig'imidan kichik bo'lsa, `append` asl slice'ni o'zgartirishi mumkin. Kitob ikki himoyani beradi: nusxa olish yoki to'liq slice ifodasi.

### To'liq slice ifodasi

Spetsifikatsiya uch indeksli shaklni belgilaydi: `a[low:high:max]` oddiy `a[low:high]` bilan bir xil uzunlik va elementlarni beradi, lekin sig'imni `max-low` ga tenglaydi. Indekslar `0 <= low <= high <= max <= cap(a)` bo'lishi shart. Faqat birinchi indeksni tushirib qoldirish mumkin va qatordan (string) bunday ifoda olinmaydi. Spetsifikatsiyaning misoli: `a := [5]int{1,2,3,4,5}; t := a[1:3:5]` uzunligi 2, sig'imi 4 slice beradi.

`s[:n:n]` muhim idiom: undan keyingi `append` cap yetmaganidan har doim yangi massiv ajratadi. Ya'ni siz "bu slice'ga yozganim boshqalarga tegmaydi" kafolatini olasiz. `slices.Clip(s)` aynan `s[:len(s):len(s)]` ni qaytaradi.

### Nusxa va xotira: bo'lak butun massivni ushlaydi

Go Blog'ning slice maqolasi "A possible gotcha" bo'limida buni misol bilan beradi: fayl butunligicha xotiraga o'qiladi, regexp undan raqamlar guruhini topib, subslice qaytaradi, va shu bir necha bayt butun faylni tirik ushlab turadi. Maqolaning yechimi - kerakli ma'lumotni yangi slice'ga nusxalash. 100 Go Mistakes #26 shuni takrorlaydi va qo'shadi: full slice expression bu holda yordam bermaydi, faqat nusxa yordam beradi, chunki uzunlik va sig'im pointer qaysi massivga qaraganini o'zgartirmaydi.

## Chuqurroq: pointer dumi, range nusxalari va slices paketi

### O'chirishdan keyingi dum

Elementni o'rtadan o'chirishning klassik shakli `s = append(s[:i], s[i+1:]...)`. U massiv elementlarini bir joyga siljitadi va yangi len'ni qaytaradi, lekin massivning eski oxirgi joyi o'zgarmaydi: u yerda oxirgi elementning nusxasi qoladi. Element qiymat bo'lsa (`int`), bu zararsiz. Element pointer yoki pointer saqlovchi struct bo'lsa (`*Trip`, `[]string` maydonli struct), bu qolgan nusxa ob'ektni tirik ushlab turadi: 100 Go Mistakes #26 bunday elementlarni GC bo'shatmasligini yozadi. Quyidagi dastur ikkala yo'lni solishtiradi:

```go
package main

import (
	"fmt"
	"slices"
)

type Trip struct {
	ID    int
	Route []string // pointer saqlovchi maydon
}

func main() {
	mk := func() []*Trip {
		return []*Trip{{ID: 1}, {ID: 2}, {ID: 3}, {ID: 4}}
	}

	manual := mk()
	manual = append(manual[:1], manual[2:]...)
	tail := manual[:cap(manual)]
	fmt.Println("qo'lda o'chirildi: len =", len(manual), "tail[3] nil emasmi:", tail[3] != nil)

	managed := mk()
	managed = slices.Delete(managed, 1, 2)
	tail = managed[:cap(managed)]
	fmt.Println("slices.Delete:     len =", len(managed), "tail[3] nil emasmi:", tail[3] != nil)
}
```

```text
qo'lda o'chirildi: len = 3 tail[3] nil emasmi: true
slices.Delete:     len = 3 tail[3] nil emasmi: false
```

`slices.Delete` hujjatiga ko'ra `s[len(s)-(j-i):len(s)]` elementlarini nollaydi, shuning uchun dum `nil`. Qo'lda yozilgan variantda esa `tail[3]` hanuz `*Trip` ni ushlab turadi. Xuddi shu qoida `slices.Compact`, `slices.DeleteFunc` va `slices.Replace` ga ham tegishli: hujjat har birida nollash haqida yozadi. Yangi kodda qo'lda `append(s[:i], s[i+1:]...)` o'rniga `slices.Delete` ishlating, ayniqsa pointer elementlar bilan.

### range da elementlar nusxalanadi

`for _, s := range sensors` har iteratsiyada element nusxasini `s` ga beradi. Struct element bo'lsa, `s.Level *= 2` nusxani o'zgartiradi. 100 Go Mistakes #30 buni alohida xato sifatida sanaydi.

```go
package main

import "fmt"

type Sensor struct {
	ID    string
	Level float64
}

func main() {
	sensors := []Sensor{{"A1", 10}, {"A2", 20}}

	for _, s := range sensors {
		s.Level *= 2 // nusxani o'zgartiradi
	}
	fmt.Println("range qiymat bilan:", sensors)

	for i := range sensors {
		sensors[i].Level *= 2
	}
	fmt.Println("indeks bilan:      ", sensors)
}
```

```text
range qiymat bilan: [{A1 10} {A2 20}]
indeks bilan:       [{A1 20} {A2 40}]
```

Birinchi sikl hech narsani o'zgartirmaydi, ikkinchisi (indeks bilan) o'zgartiradi. Slice 11-darsdagi qoidaga bo'ysunadi: `range` slice header'ini sikl boshida bir marta o'qiydi, elementlarni esa indeks bilan massivdan oladi. Shuning uchun element qiymati nusxa bo'lsa ham, `sensors[i]` massivning o'zi.

### slices paketi vositalari

- `slices.Clone(s)` - sayoz nusxa, nilnessni saqlaydi; elementlar assignment bilan ko'chiriladi (ichki pointer'lar bo'lishiladi, ya'ni nusxa sayoz).
- `slices.Clip(s)` - ortiqcha sig'imni kesadi.
- `slices.Grow(s, n)` - kamida `n` ta element qayta ajratmasdan sig'ishini kafolatlaydi.
- `slices.Delete`, `DeleteFunc`, `Compact`, `Replace` - dumni nollaydi.

### Struct ichidagi slice: nusxa chuqur emas

Slice maydoni bor struct'ni qiymat bo'yicha nusxalash (`b := a`, value receiver, kanal orqali yuborish) faqat header'ni nusxalaydi. `a.Readings` va `b.Readings` bir massivni ko'radi. Natija: "struct'ni nusxaladim, endi mustaqil" taxmini noto'g'ri, va ikki goroutine'ga ikki "nusxa" berilsa, ular bir massivga yozadi, ya'ni data race (43-dars). Struct'ning chuqur nusxasi kerak bo'lsa, `Clone()` metodini yozing va unda slice maydonlarini `slices.Clone` bilan alohida nusxalang.

### Qaysi vositani qachon tanlash

| Vaziyat | Xavf | Vosita |
|---|---|---|
| Funksiya slice qabul qilib, unga `append` qiladi | Chaqiruvchi massivini ustidan yozish | `s[:len(s):len(s)]`, `slices.Clip` yoki `slices.Concat` |
| Katta buferdan kichik qiymat saqlanadi | Butun massiv xotirada qoladi | `slices.Clone`, `bytes.Clone`, `strings.Clone` |
| Ichki holatni tashqariga qaytarish | Chaqiruvchi massivga yozadi | `slices.Clone` yoki `make` + `copy` |
| Pointer elementli slice'dan o'chirish | Dumdagi pointer ob'ektni ushlaydi | `slices.Delete`, `slices.DeleteFunc` |
| Struct elementlarni o'zgartirish | `range` qiymati nusxa | indeks bilan yoki pointer elementlar |

Jadvaldagi usullarning hech biri bepul emas: har biri yo aniq nusxalash, yo qo'shimcha ajratish talab qiladi. Maqsad hamma joyda nusxalash emas, kim massivga egalik qilishini aniqlashdir. Massivga bitta egasi bo'lsa (masalan, parser buferi), qolgan hamma uni vaqtinchalik ko'rinish deb bilishi kerak, va ko'rinishni saqlamoqchi bo'lgan kod nusxa olishi shart.

### Egalik shartnomasi

Go'da egalik tilda ifodalanmaydi, shuning uchun uni hujjat va nom bilan ifodalash kerak. Standart kutubxonada namuna bor: `bufio.Scanner.Bytes` hujjati (Go 1.24 `go doc`) massiv keyingi `Scan` chaqiruvida ustidan yozilishi mumkinligini va ajratish qilmasligini aytadi, `Text` esa yangi ajratilgan string qaytaradi. Ikkita shakl taklif qilish yaxshi amaliyot: tezkor (nusxasiz, vaqtinchalik) va xavfsiz (nusxali). O'zingizning kutubxonangizda ham `Bytes()` va `Clone()`/`String()` juftligini shunday ajrating.

## Misol: alias, retention va ularni tuzatish

Birinchi dastur `append` ning chaqiruvchi massivini buzishini va full slice expression bilan bu tuzalishini ko'rsatadi:

```go
package main

import "fmt"

// withTrailer o'qishlar oxiriga nazorat qiymatini qo'shib qaytaradi.
func withTrailer(readings []int, trailer int) []int {
	return append(readings, trailer)
}

// withTrailerSafe full slice expression bilan cap'ni len ga tenglaydi.
func withTrailerSafe(readings []int, trailer int) []int {
	return append(readings[:len(readings):len(readings)], trailer)
}

func main() {
	buf := []int{10, 20, 30, 40, 50, 60}
	head := buf[:3] // len=3, cap=6

	a := withTrailer(head, -1)
	fmt.Println("buf:", buf, "(buf[3] buzildi)")
	fmt.Println("a:  ", a)

	buf = []int{10, 20, 30, 40, 50, 60}
	head = buf[:3]
	b := withTrailerSafe(head, -1)
	fmt.Println("buf:", buf, "(o'zgarmadi)")
	fmt.Println("b:  ", b, "cap(b) =", cap(b))
}
```

```text
buf: [10 20 30 -1 50 60] (buf[3] buzildi)
a:   [10 20 30 -1]
buf: [10 20 30 40 50 60] (o'zgarmadi)
b:   [10 20 30 -1] cap(b) = 6
```

`head := buf[:3]` ning cap'i 6. `withTrailer` ichidagi `append` yangi massiv ajratmaydi va `buf[3]` ni ustidan yozadi: chaqiruvchi o'z buferi buzilganini bilmaydi. `withTrailerSafe` esa cap'ni 3 ga tenglagani uchun yangi massiv ajratadi; `buf` o'zgarmaydi. Natijaviy `b` ning cap'i 6 chiqdi: bu yangi massivning o'sishi, implementatsiya tafsiloti (11-dars).

Ikkinchi dastur retention'ni o'lchaydi. U 64 MiB bufer ajratadi, undan 16 baytlik sarlavha oladi va heap hajmini GC dan keyin o'qiydi:

```go
package main

import (
	"fmt"
	"runtime"
	"slices"
)

func heapMiB() uint64 {
	runtime.GC()
	var m runtime.MemStats
	runtime.ReadMemStats(&m)
	return m.HeapAlloc >> 20
}

// loadFrame katta bufer ajratadi va undan faqat 16 baytlik sarlavhani qaytaradi.
func loadFrame(clone bool) []byte {
	buf := make([]byte, 64<<20)
	copy(buf, "device-0042-hdr!")
	hdr := buf[:16]
	if clone {
		return slices.Clone(hdr)
	}
	return hdr
}

func main() {
	fmt.Println("boshida (MiB):", heapMiB())

	kept := loadFrame(false)
	fmt.Println("sub-slice saqlanganda, heap >= 60 MiB:", heapMiB() >= 60, "|", string(kept))
	kept = nil
	fmt.Println("kept = nil dan keyin (MiB):", heapMiB())

	kept = loadFrame(true)
	fmt.Println("clone saqlanganda, heap >= 60 MiB:", heapMiB() >= 60, "|", string(kept))
}
```

```text
boshida (MiB): 0
sub-slice saqlanganda, heap >= 60 MiB: true | device-0042-hdr!
kept = nil dan keyin (MiB): 0
clone saqlanganda, heap >= 60 MiB: false | device-0042-hdr!
```

Sub-slice saqlanganda `HeapAlloc` 60 MiB dan oshadi, ya'ni 16 bayt butun buferni ushlab turibdi. `kept = nil` dan keyin heap bo'shaydi. `slices.Clone` bilan esa sarlavha mustaqil 16 baytlik massiv bo'lgani uchun bufer birinchi GC da ketadi. Chiqish Go 1.24.7, linux/amd64 da olingan; `HeapAlloc` ni MiB ga bo'lib chop etdik, shuning uchun aniq baytlar mashinaga qarab farq qilishi mumkin, lekin 60 MiB chegarasi barqaror.

## Qachon qo'llamaslik kerak

- Nusxa olish bepul emas. Qisqa yashaydigan, tezkor yo'lda ishlatiladigan slice'ni (masalan, parser ichidagi vaqtinchalik token) har safar nusxalash ortiqcha ajratish va GC yukidir. Qoida: uzoq yashaydigan yoki tashqariga qaytariladigan qiymatni nusxalang, ichki vaqtinchalik ko'rinishni nusxalamang.
- Full slice expression xotira sizishini hal qilmaydi (u faqat `append` yozuvini ajratadi). Uni "xotirani bo'shatish" vositasi deb o'ylamang.
- Bufer qayta ishlatilishi samara bersa (`sync.Pool`, doimiy bufer), nusxa olish samarani yo'qotishi mumkin. Bunda hayot muddatini aniq shartnoma qiling: "slice keyingi `Read` gacha amal qiladi", va kerakli qismni chaqiruvchi nusxalasin.
- `slices.Clone` sayoz. Elementlar pointer'li bo'lsa, ichki ob'ektlar hanuz bo'lishiladi. Chuqur nusxa uchun elementlarni alohida nusxalash kerak.
- Dumni qo'lda nollash faqat pointer saqlovchi elementlar uchun kerak; `[]int` yoki `[]float64` uchun bu ortiqcha.

## Stack'da: Node.js/TypeScript bilan solishtirish

JavaScript'da `arr.slice(a, b)` nusxa beradi, Go slice'ining `s[a:b]` ifodasi esa nusxa olmaydi. Unga Node.js'dagi `Buffer.subarray` ko'proq o'xshaydi: u ham asl bufer xotirasini ko'rsatadi, shuning uchun asl buferga yozish bo'lakda ko'rinadi. Go'da bu qoida barcha slice'lar uchun amal qiladi, faqat baytlar uchun emas.

Amaliy qoidalar:

- Parser, o'qish va kadrlash kodida natijani tashqariga bermoqchi bo'lsangiz, `slices.Clone` yoki `bytes.Clone` qiling va hujjatda "natija bufer bilan bo'lishilmaydi" deb yozing.
- Ichki holat qaytaradigan metodda (`Snapshot`, `Readings`) nusxa qaytaring.
- Pointer elementli slice'lardan o'chirishda `slices.Delete` ishlating.
- Memory profilida kichik ob'ektlar nima uchun katta massivlarni ushlab turganini ko'rsangiz, birinchi shubha - sub-slice (63-dars, heap profil).

## Xulosa

- Alias slice'lar umumiy massivga yozadi; `append` cap yetsa boshqa slice'ning ma'lumotini ustidan yozadi.
- `a[low:high:max]` sig'imni `max-low` ga tenglaydi; `s[:n:n]` va `slices.Clip` `append` ni yangi massivga majbur qiladi.
- Kichik sub-slice butun massivni GC dan ushlab turadi; faqat nusxa (`slices.Clone`, `bytes.Clone`) uni bo'shatadi.
- O'chirishdan keyin pointer elementlar dumi tirik ob'ektlarni ushlab turadi; `slices.Delete` va tengdoshlari dumni nollaydi.
- `range` element nusxasini beradi; massivni o'zgartirish uchun indeks yoki pointer elementlar kerak.
- Tashqariga ichki massivni bermang: nusxa bering yoki hayot muddatini aniq shartnoma qiling.
