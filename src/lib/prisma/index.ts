import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@/generated/prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
  var prismaPool: Pool | undefined;
}

const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

function getPoolMax() {
  if (isBuildPhase) {
    return Number(process.env.PRISMA_POOL_MAX_BUILD ?? 1);
  }

  if (process.env.NODE_ENV === "production") {
    return Number(process.env.PRISMA_POOL_MAX ?? 3);
  }

  return Number(process.env.PRISMA_POOL_MAX ?? 10);
}

const createPrismaClient = () => {
  const connectionString =
    process.env.DATABASE_URL_POOL || process.env.DATABASE_URL;

  const pool =
    globalThis.prismaPool ??
    new Pool({
      connectionString,
      max: getPoolMax(),
      min: 0,
      idleTimeoutMillis: isBuildPhase ? 5_000 : 30_000,
      connectionTimeoutMillis: isBuildPhase ? 30_000 : 10_000,
      allowExitOnIdle: isBuildPhase,
    });

  if (!globalThis.prismaPool) {
    globalThis.prismaPool = pool;
  }

  const adapter = new PrismaPg(pool);

  return new PrismaClient({ adapter });
};

export const db = globalThis.prisma ?? createPrismaClient();

if (!globalThis.prisma) {
  globalThis.prisma = db;
}

if (typeof window === "undefined") {
  process.on("beforeExit", async () => {
    await db.$disconnect();
    await globalThis.prismaPool?.end();
  });
}
