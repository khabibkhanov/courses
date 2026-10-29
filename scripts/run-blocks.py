# Darslardagi ```<til> run bloklarini lokal runtime'larda ishga tushiradi (brauzerdagi natijaga yaqin).
# python -> python3, sql -> sqlite3, js/ts -> node + sucrase (brauzerdagi kabi), c -> lokal clang (sanitizer'siz: lokal ASan kutubxonasi bo'lmasligi mumkin).
# C uchun keyingi ```text stdin bloki dasturga kirish sifatida beriladi; public/c/cs50.h o'rniga lokal libcs50 kerak emas:
# cs50.h funksiyalari public/c/runtime.c da, u ham birga kompilyatsiya qilinadi.
# Ortidan ```<til> test bloki kelsa, u ham brauzerdagi kabi check(nom, fn) bilan ishga tushiriladi.
# Ishlatish: python3 scripts/run-blocks.py content/system-design/056.md [boshqa fayllar...]
import json
import os
import re
import sqlite3
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FENCE = re.compile(r"^```(\w+)([^\n]*)\n(.*?)^```", re.S | re.M)
LANG = {"python": "python", "py": "python", "sql": "sql", "js": "js", "javascript": "js", "ts": "ts", "typescript": "ts", "c": "c"}

NODE_RUNNER = r"""
const { transform } = require("sucrase");
const [code, ts] = [process.argv[1], process.argv[2] === "1"];
const src = transform(code, { transforms: ts ? ["typescript", "imports"] : ["imports"], disableESTransforms: true }).code;
const pending = [];
const check = (name, fn) => pending.push((async () => {
  try { const ok = Boolean(await fn()); console.log(`${ok ? "TEST OK " : "TEST XATO"} ${name}`); if (!ok) process.exitCode = 1; }
  catch (e) { console.log(`TEST XATO ${name} - ${e}`); process.exitCode = 1; }
})());
const exports = {}; const require2 = (m) => { throw new Error("import/require bu yerda ishlamaydi: " + m); };
new Function("console", "exports", "require", "check", '"use strict"; return (async () => {\n' + src + '\n})()')(console, exports, require2, check)
  .then(() => Promise.all(pending))
  .catch((e) => { console.error(String(e && e.stack || e)); process.exitCode = 1; });
"""


PY_CHECK = """
def check(name, fn):
    try:
        ok, err = bool(fn()), None
    except Exception as e:
        ok, err = False, f"{type(e).__name__}: {e}"
    print(("TEST OK  " if ok else "TEST XATO") + " " + name + (f" - {err}" if err else ""))
    if not ok:
        _failed.append(name)
_failed = []
"""
PY_EXIT = "\nimport sys as _s\n_s.exit(1 if _failed else 0)\n"


def run_python(code, extra=""):
    p = subprocess.run([sys.executable, "-I", "-c", code + ("\n" + extra if extra else "")], capture_output=True, text=True, timeout=30)
    return p.returncode == 0, (p.stdout + p.stderr).strip()


def run_js(code, ts):
    p = subprocess.run(["node", "-e", NODE_RUNNER, code, "1" if ts else "0"], capture_output=True, text=True, timeout=10, cwd=ROOT)
    return p.returncode == 0, (p.stdout + p.stderr).strip()


def run_c(code, stdin):
    import tempfile
    with tempfile.TemporaryDirectory() as d:
        src = os.path.join(d, "main.c")
        open(src, "w").write(code)
        # cs50.h dagi funksiyalar: brauzer runtime'idagi kabi (malloc wrapper'larisiz).
        cs50 = os.path.join(d, "cs50.c")
        open(cs50, "w").write(CS50_C)
        exe = os.path.join(d, "a.out")
        c = subprocess.run(["clang", "-O0", "-g", "-Wall", "-I", os.path.join(ROOT, "public", "c"), src, cs50, "-lm", "-o", exe], capture_output=True, text=True)
        if c.returncode:
            return False, c.stderr.strip()
        p = subprocess.run([exe], input=stdin or "", capture_output=True, text=True, timeout=10)
        return p.returncode == 0, ((c.stderr + "\n") if c.stderr else "") + (p.stdout + p.stderr).strip()


CS50_C = r"""
#include <cs50.h>
#include <ctype.h>
#include <errno.h>
#include <math.h>
#include <stdarg.h>
#include <stdio.h>
#include <string.h>
static char *line(const char *f, va_list ap) {
    if (f) { vprintf(f, ap); fflush(stdout); }
    size_t cap = 64, n = 0; char *s = malloc(cap); int c;
    while ((c = getchar()) != EOF && c != '\n') { if (n + 1 == cap) s = realloc(s, cap *= 2); s[n++] = (char)c; }
    if (c == EOF && n == 0) { free(s); return NULL; }
    s[n] = 0; return s;
}
#define READ va_list ap; va_start(ap, f); char *s = line(f, ap); va_end(ap)
string get_string(const char *f, ...) { READ; return s; }
int get_int(const char *f, ...) { for (;;) { READ; if (!s) return INT_MAX; char *e; errno = 0; long v = strtol(s, &e, 10);
    int ok = *s && !*e && !errno && v >= INT_MIN && v < INT_MAX; free(s); if (ok) return (int)v; } }
long get_long(const char *f, ...) { for (;;) { READ; if (!s) return LONG_MAX; char *e; errno = 0; long v = strtol(s, &e, 10);
    int ok = *s && !*e && !errno && v < LONG_MAX; free(s); if (ok) return v; } }
double get_double(const char *f, ...) { for (;;) { READ; if (!s) return DBL_MAX; char *e; double v = strtod(s, &e);
    int ok = *s && !*e && isfinite(v); free(s); if (ok) return v; } }
float get_float(const char *f, ...) { for (;;) { READ; if (!s) return FLT_MAX; char *e; float v = strtof(s, &e);
    int ok = *s && !*e && isfinite(v); free(s); if (ok) return v; } }
char get_char(const char *f, ...) { for (;;) { READ; if (!s) return CHAR_MAX; int ok = s[0] && !s[1]; char c = s[0]; free(s); if (ok) return c; } }
"""


def run_sql(code):
    db = sqlite3.connect(":memory:")
    out, buf = [], ""
    try:
        for line in code.splitlines(keepends=True):
            buf += line
            if sqlite3.complete_statement(buf):
                cur = db.execute(buf)
                rows = cur.fetchall()
                if cur.description:
                    out.append(" | ".join(d[0] for d in cur.description))
                    out += [" | ".join(map(str, r)) for r in rows]
                    out.append(f"({len(rows)} qator)")
                buf = ""
        return True, "\n".join(out) or "(natija yo'q)"
    except Exception as e:  # noqa: BLE001 - xabarni ko'rsatish kifoya
        return False, f"{e}\n" + "\n".join(out)


def main(files):
    bad = 0
    for f in files:
        text = open(f, encoding="utf8").read()
        blocks = [(m.group(1), m.group(2), m.group(3)) for m in FENCE.finditer(text)]
        for i, (lang, meta, code) in enumerate(blocks):
            if not re.search(r"(^|\s)run(\s|$)", meta):
                continue
            kind = LANG.get(lang)
            # Keyingi test va stdin bloklari (orasida matn bo'lmasligini validator tekshiradi).
            tests = stdin = None
            for _, m2, c2 in blocks[i + 1 : i + 3]:
                if re.search(r"(^|\s)test(\s|$)", m2) and tests is None:
                    tests = c2
                elif re.search(r"(^|\s)stdin(\s|$)", m2) and stdin is None:
                    stdin = c2
                else:
                    break
            if kind == "python" and tests is not None:
                ok, out = run_python(PY_CHECK + code, tests + PY_EXIT)
            elif kind == "python":
                ok, out = run_python(code)
            elif kind == "sql":
                ok, out = run_sql(code)
            elif kind == "c":
                ok, out = run_c(code, stdin)
            elif kind in ("js", "ts"):
                ok, out = run_js(code + ("\n;\n" + tests if tests is not None else ""), kind == "ts")
            else:
                ok, out = False, f"qo'llab-quvvatlanmaydigan til: {lang}"
            bad += not ok
            print(f"=== {os.path.relpath(f, ROOT)} [{lang} run] {'OK' if ok else 'XATO'}")
            print("\n".join(out.splitlines()[:25]))
    print(f"\n{bad} ta blokda xato")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main(sys.argv[1:])
