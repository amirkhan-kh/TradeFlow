import { AlertTriangle, Clock3, FlaskConical, Pencil, RefreshCw, Send, Settings2, Trash2 } from "lucide-react";
import { fmtDate } from "@/shared/lib/format";
import { Button } from "@/shared/ui/Button";
import { brandOf, ProviderLogo } from "./ProviderLogo";
import type { Integration } from "./types";

export type ActionResult = { id: number; ok: boolean; message: string };

function Status({ i }: { i: Integration }) {
  const [label, dot, cls] = !i.active
    ? ["O'chirilgan", "bg-ink-400", "bg-ink-100 text-ink-600"]
    : i.last_error
      ? ["Xato", "bg-red-500", "bg-red-50 text-red-700"]
      : ["Faol", "bg-brand-500", "bg-brand-50 text-brand-700"];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${cls}`}>
      <span className="relative flex size-2">
        {i.active && !i.last_error && <span className={`absolute inline-flex size-full animate-ping rounded-full opacity-60 motion-reduce:hidden ${dot}`} />}
        <span className={`relative inline-flex size-2 rounded-full ${dot}`} />
      </span>
      {label}
    </span>
  );
}

function Metric({ icon: Icon, label, value, tone }: { icon: typeof Send; label: string; value: number; tone: string }) {
  return (
    <div className="rounded-xl bg-ink-50 px-3 py-2">
      <p className="flex items-center gap-1 text-[11px] font-medium text-ink-500">
        <Icon className="size-3" aria-hidden /> {label}
      </p>
      <p className={`text-lg font-extrabold tabular-nums ${value ? tone : "text-ink-300"}`}>{value}</p>
    </div>
  );
}

export function ConnectedCard({
  integration: i,
  busy,
  result,
  onAction,
  onOpen,
  onEdit,
  onRemove,
}: {
  integration: Integration;
  busy: boolean;
  result: ActionResult | null;
  onAction: (kind: "test" | "sync") => void;
  onOpen: () => void;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const color = brandOf(i.provider).color;
  return (
    <article className="card relative flex animate-rise flex-col overflow-hidden">
      <span className="absolute inset-y-0 left-0 w-1" style={{ background: color }} aria-hidden />
      <div className="flex items-start gap-3 p-5 pb-4">
        <ProviderLogo provider={i.provider} name={i.provider_info.name} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold text-ink-900">{i.name}</h3>
          <p className="truncate text-xs text-ink-500">{i.provider_info.name}</p>
        </div>
        <Status i={i} />
      </div>

      <div className="grid grid-cols-3 gap-2 px-5">
        <Metric icon={Send} label="Bugun" value={i.sent_today} tone="text-brand-700" />
        <Metric icon={Clock3} label="Navbatda" value={i.pending_jobs} tone="text-amber-600" />
        <Metric icon={AlertTriangle} label="Xato" value={i.failed_jobs} tone="text-red-600" />
      </div>

      <div className="flex-1 space-y-2 px-5 pt-3 text-xs">
        <p className="text-ink-500">{i.last_sync_at ? `Oxirgi almashinuv: ${fmtDate(i.last_sync_at, true)}` : "Hali almashinuv bo'lmagan"}</p>
        {i.last_error && <p className="line-clamp-2 rounded-lg bg-red-50 px-2.5 py-1.5 break-all text-red-700">{i.last_error}</p>}
        {result && (
          <p role="status" className={`animate-rise rounded-lg px-2.5 py-1.5 font-medium ${result.ok ? "bg-brand-50 text-brand-800" : "bg-red-50 text-red-700"}`}>
            {result.message}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-ink-100 bg-ink-50/50 px-4 py-3">
        <Button size="sm" variant="secondary" onClick={() => onAction("test")} disabled={busy}>
          <FlaskConical className="size-3.5" /> Tekshirish
        </Button>
        {i.provider_info.can_sync && (
          <Button size="sm" variant="secondary" onClick={() => onAction("sync")} disabled={busy || !i.active}>
            <RefreshCw className={`size-3.5 ${busy ? "animate-spin" : ""}`} /> Sinxronlash
          </Button>
        )}
        <Button size="sm" variant="secondary" onClick={onOpen}>
          <Settings2 className="size-3.5" /> Batafsil
        </Button>
        <span className="ml-auto flex">
          <Button size="sm" variant="ghost" onClick={onEdit} aria-label={`${i.name} — tahrirlash`}>
            <Pencil className="size-3.5" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onRemove} aria-label={`${i.name} — o'chirish`}>
            <Trash2 className="size-3.5 text-red-600" />
          </Button>
        </span>
      </div>
    </article>
  );
}
