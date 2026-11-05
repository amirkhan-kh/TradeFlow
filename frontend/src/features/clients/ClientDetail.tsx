"use client";

import { ChevronLeft, FileText, HandCoins, Link2, MapPin, Phone, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { fmtDate, fmtMoney } from "@/shared/lib/format";
import { useApi } from "@/shared/lib/useApi";
import { Button } from "@/shared/ui/Button";
import { Modal } from "@/shared/ui/Modal";
import { Table } from "@/shared/ui/Page";
import { Empty, ErrorState, Loading } from "@/shared/ui/States";
import { METHODS, PaymentForm } from "../finance/PaymentForm";
import { PaymentLinks } from "./PaymentLinks";

interface ClientFull {
  id: number;
  name: string;
  owner_name: string | null;
  phone: string | null;
  region: string;
  address: string | null;
  inn: string | null;
  segment: string;
  agent_name: string | null;
  credit_limit: number;
  balance: number;
  ledger: { kind: "order" | "payment"; ref: string; debit: number; credit: number; at: string }[];
}

export function ClientDetail({ id }: { id: string }) {
  const { data: c, error, loading, reload } = useApi<ClientFull>(`/clients/${id}`);
  const [pay, setPay] = useState(false);
  const [link, setLink] = useState(false);

  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (loading && !c) return <Loading />;
  if (!c) return null;

  const debit = c.ledger.reduce((s, l) => s + l.debit, 0);
  const credit = c.ledger.reduce((s, l) => s + l.credit, 0);
  const usage = c.credit_limit ? (c.balance / c.credit_limit) * 100 : 0;

  return (
    <div className="animate-rise space-y-6">
      <div>
        <Link href="/dashboard/clients" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brand-700">
          <ChevronLeft className="size-4" /> Mijozlar
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-extrabold text-ink-900">{c.name}</h1>
          <span className="rounded-lg bg-brand-100 px-2 py-0.5 text-xs font-extrabold text-brand-800">{c.segment} segment</span>
          <Button variant="secondary" className="ml-auto" onClick={() => setLink(true)}>
            <Link2 className="size-4" /> Onlayn to&apos;lov havolasi
          </Button>
          <Button onClick={() => setPay(true)}>
            <HandCoins className="size-4" /> To&apos;lov qabul qilish
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card space-y-3 p-5 text-sm">
          <p className="flex items-center gap-2 text-ink-700">
            <UserRound className="size-4 text-ink-400" /> {c.owner_name ?? "—"}
          </p>
          <p className="flex items-center gap-2 text-ink-700">
            <Phone className="size-4 text-ink-400" /> {c.phone ?? "—"}
          </p>
          <p className="flex items-center gap-2 text-ink-700">
            <MapPin className="size-4 text-ink-400" /> {c.address ?? c.region}
          </p>
          <p className="flex items-center gap-2 text-ink-700">
            <FileText className="size-4 text-ink-400" /> INN: {c.inn ?? "—"}
          </p>
          <p className="text-ink-500">
            Agent: <b className="text-ink-800">{c.agent_name ?? "—"}</b>
          </p>
        </section>
        <section className="card p-5 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-ink-500">Joriy qarz</p>
              <p className={`mt-1 text-2xl font-extrabold tabular-nums ${c.balance > c.credit_limit && c.credit_limit ? "text-red-600" : "text-ink-900"}`}>{fmtMoney(c.balance)}</p>
            </div>
            <div>
              <p className="text-sm text-ink-500">Kredit limiti</p>
              <p className="mt-1 text-2xl font-extrabold text-ink-900 tabular-nums">{c.credit_limit ? fmtMoney(c.credit_limit) : "Cheksiz"}</p>
            </div>
            <div>
              <p className="text-sm text-ink-500">Limitdan foydalanish</p>
              <p className="mt-1 text-2xl font-extrabold text-ink-900">{c.credit_limit ? `${usage.toFixed(0)}%` : "—"}</p>
            </div>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-ink-100">
            <div className={`h-full rounded-full ${usage > 100 ? "bg-red-500" : usage > 75 ? "bg-amber-400" : "bg-brand-500"}`} style={{ width: `${Math.min(100, Math.max(0, usage))}%` }} />
          </div>
        </section>
      </div>

      <section className="card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 px-5 py-4">
          <h2 className="font-bold">Akt sverka (o&apos;zaro hisob-kitob)</h2>
          <p className="text-sm text-ink-500">
            Yuklangan: <b className="text-ink-900">{fmtMoney(debit)}</b> · To&apos;langan: <b className="text-brand-700">{fmtMoney(credit)}</b>
          </p>
        </div>
        {c.ledger.length === 0 ? (
          <Empty title="Operatsiyalar yo'q" />
        ) : (
          <Table head={["Sana", "Operatsiya", "Hujjat", "Debet (yuklandi)", "Kredit (to'landi)"]}>
            {c.ledger.map((l, i) => (
              <tr key={i}>
                <td className="whitespace-nowrap text-ink-500">{fmtDate(l.at, true)}</td>
                <td className="font-medium">{l.kind === "order" ? "Yuklab berildi" : "To'lov"}</td>
                <td className="text-ink-600">{l.kind === "payment" ? METHODS[l.ref] : l.ref}</td>
                <td className="font-semibold tabular-nums">{l.debit ? fmtMoney(l.debit) : ""}</td>
                <td className="font-semibold text-brand-700 tabular-nums">{l.credit ? fmtMoney(l.credit) : ""}</td>
              </tr>
            ))}
          </Table>
        )}
      </section>

      <Modal open={pay} onClose={() => setPay(false)} title="To'lov qabul qilish" description={`${c.name} — joriy qarz ${fmtMoney(c.balance)}`}>
        {pay && (
          <PaymentForm
            clientId={c.id}
            onDone={() => {
              setPay(false);
              reload();
            }}
          />
        )}
      </Modal>
      <Modal open={link} onClose={() => setLink(false)} title="Onlayn to'lov havolasi" description="Payme / Click havolasini mijozga SMS yoki Telegram orqali yuboring">
        {link && <PaymentLinks clientId={c.id} debt={c.balance} />}
      </Modal>
    </div>
  );
}
