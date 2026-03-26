"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pageSchema, type PageFormData } from "@/validations/page";
import { updatePage } from "@/actions/page-actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "./image-upload";
import { RichEditor } from "./rich-editor";
import type { Page } from "@/types";

interface PageFormProps {
  page: Page;
}

export function PageForm({ page }: PageFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Parse body content from JSON to markdown-like text
  let initialBody = "";
  if (page.bodyContent) {
    try {
      const parsed = typeof page.bodyContent === "string"
        ? JSON.parse(page.bodyContent)
        : page.bodyContent;
      if (Array.isArray(parsed)) {
        initialBody = parsed.map((block: { type: string; text: string }) => {
          if (block.type === "heading") return `## ${block.text}`;
          if (block.type === "image") return `![](${(block as { url?: string }).url || ""})`;
          if (block.type === "quote") return `> ${block.text}`;
          return block.text;
        }).join("\n\n");
      }
    } catch { /* use empty */ }
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: page.title,
      slug: page.slug,
      heroTitle: page.heroTitle || "",
      heroSubtitle: page.heroSubtitle || "",
      heroImageUrl: page.heroImageUrl || "",
      bodyContent: initialBody,
      seoTitle: page.seoTitle || "",
      seoDescription: page.seoDescription || "",
      isPublished: page.isPublished,
    },
  });

  async function uploadImage(file: File): Promise<string> {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (cloudName && preset) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", preset);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: formData });
      const data = (await res.json()) as { secure_url: string };
      return data.secure_url;
    }

    // Fallback: save as base64 data URL (not ideal for production)
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  async function onSubmit(data: PageFormData) {
    setError(null);

    // Convert markdown-like text to content blocks JSON
    const lines = (data.bodyContent || "").split("\n").filter(Boolean);
    const blocks: { type: string; text: string; url?: string }[] = [];
    for (const line of lines) {
      if (line.startsWith("## ")) {
        blocks.push({ type: "heading", text: line.slice(3).trim() });
      } else if (line.startsWith("### ")) {
        blocks.push({ type: "heading", text: line.slice(4).trim() });
      } else if (line.startsWith("> ")) {
        blocks.push({ type: "quote", text: line.slice(2).trim() });
      } else if (line.match(/^!\[.*\]\(.*\)$/)) {
        const match = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (match) blocks.push({ type: "image", text: match[1], url: match[2] });
      } else if (line.trim()) {
        blocks.push({ type: "paragraph", text: line.trim() });
      }
    }

    const bodyContent = JSON.stringify(blocks);
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
        <Input id="title" label="Title" error={errors.title?.message} {...register("title")} />
        <Input id="slug" label="Slug" error={errors.slug?.message} {...register("slug")} disabled />
      </div>

      <h3 className="text-lg font-medium text-gallery-900">Hero Section</h3>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input id="heroTitle" label="Hero Title" {...register("heroTitle")} />
        <Input id="heroSubtitle" label="Hero Subtitle" {...register("heroSubtitle")} />
      </div>

      <Controller
        name="heroImageUrl"
        control={control}
        render={({ field }) => (
          <ImageUpload label="Hero Image" value={field.value || ""} onChange={field.onChange} />
        )}
      />

      <h3 className="text-lg font-medium text-gallery-900">Content</h3>
      <Controller
        name="bodyContent"
        control={control}
        render={({ field }) => (
          <RichEditor
            label="Body Content"
            value={field.value || ""}
            onChange={field.onChange}
            onImageUpload={uploadImage}
          />
        )}
      />

      <h3 className="text-lg font-medium text-gallery-900">SEO</h3>
      <Input id="seoTitle" label="SEO Title" {...register("seoTitle")} />
      <Textarea id="seoDescription" label="SEO Description" rows={2} {...register("seoDescription")} />

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("isPublished")} className="rounded" />
          Published
        </label>
      </div>

      <div className="flex gap-3 border-t border-gallery-200 pt-6">
        <Button type="submit" loading={isSubmitting}>Save Page</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
