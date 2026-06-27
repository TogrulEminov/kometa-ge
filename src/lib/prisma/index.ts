import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@/generated/prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

const createPrismaClient = () => {
  const connectionString =
    process.env.DATABASE_URL_POOL || process.env.DATABASE_URL;
  const pool = new Pool({
    connectionString,
    max: isBuildPhase ? 15 : process.env.NODE_ENV === "production" ? 5 : 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: isBuildPhase ? 30000 : 10000,
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
  });
};

export const db = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// Graceful shutdown
if (typeof window === "undefined") {
  process.on("beforeExit", async () => {
    await db.$disconnect();
  });
}
