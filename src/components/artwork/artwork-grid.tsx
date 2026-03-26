import type { Artwork } from "@/types";
import { ArtworkCard } from "./artwork-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Image as ImageIcon } from "lucide-react";

interface ArtworkGridProps {
  artworks: Artwork[];
  showPrice?: boolean;
  showStatus?: boolean;
  emptyMessage?: string;
}

export function ArtworkGrid({
  artworks,
  showPrice,
  showStatus,
  emptyMessage = "No artworks found.",
}: ArtworkGridProps) {
  if (artworks.length === 0) {
    return (
      <EmptyState
        title={emptyMessage}
        icon={<ImageIcon size={48} />}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {artworks.map((artwork) => (
        <ArtworkCard
          key={artwork.id}
          artwork={artwork}
          showPrice={showPrice}
          showStatus={showStatus}
        />
      ))}
    </div>
  );
}
