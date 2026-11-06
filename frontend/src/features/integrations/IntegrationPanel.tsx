"use client";

import { Check, Copy, KeyRound, PhoneIncoming, PhoneMissed, PhoneOutgoing, RotateCw } from "lucide-react";
import { useState } from "react";
import { useT } from "@/shared/i18n/I18nProvider";
import { trData } from "@/shared/i18n/translate";
import { api } from "@/shared/lib/api";
import { fmtDate } from "@/shared/lib/format";
import { useApi } from "@/shared/lib/useApi";
import { StatusBadge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Empty, ErrorState, Loading } from "@/shared/ui/States";
import { inboundUrl, type Integration } from "./types";

interface Job {
  id: number;
  event: string;
  status: string;
  attempts: number;
  last_error: string | null;
  created_at: string;
  done_at: string | null;
}

interface Call {
  id: number;
  direction: "in" | "out";
  status: "answered" | "missed";
  phone: string;
  client_id: number | null;
  client_name: string | null;
  lead_name: string | null;
  duration_sec: number;
  recording_url: string | null;
  created_at: string;
}

function CopyField({ label, value, hint }: { label: string; value: string; hint?: string }) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <p className="text-xs font-semibold text-ink-600">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        <code className="min-w-0 flex-1 truncate rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-800 ring-1 ring-ink-200" title={value}>
          {value}
        </code>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-800"
          aria-label={t("{name} — nusxalash", { name: label })}
        >
          {copied ? <Check className="size-4 text-brand-600" /> : <Copy className="size-4" />}
        </button>
      </div>
      {hint && <p className="mt-1 text-[11px] break-all text-ink-500">{hint}</p>}
    </div>
  );
}

export function IntegrationPanel({ integration, eventLabels, onChanged }: { integration: Integration; eventLabels: Record<string, string>; onChanged: () => void }) {
  const t = useT();
  const p = integration.provider_info;
  const jobs = useApi<{ items: Job[] }>(p.events.length ? `/integrations/${integration.id}/jobs` : null);
  const calls = useApi<{ items: Call[] }>(p.key === "telephony" ? `/integrations/${integration.id}/calls` : null);
  const [busy, setBusy] = useState(false);

  async function rotate() {
    if (!confirm(t("Eski URL'lar ishlamay qoladi. Yangi token yaratilsinmi?"))) return;
    setBusy(true);
    await api(`/integrations/${integration.id}/token`, { method: "POST" }).finally(() => setBusy(false));
    onChanged();
  }

  async function retry(jobId: number) {
    await api(`/integrations/${integration.id}/jobs/${jobId}/retry`, { method: "POST" });
    jobs.reload();
  }

  return (
    <div className="grid gap-6">
      {p.endpoints.length > 0 && (
        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-ink-900">{t("Kiruvchi URL'lar")}</h3>
            <Button size="sm" variant="ghost" onClick={rotate} disabled={busy}>
              <KeyRound className="size-3.5" /> {t("Tokenni yangilash")}
            </Button>
          </div>
          <p className="text-xs text-ink-500">{t("URL ichidagi token — parol. Uni faqat ishonchli tizimga bering.")}</p>
          {p.endpoints.map((e) => (
            <CopyField key={e.path} label={`${e.method} · ${e.label}`} value={inboundUrl(integration.token, e.path)} hint={e.hint} />
          ))}
        </section>
      )}

      {p.events.length > 0 && (
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink-900">{t("Yuborish jurnali")}</h3>
            <Button size="sm" variant="ghost" onClick={jobs.reload} aria-label={t("Jurnalni yangilash")}>
              <RotateCw className="size-3.5" />
            </Button>
          </div>
          {jobs.error ? (
            <ErrorState message={jobs.error} onRetry={jobs.reload} />
          ) : jobs.loading && !jobs.data ? (
            <Loading />
          ) : !jobs.data?.items.length ? (
            <Empty title={t("Hali hodisa yo'q")} hint={t("Tanlangan hodisalar yuz berganda shu yerda ko'rinadi")} />
          ) : (
            <ul className="divide-y divide-ink-100 rounded-xl ring-1 ring-ink-200">
              {jobs.data.items.map((j) => (
                <li key={j.id} className="flex items-start gap-3 px-3 py-2 text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-ink-800">{eventLabels[j.event] ?? j.event}</p>
                    <p className="text-xs text-ink-500">
                      {fmtDate(j.created_at, true)} · {t("urinish: {n}", { n: j.attempts })}
                    </p>
                    {j.last_error && <p className="mt-0.5 text-xs break-all text-red-600">{j.last_error}</p>}
                  </div>
                  <StatusBadge status={j.status === "done" ? "sent" : j.status} />
                  {j.status === "failed" && (
                    <Button size="sm" variant="secondary" onClick={() => retry(j.id)}>
                      {t("Qayta yuborish")}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {p.key === "telephony" && (
        <section>
          <h3 className="mb-2 text-sm font-bold text-ink-900">{t("So'nggi qo'ng'iroqlar")}</h3>
          {calls.error ? (
            <ErrorState message={calls.error} onRetry={calls.reload} />
          ) : calls.loading && !calls.data ? (
            <Loading />
          ) : !calls.data?.items.length ? (
            <Empty title={t("Qo'ng'iroq yo'q")} hint={t("ATS webhook URL'ga so'rov yuborganda shu yerda ko'rinadi")} />
          ) : (
            <ul className="divide-y divide-ink-100 rounded-xl ring-1 ring-ink-200">
              {calls.data.items.map((c) => {
                const Icon = c.status === "missed" ? PhoneMissed : c.direction === "in" ? PhoneIncoming : PhoneOutgoing;
                return (
                  <li key={c.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                    <Icon className={`size-4 ${c.status === "missed" ? "text-red-500" : "text-brand-600"}`} aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-ink-800">
                        {c.phone} · {c.client_name ?? (c.lead_name ? t("Lid: {name}", { name: trData(c.lead_name) }) : t("Noma'lum"))}
                      </p>
                      <p className="text-xs text-ink-500">
                        {fmtDate(c.created_at, true)} · {t("{n} s", { n: c.duration_sec })}
                      </p>
                    </div>
                    <StatusBadge status={c.status} />
                    {c.recording_url && (
                      <a href={c.recording_url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-brand-700 hover:underline">
                        {t("Yozuv")}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
