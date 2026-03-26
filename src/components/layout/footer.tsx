import Link from "next/link";
import { SocialLinks } from "@/components/shared/social-links";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gallery-200 bg-gallery-50">
      <div className="container-gallery py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-lg text-gallery-900">
              Gustavo Bar Valenzuela
            </h3>
            <p className="mt-2 text-sm text-gallery-600">
              Original paintings, drawings, and fine art.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-gallery-500">
              Explore
            </h4>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/gallery", label: "Gallery" },
                { href: "/for-sale", label: "Available Works" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gallery-600 transition-colors hover:text-gallery-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-gallery-500">
              Follow
            </h4>
            <div className="mt-3">
              <SocialLinks />
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gallery-200 pt-6 text-center text-sm text-gallery-500">
          &copy; {currentYear} Gustavo Bar Valenzuela. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
