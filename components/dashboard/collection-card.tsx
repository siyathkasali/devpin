import { Collection, itemTypes } from "@/src/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Code, Sparkles, Terminal, StickyNote, File, Image as ImageIcon, Link as LinkIcon, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const IconMap: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image: ImageIcon,
  Link: LinkIcon,
};

export function CollectionCard({ collection }: { collection: Collection }) {
  // Map breakdown to icons
  const breakdownTypeIds = Object.keys(collection.itemTypeBreakdown);
  const typesInCollection = breakdownTypeIds.map((typeId) => itemTypes.find((t) => t.id === typeId)).filter((t) => t !== undefined);

  // We can assign a border color based on the first type, or a pseudo-random one based on name length
  const colors = [
    "border-blue-500", "border-purple-500", "border-orange-500", 
    "border-yellow-500", "border-gray-500", "border-pink-500", "border-emerald-500"
  ];
  // Simple deterministic color
  const colorIndex = collection.name.length % colors.length;
  const borderColor = colors[colorIndex];

  return (
    <Card className={cn("flex flex-col h-full bg-card/50 hover:bg-card/80 transition-colors border-l-4", borderColor)}>
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
          {typesInCollection.map((type) => {
            const IconComponent = type ? IconMap[type.icon] : null;
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
