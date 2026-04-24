"use client";

import { useState, useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { Copy, Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { editor } from "monaco-editor";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readonly?: boolean;
  minHeight?: number;
  maxHeight?: number;
}

export function CodeEditor({
  value,
  onChange,
  language = "plaintext",
  readonly = false,
  minHeight = 200,
  maxHeight = 500,
}: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
    setIsEditorReady(true);
  };

  return (
    <div
      className="rounded-md overflow-hidden border border-neutral-800"
      style={{ maxHeight }}
    >
      {/* Header */}
      <div className="bg-[#2d2d2d] px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* macOS Window Dots */}
          <div className="flex items-center gap-1.5">
            <Circle className="h-3 w-3 fill-red-500/80 text-red-500/80" />
            <Circle className="h-3 w-3 fill-yellow-500/80 text-yellow-500/80" />
            <Circle className="h-3 w-3 fill-green-500/80 text-green-500/80" />
          </div>

          {/* Language Label */}
          <span className="text-xs text-neutral-400 font-mono ml-2">
            {language}
          </span>
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

      {/* Editor */}
      <div
        className="overflow-y-auto"
        style={{ maxHeight: maxHeight - 44 }}
      >
        <Editor
          height={minHeight}
          language={language.toLowerCase()}
          value={value}
          onChange={(val) => onChange?.(val || "")}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            readOnly: readonly,
            minimap: { enabled: false },
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            folding: true,
            automaticLayout: true,
            scrollbar: {
              vertical: "auto",
              horizontal: "hidden",
              verticalScrollbarSize: 8,
            },
            padding: { top: 12, bottom: 12 },
            fontSize: 14,
            fontFamily: "var(--font-mono)",
            renderLineHighlight: "all",
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
          }}
        />
      </div>
    </div>
  );
}