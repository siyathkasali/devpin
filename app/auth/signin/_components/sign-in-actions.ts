"use server";

import { signIn } from "@/src/auth";

interface SignInResult {
  error?: string;
  needsVerification?: boolean;
}

export async function signInAction(
  email?: string,
  password?: string,
  callbackUrl?: string,
  provider?: "github" | "credentials"
): Promise<SignInResult> {
  if (provider === "github") {
    await signIn("github", { redirectTo: callbackUrl || "/dashboard" });
    return {};
  }

  if (email && password) {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        return { error: "Invalid email or password" };
      }

      return {};
    } catch (error) {
      return { error: "Invalid email or password" };
    }
  }

  return { error: "Invalid sign-in request" };
}
