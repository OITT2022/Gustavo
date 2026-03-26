import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/layout/admin-header";
import { Card, CardContent } from "@/components/ui/card";
import { ArtworkForm } from "@/components/forms/artwork-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArtworkPage({ params }: Props) {
  const { id } = await params;

  const [artwork, categories] = await Promise.all([
    prisma.artwork.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!artwork) notFound();

  return (
    <>
      <AdminHeader
        title={`Edit: ${artwork.title}`}
        description="Update artwork details"
      />
      <Card>
        <CardContent>
          <ArtworkForm artwork={artwork} categories={categories} />
        </CardContent>
      </Card>
    </>
  );
}
