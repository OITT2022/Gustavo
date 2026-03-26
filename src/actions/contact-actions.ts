"use server";

import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/validations/contact";
import type { ActionResult } from "@/types";

export async function submitContactForm(
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    artworkReference: formData.get("artworkReference"),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  await prisma.contactMessage.create({ data: parsed.data });
  return { success: true };
}

export async function toggleMessageHandled(id: string): Promise<ActionResult> {
  const msg = await prisma.contactMessage.findUnique({ where: { id } });
  if (!msg) return { success: false, error: "Message not found" };

  await prisma.contactMessage.update({
    where: { id },
    data: { isHandled: !msg.isHandled },
  });
  return { success: true };
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  await prisma.contactMessage.delete({ where: { id } });
  return { success: true };
}
