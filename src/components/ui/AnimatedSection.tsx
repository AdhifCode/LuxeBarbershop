"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  /** Stagger child motion elements. Default 0 (none). */
  stagger?: number;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: (custom: { delay: number; stagger: number }) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1],
      delay: custom.delay,
      staggerChildren: custom.stagger,
    },
  }),
};

export default function AnimatedSection({
  children,
  className,
  delay = 0,
  stagger = 0,
  id,
}: AnimatedSectionProps) {
  return (
    <motion.section
      id={id}
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      custom={{ delay, stagger }}
    >
      {children}
    </motion.section>
  );
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};
