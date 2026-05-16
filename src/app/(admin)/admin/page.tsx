import { CalendarDays, Clock, DollarSign, TrendingUp } from "lucide-react";
import PageHeader from "@/components/layout/admin/PageHeader";
import StatCard from "@/components/admin/stats/StatCard";
import RevenueChart from "@/components/admin/stats/RevenueChart";
import PopularServices from "@/components/admin/stats/PopularServices";
import { getAnalyticsOverview } from "@/server/actions/analytics";
import { formatRupiah } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const data = await getAnalyticsOverview();

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview operasional Luxe Barbershop hari ini, minggu ini, dan tren layanan terlaris."
      />

      {/* Stat cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Bookings Today"
          value={String(data.bookingsToday)}
          icon={CalendarDays}
          highlight
        />
        <StatCard
          label="Pending Approvals"
          value={String(data.pendingBookings)}
          icon={Clock}
          hint="Menunggu konfirmasi admin"
        />
        <StatCard
          label="Weekly Revenue"
          value={formatRupiah(data.weeklyRevenue)}
          icon={DollarSign}
          hint="Confirmed + Completed"
        />
        <StatCard
          label="Monthly Revenue"
          value={formatRupiah(data.monthlyRevenue)}
          icon={TrendingUp}
          hint="Sejak awal bulan"
        />
      </section>

      {/* Charts */}
      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={data.weeklyTrend} />
        </div>
        <div>
          <PopularServices items={data.popularServices} />
        </div>
      </section>
    </>
  );
}
