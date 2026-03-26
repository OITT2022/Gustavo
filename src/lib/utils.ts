import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slugifyLib from "slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return slugifyLib(text, { lower: true, strict: true });
}

export function formatPrice(price: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getDimensionsDisplay(artwork: {
  width?: number | null;
  height?: number | null;
  depth?: number | null;
  unit?: string | null;
  dimensionsText?: string | null;
}): string | null {
  if (artwork.dimensionsText) return artwork.dimensionsText;
  if (!artwork.width || !artwork.height) return null;
  const unit = artwork.unit || "cm";
  const parts = [artwork.width, artwork.height];
  if (artwork.depth) parts.push(artwork.depth);
  return parts.join(" × ") + " " + unit;
}
