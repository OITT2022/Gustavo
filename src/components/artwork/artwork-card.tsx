import Image from "next/image";
import Link from "next/link";
import type { Artwork } from "@/types";
import { formatPrice } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";

interface ArtworkCardProps {
  artwork: Artwork;
  showPrice?: boolean;
  showStatus?: boolean;
}

export function ArtworkCard({
  artwork,
  showPrice,
  showStatus,
}: ArtworkCardProps) {
  return (
    <Link href={`/artwork/${artwork.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-gallery-100">
        <Image
          src={artwork.mainImageUrl}
          alt={artwork.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {showStatus && artwork.status !== "AVAILABLE" && (
          <div className="absolute left-3 top-3">
            <StatusBadge status={artwork.status} />
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium text-gallery-900 group-hover:text-gallery-600 transition-colors">
          {artwork.title}
        </h3>
        {artwork.year && (
          <p className="text-xs text-gallery-500">{artwork.year}</p>
        )}
        {artwork.medium && (
          <p className="text-xs text-gallery-500">{artwork.medium}</p>
        )}
        {showPrice && artwork.price && artwork.forSale && (
          <p className="text-sm font-medium text-gallery-800">
            {formatPrice(artwork.price, artwork.currency || "USD")}
          </p>
        )}
      </div>
    </Link>
  );
}
