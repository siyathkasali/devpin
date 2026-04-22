# Current Feature

Rate Limiting for Auth

## Status

Completed

## Goals

- [x] Install `@upstash/ratelimit` and `@upstash/redis` packages
- [x] Create `src/lib/rate-limit.ts` utility with Upstash client
- [x] Add rate limiting to login (5 attempts/15min, IP+email)
- [x] Add rate limiting to register (3 attempts/1hour, IP)
- [x] Add rate limiting to forgot-password (3 attempts/15min, IP)
- [x] Add rate limiting to reset-password (3 attempts/15min, IP)
- [x] Add rate limiting to resend-verification (3 attempts/15min, IP+email) - no endpoint exists yet
- [x] Return 429 with user-friendly JSON and Retry-After header
- [x] Fail open when Upstash unavailable
- [x] Run build and verify

## Rate Limits Summary

| Endpoint | Limit | Key |
|----------|-------|-----|
| Login (`/sign-in`) | 5 attempts / 15 min | IP + email |
| Register (`/api/auth/register`) | 3 attempts / 1 hour | IP |
| Forgot Password (`/api/auth/forgot-password`) | 3 attempts / 15 min | IP |
| Reset Password (`/api/auth/reset-password`) | 3 attempts / 15 min | IP |
| Resend Verification | 3 attempts / 15 min | IP + email (no endpoint yet) |

## Notes

- Based on `@context/features/rate-limiting-spec.md`
- Created `src/lib/rate-limit.ts` with separate Ratelimit instances per endpoint
- Used `next/headers` for IP extraction in server actions (login)
- Used `x-forwarded-for` header for IP extraction in API routes
- Fails open (allows request) if Upstash is unavailable
- Environment variables already configured: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

## History

- 2026-04-22: Starting Rate Limiting for Auth feature.
- 2026-04-22: Rate Limiting for Auth feature completed.