"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Image as ImageIcon,
  LayoutDashboard,
  MessageSquareQuote,
  Package,
  Scissors,
  Settings,
  Sparkles,
  Tag,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const NAV: NavItem[] = [
  { label: "Overview",     href: "/admin",              icon: LayoutDashboard },
  { label: "Bookings",     href: "/admin/bookings",     icon: CalendarDays },
  { label: "Services",     href: "/admin/services",     icon: Sparkles },
  { label: "Barbers",      href: "/admin/barbers",      icon: Users },
  { label: "Gallery",      href: "/admin/gallery",      icon: ImageIcon },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { label: "Promos",       href: "/admin/promos",       icon: Tag },
  { label: "Inventory",    href: "/admin/inventory",    icon: Package },
  { label: "Settings",     href: "/admin/settings",     icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:border-r lg:border-gold/10 lg:bg-charcoal">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 border-b border-gold/10 px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-charcoal-50">
          <Scissors className="h-4 w-4 text-gold" strokeWidth={1.6} />
        </span>
        <div>
          <div className="font-display text-base leading-none text-offwhite">
            Luxe<span className="text-gold">.</span>
          </div>
          <div className="mt-1 text-[9px] uppercase tracking-luxe text-mutedgray">
            Admin Panel
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="space-y-1">
          {NAV.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gold/10 text-gold"
                      : "text-mutedgray hover:bg-gold/5 hover:text-offwhite"
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-gold" />
                  )}
                  <item.icon className="h-4 w-4" strokeWidth={1.8} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer card */}
      <div className="border-t border-gold/10 p-4">
        <Link
          href="/"
          className="flex items-center justify-between rounded-lg border border-gold/15 bg-gold/5 px-3 py-2.5 text-xs text-mutedgray transition-colors hover:border-gold/40 hover:text-gold"
        >
          <span>Back to site</span>
          <span className="text-gold">→</span>
        </Link>
      </div>
    </aside>
  );
}
