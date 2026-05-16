import { z } from "zod";

export const gallerySchema = z.object({
  title: z.string().min(2).max(120),
  category: z.enum(["FADE", "CLASSIC", "MULLET", "BEARD", "COLOR", "OTHER"]),
  before_url: z.string().url().optional().nullable(),
  after_url: z.string().url(),
  barber_id: z.string().uuid().optional().nullable(),
  is_published: z.boolean().default(true),
  sort_order: z.coerce.number().int().default(0),
});

export const testimonialSchema = z.object({
  author_name: z.string().min(2).max(120),
  author_title: z.string().max(120).optional().nullable(),
  author_avatar: z.string().url().optional().nullable(),
  rating: z.coerce.number().int().min(1).max(5),
  message: z.string().min(10).max(1000),
  is_published: z.boolean().default(true),
  sort_order: z.coerce.number().int().default(0),
});

export type GalleryInput = z.infer<typeof gallerySchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
