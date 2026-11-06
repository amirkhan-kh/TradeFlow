"use client";

import { CalendarCheck, HandCoins, Plus, TriangleAlert, Wallet } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useT } from "@/shared/i18n/I18nProvider";
import { fmtCompact, fmtDate, fmtMoney } from "@/shared/lib/format";
import { usePaged } from "@/shared/lib/usePaged";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Modal } from "@/shared/ui/Modal";
import { Chips, KpiCard, PageHeader, Pagination, SearchInput, Table } from "@/shared/ui/Page";
import { Empty, ErrorState, Loading } from "@/shared/ui/States";
import { METHODS, PaymentForm } from "./PaymentForm";

interface Payment {
  id: number;
  client_id: number;
  client_name: string;
  order_number: string | null;
  amount: number;
  method: string;
  user_name: string | null;
  created_at: string;
}
interface Summary {
  summary: { month_total: number; today_total: number; receivables: number; overlimit: number };
}

const TONE = { cash: "green", card: "blue", transfer: "violet", payme: "blue", click: "blue" } as const;

export function FinanceView() {
  const t = useT();
  const list = usePaged<Payment, Summary>("/payments");
  const [open, setOpen] = useState(false);
  const s = list.data?.summary;

  return (
    <div className="animate-rise">
      <PageHeader
        title={t("Moliya")}
        description={t("To'lovlar, kassa va debitorlik nazorati")}
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" /> {t("To'lov qabul qilish")}
          </Button>
        }
      />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label={t("Bugun undirildi")} value={s ? fmtCompact(s.today_total) : "…"} icon={CalendarCheck} />
        <KpiCard label={t("Shu oy undirildi")} value={s ? fmtCompact(s.month_total) : "…"} icon={Wallet} tone="navy" />
        <KpiCard label={t("Umumiy debitorlik")} value={s ? fmtCompact(s.receivables) : "…"} icon={HandCoins} tone="amber" />
        <KpiCard
          label={t("Limitdan oshganlar")}
          value={s?.overlimit ?? "…"}
          icon={TriangleAlert}
          tone="red"
          hint={
            <Link href="/dashboard/clients?status=overlimit" className="font-semibold text-brand-700 hover:underline">
              {t("ro'yxat →")}
            </Link>
          }
        />
      </div>
      <div className="card">
        <div className="flex flex-col gap-3 border-b border-ink-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <Chips options={[{ value: "", label: t("Barchasi") }, ...Object.entries(METHODS).map(([value, label]) => ({ value, label: t(label) }))]} value={list.status} onChange={list.setStatus} />
          <SearchInput value={list.q} onChange={list.setQ} placeholder={t("Mijoz bo'yicha…")} />
        </div>
        {list.error ? (
          <ErrorState message={list.error} onRetry={list.reload} />
        ) : list.loading && !list.data ? (
          <Loading />
        ) : !list.data?.items.length ? (
          <Empty title={t("To'lov topilmadi")} />
        ) : (
          <>
            <Table head={[t("Sana"), t("Mijoz"), t("Buyurtma"), t("Turi"), t("Summa"), t("Qabul qildi")]}>
              {list.data.items.map((p) => (
                <tr key={p.id}>
                  <td className="whitespace-nowrap text-ink-500">{fmtDate(p.created_at, true)}</td>
                  <td>
                    <Link href={`/dashboard/clients/${p.client_id}`} className="font-medium text-ink-900 hover:text-brand-700">
                      {p.client_name}
                    </Link>
                  </td>
                  <td className="text-ink-600">{p.order_number ?? "—"}</td>
                  <td>
                    <Badge tone={TONE[p.method as keyof typeof TONE]}>{METHODS[p.method] ? t(METHODS[p.method]) : p.method}</Badge>
                  </td>
                  <td className="font-bold text-brand-700 tabular-nums">+{fmtMoney(p.amount)}</td>
                  <td className="text-ink-500">{p.user_name ?? "—"}</td>
                </tr>
              ))}
            </Table>
            <Pagination page={list.page} limit={list.data.limit} total={list.data.total} onChange={list.setPage} />
          </>
        )}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title={t("To'lov qabul qilish")}>
        {open && (
          <PaymentForm
            onDone={() => {
              setOpen(false);
              list.reload();
            }}
          />
        )}
      </Modal>
    </div>
  );
}
