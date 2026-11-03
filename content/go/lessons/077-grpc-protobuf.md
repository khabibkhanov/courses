---
n: 77
slug: grpc-protobuf
title: "gRPC va protobuf"
summary: "Protobuf baytlari qanday kodlanadi (tag, varint, wire type), gRPC HTTP/2 ustida qanday kadrlanadi (5 baytli prefiks, grpc-timeout, trailer'lar), grpc-go da server, klient, deadline va graceful stop; REST bilan farqi va qachon gRPC kerak emasligi."
duration: 50
sources:
  - id: grpc-go
    note: "grpc-go v1.85.0: NewServer, NewClient (lazy ulanish, I/O qilmaydi), Dial/DialContext deprecated, GracefulStop va Stop farqi"
  - id: grpc-go-basics
    note: "Go uchun gRPC asoslari: .proto dan kod generatsiyasi, unary va streaming RPC turlari"
  - id: go-faq
    note: "Go FAQ: Go'ning umumiy dizayn qarorlari (kod generatsiyasi va interfeyslar bilan ishlash fonida)"
  - id: grpc-http2-protocol
    note: "5 baytli kadr, grpc-timeout, trailer'lar"
  - id: protobuf-encoding
    note: "tag va wire type kodlash"
quiz:
  - q: "Protobuf'da `string vehicle = 1;` maydoni qiymati \"truck-7\" kodlanganda birinchi bayt `0a` bo'ladi. Nega?"
    options:
      - "Chunki 0a ASCII bo'yicha \"\\n\" belgisi va xabar boshlanishini bildiradi"
      - "Chunki tag = (maydon raqami << 3) | wire type = (1 << 3) | 2 = 0x0a; wire type 2 uzunlik-prefiksli (LEN) qiymatni bildiradi"
      - "Chunki 0a maydon nomining xeshi"
      - "Chunki 0a qiymat uzunligi (7 emas, 10)"
    answer: 1
    explain: "Tag maydon raqami va wire type'ni bitta varint'ga joylaydi. Lokal kodlovchi chiqishi: 0a 07 74 72 75 63 6b 2d 37: tag 0x0a, uzunlik 0x07, keyin 7 bayt matn. Maydon NOMI baytlarda yo'q, faqat raqami bor."
  - q: "Eski servis yangi xabarni o'qiydi, unda eski .proto'da yo'q 15-maydon bor. Protobuf bu holatda nima qiladi va nega bu orqaga moslik uchun muhim?"
    options:
      - "Xato qaytaradi, chunki sxema mos kelmaydi"
      - "Butun xabarni tashlab yuboradi"
      - "Noma'lum maydonni tag'idagi wire type bo'yicha uzunligini bilib o'tkazib yuboradi (yoki saqlab qo'yadi); eski kod ishlashda davom etadi"
      - "15-maydonni 1-maydonga qo'shib yuboradi"
    answer: 2
    explain: "Wire type baytlarning qancha joyni egallashini aytadi (varint, 8 bayt, uzunlik-prefiksli, ...), shuning uchun sxemasiz ham maydonni o'tkazish mumkin. Lokal sinovda eski o'quvchi 15-maydonni skipped ro'yxatiga qo'shib, qolganini to'g'ri o'qidi. Shuning uchun maydon raqamini qayta ishlatmaslik kerak."
  - q: "gRPC javobi HTTP/2 da qanday keladi? Server tomonda ish xato bilan tugasa (masalan DEADLINE_EXCEEDED), HTTP status nima bo'ladi?"
    options:
      - "HTTP status 504, tanada xato matni"
      - "HTTP status odatda 200; haqiqiy natija javob tanasidan keyin keladigan trailer'larda: grpc-status va grpc-message"
      - "HTTP status har doim gRPC status kodiga teng"
      - "Xato bo'lsa ulanish yopiladi va status umuman yuborilmaydi"
    answer: 1
    explain: "PROTOCOL-HTTP2.md bo'yicha natija trailer'larda (grpc-status, grpc-message, ixtiyoriy grpc-status-details-bin). Lokal h2c sinovda 'muddat tugadi' xatosi http=200 va grpc-status=4 bilan keldi. Shuning uchun faqat HTTP status bo'yicha monitoring qilish gRPC xatolarini ko'rmaydi."
  - q: "`conn, err := grpc.NewClient(\"localhost:50051\", grpc.WithTransportCredentials(insecure.NewCredentials()))` dan keyin `err == nil`. Bu serverga ulanish o'rnatildi degani-mi?"
    options:
      - "Ha, NewClient ulanishni darhol o'rnatadi va xato bo'lsa err qaytaradi"
      - "Yo'q: NewClient hech qanday tarmoq I/O qilmaydi va ulanishni birinchi RPC (yoki Connect) paytida lazy o'rnatadi; err faqat opsiyalar noto'g'riligini bildiradi"
      - "Ha, lekin faqat TLS ishlatilsa"
      - "Yo'q, NewClient o'rniga doim Dial chaqirish shart"
    answer: 1
    explain: "grpc-go hujjati: NewClient I/O qilmaydi, ulanish lazy, Dial/DialContext esa deprecated. Server ishlamayotganini birinchi RPC xatosi (Unavailable) ko'rsatadi. Sog'liqni tekshirish kerak bo'lsa, RPC yoki health-check protokolidan foydalaning."
  - q: "Server `readFrame` da `r.Read(hdr)` bilan 5 baytli kadr sarlavhasini o'qiyapti va xabar uzunligini sarlavhadagi qiymat bo'yicha ajratyapti. Qaysi ikkita muammo bor?"
    options:
      - "Read to'liq o'qishni kafolatlamaydi (io.ReadFull kerak) va da'vo qilingan uzunlikni limitsiz ishonib, 4 GB gacha xotira ajratish mumkin"
      - "Muammo yo'q: Read har doim to'liq o'qiydi"
      - "Faqat endianness noto'g'ri bo'lishi mumkin"
      - "Faqat flag baytini tekshirmaslik muammo"
    answer: 0
    explain: "Lokal sinov: iotest.OneByteReader bilan Read bitta bayt qaytardi va xabar bo'sh chiqdi; 4 MiB uzunlik da'vo qilingan holda starter 4 MiB bufer ajratdi. To'g'ri yechim: io.ReadFull va ajratishdan oldin max bilan solishtirish."
  - q: "Servisni to'xtatishda `Server.GracefulStop()` va `Server.Stop()` farqi nima?"
    options:
      - "Farqi yo'q, ikkalasi ham darhol barcha ulanishlarni uzadi"
      - "GracefulStop yangi ulanish va RPC'larni qabul qilmaydi, ketayotganlari tugashini kutadi; Stop barcha ulanishlarni yopib, ketayotgan RPC'larni bekor qiladi. Odatda GracefulStop'ni muddat bilan chaqirib, tugamasa Stop qilinadi"
      - "Stop kutadi, GracefulStop darhol yopadi"
      - "GracefulStop faqat klient tomonda mavjud"
    answer: 1
    explain: "GracefulStop qabul qilishni to'xtatib, faol RPC'larni tugatishni kutadi; ular tugamasa abadiy kutishi mumkin, shuning uchun amalda timer bilan o'raladi va muddat tugasa Stop chaqiriladi (72-darsdagi graceful shutdown g'oyasi bilan bir xil)."
task:
  title: "Kadr o'quvchisini xavfsiz qilish"
  prompt: |
    `readFrame` gRPC uslubidagi kadrni o'qiydi: 1 bayt flag, 4 bayt uzunlik (big endian), keyin xabar. Hozirgi versiya `r.Read` ishlatadi va sarlavhadagi uzunlikka ko'r-ko'rona ishonadi.

    Uni to'g'rilang:
    - sarlavha va xabarni `io.ReadFull` bilan o'qing (bo'lak-bo'lak keladigan oqim ham ishlashi kerak);
    - da'vo qilingan uzunlik `max` dan katta bo'lsa, xotira ajratmasdan `ErrTooLarge` qaytaring;
    - xabar kesilgan bo'lsa `io.ErrUnexpectedEOF` qaytsin.

    Kutilgan natija: "oddiy" va "bo'lak-bo'lak keladi" 9 bayt, "limitdan katta" `ErrTooLarge`, "kesilgan" `ErrUnexpectedEOF`.
  lang: go
  starter: |
    package main

    import (
        "bytes"
        "encoding/binary"
        "errors"
        "fmt"
        "io"
        "testing/iotest"
    )

    var ErrTooLarge = errors.New("xabar limitdan katta")

    // readFrame gRPC uslubidagi kadrni o'qiydi: 1 bayt flag, 4 bayt uzunlik (big endian), xabar.
    // max dan katta xabar uchun ErrTooLarge qaytarishi kerak.
    func readFrame(r io.Reader, max uint32) ([]byte, error) {
        hdr := make([]byte, 5)
        if _, err := r.Read(hdr); err != nil {
            return nil, err
        }
        msg := make([]byte, binary.BigEndian.Uint32(hdr[1:]))
        if _, err := r.Read(msg); err != nil {
            return nil, err
        }
        return msg, nil
    }

    func build(claimed uint32, payload string) []byte {
        b := []byte{0}
        b = binary.BigEndian.AppendUint32(b, claimed)
        return append(b, payload...)
    }

    func main() {
        good := build(9, "fuel=41.5")
        for _, c := range []struct {
            name string
            r    io.Reader
        }{
            {"oddiy", bytes.NewReader(good)},
            {"bo'lak-bo'lak keladi", iotest.OneByteReader(bytes.NewReader(good))},
            {"limitdan katta", bytes.NewReader(build(4<<20, "x"))},
            {"kesilgan", bytes.NewReader(build(9, "fuel"))},
        } {
            msg, err := readFrame(c.r, 1<<20)
            switch {
            case errors.Is(err, ErrTooLarge):
                fmt.Printf("%-22s ErrTooLarge\n", c.name)
            case errors.Is(err, io.ErrUnexpectedEOF):
                fmt.Printf("%-22s ErrUnexpectedEOF\n", c.name)
            case err != nil:
                fmt.Printf("%-22s boshqa xato: %v\n", c.name, err)
            default:
                fmt.Printf("%-22s %d bayt, %.12q\n", c.name, len(msg), msg)
            }
        }
    }
  solution: |
    package main

    import (
        "bytes"
        "encoding/binary"
        "errors"
        "fmt"
        "io"
        "testing/iotest"
    )

    var ErrTooLarge = errors.New("xabar limitdan katta")

    // readFrame gRPC uslubidagi kadrni o'qiydi: 1 bayt flag, 4 bayt uzunlik (big endian), xabar.
    // max dan katta xabar uchun ErrTooLarge qaytarishi kerak.
    func readFrame(r io.Reader, max uint32) ([]byte, error) {
        var hdr [5]byte
        if _, err := io.ReadFull(r, hdr[:]); err != nil {
            return nil, err
        }
        n := binary.BigEndian.Uint32(hdr[1:])
        if n > max {
            return nil, ErrTooLarge // uzunlikka ishonib xotira ajratmaymiz
        }
        msg := make([]byte, n)
        if _, err := io.ReadFull(r, msg); err != nil {
            return nil, err
        }
        return msg, nil
    }

    func build(claimed uint32, payload string) []byte {
        b := []byte{0}
        b = binary.BigEndian.AppendUint32(b, claimed)
        return append(b, payload...)
    }

    func main() {
        good := build(9, "fuel=41.5")
        for _, c := range []struct {
            name string
            r    io.Reader
        }{
            {"oddiy", bytes.NewReader(good)},
            {"bo'lak-bo'lak keladi", iotest.OneByteReader(bytes.NewReader(good))},
            {"limitdan katta", bytes.NewReader(build(4<<20, "x"))},
            {"kesilgan", bytes.NewReader(build(9, "fuel"))},
        } {
            msg, err := readFrame(c.r, 1<<20)
            switch {
            case errors.Is(err, ErrTooLarge):
                fmt.Printf("%-22s ErrTooLarge\n", c.name)
            case errors.Is(err, io.ErrUnexpectedEOF):
                fmt.Printf("%-22s ErrUnexpectedEOF\n", c.name)
            case err != nil:
                fmt.Printf("%-22s boshqa xato: %v\n", c.name, err)
            default:
                fmt.Printf("%-22s %d bayt, %.12q\n", c.name, len(msg), msg)
            }
        }
    }
  solutionNotes: |
    - `io.ReadFull` buferni to'ldirmaguncha o'qiydi; kam bayt kelib oqim tugasa `io.ErrUnexpectedEOF` (hech narsa kelmasa `io.EOF`) qaytaradi. `r.Read` esa bitta chaqiruvda ixtiyoriy kam bayt qaytarishi mumkin.
    - Da'vo qilingan uzunlik `make` dan OLDIN `max` bilan solishtiriladi, aks holda 4 baytli sarlavha 4 GiB gacha ajratishga majbur qila oladi.
    - Lokal tekshiruv: starter bo'lak-bo'lak oqimda bo'sh xabar, limitdan katta holatda 4 MiB bufer qaytardi; yechim to'rttala holatda kutilgan natijani berdi.
    - Bu faqat stdlib bilan yozilgan kadr o'quvchisi: grpc-go ning o'zi bu ishni ichida qiladi va limit `grpc.MaxRecvMsgSize` bilan boshqariladi.
  checklist:
    - "Sarlavha va xabar `io.ReadFull` bilan o'qiladi"
    - "Uzunlik `max` bilan `make` dan oldin solishtiriladi"
    - "Kesilgan oqim `io.ErrUnexpectedEOF` beradi"
    - "Bo'lak-bo'lak keladigan oqimda ham natija to'g'ri"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Servislar o'rtasida JSON bilan gaplashish ishlaydi, lekin qimmat va bo'sh. Har so'rovda maydon nomlari matn sifatida takrorlanadi, sxema hech qayerda saqlanmaydi (76-darsdagi qat'iy decode va validatsiyani har servis o'zi yozadi), versiya o'zgarsa hamma mijoz bilan qo'lda kelishish kerak, streaming esa HTTP/1.1 da noqulay. Ichki servislar soni o'nlab bo'lganda bu "shartnoma" faqat hujjatda yashaydi va hujjat eskiradi.

gRPC bu muammoni boshqacha hal qiladi: shartnoma `.proto` faylida yoziladi, undan ikkala tomon uchun tiplangan kod generatsiya qilinadi, xabarlar protobuf bilan ixcham binar ko'rinishda HTTP/2 ustida yuboriladi. Node.js'dan kelgan odamga bu `tRPC` yoki OpenAPI generatori kabi tuyuladi, lekin farq muhim: sxema til-agnostik, versiya qoidalari kodlash darajasida kafolatlangan va deadline protokolning bir qismi.

Bu darsda kodni avval "ichkaridan" ko'ramiz: protobuf baytlarini qo'lda kodlaymiz va gRPC kadrlarini stdlib HTTP/2 ustida yig'amiz. Shundan keyin grpc-go kodi sirli bo'lib qolmaydi.

## Asosiy g'oya

### Sxema: .proto

Shartnoma shunday ko'rinadi (bu sxema misollarda ishlatiladi, `protoc` bilan generatsiya qilish bu darsda ishga tushirilmadi):

```text
syntax = "proto3";
package fleet;
option go_package = "example.com/fleet/pb";

message Reading {
  string vehicle = 1;
  double fuel    = 2;
  int32  seq     = 3;
}
message Ack { bool ok = 1; }

service Telemetry {
  rpc Ingest(Reading) returns (Ack);              // unary
  rpc Watch(WatchRequest) returns (stream Reading); // server streaming
}
```

Maydon **raqami** (`= 1`) kodlashda ishlatiladi, maydon nomi emas. Shuning uchun nomni o'zgartirish xavfsiz, raqamni o'zgartirish yoki qayta ishlatish esa eski ma'lumotni buzadi. O'chirilgan maydon raqamini `reserved` qilib qo'ying.

### Protobuf baytlari

Protobuf kodlash hujjatiga ko'ra har maydon `tag` bilan boshlanadi: `tag = (maydon_raqami << 3) | wire_type`. Wire type oltita; uchtasi bu darsda kerak: 0 (VARINT), 1 (I64, 8 bayt) va 2 (LEN, uzunlik-prefiksli). Varint kichik sonlarni kam baytda yozadi (har baytning 7 biti ma'lumot, yuqori biti "davomi bor" belgisi). Quyidagi dastur yuqoridagi `Reading` ni qo'lda kodlaydi va qaytaradi:

```go
package main

import (
	"encoding/binary"
	"errors"
	"fmt"
	"math"
)

// Reading { string vehicle = 1; double fuel = 2; int32 seq = 3; } ning qo'lda yozilgan kodlovchisi.
const (
	wireVarint = 0
	wireI64    = 1
	wireLen    = 2
)

func tag(field, wire uint64) uint64 { return field<<3 | wire }

func encode(vehicle string, fuel float64, seq int32) []byte {
	var b []byte
	b = binary.AppendUvarint(b, tag(1, wireLen))
	b = binary.AppendUvarint(b, uint64(len(vehicle)))
	b = append(b, vehicle...)
	b = binary.AppendUvarint(b, tag(2, wireI64))
	b = binary.LittleEndian.AppendUint64(b, math.Float64bits(fuel))
	b = binary.AppendUvarint(b, tag(3, wireVarint))
	b = binary.AppendUvarint(b, uint64(uint32(seq)))
	return b
}

type reading struct {
	vehicle string
	fuel    float64
	seq     int32
	skipped []uint64
}

// decode noma'lum maydon raqamlarini o'tkazib yuboradi: eski o'quvchi yangi xabarni o'qiy oladi.
func decode(b []byte) (r reading, err error) {
	for len(b) > 0 {
		t, n := binary.Uvarint(b)
		if n <= 0 {
			return r, errors.New("buzuq tag")
		}
		b = b[n:]
		field, wire := t>>3, t&7
		switch wire {
		case wireVarint:
			v, n := binary.Uvarint(b)
			if n <= 0 {
				return r, errors.New("buzuq varint")
			}
			b = b[n:]
			if field == 3 {
				r.seq = int32(uint32(v))
			} else {
				r.skipped = append(r.skipped, field)
			}
		case wireI64:
			if len(b) < 8 {
				return r, errors.New("qisqa fixed64")
			}
			if field == 2 {
				r.fuel = math.Float64frombits(binary.LittleEndian.Uint64(b))
			} else {
				r.skipped = append(r.skipped, field)
			}
			b = b[8:]
		case wireLen:
			l, n := binary.Uvarint(b)
			if n <= 0 || uint64(len(b)-n) < l {
				return r, errors.New("buzuq uzunlik")
			}
			payload := b[n : n+int(l)]
			b = b[n+int(l):]
			if field == 1 {
				r.vehicle = string(payload)
			} else {
				r.skipped = append(r.skipped, field)
			}
		default:
			return r, fmt.Errorf("qo'llab-quvvatlanmaydigan wire type %d", wire)
		}
	}
	return r, nil
}

func main() {
	msg := encode("truck-7", 41.5, 300)
	fmt.Printf("%d bayt: % x\n", len(msg), msg)
	fmt.Printf("tag(1, LEN)=0x%02x tag(2, I64)=0x%02x tag(3, VARINT)=0x%02x\n", tag(1, wireLen), tag(2, wireI64), tag(3, wireVarint))

	r, err := decode(msg)
	fmt.Printf("qayta o'qildi: %+v xato=%v\n", r, err)

	// Yangi versiya xabarga 15-maydon (varint) qo'shdi; eski o'quvchi uni o'tkazib yuboradi.
	newer := binary.AppendUvarint(msg, tag(15, wireVarint))
	newer = binary.AppendUvarint(newer, 1)
	r, err = decode(newer)
	fmt.Printf("yangi xabar, eski o'quvchi: %+v xato=%v\n", r, err)

	// -1 int32 sifatida varint'da 10 bayt oladi (sint32 ZigZag bunga yechim).
	minusOne := int64(-1)
	fmt.Printf("int32(-1) varint uzunligi: %d bayt\n", len(binary.AppendUvarint(nil, uint64(minusOne))))
}
```

```text
21 bayt: 0a 07 74 72 75 63 6b 2d 37 11 00 00 00 00 00 c0 44 40 18 ac 02
tag(1, LEN)=0x0a tag(2, I64)=0x11 tag(3, VARINT)=0x18
qayta o'qildi: {vehicle:truck-7 fuel:41.5 seq:300 skipped:[]} xato=<nil>
yangi xabar, eski o'quvchi: {vehicle:truck-7 fuel:41.5 seq:300 skipped:[15]} xato=<nil>
int32(-1) varint uzunligi: 10 bayt
```

Chiqishdan ko'rinadiganlar:

- 21 bayt. Bir xil ma'lumot JSON'da `{"vehicle":"truck-7","fuel":41.5,"seq":300}` ko'rinishida 43 bayt bo'lardi, undan tashqari tur xavfsizligi yo'q.
- `0a` birinchi tag: `(1<<3)|2`; `11` ikkinchi: `(2<<3)|1`; `18` uchinchi: `(3<<3)|0`.
- 300 soni ikki baytli varint `ac 02`.
- Yangi xabarga qo'shilgan 15-maydonni eski o'quvchi `skipped:[15]` deb o'tkazib yubordi va qolgan maydonlarni to'g'ri o'qidi. Orqaga moslik shu mexanizmga tayanadi.
- Manfiy `int32` (`-1`) varint'da **10 bayt** oladi. Manfiy qiymatlar ko'p bo'lsa `sint32` (ZigZag) ishlatiladi, bu protobuf hujjatida tasvirlangan.

### gRPC HTTP/2 ustida

PROTOCOL-HTTP2.md bo'yicha gRPC chaqiruvi oddiy HTTP/2 so'rovi: `POST /Paket.Servis/Metod`, `content-type: application/grpc`, `te: trailers`. Tana bir yoki bir nechta **Length-Prefixed-Message**: 1 bayt siqish bayrog'i, 4 bayt uzunlik (big endian), keyin protobuf xabari. Deadline `grpc-timeout` sarlavhasida keladi: ko'pi bilan 8 raqam va bitta birlik harfi (`H`, `M`, `S`, `m`, `u`, `n`). Natija esa javob tanasidan keyingi **trailer**'larda: `grpc-status`, `grpc-message` va ixtiyoriy `grpc-status-details-bin`; HTTP status odatda 200.

Mexanizmni stdlib bilan ko'rsatamiz: Go 1.24 da `Server.Protocols` va `Transport.Protocols` orqali shifrlanmagan HTTP/2 (h2c) yoqiladi, shuning uchun hech qanday tashqi modul kerak emas:

```go
package main

import (
	"bytes"
	"context"
	"encoding/binary"
	"fmt"
	"io"
	"net"
	"net/http"
	"strconv"
	"strings"
	"time"
)

// frame gRPC "Length-Prefixed-Message" ko'rinishida: 1 bayt flag + 4 bayt uzunlik (big endian) + xabar.
func frame(msg []byte) []byte {
	b := []byte{0}
	b = binary.BigEndian.AppendUint32(b, uint32(len(msg)))
	return append(b, msg...)
}

func unframe(r io.Reader) ([]byte, error) {
	var hdr [5]byte
	if _, err := io.ReadFull(r, hdr[:]); err != nil {
		return nil, err
	}
	msg := make([]byte, binary.BigEndian.Uint32(hdr[1:]))
	_, err := io.ReadFull(r, msg)
	return msg, err
}

// parseTimeout "grpc-timeout" sarlavhasini ("250m", "2S") time.Duration'ga aylantiradi.
func parseTimeout(v string) (time.Duration, bool) {
	if len(v) < 2 {
		return 0, false
	}
	n, err := strconv.Atoi(v[:len(v)-1])
	if err != nil {
		return 0, false
	}
	unit := map[byte]time.Duration{'H': time.Hour, 'M': time.Minute, 'S': time.Second, 'm': time.Millisecond, 'u': time.Microsecond, 'n': time.Nanosecond}
	u, ok := unit[v[len(v)-1]]
	return time.Duration(n) * u, ok
}

func ingest(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	if d, ok := parseTimeout(r.Header.Get("Grpc-Timeout")); ok {
		var cancel context.CancelFunc
		ctx, cancel = context.WithTimeout(ctx, d)
		defer cancel()
	}
	msg, err := unframe(r.Body)

	w.Header().Set("Content-Type", "application/grpc")
	w.Header().Set("Trailer", "Grpc-Status, Grpc-Message")
	w.WriteHeader(http.StatusOK) // gRPC xatolari ham HTTP 200 bilan keladi
	switch {
	case err != nil:
		w.Header().Set("Grpc-Status", "13") // INTERNAL
		w.Header().Set("Grpc-Message", "xabar o'qilmadi")
	case strings.Contains(string(msg), "slow"):
		select {
		case <-ctx.Done():
			w.Header().Set("Grpc-Status", "4") // DEADLINE_EXCEEDED
			w.Header().Set("Grpc-Message", "muddat tugadi")
		case <-time.After(time.Second):
		}
	default:
		w.Write(frame([]byte("ack:" + string(msg))))
		w.Header().Set("Grpc-Status", "0") // OK
	}
}

func call(c *http.Client, url, msg, timeout string) {
	req, _ := http.NewRequest("POST", url+"/fleet.Telemetry/Ingest", bytes.NewReader(frame([]byte(msg))))
	req.Header.Set("Content-Type", "application/grpc")
	req.Header.Set("Te", "trailers")
	if timeout != "" {
		req.Header.Set("Grpc-Timeout", timeout)
	}
	resp, err := c.Do(req)
	if err != nil {
		fmt.Println("xato:", err)
		return
	}
	defer resp.Body.Close()
	reply, _ := unframe(resp.Body)
	io.Copy(io.Discard, resp.Body) // trailer'lar tana oxirigacha o'qilgandan keyin to'ladi
	fmt.Printf("%-8q proto=%s http=%d javob=%q grpc-status=%s grpc-message=%q\n",
		msg, resp.Proto, resp.StatusCode, reply, resp.Trailer.Get("Grpc-Status"), resp.Trailer.Get("Grpc-Message"))
}

func main() {
	srv := &http.Server{Handler: http.HandlerFunc(ingest), Protocols: new(http.Protocols)}
	srv.Protocols.SetUnencryptedHTTP2(true)
	ln, _ := net.Listen("tcp", "127.0.0.1:0")
	go srv.Serve(ln)
	defer srv.Close()

	tr := &http.Transport{Protocols: new(http.Protocols)}
	tr.Protocols.SetUnencryptedHTTP2(true)
	c := &http.Client{Transport: tr}
	url := "http://" + ln.Addr().String()

	call(c, url, "fuel=41.5", "")
	call(c, url, "slow", "100m")
}
```

```text
"fuel=41.5" proto=HTTP/2.0 http=200 javob="ack:fuel=41.5" grpc-status=0 grpc-message=""
"slow"   proto=HTTP/2.0 http=200 javob="" grpc-status=4 grpc-message="muddat tugadi"
```

Ikkinchi chaqiruv `100m` (100 ms) deadline bilan yuborildi, server 1 soniya ishlashi kerak edi, `ctx.Done()` birinchi ishladi va javob HTTP 200 + `grpc-status=4` (DEADLINE_EXCEEDED) bilan keldi. Bu haqiqiy grpc-go emas, faqat protokol mexanizmining sodda modeli: kadrlash, deadline va trailer'lar.

## Chuqurroq: grpc-go kodi

Quyidagi kod grpc-go hujjati API'siga (v1.85.0 va `protoc-gen-go-grpc` generatsiya qilgan interfeyslar) tayanib yozilgan va sandbox'da **kompilyatsiya qilinmagan**, chunki tashqi modullar yuklanmaydi. Generatsiya qilingan paket nomlari (`pb.UnimplementedTelemetryServer` va boshqalar) sizning `go_package` ingizga bog'liq.

```go
// Server (kompilyatsiya qilinmagan)
type server struct {
	pb.UnimplementedTelemetryServer
}

func (s *server) Ingest(ctx context.Context, r *pb.Reading) (*pb.Ack, error) {
	if r.GetVehicle() == "" {
		return nil, status.Error(codes.InvalidArgument, "vehicle majburiy")
	}
	if err := ctx.Err(); err != nil { // klient deadline'i yoki bekor qilish
		return nil, status.FromContextError(err).Err()
	}
	return &pb.Ack{Ok: true}, nil
}

func run() error {
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		return err
	}
	gs := grpc.NewServer(grpc.MaxRecvMsgSize(1 << 20))
	pb.RegisterTelemetryServer(gs, &server{})

	// SIGTERM kelganda: avval GracefulStop, muddat tugasa Stop
	go func() {
		<-shutdownSignal()
		done := make(chan struct{})
		go func() { gs.GracefulStop(); close(done) }()
		select {
		case <-done:
		case <-time.After(15 * time.Second):
			gs.Stop()
		}
	}()
	return gs.Serve(lis)
}
```

```go
// Klient (kompilyatsiya qilinmagan)
conn, err := grpc.NewClient("localhost:50051",
	grpc.WithTransportCredentials(insecure.NewCredentials()))
if err != nil {
	return err
}
defer conn.Close()

c := pb.NewTelemetryClient(conn)
ctx, cancel := context.WithTimeout(ctx, 2*time.Second) // grpc-timeout sarlavhasiga aylanadi
defer cancel()

ack, err := c.Ingest(ctx, &pb.Reading{Vehicle: "truck-7", Fuel: 41.5, Seq: 300})
if err != nil {
	st, _ := status.FromError(err)
	return fmt.Errorf("ingest: %s: %s", st.Code(), st.Message())
}
_ = ack
```

Muhim nuqtalar:

- **`NewClient`** hech qanday I/O qilmaydi; ulanish birinchi RPC paytida lazy o'rnatiladi. `Dial` va `DialContext` deprecated. Server ishlamayotgani birinchi RPC xatosida (`codes.Unavailable`) ma'lum bo'ladi.
- **Deadline**. Klientdagi `context` deadline'i `grpc-timeout` sifatida serverga uzatiladi va server handler'ida `ctx` ga aylanadi. Deadline zanjir bo'ylab tarqaladi: server ichkarida boshqa RPC chaqirsa, o'sha `ctx` ni uzatsa, umumiy byudjet saqlanadi. Deadline qo'ymagan RPC abadiy osilib qolishi mumkin. 100 Go Mistakes #61 (noto'g'ri kontekstni uzatish) va #62 (goroutine qachon to'xtashini bilmaslik) shu yerda ham amal qiladi.
- **Xatolar** `status` va `codes` paketlari orqali: oddiy `errors.New` qaytarsangiz klient `codes.Unknown` oladi. Mijoz mantig'i kod bo'yicha ishlashi uchun (`InvalidArgument`, `NotFound`, `DeadlineExceeded`, `Unavailable`) handler'da mazmunli kod tanlang.
- **`GracefulStop`** yangi ulanish va RPC'larni qabul qilmaydi va ketayotganlari tugashini kutadi; **`Stop`** hamma ulanishni yopadi. Birinchisi abadiy kutishi mumkin, shuning uchun yuqoridagi kabi muddat bilan o'raladi.
- **Interceptor'lar** (unary va stream) middleware'ning gRPC'dagi ekvivalenti: loglash, metrika, autentifikatsiya, panic'dan tiklanish (74-dars g'oyasi). Ular `grpc.NewServer(grpc.ChainUnaryInterceptor(...))` bilan ulanadi.
- **TLS**: ishlab chiqarishda `insecure.NewCredentials()` o'rniga `credentials.NewTLS(cfg)` va 75-darsdagi `tls.Config` ishlatiladi; mTLS ham shu orqali.

### Kodlashning qolgan qoidalari: ZigZag, packed, presence va birlashtirish

Yuqoridagi lokal kodlovchi minimal edi. Production sxemalarni buzadigan to'rtta qoida protobuf kodlash hujjatida (va field presence qo'llanmasida) yozilgan; ularni bir dasturda tekshirdik (Go 1.24.7, faqat stdlib).

1. **ZigZag.** `sint32` va `sint64` manfiy sonlarni "zig-zag" qilib yozadi: hujjatga ko'ra `sint32` uchun `(n << 1) ^ (n >> 31)`. Natijada `-1` bir baytga (`0x1`), `-2` `0x3` ga tushadi. Oddiy `int32` da `-1` 10 bayt oladi (yuqorida ko'rdik). Katta absolyut qiymatda foyda yo'q: eng katta `int32` ham, eng kichik `int32` ham 5 baytlik varint.
2. **Packed takrorlanuvchi maydonlar.** `repeated int32 e = 5` bitta LEN yozuvi sifatida yoziladi, ichida elementlar ketma-ket. Hujjatdagi `Test4` misoli (`d = "hello"`, `e = 1, 2, 3`) `220568656c6c6f2a03010203` bo'ladi; bizning kodlovchi aynan shu baytlarni berdi. Hujjatga ko'ra Edition 2023 dan boshlab primitiv takrorlanuvchi maydonlar sukut bo'yicha packed; parser packed va packed bo'lmagan shaklni ikkalasini ham o'qiy olishi shart, shuning uchun ular orasidagi o'zgarish mos keladi. String va xabar maydonlari packed bo'lmaydi.
3. **Implicit presence.** Field presence qo'llanmasiga ko'ra implicit presence maydonlar (proto3 oddiy skalyar maydonlari) standart qiymatga teng bo'lsa serializatsiya qilinmaydi: son uchun 0, string uchun bo'sh qator. Natijada hamma maydoni standart bo'lgan `Reading` 0 bayt bo'ladi, va qabul qiluvchi "`seq` yuborilmadi" bilan "`seq = 0` yuborildi" ni ajrata olmaydi. Qo'llanma proto3 asosiy tiplari uchun `optional` yorlig'ini sukut bo'yicha qo'shishni tavsiya qiladi, chunki u explicit presence beradi (`has_` metodi bilan). Telemetriyada `fuel = 0` (bak bo'sh) va "datchik ma'lumot bermadi" bir narsa emas, shuning uchun bunday maydonlar `optional` bo'lishi kerak.
4. **Oxirgisi yutadi va birlashtirish.** Bir xil skalyar maydon xabarda ikki marta uchrasa, parser oxirgi qiymatni oladi; ichki xabar maydonlari esa `MergeFrom` kabi birlashtiriladi. Hujjatning xulosasi: ikki kodlangan xabarning birlashtirilgan baytlarini parse qilish, ularni alohida parse qilib birlashtirishga teng.

```go
package main

import (
	"encoding/binary"
	"fmt"
)

func tag(field, wire uint64) uint64 { return field<<3 | wire }

// zigzag32 sint32 uchun: (n << 1) ^ (n >> 31).
func zigzag32(n int32) uint32 { return uint32(n<<1) ^ uint32(n>>31) }

// packedInts takrorlanuvchi int32 maydonni bitta LEN yozuvi sifatida kodlaydi.
func packedInts(field uint64, vals ...uint64) []byte {
	var payload []byte
	for _, v := range vals {
		payload = binary.AppendUvarint(payload, v)
	}
	b := binary.AppendUvarint(nil, tag(field, 2))
	b = binary.AppendUvarint(b, uint64(len(payload)))
	return append(b, payload...)
}

func str(field uint64, s string) []byte {
	b := binary.AppendUvarint(nil, tag(field, 2))
	b = binary.AppendUvarint(b, uint64(len(s)))
	return append(b, s...)
}

// encodeReading proto3'ning implicit presence qoidasi: standart qiymat yozilmaydi.
func encodeReading(vehicle string, seq int32) []byte {
	var b []byte
	if vehicle != "" {
		b = append(b, str(1, vehicle)...)
	}
	if seq != 0 {
		b = binary.AppendUvarint(b, tag(3, 0))
		b = binary.AppendUvarint(b, uint64(uint32(seq)))
	}
	return b
}

// lastSeq xabardan 3-maydonni (varint) oxirgi uchragan qiymat bilan o'qiydi.
func lastSeq(b []byte) (seq uint64, count int) {
	for len(b) > 0 {
		t, n := binary.Uvarint(b)
		b = b[n:]
		switch t & 7 {
		case 0:
			v, n := binary.Uvarint(b)
			b = b[n:]
			if t>>3 == 3 {
				seq, count = v, count+1
			}
		case 2:
			l, n := binary.Uvarint(b)
			b = b[n+int(l):]
		}
	}
	return seq, count
}

func main() {
	// ZigZag: protobuf hujjatidagi jadval bilan bir xil.
	for _, n := range []int32{0, -1, 1, -2, 0x7fffffff, -0x80000000} {
		fmt.Printf("sint32 %d -> 0x%x, varint %d bayt\n", n, zigzag32(n), len(binary.AppendUvarint(nil, uint64(zigzag32(n)))))
	}
	minusOne := int64(-1)
	fmt.Println("int32 -1 oddiy varint:", len(binary.AppendUvarint(nil, uint64(minusOne))), "bayt")

	// Packed: message Test4 { string d = 4; repeated int32 e = 5; }
	test4 := append(str(4, "hello"), packedInts(5, 1, 2, 3)...)
	fmt.Printf("Test4: %x\n", test4)

	// Implicit presence: standart qiymatlar yozilmaydi.
	fmt.Printf("bo'sh Reading: %d bayt\n", len(encodeReading("", 0)))
	fmt.Printf("seq=0, vehicle=truck-7: % x\n", encodeReading("truck-7", 0))

	// Ikki xabar birlashtirilsa: oxirgi qiymat yutadi.
	a := encodeReading("truck-7", 1)
	b := encodeReading("", 2)
	seq, count := lastSeq(append(append([]byte{}, a...), b...))
	fmt.Println("a+b: seq =", seq, "| 3-maydon", count, "marta uchradi")
}
```

```text
sint32 0 -> 0x0, varint 1 bayt
sint32 -1 -> 0x1, varint 1 bayt
sint32 1 -> 0x2, varint 1 bayt
sint32 -2 -> 0x3, varint 1 bayt
sint32 2147483647 -> 0xfffffffe, varint 5 bayt
sint32 -2147483648 -> 0xffffffff, varint 5 bayt
int32 -1 oddiy varint: 10 bayt
Test4: 220568656c6c6f2a03010203
bo'sh Reading: 0 bayt
seq=0, vehicle=truck-7: 0a 07 74 72 75 63 6b 2d 37
a+b: seq = 2 | 3-maydon 2 marta uchradi
```

ZigZag qatorlari hujjatdagi jadval bilan mos (`0x7fffffff` -> `0xfffffffe`, `-0x80000000` -> `0xffffffff`). `Test4` baytlari hujjatdagi misol bilan bir xil. Kodlovchi `seq = 0` ni yozmadi (oxirgidan oldingi qator: faqat `vehicle` baytlari), ya'ni qabul qiluvchi nolni "yo'q" bilan farqlay olmaydi. Birlashtirishda 3-maydon ikki marta uchradi va `seq = 2` yutdi. Amaliy oqibat: sxema evolyutsiyasida maydon turini o'zgartirmang (masalan `int32` dan `sint32` ga o'tish baytlarni boshqacha izohlaydi va eski ma'lumotni buzadi), va `optional` ni dastlabdan qo'ying: explicit presence generatsiya qilingan API ga `has_` kabi presence tekshiruvini qo'shadi, ya'ni keyin o'zgartirish mijoz kodiga ham tegadi.

### gRPC javob shakllari: Trailers-Only va xabar kodlash

PROTOCOL-HTTP2.md javobni ikki shaklda tasvirlaydi: odatiy `Response-Headers`, nol yoki ko'p `Length-Prefixed-Message` va `Trailers`; yoki `Trailers-Only`, bunda tana umuman yo'q, `:status 200`, `content-type` va `grpc-status` bitta HEADERS blokida keladi. Hujjatga ko'ra `Trailers-Only` darhol xato bergan chaqiruvlar uchun ruxsat etilgan, status esa OK bo'lganda ham `Trailers` da yuborilishi shart. Shu sababli tanasi umuman bo'lmagan javob ham to'g'ri holat; yuqoridagi stdlib modelimiz esa faqat odatiy shaklni (sarlavha, tana, trailer) ko'rsatadi.

`grpc-message` qiymati UTF-8 kodlanib, undan keyin foiz-kodlanadi (percent-encoding): bo'sh joy va `%` dan boshqa ASCII belgilar (`%x20-%x24` va `%x26-%x7E` oralig'i) o'zgarmaydi, qolgani `%XX` bo'ladi. Misoldagi `xabar o'qilmadi` ASCII bo'lgani uchun to'g'ridan-to'g'ri yozildi; kirill yoki boshqa ASCII bo'lmagan matn bo'lsa, qo'lda yozilgan server uni kodlashi kerak (grpc-go da bu qanday bajarilishi bu darsda tekshirilmagan). Hujjat yana uchta narsani aytadi: buzuq xabarni dekodlashda mijoz xato tashlamasligi kerak, `grpc-status-details-bin` faqat status OK bo'lmaganda ruxsat etiladi va u `grpc-status` ga zid bo'lmasligi shart, hamda mijoz javob sarlavhalari va trailer'lar hajmini cheklashi mumkin (tavsiya etilgan sukut 8 KiB).

Xabar hajmi bo'yicha, `pkg.go.dev/google.golang.org/grpc` hujjati: `MaxRecvMsgSize` sozlanmasa grpc-go serveri 4MB sukutni ishlatadi, `MaxSendMsgSize` uchun sukut `math.MaxInt32`. Ya'ni server katta xabarni qabul qilmaydi, lekin jo'natishda o'zini cheklamaydi; klient qabul qilish chegarasi esa alohida sozlanadi va bu darsda tekshirilmagan. Katta natijani bitta xabarga yig'masdan, streaming bilan bo'laklab yuboring.

### Streaming turlari va ularning narxi

`.proto` da to'rt shakl bor: unary (bitta so'rov, bitta javob), server streaming (`returns (stream Reading)`), client streaming va ikki tomonlama streaming. Protokol darajasida farq faqat shuki, HTTP/2 oqimida bir nechta Length-Prefixed-Message ketma-ket keladi va trailer'lar eng oxirida. Streaming uzoq yashaydi, shuning uchun uchta narsani oldindan o'ylang: oqim ichida `ctx.Done()` ni kuzating (klient ketdi, deadline tugadi), sekin o'quvchi uchun backpressure bor (yozish bloklanadi), va graceful stop paytida ochiq oqimlar tugashini kutish kerak. Oddiy "ma'lumot ber, javob ol" holatlarda unary yetarli; streaming faqat haqiqatan oqim bo'lganda (jonli telemetriya, katta natija bo'laklari) foydali.

### Xato tafsilotlari

`grpc-status-details-bin` trailer'i xatoga tiplangan tafsilot biriktirish imkonini beradi (masalan, qaysi maydon noto'g'ri). Bu 76-darsdagi `problem+json` ning gRPC dagi analogi: kod va xabar mashina uchun, tafsilot mijoz mantig'i uchun. Tafsilotlar ixtiyoriy; avval to'g'ri kodni tanlash muhimroq.

## Misol: xavfsiz kadr o'quvchisi

grpc-go kadrlashni ichida bajaradi, lekin shu mexanizmni bilish uchun mashq: mana to'g'ri `readFrame`, topshiriq yechimi bilan bir xil g'oya. Ikki qoida bor: (1) `io.ReadFull` ishlating, chunki `Read` bitta chaqiruvda ixtiyoriy kam bayt qaytarishi mumkin (lokal sinovda `iotest.OneByteReader` bilan starter bo'sh xabar qaytardi); (2) sarlavhadagi uzunlikka ishonmang, `make` dan oldin limit bilan solishtiring (starter 4 MiB bufer ajratdi, yechim `ErrTooLarge` qaytardi). grpc-go da shu himoya `MaxRecvMsgSize` bilan beriladi.

Starter chiqishi:

```text
oddiy                  9 bayt, "fuel=41.5"
bo'lak-bo'lak keladi   0 bayt, ""
limitdan katta         4194304 bayt, "x\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
kesilgan               9 bayt, "fuel\x00\x00\x00\x00\x00"
```

Yechim chiqishi:

```text
oddiy                  9 bayt, "fuel=41.5"
bo'lak-bo'lak keladi   9 bayt, "fuel=41.5"
limitdan katta         ErrTooLarge
kesilgan               ErrUnexpectedEOF
```

## Qachon qo'llamaslik kerak

- **Brauzer mijozlari bevosita**: brauzer HTTP/2 trailer'lari va past darajadagi kadrlarga kira olmaydi, shuning uchun gRPC-Web yoki proxy kerak. Ochiq, brauzerdan chaqiriladigan API uchun oddiy JSON/HTTP ko'pincha soddaroq.
- **Ochiq uchinchi tomon API'si**: mijozlar `curl` bilan sinab ko'rishni, JSON'ni ko'z bilan o'qishni kutadi. Binar protokol disk va tarmoqda ixcham, lekin disk raskadrovka uchun asbob kerak.
- **Kichik jamoa, bitta til, ikki servis**: `.proto` toolchain'i (protoc, plaginlar, generatsiya CI'da) qo'shimcha xarajat; foyda servislar ko'payganda sezilarli.
- **Katta fayllar**: bir xabarga solish o'rniga streaming yoki alohida yuklash kanali ishlating; standart `MaxRecvMsgSize` ni oshirish xotira muammosini yashiradi.
- **Sxema evolyutsiyasini e'tiborsiz qoldirish**: maydon raqamini qayta ishlatish yoki turini o'zgartirish jimgina ma'lumotni buzadi; `reserved` va sxema tekshiruvi (breaking change detector) CI'da kerak.
- **Load balancing**: HTTP/2 uzoq yashovchi ulanish ishlatadi, shuning uchun L4 balansirovshchik ortida barcha so'rovlar bitta backend'ga tushishi mumkin; klient tomonda yoki L7 balansirovkani ko'ring.

## Stack'da: Node.js/TypeScript bilan solishtirish

Node'da bu o'rinda odatda REST + OpenAPI yoki `tRPC` turadi. gRPC bilan farqlar: sxema birinchi o'rinda (kod sxemadan keladi, aksincha emas), deadline va bekor qilish protokol darajasida (Go'da `context` ga tabiiy ulanadi), xatolar tiplangan kodlar bilan, streaming birinchi darajali. Go tomonida odat: generatsiya qilingan kodni qo'lda o'zgartirmang, domen mantig'ini handler ichiga emas, alohida paketga qo'ying va handler'ni yupqa adapter qiling. `.proto` fayllarini alohida repo yoki papkada saqlab, versiyalang.

Servis uchun andoza:

- Har RPC'da deadline (klientda `context.WithTimeout`), serverda `ctx` ni pastga uzating.
- `status.Error(codes.X, ...)` bilan xato kodlari; domen xatolarini kodga o'tkazuvchi bitta joy.
- `MaxRecvMsgSize` va `MaxSendMsgSize` ni ongli belgilang.
- Ishdan chiqarish: SIGTERM -> `GracefulStop` + taymer -> `Stop`.
- Health-check va reflection ishlab chiqarishda faqat kerak joyda yoqing.
- Sxema o'zgarishi: faqat yangi maydon raqami qo'shiladi, o'chirilgani `reserved`.

## Xulosa

- Protobuf baytlari ixcham: tag = (maydon raqami << 3) | wire type, maydon nomi baytlarda yo'q. Shuning uchun raqam o'zgarmas, nom erkin.
- Noma'lum maydonlar o'tkazib yuboriladi: eski kod yangi xabarni o'qiydi. Lokal kodlovchi bilan 15-maydon misolida tasdiqlandi.
- gRPC oddiy HTTP/2: `POST /Paket.Servis/Metod`, 5 baytli kadr prefiksi, `grpc-timeout` sarlavhasi va natija trailer'larda (`grpc-status`), HTTP status odatda 200.
- grpc-go da `NewClient` lazy ulanadi, deadline `context` dan keladi, xatolar `status`/`codes` bilan, to'xtatish `GracefulStop` + muddat + `Stop`. grpc-go, protoc va generatsiya kodlari bu darsda kompilyatsiya qilinmagan.
- Kadr o'quvchisida `io.ReadFull` va uzunlik limiti majburiy. Brauzer, ochiq API va kichik jamoalar uchun gRPC har doim to'g'ri tanlov emas.
- Sxema qoidalari: manfiy sonlar ko'p bo'lsa `sint32`, nol va "yo'q" farqi muhim bo'lsa `optional`; ikki xabarning birlashtirilgan baytlari parse qilinsa oxirgi qiymat yutadi. gRPC javobi `Trailers-Only` shaklida ham kelishi mumkin, `grpc-message` esa foiz-kodlangan bo'ladi.
