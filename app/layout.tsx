import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Lone Oak Home Improvement Co. | Lawn Care & House Washing — Killeen, TX",
  description:
    "Weekly, bi-weekly, and monthly lawn care plus house washing serving Killeen, Pflugerville, and Temple, TX.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Lone Oak Home Improvement Co.",
    description:
      "Lawn care and house washing serving Killeen, Pflugerville, and Temple, TX.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} font-body bg-bone text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
