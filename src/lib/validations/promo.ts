import { z } from "zod";

export const promoSchema = z
  .object({
    code: z
      .string()
      .min(2)
      .max(32)
      .regex(/^[A-Z0-9_-]+$/, "Uppercase, numbers, _ and - only"),
    title: z.string().min(2).max(120),
    description: z.string().max(500).optional().nullable(),
    type: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
    value: z.coerce.number().int().min(1),
    banner_url: z.string().url().optional().nullable(),
    starts_at: z.string(),
    ends_at: z.string(),
    is_active: z.boolean().default(true),
    usage_limit: z.coerce.number().int().min(1).optional().nullable(),
  })
  .refine((d) => new Date(d.ends_at) > new Date(d.starts_at), {
    message: "End date must be after start date",
    path: ["ends_at"],
  })
  .refine((d) => d.type !== "PERCENTAGE" || d.value <= 100, {
    message: "Percentage cannot exceed 100",
    path: ["value"],
  });

export type PromoInput = z.infer<typeof promoSchema>;
