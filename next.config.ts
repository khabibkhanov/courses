import type { NextConfig } from "next";
import { courses } from "./src/courses";

// Multi-zones: each course is its own Vercel project; the hub proxies its paths.
// https://nextjs.org/docs/app/guides/multi-zones
const zoneRewrites = courses.flatMap(({ slug, origin, assetPrefix }) => {
  const prefixes = [...new Set([`/${slug}`, assetPrefix])];
  return prefixes.flatMap((p) => [
    { source: p, destination: `${origin}${p}` },
    { source: `${p}/:path+`, destination: `${origin}${p}/:path+` },
  ]);
});

const nextConfig: NextConfig = {
  async rewrites() {
    return zoneRewrites;
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
