import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  imageUrl?: string;
}

export function HeroSection({ imageUrl }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gallery-950">
      {imageUrl && (
        <>
          <Image
            src={imageUrl}
            alt="Featured artwork"
            fill
            className="object-cover opacity-60"
            priority
          />
        </>
      )}
      {!imageUrl && (
        <div className="absolute inset-0 bg-gradient-to-br from-gallery-900 via-gallery-800 to-gallery-950" />
      )}
      <div className="container-gallery relative z-10 text-center">
        <h1 className="font-serif text-5xl font-light tracking-tight text-white sm:text-6xl md:text-7xl">
          Gustavo Bar Valenzuela
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
          Original paintings, drawings, and fine art spanning decades of
          creative expression.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/gallery">
            <Button size="lg" variant="primary" className="bg-white text-gallery-900 hover:bg-gallery-100">
              Explore Gallery
            </Button>
          </Link>
          <Link href="/for-sale">
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Available Works
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
