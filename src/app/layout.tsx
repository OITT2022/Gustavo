import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "Gustavo Bar Valenzuela — Fine Art",
    template: "%s | Gustavo Bar Valenzuela",
  },
  description:
    "Original paintings, drawings, and fine art by Gustavo Bar Valenzuela. Explore collections spanning multiple periods and styles.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Gustavo Bar Valenzuela — Fine Art",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
