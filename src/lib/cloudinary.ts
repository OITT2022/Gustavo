export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
    crop?: string;
  } = {}
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return publicId;

  const transforms: string[] = [];
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  if (options.quality) transforms.push(`q_${options.quality}`);
  if (options.format) transforms.push(`f_${options.format}`);

  const transformStr = transforms.length > 0 ? transforms.join(",") + "/" : "";
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformStr}${publicId}`;
}

export async function getUploadSignature(): Promise<{
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  uploadPreset: string;
}> {
  const res = await fetch("/api/upload", { method: "POST" });
  if (!res.ok) throw new Error("Failed to get upload signature");
  return res.json();
}
