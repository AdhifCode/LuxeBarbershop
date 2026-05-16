"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/admin/tables/DataTable";
import PromoForm from "@/components/admin/forms/PromoForm";
import { deletePromo } from "@/server/actions/promos";
import { formatDateTimeID, formatRupiah } from "@/lib/utils";
import type { PromoRow } from "@/types/database";

export default function PromosManager({ promos }: { promos: PromoRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<PromoRow | null>(null);
  const [creating, setCreating] = useState(false);

  const onDelete = (id: string) => {
    if (!confirm("Hapus promo ini?")) return;
    startTransition(async () => {
      const res = await deletePromo(id);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Promo deleted.");
      router.refresh();
    });
  };

  const columns: ColumnDef<PromoRow, unknown>[] = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-gold">{row.original.code}</span>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <p className="font-medium text-offwhite">{row.original.title}</p>
      ),
    },
    {
      accessorKey: "type",
      header: "Discount",
      cell: ({ row }) =>
        row.original.type === "PERCENTAGE"
          ? `${row.original.value}%`
          : formatRupiah(row.original.value),
    },
    {
      accessorKey: "starts_at",
      header: "Starts",
      cell: ({ row }) => (
        <span className="text-xs text-mutedgray">
          {formatDateTimeID(row.original.starts_at)}
        </span>
      ),
    },
    {
      accessorKey: "ends_at",
      header: "Ends",
      cell: ({ row }) => (
        <span className="text-xs text-mutedgray">
          {formatDateTimeID(row.original.ends_at)}
        </span>
      ),
    },
    {
      accessorKey: "used_count",
      header: "Used",
      cell: ({ row }) => (
        <span className="text-xs text-lightgray">
          {row.original.used_count}
          {row.original.usage_limit ? ` / ${row.original.usage_limit}` : ""}
        </span>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <Badge tone={row.original.is_active ? "success" : "neutral"}>
          {row.original.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setEditing(row.original)}
            className="rounded-md border border-gold/15 p-1.5 text-mutedgray transition-colors hover:border-gold hover:text-gold"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(row.original.id)}
            disabled={pending}
            className="rounded-md border border-red-500/20 p-1.5 text-red-300 transition-colors hover:border-red-500 hover:bg-red-500/10 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setCreating(true)} size="sm">
          <Plus className="h-4 w-4" /> Add Promo
        </Button>
      </div>

      <DataTable
        data={promos}
        columns={columns}
        searchPlaceholder="Search promos..."
        emptyMessage="Belum ada promo aktif."
      />

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="New Promo"
        size="lg"
      >
        <PromoForm
          onSuccess={() => {
            setCreating(false);
            router.refresh();
          }}
        />
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Promo"
        size="lg"
      >
        {editing && (
          <PromoForm
            initial={editing}
            onSuccess={() => {
              setEditing(null);
              router.refresh();
            }}
          />
        )}
      </Modal>
    </>
  );
}
