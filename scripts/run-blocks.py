# Darslardagi ```<til> run bloklarini lokal runtime'larda ishga tushiradi (brauzerdagi natijaga yaqin).
# python -> python3, sql -> sqlite3, js/ts -> node + sucrase (brauzerdagi kabi).
# Ishlatish: python3 scripts/run-blocks.py content/system-design/056.md [boshqa fayllar...]
import json
import os
import re
import sqlite3
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FENCE = re.compile(r"^```(\w+)([^\n]*)\n(.*?)^```", re.S | re.M)
LANG = {"python": "python", "py": "python", "sql": "sql", "js": "js", "javascript": "js", "ts": "ts", "typescript": "ts"}

NODE_RUNNER = r"""
const { transform } = require("sucrase");
const [code, ts] = [process.argv[1], process.argv[2] === "1"];
const src = transform(code, { transforms: ts ? ["typescript", "imports"] : ["imports"], disableESTransforms: true }).code;
const exports = {}; const require2 = (m) => { throw new Error("import/require bu yerda ishlamaydi: " + m); };
new Function("console", "exports", "require", '"use strict"; return (async () => {\n' + src + '\n})()')(console, exports, require2)
  .catch((e) => { console.error(String(e && e.stack || e)); process.exitCode = 1; });
"""


def run_python(code, extra=""):
    p = subprocess.run([sys.executable, "-I", "-c", code + ("\n" + extra if extra else "")], capture_output=True, text=True, timeout=15)
    return p.returncode == 0, (p.stdout + p.stderr).strip()


def run_js(code, ts):
    p = subprocess.run(["node", "-e", NODE_RUNNER, code, "1" if ts else "0"], capture_output=True, text=True, timeout=10, cwd=ROOT)
    return p.returncode == 0, (p.stdout + p.stderr).strip()


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
            tests = blocks[i + 1][2] if i + 1 < len(blocks) and re.search(r"(^|\s)test(\s|$)", blocks[i + 1][1]) else None
            if kind == "python":
                ok, out = run_python(code)
            elif kind == "sql":
                ok, out = run_sql(code)
            elif kind in ("js", "ts"):
                ok, out = run_js(code, kind == "ts")
            else:
                ok, out = False, f"qo'llab-quvvatlanmaydigan til: {lang}"
            bad += not ok
            print(f"=== {os.path.relpath(f, ROOT)} [{lang} run] {'OK' if ok else 'XATO'}")
            print("\n".join(out.splitlines()[:25]))
            if tests is not None:
                print(f"    (test bloki bor: {len(tests.splitlines())} qator)")
    print(f"\n{bad} ta blokda xato")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main(sys.argv[1:])
