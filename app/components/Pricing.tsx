"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground text-lg">Start free, upgrade when you need more</p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              isYearly ? "bg-blue-500" : "bg-secondary"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                isYearly ? "translate-x-6" : ""
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
            Yearly <span className="text-green-500 text-xs">(-33%)</span>
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free */}
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-4">Free</h3>
            <div className="mb-6">
              <span className="text-5xl font-extrabold">$0</span>
              <span className="text-muted-foreground ml-2">forever</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "50 items",
                "3 collections",
                "Basic search",
                "Image uploads",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-muted-foreground">
                  <svg
                    className="w-5 h-5 text-green-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
              <li className="flex items-center gap-3 text-muted-foreground/50">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>No AI features</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>

          {/* Pro */}
          <div className="bg-card border-2 border-blue-500 rounded-3xl p-8 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
              Most Popular
            </span>
            <h3 className="text-xl font-semibold mb-4">Pro</h3>
            <div className="mb-6">
              <span className="text-5xl font-extrabold">{isYearly ? "$72" : "$8"}</span>
              <span className="text-muted-foreground ml-2">{isYearly ? "/year" : "/month"}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                <strong key="unlimited">Unlimited</strong>,
                <strong key="collections">Unlimited</strong>,
                "Full-text search",
                "File uploads",
                "AI features",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-muted-foreground">
                  <svg
                    className="w-5 h-5 text-green-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>{item} {i === 0 ? "items" : ""}{i === 1 ? "collections" : ""}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full" asChild>
              <Link href="/register">Upgrade to Pro</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
