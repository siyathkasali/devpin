"use server";

import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/db";
import { stripe } from "@/src/lib/stripe";

export async function createCheckoutSession(priceId: string) {
  try {
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
      return { url: checkoutSession.url };
    }

    return { error: "Failed to create checkout session" };
  } catch (err) {
    console.error("Stripe error:", err);
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
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

  if (portalSession.url) {
    return { url: portalSession.url };
  }

  return { error: "Failed to create portal session" };
}