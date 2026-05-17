"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/guard";
import {
  createBookingSchema,
  rescheduleBookingSchema,
  updateBookingStatusSchema,
  type CreateBookingInput,
  type RescheduleBookingInput,
  type UpdateBookingStatusInput,
} from "@/lib/validations/booking";
import { buildBookingMessage } from "@/server/notifications/whatsapp";
import type { ActionResult } from "./services";
import type { BookingRow, BookingStatus } from "@/types/database";

// ──────────────────────────────────────────────
// PUBLIC · create booking from the customer site
// ──────────────────────────────────────────────
export async function createBooking(
  input: CreateBookingInput
): Promise<ActionResult<{ id: string; code: string; whatsappUrl: string }>> {
  const parsed = createBookingSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  const admin = createSupabaseAdminClient();

  // 1. Snapshot service
  const { data: service, error: svcErr } = await admin
    .from("services")
    .select("id, title, price, duration_min, is_active")
    .eq("id", parsed.data.service_id)
    .single();
  if (svcErr || !service || !service.is_active) {
    return { ok: false, error: "Layanan tidak tersedia." };
  }

  // 2. Optional barber snapshot
  let barberName: string | null = null;
  if (parsed.data.barber_id) {
    const { data: barber } = await admin
      .from("barbers")
      .select("full_name, is_active")
      .eq("id", parsed.data.barber_id)
      .single();
    if (!barber || !barber.is_active) {
      return { ok: false, error: "Capster tidak tersedia." };
    }
    barberName = barber.full_name;
  }

  // 3. Compute end + total
  const start = new Date(parsed.data.start_at);
  const end = new Date(start.getTime() + service.duration_min * 60 * 1000);

  // 4. Validate & apply promo (optional)
  let promoId: string | null = null;
  let discount = 0;

  if (parsed.data.promo_code) {
    const now = new Date().toISOString();
    const { data: promo } = await admin
      .from("promos")
      .select("*")
      .eq("code", parsed.data.promo_code.toUpperCase())
      .eq("is_active", true)
      .lte("starts_at", now)
      .gte("ends_at", now)
      .maybeSingle();

    if (promo) {
      // Check usage limit — prevent over-redemption
      if (
        promo.usage_limit !== null &&
        promo.used_count >= promo.usage_limit
      ) {
        return { ok: false, error: "Kode promo sudah mencapai batas penggunaan." };
      }

      promoId = promo.id;
      discount =
        promo.type === "PERCENTAGE"
          ? Math.round((service.price * promo.value) / 100)
          : Math.min(promo.value, service.price);
    }
  }

  const totalPrice = Math.max(0, service.price - discount);

  // 5. Insert booking — DB exclusion constraint guards against double-booking
  const { data: created, error: insErr } = await admin
    .from("bookings")
    .insert({
      customer_name: parsed.data.customer_name.trim(),
      customer_phone: parsed.data.customer_phone.trim(),
      customer_email: parsed.data.customer_email || null,
      service_id: service.id,
      service_title: service.title,
      service_price: service.price,
      duration_min: service.duration_min,
      barber_id: parsed.data.barber_id ?? null,
      barber_name: barberName,
      start_at: start.toISOString(),
      end_at: end.toISOString(),
      status: "PENDING",
      promo_id: promoId,
      discount_amount: discount,
      total_price: totalPrice,
      notes: parsed.data.notes || null,
    })
    .select(
      "id, code, customer_name, customer_phone, service_title, barber_name, start_at, total_price, status"
    )
    .single();

  if (insErr) {
    if (insErr.message.includes("no_double_booking")) {
      return {
        ok: false,
        error: "Slot ini sudah dipesan. Silakan pilih jam lain.",
      };
    }
    return { ok: false, error: insErr.message };
  }

  // 6. Atomically increment promo used_count (after successful booking)
  if (promoId) {
    await admin.rpc("increment_promo_used_count", { p_id: promoId });
  }

  // 7. Persist notification record & build WA URL
  const message = buildBookingMessage(
    created as unknown as BookingRow,
    "PENDING"
  );
  await admin.from("notifications").insert({
    booking_id: created.id,
    channel: "WHATSAPP",
    recipient: created.customer_phone,
    body: message,
  });

  const phone = created.customer_phone
    .replace(/[^0-9]/g, "")
    .replace(/^0/, "62");
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  revalidatePath("/admin/bookings");
  return {
    ok: true,
    data: { id: created.id, code: created.code, whatsappUrl },
  };
}

// ──────────────────────────────────────────────
// ADMIN · listing & queries
// ──────────────────────────────────────────────
export async function listBookings(opts?: {
  status?: BookingStatus;
  from?: string;
  to?: string;
}) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  let q = supabase
    .from("bookings")
    .select("*")
    .order("start_at", { ascending: false });

  if (opts?.status) q = q.eq("status", opts.status);
  if (opts?.from) q = q.gte("start_at", opts.from);
  if (opts?.to) q = q.lte("start_at", opts.to);

  const { data, error } = await q;
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, data };
}

// ──────────────────────────────────────────────
// ADMIN · status transition
// ──────────────────────────────────────────────
export async function updateBookingStatus(
  input: UpdateBookingStatusInput
): Promise<ActionResult<{ whatsappUrl: string }>> {
  await requireAdmin();
  const parsed = updateBookingStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  const supabase = await createSupabaseServerClient();
  const { data: updated, error } = await supabase
    .from("bookings")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id)
    .select(
      "id, code, customer_name, customer_phone, service_title, barber_name, start_at, total_price, status"
    )
    .single();

  if (error || !updated) {
    return { ok: false, error: error?.message ?? "Not found" };
  }

  const message = buildBookingMessage(
    updated as unknown as BookingRow,
    parsed.data.status
  );
  await supabase.from("notifications").insert({
    booking_id: updated.id,
    channel: "WHATSAPP",
    recipient: updated.customer_phone,
    body: message,
  });

  const phone = updated.customer_phone
    .replace(/[^0-9]/g, "")
    .replace(/^0/, "62");
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
  return { ok: true, data: { whatsappUrl } };
}

// ──────────────────────────────────────────────
// ADMIN · reschedule
// ──────────────────────────────────────────────
export async function rescheduleBooking(
  input: RescheduleBookingInput
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = rescheduleBookingSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  const supabase = await createSupabaseServerClient();
  const { data: existing } = await supabase
    .from("bookings")
    .select("duration_min")
    .eq("id", parsed.data.id)
    .single();
  if (!existing) return { ok: false, error: "Booking not found" };

  const start = new Date(parsed.data.start_at);
  const end = new Date(start.getTime() + existing.duration_min * 60 * 1000);

  const { error } = await supabase
    .from("bookings")
    .update({
      start_at: start.toISOString(),
      end_at: end.toISOString(),
      barber_id: parsed.data.barber_id ?? null,
      status: "PENDING",
    })
    .eq("id", parsed.data.id);

  if (error) {
    if (error.message.includes("no_double_booking")) {
      return {
        ok: false,
        error: "Slot tujuan bentrok dengan booking lain.",
      };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/bookings");
  return { ok: true, data: undefined };
}

export async function deleteBooking(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/bookings");
  return { ok: true, data: undefined };
}