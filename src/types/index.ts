import type {
  Artwork,
  Category,
  Page,
  ContactMessage,
  AdminUser,
  SiteSettings,
} from "@prisma/client";

export type { Artwork, Category, Page, ContactMessage, AdminUser, SiteSettings };

export type ArtworkWithCategory = Artwork & {
  category: Category | null;
};

export type CategoryWithCount = Category & {
  _count: { artworks: number };
};

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

export type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "image"; url: string; alt?: string; caption?: string }
  | { type: "quote"; text: string; attribution?: string };

/** Parse JSON string fields that store arrays */
export function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

/** Parse JSON string fields that store content blocks */
export function parseBodyContent(value: string | null | undefined): ContentBlock[] {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}
