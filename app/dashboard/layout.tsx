import { AppSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getSidebarItemTypes } from "@/src/lib/db/item-types";
import { getDashboardCollections } from "@/src/lib/db/collections";
import { getSidebarUser } from "@/src/lib/db/user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userEmail = "demo@devstash.io";
  const [itemTypes, collections, dbUser] = await Promise.all([
    getSidebarItemTypes(userEmail),
    getDashboardCollections(userEmail),
    getSidebarUser(userEmail),
  ]);

  const user = dbUser ?? { id: "", name: "Guest", email: "", isPro: false };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar — full-height left column (drawer on mobile) */}
        <AppSidebar itemTypes={itemTypes} collections={collections} user={user} />

        {/* Right side — top bar + main content */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
