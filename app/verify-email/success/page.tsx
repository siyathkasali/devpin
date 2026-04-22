import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default async function VerifyEmailSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-border p-8 text-center shadow-sm">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">Email Verified!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {email ? (
              <>
                You have successfully verified <strong>{email}</strong>
              </>
            ) : (
              "Your email has been successfully verified"
            )}
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          You can now sign in to your DevStash account.
        </p>

        <Link
          href="/sign-in"
          className="block w-full rounded-md bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Go to Sign In
        </Link>

        <p className="text-xs text-muted-foreground">
          Redirecting in a few seconds...
        </p>
      </div>
    </div>
  );
}
