import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A192F",
          50: "#1A2A45",
          100: "#152138",
          900: "#050E1C",
        },
        charcoal: {
          DEFAULT: "#121212",
          50: "#1C1C1C",
          100: "#181818",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#E6C863",
          dark: "#A8881C",
          50: "#F5E9B8",
        },
        offwhite: "#F5F5F5",
        lightgray: "#E0E0E0",
        mutedgray: "#A0A0A0",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #D4AF37 0%, #E6C863 50%, #A8881C 100%)",
        "navy-gradient":
          "linear-gradient(180deg, #0A192F 0%, #050E1C 100%)",
        "hero-overlay":
          "linear-gradient(180deg, rgba(10,25,47,0.6) 0%, rgba(10,25,47,0.9) 100%)",
      },
      boxShadow: {
        gold: "0 0 20px rgba(212, 175, 55, 0.4)",
        "gold-lg": "0 0 40px rgba(212, 175, 55, 0.6)",
        luxe: "0 10px 40px -10px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-in-out forwards",
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "glow-pulse": "glowPulse 2.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.4)" },
          "50%": { boxShadow: "0 0 35px rgba(212, 175, 55, 0.7)" },
        },
      },
      letterSpacing: {
        luxe: "0.2em",
      },
    },
  },
  plugins: [],
};

export default config;
