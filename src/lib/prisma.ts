import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  __D1_DB?: D1Database;
};

function createPrismaClient() {
  // On Cloudflare Workers with D1 binding
  if (globalForPrisma.__D1_DB) {
    const adapter = new PrismaD1(globalForPrisma.__D1_DB);
    return new PrismaClient({ adapter } as never);
  }

  // Check for process.env (Node.js / local dev with SQLite file)
  if (typeof process !== "undefined" && process.env?.DATABASE_URL) {
    return new PrismaClient();
  }

  // Fallback
  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/** Call this to set the D1 binding before using prisma in Cloudflare Workers */
export function initPrismaD1(db: D1Database) {
  globalForPrisma.__D1_DB = db;
  // Reset cached client so next access creates one with D1
  globalForPrisma.prisma = undefined;
}
