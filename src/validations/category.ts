import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  coverImageUrl: z.string().optional(),
  type: z.enum(["PERIOD", "DRAWINGS", "COMMISSIONS", "SALE", "GENERAL"]).default("GENERAL"),
  sortOrder: z.coerce.number().int().default(0),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
