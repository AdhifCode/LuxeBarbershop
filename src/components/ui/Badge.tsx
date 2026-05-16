import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import type { BookingStatus } from "@/types/database";

export type BadgeTone =
  | "neutral"
  | "gold"
  | "success"
  | "warning"
  | "danger"
  | "info";

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}

const tones: Record<BadgeTone, string> = {
  neutral: "border-mutedgray/30 bg-mutedgray/10 text-lightgray",
  gold: "border-gold/40 bg-gold/10 text-gold",
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  warning: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  danger: "border-red-500/40 bg-red-500/10 text-red-300",
  info: "border-sky-500/40 bg-sky-500/10 text-sky-300",
};

export default function Badge({ tone = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-luxe",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

const statusToTone: Record<BookingStatus, BadgeTone> = {
  PENDING: "warning",
  CONFIRMED: "success",
  COMPLETED: "info",
  CANCELLED: "danger",
  NO_SHOW: "neutral",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return <Badge tone={statusToTone[status]}>{status.replace("_", " ")}</Badge>;
}
