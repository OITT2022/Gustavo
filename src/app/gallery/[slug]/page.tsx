export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/shared/page-hero";
import { ArtworkGrid } from "@/components/artwork/artwork-grid";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};
  return {
    title: category.name,
    description: category.description || `Browse ${category.name} artworks.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) notFound();

  const artworks = await prisma.artwork.findMany({
    where: { categoryId: category.id, status: { not: "HIDDEN" } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <Header />
      <main>
        <PageHero
          title={category.name}
          subtitle={category.description || undefined}
          imageUrl={category.coverImageUrl || undefined}
          compact
        />

        <section className="container-gallery py-16 md:py-24">
          <ArtworkGrid
            artworks={artworks}
            showStatus
            emptyMessage={`No artworks in ${category.name} yet.`}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
