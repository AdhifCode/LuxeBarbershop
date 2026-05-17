import { NextResponse } from "next/server";
import { getAvailability } from "@/server/availability";

// Slots are real-time — never cache the response.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/availability?date=YYYY-MM-DD&duration=45[&barberId=...]
 * Returns the open slots for the customer booking widget.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date");
  const durationParam = url.searchParams.get("duration");
  const barberId = url.searchParams.get("barberId");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  // Reject far-past or far-future probes
  const requested = new Date(date);
  const now = new Date();
  const diffDays =
    (requested.getTime() - new Date(now.toDateString()).getTime()) /
    (1000 * 60 * 60 * 24);
  if (diffDays < -1 || diffDays > 90) {
    return NextResponse.json({ error: "Out-of-range date" }, { status: 400 });
  }

  const durationMin = durationParam ? Number(durationParam) : 45;
  if (!Number.isFinite(durationMin) || durationMin <= 0 || durationMin > 480) {
    return NextResponse.json({ error: "Invalid duration" }, { status: 400 });
  }

  try {
    const slots = await getAvailability({
      date,
      durationMin,
      barberId: barberId || null,
    });
    return NextResponse.json({ slots });
  } catch (e) {
    console.error("[/api/availability] error:", e);
    const message =
      e instanceof Error ? e.message : "Server error fetching availability";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
