import { ResetPasswordForm } from "./_components/reset-password-form";
import { Suspense } from "react";

function ResetPasswordFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-border p-8 text-center shadow-sm">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export default async function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
