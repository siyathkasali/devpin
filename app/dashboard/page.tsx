import { collections, items } from "@/src/lib/mock-data";
import { CollectionCard } from "@/components/dashboard/collection-card";
import { ItemCard } from "@/components/dashboard/item-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, Star, FileText, Pin } from "lucide-react";

export default function DashboardPage() {
  // Compute Stats
  const totalItems = items.length;
  const totalCollections = collections.length;
  const favItems = items.filter(i => i.isFavorite).length;
  const favCollections = collections.filter(c => c.isFavorite).length;

  const pinnedItems = items.filter(i => i.isPinned);
  const recentItems = [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto h-full pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Your developer knowledge hub</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collections</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCollections}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Items</CardTitle>
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{favItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Collections</CardTitle>
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{favCollections}</div>
          </CardContent>
        </Card>
      </div>

      {/* Collections Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Collections</h2>
          <button className="text-sm text-muted-foreground hover:text-foreground">View all</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map(collection => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>

      {/* Pinned Items Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xl font-semibold tracking-tight">
          <Pin className="w-4 h-4 text-muted-foreground fill-muted-foreground transform rotate-45" />
          <h2>Pinned</h2>
        </div>
        <div className="flex flex-col space-y-2">
          {pinnedItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Recent Items Section */}
      <div className="flex flex-col gap-4 pt-4">
        <h2 className="text-xl font-semibold tracking-tight">Recent Items</h2>
        <div className="flex flex-col space-y-2">
          {recentItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
