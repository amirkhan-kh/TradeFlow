import type { Metadata } from "next";
import { Advantages } from "@/features/landing/Advantages";
import { Backdrop } from "@/features/landing/Backdrop";
import { Contact } from "@/features/landing/Contact";
import { Faq } from "@/features/landing/Faq";
import { Footer } from "@/features/landing/Footer";
import { Header } from "@/features/landing/Header";
import { Hero } from "@/features/landing/Hero";
import { Problems } from "@/features/landing/Problems";
import { ProductPreview } from "@/features/landing/ProductPreview";
import { SmartAgents } from "@/features/landing/SmartAgents";
import { SmoothScroll } from "@/features/landing/SmoothScroll";
import { Solutions } from "@/features/landing/Solutions";
import { Steps } from "@/features/landing/Steps";
import { Telegram } from "@/features/landing/Telegram";
import { MotionProvider } from "@/shared/ui/motion";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <MotionProvider>
      <Backdrop />
      <SmoothScroll />
      <Header />
      <main>
        <Hero />
        <Problems />
        <Solutions />
        <SmartAgents />
        <ProductPreview />
        <Steps />
        <Telegram />
        <Advantages />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </MotionProvider>
  );
}
