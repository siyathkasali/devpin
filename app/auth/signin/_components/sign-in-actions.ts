"use server";

import { signIn } from "@/src/auth";

interface SignInResult {
  error?: string;
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
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: "Invalid email or password" };
    }

    // Redirect will happen via the returned result's redirect
    return {};
  }

  return { error: "Invalid sign-in request" };
}
