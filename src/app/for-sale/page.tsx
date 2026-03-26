export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getDb } from "@/lib/prisma";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/shared/page-hero";
import { ArtworkGrid } from "@/components/artwork/artwork-grid";

export const metadata: Metadata = {
  title: "For Sale",
  description:
    "Original artworks available for purchase. Browse and inquire about available pieces.",
};

export default async function ForSalePage() {
  const artworks = await (await getDb()).artwork.findMany({
    where: { forSale: true, status: { not: "HIDDEN" } },
    orderBy: [{ status: "asc" }, { sortOrder: "asc" }],
  });

  return (
    <>
      <Header />
      <main>
        <PageHero
          title="Available Works"
          subtitle="Original artworks available for purchase"
          compact
        />

        <section className="container-gallery py-16 md:py-24">
          <ArtworkGrid
            artworks={artworks}
            showPrice
            showStatus
            emptyMessage="No artworks currently available for sale. Please check back soon or contact us for inquiries."
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
