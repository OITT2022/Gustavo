import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/layout/admin-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageActions } from "./message-actions";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unread = messages.filter((m) => !m.isHandled).length;

  return (
    <>
      <AdminHeader
        title="Messages"
        description={`${messages.length} total, ${unread} unread`}
      />

      <Card>
        {messages.length === 0 ? (
          <div className="py-12 text-center text-gallery-500">
            No messages received yet.
          </div>
        ) : (
          <div className="divide-y divide-gallery-100">
            {messages.map((msg) => (
              <div key={msg.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gallery-900">
                        {msg.fullName}
                      </p>
                      {!msg.isHandled && (
                        <Badge variant="info">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gallery-600">{msg.email}</p>
                    {msg.phone && (
                      <p className="text-sm text-gallery-500">{msg.phone}</p>
                    )}
                    {msg.subject && (
                      <p className="text-sm font-medium text-gallery-700">
                        {msg.subject}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-gallery-700 whitespace-pre-line">
                      {msg.message}
                    </p>
                    {msg.artworkReference && (
                      <p className="text-xs text-gallery-500">
                        Re: {msg.artworkReference}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-gallery-400">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                    <MessageActions id={msg.id} isHandled={msg.isHandled} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
