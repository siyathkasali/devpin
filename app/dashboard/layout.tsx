import { AppSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  getSidebarItemTypes,
  getDashboardCollections,
} from "@/src/lib/db/collections";
import { getSidebarUser } from "@/src/lib/db/user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userEmail = "demo@devstash.io";

  const [itemTypesResult, collectionsResult, userResult] = await Promise.all([
    getSidebarItemTypes(userEmail),
    getDashboardCollections(userEmail),
    getSidebarUser(userEmail),
  ]);

  const itemTypes = itemTypesResult.success ? itemTypesResult.data : [];
  const collections = collectionsResult.success
    ? collectionsResult.data
    : [];
  const user = userResult.success
    ? userResult.data ?? { id: "", name: "Guest", email: "", isPro: false }
    : { id: "", name: "Guest", email: "", isPro: false };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar
          itemTypes={itemTypes}
          collections={collections}
          user={user}
        />

        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}