import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

const globalForPrisma = globalThis as unknown as {
  localPrisma: PrismaClient | undefined;
};

/**
 * Get a Prisma client that works in both environments:
 * - Cloudflare Workers: uses D1 adapter via getCloudflareContext()
 * - Local dev (Node.js): uses SQLite file via DATABASE_URL
 */
export async function getDb(): Promise<PrismaClient> {
  // Try Cloudflare Workers D1 via dynamic import (may not exist at build time)
  try {
    // @ts-expect-error - module only available at runtime in Cloudflare Workers
    const mod = await import("@opennextjs/cloudflare");
    const { env } = await mod.getCloudflareContext();
    const db = (env as Record<string, unknown>).DB as D1Database;
    if (db) {
      const adapter = new PrismaD1(db);
      return new PrismaClient({ adapter } as never);
    }
  } catch {
    // Not in Cloudflare Workers — fall through to local SQLite
  }

  // Local dev with SQLite file
  if (!globalForPrisma.localPrisma) {
    globalForPrisma.localPrisma = new PrismaClient();
  }
  return globalForPrisma.localPrisma;
}
