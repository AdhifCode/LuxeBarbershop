import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import BookingWidget from "@/components/sections/BookingWidget";
import { getActiveServices, getActiveBarbers } from "@/server/db/queries";
import { SERVICES as FALLBACK_SERVICES } from "@/lib/data";
import type { ServiceRow } from "@/types/database";
import { BUSINESS } from "@/lib/constants";

export default async function Booking() {
  let services: ServiceRow[] = [];
  let barbers: Awaited<ReturnType<typeof getActiveBarbers>> = [];
  try {
    [services, barbers] = await Promise.all([
      getActiveServices(),
      getActiveBarbers(),
    ]);
  } catch {
    // DB unreachable — fall back to seed data
    services = [];
    barbers = [];
  }

  // Fallback for first-run before Supabase is wired
  const finalServices: ServiceRow[] =
    services.length > 0
      ? services
      : FALLBACK_SERVICES.map((s, i) => ({
          id: s.id,
          slug: s.id,
          title: s.title,
          description: s.description,
          price: Number(s.price.replace(/[^\d]/g, "")) || 0,
          duration_min: Number(s.duration.replace(/[^\d]/g, "")) || 30,
          is_active: true,
          is_featured: !!s.featured,
          sort_order: i,
          image_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

  const usingFallback = services.length === 0;

  return (
    <section
      id="booking"
      className="relative section-padding overflow-hidden bg-navy"
    >
      <div
        className="pointer-events-none absolute -right-32 top-1/4 h-[400px] w-[400px] rounded-full bg-gold/5 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-1/4 h-[400px] w-[400px] rounded-full bg-gold/5 blur-[140px]"
        aria-hidden="true"
      />

      <Container>
        <SectionHeading
          eyebrow="Reservation"
          title="Book Your Luxe Experience"
          subtitle="Pilih layanan, capster, dan jam yang tersedia. Reservasi Anda akan langsung dikirim ke WhatsApp admin untuk konfirmasi cepat."
        />

        <div className="mt-16">
          <BookingWidget
            services={finalServices}
            barbers={barbers}
            phoneDisplay={BUSINESS.phoneDisplay}
            whatsapp={BUSINESS.whatsapp}
            shopHours={BUSINESS.hoursShort}
            offlineMode={usingFallback}
          />
        </div>
      </Container>
    </section>
  );
}
