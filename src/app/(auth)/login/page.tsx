import Link from "next/link";
import { Scissors } from "lucide-react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/guard";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const user = await getSessionUser();
  if (user && (user.role === "ADMIN" || user.role === "STAFF")) {
    redirect(params.next ?? "/admin");
  }

  return (
    <div className="min-h-screen w-full bg-navy">
      <div className="pointer-events-none fixed -right-32 top-1/4 h-[400px] w-[400px] rounded-full bg-gold/5 blur-[120px]" />
      <div className="pointer-events-none fixed -left-32 bottom-1/4 h-[400px] w-[400px] rounded-full bg-gold/5 blur-[140px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
        <Link
          href="/"
          className="mb-10 flex items-center justify-center gap-2.5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-charcoal-50">
            <Scissors className="h-4 w-4 text-gold" strokeWidth={1.6} />
          </span>
          <span className="font-display text-xl text-offwhite">
            Luxe<span className="text-gold">.</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-gold/15 bg-charcoal/60 p-8 backdrop-blur-md">
          <div className="mb-6 text-center">
            <p className="text-xs uppercase tracking-luxe text-gold">
              Admin Panel
            </p>
            <h1 className="mt-2 font-display text-3xl text-offwhite">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-mutedgray">
              Sign in to access your dashboard.
            </p>
          </div>

          {params.error === "forbidden" && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
              Akun Anda tidak memiliki akses ke admin panel.
            </div>
          )}
          {params.error === "callback" && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
              Sesi gagal dimuat. Silakan login ulang.
            </div>
          )}

          <LoginForm next={params.next ?? "/admin"} />
        </div>

        <p className="mt-6 text-center text-xs text-mutedgray">
          Akses ini hanya untuk admin. Jika Anda customer,{" "}
          <Link href="/" className="text-gold hover:underline">
            kembali ke beranda
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
