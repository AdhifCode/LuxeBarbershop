"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Check, ExternalLink, Trash2, X } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import DataTable from "./DataTable";
import Badge from "@/components/ui/Badge";
import {
  deleteBooking,
  updateBookingStatus,
} from "@/server/actions/bookings";
import { formatDateTimeID, formatRupiah } from "@/lib/utils";
import type { BookingRow, BookingStatus } from "@/types/database";

const statusTone: Record<
  BookingStatus,
  "neutral" | "success" | "warning" | "danger" | "info" | "gold"
> = {
  PENDING: "warning",
  CONFIRMED: "info",
  COMPLETED: "success",
  CANCELLED: "danger",
  NO_SHOW: "neutral",
};

export default function BookingsTable({ bookings }: { bookings: BookingRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onStatus = (id: string, status: BookingStatus) => {
    startTransition(async () => {
      const res = await updateBookingStatus({ id, status });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(
        status === "CONFIRMED"
          ? "Booking dikonfirmasi."
          : status === "CANCELLED"
            ? "Booking dibatalkan."
            : "Status diperbarui.",
        {
          action: {
            label: "Kirim WA",
            onClick: () =>
              window.open(res.data.whatsappUrl, "_blank", "noopener"),
          },
        }
      );
      router.refresh();
    });
  };

  const onDelete = (id: string) => {
    if (!confirm("Hapus booking ini secara permanen?")) return;
    startTransition(async () => {
      const res = await deleteBooking(id);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Booking dihapus.");
      router.refresh();
    });
  };

  const columns: ColumnDef<BookingRow, unknown>[] = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-gold">{row.original.code}</span>
      ),
    },
    {
      accessorKey: "customer_name",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-offwhite">
            {row.original.customer_name}
          </p>
          <p className="text-xs text-mutedgray">
            {row.original.customer_phone}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "service_title",
      header: "Service",
      cell: ({ row }) => (
        <div>
          <p className="text-offwhite">{row.original.service_title}</p>
          {row.original.barber_name && (
            <p className="text-xs text-mutedgray">
              with {row.original.barber_name}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "start_at",
      header: "Schedule",
      cell: ({ row }) => (
        <span className="text-sm text-offwhite">
          {formatDateTimeID(row.original.start_at)}
        </span>
      ),
    },
    {
      accessorKey: "total_price",
      header: "Total",
      cell: ({ row }) => (
        <span className="font-medium text-gold">
          {formatRupiah(row.original.total_price)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge tone={statusTone[row.original.status]}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const b = row.original;
        const phone = b.customer_phone.replace(/[^0-9]/g, "").replace(/^0/, "62");
        return (
          <div className="flex items-center justify-end gap-1">
            {b.status === "PENDING" && (
              <button
                onClick={() => onStatus(b.id, "CONFIRMED")}
                disabled={pending}
                title="Approve"
                className="rounded-md border border-emerald-500/30 p-1.5 text-emerald-300 transition-colors hover:border-emerald-500 hover:bg-emerald-500/10 disabled:opacity-50"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            )}
            {(b.status === "PENDING" || b.status === "CONFIRMED") && (
              <button
                onClick={() => onStatus(b.id, "CANCELLED")}
                disabled={pending}
                title="Cancel"
                className="rounded-md border border-amber-500/30 p-1.5 text-amber-300 transition-colors hover:border-amber-500 hover:bg-amber-500/10 disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            {b.status === "CONFIRMED" && (
              <button
                onClick={() => onStatus(b.id, "COMPLETED")}
                disabled={pending}
                title="Mark complete"
                className="rounded-md border border-gold/30 p-1.5 text-gold transition-colors hover:border-gold hover:bg-gold/10 disabled:opacity-50"
              >
                ✓
              </button>
            )}
            <a
              href={`https://wa.me/${phone}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Open WhatsApp"
              className="rounded-md border border-gold/15 p-1.5 text-mutedgray transition-colors hover:border-gold hover:text-gold"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button
              onClick={() => onDelete(b.id)}
              disabled={pending}
              title="Delete"
              className="rounded-md border border-red-500/20 p-1.5 text-red-300 transition-colors hover:border-red-500 hover:bg-red-500/10 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      data={bookings}
      columns={columns}
      searchPlaceholder="Search by name, phone, code..."
      emptyMessage="Belum ada booking."
    />
  );
}
