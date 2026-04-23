"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Star, Pin, Copy, Pencil, Trash2, Tag, Folder, X, Check } from "lucide-react";
import { DashboardItem, ItemWithRelations } from "@/src/lib/db/items";
import { updateItemAction } from "@/src/actions/items";

interface ItemDrawerProps {
  item: DashboardItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ItemTypeName = "snippet" | "prompt" | "command" | "note" | "file" | "image" | "link";

export function ItemDrawer({ item, open, onOpenChange }: ItemDrawerProps) {
  const router = useRouter();
  const [fullItem, setFullItem] = useState<ItemWithRelations | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [originalItem, setOriginalItem] = useState<ItemWithRelations | null>(null);

  // Edit form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!open) {
      setFullItem(null);
      setEditing(false);
    }
  }, [open]);

  useEffect(() => {
    if (fullItem) {
      setTitle(fullItem.title || "");
      setDescription(fullItem.description || "");
      setTags(fullItem.tags.map((it) => it.tag.name).join(", "));
      setContent(fullItem.content || "");
      setLanguage(fullItem.language || "");
      setUrl(fullItem.url || "");
    }
  }, [fullItem]);

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      setFullItem(null);
      setEditing(false);
    }
  };

  const fetchFullItem = async (itemId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/items/${itemId}`);
      const result = await response.json();
      if (result.success) {
        setFullItem(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSheetOpenChange = (newOpen: boolean) => {
    handleOpenChange(newOpen);
    if (newOpen && item && !fullItem) {
      fetchFullItem(item.id);
    }
  };

  const handleEdit = async () => {
    if (!fullItem) {
      if (item) {
        await fetchFullItem(item.id);
      }
      return;
    }
    setOriginalItem(fullItem);
    setTitle(fullItem.title || "");
    setDescription(fullItem.description || "");
    setTags(fullItem.tags.map((it) => it.tag.name).join(", "));
    setContent(fullItem.content || "");
    setLanguage(fullItem.language || "");
    setUrl(fullItem.url || "");
    setEditing(true);
  };

  const handleCancel = () => {
    if (originalItem) {
      setFullItem(originalItem);
      setTitle(originalItem.title || "");
      setDescription(originalItem.description || "");
      setTags(originalItem.tags.map((it) => it.tag.name).join(", "));
      setContent(originalItem.content || "");
      setLanguage(originalItem.language || "");
      setUrl(originalItem.url || "");
    }
    setEditing(false);
  };

  const handleSave = async () => {
    if (!fullItem || !title.trim()) return;

    setSaving(true);
    try {
      const tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const result = await updateItemAction(fullItem.id, {
        title: title.trim(),
        description: description.trim() || null,
        tags: tagArray.length > 0 ? tagArray : undefined,
        content: content.trim() || null,
        language: language.trim() || null,
        url: url.trim() || null,
      });

      if (result.success) {
        setFullItem(result.data);
        setEditing(false);
        router.refresh();
      } else {
        console.error("Failed to update item:", result.error);
      }
    } catch (error) {
      console.error("Failed to update item:", error);
    } finally {
      setSaving(false);
    }
  };

  if (!item) return null;

  const displayItem = fullItem || item;
  const itemTypeName = (displayItem.type.name.toLowerCase() as ItemTypeName) || "";

  const showContent = ["snippet", "prompt", "command", "note"].includes(itemTypeName);
  const showLanguage = ["snippet", "command"].includes(itemTypeName);
  const showUrl = itemTypeName === "link";

  return (
    <Sheet open={open} onOpenChange={handleSheetOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">
            {editing ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Item title"
                className="text-xl font-semibold"
              />
            ) : (
              displayItem.title
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Action Bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b">
          {editing ? (
            <>
              <Button
                variant="default"
                size="sm"
                className="gap-1.5"
                onClick={handleSave}
                disabled={saving || !title.trim()}
              >
                <Check className="h-4 w-4" />
                <span className="text-xs">Save</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={handleCancel}
                disabled={saving}
              >
                <X className="h-4 w-4" />
                <span className="text-xs">Cancel</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  // TODO: Toggle favorite
                }}
              >
                <Star
                  className={`h-4 w-4 ${displayItem.isFavorite ? "fill-yellow-500 text-yellow-500" : ""}`}
                />
                <span className="text-xs">Favorite</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  // TODO: Toggle pin
                }}
              >
                <Pin
                  className={`h-4 w-4 ${displayItem.isPinned ? "fill-muted-foreground" : ""}`}
                />
                <span className="text-xs">Pin</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  // TODO: Copy content
                }}
              >
                <Copy className="h-4 w-4" />
                <span className="text-xs">Copy</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={handleEdit}
              >
                <Pencil className="h-4 w-4" />
                <span className="text-xs">Edit</span>
              </Button>

              <div className="flex-1" />

              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-destructive hover:text-destructive"
                onClick={() => {
                  // TODO: Delete item
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Content Area */}
        <div className="px-4 py-4 space-y-4">
          {/* Type & Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">{displayItem.type.name}</Badge>
            <span>•</span>
            <span>{new Date(displayItem.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Editable Fields */}
          {editing ? (
            <>
              {/* Description */}
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  rows={2}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Tags
                </label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Comma-separated tags"
                />
              </div>

              {/* Type-specific fields */}
              {showContent && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">
                    Content
                  </label>
                  <Textarea
                    value={content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                    placeholder="Content"
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>
              )}

              {showLanguage && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">
                    Language
                  </label>
                  <Input
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="e.g., TypeScript, Python"
                  />
                </div>
              )}

              {showUrl && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">
                    URL
                  </label>
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    type="url"
                  />
                </div>
              )}
            </>
          ) : (
            /* View Mode */
            <>
              {/* Description */}
              {displayItem.description && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {displayItem.description}
                  </p>
                </div>
              )}

              {/* Collection - only available in full item */}
              {fullItem?.collection && (
                <div className="flex items-center gap-2 text-sm">
                  <Folder className="h-4 w-4 text-muted-foreground" />
                  <span>{fullItem.collection.name}</span>
                </div>
              )}

              {/* Tags */}
              {displayItem.tags.length > 0 && (
                <div className="flex items-start gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex flex-wrap gap-1.5">
                    {displayItem.tags.map((itemTag) => (
                      <Badge
                        key={itemTag.tag.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {itemTag.tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Language */}
              {displayItem.language && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Language: </span>
                  <span>{displayItem.language}</span>
                </div>
              )}

              {/* Content Preview */}
              {displayItem.content && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Content</h4>
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                    {displayItem.content}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>

        {/* Loading State */}
        {loading && !fullItem && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="space-y-3 w-3/4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
