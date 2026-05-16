import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Public-facing read queries used by Server Components.
 * RLS makes these safe under the anon role.
 */

export async function getActiveServices() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getActiveBarbers() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("barbers")
    .select("id, full_name, photo_url, specialties, bio")
    .eq("is_active", true)
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function getPublishedGallery() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("gallery")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getActivePromos() {
  const supabase = await createSupabaseServerClient();
  const now = new Date().toISOString();
  const { data } = await supabase
    .from("promos")
    .select("*")
    .eq("is_active", true)
    .lte("starts_at", now)
    .gte("ends_at", now)
    .order("ends_at", { ascending: true });
  return data ?? [];
}

export async function getPublishedTestimonials() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}
