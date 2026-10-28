import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin-nav";
import { logoutAction } from "../actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-rule">
        <AdminNav />
        <form action={logoutAction} className="flex items-center gap-3 pb-3 text-sm">
          <span className="text-muted">{user}</span>
          <button className="rounded-md border border-rule px-3 py-1 hover:border-muted">Chiqish</button>
        </form>
      </div>
      {children}
    </>
  );
}
