# Luxe Barbershop — Premium Landing Page

Premium, masculine, single-page website for **Luxe Barbershop** in Kebumen.
Built with Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, and Lucide icons.

> **Tagline:** Level Up Your Value · Stay Classy. Stay Luxe.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Fonts:** Playfair Display (display) + Inter (body)

## Features

- Sticky transparent → solid Navbar with mobile menu
- Full-screen Hero with animated headline and glowing CTA
- About section with masonry-style imagery
- Service & pricing grid with featured cards
- Lookbook gallery with category filters and masonry layout
- Booking form that **redirects to WhatsApp** (no DB required)
- Footer with business hours, embedded Google Maps, and socials

## Color Palette

| Role | Hex |
|---|---|
| Background — Deep Navy | `#0A192F` |
| Background — Charcoal | `#121212` |
| Accent / CTA — Metallic Gold | `#D4AF37` |
| Text — Off White | `#F5F5F5` |
| Text — Light Gray | `#E0E0E0` |

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Project Structure

```
src/
├── app/                  # Next.js App Router (layout, page, globals)
├── components/
│   ├── ui/               # Reusable primitives (Button, Container, etc.)
│   ├── layout/           # Navbar, Footer
│   └── sections/         # Hero, About, Services, Lookbook, Booking
├── hooks/                # useScrollPosition
├── lib/                  # constants, data, utils (incl. WA URL builder)
└── types/                # Shared TypeScript types
```

## Booking → WhatsApp Logic

The booking form does **not** post to a backend. Instead it builds a
pre-formatted message and opens `https://wa.me/6285876889182?text=...` in a
new tab so the admin receives the reservation directly.

The URL is built by `buildWhatsAppBookingUrl()` in `src/lib/utils.ts`.

## Customization

- Update business info, WhatsApp number, address, and socials in `src/lib/constants.ts`
- Update services and gallery imagery in `src/lib/data.ts`
- Tweak the palette in `tailwind.config.ts`
