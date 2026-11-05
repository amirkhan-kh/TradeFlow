"use client";

import { CircleCheck } from "lucide-react";
import { useState } from "react";
import { api } from "@/shared/lib/api";
import { Button } from "@/shared/ui/Button";
import { Field, Input, Textarea } from "@/shared/ui/Field";
import { EASE, m } from "@/shared/ui/motion";
import { Alert } from "@/shared/ui/States";
import { useCopy } from "./SiteCopy";

export function DemoForm() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string>();
  const t = useCopy();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState("sending");
    setError(undefined);
    try {
      await api("/public/leads", { method: "POST", json: data });
      setState("done");
    } catch (err) {
      setError((err as Error).message);
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className="flex flex-col items-center gap-3 py-10 text-center">
        <m.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.1 }}>
          <CircleCheck className="size-14 text-brand-600" />
        </m.span>
        <p className="text-lg font-bold text-ink-900">{t("Rahmat! So'rovingiz qabul qilindi.")}</p>
        <p className="text-sm text-ink-600">{t("Mutaxassisimiz 1 ish soati ichida siz bilan bog'lanadi.")}</p>
      </m.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("Ismingiz")}>
          <Input name="name" required minLength={2} autoComplete="name" placeholder={t("Ism Familiya")} />
        </Field>
        <Field label={t("Telefon")}>
          <Input name="phone" required minLength={7} type="tel" autoComplete="tel" placeholder="+998 90 123 45 67" />
        </Field>
      </div>
      <Field label={t("Kompaniya")}>
        <Input name="company" autoComplete="organization" placeholder={t("Kompaniya nomi")} />
      </Field>
      <Field label={t("Izoh")}>
        <Textarea name="message" placeholder={t("Agentlar soni, omborlar soni, qiziqtirgan modullar…")} />
      </Field>
      {error && <Alert>{error}</Alert>}
      <Button type="submit" size="lg" className="w-full" disabled={state === "sending"}>
        {state === "sending" ? t("Yuborilmoqda…") : t("Demoga yozilish")}
      </Button>
      <p className="text-center text-xs text-ink-500">{t("Formani to'ldirib, shaxsiy ma'lumotlarni qayta ishlashga rozilik bildirasiz.")}</p>
    </form>
  );
}
