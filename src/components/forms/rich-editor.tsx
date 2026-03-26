"use client";

import { useState, useRef } from "react";
import { Bold, Italic, Heading2, ImagePlus, List, Quote, Eye, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

export function RichEditor({ value, onChange, label, onImageUpload }: RichEditorProps) {
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function insertAtCursor(before: string, after: string = "") {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.substring(start, end);
    const newText = value.substring(0, start) + before + selected + after + value.substring(end);
    onChange(newText);
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = start + before.length;
      ta.selectionEnd = start + before.length + selected.length;
    }, 0);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (onImageUpload) {
      const url = await onImageUpload(file);
      insertAtCursor(`\n![${file.name}](${url})\n`);
    } else {
      // Fallback: use object URL for preview
      const url = URL.createObjectURL(file);
      insertAtCursor(`\n![${file.name}](${url})\n`);
    }
    e.target.value = "";
  }

  function renderPreview(text: string): string {
    return text
      .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-serif font-light mt-8 mb-3">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-xl font-serif font-light mt-6 mb-2">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="my-4 max-w-full rounded" />')
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gallery-300 pl-4 italic text-gallery-600 my-4">$1</blockquote>')
      .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
      .replace(/\n\n/g, "</p><p class='mt-4 text-gallery-700 leading-relaxed'>")
      .replace(/\n/g, "<br/>")
      .replace(/^/, "<p class='text-gallery-700 leading-relaxed'>")
      .replace(/$/, "</p>");
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gallery-700">{label}</label>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 rounded-t-md border border-gallery-300 bg-gallery-50 px-2 py-1.5">
        <button type="button" onClick={() => insertAtCursor("**", "**")} className="rounded p-1.5 hover:bg-gallery-200" title="Bold">
          <Bold size={16} />
        </button>
        <button type="button" onClick={() => insertAtCursor("*", "*")} className="rounded p-1.5 hover:bg-gallery-200" title="Italic">
          <Italic size={16} />
        </button>
        <button type="button" onClick={() => insertAtCursor("\n## ", "\n")} className="rounded p-1.5 hover:bg-gallery-200" title="Heading">
          <Heading2 size={16} />
        </button>
        <button type="button" onClick={() => insertAtCursor("\n- ")} className="rounded p-1.5 hover:bg-gallery-200" title="List">
          <List size={16} />
        </button>
        <button type="button" onClick={() => insertAtCursor("\n> ", "\n")} className="rounded p-1.5 hover:bg-gallery-200" title="Quote">
          <Quote size={16} />
        </button>
        <div className="mx-1 h-5 w-px bg-gallery-300" />
        <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded p-1.5 hover:bg-gallery-200" title="Upload Image">
          <ImagePlus size={16} />
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className={cn("rounded p-1.5 hover:bg-gallery-200", preview && "bg-gallery-200")}
          title={preview ? "Edit" : "Preview"}
        >
          {preview ? <Edit3 size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* Editor / Preview */}
      {preview ? (
        <div
          className="min-h-[300px] rounded-b-md border border-t-0 border-gallery-300 bg-white p-4 prose prose-gallery max-w-none"
          dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full rounded-b-md border border-t-0 border-gallery-300 px-3 py-2 font-mono text-sm text-gallery-900 placeholder:text-gallery-400 focus:border-gallery-500 focus:outline-none focus:ring-1 focus:ring-gallery-500"
          rows={15}
          placeholder="Write content using simple formatting:&#10;&#10;## Heading&#10;**bold** *italic*&#10;- list item&#10;> quote&#10;&#10;Images can be uploaded via the toolbar."
        />
      )}
    </div>
  );
}
