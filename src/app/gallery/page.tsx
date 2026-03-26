export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getDb } from "@/lib/prisma";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/shared/page-hero";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore the complete art collection organized by period and category.",
};

export default async function GalleryPage() {
  const categories = await (await getDb()).category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { artworks: { where: { status: { not: "HIDDEN" } } } } },
    },
  });

  return (
    <>
      <Header />
      <main>
        <PageHero
          title="Gallery"
          subtitle="Explore collections spanning decades of artistic expression"
          compact
        />

        <section className="container-gallery py-16 md:py-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/gallery/${cat.slug}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-gallery-200">
                  {cat.coverImageUrl ? (
                    <Image
                      src={cat.coverImageUrl}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-gallery-400">No cover image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="mt-4">
                  <h2 className="heading-3 group-hover:text-gallery-600 transition-colors">
                    {cat.name}
                  </h2>
                  <p className="mt-1 text-sm text-gallery-500">
                    {cat._count.artworks} artworks
                  </p>
                  {cat.description && (
                    <p className="mt-2 text-sm text-gallery-600 line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="py-16 text-center text-gallery-500">
              No collections available yet. Check back soon.
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
