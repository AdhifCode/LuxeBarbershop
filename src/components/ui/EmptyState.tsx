import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gold/15 bg-navy-50/30 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-navy-100/50">
        <Icon className="h-5 w-5 text-gold" strokeWidth={1.6} />
      </div>
      <h3 className="mt-5 font-display text-lg text-offwhite">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-mutedgray">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
