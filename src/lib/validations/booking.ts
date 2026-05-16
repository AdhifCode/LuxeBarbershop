import { z } from "zod";

export const createBookingSchema = z.object({
  customer_name: z.string().min(2).max(120),
  customer_phone: z
    .string()
    .min(8)
    .max(20)
    .regex(/^[0-9+\-\s]+$/, "Nomor telepon tidak valid"),
  customer_email: z.string().email().optional().or(z.literal("")),
  service_id: z.string().uuid(),
  barber_id: z.string().uuid().optional().nullable(),
  /** ISO-8601 datetime string */
  start_at: z.string().min(10),
  notes: z.string().max(500).optional().or(z.literal("")),
  promo_code: z.string().optional().or(z.literal("")),
});

export const updateBookingStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
    "NO_SHOW",
  ]),
  reason: z.string().max(300).optional(),
});

export const rescheduleBookingSchema = z.object({
  id: z.string().uuid(),
  start_at: z.string(),
  barber_id: z.string().uuid().optional().nullable(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
export type RescheduleBookingInput = z.infer<typeof rescheduleBookingSchema>;
