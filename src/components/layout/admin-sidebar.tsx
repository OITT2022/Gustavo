"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Image,
  FolderOpen,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/actions/auth-actions";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/artworks", label: "Artworks", icon: Image },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gallery-200 bg-white">
      <div className="border-b border-gallery-200 px-6 py-4">
        <Link href="/admin" className="font-serif text-lg text-gallery-900">
          Admin Panel
        </Link>
        <p className="text-xs text-gallery-500">Gallery Management</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {adminLinks.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-gallery-100 text-gallery-900 font-medium"
                  : "text-gallery-600 hover:bg-gallery-50 hover:text-gallery-900"
              )}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gallery-200 p-3">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gallery-600 transition-colors hover:bg-gallery-50 hover:text-gallery-900"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </form>
        <Link
          href="/"
          className="mt-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gallery-600 transition-colors hover:bg-gallery-50 hover:text-gallery-900"
        >
          View Site &rarr;
        </Link>
      </div>
    </aside>
  );
}
