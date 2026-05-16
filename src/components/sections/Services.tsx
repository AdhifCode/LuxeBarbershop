import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ServicesGrid from "@/components/sections/ServicesGrid";
import { getActiveServices } from "@/server/db/queries";
import { SERVICES as FALLBACK_SERVICES } from "@/lib/data";
import type { ServiceRow } from "@/types/database";

export default async function Services() {
  let services: ServiceRow[] = [];
  try {
    services = await getActiveServices();
  } catch {
    services = [];
  }

  // Fallback to seed data if DB is unreachable / empty (e.g. before Supabase is wired)
  const items =
    services.length > 0
      ? services
      : FALLBACK_SERVICES.map((s, i) => ({
          id: s.id,
          slug: s.id,
          title: s.title,
          description: s.description,
          price: parsePrice(s.price),
          duration_min: parseDuration(s.duration),
          is_active: true,
          is_featured: !!s.featured,
          sort_order: i,
          image_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

  return (
    <section
      id="services"
      className="relative section-padding overflow-hidden bg-navy"
    >
      <div
        className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-gold/5 blur-[120px]"
        aria-hidden="true"
      />

      <Container>
        <SectionHeading
          eyebrow="Our Services"
          title="Crafted For The Modern Gentleman"
          subtitle="Setiap layanan dirancang dengan presisi dan dieksekusi oleh barber berpengalaman. Pilih layanan yang sesuai dengan gaya hidup Anda."
        />

        <ServicesGrid services={items} />

        <div className="mt-14 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-mutedgray">
            Butuh paket custom atau layanan khusus?
          </p>
          <Link
            href="#booking"
            className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-luxe text-gold"
          >
            Konsultasi Dengan Kami
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

function parsePrice(p: string): number {
  // "Rp 75.000" -> 75000
  return Number(p.replace(/[^\d]/g, "")) || 0;
}

function parseDuration(d: string): number {
  // "45 min" -> 45
  return Number(d.replace(/[^\d]/g, "")) || 30;
}
