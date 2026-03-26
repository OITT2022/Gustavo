"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  onClose: () => void;
}

export function MobileNav({ onClose }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <div className="fixed inset-0 z-50 bg-white md:hidden">
      <div className="flex h-16 items-center justify-between px-4">
        <span className="font-serif text-xl text-gallery-900">
          Gustavo Bar Valenzuela
        </span>
        <button
          onClick={onClose}
          className="p-2 text-gallery-700"
          aria-label="Close menu"
        >
          &times;
        </button>
      </div>
      <nav className="px-4 pt-8">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={cn(
              "block border-b border-gallery-100 py-4 text-lg",
              pathname === link.href
                ? "text-gallery-900 font-medium"
                : "text-gallery-500"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
