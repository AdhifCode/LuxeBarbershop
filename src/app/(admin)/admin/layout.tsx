import { requireAdmin } from "@/lib/auth/guard";
import Sidebar from "@/components/layout/admin/Sidebar";
import Topbar from "@/components/layout/admin/Topbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-charcoal-100 text-offwhite">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar user={user} />
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
