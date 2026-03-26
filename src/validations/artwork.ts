import { z } from "zod";

export const artworkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  artistName: z.string().default("Gustavo Bar Valenzuela"),
  year: z.coerce.number().int().min(1900).max(2100).nullable().optional(),
  medium: z.string().optional(),
  dimensionsText: z.string().optional(),
  width: z.coerce.number().positive().nullable().optional(),
  height: z.coerce.number().positive().nullable().optional(),
  depth: z.coerce.number().positive().nullable().optional(),
  unit: z.string().default("cm"),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  mainImageUrl: z.string().min(1, "Main image is required"),
  galleryImages: z.array(z.string()).default([]),
  categoryId: z.string().nullable().optional(),
  collectionPeriod: z.string().optional(),
  tags: z.array(z.string()).default([]),
  price: z.coerce.number().min(0).nullable().optional(),
  currency: z.string().default("USD"),
  status: z.enum(["AVAILABLE", "SOLD", "RESERVED", "HIDDEN"]).default("AVAILABLE"),
  featured: z.boolean().default(false),
  forSale: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type ArtworkFormData = z.infer<typeof artworkSchema>;
