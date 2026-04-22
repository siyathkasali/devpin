# Email Verification - Resend Integration

## Overview

Add email verification on registration. Users must click a verification link sent to their email before they can access the dashboard.

## Requirements

### 1. Install Resend
```bash
npm install resend
```

### 2. Environment Variables
```
RESEND_API_KEY=your_resend_api_key
```

### 3. Create Email Service (`src/lib/email.ts`)
- Send verification email using Resend
- Include user's name in email
- Include verification link with token
- Template the email HTML nicely

### 4. Create Verification Token Model
Add to Prisma schema:
```prisma
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

### 5. Update Registration API
- Create verification token after user creation
- Send verification email via Resend
- Return message: "Please verify your email to continue"
- Don't allow sign-in until email is verified

### 6. Create Verification API Route
`GET/POST /api/auth/verify-email`
- Accept token from URL query
- Validate token exists and not expired
- Mark user email as verified
- Delete used token
- Redirect to dashboard on success

### 7. Update Auth Configuration
- Add `emailVerification` callback to check if user email is verified
- Only allow sign-in if email is verified

### 8. Create Verification Success Page
`/verify-email/success`
- Shows "Email Verified!" success message
- Shows user's email that was verified
- Button to proceed to sign-in
- Auto-redirect to sign-in after 5 seconds

### 9. Update Sign-In Page
- Show message if user tries to sign in with unverified email

## Verification Email Content
- Subject: "Verify your DevStash account"
- Greeting with user's name
- Verification link (expires in 24 hours)
- Button to verify
- Footer with unsubscribe option

## Testing
1. Register new user
2. Check email for verification link
3. Click link
4. Verify redirect to dashboard
5. Try signing in without verification (should fail)
