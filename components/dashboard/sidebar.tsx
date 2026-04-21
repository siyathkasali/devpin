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
import { Badge } from "@/components/ui/badge";
import { SidebarItemType, DashboardCollection } from "@/src/lib/db/collections";
import { SidebarUser } from "@/src/lib/db/user";
import { UserButton } from "@/components/dashboard/user-button";

const iconMap: Record<string, React.ElementType> = {
  Code, Sparkles, Terminal, StickyNote, File, Image: ImageIcon, Link: LinkIcon,
};

export interface AppSidebarProps {
  itemTypes: SidebarItemType[];
  collections: DashboardCollection[];
  user: SidebarUser;
}

export function AppSidebar({ itemTypes, collections, user }: AppSidebarProps) {
  const favorites = collections.filter((c) => c.isFavorite);
  const recentCollections = collections.slice(0, 5);

  return (
    <Sidebar>
      <SidebarHeader className="h-14 flex items-center px-4 border-b border-sidebar-border">
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
        <SidebarGroup>
          <SidebarGroupLabel>Types</SidebarGroupLabel>
          <SidebarMenu>
            {itemTypes.map((type) => {
              const Icon = (type.icon && iconMap[type.icon]) ? iconMap[type.icon] : File;
              const isProType = type.name.toLowerCase() === "file" || type.name.toLowerCase() === "image";
              return (
                <SidebarMenuItem key={type.id}>
                  <SidebarMenuButton asChild>
                    <a href={`/items/${type.name.toLowerCase()}`}>
                      <Icon className="text-muted-foreground mr-2 size-4" style={{ color: type.color || undefined }} />
                      <span>{type.name}</span>
                      {isProType && (
                        <Badge variant="secondary" className="text-[9px] px-1 py-0 font-semibold uppercase ml-1.5">
                          <Star className="size-2.5 mr-0.5" />
                          PRO
                        </Badge>
                      )}
                    </a>
                  </SidebarMenuButton>
                  <SidebarMenuBadge className="text-muted-foreground group-hover/menu-button:text-sidebar-foreground">
                    {type.itemCount}
                  </SidebarMenuBadge>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Favorites</SidebarGroupLabel>
          <SidebarMenu>
            {favorites.map((collection) => (
              <SidebarMenuItem key={collection.id}>
                <SidebarMenuButton asChild>
                  <a href={`/collections/${collection.id}`} className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2 overflow-hidden">
                       <Folder className="text-muted-foreground size-4 shrink-0" />
                       <span className="truncate">{collection.name}</span>
                    </div>
                    <Star className="size-4 shrink-0 text-yellow-500 fill-current" />
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between items-center">
            Recent Collections
          </SidebarGroupLabel>
          <SidebarMenu>
            {recentCollections.map((collection) => (
              <SidebarMenuItem key={collection.id}>
                <SidebarMenuButton asChild>
                  <a href={`/collections/${collection.id}`} className="flex items-center overflow-hidden">
                    {collection.dominantTypeColor ? (
                      <div className="size-2.5 rounded-full mr-2 shrink-0" style={{ backgroundColor: collection.dominantTypeColor }} />
                    ) : (
                      <Folder className="text-muted-foreground mr-2 size-4 shrink-0" />
                    )}
                    <span className="truncate">{collection.name}</span>
                  </a>
                </SidebarMenuButton>
                <SidebarMenuBadge className="text-muted-foreground group-hover/menu-button:text-sidebar-foreground">
                  {collection.itemCount}
                </SidebarMenuBadge>
              </SidebarMenuItem>
            ))}

            <SidebarMenuItem>
              <SidebarMenuButton asChild className="text-sidebar-foreground/70 hover:text-sidebar-foreground mt-2 font-medium">
                <a href="/collections">
                  View all collections
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <UserButton user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}