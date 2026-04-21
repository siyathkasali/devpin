import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  providers: [
    GitHub,
    Credentials({
      name: "credentials",
      credentials: {},
      authorize: () => null,
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
