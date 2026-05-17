import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

/**
 * Refresh the Supabase session on every request.
 *
 * Role check reads from JWT app_metadata (set by the sync_role_to_jwt
 * DB trigger) instead of querying the profiles table on every request.
 * This eliminates one round-trip per admin page load.
 *
 * Prerequisites — run once in Supabase SQL Editor:
 *
 *   CREATE OR REPLACE FUNCTION sync_role_to_jwt()
 *   RETURNS TRIGGER AS $$
 *   BEGIN
 *     UPDATE auth.users
 *     SET raw_app_meta_data =
 *       raw_app_meta_data || jsonb_build_object('role', NEW.role)
 *     WHERE id = NEW.id;
 *     RETURN NEW;
 *   END;
 *   $$ LANGUAGE plpgsql SECURITY DEFINER;
 *
 *   CREATE TRIGGER trg_sync_role
 *     AFTER INSERT OR UPDATE OF role ON profiles
 *     FOR EACH ROW EXECUTE FUNCTION sync_role_to_jwt();
 *
 * After creating the trigger, manually backfill existing users:
 *
 *   UPDATE profiles SET role = role;  -- fires trigger for all rows
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: do not remove — refreshes the session cookie
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    // Read role from JWT app_metadata — no extra DB query needed.
    // Falls back to a profiles query only when app_metadata has no role
    // (e.g. users created before the sync trigger was installed).
    const jwtRole = user.app_metadata?.role as string | undefined;

    if (jwtRole) {
      if (jwtRole !== "ADMIN" && jwtRole !== "STAFF") {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("error", "forbidden");
        return NextResponse.redirect(url);
      }
    } else {
      // Fallback: query profiles table (slower, but safe for legacy users)
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || (profile.role !== "ADMIN" && profile.role !== "STAFF")) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("error", "forbidden");
        return NextResponse.redirect(url);
      }
    }
  }

  return response;
}