"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInAction } from "./sign-in-actions";

interface SignInFormProps {
  callbackUrl: string;
}

export function SignInForm({ callbackUrl }: SignInFormProps) {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isRegistering) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }

      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Registration failed");
          return;
        }

        setSuccess("Account created! You can now sign in with your credentials.");
        setIsRegistering(false);
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      } catch {
        setError("Something went wrong");
      }
    } else {
      const result = await signInAction(formData.email, formData.password, callbackUrl);
      if (result?.error) {
        setError(result.error);
      } else {
        // Redirect on success
        window.location.href = callbackUrl;
      }
    }
  }

  async function handleGitHubSignIn() {
    await signInAction(undefined, undefined, callbackUrl, "github");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-border p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            {isRegistering ? "Create an account" : "Sign in to DevStash"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isRegistering
              ? "Start your developer knowledge hub"
              : "Access your developer knowledge hub"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          {isRegistering && (
            <input
              type="password"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-500">{success}</p>}

          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {isRegistering ? "Create account" : "Sign in"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGitHubSignIn}
          className="flex w-full items-center justify-center gap-3 rounded-md bg-[#24292e] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2f363d]"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          Continue with GitHub
        </button>

        <p className="text-center text-sm text-muted-foreground">
          {isRegistering ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setError("");
                  setSuccess("");
                }}
                className="text-primary hover:underline"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(true);
                  setError("");
                  setSuccess("");
                }}
                className="text-primary hover:underline"
              >
                Register
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
