import { getLang } from "@/shared/i18n/server";
import { BASE_METADATA, VIEWPORT } from "@/shared/lib/site";
import { Document } from "@/shared/ui/Document";
import "../globals.css";

export const metadata = BASE_METADATA;
export const viewport = VIEWPORT;

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  return <Document lang={await getLang()}>{children}</Document>;
}
