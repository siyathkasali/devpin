"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { CodeEditor } from "@/components/ui/code-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createItemAction, getItemTypesAction } from "@/src/actions/items";

interface NewItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ItemTypeName = "snippet" | "prompt" | "command" | "note" | "link";

interface ItemTypeOption {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
}

export function NewItemDialog({ open, onOpenChange }: NewItemDialogProps) {
  const router = useRouter();
  const [itemTypes, setItemTypes] = useState<ItemTypeOption[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      loadItemTypes();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const loadItemTypes = async () => {
    setLoading(true);
    try {
      const result = await getItemTypesAction();
      if (result.success && result.data) {
        setItemTypes(result.data);
        if (result.data.length > 0) {
          setSelectedType(result.data[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to load item types:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTags("");
    setContent("");
    setLanguage("");
    setUrl("");
  };

  const handleSubmit = async () => {
    if (!title.trim() || !selectedType) return;

    setSubmitting(true);
    try {
      const tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const result = await createItemAction({
        title: title.trim(),
        description: description.trim() || null,
        content: content.trim() || null,
        language: language.trim() || null,
        url: url.trim() || null,
        tags: tagArray.length > 0 ? tagArray : undefined,
        typeId: selectedType,
      });

      if (result.success) {
        onOpenChange(false);
        router.refresh();
      } else {
        console.error("Failed to create item:", result.error);
      }
    } catch (error) {
      console.error("Failed to create item:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTypeName = itemTypes.find((t) => t.id === selectedType)?.name.toLowerCase() as ItemTypeName || "";
  const showContent = ["snippet", "prompt", "command", "note"].includes(selectedTypeName);
  const showLanguage = ["snippet", "command"].includes(selectedTypeName);
  const showUrl = selectedTypeName === "link";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Type Selector */}
          <div>
            <label className="text-sm font-medium block mb-2">Type</label>
            <Select value={selectedType} onValueChange={setSelectedType} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {itemTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium block mb-2">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Item title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium block mb-2">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={2}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium block mb-2">Tags</label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Comma-separated tags"
            />
          </div>

          {/* Type-specific fields */}
          {showContent && (
            <div>
              <label className="text-sm font-medium block mb-2">Content</label>
              {selectedTypeName === "note" || selectedTypeName === "prompt" ? (
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your content here..."
                />
              ) : (
                <CodeEditor
                  value={content}
                  onChange={setContent}
                  language={language}
                />
              )}
            </div>
          )}

          {showLanguage && (
            <div>
              <label className="text-sm font-medium block mb-2">Language</label>
              <Input
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="e.g., TypeScript, Python"
              />
            </div>
          )}

          {showUrl && (
            <div>
              <label className="text-sm font-medium block mb-2">URL</label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                type="url"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || !title.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
