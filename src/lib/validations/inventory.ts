import { z } from "zod";

export const inventoryItemSchema = z.object({
  name: z.string().min(2).max(120),
  sku: z.string().max(64).optional().nullable(),
  unit: z.string().min(1).max(16).default("pcs"),
  stock: z.coerce.number().min(0).default(0),
  reorder_level: z.coerce.number().min(0).default(0),
  cost_price: z.coerce.number().int().min(0).optional().nullable(),
  is_active: z.boolean().default(true),
});

export const inventoryMovementSchema = z.object({
  item_id: z.string().uuid(),
  type: z.enum(["IN", "OUT", "ADJUST"]),
  quantity: z.coerce.number().min(0.01),
  reason: z.string().max(300).optional().nullable(),
});

export type InventoryItemInput = z.infer<typeof inventoryItemSchema>;
export type InventoryMovementInput = z.infer<typeof inventoryMovementSchema>;
