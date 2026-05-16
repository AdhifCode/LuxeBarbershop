"use client";

import { motion } from "framer-motion";
import { Clock, Sparkles } from "lucide-react";
import { fadeUp } from "@/components/ui/AnimatedSection";
import { cn, formatRupiah } from "@/lib/utils";
import type { ServiceRow } from "@/types/database";

export default function ServicesGrid({
  services,
}: {
  services: ServiceRow[];
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ staggerChildren: 0.1 }}
      className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {services.map((service, idx) => (
        <ServiceCard key={service.id} service={service} index={idx} />
      ))}
    </motion.div>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: ServiceRow;
  index: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "luxe-card group flex flex-col p-7",
        service.is_featured && "border-gold/40 shadow-luxe"
      )}
    >
      {service.is_featured && (
        <div className="absolute right-5 top-5 flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-[10px] uppercase tracking-luxe text-gold">
          <Sparkles className="h-3 w-3" strokeWidth={1.8} />
          Featured
        </div>
      )}

      <div className="font-display text-3xl text-gold/30 transition-colors duration-500 group-hover:text-gold/70">
        {String(index + 1).padStart(2, "0")}
      </div>

      <h3 className="mt-3 font-display text-2xl text-offwhite">
        {service.title}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-mutedgray">
        {service.description ?? ""}
      </p>

      <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-luxe text-mutedgray">
            Starting from
          </div>
          <div className="mt-1 font-display text-2xl text-gold">
            {formatRupiah(service.price)}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-mutedgray">
          <Clock className="h-3.5 w-3.5" strokeWidth={1.6} />
          {service.duration_min} min
        </div>
      </div>
    </motion.div>
  );
}
