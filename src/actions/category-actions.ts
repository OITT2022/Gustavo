"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/prisma";
import { categorySchema } from "@/validations/category";
import { auth } from "@/lib/auth";
import type { ActionResult, Category } from "@/types";

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function createCategory(data: unknown): Promise<ActionResult<Category>> {
  await requireAuth();
  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const category = await getDb().category.create({ data: parsed.data });
  revalidatePath("/gallery");
  revalidatePath("/admin/categories");
  return { success: true, data: category };
}

export async function updateCategory(
  id: string,
  data: unknown
): Promise<ActionResult<Category>> {
  await requireAuth();
  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const category = await getDb().category.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/gallery");
  revalidatePath(`/gallery/${category.slug}`);
  return { success: true, data: category };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  await requireAuth();
  await getDb().category.delete({ where: { id } });
  revalidatePath("/gallery");
  return { success: true };
}
