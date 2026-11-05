import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SITE_URL } from "@/shared/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TradeFlow — savdo, ombor va yetkazib berishni boshqarish tizimi",
    template: "%s · TradeFlow",
  },
  description:
    "TradeFlow — distribyutorlar uchun CRM: buyurtmalar, omborlar, audit, yetkazib berish, debitorlik va aqlli agentlar bitta platformada.",
  applicationName: "TradeFlow",
  openGraph: {
    title: "TradeFlow — ombordan savdo nuqtasigacha to'liq nazorat",
    description: "Buyurtmalar, ombor, audit, logistika va moliya — bitta tizimda.",
    type: "website",
    locale: "uz_UZ",
    url: "/",
    siteName: "TradeFlow",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#32536b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={jakarta.variable}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
