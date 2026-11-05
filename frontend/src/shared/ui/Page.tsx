import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  tone = "brand",
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon: LucideIcon;
  trend?: number | null;
  tone?: "brand" | "navy" | "amber" | "red";
}) {
  const toneCls = {
    brand: "bg-brand-50 text-brand-600",
    navy: "bg-sky-50 text-navy-700",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  }[tone];
  return (
    <div className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-ink-500">{label}</p>
        <span className={`grid size-9 place-items-center rounded-xl ${toneCls}`}>
          <Icon className="size-[18px]" />
        </span>
      </div>
      <p className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900 tabular-nums">{value}</p>
      <div className="mt-1 flex items-center gap-2 text-xs text-ink-500">
        {trend !== undefined && trend !== null && (
          <span className={`rounded-md px-1.5 py-0.5 font-bold ${trend >= 0 ? "bg-brand-50 text-brand-700" : "bg-red-50 text-red-600"}`}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend).toFixed(1)}%
          </span>
        )}
        {hint}
      </div>
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Qidirish…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="relative block w-full sm:w-72">
      <span className="sr-only">{placeholder}</span>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input pl-9" />
    </label>
  );
}

export function Chips<T extends string>({
  options,
  value,
  onChange,
  counts,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  counts?: Record<string, number>;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 rounded-xl bg-ink-100/70 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
            value === o.value ? "bg-white text-brand-700 shadow-soft" : "text-ink-600 hover:text-ink-900"
          }`}
        >
          {o.label}
          {counts?.[o.value] !== undefined && <span className="ml-1.5 text-ink-400">{counts[o.value]}</span>}
        </button>
      ))}
    </div>
  );
}

export function Pagination({
  page,
  limit,
  total,
  onChange,
}: {
  page: number;
  limit: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / limit));
  return (
    <div className="flex items-center justify-between border-t border-ink-100 px-5 py-3 text-sm text-ink-500">
      <span>
        Jami <b className="text-ink-800">{total}</b> ta
      </span>
      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="rounded-lg p-1.5 hover:bg-ink-100 disabled:opacity-40"
          aria-label="Oldingi sahifa"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="px-2 tabular-nums">
          {page} / {pages}
        </span>
        <button
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
          className="rounded-lg p-1.5 hover:bg-ink-100 disabled:opacity-40"
          aria-label="Keyingi sahifa"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function Table({ head, children }: { head: React.ReactNode[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ink-100 bg-ink-50/60 text-xs font-semibold tracking-wide text-ink-500 uppercase">
            {head.map((h, i) => (
              <th key={i} className="px-5 py-3 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100 [&_td]:px-5 [&_td]:py-3.5 [&_tr]:transition-colors [&_tr:hover]:bg-brand-50/40">
          {children}
        </tbody>
      </table>
    </div>
  );
}
