import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/src/lib/db";
import { sendPasswordResetEmail } from "@/src/lib/email";
import { checkForgotPasswordRateLimit } from "@/src/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await checkForgotPasswordRateLimit(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    // But only send email if user exists
    if (user) {
      // Create reset token (1 hour expiry)
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Delete any existing tokens for this user
      await prisma.verificationToken.deleteMany({
        where: { identifier: email },
      });

      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      });

      // Send reset email
      try {
        await sendPasswordResetEmail({ email, name: user.name || "", token });
      } catch (emailError) {
        console.error("Failed to send password reset email:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
