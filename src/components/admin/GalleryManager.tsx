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
import GalleryForm from "@/components/admin/forms/GalleryForm";
import { deleteGalleryItem } from "@/server/actions/gallery";
import type { GalleryRow } from "@/types/database";

export default function GalleryManager({ items }: { items: GalleryRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<GalleryRow | null>(null);
  const [creating, setCreating] = useState(false);

  const onDelete = (id: string) => {
    if (!confirm("Hapus foto ini?")) return;
    startTransition(async () => {
      const res = await deleteGalleryItem(id);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Deleted.");
      router.refresh();
    });
  };

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setCreating(true)} size="sm">
          <Plus className="h-4 w-4" /> Add Photo
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Lookbook masih kosong"
          description="Tambahkan foto hasil potongan untuk mengisi galeri publik."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((g) => (
            <div key={g.id} className="luxe-card group overflow-hidden p-0">
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={g.after_url}
                  alt={g.title}
                  fill
                  sizes="(min-width:1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute right-2 top-2 flex flex-col items-end gap-1">
                  <Badge tone="gold">{g.category}</Badge>
                  {!g.is_published && (
                    <Badge tone="neutral">Draft</Badge>
                  )}
                </div>
              </div>
              <div className="p-4">
                <p className="truncate font-medium text-offwhite">{g.title}</p>
                <div className="mt-3 flex items-center justify-between border-t border-gold/10 pt-2">
                  <span className="text-xs text-mutedgray">
                    #{g.sort_order}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditing(g)}
                      className="rounded-md border border-gold/15 p-1.5 text-mutedgray transition-colors hover:border-gold hover:text-gold"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(g.id)}
                      disabled={pending}
                      className="rounded-md border border-red-500/20 p-1.5 text-red-300 transition-colors hover:border-red-500 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="New Gallery Item"
        size="lg"
      >
        <GalleryForm
          onSuccess={() => {
            setCreating(false);
            router.refresh();
          }}
        />
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Gallery Item"
        size="lg"
      >
        {editing && (
          <GalleryForm
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
