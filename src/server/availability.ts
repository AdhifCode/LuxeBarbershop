import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { SHOP_HOURS, SLOT_INTERVAL_MIN } from "@/lib/constants";

export interface Slot {
  /** ISO datetime, e.g. "2025-05-15T09:00:00.000Z" */
  start: string;
  /** "09:00" form for display */
  label: string;
  /** Available barber IDs at this slot. Empty = no barber free. */
  availableBarberIds: string[];
}

interface GetAvailabilityArgs {
  /** YYYY-MM-DD in local time of the shop */
  date: string;
  /** Service duration in minutes — required to compute end times */
  durationMin: number;
  /** Optional: restrict to a specific barber */
  barberId?: string | null;
}

/**
 * Compute the available slots for a given date and service duration.
 * Considers: barber active shifts for that weekday, and existing
 * PENDING/CONFIRMED bookings (which block slots that overlap).
 */
export async function getAvailability({
  date,
  durationMin,
  barberId,
}: GetAvailabilityArgs): Promise<Slot[]> {
  const supabase = createSupabaseAdminClient();

  const dayStart = toShopDate(date, SHOP_HOURS.open);
  const dayEnd = toShopDate(date, SHOP_HOURS.close);
  const weekday = dayStart.getDay(); // 0=Sun

  // 1. Pull active barbers (optionally filtered)
  let barberQuery = supabase
    .from("barbers")
    .select("id, full_name")
    .eq("is_active", true);
  if (barberId) barberQuery = barberQuery.eq("id", barberId);
  const { data: barbers } = await barberQuery;
  if (!barbers || barbers.length === 0) return [];

  // 2. Each barber's shift for this weekday
  const { data: shifts } = await supabase
    .from("barber_shifts")
    .select("barber_id, start_time, end_time, is_active, weekday")
    .eq("weekday", weekday)
    .eq("is_active", true)
    .in(
      "barber_id",
      barbers.map((b) => b.id)
    );

  // 3. Existing bookings that day (status that blocks)
  const { data: bookings } = await supabase
    .from("bookings")
    .select("barber_id, start_at, end_at, status")
    .gte("start_at", dayStart.toISOString())
    .lt("start_at", dayEnd.toISOString())
    .in("status", ["PENDING", "CONFIRMED"]);

  // 4. Iterate slots
  const slots: Slot[] = [];
  const interval = SLOT_INTERVAL_MIN * 60 * 1000;
  const durationMs = durationMin * 60 * 1000;

  for (
    let t = dayStart.getTime();
    t + durationMs <= dayEnd.getTime();
    t += interval
  ) {
    const slotStart = new Date(t);
    const slotEnd = new Date(t + durationMs);

    const free = barbers
      .filter((b) => {
        const shift = shifts?.find((s) => s.barber_id === b.id);
        if (!shift) return false;

        // Slot must fit inside the shift
        const shiftStart = toShopDate(date, shift.start_time.slice(0, 5));
        const shiftEnd = toShopDate(date, shift.end_time.slice(0, 5));
        if (slotStart < shiftStart || slotEnd > shiftEnd) return false;

        // No overlap with existing bookings for this barber
        const overlap = (bookings ?? []).some(
          (bk) =>
            bk.barber_id === b.id &&
            new Date(bk.start_at) < slotEnd &&
            new Date(bk.end_at) > slotStart
        );
        return !overlap;
      })
      .map((b) => b.id);

    slots.push({
      start: slotStart.toISOString(),
      label: slotStart.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      availableBarberIds: free,
    });
  }

  return slots;
}

/**
 * Combine a YYYY-MM-DD date with a HH:MM time, treating both as local
 * (server) time. Sufficient for a single-timezone Indonesian shop.
 */
function toShopDate(date: string, time: string): Date {
  return new Date(`${date}T${time}:00`);
}
