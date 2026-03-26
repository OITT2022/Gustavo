export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/prisma";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/shared/page-hero";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getDb().page.findUnique({ where: { slug } });
  if (!page) return {};
  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || page.heroSubtitle || "",
  };
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;

  // Skip reserved slugs handled by other routes
  if (["about", "home"].includes(slug)) notFound();

  const page = await getDb().page.findUnique({ where: { slug } });
  if (!page || !page.isPublished) notFound();

  let bodyContent: { type: string; text: string; url?: string }[] = [];
  if (page.bodyContent) {
    try {
      bodyContent = typeof page.bodyContent === "string"
        ? JSON.parse(page.bodyContent)
        : page.bodyContent as typeof bodyContent;
    } catch { /* empty */ }
  }

  return (
    <>
      <Header />
      <main>
        <PageHero
          title={page.heroTitle || page.title}
          subtitle={page.heroSubtitle || undefined}
          imageUrl={page.heroImageUrl || undefined}
          compact
        />

        <section className="container-gallery py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            {bodyContent.length > 0 ? (
              <div className="prose prose-gallery max-w-none">
                {bodyContent.map((block, i) => {
                  if (block.type === "heading") {
                    return <h2 key={i} className="heading-3 mt-8 first:mt-0">{block.text}</h2>;
                  }
                  if (block.type === "image" && block.url) {
                    return (
                      <figure key={i} className="my-6">
                        <img src={block.url} alt={block.text || ""} className="w-full rounded" />
                        {block.text && <figcaption className="mt-2 text-sm text-gallery-500 text-center">{block.text}</figcaption>}
                      </figure>
                    );
                  }
                  if (block.type === "quote") {
                    return <blockquote key={i} className="border-l-4 border-gallery-300 pl-4 italic text-gallery-600 my-4">{block.text}</blockquote>;
                  }
                  return <p key={i} className="body-text mt-4 first:mt-0">{block.text}</p>;
                })}
              </div>
            ) : (
              <p className="text-center text-gallery-500">This page has no content yet.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
