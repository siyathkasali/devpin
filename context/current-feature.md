# Current Feature

Auth Phase 3 - Sign In, Register & Sign Out UI

## Status

In Progress

## Goals

- [ ] Create separate `/sign-in` page with email/password + GitHub OAuth
- [ ] Create separate `/register` page with form validation
- [ ] Create reusable Avatar component with initials fallback
- [ ] Add user section to sidebar with avatar, name, and sign out dropdown
- [ ] Verify functionality

## Notes

- See `@context/features/auth-spec-files/auth-phase-3-spec.md` for full specification.
- Spec wants SEPARATE `/sign-in` and `/register` pages (not toggled on one page).
- Avatar logic: GitHub image if available, otherwise initials from name.
- Clicking avatar should go to "/profile".

## History

- 2026-04-21: Starting Auth Phase 3 - Sign In, Register & Sign Out UI.
- 2026-04-20: Completed Auth Phase 2 - Email/Password Provider. Added Credentials provider with bcrypt validation, registration API, and sign-in/registration forms.
