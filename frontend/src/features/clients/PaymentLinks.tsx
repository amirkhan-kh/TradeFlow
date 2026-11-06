"use client";

import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useT } from "@/shared/i18n/I18nProvider";
import { api } from "@/shared/lib/api";
import { currency } from "@/shared/lib/format";
import { Button } from "@/shared/ui/Button";
import { Field, Input } from "@/shared/ui/Field";
import { Alert } from "@/shared/ui/States";

interface Link {
  provider: "payme" | "click";
  name: string;
  url: string;
}

export function PaymentLinks({ clientId, debt }: { clientId: number; debt: number }) {
  const t = useT();
  const [links, setLinks] = useState<Link[]>();
  const [error, setError] = useState<string>();
  const [copied, setCopied] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const q = new URLSearchParams({ client_id: String(clientId), amount: f.amount });
    if (f.order_number) q.set("order_number", f.order_number.trim().toUpperCase());
    setLoading(true);
    setError(undefined);
    try {
      setLinks((await api<{ items: Link[] }>(`/payments/links?${q}`)).items);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function copy(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(url);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <Field label={t("Summa, {cur}", { cur: currency() })}>
          <Input name="amount" type="number" min={1000} required defaultValue={debt > 0 ? Math.round(debt) : undefined} />
        </Field>
        <Field label={t("Buyurtma raqami (ixtiyoriy)")}>
          <Input name="order_number" placeholder="TF-000123" pattern="[Tt][Ff]-\d+" />
        </Field>
        <Button type="submit" className="sm:col-span-2" disabled={loading}>
          {t("Havola yaratish")}
        </Button>
      </form>
      {error && <Alert>{error}</Alert>}
      {links && !links.length && <Alert>{t("Payme yoki Click integratsiyasi ulanmagan — Sozlamalar → Integratsiyalar.")}</Alert>}
      {links?.map((l) => (
        <div key={l.url} className="flex items-center gap-2 rounded-xl border border-ink-100 p-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-ink-900">{l.name}</p>
            <p className="truncate text-xs text-ink-500">{l.url}</p>
          </div>
          <Button variant="ghost" aria-label={t("{name} havolasini nusxalash", { name: l.name })} onClick={() => copy(l.url)}>
            {copied === l.url ? <Check className="size-4" /> : <Copy className="size-4" />}
          </Button>
          <a href={l.url} target="_blank" rel="noopener noreferrer" aria-label={t("{name} havolasini ochish", { name: l.name })} className="rounded-lg p-2 text-ink-500 hover:bg-ink-50 hover:text-brand-700">
            <ExternalLink className="size-4" />
          </a>
        </div>
      ))}
    </div>
  );
}
