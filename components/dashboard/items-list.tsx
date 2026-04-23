"use client";

import { useState } from "react";
import { DashboardItem } from "@/src/lib/db/items";
import { ItemCard } from "./item-card";
import { ItemDrawer } from "./item-drawer";

interface ItemsListProps {
  items: DashboardItem[];
  gridClassName?: string;
}

export function ItemsList({ items, gridClassName }: ItemsListProps) {
  const [selectedItem, setSelectedItem] = useState<DashboardItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleItemClick = (item: DashboardItem) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  return (
    <>
      <div className={gridClassName || "flex flex-col space-y-2"}>
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item)}
            className="cursor-pointer"
          >
            <ItemCard item={item} />
          </div>
        ))}
      </div>

      <ItemDrawer
        item={selectedItem}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </>
  );
}