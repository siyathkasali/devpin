export function Sidebar() {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      {/* Logo — top of sidebar */}
      <div className="flex h-14 items-center gap-2.5 px-5 border-b border-border">
        <div className="flex size-7 items-center justify-center rounded-lg bg-linear-to-br from-emerald-400 to-cyan-400">
          <span className="text-sm font-bold text-white">S</span>
        </div>
        <span className="text-base font-semibold tracking-tight">
          DevStash
        </span>
      </div>

      {/* Sidebar content placeholder */}
      <div className="flex flex-1 items-center justify-center">
        <h2 className="text-lg font-semibold text-muted-foreground">Sidebar</h2>
      </div>

      {/* User profile — bottom of sidebar */}
      <div className="flex items-center gap-3 border-t border-border px-4 py-3">
        <div className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
          JD
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium">John Doe</p>
          <p className="truncate text-xs text-muted-foreground">john@example.com</p>
        </div>
      </div>
    </aside>
  );
}
