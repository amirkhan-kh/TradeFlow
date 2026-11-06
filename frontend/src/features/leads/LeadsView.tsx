"use client";

import { useState } from "react";
import { useT } from "@/shared/i18n/I18nProvider";
import type { MsgKey } from "@/shared/i18n/messages";
import { trData } from "@/shared/i18n/translate";
import { api } from "@/shared/lib/api";
import { fmtDate } from "@/shared/lib/format";
import { usePaged } from "@/shared/lib/usePaged";
import { StatusBadge } from "@/shared/ui/Badge";
import { Chips, PageHeader, Pagination, Table } from "@/shared/ui/Page";
import { Alert, Empty, ErrorState, Loading } from "@/shared/ui/States";

interface Lead {
  id: number;
  name: string;
  phone: string;
  company: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

const STATUSES: { value: string; label: MsgKey }[] = [
  { value: "new", label: "Yangi" },
  { value: "contacted", label: "Bog'lanildi" },
  { value: "won", label: "Mijozga aylandi" },
  { value: "lost", label: "Yo'qotildi" },
];

export function LeadsView() {
  const t = useT();
  const list = usePaged<Lead>("/leads");
  const [picked, setPicked] = useState<Record<number, string>>({});
  const [error, setError] = useState<string>();

  async function setStatus(id: number, status: string) {
    setError(undefined);
    setPicked((p) => ({ ...p, [id]: status }));
    try {
      await api(`/leads/${id}`, { method: "PATCH", json: { status } });
      list.reload();
    } catch (e) {
      setError((e as Error).message);
      setPicked((p) => {
        const rest = { ...p };
        delete rest[id];
        return rest;
      });
    }
  }

  return (
    <div className="animate-rise">
      <PageHeader title={t("Lidlar")} description={t("Saytdagi “Demoga yozilish” formasi orqali kelgan so'rovlar")} />
      <div className="card">
        <div className="border-b border-ink-100 p-4">
          <Chips options={[{ value: "", label: t("Barchasi") }, ...STATUSES.map((s) => ({ ...s, label: t(s.label) }))]} value={list.status} onChange={list.setStatus} />
          {error && (
            <div className="mt-3">
              <Alert>{error}</Alert>
            </div>
          )}
        </div>
        {list.error ? (
          <ErrorState message={list.error} onRetry={list.reload} />
        ) : list.loading && !list.data ? (
          <Loading />
        ) : !list.data?.items.length ? (
          <Empty title={t("Lid yo'q")} hint={t("Landing sahifadagi forma to'ldirilganda shu yerda paydo bo'ladi")} />
        ) : (
          <>
            <Table head={[t("Sana"), t("Ism"), t("Kompaniya"), t("Telefon"), t("Xabar"), t("Holat"), t("O'zgartirish")]}>
              {list.data.items.map((l) => (
                <tr key={l.id}>
                  <td className="whitespace-nowrap text-ink-500">{fmtDate(l.created_at, true)}</td>
                  <td className="font-semibold text-ink-900">{trData(l.name)}</td>
                  <td className="text-ink-600">{l.company ?? "—"}</td>
                  <td>
                    <a href={`tel:${l.phone.replace(/\s/g, "")}`} className="text-brand-700 hover:underline">
                      {l.phone}
                    </a>
                  </td>
                  <td className="max-w-xs truncate text-ink-500" title={trData(l.message)}>
                    {trData(l.message) || "—"}
                  </td>
                  <td>
                    <StatusBadge status={l.status} />
                  </td>
                  <td>
                    <select value={picked[l.id] ?? l.status} onChange={(e) => setStatus(l.id, e.target.value)} className="input h-8 w-40 py-0 text-xs" aria-label={t("Holat")}>
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {t(s.label)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </Table>
            <Pagination page={list.page} limit={list.data.limit} total={list.data.total} onChange={list.setPage} />
          </>
        )}
      </div>
    </div>
  );
}
