import { formatRupiah } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import { Sparkles } from "lucide-react";

interface Item {
  service_title: string;
  count: number;
  revenue: number;
}

export default function PopularServices({ items }: { items: Item[] }) {
  const max = Math.max(1, ...items.map((i) => i.count));

  return (
    <div className="luxe-card p-6">
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-luxe text-gold">
          This Month
        </p>
        <h3 className="mt-1 font-display text-2xl text-offwhite">
          Popular Services
        </h3>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Belum ada data"
          description="Belum ada booking yang selesai bulan ini."
        />
      ) : (
        <ul className="space-y-4">
          {items.map((item, idx) => (
            <li key={item.service_title}>
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-offwhite">
                    <span className="mr-2 text-mutedgray">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    {item.service_title}
                  </p>
                  <p className="mt-1 text-xs text-mutedgray">
                    {item.count} bookings · {formatRupiah(item.revenue)}
                  </p>
                </div>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gold/5">
                <div
                  className="h-full rounded-full bg-gold-gradient transition-all duration-1000"
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
