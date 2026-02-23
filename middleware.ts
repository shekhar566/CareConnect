// export { auth as middleware } from "@/auth";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// This safely bypasses auth.ts and uses the lightweight Edge config!
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
