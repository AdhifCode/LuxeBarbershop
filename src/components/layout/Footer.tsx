"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  Facebook,
  Instagram,
  MapPin,
  Phone,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { BUSINESS, NAV_LINKS, SOCIALS } from "@/lib/constants";
import logo from "@/images/logo.png";

// TikTok icon (lucide-react does not ship one)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V9.32a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.75z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-gold/10 bg-charcoal text-lightgray"
    >
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src={logo}
                alt={`${BUSINESS.name} logo`}
                width={40}
                height={40}
                className="h-10 w-auto object-contain"
              />
              <span className="font-display text-xl text-offwhite">
                Luxe<span className="text-gold">.</span>
              </span>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-mutedgray">
              {BUSINESS.tagline}. {BUSINESS.subTagline}
            </p>
            <p className="mt-3 text-xs italic text-mutedgray">
              Premium grooming experience in Kebumen.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-base text-offwhite">Navigate</h4>
            <ul className="mt-5 space-y-3 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-mutedgray transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-base text-offwhite">Visit Us</h4>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold"
                  strokeWidth={1.6}
                />
                <span className="text-mutedgray">{BUSINESS.address}</span>
              </li>
              <li className="flex gap-3">
                <Clock
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold"
                  strokeWidth={1.6}
                />
                <span className="text-mutedgray">{BUSINESS.hours}</span>
              </li>
              <li className="flex gap-3">
                <Phone
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold"
                  strokeWidth={1.6}
                />
                <a
                  href={`https://wa.me/${BUSINESS.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mutedgray transition-colors hover:text-gold"
                >
                  {BUSINESS.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>

          {/* Map + Socials */}
          <div>
            <h4 className="font-display text-base text-offwhite">Find Us</h4>
            <div className="mt-5 overflow-hidden rounded-xl border border-gold/15">
              <iframe
                src={BUSINESS.mapsEmbed}
                title="Luxe Barbershop location"
                width="100%"
                height="140"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale transition-all duration-500 hover:grayscale-0"
              />
            </div>
            <div className="mt-6 flex items-center gap-3">
              <SocialLink
                href={SOCIALS.instagram}
                label="Instagram"
                icon={<Instagram className="h-4 w-4" strokeWidth={1.6} />}
              />
              <SocialLink
                href={SOCIALS.tiktok}
                label="TikTok"
                icon={<TikTokIcon className="h-4 w-4" />}
              />
              <SocialLink
                href={SOCIALS.facebook}
                label="Facebook"
                icon={<Facebook className="h-4 w-4" strokeWidth={1.6} />}
              />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-gold/10 pt-6 md:flex-row">
          <p className="text-xs text-mutedgray">
            © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
          </p>
          <p className="text-xs uppercase tracking-luxe text-gold/70">
            {BUSINESS.subTagline}
          </p>
        </div>
      </Container>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 text-gold transition-all duration-300 hover:border-gold hover:bg-gold hover:text-navy hover:shadow-gold"
    >
      {icon}
    </a>
  );
}
