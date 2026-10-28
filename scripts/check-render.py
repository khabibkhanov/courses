# Ishlab turgan serverda barcha darslarni ochib, chizilmagan mermaid diagrammalar va JS xatolarni topadi.
# Ishlatish: python3 scripts/check-render.py http://localhost:3000 [kurs] [from] [to]
import glob
import os
import re
import sys
from playwright.sync_api import sync_playwright

base = sys.argv[1].rstrip("/")
only = sys.argv[2] if len(sys.argv) > 2 else None
lo, hi = (int(sys.argv[3]), int(sys.argv[4])) if len(sys.argv) > 4 else (1, 10**6)
root = os.path.join(os.path.dirname(__file__), "..", "content")

targets = []
for course in sorted(os.listdir(root)):
    if only and course != only:
        continue
    files = glob.glob(os.path.join(root, course, "[0-9][0-9][0-9].md")) + glob.glob(os.path.join(root, course, "lessons", "[0-9][0-9][0-9]-*.md"))
    for f in sorted(files):
        n = int(re.match(r"(\d{3})", os.path.basename(f)).group(1))
        if lo <= n <= hi:
            targets.append((course, n, open(f, encoding="utf8").read().count("```mermaid")))

bad = 0
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    for course, n, expected in targets:
        errors.clear()
        page.goto(f"{base}/{course}/dars/{n}", wait_until="networkidle")
        if expected:
            page.wait_for_function(f"document.querySelectorAll('pre.mermaid[data-done]').length >= {expected}", timeout=20000)
        ok = page.locator("pre.mermaid[data-done]:not([data-error]) svg").count()
        if ok < expected or errors:
            bad += 1
            print(f"{course}#{n}: mermaid {ok}/{expected}, errors={errors[:2]}")
    browser.close()
print(f"{len(targets)} dars tekshirildi, {bad} tasida muammo")
sys.exit(1 if bad else 0)
