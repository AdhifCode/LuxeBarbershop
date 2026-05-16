"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Input, { FieldLabel, Select, Textarea } from "@/components/ui/Input";
import { promoSchema, type PromoInput } from "@/lib/validations/promo";
import { createPromo, updatePromo } from "@/server/actions/promos";
import type { PromoRow } from "@/types/database";

interface Props {
  initial?: PromoRow;
  onSuccess: () => void;
}

function toLocalDateTimeInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  // YYYY-MM-DDTHH:mm
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function PromoForm({ initial, onSuccess }: Props) {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PromoInput>({
    resolver: zodResolver(promoSchema) as never,
    defaultValues: initial
      ? {
          code: initial.code,
          title: initial.title,
          description: initial.description,
          type: initial.type,
          value: initial.value,
          banner_url: initial.banner_url,
          starts_at: toLocalDateTimeInput(initial.starts_at),
          ends_at: toLocalDateTimeInput(initial.ends_at),
          is_active: initial.is_active,
          usage_limit: initial.usage_limit,
        }
      : {
          code: "",
          title: "",
          description: "",
          type: "PERCENTAGE",
          value: 10,
          banner_url: "",
          starts_at: toLocalDateTimeInput(new Date().toISOString()),
          ends_at: toLocalDateTimeInput(
            new Date(Date.now() + 7 * 86400_000).toISOString()
          ),
          is_active: true,
          usage_limit: null,
        },
  });

  const onSubmit = (values: PromoInput) => {
    startTransition(async () => {
      const payload = {
        ...values,
        starts_at: new Date(values.starts_at).toISOString(),
        ends_at: new Date(values.ends_at).toISOString(),
      };
      const res = initial
        ? await updatePromo(initial.id, payload)
        : await createPromo(payload);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(initial ? "Promo updated." : "Promo created.");
      onSuccess();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FieldLabel htmlFor="code" required>
            Code
          </FieldLabel>
          <Input
            id="code"
            placeholder="GRANDOPEN"
            error={errors.code?.message}
            {...register("code")}
          />
        </div>
        <div>
          <FieldLabel htmlFor="title" required>
            Title
          </FieldLabel>
          <Input id="title" error={errors.title?.message} {...register("title")} />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Textarea id="description" rows={2} {...register("description")} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <FieldLabel htmlFor="type" required>
            Type
          </FieldLabel>
          <Select id="type" {...register("type")}>
            <option value="PERCENTAGE">Percentage (%)</option>
            <option value="FIXED_AMOUNT">Fixed amount (Rp)</option>
          </Select>
        </div>
        <div>
          <FieldLabel htmlFor="value" required>
            Value
          </FieldLabel>
          <Input
            id="value"
            type="number"
            min={1}
            error={errors.value?.message}
            {...register("value")}
          />
        </div>
        <div>
          <FieldLabel htmlFor="usage_limit">Usage limit</FieldLabel>
          <Input
            id="usage_limit"
            type="number"
            min={1}
            placeholder="Unlimited"
            {...register("usage_limit")}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FieldLabel htmlFor="starts_at" required>
            Starts at
          </FieldLabel>
          <Input
            id="starts_at"
            type="datetime-local"
            error={errors.starts_at?.message}
            {...register("starts_at")}
          />
        </div>
        <div>
          <FieldLabel htmlFor="ends_at" required>
            Ends at
          </FieldLabel>
          <Input
            id="ends_at"
            type="datetime-local"
            error={errors.ends_at?.message}
            {...register("ends_at")}
          />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="banner_url">Banner image URL</FieldLabel>
        <Input
          id="banner_url"
          placeholder="https://…"
          error={errors.banner_url?.message}
          {...register("banner_url")}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-lightgray">
        <input
          type="checkbox"
          {...register("is_active")}
          className="h-4 w-4 accent-[#D4AF37]"
        />
        Active
      </label>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={pending} size="md">
          {pending ? "Saving…" : initial ? "Update Promo" : "Create Promo"}
        </Button>
      </div>
    </form>
  );
}
