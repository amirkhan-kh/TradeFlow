"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/shared/lib/api";
import { fmtDate, fmtMoney } from "@/shared/lib/format";
import { useApi } from "@/shared/lib/useApi";
import { usePaged } from "@/shared/lib/usePaged";
import { StatusBadge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Field, Select, Textarea } from "@/shared/ui/Field";
import { Modal } from "@/shared/ui/Modal";
import { WarehouseSelect, type WarehouseOption } from "@/shared/ui/SearchSelect";
import { Chips, PageHeader, Pagination, SearchInput, Table } from "@/shared/ui/Page";
import { Alert, Empty, ErrorState, Loading } from "@/shared/ui/States";

export interface AuditSummary {
  id: number;
  number: string;
  status: string;
  note: string | null;
  created_at: string;
  completed_at: string | null;
  approved_at: string | null;
  warehouse_name: string;
  city: string;
  auditor_name: string | null;
  items_count: number;
  counted_count: number;
  mismatch_count: number;
  variance_value: number;
}

export function AuditsList() {
  const list = usePaged<AuditSummary>("/audits");
  const [open, setOpen] = useState(false);

  return (
    <div className="animate-rise">
      <PageHeader
        title="Audit"
        description="Inventarizatsiya: tizimdagi qoldiq va haqiqiy sanoq farqi. Tasdiqlangach qoldiq avtomatik tuzatiladi."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" /> Audit boshlash
          </Button>
        }
      />
      <div className="card">
        <div className="flex flex-col gap-3 border-b border-ink-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <Chips
            options={[
              { value: "", label: "Barchasi" },
              { value: "in_progress", label: "Tekshirilmoqda" },
              { value: "completed", label: "Tasdiq kutmoqda" },
              { value: "approved", label: "Tasdiqlandi" },
            ]}
            value={list.status}
            onChange={list.setStatus}
          />
          <SearchInput value={list.q} onChange={list.setQ} placeholder="Raqam yoki ombor…" />
        </div>
        {list.error ? (
          <ErrorState message={list.error} onRetry={list.reload} />
        ) : list.loading && !list.data ? (
          <Loading />
        ) : !list.data?.items.length ? (
          <Empty title="Audit topilmadi" />
        ) : (
          <>
            <Table head={["Raqam", "Ombor nomi", "Auditor", "Jarayon", "Farqlar", "Farq summasi", "Holat", "Sana"]}>
              {list.data.items.map((a) => {
                const pct = a.items_count ? (a.counted_count / a.items_count) * 100 : 0;
                return (
                  <tr key={a.id}>
                    <td>
                      <Link href={`/dashboard/audits/${a.id}`} className="font-semibold text-brand-700 hover:underline">
                        {a.number}
                      </Link>
                    </td>
                    <td>
                      <p className="font-medium text-ink-900">{a.warehouse_name}</p>
                      <p className="text-xs text-ink-500">{a.city}</p>
                    </td>
                    <td className="text-ink-600">{a.auditor_name ?? "—"}</td>
                    <td className="w-36">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                          <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-ink-500 tabular-nums">
                          {a.counted_count}/{a.items_count}
                        </span>
                      </div>
                    </td>
                    <td className={a.mismatch_count ? "font-semibold text-amber-700" : "text-ink-400"}>{a.mismatch_count || "—"}</td>
                    <td className={`font-semibold whitespace-nowrap tabular-nums ${a.variance_value < 0 ? "text-red-600" : a.variance_value > 0 ? "text-brand-700" : "text-ink-400"}`}>
                      {a.variance_value ? fmtMoney(a.variance_value) : "—"}
                    </td>
                    <td>
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="whitespace-nowrap text-ink-500">{fmtDate(a.created_at)}</td>
                  </tr>
                );
              })}
            </Table>
            <Pagination page={list.page} limit={list.data.limit} total={list.data.total} onChange={list.setPage} />
          </>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Yangi audit" description="Ombordagi joriy qoldiq auditga “kutilgan” miqdor sifatida yoziladi">
        {open && <NewAudit />}
      </Modal>
    </div>
  );
}

function NewAudit() {
  const router = useRouter();
  const [warehouse, setWarehouse] = useState<WarehouseOption | null>(null);
  const auditors = useApi<{ items: { id: number; full_name: string }[] }>("/users?role=auditor&status=active");
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    setSaving(true);
    try {
      const audit = await api<{ id: number }>("/audits", { method: "POST", json: { ...f, auditor_id: f.auditor_id || null, note: f.note || undefined } });
      router.push(`/dashboard/audits/${audit.id}`);
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Ombor">
        <WarehouseSelect params={{ active: "true" }} name="warehouse_id" required value={warehouse} onChange={setWarehouse} />
      </Field>
      <Field label="Auditor">
        <Select name="auditor_id" defaultValue="">
          <option value="">Men o&apos;zim</option>
          {auditors.data?.items.map((u) => (
            <option key={u.id} value={u.id}>
              {u.full_name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Izoh">
        <Textarea name="note" placeholder="Rejali / kutilmagan tekshiruv, sabab…" />
      </Field>
      {error && <Alert>{error}</Alert>}
      <Button type="submit" className="w-full" disabled={saving}>
        Auditni boshlash
      </Button>
    </form>
  );
}
