import type { MetadataRoute } from "next";
import { LANGS, sitePath } from "@/shared/i18n/config";
import { SITE_URL } from "@/shared/lib/site";

const url = (path: string) => (path === "/" ? SITE_URL : `${SITE_URL}${path}`);

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(LANGS.map((l) => [l, url(sitePath(l))]));
  return [
    ...LANGS.map((l) => ({ url: url(sitePath(l)), changeFrequency: "weekly" as const, priority: 1, alternates: { languages } })),
    { url: `${SITE_URL}/login`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
