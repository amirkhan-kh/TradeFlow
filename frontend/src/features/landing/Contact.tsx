import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { Aurora } from "@/shared/ui/Aurora";
import { DemoForm } from "./DemoForm";
import { Fx } from "./Fx";
import { ZoomIn } from "./ZoomIn";

export function Contact() {
  return (
    <section id="demo" className="relative isolate scroll-mt-24 py-20 sm:py-28">
      <Fx variant="beams" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ZoomIn
          from={0.84}
          className="glass grid overflow-hidden rounded-3xl p-2 shadow-[0_50px_120px_-40px_rgb(15_34_54/0.45)] sm:p-3 lg:grid-cols-[1fr_1.1fr]"
        >
          <div className="relative overflow-hidden rounded-2xl bg-[#0e1c2b] p-8 text-white sm:p-12">
            <Image src="/landing/photo-team.webp" alt="" fill sizes="(min-width: 1024px) 40rem, 100vw" className="object-cover opacity-25 mix-blend-luminosity" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#0e1c2b]/60 via-[#0e1c2b]/80 to-[#0e1c2b]" />
            <Aurora dark />
            <div className="relative">
              <p className="glass-dark inline-flex rounded-full px-3.5 py-1.5 text-xs font-bold text-[#cfe3ef]">Bepul demo</p>
              <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.035em] sm:text-5xl sm:leading-[1.05]">
                Onlayn namoyishga <span className="text-aurora-dark">yoziling</span>
              </h2>
              <p className="mt-5 text-white/70">30 daqiqalik bepul namoyishda tizim imkoniyatlarini ko&apos;rsatamiz va biznesingizga mos yechimni taklif qilamiz.</p>
              <ul className="mt-10 space-y-3 text-sm">
                {[
                  [Phone, <a key="p" href="tel:+998555000305">+998 55 500 03 05</a>],
                  [Mail, <a key="m" href="mailto:info@tradeflow.uz">info@tradeflow.uz</a>],
                  [MapPin, "Toshkent sh., Yunusobod tumani"],
                  [Clock, "Du–Sha, 09:00–19:00"],
                ].map(([Icon, content], i) => {
                  const I = Icon as typeof Phone;
                  return (
                    <li key={i} className="glass-dark flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-white/[0.08]">
                      <I className="size-5 text-[#9cc3dc]" /> {content as React.ReactNode}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="p-6 sm:p-12">
            <h3 className="mb-6 text-2xl font-bold tracking-tight text-ink-900">Formani to&apos;ldiring</h3>
            <DemoForm />
          </div>
        </ZoomIn>
      </div>
    </section>
  );
}
