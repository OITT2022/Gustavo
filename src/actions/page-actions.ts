"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/prisma";
import { pageSchema } from "@/validations/page";
import { auth } from "@/lib/auth";
import type { ActionResult, Page } from "@/types";

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function updatePage(
  id: string,
  data: unknown
): Promise<ActionResult<Page>> {
  await requireAuth();
  const parsed = pageSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const page = await getDb().page.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath(`/${page.slug}`);
  return { success: true, data: page };
}

export async function createPage(data: unknown): Promise<ActionResult<Page>> {
  await requireAuth();
  const parsed = pageSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const page = await getDb().page.create({ data: parsed.data });
  revalidatePath("/admin/pages");
  return { success: true, data: page };
}

export async function deletePage(id: string): Promise<ActionResult> {
  await requireAuth();
  await getDb().page.delete({ where: { id } });
  revalidatePath("/admin/pages");
  return { success: true };
}
