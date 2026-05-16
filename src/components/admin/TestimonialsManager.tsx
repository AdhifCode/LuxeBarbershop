"use client";

import { Edit3, Plus, Star, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import TestimonialForm from "@/components/admin/forms/TestimonialForm";
import { deleteTestimonial } from "@/server/actions/testimonials";
import type { TestimonialRow } from "@/types/database";

export default function TestimonialsManager({
  items,
}: {
  items: TestimonialRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<TestimonialRow | null>(null);
  const [creating, setCreating] = useState(false);

  const onDelete = (id: string) => {
    if (!confirm("Hapus testimoni ini?")) return;
    startTransition(async () => {
      const res = await deleteTestimonial(id);
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
          <Plus className="h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Belum ada testimoni"
          description="Tambahkan testimoni customer untuk membangun kepercayaan publik."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <div key={t.id} className="luxe-card flex flex-col p-5">
              <div className="flex items-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5"
                    fill={i < t.rating ? "currentColor" : "none"}
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-lightgray">
                &ldquo;{t.message}&rdquo;
              </p>
              <div className="mt-5 flex items-end justify-between border-t border-gold/10 pt-4">
                <div>
                  <p className="font-medium text-offwhite">{t.author_name}</p>
                  {t.author_title && (
                    <p className="text-xs text-mutedgray">{t.author_title}</p>
                  )}
                  <div className="mt-2 flex items-center gap-1.5">
                    {!t.is_published && <Badge tone="neutral">Draft</Badge>}
                    <span className="text-[10px] text-mutedgray">
                      #{t.sort_order}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditing(t)}
                    className="rounded-md border border-gold/15 p-1.5 text-mutedgray transition-colors hover:border-gold hover:text-gold"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(t.id)}
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
        title="New Testimonial"
        size="lg"
      >
        <TestimonialForm
          onSuccess={() => {
            setCreating(false);
            router.refresh();
          }}
        />
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Testimonial"
        size="lg"
      >
        {editing && (
          <TestimonialForm
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
