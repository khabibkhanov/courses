import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { listCourses } from "./content";
import { SITE } from "./site";

/** Ulashish rasmi (Telegram, X, LinkedIn kartochkasi): 1200x630. */
export const OG_SIZE = { width: 1200, height: 630 };

const FONTS = path.join(process.cwd(), "node_modules/@fontsource/ibm-plex-sans/files");

/** Sarlavha uzunligiga qarab shrift o'lchami: uzun dars nomlari ham sig'sin. */
const titleSize = (t: string) => (t.length > 70 ? 52 : t.length > 40 ? 62 : 76);

export async function ogImage({ eyebrow, title, color }: { eyebrow: string; title: string; color?: string }) {
  const [regular, semibold] = await Promise.all(
    ["400", "600"].map((w) => fs.readFile(path.join(FONTS, `ibm-plex-sans-latin-${w}-normal.woff`))),
  );
  // Rang berilmasa - uchala kurs liniyasi (logotipdagi kabi).
  const lines = color ? [color] : listCourses().map((c) => c.color);
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "#f6f7f9", padding: "64px 72px", fontFamily: "Plex" }}>
        <div style={{ display: "flex", gap: 12 }}>
          {lines.map((c) => (
            <div key={c} style={{ width: 120, height: 12, borderRadius: 6, background: c }} />
          ))}
        </div>
        <div style={{ display: "flex", marginTop: 56, fontSize: 30, color: "#5b6471" }}>{eyebrow}</div>
        <div style={{ display: "flex", marginTop: 16, fontSize: titleSize(title), fontWeight: 600, lineHeight: 1.12, color: "#161a20", letterSpacing: -1 }}>
          {title}
        </div>
        <div style={{ display: "flex", marginTop: "auto", fontSize: 30, fontWeight: 600, color: "#161a20" }}>{SITE.name}</div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Plex", data: regular, weight: 400 },
        { name: "Plex", data: semibold, weight: 600 },
      ],
    },
  );
}
