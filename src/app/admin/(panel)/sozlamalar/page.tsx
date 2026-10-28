import { PASSWORD_MIN, requireAdmin } from "@/lib/auth";
import { CredentialsForm } from "@/components/admin-forms";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const username = await requireAdmin();
  return (
    <>
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Sozlamalar</h1>
      <p className="mb-8 max-w-[60ch] text-muted">
        Login va parolni o&apos;zgartirish. Parol kamida {PASSWORD_MIN} belgi. Parol o&apos;zgarganda boshqa qurilmalardagi
        sessiyalar yopiladi.
      </p>
      <CredentialsForm username={username} min={PASSWORD_MIN} />
    </>
  );
}
