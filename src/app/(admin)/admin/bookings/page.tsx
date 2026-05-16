import PageHeader from "@/components/layout/admin/PageHeader";
import BookingsTable from "@/components/admin/tables/BookingsTable";
import { listBookings } from "@/server/actions/bookings";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const res = await listBookings();
  const bookings = res.ok ? res.data : [];

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Approve, reschedule, cancel, dan kirim notifikasi WhatsApp ke customer."
      />
      <BookingsTable bookings={bookings} />
    </>
  );
}
