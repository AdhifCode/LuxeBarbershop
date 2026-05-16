import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import LookbookGrid from "@/components/sections/LookbookGrid";
import { getPublishedGallery } from "@/server/db/queries";
import { GALLERY as FALLBACK_GALLERY } from "@/lib/data";
import type { GalleryRow } from "@/types/database";

export default async function Lookbook() {
  let items: GalleryRow[] = [];
  try {
    items = await getPublishedGallery();
  } catch {
    items = [];
  }

  // Fallback to seed data when DB is unreachable / empty
  const list: GalleryRow[] =
    items.length > 0
      ? items
      : FALLBACK_GALLERY.map((g, i) => ({
          id: g.id,
          title: g.title,
          category: g.category.toUpperCase() as GalleryRow["category"],
          before_url: null,
          after_url: g.src,
          barber_id: null,
          is_published: true,
          sort_order: i,
          created_at: new Date().toISOString(),
        }));

  return (
    <section
      id="gallery"
      className="relative section-padding bg-charcoal overflow-hidden"
    >
      <Container>
        <SectionHeading
          eyebrow="The Lookbook"
          title="Trendy Cuts. Timeless Style."
          subtitle="Eksplorasi gaya rambut yang dieksekusi dengan presisi. Mid fade, mullet, classic, hingga warna premium — semua tersedia di sini."
        />
        <LookbookGrid items={list} />
      </Container>
    </section>
  );
}
