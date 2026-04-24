import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-secondary/50 to-background">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Organize Your Knowledge?
        </h2>
        <p className="text-muted-foreground text-lg mb-8">
          Join thousands of developers who&apos;ve stopped losing track of their essentials.
        </p>
        <Button size="lg" asChild>
          <Link href="/register">Start Your Free Account</Link>
        </Button>
      </div>
    </section>
  );
}
