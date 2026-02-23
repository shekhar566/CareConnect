import type { NextAuthConfig } from "next-auth";

// This file contains NO database logic, Mongoose, or bcrypt.
// It is 100% safe for the Edge Runtime.
export const authConfig = {
  providers: [],
} satisfies NextAuthConfig;
