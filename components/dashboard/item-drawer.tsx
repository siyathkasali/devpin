"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Pin, Copy, Pencil, Trash2, Tag, Folder } from "lucide-react";
import { DashboardItem, ItemWithRelations } from "@/src/lib/db/items";

interface ItemDrawerProps {
  item: DashboardItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ItemDrawer({ item, open, onOpenChange }: ItemDrawerProps) {
  const [fullItem, setFullItem] = useState<ItemWithRelations | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      setFullItem(null);
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

  if (!item) return null;

  const displayItem = fullItem || item;

  console.log({ displayItem });

  return (
    <Sheet open={open} onOpenChange={handleSheetOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">{displayItem.title}</SheetTitle>
        </SheetHeader>

        {/* Action Bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b">
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
            onClick={() => {
              // TODO: Edit item
            }}
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
        </div>

        {/* Content Area */}
        <div className="px-4 py-4 space-y-4">
          {/* Type & Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">{displayItem.type.name}</Badge>
            <span>•</span>
            <span>{new Date(displayItem.createdAt).toLocaleDateString()}</span>
          </div>

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
