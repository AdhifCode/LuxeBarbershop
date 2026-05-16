"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/guard";
import {
  testimonialSchema,
  type TestimonialInput,
} from "@/lib/validations/gallery";
import type { ActionResult } from "./services";

export async function listTestimonials() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, data };
}

export async function createTestimonial(
  input: TestimonialInput
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  }
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("testimonials")
    .insert(parsed.data)
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/testimonials");
  revalidatePath("/", "layout");
  return { ok: true, data: { id: data.id } };
}

export async function updateTestimonial(
  id: string,
  input: TestimonialInput
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("testimonials")
    .update(parsed.data)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/testimonials");
  revalidatePath("/", "layout");
  return { ok: true, data: undefined };
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/testimonials");
  revalidatePath("/", "layout");
  return { ok: true, data: undefined };
}
