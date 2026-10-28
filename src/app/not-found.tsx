import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Bu sahifa topilmadi</h1>
      <p className="mt-3 max-w-[60ch] text-muted">
        Manzil o&apos;zgargan yoki dars hali yozilmagan bo&apos;lishi mumkin. Kurslar ro&apos;yxatidan kerakli darsni
        toping.
      </p>
      <Link href="/" className="mt-6 inline-block font-medium underline underline-offset-4">
        Kurslar ro&apos;yxatiga qaytish
      </Link>
    </div>
  );
}
