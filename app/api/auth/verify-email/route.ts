import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/verify-email/error", request.url));
  }

  try {
    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.redirect(new URL("/verify-email/error", request.url));
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      return NextResponse.redirect(new URL("/verify-email/expired", request.url));
    }

    // Find user by email (identifier)
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return NextResponse.redirect(new URL("/verify-email/error", request.url));
    }

    // Update user's emailVerified
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    // Delete the used token
    await prisma.verificationToken.delete({
      where: { token },
    });

    // Redirect to success page with email
    const successUrl = new URL("/verify-email/success", request.url);
    successUrl.searchParams.set("email", user.email);
    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(new URL("/verify-email/error", request.url));
  }
}
