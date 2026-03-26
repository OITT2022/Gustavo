import Image from "next/image";
import Link from "next/link";
import type { ArtworkWithCategory } from "@/types";
import { formatPrice, getDimensionsDisplay } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { ArtworkGallery } from "./artwork-gallery";

interface ArtworkDetailProps {
  artwork: ArtworkWithCategory;
}

export function ArtworkDetail({ artwork }: ArtworkDetailProps) {
  const dimensions = getDimensionsDisplay(artwork);
  const allImages = [artwork.mainImageUrl, ...artwork.galleryImages];

  return (
    <div className="container-gallery py-12 md:py-16">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image section */}
        <div>
          {allImages.length > 1 ? (
            <ArtworkGallery images={allImages} title={artwork.title} />
          ) : (
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-gallery-100">
              <Image
                src={artwork.mainImageUrl}
                alt={artwork.title}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
        </div>

        {/* Details section */}
        <div className="space-y-6">
          <div>
            <h1 className="heading-2">{artwork.title}</h1>
            <p className="mt-1 text-lg text-gallery-600">
              {artwork.artistName}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={artwork.status} />
            {artwork.category && (
              <Link
                href={`/gallery/${artwork.category.slug}`}
                className="text-sm text-gallery-500 hover:text-gallery-700"
              >
                {artwork.category.name}
              </Link>
            )}
          </div>

          {/* Metadata */}
          <dl className="space-y-3 border-t border-gallery-200 pt-6">
            {artwork.year && (
              <div className="flex justify-between text-sm">
                <dt className="text-gallery-500">Year</dt>
                <dd className="text-gallery-900">{artwork.year}</dd>
              </div>
            )}
            {artwork.medium && (
              <div className="flex justify-between text-sm">
                <dt className="text-gallery-500">Medium</dt>
                <dd className="text-gallery-900">{artwork.medium}</dd>
              </div>
            )}
            {dimensions && (
              <div className="flex justify-between text-sm">
                <dt className="text-gallery-500">Dimensions</dt>
                <dd className="text-gallery-900">{dimensions}</dd>
              </div>
            )}
            {artwork.collectionPeriod && (
              <div className="flex justify-between text-sm">
                <dt className="text-gallery-500">Period</dt>
                <dd className="text-gallery-900">
                  {artwork.collectionPeriod}
                </dd>
              </div>
            )}
          </dl>

          {/* Price */}
          {artwork.forSale && artwork.price && (
            <div className="border-t border-gallery-200 pt-6">
              <p className="text-2xl font-light text-gallery-900">
                {formatPrice(artwork.price, artwork.currency || "USD")}
              </p>
            </div>
          )}

          {/* Description */}
          {artwork.fullDescription && (
            <div className="border-t border-gallery-200 pt-6">
              <p className="body-text whitespace-pre-line">
                {artwork.fullDescription}
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="border-t border-gallery-200 pt-6">
            <Link href={`/contact?artwork=${artwork.slug}`}>
              <Button size="lg" className="w-full sm:w-auto">
                Inquire About This Work
              </Button>
            </Link>
          </div>

          {/* Tags */}
          {artwork.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4">
              {artwork.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gallery-100 px-3 py-1 text-xs text-gallery-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
