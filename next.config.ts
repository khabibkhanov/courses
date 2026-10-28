import type { NextConfig } from "next";
import { listCourses, syllabus } from "./src/lib/content";

// Eski manzillar (alohida saytlar davri) yangi tuzilmaga yo'naltiriladi:
// - Clean Code: /clean-code/<slug> -> /clean-code/dars/<n>
// - System Design eski ildizi: /dars/<n> -> /system-design/dars/<n>
function legacyRedirects() {
  const slugRoutes = listCourses().flatMap((c) =>
    syllabus(c)
      .filter((l) => l.slug)
      .map((l) => ({ source: `/${c.slug}/${l.slug}`, destination: `/${c.slug}/dars/${l.n}`, permanent: true })),
  );
  return [...slugRoutes, { source: "/dars/:n(\\d+)", destination: "/system-design/dars/:n", permanent: true }];
}

const nextConfig: NextConfig = {
  async redirects() {
    return legacyRedirects();
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
