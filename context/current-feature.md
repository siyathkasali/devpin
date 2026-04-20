# Current Feature

Auth Phase 2 - Email/Password Provider

## Status

In Progress

## Goals

- [ ] Add password field to User model via migration
- [ ] Update `auth.config.ts` with Credentials provider placeholder
- [ ] Update `auth.ts` to override Credentials with bcrypt validation
- [ ] Create registration API route at `/api/auth/register`
- [ ] Verify functionality

## Notes

- See `@context/features/auth-spec-files/auth-phase-2-spec.md` for full specification.
- Use split config pattern for Credentials provider (placeholder in config, real logic in auth.ts).

## History

- 2026-04-20: Starting Auth Phase 2 - Email/Password Provider.
- 2026-04-20: Completed Auth Phase 1 - NextAuth + GitHub Provider. Set up NextAuth v5 with Prisma adapter, GitHub OAuth, and route protection via proxy.
