"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteArtwork } from "@/actions/artwork-actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteArtworkButtonProps {
  id: string;
  title: string;
}

export function DeleteArtworkButton({ id, title }: DeleteArtworkButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    setLoading(true);
    await deleteArtwork(id);
    router.refresh();
    setLoading(false);
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      loading={loading}
      className="text-red-500 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
