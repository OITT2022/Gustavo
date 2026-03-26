"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { artworkSchema } from "@/validations/artwork";
import { auth } from "@/lib/auth";
import type { ActionResult, Artwork } from "@/types";

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function createArtwork(data: unknown): Promise<ActionResult<Artwork>> {
  await requireAuth();
  const parsed = artworkSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const { galleryImages, tags, ...rest } = parsed.data;
  const artwork = await prisma.artwork.create({
    data: {
      ...rest,
      galleryImages: JSON.stringify(galleryImages),
      tags: JSON.stringify(tags),
      publishedAt: rest.status !== "HIDDEN" ? new Date() : null,
    },
  });

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/for-sale");
  return { success: true, data: artwork };
}

export async function updateArtwork(
  id: string,
  data: unknown
): Promise<ActionResult<Artwork>> {
  await requireAuth();
  const parsed = artworkSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const { galleryImages, tags, ...rest } = parsed.data;
  const artwork = await prisma.artwork.update({
    where: { id },
    data: {
      ...rest,
      galleryImages: JSON.stringify(galleryImages),
      tags: JSON.stringify(tags),
    },
  });

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/for-sale");
  revalidatePath(`/artwork/${artwork.slug}`);
  return { success: true, data: artwork };
}

export async function deleteArtwork(id: string): Promise<ActionResult> {
  await requireAuth();
  const artwork = await prisma.artwork.findUnique({ where: { id } });
  if (!artwork) return { success: false, error: "Artwork not found" };

  await prisma.artwork.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/for-sale");
  return { success: true };
}

export async function toggleArtworkFeatured(id: string): Promise<ActionResult> {
  await requireAuth();
  const artwork = await prisma.artwork.findUnique({ where: { id } });
  if (!artwork) return { success: false, error: "Artwork not found" };

  await prisma.artwork.update({
    where: { id },
    data: { featured: !artwork.featured },
  });

  revalidatePath("/");
  return { success: true };
}

export async function toggleArtworkForSale(id: string): Promise<ActionResult> {
  await requireAuth();
  const artwork = await prisma.artwork.findUnique({ where: { id } });
  if (!artwork) return { success: false, error: "Artwork not found" };

  await prisma.artwork.update({
    where: { id },
    data: { forSale: !artwork.forSale },
  });

  revalidatePath("/for-sale");
  return { success: true };
}
