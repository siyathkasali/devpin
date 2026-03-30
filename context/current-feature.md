# Feature Tracking

## Past Features

- **✅ Dashboard UI Phase 1**: Set up `feature/dashboard-phase-1` branch. Initialized ShadCN UI (Radix + Nova), installed button and input components. Configured dark mode default and root layout. Created `/dashboard` route with top bar, placeholder sidebar, and main layout structure. Updated root path to redirect to `/dashboard`. Merged to `master`.
- **✅ Dashboard UI Phase 2**: Sidebar navigation with mock data, collapsible layout, and mobile drawer. Completed mapping mock data to `Sidebar` and resolving layout issues. Merged to `master`.
- **✅ Dashboard UI Phase 3**: Main area, recent collections, pinned items, recent items, and stats cards.

---

## Current Feature

Database Setup with Prisma and Neon

## Status

Completed

## Goals

- [x] Set up Prisma ORM with Neon PostgreSQL database
- [x] Create initial schema based on data models in project-overview.md
- [x] Include NextAuth models (Account, Session, VerificationToken)
- [x] Add appropriate indexes and cascade deletes
- [x] Ensure Prisma 7 compatibility

## Notes

- See `@context/features/database-spec.md` for full specification.
- References: `@context/project-overview.md`, `@context/coding-standards.md`

## History

- 2026-03-30: Started Database Setup
