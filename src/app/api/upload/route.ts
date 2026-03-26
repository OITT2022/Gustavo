import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !apiKey || !uploadPreset) {
    return NextResponse.json(
      { error: "Cloudinary not configured" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    cloudName,
    apiKey,
    uploadPreset,
    timestamp: Math.round(Date.now() / 1000),
  });
}
