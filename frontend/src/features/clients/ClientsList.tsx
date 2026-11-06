"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { useT } from "@/shared/i18n/I18nProvider";
import { api } from "@/shared/lib/api";
import { currency, fmtDate, fmtMoney } from "@/shared/lib/format";
import { useApi } from "@/shared/lib/useApi";
import { usePaged } from "@/shared/lib/usePaged";
import { Button } from "@/shared/ui/Button";
import { Field, Input, Select } from "@/shared/ui/Field";
import { Modal } from "@/shared/ui/Modal";
import { Chips, PageHeader, Pagination, SearchInput, Table } from "@/shared/ui/Page";
import { Alert, Empty, ErrorState, Loading } from "@/shared/ui/States";

interface Client {
  id: number;
  name: string;
  owner_name: string | null;
  phone: string | null;
  region: string;
  segment: string;
  agent_name: string | null;
  credit_limit: number;
  balance: number;
  last_order_at: string | null;
}

const SEGMENT = { A: "bg-brand-600 text-white", B: "bg-brand-100 text-brand-800", C: "bg-ink-100 text-ink-600" } as Record<string, string>;

export function ClientsList({ initialStatus = "" }: { initialStatus?: string }) {
  const t = useT();
  const list = usePaged<Client>("/clients", initialStatus);
  const [open, setOpen] = useState(false);

  return (
    <div className="animate-rise">
      <PageHeader
        title={t("Mijozlar")}
        description={t("Savdo nuqtalari, segmentlar, kredit limiti va qarzdorlik")}
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" /> {t("Mijoz qo'shish")}
          </Button>
        }
      />
      <div className="card">
        <div className="flex flex-col gap-3 border-b border-ink-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <Chips
            options={[
              { value: "", label: t("Barchasi") },
              { value: "debt", label: t("Qarzdorlar") },
              { value: "overlimit", label: t("Limitdan oshgan") },
              { value: "A", label: t("A segment") },
              { value: "B", label: "B" },
              { value: "C", label: "C" },
            ]}
            value={list.status}
            onChange={list.setStatus}
          />
          <SearchInput value={list.q} onChange={list.setQ} placeholder={t("Nomi, telefon, hudud…")} />
        </div>
        {list.error ? (
          <ErrorState message={list.error} onRetry={list.reload} />
        ) : list.loading && !list.data ? (
          <Loading />
        ) : !list.data?.items.length ? (
          <Empty title={t("Mijoz topilmadi")} />
        ) : (
          <>
            <Table head={[t("Savdo nuqtasi"), t("Segment"), t("Hudud"), t("Agent"), t("Qarz / limit"), t("Oxirgi buyurtma")]}>
              {list.data.items.map((c) => {
                const usage = c.credit_limit ? (c.balance / c.credit_limit) * 100 : 0;
                return (
                  <tr key={c.id}>
                    <td>
                      <Link href={`/dashboard/clients/${c.id}`} className="font-semibold text-ink-900 hover:text-brand-700">
                        {c.name}
                      </Link>
                      <p className="text-xs text-ink-500">
                        {c.owner_name} · {c.phone}
                      </p>
                    </td>
                    <td>
                      <span className={`grid size-7 place-items-center rounded-lg text-xs font-extrabold ${SEGMENT[c.segment]}`}>{c.segment}</span>
                    </td>
                    <td className="text-ink-600">{c.region}</td>
                    <td className="text-ink-600">{c.agent_name ?? "—"}</td>
                    <td className="w-56">
                      <div className="flex justify-between text-xs">
                        <span className={`font-bold tabular-nums ${usage > 100 ? "text-red-600" : "text-ink-900"}`}>{fmtMoney(c.balance)}</span>
                        <span className="text-ink-400">{c.credit_limit ? `${usage.toFixed(0)}%` : "∞"}</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink-100">
                        <div className={`h-full rounded-full ${usage > 100 ? "bg-red-500" : usage > 75 ? "bg-amber-400" : "bg-brand-500"}`} style={{ width: `${Math.min(100, Math.max(0, usage))}%` }} />
                      </div>
                    </td>
                    <td className="whitespace-nowrap text-ink-500">{fmtDate(c.last_order_at)}</td>
                  </tr>
                );
              })}
            </Table>
            <Pagination page={list.page} limit={list.data.limit} total={list.data.total} onChange={list.setPage} />
          </>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={t("Yangi mijoz")} wide>
        {open && (
          <ClientForm
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

function ClientForm({ onDone }: { onDone: () => void }) {
  const t = useT();
  const agents = useApi<{ items: { id: number; full_name: string; region: string }[] }>("/users?role=agent&status=active");
  const form = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [looking, setLooking] = useState(false);

  async function lookup() {
    const el = form.current!.elements as unknown as Record<"inn" | "name" | "owner_name" | "address", HTMLInputElement>;
    setLooking(true);
    setError(undefined);
    try {
      const r = await api<{ name: string | null; director: string | null; address: string | null }>(`/clients/lookup/${el.inn.value.trim()}`);
      if (r.name) el.name.value = r.name;
      if (r.director && !el.owner_name.value) el.owner_name.value = r.director;
      if (r.address && !el.address.value) el.address.value = r.address;
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLooking(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    setSaving(true);
    try {
      await api("/clients", { method: "POST", json: { ...f, agent_id: f.agent_id || null } });
      onDone();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <form ref={form} onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label={t("INN (STIR)")} className="sm:col-span-2">
        <div className="flex gap-2">
          <Input name="inn" inputMode="numeric" pattern="\d{9}|\d{14}" placeholder={t("9 yoki 14 ta raqam")} />
          <Button variant="secondary" onClick={lookup} disabled={looking}>
            {t("Soliqdan to'ldirish")}
          </Button>
        </div>
      </Field>
      <Field label={t("Savdo nuqtasi nomi")}>
        <Input name="name" required />
      </Field>
      <Field label={t("Egasi")}>
        <Input name="owner_name" />
      </Field>
      <Field label={t("Telefon")}>
        <Input name="phone" type="tel" placeholder="+998 …" />
      </Field>
      <Field label={t("Hudud")}>
        <Input name="region" required placeholder={t("Toshkent")} />
      </Field>
      <Field label={t("Manzil")} className="sm:col-span-2">
        <Input name="address" />
      </Field>
      <Field label={t("Segment")}>
        <Select name="segment" defaultValue="B">
          <option value="A">{t("A — yirik")}</option>
          <option value="B">{t("B — o'rta")}</option>
          <option value="C">{t("C — kichik")}</option>
        </Select>
      </Field>
      <Field label={t("Kredit limiti, {cur}", { cur: currency() })}>
        <Input name="credit_limit" type="number" min={0} defaultValue={20000000} />
      </Field>
      <Field label={t("Savdo agenti")} className="sm:col-span-2">
        <Select name="agent_id" defaultValue="">
          <option value="">{t("Biriktirilmagan")}</option>
          {agents.data?.items.map((a) => (
            <option key={a.id} value={a.id}>
              {a.full_name} — {a.region}
            </option>
          ))}
        </Select>
      </Field>
      {error && (
        <div className="sm:col-span-2">
          <Alert>{error}</Alert>
        </div>
      )}
      <Button type="submit" className="sm:col-span-2" disabled={saving}>
        {t("Saqlash")}
      </Button>
    </form>
  );
}
