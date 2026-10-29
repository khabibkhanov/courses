/*
 * Brauzerdagi C dasturlari uchun runtime (wasm32-wasip1). Brauzerda bir marta kompilyatsiya qilinadi
 * (-fsanitize'siz) va har dasturga ulanadi.
 *
 * 1. Kichik AddressSanitizer: clang -fsanitize=address har load/store oldidan shadow baytini
 *    tekshiradi (shadow = addr >> 3, offset 0). Xotira: [0, 16MB) - shadow (128MB xotira uchun),
 *    dastur 16MB dan keyin (--global-base, --no-stack-first). malloc/free --wrap orqali
 *    redzone va karantin bilan: heap overflow, use-after-free, double free.
 * 2. UBSan handler'lari (-fno-sanitize-recover=undefined): signed overflow, nolga bo'lish va h.k.
 * 3. Leak hisoboti dastur oxirida (valgrind o'rniga).
 * 4. cs50.h funksiyalari (get_string va boshqalar).
 *
 * Xato joyi (fayl:qator) bu yerda chiqarilmaydi: worker trap'dan keyin uni symbolizer bilan topadi.
 */
#include <ctype.h>
#include <errno.h>
#include <float.h>
#include <limits.h>
#include <math.h>
#include <stdarg.h>
#include <stddef.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define SHADOW_END (16u << 20)
#define SHADOW(a) ((volatile int8_t *)((uintptr_t)(a) >> 3))
#define REDZONE 16
#define QUARANTINE 256

enum {
  HEAP_LEFT = (int8_t)0xfa,
  HEAP_RIGHT = (int8_t)0xfb,
  FREED = (int8_t)0xfd,
  GLOBAL_RZ = (int8_t)0xf9,
  LOW = (int8_t)0xfe,
};

void *__real_malloc(size_t);
void __real_free(void *);

static void poison(uintptr_t beg, size_t n, int8_t v) {
  for (uintptr_t a = beg; a < beg + n; a += 8) *SHADOW(a) = v;
}

/* [beg, beg+n) ochiq; beg 8 ga karrali. Oxirgi qisman granula: shadow = ochiq baytlar soni. */
static void unpoison(uintptr_t beg, size_t n) {
  size_t full = n & ~(size_t)7;
  for (uintptr_t a = beg; a < beg + full; a += 8) *SHADOW(a) = 0;
  if (n & 7) *SHADOW(beg + full) = (int8_t)(n & 7);
}

/* Blok sarlavhasi chap redzone ichida turadi. */
typedef struct {
  uint32_t magic, size, library;
} header;
#define MAGIC_LIVE 0xA5A5A5A5u
#define MAGIC_FREED 0xDEADDEADu

static long allocs, frees, live_blocks;
static size_t live_bytes;
static void *quarantine[QUARANTINE];
static int qpos;

static header *hdr(void *p) { return (header *)((char *)p - REDZONE); }

/* Sarlavhani shadow tekshiruviga tushmasdan o'qish/yozish. */
static header read_hdr(header *h) {
  int8_t keep = *SHADOW(h), keep2 = *SHADOW((char *)h + 8);
  *SHADOW(h) = 0, *SHADOW((char *)h + 8) = 0;
  header v = *h;
  *SHADOW(h) = keep, *SHADOW((char *)h + 8) = keep2;
  return v;
}

static void *alloc(size_t n, int library) {
  size_t body = (n + 7) & ~(size_t)7;
  char *raw = __real_malloc(REDZONE + body + REDZONE);
  if (!raw) return NULL;
  header *h = (header *)raw;
  *h = (header){MAGIC_LIVE, (uint32_t)n, (uint32_t)library};
  poison((uintptr_t)raw, REDZONE, HEAP_LEFT);
  unpoison((uintptr_t)raw + REDZONE, n);
  poison((uintptr_t)raw + REDZONE + body, REDZONE, HEAP_RIGHT);
  if (!library) allocs++, live_blocks++, live_bytes += n;
  return raw + REDZONE;
}

void *__wrap_malloc(size_t n) { return alloc(n, 0); }

void *__wrap_calloc(size_t a, size_t b) {
  if (b && a > SIZE_MAX / b) return NULL;
  void *p = alloc(a * b, 0);
  if (p) memset(p, 0, a * b);
  return p;
}

static void report(const char *kind, uintptr_t addr, size_t size, int write);

void __wrap_free(void *p) {
  if (!p) return;
  header *h = hdr(p);
  header v = (uintptr_t)h >= SHADOW_END ? read_hdr(h) : (header){0, 0, 0};
  if (v.magic == MAGIC_FREED) report("double-free: bu blok allaqachon free() qilingan", (uintptr_t)p, 0, 0);
  if (v.magic != MAGIC_LIVE) report("bad-free: free() ga malloc qaytarmagan manzil berildi", (uintptr_t)p, 0, 0);
  v.magic = MAGIC_FREED;
  int8_t keep = *SHADOW(h), keep2 = *SHADOW((char *)h + 8);
  *SHADOW(h) = 0, *SHADOW((char *)h + 8) = 0;
  *h = v;
  *SHADOW(h) = keep, *SHADOW((char *)h + 8) = keep2;
  poison((uintptr_t)p, (v.size + 7) & ~7u, FREED);
  if (!v.library) frees++, live_blocks--, live_bytes -= v.size;
  /* Darhol qaytarilmaydi: use-after-free topilishi uchun karantinda turadi. */
  if (quarantine[qpos]) __real_free(quarantine[qpos]);
  quarantine[qpos] = h;
  qpos = (qpos + 1) % QUARANTINE;
}

void *__wrap_realloc(void *o, size_t n) {
  if (!o) return __wrap_malloc(n);
  header v = read_hdr(hdr(o));
  if (v.magic != MAGIC_LIVE) report("realloc: bu manzil malloc qilingan tirik blok emas", (uintptr_t)o, 0, 0);
  void *p = alloc(n, (int)v.library);
  if (p) {
    memcpy(p, o, v.size < n ? v.size : n);
    __wrap_free(o);
  }
  return p;
}

/* Manzil qaysi heap blokiga tegishli: chapga qarab eng yaqin sarlavhani qidirish. */
static void describe(uintptr_t addr) {
  for (uintptr_t a = addr & ~(uintptr_t)15; a >= SHADOW_END && a + 65536 > addr; a -= 16) {
    if (*SHADOW(a) != HEAP_LEFT) continue;
    header v = read_hdr((header *)a);
    if (v.magic != MAGIC_LIVE && v.magic != MAGIC_FREED) continue;
    uintptr_t beg = a + REDZONE, end = beg + v.size;
    if (v.magic == MAGIC_FREED && addr >= beg && addr < end)
      fprintf(stderr, "Manzil free() qilingan %u baytlik blok ichida (boshidan %lu-bayt).\n", v.size, (unsigned long)(addr - beg));
    else if (addr >= end)
      fprintf(stderr, "Manzil %u baytlik blok (0..%u baytlar) tugaganidan %lu bayt keyin.\n", v.size, v.size ? v.size - 1 : 0,
              (unsigned long)(addr - end));
    else
      continue;
    return;
  }
  /* Chapdagi redzone: keyingi blokdan oldin. */
  for (uintptr_t a = (addr + 16) & ~(uintptr_t)15; a < addr + 64; a += 16) {
    if (*SHADOW(a) != HEAP_LEFT) continue;
    header v = read_hdr((header *)a);
    if (v.magic == MAGIC_LIVE || v.magic == MAGIC_FREED) {
      fprintf(stderr, "Manzil %u baytlik blok boshidan %lu bayt oldin.\n", v.size, (unsigned long)(a + REDZONE - addr));
      return;
    }
  }
}

static int8_t granule_kind(uintptr_t addr) {
  int8_t s = *SHADOW(addr);
  /* Qisman granula (1..7): turini keyingi granuladan bilamiz. */
  if (s > 0 && s < 8) s = *SHADOW(addr + 8);
  return s;
}

static void report(const char *kind, uintptr_t addr, size_t size, int write) {
  int8_t s = addr < SHADOW_END ? LOW : granule_kind(addr);
  if (!kind)
    kind = s == HEAP_LEFT || s == HEAP_RIGHT ? "heap-buffer-overflow: malloc qilingan blok chegarasidan tashqarida"
           : s == FREED                       ? "heap-use-after-free: free() qilingan xotiraga murojaat"
           : s == GLOBAL_RZ                   ? "global-buffer-overflow: global massiv chegarasidan tashqarida"
           : s == LOW                         ? "NULL yoki noto'g'ri ko'rsatkich orqali murojaat"
           : (uint8_t)s >= 0xf1 && (uint8_t)s <= 0xf8 ? "stack-buffer-overflow: lokal massiv chegarasidan tashqarida"
                                                      : "noto'g'ri xotira murojaati";
  fflush(stdout);
  fprintf(stderr, "\nXOTIRA XATOSI: %s\n", kind);
  if (size) fprintf(stderr, "%s: %zu bayt, manzil 0x%lx\n", write ? "Yozish" : "O'qish", size, (unsigned long)addr);
  if (s != LOW && s != GLOBAL_RZ) describe(addr);
  __builtin_trap();
}

#define REP(n)                                                     \
  void __asan_report_load##n(uintptr_t a) { report(0, a, n, 0); } \
  void __asan_report_store##n(uintptr_t a) { report(0, a, n, 1); }
REP(1)
REP(2)
REP(4)
REP(8)
REP(16)
void __asan_report_load_n(uintptr_t a, size_t n) { report(0, a, n, 0); }
void __asan_report_store_n(uintptr_t a, size_t n) { report(0, a, n, 1); }

struct asan_global {
  uintptr_t beg;
  size_t size, size_with_redzone;
  const char *name, *module;
  uintptr_t has_dynamic_init;
  void *loc;
  uintptr_t odr;
};
void __asan_register_globals(struct asan_global *g, size_t n) {
  for (size_t i = 0; i < n; i++) {
    uintptr_t end = g[i].beg + ((g[i].size + 7) & ~(size_t)7);
    unpoison(g[i].beg, g[i].size);
    poison(end, g[i].beg + g[i].size_with_redzone - end, GLOBAL_RZ);
  }
}
void __asan_unregister_globals(struct asan_global *g, size_t n) { (void)g, (void)n; }
void __asan_version_mismatch_check_v8(void) {}
void __asan_handle_no_return(void) {}

static int bad(uintptr_t p) {
  if (p < SHADOW_END) return 1;
  int8_t s = *SHADOW(p);
  return s && (s < 0 || (int8_t)(p & 7) >= s);
}
static void check(const void *p, size_t n, int write) {
  for (uintptr_t a = (uintptr_t)p; a < (uintptr_t)p + n; a++)
    if (bad(a)) report(0, a, 1, write);
}
void *__asan_memcpy(void *d, const void *s, size_t n) { return check(s, n, 0), check(d, n, 1), memcpy(d, s, n); }
void *__asan_memmove(void *d, const void *s, size_t n) { return check(s, n, 0), check(d, n, 1), memmove(d, s, n); }
void *__asan_memset(void *d, int c, size_t n) { return check(d, n, 1), memset(d, c, n); }

/* libc instrumentatsiyasiz: tez-tez ishlatiladigan satr funksiyalari shu yerda tekshiriladi. */
char *__real_strcpy(char *, const char *);
char *__real_strcat(char *, const char *);
size_t __real_strlen(const char *);
static size_t safe_strlen(const char *s) {
  size_t n = 0;
  while (check(s + n, 1, 0), s[n]) n++;
  return n;
}
size_t __wrap_strlen(const char *s) { return safe_strlen(s); }
char *__wrap_strcpy(char *d, const char *s) { return check(d, safe_strlen(s) + 1, 1), __real_strcpy(d, s); }
char *__wrap_strcat(char *d, const char *s) {
  size_t dl = safe_strlen(d), sl = safe_strlen(s);
  return check(d + dl, sl + 1, 1), __real_strcat(d, s);
}

/* UBSan: birinchi argument manba joyi, qolganlari qiymatlar. wasm'da imzo aniq mos kelishi shart. */
struct src_loc;
typedef uintptr_t V;
static void ub(const char *what) {
  fflush(stdout);
  fprintf(stderr, "\nUNDEFINED BEHAVIOR: %s\n", what);
  __builtin_trap();
}
#define UB2(name, msg) \
  void __ubsan_handle_##name##_abort(const struct src_loc *l, V a, V b) { (void)l, (void)a, (void)b, ub(msg); }
#define UB1(name, msg) \
  void __ubsan_handle_##name##_abort(const struct src_loc *l, V a) { (void)l, (void)a, ub(msg); }
#define UB0(name, msg) \
  void __ubsan_handle_##name##_abort(const struct src_loc *l) { (void)l, ub(msg); }
UB2(add_overflow, "signed integer overflow (+): natija tip sig'imidan chiqdi")
UB2(sub_overflow, "signed integer overflow (-): natija tip sig'imidan chiqdi")
UB2(mul_overflow, "signed integer overflow (*): natija tip sig'imidan chiqdi")
UB1(negate_overflow, "signed integer overflow: eng kichik sonning manfiysi tipga sig'maydi")
UB2(divrem_overflow, "nolga bo'lish (yoki INT_MIN / -1)")
UB2(shift_out_of_bounds, "bit siljitish chegaradan tashqarida")
UB1(load_invalid_value, "o'zgaruvchida noto'g'ri qiymat (bool/enum)")
UB1(float_cast_overflow, "float'dan butun songa o'tkazishda sig'imdan chiqish")
UB2(pointer_overflow, "pointer arifmetikasi sig'imdan chiqdi")
UB1(vla_bound_not_positive, "massiv o'lchami musbat emas")
UB0(invalid_builtin, "builtin funksiyaga noto'g'ri argument")
UB0(nonnull_arg, "NULL bo'lmasligi kerak bo'lgan argumentga NULL berildi")
UB1(nonnull_return_v1, "NULL qaytarmasligi kerak bo'lgan funksiya NULL qaytardi")
void __ubsan_handle_missing_return(const struct src_loc *l) { (void)l, ub("funksiya qiymat qaytarmasdan tugadi (return yo'q)"); }
void __ubsan_handle_builtin_unreachable(const struct src_loc *l) { (void)l, ub("__builtin_unreachable ga yetib kelindi"); }

/* Leak hisoboti: cs50 kutubxonasi ajratgan satrlar hisobga kirmaydi (asl CS50 ularni o'zi bo'shatadi). */
static void leaks(void) {
  fflush(stdout);
  if (live_blocks > 0)
    fprintf(stderr, "\nXOTIRA: %zu bayt bo'shatilmagan, %ld ta blokda (%ld ta malloc, %ld ta free). Har malloc uchun free kerak.\n",
            live_bytes, live_blocks, allocs, frees);
}

/* stdout buferlanmaydi: printf("a: ") so'rovi scanf'dan oldin ko'rinsin (worker chiqishni o'zi guruhlaydi). */
__attribute__((constructor)) static void unbuffered_stdout(void) { setvbuf(stdout, NULL, _IONBF, 0); }

void __asan_init(void) {
  static int done;
  if (done) return;
  done = 1;
  /* Shadow'ning o'zi va NULL atrofi: murojaat taqiqlangan. */
  poison(0, SHADOW_END, LOW);
  atexit(leaks);
}

/* ---- cs50.h ---- */

typedef char *string;

/* Bitta qator o'qish ('\n' siz). EOF va bo'sh qolganda NULL. */
static char *read_line(const char *format, va_list ap) {
  if (format) {
    vprintf(format, ap);
    fflush(stdout);
  }
  size_t cap = 64, n = 0;
  char *s = alloc(cap, 1);
  int c;
  while ((c = getchar()) != EOF && c != '\n') {
    if (c == '\r') continue;
    if (n + 1 == cap) s = __wrap_realloc(s, cap *= 2);
    s[n++] = (char)c;
  }
  if (c == EOF && n == 0) {
    __wrap_free(s);
    /* Kirish tugagan, dastur esa so'rashda davom etyapti (masalan do-while get_int) - cheksiz siklning oldini olish. */
    static int eofs;
    if (++eofs == 10) {
      fflush(stdout);
      fprintf(stderr, "\nDastur yana kirish kutmoqda, lekin kirish tugadi. Kirish (stdin) maydoniga qator qo'shing.\n");
      exit(1);
    }
    return NULL;
  }
  s[n] = '\0';
  return s;
}

string get_string(const char *format, ...) {
  va_list ap;
  va_start(ap, format);
  string s = read_line(format, ap);
  va_end(ap);
  return s;
}

/* Raqamli get_* lar: noto'g'ri kiritilsa qayta so'raydi (asl CS50 kabi), EOF da *_MAX qaytaradi. */
static long long parse_int(const char *s, long long lo, long long hi, int *ok) {
  char *e;
  errno = 0;
  long long v = strtoll(s, &e, 10);
  *ok = *s && !isspace((unsigned char)*s) && !*e && !errno && v >= lo && v < hi;
  return v;
}
static double parse_real(const char *s, int *ok) {
  char *e;
  errno = 0;
  double v = strtod(s, &e);
  *ok = *s && !isspace((unsigned char)*s) && !*e && !errno && isfinite(v) && !strpbrk(s, "xX");
  return v;
}

#define GET(type, name, MAX, expr)       \
  type name(const char *format, ...) {   \
    for (;;) {                           \
      va_list ap;                        \
      va_start(ap, format);              \
      char *s = read_line(format, ap);   \
      va_end(ap);                        \
      if (!s) return MAX;                \
      int ok;                            \
      type v = (type)(expr);             \
      __wrap_free(s);                    \
      if (ok) return v;                  \
    }                                    \
  }
GET(int, get_int, INT_MAX, parse_int(s, INT_MIN, INT_MAX, &ok))
GET(long, get_long, LONG_MAX, parse_int(s, LONG_MIN, LONG_MAX, &ok))
GET(double, get_double, DBL_MAX, parse_real(s, &ok))
GET(float, get_float, FLT_MAX, parse_real(s, &ok))
GET(char, get_char, CHAR_MAX, (ok = s[0] && !s[1], s[0]))
