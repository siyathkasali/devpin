"use client";

import { useState } from "react";

interface BillingSectionProps {
  isPro: boolean;
  stripeCustomerId: string | null;
  monthlyPriceId: string;
  yearlyPriceId: string;
}

export function BillingSection({ isPro, stripeCustomerId, monthlyPriceId, yearlyPriceId }: BillingSectionProps) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSubscribe(interval: "month" | "year") {
    setLoading(interval);
    try {
      const priceId = interval === "month" ? monthlyPriceId : yearlyPriceId;
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        console.error("Checkout error:", data.error);
      }
    } catch (e) {
      console.error("Checkout error:", e);
    }
    setLoading(null);
  }

  async function handleManage() {
    setLoading("manage");
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        console.error("Portal error:", data.error);
      }
    } catch (e) {
      console.error("Portal error:", e);
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
