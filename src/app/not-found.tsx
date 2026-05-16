import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="text-xs uppercase tracking-luxe text-gold">404</span>
      <h1 className="mt-4 font-display text-5xl text-offwhite md:text-6xl">
        Page <span className="gold-text">Not Found</span>
      </h1>
      <p className="mt-4 max-w-md text-lightgray">
        Halaman yang Anda cari tidak tersedia. Mari kembali ke beranda.
      </p>
      <Link href="/" className="mt-8">
        <Button size="lg">Back to Home</Button>
      </Link>
    </section>
  );
}
