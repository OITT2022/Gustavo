"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !preset) {
          // Fallback: use object URL for demo/dev
          const url = URL.createObjectURL(file);
          onChange(url);
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", preset);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData }
        );
        const data = await res.json();
        onChange(data.secure_url);
      } catch {
        console.error("Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gallery-700">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative inline-block">
          <div className="relative h-40 w-40 overflow-hidden rounded-md border border-gallery-200">
            <Image
              src={value}
              alt="Upload preview"
              fill
              className="object-cover"
              sizes="160px"
            />
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-sm hover:bg-red-600"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-6 py-10 transition-colors",
            dragOver
              ? "border-gallery-500 bg-gallery-50"
              : "border-gallery-300 hover:border-gallery-400"
          )}
        >
          <label className="cursor-pointer text-center">
            {uploading ? (
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-gallery-400" />
            ) : (
              <Upload className="mx-auto h-8 w-8 text-gallery-400" />
            )}
            <span className="mt-2 block text-sm text-gallery-600">
              {uploading ? "Uploading..." : "Click or drag to upload"}
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>
      )}
    </div>
  );
}

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}

export function MultiImageUpload({
  value,
  onChange,
  label,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !preset) {
        const url = URL.createObjectURL(file);
        onChange([...value, url]);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", preset);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      onChange([...value, data.secure_url]);
    } catch {
      console.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gallery-700">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-3">
        {value.map((url, i) => (
          <div key={i} className="relative">
            <div className="relative h-24 w-24 overflow-hidden rounded-md border border-gallery-200">
              <Image
                src={url}
                alt={`Gallery image ${i + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white shadow-sm hover:bg-red-600"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gallery-300 transition-colors hover:border-gallery-400">
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-gallery-400" />
          ) : (
            <Upload className="h-5 w-5 text-gallery-400" />
          )}
          <span className="mt-1 text-xs text-gallery-500">Add</span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadFile(file);
            }}
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
}
