# Forgot Password - Reset via Email

## Overview

Add forgot password functionality. Users can request a password reset link via email and reset their password.

## Requirements

### 1. Create Forgot Password Page
`/forgot-password`
- Email input field
- Submit button to request reset link
- Success message after submission
- Link back to sign-in

### 2. Create Reset Password Page
`/reset-password?token=xxx`
- New password input
- Confirm password input
- Submit button to reset password
- Token validation (expired/invalid check)
- Redirect to sign-in on success

### 3. Create Forgot Password API Route
`POST /api/auth/forgot-password`
- Accept email
- Check if user exists
- Create verification token with 1-hour expiry
- Send reset email via Resend

### 4. Create Reset Password API Route
`POST /api/auth/reset-password`
- Accept token, new password, confirm password
- Validate token exists and not expired
- Validate passwords match and meet requirements
- Update user's password (bcrypt hashed)
- Delete used token

### 5. Update Sign-In Page
- Add "Forgot password?" link below form
- Link to `/forgot-password`

### 6. Reset Email Template
- Subject: "Reset your DevStash password"
- Include user's name
- Include reset link with token
- Button to reset password
- Warning about expiration (1 hour)

## VerificationToken Model
Already exists in schema. Will use for password reset tokens with identifier = user's email.

## Testing
1. Go to sign-in page, click "Forgot password?"
2. Enter email, submit
3. Check email for reset link (delivered@resend.dev in dev)
4. Click link, set new password
5. Sign in with new password
6. Verify old password no longer works

## Security Notes
- Passwords must be at least 8 characters
- Token expires in 1 hour (not 24h like email verification)
- Token is single-use (deleted after password reset)
