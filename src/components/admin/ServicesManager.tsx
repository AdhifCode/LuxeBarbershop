"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Edit3, Plus, Sparkles, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/admin/tables/DataTable";
import ServiceForm from "@/components/admin/forms/ServiceForm";
import {
  deleteService,
  toggleServiceActive,
} from "@/server/actions/services";
import { formatRupiah } from "@/lib/utils";
import type { ServiceRow } from "@/types/database";

export default function ServicesManager({
  services,
}: {
  services: ServiceRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [creating, setCreating] = useState(false);

  const onDelete = (id: string) => {
    if (!confirm("Hapus service ini?")) return;
    startTransition(async () => {
      const res = await deleteService(id);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Service deleted.");
      router.refresh();
    });
  };

  const onToggle = (id: string, current: boolean) => {
    startTransition(async () => {
      const res = await toggleServiceActive(id, !current);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      router.refresh();
    });
  };

  const columns: ColumnDef<ServiceRow, unknown>[] = [
    {
      accessorKey: "sort_order",
      header: "#",
      cell: ({ row }) => (
        <span className="text-mutedgray">{row.original.sort_order}</span>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <p className="font-medium text-offwhite">{row.original.title}</p>
          {row.original.is_featured && (
            <Badge tone="gold">
              <Sparkles className="h-2.5 w-2.5" /> Featured
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => (
        <code className="text-xs text-mutedgray">{row.original.slug}</code>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="font-medium text-gold">
          {formatRupiah(row.original.price)}
        </span>
      ),
    },
    {
      accessorKey: "duration_min",
      header: "Duration",
      cell: ({ row }) => `${row.original.duration_min} min`,
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <button
          onClick={() => onToggle(row.original.id, row.original.is_active)}
          disabled={pending}
        >
          <Badge tone={row.original.is_active ? "success" : "neutral"}>
            {row.original.is_active ? "Active" : "Inactive"}
          </Badge>
        </button>
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
            title="Edit"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(row.original.id)}
            disabled={pending}
            className="rounded-md border border-red-500/20 p-1.5 text-red-300 transition-colors hover:border-red-500 hover:bg-red-500/10 disabled:opacity-50"
            title="Delete"
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
          <Plus className="h-4 w-4" /> Add Service
        </Button>
      </div>

      <DataTable
        data={services}
        columns={columns}
        searchPlaceholder="Search services..."
      />

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="New Service"
        size="lg"
      >
        <ServiceForm
          onSuccess={() => {
            setCreating(false);
            router.refresh();
          }}
        />
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Service"
        size="lg"
      >
        {editing && (
          <ServiceForm
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
