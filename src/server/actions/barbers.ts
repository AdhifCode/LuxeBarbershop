"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/guard";
import {
  barberSchema,
  barberShiftSchema,
  type BarberInput,
  type BarberShiftInput,
} from "@/lib/validations/barber";
import type { ActionResult } from "./services";

export async function listBarbers() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("barbers")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, data };
}

export async function createBarber(
  input: BarberInput
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = barberSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("barbers")
    .insert(parsed.data)
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/barbers");
  return { ok: true, data: { id: data.id } };
}

export async function updateBarber(
  id: string,
  input: BarberInput
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = barberSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("barbers")
    .update(parsed.data)
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/barbers");
  return { ok: true, data: undefined };
}

export async function deleteBarber(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("barbers").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/barbers");
  return { ok: true, data: undefined };
}

// ───── Shifts ─────────────────────────────────
export async function listShifts(barberId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("barber_shifts")
    .select("*")
    .eq("barber_id", barberId)
    .order("weekday", { ascending: true });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, data };
}

export async function upsertShift(
  input: BarberShiftInput & { id?: string }
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = barberShiftSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  const supabase = await createSupabaseServerClient();
  if (input.id) {
    const { error } = await supabase
      .from("barber_shifts")
      .update(parsed.data)
      .eq("id", input.id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase.from("barber_shifts").insert(parsed.data);
    if (error) return { ok: false, error: error.message };
  }
  revalidatePath("/admin/barbers");
  return { ok: true, data: undefined };
}

export async function deleteShift(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("barber_shifts").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/barbers");
  return { ok: true, data: undefined };
}
