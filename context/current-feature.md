# Feature Tracking

## Past Features

- **✅ Dashboard UI Phase 1**: Set up `feature/dashboard-phase-1` branch. Initialized ShadCN UI (Radix + Nova), installed button and input components. Configured dark mode default and root layout. Created `/dashboard` route with top bar, placeholder sidebar, and main layout structure. Updated root path to redirect to `/dashboard`. Merged to `master`.
- **✅ Dashboard UI Phase 2**: Sidebar navigation with mock data, collapsible layout, and mobile drawer. Completed mapping mock data to `Sidebar` and resolving layout issues. Merged to `master`.
- **✅ Dashboard UI Phase 3**: Main area, recent collections, pinned items, recent items, and stats cards.

---

## Current Feature

Dashboard Collections DB Integration

## Status

In Progress

## Goals

- [x] Create a feature branch `feature/dashboard-collections`
- [x] Create `src/lib/db/collections.ts`
- [x] Update `app/dashboard/page.tsx` to fetch collections from DB
- [x] Update `CollectionCard` component to handle dynamic border colors and icons
- [x] Verify functionality

## Notes

- See `@context/features/dashboard-collections-spec.md` for full specification.
- Working off the `demo@devstash.io` user for fetching demo data.

## History

- 2026-03-30: Started Dashboard Collections Implementation.
