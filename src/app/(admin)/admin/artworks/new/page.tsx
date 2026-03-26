import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/layout/admin-header";
import { Card, CardContent } from "@/components/ui/card";
import { ArtworkForm } from "@/components/forms/artwork-form";

export default async function NewArtworkPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <>
      <AdminHeader title="Create Artwork" description="Add a new artwork to your gallery" />
      <Card>
        <CardContent>
          <ArtworkForm categories={categories} />
        </CardContent>
      </Card>
    </>
  );
}
