import type { Metadata } from "next";
import { Shell } from "@/features/shell/Shell";
import { I18nProvider } from "@/shared/i18n/I18nProvider";
import { getI18n, getLang } from "@/shared/i18n/server";
import { BASE_METADATA, VIEWPORT } from "@/shared/lib/site";
import { Document } from "@/shared/ui/Document";
import "../globals.css";

export const viewport = VIEWPORT;

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { ...BASE_METADATA, title: { default: `${t("Boshqaruv paneli")} · TradeFlow`, template: "%s · TradeFlow" }, robots: { index: false } };
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <Document lang={lang}>
      <I18nProvider lang={lang}>
        <Shell>{children}</Shell>
      </I18nProvider>
    </Document>
  );
}
