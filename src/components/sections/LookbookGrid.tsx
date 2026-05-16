"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { GalleryRow } from "@/types/database";

type Category = GalleryRow["category"] | "ALL";

const CATEGORIES: Category[] = [
  "ALL",
  "FADE",
  "CLASSIC",
  "MULLET",
  "BEARD",
  "COLOR",
];

export default function LookbookGrid({ items }: { items: GalleryRow[] }) {
  const [active, setActive] = useState<Category>("ALL");

  // Hide categories that have no items, but always keep ALL
  const availableCategories = useMemo<Category[]>(() => {
    const present = new Set(items.map((i) => i.category));
    return CATEGORIES.filter((c) => c === "ALL" || present.has(c));
  }, [items]);

  const filtered =
    active === "ALL" ? items : items.filter((g) => g.category === active);

  return (
    <>
      {/* Category filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-12 flex flex-wrap items-center justify-center gap-2"
      >
        {availableCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs uppercase tracking-luxe transition-all duration-300",
              active === cat
                ? "border-gold bg-gold text-navy shadow-gold"
                : "border-gold/20 text-lightgray hover:border-gold/60 hover:text-gold"
            )}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Masonry grid */}
      <motion.div
        layout
        className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
      >
        {filtered.map((item, idx) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: idx * 0.05,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className={cn(
              "group relative cursor-pointer overflow-hidden rounded-2xl border border-gold/10",
              idx % 5 === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"
            )}
          >
            <Image
              src={item.after_url}
              alt={item.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

            <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 transition-transform duration-500 group-hover:translate-y-0">
              <span className="text-[10px] uppercase tracking-luxe text-gold">
                {item.category}
              </span>
              <h4 className="mt-1 font-display text-base text-offwhite md:text-lg">
                {item.title}
              </h4>
            </div>

            <div className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
