"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useT } from "@/shared/i18n/I18nProvider";
import type { MsgKey } from "@/shared/i18n/messages";
import { fmtDate, fmtMoney } from "@/shared/lib/format";
import { usePaged } from "@/shared/lib/usePaged";
import { StatusBadge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Modal } from "@/shared/ui/Modal";
import { Chips, PageHeader, Pagination, SearchInput, Table } from "@/shared/ui/Page";
import { Empty, ErrorState, Loading } from "@/shared/ui/States";
import { OrderForm } from "./OrderForm";

interface Order {
  id: number;
  number: string;
  status: string;
  total: number;
  discount_pct: number;
  created_at: string;
  client_name: string;
  region: string;
  agent_name: string | null;
  warehouse_name: string;
  items_count: number;
}

const STATUSES: { value: string; label: MsgKey }[] = [
  { value: "", label: "Barchasi" },
  { value: "new", label: "Yangi" },
  { value: "confirmed", label: "Tasdiqlangan" },
  { value: "shipped", label: "Yuklangan" },
  { value: "delivered", label: "Yetkazildi" },
  { value: "cancelled", label: "Bekor" },
];

export function OrdersList() {
  const t = useT();
  const list = usePaged<Order, { counts: Record<string, number> }>("/orders");
  const [open, setOpen] = useState(false);

  return (
    <div className="animate-rise">
      <PageHeader
        title={t("Buyurtmalar")}
        description={t("Buyurtma → tasdiqlash (qoldiq band qilinadi) → yuklash → yetkazish")}
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" /> {t("Yangi buyurtma")}
          </Button>
        }
      />
      <div className="card">
        <div className="flex flex-col gap-3 border-b border-ink-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <Chips options={STATUSES.map((s) => ({ ...s, label: t(s.label) }))} value={list.status} onChange={list.setStatus} counts={list.data?.counts} />
          <SearchInput value={list.q} onChange={list.setQ} placeholder={t("Raqam yoki mijoz…")} />
        </div>
        {list.error ? (
          <ErrorState message={list.error} onRetry={list.reload} />
        ) : list.loading && !list.data ? (
          <Loading />
        ) : !list.data?.items.length ? (
          <Empty title={t("Buyurtma topilmadi")} hint={t("Filtrni o'zgartiring yoki yangi buyurtma yarating")} />
        ) : (
          <>
            <Table head={[t("Raqam"), t("Mijoz"), t("Agent"), t("Ombor"), t("Pozitsiya"), t("Summa"), t("Holat"), t("Sana")]}>
              {list.data.items.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link href={`/dashboard/orders/${o.id}`} className="font-semibold text-brand-700 hover:underline">
                      {o.number}
                    </Link>
                  </td>
                  <td>
                    <p className="font-medium text-ink-900">{o.client_name}</p>
                    <p className="text-xs text-ink-500">{o.region}</p>
                  </td>
                  <td className="text-ink-600">{o.agent_name ?? "—"}</td>
                  <td className="text-ink-600">{o.warehouse_name}</td>
                  <td className="text-ink-600">{o.items_count}</td>
                  <td className="font-semibold whitespace-nowrap text-ink-900 tabular-nums">
                    {fmtMoney(o.total)}
                    {o.discount_pct > 0 && <span className="ml-1 text-xs text-brand-600">−{o.discount_pct}%</span>}
                  </td>
                  <td>
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="whitespace-nowrap text-ink-500">{fmtDate(o.created_at, true)}</td>
                </tr>
              ))}
            </Table>
            <Pagination page={list.page} limit={list.data.limit} total={list.data.total} onChange={list.setPage} />
          </>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={t("Yangi buyurtma")} description={t("Narxlar tovar kartochkasidan olinadi")} wide>
        <OrderForm
          onDone={() => {
            setOpen(false);
            list.reload();
          }}
        />
      </Modal>
    </div>
  );
}
