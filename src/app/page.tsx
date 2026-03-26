export const dynamic = "force-dynamic";

import { getDb } from "@/lib/prisma";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedArtworks } from "@/components/home/featured-artworks";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getDb().artwork.findMany({
      where: { featured: true, status: { not: "HIDDEN" } },
      orderBy: { sortOrder: "asc" },
      take: 6,
    }),
    getDb().category.findMany({
      orderBy: { sortOrder: "asc" },
      take: 4,
      include: { _count: { select: { artworks: true } } },
    }),
  ]);

  return (
    <>
      <Header />
      <main>
        <HeroSection imageUrl="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1920&q=80" />

        <FeaturedArtworks artworks={featured} />

        {/* Categories section */}
        {categories.length > 0 && (
          <section className="bg-gallery-50 py-16 md:py-24">
            <div className="container-gallery">
              <div className="mb-10 text-center">
                <h2 className="heading-2">Explore Collections</h2>
                <p className="mt-3 text-gallery-600">
                  Browse artwork by period and category
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/gallery/${cat.slug}`}
                    className="group relative aspect-[4/5] overflow-hidden rounded-sm bg-gallery-200"
                  >
                    {cat.coverImageUrl && (
                      <Image
                        src={cat.coverImageUrl}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-lg font-medium text-white">
                        {cat.name}
                      </h3>
                      <p className="mt-1 text-sm text-white/70">
                        {cat._count.artworks} works
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA section */}
        <section className="container-gallery py-16 text-center md:py-24">
          <h2 className="heading-2">Interested in a Piece?</h2>
          <p className="mx-auto mt-4 max-w-lg text-gallery-600">
            Whether you&apos;re looking to acquire an original work or commission
            something special, I&apos;d love to hear from you.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/for-sale"
              className="inline-flex items-center rounded-md bg-gallery-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gallery-800"
            >
              View Available Works
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-md border border-gallery-300 px-6 py-3 text-sm font-medium text-gallery-700 transition-colors hover:bg-gallery-50"
            >
              Get in Touch
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
