export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ArtworkDetail } from "@/components/artwork/artwork-detail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artwork = await prisma.artwork.findUnique({ where: { slug } });
  if (!artwork) return {};
  return {
    title: artwork.seoTitle || artwork.title,
    description:
      artwork.seoDescription ||
      artwork.shortDescription ||
      `${artwork.title} by ${artwork.artistName}`,
    openGraph: {
      title: artwork.seoTitle || artwork.title,
      description: artwork.seoDescription || artwork.shortDescription || "",
      images: [{ url: artwork.mainImageUrl }],
    },
  };
}

export default async function ArtworkPage({ params }: Props) {
  const { slug } = await params;
  const artwork = await prisma.artwork.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!artwork || artwork.status === "HIDDEN") notFound();

  return (
    <>
      <Header />
      <main>
        <ArtworkDetail artwork={artwork} />
      </main>
      <Footer />
    </>
  );
}
