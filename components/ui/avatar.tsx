"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 60%, 50%)`;
}

function AvatarImage({ className, ...props }: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      className={`aspect-square h-full w-full object-cover ${className || ""}`}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={`flex h-full w-full items-center justify-center bg-muted font-medium ${className || ""}`}
      {...props}
    />
  );
}

export function Avatar({ src, name, className }: AvatarProps) {
  const initials = name ? getInitials(name) : "?";
  const bgColor = name ? stringToColor(name) : "hsl(0, 0%, 50%)";

  return (
    <AvatarPrimitive.Root
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className || ""}`}
    >
      {src && <AvatarImage src={src} alt={name || "Avatar"} />}
      <AvatarFallback
        className="text-white"
        style={{ backgroundColor: src ? undefined : bgColor }}
        delayMs={600}
      >
        {initials}
      </AvatarFallback>
    </AvatarPrimitive.Root>
  );
}
