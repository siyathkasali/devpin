import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Code, Sparkles, Terminal, StickyNote, File, Image as ImageIcon, Link as LinkIcon, MoreHorizontal } from "lucide-react";
import { DashboardCollection } from "@/src/lib/db/collections";

const IconMap: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image: ImageIcon,
  Link: LinkIcon,
};

export function CollectionCard({ collection }: { collection: DashboardCollection }) {
  // Use the dominant color provided by our backend DB helper
  const borderColor = collection.dominantTypeColor || "#9ca3af"; // Default to gray if none exists

  return (
    <Card 
      className="flex flex-col h-full bg-card/50 hover:bg-card/80 transition-colors border-l-4" 
      style={{ borderLeftColor: borderColor }}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            {collection.name}
            {collection.isFavorite && <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />}
          </CardTitle>
          <CardDescription className="text-xs">{collection.itemCount} items</CardDescription>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <p className="text-sm text-muted-foreground flex-1 line-clamp-2">
          {collection.description}
        </p>
        <div className="flex items-center gap-2 mt-auto">
          {collection.types.map((type) => {
            const IconComponent = IconMap[type.icon];
            if (!IconComponent) return null;
            return (
              <IconComponent 
                key={type.id} 
                className="h-4 w-4" 
                style={{ color: type.color }} 
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
