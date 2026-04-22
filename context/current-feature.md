# Current Feature

Email Verification - Resend Integration

## Status

In Progress

## Goals

- [ ] Install resend package
- [ ] Add VerificationToken model to Prisma schema
- [ ] Create `src/lib/email.ts` service
- [ ] Create verification API route at `/api/auth/verify-email`
- [ ] Create `/verify-email/success` page
- [ ] Update registration API to send verification email
- [ ] Update auth config to check email verification
- [ ] Update sign-in page for unverified users
- [ ] Verify functionality

## Notes

- See `@context/features/email-verification-spec.md` for full specification.
- Using Resend for transactional emails.
- User must verify email before signing in.

## History

- 2026-04-21: Starting Email Verification feature.
