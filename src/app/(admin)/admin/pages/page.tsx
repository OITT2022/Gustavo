export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { getDb } from "@/lib/prisma";
import { AdminHeader } from "@/components/layout/admin-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { DeletePageButton } from "./delete-button";

export default async function AdminPagesPage() {
  const pages = await getDb().page.findMany({
    orderBy: { title: "asc" },
  });

  return (
    <>
      <AdminHeader
        title="Pages"
        description="Manage editable content pages"
        action={
          <Link href="/admin/pages/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Page
            </Button>
          </Link>
        }
      />

      <Card>
        {pages.length === 0 ? (
          <div className="py-12 text-center text-gallery-500">
            No pages yet.{" "}
            <Link href="/admin/pages/new" className="text-gallery-900 underline">
              Create your first page
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gallery-100">
            {pages.map((page) => (
              <div
                key={page.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div className="flex items-center gap-4">
                  {page.heroImageUrl && (
                    <div className="relative h-12 w-20 overflow-hidden rounded bg-gallery-100">
                      <Image
                        src={page.heroImageUrl}
                        alt={page.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gallery-900">{page.title}</p>
                    <p className="text-xs text-gallery-500">/{page.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={page.isPublished ? "success" : "default"}>
                    {page.isPublished ? "Published" : "Draft"}
                  </Badge>
                  <Link href={`/admin/pages/${page.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <DeletePageButton id={page.id} title={page.title} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
