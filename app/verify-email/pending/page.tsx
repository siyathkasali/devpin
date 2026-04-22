import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

export default async function VerifyEmailPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-border p-8 text-center shadow-sm">
        <div className="flex justify-center">
          <div className="rounded-full bg-blue-100 p-3">
            <Mail className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We&apos;ve sent a verification link to{" "}
            <strong>{email || "your email address"}</strong>
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          Click the link in the email to verify your account. If you don&apos;t see it, check your spam folder.
        </p>

        <p className="text-xs text-muted-foreground">
          The verification link expires in 24 hours.
        </p>

        <Link
          href="/sign-in"
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
