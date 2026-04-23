import { Badge } from "@/components/ui/badge";
import { Star, Pin, Code, Sparkles, Terminal, StickyNote, File, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { DashboardItem } from "@/src/lib/db/items";

const IconMap: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image: ImageIcon,
  Link: LinkIcon,
};

export function ItemCard({ item }: { item: DashboardItem }) {
  // Use DB relation directly instead of mock itemTypes
  const IconComponent = item.type.icon ? IconMap[item.type.icon] : null;

  const date = new Date(item.createdAt);
  const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-card/30 hover:bg-card/60 transition-colors border border-border/50 cursor-pointer">
      {/* Icon Area */}
      <div className="shrink-0 mt-1">
        <div className="rounded bg-background p-2 border border-border">
          {IconComponent && <IconComponent className="h-4 w-4" style={{ color: item.type.color || "currentColor" }} />}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0 flex flex-col gap-1 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate text-foreground">{item.title}</span>
          {item.isPinned && <Pin className="h-3 w-3 text-muted-foreground fill-muted-foreground shrink-0" />}
          {item.isFavorite && <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 shrink-0" />}
        </div>
        <p className="text-muted-foreground truncate">{item.description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-1">
          {item.tags.map((itemTag) => (
            <Badge key={itemTag.tag.id} variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-muted/50 rounded-sm">
              {itemTag.tag.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Date */}
      <div className="shrink-0 text-xs text-muted-foreground whitespace-nowrap pt-1">
        {dateStr}
      </div>
    </div>
  );
}
