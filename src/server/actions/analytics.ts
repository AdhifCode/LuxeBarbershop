"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/guard";

export interface AnalyticsOverview {
  bookingsToday: number;
  pendingBookings: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  weeklyTrend: { day: string; revenue: number; bookings: number }[];
  popularServices: { service_title: string; count: number; revenue: number }[];
  statusBreakdown: { status: string; count: number }[];
}

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const sevenDaysAgo = new Date(todayStart);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    todayCount,
    pendingCount,
    weekly,
    monthly,
    weekRows,
    serviceRows,
    statusRows,
  ] = await Promise.all([
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .gte("start_at", todayStart.toISOString())
      .lt("start_at", todayEnd.toISOString()),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("status", "PENDING"),
    supabase
      .from("bookings")
      .select("total_price")
      .in("status", ["CONFIRMED", "COMPLETED"])
      .gte("start_at", sevenDaysAgo.toISOString()),
    supabase
      .from("bookings")
      .select("total_price")
      .in("status", ["CONFIRMED", "COMPLETED"])
      .gte("start_at", monthStart.toISOString()),
    supabase
      .from("bookings")
      .select("start_at, total_price, status")
      .gte("start_at", sevenDaysAgo.toISOString()),
    supabase
      .from("bookings")
      .select("service_title, total_price")
      .in("status", ["CONFIRMED", "COMPLETED"])
      .gte("start_at", monthStart.toISOString()),
    supabase.from("bookings").select("status").gte("start_at", monthStart.toISOString()),
  ]);

  // Weekly trend buckets
  const buckets = new Map<string, { revenue: number; bookings: number }>();
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, { revenue: 0, bookings: 0 });
  }
  (weekRows.data ?? []).forEach((r) => {
    const key = r.start_at.slice(0, 10);
    const b = buckets.get(key);
    if (!b) return;
    b.bookings += 1;
    if (r.status === "CONFIRMED" || r.status === "COMPLETED") {
      b.revenue += r.total_price;
    }
  });
  const weeklyTrend = Array.from(buckets.entries()).map(([day, v]) => ({
    day,
    revenue: v.revenue,
    bookings: v.bookings,
  }));

  // Popular services
  const svcMap = new Map<string, { count: number; revenue: number }>();
  (serviceRows.data ?? []).forEach((r) => {
    const cur = svcMap.get(r.service_title) ?? { count: 0, revenue: 0 };
    cur.count += 1;
    cur.revenue += r.total_price;
    svcMap.set(r.service_title, cur);
  });
  const popularServices = Array.from(svcMap.entries())
    .map(([service_title, v]) => ({ service_title, ...v }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Status breakdown
  const statusMap = new Map<string, number>();
  (statusRows.data ?? []).forEach((r) => {
    statusMap.set(r.status, (statusMap.get(r.status) ?? 0) + 1);
  });
  const statusBreakdown = Array.from(statusMap.entries()).map(
    ([status, count]) => ({ status, count })
  );

  const sumRevenue = (rows: { total_price: number }[] | null) =>
    (rows ?? []).reduce((acc, r) => acc + r.total_price, 0);

  return {
    bookingsToday: todayCount.count ?? 0,
    pendingBookings: pendingCount.count ?? 0,
    weeklyRevenue: sumRevenue(weekly.data),
    monthlyRevenue: sumRevenue(monthly.data),
    weeklyTrend,
    popularServices,
    statusBreakdown,
  };
}
