# Feature Tracking

## Past Features

- **✅ Dashboard UI Phase 1**: Set up `feature/dashboard-phase-1` branch. Initialized ShadCN UI (Radix + Nova), installed button and input components. Configured dark mode default and root layout. Created `/dashboard` route with top bar, placeholder sidebar, and main layout structure. Updated root path to redirect to `/dashboard`. Merged to `master`.
- **✅ Dashboard UI Phase 2**: Sidebar navigation with mock data, collapsible layout, and mobile drawer. Completed mapping mock data to `Sidebar` and resolving layout issues. Merged to `master`.
- **✅ Dashboard UI Phase 3**: Main area, recent collections, pinned items, recent items, and stats cards.
- **✅ Dashboard Collections DB Integration**: Created db query for fetching collections with item type aggregation, updated dashboard page to fetch collections from database, updated collection card component to use dynamic styles.
- **✅ Dashboard Items DB Integration**: Created db queries for items, fetched and parsed stats in main dashboard page, refactored item cards to use DB relations.

---

## Current Feature

Stats & Sidebar DB Integration

## Status

In Progress

## Goals

- [ ] Create a feature branch `feature/stats-sidebar`
- [ ] Add "View all collections" link under the collections in sidebar
- [ ] Update sidebar to fetch system item types and collections from DB
- [ ] Render favorite collections with a star icon
- [ ] Render recent collections with a colored circle (dominant type)
- [ ] Verify functionality

## Notes

- See `@context/features/stats-sidebar-spec.md` for full specification.
- Working off the `demo@devstash.io` user for fetching demo data.

## History

- 2026-03-30: Started Stats & Sidebar DB Integration Implementation.
- 2026-04-17: Continuing implementation - adding view all collections link, updating sidebar to fetch system item types and collections from DB, rendering favorite/recent collections with appropriate icons.
