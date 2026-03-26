export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/layout/admin-header";
import { Card, CardContent } from "@/components/ui/card";
import { Image, FolderOpen, MessageSquare, DollarSign } from "lucide-react";

export default async function AdminDashboard() {
  const [artworkCount, categoryCount, messageCount, forSaleCount, recentMessages] =
    await Promise.all([
      prisma.artwork.count(),
      prisma.category.count(),
      prisma.contactMessage.count({ where: { isHandled: false } }),
      prisma.artwork.count({ where: { forSale: true } }),
      prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  const stats = [
    { label: "Total Artworks", value: artworkCount, icon: Image },
    { label: "Categories", value: categoryCount, icon: FolderOpen },
    { label: "Unread Messages", value: messageCount, icon: MessageSquare },
    { label: "For Sale", value: forSaleCount, icon: DollarSign },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" description="Overview of your gallery" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4">
                <div className="rounded-lg bg-gallery-100 p-3">
                  <Icon className="h-5 w-5 text-gallery-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gallery-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gallery-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent messages */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-medium text-gallery-900">
          Recent Messages
        </h2>
        <Card>
          {recentMessages.length === 0 ? (
            <CardContent>
              <p className="text-sm text-gallery-500">No messages yet.</p>
            </CardContent>
          ) : (
            <div className="divide-y divide-gallery-100">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-medium text-gallery-900">
                      {msg.fullName}
                    </p>
                    <p className="text-xs text-gallery-500">
                      {msg.subject || "No subject"} — {msg.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!msg.isHandled && (
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                    )}
                    <span className="text-xs text-gallery-400">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
