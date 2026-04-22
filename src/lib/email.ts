import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// In development, send to Resend's test inbox
const isDev = process.env.NODE_ENV === "development";
const devInbox = "delivered@resend.dev";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendVerificationEmail({
  email,
  name,
  token,
}: {
  email: string;
  name: string;
  token: string;
}) {
  console.log("sendVerificationEmail called with:", { email, name, token });
  console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);

  if (!resend) {
    console.log("RESEND_API_KEY not set, skipping email send");
    console.log(`Verification URL: ${baseUrl}/api/auth/verify-email?token=${token}`);
    return;
  }

  const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;
  console.log("Sending email with Resend...");

  // In development, send to Resend's test inbox
  const recipientEmail = isDev ? devInbox : email;

  await resend.emails.send({
    from: "DevStash <onboarding@resend.dev>",
    to: recipientEmail,
    subject: "Verify your DevStash account",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">DevStash</h1>
          </div>
          <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="margin: 0 0 20px; font-size: 20px; color: #111;">Hi ${name || "there"},</h2>
            <p style="margin: 0 0 20px; color: #666;">Thanks for creating a DevStash account! Please verify your email address by clicking the button below.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyUrl}" style="display: inline-block; background: #10b981; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">Verify Email Address</a>
            </div>
            <p style="margin: 0 0 20px; color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="margin: 0 0 20px; word-break: break-all; font-size: 12px; color: #888;"><a href="${verifyUrl}" style="color: #10b981;">${verifyUrl}</a></p>
            <p style="margin: 0 0 20px; color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="margin: 0; color: #999; font-size: 12px; text-align: center;">DevStash — Store Smarter. Build Faster.</p>
          </div>
        </body>
      </html>
    `,
  });
}
