"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/guard";
import { gallerySchema, type GalleryInput } from "@/lib/validations/gallery";
import type { ActionResult } from "./services";

export async function listGallery() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, data };
}

export async function createGalleryItem(
  input: GalleryInput
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = gallerySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("gallery")
    .insert(parsed.data)
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/gallery");
  revalidatePath("/", "layout");
  return { ok: true, data: { id: data.id } };
}

export async function updateGalleryItem(
  id: string,
  input: GalleryInput
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = gallerySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("gallery")
    .update(parsed.data)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/gallery");
  revalidatePath("/", "layout");
  return { ok: true, data: undefined };
}

export async function deleteGalleryItem(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("gallery").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/gallery");
  revalidatePath("/", "layout");
  return { ok: true, data: undefined };
}
