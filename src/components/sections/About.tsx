"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award, Scissors, Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";
import { fadeUp } from "@/components/ui/AnimatedSection";

const HIGHLIGHTS = [
  {
    icon: Scissors,
    title: "Master Barbers",
    desc: "Tim berpengalaman dengan sertifikasi internasional.",
  },
  {
    icon: Sparkles,
    title: "Premium Products",
    desc: "Hanya menggunakan produk grooming kelas atas.",
  },
  {
    icon: Award,
    title: "Curated Experience",
    desc: "Setiap kunjungan dirancang untuk relaksasi maksimal.",
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative section-padding overflow-hidden bg-navy"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-gold/20">
              <Image
                src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1200&q=80"
                alt="Barber at work in Luxe Barbershop"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
            </div>
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-6 -right-4 hidden rounded-2xl border border-gold/30 bg-charcoal p-5 shadow-luxe md:block lg:right-8"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                  <Award className="h-5 w-5 text-gold" strokeWidth={1.6} />
                </div>
                <div>
                  <div className="font-display text-2xl text-gold">5+</div>
                  <div className="text-xs uppercase tracking-luxe text-mutedgray">
                    Years of craft
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content side */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ staggerChildren: 0.12 }}
          >
            <motion.span
              variants={fadeUp}
              className="text-xs font-medium uppercase tracking-luxe text-gold"
            >
              About Luxe
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="mt-4 font-display text-4xl leading-tight md:text-5xl"
            >
              Where <span className="gold-text">grooming</span> meets art.
            </motion.h2>
            <motion.div
              variants={fadeUp}
              className="mt-5 h-[2px] w-20 bg-gold-gradient"
            />
            <motion.p
              variants={fadeUp}
              className="mt-6 text-base leading-relaxed text-lightgray"
            >
              Di Luxe Barbershop, kami percaya bahwa grooming adalah ritual
              personal yang seharusnya menyenangkan. Setiap detail di tempat
              kami dirancang untuk memberikan pengalaman premium — dari aroma
              ruangan, kursi yang nyaman, hingga sentuhan akhir styling.
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-base leading-relaxed text-lightgray"
            >
              Stay classy. Stay luxe.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 grid gap-6 sm:grid-cols-3"
            >
              {HIGHLIGHTS.map((h) => (
                <div key={h.title} className="group">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-navy-50 transition-all duration-300 group-hover:border-gold group-hover:shadow-gold">
                    <h.icon
                      className="h-5 w-5 text-gold"
                      strokeWidth={1.6}
                    />
                  </div>
                  <h4 className="mt-4 font-display text-lg text-offwhite">
                    {h.title}
                  </h4>
                  <p className="mt-1 text-sm text-mutedgray">{h.desc}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
