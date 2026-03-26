import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { cache } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — resolved at runtime by OpenNext, not during initial next build
import { getCloudflareContext } from "@opennextjs/cloudflare";

const globalForPrisma = globalThis as unknown as {
  localPrisma: PrismaClient | undefined;
};

export const getDb = cache(() => {
  try {
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
