import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import QueryProvider from "@/lib/providers/QueryProvider";
import { BUSINESS } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${BUSINESS.name} — ${BUSINESS.tagline}`,
  description: BUSINESS.description,
  keywords: [
    "barbershop",
    "barbershop kebumen",
    "luxe barbershop",
    "premium barbershop",
    "haircut kebumen",
    "creambath",
    "keratin",
  ],
  openGraph: {
    title: `${BUSINESS.name} — ${BUSINESS.tagline}`,
    description: BUSINESS.description,
    type: "website",
    locale: "id_ID",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A192F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-navy text-offwhite antialiased">
        <QueryProvider>
          {children}
          <Toaster
            theme="dark"
            position="top-right"
            toastOptions={{
              style: {
                background: "#0A192F",
                border: "1px solid rgba(212,175,55,0.25)",
                color: "#F5F5F5",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
