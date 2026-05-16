import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type Role = Database["public"]["Enums"]["user_role"];

export type SessionUser = {
  id: string;
  email: string | null;
  fullName: string;
  role: Role;
};

/**
 * Returns the current authenticated user with their profile,
 * or null if not signed in.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, email")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    id: user.id,
    email: profile.email ?? user.email ?? null,
    fullName: profile.full_name,
    role: profile.role,
  };
}

/**
 * Use in admin Server Components / Actions.
 * Redirects to /login if not signed in or not an admin/staff.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN" && user.role !== "STAFF") {
    redirect("/login?error=forbidden");
  }
  return user;
}
