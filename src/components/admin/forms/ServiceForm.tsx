"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Input, {
  FieldLabel,
  Select,
  Textarea,
} from "@/components/ui/Input";
import {
  serviceSchema,
  type ServiceInput,
} from "@/lib/validations/service";
import {
  createService,
  updateService,
} from "@/server/actions/services";
import type { ServiceRow } from "@/types/database";

interface Props {
  initial?: ServiceRow;
  onSuccess: () => void;
}

export default function ServiceForm({ initial, onSuccess }: Props) {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema) as never,
    defaultValues: initial
      ? {
          slug: initial.slug,
          title: initial.title,
          description: initial.description,
          price: initial.price,
          duration_min: initial.duration_min,
          is_active: initial.is_active,
          is_featured: initial.is_featured,
          sort_order: initial.sort_order,
          image_url: initial.image_url,
        }
      : {
          slug: "",
          title: "",
          description: "",
          price: 0,
          duration_min: 30,
          is_active: true,
          is_featured: false,
          sort_order: 0,
          image_url: "",
        },
  });

  const onSubmit = (values: ServiceInput) => {
    startTransition(async () => {
      const res = initial
        ? await updateService(initial.id, values)
        : await createService(values);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(initial ? "Service updated." : "Service created.");
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
          <Input id="title" error={errors.title?.message} {...register("title")} />
        </div>
        <div>
          <FieldLabel htmlFor="slug" required>
            Slug
          </FieldLabel>
          <Input
            id="slug"
            placeholder="signature-haircut"
            error={errors.slug?.message}
            {...register("slug")}
          />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Textarea
          id="description"
          rows={3}
          error={errors.description?.message}
          {...register("description")}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <FieldLabel htmlFor="price" required>
            Price (IDR)
          </FieldLabel>
          <Input
            id="price"
            type="number"
            min={0}
            error={errors.price?.message}
            {...register("price")}
          />
        </div>
        <div>
          <FieldLabel htmlFor="duration_min" required>
            Duration (min)
          </FieldLabel>
          <Input
            id="duration_min"
            type="number"
            min={5}
            error={errors.duration_min?.message}
            {...register("duration_min")}
          />
        </div>
        <div>
          <FieldLabel htmlFor="sort_order">Sort order</FieldLabel>
          <Input
            id="sort_order"
            type="number"
            {...register("sort_order")}
          />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="image_url">Image URL</FieldLabel>
        <Input
          id="image_url"
          placeholder="https://…"
          error={errors.image_url?.message}
          {...register("image_url")}
        />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-lightgray">
          <input
            type="checkbox"
            {...register("is_active")}
            className="h-4 w-4 accent-[#D4AF37]"
          />
          Active
        </label>
        <label className="flex items-center gap-2 text-sm text-lightgray">
          <input
            type="checkbox"
            {...register("is_featured")}
            className="h-4 w-4 accent-[#D4AF37]"
          />
          Featured
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={pending} size="md">
          {pending ? "Saving…" : initial ? "Update Service" : "Create Service"}
        </Button>
      </div>
    </form>
  );
}

// Simple select component re-export to keep grouping
export { Select };
