import { Reveal } from "@/shared/ui/motion";

export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  className = "",
}: {
  id?: string;
  eyebrow: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative scroll-mt-24 py-24 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-200/70 bg-brand-50/70 px-3 py-1 text-xs font-bold tracking-wide text-brand-700">
            <span className="size-1.5 rounded-full bg-brand-500" />
            {eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-[2.75rem] sm:leading-[1.1]">{title}</h2>
          {lead && <p className="mt-4 text-lg text-ink-600">{lead}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
