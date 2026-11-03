import type { Metadata } from "next";
import Link from "next/link";
import { faqItems } from "@/lib/faq";
import { FaqList } from "@/components/faq-list";

export const metadata: Metadata = {
  title: "Ko'p so'raladigan savollar",
  description: "Narx, progress, kodni brauzerda ishga tushirish, testlar va ma'lumotlar haqida javoblar.",
};

export default function FaqPage() {
  const items = faqItems();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 pb-24">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ko&apos;p so&apos;raladigan savollar</h1>
      <p className="mt-3 max-w-[62ch] leading-relaxed text-muted">
        Javobini topmasangiz, darsdagi matnni belgilab izoh qoldiring yoki{" "}
        <Link href="/haqida" className="underline underline-offset-4 hover:no-underline">
          platforma haqida
        </Link>{" "}
        sahifasini ko&apos;ring.
      </p>
      <div className="mt-10">
        <FaqList items={items} />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </div>
  );
}
