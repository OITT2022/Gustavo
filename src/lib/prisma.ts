import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // On Cloudflare Workers, use D1 adapter
  if (typeof process === "undefined" || !process.env.DATABASE_URL) {
    // Will be initialized per-request with D1 binding in Cloudflare
    // For now return standard client (build time / static pages)
    return new PrismaClient();
  }
  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
