import { z } from "zod";

export const barberSchema = z.object({
  full_name: z.string().min(2).max(120),
  bio: z.string().max(800).optional().nullable(),
  photo_url: z.string().url().optional().nullable(),
  specialties: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
  hire_date: z.string().optional().nullable(),
});

export const barberShiftSchema = z.object({
  barber_id: z.string().uuid(),
  weekday: z.coerce.number().int().min(0).max(6),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  is_active: z.boolean().default(true),
});

export type BarberInput = z.infer<typeof barberSchema>;
export type BarberShiftInput = z.infer<typeof barberShiftSchema>;
