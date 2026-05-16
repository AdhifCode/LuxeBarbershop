import type { NavLink } from "@/types";

export const BUSINESS = {
  name: "Luxe Barbershop",
  tagline: "Level Up Your Value",
  subTagline: "Stay Classy. Stay Luxe.",
  description:
    "Premium vibes, cozy feels. The best grooming experience in Kebumen.",
  whatsapp: "6285876889182",
  phoneDisplay: "+62 858-7688-9182",
  email: "hello@luxebarbershop.id",
  address: "Jl. Ahmad Yani No. 49A, Indrakila, Kebumen",
  hours: "Senin - Minggu · 09:00 - 21:00",
  hoursShort: "09:00 - 21:00",
  mapsEmbed:
    "https://www.google.com/maps?q=Jl.+Ahmad+Yani+No.+49A+Indrakila+Kebumen&output=embed",
  mapsLink:
    "https://www.google.com/maps/search/?api=1&query=LUXE+Barbershop+Kebumen",
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Booking", href: "#booking" },
  { label: "Contact", href: "#contact" },
];

export const SOCIALS = {
  instagram: "https://instagram.com/luxebarbershop",
  tiktok: "https://tiktok.com/@luxebarbershop",
  facebook: "https://facebook.com/luxebarbershop",
} as const;

export const TIME_SLOTS: string[] = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

// ──────────────────────────────────────────────
// Booking-system constants
// ──────────────────────────────────────────────

/** Operating hours boundary, used for slot generation. */
export const SHOP_HOURS = {
  open: "09:00",
  close: "21:00",
  /** All weekdays (0=Sun … 6=Sat) the shop is open */
  openDays: [0, 1, 2, 3, 4, 5, 6] as number[],
};

/** Default slot interval for the booking widget in minutes. */
export const SLOT_INTERVAL_MIN = 30;

/** Booking statuses we treat as "blocking" for availability. */
export const ACTIVE_BOOKING_STATUSES = ["PENDING", "CONFIRMED"] as const;
