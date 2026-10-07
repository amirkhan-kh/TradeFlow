"use client";

import { BadgeCheck, Boxes, ChevronLeft, ClipboardCheck, HandCoins, Save, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/shared/lib/api";
import { fmtDate, fmtMoney, fmtNum } from "@/shared/lib/format";
import { useApi } from "@/shared/lib/useApi";
import { StatusBadge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { KpiCard, SearchInput, Table } from "@/shared/ui/Page";
import { Alert, ErrorState, Loading } from "@/shared/ui/States";
import type { AuditSummary } from "./AuditsList";

interface AuditFull extends AuditSummary {
  items: { id: number; product_id: number; product_name: string; sku: string; unit: string; cost: number; expected: number; counted: number | null }[];
}

export function AuditDetail({ id }: { id: string }) {
  const { data: a, error, loading, reload } = useApi<AuditFull>(`/audits/${id}`);
  const [counts, setCounts] = useState<Record<number, string>>({});
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string }>();

  useEffect(() => {
    if (a) setCounts(Object.fromEntries(a.items.map((i) => [i.product_id, i.counted === null ? "" : String(i.counted)])));
  }, [a]);

  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (loading && !a) return <Loading />;
  if (!a) return null;

  const editable = a.status === "in_progress";
  const rows = a.items.filter((i) => !q || i.product_name.toLowerCase().includes(q.toLowerCase()) || i.sku.toLowerCase().includes(q.toLowerCase()));
  const diffOf = (i: AuditFull["items"][number]) => (counts[i.product_id] === "" || counts[i.product_id] === undefined ? null : Number(counts[i.product_id]) - i.expected);
  const variance = a.items.reduce((s, i) => s + (diffOf(i) ?? 0) * i.cost, 0);
  const mismatches = a.items.filter((i) => (diffOf(i) ?? 0) !== 0).length;
  const counted = a.items.filter((i) => diffOf(i) !== null).length;

  async function run(fn: () => Promise<unknown>, ok: string) {
    setBusy(true);
    setMsg(undefined);
    try {
      await fn();
      setMsg({ ok: true, text: ok });
      reload();
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  const save = () =>
    api(`/audits/${id}/items`, {
      method: "PUT",
      json: { items: Object.entries(counts).map(([product_id, v]) => ({ product_id: Number(product_id), counted: v === "" ? null : Number(v) })) },
    });

  return (
    <div className="animate-rise space-y-6">
      <div>
        <Link href="/dashboard/audits" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brand-700">
          <ChevronLeft className="size-4" /> Auditlar
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-extrabold text-ink-900">
            {a.number} · {a.warehouse_name}
          </h1>
          <StatusBadge status={a.status} />
          <div className="ml-auto flex flex-wrap gap-2">
            {editable && (
              <>
                <Button variant="secondary" disabled={busy} onClick={() => setCounts(Object.fromEntries(a.items.map((i) => [i.product_id, counts[i.product_id] || String(i.expected)])))}>
                  Bo&apos;shlarni kutilgan bilan to&apos;ldirish
                </Button>
                <Button variant="secondary" disabled={busy} onClick={() => run(save, "Sanoq saqlandi")}>
                  <Save className="size-4" /> Saqlash
                </Button>
                <Button disabled={busy} onClick={() => run(async () => { await save(); await api(`/audits/${id}/complete`, { method: "POST" }); }, "Audit yakunlandi va tasdiqqa yuborildi")}>
                  <ClipboardCheck className="size-4" /> Yakunlash
                </Button>
              </>
            )}
            {a.status === "completed" && (
              <Button disabled={busy} onClick={() => confirm("Tasdiqlansa, ombor qoldig'i sanoq natijasiga tenglashtiriladi. Davom etasizmi?") && run(() => api(`/audits/${id}/approve`, { method: "POST" }), "Audit tasdiqlandi, qoldiqlar tuzatildi")}>
                <BadgeCheck className="size-4" /> Tasdiqlash
              </Button>
            )}
          </div>
        </div>
        <p className="mt-1 text-sm text-ink-500">
          {a.city} · Auditor: {a.auditor_name ?? "—"} · Boshlangan: {fmtDate(a.created_at, true)}
          {a.approved_at && ` · Tasdiqlangan: ${fmtDate(a.approved_at, true)}`}
        </p>
      </div>

      {msg && (msg.ok ? <p className="rounded-xl bg-brand-50 px-4 py-2.5 text-sm font-medium text-brand-800 ring-1 ring-brand-200">✓ {msg.text}</p> : <Alert>{msg.text}</Alert>)}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Sanalgan" value={`${counted} / ${a.items.length}`} icon={Boxes} hint="pozitsiya" />
        <KpiCard label="Farqli pozitsiya" value={mismatches} icon={TriangleAlert} tone={mismatches ? "amber" : "brand"} />
        <KpiCard label="Farq summasi" value={fmtMoney(variance)} icon={HandCoins} tone={variance < 0 ? "red" : "brand"} hint="tannarx bo'yicha" />
        <KpiCard label="Holat" value={<StatusBadge status={a.status} />} icon={ClipboardCheck} tone="navy" />
      </div>

      <section className="card">
        <div className="flex items-center justify-between gap-3 border-b border-ink-100 p-4">
          <h2 className="font-bold">Sanoq varag&apos;i</h2>
          <SearchInput value={q} onChange={setQ} placeholder="Tovar qidirish…" />
        </div>
        <Table head={["Tovar", "Kutilgan", "Sanalgan", "Farq", "Farq summasi"]}>
          {rows.map((i) => {
            const d = diffOf(i);
            return (
              <tr key={i.id} className={d ? (d < 0 ? "bg-red-50/40" : "bg-brand-50/40") : ""}>
                <td>
                  <p className="font-medium text-ink-900">{i.product_name}</p>
                  <p className="text-xs text-ink-400">{i.sku}</p>
                </td>
                <td className="tabular-nums">
                  {fmtNum(i.expected)} {i.unit}
                </td>
                <td className="w-36">
                  {editable ? (
                    <input
                      type="number"
                      min={0}
                      value={counts[i.product_id] ?? ""}
                      onChange={(e) => setCounts((c) => ({ ...c, [i.product_id]: e.target.value }))}
                      className="input h-9 w-28 tabular-nums"
                      aria-label={`${i.product_name} sanog'i`}
                    />
                  ) : (
                    <span className="tabular-nums">{i.counted ?? "—"}</span>
                  )}
                </td>
                <td className={`font-bold tabular-nums ${d === null || d === 0 ? "text-ink-400" : d < 0 ? "text-red-600" : "text-brand-700"}`}>
                  {d === null ? "—" : d > 0 ? `+${d}` : d}
                </td>
                <td className={`tabular-nums ${d && d < 0 ? "text-red-600" : "text-ink-600"}`}>{d ? fmtMoney(d * i.cost) : "—"}</td>
              </tr>
            );
          })}
        </Table>
      </section>
    </div>
  );
}
