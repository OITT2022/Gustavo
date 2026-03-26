"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, type CategoryFormData } from "@/validations/category";
import { createCategory, updateCategory } from "@/actions/category-actions";
import { slugify } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CATEGORY_TYPES } from "@/lib/constants";
import type { Category } from "@/types";

interface CategoryFormProps {
  category?: Category;
  onSuccess?: () => void;
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          name: category.name,
          slug: category.slug,
          description: category.description ?? undefined,
          coverImageUrl: category.coverImageUrl ?? undefined,
          type: category.type as "PERIOD" | "DRAWINGS" | "COMMISSIONS" | "SALE" | "GENERAL",
          sortOrder: category.sortOrder,
        }
      : { type: "GENERAL" as const, sortOrder: 0 },
  });

  async function onSubmit(data: CategoryFormData) {
    setError(null);
    const result = category
      ? await updateCategory(category.id, data)
      : await createCategory(data);

    if (result.success) {
      if (!category) reset();
      onSuccess?.();
    } else {
      setError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="name"
          label="Name"
          error={errors.name?.message}
          {...register("name", {
            onChange: (e) => {
              if (!category) {
                setValue("slug", slugify(e.target.value));
              }
            },
          })}
        />
        <Input
          id="slug"
          label="Slug"
          error={errors.slug?.message}
          {...register("slug")}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          id="type"
          label="Type"
          options={CATEGORY_TYPES.map((t) => ({ value: t.value, label: t.label }))}
          {...register("type")}
        />
        <Input
          id="sortOrder"
          label="Sort Order"
          type="number"
          {...register("sortOrder")}
        />
      </div>
      <Textarea
        id="description"
        label="Description"
        rows={3}
        {...register("description")}
      />
      <Input
        id="coverImageUrl"
        label="Cover Image URL"
        placeholder="https://..."
        {...register("coverImageUrl")}
      />
      <Button type="submit" loading={isSubmitting}>
        {category ? "Update Category" : "Create Category"}
      </Button>
    </form>
  );
}
