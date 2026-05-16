"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Input, { FieldLabel, Textarea } from "@/components/ui/Input";
import {
  testimonialSchema,
  type TestimonialInput,
} from "@/lib/validations/gallery";
import {
  createTestimonial,
  updateTestimonial,
} from "@/server/actions/testimonials";
import type { TestimonialRow } from "@/types/database";

interface Props {
  initial?: TestimonialRow;
  onSuccess: () => void;
}

export default function TestimonialForm({ initial, onSuccess }: Props) {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestimonialInput>({
    resolver: zodResolver(testimonialSchema) as never,
    defaultValues: initial
      ? {
          author_name: initial.author_name,
          author_title: initial.author_title,
          author_avatar: initial.author_avatar,
          rating: initial.rating,
          message: initial.message,
          is_published: initial.is_published,
          sort_order: initial.sort_order,
        }
      : {
          author_name: "",
          author_title: "",
          author_avatar: "",
          rating: 5,
          message: "",
          is_published: true,
          sort_order: 0,
        },
  });

  const onSubmit = (values: TestimonialInput) => {
    startTransition(async () => {
      const res = initial
        ? await updateTestimonial(initial.id, values)
        : await createTestimonial(values);
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
          <FieldLabel htmlFor="author_name" required>
            Author name
          </FieldLabel>
          <Input
            id="author_name"
            error={errors.author_name?.message}
            {...register("author_name")}
          />
        </div>
        <div>
          <FieldLabel htmlFor="author_title">Author title</FieldLabel>
          <Input
            id="author_title"
            placeholder="Software Engineer"
            {...register("author_title")}
          />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="author_avatar">Avatar URL</FieldLabel>
        <Input
          id="author_avatar"
          placeholder="https://…"
          error={errors.author_avatar?.message}
          {...register("author_avatar")}
        />
      </div>

      <div>
        <FieldLabel htmlFor="message" required>
          Message
        </FieldLabel>
        <Textarea
          id="message"
          rows={3}
          error={errors.message?.message}
          {...register("message")}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <FieldLabel htmlFor="rating" required>
            Rating (1-5)
          </FieldLabel>
          <Input
            id="rating"
            type="number"
            min={1}
            max={5}
            error={errors.rating?.message}
            {...register("rating")}
          />
        </div>
        <div>
          <FieldLabel htmlFor="sort_order">Sort order</FieldLabel>
          <Input id="sort_order" type="number" {...register("sort_order")} />
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
