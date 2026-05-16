import PageHeader from "@/components/layout/admin/PageHeader";
import InventoryManager from "@/components/admin/InventoryManager";
import { listInventoryItems } from "@/server/actions/inventory";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const res = await listInventoryItems();
  const items = res.ok ? res.data : [];

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Lacak stok pomade, shampoo, dan supply lainnya. Catat IN/OUT/ADJUST untuk update otomatis."
      />
      <InventoryManager items={items} />
    </>
  );
}
