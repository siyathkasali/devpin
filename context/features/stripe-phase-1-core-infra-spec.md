# Stripe Integration - Phase 1: Core Infrastructure

## Status
Not Started

## Overview

Implement core Stripe infrastructure: usage limits module, Stripe lib, and server actions for subscription management. This phase does NOT require Stripe CLI for testing.

## Goals

- [ ] Create `src/lib/stripe.ts` - Stripe client instance
- [ ] Create `src/lib/usage-limits.ts` - Free tier limit checking module
- [ ] Write unit tests for usage-limits module
- [ ] Create `src/actions/stripe.ts` - Server actions for checkout and portal
- [ ] Update NextAuth JWT callback to sync `isPro` from database
- [ ] Update items/collections actions to enforce limits

## Dependencies

- Stripe account with test API keys
- Test price IDs configured in environment

## Files to Create

### 1. `src/lib/stripe.ts`

```typescript
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});
```

### 2. `src/lib/usage-limits.ts`

Module for checking free tier limits.

```typescript
import { prisma } from "@/lib/db";

const FREE_ITEM_LIMIT = 50;
const FREE_COLLECTION_LIMIT = 3;

interface LimitCheckResult {
  allowed: boolean;
  current: number;
  limit: number;
  upgradeRequired?: boolean;
}

export async function checkItemLimit(userId: string): Promise<LimitCheckResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isPro: true, _count: { select: { items: true } } },
  });

  if (user?.isPro) {
    return { allowed: true, current: user._count.items, limit: Infinity };
  }

  const current = user?._count.items ?? 0;
  const allowed = current < FREE_ITEM_LIMIT;

  return {
    allowed,
    current,
    limit: FREE_ITEM_LIMIT,
    upgradeRequired: !allowed,
  };
}

export async function checkCollectionLimit(userId: string): Promise<LimitCheckResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isPro: true, _count: { select: { collections: true } } },
  });

  if (user?.isPro) {
    return { allowed: true, current: user._count.collections, limit: Infinity };
  }

  const current = user?._count.collections ?? 0;
  const allowed = current < FREE_COLLECTION_LIMIT;

  return {
    allowed,
    current,
    limit: FREE_COLLECTION_LIMIT,
    upgradeRequired: !allowed,
  };
}
```

### 3. `src/lib/usage-limits.test.ts`

Unit tests for usage limits module.

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkItemLimit, checkCollectionLimit } from "./usage-limits";
import { prisma } from "@/lib/db";

vi.mock("@/lib/db", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

describe("checkItemLimit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows Pro users unlimited items", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      isPro: true,
      _count: { items: 100 },
    } as any);

    const result = await checkItemLimit("user-123");

    expect(result.allowed).toBe(true);
    expect(result.limit).toBe(Infinity);
    expect(result.upgradeRequired).toBeUndefined();
  });

  it("allows free users under limit", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      isPro: false,
      _count: { items: 25 },
    } as any);

    const result = await checkItemLimit("user-123");

    expect(result.allowed).toBe(true);
    expect(result.current).toBe(25);
    expect(result.limit).toBe(50);
    expect(result.upgradeRequired).toBeFalsy();
  });

  it("denies free users at limit", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      isPro: false,
      _count: { items: 50 },
    } as any);

    const result = await checkItemLimit("user-123");

    expect(result.allowed).toBe(false);
    expect(result.current).toBe(50);
    expect(result.upgradeRequired).toBe(true);
  });

  it("handles new users with no items", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      isPro: false,
      _count: { items: 0 },
    } as any);

    const result = await checkItemLimit("user-123");

    expect(result.allowed).toBe(true);
    expect(result.current).toBe(0);
  });
});

describe("checkCollectionLimit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows Pro users unlimited collections", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      isPro: true,
      _count: { collections: 10 },
    } as any);

    const result = await checkCollectionLimit("user-123");

    expect(result.allowed).toBe(true);
    expect(result.limit).toBe(Infinity);
  });

  it("allows free users under 3 collections", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      isPro: false,
      _count: { collections: 2 },
    } as any);

    const result = await checkCollectionLimit("user-123");

    expect(result.allowed).toBe(true);
    expect(result.current).toBe(2);
    expect(result.limit).toBe(3);
  });

  it("denies free users at 3 collections", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      isPro: false,
      _count: { collections: 3 },
    } as any);

    const result = await checkCollectionLimit("user-123");

    expect(result.allowed).toBe(false);
    expect(result.upgradeRequired).toBe(true);
  });
});
```

### 4. `src/actions/stripe.ts`

Server actions for Stripe billing.

```typescript
"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function createCheckoutSession(priceId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return { error: "User not found" };
  }

  let customerId = user.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id },
    });
    customerId = customer.id;

    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile?canceled=true`,
    subscription_data: {
      metadata: { userId: user.id },
    },
  });

  if (checkoutSession.url) {
    redirect(checkoutSession.url);
  }

  return { error: "Failed to create checkout session" };
}

export async function createPortalSession() {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user?.stripeCustomerId) {
    return { error: "No subscription found" };
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile`,
  });

  redirect(portalSession.url);
}
```

## Files to Modify

### 1. `src/auth.ts`

Update JWT callback to sync `isPro` from database:

```typescript
async jwt({ token, user }) {
  if (user) {
    token.sub = user.id;
  }

  // Always sync isPro from database to catch webhook updates
  if (token.sub) {
    const dbUser = await prisma.user.findUnique({
      where: { id: token.sub },
      select: { isPro: true },
    });
    token.isPro = dbUser?.isPro ?? false;
  }

  return token;
},

async session({ session, token }) {
  if (session.user) {
    session.user.id = token.sub as string;
    session.user.isPro = token.isPro as boolean;
  }
  return session;
},
```

### 2. `src/actions/items.ts`

Add limit check to `createItemAction`:

```typescript
import { checkItemLimit } from "@/lib/usage-limits";

// In createItemAction, before creating item:
const limitCheck = await checkItemLimit(session.user.id);
if (!limitCheck.allowed) {
  return { error: `Free tier limit reached (${limitCheck.current}/${limitCheck.limit} items). Upgrade to Pro for unlimited.` };
}
```

### 3. `src/actions/collections.ts`

Add limit check to `createCollectionAction`:

```typescript
import { checkCollectionLimit } from "@/lib/usage-limits";

// In createCollectionAction, before creating collection:
const limitCheck = await checkCollectionLimit(session.user.id);
if (!limitCheck.allowed) {
  return { error: `Free tier limit reached (${limitCheck.current}/${limitCheck.limit} collections). Upgrade to Pro for unlimited.` };
}
```

## Environment Variables

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_YEARLY=price_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Verification

1. Run `npm run build` - must pass
2. Run `npm run lint` - no errors
3. Run `npm test` - usage-limits tests pass

## Notes

- Phase 1 does NOT create webhook route (Phase 2)
- Phase 1 does NOT create UI components (Phase 2)
- Free tier limits enforced via server actions only
- Uses test mode Stripe keys

## History