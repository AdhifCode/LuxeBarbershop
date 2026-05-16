"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Input, { FieldLabel } from "@/components/ui/Input";
import {
  inventoryItemSchema,
  type InventoryItemInput,
} from "@/lib/validations/inventory";
import {
  createInventoryItem,
  updateInventoryItem,
} from "@/server/actions/inventory";
import type { InventoryItemRow } from "@/types/database";

interface Props {
  initial?: InventoryItemRow;
  onSuccess: () => void;
}

export default function InventoryForm({ initial, onSuccess }: Props) {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InventoryItemInput>({
    resolver: zodResolver(inventoryItemSchema) as never,
    defaultValues: initial
      ? {
          name: initial.name,
          sku: initial.sku,
          unit: initial.unit,
          stock: initial.stock,
          reorder_level: initial.reorder_level,
          cost_price: initial.cost_price,
          is_active: initial.is_active,
        }
      : {
          name: "",
          sku: "",
          unit: "pcs",
          stock: 0,
          reorder_level: 0,
          cost_price: null,
          is_active: true,
        },
  });

  const onSubmit = (values: InventoryItemInput) => {
    startTransition(async () => {
      const res = initial
        ? await updateInventoryItem(initial.id, values)
        : await createInventoryItem(values);
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
          <FieldLabel htmlFor="name" required>
            Name
          </FieldLabel>
          <Input id="name" error={errors.name?.message} {...register("name")} />
        </div>
        <div>
          <FieldLabel htmlFor="sku">SKU</FieldLabel>
          <Input id="sku" placeholder="POM-001" {...register("sku")} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <FieldLabel htmlFor="unit" required>
            Unit
          </FieldLabel>
          <Input id="unit" placeholder="pcs / ml / gr" {...register("unit")} />
        </div>
        <div>
          <FieldLabel htmlFor="stock">Initial stock</FieldLabel>
          <Input
            id="stock"
            type="number"
            step="0.01"
            min={0}
            {...register("stock")}
          />
        </div>
        <div>
          <FieldLabel htmlFor="reorder_level">Reorder level</FieldLabel>
          <Input
            id="reorder_level"
            type="number"
            step="0.01"
            min={0}
            {...register("reorder_level")}
          />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="cost_price">Cost price (IDR)</FieldLabel>
        <Input
          id="cost_price"
          type="number"
          min={0}
          {...register("cost_price")}
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
          {pending ? "Saving…" : initial ? "Update Item" : "Create Item"}
        </Button>
      </div>
    </form>
  );
}
