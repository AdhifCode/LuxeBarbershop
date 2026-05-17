"use client";

import { LogOut } from "lucide-react";
import { useFormStatus } from "react-dom";
import { signOut } from "@/server/actions/auth";

interface TopbarProps {
  user: {
    fullName: string;
    email: string | null;
    role: string;
  };
}

export default function Topbar({ user }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gold/10 bg-charcoal/85 px-6 backdrop-blur-md lg:px-8">
      {/* Left: greeting */}
      <div>
        <p className="text-[10px] uppercase tracking-luxe text-gold">
          {greet()}
        </p>
        <p className="mt-0.5 font-display text-lg text-offwhite">
          {user.fullName.split(" ")[0]}
        </p>
      </div>

      {/* Right: profile + sign out */}
      <div className="flex items-center gap-3">
        <div className="hidden text-right md:block">
          <p className="text-sm text-offwhite">{user.fullName}</p>
          <p className="text-[10px] uppercase tracking-luxe text-mutedgray">
            {user.role}
          </p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-display text-sm text-gold">
          {user.fullName.charAt(0).toUpperCase()}
        </span>
        <form action={signOut}>
          <SignOutButton />
        </form>
      </div>
    </header>
  );
}

function SignOutButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/15 text-mutedgray transition-all hover:border-red-500/40 hover:text-red-300 disabled:opacity-50"
      aria-label="Sign out"
    >
      <LogOut className="h-4 w-4" strokeWidth={1.8} />
    </button>
  );
}

function greet() {
  const h = new Date().getHours();
  if (h < 11) return "Selamat Pagi";
  if (h < 15) return "Selamat Siang";
  if (h < 18) return "Selamat Sore";
  return "Selamat Malam";
}
