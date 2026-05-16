import Link from "next/link";
import { Sparkles, Tag } from "lucide-react";
import Container from "@/components/ui/Container";
import { getActivePromos } from "@/server/db/queries";
import { formatRupiah } from "@/lib/utils";
import type { PromoRow } from "@/types/database";

export default async function PromoBanner() {
  let promos: PromoRow[] = [];
  try {
    promos = await getActivePromos();
  } catch {
    promos = [];
  }
  if (!promos || promos.length === 0) return null;

  const promo = promos[0]; // show the soonest-ending active promo

  const valueLabel =
    promo.type === "PERCENTAGE"
      ? `${promo.value}% OFF`
      : `${formatRupiah(promo.value)} OFF`;

  const ends = new Date(promo.ends_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="relative overflow-hidden border-y border-gold/15 bg-gradient-to-r from-navy-900 via-navy to-navy-900">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 50%, rgba(212,175,55,0.18), transparent 40%), radial-gradient(circle at 80% 50%, rgba(212,175,55,0.12), transparent 40%)",
        }}
        aria-hidden="true"
      />
      <Container>
        <div className="relative flex flex-col items-center gap-4 py-5 text-center md:flex-row md:justify-between md:gap-6 md:py-4 md:text-left">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
              <Sparkles className="h-4 w-4 text-gold" strokeWidth={1.6} />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-luxe text-gold">
                Limited Time · Berakhir {ends}
              </p>
              <p className="mt-0.5 font-display text-base text-offwhite md:text-lg">
                {promo.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5">
              <Tag className="h-3.5 w-3.5 text-gold" strokeWidth={1.8} />
              <span className="font-mono text-xs text-gold">{promo.code}</span>
              <span className="ml-1 font-display text-sm text-offwhite">
                · {valueLabel}
              </span>
            </div>
            <Link
              href="#booking"
              className="text-xs font-medium uppercase tracking-luxe text-gold transition-colors hover:text-gold-light"
            >
              Klaim →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
