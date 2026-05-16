import "server-only";
import { BUSINESS } from "@/lib/constants";
import { formatDateID } from "@/lib/utils";
import type { BookingRow, BookingStatus } from "@/types/database";

/**
 * Build a wa.me URL for a booking lifecycle event.
 * The admin (or system) can open this URL to dispatch the WhatsApp message.
 */
export function buildBookingWhatsAppUrl(
  booking: Pick<
    BookingRow,
    | "code"
    | "customer_name"
    | "customer_phone"
    | "service_title"
    | "barber_name"
    | "start_at"
    | "total_price"
    | "status"
  >,
  event: BookingStatus | "CREATED" = "CREATED"
): string {
  const phone = normalizePhone(booking.customer_phone);
  const message = buildBookingMessage(booking, event);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildBookingMessage(
  booking: Pick<
    BookingRow,
    | "code"
    | "customer_name"
    | "service_title"
    | "barber_name"
    | "start_at"
    | "total_price"
    | "status"
  >,
  event: BookingStatus | "CREATED" = "CREATED"
): string {
  const date = formatDateID(booking.start_at.slice(0, 10));
  const time = new Date(booking.start_at).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const price = formatRupiah(booking.total_price);

  const headers: Record<typeof event, string> = {
    CREATED: "*Reservasi Baru Diterima*",
    PENDING: "*Reservasi Anda Menunggu Konfirmasi*",
    CONFIRMED: "*Reservasi Anda Dikonfirmasi ✅*",
    COMPLETED: "*Terima Kasih Telah Berkunjung 🙏*",
    CANCELLED: "*Reservasi Anda Dibatalkan*",
    NO_SHOW: "*Anda Tidak Hadir Pada Reservasi*",
  };

  return [
    headers[event],
    `${BUSINESS.name}`,
    "",
    `Halo ${booking.customer_name},`,
    "",
    `Kode Booking : ${booking.code}`,
    `Layanan      : ${booking.service_title}`,
    booking.barber_name ? `Capster      : ${booking.barber_name}` : null,
    `Tanggal      : ${date}`,
    `Jam          : ${time} WIB`,
    `Total        : ${price}`,
    "",
    eventFooter(event),
  ]
    .filter(Boolean)
    .join("\n");
}

function eventFooter(event: BookingStatus | "CREATED"): string {
  switch (event) {
    case "CONFIRMED":
      return "Mohon hadir 5-10 menit lebih awal. Sampai jumpa!";
    case "CANCELLED":
      return "Untuk reservasi ulang, silakan kunjungi website kami.";
    case "COMPLETED":
      return "Stay classy. Stay luxe.";
    default:
      return "Reservasi Anda akan dikonfirmasi oleh admin secepatnya.";
  }
}

function normalizePhone(p: string): string {
  const digits = p.replace(/[^0-9]/g, "");
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("62")) return digits;
  return digits;
}

function formatRupiah(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
}
