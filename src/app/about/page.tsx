export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/shared/page-hero";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about artist Gustavo Bar Valenzuela and his creative journey.",
};

export default async function AboutPage() {
  const page = await prisma.page.findUnique({ where: { slug: "about" } });

  const bodyContent = page?.bodyContent as
    | { type: string; text: string }[]
    | null;

  return (
    <>
      <Header />
      <main>
        <PageHero
          title={page?.heroTitle || "About the Artist"}
          subtitle={page?.heroSubtitle || "A lifetime dedicated to art"}
          imageUrl={page?.heroImageUrl || undefined}
          compact
        />

        <section className="container-gallery py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            {bodyContent && bodyContent.length > 0 ? (
              <div className="prose prose-gallery max-w-none">
                {bodyContent.map((block, i) => {
                  if (block.type === "heading") {
                    return (
                      <h2 key={i} className="heading-3 mt-8 first:mt-0">
                        {block.text}
                      </h2>
                    );
                  }
                  return (
                    <p key={i} className="body-text mt-4 first:mt-0">
                      {block.text}
                    </p>
                  );
                })}
              </div>
            ) : (
              <div className="prose prose-gallery max-w-none">
                <p className="body-text text-lg leading-relaxed">
                  Gustavo Bar Valenzuela is a contemporary artist whose work spans
                  painting, drawing, and mixed media. With a career stretching
                  over two decades, his art explores themes of identity,
                  landscape, and the human condition.
                </p>
                <p className="body-text mt-6">
                  Born with an innate passion for visual expression, Gustavo
                  studied fine arts and developed a distinctive style that
                  bridges traditional techniques with contemporary sensibilities.
                  His work has been exhibited in galleries across multiple
                  countries and resides in private collections worldwide.
                </p>
                <p className="body-text mt-6">
                  Working primarily in oil and mixed media, Gustavo creates pieces
                  that invite contemplation and emotional engagement. Each work
                  represents a dialogue between the artist and the canvas — an
                  exploration of color, form, and meaning.
                </p>
                <p className="body-text mt-6">
                  Gustavo welcomes commissions and collaborations. Whether
                  you&apos;re a collector, curator, or simply an art
                  enthusiast, feel free to reach out.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
