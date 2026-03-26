"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pageSchema, type PageFormData } from "@/validations/page";
import { updatePage } from "@/actions/page-actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Page } from "@/types";

interface PageFormProps {
  page: Page;
}

export function PageForm({ page }: PageFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const bodyText =
    page.bodyContent && Array.isArray(page.bodyContent)
      ? (page.bodyContent as { type: string; text: string }[])
          .map((block) => block.text)
          .join("\n\n")
      : "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      ...page,
      heroTitle: page.heroTitle || "",
      heroSubtitle: page.heroSubtitle || "",
      heroImageUrl: page.heroImageUrl || "",
      seoTitle: page.seoTitle || "",
      seoDescription: page.seoDescription || "",
    },
  });

  async function onSubmit(data: PageFormData) {
    setError(null);

    // Convert body text to simple content blocks
    const bodyContent = data.bodyContent
      ? [{ type: "paragraph", text: data.bodyContent }]
      : undefined;

    const result = await updatePage(page.id, { ...data, bodyContent });

    if (result.success) {
      router.push("/admin/pages");
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

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="title"
          label="Title"
          error={errors.title?.message}
          {...register("title")}
        />
        <Input
          id="slug"
          label="Slug"
          error={errors.slug?.message}
          {...register("slug")}
          disabled
        />
      </div>

      <h3 className="text-lg font-medium text-gallery-900">Hero Section</h3>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="heroTitle"
          label="Hero Title"
          {...register("heroTitle")}
        />
        <Input
          id="heroSubtitle"
          label="Hero Subtitle"
          {...register("heroSubtitle")}
        />
      </div>
      <Input
        id="heroImageUrl"
        label="Hero Image URL"
        placeholder="https://..."
        {...register("heroImageUrl")}
      />

      <h3 className="text-lg font-medium text-gallery-900">Content</h3>
      <Textarea
        id="bodyContent"
        label="Body Content"
        rows={12}
        defaultValue={bodyText}
        {...register("bodyContent")}
      />

      <h3 className="text-lg font-medium text-gallery-900">SEO</h3>
      <Input
        id="seoTitle"
        label="SEO Title"
        {...register("seoTitle")}
      />
      <Textarea
        id="seoDescription"
        label="SEO Description"
        rows={2}
        {...register("seoDescription")}
      />

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("isPublished")} className="rounded" />
          Published
        </label>
      </div>

      <div className="flex gap-3 border-t border-gallery-200 pt-6">
        <Button type="submit" loading={isSubmitting}>
          Save Page
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
