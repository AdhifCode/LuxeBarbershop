"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Input, { FieldLabel, Select } from "@/components/ui/Input";
import { gallerySchema, type GalleryInput } from "@/lib/validations/gallery";
import {
  createGalleryItem,
  updateGalleryItem,
} from "@/server/actions/gallery";
import type { GalleryRow } from "@/types/database";

const CATEGORIES = [
  "FADE",
  "CLASSIC",
  "MULLET",
  "BEARD",
  "COLOR",
  "OTHER",
] as const;

interface Props {
  initial?: GalleryRow;
  onSuccess: () => void;
}

export default function GalleryForm({ initial, onSuccess }: Props) {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GalleryInput>({
    resolver: zodResolver(gallerySchema) as never,
    defaultValues: initial
      ? {
          title: initial.title,
          category: initial.category,
          before_url: initial.before_url,
          after_url: initial.after_url,
          barber_id: initial.barber_id,
          is_published: initial.is_published,
          sort_order: initial.sort_order,
        }
      : {
          title: "",
          category: "OTHER",
          before_url: "",
          after_url: "",
          barber_id: null,
          is_published: true,
          sort_order: 0,
        },
  });

  const onSubmit = (values: GalleryInput) => {
    startTransition(async () => {
      const res = initial
        ? await updateGalleryItem(initial.id, values)
        : await createGalleryItem(values);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(initial ? "Updated." : "Created.");
      onSuccess();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FieldLabel htmlFor="title" required>
            Title
          </FieldLabel>
          <Input
            id="title"
            error={errors.title?.message}
            {...register("title")}
          />
        </div>
        <div>
          <FieldLabel htmlFor="category" required>
            Category
          </FieldLabel>
          <Select id="category" {...register("category")}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="after_url" required>
          After photo URL
        </FieldLabel>
        <Input
          id="after_url"
          placeholder="https://…"
          error={errors.after_url?.message}
          {...register("after_url")}
        />
      </div>

      <div>
        <FieldLabel htmlFor="before_url">Before photo URL (optional)</FieldLabel>
        <Input
          id="before_url"
          placeholder="https://…"
          error={errors.before_url?.message}
          {...register("before_url")}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FieldLabel htmlFor="sort_order">Sort order</FieldLabel>
          <Input
            id="sort_order"
            type="number"
            {...register("sort_order")}
          />
        </div>
        <label className="flex items-end gap-2 text-sm text-lightgray">
          <input
            type="checkbox"
            {...register("is_published")}
            className="mb-2.5 h-4 w-4 accent-[#D4AF37]"
          />
          <span className="mb-2">Published</span>
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={pending} size="md">
          {pending ? "Saving…" : initial ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
