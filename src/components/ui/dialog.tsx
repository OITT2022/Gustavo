"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className={cn(
        "rounded-lg border border-gallery-200 bg-white p-0 shadow-lg backdrop:bg-black/50",
        "max-w-lg w-full",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-gallery-200 px-6 py-4">
        <h2 className="text-lg font-medium text-gallery-900">{title}</h2>
        <button
          onClick={onClose}
          className="text-gallery-400 hover:text-gallery-700"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
      <div className="px-6 py-4">{children}</div>
    </dialog>
  );
}
