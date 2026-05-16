"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gold text-navy font-semibold hover:bg-gold-light shadow-gold hover:shadow-gold-lg",
  outline:
    "border border-gold/60 text-gold hover:bg-gold hover:text-navy hover:shadow-gold",
  ghost: "text-offwhite hover:text-gold",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-xs tracking-luxe",
  md: "px-6 py-3 text-sm tracking-luxe",
  lg: "px-8 py-4 text-sm md:text-base tracking-luxe",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...rest }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full uppercase",
          "transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70",
          "disabled:opacity-50 disabled:pointer-events-none",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...rest}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
