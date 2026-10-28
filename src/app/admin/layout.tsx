import type { Metadata } from "next";
import { AdminNav } from "@/components/admin-nav";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <AdminNav />
      {children}
    </div>
  );
}
