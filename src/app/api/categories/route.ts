import { NextResponse } from "next/server";
import { getDb } from "@/lib/prisma";

export async function GET() {
  const categories = await (await getDb()).category.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(categories);
}
