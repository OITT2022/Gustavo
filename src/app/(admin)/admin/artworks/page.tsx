export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/layout/admin-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import { DeleteArtworkButton } from "./delete-button";

export default async function AdminArtworksPage() {
  const artworks = await prisma.artwork.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <>
      <AdminHeader
        title="Artworks"
        description={`${artworks.length} artworks in total`}
        action={
          <Link href="/admin/artworks/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Artwork
            </Button>
          </Link>
        }
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gallery-200 text-left">
                <th className="px-4 py-3 font-medium text-gallery-500">Image</th>
                <th className="px-4 py-3 font-medium text-gallery-500">Title</th>
                <th className="px-4 py-3 font-medium text-gallery-500">Category</th>
                <th className="px-4 py-3 font-medium text-gallery-500">Year</th>
                <th className="px-4 py-3 font-medium text-gallery-500">Status</th>
                <th className="px-4 py-3 font-medium text-gallery-500">Flags</th>
                <th className="px-4 py-3 font-medium text-gallery-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gallery-100">
              {artworks.map((artwork) => (
                <tr key={artwork.id} className="hover:bg-gallery-50">
                  <td className="px-4 py-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded bg-gallery-100">
                      <Image
                        src={artwork.mainImageUrl}
                        alt={artwork.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gallery-900">{artwork.title}</p>
                    <p className="text-xs text-gallery-500">{artwork.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-gallery-600">
                    {artwork.category?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-gallery-600">
                    {artwork.year || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={artwork.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {artwork.featured && <Badge variant="info">Featured</Badge>}
                      {artwork.forSale && <Badge variant="success">For Sale</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/artworks/${artwork.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteArtworkButton id={artwork.id} title={artwork.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {artworks.length === 0 && (
          <div className="py-12 text-center text-gallery-500">
            No artworks yet.{" "}
            <Link href="/admin/artworks/new" className="text-gallery-900 underline">
              Create your first artwork
            </Link>
          </div>
        )}
      </Card>
    </>
  );
}
