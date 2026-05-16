"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Input, { FieldLabel, Select, Textarea } from "@/components/ui/Input";
import {
  inventoryMovementSchema,
  type InventoryMovementInput,
} from "@/lib/validations/inventory";
import { recordInventoryMovement } from "@/server/actions/inventory";
import type { InventoryItemRow } from "@/types/database";

interface Props {
  item: InventoryItemRow;
  onSuccess: () => void;
}

export default function InventoryMovementForm({ item, onSuccess }: Props) {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InventoryMovementInput>({
    resolver: zodResolver(inventoryMovementSchema) as never,
    defaultValues: {
      item_id: item.id,
      type: "IN",
      quantity: 1,
      reason: "",
    },
  });

  const onSubmit = (values: InventoryMovementInput) => {
    startTransition(async () => {
      const res = await recordInventoryMovement(values);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Stock updated.");
      onSuccess();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="rounded-lg border border-gold/15 bg-navy-50/40 px-4 py-3 text-xs text-mutedgray">
        Item: <span className="text-offwhite">{item.name}</span> · Current stock:{" "}
        <span className="text-gold">
          {item.stock} {item.unit}
        </span>
      </div>

      <input type="hidden" {...register("item_id")} />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FieldLabel htmlFor="type" required>
            Type
          </FieldLabel>
          <Select id="type" {...register("type")}>
            <option value="IN">IN — Add stock</option>
            <option value="OUT">OUT — Remove stock</option>
            <option value="ADJUST">ADJUST — Set absolute stock</option>
          </Select>
        </div>
        <div>
          <FieldLabel htmlFor="quantity" required>
            Quantity
          </FieldLabel>
          <Input
            id="quantity"
            type="number"
            step="0.01"
            min={0.01}
            error={errors.quantity?.message}
            {...register("quantity")}
          />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="reason">Reason / note</FieldLabel>
        <Textarea
          id="reason"
          rows={2}
          placeholder="Restock dari supplier / Pemakaian harian / dll."
          {...register("reason")}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={pending} size="md">
          {pending ? "Saving…" : "Record Movement"}
        </Button>
      </div>
    </form>
  );
}
