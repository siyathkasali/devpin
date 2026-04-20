import { auth } from "@/src/auth";

export const proxy = auth;

export const config = {
  matcher: ["/dashboard/:path*"],
};
