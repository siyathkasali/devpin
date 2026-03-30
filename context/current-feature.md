# Feature Tracking

## Past Features

- **✅ Dashboard UI Phase 1**: Set up `feature/dashboard-phase-1` branch. Initialized ShadCN UI (Radix + Nova), installed button and input components. Configured dark mode default and root layout. Created `/dashboard` route with top bar, placeholder sidebar, and main layout structure. Updated root path to redirect to `/dashboard`. Merged to `master`.

---

## Current Feature

Dashboard UI Phase 2 — Sidebar navigation with mock data, collapsible layout, and mobile drawer.

## Status

Completed

## Goals

- [x] Create a collapsible sidebar layout using ShadCN's `Sidebar` component
- [x] Render item types with links to `/items/TYPE` (e.g., `/items/snippets`)
- [x] Display favorite collections section
- [x] Display most recent (all) collections section
- [x] User avatar area at the bottom of the sidebar
- [x] Add a togglable drawer icon to open/close sidebar
- [x] Sidebar behaves as a drawer always on mobile view

## Notes

- Uses data directly imported from `@src/lib/mock-data.ts` (items, types, collections, user).
- See `@context/features/dashboard-phase-2-spec.md` for full specification.
- References: `@context/screenshots/dashboard-ui-main.png`, `dashboard-ui-drawer.png`, `@context/project-overview.md`.

## History

- 2026-03-28: Started Dashboard UI Phase 2 on branch `feature/dashboard-phase-2`
- 2026-03-28: Installed Shadcn's native `sidebar` (with dependencies `sheet`, `tooltip`, `skeleton`, etc.)
- 2026-03-28: Rewrote layout using `SidebarProvider` and `AppSidebar` with mock data mapping.
- 2026-03-30: Refactored globals.css typography to attach to Next.js Geist fonts correctly.
