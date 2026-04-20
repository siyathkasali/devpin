"use server";

import { signIn } from "@/src/auth";
import { redirect } from "next/navigation";

interface SignInResult {
  error?: string;
}

export async function signInAction(
  email?: string,
  password?: string,
  callbackUrl?: string,
  provider?: "github" | "credentials"
): Promise<SignInResult> {
  try {
    if (provider === "github") {
      await signIn("github", { redirectTo: callbackUrl || "/dashboard" });
    } else if (provider === "credentials" || (email && password)) {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        return { error: "Invalid email or password" };
      }

      redirect(callbackUrl || "/dashboard");
    }

    return {};
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }
    return { error: "Something went wrong" };
  }
}
