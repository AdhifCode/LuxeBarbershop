import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Public-facing read queries used by Server Components.
 * RLS makes these safe under the anon role.
 *
 * On Supabase error we log + return [] so the page still renders
 * (Server Components can fall back to seed data instead of crashing).
 */

function logIfError(scope: string, error: unknown) {
  if (error) console.warn(`[queries] ${scope}:`, error);
}

export async function getActiveServices() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  logIfError("getActiveServices", error);
  return data ?? [];
}

export async function getActiveBarbers() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("barbers")
    .select("id, full_name, photo_url, specialties, bio")
    .eq("is_active", true)
    .order("created_at", { ascending: true });
  logIfError("getActiveBarbers", error);
  return data ?? [];
}

export async function getPublishedGallery() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  logIfError("getPublishedGallery", error);
  return data ?? [];
}

export async function getActivePromos() {
  const supabase = await createSupabaseServerClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("promos")
    .select("*")
    .eq("is_active", true)
    .lte("starts_at", now)
    .gte("ends_at", now)
    .order("ends_at", { ascending: true });
  logIfError("getActivePromos", error);
  return data ?? [];
}

export async function getPublishedTestimonials() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  logIfError("getPublishedTestimonials", error);
  return data ?? [];
}
