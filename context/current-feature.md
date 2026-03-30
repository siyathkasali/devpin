# Feature Tracking

## Past Features

- **✅ Dashboard UI Phase 1**: Set up `feature/dashboard-phase-1` branch. Initialized ShadCN UI (Radix + Nova), installed button and input components. Configured dark mode default and root layout. Created `/dashboard` route with top bar, placeholder sidebar, and main layout structure. Updated root path to redirect to `/dashboard`. Merged to `master`.
- **✅ Dashboard UI Phase 2**: Sidebar navigation with mock data, collapsible layout, and mobile drawer. Completed mapping mock data to `Sidebar` and resolving layout issues. Merged to `master`.

---

## Current Feature

Dashboard UI Phase 3 — Main area, recent collections, pinned items, recent items, and stats cards.

## Status

Completed

## Goals

- [x] Implement the main area to the right
- [x] Display Recent collections
- [x] Display Pinned Items
- [x] Display 10 Recent items
- [x] Add 4 stats cards at the top for number of items, collections, favorite items and favorite collections

## Notes

- Uses data directly imported from `@src/lib/mock-data.js` (items, types, collections, user).
- See `@context/features/dashboard-phase-3-spec.md` for full specification.
- References: `@context/screenshots/dashboard-ui-main.png`, `@context/project-overview.md`, `@context/features/dashboard-phase-1-spec.md`, `@context/features/dashboard-phase-2-spec.md`.

## History

- 2026-03-30: Started Dashboard UI Phase 3 on branch `feature/dashboard-phase-3`
