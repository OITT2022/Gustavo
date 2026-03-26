import { z } from "zod";

export const settingsSchema = z.object({
  artistName: z.string().min(1, "Artist name is required"),
  siteTitle: z.string().min(1, "Site title is required"),
  tagline: z.string().optional(),
  aboutSnippet: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  youtube: z.string().optional(),
  linkedin: z.string().optional(),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
