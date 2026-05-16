import PageHeader from "@/components/layout/admin/PageHeader";
import BarbersManager from "@/components/admin/BarbersManager";
import { listBarbers } from "@/server/actions/barbers";

export const dynamic = "force-dynamic";

export default async function AdminBarbersPage() {
  const res = await listBarbers();
  const barbers = res.ok ? res.data : [];

  return (
    <>
      <PageHeader
        title="Barbers"
        description="Kelola capster, foto profil, keahlian, dan status aktif."
      />
      <BarbersManager barbers={barbers} />
    </>
  );
}
