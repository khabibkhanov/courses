---
n: 36
slug: io-bufio
title: "io, bufio va oqimli ishlash"
summary: "io.Reader shartnomasi (n baytni avval ishlating, keyin xatoni), io.Copy/LimitReader/MultiWriter bilan oqimli ishlash, bufio.Scanner'ning 64 KiB chegarasi va bufio.Writer'da Flush."
duration: 40
sources:
  - id: gopl
    note: "Kitob io.Reader/io.Writer interfeyslari va oqimli ishlash g'oyasi uchun umumiy manba; aniq bob raqami bu darsda tekshirilmagan"
  - id: 100go
    note: "#46 (Using a filename as a function input): funksiya fayl nomi o'rniga io.Reader qabul qilsin"
  - id: pkg-io
    note: "io.Reader shartnomasi, EOF, Copy, LimitReader, TeeReader, MultiWriter, ReadFull, Pipe"
  - id: pkg-bufio
    note: "Scanner, MaxScanTokenSize, ErrTooLong, Writer va Flush"
quiz:
  - q: "Custom Reader oxirgi chaqiruvda `n=3, err=io.EOF` qaytardi. `n, err := r.Read(buf); if err != nil { break }; use(buf[:n])` tsikli nima qiladi?"
    options:
      - "Oxirgi 3 baytni ham ishlatadi, chunki EOF faqat keyingi chaqiruvda keladi"
      - "Oxirgi 3 bayt tashlab yuboriladi: n > 0 bo'lsa ham avval bayt ishlanishi, keyin xato tekshirilishi kerak"
      - "panic bo'ladi, chunki EOF bilan n > 0 qaytarish mumkin emas"
      - "Tsikl cheksiz davom etadi"
    answer: 1
    explain: "Read shartnomasi n > 0 bilan err != nil qaytarishga ruxsat beradi, shuning uchun n baytni avval ishlatish, keyin xatoni ko'rish kerak. Darsdagi `wrongLoop` shu sababli `gps:55.7558,37.6` ni qaytardi, `rightLoop` esa to'liq satrni."
  - q: "Mijoz 100 KiB uzunlikdagi bitta qator yubordi. `sc := bufio.NewScanner(r); for sc.Scan() {...}` tsikli tugadi, `sc.Err()` tekshirilmadi. Nima bo'ladi?"
    options:
      - "Scanner qatorni bo'laklarga bo'lib qaytaradi"
      - "Dastur panic qiladi"
      - "Qator Text()da qisqartirilgan holda keladi"
      - "Scan() false qaytaradi, o'qish shu yerda to'xtaydi va xato faqat sc.Err()da (bufio.ErrTooLong); tekshirilmasa qolgan ma'lumot jimgina yo'qoladi"
    answer: 3
    explain: "Standart chegara MaxScanTokenSize = 64 KiB. Chegaradan oshgan token Scan'ni tugatadi va Err() bufio.Scanner: token too long qaytaradi. Err() chaqirilmasa, tsikl oddiy EOF kabi tugagandek ko'rinadi. Chora: Buffer() bilan chegarani ko'tarish yoki bufio.Reader."
  - q: "`w := bufio.NewWriter(file)` bilan 1000 ta kichik yozuv yozdingiz, `Flush()` chaqirmadingiz va dastur normal tugadi. Natija?"
    options:
      - "Buferda qolgan oxirgi qism faylga yozilmaydi: bufio.Writer o'zi yopilganda yuvmaydi"
      - "Hammasi yozildi, chunki dastur tugaganda runtime buferlarni yuvadi"
      - "Faylga hech narsa yozilmaydi"
      - "Har yozuv darhol yuviladi, shuning uchun farq yo'q"
    answer: 0
    explain: "bufio.Writer ma'lumotni ichki buferda ushlaydi (standart 4096 bayt). Darsdagi misolda Flush'dan oldin 2 ta Write (8192 bayt) o'tdi, qolgan 2808 bayt buferda turardi. Runtime bufio.Writer'ni yuvmaydi, Flush'ni va uning xatosini chaqiruvchi o'zi boshqaradi."
  - q: "HTTP so'rov tanasini `io.ReadAll(r.Body)` bilan to'liq xotiraga o'qish nega xavfli, va eng sodda himoya qaysi?"
    options:
      - "ReadAll xato qaytarmaydi; himoya: ReadAll o'rniga Scanner"
      - "ReadAll faqat 64 KiB o'qiydi; himoya: Buffer()"
      - "Hajm cheklanmagan: mijoz katta tana yuborib xotirani to'ldiradi. Himoya: io.LimitReader(r, limit+1) bilan o'qib, limitdan oshganini xato deb hisoblash"
      - "ReadAll goroutine'ni bloklaydi; himoya: ReadAll'ni alohida goroutine'da chaqirish"
    answer: 2
    explain: "io.ReadAll EOF'gacha o'qiydi, hajm cheklovi yo'q. LimitReader n baytdan keyin EOF beradi; limit+1 bayt o'qib, uzunlik limitdan oshganini tekshirish oshib ketishni oddiy tugashdan ajratadi (darsdagi readLimited)."
  - q: "`io.ReadFull(r, buf)` 8 baytlik buferga faqat 3 bayt topdi va oqim tugadi. Qaytgan xato?"
    options:
      - "io.EOF"
      - "nil, chunki ReadFull bor narsani o'qiydi"
      - "io.ErrUnexpectedEOF"
      - "io.ErrShortBuffer"
    answer: 2
    explain: "ReadFull: hech bayt o'qilmasa EOF, qisman o'qilib oqim tugasa ErrUnexpectedEOF. Shu farq protokolda 'xabar yo'q' va 'xabar uzilgan' holatlarini ajratish imkonini beradi. Darsdagi tajribada qisqa kirish uchun `unexpected EOF`, bo'sh kirish uchun `EOF` chiqdi."
  - q: "Funksiya `func CountEmpty(filename string) (int, error)` bo'lsa, 100 Go Mistakes #46 nimani tavsiya qiladi?"
    options:
      - "Fayl nomi o'rniga os.File qabul qilish"
      - "io.Reader qabul qilish: manba fayl, satr, HTTP tanasi bo'lishi mumkin, test esa fayl yaratmasdan strings.NewReader bilan yoziladi"
      - "Fayl nomini global o'zgaruvchiga saqlash"
      - "Hech narsa, fayl nomi qabul qilish normal"
    answer: 1
    explain: "#46: funksiya io.Reader qabul qilsa, qayta ishlatish va test osonlashadi; fayl nomini qabul qilish ko'p holda code smell (os.Open kabi maxsus funksiyalar bundan mustasno). *os.File qabul qilish esa Reader'dan torroq: faqat fayl bo'ladi."
task:
  title: "Hisobotni xavfsiz va tez yozish"
  prompt: |
    `Report` har qatordagi `id,litr` yozuvini o'qib, jami litrni hisoblaydi va har yozuvni `w` ga yozadi. Hozirgi variantda uchta muammo bor: uzun izoh qatori (`#...`, 100 KiB) `Scanner` chegarasidan oshadi va o'qish jimgina to'xtaydi, `sc.Err()` hech qachon tekshirilmaydi, har yozuv `w` ga alohida `Write` chaqiruvi bilan boradi.

    Tuzating:
    - `Scanner`ga `Buffer` bilan 1 MiB gacha chegara bering: 100 KiB izoh qatori o'qishni to'xtatmasin.
    - Tsikldan keyin `sc.Err()` ni tekshiring va `%w` bilan o'rab qaytaring (2 MiB qator uchun `errors.Is(err, bufio.ErrTooLong)` true bo'lsin).
    - Chiqishni `bufio.Writer` orqali yozing va `Flush` xatosini yo'qotmang (nomlangan natija va `errors.Join`).
    - `main`ni o'zgartirmang. Kutilgan chiqish: `jami: 30.5 err=<nil>`, `write chaqiruvlari <= 2: true`, `uzun qator xatosi: true`.
  lang: go
  starter: |
    package main

    import (
        "bufio"
        "errors"
        "fmt"
        "io"
        "strconv"
        "strings"
    )

    type countWriter struct{ calls int }

    func (c *countWriter) Write(p []byte) (int, error) { c.calls++; return len(p), nil }

    // Report "id,litr" qatorlaridan jami litrni hisoblaydi, har yozuvni w ga yozadi.
    func Report(r io.Reader, w io.Writer) (float64, error) {
        sc := bufio.NewScanner(r)
        var total float64
        for sc.Scan() {
            line := sc.Text()
            if strings.HasPrefix(line, "#") {
                continue
            }
            _, val, ok := strings.Cut(line, ",")
            if !ok {
                continue
            }
            v, err := strconv.ParseFloat(val, 64)
            if err != nil {
                continue
            }
            total += v
            fmt.Fprintf(w, "%s -> %.1f\n", line, v)
        }
        return total, nil
    }

    func main() {
        head := "A1,10\nA2,5.5\nA3,4\n"
        tail := "A4,6\nA5,5\n"
        input := head + "#" + strings.Repeat("x", 100_000) + "\n" + tail

        var cw countWriter
        total, err := Report(strings.NewReader(input), &cw)
        fmt.Printf("jami: %.1f err=%v\n", total, err)
        fmt.Println("write chaqiruvlari <= 2:", cw.calls <= 2)

        huge := head + "#" + strings.Repeat("x", 2<<20) + "\n" + tail
        _, err = Report(strings.NewReader(huge), io.Discard)
        fmt.Println("uzun qator xatosi:", errors.Is(err, bufio.ErrTooLong))
    }
  solution: |
    package main

    import (
        "bufio"
        "errors"
        "fmt"
        "io"
        "strconv"
        "strings"
    )

    type countWriter struct{ calls int }

    func (c *countWriter) Write(p []byte) (int, error) { c.calls++; return len(p), nil }

    // Report "id,litr" qatorlaridan jami litrni hisoblaydi, har yozuvni w ga yozadi.
    func Report(r io.Reader, w io.Writer) (total float64, err error) {
        bw := bufio.NewWriter(w)
        defer func() {
            if ferr := bw.Flush(); ferr != nil {
                err = errors.Join(err, fmt.Errorf("report: flush: %w", ferr))
            }
        }()

        sc := bufio.NewScanner(r)
        sc.Buffer(make([]byte, 0, 64*1024), 1<<20)
        for sc.Scan() {
            line := sc.Text()
            if strings.HasPrefix(line, "#") {
                continue
            }
            _, val, ok := strings.Cut(line, ",")
            if !ok {
                continue
            }
            v, perr := strconv.ParseFloat(val, 64)
            if perr != nil {
                continue
            }
            total += v
            if _, werr := fmt.Fprintf(bw, "%s -> %.1f\n", line, v); werr != nil {
                return total, fmt.Errorf("report: write: %w", werr)
            }
        }
        if serr := sc.Err(); serr != nil {
            return total, fmt.Errorf("report: scan: %w", serr)
        }
        return total, nil
    }

    func main() {
        head := "A1,10\nA2,5.5\nA3,4\n"
        tail := "A4,6\nA5,5\n"
        input := head + "#" + strings.Repeat("x", 100_000) + "\n" + tail

        var cw countWriter
        total, err := Report(strings.NewReader(input), &cw)
        fmt.Printf("jami: %.1f err=%v\n", total, err)
        fmt.Println("write chaqiruvlari <= 2:", cw.calls <= 2)

        huge := head + "#" + strings.Repeat("x", 2<<20) + "\n" + tail
        _, err = Report(strings.NewReader(huge), io.Discard)
        fmt.Println("uzun qator xatosi:", errors.Is(err, bufio.ErrTooLong))
    }
  solutionNotes: |
    - `sc.Buffer(make([]byte, 0, 64*1024), 1<<20)` boshlang'ich bufer va maksimal token hajmini belgilaydi. 1 MiB dan katta qator baribir `bufio.ErrTooLong` beradi: cheksiz o'stirmaslik ataylab.
    - `sc.Err()` tsikldan keyin tekshiriladi. `Scan()` false bo'lsa sabab EOF yoki xato; faqat `Err()` ularni ajratadi (EOF uchun nil qaytadi).
    - `bufio.NewWriter(w)` 4096 baytlik bufer beradi: 5 ta kichik yozuv bitta `Write` bo'lib ketadi. `Flush` `defer` ichida, xatosi `errors.Join` bilan qaytadi, shuning uchun yozuv xatosi yo'qolmaydi.
    - `Report` fayl nomi emas, `io.Reader` va `io.Writer` qabul qiladi (100 Go Mistakes #46): test `strings.NewReader` va `countWriter` bilan fayl yaratmasdan yozilgan.
    - Parse xatosi bo'lgan qatorlar bu topshiriqda o'tkazib yuboriladi; real servisda ularni sanash yoki xato sifatida qaytarish kerak (31-dars).
  checklist:
    - "`Scanner.Buffer` bilan chegara 1 MiB gacha ko'tarilgan"
    - "`sc.Err()` tsikldan keyin tekshiriladi va `%w` bilan qaytariladi"
    - "Chiqish `bufio.Writer` orqali yoziladi, `Flush` xatosi yo'qolmaydi"
    - "2 MiB qator uchun `errors.Is(err, bufio.ErrTooLong)` true"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Telemetriya servisi datchiklardan kelgan qatorlarni o'qiydi, hisobot yozadi, fayl yoki HTTP javobga uzatadi. Uch xil xato bu yerda takror uchraydi.

Birinchisi: `Read`ning shartnomasini noto'g'ri tushunish. `n, err := r.Read(buf); if err != nil { break }` ko'rinishidagi tsikl oddiy fayllarda ishlaydi, lekin oxirgi bo'lakni `io.EOF` bilan birga qaytaradigan reader'da oxirgi baytlarni jimgina tashlab yuboradi. Test o'tadi, production'da bitta yozuv yetishmaydi.

Ikkinchisi: `bufio.Scanner`ning standart chegarasi. Bitta qator 64 KiB dan oshsa, `Scan()` false qaytaradi va tsikl tugaydi. Agar `sc.Err()` tekshirilmasa, bu oddiy fayl oxiridan farq qilmaydi: qolgan ma'lumot yo'qoldi, xato yo'q.

Uchinchisi: har kichik yozuv uchun alohida `Write`. Tarmoq yoki diskka 1000 ta 11 baytlik yozuv 1000 ta tizim chaqiruvi degani. Ikkinchi tomondan, `bufio.Writer` bilan `Flush`ni unutish teskari xatoni beradi: ma'lumot buferda qoladi, faylga tushmaydi.

Node.js bilan farq: u yerda `stream.Readable`, `highWaterMark` va `pipeline` bu ishlarni qisman o'zi boshqaradi. Go'da oqim abstraksiyasi ikkita kichik interfeys (`io.Reader`, `io.Writer`), qolgani oddiy funksiyalar. Mas'uliyat esa chaqiruvchida.

## Asosiy g'oya

`io.Reader` bitta metodli interfeys: `Read(p []byte) (n int, err error)`. Hujjatdagi shartnoma muhim nuqtalari:

- `Read` ko'pi bilan `len(p)` bayt o'qiydi. Ma'lumot bor, lekin `len(p)` dan kam bo'lsa, u kutib turmaydi, borini qaytaradi.
- `n > 0` bilan birga `err != nil` qaytarish mumkin. Oqim oxirida reader `n > 0, io.EOF` yoki `n > 0, nil` qaytarib, keyingi chaqiruvda `0, io.EOF` berishi mumkin. Ikkala xulq ham to'g'ri.
- Shuning uchun chaqiruvchi avval `n` baytni ishlatadi, keyin xatoga qaraydi.
- `0, nil` qaytishi "hech narsa bo'lmadi" degani, EOF emas. Implementatsiyalarga uni qaytarmaslik tavsiya etiladi (`len(p) == 0` dan tashqari).
- `io.EOF` ni reader o'zi qaytarishi kerak, o'ralgan xato emas: chaqiruvchilar uni `==` bilan solishtiradi. Shuning uchun reader ichida `fmt.Errorf("...: %w", io.EOF)` qaytarmang. Bu 31-darsdagi "xatoni o'rash" qoidasining istisnosi: EOF oqim protokolining bir qismi.

`io.Writer` ham shunday sodda: `Write(p []byte) (n int, err error)`; `n < len(p)` bo'lsa xato qaytarishi shart.

Shu ikki interfeys atrofida standart kutubxona kichik, birlashtiriladigan qurilish bloklarini beradi:

- `io.Copy(dst, src)` EOF'gacha ko'chiradi va muvaffaqiyatli tugasa `nil` qaytaradi (EOF emas). `src` `WriterTo`ni yoki `dst` `ReaderFrom`ni amalga oshirsa, `Copy` o'sha yo'ldan boradi, ya'ni oraliq bufer ajratmasligi mumkin.
- `io.LimitReader(r, n)` `n` baytdan keyin EOF beradi.
- `io.TeeReader(r, w)` o'qilgan hamma narsani `w` ga ham yozadi; yozish xatosi o'qish xatosi bo'lib qaytadi.
- `io.MultiWriter(a, b)` bir yozuvni ketma-ket hammasiga yozadi; birinchi xatoda to'xtaydi.
- `io.ReadFull(r, buf)` aniq `len(buf)` bayt o'qiydi: umuman bayt bo'lmasa `io.EOF`, qisman bo'lsa `io.ErrUnexpectedEOF`.
- `io.ReadAll(r)` EOF'gacha o'qiydi. Hajm cheklovi yo'q.

`bufio` bu interfeyslar ustiga buferlashni qo'shadi. `bufio.Reader` va `bufio.Writer` ichki buferda ishlaydi (standart hajm 4096 bayt). `bufio.Scanner` esa "token" (odatda qator) bo'yicha o'qishning qulay interfeysi.

100 Go Mistakes #46 shundan amaliy xulosa chiqaradi: funksiya fayl nomini emas, `io.Reader`ni qabul qilsin. Shunda manba fayl, satr, HTTP tanasi yoki gRPC xabari bo'lishi mumkin, test esa vaqtinchalik fayl yaratmasdan `strings.NewReader` bilan yoziladi.

## Chuqurroq: Scanner chegarasi, Writer va xatolar

### Scanner: chegara va "qaytarib bo'lmaydigan" to'xtash

`bufio.Scanner` hujjatiga ko'ra o'qish EOF'da, birinchi I/O xatosida yoki `Buffer`ga sig'maydigan token uchrasa qaytarib bo'lmaydigan tarzda to'xtaydi. To'xtagandan keyin reader oxirgi tokendan ancha oldinga siljigan bo'lishi mumkin, shuning uchun xatodan keyin uni davom ettirib bo'lmaydi. Standart maksimal token hajmi `bufio.MaxScanTokenSize = 64 * 1024`; real chegara biroz kichikroq bo'lishi mumkin, chunki buferga qator oxiri belgisi ham sig'ishi kerak.

Natijada `for sc.Scan() { ... }` dan keyin `sc.Err()` ni tekshirish majburiy. `Err()` EOF uchun `nil` qaytaradi, boshqa sabablar uchun xatoni. Chegara uchun `bufio.ErrTooLong` (`bufio.Scanner: token too long`) chiqadi, uni `errors.Is` bilan ajratish mumkin.

Chegarani `sc.Buffer(buf, max)` bilan o'zgartirasiz: birinchi argument boshlang'ich bufer, ikkinchisi maksimal token hajmi. Maksimalni sizdan ishonchsiz kirish hajmi belgilaydi: cheksiz qilmang, aks holda bitta qator butun xotirani oladi. Hujjatning o'zi katta tokenlar yoki xatolarni nozikroq boshqarish kerak bo'lsa `bufio.Reader` ishlatishni tavsiya qiladi. Lekin `ReadString('\n')` ham qator uzunligini cheklamaydi, shuning uchun u ishonchsiz kirishda o'zi himoya emas.

### Writer: Flush va yopishmaydigan xato

`bufio.Writer`da ikki qoida bor. Birinchisi: yozish xatosi bo'lsa, undan keyingi barcha `Write` va `Flush` chaqiruvlari o'sha xatoni qaytaradi (xato "yopishadi"). Demak, har `Fprintf`dan keyin xatoni tekshirish shart emas, lekin `Flush` natijasini tekshirish shart. Ikkinchisi: ma'lumot yozilgan deb hisoblash uchun `Flush` kerak. `bufio.Writer` yopilmaydi va dastur tugaganda ham o'zi yuvilmaydi, chunki bu Go runtime'ning ishi emas. Fayl yozayotgan bo'lsangiz tartib: avval `bw.Flush()`, keyin `f.Close()`, ikkalasining xatosi yo'qolmasin (35-dars).

`bufio.NewWriter(w)` agar `w` allaqachon yetarli bufer hajmli `*bufio.Writer` bo'lsa, o'shani qaytaradi, ikki qavat bufer yaratmaydi.

### Reader shartnomasi va o'zingizning Reader'ingiz

O'z `Read`ingizni yozsangiz, shartnomaga amal qiling: `len(p) == 0` bo'lsa `0` qaytaring; `p`ni saqlab qo'ymang (chaqiruvchi uni qayta ishlatadi); EOF'ni o'ramasdan qaytaring. Standart kutubxonada `testing/iotest` paketi bor, u kichik bo'laklarda yoki EOF bilan birga ma'lumot qaytaradigan reader'lar beradi. Ularni o'z reader iste'molchingizni sinash uchun ishlatish yaxshi. `go doc testing/iotest` (Go 1.24.7) bo'yicha: `OneByteReader` har `Read`da bir bayt qaytaradi, `HalfReader` so'ralgan hajmning yarmini, `DataErrReader` esa oxirgi xatoni (odatda EOF) oxirgi ma'lumot bilan birga qaytaradi, ya'ni yuqoridagi `chunkReader` xulqi; `TestReader` reader'ning kutilgan mazmunni to'g'ri qaytarishini tekshiradi.

### io.Pipe

`io.Pipe` sinxron xotiradagi quvur: har `Write` unga mos `Read` ma'lumotni to'liq olmaguncha bloklanadi, ichki bufer yo'q. Bu `io.Writer` kutadigan kodni `io.Reader` kutadigan kodga ulashning yo'li, masalan JSON'ni kodlab, bir vaqtda HTTP tanasiga yuborish. Hujjatga ko'ra bitta `Read`ga bitta `Write` mos keladi, bir yozuvni bir necha `Read` iste'mol qilishi mumkin. Yozuvchi va o'quvchi odatda turli goroutine'larda ishlaydi, shuning uchun biri yopilmasa ikkinchisi abadiy bloklanadi (34-dars: yopish va bekor qilish).

## Misol: Reader tsikli, Scanner, Writer va io yordamchilari

Birinchi dastur: oxirgi bo'lakni `io.EOF` bilan birga qaytaradigan reader. Noto'g'ri tsikl xatoni avval tekshiradi, to'g'risi avval `n` baytni ishlatadi.

```go
package main

import (
	"fmt"
	"io"
)

// chunkReader oxirgi bo'lakni io.EOF bilan birga qaytaradi.
// Read shartnomasi buni ruxsat etadi.
type chunkReader struct{ data []byte }

func (c *chunkReader) Read(p []byte) (int, error) {
	n := copy(p, c.data)
	c.data = c.data[n:]
	if len(c.data) == 0 {
		return n, io.EOF
	}
	return n, nil
}

func wrongLoop(r io.Reader) string {
	var out []byte
	buf := make([]byte, 4)
	for {
		n, err := r.Read(buf)
		if err != nil {
			break // n > 0 bo'lsa ham oxirgi bo'lak tashlab yuboriladi
		}
		out = append(out, buf[:n]...)
	}
	return string(out)
}

func rightLoop(r io.Reader) (string, error) {
	var out []byte
	buf := make([]byte, 4)
	for {
		n, err := r.Read(buf)
		out = append(out, buf[:n]...) // avval n baytni ishlating
		if err == io.EOF {
			return string(out), nil
		}
		if err != nil {
			return string(out), err
		}
	}
}

func main() {
	const payload = "gps:55.7558,37.6173"
	fmt.Printf("noto'g'ri: %q\n", wrongLoop(&chunkReader{[]byte(payload)}))
	got, err := rightLoop(&chunkReader{[]byte(payload)})
	fmt.Printf("to'g'ri:   %q err=%v\n", got, err)
}
```

```text
noto'g'ri: "gps:55.7558,37.6"
to'g'ri:   "gps:55.7558,37.6173" err=<nil>
```

`chunkReader` hujjatdagi ruxsat etilgan xulqni ko'rsatadi: oxirgi 3 bayt `io.EOF` bilan keladi. `wrongLoop` shu 3 baytni (`173`) tashladi. Reader noto'g'ri emas, tsikl noto'g'ri.

Ikkinchi dastur: 70000 baytlik qator va `Scanner` chegarasi.

```go
package main

import (
	"bufio"
	"errors"
	"fmt"
	"strings"
)

func main() {
	long := strings.Repeat("x", 70000)
	input := "a,1\n#" + long + "\nb,2\n"

	sc := bufio.NewScanner(strings.NewReader(input))
	n := 0
	for sc.Scan() {
		n++
	}
	fmt.Printf("standart: qatorlar=%d err=%v ErrTooLong=%v\n", n, sc.Err(), errors.Is(sc.Err(), bufio.ErrTooLong))

	sc = bufio.NewScanner(strings.NewReader(input))
	sc.Buffer(make([]byte, 0, 4096), 1<<20)
	n = 0
	for sc.Scan() {
		n++
	}
	fmt.Printf("Buffer(1 MiB): qatorlar=%d err=%v\n", n, sc.Err())

	rd := bufio.NewReaderSize(strings.NewReader(input), 4096)
	n = 0
	for {
		line, err := rd.ReadString('\n')
		if len(line) > 0 {
			n++
		}
		if err != nil {
			fmt.Printf("bufio.Reader: qatorlar=%d oxirgi err=%v\n", n, err)
			break
		}
	}
	fmt.Println("MaxScanTokenSize:", bufio.MaxScanTokenSize)
}
```

```text
standart: qatorlar=1 err=bufio.Scanner: token too long ErrTooLong=true
Buffer(1 MiB): qatorlar=3 err=<nil>
bufio.Reader: qatorlar=3 oxirgi err=EOF
MaxScanTokenSize: 65536
```

Standart `Scanner` birinchi qatordan keyin to'xtadi: `qatorlar=1` va xato `ErrTooLong`. Agar `Err()` tekshirilmasa, `b,2` qatori jimgina yo'qoladi. `Buffer(..., 1<<20)` bilan hamma 3 qator o'qildi. `bufio.Reader.ReadString` ham 3 qatorni o'qidi, ammo qator uzunligini cheklamaydi.

Uchinchi dastur: `bufio.Writer` yozuvlar sonini qanday kamaytiradi va `Flush`dan oldin ma'lumot qayerda turadi.

```go
package main

import (
	"bufio"
	"fmt"
	"io"
)

type countWriter struct{ calls, bytes int }

func (c *countWriter) Write(p []byte) (int, error) {
	c.calls++
	c.bytes += len(p)
	return len(p), nil
}

func emit(w io.Writer) {
	for i := 0; i < 1000; i++ {
		fmt.Fprintf(w, "point %04d\n", i)
	}
}

func main() {
	var raw countWriter
	emit(&raw)
	fmt.Printf("bufersiz:  Write=%d bayt=%d\n", raw.calls, raw.bytes)

	var sink countWriter
	bw := bufio.NewWriter(&sink)
	emit(bw)
	fmt.Printf("Flush'dan oldin: Write=%d bayt=%d buferda=%d\n", sink.calls, sink.bytes, bw.Buffered())
	err := bw.Flush()
	fmt.Printf("Flush'dan keyin: Write=%d bayt=%d err=%v\n", sink.calls, sink.bytes, err)
	fmt.Println("bufer hajmi:", bw.Size())
}
```

```text
bufersiz:  Write=1000 bayt=11000
Flush'dan oldin: Write=2 bayt=8192 buferda=2808
Flush'dan keyin: Write=3 bayt=11000 err=<nil>
bufer hajmi: 4096
```

Bufersiz holatda 1000 ta yozuv 1000 ta `Write`ga aylandi. Buferli holatda 11000 baytning 8192 tasi ikki `Write` bilan o'tdi, qolgan 2808 bayt `Flush`gacha buferda turdi, `Flush` uchinchi `Write`ni qildi. Bu hisoblagich `Write` chaqiruvlarini sanaydi, tizim chaqiruvlarini emas; haqiqiy faylda ta'sir bevosita `write(2)` chaqiruvlari soniga o'xshaydi, lekin buni bu darsda o'lchamadik.

To'rtinchi dastur: `io` yordamchilari.

```go
package main

import (
	"crypto/sha256"
	"errors"
	"fmt"
	"io"
	"strings"
)

type countWriter struct{ n int64 }

func (c *countWriter) Write(p []byte) (int, error) { c.n += int64(len(p)); return len(p), nil }

// readLimited limitdan oshgan kirishni xato deb qaytaradi.
func readLimited(r io.Reader, limit int64) ([]byte, error) {
	data, err := io.ReadAll(io.LimitReader(r, limit+1))
	if err != nil {
		return nil, err
	}
	if int64(len(data)) > limit {
		return nil, fmt.Errorf("kirish %d baytdan katta", limit)
	}
	return data, nil
}

func main() {
	src := strings.NewReader(strings.Repeat("telemetry;", 1000))

	var cnt countWriter
	h := sha256.New()
	n, err := io.Copy(io.MultiWriter(&cnt, h), src)
	fmt.Printf("Copy: n=%d err=%v sanagich=%d sha256=%x\n", n, err, cnt.n, h.Sum(nil)[:4])

	_, err = readLimited(strings.NewReader(strings.Repeat("a", 100)), 64)
	fmt.Println("limit 64:", err)
	data, err := readLimited(strings.NewReader("ok"), 64)
	fmt.Printf("limit 64: %q err=%v\n", data, err)

	hdr := make([]byte, 8)
	_, err = io.ReadFull(strings.NewReader("abc"), hdr)
	fmt.Println("ReadFull qisqa:", err, errors.Is(err, io.ErrUnexpectedEOF))
	_, err = io.ReadFull(strings.NewReader(""), hdr)
	fmt.Println("ReadFull bo'sh:", err, err == io.EOF)

	var tee strings.Builder
	rd := io.TeeReader(strings.NewReader("order-17"), &tee)
	b, _ := io.ReadAll(rd)
	fmt.Printf("Tee: o'qildi=%q nusxa=%q\n", b, tee.String())
}
```

```text
Copy: n=10000 err=<nil> sanagich=10000 sha256=87c0cecf
limit 64: kirish 64 baytdan katta
limit 64: "ok" err=<nil>
ReadFull qisqa: unexpected EOF true
ReadFull bo'sh: EOF true
Tee: o'qildi="order-17" nusxa="order-17"
```

`io.Copy` va `MultiWriter` bir o'tishda ham sanadi, ham sha256 hisobladi, butun 10000 baytni xotirada saqlamasdan. `readLimited` limit+1 bayt o'qiydi: 65-bayt mavjud bo'lsa, kirish limitdan katta. Shu usul bilan HTTP tanasi kabi ishonchsiz kirishni cheklash mumkin. `ReadFull` qisqa kirish uchun `ErrUnexpectedEOF`, bo'sh kirish uchun `EOF` berdi.

## Qachon qo'llamaslik kerak

- `bufio.Scanner`ni ixtiyoriy uzunlikdagi yoki ikkilik tokenlar uchun ishlatmang: chegara va "to'xtagandan keyin davom ettirib bo'lmaydi" xulqi noqulay. Katta tokenlar, aniq xato nazorati kerak bo'lsa `bufio.Reader`, protokol bo'lsa `io.ReadFull` bilan sarlavha o'qish yaxshi.
- `bufio.Writer`ni yozuv darhol ikkinchi tomonga yetib borishi kerak bo'lgan joyda ishlatmang (interaktiv protokol, log satri chiqishi kerak bo'lgan oqim). Bunda yo har yozuvdan keyin `Flush`, yo bufersiz yozish.
- Bitta katta `Write` yoki `io.Copy` uchun qo'shimcha `bufio` qatlami foyda bermaydi, faqat nusxa qo'shadi. `bufio.Writer` kichik, ko'p yozuvlar uchun.
- `io.ReadAll`ni ishonchsiz kirishda limitsiz ishlatmang. Ishonchli va kichik ma'lumot (konfiguratsiya fayli) uchun u mos.
- `io.Pipe`ni goroutine boshqaruvisiz ishlatmang: biri yopilmasa ikkinchisi bloklangan holda qoladi.
- `TeeReader` yozish xatosini o'qish xatosiga aylantiradi; log yozish uchun uni ishlatib, log disk to'lib qolsa asosiy o'qishni buzmang.

## Stack'da: Node.js/TypeScript bilan solishtirish

- Node.js'da `readline` yoki `for await (const line of rl)` qatorlarni o'qiydi; Go'da shuning ekvivalenti `bufio.Scanner`, lekin chegara va `Err()` mas'uliyati ochiq.
- `stream.pipeline(src, transform, dst)` backpressure va yopishni o'zi boshqaradi. Go'da backpressure tabiiy: `Write` sekin yozuvchida bloklanadi, `io.Copy` esa shu bilan ishlaydi. Yopish esa `defer` va `Close` bilan sizniki (35-dars).
- `fs.readFile` butun faylni xotiraga oladi, xuddi `io.ReadAll` kabi. Katta faylda ikkalasi ham xavfli; oqimli variant `io.Copy` yoki `Scanner`.
- Servis kodida funksiya imzosini `func Process(r io.Reader, w io.Writer) error` shaklida yozing: fayl, HTTP va test uchun bitta kod. Fayl nomini faqat `main` yoki ulanish qatlamida ishlating.

## Xulosa

- `Read` natijasida avval `n` baytni ishlating, keyin xatoni tekshiring; `io.EOF` ni `==` bilan solishtiring va o'ramang.
- Funksiya fayl nomi emas, `io.Reader`/`io.Writer` qabul qilsin (100 Go Mistakes #46): qayta ishlatish va test osonlashadi.
- `bufio.Scanner`: standart chegara 64 KiB, `sc.Err()` tsikldan keyin majburiy tekshiriladi, chegarani `Buffer` bilan ongli belgilang.
- `bufio.Writer` `Flush`siz ma'lumotni yo'qotadi; `Flush` xatosini `Close` xatosi kabi qaytaring.
- Ishonchsiz kirishda `io.LimitReader(r, limit+1)` bilan hajmni cheklang; `io.Copy`, `TeeReader`, `MultiWriter` bilan ma'lumotni xotiraga to'liq olmasdan qayta ishlang.
