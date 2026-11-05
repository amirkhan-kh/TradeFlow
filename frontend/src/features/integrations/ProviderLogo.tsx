import { Network, PhoneCall, Webhook, type LucideIcon } from "lucide-react";
import Image from "next/image";

interface Brand {
  color: string;
  logo?: string;
  icon?: LucideIcon;
}

/** Files live in `public/logos`; generic protocols (PBX, webhook, Spot2D) use an icon on the brand color. */
const BRANDS: Record<string, Brand> = {
  payme: { color: "#00c0c9", logo: "/logos/payme.png" },
  click: { color: "#0a84ff", logo: "/logos/click.png" },
  didox: { color: "#3b1f5c", logo: "/logos/didox.png" },
  uzum_market: { color: "#7000ff", logo: "/logos/uzum_market.png" },
  onec: { color: "#e30613", logo: "/logos/onec.png" },
  moysklad: { color: "#2b6cd3", logo: "/logos/moysklad.png" },
  sap_b1: { color: "#0faaff", logo: "/logos/sap_b1.svg" },
  powerbi: { color: "#e8b100", logo: "/logos/powerbi.png" },
  google_sheets: { color: "#34a853", logo: "/logos/google_sheets.svg" },
  bitrix24: { color: "#0a6cff", logo: "/logos/bitrix24.png" },
  amocrm: { color: "#1a9fe0", logo: "/logos/amocrm.png" },
  iiko: { color: "#ef4444", logo: "/logos/iiko.png" },
  telegram: { color: "#27a7e7", logo: "/logos/telegram.png" },
  eskiz: { color: "#e6007e", logo: "/logos/eskiz.png" },
  spot2d: { color: "#2563eb", icon: Network },
  telephony: { color: "#10b981", icon: PhoneCall },
  webhook: { color: "#f97316", icon: Webhook },
};

export const brandOf = (key: string): Brand => BRANDS[key] ?? { color: "#137852", icon: Webhook };

const SIZES = { sm: "size-9 rounded-xl", md: "size-12 rounded-2xl", lg: "size-14 rounded-2xl" } as const;
const IMG = { sm: 24, md: 32, lg: 38 } as const;

export function ProviderLogo({ provider, name, size = "md" }: { provider: string; name: string; size?: keyof typeof SIZES }) {
  const b = brandOf(provider);
  if (!b.logo) {
    const Icon = b.icon ?? Webhook;
    return (
      <span className={`grid shrink-0 place-items-center text-white shadow-soft ${SIZES[size]}`} style={{ background: `linear-gradient(135deg, ${b.color}, ${b.color}cc)` }} aria-hidden>
        <Icon className={size === "sm" ? "size-4" : "size-6"} />
      </span>
    );
  }
  return (
    <span className={`grid shrink-0 place-items-center bg-white shadow-soft ring-1 ring-ink-200/80 ${SIZES[size]}`}>
      <Image src={b.logo} alt={`${name} logotipi`} width={IMG[size]} height={IMG[size]} unoptimized className="rounded-lg object-contain" />
    </span>
  );
}
