import type { MetadataRoute } from "next";
import { listCourses, publishedNumbers } from "@/lib/content";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/lugat"].map((p) => ({ url: `${SITE.url}${p}`, priority: p ? 0.6 : 1 }));
  for (const c of listCourses()) {
    pages.push({ url: `${SITE.url}/${c.slug}`, priority: 0.9 });
    for (const n of publishedNumbers(c)) pages.push({ url: `${SITE.url}/${c.slug}/dars/${n}`, priority: 0.7 });
  }
  return pages;
}
