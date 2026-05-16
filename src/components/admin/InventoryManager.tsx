"use client";

import { type ColumnDef } from "@tanstack/react-table";
import {
  AlertTriangle,
  ArrowUpDown,
  Edit3,
  Plus,
  Trash2,
} from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/admin/tables/DataTable";
import InventoryForm from "@/components/admin/forms/InventoryForm";
import InventoryMovementForm from "@/components/admin/forms/InventoryMovementForm";
import { deleteInventoryItem } from "@/server/actions/inventory";
import { formatRupiah } from "@/lib/utils";
import type { InventoryItemRow } from "@/types/database";

export default function InventoryManager({
  items,
}: {
  items: InventoryItemRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<InventoryItemRow | null>(null);
  const [moving, setMoving] = useState<InventoryItemRow | null>(null);
  const [creating, setCreating] = useState(false);

  const onDelete = (id: string) => {
    if (!confirm("Hapus item ini? Riwayat movement juga akan terhapus.")) return;
    startTransition(async () => {
      const res = await deleteInventoryItem(id);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Item deleted.");
      router.refresh();
    });
  };

  const columns: ColumnDef<InventoryItemRow, unknown>[] = [
    {
      accessorKey: "name",
      header: "Item",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-offwhite">{row.original.name}</p>
          {row.original.sku && (
            <p className="text-xs text-mutedgray">SKU: {row.original.sku}</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const low = row.original.stock <= row.original.reorder_level;
        return (
          <div className="flex items-center gap-1.5">
            <span
              className={low ? "font-medium text-amber-300" : "text-offwhite"}
            >
              {row.original.stock} {row.original.unit}
            </span>
            {low && (
              <AlertTriangle
                className="h-3.5 w-3.5 text-amber-400"
                strokeWidth={2}
              />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "reorder_level",
      header: "Reorder",
      cell: ({ row }) => (
        <span className="text-xs text-mutedgray">
          {row.original.reorder_level} {row.original.unit}
        </span>
      ),
    },
    {
      accessorKey: "cost_price",
      header: "Cost",
      cell: ({ row }) =>
        row.original.cost_price != null
          ? formatRupiah(row.original.cost_price)
          : "—",
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
            onClick={() => setMoving(row.original)}
            className="rounded-md border border-gold/30 px-2 py-1 text-xs text-gold transition-colors hover:bg-gold/10"
            title="Record movement"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
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
          <Plus className="h-4 w-4" /> Add Item
        </Button>
      </div>

      <DataTable
        data={items}
        columns={columns}
        searchPlaceholder="Search items..."
        emptyMessage="Belum ada item inventory."
      />

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="New Inventory Item"
        size="lg"
      >
        <InventoryForm
          onSuccess={() => {
            setCreating(false);
            router.refresh();
          }}
        />
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Item"
        size="lg"
      >
        {editing && (
          <InventoryForm
            initial={editing}
            onSuccess={() => {
              setEditing(null);
              router.refresh();
            }}
          />
        )}
      </Modal>

      <Modal
        open={!!moving}
        onClose={() => setMoving(null)}
        title="Stock Movement"
        size="md"
      >
        {moving && (
          <InventoryMovementForm
            item={moving}
            onSuccess={() => {
              setMoving(null);
              router.refresh();
            }}
          />
        )}
      </Modal>
    </>
  );
}
