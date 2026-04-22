# Auth Security Audit

**Last Audit Date**: 2026-04-22

## Executive Summary

The authentication system was audited for security issues not automatically handled by NextAuth v5. Overall, the implementation follows good security practices with proper token generation, session validation, and single-use enforcement. However, one critical issue was identified: the registration endpoint leaks email enumeration, and there is a minor deviation from password hashing best practices.

## Issues Found

### [MEDIUM] Weak bcrypt salt rounds

**Description**: Password hashing uses bcrypt with only 10 salt rounds, which is below current OWASP recommendations of 12+ rounds for adequate security against GPU-based attacks.

**Affected Files**:
- `app/api/auth/register/route.ts` (line 44)
- `app/api/auth/reset-password/route.ts` (line 68)
- `app/api/auth/change-password/route.ts` (line 64)

**Specific Fix**: Increase bcrypt salt rounds to at least 12:
```typescript
// Change from:
const hashedPassword = await bcrypt.hash(password, 10);
// To:
const hashedPassword = await bcrypt.hash(password, 12);
```

---

### [LOW] Email enumeration on registration endpoint

**Description**: The registration endpoint returns a specific error message when an email already exists, allowing attackers to enumerate valid email addresses in the system.

**Affected Files**:
- `app/api/auth/register/route.ts` (lines 37-41)

**Specific Fix**: Return a generic success message regardless of whether the email exists, similar to the forgot-password endpoint:
```typescript
// Instead of returning 409 with specific error:
// return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });

// Return generic success:
return NextResponse.json({
  success: true,
  message: "Registration successful. Please check your email to verify your account.",
}, { status: 201 });
```

Note: The forgot-password endpoint correctly implements email enumeration prevention by always returning success.

---

### [LOW] Long email verification token expiration

**Description**: Email verification tokens expire after 24 hours, which is longer than recommended. OWASP recommends email verification tokens should be short-lived (typically 20 minutes or less).

**Affected Files**:
- `app/api/auth/register/route.ts` (line 56)

**Specific Fix**: Consider reducing expiration to 1-2 hours and sending a new token if the user requests it.

---

## Passed Checks

1. **Password Hashing**: Uses bcrypt for password hashing (with noted rounds issue)
2. **Token Generation**: Uses `crypto.randomBytes(32)` for cryptographically secure random token generation
3. **Token Expiration - Password Reset**: 1-hour expiry is appropriate for password reset tokens
4. **Email Enumeration Prevention (Forgot Password)**: Properly prevents email enumeration by always returning success
5. **Token Single-Use Enforcement**: Password reset and email verification tokens are deleted after use
6. **Token Identifier Binding**: Tokens are bound to specific email addresses via the identifier field
7. **Session Validation**: Profile route and layout properly validate sessions with redirects for unauthenticated users
8. **Change Password - Current Password Verification**: Properly verifies current password before allowing change
9. **Delete Account - Auth Protection**: Route properly checks for authenticated session before deletion

---

## Recommendations

1. **Rate Limiting**: Consider implementing rate limiting on auth endpoints to prevent brute force attacks (especially login and password reset attempts).

2. **Password Policy Enhancement**: Consider adding complexity requirements (uppercase, numbers, special characters) beyond just minimum length.

3. **Account Lockout**: Implement temporary account lockout after multiple failed login attempts.

4. **Security Headers**: Ensure security headers (CSP, X-Frame-Options, etc.) are configured for auth-related pages.