"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Star } from "lucide-react";
import Button from "@/components/ui/Button";
import { BUSINESS } from "@/lib/constants";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=2000&q=80')",
        }}
        aria-hidden="true"
      />

      {/* Layered overlays for the premium feel */}
      <div className="absolute inset-0 bg-navy/70" aria-hidden="true" />
      <div className="absolute inset-0 bg-hero-overlay" aria-hidden="true" />
      <div
        className="absolute inset-0 grain"
        aria-hidden="true"
        style={{ position: "absolute" }}
      />

      {/* Decorative gold orb */}
      <div
        className="pointer-events-none absolute right-[-10%] top-1/4 h-[500px] w-[500px] rounded-full bg-gold/10 blur-[120px]"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 text-center md:px-12">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-6 flex items-center gap-3 text-xs uppercase tracking-luxe text-gold md:text-sm"
        >
          <span className="h-px w-8 bg-gold/60" />
          <Star className="h-3 w-3 fill-gold" strokeWidth={1.5} />
          <span>{BUSINESS.subTagline}</span>
          <Star className="h-3 w-3 fill-gold" strokeWidth={1.5} />
          <span className="h-px w-8 bg-gold/60" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-display text-5xl leading-[1.05] text-offwhite sm:text-6xl md:text-7xl lg:text-[90px]"
        >
          Level Up <span className="block">Your </span>
          <span className="gold-text">Value.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 max-w-2xl text-base leading-relaxed text-lightgray md:text-lg"
        >
          {BUSINESS.description} Rasakan kemewahan grooming dengan sentuhan
          tangan ahli yang menyatu dalam ruang yang elegan dan nyaman.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link href="#booking">
            <Button size="lg" className="animate-glow-pulse">
              Reservasi Sekarang
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Button>
          </Link>
          <Link href="#services">
            <Button size="lg" variant="outline">
              Lihat Layanan
            </Button>
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 grid w-full max-w-2xl grid-cols-3 divide-x divide-gold/20 border-y border-gold/15 py-6"
        >
          <Stat number="5+" label="Years of Excellence" />
          <Stat number="3K+" label="Happy Clients" />
          <Stat number="4.9★" label="Customer Rating" />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-gold/80"
        >
          <span className="text-[10px] uppercase tracking-luxe">Scroll</span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="px-4 text-center">
      <div className="font-display text-2xl text-gold md:text-3xl">{number}</div>
      <div className="mt-1 text-[10px] uppercase tracking-luxe text-mutedgray md:text-xs">
        {label}
      </div>
    </div>
  );
}
