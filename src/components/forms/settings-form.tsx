"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema, type SettingsFormData } from "@/validations/settings";
import { updateSettings } from "@/actions/settings-actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/types";

interface SettingsFormProps {
  settings: SiteSettings | null;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings || {
      artistName: "Gustavo Bar Valenzuela",
      siteTitle: "Gustavo Bar Valenzuela — Fine Art",
    },
  });

  async function onSubmit(data: SettingsFormData) {
    setError(null);
    setSaved(false);
    const result = await updateSettings(data);
    if (result.success) {
      setSaved(true);
      router.refresh();
    } else {
      setError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {saved && (
        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          Settings saved successfully.
        </div>
      )}

      <h3 className="text-lg font-medium text-gallery-900">General</h3>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="artistName"
          label="Artist Name"
          error={errors.artistName?.message}
          {...register("artistName")}
        />
        <Input
          id="siteTitle"
          label="Site Title"
          error={errors.siteTitle?.message}
          {...register("siteTitle")}
        />
      </div>
      <Input
        id="tagline"
        label="Tagline"
        {...register("tagline")}
      />
      <Textarea
        id="aboutSnippet"
        label="About Snippet (for homepage)"
        rows={3}
        {...register("aboutSnippet")}
      />

      <h3 className="text-lg font-medium text-gallery-900">Contact</h3>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="contactEmail"
          label="Contact Email"
          type="email"
          {...register("contactEmail")}
        />
        <Input
          id="phone"
          label="Phone"
          {...register("phone")}
        />
      </div>
      <Textarea
        id="address"
        label="Address"
        rows={2}
        {...register("address")}
      />

      <h3 className="text-lg font-medium text-gallery-900">Social Links</h3>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="instagram"
          label="Instagram URL"
          {...register("instagram")}
        />
        <Input
          id="facebook"
          label="Facebook URL"
          {...register("facebook")}
        />
        <Input
          id="twitter"
          label="Twitter/X URL"
          {...register("twitter")}
        />
        <Input
          id="youtube"
          label="YouTube URL"
          {...register("youtube")}
        />
      </div>

      <div className="border-t border-gallery-200 pt-6">
        <Button type="submit" loading={isSubmitting}>
          Save Settings
        </Button>
      </div>
    </form>
  );
}
