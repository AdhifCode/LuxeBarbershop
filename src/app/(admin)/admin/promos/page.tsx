import PageHeader from "@/components/layout/admin/PageHeader";
import PromosManager from "@/components/admin/PromosManager";
import { listPromos } from "@/server/actions/promos";

export const dynamic = "force-dynamic";

export default async function AdminPromosPage() {
  const res = await listPromos();
  const promos = res.ok ? res.data : [];

  return (
    <>
      <PageHeader
        title="Promos"
        description="Buat kode promo aktif, atur tipe diskon, dan rentang waktu berlaku."
      />
      <PromosManager promos={promos} />
    </>
  );
}
