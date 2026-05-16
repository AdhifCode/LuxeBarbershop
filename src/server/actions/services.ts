"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/guard";
import { serviceSchema, type ServiceInput } from "@/lib/validations/service";

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function listServices() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, data };
}

export async function createService(
  input: ServiceInput
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("services")
    .insert(parsed.data)
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/services");
  revalidatePath("/", "layout");
  return { ok: true, data: { id: data.id } };
}

export async function updateService(
  id: string,
  input: ServiceInput
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("services")
    .update(parsed.data)
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/services");
  revalidatePath("/", "layout");
  return { ok: true, data: undefined };
}

export async function deleteService(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/services");
  revalidatePath("/", "layout");
  return { ok: true, data: undefined };
}

export async function toggleServiceActive(
  id: string,
  is_active: boolean
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("services")
    .update({ is_active })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/services");
  revalidatePath("/", "layout");
  return { ok: true, data: undefined };
}
