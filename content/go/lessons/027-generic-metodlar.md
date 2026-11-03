---
n: 27
slug: generic-metodlar
title: "Generic metodlar (Go 1.27) va ularning cheklovlari"
summary: "Go 1.27 da metod o'z type parameter'larini e'lon qila oladi. Dars rasmiy release notes'ga tayanadi, cheklovlarni (interface metodlari) ko'rsatadi va Go 1.24 da ishlaydigan muqobil yo'lni (paket darajasidagi generic funksiya) o'lchaydi."
duration: 40
sources:
  - id: go127
    note: "Changes to the language: generic metodlar qo'llab-quvvatlanishi, math/rand/v2 dagi (*Rand) N[Int intType](Int) Int misoli, interface metodlari type parameter e'lon qila olmasligi va generic metod bilan implement qilinmasligi; math/rand/v2 bo'limi: Rand.N"
  - id: go-spec
    note: "Method declarations: generic tipning receiver'i mos type parameter'larni e'lon qilishi kerak; Type parameter declarations: type parameter ro'yxati generic funksiya, metod yoki tip e'lonini belgilaydi"
quiz:
  - q: "Go 1.24 da `func (l List[E]) Map[F any](f func(E) F) List[F]` yozilsa nima bo'ladi?"
    options:
      - "Ishlaydi: `F` metod darajasida e'lon qilinadi"
      - "Run-time panic"
      - "Ogohlantirish bilan kompilyatsiya qilinadi"
      - "Kompilyatsiya xatosi: `syntax error: method must have no type parameters`"
    answer: 3
    explain: "Go 1.24.7 da aynan shu sintaksis xatosi chiqadi (darsdagi tajriba). Metod faqat receiver tipining type parameter'laridan foydalana oladi. Go 1.27 release notes bu cheklovni olib tashlaganini bildiradi."
  - q: "Go 1.27 release notes generic metodlar haqida nimani aytadi?"
    options:
      - "Metod e'loni o'z type parameter'larini e'lon qila oladi; interface metodlari esa type parameter e'lon qila olmaydi va generic metod bilan implement qilinmaydi"
      - "Generic metodlar faqat interface'larda ruxsat etilgan"
      - "Generic metodlar faqat standart kutubxonada ishlatiladi"
      - "Generic metodlar Go 1.18 dan beri bor, 1.27 faqat tezlashtirdi"
    answer: 0
    explain: "Release notes: 'a method declaration may declare its own type parameters', va 'methods of interfaces may not declare type parameters nor can interface methods be implemented by generic methods'."
  - q: "Nega generic metod interface metodini implement qila olmaydi deb yozilgan (Go 1.27 notes)?"
    options:
      - "Generic metodlar sekin ishlaydi"
      - "Release notes sababni keltirmaydi, faqat cheklovni qayd etadi; dars sababni da'vo qilmaydi"
      - "Generic metodlar pointer receiver bilan ishlamaydi"
      - "Interface'lar generics'dan oldin paydo bo'lgan"
    answer: 1
    explain: "Hujjatda cheklov bayon qilingan, sabab yozilmagan. Amaliy xulosa: dinamik dispatch kerak bo'lsa (interface orqali chaqiruv), metodning type parameter'siz variantini yozing."
  - q: "Qaysi biri Go 1.27 release notes'da generic metodga misol sifatida keltirilgan?"
    options:
      - "`slices.Map`"
      - "`(*Rand) N[Int intType](Int) Int` (`math/rand/v2`)"
      - "`(*Builder) Add[T any](T)` (`strings`)"
      - "`(*Mutex) With[T any](func() T) T` (`sync`)"
    answer: 1
    explain: "Notes: `math/rand/v2` endi (*Rand) N[Int intType](Int) Int generic metodini ham e'lon qiladi, avval faqat `N[Int intType](Int) Int` generic funksiyasi bor edi. Boshqa variantlar notes'da yo'q."
  - q: "Go 1.24 da `List[E]` ustida `E` dan boshqa tipga o'giradigan operatsiya (map) ni tip xavfsiz yozishning yo'li?"
    options:
      - "`List[E]` metodiga `any` parametr berish"
      - "Metodni `interface{}` qaytaradigan qilish"
      - "Paket darajasidagi generic funksiya: `Apply[E, F any](l List[E], f func(E) F) List[F]`"
      - "Reflection bilan `F` ni aniqlash"
    answer: 2
    explain: "Metod yangi type parameter kiritolmagani uchun operatsiya funksiya bo'ladi. `any` yoki reflection variantlari tip xavfsizligini yo'qotadi: noto'g'ri tip faqat run-time'da panic beradi."
  - q: "Go 1.27 haqidagi bu dars nima uchun hisobotda 'kompilyatsiya qilinmagan' deb belgilangan?"
    options:
      - "Kod xato"
      - "Kursdagi tekshiruv toolchain'i Go 1.24.7: Go 1.27 xususiyati unda kompilyatsiya qilinmaydi, shuning uchun 1.27 sintaksisi va natijasi lokal ishga tushirilmagan"
      - "Generic metodlar hali spetsifikatsiyaga kirmagan"
      - "Go 1.27 mavjud emas"
    answer: 1
    explain: "Go 1.27 kodi lokal toolchain'da (Go 1.24.7) kompilyatsiya bo'lmaydi. Darsdagi chiqishlar faqat Go 1.24 da ishga tushirilgan kodlardan olingan; 1.27 haqidagi da'volar faqat rasmiy release notes'ga tayanadi."
task:
  title: "any asosidagi Pipeline'ni generic funksiyaga o'tkazish"
  prompt: |
    `Pipeline` elementlarni `any` sifatida saqlaydi va `Apply` metodi `func(any) any` oladi. Noto'g'ri tipdagi element (`"12"` o'rniga son kutilgan joyda) faqat run-time'da panic beradi.

    Vazifa:
    1. `type List[E any] []E` tipini kiriting.
    2. Go 1.24 da metod type parameter e'lon qila olmagani uchun `Apply[E, F any](l List[E], f func(E) F) List[F]` paket funksiyasini yozing.
    3. `main` da `List[float64]` ni satr yorliqlariga o'giring (`54.5 l` ko'rinishida), keyin `List[string]` ni `int` ga o'giring.
    4. `any` va `x.(float64)` konvertatsiyalari butunlay yo'qolsin; noto'g'ri tip kompilyatsiya xatosi bo'lsin.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "strconv"
    )

    // Pipeline - eski uslub: elementlar any sifatida saqlanadi.
    type Pipeline struct {
        items []any
    }

    func NewPipeline(items ...any) Pipeline { return Pipeline{items: items} }

    // Apply har bir elementga f ni qo'llaydi. Muammo: tip xavfsiz emas,
    // noto'g'ri tip ishga tushganda panic bo'ladi.
    func (p Pipeline) Apply(f func(any) any) Pipeline {
        out := make([]any, len(p.items))
        for i, x := range p.items {
            out[i] = f(x)
        }
        return Pipeline{items: out}
    }

    func main() {
        p := NewPipeline(54.5, 12.0, 80.5)
        labels := p.Apply(func(x any) any {
            return strconv.FormatFloat(x.(float64), 'f', 1, 64) + " l"
        })
        fmt.Println(labels.items)

        defer func() { fmt.Println("recover:", recover()) }()
        bad := NewPipeline(54.5, "12")
        bad.Apply(func(x any) any { return x.(float64) * 2 })
    }
  solution: |
    package main

    import (
        "fmt"
        "strconv"
    )

    // List - tip xavfsiz ro'yxat.
    type List[E any] []E

    // Apply Go 1.24 da method type parameter e'lon qila olmagani uchun paket funksiyasi.
    // Go 1.27 da buni func (l List[E]) Apply[F any](...) deb yozish mumkin.
    func Apply[E, F any](l List[E], f func(E) F) List[F] {
        out := make(List[F], len(l))
        for i, x := range l {
            out[i] = f(x)
        }
        return out
    }

    func main() {
        p := List[float64]{54.5, 12.0, 80.5}
        labels := Apply(p, func(x float64) string {
            return strconv.FormatFloat(x, 'f', 1, 64) + " l"
        })
        fmt.Println(labels)

        // Noto'g'ri tip endi kompilyatsiya xatosi:
        // Apply(List[string]{"12"}, func(x float64) float64 { return x * 2 })
        doubled := Apply(List[string]{"12", "7"}, func(s string) int {
            n, _ := strconv.Atoi(s)
            return n * 2
        })
        fmt.Println(doubled)
    }
  solutionNotes: |
    - `Apply[E, F any]` ikkita type parameter'ga ega: kirish va chiqish element tipi. Metod bo'lganda `F` ni e'lon qilib bo'lmas edi (Go 1.24), shuning uchun funksiya.
    - `make(List[F], len(l))` natija uzunligini oldindan biladi: qayta ajratishlar yo'q.
    - Tip xulosasi (inference) `Apply(p, func(x float64) string {...})` da `E=float64`, `F=string` ni argumentlardan oladi: tiplarni qo'lda yozish shart emas.
    - Noto'g'ri tipdagi chaqiruv (`Apply(List[string]{...}, func(x float64) float64 {...})`) endi kompilyatsiya vaqtida rad etiladi; starter'dagi `interface conversion` panic'i yo'qoladi.
    - Go 1.27 da bu funksiyani `List[E]` ning metodi qilib yozish mumkin bo'ladi (release notes), lekin zanjir yozuvi qanday ko'rinishi bu darsda tekshirilmagan.
  checklist:
    - "`Apply` ikkita type parameter bilan e'lon qilingan"
    - "`any` va tip tasdiqlash (`x.(float64)`) yo'q"
    - "Chiqish `[54.5 l 12.0 l 80.5 l]` va `[24 14]`"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Generics 24-darsdan beri tanish, lekin bitta joyda ular xijolat qiladi: metod yangi type parameter kirita olmaydi. `List[E]` ro'yxatingiz bor, uni `List[F]` ga o'girmoqchisiz (map, convert, decode): funksiya yangi tip `F` ni talab qiladi. Go 1.24 da quyidagi kod kompilyatsiya bo'lmaydi:

```go
func (l List[E]) Map[F any](f func(E) F) List[F] {
	return nil
}
```

Kompilyator Go 1.24.7 da shuni beradi:

```text
./main.go:5:21: syntax error: method must have no type parameters
```

Natijada `Map` metodi o'rniga paket darajasida `Map(list, f)` funksiyasi yoziladi, zanjirli yozuv (`list.Filter(...).Map(...)`) uziladi, API esa tipga tegishli bo'lmagan global funksiyalar bilan to'ladi. Muhim ogohlantirish: bu dars Go 1.27 xususiyati haqida. Kursning toolchain'i Go 1.24.7, shuning uchun 1.27 sintaksisi lokal kompilyatsiya qilinmagan va dars 1.27 haqidagi har bir da'voni faqat rasmiy release notes va spetsifikatsiyaga asoslaydi. Tekshirib bo'lmagan narsa alohida belgilanadi.

## Asosiy g'oya

### Release notes nima deydi

Go 1.27 release notes ("Changes to the language") bo'limi bunday yozadi: Go 1.27 endi generic metodlarni qo'llab-quvvatlaydi, ya'ni metod e'loni o'zining type parameter'larini e'lon qilishi mumkin. Bu "kutilgan o'zgarish" tip nomlari ichida generic funksiyalarni qo'shishga imkon beradi, oldin bunday funksiyalar butun paket doirasida e'lon qilinishi kerak edi.

Notes bitta konkret misol keltiradi: `math/rand/v2` endi `(*Rand) N[Int intType](Int) Int` imzoli generic metodni ham e'lon qiladi, avval faqat `N[Int intType](Int) Int` generic funksiyasi bor edi. Kutubxona bo'limi shuni tasdiqlaydi: `Rand` endi top-level `N` funksiyasiga mos generic `N` metodini qo'llab-quvvatlaydi.

Eng muhim cheklov ham o'sha paragrafda: interface metodlari type parameter e'lon qila olmaydi, interface metodlarini generic metodlar implement qila olmaydi.

Release notes shu bilan chegaralanadi. Quyidagilar notes'da yozilmagan va bu dars ularni da'vo qilmaydi: generic metodni chaqirish sintaksisi va tip xulosasi qoidalarining batafsil bayoni, performance xususiyatlari, boshqa standart paketlardagi generic metodlar.

### Spetsifikatsiyadan nima ma'lum

Spetsifikatsiyaning "Method declarations" bo'limi generic tip uchun receiver qoidasini beradi: receiver tipi generic bo'lsa, receiver spetsifikatsiyasi mos type parameter'larni e'lon qilishi kerak (ularning soni tip e'lonidagi bilan teng, nomlari esa farq qilishi mumkin). "Type parameter declarations" bo'limi esa type parameter ro'yxati generic funksiya, metod yoki tip e'lonini belgilashini aytadi. Go 1.27 spetsifikatsiyasida bu bo'lim metod e'lonining grammatikasida metod nomidan keyin ixtiyoriy type parameter ro'yxatini ko'rsatadi va metod o'z type parameter'larini e'lon qilsa, uni generic metod deb ataydi: generic funksiya kabi, chaqirishdan yoki qiymat sifatida ishlatishdan oldin u instantiate qilinishi kerak. Chaqiruv sintaksisi va tip xulosasining batafsil qoidalarini bu dars keltirmaydi. Release notes'dagi `(*Rand) N[Int intType](Int) Int` yozuvi sintaksisning ko'rinishini ko'rsatadi: metod nomidan keyin kvadrat qavsda type parameter ro'yxati.

### Eslatma: nima o'zgarmaydi

- Generic tipning receiver type parameter'lari (`func (l List[E]) Filter(...)`) avvalgidek ishlaydi.
- Interface metodlari type parameter olmaydi. Demak, generic metod orqali polimorfizm (`interface { N[T any](T) }` kabi shartnoma) mumkin emas.
- Generic metod interface'ni qanoatlantirishda ishtirok etmaydi: interface metodi uni implement qila olmaydi.

## Chuqurroq: Go 1.24 da muqobil yo'l

### Paket funksiyasi: har doim ishlaydigan shakl

Generic metod yo'qligida standart yechim: ikkinchi type parameter kerak bo'lsa, funksiya yozing. Quyidagi tajriba Go 1.24.7 da ishga tushirilgan:

```go
package main

import (
	"fmt"
	"strconv"
)

type List[E any] []E

// Go 1.24 da method type parameter e'lon qila olmaydi, shuning uchun Apply paket darajasidagi funksiya.
func Apply[E, F any](l List[E], f func(E) F) List[F] {
	r := make(List[F], len(l))
	for i, x := range l {
		r[i] = f(x)
	}
	return r
}

// Filter yangi type parameter kiritmaydi: oddiy method sifatida qoladi.
func (l List[E]) Filter(keep func(E) bool) List[E] {
	var r List[E]
	for _, x := range l {
		if keep(x) {
			r = append(r, x)
		}
	}
	return r
}

func main() {
	fuel := List[float64]{54.5, 12, 80.5}
	low := fuel.Filter(func(f float64) bool { return f < 60 })
	// Zanjir Filter dan keyin uziladi: Apply method emas.
	labels := Apply(low, func(f float64) string { return strconv.FormatFloat(f, 'f', 1, 64) + " l" })
	fmt.Println(labels)
}
```

```text
[54.5 l 12.0 l]
```

`Filter` yangi type parameter kiritmaydi, shuning uchun oddiy metod bo'lib qoladi. `Apply` esa `E` dan `F` ga o'tadi, shuning uchun funksiya. Natija: `list.Filter(...)` metod, lekin `Apply(...)` uning ustida zanjir sifatida yozilmaydi, funksiya argumenti bo'lib keladi. Yozuv tartibi chaqiruv tartibiga teskari (ichkaridan tashqariga) o'qiladi.

### Alternativalar nega yomon

Metod bilan zanjir olish uchun ba'zan `any` ishlatiladi: elementlar `[]any`, funksiya `func(any) any`. Bu kompilyatsiya qiladi, lekin tip xavfsizligi yo'qoladi: noto'g'ri tip faqat run-time'da `interface conversion` panic'i bilan chiqadi. Quyidagi vazifa shuni ko'rsatadi. Reflection ham shu natijani beradi, ustiga sekinroq (30-dars). Generic funksiya esa xatoni kompilyatsiya vaqtida ushlaydi va tip xulosasi tufayli chaqiruv joyida tiplar qo'lda yozilmaydi (24-dars).

### Generic metodlar kelganda nima o'zgaradi (release notes darajasida)

Notes'ga ko'ra metod endi o'z type parameter'lariga ega bo'la oladi, ya'ni `(*Rand) N[Int intType](Int) Int` kabi API'lar tipning nom maydonida turadi. Bu kutubxona API dizayniga ta'sir qiladi: `rand.N(...)` va `r.N(...)` ikkalasi mavjud bo'ladi va bir xil nomli generic funksiya hamda metod birga yashaydi. Kutubxona muallifi uchun amaliy xulosa: yangi API'larni tipga bog'lash mumkin, lekin Go 1.27 ni minimal versiya qilgan modullar uchungina (go.mod dagi `go` qatori, 2-dars).

### Kutubxona muallifi uchun migratsiya rejasi

Quyidagi qadamlar muallifning tavsiyasi, rasmiy qoida emas, lekin ularning har biri yuqoridagi tekshirilgan faktlarga tayanadi.

1. Hozirgi API'da paket darajasidagi funksiyalar (`Apply`, `Map`) bor bo'lsa, ularni o'chirmang. Go 1.27 ni minimal versiya qilmagan foydalanuvchilar uchun ular yagona yo'l bo'lib qoladi. Go 1 compatibility va'dasi (1-dars) ommaviy API'ni buzmaslikni talab qiladi, shuning uchun funksiyani olib tashlash mayor versiya masalasi.
2. Metod shaklini qo'shishni faqat `go.mod` dagi `go` qatorini 1.27 ga ko'targandan keyin o'ylang. Eski toolchain bilan yig'iladigan modulda generic metod yozish yig'ishni sindiradi: Go 1.24 `method must have no type parameters` deb to'xtaydi.
3. Interface orqali ochiladigan API'da generic metodga tayanmang. Notes'ga ko'ra interface metodi type parameter olmaydi, shuning uchun bunday shartnoma baribir konkret tip yoki funksiya parametri orqali ifodalanadi.
4. `math/rand/v2` misoli yo'nalishni ko'rsatadi: avval funksiya (`N`), keyin unga mos metod (`(*Rand) N`). Ikkala shaklni birga saqlash standart kutubxonada tanlangan yo'l. O'z kutubxonangizda ham xuddi shunday ketma-ketlik eng kam xavfli.

Yana bir amaliy nuqta: generic metod qo'shilgach, hujjat va misollarda ikkala shaklni (funksiya va metod) ko'rsatish kerak, aks holda foydalanuvchi qaysi biri afzalligini bilmaydi. Bu qaror ham o'lchovga emas, API ravshanligiga tayanadi.

## Misol: Pipeline'dan generic funksiyaga

Yuqoridagi Go 1.24 kodi `List[E]` ni `Apply` bilan boshqa tipga o'giradi. `any` varianti bilan farq quyida vazifada: starter'da `bad.Apply(func(x any) any { return x.(float64) * 2 })` `"12"` satrida panic beradi (`interface conversion: interface {} is string, not float64`), yechimda esa xuddi shu xato kompilyatsiya xatosiga aylanadi.

Go 1.27 da shu kodni `List[E]` metodi sifatida yozish mumkin bo'lishi release notes'dan kelib chiqadi (metod `F` ni o'zi e'lon qiladi). Biz bu variantni kompilyatsiya qilmadik, shuning uchun:

- chaqiruv sintaksisi (`list.Apply[...](...)` yoki tip argumentlari tushirilgan shakl),
- tip xulosasi metod chaqiruvida qanday ishlashi,
- zanjirda (`list.Filter(...).Apply(...)`) tip xulosasi qanday ishlashi

bu darsda tasdiqlangan fakt sifatida berilmaydi. Go 1.27 chiqqach, yoki toolchain'ni yangilagach, shularni o'zingiz sinab ko'ring. Faqat release notes'da yozilganiga ishoning: metod e'loni type parameter'larni e'lon qila oladi, interface metodlari esa yo'q.

## Qachon qo'llamaslik kerak

- Yangi type parameter kerak bo'lmasa, generic metod kerak emas: oddiy metod (`Filter`) yetarli.
- Interface orqali chaqiriladigan operatsiya uchun generic metod ishlamaydi (notes: interface metodlari type parameter e'lon qila olmaydi, generic metod interface metodini implement qila olmaydi). Bunday joyda konkret tiplar bilan interface (21-dars) yoki funksiya parametri ishlating.
- Kutubxona go.mod'ida eski Go versiyasi (masalan 1.24) ko'rsatilgan bo'lsa generic metod yozmang: Go 1.24 uni `method must have no type parameters` xatosi bilan rad etadi.
- Bir marta ishlatiladigan oddiy konvertatsiya uchun type parameter'li metodga zo'r bermang: 26-dars qoidasi (bir xil kodni ko'p yozayotganingizni sezmaguncha type parameter kiritmang) bu yerda ham amal qiladi.
- Dasturingiz Go 1.27 ni talab qilishi sababli jamoadagi hamma toolchain'ni yangilashi kerak bo'lsa, funksiya shakli (har versiyada ishlaydi) vaqtincha afzal bo'lishi mumkin. Bu muallifning tavsiyasi, rasmiy qoida emas.

## Stack'da: Node.js/TypeScript bilan farq

- TypeScript'da metod o'z type parameter'iga ega bo'la oladi: `map<U>(f: (x: T) => U): List<U>`. Go 1.24 da bu mumkin emas edi, Go 1.27 da mumkin bo'ladi.
- TypeScript'da interface metodi ham generic bo'la oladi (`interface Box<T> { map<U>(f: (x: T) => U): Box<U> }`). Go 1.27 notes'ga ko'ra interface metodlari type parameter e'lon qila olmaydi: Go interface'lari bu yerda TypeScript'dan cheklangan.
- TypeScript tiplari kompilyatsiyadan keyin o'chiriladi; Go'da instantiation natijasi dastur tarkibiga kiradi (24-dars).
- JS'da `arr.map(f)` zanjiri tabiiy; Go'da `Apply` funksiya bo'lgani uchun `Filter(...)` dan keyin ichma-ich chaqiruv yoziladi. Generic metodlar bu farqni yumshatishi kutiladi, lekin zanjir sintaksisi bu darsda tekshirilmagan.

## Xulosa

- Go 1.24 da metod yangi type parameter e'lon qila olmaydi: kompilyator `method must have no type parameters` beradi.
- Go 1.27 release notes: metod e'loni o'z type parameter'larini e'lon qila oladi; misol: `(*Rand) N[Int intType](Int) Int` (`math/rand/v2`).
- Cheklov: interface metodlari type parameter e'lon qila olmaydi va generic metodlar interface metodlarini implement qila olmaydi.
- Go 1.24 da muqobil: paket darajasidagi generic funksiya (`Apply[E, F any]`), `any` yoki reflection emas.
- Bu dars Go 1.27 kodini kompilyatsiya qilmagan: chaqiruv sintaksisi va tip xulosasi tafsilotlari tasdiqlanmagan.
