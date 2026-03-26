import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  // Strip channel_binding param if present (unsupported by some Prisma versions)
  let url = process.env.DATABASE_URL || "";
  if (url.includes("channel_binding=")) {
    url = url.replace(/[?&]channel_binding=[^&]*/g, "").replace("?&", "?");
    process.env.DATABASE_URL = url;
  }
  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export function getDb(): PrismaClient {
  return prisma;
}
