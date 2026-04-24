"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Eye, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MarkdownEditorProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readonly?: boolean;
  rows?: number;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  readonly = false,
  rows = 6,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (readonly) {
    return (
      <div className="markdown-preview rounded-md overflow-hidden border border-neutral-800">
        <div className="bg-[#1e1e1e] p-4 text-sm text-neutral-200 max-h-[400px] overflow-y-auto">
          {value ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <span className="text-neutral-500 italic">No content</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md overflow-hidden border border-neutral-800">
      {/* Header */}
      <div className="bg-[#2d2d2d] px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 px-2 text-xs gap-1 ${
              activeTab === "write"
                ? "bg-neutral-700 text-white"
                : "text-neutral-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("write")}
          >
            <PenLine className="h-3 w-3" />
            Write
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 px-2 text-xs gap-1 ${
              activeTab === "preview"
                ? "bg-neutral-700 text-white"
                : "text-neutral-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("preview")}
          >
            <Eye className="h-3 w-3" />
            Preview
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-neutral-400 hover:text-white"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Content */}
      <div className="bg-[#1e1e1e]">
        {activeTab === "write" ? (
          <Textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="bg-transparent border-0 rounded-none resize-none focus:ring-0 focus:outline-none text-neutral-200 font-mono text-sm min-h-[150px]"
          />
        ) : (
          <div className="markdown-preview p-4 text-sm text-neutral-200 max-h-[400px] overflow-y-auto">
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <span className="text-neutral-500 italic">Nothing to preview</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}