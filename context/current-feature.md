# Current Feature

Forgot Password - Reset via Email

## Status

In Progress

## Goals

- [ ] Create `/forgot-password` page
- [ ] Create `/reset-password` page with token validation
- [ ] Create `POST /api/auth/forgot-password` API route
- [ ] Create `POST /api/auth/reset-password` API route
- [ ] Add "Forgot password?" link to sign-in page
- [ ] Add password reset email template to email.ts
- [ ] Verify functionality

## Notes

- See `@context/features/forgot-password-spec.md` for full specification.
- Reuse VerificationToken model (1-hour expiry for password reset).
- Single-use token - deleted after password is reset.

## History

- 2026-04-22: Starting Forgot Password feature.
