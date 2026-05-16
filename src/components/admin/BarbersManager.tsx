"use client";

import Image from "next/image";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import BarberForm from "@/components/admin/forms/BarberForm";
import { deleteBarber } from "@/server/actions/barbers";
import type { BarberRow } from "@/types/database";

export default function BarbersManager({ barbers }: { barbers: BarberRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<BarberRow | null>(null);
  const [creating, setCreating] = useState(false);

  const onDelete = (id: string) => {
    if (!confirm("Hapus barber ini?")) return;
    startTransition(async () => {
      const res = await deleteBarber(id);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Barber deleted.");
      router.refresh();
    });
  };

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setCreating(true)} size="sm">
          <Plus className="h-4 w-4" /> Add Barber
        </Button>
      </div>

      {barbers.length === 0 ? (
        <EmptyState
          title="Belum ada barber"
          description="Tambahkan capster untuk muncul di pilihan booking customer."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {barbers.map((b) => (
            <div key={b.id} className="luxe-card overflow-hidden p-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy-50">
                {b.photo_url ? (
                  <Image
                    src={b.photo_url}
                    alt={b.full_name}
                    fill
                    sizes="(min-width:1024px) 33vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-display text-4xl text-gold/30">
                    {b.full_name.charAt(0)}
                  </div>
                )}
                <div className="absolute right-3 top-3">
                  <Badge tone={b.is_active ? "success" : "neutral"}>
                    {b.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg text-offwhite">
                  {b.full_name}
                </h3>
                {b.bio && (
                  <p className="mt-1 line-clamp-2 text-xs text-mutedgray">
                    {b.bio}
                  </p>
                )}
                {b.specialties.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {b.specialties.slice(0, 4).map((s) => (
                      <Badge key={s} tone="gold">
                        {s}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex items-center justify-end gap-1 border-t border-gold/10 pt-3">
                  <button
                    onClick={() => setEditing(b)}
                    className="rounded-md border border-gold/15 p-1.5 text-mutedgray transition-colors hover:border-gold hover:text-gold"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(b.id)}
                    disabled={pending}
                    className="rounded-md border border-red-500/20 p-1.5 text-red-300 transition-colors hover:border-red-500 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="New Barber"
        size="lg"
      >
        <BarberForm
          onSuccess={() => {
            setCreating(false);
            router.refresh();
          }}
        />
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Barber"
        size="lg"
      >
        {editing && (
          <BarberForm
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
