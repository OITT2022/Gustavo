export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getDb } from "@/lib/prisma";
import { AdminHeader } from "@/components/layout/admin-header";
import { Card, CardContent } from "@/components/ui/card";
import { PageForm } from "@/components/forms/page-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPagePage({ params }: Props) {
  const { id } = await params;
  const page = await (await getDb()).page.findUnique({ where: { id } });

  if (!page) notFound();

  return (
    <>
      <AdminHeader
        title={`Edit: ${page.title}`}
        description="Update page content"
      />
      <Card>
        <CardContent>
          <PageForm page={page} />
        </CardContent>
      </Card>
    </>
  );
}
