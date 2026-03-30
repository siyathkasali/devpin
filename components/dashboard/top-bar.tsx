"use client";

import { Search, Plus, FolderPlus, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-3 border-b border-border bg-background px-4">
      {/* Sidebar toggle */}
      <SidebarTrigger className="-ml-1" />

      {/* Search bar */}
      <div className="relative flex-1 max-w-xl">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="size-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search items..."
          id="global-search"
          className="h-9 w-full rounded-lg border border-input bg-input/30 pl-9 pr-16 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <kbd className="inline-flex h-5 items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <Command className="size-2.5" />K
          </kbd>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant="outline"
          size="default"
          className="hidden sm:inline-flex"
          id="new-collection-btn"
        >
          <FolderPlus data-icon="inline-start" className="size-4" />
          New Collection
        </Button>
        <Button
          variant="default"
          size="default"
          className="bg-linear-to-r from-emerald-500 to-cyan-500 text-white border-none hover:from-emerald-600 hover:to-cyan-600"
          id="new-item-btn"
        >
          <Plus data-icon="inline-start" className="size-4" />
          New Item
        </Button>
      </div>
    </header>
  );
}
