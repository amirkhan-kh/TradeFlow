import { Reveal } from "@/shared/ui/motion";
import { Fx } from "./Fx";
import { ZoomIn } from "./ZoomIn";

export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  className = "",
  fx,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
  className?: string;
  fx?: React.ComponentProps<typeof Fx>;
}) {
  return (
    <section id={id} className={`relative isolate scroll-mt-24 py-20 sm:py-28 ${className}`}>
      {fx && <Fx {...fx} />}
      <ZoomIn className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <p className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide text-[#32536b]">
            <span className="size-1.5 rounded-full bg-brand-400 shadow-[0_0_10px_2px_rgb(61_174_127/0.5)]" />
            {eyebrow}
          </p>
          <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.035em] text-balance text-ink-900 sm:text-5xl sm:leading-[1.05]">{title}</h2>
          {lead && <p className="mt-5 text-lg text-pretty text-ink-600">{lead}</p>}
        </Reveal>
        {children}
      </ZoomIn>
    </section>
  );
}
