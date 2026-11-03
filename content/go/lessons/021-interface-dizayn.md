---
n: 21
slug: interface-dizayn
title: "Interface dizayni: kichik interface'lar, qabul qil interface, qaytar struct"
summary: "Interface'ni qayerda e'lon qilish kerak, nima uchun iste'molchi tomonida va kichik bo'lishi kerak, funksiya qachon interface qabul qilib struct qaytarishi lozim, va ortiqcha abstraksiya (interface pollution) qanday zarar keltiradi."
duration: 40
sources:
  - id: code-review-comments
    note: "Interfaces bo'limi: interface qiymatlardan foydalanadigan paketda e'lon qilinadi; implementatsiya paketi konkret tip qaytaradi; 'mocking uchun' implementor tomonida interface e'lon qilinmaydi; ishlatilishidan oldin e'lon qilinmaydi"
  - id: 100go
    note: "#5 Interface pollution, #6 Interface on the producer side, #7 Returning interfaces, #8 any says nothing: har birining TL;DR xulosasi"
  - id: go-spec
    note: "Interface types va Implementing an interface bo'limlari (tip interface'ni qanday implement qiladi), Method sets bo'limi"
  - id: gopl
    note: "7-bob (Interfaces) umumiy mavzu sifatida; bu darsdagi aniq da'volar kitobdan emas, yuqoridagi manbalardan tekshirilgan"
quiz:
  - q: "`orders` paketi `PgStore` konkret tipini beradi. `billing` paketi undan faqat `FuelByDevice` metodini chaqiradi va bazasiz test yozmoqchi. Interface qayerda e'lon qilinishi kerak?"
    options:
      - "`orders` paketida, `Store` nomi bilan, PgStore'ning barcha metodlari bilan"
      - "Alohida umumiy `interfaces` paketida, hamma loyihalar uchun"
      - "`billing` paketida, faqat u ishlatadigan bitta metod bilan"
      - "Hech qayerda: Go'da interface faqat standart kutubxonada e'lon qilinadi"
    answer: 2
    explain: "Go'da tip interface'ni e'lon qilmasdan, metodlari mos kelgani bilan implement qiladi. Shuning uchun interface'ni uni ishlatadigan iste'molchi o'zi e'lon qiladi va faqat o'ziga kerak metodlarni kiritadi. Go Code Review Comments aynan shuni aytadi: interface'lar qiymatlardan foydalanadigan paketga tegishli, implementatsiya qiladigan paketga emas. Birinchi variant implementor tomonidagi katta interface, uchinchi tomon paketi esa ortiqcha bog'lanish yaratadi."
  - q: "`func NewStore() Store` (Store - interface) va `func NewStore() *PgStore` imzolaridan qaysi biri Go jamoasi tavsiyasiga mos va nega?"
    options:
      - "`*PgStore` qaytaruvchisi: yangi metodlar qo'shilganda iste'molchilar o'zgarmaydi va har biri o'zi kerakli interface'ni tanlaydi"
      - "`Store` qaytaruvchisi: interface doim moslashuvchanroq, chunki implementatsiya yashirinadi"
      - "Ikkalasi bir xil, farq faqat uslubda"
      - "`Store` qaytaruvchisi, chunki konkret pointer qaytarish `nil` tuzog'iga olib keladi"
    answer: 0
    explain: "Code Review Comments: implementatsiya paketi konkret tip qaytarishi kerak, shunda unga yangi metod qo'shish keng refaktoring talab qilmaydi. 100 Go Mistakes #7 ham shuni aytadi. Interface qaytarish barcha iste'molchilarni bitta abstraksiyaga bog'laydi. Nil tuzog'i (18-dars) aksincha ko'proq interface qaytarilgan joyda uchraydi."
  - q: "Quyidagi kod nima uchun kompilyatsiya bo'lmaydi? `type Resetter interface{ Reset() }; type Base struct{}; func (*Base) Reset() {}; type Dev struct{ Base }; var r Resetter = Dev{}`"
    options:
      - "Embed qilingan tip metodlari promote qilinmaydi"
      - "Interface'ga struct qiymatini tayinlab bo'lmaydi, faqat pointer"
      - "`Resetter` eksport qilinmagan"
      - "`Dev` qiymatining method set'ida faqat `Base` qiymat receiver'li metodlar bor, `Reset` esa pointer receiver'li"
    answer: 3
    explain: "Spetsifikatsiya: S struct'ida embed qilingan T maydoni bo'lsa, S va *S method set'lariga T receiver'li promote qilingan metodlar kiradi, *T receiver'lilar esa faqat *S method set'iga. `Dev{}` qiymati uchun `Reset` yo'q, kompilyator 'method Reset has pointer receiver' deb xabar beradi. `&Dev{}` ishlaydi."
  - q: "Jamoa har bir servis sinfiga `IOrderService`, `IUserService` kabi interface yozib, ularning bittadan implementatsiyasi bor. Bu 100 Go Mistakes nuqtai nazaridan nima?"
    options:
      - "To'g'ri amaliyot: interface doim implementatsiyadan oldin yoziladi"
      - "Interface pollution: abstraksiya kashf qilinmagan, oldindan yaratilgan; ikkinchi implementatsiya yoki iste'molchi ehtiyoji paydo bo'lganda iste'molchi tomonda e'lon qilinadi"
      - "Faqat nom noto'g'ri, `I` prefiksini olib tashlash kifoya"
      - "Muammo yo'q, chunki interface kompilyatsiya tezligini oshiradi"
    answer: 1
    explain: "#5 xulosasi: abstraksiya kashf qilinadi, yaratilmaydi. Bitta implementatsiya va mock uchun yozilgan interface keraksiz qatlam bo'lib qoladi. Code Review Comments ham interface'ni ishlatilishidan oldin e'lon qilmaslikni aytadi, chunki real ishlatilishsiz unga qaysi metodlar kerakligini bilib bo'lmaydi."
  - q: "Quyidagilardan qaysi birida interface qaytarish maqsadga muvofiq (100 Go Mistakes #7 istisnosiga mos)?"
    options:
      - "Har bir `NewXxx` konstruktori, 'kelajakda implementatsiyani almashtirish uchun'"
      - "Repository konstruktori, chunki Node.js'da shunday qilinadi"
      - "Funksiya ish vaqtida bir nechta implementatsiyadan birini tanlab qaytaradi va iste'molchi tanlovni bilmasligi kerak (ya'ni abstraksiya real, kutilgan emas)"
      - "Hech qachon, interface qaytarish taqiqlangan"
    answer: 2
    explain: "100 Go Mistakes: abstraksiya iste'molchilar uchun foydali ekanini bilsak (kutmasdan), interface qaytarish mumkin. 'Kelajakda almashtirish' esa kutilgan ehtiyoj, kashf qilingan emas. Qoida mutlaq taqiq emas, shuning uchun oxirgi variant ham noto'g'ri."
  - q: "`io.LimitReader(src, 24)` bilan o'ralgan `LineSource` uchinchi qatorning faqat boshini ko'radi. Darsdagi `LineSource.Next` shu holatda nima qiladi va bu dizayn haqida nimani ko'rsatadi?"
    options:
      - "Panic qiladi, chunki Sscanf xatosi tekshirilmagan"
      - "Uchinchi qatorni to'liq qiymatlar bilan to'ldiradi"
      - "Xatoni `Pipe`ga qaytaradi va `Pipe` uni o'raydi"
      - "Xatoni yutib, ketma-ketlikni tugagan deb ko'rsatadi: `Next() (Reading, bool)` imzosi xatoni ifodalay olmaydi, shuning uchun interface xato kanaliga ega bo'lishi kerak"
    answer: 3
    explain: "Darsdagi `Next` Sscanf xatosida `false` qaytaradi, shu sabab kesilgan qator jimgina oxirgi element deb hisoblanadi (natija: 2 ta yozuv, xato yo'q). Bu interface imzosining kamchiligi: xato uchun joy qoldirilmagan. Haqiqiy kodda `Next() (Reading, error)` yoki iterator + `Err()` ishlatiladi."
task:
  title: "Konkret bog'lanishni iste'molchi tomonidagi interface bilan almashtirish"
  prompt: |
    `LowFuel` funksiyasi yoqilg'isi limitdan past qurilmalarni qaytaradi, lekin konkret `*PgStore` tipiga bog'langan: uni bazasiz sinab bo'lmaydi, `PgStore`ga yangi metod qo'shilsa ham, `LowFuel`ga hech narsa kerak emas.

    Vazifa:
    1. `LowFuel` faqat bitta metodni chaqiradi. Iste'molchi tomonida (shu faylda, `LowFuel` yonida) shu bitta metodli interface e'lon qiling va funksiyani uni qabul qiladigan qiling. `PgStore` o'zgarmasin.
    2. Bazasiz test uchun `main`da soxta tip yozing: oldindan berilgan qiymatlarni qaytaradi va noma'lum qurilma uchun xato beradi. `LowFuel`ni ham `PgStore`, ham soxta tip bilan chaqiring.
    3. Xato holatini ham ko'rsating: soxta tipda mavjud bo'lmagan qurilma so'ralganda `LowFuel` xato qaytarsin.
  lang: go
  starter: |
    package main

    import (
        "errors"
        "fmt"
    )

    // PgStore - PostgreSQL ustidagi konkret saqlagich (bu yerda xotirada taqlid qilingan).
    type PgStore struct {
        rows map[string]float64
    }

    func (p *PgStore) FuelByDevice(id string) (float64, error) {
        v, ok := p.rows[id]
        if !ok {
            return 0, errors.New("qurilma topilmadi: " + id)
        }
        return v, nil
    }

    func (p *PgStore) Migrate() error { return nil }
    func (p *PgStore) Close() error   { return nil }

    // LowFuel yoqilg'isi limitdan past qurilmalarni qaytaradi.
    // Muammo: funksiya konkret *PgStore'ga bog'langan, uni bazasiz sinab bo'lmaydi.
    func LowFuel(store *PgStore, ids []string, limit float64) ([]string, error) {
        var low []string
        for _, id := range ids {
            v, err := store.FuelByDevice(id)
            if err != nil {
                return nil, err
            }
            if v < limit {
                low = append(low, id)
            }
        }
        return low, nil
    }

    func main() {
        store := &PgStore{rows: map[string]float64{"T-1": 5, "T-2": 40}}
        fmt.Println(LowFuel(store, []string{"T-1", "T-2"}, 10))
    }
  solution: |
    package main

    import (
        "errors"
        "fmt"
    )

    // PgStore - PostgreSQL ustidagi konkret saqlagich (bu yerda xotirada taqlid qilingan).
    type PgStore struct {
        rows map[string]float64
    }

    func (p *PgStore) FuelByDevice(id string) (float64, error) {
        v, ok := p.rows[id]
        if !ok {
            return 0, errors.New("qurilma topilmadi: " + id)
        }
        return v, nil
    }

    func (p *PgStore) Migrate() error { return nil }
    func (p *PgStore) Close() error   { return nil }

    // FuelLoader iste'molchi (LowFuel) uchun kerak bo'lgan yagona metod.
    type FuelLoader interface {
        FuelByDevice(id string) (float64, error)
    }

    // LowFuel endi interface qabul qiladi: PgStore ham, soxta tip ham mos keladi.
    func LowFuel(store FuelLoader, ids []string, limit float64) ([]string, error) {
        var low []string
        for _, id := range ids {
            v, err := store.FuelByDevice(id)
            if err != nil {
                return nil, err
            }
            if v < limit {
                low = append(low, id)
            }
        }
        return low, nil
    }

    // fakeLoader bazasiz test uchun: tayyor qiymatlar yoki xato qaytaradi.
    type fakeLoader map[string]float64

    func (f fakeLoader) FuelByDevice(id string) (float64, error) {
        v, ok := f[id]
        if !ok {
            return 0, errors.New("qurilma topilmadi: " + id)
        }
        return v, nil
    }

    func main() {
        pg := &PgStore{rows: map[string]float64{"T-1": 5, "T-2": 40}}
        fmt.Println(LowFuel(pg, []string{"T-1", "T-2"}, 10))

        fake := fakeLoader{"T-7": 3, "T-8": 70}
        fmt.Println(LowFuel(fake, []string{"T-7", "T-8"}, 10))
        fmt.Println(LowFuel(fake, []string{"T-7", "T-9"}, 10))
    }
  solutionNotes: |
    - `FuelLoader` interface'i `LowFuel` bilan bir paketda, uni ishlatadigan tomonda e'lon qilingan. `PgStore` interface haqida hech narsa bilmaydi va o'zgarishsiz qoldi: Go'da moslik metod nomi va imzosi bilan aniqlanadi.
    - Interface bitta metodli, chunki `LowFuel` faqat `FuelByDevice`ni chaqiradi. `Migrate` va `Close` iste'molchiga kerak emas, shuning uchun soxta tipda ham yozilmaydi.
    - `fakeLoader` map asosida yozilgan: ma'lumotni tayyorlash uchun generator yoki mock kutubxona kerak emas.
    - `LowFuel` hamon konkret slice (`[]string`) qaytaradi va xatoni `error` sifatida beradi. Interface faqat kirishda ishlatilgan (qabul qil interface, qaytar konkret tip).
    - Xato holatida `nil` slice qaytadi, `fmt.Println` uni `[]` deb chiqaradi. Bu xatti-harakat oddiy `nil` slice semantikasi, alohida kod emas.
  checklist:
    - "`LowFuel` imzosida `*PgStore` yo'q, uning o'rniga bitta metodli interface bor"
    - "Interface `LowFuel` yonida (iste'molchi tomonida) e'lon qilingan, `PgStore` kodiga tegilmagan"
    - "Soxta tip faqat interface'dagi metodni implement qiladi"
    - "`LowFuel` `PgStore` bilan ham, soxta tip bilan ham ishlaydi"
    - "Noma'lum qurilma uchun xato qaytadi, `go vet` ogohlantirishsiz o'tadi"
---

## Muammo

NestJS'dan kelgan dasturchi uchun odatiy reflekslar: har bir servis uchun `IOrderService` interface'i, DI konteyner uchun token, har bir sinfga mock. TypeScript'da bu qatlam deyarli bepul: interface kompilyatsiyadan keyin yo'qoladi, ishlash vaqtiga ta'sir qilmaydi. Go'ga shu odatni ko'chirsak, uchta muammo paydo bo'ladi.

Birinchisi: har paketda `Store`, `Repository`, `Service` nomli o'nlab metodli interface'lar paydo bo'ladi, ularning bittadan implementatsiyasi bor. Har bir yangi metod interface'ni, uning barcha soxta tiplarini va barcha chaqiruvchilarni o'zgartirishga majbur qiladi. Ikkinchisi: interface implementatsiya yonida e'lon qilingani uchun iste'molchi o'ziga kerak bo'lmagan o'nlab metodga bog'lanib qoladi va test yozish uchun mock generatoriga muhtoj bo'ladi. Uchinchisi: funksiyalar interface qaytargani uchun iste'molchi `type assertion` bilan konkret tipga qaytishga majbur bo'ladi, ya'ni abstraksiya ishlamay qoladi.

Bularning barchasi bir xil sababga ega: Go'da interface'ning vazifasi boshqacha. U sinf ierarxiyasini rasmiylashtirmaydi, iste'molchining ehtiyojini tasvirlaydi. Bu dars shu farqni va undan chiqadigan dizayn qoidalarini beradi: interface'ni kim e'lon qiladi, qanchalik katta bo'ladi, funksiya nimani qabul qilib nimani qaytaradi va qachon umuman interface kerak emas.

## Asosiy g'oya

### Moslik yashirin, shuning uchun e'lon iste'molchida

Spetsifikatsiyaga ko'ra interface tiplar to'plamini (type set) belgilaydi, va non-interface tip T interface I ni implement qiladi, agar T shu to'plamning elementi bo'lsa. Oddiy (faqat metodlardan iborat) interface uchun bu degani: T ning method set'i interface'dagi barcha metodlarni o'z ichiga oladi. `implements` kalit so'zi yo'q, e'lon yo'q. Tip o'z yaratilish paytida qaysi interface'larga mos kelishini bilmaydi va bilishi shart ham emas.

Shuning uchun interface'ni qayerda e'lon qilish erkin tanlov. Go Code Review Comments sahifasi bu tanlovga aniq javob beradi: interface'lar odatda interface tipidagi qiymatlardan foydalanadigan paketga tegishli, ularni implement qiladigan paketga emas. Implementatsiya paketi konkret (ko'pincha pointer yoki struct) tip qaytarishi kerak, shunda implementatsiyaga yangi metodlar katta refaktoringsiz qo'shiladi. Shuningdek sahifa ikki taqiqni aytadi: API'ning implementor tomonida interface'ni 'mocking uchun' e'lon qilmang (API'ni haqiqiy implementatsiyaning ochiq interfeysi bilan sinash mumkin bo'ladigan qilib dizayn qiling) va interface'ni ishlatilishidan oldin e'lon qilmang, chunki real misolsiz unga qaysi metodlar kerakligini ko'rib bo'lmaydi.

100 Go Mistakes shu fikrni uch xato sifatida beradi. #5 (Interface pollution): abstraksiya kashf qilinadi, yaratilmaydi; interface kerak bo'lganda yaratiladi, kerak bo'lishi mumkin bo'lganda emas. #6 (Interface on the producer side): interface odatda iste'molchi tomonida turadi; faqat abstraksiya foydali ekanini bilsak (kutmasak) producer tomonda ham bo'lishi mumkin, va u holda imkon qadar minimal. #7 (Returning interfaces): funksiya ko'p hollarda konkret implementatsiya qaytarishi, interface'ni esa qabul qilishi kerak.

### Kichik interface

Iste'molchi tomonida e'lon qilingan interface tabiiy ravishda kichik chiqadi: u faqat shu iste'molchi chaqiradigan metodlarni o'z ichiga oladi. Standart kutubxonadagi `io.Reader` bir metodli (`Read`), `io.Writer` ham, va ularning kompozitsiyasi (`io.ReadWriter`) interface'larni embed qilish bilan hosil bo'ladi. Kichik interface'ning amaliy foydasi: uni implement qiladigan tiplar ko'p bo'ladi, soxta tip yozish arzon, va interface o'zgarish ehtimoli past. Bu mulohaza muallifning dizayn bahosi, spetsifikatsiya talabi emas, lekin yuqoridagi ikki manbaning xulosalari bilan mos.

### Qabul qil interface, qaytar struct

Ibora manbalarda aynan shu so'zlar bilan yozilmagan, lekin mazmuni #7 va Code Review Comments'da bor: kirishda interface (chaqiruvchiga erkinlik beradi: har qanday mos tip o'tadi), chiqishda konkret tip (iste'molchi barcha imkoniyatlarni oladi va o'zi qaysi kichik interface'ga o'tkazishni tanlaydi). Kirishdagi interface funksiyaning haqiqiy ehtiyojini hujjatlaydi: imzoning o'zi 'menga faqat `Save` kerak' deydi.

## Chuqurroq: method set va kompilyatsiya vaqtidagi tekshiruv

### Pointer receiver tuzog'i

Interface'ga mos kelish method set bo'yicha aniqlanadi. Spetsifikatsiya: T tipining method set'i T receiver'li metodlardan, *T ning method set'i T va *T receiver'li metodlardan iborat. Natijada pointer receiver'li metodlarga ega tip qiymati interface'ni implement qilmaydi:

```go
type Resetter interface{ Reset() }

type Base struct{}

func (*Base) Reset() {}

type Dev struct{ Base }

var r Resetter = Dev{} // xato
```

```text
cannot use Dev{} (value of struct type Dev) as Resetter value in variable declaration: Dev does not implement Resetter (method Reset has pointer receiver)
```

Bu xabar Go 1.24.7 kompilyatori chiqishi (`go build`). Yechim: `&Dev{}` ishlatish yoki receiver'ni qiymatga o'zgartirish. Embedding bilan bog'liq qoidalar (22-dars) bu tuzoqni murakkablashtiradi: embed qilingan maydon `*Base` bo'lsa, `Dev` qiymatining o'zi ham `Reset`ga ega bo'ladi.

### Moslikni e'lon qilish

Implicit moslik xavfi: tip kelajakda metod imzosi o'zgarsa, interface'ga jimgina mos kelmay qoladi, xato esa uzoq joyda (iste'molchida) chiqadi. Implementatsiya yonida moslikni e'lon qiluvchi qator buni darhol ushlaydi:

```go
var _ ReadingSink = (*MemStore)(nil)
```

Bu qator ish vaqtida hech narsa qilmaydi (blank identifier), faqat kompilyatsiyada tekshiradi. Uni faqat implementatsiya paketi interface'ni bilgan va ataylab qo'llab-quvvatlaydigan hollarda yozing (masalan, ochiq API'dagi `io.Writer` kabi interface'ga mosligini kafolatlash uchun). Iste'molchi tomonidagi har bir kichik interface uchun bunday qator shart emas: iste'molchi chaqiruvida kompilyator o'zi tekshiradi.

### Interface kompozitsiyasi

Interface boshqa interface'larni embed qilishi mumkin; hosil bo'lgan interface'ning type set'i ularning kesishmasidir (spetsifikatsiya: bo'sh bo'lmagan interface type set'i uning elementlari type set'larining kesishmasi). Kichik interface'lardan katta talab yig'ish oson, aksincha emas: katta interface'ni qabul qilgan funksiyaga faqat bir qismini bera olmaysiz. Shu sababli kompozitsiya yo'li (kichiklardan kattaga) xavfsiz.

## Misol: manba, qabul qiluvchi va test uchun soxta tip

Dasturda `Pipe` funksiyasi o'lchovlarni manbadan oladi va qabul qiluvchiga yozadi. Ikkala interface `Pipe` bilan bir joyda, bittadan metod bilan e'lon qilingan. `MemStore` konkret tip va `NewMemStore` struct pointer'i qaytaradi.

```go run
package main

import (
	"bufio"
	"errors"
	"fmt"
	"io"
	"strings"
)

// Reading - yoqilg'i datchigidan kelgan bitta o'lchov.
type Reading struct {
	DeviceID string
	Fuel     float64
}

// ReadingSource va ReadingSink iste'molchi (Pipe) tomonida e'lon qilingan kichik interface'lar.
type ReadingSource interface {
	Next() (Reading, bool)
}

type ReadingSink interface {
	Save(Reading) error
}

// Pipe manbadan o'qib, qabul qiluvchiga yozadi. Interface qabul qiladi.
func Pipe(src ReadingSource, dst ReadingSink) (int, error) {
	n := 0
	for {
		r, ok := src.Next()
		if !ok {
			return n, nil
		}
		if err := dst.Save(r); err != nil {
			return n, fmt.Errorf("saqlash (%s): %w", r.DeviceID, err)
		}
		n++
	}
}

// LineSource io.Reader'dan "qurilma,yoqilg'i" qatorlarini o'qiydi.
type LineSource struct {
	sc *bufio.Scanner
}

func NewLineSource(r io.Reader) *LineSource {
	return &LineSource{sc: bufio.NewScanner(r)}
}

func (s *LineSource) Next() (Reading, bool) {
	if !s.sc.Scan() {
		return Reading{}, false
	}
	var r Reading
	if _, err := fmt.Sscanf(s.sc.Text(), "%s %f", &r.DeviceID, &r.Fuel); err != nil {
		return Reading{}, false
	}
	return r, true
}

// MemStore konkret tip: struct qaytariladi.
type MemStore struct {
	items []Reading
}

func NewMemStore() *MemStore { return &MemStore{} }

func (m *MemStore) Save(r Reading) error {
	m.items = append(m.items, r)
	return nil
}

func (m *MemStore) Len() int { return len(m.items) }

// Kompilyatsiya vaqtida moslikni tekshirish.
var _ ReadingSink = (*MemStore)(nil)

// failingSink test uchun soxta qabul qiluvchi: uchinchi yozuvda xato beradi.
type failingSink struct{ calls int }

var errDisk = errors.New("disk to'lgan")

func (f *failingSink) Save(Reading) error {
	f.calls++
	if f.calls == 3 {
		return errDisk
	}
	return nil
}

func main() {
	const data = "T-101 54.5\nT-102 12.0\nT-103 80.25\nT-104 33.0\n"

	store := NewMemStore()
	n, err := Pipe(NewLineSource(strings.NewReader(data)), store)
	fmt.Println("MemStore:", n, err, store.Len())

	n, err = Pipe(NewLineSource(strings.NewReader(data)), &failingSink{})
	fmt.Println("failingSink:", n, err, errors.Is(err, errDisk))

	// io.LimitReader: standart kutubxonadagi bir metodli interface'lar kompozitsiyasi.
	limited := io.LimitReader(strings.NewReader(data), 24)
	n, err = Pipe(NewLineSource(limited), NewMemStore())
	fmt.Println("LimitReader:", n, err)
}
```

Chiqish (Go 1.24.7, linux/amd64):

```text
MemStore: 4 <nil> 4
failingSink: 2 saqlash (T-103): disk to'lgan true
LimitReader: 2 <nil>
```

Nima uchun shunday yozildi:

- `ReadingSource` va `ReadingSink` `Pipe` yonida turibdi. `MemStore` va `LineSource` bu interface'lar haqida bilmaydi, lekin metodlari mos kelgani uchun `Pipe`ga o'tadi.
- `NewMemStore` va `NewLineSource` konkret pointer qaytaradi. Shu sababli `store.Len()` kabi metodlar iste'molchiga ochiq va interface qiymatidan konkret tipga `type assertion` bilan qaytish kerak emas.
- `failingSink` testda uchinchi chaqiruvda xato beradi. Natija: `Pipe` ikkita yozuvni muvaffaqiyatli o'tkazib, xatoni qurilma identifikatori bilan o'raydi (`%w`), va `errors.Is` asl xatoni topadi. Mock kutubxona yo'q, soxta tip esa bir metod.
- `io.LimitReader` chaqiruvi uchinchi qatorni kesadi: 24 bayt ikki to'liq qator (11 + 11 bayt) va uchinchi qatorning `T-` qismi. `Sscanf` bu qismni o'qiy olmaydi, `Next` `false` qaytaradi va `Pipe` ketma-ketlik tugadi deb hisoblaydi: natija 2 ta yozuv, xato yo'q. Bu dizayndagi haqiqiy kamchilik: `Next() (Reading, bool)` xatoni ifodalay olmaydi. Production kodida imzo `Next() (Reading, error)` bo'lishi kerak, yoki iterator (28-dars) va alohida `Err()`. Misolni ataylab shunday qoldirdik: interface imzosini yozishda xato yo'lini unutish tez-tez uchraydi.

## Qachon qo'llamaslik kerak

Interface hamma joyda foydali emas:

- Bitta implementatsiya va bitta iste'molchi bor, test esa haqiqiy implementatsiya bilan (masalan, vaqtinchalik baza yoki `httptest`) o'tadi. Bu holda interface keraksiz qatlam. Code Review Comments'ning o'zi 'mocking uchun' implementor tomonidagi interface'ni taqiqlaydi.
- Interface'ni 'kelajakda implementatsiya almashtirish ehtimoli' uchun yozish. #5 bo'yicha bu kutilgan ehtiyoj, kashf qilingan emas; ehtiyoj paydo bo'lganda iste'molchi interface'ni o'zi qo'shadi va bu o'zgarish arzon (implementatsiyaga tegilmaydi).
- Funksiya ish vaqtida bir nechta implementatsiyadan birini tanlab qaytaradi va iste'molchi tanlovni bilmasligi kerak. Bu #7 istisnosiga kiradi: abstraksiya real, kutilgan emas. Bu holda interface qaytarish to'g'ri, lekin interface imkon qadar kichik bo'lsin.
- `any` (bo'sh interface) 'umumiy' interface o'rnini bosmaydi. #8: `any` hech narsa aytmaydi va kompilyatorning tip tekshiruvini o'chiradi; uni faqat haqiqatan har qanday tipni qabul qilish kerak bo'lgan joyda (`json.Marshal` kabi) ishlating.
- Interface'ga pointer olish (`*io.Reader`). Code Review Comments 'Pass Values' bo'limida buni tavsiya etmaydi: interface qiymati o'zi kichik, uni qiymat sifatida uzatish kifoya.

## Stack'da: NestJS/TypeScript bilan farq

TypeScript'da interface ham strukturaviy (shakl bo'yicha mos keladi), shuning uchun `class implements` majburiy emas. Farq boshqa joyda: NestJS'da DI tokeni (interface runtime'da yo'q, shuning uchun abstract class yoki `Symbol` token) va provider ro'yxati bog'lanishni konteyner orqali hal qiladi. Go'da konteyner kerak emas: bog'lanish `main`da oddiy konstruktor chaqiruvlari, bog'liqlik esa funksiya yoki struct maydonining interface tipi.

Amaliy qoidalar:

- Servis konstruktori kerakli bog'liqlikni kichik interface sifatida qabul qiladi (`NewBilling(loader FuelLoader)`), `main` konkret `*PgStore`ni beradi. Test o'sha konstruktorga soxta tipni beradi. Jest'dagi `jest.mock` va mock generatori o'rniga bir necha qatorli struct yoziladi.
- Repository'ni 'katta' `Repository` interface'i sifatida emas, har bir use-case uchun kerakli 1-2 metodli interface sifatida e'lon qiling. Bu NestJS'dagi 'bitta `IUserRepository` hamma uchun' odatidan farq qiladi.
- Paketlar o'rtasida interface'ni ulashish zarurati paydo bo'lsa (ikkita iste'molchi bir xil narsani talab qilsa), avval takrorlanishni ko'ring: ikki qatorli interface'ni ikki joyda yozish ko'pincha umumiy paketga bog'lanishdan arzonroq. Bu muallifning tajribaviy bahosi.
- Kodni ko'rib chiqishda ikki savol bering: 'bu interface'ni kim ishlatadi?' va 'u nechta metodni haqiqatan chaqiradi?'. Javob 'hech kim' yoki 'yarmini' bo'lsa, interface kichraytiriladi yoki o'chiriladi.

## Xulosa

- Go'da tip interface'ni e'lon qilmasdan implement qiladi, shuning uchun interface'ni uni ishlatadigan iste'molchi tomonida, kerakli metodlar bilan e'lon qilish tabiiy.
- Interface kashf qilinadi: real iste'molchi va real ehtiyojsiz yozilgan interface (interface pollution) keraksiz qatlam bo'ladi.
- Funksiya ko'pincha interface qabul qiladi va konkret tip qaytaradi; interface qaytarish faqat abstraksiya real bo'lgan hollarda.
- Pointer receiver'li metodlar qiymat tipini interface'dan chiqarib tashlaydi: method set qoidasini biling, moslikni kerak joyda `var _ I = (*T)(nil)` bilan tekshiring.
- Interface imzosida xato yo'lini unutmang: `Next() (T, bool)` xatoni yashiradi.
