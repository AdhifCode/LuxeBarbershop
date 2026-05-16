"use client";

import { useEffect, useState } from "react";

/**
 * Returns true once the user has scrolled past the threshold (default 40px).
 * Used by Navbar to switch from transparent → solid.
 */
export function useScrollPosition(threshold = 40): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
