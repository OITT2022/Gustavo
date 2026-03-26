import { AdminHeader } from "@/components/layout/admin-header";
import { Card, CardContent } from "@/components/ui/card";
import { PageForm } from "@/components/forms/page-form";

export default function NewPagePage() {
  return (
    <>
      <AdminHeader title="Create Page" description="Add a new content page to your site" />
      <Card>
        <CardContent>
          <PageForm />
        </CardContent>
      </Card>
    </>
  );
}
