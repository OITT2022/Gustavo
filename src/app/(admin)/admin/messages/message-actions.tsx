"use client";

import { useRouter } from "next/navigation";
import { toggleMessageHandled, deleteMessage } from "@/actions/contact-actions";
import { Button } from "@/components/ui/button";
import { Check, Trash2, Undo2 } from "lucide-react";

interface MessageActionsProps {
  id: string;
  isHandled: boolean;
}

export function MessageActions({ id, isHandled }: MessageActionsProps) {
  const router = useRouter();

  async function handleToggle() {
    await toggleMessageHandled(id);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this message permanently?")) return;
    await deleteMessage(id);
    router.refresh();
  }

  return (
    <div className="flex gap-1">
      <Button variant="ghost" size="sm" onClick={handleToggle} title={isHandled ? "Mark as unread" : "Mark as handled"}>
        {isHandled ? <Undo2 className="h-4 w-4" /> : <Check className="h-4 w-4" />}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
