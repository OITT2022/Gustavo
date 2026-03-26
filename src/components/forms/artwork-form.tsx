"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { artworkSchema, type ArtworkFormData } from "@/validations/artwork";
import { createArtwork, updateArtwork } from "@/actions/artwork-actions";
import { slugify } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ImageUpload, MultiImageUpload } from "./image-upload";
import { ARTWORK_STATUSES, CURRENCIES } from "@/lib/constants";
import type { Artwork, Category } from "@/types";

interface ArtworkFormProps {
  artwork?: Artwork;
  categories: Category[];
}

export function ArtworkForm({ artwork, categories }: ArtworkFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ArtworkFormData>({
    resolver: zodResolver(artworkSchema),
    defaultValues: artwork
      ? {
          ...artwork,
          year: artwork.year ?? undefined,
          width: artwork.width ?? undefined,
          height: artwork.height ?? undefined,
          depth: artwork.depth ?? undefined,
          price: artwork.price ?? undefined,
          categoryId: artwork.categoryId ?? undefined,
        }
      : {
          artistName: "Gustavo Bar Valenzuela",
          status: "AVAILABLE",
          currency: "USD",
          unit: "cm",
          galleryImages: [],
          tags: [],
          featured: false,
          forSale: false,
          sortOrder: 0,
        },
  });

  const title = watch("title");

  async function onSubmit(data: ArtworkFormData) {
    setError(null);
    const result = artwork
      ? await updateArtwork(artwork.id, data)
      : await createArtwork(data);

    if (result.success) {
      router.push("/admin/artworks");
      router.refresh();
    } else {
      setError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="space-y-5">
        <h3 className="text-lg font-medium text-gallery-900">Basic Information</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            id="title"
            label="Title"
            error={errors.title?.message}
            {...register("title", {
              onChange: (e) => {
                if (!artwork) {
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
        <div className="grid gap-5 sm:grid-cols-3">
          <Input
            id="artistName"
            label="Artist Name"
            {...register("artistName")}
          />
          <Input
            id="year"
            label="Year"
            type="number"
            {...register("year")}
          />
          <Input
            id="medium"
            label="Medium"
            placeholder="Oil on canvas"
            {...register("medium")}
          />
        </div>
      </div>

      {/* Dimensions */}
      <div className="space-y-5">
        <h3 className="text-lg font-medium text-gallery-900">Dimensions</h3>
        <Input
          id="dimensionsText"
          label="Dimensions (free text)"
          placeholder="120 × 80 cm"
          {...register("dimensionsText")}
        />
        <div className="grid gap-5 sm:grid-cols-4">
          <Input
            id="width"
            label="Width"
            type="number"
            step="0.1"
            {...register("width")}
          />
          <Input
            id="height"
            label="Height"
            type="number"
            step="0.1"
            {...register("height")}
          />
          <Input
            id="depth"
            label="Depth"
            type="number"
            step="0.1"
            {...register("depth")}
          />
          <Select
            id="unit"
            label="Unit"
            options={[
              { value: "cm", label: "cm" },
              { value: "in", label: "inches" },
              { value: "mm", label: "mm" },
            ]}
            {...register("unit")}
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-5">
        <h3 className="text-lg font-medium text-gallery-900">Images</h3>
        <Controller
          name="mainImageUrl"
          control={control}
          render={({ field }) => (
            <ImageUpload
              label="Main Image"
              value={field.value || ""}
              onChange={field.onChange}
            />
          )}
        />
        {errors.mainImageUrl && (
          <p className="text-sm text-red-600">{errors.mainImageUrl.message}</p>
        )}
        <Controller
          name="galleryImages"
          control={control}
          render={({ field }) => (
            <MultiImageUpload
              label="Gallery Images"
              value={field.value || []}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      {/* Classification */}
      <div className="space-y-5">
        <h3 className="text-lg font-medium text-gallery-900">Classification</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Select
            id="categoryId"
            label="Category"
            placeholder="Select category"
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            {...register("categoryId")}
          />
          <Input
            id="collectionPeriod"
            label="Collection Period"
            placeholder="2017-2024"
            {...register("collectionPeriod")}
          />
        </div>
        <Input
          id="tags"
          label="Tags (comma separated)"
          placeholder="abstract, oil, landscape"
          onChange={(e) =>
            setValue(
              "tags",
              e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
            )
          }
          defaultValue={artwork?.tags.join(", ") || ""}
        />
      </div>

      {/* Pricing & Status */}
      <div className="space-y-5">
        <h3 className="text-lg font-medium text-gallery-900">Pricing & Status</h3>
        <div className="grid gap-5 sm:grid-cols-3">
          <Select
            id="status"
            label="Status"
            options={ARTWORK_STATUSES.map((s) => ({ value: s.value, label: s.label }))}
            {...register("status")}
          />
          <Input
            id="price"
            label="Price"
            type="number"
            step="1"
            {...register("price")}
          />
          <Select
            id="currency"
            label="Currency"
            options={CURRENCIES.map((c) => ({ value: c.value, label: c.label }))}
            {...register("currency")}
          />
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("featured")} className="rounded" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("forSale")} className="rounded" />
            For Sale
          </label>
        </div>
        <Input
          id="sortOrder"
          label="Sort Order"
          type="number"
          {...register("sortOrder")}
        />
      </div>

      {/* Description */}
      <div className="space-y-5">
        <h3 className="text-lg font-medium text-gallery-900">Description</h3>
        <Input
          id="shortDescription"
          label="Short Description"
          {...register("shortDescription")}
        />
        <Textarea
          id="fullDescription"
          label="Full Description"
          rows={6}
          {...register("fullDescription")}
        />
      </div>

      {/* SEO */}
      <div className="space-y-5">
        <h3 className="text-lg font-medium text-gallery-900">SEO</h3>
        <Input
          id="seoTitle"
          label="SEO Title"
          placeholder={title}
          {...register("seoTitle")}
        />
        <Textarea
          id="seoDescription"
          label="SEO Description"
          rows={2}
          {...register("seoDescription")}
        />
      </div>

      <div className="flex gap-3 border-t border-gallery-200 pt-6">
        <Button type="submit" loading={isSubmitting}>
          {artwork ? "Update Artwork" : "Create Artwork"}
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
