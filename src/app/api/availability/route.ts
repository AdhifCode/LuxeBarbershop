import { NextResponse } from "next/server";
import { getAvailability } from "@/server/availability";

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
  const durationMin = durationParam ? Number(durationParam) : 45;
  if (!Number.isFinite(durationMin) || durationMin <= 0) {
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
    const error = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error }, { status: 500 });
  }
}
