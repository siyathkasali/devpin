"use client";

import { Code, Sparkles, Terminal, StickyNote, File, Image as ImageIcon, Link as LinkIcon, Star, Folder } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { itemTypes, collections, currentUser, items } from "@/src/lib/mock-data";

const iconMap: Record<string, React.ElementType> = {
  Code, Sparkles, Terminal, StickyNote, File, Image: ImageIcon, Link: LinkIcon,
};

export function AppSidebar() {
  const favorites = collections.filter((c) => c.isFavorite);

  // Fallback to static counts for types to match the screenshot better, 
  // since mock-data items list only has 8 items.
  const idealTypeCounts: Record<string, number> = {
    "type-snippet": 24,
    "type-prompt": 18,
    "type-command": 15,
    "type-note": 12,
    "type-file": 5,
    "type-image": 3,
    "type-link": 8,
  };

  return (
    <Sidebar>
      <SidebarHeader className="h-14 flex items-center px-4 border-b border-sidebar-border">
        {/* Logo — top of sidebar */}
        <div className="flex w-full items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-linear-to-br from-emerald-400 to-cyan-400">
            <span className="text-sm font-bold text-white">S</span>
          </div>
          <span className="text-base font-semibold tracking-tight text-sidebar-foreground">
            DevStash
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Types Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Types</SidebarGroupLabel>
          <SidebarMenu>
            {itemTypes.map((type) => {
              const Icon = iconMap[type.icon] || File;
              return (
                <SidebarMenuItem key={type.id}>
                  <SidebarMenuButton asChild>
                    <a href={`/items/${type.id.replace("type-", "")}`}>
                      <Icon className="text-muted-foreground mr-2 size-4" style={{ color: type.color }} />
                      <span>{type.name}</span>
                    </a>
                  </SidebarMenuButton>
                  <SidebarMenuBadge className="text-muted-foreground group-hover/menu-button:text-sidebar-foreground">
                    {idealTypeCounts[type.id] || 0}
                  </SidebarMenuBadge>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Favorites */}
        <SidebarGroup>
          <SidebarGroupLabel>Favorites</SidebarGroupLabel>
          <SidebarMenu>
            {favorites.map((collection) => (
              <SidebarMenuItem key={collection.id}>
                <SidebarMenuButton asChild>
                  <a href={`/collections/${collection.id}`} className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                       <Folder className="text-muted-foreground size-4" />
                       <span>{collection.name}</span>
                    </div>
                    <Star className="size-4 text-yellow-500 fill-current" />
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* All Collections */}
        <SidebarGroup>
          <SidebarGroupLabel>All Collections</SidebarGroupLabel>
          <SidebarMenu>
            {collections.map((collection) => (
              <SidebarMenuItem key={collection.id}>
                <SidebarMenuButton asChild>
                  <a href={`/collections/${collection.id}`}>
                    <Folder className="text-muted-foreground mr-2 size-4" />
                    <span>{collection.name}</span>
                  </a>
                </SidebarMenuButton>
                <SidebarMenuBadge className="text-muted-foreground group-hover/menu-button:text-sidebar-foreground">
                  {collection.itemCount}
                </SidebarMenuBadge>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {/* User profile — bottom of sidebar */}
        <div className="flex items-center gap-3 py-1">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
            {currentUser.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-foreground">{currentUser.name}</p>
            <p className="truncate text-xs text-sidebar-foreground/70">{currentUser.email}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
