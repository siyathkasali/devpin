# Feature Tracking

## Past Features

- **✅ Dashboard UI Phase 1**: Set up `feature/dashboard-phase-1` branch. Initialized ShadCN UI (Radix + Nova), installed button and input components. Configured dark mode default and root layout. Created `/dashboard` route with top bar, placeholder sidebar, and main layout structure. Updated root path to redirect to `/dashboard`. Merged to `master`.
- **✅ Dashboard UI Phase 2**: Sidebar navigation with mock data, collapsible layout, and mobile drawer. Completed mapping mock data to `Sidebar` and resolving layout issues. Merged to `master`.
- **✅ Dashboard UI Phase 3**: Main area, recent collections, pinned items, recent items, and stats cards.

---

## Current Feature

Seed Data Implementation

## Status

In Progress

## Goals

- [x] Create a feature branch `feature/seed-script`
- [x] Implement `prisma/seed.ts` with required mock data
- [x] Create Demo User
- [x] Implement System Item Types
- [x] Create Collections and Items
- [x] Verify functionality running `npm run db:seed`

## Notes

- See `@context/features/seed-spec.md` for full specification.
- Utilizing bcryptjs for user password hashing.

## History

- 2026-03-30: Completed Database Setup.
- 2026-03-30: Started Seed Data Implementation.
