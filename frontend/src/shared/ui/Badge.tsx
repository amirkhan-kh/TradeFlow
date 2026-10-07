import { statusOf, type Tone } from "@/shared/lib/status";

const tones: Record<Tone, string> = {
  green: "bg-brand-50 text-brand-700 ring-brand-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  red: "bg-red-50 text-red-700 ring-red-200",
  blue: "bg-sky-50 text-sky-700 ring-sky-200",
  gray: "bg-ink-100 text-ink-600 ring-ink-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-200",
};
const dots: Record<Tone, string> = {
  green: "bg-brand-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  blue: "bg-sky-500",
  gray: "bg-ink-400",
  violet: "bg-violet-500",
};

export function Badge({ tone = "gray", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}>
      <span className={`size-1.5 rounded-full ${dots[tone]}`} />
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const s = statusOf(status);
  return <Badge tone={s.tone}>{s.label}</Badge>;
}
