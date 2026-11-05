import { notFound } from "next/navigation";
import { langOfSlug, LANGS, SITE_SLUGS } from "@/shared/i18n/config";
import { BASE_METADATA, VIEWPORT } from "@/shared/lib/site";
import { Document } from "@/shared/ui/Document";
import "../globals.css";

/** Public site root: one static page per language. `/` is rewritten to `/ru` by the proxy. */
export const dynamicParams = false;
export const generateStaticParams = () => LANGS.map((l) => ({ lang: SITE_SLUGS[l] }));
export const metadata = BASE_METADATA;
export const viewport = VIEWPORT;

export default async function SiteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const lang = langOfSlug((await params).lang) ?? notFound();
  return <Document lang={lang}>{children}</Document>;
}
