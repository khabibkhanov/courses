import { OG_SIZE, ogImage } from "@/lib/og";
import { SITE } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = SITE.name;

export default function Image() {
  return ogImage({ eyebrow: "O'zbek tilidagi dasturlash kurslari", title: "Computer science, toza kod va system design" });
}
