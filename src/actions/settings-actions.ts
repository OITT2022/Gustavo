"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/prisma";
import { settingsSchema } from "@/validations/settings";
import { auth } from "@/lib/auth";
import type { ActionResult, SiteSettings } from "@/types";

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function updateSettings(
  data: unknown
): Promise<ActionResult<SiteSettings>> {
  await requireAuth();
  const parsed = settingsSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const settings = await (await getDb()).siteSettings.upsert({
    where: { id: "default" },
    update: parsed.data,
    create: { id: "default", ...parsed.data },
  });

  revalidatePath("/");
  return { success: true, data: settings };
}

export async function getSettings(): Promise<SiteSettings | null> {
  return (await getDb()).siteSettings.findUnique({ where: { id: "default" } });
}
