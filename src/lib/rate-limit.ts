import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "60 s"),
  analytics: true,
  prefix: "ratelimit",
});

const registerRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "60 m"),
  analytics: true,
  prefix: "ratelimit:register",
});

const loginRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
  prefix: "ratelimit:login",
});

const forgotPasswordRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "15 m"),
  analytics: true,
  prefix: "ratelimit:forgot-password",
});

const resetPasswordRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "15 m"),
  analytics: true,
  prefix: "ratelimit:reset-password",
});

const resendVerificationRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "15 m"),
  analytics: true,
  prefix: "ratelimit:resend-verification",
});

function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return "unknown";
}

async function getClientIPFromHeaders(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return "unknown";
}

async function limitRequest(
  ratelimitInstance: Ratelimit,
  ip: string
): Promise<{ success: boolean; reset: number }> {
  try {
    const result = await ratelimitInstance.limit(ip);
    return { success: result.success, reset: result.reset };
  } catch {
    // Fail open - allow request if Upstash is unavailable
    return { success: true, reset: 0 };
  }
}

export async function checkRateLimit(
  request: NextRequest
): Promise<NextResponse | null> {
  const ip = getClientIP(request);
  const { success, reset } = await limitRequest(ratelimit, ip);

  if (!success) {
    const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000 / 60));
    return NextResponse.json(
      { error: `Too many attempts. Please try again in ${retryAfter} minutes.` },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter * 60) },
      }
    );
  }

  return null;
}

export async function checkRegisterRateLimit(
  request: NextRequest
): Promise<NextResponse | null> {
  const ip = getClientIP(request);
  const { success, reset } = await limitRequest(registerRatelimit, ip);

  if (!success) {
    const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000 / 60));
    return NextResponse.json(
      { error: `Too many attempts. Please try again in ${retryAfter} minutes.` },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter * 60) },
      }
    );
  }

  return null;
}

export async function checkLoginRateLimit(
  request: NextRequest,
  email: string
): Promise<NextResponse | null> {
  const ip = getClientIP(request);
  const key = `${ip}:${email}`;
  const { success, reset } = await limitRequest(loginRatelimit, key);

  if (!success) {
    const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000 / 60));
    return NextResponse.json(
      { error: `Too many attempts. Please try again in ${retryAfter} minutes.` },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter * 60) },
      }
    );
  }

  return null;
}

export async function checkLoginRateLimitFromHeaders(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const ip = await getClientIPFromHeaders();
  const key = `${ip}:${email}`;
  const { success, reset } = await limitRequest(loginRatelimit, key);

  if (!success) {
    const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000 / 60));
    return {
      success: false,
      error: `Too many attempts. Please try again in ${retryAfter} minutes.`,
    };
  }

  return { success: true };
}

export async function checkForgotPasswordRateLimit(
  request: NextRequest
): Promise<NextResponse | null> {
  const ip = getClientIP(request);
  const { success, reset } = await limitRequest(forgotPasswordRatelimit, ip);

  if (!success) {
    const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000 / 60));
    return NextResponse.json(
      { error: `Too many attempts. Please try again in ${retryAfter} minutes.` },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter * 60) },
      }
    );
  }

  return null;
}

export async function checkResetPasswordRateLimit(
  request: NextRequest
): Promise<NextResponse | null> {
  const ip = getClientIP(request);
  const { success, reset } = await limitRequest(resetPasswordRatelimit, ip);

  if (!success) {
    const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000 / 60));
    return NextResponse.json(
      { error: `Too many attempts. Please try again in ${retryAfter} minutes.` },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter * 60) },
      }
    );
  }

  return null;
}

export async function checkResendVerificationRateLimit(
  request: NextRequest,
  email: string
): Promise<NextResponse | null> {
  const ip = getClientIP(request);
  const key = `${ip}:${email}`;
  const { success, reset } = await limitRequest(resendVerificationRatelimit, key);

  if (!success) {
    const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000 / 60));
    return NextResponse.json(
      { error: `Too many attempts. Please try again in ${retryAfter} minutes.` },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter * 60) },
      }
    );
  }

  return null;
}