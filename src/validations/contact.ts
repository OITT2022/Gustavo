import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  artworkReference: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
