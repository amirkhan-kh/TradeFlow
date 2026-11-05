import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Advantages } from "@/features/landing/Advantages";
import { Backdrop } from "@/features/landing/Backdrop";
import { Contact } from "@/features/landing/Contact";
import { siteCopy, siteT } from "@/features/landing/copy";
import { Faq } from "@/features/landing/Faq";
import { Footer } from "@/features/landing/Footer";
import { Header } from "@/features/landing/Header";
import { Hero } from "@/features/landing/Hero";
import { Problems } from "@/features/landing/Problems";
import { ProductPreview } from "@/features/landing/ProductPreview";
import { SiteCopyProvider } from "@/features/landing/SiteCopy";
import { SmartAgents } from "@/features/landing/SmartAgents";
import { SmoothScroll } from "@/features/landing/SmoothScroll";
import { Solutions } from "@/features/landing/Solutions";
import { Steps } from "@/features/landing/Steps";
import { Telegram } from "@/features/landing/Telegram";
import { DEFAULT_LANG, langOfSlug, LANGS, OG_LOCALES, sitePath } from "@/shared/i18n/config";
import { MotionProvider } from "@/shared/ui/motion";

type Props = { params: Promise<{ lang: string }> };

const langFrom = async ({ params }: Props) => langOfSlug((await params).lang) ?? notFound();

export async function generateMetadata(props: Props): Promise<Metadata> {
  const lang = await langFrom(props);
  const t = siteT(lang);
  return {
    title: { absolute: t("TradeFlow — savdo, ombor va yetkazib berishni boshqarish tizimi") },
    description: t("TradeFlow — distribyutorlar uchun CRM: buyurtmalar, omborlar, audit, yetkazib berish, debitorlik va aqlli agentlar bitta platformada."),
    alternates: {
      canonical: sitePath(lang),
      languages: { ...Object.fromEntries(LANGS.map((l) => [l, sitePath(l)])), "x-default": sitePath(DEFAULT_LANG) },
    },
    openGraph: {
      title: t("TradeFlow — ombordan savdo nuqtasigacha to'liq nazorat"),
      description: t("Buyurtmalar, ombor, audit, logistika va moliya — bitta tizimda."),
      type: "website",
      locale: OG_LOCALES[lang],
      alternateLocale: [...new Set(LANGS.map((l) => OG_LOCALES[l]))].filter((l) => l !== OG_LOCALES[lang]),
      url: sitePath(lang),
      siteName: "TradeFlow",
    },
  };
}

export default async function HomePage(props: Props) {
  const lang = await langFrom(props);
  return (
    <SiteCopyProvider lang={lang} copy={siteCopy(lang)}>
      <MotionProvider>
        <Backdrop />
        <SmoothScroll />
        <Header />
        <main>
          <Hero />
          <Problems lang={lang} />
          <Solutions lang={lang} />
          <SmartAgents />
          <ProductPreview />
          <Steps />
          <Telegram />
          <Advantages lang={lang} />
          <Faq />
          <Contact lang={lang} />
        </main>
        <Footer lang={lang} />
      </MotionProvider>
    </SiteCopyProvider>
  );
}
