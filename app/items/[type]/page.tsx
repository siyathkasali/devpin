import { getItemsByType } from "@/src/lib/db/items";
import { ItemsList } from "@/components/dashboard/items-list";
import { Badge } from "@/components/ui/badge";

interface ItemsByTypePageProps {
  params: Promise<{ type: string }>;
}

export default async function ItemsByTypePage({ params }: ItemsByTypePageProps) {
  const { type } = await params;
  const userEmail = "demo@devstash.io";

  const result = await getItemsByType(userEmail, type);
  const items = result.success ? result.data : [];

  const typeName = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto h-full pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight capitalize">
            {typeName}
          </h1>
          <p className="text-muted-foreground mt-1">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      {/* Items Grid */}
      {items.length > 0 ? (
        <ItemsList
          items={items}
          gridClassName="grid grid-cols-1 md:grid-cols-2 gap-4"
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground">No {typeName.toLowerCase()} found</p>
        </div>
      )}
    </div>
  );
}