---
n: 35
slug: resurslar-close
title: "Resurslarni boshqarish: Close, defer, leak va os.Root"
summary: "Close va defer tartibi, tsikldagi defer'ning narxi, yozuvchi Close xatosini yo'qotmaslik, HTTP Body va ikki marta Close, hamda Go 1.24 dagi os.Root bilan ishonchsiz fayl nomlaridan path traversal'ga qarshi himoya."
duration: 40
sources:
  - id: blog-osroot
    note: "Path traversal, Path sanitization, Introducing os.Root, Caveats and considerations (Unix, Windows, GOOS=js, performance) va 'Who should use os.Root?' bo'limlari"
  - id: 100go
    note: "#35 (Using defer inside a loop), #54 (Not handling defer errors), #79 (Not closing transient resources: HTTP body, sql.Rows, os.File)"
  - id: go125
    note: "Minor changes to the library, os bo'limi: Root'ga qo'shilgan metodlar ro'yxati"
  - id: pkg-os
    note: "File.Sync: faylning joriy tarkibini barqaror xotiraga topshirish"
  - id: pkg-bufio
    note: "Writer: xato yuz bersa keyingi yozuvlar va Flush shu xatoni qaytaradi; Flush chaqirish shart"
  - id: pkg-io
    note: "Closer: birinchi chaqiruvdan keyin Close xulqi aniqlanmagan"
  - id: pkg-net-http
    note: "Response.Body: ulanishni qayta ishlatish va Body'ni yopish; Client.Do: CheckRedirect xatosida Response va xato birga qaytishi"
  - id: pkg-database-sql
    note: "Rows.Close idempotent, Next false qaytarsa Rows avtomatik yopiladi; Conn pool'ga Close bilan qaytariladi"
  - id: go124
    note: "os.Root (Go 1.24)."
quiz:
  - q: "1000 iteratsiyali tsiklda har safar `r := pool.Open(); defer r.Close()` yozilgan (bitta funksiya ichida). Resurslar qachon yopiladi?"
    options:
      - "Funksiya qaytganda hammasi birdan; shu vaqtgacha bir vaqtda 1000 ta ochiq turadi"
      - "Har iteratsiya oxirida, chunki defer blok bilan bog'liq"
      - "Hech qachon, defer tsikl ichida ishlamaydi"
      - "Garbage collector tomonidan, iteratsiya tugaganda"
    answer: 0
    explain: "defer funksiya qaytganda ishlaydi, blok oxirida emas (7-dars). Darsdagi misolda bir vaqtdagi maksimum ochiq resurs 1000 chiqdi; har iteratsiyani alohida funksiyaga chiqarganda 1. Fayl deskriptorlari kabi cheklangan resurslar uchun bu 'too many open files' xatosiga olib keladi."
  - q: "Fayl yozadigan funksiya `defer f.Close()` bilan yopadi va Close natijasini tashlab yuboradi. Eng xavfli oqibat qaysi?"
    options:
      - "Fayl hech qachon yopilmaydi"
      - "Kompilyator ogohlantiradi"
      - "Yozuv Close'da yuvilganda xato bo'lsa (masalan disk to'lishi), ma'lumot yo'qolgani haqida hech kim bilmaydi va funksiya muvaffaqiyat qaytaradi"
      - "Close ikki marta chaqiriladi"
    answer: 2
    explain: "Yozuvchilarda Close xatosi yozuv muvaffaqiyatsizligini bildirishi mumkin. Darsdagi `saveIgnoring` nil qaytardi, `errors.Join` bilan Close xatosini yig'adigan `save` esa xatoni ko'rsatdi. 100 Go Mistakes #54 ham defer'dagi xatoni qayta ishlash yoki aniq `_` bilan tashlashni tavsiya qiladi."
  - q: "`resp, err := http.Get(url); defer resp.Body.Close(); if err != nil { return err }`. Server ulanmasa nima bo'ladi?"
    options:
      - "Close xato qaytaradi, lekin dastur davom etadi"
      - "nil pointer dereference: xato bo'lsa resp nil, defer ifodasi resp.Body'ga murojaat qiladi. go vet: using resp before checking for errors"
      - "Hech narsa, http.Get har doim bo'sh Body qaytaradi"
      - "Kompilyatsiya xatosi"
    answer: 1
    explain: "Defer'ning ifodasi (resp.Body) defer bajarilgan paytda baholanadi (7-dars). Xato bo'lganda resp nil, shuning uchun panic. Darsda real chiqish: `runtime error: invalid memory address or nil pointer dereference` va vet ogohlantirishi. To'g'ri tartib: xatoni tekshir, keyin defer."
  - q: "Qaysi holatda `os.Root` aynan kerak?"
    options:
      - "CLI dastur foydalanuvchi buyruq satrida bergan chiqish yo'liga yozadi"
      - "Dastur o'z konfiguratsiya faylini ochadi"
      - "Test vaqtinchalik katalog yaratadi"
      - "Arxiv ochuvchi: fayl nomlari ishonchsiz manbadan keladi va fayllar chiqish katalogidan tashqariga yozilmasligi kerak"
    answer: 3
    explain: "Blogdagi qoida: katalog ichida fayl ochsangiz VA amal katalogdan tashqariga chiqmasligi kerak bo'lsa, os.Root ishlating. Arxiv ochuvchi bunga misol, foydalanuvchi o'zi tanlagan chiqish yo'li esa ishonchsiz emas va istalgan joyga ishora qilishi mumkin."
  - q: "`*os.File` ni ikki marta Close qilsangiz ikkinchi chaqiruv nima qaytaradi (Go 1.24.7, linux)?"
    options:
      - "Xato, `errors.Is(err, os.ErrClosed)` true"
      - "nil, chunki Close idempotent"
      - "panic"
      - "Fayl deskriptori boshqa faylga tegishli bo'lib qolishi sababli tasodifiy natija"
    answer: 0
    explain: "Darsdagi tajribada ikkinchi Close xato qaytardi va `errors.Is(err, os.ErrClosed)` true bo'ldi. Ikki marta Close'ning xavfsizligi tipga bog'liq; o'z tipingiz uchun hujjatda yozing."
  - q: "`os.Root` himoya qilmaydigan holat qaysi (blog bo'yicha)?"
    options:
      - "`..` komponentlari orqali chiqish"
      - "Oddiy foydalanuvchi yaratgan symlink orqali chiqish"
      - "Linux bind mount orqali o'tish (root huquqi talab qilinadigan konstruksiya)"
      - "Windows'da `NUL` va `COM1` kabi rezerv nomlar"
    answer: 2
    explain: "Blog: Root oddiy foydalanuvchilar yarata oladigan konstruksiyalardan (symlink) himoya qiladi, lekin mount nuqtalari orqali o'tishni cheklamaydi (bind mount root huquqini talab qiladi). `..`, symlink va Windows rezerv nomlari esa Root tomonidan bloklanadi."
task:
  title: "Arxivni ishonchsiz nomlar bilan xavfsiz ochish"
  prompt: |
    `Extract` map'dagi fayllarni chiqish katalogiga yozadi. Fayl nomlari arxivdan keladi, ya'ni ishonchsiz. Hozirgi variant `filepath.Join` + `os.Create` ishlatadi: `../evil.txt` nomi bilan fayl chiqish katalogidan tashqarida paydo bo'ladi. Bundan tashqari `Close` va `WriteString` xatolari tashlab yuboriladi, `Extract` esa xatoni hech qachon qaytarmaydi.

    Qayta yozing:
    - Katalog ichida ishlash uchun `os.OpenRoot` ishlating; `Root`ni `Extract` oxirida yoping.
    - Katalogdan chiqishga urinadigan nom yozilmasin va `Extract` natijasida xato sifatida qaytsin (nom xabarda ko'rinsin).
    - Har faylning `WriteString` va `Close` xatolari yo'qolmasin (`errors.Join`).
    - Fayllar tartibli yozilsin (kalitlar tartiblansin), `written` faqat muvaffaqiyatli yozilganlar soni.
    - `main`ni o'zgartirmang. Kutilgan chiqish: `yozilgan: 2`, `xato bor: true`, `evil.txt tashqarida paydo bo'ldi: false`.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "os"
        "path/filepath"
    )

    // Extract files xaritasidagi fayllarni dir ichiga yozadi.
    // Nomlar tashqi manbadan (arxiv) keladi, shuning uchun ishonchsiz.
    func Extract(dir string, files map[string]string) (written int, err error) {
        for name, content := range files {
            path := filepath.Join(dir, name)
            f, err := os.Create(path)
            if err != nil {
                fmt.Println("yozilmadi:", name)
                continue
            }
            f.WriteString(content)
            f.Close()
            written++
        }
        return written, nil
    }

    func main() {
        base, err := os.MkdirTemp("", "extract")
        if err != nil {
            panic(err)
        }
        defer os.RemoveAll(base)
        out := filepath.Join(base, "out")
        if err := os.Mkdir(out, 0o755); err != nil {
            panic(err)
        }

        files := map[string]string{
            "a.txt":       "gps",
            "b.txt":       "fuel",
            "../evil.txt": "tashqariga yozish",
        }
        n, err := Extract(out, files)
        _, statErr := os.Stat(filepath.Join(base, "evil.txt"))
        fmt.Println("yozilgan:", n)
        fmt.Println("xato bor:", err != nil)
        fmt.Println("evil.txt tashqarida paydo bo'ldi:", statErr == nil)
    }
  solution: |
    package main

    import (
        "errors"
        "fmt"
        "maps"
        "os"
        "path/filepath"
        "slices"
    )

    // Extract files xaritasidagi fayllarni dir ichiga yozadi.
    // Nomlar tashqi manbadan (arxiv) keladi, shuning uchun ishonchsiz.
    func Extract(dir string, files map[string]string) (written int, err error) {
        root, err := os.OpenRoot(dir)
        if err != nil {
            return 0, err
        }
        defer func() { err = errors.Join(err, root.Close()) }()

        for _, name := range slices.Sorted(maps.Keys(files)) {
            if werr := writeOne(root, name, files[name]); werr != nil {
                err = errors.Join(err, fmt.Errorf("extract %q: %w", name, werr))
                continue
            }
            written++
        }
        return written, err
    }

    // writeOne bitta faylni root ichiga yozadi va Close xatosini ham qaytaradi.
    func writeOne(root *os.Root, name, content string) (err error) {
        f, err := root.Create(name)
        if err != nil {
            return err
        }
        defer func() { err = errors.Join(err, f.Close()) }()
        _, err = f.WriteString(content)
        return err
    }

    func main() {
        base, err := os.MkdirTemp("", "extract")
        if err != nil {
            panic(err)
        }
        defer os.RemoveAll(base)
        out := filepath.Join(base, "out")
        if err := os.Mkdir(out, 0o755); err != nil {
            panic(err)
        }

        files := map[string]string{
            "a.txt":       "gps",
            "b.txt":       "fuel",
            "../evil.txt": "tashqariga yozish",
        }
        n, err := Extract(out, files)
        _, statErr := os.Stat(filepath.Join(base, "evil.txt"))
        fmt.Println("yozilgan:", n)
        fmt.Println("xato bor:", err != nil)
        fmt.Println("evil.txt tashqarida paydo bo'ldi:", statErr == nil)
    }
  solutionNotes: |
    - `os.OpenRoot(dir)` katalogni ochadi, `root.Create(name)` esa `..` yoki ichki katalogdan tashqariga olib chiqadigan symlink bo'lsa xato qaytaradi. Shu sababli `../evil.txt` yozilmaydi va xato yig'iladi.
    - `Root`ni ochgan joyda `defer` bilan yopamiz: `errors.Join(err, root.Close())` nomlangan natijaga yozadi, shuning uchun yopish xatosi ham yo'qolmaydi.
    - `writeOne` ichida ham xuddi shu naqsh: `WriteString` xatosi va `Close` xatosi birlashtiriladi. Yozuvchi fayl uchun Close xatosi ma'lumot yo'qolganini bildirishi mumkin.
    - Map iteratsiyasi tartibi tasodifiy (14-dars), shuning uchun `slices.Sorted(maps.Keys(files))` bilan tartib belgilanadi; natija har ishga tushishda bir xil.
    - `os.Root` `Mkdir`, `Create`, `Open`, `Stat` kabi amallarni beradi (Go 1.24). Ichki kataloglar kerak bo'lsa, Go 1.25 dan `MkdirAll` ham bor; bu darsda u lokal tekshirilmagan (sandbox'da Go 1.24).
  checklist:
    - "`os.OpenRoot` ishlatilgan va `Root` yopiladi"
    - "`../evil.txt` chiqish katalogidan tashqarida yaratilmaydi, xato `Extract` natijasida ko'rinadi"
    - "`WriteString` va `Close` xatolari `errors.Join` bilan saqlanadi"
    - "Kalitlar tartiblangan, `written` faqat muvaffaqiyatli yozuvlarni sanaydi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Resurs oqib ketishi sekin ishlaydigan nosozlik. Servis soatlab yaxshi ishlaydi, keyin `too many open files` xatosi paydo bo'ladi va hamma yangi so'rov yiqiladi. Sabab: bir yo'l (xato holati, `continue`, erta `return`) `Close`ni chetlab o'tgan. Go'da garbage collector xotirani bo'shatadi, lekin fayl deskriptori, tarmoq ulanishi, HTTP `Body` kabi tashqi resurslarni emas: ularni dastur o'zi yopishi kerak.

Ikkinchi og'riq: `Close` xatosini tashlab yuborish. Yozuvchi fayl yoki bufer yuvilayotgan paytda disk to'lsa, xato aynan `Close`da chiqadi, `defer f.Close()` esa natijani e'tiborsiz qoldiradi, ya'ni ma'lumot yo'qoldi, lekin funksiya muvaffaqiyat haqida xabar berdi.

Uchinchi og'riq xavfsizlik: ishonchsiz fayl nomi (arxiv ichidagi `../../etc/cron.d/x`, foydalanuvchi yuklagan nom, symlink) dasturni mo'ljallangan katalogdan tashqaridagi faylga yozishga undaydi. Node.js dunyosida bu "zip slip" nomi bilan tanish; Go 1.24 dan standart kutubxonada buning uchun `os.Root` bor.

Node.js bilan farq: u yerda `fs.promises.open` qaytargan `FileHandle` ham qo'lda yopilishi kerak, lekin ko'p kod `pipeline` kabi vositalarga tayanadi. Go'da yopish mas'uliyati ko'rinib turadi: `Close()` metodi va `defer` bilan.

## Asosiy g'oya

Qoida oddiy: resurs olingach, xatoni tekshiring, darhol `defer` bilan yopishni rejalashtiring. 100 Go Mistakes #79 uni shunday umumlashtiradi: `io.Closer`ni amalga oshiruvchi hamma struct oxir-oqibat yopilishi kerak. Kitob sarlavhada uch misol keltiradi: HTTP `Body`, `sql.Rows` va `os.File`.

Tartib muhim:

```go
f, err := os.Open(name)
if err != nil {
	return err
}
defer f.Close()
```

`defer`ni xato tekshiruvidan keyin qo'ying: xatoda resurs `nil` bo'lishi mumkin va defer ifodasi baholanganda panic chiqadi (quyida real misol). Defer'ning ichki qoidalari (argumentlarni baholash vaqti, LIFO) 7-darsda.

### Close xatosi: kim yozyapti?

Faqat o'qiladigan fayl uchun Close xatosi odatda amaliy ahamiyatga ega emas va uni e'tiborsiz qoldirish mumkin. Yozuvchi resurs uchun esa Close natijasi yozuvning bir qismi. 100 Go Mistakes #54: defer'dagi xatoni qayta ishlang yoki qaytaring, ataylab e'tiborsiz qoldirsangiz buni aniq `_` bilan yozing. Yozuvchi uchun standart shakl nomlangan natija va `errors.Join` (31-dars):

```go
func save(w io.WriteCloser, data []byte) (err error) {
	defer func() { err = errors.Join(err, w.Close()) }()
	_, err = w.Write(data)
	return err
}
```

`errors.Join(nil, nil)` `nil` qaytaradi, shuning uchun ikkala qadam muvaffaqiyatli bo'lsa, natija `nil`.

## Chuqurroq: tsikl, Body va os.Root

### Tsiklda defer

`defer` funksiya qaytganda ishlaydi, iteratsiya oxirida emas. 100 Go Mistakes #35 (Using defer inside a loop) shu tuzoqni sanaydi. Tsiklda 10 000 fayl ochsangiz va har birida `defer f.Close()` yozsangiz, hammasi funksiya tugaguncha ochiq turadi. Yechim: iteratsiya tanasini alohida funksiyaga chiqarish (yoki anonim funksiya) va `defer`ni o'sha funksiya ichiga qo'yish; yoki tsikl ichida `Close`ni qo'lda chaqirish (xato yo'llarini unutmaslik sharti bilan). Quyidagi misolda o'lchov: bir vaqtdagi ochiq resurslar 1000 ga qarshi 1.

### HTTP Body

`http.Get` xatosiz qaytganda `resp.Body` yopilishi shart; 100 Go Mistakes #79 buni resurs oqishining klassik joyi sifatida keltiradi. Ikkita nozik joy: (1) `err != nil` bo'lsa `resp` deyarli har doim `nil` (hujjatdagi yagona istisno pastda), shuning uchun `defer resp.Body.Close()` xatodan oldin yozilsa panic (go vet buni `using resp before checking for errors` bilan ushlaydi); (2) javob 2xx bo'lmaganda ham `Body` mavjud va yopilishi kerak, shuning uchun status tekshiruvi `defer`dan keyin turadi. Body'ni to'liq o'qimay yopish bilan bog'liq ulanishni qayta ishlatish masalasi 73-darsda.

Istisno: `http.Client` hujjatiga ko'ra `err` ham, `resp` ham nil bo'lmagan holat faqat `CheckRedirect` xato qaytarganda bo'ladi va u holda `resp.Body` allaqachon yopilgan, ya'ni qo'shimcha `Close` kerak emas. `Response.Body` hujjati ulanishni qayta ishlatish haqida shuni aytadi: Body oxirigacha o'qilmay yopilsa, standart `Transport` HTTP/1.x "keep-alive" ulanishini qayta ishlatmasligi mumkin. `Close` Body'ni o'zi o'qib tugatmaydi: o'qilmagan Body yopilsa, HTTP/1.x ulanishi qayta ishlatilmaydi. Go 1.24.7 da `httptest` serveri bilan o'lchadik (10, 1000 va 100000 baytlik javob, bitta `Transport`, 5 ketma-ket `Get`): Body `io.Copy(io.Discard, resp.Body)` bilan oxirigacha o'qilganda hammasi 1 ta ulanishda o'tdi, o'qilmasdan yopilganda 5 ta ulanish ochildi. Shuning uchun javob tanasi kerak bo'lmasa ham, ulanishni qayta ishlatish kerak bo'lgan joyda avval Body'ni o'qib tugatib, keyin yoping.

### Deskriptor chegarasi: oqish qanday ko'rinadi

Muammo bo'limidagi `too many open files` operatsion tizim chegarasi (Linux'da jarayon uchun `RLIMIT_NOFILE`, shell'da `ulimit -n`). Production'da u odatda katta (bu sandbox'da 20000), shuning uchun oqish soatlab sezilmaydi. Mexanizmni tez ko'rish uchun chegarani vaqtincha pasaytirish mumkin. Quyidagi dastur 200 ta kichik fayl yaratadi va ularni ikki usulda ochadi: tsikl ichida `defer f.Close()` bilan va har fayl uchun alohida funksiyada.

```go
package main

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"syscall"
)

func readHeader(path string) error {
	f, err := os.Open(path)
	if err != nil {
		return err
	}
	defer f.Close()
	var b [4]byte
	_, err = f.Read(b[:])
	return err
}

// readAll tsiklda defer ishlatadi: fayllar funksiya tugaguncha ochiq turadi.
func readAllDeferInLoop(paths []string) (int, error) {
	n := 0
	for _, p := range paths {
		f, err := os.Open(p)
		if err != nil {
			return n, fmt.Errorf("%d-fayl: %w", n+1, err)
		}
		defer f.Close()
		n++
	}
	return n, nil
}

func readAllPerItem(paths []string) (int, error) {
	n := 0
	for _, p := range paths {
		if err := readHeader(p); err != nil {
			return n, fmt.Errorf("%d-fayl: %w", n+1, err)
		}
		n++
	}
	return n, nil
}

func main() {
	dir, err := os.MkdirTemp("", "fd-demo")
	if err != nil {
		panic(err)
	}
	defer os.RemoveAll(dir)
	var paths []string
	for i := 0; i < 200; i++ {
		p := filepath.Join(dir, fmt.Sprintf("p%03d.log", i))
		if err := os.WriteFile(p, []byte("gps:"), 0o600); err != nil {
			panic(err)
		}
		paths = append(paths, p)
	}
	n, err := readAllDeferInLoop(paths)
	fmt.Println("tsiklda defer:", n, err, errors.Is(err, syscall.EMFILE))
	n, err = readAllPerItem(paths)
	fmt.Println("iteratsiya funksiyasi:", n, err)
}
```

Shell'da `ulimit -n 64` qilib, dasturni kompilyatsiya qilib ishga tushirdik (Go 1.24.7, linux/amd64):

```text
tsiklda defer: 59 60-fayl: open /tmp/fd-demo882091046/p059.log: too many open files true
iteratsiya funksiyasi: 200 <nil>
```

Birinchi usul 59 ta faylni ochgach 60-sida `too many open files` xatosi berdi: hech biri yopilmagan, chunki `defer` funksiya tugaguncha kutadi. Chegara 64 edi; qolgan deskriptorlarni dastur va runtime band qilgan (aniq ro'yxatini bu yerda tekshirmadik), vaqtinchalik katalog nomi esa har ishga tushirishda boshqacha bo'ladi. Ikkinchi usul 200 ta faylni ham ochdi, chunki har biri iteratsiya oxirida yopildi. Xato `%w` bilan o'ralgani uchun `errors.Is(err, syscall.EMFILE)` `true` qaytardi (chiqishdagi oxirgi qiymat), lekin bunday xatoga javob dasturni qayta ishga tushirish emas, oqishni topishdir: servis ichida `/proc/<pid>/fd` ni sanash (Linux) yoki deskriptor sonini metrika sifatida chiqarish oqishni chegaraga yetmasdan oldin ko'rsatadi.

### Yopish tartibi: bufio.Writer, Flush va Sync

Resurslar qatlamlanganda yopish tartibi teskari bo'lishi kerak: avval tashqi qatlam (`bufio.Writer`), keyin fayl. `defer` LIFO bo'lgani uchun fayl ochilgandan keyin darhol `defer f.Close()` yozib, bufer yaratgandan keyin `defer w.Flush()` yozsangiz tartib to'g'ri chiqadi (7-dars). Lekin `bufio.Writer` ning `Close` metodi yo'q, shuning uchun uni `io.Closer` kutadigan joyda ishlatib bo'lmaydi, va `Flush` xatosi `defer` ichida osongina yo'qoladi. `bufio` hujjati: yozuv vaqtida xato bo'lsa, keyingi yozuvlar va `Flush` shu xatoni qaytaradi; hamma ma'lumot yozilgach `Flush` chaqirish shart. `Flush` unutilsa, na xato, na ogohlantirish bo'ladi:

```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
)

func write(path string, flush bool) (int64, error) {
	f, err := os.Create(path)
	if err != nil {
		return 0, err
	}
	w := bufio.NewWriter(f)
	fmt.Fprint(w, "fuel=41.5\n")
	if flush {
		if err := w.Flush(); err != nil {
			f.Close()
			return 0, err
		}
	}
	if err := f.Close(); err != nil {
		return 0, err
	}
	st, err := os.Stat(path)
	if err != nil {
		return 0, err
	}
	return st.Size(), nil
}

func main() {
	dir, _ := os.MkdirTemp("", "bufio-demo")
	defer os.RemoveAll(dir)
	n, err := write(filepath.Join(dir, "a.log"), false)
	fmt.Println("Flush'siz:", n, "bayt, xato:", err)
	n, err = write(filepath.Join(dir, "b.log"), true)
	fmt.Println("Flush bilan:", n, "bayt, xato:", err)
}
```

```text
Flush'siz: 0 bayt, xato: <nil>
Flush bilan: 10 bayt, xato: <nil>
```

`Flush`siz variantda `Close` ham, `Stat` ham xatosiz o'tdi, lekin fayl bo'sh qoldi: 10 baytlik yozuv `bufio.Writer` buferida qolib ketdi. Qoida: `Flush` natijasini tekshiring (yozuvchi uchun `Close` bilan bir xil), keyin `Close`.

`Close` ma'lumot diskka yetganini kafolatlamaydi. `os.File.Sync` hujjatiga ko'ra faylning joriy tarkibini barqaror xotiraga topshiradi (odatda fayl tizimining operativ xotiradagi nusxasini diskka yuboradi). Konfiguratsiya yoki hisob-kitob natijasi kabi yo'qolmasligi kerak bo'lgan fayl uchun tartib: yozish, `Flush`, `Sync`, `Close`; ko'pincha vaqtinchalik faylga yozib, `os.Rename` bilan almashtiriladi (bu amaliy naqsh, Go hujjatidagi qoida emas). `Sync` sekin amal, uni har kichik yozuvdan keyin chaqirmang. Bu dasturda `Sync` ishga tushirilmadi va diskka tushish vaqtini o'lchamadik.

### sql.Rows va tranzitor resurslar

100 Go Mistakes #79 sanagan uchinchi tur, `sql.Rows`, ham xuddi shunday. `database/sql` hujjati: `Rows.Next` `false` qaytarsa va boshqa natija to'plami bo'lmasa, `Rows` avtomatik yopiladi va faqat `Rows.Err` ni tekshirish yetarli; `Close` idempotent (bir necha marta chaqirish xavfsiz) va `Err` natijasiga ta'sir qilmaydi. Demak, `defer rows.Close()` barcha yo'llarni (erta `return`, `Scan` xatosi) yopadi, siklni oxirigacha o'tish esa uni o'zi yopadi. Xavfli joy: `Next` tsikli erta `break` yoki `return` bilan tugasa va `Close` yozilmagan bo'lsa, `Rows` yopilmay qoladi. `database/sql` hujjatida `Tx` va `Conn` uchun ulanish pool'ga qaytishi aniq yozilgan (`Conn` uchun: har `Conn` foydalanishdan keyin `Close` bilan pool'ga qaytarilishi shart); yopilmagan `Rows` pool ulanishini ushlab turishi haqida alohida jumlani hujjatdan topa olmadik, shuning uchun buni 100 Go Mistakes #79 ning resurs oqishi haqidagi umumiy ogohlantirishi sifatida o'qing va o'z drayveringizda tekshiring. Ikki marta `Close` bo'yicha `*os.File`dan farq bor: `Rows.Close` idempotent, `*os.File.Close` esa ikkinchi chaqiruvda xato qaytaradi (quyida). Tashqi modul (pgx) pool'ining xulq-atvori o'z hujjatiga bog'liq va bu darsda tekshirilmagan.

### Ikki marta Close

`io.Closer` hujjati: birinchi chaqiruvdan keyin `Close` xulqi aniqlanmagan, aniq tip o'z xulqini hujjatlashi mumkin. Shuning uchun `Close`ni ikki marta chaqirish xavfsizligi tipga bog'liq. `*os.File` ikkinchi chaqiruvda xato qaytaradi va `errors.Is(err, os.ErrClosed)` `true` (quyida tekshirilgan, Go 1.24.7, linux). O'z `Close()` metodingizni yozsangiz, ikki marta chaqirilishi mumkinligini hujjatlang va xulqini tanlang (idempotent yoki xato). `defer` va aniq `Close` aralashganda ikki marta chaqirish tasodifan ro'y beradi.

### os.Root (Go 1.24)

Go blogi (Traversal-resistant file APIs) muammoni sanaydi: nomda `..`, Windows'da `CONOUT$` kabi maxsus nomlar, hujumchi nazorat qiladigan symlink va ularni tekshirib-so'ng-ishlatish (TOCTOU) poygasi. Tekshiruv bilan `filepath.EvalSymlinks` + `IsLocal` ikki bosqichli bo'lgani uchun TOCTOU'ga ochiq: tekshiruvdan keyin hujumchi symlink almashtiradi.

Qadam-baqadam himoya:

1. **Sanitizatsiya.** Hujumchi mahalliy fayl tizimiga kira olmaydigan modelda yo'lni ishlatishdan oldin tekshirish yetarli. Go 1.20 da `path/filepath.IsLocal` qo'shilgan: yo'l katalogdan chiqmasa, mutlaq bo'lmasa, bo'sh bo'lmasa va (Windows'da) rezerv nom bo'lmasa `true`. Go 1.23 da `filepath.Localize` ('/' bilan ajratilgan yo'lni mahalliy OS yo'liga aylantiradi). Blog: ishonchsiz yo'llarni qabul qiladigan dastur deyarli har doim ularni shu ikkisidan biri bilan tekshirishi kerak.
2. **Beyond sanitization.** Hujumchi fayl tizimining bir qismiga kira olsa (arxivdagi symlink, konteyner), sanitizatsiya yetmaydi. `os.Root` (Go 1.24) katalogni ifodalaydi: `os.OpenRoot(dir)` bilan ochiladi va `Open`, `Create`, `Mkdir`, `Stat`, `Lstat`, `OpenFile`, `OpenRoot`, `Remove` metodlari ildizga nisbatan nomlar qabul qiladi hamda `..` yoki symlink orqali chiqib ketuvchi har qanday amalni rad etadi. `root.Open("a/../b")` kabi ichkarida qoladigan nomlar mumkin. Go 1.25 release notes'ga ko'ra `Root`ga yana `Chmod`, `Chown`, `Chtimes`, `Lchown`, `Link`, `MkdirAll`, `ReadFile`, `Readlink`, `RemoveAll`, `Rename`, `Symlink` va `WriteFile` qo'shilgan. `os.OpenInRoot(dir, name)` bitta fayl uchun qisqa shakl.

Blogdagi caveat'lar: Unix'da `Root` `openat` oilasiga tayanadi, katalog deskriptorini ushlab turadi va katalog nomi o'zgarsa ham uni kuzatadi. Symlink'dan himoya qiladi, lekin mount nuqtalarini cheklamaydi (masalan Linux bind mount): xavf modeli oddiy foydalanuvchi yarata oladigan konstruksiyalarga qarshi. Windows'da `Root` katalogga handle ochadi va u yopilgunicha katalogni qayta nomlash yoki o'chirish mumkin emas; `NUL`, `COM1` kabi rezerv nomlar bloklanadi. `GOOS=js` da `openat` yo'qligi sababli symlink tekshiruvida TOCTOU poygasi qoladi. Ko'p komponentli nomlarda `Root` operatsiyalari oddiy operatsiyadan ancha qimmat bo'lishi mumkin; blog `filepath.Clean` bilan `..` ni olib tashlash va komponentlar sonini cheklashni tavsiya qiladi. Blogdagi "kimga kerak" qoidasi: katalog ichida fayl ochsangiz va amal undan tashqariga chiqmasligi kerak bo'lsa.

## Misol: yo'qolgan Close va ishonchsiz nomlar

Tsikldagi `defer`:

```go run
package main

import "fmt"

// pool ochiq resurslar sonini hisoblaydi (fayl yoki ulanish o'rnida).
type pool struct{ open, peak int }

type res struct{ p *pool }

func (p *pool) Open() *res {
	p.open++
	if p.open > p.peak {
		p.peak = p.open
	}
	return &res{p: p}
}

func (r *res) Close() error {
	r.p.open--
	return nil
}

// tsiklda defer: hamma resurs funksiya tugaguncha ochiq qoladi.
func processAllDeferInLoop(p *pool, n int) {
	for i := 0; i < n; i++ {
		r := p.Open()
		defer r.Close()
	}
}

// har iteratsiya o'z funksiyasida: resurs iteratsiya oxirida yopiladi.
func processAllPerItem(p *pool, n int) {
	for i := 0; i < n; i++ {
		func() {
			r := p.Open()
			defer r.Close()
		}()
	}
}

func main() {
	a := &pool{}
	processAllDeferInLoop(a, 1000)
	fmt.Println("tsiklda defer: bir vaqtdagi maksimum ochiq resurs =", a.peak)

	b := &pool{}
	processAllPerItem(b, 1000)
	fmt.Println("iteratsiya funksiyasi: bir vaqtdagi maksimum ochiq resurs =", b.peak)
}
```

```text
tsiklda defer: bir vaqtdagi maksimum ochiq resurs = 1000
iteratsiya funksiyasi: bir vaqtdagi maksimum ochiq resurs = 1
```

Fake `pool` fayl deskriptori kabi resursni sanaydi. `defer` tsiklda 1000 ta resursni funksiya oxirigacha ushladi, har iteratsiya o'z funksiyasida esa bittasini.

`Close` xatosi va ikki marta Close:

```go
package main

import (
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
)

// flaky - Write muvaffaqiyatli, lekin Close xato qaytaradigan yozuvchi (bufer yuvilmasligi kabi).
type flaky struct{ buf []byte }

func (f *flaky) Write(p []byte) (int, error) { f.buf = append(f.buf, p...); return len(p), nil }
func (f *flaky) Close() error                { return errors.New("close: disk to'ldi") }

// saveIgnoring Close xatosini e'tiborsiz qoldiradi: ma'lumot yo'qolsa ham muvaffaqiyat xabari beradi.
func saveIgnoring(w io.WriteCloser, data []byte) error {
	defer w.Close()
	_, err := w.Write(data)
	return err
}

// save Close xatosini ham qaytaradi.
func save(w io.WriteCloser, data []byte) (err error) {
	defer func() { err = errors.Join(err, w.Close()) }()
	_, err = w.Write(data)
	return err
}

func main() {
	fmt.Println("saveIgnoring:", saveIgnoring(&flaky{}, []byte("fuel=41.5")))
	fmt.Println("save:        ", save(&flaky{}, []byte("fuel=41.5")))

	dir, err := os.MkdirTemp("", "close-demo")
	if err != nil {
		panic(err)
	}
	defer os.RemoveAll(dir)

	f, err := os.Create(filepath.Join(dir, "points.log"))
	if err != nil {
		panic(err)
	}
	fmt.Println("birinchi Close:", f.Close())
	err = f.Close()
	fmt.Println("ikkinchi Close:", err != nil, "| Is os.ErrClosed:", errors.Is(err, os.ErrClosed))
}
```

```text
saveIgnoring: <nil>
save:         close: disk to'ldi
birinchi Close: <nil>
ikkinchi Close: true | Is os.ErrClosed: true
```

`saveIgnoring` `nil` qaytardi, garchi `Close` "disk to'ldi" desa ham. `save` bu xatoni `errors.Join` bilan ko'rsatdi. Ikkinchi `Close` `os.ErrClosed` qaytardi.

HTTP javobi (`go vet`dan o'tgan to'g'ri variant, ulanish xatosi va muvaffaqiyatli holat):

```go
package main

import (
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
)

// fetch to'g'ri tartib: avval xato, keyin Close.
func fetch(url string) (n int, err error) {
	resp, err := http.Get(url)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return 0, fmt.Errorf("status %d", resp.StatusCode)
	}
	b, err := io.ReadAll(resp.Body)
	return len(b), err
}

func main() {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "gps:41.31,69.27")
	}))
	url := srv.URL
	srv.Close() // server yopildi: ulanish xatosi bo'ladi

	_, err := fetch(url)
	fmt.Println("fetch erishilmaydigan manzilda xato qaytardi:", err != nil)

	ok := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "gps:41.31,69.27")
	}))
	defer ok.Close()
	n, err := fetch(ok.URL)
	fmt.Println("fetch:", n, err)
}
```

```text
fetch erishilmaydigan manzilda xato qaytardi: true
fetch: 15 <nil>
```

Noto'g'ri tartib (`defer` xatodan oldin):

```go
resp, err := http.Get("http://127.0.0.1:1/")
defer resp.Body.Close() // xato: err != nil bo'lsa resp nil
```

`go vet` va ishga tushirish natijasi:

```text
./main.go:11:8: using resp before checking for errors
recover: runtime error: invalid memory address or nil pointer dereference
```

`os.Root` bilan symlink orqali chiqishni bloklash. Ishchi katalog `out`, uning ichida `link -> ..` symlink, tashqarida esa `secret.txt` bor:

```go
package main

import (
	"errors"
	"fmt"
	"io"
	"io/fs"
	"os"
	"path/filepath"
)

func main() {
	base, err := os.MkdirTemp("", "root-demo")
	if err != nil {
		panic(err)
	}
	defer os.RemoveAll(base)

	// base/secret.txt - ruxsat etilmagan joy, base/out - ishchi katalog.
	must(os.WriteFile(filepath.Join(base, "secret.txt"), []byte("db-parol"), 0o600))
	must(os.Mkdir(filepath.Join(base, "out"), 0o755))
	// out/link -> .. (ishchi katalogdan tashqariga olib chiqadigan symlink)
	must(os.Symlink("..", filepath.Join(base, "out", "link")))

	out := filepath.Join(base, "out")

	// 1. Oddiy Open: symlink orqali tashqariga chiqib ketadi.
	f, err := os.Open(filepath.Join(out, "link", "secret.txt"))
	if err == nil {
		b, _ := io.ReadAll(f)
		f.Close()
		fmt.Printf("os.Open:      o'qildi %q\n", b)
	}

	// 2. os.Root: ishchi katalogdan chiqishga ruxsat bermaydi.
	root, err := os.OpenRoot(out)
	must(err)
	defer root.Close()

	for _, name := range []string{"../secret.txt", "link/secret.txt", "/etc/hostname"} {
		f, err := root.Open(name)
		if err == nil {
			f.Close()
		}
		fmt.Printf("root.Open(%q): xato bor = %v\n", name, err != nil)
	}

	// 3. Katalog ichidagi oddiy fayllar ishlaydi.
	w, err := root.Create("a.txt")
	must(err)
	_, err = w.WriteString("gps")
	must(err)
	must(w.Close())
	_, err = root.Stat("a.txt")
	fmt.Println("root.Stat(a.txt):", err)

	// 4. Xato matni namunasi (yo'l ko'rsatilmaydi, faqat tashqi fayl nomi).
	_, err = root.Open("../secret.txt")
	var pe *fs.PathError
	fmt.Println("PathError:", errors.As(err, &pe), "| Op:", pe.Op, "| Path:", pe.Path, "| Err:", pe.Err)
}

func must(err error) {
	if err != nil {
		panic(err)
	}
}
```

```text
os.Open:      o'qildi "db-parol"
root.Open("../secret.txt"): xato bor = true
root.Open("link/secret.txt"): xato bor = true
root.Open("/etc/hostname"): xato bor = true
root.Stat(a.txt): <nil>
PathError: true | Op: openat | Path: ../secret.txt | Err: path escapes from parent
```

Oddiy `os.Open` symlink orqali `secret.txt`ni o'qidi; `os.Root` esa `..`, symlink va mutlaq yo'lni rad etdi, katalog ichidagi `a.txt` bilan ishladi. Xato `*fs.PathError`; `Op` qiymati (`openat`) Linux uchun, boshqa platformada boshqacha bo'lishi mumkin. `Err` matni (`path escapes from parent`) Go 1.24.7 da shunday chiqdi.

## Qachon qo'llamaslik kerak

- Foydalanuvchining o'zi bergan yo'l uchun `os.Root` kerak emas: CLI dastur `-o /var/log/out.txt` ga yozsa, yo'l ishonchsiz emas va istalgan joyga ishora qilishi mumkin. Blog buni aniq aytadi.
- Hot path'da ko'p komponentli nomlar bilan `os.Root` ishlatishdan oldin o'lchang: blog bu amallar oddiy operatsiyadan ancha qimmat bo'lishi mumkinligini aytadi (bu darsda ns/op o'lchanmagan).
- `os.Root` uncha katta bo'lmagan himoya qatlami, hamma narsa emas: mount nuqtalari, `GOOS=js` va fayl tizimi huquqlari alohida masala (87-dars).
- Hamma `Close` xatosini ham yig'ish shart emas. O'qiladigan fayl uchun `defer f.Close()` yetarli; muhimi, yozuvchi resurslarni ajrata bilish. Bu muallifning amaliy bahosi, kitob #54 esa tashlashda `_ =` ni aniq yozishni tavsiya qiladi.
- Tsikldagi har iteratsiya uchun alohida funksiya hamisha shart emas: bir necha iteratsiyali tsikl uchun `defer`ning kechikishi muammo emas. Qoida: iteratsiyalar soni noma'lum yoki katta bo'lsa chiqarib oling.
- `Close`ni finalizer yoki GC'ga qoldirmang: yopishni kodda ko'rinadigan qiling (59-darsda finalizer va cleanup).

## Stack'da: Node.js/TypeScript bilan solishtirish

- Node.js'da `fs.promises.open()` qaytargan `FileHandle` ham qo'lda yopilishi kerak, tsikldagi `await handle.close()` esa try/finally talab qiladi. Go'ning `defer`i shu naqshni funksiya darajasida soddalashtiradi, lekin blok darajasi yo'q: shuning uchun tsikl uchun alohida funksiya.
- `stream.pipeline` Node.js'da yopishni avtomatlashtiradi; Go'da bunga `io.Copy` va `defer` mos keladi (36-dars).
- "Zip slip" himoyasi Node.js'da odatda `path.resolve` + `startsWith` bilan qilinadi va symlink/TOCTOU'ga ochiq; Go'da `os.Root` buni platforma darajasida (`openat`) yechadi.
- Servis chegarasi: yuklanadigan fayl nomlarini hech qachon `filepath.Join(baseDir, userName)` bilan ochmang; `os.OpenRoot(baseDir)` yoki kamida `filepath.IsLocal`. Bu 87-darsda ham qaytadi.

## Xulosa

- Tashqi resurs (fayl, ulanish, `Body`) uchun: oling, xatoni tekshiring, darhol `defer` bilan yoping; `defer`ni xato tekshiruvidan oldin qo'ymang.
- `defer` funksiya oxirida ishlaydi: tsiklda ochilgan resurs uchun iteratsiyani alohida funksiyaga chiqaring.
- Yozuvchi resursning `Close` xatosini yo'qotmang: nomlangan natija va `errors.Join`; e'tiborsiz qoldirsangiz `_ =` va sabab.
- `*os.File`ni ikki marta yopish xato (`os.ErrClosed`) qaytaradi; o'z `Close`ingiz uchun xulqni hujjatlang.
- Ishonchsiz fayl nomlari uchun `os.Root` (Go 1.24, kengaytirilgan metodlar Go 1.25 dan) symlink va `..` orqali chiqishni bloklaydi; mount nuqtalari va `GOOS=js` chegaralarini bilib qo'ying.
- `os.Root` foydalanuvchi o'zi tanlagan yo'llar uchun emas: ishonchsiz nomlar va katalogdan chiqmaslik sharti birga bo'lganda.
