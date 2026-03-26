export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Artist Gallery";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const ARTWORK_STATUSES = [
  { value: "AVAILABLE", label: "Available" },
  { value: "SOLD", label: "Sold" },
  { value: "RESERVED", label: "Reserved" },
  { value: "HIDDEN", label: "Hidden" },
] as const;

export const CATEGORY_TYPES = [
  { value: "PERIOD", label: "Period" },
  { value: "DRAWINGS", label: "Drawings" },
  { value: "COMMISSIONS", label: "Commissions" },
  { value: "SALE", label: "Sale" },
  { value: "GENERAL", label: "General" },
] as const;

export const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "ILS", label: "ILS (₪)" },
] as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/for-sale", label: "For Sale" },
  { href: "/contact", label: "Contact" },
] as const;

export const ITEMS_PER_PAGE = 12;
