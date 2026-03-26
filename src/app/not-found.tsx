import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-medium text-gallery-500">404</p>
          <h1 className="mt-2 font-serif text-4xl text-gallery-900">
            Page Not Found
          </h1>
          <p className="mt-4 text-gallery-600">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <div className="mt-8">
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
