import type { Metadata } from "next";
import { Shell } from "@/features/shell/Shell";
import { I18nProvider } from "@/shared/i18n/I18nProvider";
import { getI18n, getLang } from "@/shared/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t("Boshqaruv paneli"), robots: { index: false } };
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider lang={await getLang()}>
      <Shell>{children}</Shell>
    </I18nProvider>
  );
}
