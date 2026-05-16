"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/guard";
import {
  inventoryItemSchema,
  inventoryMovementSchema,
  type InventoryItemInput,
  type InventoryMovementInput,
} from "@/lib/validations/inventory";
import type { ActionResult } from "./services";

export async function listInventoryItems() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("inventory_items")
    .select("*")
    .order("name", { ascending: true });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, data };
}

export async function createInventoryItem(
  input: InventoryItemInput
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = inventoryItemSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  }
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("inventory_items")
    .insert(parsed.data)
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/inventory");
  return { ok: true, data: { id: data.id } };
}

export async function updateInventoryItem(
  id: string,
  input: InventoryItemInput
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = inventoryItemSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("inventory_items")
    .update(parsed.data)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/inventory");
  return { ok: true, data: undefined };
}

export async function deleteInventoryItem(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("inventory_items")
    .delete()
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/inventory");
  return { ok: true, data: undefined };
}

/** Record a stock movement; trigger updates the item's stock automatically. */
export async function recordInventoryMovement(
  input: InventoryMovementInput
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = inventoryMovementSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("inventory_movements").insert(parsed.data);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/inventory");
  return { ok: true, data: undefined };
}
