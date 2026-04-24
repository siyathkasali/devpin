# Stripe Integration Plan

## Overview

Implement Stripe subscription billing for DevStash Pro ($8/mo monthly, $72/year annual).

---

## Current State

| Component | Status |
|-----------|--------|
| User model | Has `isPro`, `stripeCustomerId`, `stripeSubscriptionId` |
| NextAuth | JWT strategy, needs `isPro` sync in jwt callback |
| Free tier limits | Defined in Pricing UI, NOT enforced in DB |
| Billing UI | Does not exist |
| Stripe env vars | Partially configured (secret key empty, webhook secret may be malformed) |
| Price IDs | Monthly: `price_1TPhkVFiYvq6huCcIUk2xAZY`, Annual: `price_1TPhl0FiYvq6huCcvwhUVQ9l` |

---

## Implementation Order

1. Fix Stripe env vars
2. Update NextAuth JWT callback to sync `isPro`
3. Create Stripe API routes (webhook, checkout, portal)
4. Create server actions for billing
5. Add free tier limit enforcement
6. Add billing section to profile page
7. Test checkout flow
8. Test webhook (subscription updates)

---

## Files to Create

### 1. `app/api/stripe/webhook/route.ts`

Handles Stripe webhooks to update subscription status.

```typescript
"use server";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEB_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
          stripeSubscriptionId: subscription.id,
          isPro: subscription.status === "active" || subscription.status === "trialing",
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
          stripeSubscriptionId: null,
          isPro: false,
        },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

### 2. `app/api/stripe/checkout/route.ts`

Creates Stripe Checkout session for subscription.

```typescript
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { priceId, interval } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let customerId = user.stripeCustomerId;

  // Create Stripe customer if doesn't exist
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

  return NextResponse.json({ url: checkoutSession.url });
}
```

### 3. `app/api/stripe/portal/route.ts`

Opens Stripe customer portal for managing subscription.

```typescript
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: "No subscription found" }, { status: 404 });
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile`,
  });

  return NextResponse.json({ url: portalSession.url });
}
```

### 4. `src/lib/stripe.ts`

Stripe client instance.

```typescript
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});
```

### 5. `src/actions/stripe.ts`

Server actions for billing operations.

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

### 6. `app/profile/_components/billing-section.tsx`

Billing UI section for profile page.

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCheckoutSession, createPortalSession } from "@/actions/stripe";

const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY!;
const YEARLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY!;

interface BillingSectionProps {
  isPro: boolean;
  stripeCustomerId: string | null;
}

export function BillingSection({ isPro, stripeCustomerId }: BillingSectionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSubscribe(interval: "month" | "year") {
    setLoading(interval);
    try {
      await createCheckoutSession(interval === "month" ? MONTHLY_PRICE_ID : YEARLY_PRICE_ID);
    } catch (e) {
      // Redirect throws, so ignore
    }
    setLoading(null);
  }

  async function handleManage() {
    setLoading("manage");
    try {
      await createPortalSession();
    } catch (e) {
      // Redirect throws
    }
    setLoading(null);
  }

  return (
    <div className="border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Subscription</h3>
        {isPro ? (
          <span className="px-3 py-1 bg-green-500/10 text-green-500 text-sm font-medium rounded-full">
            Pro
          </span>
        ) : (
          <span className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">
            Free
          </span>
        )}
      </div>

      {isPro ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You have an active Pro subscription.
          </p>
          <button
            onClick={handleManage}
            disabled={loading === "manage"}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {loading === "manage" ? "Opening..." : "Manage Subscription"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upgrade to Pro for unlimited items, collections, AI features, and more.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => handleSubscribe("month")}
              disabled={loading === "month"}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {loading === "month" ? "Processing..." : "$8/month"}
            </button>
            <button
              onClick={() => handleSubscribe("year")}
              disabled={loading === "year"}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {loading === "year" ? "Processing..." : "$72/year"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Files to Modify

### 1. `src/auth.ts`

Add `isPro` sync to JWT callback per the research doc workaround.

**Change:** Modify `jwt` callback to always sync `isPro` from database:

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
```

Also update `session` callback to pass `isPro` to client:

```typescript
async session({ session, token }) {
  if (session.user) {
    session.user.id = token.sub as string;
    session.user.isPro = token.isPro as boolean;
  }
  return session;
},
```

### 2. `src/lib/db/items.ts`

Add free tier limit check in `createItem`.

**Add parameter:** `userId: string` (already exists in most cases)

**Add check at start of function:**
```typescript
if (!skipLimitCheck) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isPro: true, _count: { select: { items: true } } },
  });

  if (!user?.isPro && user?._count.items >= 50) {
    throw new Error("Free tier limit reached. Upgrade to Pro for unlimited items.");
  }
}
```

### 3. `src/lib/db/collections.ts`

Add free tier limit check in `createCollection`.

**Add check:**
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { isPro: true, _count: { select: { collections: true } } },
});

if (!user?.isPro && user?._count.collections >= 3) {
  throw new Error("Free tier limit reached. Upgrade to Pro for unlimited collections.");
}
```

### 4. `src/actions/items.ts`

Update `createItemAction` to pass user for limit checking.

### 5. `src/actions/collections.ts`

Update `createCollectionAction` similarly.

### 6. `app/profile/_components/profile-page.tsx`

Import and add `BillingSection` component.

---

## Environment Variables to Fix

```bash
# In .env, fix these:
STRIPE_SECRET_KEY=sk_test_...        # Get from Stripe Dashboard
STRIPE_WEB_SECRET=whsec_...           # Fix malformed value, get fresh from Stripe CLI
NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY=price_1TPhkVFiYvq6huCcIUk2xAZY
NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY=price_1TPhl0FiYvq6huCcvwhUVQ9l
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Stripe Dashboard Setup

1. **Get API keys:**
   - Go to https://dashboard.stripe.com/test/apikeys
   - Copy publishable key to `STRIPE_PUBLISHABLE_KEY`
   - Copy secret key to `STRIPE_SECRET_KEY`

2. **Create products:**
   - Go to https://dashboard.stripe.com/test/products
   - Create "DevStash Pro Monthly" at $8/month
   - Create "DevStash Pro Yearly" at $72/year
   - Copy Price IDs to env vars

3. **Setup webhook:**
   - Go to https://dashboard.stripe.com/test/webhooks
   - Add endpoint: `https://your-domain/api/stripe/webhook`
   - Select events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy webhook signing secret to `STRIPE_WEB_SECRET`

4. **For local development:**
   - Run `stripe listen --forward-to localhost:3000/api/stripe/webhook`
   - Copy the webhook secret from output

---

## Testing Checklist

- [ ] Register new user
- [ ] Check profile shows Free tier
- [ ] Click $8/month button → Stripe Checkout opens
- [ ] Complete test payment
- [ ] Profile shows Pro status after redirect
- [ ] Item creation still works
- [ ] Create 51st item as free user → error shown
- [ ] Create 4th collection as free user → error shown
- [ ] Simulate webhook with Stripe CLI: `stripe trigger customer.subscription.deleted`
- [ ] User downgraded to Free after webhook
- [ ] Click "Manage Subscription" → Stripe portal opens
- [ ] Cancel subscription in portal
- [ ] User becomes Free after webhook

---

## Implementation Priority

1. **Phase 1 - Core billing:**
   - Fix env vars
   - Create Stripe lib
   - Create API routes (checkout, portal, webhook)
   - Update NextAuth JWT callback

2. **Phase 2 - UI:**
   - Create BillingSection component
   - Add to profile page

3. **Phase 3 - Limit enforcement:**
   - Add limit checks to createItem
   - Add limit checks to createCollection
   - Wire up server actions

4. **Phase 4 - Testing:**
   - Full checkout flow test
   - Webhook test
   - Limit enforcement test