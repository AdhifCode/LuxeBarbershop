"use client";

import { motion } from "framer-motion";
import { useState, useTransition } from "react";
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  MessageSquare,
  Send,
  Sparkles,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import { useAvailability } from "@/lib/queries/useAvailability";
import { createBooking } from "@/server/actions/bookings";
import { buildWhatsAppBookingUrl, formatRupiah, getTodayISO } from "@/lib/utils";
import type { BarberRow, ServiceRow } from "@/types/database";

interface BarberLite {
  id: string;
  full_name: string;
  photo_url: string | null;
  specialties: string[];
  bio: string | null;
}

interface Props {
  services: ServiceRow[];
  barbers: Pick<BarberRow, "id" | "full_name" | "photo_url" | "specialties" | "bio">[];
  phoneDisplay: string;
  whatsapp: string;
  shopHours: string;
  /** True when DB isn't reachable — falls back to legacy WA-URL flow. */
  offlineMode: boolean;
}

type Step = 1 | 2 | 3 | 4;

export default function BookingWidget({
  services,
  barbers,
  phoneDisplay,
  whatsapp,
  shopHours,
  offlineMode,
}: Props) {
  const [step, setStep] = useState<Step>(1);
  const [serviceId, setServiceId] = useState("");
  const [barberId, setBarberId] = useState<string | "">("");
  const [date, setDate] = useState("");
  const [slotIso, setSlotIso] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [promoCode, setPromoCode] = useState("");

  const [pending, startTransition] = useTransition();
  const [confirmation, setConfirmation] = useState<null | {
    code: string;
    waUrl: string;
  }>(null);

  const service = services.find((s) => s.id === serviceId);

  const { data: slots, isLoading: slotsLoading } = useAvailability({
    date: !offlineMode && step >= 3 && date ? date : null,
    durationMin: service?.duration_min ?? null,
    barberId: barberId || null,
  });

  const onSubmit = () => {
    if (!service) return toast.error("Pilih layanan dulu.");
    if (!name.trim()) return toast.error("Nama wajib diisi.");
    if (!phone.trim()) return toast.error("Nomor telepon wajib diisi.");

    if (offlineMode) {
      // Fallback: just open wa.me with the legacy format, no DB write.
      const url = buildWhatsAppBookingUrl({
        name,
        service: `${service.title} (${formatRupiah(service.price)})`,
        date,
        time:
          slotIso?.length > 0
            ? new Date(slotIso).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
        notes,
      });
      window.open(url, "_blank", "noopener");
      toast.message("Mode offline — terhubung ke WhatsApp tanpa DB.");
      return;
    }

    if (!slotIso) return toast.error("Pilih jam yang tersedia.");

    startTransition(async () => {
      const res = await createBooking({
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        customer_email: email.trim(),
        service_id: service.id,
        barber_id: barberId || undefined,
        start_at: slotIso,
        notes: notes.trim(),
        promo_code: promoCode.trim(),
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Reservasi terkirim!");
      setConfirmation({ code: res.data.code, waUrl: res.data.whatsappUrl });
      // Auto-open the WhatsApp confirmation in a new tab
      window.open(res.data.whatsappUrl, "_blank", "noopener");
    });
  };

  if (confirmation) {
    return (
      <ConfirmationCard
        code={confirmation.code}
        waUrl={confirmation.waUrl}
        phoneDisplay={phoneDisplay}
      />
    );
  }

  const stepValid: Record<Step, boolean> = {
    1: !!service,
    2: true, // barber is optional
    3: !!date && (offlineMode || !!slotIso),
    4: !!name.trim() && !!phone.trim(),
  };

  return (
    <div className="grid gap-10 lg:grid-cols-5">
      {/* Sidebar / Summary */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="lg:col-span-2"
      >
        <div className="luxe-card p-7">
          <p className="text-[10px] uppercase tracking-luxe text-gold">
            Booking Summary
          </p>
          <h3 className="mt-1 font-display text-2xl text-offwhite">
            Your Reservation
          </h3>

          <ul className="mt-6 space-y-4 text-sm">
            <SummaryRow
              icon={Sparkles}
              label="Layanan"
              value={
                service
                  ? `${service.title} · ${formatRupiah(service.price)}`
                  : "—"
              }
            />
            <SummaryRow
              icon={Users}
              label="Capster"
              value={
                barberId
                  ? barbers.find((b) => b.id === barberId)?.full_name ?? "—"
                  : "Any available"
              }
            />
            <SummaryRow
              icon={Calendar}
              label="Tanggal"
              value={
                date
                  ? new Date(date).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "—"
              }
            />
            <SummaryRow
              icon={Clock}
              label="Jam"
              value={
                slotIso
                  ? new Date(slotIso).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"
              }
            />
          </ul>

          <div className="mt-7 rounded-xl border border-gold/15 bg-navy-50/50 p-5">
            <p className="text-[10px] uppercase tracking-luxe text-gold">
              Total Estimate
            </p>
            <p className="mt-1 font-display text-3xl text-gold">
              {service ? formatRupiah(service.price) : "—"}
            </p>
            <p className="mt-1 text-[10px] text-mutedgray">
              Diskon promo akan diterapkan saat konfirmasi.
            </p>
          </div>

          <div className="mt-6 border-t border-gold/10 pt-5 text-xs text-mutedgray">
            Buka setiap hari · {shopHours}
            <br />
            Atau hubungi:{" "}
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gold hover:text-gold-light"
            >
              {phoneDisplay}
            </a>
          </div>
          {offlineMode && (
            <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-[10px] leading-relaxed text-amber-200/80">
              Mode offline — booking langsung diteruskan ke WhatsApp tanpa
              menyimpan ke database.
            </div>
          )}
        </div>
      </motion.div>

      {/* Stepper form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="luxe-card p-7 lg:col-span-3"
      >
        {/* Stepper indicator */}
        <Stepper step={step} />

        {/* Step 1 — Service */}
        {step === 1 && (
          <Section title="Pilih Layanan">
            <div className="grid gap-3 sm:grid-cols-2">
              {services.map((s) => (
                <SelectableCard
                  key={s.id}
                  active={serviceId === s.id}
                  onClick={() => setServiceId(s.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-offwhite">
                        {s.title}
                      </p>
                      <p className="mt-1 text-xs text-mutedgray">
                        {s.duration_min} min
                      </p>
                    </div>
                    <p className="font-display text-base text-gold">
                      {formatRupiah(s.price)}
                    </p>
                  </div>
                </SelectableCard>
              ))}
            </div>
          </Section>
        )}

        {/* Step 2 — Barber */}
        {step === 2 && (
          <Section title="Pilih Capster">
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              <SelectableCard
                active={barberId === ""}
                onClick={() => setBarberId("")}
              >
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                  <Users className="h-5 w-5 text-gold" strokeWidth={1.6} />
                  <p className="text-sm font-medium text-offwhite">
                    Any Available
                  </p>
                  <p className="text-[10px] text-mutedgray">
                    Sistem pilih otomatis
                  </p>
                </div>
              </SelectableCard>
              {barbers.map((b) => (
                <SelectableCard
                  key={b.id}
                  active={barberId === b.id}
                  onClick={() => setBarberId(b.id)}
                >
                  <div className="text-center">
                    <p className="text-sm font-medium text-offwhite">
                      {b.full_name}
                    </p>
                    {b.specialties.length > 0 && (
                      <p className="mt-1 text-[10px] uppercase tracking-luxe text-gold">
                        {b.specialties.slice(0, 2).join(" · ")}
                      </p>
                    )}
                  </div>
                </SelectableCard>
              ))}
            </div>
          </Section>
        )}

        {/* Step 3 — Date + Time */}
        {step === 3 && (
          <Section title="Pilih Tanggal & Jam">
            <div className="space-y-5">
              <div>
                <Label icon={Calendar}>Tanggal</Label>
                <input
                  type="date"
                  value={date}
                  min={getTodayISO()}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setSlotIso("");
                  }}
                  className="w-full rounded-lg border border-gold/15 bg-navy-100/50 px-4 py-3 text-sm text-offwhite focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40 [color-scheme:dark]"
                />
              </div>

              {date && !offlineMode && (
                <div>
                  <Label icon={Clock}>Jam tersedia</Label>
                  {slotsLoading ? (
                    <div className="flex items-center gap-2 rounded-lg border border-gold/15 bg-navy-100/50 px-4 py-4 text-sm text-mutedgray">
                      <Loader2 className="h-4 w-4 animate-spin text-gold" />
                      Mencari slot tersedia…
                    </div>
                  ) : !slots || slots.length === 0 ? (
                    <p className="rounded-lg border border-gold/10 bg-navy-100/30 px-4 py-3 text-xs text-mutedgray">
                      Tidak ada slot di tanggal ini.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                      {slots.map((s) => {
                        const free = s.availableBarberIds.length > 0;
                        const isActive = slotIso === s.start;
                        return (
                          <button
                            key={s.start}
                            type="button"
                            disabled={!free}
                            onClick={() => setSlotIso(s.start)}
                            className={[
                              "rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200",
                              isActive
                                ? "border-gold bg-gold text-navy shadow-gold"
                                : free
                                  ? "border-gold/15 text-lightgray hover:border-gold/60 hover:text-gold"
                                  : "cursor-not-allowed border-gold/5 bg-navy-50/30 text-mutedgray/40 line-through",
                            ].join(" ")}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {date && offlineMode && (
                <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-200/80">
                  Slot real-time membutuhkan koneksi database. Lanjutkan untuk
                  reservasi via WhatsApp.
                </p>
              )}
            </div>
          </Section>
        )}

        {/* Step 4 — Personal info */}
        {step === 4 && (
          <Section title="Informasi Anda">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label icon={User}>Nama Lengkap</Label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className={inputClass}
                  />
                </div>
                <div>
                  <Label>WhatsApp</Label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <Label>Email (opsional)</Label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className={inputClass}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Kode Promo (opsional)</Label>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="GRANDOPEN"
                    className={inputClass + " font-mono"}
                  />
                </div>
              </div>
              <div>
                <Label icon={MessageSquare}>Catatan (opsional)</Label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Request style spesifik, alergi produk, dll."
                  className={inputClass + " resize-none"}
                />
              </div>
            </div>
          </Section>
        )}

        {/* Stepper actions */}
        <div className="mt-8 flex items-center justify-between border-t border-gold/10 pt-5">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1) as Step)}
            disabled={step === 1}
            className="text-xs font-medium uppercase tracking-luxe text-mutedgray transition-colors hover:text-gold disabled:opacity-40"
          >
            ← Sebelumnya
          </button>

          {step < 4 ? (
            <Button
              size="md"
              onClick={() => stepValid[step] && setStep((s) => (s + 1) as Step)}
              disabled={!stepValid[step]}
            >
              Lanjut
            </Button>
          ) : (
            <Button size="md" onClick={onSubmit} disabled={pending}>
              {pending ? "Mengirim…" : "Kirim Reservasi"}
              <Send className="h-4 w-4" strokeWidth={2} />
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────
// Subcomponents
// ─────────────────────────────────────────

const inputClass =
  "w-full rounded-lg border border-gold/15 bg-navy-100/50 px-4 py-3 text-sm text-offwhite placeholder:text-mutedgray transition-colors duration-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40 [color-scheme:dark]";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-5 font-display text-lg text-offwhite">{title}</h4>
      {children}
    </div>
  );
}

function Label({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <label className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-luxe text-gold">
      {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />}
      {children}
    </label>
  );
}

function SelectableCard({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group rounded-xl border p-4 text-left transition-all duration-300",
        active
          ? "border-gold bg-gold/10 shadow-gold"
          : "border-gold/15 bg-navy-100/40 hover:border-gold/50 hover:bg-navy-100/60",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg border border-gold/20 bg-gold/5 text-gold">
        <Icon className="h-3 w-3" strokeWidth={1.8} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-luxe text-mutedgray">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm text-offwhite">{value}</p>
      </div>
    </li>
  );
}

function Stepper({ step }: { step: Step }) {
  const labels = ["Service", "Capster", "Schedule", "Details"];
  return (
    <div className="mb-8 flex items-center gap-2">
      {labels.map((label, i) => {
        const n = (i + 1) as Step;
        const active = step === n;
        const done = step > n;
        return (
          <div key={label} className="flex flex-1 items-center gap-2">
            <span
              className={[
                "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium transition-colors",
                done
                  ? "border-gold bg-gold text-navy"
                  : active
                    ? "border-gold text-gold"
                    : "border-gold/20 text-mutedgray",
              ].join(" ")}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : n}
            </span>
            <span
              className={[
                "hidden text-[10px] uppercase tracking-luxe md:block",
                active ? "text-gold" : "text-mutedgray",
              ].join(" ")}
            >
              {label}
            </span>
            {i < labels.length - 1 && (
              <span
                className={[
                  "h-px flex-1 transition-colors",
                  done ? "bg-gold" : "bg-gold/15",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ConfirmationCard({
  code,
  waUrl,
  phoneDisplay,
}: {
  code: string;
  waUrl: string;
  phoneDisplay: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="luxe-card mx-auto max-w-2xl p-10 text-center"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
        <CheckCircle2 className="h-7 w-7" strokeWidth={1.6} />
      </div>
      <h3 className="mt-6 font-display text-3xl text-offwhite">
        Reservasi Terkirim 🎉
      </h3>
      <p className="mt-3 text-sm text-mutedgray">
        Kode booking Anda:
      </p>
      <p className="mt-1 font-mono text-lg text-gold">{code}</p>
      <p className="mt-6 text-sm leading-relaxed text-lightgray">
        Pesan konfirmasi sudah dibuka di WhatsApp. Admin akan segera
        memverifikasi reservasi Anda.
      </p>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold uppercase tracking-luxe text-navy transition-all duration-300 hover:bg-gold-light hover:shadow-gold-lg"
      >
        Buka WhatsApp Lagi
        <Send className="h-4 w-4" strokeWidth={2} />
      </a>
      <p className="mt-6 text-xs text-mutedgray">
        Belum dibuka? Hubungi admin di{" "}
        <span className="font-medium text-gold">{phoneDisplay}</span>.
      </p>
    </motion.div>
  );
}
