# Stripe Integration - Phase 2: Integration & UI

## Status
Not Started

## Overview

Implement webhook handling for subscription status sync, create billing UI components, and add feature gating. **Requires Stripe CLI for local testing.**

## Goals

- [ ] Create `app/api/stripe/webhook/route.ts` - Handle subscription events
- [ ] Create `app/api/stripe/checkout/route.ts` - Alternative checkout API
- [ ] Create `app/api/stripe/portal/route.ts` - Customer portal API
- [ ] Create `app/profile/_components/billing-section.tsx` - Subscription UI
- [ ] Update `app/profile/_components/profile-page.tsx` to include billing
- [ ] Test webhook with Stripe CLI

## Prerequisites

- Phase 1 complete (core infrastructure, usage-limits, stripe lib)
- Stripe CLI installed (`brew install stripe/stripe-cli/stripe`)
- Stripe account logged in (`stripe login`)
- Webhook forwarding running (`stripe listen --forward-to localhost:3000/api/stripe/webhook`)

## Files to Create

### 1. `app/api/stripe/webhook/route.ts`

Handles Stripe webhook events to sync subscription status.

```typescript
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

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
    console.error("Webhook signature verification failed:", err);
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

    case "checkout.session.completed": {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      if (checkoutSession.mode === "subscription" && checkoutSession.customer) {
        // Ensure user has stripeCustomerId set
        await prisma.user.updateMany({
          where: { email: checkoutSession.customer_email ?? undefined },
          data: {
            stripeCustomerId: checkoutSession.customer as string,
          },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

### 2. `app/api/stripe/checkout/route.ts`

Alternative API route for creating checkout sessions (server actions use redirect, this returns URL).

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

  const { priceId } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
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

  return NextResponse.json({ url: checkoutSession.url });
}
```

### 3. `app/api/stripe/portal/route.ts`

Opens Stripe customer portal for subscription management.

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

### 4. `app/profile/_components/billing-section.tsx`

Billing UI component for profile page.

```typescript
"use client";

import { useState } from "react";
import { createCheckoutSession, createPortalSession } from "@/actions/stripe";

const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY!;
const YEARLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY!;

interface BillingSectionProps {
  isPro: boolean;
  stripeCustomerId: string | null;
}

export function BillingSection({ isPro, stripeCustomerId }: BillingSectionProps) {
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
            You have an active Pro subscription. Manage your billing, update payment method, or cancel.
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
            Upgrade to Pro for unlimited items, collections, AI features, custom types, and export.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSubscribe("month")}
              disabled={loading === "month"}
              className="px-4 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <span className="block font-semibold">$8/month</span>
              <span className="block text-xs opacity-80">Billed monthly</span>
            </button>
            <button
              onClick={() => handleSubscribe("year")}
              disabled={loading === "year"}
              className="px-4 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors relative"
            >
              <span className="block font-semibold">$72/year</span>
              <span className="block text-xs opacity-80">Save $24/year</span>
              <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded-full">
                Best
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Files to Modify

### `app/profile/_components/profile-page.tsx`

Add BillingSection import and render it in the profile page grid.

## Stripe CLI Testing

### Start webhook forwarding

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This outputs a webhook signing secret. Set it in `.env`:

```bash
STRIPE_WEB_SECRET=whsec_...
```

### Test checkout flow

1. Create test user and sign in
2. Go to /profile
3. Click "$8/month" button
4. Complete Stripe Checkout with test card (4242 4242 4242 4242)
5. Verify redirect to /profile?success=true
6. Verify profile shows "Pro" badge

### Test webhook manually

```bash
# Simulate subscription created
stripe trigger customer.subscription.created

# Simulate subscription deleted (cancel)
stripe trigger customer.subscription.deleted
```

### Test card numbers

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Insufficient funds: `4000 0000 0000 9995`

## Environment Variables

```bash
# Already set from Phase 1:
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_YEARLY=price_...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# New for Phase 2:
STRIPE_WEB_SECRET=whsec_...  # From `stripe listen` output
```

## Verification

1. Run `npm run build` - must pass
2. Run `npm run lint` - no errors
3. Stripe CLI webhook forwarding active
4. Complete test checkout flow
5. Verify subscription status updates via webhook

## Notes

- Webhook route must use raw body parsing (can't use `next/headers`)
- Webhook signature verification is critical for security
- Test mode only - no real charges

## History