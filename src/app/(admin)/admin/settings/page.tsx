import { Building2, Clock, MapPin, Phone, type LucideIcon } from "lucide-react";
import PageHeader from "@/components/layout/admin/PageHeader";
import { BUSINESS } from "@/lib/constants";
import { getSessionUser } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await getSessionUser();

  return (
    <>
      <PageHeader
        title="Settings"
        description="Detail bisnis, akun admin, dan integrasi. Edit nilai statis di src/lib/constants.ts."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Business info */}
        <section className="luxe-card p-6">
          <h2 className="font-display text-xl text-offwhite">Business Info</h2>
          <p className="mt-1 text-xs text-mutedgray">
            Bersumber dari src/lib/constants.ts
          </p>
          <dl className="mt-6 space-y-4 text-sm">
            <Row icon={Building2} label="Name" value={BUSINESS.name} />
            <Row icon={MapPin} label="Address" value={BUSINESS.address} />
            <Row icon={Clock} label="Hours" value={BUSINESS.hours} />
            <Row icon={Phone} label="WhatsApp" value={BUSINESS.phoneDisplay} />
          </dl>
        </section>

        {/* Account */}
        <section className="luxe-card p-6">
          <h2 className="font-display text-xl text-offwhite">Your Account</h2>
          <p className="mt-1 text-xs text-mutedgray">Detail akun admin Anda.</p>
          {user ? (
            <dl className="mt-6 space-y-4 text-sm">
              <DefRow label="Full Name" value={user.fullName} />
              <DefRow label="Email" value={user.email ?? "—"} />
              <DefRow label="Role" value={user.role} />
            </dl>
          ) : (
            <p className="mt-6 text-sm text-mutedgray">Not signed in.</p>
          )}
        </section>

        {/* Roadmap */}
        <section className="luxe-card p-6 lg:col-span-2">
          <h2 className="font-display text-xl text-offwhite">Integrations</h2>
          <p className="mt-1 text-xs text-mutedgray">
            Status integrasi pihak ketiga.
          </p>
          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            <Integration
              name="Supabase Postgres"
              status="Connected"
              tone="success"
            />
            <Integration
              name="WhatsApp (manual link)"
              status="Active"
              tone="success"
            />
            <Integration
              name="WhatsApp Business API"
              status="Coming soon"
              tone="warning"
            />
            <Integration name="Email (Resend)" status="Not configured" tone="neutral" />
            <Integration name="Storage (Supabase)" status="Configured" tone="success" />
            <Integration name="Realtime updates" status="Available" tone="info" />
          </ul>
        </section>
      </div>
    </>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg border border-gold/20 bg-gold/5 text-gold">
        <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
      </span>
      <div>
        <dt className="text-[10px] uppercase tracking-luxe text-mutedgray">
          {label}
        </dt>
        <dd className="mt-0.5 text-offwhite">{value}</dd>
      </div>
    </div>
  );
}

function DefRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-gold/5 pb-3 last:border-0">
      <dt className="text-[10px] uppercase tracking-luxe text-mutedgray">
        {label}
      </dt>
      <dd className="text-offwhite">{value}</dd>
    </div>
  );
}

function Integration({
  name,
  status,
  tone,
}: {
  name: string;
  status: string;
  tone: "success" | "warning" | "neutral" | "info";
}) {
  const dotMap = {
    success: "bg-emerald-400",
    warning: "bg-amber-400",
    neutral: "bg-mutedgray",
    info: "bg-sky-400",
  } as const;
  return (
    <li className="flex items-center justify-between rounded-lg border border-gold/10 bg-navy-50/30 px-4 py-3">
      <span className="text-sm text-offwhite">{name}</span>
      <span className="flex items-center gap-2 text-xs text-mutedgray">
        <span className={`h-1.5 w-1.5 rounded-full ${dotMap[tone]}`} />
        {status}
      </span>
    </li>
  );
}
