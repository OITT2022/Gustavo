import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { cache } from "react";

const globalForPrisma = globalThis as unknown as {
  localPrisma: PrismaClient | undefined;
};

/**
 * Get Prisma client for Cloudflare Workers (synchronous, request-scoped via React cache).
 * Uses D1 binding from getCloudflareContext().
 */
export const getDb = cache(() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    const { env } = getCloudflareContext();
    const adapter = new PrismaD1((env as Record<string, D1Database>).DB);
    return new PrismaClient({ adapter } as never);
  } catch {
    // Not in Cloudflare Workers — use local SQLite
    if (!globalForPrisma.localPrisma) {
      globalForPrisma.localPrisma = new PrismaClient();
    }
    return globalForPrisma.localPrisma;
  }
});
