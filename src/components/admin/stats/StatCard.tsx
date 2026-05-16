import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  hint?: string;
  trend?: { value: number; isPositive: boolean };
  highlight?: boolean;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  trend,
  highlight,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "luxe-card group p-6 transition-all duration-500",
        highlight && "border-gold/40 shadow-gold"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-luxe text-mutedgray">
            {label}
          </p>
          <p className="mt-3 font-display text-3xl text-offwhite md:text-4xl">
            {value}
          </p>
          {hint && (
            <p className="mt-1 text-xs text-mutedgray">{hint}</p>
          )}
        </div>
        {Icon && (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold transition-all duration-500 group-hover:bg-gold group-hover:text-navy">
            <Icon className="h-4 w-4" strokeWidth={1.8} />
          </span>
        )}
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1 text-xs">
          <span
            className={cn(
              trend.isPositive ? "text-emerald-400" : "text-red-400"
            )}
          >
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
          <span className="text-mutedgray">vs last week</span>
        </div>
      )}
    </div>
  );
}
