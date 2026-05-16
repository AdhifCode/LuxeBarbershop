"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/guard";
import { promoSchema, type PromoInput } from "@/lib/validations/promo";
import type { ActionResult } from "./services";

export async function listPromos() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("promos")
    .select("*")
    .order("starts_at", { ascending: false });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, data };
}

export async function createPromo(
  input: PromoInput
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = promoSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("promos")
    .insert({ ...parsed.data, code: parsed.data.code.toUpperCase() })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/promos");
  revalidatePath("/", "layout");
  return { ok: true, data: { id: data.id } };
}

export async function updatePromo(
  id: string,
  input: PromoInput
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = promoSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("promos")
    .update({ ...parsed.data, code: parsed.data.code.toUpperCase() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/promos");
  revalidatePath("/", "layout");
  return { ok: true, data: undefined };
}

export async function deletePromo(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("promos").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/promos");
  revalidatePath("/", "layout");
  return { ok: true, data: undefined };
}
