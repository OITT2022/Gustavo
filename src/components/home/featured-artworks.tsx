import Link from "next/link";
import type { Artwork } from "@/types";
import { ArtworkCard } from "@/components/artwork/artwork-card";

interface FeaturedArtworksProps {
  artworks: Artwork[];
}

export function FeaturedArtworks({ artworks }: FeaturedArtworksProps) {
  if (artworks.length === 0) return null;

  return (
    <section className="container-gallery py-16 md:py-24">
      <div className="mb-10 text-center">
        <h2 className="heading-2">Featured Works</h2>
        <p className="mt-3 text-gallery-600">
          A selection of recent and notable pieces
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/gallery"
          className="link-underline text-sm font-medium text-gallery-700"
        >
          View Full Gallery
        </Link>
      </div>
    </section>
  );
}
