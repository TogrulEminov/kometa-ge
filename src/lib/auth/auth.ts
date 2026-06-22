import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { db } from "../prisma";
export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: { enabled: true },
  appName: "Nextjs",
  experimental: {
    joins: true,
  },
  plugins: [
    admin({
      defaultRole: "admin",
    }),
    nextCookies(),
  ],
  user: {
    additionalFields: {
      role: {
        type: ["user", "admin", "moderator"],
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },
});