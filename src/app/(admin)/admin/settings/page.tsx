import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/layout/admin-header";
import { Card, CardContent } from "@/components/ui/card";
import { SettingsForm } from "@/components/forms/settings-form";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({
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
