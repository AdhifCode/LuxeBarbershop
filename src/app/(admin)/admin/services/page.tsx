import PageHeader from "@/components/layout/admin/PageHeader";
import ServicesManager from "@/components/admin/ServicesManager";
import { listServices } from "@/server/actions/services";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const res = await listServices();
  const services = res.ok ? res.data : [];

  return (
    <>
      <PageHeader
        title="Services"
        description="Kelola layanan, harga, durasi, dan status aktif. Perubahan langsung tampil di halaman publik."
      />
      <ServicesManager services={services} />
    </>
  );
}
