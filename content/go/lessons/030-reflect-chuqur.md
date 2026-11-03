---
n: 30
slug: reflect-chuqur
title: "reflect: qonunlari, narxi va xavfsiz ishlatish"
summary: "reflect paketining uch qonuni, settable qiymatlar, struct teglari bo'yicha yurish, panic'lar, o'lchangan narxi va reflection'dan qochish yoki xavfsiz ishlatish qoidalari; Go 1.22 TypeFor, Go 1.25 TypeAssert va Go 1.26 iterator metodlari."
duration: 50
sources:
  - id: blog-laws-reflection
    note: "Reflection'ning uchta qonuni: interface qiymatdan reflection obyektiga, reflection obyektidan interface qiymatga, o'zgartirish uchun qiymat settable bo'lishi kerak"
  - id: pkg-reflect
    note: "Package reflect hujjati: TypeOf, ValueOf, Kind, CanSet, CanInterface, Elem, FieldByName, MethodByName, DeepEqual, TypeFor"
  - id: go126
    note: "reflect bo'limi: Type.Fields, Type.Methods, Type.Ins, Type.Outs, Value.Fields, Value.Methods iterator metodlari"
quiz:
  - q: "`reflect.ValueOf(d).FieldByName(\"Fuel\").SetFloat(10)` bu yerda `d` `Device` struct (pointer emas). Natija?"
    options:
      - "`Fuel` 10 bo'ladi"
      - "Panic: `reflect.Value.SetFloat using unaddressable value`, chunki `ValueOf(d)` nusxa oladi va qiymat settable emas"
      - "Kompilyatsiya xatosi"
      - "`SetFloat` jimgina hech narsa qilmaydi"
    answer: 1
    explain: "Uchinchi qonun: o'zgartirish uchun qiymat settable bo'lishi kerak. Struct nusxasidan olingan `Value` addressable emas. `ValueOf(&d).Elem()` orqali olingan `Value` settable. Darsdagi tajribada aynan shu panic xabari chiqadi."
  - q: "Nega `ValueOf(&d).Elem().FieldByName(\"secret\").SetString(\"y\")` panic beradi (`secret` eksport qilinmagan maydon)?"
    options:
      - "`SetString` faqat int maydonlar uchun"
      - "`d` nil"
      - "`secret` string emas"
      - "Eksport qilinmagan maydondan olingan `Value` o'zgartirilmaydi: `reflect.Value.SetString using value obtained using unexported field`"
    answer: 3
    explain: "Paket chegarasi reflection orqali ham saqlanadi. Eksport qilinmagan maydonni o'qish (`Interface()` ham) va yozish mumkin emas; `CanInterface()` `false` qaytaradi. Shuning uchun umumiy kod oldin `IsExported()` yoki `CanSet()` ni tekshirishi kerak."
  - q: "`reflect.ValueOf(\"gps\").Int()` nima qiladi?"
    options:
      - "Panic: `call of reflect.Value.Int on string Value`"
      - "`0` qaytaradi"
      - "Satrni son sifatida o'qishga urinadi"
      - "Kompilyatsiya xatosi"
    answer: 0
    explain: "`Value` metodlari Kind'ga mos chaqirilishi shart. Noto'g'ri Kind run-time panic'i beradi. Oldin `Kind()` yoki `CanInt()`/`CanFloat()` kabi tekshiruv yoziladi."
  - q: "Darsdagi o'lchovda (Go 1.24.7, bitta mashina) maydonni `FieldByName(\"Fuel\")` bilan topib yozish, `Field(index)` bilan yozish va to'g'ridan-to'g'ri `d.Fuel += 1` solishtirildi. Qaysi xulosa o'lchovga mos?"
    options:
      - "Reflection har doim 1000 baravar sekin"
      - "Reflection to'g'ridan-to'g'ri yozishdan arzon"
      - "Nom bo'yicha qidirish (`FieldByName`) indeks bo'yicha murojaatdan ancha qimmat; ikkalasi to'g'ridan-to'g'ri yozishdan sekin"
      - "Hamma variant bir xil tezlikda"
    answer: 2
    explain: "Natijalar: to'g'ridan-to'g'ri 2.6-4.0 ns/op, `FieldByName` 52-63 ns/op, `Field(idx)` 6.1-7.8 ns/op. Uchala variantda ham allocation yo'q. Bu mikrobenchmark; raqamlar mashinaga bog'liq, tartib farqi esa muhim: nomni topish asosiy xarajat."
  - q: "`reflect.DeepEqual([]int(nil), []int{})` natijasi?"
    options:
      - "`true`"
      - "`false`: nil slice va bo'sh (nil bo'lmagan) slice deep equal emas"
      - "Panic"
      - "Kompilyatsiya xatosi"
    answer: 1
    explain: "Hujjat: nil va bo'sh nil bo'lmagan slice'lar DeepEqual bo'yicha teng emas (xuddi shunday map'lar uchun). Darsdagi tajribada `true false` chiqadi: birinchisi bir xil map'lar, ikkinchisi nil va bo'sh slice."
  - q: "Go 1.26 release notes `reflect` uchun nimani qo'shdi?"
    options:
      - "`reflect.TypeFor`"
      - "`reflect.TypeAssert`"
      - "`Type.Fields`, `Type.Methods`, `Type.Ins`, `Type.Outs`, `Value.Fields`, `Value.Methods` iterator metodlari"
      - "Generic `reflect.Map`"
    answer: 2
    explain: "Notes: yangi metodlar tipning maydonlari, metodlari, kirish va chiqish parametrlari uchun iteratorlarni qaytaradi; `Value.Fields`/`Methods` har iteratsiyada tip ma'lumotini va qiymatni beradi. `TypeFor` Go 1.22 da, `TypeAssert` Go 1.25 da kelgan."
task:
  title: "Validate: panic'siz va xavfsiz reflection"
  prompt: |
    `Validate(x any)` struct teglari (`validate:"required"`, `validate:"min=0"`) bo'yicha xatolar ro'yxatini qaytaradi. Starter ikki holatda panic beradi: struct eksport qilinmagan maydonga ega bo'lsa (`Interface()` chaqiriladi), va pointer berilsa (`NumField` pointer tipida ishlamaydi).

    Vazifa:
    1. Pointer bo'lsa uni oching (`Elem`), nil pointer va struct bo'lmagan qiymat uchun panic emas, `error` qaytaring.
    2. Eksport qilinmagan maydonlarni `IsExported()` bilan o'tkazib yuboring; qiymatni `Interface()` orqali emas, `fv.IsZero()`, `fv.CanFloat()`, `fv.Float()` bilan o'qing.
    3. Imzoni `Validate(x any) ([]string, error)` ga o'zgartiring va `main` da to'rtta holatni chiqaring: qiymat, pointer, nil pointer, struct bo'lmagan qiymat.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "reflect"
        "strconv"
        "strings"
    )

    type Device struct {
        ID     string  `validate:"required"`
        Fuel   float64 `validate:"min=0"`
        Plate  string  `validate:"required"`
        secret string
    }

    // Validate teglar bo'yicha xatolar ro'yxatini qaytaradi.
    // Muammo: pointer bilan panic bo'ladi, eksport qilinmagan maydonda ham Interface() chaqiradi.
    func Validate(x any) []string {
        var errs []string
        t := reflect.TypeOf(x)
        v := reflect.ValueOf(x)
        for i := 0; i < t.NumField(); i++ {
            rule := t.Field(i).Tag.Get("validate")
            val := v.Field(i).Interface()
            switch {
            case rule == "required":
                if reflect.ValueOf(val).IsZero() {
                    errs = append(errs, t.Field(i).Name+": majburiy")
                }
            case strings.HasPrefix(rule, "min="):
                limit, _ := strconv.ParseFloat(strings.TrimPrefix(rule, "min="), 64)
                if f, ok := val.(float64); ok && f < limit {
                    errs = append(errs, t.Field(i).Name+": kichik")
                }
            }
        }
        return errs
    }

    func main() {
        defer func() { fmt.Println("recover:", recover()) }()
        fmt.Println(Validate(Device{ID: "T-1", Fuel: -5}))
        fmt.Println(Validate(&Device{ID: "T-1"}))
    }
  solution: |
    package main

    import (
        "fmt"
        "reflect"
        "strconv"
        "strings"
    )

    type Device struct {
        ID     string  `validate:"required"`
        Fuel   float64 `validate:"min=0"`
        Plate  string  `validate:"required"`
        secret string
    }

    // Validate teglar bo'yicha xatolar ro'yxatini qaytaradi.
    // Pointer ochiladi, eksport qilinmagan maydonlar o'tkazib yuboriladi,
    // struct bo'lmagan qiymat panic emas, xato beradi.
    func Validate(x any) ([]string, error) {
        v := reflect.ValueOf(x)
        for v.Kind() == reflect.Pointer {
            if v.IsNil() {
                return nil, fmt.Errorf("nil pointer: %T", x)
            }
            v = v.Elem()
        }
        if v.Kind() != reflect.Struct {
            return nil, fmt.Errorf("struct kerak, keldi %T", x)
        }
        t := v.Type()

        var errs []string
        for i := 0; i < t.NumField(); i++ {
            sf := t.Field(i)
            if !sf.IsExported() {
                continue
            }
            rule := sf.Tag.Get("validate")
            fv := v.Field(i)
            switch {
            case rule == "required":
                if fv.IsZero() {
                    errs = append(errs, sf.Name+": majburiy")
                }
            case strings.HasPrefix(rule, "min="):
                limit, err := strconv.ParseFloat(strings.TrimPrefix(rule, "min="), 64)
                if err != nil {
                    return nil, fmt.Errorf("%s: min qiymati noto'g'ri: %w", sf.Name, err)
                }
                if fv.CanFloat() && fv.Float() < limit {
                    errs = append(errs, sf.Name+": kichik")
                }
            }
        }
        return errs, nil
    }

    func main() {
        fmt.Println(Validate(Device{ID: "T-1", Fuel: -5}))
        fmt.Println(Validate(&Device{ID: "T-1", Plate: "01A"}))
        fmt.Println(Validate((*Device)(nil)))
        fmt.Println(Validate(42))
    }
  solutionNotes: |
    - `for v.Kind() == reflect.Pointer` pointer'larni ochadi, nil bo'lsa `error` qaytariladi. Nil pointer'da `Elem()` zero `Value` berar edi va keyingi chaqiruv panic qilardi.
    - `v.Kind() != reflect.Struct` tekshiruvi `NumField` panic'ining oldini oladi: umumiy `any` qabul qiluvchi funksiya kirishni o'zi tekshirishi kerak.
    - `sf.IsExported()` eksport qilinmagan maydonlarni o'tkazib yuboradi: ularning qiymatini `Interface()` orqali olib bo'lmaydi (`CanInterface()` `false`).
    - `fv.IsZero()` va `fv.CanFloat()`/`fv.Float()` qiymatni `any` ga o'ramasdan o'qiydi: oraliq allocation va tip tasdiqlash kerak emas.
    - Teg parslash xatosi (`min=abc`) endi e'tiborsiz qoldirilmaydi, `error` sifatida o'raladi (`%w`).
    - Bu hali ham reflection: kompilyator maydon nomlari va teglarni tekshirmaydi. Doimiy hot path'da bu yondashuvni ishlatmang (quyida narx).
  checklist:
    - "Pointer ochiladi, nil pointer va struct bo'lmagan qiymat uchun `error` qaytariladi"
    - "Eksport qilinmagan maydonlar `IsExported()` bilan o'tkazib yuboriladi"
    - "Qiymat `Interface()` siz o'qiladi (`IsZero`, `CanFloat`, `Float`)"
    - "Chiqish: `[Fuel: kichik Plate: majburiy] <nil>` va boshqa uch holat"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

`encoding/json`, ORM'lar, validatorlar, dependency injection kutubxonalari: ularning hammasi tipni oldindan bilmaydi. Kod run-time'da "bu qiymat qanday tip, qanday maydonlari va teglari bor" deb so'rashi kerak. Go'da bu `reflect` paketi. 26-darsda aytganimizdek, `encoding/json` kabi holatlarda na interface (har bir tipdan `MarshalJSON` talab qilib bo'lmaydi), na generics (struct kodlash string kodlashga o'xshamaydi) yordam beradi, shuning uchun reflection to'g'ri vosita.

Lekin `reflect` kompilyator tekshiruvini o'chiradi. Maydon nomi satr, tip tekshiruvi run-time'da, xato esa ko'p hollarda panic. Bu dars paketning uch qonunini, settable qiymatlar mantiqini, panic manbalarini va narxini o'lchaydi. Maqsad: reflection'ni kerak joyda xavfsiz ishlatish va kerak bo'lmagan joyda ishlatmaslik.

## Asosiy g'oya

### Uch qonun

Rob Pike'ning "The Laws of Reflection" maqolasi reflection'ni uchta qonunga jamlaydi:

1. Reflection interface qiymatdan reflection obyektiga o'tadi.
2. Reflection reflection obyektidan interface qiymatga o'tadi.
3. Reflection obyektini o'zgartirish uchun uning qiymati settable bo'lishi kerak.

Kodda:

- Birinchi qonun: `reflect.TypeOf(x)` va `reflect.ValueOf(x)`. Parametr `any` bo'lgani uchun har qanday qiymat interface'ga o'raladi (21-23-darslar), `TypeOf`/`ValueOf` uni ochadi. `Type` statik tavsif (nomi, `Kind`, maydonlar ro'yxati), `Value` esa konkret qiymat.
- Ikkinchi qonun: `v.Interface()` `Value`dan `any` qaytaradi, keyin odatdagidek type assertion qilinadi.
- Uchinchi qonun: `reflect.ValueOf(d)` `d` ning nusxasini oladi. Nusxani o'zgartirish `d` ga ta'sir qilmasdi, shuning uchun reflect buni panic bilan to'xtatadi. O'zgartirish uchun pointer berilib, `Elem()` bilan ochiladi: bunda `Value` addressable va `CanSet()` `true`.

### Type va Kind

`Type` aniq tipni (`main.Device`), `Kind` esa tipning turkumini (`struct`, `ptr`, `int`, `slice`...) beradi. Umumiy kod odatda `Kind` bo'yicha tarmoqlanadi, chunki turli nomli tiplar bir xil `Kind`ga ega. `reflect.TypeFor[T]()` (Go 1.22) qiymatsiz `Type` olish imkonini beradi: `reflect.TypeFor[error]()` kabi interface tiplari uchun ham ishlaydi, `TypeOf((*error)(nil)).Elem()` kabi sirli yozuv kerak emas.

### Struct teglari

Struct maydon tegi (`json:"id" validate:"required"`) faqat satr; uni `t.Field(i).Tag.Get("json")` bilan o'qiymiz. Kutubxonalar shu bilan konfiguratsiya o'qiydi. Teg sintaksisi kompilyator tomonidan tekshirilmaydi (vet bor, lekin umumiy emas), shuning uchun xato teg run-time'da aniqlanadi yoki umuman aniqlanmaydi.

### Go 1.25 va 1.26 yangiliklari

Go 1.25: `reflect.TypeAssert` funksiyasi `Value`ni to'g'ridan-to'g'ri berilgan tipdagi Go qiymatiga aylantiradi, `Value.Interface()` ustidan type assertion qilishga o'xshaydi, lekin keraksiz xotira ajratishdan qochadi (Go 1.25 release notes). Go 1.26 release notes: `Type.Fields`, `Type.Methods`, `Type.Ins`, `Type.Outs` maydonlar, metodlar va funksiya tipining kirish/chiqish parametrlari iteratorlarini qaytaradi; `Value.Fields` va `Value.Methods` har iteratsiyada tip ma'lumotini (`StructField` yoki `Method`) va unga mos `Value` ni beradi. Bu iteratorlar 28-dars shartnomasiga amal qiladi (range-over-func). Bu ikkala yangilik Go 1.24.7 da kompilyatsiya qilinmaydi, shuning uchun darsdagi kod ularni ishlatmaydi va ular faqat release notes asosida bayon qilindi.

## Chuqurroq: settable, panic'lar va narx

### Settable nima

`Value` settable bo'lishi uchun addressable bo'lishi va eksport qilinmagan maydondan olinmagan bo'lishi kerak. `CanSet()` shuni tekshiradi. Struct nusxasidan olingan `Value`, eksport qilinmagan maydon va map elementi settable emas. Shu sababli umumiy kod pointer qabul qilib, `v.Elem()` bilan ishlaydi (misoldagi `setFuel`), va oldin `CanSet()` ni tekshiradi.

### Panic'lar

Reflection xatolari odatda panic. Misolda uch tipik xato chiqarib ko'rsatildi:

- Addressable bo'lmagan qiymatga yozish: `reflect: reflect.Value.SetFloat using unaddressable value`.
- Eksport qilinmagan maydonga yozish: `reflect: reflect.Value.SetString using value obtained using unexported field`.
- Noto'g'ri `Kind` uchun metod: `reflect: call of reflect.Value.Int on string Value`.

Bunday kodni ishlab chiqarish yo'lida yozayotgan bo'lsangiz, kirishni oldindan tekshiring (`Kind`, `IsNil`, `IsValid`, `CanSet`, `CanInterface`), nil pointer va zero `Value` (`IsValid()` `false`) holatlarini hisobga oling. Kutubxona chegarasida esa panic'ni `recover` bilan `error` ga aylantirish ham mumkin, lekin dasturiy xato (noto'g'ri chaqiruv) bilan kirish xatosini farqlay olish shart (xatolar modulida batafsil).

### Narx: o'lchang

Reflection sekin deyiladi. Qancha? Bitta maydonni o'qib-yozishning uch usulini solishtirdik: to'g'ridan-to'g'ri `d.Fuel += 1`, `FieldByName("Fuel")` bilan va oldindan topilgan indeks bilan (`Field(1)`).

```go
package b30

import (
	"reflect"
	"testing"
)

type Device struct {
	ID   string
	Fuel float64
}

var sink float64

func BenchmarkDirect(b *testing.B) {
	d := &Device{Fuel: 1}
	for i := 0; i < b.N; i++ {
		d.Fuel += 1
	}
	sink = d.Fuel
}

func BenchmarkReflectByName(b *testing.B) {
	d := &Device{Fuel: 1}
	for i := 0; i < b.N; i++ {
		f := reflect.ValueOf(d).Elem().FieldByName("Fuel")
		f.SetFloat(f.Float() + 1)
	}
	sink = d.Fuel
}

func BenchmarkReflectByIndex(b *testing.B) {
	d := &Device{Fuel: 1}
	idx := 1
	for i := 0; i < b.N; i++ {
		f := reflect.ValueOf(d).Elem().Field(idx)
		f.SetFloat(f.Float() + 1)
	}
	sink = d.Fuel
}
```

Natija (Go 1.24.7, linux/amd64, Intel Xeon 2.1 GHz virtual mashina, 2 vCPU, `-count 3`):

```text
goos: linux
goarch: amd64
cpu: Intel(R) Xeon(R) Processor @ 2.10GHz
BenchmarkDirect-2           	437025547	         2.649 ns/op	       0 B/op	       0 allocs/op
BenchmarkDirect-2           	457071657	         3.982 ns/op	       0 B/op	       0 allocs/op
BenchmarkDirect-2           	354920953	         3.601 ns/op	       0 B/op	       0 allocs/op
BenchmarkReflectByName-2    	24286947	        52.34 ns/op	       0 B/op	       0 allocs/op
BenchmarkReflectByName-2    	21210733	        62.78 ns/op	       0 B/op	       0 allocs/op
BenchmarkReflectByName-2    	19658096	        60.41 ns/op	       0 B/op	       0 allocs/op
BenchmarkReflectByIndex-2   	171076294	         6.455 ns/op	       0 B/op	       0 allocs/op
BenchmarkReflectByIndex-2   	186489615	         6.088 ns/op	       0 B/op	       0 allocs/op
BenchmarkReflectByIndex-2   	200368846	         7.843 ns/op	       0 B/op	       0 allocs/op
```

Kuzatuv: to'g'ridan-to'g'ri yozish 2.6-4.0 ns/op, indeks bo'yicha reflection 6.1-7.8 ns/op, nom bo'yicha 52-63 ns/op. Uchalasida allocation yo'q. Demak, asosiy xarajat reflection'ning o'zida emas, balki nomni qidirishda: `FieldByName` maydonlar ro'yxatini nom bo'yicha qidiradi. Indeks bo'yicha murojaat 8-10 baravar arzonroq. Amaliy xulosa: struct tuzilishini bir marta o'qib (indekslar va teglarni keshlab), keyin indeks bo'yicha ishlang. Mexanizm tafsilotlarini bu kursning manbalari tushuntirmaydi, shuning uchun biz faqat o'lchovni qayd etamiz. Bu mikrobenchmark: bitta mashina, bitta Go versiyasi, oddiy maydon. Kompilyator to'g'ridan-to'g'ri yozuvni optimallashtirishi mumkin, ya'ni 2.6-4.0 ns/op ni mutlaq tezlik emas, o'lchov tartibi sifatida o'qing. Qaror qabul qilishdan oldin o'z kodingizda o'lchang (61-dars).

### DeepEqual

`reflect.DeepEqual(a, b)` slice, map va struct'larni chuqur solishtiradi. Hujjat qoidasi: nil slice va bo'sh nil bo'lmagan slice teng emas. Testlarda qulay, lekin `slices.Equal`/`maps.Equal` (29-dars) tezroq va aniqroq bo'lgan joyda ularni afzal ko'ring.

## Misol: tekshirish, teglar, chaqirish

```go
package main

import (
	"fmt"
	"reflect"
)

type Device struct {
	ID     string  `json:"id" validate:"required"`
	Fuel   float64 `json:"fuel" validate:"min=0"`
	Active bool    `json:"active"`
	secret string
}

func (d Device) Label() string { return "device-" + d.ID }

// Birinchi qonun: interface qiymatdan reflection obyektiga.
func inspect(x any) {
	t := reflect.TypeOf(x)
	v := reflect.ValueOf(x)
	fmt.Println(t, t.Kind(), v.Kind())
}

// Ikkinchi qonun: reflection obyektidan interface qiymatga.
func roundTrip(x any) any {
	return reflect.ValueOf(x).Interface()
}

// Uchinchi qonun: o'zgartirish uchun Value settable bo'lishi shart.
func setFuel(p any, litres float64) error {
	v := reflect.ValueOf(p)
	if v.Kind() != reflect.Pointer || v.IsNil() {
		return fmt.Errorf("pointer kerak, keldi %T", p)
	}
	f := v.Elem().FieldByName("Fuel")
	if !f.IsValid() {
		return fmt.Errorf("Fuel maydoni yo'q")
	}
	if !f.CanSet() {
		return fmt.Errorf("Fuel o'zgartirib bo'lmaydi")
	}
	f.SetFloat(litres)
	return nil
}

// Struct teglari bo'yicha maydonlarni yurish.
func describe(x any) {
	t := reflect.TypeOf(x)
	v := reflect.ValueOf(x)
	for i := 0; i < t.NumField(); i++ {
		sf := t.Field(i)
		tag := sf.Tag.Get("json")
		if !sf.IsExported() {
			fmt.Printf("%s: eksport qilinmagan, CanInterface=%v\n", sf.Name, v.Field(i).CanInterface())
			continue
		}
		fmt.Printf("%s json=%q validate=%q qiymat=%v\n", sf.Name, tag, sf.Tag.Get("validate"), v.Field(i).Interface())
	}
}

func main() {
	d := Device{ID: "T-1", Fuel: 40, Active: true, secret: "x"}
	inspect(d)
	inspect(&d)
	fmt.Println(roundTrip(d) == any(d))

	fmt.Println(setFuel(d, 10))
	fmt.Println(setFuel(&d, 10), d.Fuel)

	describe(d)

	// Metodni nomi bilan chaqirish.
	out := reflect.ValueOf(d).MethodByName("Label").Call(nil)
	fmt.Println(out[0].String())

	// Settable bo'lmagan qiymat: panic.
	func() {
		defer func() { fmt.Println("recover:", recover()) }()
		reflect.ValueOf(3.4).SetFloat(7.1)
	}()

	// Eksport qilinmagan maydonga yozish: panic.
	func() {
		defer func() { fmt.Println("recover:", recover()) }()
		reflect.ValueOf(&d).Elem().FieldByName("secret").SetString("y")
	}()

	// Noto'g'ri Kind: panic.
	func() {
		defer func() { fmt.Println("recover:", recover()) }()
		_ = reflect.ValueOf("gps").Int()
	}()

	// reflect.TypeFor (Go 1.22): qiymatsiz Type.
	fmt.Println(reflect.TypeFor[Device](), reflect.TypeFor[error]().Kind())

	// DeepEqual
	a := map[string][]int{"T-1": {1, 2}}
	b := map[string][]int{"T-1": {1, 2}}
	fmt.Println(reflect.DeepEqual(a, b), reflect.DeepEqual([]int(nil), []int{}))
}
```

Chiqish (Go 1.24.7):

```text
main.Device struct struct
*main.Device ptr ptr
true
pointer kerak, keldi main.Device
<nil> 10
ID json="id" validate="required" qiymat=T-1
Fuel json="fuel" validate="min=0" qiymat=10
Active json="active" validate="" qiymat=true
secret: eksport qilinmagan, CanInterface=false
device-T-1
recover: reflect: reflect.Value.SetFloat using unaddressable value
recover: reflect: reflect.Value.SetString using value obtained using unexported field
recover: reflect: call of reflect.Value.Int on string Value
main.Device interface
true false
```

Tahlil:

- `inspect(d)` va `inspect(&d)`: `main.Device struct struct` va `*main.Device ptr ptr`. Tip nomi farq qiladi, `Kind` esa `ptr`.
- `setFuel(d, 10)` xato qaytaradi (pointer kerak), `setFuel(&d, 10)` esa `Fuel`ni 10 qiladi. Bu uchinchi qonun amalda.
- `describe(d)` teglarni o'qiydi. `secret` uchun `CanInterface=false`, shuning uchun uning qiymatini chiqarmaymiz.
- `MethodByName("Label").Call(nil)` metodni nomi bilan chaqiradi va `[]reflect.Value` qaytaradi. Metod nomi satr: xato yozilsa zero `Value` olinadi va `Call` panic beradi.
- Uch `recover:` qatori yuqoridagi panic'lar.
- `reflect.TypeFor[error]().Kind()` `interface`.
- `DeepEqual` natijalari: bir xil map'lar `true`, nil va bo'sh slice `false`.

## Qachon qo'llamaslik kerak

- Tiplarni oldindan bilsangiz, generics (24-26-darslar) yoki interface (21-dars) ishlating: kompilyator tekshiradi, narx past.
- Faqat bir nechta aniq tipni qo'llab-quvvatlash kerak bo'lsa, type switch (23-dars) reflection'dan oddiy va tezroq.
- Hot path'da `FieldByName`/`MethodByName` har chaqiruvda ishlatmang: yuqoridagi o'lchovda nom bo'yicha qidirish 52-63 ns/op, indeks bo'yicha 6-8 ns/op. Tuzilmani bir marta o'qib keshlang.
- Eksport qilinmagan maydonlarga reflection orqali tegmang: o'qish ham, yozish ham chegara bilan to'siladi. Agar tegishingiz kerak bo'lsa, dizayn xato.
- Reflection kodini kutubxona chegarasida ushlang: ichkarida konkret tiplar, tashqarida `any` ko'rinishini kamaytiring.
- Reflection xatolarini panic bilan boshqarish o'rniga kirishni oldindan tekshiring (misoldagi `Validate` yechimi).

## Stack'da: Node.js/TypeScript bilan farq

- JS'da `Object.keys(obj)`, `obj[name]`, `typeof` reflection'ning kundalik shakli: ular arzon va xavfsiz tuyuladi, chunki dinamik tip tizimi doim ochiq. Go'da bu alohida paket va aniq qoidalar bilan.
- TypeScript'da dekoratorlar va `reflect-metadata` teg o'rnini bosadi. Go teglari esa faqat satr va tip tizimi ularni tekshirmaydi.
- JS'da `obj.field = x` har doim ishlaydi (frozen bo'lmasa). Go'da qiymat nusxa bo'lsa, o'zgartirish panic: pointer va `Elem()` kerak.
- JS'da `JSON.parse` `any`/`unknown` qaytaradi; Go'da `encoding/json` reflection yordamida maydonni to'ldiradi. Shu sababli JSON uchun struct maydonlari eksport qilinadi (bosh harf bilan).
- TypeScript tiplari run-time'da yo'q (type erasure); Go'da `reflect.TypeOf` run-time tipni beradi.

## Xulosa

- Uch qonun: interface -> reflection obyekt (`TypeOf`/`ValueOf`), obyekt -> interface (`Interface()`), o'zgartirish uchun settable (`CanSet`, pointer va `Elem()`).
- Reflection xatolari asosan panic: addressable bo'lmagan, eksport qilinmagan maydon va noto'g'ri `Kind`. Kirishni oldindan tekshiring.
- Narx: o'lchovda indeks bo'yicha murojaat nom bo'yicha qidirishdan taxminiy bir daraja arzon (6-8 ns/op va 52-63 ns/op), to'g'ridan-to'g'ri yozish 2.6-4.0 ns/op; strukturani keshlang.
- `TypeFor` (Go 1.22), `TypeAssert` (Go 1.25), `Type.Fields`/`Methods`/`Ins`/`Outs` va `Value.Fields`/`Methods` iteratorlari (Go 1.26) zamonaviy API.
- Kerak bo'lmasa reflection ishlatmang: generics, interface va type switch tekshiriladi, reflection esa yo'q.
