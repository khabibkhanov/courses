// Single source of truth for the hub: the home page lists these,
// and next.config.ts builds the multi-zone rewrites from them.
// Adding a course = one entry here + basePath/assetPrefix in that course's app.

export type Course = {
  /** URL segment on the hub, e.g. /system-design */
  slug: string;
  title: string;
  description: string;
  lessons: number;
  modules: number;
  /** Production origin of the course's own Vercel project */
  origin: string;
  /** Prefix the zone serves its /_next assets under (basePath or assetPrefix) */
  assetPrefix: string;
};

export const courses: Course[] = [
  {
    slug: "system-design",
    title: "System Design",
    description:
      "Talablar va trade-offlardan storage internals, masshtablash, distributed systems, messaging, ishonchlilik va case study'largacha.",
    lessons: 100,
    modules: 10,
    origin: "https://system-design-uz.vercel.app",
    assetPrefix: "/system-design",
  },
  {
    slug: "clean-code",
    title: "Clean Code",
    description:
      "Nomlash, funksiyalar, modullar, refactoring, test va arxitektura: Martin, Ousterhout, Fowler, Beck va ularning tanqidlari asosida.",
    lessons: 100,
    modules: 10,
    origin: "https://clean-code-khaki.vercel.app",
    assetPrefix: "/clean-code-static",
  },
];
