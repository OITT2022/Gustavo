import Image from "next/image";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  compact?: boolean;
}

export function PageHero({ title, subtitle, imageUrl, compact }: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gallery-100",
        compact ? "py-16 md:py-20" : "py-24 md:py-32"
      )}
    >
      {imageUrl && (
        <>
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </>
      )}
      <div className="container-gallery relative z-10 text-center">
        <h1
          className={cn(
            "heading-1",
            imageUrl ? "text-white" : "text-gallery-900"
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={cn(
              "mx-auto mt-4 max-w-2xl text-lg",
              imageUrl ? "text-white/80" : "text-gallery-600"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
