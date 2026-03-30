# Feature Tracking

## Past Features

- **✅ Dashboard UI Phase 1**: Set up `feature/dashboard-phase-1` branch. Initialized ShadCN UI (Radix + Nova), installed button and input components. Configured dark mode default and root layout. Created `/dashboard` route with top bar, placeholder sidebar, and main layout structure. Updated root path to redirect to `/dashboard`. Merged to `master`.
- **✅ Dashboard UI Phase 2**: Sidebar navigation with mock data, collapsible layout, and mobile drawer. Completed mapping mock data to `Sidebar` and resolving layout issues. Merged to `master`.
- **✅ Dashboard UI Phase 3**: Main area, recent collections, pinned items, recent items, and stats cards.
- **✅ Dashboard Collections DB Integration**: Created db query for fetching collections with item type aggregation, updated dashboard page to fetch collections from database, updated collection card component to use dynamic styles.

---

## Current Feature

Dashboard Items DB Integration

## Status

In Progress

## Goals

- [x] Create a feature branch `feature/dashboard-items`
- [x] Create `src/lib/db/items.ts` with data fetching functions
- [x] Update `app/dashboard/page.tsx` to fetch pinned and recent items from DB directly
- [x] Update `ItemCard` component to derive icon and border from item type
- [x] Display item type tags properly
- [x] Update collection stats display (e.g. total items)
- [x] Verify functionality (if no pinned items, don't display the section)

## Notes

- See `@context/features/dashboard-items-spec.md` for full specification.
- Working off the `demo@devstash.io` user for fetching demo data.

## History

- 2026-03-30: Started Dashboard Items DB Integration Implementation.
- 2026-03-30: Completed Dashboard Items DB Integration Implementation.
