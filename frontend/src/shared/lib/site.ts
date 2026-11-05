import type { Metadata, Viewport } from "next";

/** Public origin for canonical URLs, sitemap and Open Graph. Vercel sets the production domain at build time. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3001");

/** Shared by every root layout; pages add the translated title, description and Open Graph text. */
export const BASE_METADATA: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "TradeFlow", template: "%s · TradeFlow" },
  applicationName: "TradeFlow",
  twitter: { card: "summary_large_image" },
};

export const VIEWPORT: Viewport = { themeColor: "#32536b" };
