import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BUSINESS } from "./constants";
import type { BookingForm } from "@/types";

/**
 * Compose Tailwind classes safely.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Build a WhatsApp URL with a pre-filled reservation message.
 * Uses wa.me which works on both web and mobile.
 */
export function buildWhatsAppBookingUrl(form: BookingForm): string {
  const lines = [
    `*Reservasi Baru — ${BUSINESS.name}*`,
    "",
    `Halo Admin, saya ingin melakukan reservasi:`,
    "",
    `• Nama        : ${form.name}`,
    `• Layanan     : ${form.service}`,
    `• Tanggal     : ${formatDateID(form.date)}`,
    `• Jam         : ${form.time}`,
  ];

  if (form.notes && form.notes.trim().length > 0) {
    lines.push(`• Catatan     : ${form.notes.trim()}`);
  }

  lines.push("", "Mohon konfirmasinya. Terima kasih!");

  const message = lines.join("\n");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encoded}`;
}

/**
 * Format a YYYY-MM-DD date string into Indonesian readable format.
 */
export function formatDateID(dateString: string): string {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Today's date as YYYY-MM-DD for date input min attribute.
 */
export function getTodayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Format an integer rupiah amount as a localized currency string.
 */
export function formatRupiah(n: number | null | undefined): string {
  if (n == null) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
}

/**
 * Format an ISO datetime as `HH:mm` in id-ID locale.
 */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format an ISO datetime string as a short Indonesian date+time.
 * "2025-05-15T14:30:00.000Z" -> "Kam, 15 Mei · 21:30"
 */
export function formatDateTimeID(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const time = d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} · ${time}`;
}
