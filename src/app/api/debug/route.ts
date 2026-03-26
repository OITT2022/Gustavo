import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "NOT SET";
  const masked = dbUrl === "NOT SET" ? "NOT SET" : dbUrl.replace(/:[^@]+@/, ":***@");

  try {
    const prisma = new PrismaClient();
    const count = await prisma.artwork.count();
    await prisma.$disconnect();
    return NextResponse.json({
      status: "ok",
      dbUrl: masked,
      artworkCount: count,
      hasChannelBinding: dbUrl.includes("channel_binding"),
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      status: "error",
      dbUrl: masked,
      error: msg,
      hasChannelBinding: dbUrl.includes("channel_binding"),
    }, { status: 500 });
  }
}
