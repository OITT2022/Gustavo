export const dynamic = "force-dynamic";

import { getDb } from "@/lib/prisma";
import { AdminHeader } from "@/components/layout/admin-header";
import { Card, CardContent } from "@/components/ui/card";
import { SettingsForm } from "@/components/forms/settings-form";

export default async function AdminSettingsPage() {
  const settings = await getDb().siteSettings.findUnique({
    where: { id: "default" },
  });

  return (
    <>
      <AdminHeader
        title="Settings"
        description="Site configuration and social links"
      />
      <Card>
        <CardContent>
          <SettingsForm settings={settings} />
        </CardContent>
      </Card>
    </>
  );
}
