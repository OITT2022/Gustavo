import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { cache } from "react";

const globalForPrisma = globalThis as unknown as {
  localPrisma: PrismaClient | undefined;
};

export const getDb = cache(() => {
  try {
    // In Cloudflare Workers, the D1 binding is available via getCloudflareContext
    // webpackIgnore prevents webpack from trying to bundle/resolve this module
    const { getCloudflareContext } =
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require(/* webpackIgnore: true */ "@opennextjs/cloudflare");
    const { env } = getCloudflareContext();
    if (env?.DB) {
      const adapter = new PrismaD1(env.DB as D1Database);
      return new PrismaClient({ adapter } as never);
    }
  } catch {
    // Not in Cloudflare Workers — use local SQLite
  }

  if (!globalForPrisma.localPrisma) {
    globalForPrisma.localPrisma = new PrismaClient();
  }
  return globalForPrisma.localPrisma;
});
