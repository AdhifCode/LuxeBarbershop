import { z } from "zod";

export const serviceSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and dashes only"),
  title: z.string().min(2).max(120),
  description: z.string().max(500).optional().nullable(),
  price: z.coerce.number().int().min(0),
  duration_min: z.coerce.number().int().min(5).max(480),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
  image_url: z.string().url().optional().nullable(),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
