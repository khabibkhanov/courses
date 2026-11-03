---
n: 59
slug: finalizer-cleanup-weak
title: "Finalizer, cleanup va weak pointer"
summary: "Go 1.24 dagi runtime.AddCleanup va weak.Pointer eski runtime.SetFinalizer'dan nimasi bilan yaxshi, obyekt resurrection nima, nega cleanup ishlamay qolishi mumkin va resursni qanday qilib deterministik Close va zaxira cleanup bilan boshqarish kerak."
duration: 40
sources:
  - id: blog-cleanups-weak
    note: "Go Blog, 2025-yil 6-mart: AddCleanup va weak.Pointer Go 1.24 da, finalizer muammolari (resurrection, kamida ikki GC sikli), cleanup'ning obyektni argument qilib olmasligi, weak pointer bilan keshlar, Caveats bo'limi"
  - id: pkg-weak
    note: "weak.Pointer hujjati: Make va Value, qiymat tashlangach Value nil qaytarishi mumkin, weak pointer'larning taqqoslanishi, asosiy qo'llanish joylari (kesh, canonicalization)"
  - id: gc-guide
    note: "Finalizers, cleanups, and weak pointers bo'limi: umumiy maslahatlar (testlar yozish, paket ichida yashirish, resursni deterministik Close bilan bo'shatish, cleanup'ni finalizer'dan afzal ko'rish), tez uchraydigan xatolar, obyekt o'limini testlash"
  - id: pkg-runtime
    note: "runtime.AddCleanup, SetFinalizer va KeepAlive hujjatlari: AddCleanup ptr va arg teng bo'lsa panic qiladi, tartib kafolatlanmaydi, tiny obyektlar batching, KeepAlive"
quiz:
  - q: "Darsdagi tajriba: 100 ta 1 MiB lik obyekt, GC avtomatik o'chirilgan, `runtime.GC()` bir marta chaqirildi. Finalizer'li variantda heap +100 MiB qoldi, cleanup'li variantda +0 MiB. Sabab?"
    options:
      - "Finalizer'lar GC'ni sekinlashtiradi, shuning uchun heap hisobi kechikadi"
      - "Cleanup'li obyektlar heap'da emas, stack'da"
      - "Finalizer obyektni qayta tiriltiradi (unga ko'rsatkich beriladi), shuning uchun xotira keyingi GC siklida qaytadi; cleanup obyektning o'zini olmaydi, xotira darhol qaytadi"
      - "runtime.GC() faqat cleanup'larni hisobga oladi"
    answer: 2
    explain: "Blog: finalizer chaqirilishi uchun GC obyektni tirik qoldiradi (resurrection), shuning uchun kamida ikki to'liq GC sikli kerak. Cleanup argument sifatida boshqa qiymat oladi, obyektning o'zi esa darhol qaytariladi. Tajribada ikkinchi runtime.GC() dan keyin finalizer variantida ham heap +0 MiB bo'ldi."
  - q: "Quyidagilardan qaysi biri cleanup hech qachon ishlamasligiga olib keladi?\n`f := &File{}; runtime.AddCleanup(f, func(fd int) { syscall.Close(f.fd) }, f.fd)`"
    options:
      - "Cleanup funksiyasi `f` ni ushlaydi (closure ichida `f.fd`), shuning uchun `f` cleanup orqali erishiladigan bo'ladi va hech qachon yig'ilmaydi"
      - "`f.fd` int bo'lgani uchun"
      - "AddCleanup'ga uchinchi argument berish taqiqlangan"
      - "Hech biri: cleanup har doim ishlaydi"
    answer: 0
    explain: "gc-guide va blog: cleanup biriktirilgan obyekt cleanup funksiyasidan (ushlangan o'zgaruvchi) ham, uning argumentidan ham erishib bo'lmaydigan bo'lishi shart. Darsdagi tajribada shunday variant 0 marta ishladi, to'g'ri variant (argument faqat `f.fd` qiymati) 1 marta ishladi."
  - q: "`runtime.AddCleanup(c, func(p *Conn) { ... }, c)` Go 1.24.7 da nima beradi?"
    options:
      - "Kompilyatsiya xatosi"
      - "Cleanup ishlaydi, lekin `c` bir sikl kechikib yig'iladi"
      - "Hech narsa: argument sifatida obyektning o'zini berish ruxsat etiladi"
      - "Runtime panic: `ptr is equal to arg, cleanup will never run`"
    answer: 3
    explain: "pkg runtime: arg ptr ga teng bo'lsa AddCleanup panic qiladi (oddiy xatolardan himoya). Darsdagi tajribada aynan shu xabar chiqdi. Bu faqat eng sodda holat: ptr arg ichidan boshqa yo'l bilan erishilsa, panic bo'lmaydi, cleanup jimgina ishlamaydi."
  - q: "Funksiya `fd := h.fd` o'qigandan keyin `h` ni ishlatmaydi, so'ng fd bilan uzoq ish qiladi. `h` ga cleanup (fd ni yopadigan) biriktirilgan. Nima xavfi bor va yechim?"
    options:
      - "Xavf yo'q: cleanup faqat funksiya qaytgandan keyin ishlaydi"
      - "`h` oxirgi marta ishlatilgan joydan keyin unreachable bo'lishi mumkin, cleanup fd ishlatilayotganda yopadi. `runtime.KeepAlive(h)` ni fd ishlatilishi tugaydigan nuqtaga qo'yish kerak"
      - "Yechim: GOGC=off"
      - "Yechim: cleanup'ni o'chirish, uning o'rniga finalizer"
    answer: 1
    explain: "pkg runtime: funksiya argumenti yoki receiver'i uni oxirgi marta eslatgan joyda unreachable bo'lishi mumkin. Darsdagi tajribada KeepAlive'siz variantda fd 'ishlatish paytida' yopilgan chiqdi (true), KeepAlive bilan false. Finalizer ham xuddi shu xavfga ega."
  - q: "`type TinyFile struct{ fd int }` obyektiga cleanup biriktirildi, obyekt tashlandi, 5 marta GC ishladi, cleanup ishlamadi. Nega bu normal bo'lishi mumkin?"
    options:
      - "Cleanup'lar faqat dastur tugaganda ishlaydi"
      - "tiny allocator kichik (16 bayt atrofida va undan kam) pointer'siz obyektlarni bitta slotga birlashtiradi; agar blokdagi boshqa obyekt tirik bo'lsa, blok yig'ilmaydi va cleanup ishlamaydi"
      - "Cleanup faqat 64 baytdan katta obyektlar uchun ishlaydi"
      - "int maydonlari uchun cleanup taqiqlangan"
    answer: 1
    explain: "pkg runtime: xotirani tejash uchun runtime kichik, pointer'siz obyektlarni bitta ajratish slotiga birlashtirishi mumkin va bunday obyektning cleanup'i hech ishlamasligi mumkin. Tajribada `File` (64 baytlik bufer bilan) cleanup'i ishladi, 8 baytlik `TinyFile` ishlamadi."
  - q: "Paket tashqariga `*Conn` beradi, ichida cleanup bor. Nega faqat cleanup'ga tayanib `Close` ni yozmaslik kerak?"
    options:
      - "Cleanup kodi qimmat"
      - "Cleanup faqat Linux'da ishlaydi"
      - "GC qachon ishlashi servis egasi nazoratida emas (GOGC, limit), cleanup umuman ishlamasligi ham mumkin; file descriptor kabi tizim limitlari esa GC'ni bilmaydi. Resursni deterministik Close bilan bo'shatish, cleanup'ni dasturchi xatosi uchun zaxira qilish kerak"
      - "Cleanup'dan keyin obyekt ishlay olmaydi"
    answer: 2
    explain: "gc-guide: non-memory resurslar (fd) tizim limitlariga bog'liq, GC chastotasini esa paket muallifi boshqarmaydi; shu sababli deterministik bo'shatish API'si (Close) kerak, cleanup/finalizer esa os.File kabi zaxira. pkg runtime: cleanup dastur tugashidan oldin chaqirilishi ham kafolatlanmaydi."
task:
  title: "Close va zaxira cleanup bilan Conn"
  prompt: |
    `Conn` tashqi resursni (`resource`) o'raydi. Foydalanuvchi `Close` chaqirishi kerak; agar unutsa, GC obyektni yig'ganda zaxira cleanup resursni yopishi kerak. Har resurs aniq bir marta yopilishi shart.

    Boshlang'ich kod ikkita xatoga ega: cleanup closure ichida `c` ni ushlaydi (shuning uchun hech qachon ishlamaydi) va `Close` zaxira cleanup'ni to'xtatmaydi (cleanup ishlasa, resurs ikki marta yopiladi). Uni tuzating: cleanup `c` ni ushlamasin (argument sifatida faqat resursni oling), `Open` qaytargan `runtime.Cleanup` ni saqlang va `Close` ichida `Stop` chaqiring. Imzolarni o'zgartirmang.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "runtime"
        "sync/atomic"
        "time"
    )

    // resource - tashqi resursni (masalan, datchik portini) modellashtiradi.
    type resource struct {
        closes atomic.Int32
    }

    func (r *resource) close() { r.closes.Add(1) }

    // Conn resursni o'rab turadi. Close chaqirilishi shart, cleanup esa
    // dasturchi xatosi uchun zaxira.
    type Conn struct {
        r *resource
    }

    func Open(r *resource) *Conn {
        c := &Conn{r: r}
        runtime.AddCleanup(c, func(int) { c.r.close() }, 0)
        return c
    }

    func (c *Conn) Close() {
        c.r.close()
    }

    //go:noinline
    func openAndForget(r *resource) {
        _ = Open(r) // Close chaqirilmaydi
    }

    func waitClosed(r *resource) {
        for i := 0; i < 50 && r.closes.Load() == 0; i++ {
            runtime.GC()
            time.Sleep(10 * time.Millisecond)
        }
    }

    func main() {
        a, b := &resource{}, &resource{}

        Open(a).Close()
        for i := 0; i < 5; i++ {
            runtime.GC()
            time.Sleep(10 * time.Millisecond)
        }
        fmt.Println("Close chaqirilgan resurs aniq 1 marta yopildi:", a.closes.Load() == 1)

        openAndForget(b)
        waitClosed(b)
        fmt.Println("unutilgan resursni cleanup yopdi:", b.closes.Load() == 1)
    }
  solution: |
    package main

    import (
        "fmt"
        "runtime"
        "sync/atomic"
        "time"
    )

    // resource - tashqi resursni (masalan, datchik portini) modellashtiradi.
    type resource struct {
        closes atomic.Int32
    }

    func (r *resource) close() { r.closes.Add(1) }

    // Conn resursni o'rab turadi. Close chaqirilishi shart, cleanup esa
    // dasturchi xatosi uchun zaxira.
    type Conn struct {
        r       *resource
        cleanup runtime.Cleanup
    }

    func Open(r *resource) *Conn {
        c := &Conn{r: r}
        // Cleanup c ga ishora qilmaydi: argument sifatida faqat resurs beriladi.
        c.cleanup = runtime.AddCleanup(c, func(r *resource) { r.close() }, r)
        return c
    }

    func (c *Conn) Close() {
        c.cleanup.Stop() // zaxira cleanup endi kerak emas
        c.r.close()
    }

    //go:noinline
    func openAndForget(r *resource) {
        _ = Open(r) // Close chaqirilmaydi
    }

    func waitClosed(r *resource) {
        for i := 0; i < 50 && r.closes.Load() == 0; i++ {
            runtime.GC()
            time.Sleep(10 * time.Millisecond)
        }
    }

    func main() {
        a, b := &resource{}, &resource{}

        Open(a).Close()
        for i := 0; i < 5; i++ {
            runtime.GC()
            time.Sleep(10 * time.Millisecond)
        }
        fmt.Println("Close chaqirilgan resurs aniq 1 marta yopildi:", a.closes.Load() == 1)

        openAndForget(b)
        waitClosed(b)
        fmt.Println("unutilgan resursni cleanup yopdi:", b.closes.Load() == 1)
    }
  solutionNotes: |
    - `runtime.AddCleanup(c, func(r *resource) { r.close() }, r)`: cleanup funksiyasi `c` ga murojaat qilmaydi, argument esa `c` ga ishora qilmaydigan resursning o'zi. Shunda `c` unreachable bo'lganda cleanup ishlay oladi.
    - `AddCleanup` qaytargan `Cleanup` qiymatining `Stop` metodi cleanup'ni bekor qiladi. `Close` shuni chaqirib, deterministik yopish va zaxira yopish ikki marta yopishga olib kelmasligini kafolatlaydi. `Stop` ni olib tashlasak, tekshiruv `aniq 1 marta` bo'yicha `false` beradi (biz buni sinab ko'rdik).
    - Testda obyekt `//go:noinline` yordamchi funksiyada yaratiladi va tashlanadi, shunda u rostdan ham unreachable bo'ladi. `waitClosed` GC ni bir necha marta majburlab cleanup'ni kutadi: cleanup'ning aniq vaqti kafolatlanmaydi, shuning uchun test tsiklda kutadi.
    - Kod `go run -race` bilan ham tekshirildi; hisoblagich `atomic.Int32`, chunki cleanup alohida goroutine'da ishlaydi.
    - Kutilgan chiqish: ikkala qator `true`.
  checklist:
    - "Cleanup closure'i `c` ni ushlamaydi, argument sifatida `*resource` beriladi"
    - "`Open` qaytargan `runtime.Cleanup` `Conn` ichida saqlanadi"
    - "`Close` zaxira cleanup'ni `Stop` bilan to'xtatadi, so'ng resursni yopadi"
    - "Close chaqirilgan resurs aniq 1 marta, unutilgani cleanup orqali 1 marta yopiladi"
    - "`go vet` ogohlantirishsiz o'tadi (va `-race` bilan toza)"
---

## Muammo

Garbage collector "cheksiz xotira" illyuziyasini beradi: obyekt ajratasiz, uni bo'shatmaysiz. Dastur nuqtai nazaridan obyektning o'limi kuzatib bo'lmaydigan hodisa. Lekin real servislarda bu illyuziya ikki joyda yetishmaydi. Birinchisi, xotira bo'lmagan resurslar: fayl deskriptorlari, mmap qilingan fayllar, C kutubxonasi ajratgan xotira. Ularni kimdir bo'shatishi kerak. Ikkinchisi, keshlar: kesh obyektga ishora qilib tursa, obyekt hech qachon o'lmaydi, ya'ni kesh xotirani ushlab qoladi.

Go bu ikki ehtiyoj uchun runtime darajasida uch vosita beradi: finalizer (`runtime.SetFinalizer`, eng eskisi), cleanup (`runtime.AddCleanup`, Go 1.24 dan) va weak pointer (`weak.Pointer`, Go 1.24 dan). Go blog'i (2025-yil 6-mart) cleanup va weak pointer'ni Go 1.24 da hamma uchun mavjud bo'lgan yangi pastki darajadagi vositalar deb tanishtirgan. Uchalasi ham obyektning o'limini kuzatish yoki unga ta'sir qilish usuli, shuning uchun uchalasi ham gc-guide'da "ehtiyotkorlik bilan" belgisi ostida.

Bu darsning amaliy maqsadi: resursni qanday qilib to'g'ri bo'shatish (deterministik `Close` asosiy, cleanup zaxira), cleanup nega jimgina ishlamay qolishi mumkin va weak pointer qachon kerak. Hamma kod Go 1.24.7 da (linux/amd64, 2 vCPU) ishga tushirilgan; GC vaqti bilan bog'liq natijalar tasodifiy emas, lekin runtime'ning muddatini kafolat deb o'qimang.

## Asosiy g'oya

### Finalizer: eski va xatoga moyil

Finalizer `runtime.SetFinalizer` bilan obyektga biriktiriladi. GC obyekt unreachable bo'lganini aniqlasa, finalizer'ni alohida goroutine'da chaqiradi. Muammo: finalizer obyektning o'zini argument sifatida oladi. Shu sababli GC obyektni qayta "tiriltirishi" kerak (resurrection): u endi finalizer uchun erishiladigan. Blog buning oqibatlarini aniq sanaydi: finalizer'li obyekt reference sikl ichida bo'lsa, hatto o'ziga o'zi ishora qilsa ham, hech qachon yig'ilmaydi; xotirani qaytarish kamida ikki to'liq GC siklini oladi, chunki birinchisi obyektning unreachable ekanini aniqlaydi, ikkinchisi finalizer'dan keyin ham unreachable ekanini; bitta obyektga faqat bitta finalizer biriktiriladi va faqat uning birinchi baytiga. Finalizer obyektni global o'zgaruvchiga yoki kanalga yozib, uni abadiy tirik ham qoldirishi mumkin.

### Cleanup: obyekt emas, boshqa qiymat

`runtime.AddCleanup(ptr, cleanup, arg)` uchta argument oladi: obyekt, cleanup funksiyasi va funksiyaga beriladigan argument. Eng muhim farq: cleanup obyektning o'zini olmaydi, `arg` ni oladi. Blog ikki foydani aytadi: obyekt reference siklda bo'lsa ham yig'ilishi mumkin, va uning xotirasi darhol qaytariladi (qayta tirilmaydi). Bundan tashqari, bir obyektga bir nechta mustaqil cleanup biriktirish mumkin va `AddCleanup` `Cleanup` qiymatini qaytaradi; uning `Stop` metodi cleanup'ni bekor qiladi (shuni topshiriqda ishlatamiz).

gc-guide aniq tavsiya beradi: Go 1.24 va undan keyin finalizer o'rniga cleanup tanlang, chunki u moslashuvchan, kamroq xatoli va samaraliroq. Finalizer faqat kamdan-kam hollarda, murakkab yo'q qilish tartibi kerak bo'lgan tuzilmalar uchun foydali: finalizer'larning bajarilish tartibi aniq (bog'liqlik bo'yicha), cleanup'larniki yo'q va ular bir-biri bilan bir vaqtda ishlashi mumkin.

### Weak pointer: erishilganlikka ta'sir qilmaydigan ko'rsatkich

`weak.Make(ptr)` yordamida `weak.Pointer[T]` yaratiladi. GC erishilganlikni hal qilayotganda weak pointer'ni hisobga olmaydi. `Value()` obyekt tirik bo'lsa oddiy ko'rsatkichni, aks holda `nil` qaytaradi. pkg-weak hujjati asosiy qo'llanishlarni sanaydi: keshlar, kanoniklashtirish jadvallari (standart kutubxonadagi `unique` shunday) va alohida qiymatlarning hayotini bog'lash. Weak pointer'lar taqqoslanadi: ikkalasi bir xil ko'rsatkichdan yasalgan bo'lsa teng, va bu obyekt yig'ilgandan keyin ham saqlanadi. Blog shu xususiyatni yaxshi qo'llanishga bog'laydi: kesh yozuvini `CompareAndDelete` bilan o'chirishda weak pointer o'zini "kalit" kabi tutadi.

## Chuqurroq: qoidalar va tuzoqlar

### Cleanup ishlamaydigan holatlar

gc-guide va blog bir xil qoidani aytadi: cleanup biriktirilgan obyekt cleanup funksiyasidan (ushlangan o'zgaruvchi orqali) ham, uning argumentidan ham erishib bo'lmaydigan bo'lishi shart; bo'lmasa obyekt abadiy tirik, cleanup esa hech ishlamaydi. Eng sodda holda (arg aynan ptr) `AddCleanup` panic qiladi, qolgan hollarda esa jimgina ishlamaydi. Bu eng xavfli tomoni: xato jimgina, faqat sizib chiqish (leak) ko'rinishida namoyon bo'ladi.

pkg runtime hujjatida yana bir nechta kafolatsizlik bor. Cleanup'ning chaqirilishi dastur tugashidan oldin kafolatlanmaydi. Nol hajmli obyektlar uchun cleanup kafolatlanmaydi. Paket darajasidagi o'zgaruvchi initsializatorlarida ajratilgan obyektlar linker tomonidan ajratilishi mumkin, ular uchun ham kafolat yo'q. Va tiny allocator ta'siri: runtime xotira tejash uchun kichik (16 bayt atrofida va undan kam), ko'rsatkichsiz obyektlarni bitta slotga birlashtirishi mumkin; shunda bunday obyektning cleanup'i, agar u doim tirik obyekt bilan bir blokda tursa, hech ishlamasligi mumkin (54-darsdagi tiny allocator).

### Finalizer va cleanup birga

Bitta obyektda ham cleanup, ham finalizer bo'lishi mumkin. pkg runtime: bunday holda cleanup faqat obyekt finalizer'dan o'tib, finalizer'siz holda yana unreachable bo'lgandan keyin ishlaydi. Ya'ni eski kodga cleanup qo'shsangiz, tozalash yanada kechikadi (kamida ikki sikl). Ikkalasini aralashtirish o'rniga eski finalizer'ni cleanup'ga o'tkazing: finalizer obyektni argument qilib oladi, cleanup uchun esa obyektdan resursni ajratib, faqat shuni `arg` qilib berish kerak bo'ladi. Bu odatda kichik refaktor: resurs (fd, ko'rsatkich) alohida maydonda turadi va cleanup unga tayanadi.

### KeepAlive

Cleanup yoki weak pointer obyekt unreachable bo'lishi bilan kuchga kirishi mumkin. pkg runtime: funksiya argumenti yoki receiver'i uni funksiya oxirgi marta eslatgan joyda unreachable bo'lishi mumkin. Agar shu paytda obyektning resursi (masalan, fd) hali ishlatilayotgan bo'lsa, cleanup resursni yopib qo'yadi. Yechim: obyekt tirik bo'lishi kerak bo'lgan oxirgi nuqtadan keyin `runtime.KeepAlive(obj)` chaqirish. Weak pointer uchun ham xuddi shunday: `Value` nil qaytarmasligi uchun obyektni KeepAlive bilan ushlash kerak.

### Testlar

gc-guide testlar haqida aniq maslahat beradi: bunday testlarni boshqa testlar bilan parallel yurgizmang; holatni `runtime.GC()` bilan boshlang; `runtime.GC()` weak pointer'larni nil qiladi va cleanup/finalizer'larni navbatga qo'yadi, lekin ularning bajarilishini kutmaydi. Eng ishonchli yo'l: testdan cleanup'ga kanal berib, tugaganda unga yozdirish, yoki kutilgan holat chiqquncha tsiklda kutish. Race rejimda ham sinang: cleanup alohida goroutine'da ishlaydi.

## Misol: o'lchovlar

### Finalizer va cleanup, qayta tiriltirish va tuzoqlar

Dastur beshta narsani tekshiradi: (1) finalizer va cleanup bilan 100 ta 1 MiB lik obyekt xotirasi qaysi GC siklidan keyin qaytadi (GC avtomatik o'chirilgan, `debug.SetGCPercent(-1)`, sikllar faqat `runtime.GC()` dan); (2) cleanup o'z obyektini ushlasa ishlamasligi; (3) 8 baytlik tiny obyekt cleanup'i; (4) `KeepAlive` bilan va usiz; (5) weak pointer.

```go
package main

import (
	"fmt"
	"runtime"
	"runtime/debug"
	"sync/atomic"
	"time"
	"weak"
)

// Blob - 1 MiB lik pointer'siz obyekt.
type Blob struct{ data [1 << 20]byte }

func heapMiB() uint64 {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)
	return m.HeapAlloc >> 20
}

// waitFor sharti bajarilguncha kutadi (GC ni majburlamaydi).
func waitFor(cond func() bool) bool {
	for i := 0; i < 200; i++ {
		if cond() {
			return true
		}
		time.Sleep(5 * time.Millisecond)
	}
	return cond()
}

// 1. Finalizer va cleanup: xotira necha GC siklidan keyin qaytadi.
func reclaim(useFinalizer bool) {
	var done atomic.Int32
	const n = 100
	base := heapMiB()
	for i := 0; i < n; i++ {
		b := new(Blob)
		if useFinalizer {
			runtime.SetFinalizer(b, func(*Blob) { done.Add(1) })
		} else {
			runtime.AddCleanup(b, func(int) { done.Add(1) }, 0)
		}
	}
	name := "cleanup  "
	if useFinalizer {
		name = "finalizer"
	}
	runtime.GC()
	waitFor(func() bool { return done.Load() == n })
	fmt.Printf("%s: 1-GC dan keyin chaqirilgan=%d, heap +%d MiB\n", name, done.Load(), int64(heapMiB())-int64(base))
	runtime.GC()
	fmt.Printf("%s: 2-GC dan keyin heap +%d MiB\n", name, int64(heapMiB())-int64(base))
}

// 2. Xato: cleanup obyektning o'ziga ishora qiladi.
type File struct {
	fd  int
	buf [64]byte
}

// TinyFile 16 baytdan kichik va pointer'siz: tiny allocator blokiga tushadi.
type TinyFile struct{ fd int }

//go:noinline
func leakyCleanup(ran *atomic.Int32) {
	f := &File{fd: 3}
	runtime.AddCleanup(f, func(int) { _ = f.fd; ran.Add(1) }, 0) // f ni ushlaydi
}

//go:noinline
func tinyCleanup(ran *atomic.Int32) {
	f := &TinyFile{fd: 3}
	runtime.AddCleanup(f, func(fd int) { _ = fd; ran.Add(1) }, f.fd)
}

//go:noinline
func goodCleanup(ran *atomic.Int32) {
	f := &File{fd: 3}
	runtime.AddCleanup(f, func(fd int) { _ = fd; ran.Add(1) }, f.fd)
}

// 3. KeepAlive: obyekt oxirgi marta ishlatilgandan keyin cleanup ishga tushishi mumkin.
type Handle struct {
	fd  int
	buf [64]byte
}

//go:noinline
func newHandle(closed *atomic.Bool) *Handle {
	h := &Handle{fd: 7}
	runtime.AddCleanup(h, func(int) { closed.Store(true) }, h.fd)
	return h
}

//go:noinline
func useWithoutKeepAlive(h *Handle, closed *atomic.Bool) bool {
	fd := h.fd // h bu yerdan keyin ishlatilmaydi
	runtime.GC()
	time.Sleep(50 * time.Millisecond)
	_ = fd
	return closed.Load() // fd ishlatilishi kerak bo'lgan paytda yopilganmi?
}

//go:noinline
func useWithKeepAlive(h *Handle, closed *atomic.Bool) bool {
	fd := h.fd
	runtime.GC()
	time.Sleep(50 * time.Millisecond)
	_ = fd
	inUse := closed.Load()
	runtime.KeepAlive(h) // h shu nuqtagacha tirik
	return inUse
}

func main() {
	debug.SetGCPercent(-1) // GC faqat runtime.GC() bilan ishlaydi
	reclaim(true)
	reclaim(false)

	var ran1, ran2, ran3 atomic.Int32
	leakyCleanup(&ran1)
	goodCleanup(&ran2)
	tinyCleanup(&ran3)
	for i := 0; i < 5; i++ {
		runtime.GC()
		time.Sleep(10 * time.Millisecond)
	}
	fmt.Println("xato cleanup ishladi:", ran1.Load(), "| to'g'ri cleanup ishladi:", ran2.Load(), "| tiny obyekt cleanup ishladi:", ran3.Load())

	var c1, c2 atomic.Bool
	fmt.Println("KeepAlive yo'q: ishlatish paytida yopilgan =", useWithoutKeepAlive(newHandle(&c1), &c1))
	fmt.Println("KeepAlive bor : ishlatish paytida yopilgan =", useWithKeepAlive(newHandle(&c2), &c2))

	// 4. weak.Pointer: kesh qiymatni ushlab turmaydi.
	v := new(Blob)
	wp := weak.Make(v)
	fmt.Println("weak, qiymat tirik:", wp.Value() != nil)
	runtime.KeepAlive(v)
	v = nil
	runtime.GC()
	fmt.Println("weak, qiymat tashlanganidan keyin:", wp.Value() == nil)
}
```

Natija (Go 1.24.7, linux/amd64, 2 vCPU; uch ishga tushirishda bir xil):

```text
finalizer: 1-GC dan keyin chaqirilgan=100, heap +100 MiB
finalizer: 2-GC dan keyin heap +0 MiB
cleanup  : 1-GC dan keyin chaqirilgan=100, heap +0 MiB
cleanup  : 2-GC dan keyin heap +0 MiB
xato cleanup ishladi: 0 | to'g'ri cleanup ishladi: 1 | tiny obyekt cleanup ishladi: 0
KeepAlive yo'q: ishlatish paytida yopilgan = true
KeepAlive bor : ishlatish paytida yopilgan = false
weak, qiymat tirik: true
weak, qiymat tashlanganidan keyin: true
```

Birinchi ikki qator finalizer'ning narxini ko'rsatadi. Birinchi `runtime.GC()` dan keyin barcha 100 finalizer chaqirildi, lekin 100 MiB hali heap'da: obyektlar qayta tiriltirilgan. Faqat ikkinchi GC xotirani qaytardi. Cleanup variantida esa birinchi GC dan keyin heap +0 MiB. Bu blog'dagi "kamida ikki GC sikli" gapining o'lchovi. (Bitta nuance: `Blob` 1 MiB lik pointer'siz massiv; kichik obyektlarda farq xotira jihatidan sezilmasligi mumkin, lekin tartib o'sha.)

Beshinchi qator: obyektni ushlab turgan cleanup 0 marta ishladi, to'g'ri variant 1 marta. Ikkala variantda `File` obyekti bir xil; farq faqat cleanup funksiyasi `f` ni ushlashi. Tiny obyekt (`TinyFile{fd int}`, 8 bayt) cleanup'i 5 ta GC dan keyin ham ishlamadi: pkg runtime hujjati aynan shunday holatni ogohlantiradi. Biz buni boshqa tiny obyektlar bilan blokni bo'lishish sababli deb tushuntiramiz, lekin runtime ichida alohida tasdiqlamadik; o'lchov faqat cleanup ishlamaganini ko'rsatadi.

`KeepAlive` qatorlari tuzoqni ko'rsatadi: `useWithoutKeepAlive` `h.fd` ni o'qiydi, keyin `h` ga murojaat qilmaydi. GC va 50 ms kutishdan keyin cleanup allaqachon ishlagan (`closed = true`), vaholanki funksiya hali `fd` bilan ishlashi kerak edi. `useWithKeepAlive` oxirida `runtime.KeepAlive(h)` chaqiradi va cleanup ishlamaydi. E'tibor bering: ikkala funksiyaning farqi KeepAlive'ning o'zi emas, balki `h` funksiyaning keyingi qismida eslatilishi: liveness oqimga bog'liq, shuning uchun ikkalasi ham alohida funksiya sifatida yozilgan (bitta funksiyada `if keep { KeepAlive }` bo'lsa, `h` ikkala holatda ham tirik hisoblangan edi: dastlabki urinishimiz shunday natija berdi).

`AddCleanup(c, f, c)` shaklining panikasi (alohida kichik dastur, Go 1.24.7):

```text
panic: runtime.AddCleanup: ptr is equal to arg, cleanup will never run
```

### Close va zaxira cleanup naqshi

Topshiriq shu naqshni mashq qiladi: `Open` `Conn` yaratadi va uning cleanup'ini saqlaydi, `Close` avval cleanup'ni `Stop` qiladi, keyin resursni yopadi, unutilgan `Conn` uchun esa GC ishlaganda cleanup resursni yopadi. gc-guide shu yondashuvni tavsiya qiladi: non-memory resurslarni imkon qadar deterministik bo'shating (`Close`), cleanup va finalizer'larni dasturchi xatosi uchun zaxira sifatida ishlating (`os.File` kabi: yo resursni baribir yopish, yo xatoni foydalanuvchiga xabar qilish). Sabab: GC chastotasini paket muallifi nazorat qilmaydi (GOGC, limit, 56-dars), tizim limitlari (fd) esa GC'ga ko'rinmaydi.

## Qachon qo'llamaslik kerak

Oddiy ilova kodida bu vositalarni to'g'ridan-to'g'ri ishlatmang. gc-guide: kodning katta qismi ulardan bilvosita foyda ko'radi (standart kutubxona orqali), to'g'ridan-to'g'ri emas. Ularni paket ichida yashiring va tashqi API'ga chiqarmang: foydalanuvchi `SetFinalizer`'ni qayta chaqirib sizning finalizer'ingizni almashtirib yubormasligi kerak. Paket chegarasida qaytariladigan obyektga finalizer qo'ymang.

Cleanup'ni resursni bo'shatishning yagona usuli qilmang: u ishlashi kafolatlanmagan, vaqti noma'lum. Faylga, ulanishga, blokirovkaga `Close` / `Unlock` kerak.

Cleanup ichida uzoq ishlarni bajarmang: cleanup'lar bir-biri bilan bir vaqtda ishlashi mumkin va uzoq ishlayotgan cleanup boshqalarini to'sishi mumkin; uzoq ish uchun alohida goroutine yarating.

Weak pointer'ni "hamma narsa uchun kesh" sifatida ishlatmang: `Value()` kutilmagan paytda nil qaytarishi mumkin, har chaqiruvni nil tekshiruvi bilan o'rang va zaxira yo'lingiz (qayta yaratish) bo'lsin. Kalit weak bo'lgan map'da qiymat kalit obyektiga ishora qilsa, obyekt tirik qoladi (blog).

Finalizer'lar zanjirini (bog'langan ro'yxat) qurmang: zanjirni tozalash kamida zanjir uzunligicha GC sikli oladi (gc-guide).

## Stack'da: Node.js bilan farq

JavaScript'da `FinalizationRegistry` va `WeakRef` bor; ular Go'dagi cleanup va weak pointer'ga o'xshash vazifa bajaradi (bu taqqos muallifning umumiy bilimiga tayanadi, dars manbalarida yo'q). Go servisida qoida: deterministik `Close`, `defer` va kontekst bekor qilish asosiy; cleanup faqat xato holati uchun.

Servis kodida bu naqsh `Conn`, `File`, mmap qilingan fayllar va C bilan integratsiya (cgo, 69-dars) uchun uchraydi. Kesh uchun avval mavjud yechimlarni ko'ring (`unique` paketi, LRU keshlar, TTL), weak pointer kesh faqat qiymatning hayoti boshqa joyda boshqarilganda va kesh uni uzaytirmasligi kerak bo'lsa mantiqiy.

## Xulosa

- Finalizer obyektni qayta tiriltiradi: xotira kamida ikki GC siklidan keyin qaytadi (tajribada +100 MiB birinchi GC dan keyin qoldi). Cleanup obyektning o'zini olmaydi, xotira darhol qaytadi. Go 1.24 dan cleanup tanlang.
- Cleanup biriktirilgan obyekt cleanup funksiyasidan va argumentidan erishib bo'lmaydigan bo'lishi shart, aks holda cleanup jimgina ishlamaydi. Eng sodda holda (arg == ptr) `AddCleanup` panic qiladi.
- Cleanup chaqirilishi, vaqti va tartibi kafolatlanmaydi; kichik pointer'siz obyektlarda umuman ishlamasligi mumkin. Resursni deterministik `Close` bilan bo'shating, cleanup'ni zaxira qiling va `Close` ichida `Stop` chaqiring.
- Obyekt oxirgi eslatilgan joyda unreachable bo'lishi mumkin: resurs ishlatilayotganda cleanup yopib qo'ymasligi uchun `runtime.KeepAlive` kerak.
- `weak.Pointer` erishilganlikka ta'sir qilmaydi, `Value()` har doim nil tekshiruvini talab qiladi. Bu vositalarni paket ichida yashiring va testlarni `runtime.GC()` hamda kutish bilan, `-race` ostida yozing.
