import PageHeader from "@/components/layout/admin/PageHeader";
import GalleryManager from "@/components/admin/GalleryManager";
import { listGallery } from "@/server/actions/gallery";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const res = await listGallery();
  const items = res.ok ? res.data : [];

  return (
    <>
      <PageHeader
        title="Gallery"
        description="Kelola foto lookbook publik. Drag-style sorting via 'Sort order'."
      />
      <GalleryManager items={items} />
    </>
  );
}
