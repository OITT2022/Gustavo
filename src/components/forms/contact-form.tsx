"use client";

import { useFormStatus } from "react-dom";
import { useState } from "react";
import { submitContactForm } from "@/actions/contact-actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} size="lg" className="w-full sm:w-auto">
      Send Message
    </Button>
  );
}

interface ContactFormProps {
  artworkReference?: string;
}

export function ContactForm({ artworkReference }: ContactFormProps) {
  const [result, setResult] = useState<{
    success?: boolean;
    error?: string;
  } | null>(null);

  async function handleSubmit(formData: FormData) {
    const res = await submitContactForm(formData);
    setResult(res);
  }

  if (result?.success) {
    return (
      <div className="rounded-md border border-green-200 bg-green-50 p-6 text-center">
        <h3 className="text-lg font-medium text-green-800">
          Message Sent Successfully
        </h3>
        <p className="mt-2 text-sm text-green-600">
          Thank you for your inquiry. We will get back to you shortly.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setResult(null)}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {result?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {result.error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="fullName"
          name="fullName"
          label="Full Name"
          placeholder="Your full name"
          required
        />
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="your@email.com"
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="phone"
          name="phone"
          type="tel"
          label="Phone (optional)"
          placeholder="+1 (555) 000-0000"
        />
        <Input
          id="subject"
          name="subject"
          label="Subject (optional)"
          placeholder="General inquiry"
        />
      </div>

      <Textarea
        id="message"
        name="message"
        label="Message"
        placeholder="Tell us about your interest..."
        rows={6}
        required
      />

      {artworkReference && (
        <input type="hidden" name="artworkReference" value={artworkReference} />
      )}

      <SubmitButton />
    </form>
  );
}
