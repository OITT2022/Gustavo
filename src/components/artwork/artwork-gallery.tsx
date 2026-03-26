"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArtworkGalleryProps {
  images: string[];
  title: string;
}

export function ArtworkGallery({ images, title }: ArtworkGalleryProps) {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () =>
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-gallery-100">
        <Image
          src={images[current]}
          alt={`${title} - Image ${current + 1}`}
          fill
          className="object-contain"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-sm transition-colors hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-sm transition-colors hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm",
                i === current
                  ? "ring-2 ring-gallery-900"
                  : "opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
