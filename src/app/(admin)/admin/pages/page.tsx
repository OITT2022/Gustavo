export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/layout/admin-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({
    orderBy: { title: "asc" },
  });

  return (
    <>
      <AdminHeader
        title="Pages"
        description="Manage editable content pages"
      />

      <Card>
        {pages.length === 0 ? (
          <div className="py-12 text-center text-gallery-500">
            No editable pages. Pages are created via the seed script.
          </div>
        ) : (
          <div className="divide-y divide-gallery-100">
            {pages.map((page) => (
              <div
                key={page.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <p className="font-medium text-gallery-900">{page.title}</p>
                  <p className="text-xs text-gallery-500">/{page.slug}</p>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
