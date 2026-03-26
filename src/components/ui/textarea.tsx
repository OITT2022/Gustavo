import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gallery-700"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "block w-full rounded-md border border-gallery-300 px-3 py-2 text-sm text-gallery-900 placeholder:text-gallery-400 focus:border-gallery-500 focus:outline-none focus:ring-1 focus:ring-gallery-500 disabled:bg-gallery-50",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          rows={4}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
