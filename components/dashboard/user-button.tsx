"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarUser } from "@/src/lib/db/user";
import { LogOut, User } from "lucide-react";

interface UserButtonProps {
  user: SidebarUser;
}

export function UserButton({ user }: UserButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 py-1 w-full cursor-pointer bg-transparent hover:bg-sidebar-accent rounded-md transition-colors">
          <Avatar src={user.image} name={user.name} className="size-8" />
          <div className="flex-1 min-w-0 text-left">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user.name}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/70">
              {user.email}
            </p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/sign-in" })}
          className="text-red-600 focus:text-red-600 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
