import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/forms/login-form";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gallery-50">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-gallery-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="font-serif text-2xl text-gallery-900">Admin Login</h1>
          <p className="mt-2 text-sm text-gallery-500">
            Sign in to manage your gallery
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
